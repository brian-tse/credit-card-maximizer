// CardMax - Main Application Logic

// State
let activeFilter = 'all';
let currentModalCard = null;
let currentSearchQuery = '';

// Get user's cards from localStorage
function getUserCards() {
  return CardMaxModel.loadCardIds();
}

// Quick add card to collection
function quickAddCard(cardId, event) {
  event?.stopPropagation();
  const card = CARDS_DATABASE.find(c => c.id === cardId);
  if (!card) return false;
  const userCards = getUserCards();
  if (!userCards.includes(cardId)) {
    userCards.push(cardId);
    try { localStorage.setItem('cardmax_user_cards', JSON.stringify(userCards)); }
    catch (_) { showQuickAddToast('Could not save this card. Please try again.'); return false; }
    if (typeof CardMaxAuth !== 'undefined') CardMaxAuth.autoSync();
    showQuickAddToast(`${card.name} added to My Cards`);
    // Update only this action so keyboard focus and open source disclosures survive.
    document.querySelectorAll(`[data-add-card="${cardId}"]`).forEach(button => {
      button.classList.add('added');
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('aria-label', `${card.name} is in My Cards`);
      button.textContent = '✓ In My Cards';
    });
  }
  updateAddButton();
  return true;
}

function updateAddButton() {
  const btn = document.getElementById('add-to-collection-btn');
  if (!btn) return;
  const added = !!currentModalCard && getUserCards().includes(currentModalCard.id);
  btn.textContent = added ? 'In My Cards' : 'Add to My Cards';
  const moveFocus = added && document.activeElement === btn;
  btn.disabled = !currentModalCard || added;
  btn.setAttribute('aria-disabled', String(added));
  if (moveFocus) document.querySelector('#card-modal .modal-close')?.focus({ preventScroll: true });
}

function addToCollection() {
  if (currentModalCard) quickAddCard(currentModalCard.id);
}

// Show toast notification
function showQuickAddToast(message) {
  const existing = document.querySelector('.quick-add-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'quick-add-toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--text);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 10000;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  setupFilterListeners();
  setupModalListeners();
  updateStats();
});

// Search cards function
function searchCards() {
  const searchInput = document.getElementById('card-search');
  if (!searchInput) return;

  currentSearchQuery = searchInput.value.toLowerCase().trim();
  renderCards(activeFilter);
}

// Render all cards
function renderCards(filter = 'all') {
  const container = document.getElementById('cards-container');
  if (!container) return;

  let filteredCards = CARDS_DATABASE;

  // Apply category filter
  if (filter === 'premium') {
    filteredCards = CARDS_DATABASE.filter(card => CardMaxModel.annualFeeForCard(card) !== null && CardMaxModel.annualFeeForCard(card) >= 400);
  } else if (filter === 'midtier') {
    filteredCards = CARDS_DATABASE.filter(card => CardMaxModel.annualFeeForCard(card) !== null && CardMaxModel.annualFeeForCard(card) >= 100 && CardMaxModel.annualFeeForCard(card) < 400);
  } else if (filter === 'nofee') {
    filteredCards = CARDS_DATABASE.filter(card => CardMaxModel.annualFeeForCard(card) === 0);
  } else if (filter === 'business') {
    filteredCards = CARDS_DATABASE.filter(card => card.cardType === 'business');
  } else if (filter === 'personal') {
    filteredCards = CARDS_DATABASE.filter(card => card.cardType !== 'business');
  } else if (filter !== 'all') {
    filteredCards = CARDS_DATABASE.filter(card => card.issuer === filter);
  }

  // Apply search filter
  if (currentSearchQuery) {
    filteredCards = filteredCards.filter(card => {
      const searchText = currentSearchQuery;
      // Search in card name
      if (card.name.toLowerCase().includes(searchText)) return true;
      // Search in issuer
      if (card.issuer.toLowerCase().includes(searchText)) return true;
      // Search in earning categories
      if (card.earning.categories.some(cat => cat.category.toLowerCase().includes(searchText))) return true;
      // Search in credits
      if (card.credits.some(credit => credit.name.toLowerCase().includes(searchText))) return true;
      // Search in perks
      if (card.perks.some(perk => perk.name.toLowerCase().includes(searchText))) return true;
      // Search in transfer partners
      if (card.transferPartners.some(partner => partner.name.toLowerCase().includes(searchText))) return true;
      return false;
    });
  }

  const userCards = getUserCards();

  container.innerHTML = filteredCards.map((card, index) => {
    const cardVisual = typeof CardVisuals !== 'undefined' ? CardVisuals.generate(card) : '';
    const isInCollection = userCards.includes(card.id);
    return `
    <article class="credit-card fade-in" style="animation-delay: ${Math.min(index, 8) * 0.03}s">
      <div class="card-header" style="background: ${card.color}; color: ${CardMaxModel.contrastText(card.color)};">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;">
          <div>
            <div class="card-issuer">${card.issuer}${card.cardType === 'business' ? ' <span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem;">BUSINESS</span>' : ''}</div>
            <div class="card-name">${card.name}</div>
          </div>
          ${cardVisual}
        </div>
      </div>
      <div class="card-body">
        <div class="card-fee">
          <span class="fee-label">Annual Fee</span>
          <span class="fee-value">${CardMaxModel.feeLabel(card)}</span>
        </div>

        <div class="earning-rates">
          <h4>Top Earning Categories</h4>
          ${CardMaxModel.earningCategories(card).slice(0, 3).map(cat => `
            <div class="rate-item">
              <span class="rate-category">${cat.category}</span>
              <span class="rate-multiplier">${CardMaxModel.earningLabel(card, cat)}</span>
            </div>
          `).join('')}
        </div>

        <div class="credits-section">
          <h4 style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Key Credits</h4>
          ${card.credits.filter(credit => CardMaxModel.activeBenefit(credit)).slice(0, 2).map(credit => `
            <div class="credit-item">
              <span class="credit-name">${credit.name}${credit.conditional || credit.annualValueExcluded ? '<small class="terms-note">Eligibility conditions apply</small>' : ''}</span>
              <span class="credit-value">${credit.verificationStatus === 'needs-review' ? 'Terms unconfirmed' : CardMaxModel.formatCredit(credit)}</span>
            </div>
          `).join('')}
        </div>

        ${CardMaxModel.statusHtml(card)}
        <div class="catalog-card-actions">
          <button class="btn btn-primary" onclick="openCardModal('${card.id}')" aria-label="View ${CardMaxModel.escapeHtml(card.name)} details">View details</button>
          <button class="btn btn-secondary ${isInCollection ? 'added' : ''}" data-add-card="${card.id}" onclick="quickAddCard('${card.id}', event)" aria-label="${CardMaxModel.escapeHtml(isInCollection ? `${card.name} is in My Cards` : `Add ${card.name} to My Cards`)}" aria-disabled="${isInCollection}">${isInCollection ? '✓ In My Cards' : '+ My Cards'}</button>
        </div>
      </div>
    </article>
  `}).join('');
  const count = document.getElementById('catalog-result-count');
  if (count) count.textContent = `${filteredCards.length} ${filteredCards.length === 1 ? 'card' : 'cards'}${currentSearchQuery ? ` matching “${currentSearchQuery}”` : ''}`;

  // Show "no results" message if empty
  if (filteredCards.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="margin-bottom: 0.5rem;">No cards found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    `;
  }
}

// Setup filter button listeners
function setupFilterListeners() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      activeFilter = btn.dataset.filter;
      renderCards(activeFilter);
    });
  });
}

// Modal functions
function openCardModal(cardId) {
  const card = CARDS_DATABASE.find(c => c.id === cardId);
  if (!card) return;

  currentModalCard = card;
  document.getElementById('modal-card-name').textContent = card.name;
  activateModalTab('overview');
  updateAddButton();
  CardMaxDialogs.open('card-modal');
}

function closeModal() {
  CardMaxDialogs.close('card-modal');
  currentModalCard = null;
}

function setupModalListeners() {
  // Close modal on overlay click
  document.getElementById('card-modal')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal();
    }
  });

  // Tab switching
  const tabs = [...document.querySelectorAll('#card-modal .tab')];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateModalTab(tab.dataset.tab));
    tab.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
      if (next === null) return;
      event.preventDefault();
      activateModalTab(tabs[next].dataset.tab);
      tabs[next].focus();
    });
  });
}

function activateModalTab(name) {
  document.querySelectorAll('#card-modal .tab').forEach(tab => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  renderModalContent(name);
  const panel = document.getElementById('modal-content');
  panel.setAttribute('aria-labelledby', `tab-${name}`);
  panel.scrollTop = 0;
}

function renderModalContent(tabName) {
  const card = currentModalCard;
  if (!card) return;

  const container = document.getElementById('modal-content');
  let content = '';

  switch (tabName) {
    case 'overview':
      content = `
        <div class="overview-facts">
          <div class="stat-card">
            <div class="stat-label">Annual Fee</div>
            <div class="stat-value" style="color: var(--accent-orange);">${CardMaxModel.feeLabel(card)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Welcome Offer</div>
            <p>Offers change and may depend on eligibility.</p>
            <p>${CardMaxModel.sourceLink(card, 'Check the current issuer offer')}</p>
          </div>
          <div class="stat-card">
            <div class="stat-label">Base Earning</div>
            <div class="stat-value">${CardMaxModel.earningLabel(card)}</div>
            <div class="text-muted" style="font-size: 0.875rem;">on all other purchases</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Network</div>
            <div class="stat-value" style="font-size: 1.25rem;">${card.network}</div>
          </div>
        </div>
      `;
      break;

    case 'earning':
      content = `
        <div class="earning-rates">
          <h4 style="margin-bottom: 1rem;">Bonus Categories</h4>
          ${CardMaxModel.earningCategories(card).map(cat => `
            <div class="rate-item" style="padding: 1rem; background: var(--bg-card); border-radius: 8px; margin-bottom: 0.5rem;">
              <div>
                <div class="rate-category" style="font-weight: 600;">${cat.category}</div>
                <div class="text-muted" style="font-size: 0.75rem; margin-top: 0.25rem;">${cat.description}${CardMaxModel.termsHtml(cat)}</div>
              </div>
              <span class="rate-multiplier">${CardMaxModel.earningLabel(card, cat)}</span>
            </div>
          `).join('')}
          <div class="rate-item" style="padding: 1rem; background: var(--bg-card); border-radius: 8px; opacity: 0.7;">
            <div class="rate-category">Everything Else</div>
            <span class="rate-multiplier" style="background: rgba(148, 163, 184, 0.2); color: var(--text-secondary);">${CardMaxModel.earningLabel(card)}</span>
          </div>
        </div>
      `;
      break;

    case 'partners':
      const airlines = card.transferPartners.filter(p => p.type === 'airline');
      const hotels = card.transferPartners.filter(p => p.type === 'hotel');
      content = `
        <div style="display: grid; gap: 1.5rem;">
          <div>
            <h4 style="margin-bottom: 0.75rem; color: var(--text-secondary);">✈️ Airlines (${airlines.length})</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${airlines.map(p => `
                <span style="padding: 0.5rem 1rem; background: var(--bg-card); border-radius: 20px; font-size: 0.875rem;">
                  ${p.name} <span style="color: var(--accent-green);">${CardMaxModel.escapeHtml(CardMaxModel.transferLabel(p))}</span>${p.description ? `<span class="terms-note">${CardMaxModel.escapeHtml(p.description)}</span>` : ''}${CardMaxModel.termsHtml(p)}
                </span>
              `).join('')}
            </div>
          </div>
          <div>
            <h4 style="margin-bottom: 0.75rem; color: var(--text-secondary);">🏨 Hotels (${hotels.length})</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${hotels.map(p => `
                <span style="padding: 0.5rem 1rem; background: var(--bg-card); border-radius: 20px; font-size: 0.875rem;">
                  ${p.name} <span style="color: var(--accent-green);">${CardMaxModel.escapeHtml(CardMaxModel.transferLabel(p))}</span>${p.description ? `<span class="terms-note">${CardMaxModel.escapeHtml(p.description)}</span>` : ''}${CardMaxModel.termsHtml(p)}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      break;

    case 'credits':
      const totalDollarCredits = CardMaxModel.annualCashValue(card);
      content = `
        <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--bg-card); border-radius: 8px;">
          <div class="text-muted" style="font-size: 0.875rem;">Annualized cash credit caps</div>
          <div style="font-size: 2rem; font-weight: 700; color: var(--accent-green);">${CardMaxModel.money(totalDollarCredits)}</div>
          <div class="text-muted" style="font-size: 0.875rem;">Cash caps minus ${CardMaxModel.money(CardMaxModel.annualCostForCard(card))} annual cost: <strong>${CardMaxModel.money(CardMaxModel.annualCostForCard(card) === null ? null : totalDollarCredits - CardMaxModel.annualCostForCard(card))}</strong></div>
          <p class="terms-note">Assumes every eligible credit is used. Multi-year reimbursements are spread over their full period; points, restricted rewards, nights, certificates, unverified terms and conditional or per-use benefits are excluded. Required membership costs are included. This is not guaranteed savings.</p>
        </div>
        <div>
          ${card.credits.map(credit => `
            <div class="benefit-item" style="cursor: default;">
              <div class="benefit-content">
                <div class="benefit-text">${credit.name}</div>
                <div class="benefit-description">${credit.description}</div>
                <div style="font-size: 0.75rem; color: var(--accent-purple); margin-top: 0.25rem;">
                  ${CardMaxModel.periodLabel(credit)}${CardMaxModel.termsHtml(credit)}
                </div>
              </div>
              <div class="benefit-value">${CardMaxModel.formatCredit(credit)}</div>
            </div>
          `).join('')}
        </div>
      `;
      break;

    case 'perks':
      const perksByType = {};
      card.perks.forEach(perk => {
        if (!perksByType[perk.type]) perksByType[perk.type] = [];
        perksByType[perk.type].push(perk);
      });

      const typeIcons = {
        lounge: '🛋️',
        insurance: '🛡️',
        status: '⭐',
        travel: '✈️',
        redemption: '💎',
        points: '🎁'
      };

      content = `
        <div style="display: grid; gap: 1rem;">
          ${Object.entries(perksByType).map(([type, perks]) => `
            <div>
              <h4 style="margin-bottom: 0.75rem; color: var(--text-secondary); text-transform: capitalize;">
                ${typeIcons[type] || '📦'} ${type}
              </h4>
              ${perks.map(perk => `
                <div style="padding: 1rem; background: var(--bg-card); border-radius: 8px; margin-bottom: 0.5rem;">
                  <div style="font-weight: 600;">${perk.name}</div>
                  <div class="text-muted" style="font-size: 0.875rem; margin-top: 0.25rem;">${perk.description}${CardMaxModel.termsHtml(perk)}</div>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      `;
      break;
  }

  container.innerHTML = content + (card.id.startsWith('bilt-') ? '<a class="btn btn-secondary bilt-calculator-link" href="../bilt/">Explore Bilt housing rewards →</a>' : '') + CardMaxModel.statusHtml(card, { includeTerms: true });
}

// Update stats
function updateStats() {
  const totalCards = CARDS_DATABASE.length;
  document.getElementById('total-cards').textContent = totalCards;
  // The catalog leads with discovery; database-wide marketing totals are omitted.

}

// Utility functions for other pages
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function getCardById(id) {
  return CARDS_DATABASE.find(card => card.id === id);
}

// Export for use in other pages
window.CardMax = {
  getCardById,
  formatCurrency,
  CARDS_DATABASE
};

window.addEventListener('cardmax-data-changed', () => { renderCards(activeFilter); updateAddButton(); });
