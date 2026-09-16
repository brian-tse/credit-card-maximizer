const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
global.CardMaxModel = require('../js/card-model.js');
global.CardMaxPeriods = require('../js/benefit-periods.js');
const W = require('../js/wallet-summary.js');
const P = global.CardMaxPeriods;
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const at = value => P.parseDate(value);

test('wallet current cash uses real period allowances, actual use, and known deadlines', () => {
  const card = { id: 'example', name: 'Example', credits: [
    { id: 'monthly', name: 'Monthly', amount: 200, monthlyAmounts: [...Array(11).fill(15), 35], unit: 'USD', frequency: 'monthly', resetPeriod: 'calendar' },
    { id: 'quarterly', name: 'Quarterly', amount: 400, quarterlyAmount: 100, unit: 'USD', frequency: 'quarterly', resetPeriod: 'calendar' },
    { id: 'unknown', name: 'Cardmember', amount: 300, unit: 'USD', frequency: 'annual', resetPeriod: 'anniversary' },
    { id: 'conditional', name: 'Conditional', amount: 120, monthlyAmount: 10, unit: 'USD', frequency: 'monthly', conditional: true },
    { id: 'points', name: 'Points', amount: 10000, unit: 'points', frequency: 'annual', resetPeriod: 'calendar' }
  ] };
  const snapshot = { cards: ['example'], benefits: {} };
  const period = P.periodFor(card, card.credits[1], at('2026-12-15'), snapshot);
  snapshot.benefits[period.key] = { ...P.makeRecord(card, card.credits[1], period, true, '2026-12-10'), cashValue: 40 };
  const entries = W.currentEntries([card], snapshot, at('2026-12-15'));
  const summary = W.summarize(entries, at('2026-12-15'));
  assert.equal(summary.dueCash, 95, 'December $35 plus $60 quarterly balance; no conditional cash, points or placeholder anniversary');
  assert.equal(entries.find(entry => entry.credit.id === 'unknown').deadline, null);
  assert.equal(entries.find(entry => entry.credit.id === 'quarterly').remaining, 60);
  assert.equal(entries.find(entry => entry.credit.id === 'quarterly').deadline, '2026-12-31');
  assert.equal(W.summarize(W.currentEntries([card], snapshot, at('2027-01-01')), at('2027-01-01')).dueCash, 15);
});

test('wallet honors benefit end dates and legacy uses without inventing renewal dates', () => {
  const card = { id: 'example', name: 'Example', credits: [{ id: 'dining', name: 'Dining', amount: 120, monthlyAmount: 10, unit: 'USD', frequency: 'monthly', effectiveUntil: '2026-09-20' }] };
  const snapshot = { cards: ['example'], benefits: { 'monthly_2026-09_example_Dining': true }, signupDates: { example: { year: 2024, month: 10 } } };
  const entries = W.currentEntries([card], snapshot, at('2026-09-16'));
  assert.equal(entries[0].deadline, '2026-09-20');
  assert.equal(W.summarize(entries, at('2026-09-16')).dueCash, 0);
  assert.equal(W.currentEntries([card], snapshot, at('2026-09-21')).length, 0);
  assert.deepEqual(W.renewals([card], snapshot, at('2026-09-16')), []);
  snapshot.signupDates.example.day = 9;
  assert.equal(W.renewals([card], snapshot, at('2026-09-16'))[0].date, '2026-10-09');
  snapshot.renewalDates = { example: '2026-10-15' };
  assert.equal(W.renewals([card], snapshot, at('2026-09-16'))[0].date, '2026-10-15');
});

function walletPage(snapshot) {
  const html = read('index.html');
  const dom = new JSDOM(html, { url: 'https://cardmax.test/', runScripts: 'outside-only' });
  const w = dom.window;
  for (const [key, value] of Object.entries(snapshot)) w.localStorage.setItem(key, JSON.stringify(value));
  w.CardMaxAuth = { init() {}, autoSync() {} };
  w.eval(['data/cards.js', 'js/card-model.js', 'js/storage.js', 'js/benefit-periods.js', 'js/wallet-summary.js'].map(read).join('\n') + '\n' + [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]).join('\n'));
  return dom;
}

test('removing and undoing a card preserves dates, billed fees and benefit history, with focused recovery', async t => {
  const id = 'amex-gold';
  const dates = { [id]: { year: 2023, month: 4, day: 15 } };
  const fees = { [id]: 0 };
  const benefits = { 'benefit|amex-gold|uber-credit|2026-09-01': { completed: true, cashValue: 10, unit: 'USD', usedAt: '2026-09-10' } };
  const dom = walletPage({ cardmax_user_cards: [id], cardmax_signup_dates: dates, cardmax_annual_fees: fees, cardmax_tracked_benefits: benefits });
  t.after(() => dom.window.close());
  const w = dom.window;
  await new Promise(resolve => w.document.addEventListener('DOMContentLoaded', resolve));
  w.removeCard(id);
  assert.deepEqual(JSON.parse(w.localStorage.getItem('cardmax_user_cards')), []);
  assert.deepEqual(JSON.parse(w.localStorage.getItem('cardmax_signup_dates')), dates);
  assert.deepEqual(JSON.parse(w.localStorage.getItem('cardmax_annual_fees')), fees);
  assert.deepEqual(JSON.parse(w.localStorage.getItem('cardmax_tracked_benefits')), benefits);
  assert.equal(w.document.activeElement.textContent, 'Undo');
  w.undoRemoveCard();
  assert.deepEqual(JSON.parse(w.localStorage.getItem('cardmax_user_cards')), [id]);
  assert.equal(w.document.activeElement.id, 'settings-' + id);
  assert.equal(w.document.getElementById('wallet-undo').hidden, true);
  w.removeCard(id);
  w.toggleCardSelection(id);
  assert.deepEqual(JSON.parse(w.localStorage.getItem('cardmax_signup_dates')), dates, 'manual re-add also restores retained metadata');
});

test('adding a card preserves the search filter and transfers focus to the next matching card', async t => {
  const dom = walletPage({ cardmax_user_cards: [] });
  t.after(() => dom.window.close());
  const w = dom.window;
  await new Promise(resolve => w.document.addEventListener('DOMContentLoaded', resolve));
  const input = w.document.getElementById('card-search'); input.value = 'American Express'; w.filterCardSelector();
  const matching = [...w.document.querySelectorAll('.card-selector-item')].filter(item => item.style.display !== 'none');
  matching[0].focus(); w.toggleCardSelection(matching[0].dataset.id);
  assert.equal(w.document.activeElement.dataset.id, matching[1].dataset.id);
  assert.equal(input.value, 'American Express');
  assert.ok([...w.document.querySelectorAll('.card-selector-item')].filter(item => item.style.display !== 'none').every(item => (item.dataset.name + item.dataset.issuer).includes('American Express')));
});

test('tracker checkbox and amount edits retain focus in the same checklist and refresh remaining cash', async t => {
  const dom = new JSDOM(read('pages/tracker.html'), { url: 'https://cardmax.test/pages/tracker.html', runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const w = dom.window;
  w.localStorage.setItem('cardmax_user_cards', '["amex-gold"]');
  w.CardMaxAuth = { autoSync() {} };
  w.eval(['data/cards.js', 'js/card-model.js', 'js/storage.js', 'js/benefit-periods.js', 'js/wallet-summary.js', 'js/tracker.js'].map(read).join('\n'));
  await new Promise(resolve => w.document.addEventListener('DOMContentLoaded', resolve));
  const checkbox = w.document.querySelector('#by-card-container [data-benefit*="|uber-credit|"]');
  const key = checkbox.dataset.benefit; checkbox.focus(); checkbox.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(w.document.activeElement.dataset.benefit, key);
  assert.ok(w.document.activeElement.closest('#by-card-container'));
  const amount = w.document.querySelector('#by-card-container [data-cash-used]');
  amount.focus(); amount.value = '4'; amount.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(w.document.activeElement.dataset.cashUsed, key);
  assert.equal(w.document.activeElement.value, '4');
  assert.match(w.document.getElementById('due-benefits').textContent, /\$6remaining/);
});
