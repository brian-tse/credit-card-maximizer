const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../js/benefit-periods.js');
const card = { id: 'example' };
const credit = { id: 'dining', name: 'Dining', amount: 400, quarterlyAmount: 100, unit: 'USD', frequency: 'quarterly', resetPeriod: 'calendar' };
const at = value => P.parseDate(value);

test('a corrected voucher unit preserves saved history without retaining false cash value', () => {
  const key = 'benefit|example|delay|2026-01-01';
  const snapshot = { benefits: { [key]: { cardId: 'example', creditId: 'delay', completed: true, usedAt: '2026-09-10', unit: 'USD', cashValue: 50 } } };
  const cards = [{ id: 'example', credits: [{ id: 'delay', name: 'Delay Voucher', amount: 50, unit: 'voucher', frequency: 'per occurrence', resetPeriod: 'per-use' }] }];
  const result = P.migrateLegacy(cards, snapshot, at('2026-09-16'));
  assert.equal(result[key].usedAt, '2026-09-10');
  assert.equal(result[key].originalCashValue, 50);
  assert.equal(result[key].unit, 'voucher');
  assert.equal(P.capturedThisYear(result, at('2026-09-16')).value, 0);
  assert.deepEqual(P.migrateLegacy(cards, { benefits: result }, at('2026-09-16')), result);
  assert.equal(snapshot.benefits[key].unit, 'USD');
});

test('quarterly, monthly, semiannual boundaries are exclusive and do not overlap', () => {
  assert.equal(P.periodFor(card, credit, at('2026-03-31')).key, 'benefit|example|dining|2026-01-01');
  assert.equal(P.periodFor(card, credit, at('2026-04-01')).start, '2026-04-01');
  assert.equal(P.periodFor(card, { ...credit, frequency: 'semiannual' }, at('2026-07-01')).end, '2027-01-01');
  assert.equal(P.periodFor(card, { ...credit, frequency: 'annual', monthlyAmount: 15, monthlyAmounts: [...Array(11).fill(15), 35], amount: 200 }, at('2026-12-01')).cashValue, 35);
});

test('anniversary uses signup or renewal dates and clamps leap day', () => {
  const annual = { ...credit, frequency: 'annual', resetPeriod: 'anniversary' };
  const snapshot = { signupDates: { example: { year: 2024, month: 2, day: 29 } } };
  assert.equal(P.periodFor(card, annual, at('2025-02-27'), snapshot).start, '2024-02-29');
  assert.equal(P.periodFor(card, annual, at('2025-02-28'), snapshot).end, '2026-02-28');
  const renewal = { renewalDates: { example: '2027-06-15' } };
  assert.equal(P.periodFor(card, annual, at('2026-06-14'), renewal).start, '2025-06-15');
  assert.match(P.periodFor(card, annual, at('2026-01-01')).warning, /January–December shown for now/);
});

test('rolling multi-year eligibility shares the original key until actual-use expiry', () => {
  const globalEntry = { ...credit, id: 'global-entry', frequency: 'every 4.5 years', amount: 120, resetPeriod: 'rolling' };
  const period = P.periodFor(card, globalEntry, at('2026-04-01'));
  const record = P.makeRecord(card, globalEntry, period, true, '2026-04-01');
  const snapshot = { benefits: { [period.key]: record } };
  assert.equal(P.periodFor(card, globalEntry, at('2027-01-01'), snapshot).key, period.key);
  assert.equal(P.periodFor(card, globalEntry, at('2030-09-30'), snapshot).end, '2030-10-01');
  assert.notEqual(P.periodFor(card, globalEntry, at('2030-10-01'), snapshot).key, period.key);
});

test('legacy months are preserved and both multi-year key formats converge', () => {
  const monthly = { ...credit, id: 'dining', frequency: 'annual', monthlyAmount: 10, amount: 120 };
  const multi = { ...credit, id: 'entry', name: 'Entry', frequency: 'every 4 years', amount: 120 };
  const input = { benefits: { monthly_2026_ignored: true, monthly_2026_foo: false, 'monthly_2026-01_example_Dining': true, 'monthly_2026-02_example_Dining': true, onetime_example_Entry: true, multiyear_example_Entry: false } };
  const result = P.migrateLegacy([{ ...card, credits: [monthly, multi] }], input, at('2026-09-15'));
  assert.equal(result['monthly_2026-01_example_Dining'], true);
  assert.equal(result['benefit|example|dining|2026-01-01'].cashValue, 10);
  assert.equal(result['benefit|example|entry|legacy-undated'].completed, true);
  assert.equal(Object.keys(result).filter(key => key.startsWith('benefit|example|entry')).length, 1);
  assert.equal(P.capturedThisYear(result, at('2026-09-15')).value, 20);
  assert.equal(P.capturedThisYear(result, at('2026-09-15')).estimated, true);
});

test('cash history sums recorded use across periods, excludes noncash and future records', () => {
  const benefits = {
    'benefit|a|one|2026-01-01': { completed: true, usedAt: '2026-01-12', cashValue: 7.5, unit: 'USD' },
    'benefit|a|one|2026-02-01': { completed: true, usedAt: '2026-02-12', cashValue: 10, unit: 'USD' },
    'benefit|a|points|2026-01-01': { completed: true, usedAt: '2026-01-12', cashValue: 10000, unit: 'points' },
    'benefit|a|future|2026-12-01': { completed: true, usedAt: '2026-12-01', cashValue: 20, unit: 'USD' }
  };
  assert.equal(P.capturedThisYear(benefits, at('2026-09-15')).value, 17.5);
  assert.equal(P.periodFor(card, { ...credit, amount: '100', unit: 'USD' }, at('2026-01-01')).cashValue, 0);
  assert.equal(P.periodFor(card, { ...credit, amount: 10000, unit: 'points' }, at('2026-01-01')).cashValue, 0);
});

test('an undated legacy multi-year use migrates once across years and remains editable', () => {
  const multi = { id: 'entry', name: 'Entry', frequency: 'every 4 years', amount: 120, unit: 'USD' };
  const cards = [{ ...card, credits: [multi] }];
  let snapshot = { benefits: { onetime_example_Entry: true, multiyear_example_Entry: false } };
  const otherDevice = P.migrateLegacy(cards, snapshot, at('2032-01-15'));
  snapshot.benefits = P.migrateLegacy(cards, snapshot, at('2026-09-15'));
  const key = 'benefit|example|entry|legacy-undated';
  assert.equal(snapshot.benefits[key].completed, true);
  assert.equal(otherDevice[key].completed, true, 'independent device migration uses the same identity');
  snapshot.benefits = P.migrateLegacy(cards, snapshot, at('2032-01-15'));
  assert.deepEqual(Object.keys(snapshot.benefits).filter(key => key.startsWith('benefit|')), [key]);
  const undated = P.periodFor(card, multi, at('2032-01-15'), snapshot);
  assert.equal(undated.key, key);
  assert.equal(undated.dateUnknown, true);
  assert.match(undated.warning, /actual date/);
  snapshot.benefits[key].usedAt = '2031-08-10';
  const dated = P.periodFor(card, multi, at('2032-01-15'), snapshot);
  assert.equal(dated.key, key);
  assert.equal(dated.start, '2031-08-10');
  assert.equal(dated.end, '2035-08-10');
  assert.equal(dated.dateUnknown, false);
});

test('migration does not restore a subsequently unchecked or deleted period', () => {
  const multi = { id: 'entry', name: 'Entry', frequency: 'every 4 years', amount: 120, unit: 'USD' };
  const cards = [{ ...card, credits: [multi] }];
  const snapshot = { benefits: { onetime_example_Entry: true } };
  snapshot.benefits = P.migrateLegacy(cards, snapshot, at('2026-09-15'));
  const key = 'benefit|example|entry|legacy-undated';
  snapshot.benefits[key] = P.makeRecord(card, multi, P.periodFor(card, multi, at('2026-09-15'), snapshot), false);
  snapshot.benefits = P.migrateLegacy(cards, snapshot, at('2027-01-15'));
  assert.equal(snapshot.benefits[key].completed, false);
  delete snapshot.benefits[key];
  snapshot.benefits = P.migrateLegacy(cards, snapshot, at('2028-01-15'));
  assert.equal(Object.keys(snapshot.benefits).some(key => key.startsWith('benefit|')), false);
  assert.equal(snapshot.benefits.onetime_example_Entry, true, 'original source checkbox remains available for recovery');
});

test('period date validation includes the start and excludes the end for fixed benefits', () => {
  const now = at('2026-09-15');
  for (const frequency of ['monthly', 'quarterly', 'semiannual', 'annual']) {
    const period = P.periodFor(card, { ...credit, frequency }, now);
    assert.equal(P.usedDateError(period, period.start, now), '');
    const before = P.parseDate(period.start); before.setDate(before.getDate() - 1);
    assert.match(P.usedDateError(period, P.dateKey(before), now), /within this benefit period/);
    assert.match(P.usedDateError(period, period.end, at('2027-12-31')), /within this benefit period/);
  }
  assert.match(P.usedDateError({ frequency: 'annual' }, '2026-02-30', now), /valid usage date/);
  assert.match(P.usedDateError({ frequency: 'every 4 years' }, '2026-10-01', now), /future/);
  assert.equal(P.usedDateError({ frequency: 'every 4 years' }, '2023-01-01', now), '', 'rolling benefits accept the actual historical redemption date');
});

test('retired Southwest boarding history survives without becoming cash or a current benefit', () => {
  const southwest = require('../data/cards').find(card => card.id === 'southwest-performance-business');
  const snapshot = { benefits: { 'annual_2025_southwest-performance-business_Upgraded_Boardings': true } };
  const migrated = P.migrateLegacy([southwest], snapshot, at('2026-09-15'));
  const record = migrated['benefit|southwest-performance-business|upgraded-boardings|2025-01-01'];
  assert.equal(record.completed, true);
  assert.equal(record.unit, 'visits');
  assert.equal(record.cashValue, 0);
  assert.equal(southwest.retiredBenefits.find(credit => credit.id === 'upgraded-boardings').amount, 4);
  assert.equal(southwest.credits.some(credit => credit.id === 'upgraded-boardings'), false);
});
