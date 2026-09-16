(function (root) {
  'use strict';
  const terms = Object.freeze({
    sourceUrl: 'https://www.biltrewards.com/terms/bilt-card-offer-terms',
    reviewedAt: '2026-09-16',
    termsUpdatedAt: '2026-08-28'
  });
  function amount(value, name) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1000000) {
      throw new RangeError(`${name} must be between 0 and 1,000,000.`);
    }
    return Math.round(value * 100);
  }
  function calculate({ housing, spend, baseRate, availableCash = 0 }) {
    const housingCents = amount(housing, 'Housing');
    const spendCents = amount(spend, 'Spending');
    const availableCashCents = amount(availableCash, 'Bilt Cash');
    if (typeof baseRate !== 'number' || !Number.isFinite(baseRate) || baseRate < 0 || baseRate > 100) {
      throw new RangeError('A valid catalog base earning rate is required.');
    }
    // Compare integer cents at tier boundaries; the ratio is explanatory only.
    const multiplier = !housingCents ? 0 : spendCents >= housingCents ? 1.25
      : spendCents * 4 >= housingCents * 3 ? 1
      : spendCents * 2 >= housingCents ? 0.75
      : spendCents * 4 >= housingCents ? 0.5 : 0;
    const housingPoints = !housingCents ? 0 : multiplier === 0 ? 250
      : Math.floor(housingCents * multiplier / 100);
    const basePoints = Math.floor(spendCents * baseRate / 100);
    // Flexible redemptions have a one-point minimum at three Bilt Cash cents,
    // not a block of 100 or 1,000 points. Round estimates down conservatively.
    const earnedCashCents = Math.floor(spendCents * 4 / 100);
    const budgetCashCents = earnedCashCents + availableCashCents;
    const flexibleHousingPoints = Math.min(Math.floor(housingCents / 100), Math.floor(budgetCashCents / 3));
    const usedCashCents = flexibleHousingPoints * 3;
    return {
      baseRate, basePoints, multiplier,
      spendRatio: housingCents ? spendCents / housingCents : null,
      housingPoints, housingTotal: basePoints + housingPoints,
      flexibleHousingPoints, flexibleTotal: basePoints + flexibleHousingPoints,
      earnedCash: earnedCashCents / 100, usedCash: usedCashCents / 100,
      remainingCash: (budgetCashCents - usedCashCents) / 100
    };
  }
  const api = { calculate, terms };
  root.BiltCalculatorModel = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
