const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const model = require('../js/card-model');
const source = fs.readFileSync(path.join(__dirname, '../data/cards.js'), 'utf8');
const cards = vm.runInNewContext(source + '\nCARDS_DATABASE;');

test('Venture X cash cap excludes anniversary points and annualizes the four-year credit', () => {
  const card = cards.find(card => card.id === 'capital-one-venture-x');
  assert.ok(card, 'Venture X exists');
  assert.equal(model.annualCashValue(card), 330);
  assert.equal(model.annualCashValue(card) - card.annualFee, -65);
  assert.equal(model.formatCredit(card.credits.find(credit => credit.unit === 'points')), '10,000 pts');
});

test('certificates, nights, visits and points are never cash', () => {
  for (const unit of ['points', 'nights', 'certificates', 'visits', 'percent', 'unknown']) {
    assert.equal(model.annualCashValue({ amount: 10000, unit, frequency: 'annual' }), 0);
  }
  assert.equal(model.formatCredit({ amount: 1, unit: 'certificates' }), '1 certificate');
  assert.equal(model.formatCredit({ amount: 2, unit: 'nights' }), '2 nights');
  assert.equal(model.annualCashValue({ amount: 100, type: 'hotel', unit: 'USD', frequency: 'annual' }), 100);
});

test('monthly/quarterly amounts are annual caps and per-use benefits have no assumed annual value', () => {
  assert.equal(model.annualCashValue({ amount: 120, unit: 'USD', frequency: 'monthly', monthlyAmount: 10 }), 120);
  assert.equal(model.annualCashValue({ amount: 400, unit: 'USD', frequency: 'quarterly', quarterlyAmount: 100 }), 400);
  assert.equal(model.annualCashValue({ amount: 120, unit: 'USD', frequency: 'every 4.5 years' }), 120 / 4.5);
  assert.equal(model.annualCashValue({ amount: 100, unit: 'USD', frequency: 'per stay' }), 0);
  assert.equal(model.annualCashValue({ amount: 100, unit: 'USD', frequency: 'every 0 years' }), 0);
});

test('out-of-period benefits are excluded from current annualized totals', () => {
  const now = new Date('2026-09-15T12:00:00Z');
  assert.equal(model.annualCashValue({ amount: 100, unit: 'USD', frequency: 'annual', effectiveUntil: '2026-08-01' }, now), 0);
  assert.equal(model.annualCashValue({ amount: 100, unit: 'USD', frequency: 'annual', effectiveFrom: '2026-10-01' }, now), 0);
});

test('saved IDs migrate aliases, deduplicate, and reject broken null or unknown selections', () => {
  assert.deepEqual(model.normalizeCardIds([null, '', 'old', 'new', 'missing', 'old'], [{ id: 'new' }], { old: 'new' }), ['new']);
});

test('partial review and legacy cohort conditions remain visible', () => {
  assert.match(model.verificationText({ reviewedAt: '2026-09-15', verifiedAt: null }), /Partially reviewed/);
  assert.match(model.verificationText({ verifiedAt: '2026-01-01' }, new Date('2026-09-15')), /overdue/);
  assert.match(model.termsHtml({ terms: [{ ratio: '1:1', eligibility: 'Applied before June 15', effectiveUntil: '2026-09-30' }] }), /Applied before June 15/);
});

test('a holder can enter a zero or legacy annual fee without changing issuer comparisons', () => {
  const card = { id: 'example', annualFee: 895 };
  assert.equal(model.annualFeeForCard(card, { example: 695 }), 695);
  assert.equal(model.annualFeeForCard(card, { example: 0 }), 0);
  assert.equal(model.annualFeeForCard(card, { example: -1 }), 895);
  assert.equal(model.annualFeeForCard(card, { example: 'invalid' }), 895);
  assert.equal(card.annualFee, 895);
});

test('every catalog header uses a text color above normal-text contrast threshold', () => {
  const luminance = hex => {
    const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  for (const card of cards) {
    const levels = [luminance(card.color), luminance(model.contrastText(card.color))].sort((a, b) => b - a);
    assert.ok((levels[0] + .05) / (levels[1] + .05) >= 4.5, card.name);
  }
});

test('verification labels use familiar terms rather than schema field names', () => {
  const html = model.statusHtml({ name: 'Example', sourceUrl: 'https://www.chase.com/card', reviewedAt: '2026-09-15', verifiedFields: ['annualFee', 'perks.lounge-access', 'transferPartners.Hyatt'] });
  assert.match(html, /Annual fee, Lounge access, Hyatt transfers/);
  assert.doesNotMatch(html, /annualFee|perks\.lounge/);
});

test('restricted rewards and unresolved or spend-gated credits cannot inflate annual cash totals', () => {
  const credit = { amount: 120, unit: 'USD', frequency: 'annual' };
  for (const flags of [{ conditional: true }, { annualValueExcluded: true }, { trackingEnabled: false }, { valuationEnabled: false }, { verificationStatus: 'needs-review' }]) {
    assert.equal(model.annualCashValue({ ...credit, ...flags }), 0);
  }
  for (const unit of ['Bilt Cash', 'voucher', 'crypto']) assert.equal(model.annualCashValue({ ...credit, unit }), 0);
  assert.equal(model.formatCredit({ amount: 200, unit: 'Bilt Cash' }), '$200 Bilt Cash');
  assert.equal(model.periodLabel({ amount: 12, quarterlyAmount: 3, unit: 'visits', frequency: 'quarterly' }), '3 visits/quarter; annual cap shown');
});

test('mandatory membership costs count and unknown fees do not become zero', () => {
  const card = { id: 'membership', annualFee: 0, requiredAnnualMembershipFee: 50 };
  assert.equal(model.annualCostForCard(card), 50);
  assert.match(model.feeLabel(card), /\$50 required membership/);
  card.annualFeeStatus = 'unverified';
  assert.equal(model.annualCostForCard(card), null);
  assert.equal(model.annualCostForCard(card, { membership: 20 }), 70);
  assert.equal(model.money(null), 'Not verified');
});

test('scheduled earning changes take effect at the date boundary without selecting an account cohort', () => {
  const card = { earning: { base: 1, categories: [{ category: 'Dining', multiplier: 3, terms: [
    { multiplier: 3, effectiveUntil: '2026-12-31' }, { multiplier: 2, effectiveFrom: '2027-01-01' }
  ] }] } };
  assert.equal(model.earningCategories(card, new Date('2026-12-31T12:00:00Z'))[0].multiplier, 3);
  assert.equal(model.earningCategories(card, new Date('2027-01-01T12:00:00Z'))[0].multiplier, 2);
  card.earning.categories[0].terms[1].cohort = 'Some accounts only';
  assert.equal(model.earningCategories(card, new Date('2027-01-01T12:00:00Z'))[0].multiplier, 3);
  assert.equal(model.transferLabel({ ratio: '1:1', terms: [{ ratio: '4:3' }] }), 'Varies by account/date');
});

test('benefit expiry follows the same local calendar date as the tracker', () => {
  const { execFileSync } = require('node:child_process');
  const script = `const model = require(${JSON.stringify(require.resolve('../js/card-model'))}); const benefit = {effectiveUntil:'2027-09-30'}; console.log(JSON.stringify([model.activeBenefit(benefit,new Date('2027-10-01T03:00:00Z')),model.activeBenefit(benefit,new Date('2027-10-01T07:00:00Z'))]));`;
  const result = execFileSync(process.execPath, ['-e', script], { encoding: 'utf8', env: { ...process.env, TZ: 'America/Los_Angeles' } });
  assert.deepEqual(JSON.parse(result), [true, false]);
});
