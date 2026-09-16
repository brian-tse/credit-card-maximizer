const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const cards = require('../data/cards');
const byId = Object.fromEntries(cards.map(card => [card.id, card]));

test('duplicate products retain their previously published saved IDs', () => {
  assert.equal(cards.length, new Set(cards.map(card => card.id)).size);
  assert.equal(cards.filter(card => card.id === 'amex-blue-cash-preferred').length, 1);
  assert.equal(cards.filter(card => card.id === 'discover-it-cash-back').length, 1);
  assert.ok(byId['amex-blue-cash-preferred'].credits.some(credit => credit.id === 'disney-bundle-credit'));
});

test('non-cash awards never acquire a dollar unit', () => {
  const expected = [
    ['capital-one-venture-x', 'anniversary-bonus', 'points', 10000],
    ['world-of-hyatt', 'free-night-award', 'nights', 1],
    ['delta-skymiles-platinum', 'companion-certificate', 'certificates', 1],
    ['atmos-rewards-summit', 'global-companion-award-25k', 'certificates', 1],
    ['synchrony-virgin-red', 'third-night-free', 'nights', 1],
    ['citi-aadvantage-globe', 'admirals-club-passes', 'visits', 4]
  ];
  for (const [cardId, benefitId, unit, amount] of expected) {
    const benefit = byId[cardId].credits.find(credit => credit.id === benefitId);
    assert.equal(benefit.unit, unit, `${cardId}/${benefitId}`);
    assert.equal(benefit.amount, amount);
  }
});

test('spot checks do not falsely certify an entire card or a welcome offer', () => {
  for (const card of cards) {
    assert.ok(card.sourceUrl.startsWith('https://'));
    if (card.verificationStatus === 'partially-verified') {
      assert.equal(card.verifiedAt, null, card.id);
      assert.ok(card.reviewedAt);
      assert.ok(card.verifiedFields.length > 0);
    } else if (card.verificationStatus === 'needs-review') {
      assert.equal(card.verifiedAt, null, card.id);
      assert.equal(card.reviewedAt, null, card.id);
    }
    if (card.signUpBonus?.offerStatus === 'unverified') assert.equal(card.signUpBonus.verifiedAt, null);
  }
});

test('Platinum monthly and quarterly credits preserve their actual period caps', () => {
  const platinum = byId['amex-platinum'];
  assert.equal(platinum.annualFee, 895);
  const uber = platinum.credits.find(credit => credit.id === 'uber-credit');
  assert.equal(uber.monthlyAmounts.reduce((sum, amount) => sum + amount, 0), 200);
  assert.equal(uber.monthlyAmounts[11], 35);
  assert.equal(platinum.credits.find(credit => credit.id === 'resy-credit').quarterlyAmount, 100);
  assert.equal(platinum.credits.find(credit => credit.id === 'equinox-credit').monthlyAmount, undefined);
  assert.equal(platinum.credits.some(credit => credit.id === 'saks-fifth-avenue'), false);
  assert.equal(platinum.retiredBenefits.find(credit => credit.id === 'saks-fifth-avenue').status, 'retired');
});

test('Preferred Hyatt transition retains both application cohorts', () => {
  const hyatt = byId['chase-sapphire-preferred'].transferPartners.find(partner => partner.name === 'Hyatt');
  assert.ok(hyatt.terms.some(term => term.ratio === '1:1' && term.effectiveUntil === '2026-09-30'));
  assert.ok(hyatt.terms.some(term => term.ratio === '4:3' && term.effectiveFrom === '2026-06-15'));
  assert.ok(hyatt.terms.some(term => term.ratio === '4:3' && term.effectiveFrom === '2026-10-01'));
});

test('Journey has its real airline credit and omits the unsupported Global Entry benefit', () => {
  const journey = byId['wells-fargo-autograph-journey'];
  assert.equal(journey.earning.categories.find(category => category.category === 'Airlines').multiplier, 4);
  assert.equal(journey.credits.find(credit => credit.id === 'annual-airline-credit').amount, 50);
  assert.equal(journey.credits.some(credit => /global entry/i.test(credit.name)), false);
});

function valuations(stored = null) {
  const data = new Map(stored === null ? [] : [['cardmax_point_valuations', stored]]);
  const context = {
    localStorage: {
      getItem: key => data.get(key) ?? null,
      setItem: (key, value) => data.set(key, String(value)),
      removeItem: key => data.delete(key)
    }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../data/valuations.js'), 'utf8') + '\nthis.api = Valuations;', context);
  return context.api;
}

test('cash-back cards use cash-back valuation even when a signup offer uses different wording', () => {
  const api = valuations();
  for (const id of ['amex-blue-cash-preferred', 'amex-blue-business-cash', 'capital-one-savor', 'capital-one-savor-student', 'citi-costco-anywhere']) {
    assert.equal(api.getCardValuationKey(byId[id]), 'cashback', id);
    assert.equal(api.getCardPointValue(byId[id]), 1, id);
  }
  assert.equal(api.getCardValuationKey(byId['capital-one-venture-x']), 'capital-one');
  assert.equal(api.POLICY.verifiedAt, null);
});

test('corrupt valuation storage does not break cards, and zero-valued estimates remain zero', () => {
  assert.equal(valuations('{broken').getCardPointValue(byId['capital-one-venture-x']), 1.77);
  const api = valuations('{"capital-one":-100,"cashback":"nope"}');
  assert.equal(api.getCardPointValue(byId['capital-one-venture-x']), 1.77);
  assert.equal(api.saveValuation('capital-one', 0), true);
  assert.equal(api.getCardPointValue(byId['capital-one-venture-x']), 0);
  assert.equal(api.saveValuation('capital-one', Infinity), false);
  assert.equal(api.saveValuation('__proto__', 1), false);
});
