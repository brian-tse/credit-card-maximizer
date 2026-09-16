// CardMax — compact, keyboard-friendly card comparison.
let selectedCards = new Set();
let browseAllCards = false;
const MAX_COMPARISON_CARDS = 4;

document.addEventListener('DOMContentLoaded', () => {
  const cards = new URLSearchParams(window.location.search).get('cards');
  if (cards) CardMaxModel.normalizeCardIds(cards.split(',')).slice(0, MAX_COMPARISON_CARDS).forEach(id => selectedCards.add(id));
  renderCardPicker();
  renderComparison();
});

function pickerQuery() { return document.getElementById('card-search')?.value || ''; }
function announceComparison(message) { document.getElementById('comparison-status').textContent = message; }

function renderCardPicker(filter = pickerQuery()) {
  const container = document.getElementById('card-picker-grid');
  if (!container) return;
  const query = filter.toLowerCase().trim();
  const matches = CARDS_DATABASE.filter(card => !query || `${card.name} ${card.issuer}`.toLowerCase().includes(query));
  // A short starting list keeps the comparison within reach. Browsing/searching uses a bounded region.
  const visible = query || browseAllCards ? matches : [...CARDS_DATABASE.filter(card => selectedCards.has(card.id)), ...CARDS_DATABASE.filter(card => !selectedCards.has(card.id))].slice(0, 6);
  container.innerHTML = visible.map(card => {
    const selected = selectedCards.has(card.id);
    const cardVisual = typeof CardVisuals !== 'undefined' && CardVisuals.hasImage(card.id) ? CardVisuals.generate(card) : `<div class="card-dot" style="background:${card.color}"></div>`;
    return `<button type="button" class="card-pick-item ${selected ? 'selected' : ''}" data-pick-card="${card.id}" aria-pressed="${selected}" aria-label="Compare ${CardMaxModel.escapeHtml(card.name)}" onclick="toggleCardSelection('${card.id}')">
      ${cardVisual}<span class="card-info"><span class="card-name">${CardMaxModel.escapeHtml(card.name)}</span><span class="card-fee">${CardMaxModel.feeLabel(card)}/year</span></span><span class="check-icon" aria-hidden="true">${selected ? '✓' : '+'}</span>
    </button>`;
  }).join('') || '<p class="picker-empty">No cards match. Try a card name or issuer.</p>';
  document.getElementById('picker-result-count').textContent = query ? `${matches.length} matches` : browseAllCards ? `${matches.length} cards` : `${visible.length} suggestions`;
  const browseButton = document.getElementById('browse-picker');
  browseButton.hidden = !!query;
  browseButton.textContent = browseAllCards ? 'Show fewer cards' : 'Browse all cards';
  browseButton.setAttribute('aria-expanded', String(browseAllCards));
  updateSelectedCount();
}

function filterCards() { renderCardPicker(); }
function togglePickerBrowse() { browseAllCards = !browseAllCards; renderCardPicker(); }

function updateSelectedCount() {
  document.getElementById('selected-count').textContent = selectedCards.size;
  document.getElementById('selected-card-chips').innerHTML = selectedCards.size ? [...selectedCards].map(id => {
    const card = CARDS_DATABASE.find(item => item.id === id);
    return `<div class="selected-card-chip"><span>${CardMaxModel.escapeHtml(card.name)}</span><button type="button" data-remove-card="${id}" onclick="removeCard('${id}')" aria-label="Remove ${CardMaxModel.escapeHtml(card.name)} from comparison">×</button></div>`;
  }).join('') : '<p class="selection-placeholder">Your selected cards will stay here while you browse.</p>';
  document.getElementById('compare-selected').setAttribute('aria-disabled', String(!selectedCards.size));
  document.getElementById('share-btn').disabled = !selectedCards.size;
  document.getElementById('clear-selection').setAttribute('aria-disabled', String(!selectedCards.size));
}

function toggleCardSelection(cardId) {
  const card = CARDS_DATABASE.find(item => item.id === cardId);
  if (!card) return;
  const focusWasPicker = document.activeElement?.dataset.pickCard === cardId;
  if (selectedCards.has(cardId)) selectedCards.delete(cardId);
  else if (selectedCards.size < MAX_COMPARISON_CARDS) selectedCards.add(cardId);
  else { announceComparison('Compare up to four cards. Remove one to add another.'); return; }
  // Keep the same native button in place while its selected state changes.
  document.querySelectorAll('[data-pick-card]').forEach(button => {
    const selected = selectedCards.has(button.dataset.pickCard);
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
    button.querySelector('.check-icon').textContent = selected ? '✓' : '+';
  });
  updateSelectedCount();
  renderComparison();
  updateUrl();
  announceComparison(`${card.name} ${selectedCards.has(cardId) ? 'added' : 'removed'}. ${selectedCards.size} of four cards selected.`);
  // Programmatic callers may choose a card outside the short initial list.
  if (!document.querySelector(`[data-pick-card="${cardId}"]`) && selectedCards.has(cardId)) renderCardPicker();
  if (focusWasPicker) document.querySelector(`[data-pick-card="${cardId}"]`)?.focus({ preventScroll: true });
}

function removeCard(cardId) {
  const active = document.activeElement;
  const restore = active?.dataset.removeCard === cardId || active?.closest('.card-column-header');
  const ids = [...selectedCards], index = ids.indexOf(cardId);
  selectedCards.delete(cardId);
  renderCardPicker();
  renderComparison();
  updateUrl();
  announceComparison(`${CARDS_DATABASE.find(card => card.id === cardId)?.name || 'Card'} removed. ${selectedCards.size} cards selected.`);
  if (restore) {
    const remaining = [...selectedCards];
    const next = remaining[Math.min(Math.max(index, 0), remaining.length - 1)];
    (document.querySelector(`[data-remove-card="${next}"]`) || document.getElementById('card-search')).focus({ preventScroll: true });
  }
}

// Retained for existing links and integrations; selections always respect the readable four-card limit.
function quickSelect(preset) {
  const cards = CARDS_DATABASE.filter(card => preset === 'premium' ? CardMaxModel.annualFeeForCard(card) !== null && CardMaxModel.annualFeeForCard(card) >= 300 : card.issuer === (preset === 'chase' ? 'Chase' : 'American Express'));
  selectedCards = new Set(cards.slice(0, MAX_COMPARISON_CARDS).map(card => card.id));
  renderCardPicker(); renderComparison(); updateUrl();
}

function clearSelection() {
  selectedCards.clear();
  renderCardPicker(); renderComparison(); updateUrl();
  announceComparison('Comparison cleared. Search for cards to start again.');
  document.getElementById('card-search').focus({ preventScroll: true });
}

function showComparison(event) {
  event?.preventDefault();
  if (!selectedCards.size) { document.getElementById('card-search').focus(); return; }
  const comparison = document.getElementById('comparison-container');
  comparison.scrollIntoView?.({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  comparison.focus({ preventScroll: true });
}

function applyDifferenceFilter() {
  const enabled = document.getElementById('differences-only').checked;
  document.querySelectorAll('.comparison-table tbody tr').forEach(row => {
    const cells = [...row.querySelectorAll('td:not(.row-label)')];
    const values = cells.map(cell => cell.textContent.replace(/\s+/g, ' ').trim());
    row.hidden = enabled && values.length > 1 && values.every(value => value === values[0]);
  });
}

// Update URL for sharing
function updateUrl() {
  if (selectedCards.size > 0) {
    const cardIds = Array.from(selectedCards).join(',');
    const newUrl = `${window.location.pathname}?cards=${cardIds}`;
    window.history.replaceState({}, '', newUrl);
  } else {
    window.history.replaceState({}, '', window.location.pathname);
  }
}

// Copy shareable link
function copyShareLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const btn = document.getElementById('share-btn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.textContent = originalText, 2000);
  }).catch(() => announceComparison('Could not copy automatically. Copy the address from your browser to share this comparison.'));
}

// Render the comparison table
function renderComparison() {
  const container = document.getElementById('comparison-container');
  if (!container) return;

  if (selectedCards.size === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Select cards to compare</h3>
        <p>Click on cards above to add them to your comparison table</p>
      </div>
    `;
    return;
  }

  const cards = Array.from(selectedCards).map(id => CARDS_DATABASE.find(c => c.id === id)).filter(Boolean);

  // Calculate comparison metrics
  const fees = cards.map(c => CardMaxModel.annualCostForCard(c));
  const minFee = Math.min(...fees.filter(Number.isFinite));

  const totalCredits = cards.map(card => CardMaxModel.annualCashValue(card));
  const maxCredits = Math.max(...totalCredits);

  const netValues = cards.map((c, i) => fees[i] === null ? null : totalCredits[i] - fees[i]);
  const maxNet = Math.max(...netValues.filter(Number.isFinite));

  const baseEarns = cards.map(c => c.earning.base);
  const maxBase = Math.max(...baseEarns);

  // Find shared transfer partners
  const allPartners = cards.map(c => new Set(c.transferPartners.map(p => p.name)));
  const sharedPartners = allPartners.length > 1
    ? [...allPartners[0]].filter(p => allPartners.every(set => set.has(p)))
    : [];

  container.innerHTML = `
    <details class="comparison-assumptions"><summary>How to read these estimates</summary><p class="terms-note">Cash totals are annualized credit caps, assuming full eligible use. Multi-year reimbursements are spread over their full period. Points, restricted rewards, nights, certificates, unverified terms and conditional or per-use benefits are excluded from cash totals. Required membership costs are included in net totals. Terms and eligibility may differ for existing cardholders.</p></details>
    <div class="comparison-table-wrapper" role="region" aria-label="Card comparison table; scroll for more benefits" tabindex="0">
      <table class="comparison-table" style="min-width:${Math.max(660, cards.length * 240 + 140)}px">
        <caption class="sr-only">Selected credit cards, fees, benefits, and earning rates</caption>
        <thead>
          <tr>
            <th scope="col">Card details</th>
            ${cards.map(card => `
              <th scope="col" class="card-column-header" style="border-color: ${card.color}">
                <div class="issuer">${card.issuer}</div>
                <div class="name">${card.name}</div>
                <div class="comparison-review-status">${card.verifiedAt ? 'Verified' : card.reviewedAt ? 'Partial review · Check terms' : 'Not yet verified'}${card.acceptingApplications === false || card.applicationStatus === 'closed' ? '<br>Closed to new applications' : ''}</div>
                <button class="remove-btn" data-remove-card="${card.id}" onclick="removeCard('${card.id}')" aria-label="Remove ${CardMaxModel.escapeHtml(card.name)} from comparison">✕</button>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <!-- Annual Fee -->
          <tr>
            <td class="row-label">Annual Fee</td>
            ${cards.map((card, i) => `
              <td class="value-cell">
                <div class="value-big ${fees[i] === minFee ? 'value-best' : ''}">${CardMaxModel.feeLabel(card)}</div>
              </td>
            `).join('')}
          </tr>

          <!-- Total Credits -->
          <tr>
            <td class="row-label">Annualized cash caps</td>
            ${cards.map((card, i) => `
              <td class="value-cell">
                <div class="value-big ${totalCredits[i] === maxCredits ? 'value-best' : ''}">${CardMaxModel.money(totalCredits[i])}</div>
              </td>
            `).join('')}
          </tr>

          <!-- Net Value -->
          <tr>
            <td class="row-label">Cash caps minus annual cost<br><span style="font-size: 0.7rem; font-weight: 400;">(Assumes full use)</span></td>
            ${cards.map((card, i) => `
              <td class="value-cell">
                <div class="value-big ${netValues[i] === maxNet ? 'value-best' : ''}" style="${netValues[i] < 0 ? 'color: var(--accent-orange)' : ''}">
                  ${CardMaxModel.money(netValues[i])}
                </div>
              </td>
            `).join('')}
          </tr>

          <tr>
            <td class="row-label">Welcome offer</td>
            ${cards.map(card => `
              <td class="value-cell">
                ${CardMaxModel.sourceLink(card, 'Check current issuer offer')}
                <div class="value-note">Offers and eligibility change.</div>
              </td>
            `).join('')}
          </tr>

          <!-- Base Earning -->
          <tr>
            <td class="row-label">Base Earning</td>
            ${cards.map((card, i) => `
              <td class="value-cell">
                <div class="value-big ">${CardMaxModel.earningLabel(card)}</div>
                <div class="value-note">on all purchases</div>
              </td>
            `).join('')}
          </tr>

          <!-- Bonus Categories -->
          <tr>
            <td class="row-label">Bonus Categories</td>
            ${cards.map(card => `
              <td>
                <ul class="category-list">
                  ${CardMaxModel.earningCategories(card).map(cat => `
                    <li>
                      <span>${cat.category}<small class="terms-note">${cat.description}</small>${CardMaxModel.termsHtml(cat)}</span>
                      <span class="multiplier">${CardMaxModel.earningLabel(card, cat)}</span>
                    </li>
                  `).join('')}
                </ul>
              </td>
            `).join('')}
          </tr>

          <!-- Credits Breakdown -->
          <tr>
            <td class="row-label">Credits Breakdown</td>
            ${cards.map(card => `
              <td>
                <ul class="credit-list">
                  ${card.credits.map(credit => `
                    <li>
                      <span>${credit.name}<small class="terms-note">${credit.description}</small><small class="terms-note">${CardMaxModel.periodLabel(credit)}</small>${CardMaxModel.termsHtml(credit)}</span>
                      <span class="amount">${CardMaxModel.formatCredit(credit)}</span>
                    </li>
                  `).join('')}
                </ul>
              </td>
            `).join('')}
          </tr>

          <!-- Transfer Partners -->
          <tr>
            <td class="row-label">Transfer Partners<br><span style="font-size: 0.7rem; font-weight: 400;">(${sharedPartners.length} shared)</span></td>
            ${cards.map(card => `
              <td>
                <div class="partner-tags">
                  ${card.transferPartners.map(p => `
                    <span class="partner-tag ${sharedPartners.includes(p.name) ? 'shared' : ''}">${p.name} ${CardMaxModel.escapeHtml(CardMaxModel.transferLabel(p))}${p.description ? `<span class="terms-note">${CardMaxModel.escapeHtml(p.description)}</span>` : ''}${CardMaxModel.termsHtml(p)}</span>
                  `).join('')}
                </div>
              </td>
            `).join('')}
          </tr>

          <!-- Lounge Access -->
          <tr>
            <td class="row-label">Lounge Access</td>
            ${cards.map(card => {
              const lounges = card.perks.filter(p => p.type === 'lounge');
              return `
                <td>
                  ${lounges.length > 0 ? lounges.map(l => `
                    <div class="perk-item has">✓ ${l.name}<span class="terms-note">${l.description}${CardMaxModel.termsHtml(l)}</span></div>
                  `).join('') : '<div class="perk-item no">✗ None</div>'}
                </td>
              `;
            }).join('')}
          </tr>

          <!-- Hotel Status -->
          <tr>
            <td class="row-label">Hotel Status</td>
            ${cards.map(card => {
              const status = card.perks.filter(p => p.type === 'status');
              return `
                <td>
                  ${status.length > 0 ? status.map(s => `
                    <div class="perk-item has">✓ ${s.name}<span class="terms-note">${s.description}${CardMaxModel.termsHtml(s)}</span></div>
                  `).join('') : '<div class="perk-item no">✗ None</div>'}
                </td>
              `;
            }).join('')}
          </tr>

          <!-- Insurance -->
          <tr>
            <td class="row-label">Key Insurance</td>
            ${cards.map(card => {
              const insurance = card.perks.filter(p => p.type === 'insurance');
              return `
                <td>
                  ${insurance.length > 0 ? insurance.slice(0, 3).map(i => `
                    <div class="perk-item has">✓ ${i.name}<span class="terms-note">${i.description}</span></div>
                  `).join('') : '<div class="perk-item no">✗ None</div>'}
                </td>
              `;
            }).join('')}
          </tr>

          <tr><td class="row-label">Source review</td>${cards.map(card => `<td>${CardMaxModel.statusHtml(card, { includeTerms: true })}</td>`).join('')}</tr>
        </tbody>
      </table>
    </div>

  `;
  applyDifferenceFilter();
}

// Get "Best For" recommendation
function getBestFor(card) {
  const recommendations = [];

  if (card.earning.base >= 2) recommendations.push('everyday spending');

  const hasDining = CardMaxModel.earningCategories(card).some(c =>
    c.category.toLowerCase().includes('dining') || c.category.toLowerCase().includes('restaurant')
  );
  if (hasDining) recommendations.push('dining');

  const hasTravel = CardMaxModel.earningCategories(card).some(c =>
    c.category.toLowerCase().includes('travel') || c.category.toLowerCase().includes('flight')
  );
  if (hasTravel) recommendations.push('travel');

  const hasLounge = card.perks.some(p => p.type === 'lounge');
  if (hasLounge) recommendations.push('lounge access');

  if (CardMaxModel.annualCostForCard(card) !== null && CardMaxModel.annualCostForCard(card) < 200) recommendations.push('low fee');

  return recommendations.slice(0, 2).join(', ') || 'general rewards';
}
