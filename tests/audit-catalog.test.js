const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { validateCatalog, validSource } = require('../scripts/validate-catalog');

const root = path.join(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const amex = read('data/reviewed/amex-cards.json');
const byId = Object.fromEntries(amex.map(card => [card.id, card]));
const credit = (id, benefit) => byId[id].credits.find(item => item.id === benefit);
const shardFiles = ['amex', 'banks', 'chase', 'other'].map(group => `data/reviewed/${group}-cards.json`);
const resolutionFiles = ['amex', 'banks', 'chase', 'other'].map(group => `docs/audit-resolution-${group}.json`);

test('Amex corrections retain all published card and benefit IDs, including removed benefit history', () => {
  assert.equal(amex.length, 23);
  validateCatalog(amex);
  const manifest = read('docs/catalog-id-manifest.json');
  for (const original of manifest.filter(card => byId[card.id])) {
    const current = byId[original.id];
    for (const [group, retired] of [['credits', 'retiredBenefits'], ['perks', 'retiredPerks']]) {
      const ids = new Set([...current[group], ...(current[retired] || [])].map(item => item.id));
      for (const id of original[group]) assert.ok(ids.has(id), `${current.id}/${group}/${id}`);
    }
  }
  assert.ok(!credit('hilton-honors-business', 'free-weekend-night'));
  assert.equal(byId['hilton-honors-business'].retiredBenefits.find(item => item.id === 'free-weekend-night').trackingEnabled, false);
  assert.equal(byId['amex-gold'].perks.some(item => item.id === 'return-protection'), false);
  assert.equal(byId['amex-business-gold'].perks.some(item => item.id === '25-points-rebate'), false);
});

test('Amex revised earning rules preserve actual category caps and base rates', () => {
  assert.equal(byId['delta-skymiles-platinum-business'].earning.base, 1);
  assert.equal(byId['delta-skymiles-platinum-business'].earning.categories.find(item => item.category === 'Hotels').multiplier, 3);
  assert.deepEqual(byId['amex-business-green'].earning.categories.map(item => item.multiplier), [2]);
  assert.match(byId['amex-business-green'].earning.categories[0].category, /Amex Travel/);
  const gold = byId['amex-business-gold'].earning.categories[0];
  assert.equal(gold.cap.amount, 150000);
  assert.equal(gold.selectionPeriod, 'billing-cycle');
  assert.match(gold.description, /transit.*wireless/);
  assert.equal(byId['amex-gold'].earning.categories.find(item => item.category === 'Restaurants').cap.amount, 50000);
  assert.equal(byId['hilton-honors-business'].earning.categories.find(item => item.multiplier === 5).cap.amount, 100000);
});

test('credit period caps and conditions are structured instead of implying unconditional annual cash', () => {
  assert.equal(credit('amex-business-gold', 'flexible-credit').monthlyAmount, 20);
  assert.equal(credit('amex-business-gold', 'flexible-credit').amount, 240);
  assert.ok(credit('amex-business-gold', 'flexible-credit').terms.some(item => item.effectiveUntil === '2026-10-01'));
  assert.equal(credit('hilton-honors-aspire', 'hilton-resort-credit').semiannualAmount, 200);
  assert.equal(credit('hilton-honors-aspire', 'airline-fee-credit').quarterlyAmount, 50);
  assert.equal(credit('hilton-honors-surpass', 'hilton-credit').quarterlyAmount, 50);
  assert.equal(credit('hilton-honors-business', 'hilton-credit').quarterlyAmount, 60);
  for (const card of amex) for (const item of card.credits.filter(item => item.spendRequirement)) {
    assert.equal(item.conditional, true, `${card.id}/${item.id}`);
    assert.equal(item.annualValueExcluded, true, `${card.id}/${item.id}`);
  }
  assert.equal(credit('amex-business-platinum', 'one-ap-credit').spendRequirement.benefitYearOffset, 1);
  assert.equal(credit('amex-business-platinum', 'amex-travel-flight-spend-credit').amount, 1200);
});

test('airport-security alternatives cannot create an incorrect four-year TSA reminder', () => {
  const benefits = amex.flatMap(card => card.credits.filter(item => item.id === 'global-entry-tsa-precheck'));
  assert.equal(benefits.length, 7);
  for (const item of benefits) {
    assert.equal(item.trackingEnabled, false);
    assert.equal(item.annualValueExcluded, true);
    assert.equal(item.choiceRequired, true);
    assert.equal(item.alternatives.find(choice => choice.id === 'global-entry').frequency, 'every 4 years');
    assert.equal(item.alternatives.find(choice => choice.id === 'tsa-precheck').frequency, 'every 4.5 years');
  }
});

test('Membership Rewards transfers use current ratios and partners across all seven eligible cards', () => {
  const eligible = amex.filter(card => card.rewardCurrency === 'Membership Rewards');
  assert.equal(eligible.length, 7);
  for (const card of eligible) {
    assert.equal(card.transferPartners.length, 20);
    const partners = Object.fromEntries(card.transferPartners.map(item => [item.name, item.ratio]));
    assert.equal(partners.Aeromexico, '1:1.6');
    assert.equal(partners['Cathay Pacific'], '5:4');
    assert.equal(partners['Aer Lingus'], '1:1');
    assert.equal(partners['The Leading Hotels of the World'], '4:1');
    assert.equal(partners['El Al'], undefined);
    assert.equal(partners['TAP Portugal'], undefined);
  }
});

test('new Amex products have sources and unverified welcome offers remain hidden', () => {
  for (const card of amex) {
    assert.equal(card.verifiedAt, null);
    assert.equal(card.verificationStatus, 'partially-verified');
    assert.equal(card.signUpBonus.offerStatus, 'unverified');
    assert.ok(card.fieldSources && Object.keys(card.fieldSources).length);
    for (const item of [...card.credits, ...card.perks]) assert.ok(validSource(item.sourceUrl), `${card.id}/${item.id}`);
  }
  for (const id of ['amex-blue-cash-everyday', 'amex-hilton-honors', 'amex-graphite-business-cash-unlimited']) assert.equal(byId[id].signUpBonus.amount, undefined);
  assert.equal(byId['amex-blue-cash-everyday'].rewardCurrency, 'cashback');
  assert.equal(byId['amex-graphite-business-cash-unlimited'].earning.base, 2);
  assert.equal(byId['amex-green'].annualFeeStatus, 'unverified');
  assert.equal(byId['amex-green'].applicationStatus, 'unavailable');
});

test('validator accepts restricted reward units and explicitly unresolved rates', () => {
  const fixture = structuredClone(byId['amex-blue-cash-everyday']);
  for (const unit of ['Bilt Cash', 'voucher', 'crypto']) {
    fixture.credits[0].unit = unit;
    assert.doesNotThrow(() => validateCatalog([fixture]));
  }
  fixture.earning.categories[0].multiplier = null;
  fixture.earning.categories[0].valuationEnabled = false;
  assert.doesNotThrow(() => validateCatalog([fixture]));
  delete fixture.earning.categories[0].valuationEnabled;
  fixture.earning.categories[0].verificationStatus = 'needs-review';
  assert.doesNotThrow(() => validateCatalog([fixture]));
  fixture.earning.categories[0].valuationEnabled = true;
  assert.throws(() => validateCatalog([fixture]), /Null earning rate/);
});

test('validator rejects missing rates, misleading flag types and non-finite or absurd amounts', () => {
  const invalid = mutate => { const fixture = structuredClone(byId['amex-blue-cash-everyday']); mutate(fixture); assert.throws(() => validateCatalog([fixture])); };
  invalid(card => { delete card.earning.categories[0].multiplier; });
  invalid(card => { card.earning.categories[0].multiplier = null; });
  invalid(card => { card.credits[0].trackingEnabled = 'false'; });
  invalid(card => { card.credits[0].amount = Infinity; });
  invalid(card => { card.credits[0].amount = 1e100; });
  invalid(card => { card.credits[0].amount = -1; });
  invalid(card => { card.credits[0].unit = 'percent'; card.credits[0].amount = 101; });
  invalid(card => { card.credits[0].frequency = 'every 999999999999999 years'; card.credits[0].resetPeriod = 'rolling'; });
  invalid(card => { card.credits[0].monthlyAmount = card.credits[0].amount + 1; });
  invalid(card => { card.credits[0].verificationStatus = 'needs-review'; });
});

test('all issuer shards form 93 unique cards and retain every published benefit ID', () => {
  for (const file of shardFiles) assert.ok(fs.existsSync(path.join(root, file)), `Required issuer shard missing: ${file}`);
  const cards = shardFiles.flatMap(read);
  assert.equal(cards.length, 93);
  validateCatalog(cards);
  const updated = new Map(cards.map(card => [card.id, card]));
  for (const original of read('docs/catalog-id-manifest.json')) {
    const current = updated.get(original.id);assert.ok(current, original.id);
    for (const [group, retired] of [['credits', 'retiredBenefits'], ['perks', 'retiredPerks']]) {
      const ids = new Set([...current[group], ...(current[retired] || [])].map(item => item.id));
      for (const id of original[group]) assert.ok(ids.has(id), `${original.id}/${group}/${id}`);
    }
  }
});

test('all 416 audit findings have exactly one explicit, sourced disposition', () => {
  for (const file of resolutionFiles) assert.ok(fs.existsSync(path.join(root, file)), `Required resolution file missing: ${file}`);
  const manifest = read('docs/audit-findings-2026-09-16.json');
  const expected = new Map(manifest.cards.flatMap(card => card.findings.map(finding => [card.id + '\0' + finding.field, finding])));
  assert.equal(expected.size, 416);
  const seen = new Map();
  for (const file of resolutionFiles) {
    const data = read(file);
    const entries = Array.isArray(data) ? data : data.resolutions || data.findings || [];
    for (const item of entries) {
      const key = item.cardId + '\0' + (item.auditField || item.field);
      if (!expected.has(key)) continue; // New products and supplemental corrections are separately recorded.
      assert.ok(typeof item.disposition === 'string' && item.disposition.trim(), key);
      const explanation = item.resolution || item.implemented;
      assert.ok(typeof explanation === 'string' && explanation.trim(), `${key}/resolution`);
      assert.ok(validSource(item.sourceUrl), `${key}/sourceUrl`);
      seen.set(key, (seen.get(key) || 0) + 1);
    }
  }
  for (const key of expected.keys()) assert.equal(seen.get(key), 1, key.replace('\0', ' / '));
});
