const test = require('node:test');
const assert = require('node:assert/strict');
const cards = require('../data/reviewed/chase-cards.json');
const resolution = require('../docs/audit-resolution-chase.json');
const manifest = require('../docs/catalog-id-manifest.json');
const { validateCatalog } = require('../scripts/validate-catalog');
const byId = Object.fromEntries(cards.map(card => [card.id, card]));
const credit = (id, benefit) => byId[id].credits.find(item => item.id === benefit);

test('Chase shard accounts for 21 published cards, four additions and all 94 findings', () => {
  assert.equal(validateCatalog(cards).cards, 25);
  assert.equal(resolution.findings.length, 94);
  assert.equal(new Set(resolution.findings.map(item => item.findingId)).size, 94);
  assert.equal(resolution.additions.length, 4);
  for (const finding of resolution.findings) {
    assert(byId[finding.cardId]);
    assert(finding.disposition && finding.implemented && finding.sourceUrl);
    assert(['omission', 'qualification', 'confirmed-wrong', 'unsupported'].includes(finding.auditClassification));
  }
  assert(cards.every(card => card.verificationStatus === 'partially-verified' && card.verifiedAt === null));
  assert(cards.every(card => card.signUpBonus?.publishable === false));
});

test('all original Chase benefit IDs survive in active or retired records', () => {
  for (const old of manifest.filter(card => byId[card.id])) {
    const current = byId[old.id];
    const creditIds = new Set([...current.credits, ...(current.retiredBenefits || [])].map(item => item.id));
    const perkIds = new Set([...current.perks, ...(current.retiredPerks || [])].map(item => item.id));
    for (const id of old.credits) assert(creditIds.has(id), `${old.id}/credits/${id}`);
    for (const id of old.perks) assert(perkIds.has(id), `${old.id}/perks/${id}`);
  }
  const retired = byId['southwest-priority'].retiredBenefits;
  for (const id of ['southwest-travel-credit', 'upgraded-boardings']) {
    assert.equal(retired.find(item => item.id === id).trackingEnabled, false);
    assert.equal(retired.find(item => item.id === id).annualValueExcluded, true);
  }
  assert(byId['chase-british-airways'].retiredPerks.some(item => item.id === 'pay-taxes-with-avios'));
});

test('airline and hotel card-only earning never includes membership points', () => {
  const expected = { 'united-explorer': 3, 'united-quest': 4, 'united-club-infinite': 5, 'united-business-card': 2, 'world-of-hyatt': 4, 'world-of-hyatt-business': 4, 'marriott-bonvoy-boundless': 6, 'chase-marriott-bold': 3, 'ihg-one-rewards-premier': 10, 'ihg-one-rewards-premier-business': 10, 'chase-aeroplan': 3 };
  for (const [id, multiplier] of Object.entries(expected)) {
    const category = byId[id].earning.categories.find(item => item.loyaltyEarning);
    assert.equal(category.multiplier, multiplier, id);
    assert(category.loyaltyEarning.combinedMaximum > multiplier, id);
  }
});

test('United credits preserve monthly splits, December overrides and anniversary periods', () => {
  for (const [id, monthly, december, annual] of [['united-quest', 8, 12, 100], ['united-business-card', 8, 12, 100], ['united-club-infinite', 12, 18, 150]]) {
    const rideshare = credit(id, 'rideshare-credit');
    assert.equal(rideshare.monthlyAmount, monthly);
    assert.equal(rideshare.monthlyAmounts[11], december);
    assert.equal(rideshare.monthlyAmounts.reduce((a, b) => a + b, 0), annual);
    assert.equal(rideshare.activationRequired, true);
  }
  assert.deepEqual(credit('united-quest', 'instacart-credit').perOrderLimits, [10, 5]);
  assert.deepEqual(credit('united-club-infinite', 'instacart-credit').perOrderLimits, [10, 10]);
  assert.equal(credit('united-quest', 'car-rental-credit').resetPeriod, 'anniversary');
  assert.equal(credit('united-explorer', 'united-travel-credit').spendRequirement.amount, 10000);
  assert.equal(credit('united-explorer', 'united-travel-credit').annualValueExcluded, true);
});

test('transfers distinguish no-fee pooling, direct access and loyalty conversions', () => {
  for (const id of ['chase-freedom-flex', 'chase-freedom-unlimited', 'chase-ink-business-cash', 'chase-ink-business-unlimited']) {
    assert.deepEqual(byId[id].transferPartners, []);
    assert.equal(byId[id].transferAccess.type, 'requires-eligible-card');
  }
  for (const id of ['chase-sapphire-reserve', 'chase-sapphire-preferred', 'chase-ink-business-preferred', 'chase-sapphire-reserve-business']) {
    assert.equal(byId[id].transferAccess.type, 'direct');
    assert(!byId[id].transferPartners.some(partner => partner.name === 'Emirates'));
    assert.equal(byId[id].transferPartners.find(partner => partner.name === 'Wyndham').ratioVerificationStatus, 'unverified');
  }
  const hyatt = byId['chase-ink-business-preferred'].transferPartners.find(partner => partner.name === 'Hyatt');
  assert(hyatt.terms.some(term => term.ratio === '4:3' && term.effectiveFrom === '2026-10-01'));
  assert.equal(byId['marriott-bonvoy-boundless'].transferAccess.type, 'loyalty-conversion');
});

test('conditional and future terms are structured without granting cash by default', () => {
  const boundless = byId['marriott-bonvoy-boundless'].perks.find(item => item.id === 'limited-airline-promotion');
  assert.equal(boundless.trackingEnabled, false);
  assert.equal(boundless.annualValueExcluded, true);
  assert.equal(boundless.terms.length, 2);
  assert.match(boundless.eligibility, /January 8–June 3/);
  assert.equal(credit('world-of-hyatt', 'bonus-free-night').spendRequirement.period, 'calendar');
  const ink = byId['chase-ink-business-cash'].earning.categories;
  assert.equal(new Set(ink.filter(item => item.cap).map(item => item.cap.sharedGroup)).size, 2);
  assert(ink.filter(item => item.cap).every(item => item.cap.period === 'anniversary'));
  const dining = byId['chase-aeroplan'].earning.categories.find(item => item.category === 'Dining');
  assert(dining.terms.some(term => term.multiplier === 2 && term.effectiveFrom === '2027-01-01'));
  assert.equal(credit('chase-sapphire-reserve-business', 'the-edit-hotel-credit').perTransactionLimit, 250);
  assert.equal(credit('chase-sapphire-reserve-business', 'google-workspace-credit').effectiveUntil, '2027-12-31');
});
