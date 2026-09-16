// All tracker views use the same benefit IDs, periods, completion records and cash units.
let userCards = [];
let trackedBenefits = {};
let trackerSnapshot = {};
let currentView = 'card';
let trackerEntries = new Map();
const trackerEscape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const trackerMoney = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);

function loadUserData() {
  trackerSnapshot = CardMaxStorage.readSnapshot();
  userCards = CardMaxModel.normalizeCardIds(trackerSnapshot.cards);
  trackedBenefits = CardMaxPeriods.migrateLegacy(CARDS_DATABASE, trackerSnapshot, new Date(), typeof CARD_ID_ALIASES === 'undefined' ? {} : CARD_ID_ALIASES);
  if (JSON.stringify(trackedBenefits) !== JSON.stringify(trackerSnapshot.benefits) || JSON.stringify(userCards) !== JSON.stringify(trackerSnapshot.cards)) {
    localStorage.setItem('cardmax_user_cards', JSON.stringify(userCards));
    localStorage.setItem('cardmax_tracked_benefits', JSON.stringify(trackedBenefits));
    CardMaxAuth.autoSync();
  }
  trackerSnapshot.benefits = trackedBenefits;
}

function trackerBenefits(card, now = new Date()) {
  return (card.credits || []).filter(credit => (!credit.effectiveFrom || credit.effectiveFrom <= CardMaxPeriods.dateKey(now)) && (!credit.effectiveUntil || credit.effectiveUntil >= CardMaxPeriods.dateKey(now))).map(credit => {
    const period = CardMaxPeriods.periodFor(card, credit, now, trackerSnapshot);
    const entry = { card, credit, period, record: trackedBenefits[period.key] };
    trackerEntries.set(period.key, entry);
    return entry;
  });
}

function trackerDateRange(period) {
  if (period.dateUnknown) return '';
  const start = CardMaxPeriods.parseDate(period.start), end = CardMaxPeriods.parseDate(period.end);
  if (!start || !end || end.getFullYear() >= 2200) return '';
  end.setDate(end.getDate() - 1);
  const format = date => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(start.getFullYear() === end.getFullYear() ? {} : { year: 'numeric' }) });
  return `${format(start)}–${format(end)}${start.getFullYear() === end.getFullYear() ? `, ${end.getFullYear()}` : ''}`;
}

function benefitRow(entry) {
  const { card, credit, period, record } = entry;
  const checked = record?.completed === true;
  const key = trackerEscape(period.key);
  const amount = CardMaxModel.formatCredit({ ...credit, amount: period.amount });
  const label = `${credit.name} for ${card.name}, ${period.label}`;
  return `<li class="benefit-item ${checked ? 'completed' : ''}" style="align-items:flex-start;flex-wrap:wrap">
    <label style="display:flex;align-items:flex-start;gap:0.75rem;flex:1;min-width:220px;cursor:pointer">
      <input type="checkbox" ${checked ? 'checked' : ''} aria-label="${trackerEscape(label)}" data-benefit="${key}" style="width:20px;height:20px;margin-top:3px;flex-shrink:0">
      <span class="benefit-content"><span class="benefit-text" style="display:block">${trackerEscape(credit.name)}</span>
        <span class="benefit-description" style="display:block">${trackerEscape(credit.description)}</span>
        <span class="text-muted" style="display:block;font-size:0.75rem;margin-top:0.25rem">${trackerEscape(period.label)}${trackerDateRange(period) ? ` · ${trackerEscape(trackerDateRange(period))}` : ''}</span>
        ${period.warning ? `<span style="display:block;color:var(--text-secondary);font-size:0.8rem;margin-top:0.25rem">${trackerEscape(period.warning)}</span>` : ''}
      </span>
    </label>
    <span class="benefit-value">${trackerEscape(amount)}</span>
    ${checked ? `<div style="width:100%;display:flex;flex-wrap:wrap;gap:1rem;margin-left:2rem;font-size:0.8rem">
      <label>Used on <input type="date" data-used-date="${key}" value="${trackerEscape(record.usedAt || '')}" ${['monthly', 'quarterly', 'semiannual', 'annual'].includes(period.frequency) ? `min="${period.start}"` : ''} max="${CardMaxPeriods.dateKey(new Date())}" aria-label="Date used for ${trackerEscape(credit.name)}"></label>
      <span data-date-error role="alert" style="color:var(--text-secondary)"></span>
      ${CardMaxPeriods.unit(credit) === 'USD' ? `<label>Cash used ($) <input type="number" min="0" max="${period.cashValue}" step="0.01" data-cash-used="${key}" value="${record.cashValue ?? period.cashValue}" style="width:6rem" aria-label="Cash used for ${trackerEscape(credit.name)}"></label>` : ''}
      ${record.dateEstimated ? '<span class="text-muted">Imported date/value estimate — enter your actual use.</span>' : ''}
    </div>` : ''}
  </li>`;
}

function trackerCard(card, entries, showAnnual = false) {
  const completed = entries.filter(entry => entry.record?.completed).length;
  const cashTotal = entries.reduce((sum, entry) => sum + entry.period.cashValue, 0);
  const used = entries.reduce((sum, entry) => sum + (entry.record?.completed && entry.record.unit === 'USD' ? entry.record.cashValue || 0 : 0), 0);
  const captured = CardMaxPeriods.capturedThisYear(trackedBenefits, new Date(), card.id);
  return `<div class="tracker-card" style="margin-bottom:1.5rem"><div class="tracker-header"><div>
    <div class="tracker-title">${trackerEscape(card.name)}</div>
    <div class="text-muted" style="font-size:0.875rem;margin-top:0.25rem">${completed} of ${entries.length} current benefits completed</div>
    ${showAnnual ? `<div class="text-muted" style="font-size:0.875rem">${trackerMoney(captured.value)} cash captured this year${captured.estimated ? ' (includes imported estimates)' : ''}</div>` : ''}
    </div>${cashTotal ? `<div class="tracker-progress">${trackerMoney(used)} / ${trackerMoney(cashTotal)}<div style="font-size:0.7rem">Current cash allowances</div></div>` : ''}</div>
    <ul class="benefit-checklist">${entries.map(benefitRow).join('')}</ul>
    ${showAnnual && card.perks?.length ? `<details style="margin-top:1rem"><summary>Other card benefits</summary><ul>${card.perks.map(perk => `<li><strong>${trackerEscape(perk.name)}</strong> — ${trackerEscape(perk.description)}</li>`).join('')}</ul></details>` : ''}
    </div>`;
}

function renderBenefitTrackers() {
  const groups = { monthly: 'monthly', quarterly: 'quarterly', semiannual: 'semiannual', annual: 'annual', other: 'onetime' };
  for (const [group, containerId] of Object.entries(groups)) {
    const container = document.getElementById(`${containerId}-benefits-container`);
    if (!container) continue;
    const html = userCards.map(id => CARDS_DATABASE.find(card => card.id === id)).filter(Boolean).map(card => {
      const entries = trackerBenefits(card).filter(entry => (['monthly', 'quarterly', 'semiannual', 'annual'].includes(entry.period.frequency) ? entry.period.frequency : 'other') === group);
      return entries.length ? trackerCard(card, entries) : '';
    }).join('');
    container.innerHTML = html || '<p class="text-muted">No current benefits in this group.</p>';
  }
}

function renderByCardView() {
  const container = document.getElementById('by-card-container');
  if (!container) return;
  const cards = userCards.map(id => CARDS_DATABASE.find(card => card.id === id)).filter(Boolean);
  container.innerHTML = cards.length ? cards.map(card => trackerCard(card, trackerBenefits(card), true)).join('') : '<div class="tracker-card"><h3>No cards selected</h3><p><a href="../index.html">Add cards on your dashboard</a> to start tracking benefits.</p></div>';
  const history = Object.entries(trackedBenefits).filter(([key, value]) => key.startsWith('benefit|') && value?.completed).sort(([, a], [, b]) => (b.usedAt || '').localeCompare(a.usedAt || ''));
  if (history.length) container.innerHTML += `<details class="tracker-card"><summary>Saved benefit history (${history.length} records)</summary><p class="text-muted">History is kept across months and years. Points, nights, visits and certificates are excluded from cash totals.</p><ul>${history.map(([, record]) => {
    const card = CARDS_DATABASE.find(item => item.id === record.cardId);
    const credit = [...(card?.credits || []), ...(card?.retiredBenefits || [])].find(item => CardMaxPeriods.creditId(item) === record.creditId);
    return `<li>${trackerEscape(record.usedAt || 'Date unknown')} · ${trackerEscape(card?.name || record.cardId)} · ${trackerEscape(credit?.name || record.creditId)}${record.unit === 'USD' ? ` · ${trackerMoney(record.cashValue || 0)}` : ''}${record.dateEstimated ? ' (imported estimate)' : ''}</li>`;
  }).join('')}</ul></details>`;
}

function saveUserData() {
  localStorage.setItem('cardmax_tracked_benefits', JSON.stringify(trackedBenefits));
  trackerSnapshot.benefits = trackedBenefits;
  CardMaxAuth.autoSync();
}

function toggleBenefit(benefitKey, event) {
  if (event) event.stopPropagation();
  const entry = trackerEntries.get(benefitKey);
  if (!entry) return;
  trackedBenefits[benefitKey] = CardMaxPeriods.makeRecord(entry.card, entry.credit, entry.period, !trackedBenefits[benefitKey]?.completed);
  saveUserData();
  refreshTracker();
}

function updateStats() {
  const now = new Date();
  const entries = userCards.map(id => CARDS_DATABASE.find(card => card.id === id)).filter(Boolean).flatMap(card => trackerBenefits(card, now));
  const monthly = entries.filter(entry => entry.period.frequency === 'monthly');
  const used = monthly.reduce((sum, entry) => sum + (entry.record?.completed && entry.record.unit === 'USD' ? entry.record.cashValue || 0 : 0), 0);
  const total = monthly.reduce((sum, entry) => sum + entry.period.cashValue, 0);
  const captured = CardMaxPeriods.capturedThisYear(trackedBenefits, now);
  const stats = { 'credits-used': trackerMoney(used), 'credits-remaining': trackerMoney(Math.max(0, total - used)), 'annual-value': trackerMoney(captured.value), 'completion-rate': entries.length ? `${Math.round(entries.filter(entry => entry.record?.completed).length / entries.length * 100)}%` : '0%' };
  for (const [id, value] of Object.entries(stats)) { const element = document.getElementById(id); if (element) element.textContent = value; }
  const annual = document.getElementById('annual-value');
  if (annual) annual.title = captured.estimated ? 'Includes imported history estimated from current benefit terms. Enter actual dates and amounts to refine.' : 'Cash amounts recorded as used this calendar year. Excludes points and certificates.';
}

function switchView(view, redraw = true) {
  currentView = view === 'frequency' ? 'frequency' : 'card';
  // Input events persist edits without replacing the focused control. Rebuild
  // both views before revealing one so its hidden markup never shows old values.
  if (redraw) {
    trackerEntries.clear();
    renderBenefitTrackers();
    renderByCardView();
    updateStats();
  }
  document.querySelectorAll('.filter-btn[data-view]').forEach(button => { button.classList.toggle('active', button.dataset.view === currentView); button.setAttribute('aria-pressed', String(button.dataset.view === currentView)); });
  for (const id of ['monthly-tracker', 'quarterly-tracker', 'semiannual-tracker', 'annual-tracker', 'onetime-tracker']) { const element = document.getElementById(id); if (element) element.style.display = currentView === 'frequency' ? '' : 'none'; }
  const byCard = document.getElementById('by-card-view');
  if (byCard) byCard.style.display = currentView === 'card' ? '' : 'none';
}

function refreshTracker() {
  loadUserData();
  trackerEntries.clear();
  renderBenefitTrackers();
  renderByCardView();
  updateStats();
  switchView(currentView, false);
  const month = document.getElementById('current-month');
  if (month) month.textContent = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

document.addEventListener('DOMContentLoaded', () => {
  refreshTracker();
  CardMaxSave.renderSaveRestoreUI('save-restore-ui');
  const handleEdit = event => {
    const target = event.target;
    if (target.dataset.benefit) {
      if (event.type === 'change') toggleBenefit(target.dataset.benefit, event);
      return;
    }
    const key = target.dataset.usedDate || target.dataset.cashUsed;
    const record = trackedBenefits[key], entry = trackerEntries.get(key);
    if (!record || !entry) return;
    if (target.dataset.usedDate) {
      const error = CardMaxPeriods.usedDateError(entry.period, target.value);
      const message = target.closest('.benefit-item')?.querySelector('[data-date-error]');
      if (error) {
        if (event.type === 'change') {
          target.value = record.usedAt || '';
          target.setAttribute('aria-invalid', 'true');
          if (message) message.textContent = error + (trackerDateRange(entry.period) ? ` ${trackerDateRange(entry.period)}.` : '');
        }
        return;
      }
      target.removeAttribute('aria-invalid');
      if (message) message.textContent = '';
      record.usedAt = target.value;
      record.dateEstimated = false;
    } else {
      if (target.value === '' && event.type === 'input') return;
      const amount = Number(target.value);
      if (!Number.isFinite(amount) || amount < 0 || amount > entry.period.cashValue) {
        if (event.type === 'change') target.value = record.cashValue;
        return;
      }
      record.cashValue = amount;
    }
    saveUserData();
    // Persist each valid edit immediately without replacing the focused input.
    // The change event redraws both views once editing is complete.
    if (event.type === 'change') refreshTracker();
    else updateStats();
  };
  document.addEventListener('input', handleEdit);
  document.addEventListener('change', handleEdit);
});
window.addEventListener('cardmax-data-changed', () => { if (document.readyState !== 'loading') refreshTracker(); });
window.refreshTracker = refreshTracker;
