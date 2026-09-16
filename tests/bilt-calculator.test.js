const test = require('node:test');
const assert = require('node:assert/strict');
const { calculate } = require('../bilt/calculator-model.js');

test('Bilt housing tiers change at exact spending thresholds', () => {
  const expected = [
    [0, 250], [999.99, 250],
    [1000, 2000], [1999.99, 2000],
    [2000, 3000], [2999.99, 3000],
    [3000, 4000], [3999.99, 4000],
    [4000, 5000], [5000, 5000]
  ];
  for (const [spend, housingPoints] of expected) {
    const result = calculate({ housing: 4000, spend, baseRate: 1 });
    assert.equal(result.housingPoints, housingPoints, `Spend ${spend}`);
  }
});

test('Bilt housing floor requires a housing payment and applies only below 25%', () => {
  const noHousing = calculate({ housing: 0, spend: 1000, baseRate: 2, availableCash: 100 });
  assert.equal(noHousing.housingPoints, 0);
  assert.equal(noHousing.flexibleHousingPoints, 0);
  assert.equal(noHousing.spendRatio, null);
  assert.equal(noHousing.basePoints, 2000);
  assert.equal(noHousing.remainingCash, 140);
  assert.equal(calculate({ housing: 100, spend: 24.99, baseRate: 1 }).housingPoints, 250);
  assert.equal(calculate({ housing: 100, spend: 25, baseRate: 1 }).housingPoints, 50);
});

test('Flexible housing redemption uses single points rather than 1000-point blocks', () => {
  const smallest = calculate({ housing: 100, spend: 0.75, baseRate: 1 });
  assert.equal(smallest.earnedCash, 0.03);
  assert.equal(smallest.flexibleHousingPoints, 1);
  assert.equal(smallest.usedCash, 0.03);
  const existingCash = calculate({ housing: 100, spend: 0, baseRate: 1, availableCash: 0.03 });
  assert.equal(existingCash.flexibleHousingPoints, 1);
  const housingCap = calculate({ housing: 2375, spend: 4000, baseRate: 2 });
  assert.equal(housingCap.flexibleHousingPoints, 2375);
  assert.equal(housingCap.usedCash, 71.25);
  assert.equal(housingCap.remainingCash, 88.75);
});

test('Both Bilt options use the supplied catalog base rate and keep cash separate', () => {
  const blue = calculate({ housing: 4000, spend: 4000, baseRate: 1 });
  const palladium = calculate({ housing: 4000, spend: 4000, baseRate: 2 });
  assert.equal(blue.housingTotal, 9000);
  assert.equal(blue.flexibleTotal, 8000);
  assert.equal(palladium.housingTotal, 13000);
  assert.equal(palladium.flexibleTotal, 12000);
  assert.equal(palladium.remainingCash, 40);
});

test('Bilt calculator rejects invalid inputs rather than producing misleading totals', () => {
  const valid = { housing: 4000, spend: 4000, baseRate: 2, availableCash: 0 };
  for (const field of ['housing', 'spend', 'availableCash']) {
    for (const invalid of [-1, NaN, Infinity, 1000001, '4000']) {
      assert.throws(() => calculate({ ...valid, [field]: invalid }), RangeError);
    }
  }
  for (const invalid of [-1, NaN, Infinity, undefined, '2']) {
    assert.throws(() => calculate({ ...valid, baseRate: invalid }), RangeError);
  }
});
