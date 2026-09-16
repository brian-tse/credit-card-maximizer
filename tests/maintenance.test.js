const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { validateCatalog } = require('../scripts/validate-catalog');
const cards = require('../data/cards');
const sourceReview = import('../scripts/review-data.mjs');
const production = import('../scripts/verify-production.mjs');
const fixture = name => fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8');

test('issuer fixtures produce explicit before/after evidence, with tracking scripts excluded', async () => {
  const { compareSourceHtml, pageText } = await sourceReview;
  const baseline = compareSourceHtml(fixture('issuer-before.html'), {}, '2026-09-14');
  assert.equal(baseline.status, 'baseline-created');
  const trackingOnly = compareSourceHtml(fixture('issuer-before.html').replace('A changing tracking value', 'Anything else'), baseline);
  assert.equal(trackingOnly.status, 'unchanged-page');
  const changed = compareSourceHtml(fixture('issuer-after.html'), baseline, '2026-09-15');
  assert.equal(changed.status, 'changed-review-needed');
  assert.match(changed.beforeEvidence.join(' '), /\$695/);
  assert.match(changed.afterEvidence.join(' '), /\$895/);
  assert.match(changed.afterEvidence.join(' '), /guests pay \$35/);
  assert.match(pageText(fixture('issuer-after.html')), /& enrollment required/);
  assert.doesNotMatch(changed.text, /campaign|tracking value/);
});

test('review run checks nested sources, reports upcoming cohort changes and preserves baseline through outages', async t => {
  const { runReview, collectSourceUrls } = await sourceReview;
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cardmax-review-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const data = [{ id: 'example', name: 'Example Card', verificationStatus: 'needs-review', sourceUrl: 'https://www.americanexpress.com/card', verifiedAt: null, credits: [{ id: 'credit', name: 'Annual credit', effectiveUntil: '2026-10-15', sourceUrl: 'https://www.thecenturionlounge.com/info/access/' }], perks: [{ sourceUrl: 'https://capitalonetravel.com/lounge-access-guide' }], transferPartners: [{ name: 'Hyatt', terms: [{ effectiveFrom: '2026-10-01', eligibility: 'Earlier applicants' }] }] }];
  const original = JSON.stringify(data), requested = [];
  let html = fixture('issuer-before.html');
  const fetchImpl = async url => { requested.push(url); return new Response(html); };
  await runReview({ cards: data, online: true, directory, today: '2026-09-14', fetchImpl });
  html = fixture('issuer-after.html');
  const report = await runReview({ cards: data, online: true, directory, today: '2026-09-15', fetchImpl });
  assert.equal(collectSourceUrls(data).length, 3);
  assert.equal(requested.length, 6);
  assert.equal(report.cards[0].sourceCheck, 'changed-review-needed');
  const markdown = fs.readFileSync(path.join(directory, 'reports/data-review.md'), 'utf8');
  assert.match(markdown, /Before \(2026-09-14\)/);
  assert.match(markdown, /\$695/); assert.match(markdown, /\$895/);
  assert.match(markdown, /starts 2026-10-01/); assert.match(markdown, /expires 2026-10-15/);
  assert.match(markdown, /Earlier applicants/);
  const cached = fs.readFileSync(path.join(directory, '.cache/issuer-sources.json'), 'utf8');
  const unavailable = await runReview({ cards: data, online: true, directory, today: '2026-09-16', fetchImpl: async () => new Response('', { status: 503 }) });
  assert.equal(unavailable.cards[0].sourceCheck, 'unavailable');
  assert.match(fs.readFileSync(path.join(directory, 'reports/data-review.md'), 'utf8'), /unavailable \(503\)/);
  assert.equal(fs.readFileSync(path.join(directory, '.cache/issuer-sources.json'), 'utf8'), cached);
  assert.equal(JSON.stringify(data), original, 'Source monitor must never mutate verified facts');
});

test('unreviewed redirect hosts are reported without fetching them', async () => {
  const { inspectSource, buildReport } = await sourceReview;
  const calls = [];
  const result = await inspectSource('https://www.chase.com/card', {}, { fetchImpl: async url => {
    calls.push(url); return new Response(null, { status: 302, headers: { Location: 'https://unexpected.example/redirect' } });
  } });
  assert.equal(result.status, 'manual-review');
  assert.equal(calls.length, 1);
  assert.match(buildReport([], { 'https://www.chase.com/card': result }, '2026-09-15').markdown, /Redirect destination/);
});

test('catalog validation rejects unsupported periods and impossible dates at any metadata depth', () => {
  const fresh = () => structuredClone(cards[0]);
  assert.equal(validateCatalog([fresh()]).cards, 1);
  let card = fresh(); card.credits[0].frequency = 'quarterlies';
  assert.throws(() => validateCatalog([card]), /Unsupported frequency/);
  card = fresh(); card.credits[0].resetPeriod = 'whenever';
  assert.throws(() => validateCatalog([card]), /Unsupported reset period/);
  card = fresh(); card.credits[0].effectiveFrom = '2026-02-30';
  assert.throws(() => validateCatalog([card]), /Invalid effectiveFrom/);
  card = fresh(); card.transferPartners[0].terms = [{ effectiveFrom: '2026-13-01' }];
  assert.throws(() => validateCatalog([card]), /Invalid effectiveFrom/);
  card = fresh(); card.sourceUrl = 'https://';
  assert.throws(() => validateCatalog([card]), /issuer source/);
});

test('production privacy check rejects the original email field and external forwarding code', async () => {
  const { verifyCatalogPrivacy } = await production;
  const catalog = fs.readFileSync(path.join(__dirname, '../pages/cards.html'), 'utf8');
  assert.doesNotThrow(() => verifyCatalogPrivacy(catalog));
  assert.throws(() => verifyCatalogPrivacy(catalog.replace('</form>', '<input type="email" name="email"></form>')), /Legacy email input/);
  assert.throws(() => verifyCatalogPrivacy(catalog + '<script>fetch("https://api.web3forms.com/submit")</script>'), /email forwarding/);
});

test('production version check retries stale CDN content and stops within its two-minute budget', async () => {
  const { waitForVersion } = await production;
  let time = 0, count = 0;
  const opts = { base: 'https://cardmax.cc', expectedCommit: 'new', now: () => time, sleep: async ms => { time += ms; } };
  const version = await waitForVersion({ ...opts, fetchImpl: async () => Response.json({ commit: ++count === 1 ? 'old' : 'new' }) });
  assert.equal(version.commit, 'new'); assert.equal(count, 2); assert.equal(time, 1000);
  time = 0;
  await assert.rejects(waitForVersion({ ...opts, fetchImpl: async () => new Response('', { status: 503 }) }), /within two minutes/);
  assert.equal(time, 120000);
});


test('PDF and non-text issuer sources require manual review without decoding their body', async () => {
  const { inspectSource, buildReport } = await sourceReview;
  for (const contentType of ['application/pdf', 'image/png', 'application/octet-stream']) {
    let bodyRead = false;
    const result = await inspectSource('https://www.americanexpress.com/terms', {}, {
      fetchImpl: async () => ({ ok: true, status: 200, headers: new Headers({ 'Content-Type': contentType }), text: async () => { bodyRead = true; throw new Error('Binary body must not be decoded'); } })
    });
    assert.equal(result.status, 'manual-review');
    assert.equal(bodyRead, false);
    assert.equal(result.hash, undefined);
    if (contentType === 'application/pdf') assert.match(buildReport([], { 'https://www.americanexpress.com/terms': result }).markdown, /PDF source requires a document read/);
  }
});
