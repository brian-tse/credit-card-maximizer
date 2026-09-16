(function () {
  'use strict';
  const form = document.getElementById('calculator-form');
  const select = document.getElementById('card');
  const error = document.getElementById('input-error');
  const results = document.getElementById('results');
  const ids = ['bilt-blue', 'bilt-obsidian', 'bilt-palladium'];
  const cards = typeof CARDS_DATABASE === 'undefined' ? [] : ids.map(id => CARDS_DATABASE.find(card => card.id === id)).filter(Boolean);
  const integer = value => value.toLocaleString('en-US');
  const cash = value => `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bilt Cash`;
  const text = (id, value) => { document.getElementById(id).textContent = value; };
  function fail(message) { error.textContent = message; error.hidden = false; results.hidden = true; }
  if (!cards.length || typeof BiltCalculatorModel === 'undefined') {
    fail('The card catalog could not be loaded. Refresh this page or use the card catalog link below.');
    return;
  }
  select.replaceChildren(...cards.map(card => {
    const option = document.createElement('option');
    option.value = card.id;
    option.textContent = card.name;
    return option;
  }));
  select.value = cards.some(card => card.id === 'bilt-palladium') ? 'bilt-palladium' : cards[0].id;
  select.disabled = false;
  function render() {
    const card = cards.find(card => card.id === select.value);
    const inputs = ['housing', 'spend', 'available-cash'].map(id => document.getElementById(id));
    if (inputs.some(input => input.value.trim() === '' || !input.checkValidity())) {
      fail('Enter amounts from $0 to $1,000,000, with no more than two decimal places.');
      return;
    }
    try {
      const value = BiltCalculatorModel.calculate({ housing: Number(inputs[0].value), spend: Number(inputs[1].value), availableCash: Number(inputs[2].value), baseRate: card.earning.base });
      error.hidden = true; results.hidden = false;
      text('card-details', `${card.earning.base}× base points · $${integer(card.annualFee)} listed annual fee. Category bonuses are not included.`);
      const issuer = document.getElementById('issuer-link');
      issuer.href = /^https:\/\//.test(card.sourceUrl) ? card.sourceUrl : 'https://www.bilt.com/card';
      text('housing-total', integer(value.housingTotal)); text('flexible-total', integer(value.flexibleTotal));
      text('housing-base', integer(value.basePoints)); text('flexible-base', integer(value.basePoints));
      text('housing-points', integer(value.housingPoints)); text('flexible-points', integer(value.flexibleHousingPoints));
      text('spend-ratio', value.spendRatio === null ? 'No housing payment' : `${(value.spendRatio * 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`);
      text('housing-rate', value.multiplier ? `${value.multiplier}×` : value.housingPoints ? '250-point floor' : 'No housing points');
      text('cash-earned', cash(value.earnedCash)); text('cash-used', cash(value.usedCash)); text('cash-remaining', cash(value.remainingCash));
      const difference = value.housingTotal - value.flexibleTotal;
      text('comparison-summary', difference === 0 ? 'Both options produce the same modeled points. Compare the separate Bilt Cash balance and eligibility conditions.' : `${difference > 0 ? 'Housing-only' : 'Flexible'} produces ${integer(Math.abs(difference))} more modeled points this cycle. Remaining Bilt Cash is shown separately; these totals are not a cash valuation.`);
    } catch (_) { fail('The selected card or amounts could not be calculated. Check your inputs and try again.'); }
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  render();
})();
