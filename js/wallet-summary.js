// Actionable wallet summaries use the same periods and records as the tracker.
(function (root) {
  'use strict';
  const model = () => root.CardMaxModel;
  const periods = () => root.CardMaxPeriods;
  function currentEntries(cards, snapshot, now = new Date()) {
    const P = periods(), M = model(), today = P.dateKey(now);
    const benefits = P.migrateLegacy(cards, snapshot, now, typeof CARD_ID_ALIASES === 'undefined' ? {} : CARD_ID_ALIASES);
    return cards.filter(card => snapshot.cards.includes(card.id)).flatMap(card => (card.credits || [])
      .filter(credit => credit.trackingEnabled !== false && M.activeBenefit(credit, now))
      .map(credit => {
        const period = P.periodFor(card, credit, now, { ...snapshot, benefits });
        const record = benefits[period.key];
        const cash = P.unit(credit) === 'USD';
        const used = cash && record?.completed && record.unit === 'USD' ? Math.max(0, Number(record.cashValue) || 0) : 0;
        const remaining = cash ? Math.max(0, period.cashValue - used) : record?.completed ? 0 : period.amount;
        // Placeholder cardmember years and rolling eligibility are not expiry dates.
        const fixed = ['monthly', 'quarterly', 'semiannual', 'annual'].includes(period.frequency);
        let deadline = fixed && !period.warning && !period.dateUnknown ? P.parseDate(period.end) : null;
        if (deadline) deadline.setDate(deadline.getDate() - 1);
        if (deadline && credit.effectiveUntil && credit.effectiveUntil < P.dateKey(deadline)) deadline = P.parseDate(credit.effectiveUntil);
        const due = deadline ? P.dateKey(deadline) : null;
        return { card, credit, period, record, remaining, deadline: due, cash, countedCash: cash && M.includedCashCap(credit) && fixed && !!due, outstanding: cash ? remaining > 0 : !record?.completed, current: !due || due >= today };
      })).filter(entry => entry.current).sort((a, b) => (a.deadline || '9999').localeCompare(b.deadline || '9999') || a.card.name.localeCompare(b.card.name) || a.credit.name.localeCompare(b.credit.name));
  }
  function summarize(entries, now = new Date()) {
    const month = periods().dateKey(now).slice(0, 7);
    const outstanding = entries.filter(entry => entry.outstanding);
    const dueThisMonth = outstanding.filter(entry => entry.deadline?.slice(0, 7) === month);
    return { outstanding, dueThisMonth, remaining: outstanding.reduce((total, entry) => total + (entry.countedCash ? entry.remaining : 0), 0), dueCash: dueThisMonth.reduce((total, entry) => total + (entry.countedCash ? entry.remaining : 0), 0) };
  }
  function renewals(cards, snapshot, now = new Date()) {
    const P = periods(), today = P.parseDate(P.dateKey(now)), horizon = new Date(today); horizon.setDate(horizon.getDate() + 60);
    return cards.filter(card => snapshot.cards.includes(card.id)).flatMap(card => {
      const saved = P.parseDate(snapshot.renewalDates?.[card.id]), opened = snapshot.signupDates?.[card.id];
      // Never invent a day from an incomplete opening date.
      const anchor = saved || (opened?.year && opened?.month && opened?.day ? P.parseDate(`${opened.year}-${String(opened.month).padStart(2, '0')}-${String(opened.day).padStart(2, '0')}`) : null);
      if (!anchor) return [];
      let next = P.addMonths(anchor, Math.max(0, today.getFullYear() - anchor.getFullYear()) * 12);
      if (next < today) next = P.addMonths(anchor, (today.getFullYear() - anchor.getFullYear() + 1) * 12);
      return next <= horizon ? [{ card, date: P.dateKey(next), estimated: !saved }] : [];
    }).sort((a, b) => a.date.localeCompare(b.date));
  }
  function expiryLabel(entry) {
    if (!entry.deadline) return 'Confirm reset date with issuer';
    return 'Use by ' + periods().parseDate(entry.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  // Capture before a rerender and restore the same semantic control afterwards.
  function captureFocus(document) {
    const active = document.activeElement;
    if (!active || active === document.body) return null;
    const dataKeys = ['benefit', 'usedDate', 'cashUsed', 'reviewBenefit'];
    const data = dataKeys.find(key => active.dataset?.[key]);
    const region = active.closest('[id]')?.id;
    return { id: active.id, data, value: data && active.dataset[data], region };
  }
  function restoreFocus(document, saved) {
    if (!saved) return;
    let target = saved.id && document.getElementById(saved.id);
    if (!target && saved.data) {
      const region = document.getElementById(saved.region) || document;
      target = [...region.querySelectorAll('input, button')].find(element => element.dataset?.[saved.data] === saved.value);
    }
    target?.focus({ preventScroll: true });
  }
  root.CardMaxWallet = { currentEntries, summarize, renewals, expiryLabel, captureFocus, restoreFocus };
  if (typeof module !== 'undefined') module.exports = root.CardMaxWallet;
})(typeof window !== 'undefined' ? window : globalThis);
