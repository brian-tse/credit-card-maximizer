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
    cards.split(',').forEach(id => {
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

  container.innerHTML = filteredCards.map(card => `
    <div class="card-pick-item ${selectedCards.has(card.id) ? 'selected' : ''}"
         onclick="toggleCardSelection('${card.id}')">
      <div class="card-dot" style="background: ${card.color}"></div>
      <div class="card-info">
        <div class="card-name">${card.name}</div>
        <div class="card-fee">$${card.annualFee}/year</div>
      </div>
      <div class="check-icon">${selectedCards.has(card.id) ? '✓' : ''}</div>
    </div>
  `).join('');

  updateSelectedCount();
}

// Filter cards based on search
function filterCards() {
  const searchValue = document.getElementById('card-search').value;
  renderCardPicker(searchValue);
}

// Toggle card selection
function toggleCardSelection(cardId) {
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

  const totalCredits = cards.map(c =>
    c.credits.reduce((sum, cr) => sum + (typeof cr.amount === 'number' ? cr.amount : 0), 0)
  );
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
    <div class="comparison-table-wrapper">
      <table class="comparison-table">
        <thead>
          <tr>
            <th></th>
            ${cards.map(card => `
              <th class="card-column-header" style="border-color: ${card.color}">
                <div class="issuer">${card.issuer}</div>
                <div class="name">${card.name}</div>
                <button class="remove-btn" onclick="removeCard('${card.id}')" title="Remove from comparison">✕</button>
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
            <td class="row-label">Total Credits Value</td>
            ${cards.map((card, i) => `
              <td class="value-cell">
                <div class="value-big ${totalCredits[i] === maxCredits ? 'value-best' : ''}">\$${totalCredits[i]}</div>
              </td>
            `).join('')}
          </tr>

          <!-- Net Value -->
          <tr>
            <td class="row-label">Net Value<br><span style="font-size: 0.7rem; font-weight: 400;">(Credits − Fee)</span></td>
            ${cards.map((card, i) => `
              <td class="value-cell">
                <div class="value-big ${netValues[i] === maxNet ? 'value-best' : ''}" style="${netValues[i] < 0 ? 'color: var(--accent-orange)' : ''}">
                  ${netValues[i] >= 0 ? '+' : ''}\$${netValues[i]}
                </div>
              </td>
            `).join('')}
          </tr>

          <!-- Sign-Up Bonus -->
          <tr>
            <td class="row-label">Sign-Up Bonus</td>
            ${cards.map(card => `
              <td class="value-cell">
                <div class="value-big">${card.signUpBonus.amount.toLocaleString()}</div>
                <div class="value-note">${card.signUpBonus.currency}</div>
                <div class="value-note">\$${card.signUpBonus.spendRequirement.toLocaleString()} in ${card.signUpBonus.timeframe}</div>
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
                      <span>${credit.name}</span>
                      <span class="amount">${typeof credit.amount === 'number' ? '\$' + credit.amount : credit.amount}</span>
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
                    <span class="partner-tag ${sharedPartners.includes(p.name) ? 'shared' : ''}">${p.name}</span>
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
                    <div class="perk-item has">✓ ${l.name}</div>
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
                    <div class="perk-item has">✓ ${s.name}</div>
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
                    <div class="perk-item has">✓ ${i.name}</div>
                  `).join('') : '<div class="perk-item no">✗ None</div>'}
                </td>
              `;
            }).join('')}
          </tr>

        </tbody>
      </table>
    </div>

    <!-- Summary Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 2rem;">
      ${cards.map(card => {
        const bestFor = getBestFor(card);
        return `
          <div style="background: var(--bg-secondary); border-radius: var(--radius); padding: 1.5rem; text-align: center; border-top: 4px solid ${card.color};">
            <h4 style="margin-bottom: 0.5rem;">${card.name}</h4>
            <p style="font-size: 0.875rem; color: var(--text-secondary);">Best for: ${bestFor}</p>
          </div>
        `;
      }).join('')}
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
