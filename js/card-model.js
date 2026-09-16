// Shared, unit-safe benefit values. `amount` is the annual cap for periodic credits.
(function (root) {
  'use strict';
  const number = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0;
  const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value).replace(/\.00$/, '');
  function creditUnit(credit) {
    if (credit.unit) return credit.unit;
    if (credit.type === 'points') return 'points';
    if (/certificate/i.test(credit.name || '')) return 'certificates';
    if (/free night/i.test(credit.name || '')) return 'nights';
    if (/boarding|visit|pass/i.test(credit.name || '') && number(credit.amount) <= 10) return 'visits';
    // Legacy records need explicit units before their values can be totaled.
    return 'unknown';
  }
  function activeBenefit(credit, now = new Date()) {
    const date = now.toISOString().slice(0, 10);
    return (!credit.effectiveFrom || credit.effectiveFrom <= date) && (!credit.effectiveUntil || credit.effectiveUntil >= date);
  }
  function annualCashValue(value, now = new Date()) {
    if (Array.isArray(value?.credits)) return value.credits.reduce((sum, credit) => sum + annualCashValue(credit, now), 0);
    if (!value || creditUnit(value) !== 'USD' || !activeBenefit(value, now)) return 0;
    const amount = number(value.amount);
    const frequency = String(value.frequency || '').toLowerCase();
    const multiYear = frequency.match(/^every\s+(\d+(?:\.\d+)?)\s+years?$/);
    if (multiYear) return Number(multiYear[1]) > 0 ? amount / Number(multiYear[1]) : 0;
    // Per stay/use and unknown limits cannot be assigned an annual value.
    if (!['annual', 'anniversary', 'monthly', 'quarterly', 'semiannual', 'semi-annual', 'calendar year'].includes(frequency)) return 0;
    return amount;
  }
  function contrastText(hex) {
    if (!/^#[a-f\d]{6}$/i.test(hex || '')) return '#000000';
    const channels = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    return (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05) ? '#000000' : '#ffffff';
  }
  function annualFeeForCard(card, overrides = {}) {
    const fee = overrides[card.id];
    return typeof fee === 'number' && Number.isFinite(fee) && fee >= 0 && fee <= 10000 ? fee : card.annualFee;
  }
  function formatCredit(credit) {
    const amount = credit.amount;
    if (typeof amount !== 'number') return String(amount ?? 'See issuer terms');
    const formatted = amount.toLocaleString('en-US');
    const unit = creditUnit(credit);
    if (unit === 'USD') return money(amount);
    if (unit === 'points') return `${formatted} pts`;
    if (unit === 'percent') return `${formatted}%`;
    const labels = { nights: 'night', certificates: 'certificate', visits: 'visit' };
    return `${formatted} ${labels[unit] || unit}${amount === 1 || !labels[unit] ? '' : 's'}`;
  }
  function periodLabel(credit) {
    const frequency = String(credit.frequency || 'See issuer terms');
    if (/^every\s+[\d.]+\s+years?$/i.test(frequency)) return `${frequency} (${money(annualCashValue(credit))}/year equivalent)`;
    if (credit.monthlyAmount) return `${money(credit.monthlyAmount)}/month; ${frequency === 'annual' ? 'annual cap shown' : frequency}`;
    if (credit.quarterlyAmount) return `${money(credit.quarterlyAmount)}/quarter; annual cap shown`;
    if (credit.semiannualAmount) return `${money(credit.semiannualAmount)}/half-year; annual cap shown`;
    return frequency;
  }
  function normalizeCardIds(ids, database, aliases) {
    database = database || (typeof CARDS_DATABASE !== 'undefined' ? CARDS_DATABASE : []);
    aliases = aliases || (typeof CARD_ID_ALIASES !== 'undefined' ? CARD_ID_ALIASES : {});
    const valid = new Set(database.map(card => card.id));
    return [...new Set((Array.isArray(ids) ? ids : []).filter(id => typeof id === 'string').map(id => aliases[id] || id).filter(id => valid.has(id)))];
  }
  function loadCardIds(storage = root.localStorage) {
    let ids;
    try { ids = JSON.parse(storage.getItem('cardmax_user_cards') || '[]'); } catch (_) { ids = []; }
    const normalized = normalizeCardIds(ids);
    if (JSON.stringify(ids) !== JSON.stringify(normalized)) storage.setItem('cardmax_user_cards', JSON.stringify(normalized));
    return normalized;
  }
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }
  function sourceLink(card, label = 'Issuer terms') {
    const source = card.sourceUrl;
    return /^https:\/\//.test(source || '') ? `<a href="${escapeHtml(source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>` : 'Check issuer terms';
  }
  function verificationText(card, now = new Date()) {
    if (card.verifiedAt) {
      const age = (now - new Date(`${card.verifiedAt}T00:00:00Z`)) / 86400000;
      return `Verified ${card.verifiedAt}${age > 90 ? ' · Review overdue' : ''}`;
    }
    if (card.reviewedAt) return `Partially reviewed ${card.reviewedAt} · Full review needed`;
    return 'Not yet verified · Review overdue';
  }
  function reviewedFieldLabel(field, card = {}) {
    const labels = { annualFee: 'Annual fee', credits: 'Credits and awards', perks: 'Card benefits', earning: 'Earning rates', 'earning.categories': 'Bonus earning categories', applicationStatus: 'New application availability', 'perks.lounge-access': 'Lounge access', 'perks.redemption': 'Redemption benefits' };
    if (labels[field]) return labels[field];
    const [group, key] = String(field).split('.');
    if (group === 'transferPartners' && key) return `${key.replace(/-removed$/, '')} ${key.endsWith('-removed') ? 'transfer availability' : 'transfers'}`;
    if (['credits', 'perks'].includes(group) && key) {
      const benefit = card[group]?.find(item => item.id === key);
      if (benefit) return benefit.name;
    }
    const words = (key || group).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ');
    return words.charAt(0).toUpperCase() + words.slice(1);
  }
  function statusHtml(card) {
    const closed = ['closed', 'discontinued', 'legacy'].includes(card.availability) || card.acceptingApplications === false || card.applicationStatus === 'closed';
    return `<div class="data-status">${closed ? '<strong>Closed to new applications · Existing holders</strong><br>' : ''}${escapeHtml(verificationText(card))} · ${sourceLink(card)}${card.verifiedFields?.length && !card.verifiedAt ? `<br>Reviewed fields: ${escapeHtml(card.verifiedFields.map(field => reviewedFieldLabel(field, card)).join(', '))}` : ''}</div>`;
  }
  function termsHtml(item) {
    const notes = [];
    if (item.eligibility) notes.push(typeof item.eligibility === 'string' ? item.eligibility : JSON.stringify(item.eligibility));
    if (item.cohort) notes.push(typeof item.cohort === 'string' ? item.cohort : JSON.stringify(item.cohort));
    if (item.effectiveFrom) notes.push(`Effective ${item.effectiveFrom}`);
    if (item.effectiveUntil) notes.push(`Ends ${item.effectiveUntil}`);
    if (item.termsNote) notes.push(item.termsNote);
    if (item.terms?.length) item.terms.forEach(term => notes.push(typeof term === 'string' ? term : [term.description, term.eligibility, term.cohort, term.ratio && `Ratio ${term.ratio}`, term.effectiveFrom && `from ${term.effectiveFrom}`, term.effectiveUntil && `through ${term.effectiveUntil}`].filter(Boolean).join(' · ')));
    if (item.legacyTerms?.length) item.legacyTerms.forEach(term => notes.push(`Earlier terms: ${term.amount !== undefined ? formatCredit({ ...item, ...term }) : term.description || ''}${term.effectiveUntil ? ` through ${term.effectiveUntil}` : ''}${term.eligibility ? ` · ${term.eligibility}` : ''}`));
    return notes.length ? `<div class="terms-note">${notes.map(escapeHtml).join('<br>')}</div>` : '';
  }
  const api = { contrastText, annualFeeForCard, annualCashValue, creditUnit, formatCredit, periodLabel, money, activeBenefit, normalizeCardIds, loadCardIds, escapeHtml, sourceLink, verificationText, reviewedFieldLabel, statusHtml, termsHtml };
  root.CardMaxModel = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
