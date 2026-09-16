// CardMax - Card Comparison Logic (v2 - Multi-select)

// State
let selectedCards = new Set();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderCardPicker();

  // Check for URL params (for shareable links)
  const urlParams = new URLSearchParams(window.location.search);
  const cards = urlParams.get('cards');
  if (cards) {
    CardMaxModel.normalizeCardIds(cards.split(',')).forEach(id => {
      if (CARDS_DATABASE.find(c => c.id === id)) {
        selectedCards.add(id);
      }
    });
    renderCardPicker();
    renderComparison();
  }
});

// Render the card picker grid
function renderCardPicker(filter = '') {
  const container = document.getElementById('card-picker-grid');
  if (!container) return;

  const filterLower = filter.toLowerCase();
  const filteredCards = CARDS_DATABASE.filter(card =>
    filter === '' ||
    card.name.toLowerCase().includes(filterLower) ||
    card.issuer.toLowerCase().includes(filterLower)
  );

  container.innerHTML = filteredCards.map(card => {
    const cardVisual = typeof CardVisuals !== 'undefined' && CardVisuals.hasImage(card.id)
      ? CardVisuals.generate(card)
      : `<div class="card-dot" style="background: ${card.color}"></div>`;
    return `
    <button type="button" class="card-pick-item ${selectedCards.has(card.id) ? 'selected' : ''}" aria-pressed="${selectedCards.has(card.id)}" aria-label="Compare ${CardMaxModel.escapeHtml(card.name)}"
         onclick="toggleCardSelection('${card.id}')">
      ${cardVisual}
      <div class="card-info">
        <div class="card-name">${card.name}</div>
        <div class="card-fee">$${card.annualFee}/year</div>
      </div>
      <span class="check-icon" aria-hidden="true">${selectedCards.has(card.id) ? '✓' : ''}</span>
    </button>
  `}).join('');

  updateSelectedCount();
}

// Filter cards based on search
function filterCards() {
  const searchValue = document.getElementById('card-search').value;
  renderCardPicker(searchValue);
}

// Toggle card selection
function toggleCardSelection(cardId) {
  if (!CARDS_DATABASE.some(card => card.id === cardId)) return;
  if (selectedCards.has(cardId)) {
    selectedCards.delete(cardId);
  } else {
    selectedCards.add(cardId);
  }

  renderCardPicker(document.getElementById('card-search').value);
  renderComparison();
  updateUrl();
}

// Remove card from comparison (from table header)
function removeCard(cardId) {
  selectedCards.delete(cardId);
  renderCardPicker(document.getElementById('card-search').value);
  renderComparison();
  updateUrl();
}

// Update selected count display
function updateSelectedCount() {
  document.getElementById('selected-count').textContent = selectedCards.size;
}

// Quick select presets
function quickSelect(preset) {
  selectedCards.clear();

  switch (preset) {
    case 'premium':
      CARDS_DATABASE.filter(c => c.annualFee >= 300).forEach(c => selectedCards.add(c.id));
      break;
    case 'chase':
      CARDS_DATABASE.filter(c => c.issuer === 'Chase').forEach(c => selectedCards.add(c.id));
      break;
    case 'amex':
      CARDS_DATABASE.filter(c => c.issuer === 'American Express').forEach(c => selectedCards.add(c.id));
      break;
  }

  renderCardPicker(document.getElementById('card-search').value);
  renderComparison();
  updateUrl();
}

// Clear all selections
function clearSelection() {
  selectedCards.clear();
  renderCardPicker(document.getElementById('card-search').value);
  renderComparison();
  updateUrl();
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
  });
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
  const fees = cards.map(c => c.annualFee);
  const minFee = Math.min(...fees);

  const totalCredits = cards.map(card => CardMaxModel.annualCashValue(card));
  const maxCredits = Math.max(...totalCredits);

  const netValues = cards.map((c, i) => totalCredits[i] - c.annualFee);
  const maxNet = Math.max(...netValues);

  const baseEarns = cards.map(c => c.earning.base);
  const maxBase = Math.max(...baseEarns);

  // Find shared transfer partners
  const allPartners = cards.map(c => new Set(c.transferPartners.map(p => p.name)));
  const sharedPartners = allPartners.length > 1
    ? [...allPartners[0]].filter(p => allPartners.every(set => set.has(p)))
    : [];

  container.innerHTML = `
    <p class="terms-note">Cash totals are annualized credit caps, assuming full eligible use. Multi-year reimbursements are spread over their full period. Points, nights, certificates and per-use benefits are shown separately and excluded from cash totals. Terms and eligibility may differ for existing cardholders.</p>
    <div class="comparison-table-wrapper">
      <table class="comparison-table">
        <caption class="sr-only">Selected credit cards, fees, benefits, and earning rates</caption>
        <thead>
          <tr>
            <th></th>
            ${cards.map(card => `
              <th class="card-column-header" style="border-color: ${card.color}">
                <div class="issuer">${card.issuer}</div>
                <div class="name">${card.name}</div>
                ${CardMaxModel.statusHtml(card)}${CardMaxModel.termsHtml(card)}
                <button class="remove-btn" onclick="removeCard('${card.id}')" aria-label="Remove ${CardMaxModel.escapeHtml(card.name)} from comparison">✕</button>
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
                <div class="value-big ${fees[i] === minFee ? 'value-best' : ''}">\$${card.annualFee}</div>
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
            <td class="row-label">Cash caps minus fee<br><span style="font-size: 0.7rem; font-weight: 400;">(Assumes full use)</span></td>
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
                <div class="value-big ${baseEarns[i] === maxBase ? 'value-best' : ''}">${card.earning.base}x</div>
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
                  ${card.earning.categories.map(cat => `
                    <li>
                      <span>${cat.category}</span>
                      <span class="multiplier">${cat.multiplier}x</span>
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
                      <span>${credit.name}<small class="terms-note">${CardMaxModel.periodLabel(credit)}</small>${CardMaxModel.termsHtml(credit)}</span>
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
                    <span class="partner-tag ${sharedPartners.includes(p.name) ? 'shared' : ''}">${p.name} ${p.ratio}${p.description ? `<span class="terms-note">${CardMaxModel.escapeHtml(p.description)}</span>` : ''}${CardMaxModel.termsHtml(p)}</span>
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
                    <div class="perk-item has">✓ ${l.name}<span class="terms-note">${l.description}</span></div>
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
                    <div class="perk-item has">✓ ${s.name}<span class="terms-note">${s.description}</span></div>
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

        </tbody>
      </table>
    </div>

    <!-- Summary Cards -->
    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
      <div style="width: 140px; min-width: 140px; flex-shrink: 0;"></div>
      <div style="display: grid; grid-template-columns: repeat(${cards.length}, 1fr); gap: 1rem; flex: 1;">
        ${cards.map(card => {
          const bestFor = getBestFor(card);
          return `
            <div style="background: var(--surface); border-radius: var(--radius); padding: 1.25rem; text-align: center; border-top: 4px solid ${card.color}; border: 1px solid var(--border);">
              <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem;">${card.name}</h4>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Best for: ${bestFor}</p>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Get "Best For" recommendation
function getBestFor(card) {
  const recommendations = [];

  if (card.earning.base >= 2) recommendations.push('everyday spending');

  const hasDining = card.earning.categories.some(c =>
    c.category.toLowerCase().includes('dining') || c.category.toLowerCase().includes('restaurant')
  );
  if (hasDining) recommendations.push('dining');

  const hasTravel = card.earning.categories.some(c =>
    c.category.toLowerCase().includes('travel') || c.category.toLowerCase().includes('flight')
  );
  if (hasTravel) recommendations.push('travel');

  const hasLounge = card.perks.some(p => p.type === 'lounge');
  if (hasLounge) recommendations.push('lounge access');

  if (card.annualFee < 200) recommendations.push('low fee');

  return recommendations.slice(0, 2).join(', ') || 'general rewards';
}
