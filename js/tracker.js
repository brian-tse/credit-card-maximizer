// CardMax - Benefit Tracker Logic

// State
let userCards = [];
let trackedBenefits = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  renderCardSelector();
  renderBenefitTrackers();
  renderRenewalDates();
  updateStats();
  setCurrentMonth();

  // Initialize save/restore UI if available
  if (typeof CardMaxSave !== 'undefined') {
    CardMaxSave.renderSaveRestoreUI('save-restore-ui');
  }
});

// Load saved data from localStorage
function loadUserData() {
  const savedCards = localStorage.getItem('cardmax_user_cards');
  const savedBenefits = localStorage.getItem('cardmax_tracked_benefits');

  if (savedCards) {
    userCards = JSON.parse(savedCards);
  }

  if (savedBenefits) {
    trackedBenefits = JSON.parse(savedBenefits);
  }

  // Clean up old month data
  cleanupOldData();
}

// Save data to localStorage
function saveUserData() {
  localStorage.setItem('cardmax_user_cards', JSON.stringify(userCards));
  localStorage.setItem('cardmax_tracked_benefits', JSON.stringify(trackedBenefits));
}

// Clean up data from previous months
function cleanupOldData() {
  const currentMonth = getCurrentMonthKey();
  const currentYear = new Date().getFullYear();

  // Keep only current month's monthly data and all annual/onetime data
  Object.keys(trackedBenefits).forEach(key => {
    if (key.startsWith('monthly_') && !key.includes(currentMonth)) {
      delete trackedBenefits[key];
    }
  });

  saveUserData();
}

// Get current month key (e.g., "2026-01")
function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Set current month display
function setCurrentMonth() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  document.getElementById('current-month').textContent = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
}

// Render card selector
function renderCardSelector() {
  const container = document.getElementById('my-cards-selector');
  if (!container) return;

  container.innerHTML = CARDS_DATABASE.map(card => {
    const isSelected = userCards.includes(card.id);
    return `
      <button
        class="filter-btn ${isSelected ? 'active' : ''}"
        data-card-id="${card.id}"
        onclick="toggleCard('${card.id}')"
        style="${isSelected ? `background: ${card.color}; border-color: ${card.color};` : ''}"
      >
        ${card.name.split(' ').slice(-1)[0]}
      </button>
    `;
  }).join('');
}

// Toggle card selection
function toggleCard(cardId) {
  const index = userCards.indexOf(cardId);
  if (index > -1) {
    userCards.splice(index, 1);
  } else {
    userCards.push(cardId);
  }

  saveUserData();
  renderCardSelector();
  renderBenefitTrackers();
  updateStats();
}

// Render all benefit trackers
function renderBenefitTrackers() {
  renderMonthlyBenefits();
  renderSemiannualBenefits();
  renderAnnualBenefits();
  renderOnetimeBenefits();
}

// Render monthly benefits
function renderMonthlyBenefits() {
  const container = document.getElementById('monthly-benefits-container');
  if (!container) return;

  if (userCards.length === 0) {
    container.innerHTML = `
      <div class="tracker-card" style="text-align: center; padding: 3rem;">
        <h3 style="margin-bottom: 0.5rem;">No cards selected</h3>
        <p class="text-muted">Select cards above to start tracking your benefits</p>
      </div>
    `;
    return;
  }

  const monthKey = getCurrentMonthKey();
  let html = '';

  userCards.forEach(cardId => {
    const card = CARDS_DATABASE.find(c => c.id === cardId);
    if (!card) return;

    const monthlyCredits = card.credits.filter(c => c.monthlyAmount);
    if (monthlyCredits.length === 0) return;

    const cardBenefits = monthlyCredits.map(credit => {
      const benefitKey = `monthly_${monthKey}_${cardId}_${credit.name.replace(/\s+/g, '_')}`;
      const isCompleted = trackedBenefits[benefitKey] || false;
      return { ...credit, benefitKey, isCompleted };
    });

    const completedCount = cardBenefits.filter(b => b.isCompleted).length;
    const totalValue = cardBenefits.reduce((sum, b) => sum + b.monthlyAmount, 0);
    const usedValue = cardBenefits.filter(b => b.isCompleted).reduce((sum, b) => sum + b.monthlyAmount, 0);

    html += `
      <div class="tracker-card">
        <div class="tracker-header">
          <div>
            <div class="tracker-title" style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 12px; height: 12px; border-radius: 50%; background: ${card.color};"></span>
              ${card.name}
            </div>
            <div class="text-muted" style="font-size: 0.875rem; margin-top: 0.25rem;">
              ${completedCount} of ${cardBenefits.length} credits used
            </div>
          </div>
          <div class="tracker-progress">$${usedValue} / $${totalValue}</div>
        </div>

        <ul class="benefit-checklist">
          ${cardBenefits.map(benefit => `
            <li class="benefit-item ${benefit.isCompleted ? 'completed' : ''}"
                onclick="toggleBenefit('${benefit.benefitKey}')">
              <div class="benefit-checkbox"></div>
              <div class="benefit-content">
                <div class="benefit-text">${benefit.name}</div>
                <div class="benefit-description">${benefit.description}</div>
              </div>
              <div class="benefit-value">$${benefit.monthlyAmount}</div>
            </li>
          `).join('')}
        </ul>

        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(usedValue / totalValue) * 100}%"></div>
          </div>
          <div class="progress-text">
            <span>${Math.round((usedValue / totalValue) * 100)}% used</span>
            <span>$${totalValue - usedValue} remaining</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html || `
    <div class="tracker-card" style="text-align: center; padding: 2rem;">
      <p class="text-muted">No monthly credits for selected cards</p>
    </div>
  `;
}

// Render semiannual benefits (like Saks $50 every 6 months)
function renderSemiannualBenefits() {
  const container = document.getElementById('semiannual-benefits-container');
  if (!container) return;

  if (userCards.length === 0) {
    container.innerHTML = '';
    return;
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-11
  // H1 = Jan-Jun (months 0-5), H2 = Jul-Dec (months 6-11)
  const currentHalf = currentMonth < 6 ? 'H1' : 'H2';
  let html = '';

  userCards.forEach(cardId => {
    const card = CARDS_DATABASE.find(c => c.id === cardId);
    if (!card) return;

    const semiannualCredits = card.credits.filter(c => c.frequency === 'semiannual');
    if (semiannualCredits.length === 0) return;

    const cardBenefits = semiannualCredits.map(credit => {
      const benefitKey = `semiannual_${currentYear}_${currentHalf}_${cardId}_${credit.name.replace(/\s+/g, '_')}`;
      const isCompleted = trackedBenefits[benefitKey] || false;
      const periodValue = credit.semiannualAmount || (credit.amount / 2);
      return { ...credit, benefitKey, isCompleted, periodValue };
    });

    const completedCount = cardBenefits.filter(b => b.isCompleted).length;
    const totalValue = cardBenefits.reduce((sum, b) => sum + b.periodValue, 0);
    const usedValue = cardBenefits.filter(b => b.isCompleted).reduce((sum, b) => sum + b.periodValue, 0);

    html += `
      <div class="tracker-card">
        <div class="tracker-header">
          <div>
            <div class="tracker-title" style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 12px; height: 12px; border-radius: 50%; background: ${card.color};"></span>
              ${card.name}
            </div>
            <div class="text-muted" style="font-size: 0.875rem; margin-top: 0.25rem;">
              ${completedCount} of ${cardBenefits.length} credits used this half
            </div>
          </div>
          <div class="tracker-progress">$${usedValue} / $${totalValue}</div>
        </div>

        <ul class="benefit-checklist">
          ${cardBenefits.map(benefit => `
            <li class="benefit-item ${benefit.isCompleted ? 'completed' : ''}"
                onclick="toggleBenefit('${benefit.benefitKey}')">
              <div class="benefit-checkbox"></div>
              <div class="benefit-content">
                <div class="benefit-text">${benefit.name}</div>
                <div class="benefit-description">${benefit.description}</div>
                <div style="font-size: 0.75rem; color: var(--accent-purple); margin-top: 0.25rem;">
                  ${currentHalf === 'H1' ? 'Jan-Jun' : 'Jul-Dec'} ${currentYear}
                </div>
              </div>
              <div class="benefit-value">$${benefit.periodValue}</div>
            </li>
          `).join('')}
        </ul>

        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${totalValue > 0 ? (usedValue / totalValue) * 100 : 0}%"></div>
          </div>
          <div class="progress-text">
            <span>${totalValue > 0 ? Math.round((usedValue / totalValue) * 100) : 0}% used</span>
            <span>$${totalValue - usedValue} remaining</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html || '';
}

// Render annual benefits
function renderAnnualBenefits() {
  const container = document.getElementById('annual-benefits-container');
  if (!container) return;

  if (userCards.length === 0) {
    container.innerHTML = '';
    return;
  }

  const currentYear = new Date().getFullYear();
  let html = '';

  userCards.forEach(cardId => {
    const card = CARDS_DATABASE.find(c => c.id === cardId);
    if (!card) return;

    const annualCredits = card.credits.filter(c => c.frequency === 'annual' && !c.monthlyAmount);
    if (annualCredits.length === 0) return;

    const cardBenefits = annualCredits.map(credit => {
      const benefitKey = `annual_${currentYear}_${cardId}_${credit.name.replace(/\s+/g, '_')}`;
      const isCompleted = trackedBenefits[benefitKey] || false;
      return { ...credit, benefitKey, isCompleted };
    });

    const completedCount = cardBenefits.filter(b => b.isCompleted).length;

    // Separate dollar credits from points credits
    const dollarCredits = cardBenefits.filter(b => b.type !== 'points' && typeof b.amount === 'number');
    const pointsCredits = cardBenefits.filter(b => b.type === 'points' && typeof b.amount === 'number');

    const totalDollarValue = dollarCredits.reduce((sum, b) => sum + b.amount, 0);
    const usedDollarValue = dollarCredits.filter(b => b.isCompleted).reduce((sum, b) => sum + b.amount, 0);
    const totalPointsValue = pointsCredits.reduce((sum, b) => sum + b.amount, 0);
    const usedPointsValue = pointsCredits.filter(b => b.isCompleted).reduce((sum, b) => sum + b.amount, 0);

    // Build progress display
    let progressDisplay = '';
    if (totalDollarValue > 0 && totalPointsValue > 0) {
      progressDisplay = `$${usedDollarValue.toLocaleString()} / $${totalDollarValue.toLocaleString()} + ${usedPointsValue.toLocaleString()} / ${totalPointsValue.toLocaleString()} pts`;
    } else if (totalDollarValue > 0) {
      progressDisplay = `$${usedDollarValue.toLocaleString()} / $${totalDollarValue.toLocaleString()}`;
    } else if (totalPointsValue > 0) {
      progressDisplay = `${usedPointsValue.toLocaleString()} / ${totalPointsValue.toLocaleString()} pts`;
    } else {
      progressDisplay = `${completedCount} / ${cardBenefits.length}`;
    }

    html += `
      <div class="tracker-card">
        <div class="tracker-header">
          <div>
            <div class="tracker-title" style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 12px; height: 12px; border-radius: 50%; background: ${card.color};"></span>
              ${card.name}
            </div>
            <div class="text-muted" style="font-size: 0.875rem; margin-top: 0.25rem;">
              ${completedCount} of ${cardBenefits.length} annual credits used
            </div>
          </div>
          <div class="tracker-progress">${progressDisplay}</div>
        </div>

        <ul class="benefit-checklist">
          ${cardBenefits.map(benefit => `
            <li class="benefit-item ${benefit.isCompleted ? 'completed' : ''}"
                onclick="toggleBenefit('${benefit.benefitKey}')">
              <div class="benefit-checkbox"></div>
              <div class="benefit-content">
                <div class="benefit-text">${benefit.name}</div>
                <div class="benefit-description">${benefit.description}</div>
              </div>
              <div class="benefit-value">${typeof benefit.amount === 'number' ? (benefit.type === 'points' ? benefit.amount.toLocaleString() + ' pts' : '$' + benefit.amount.toLocaleString()) : benefit.amount}</div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  });

  container.innerHTML = html || '';
}

// Render one-time benefits
function renderOnetimeBenefits() {
  const container = document.getElementById('onetime-benefits-container');
  if (!container) return;

  if (userCards.length === 0) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  userCards.forEach(cardId => {
    const card = CARDS_DATABASE.find(c => c.id === cardId);
    if (!card) return;

    const onetimeCredits = card.credits.filter(c => c.frequency.includes('every'));
    if (onetimeCredits.length === 0) return;

    const cardBenefits = onetimeCredits.map(credit => {
      const benefitKey = `onetime_${cardId}_${credit.name.replace(/\s+/g, '_')}`;
      const isCompleted = trackedBenefits[benefitKey] || false;
      return { ...credit, benefitKey, isCompleted };
    });

    html += `
      <div class="tracker-card">
        <div class="tracker-header">
          <div class="tracker-title" style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="width: 12px; height: 12px; border-radius: 50%; background: ${card.color};"></span>
            ${card.name}
          </div>
        </div>

        <ul class="benefit-checklist">
          ${cardBenefits.map(benefit => `
            <li class="benefit-item ${benefit.isCompleted ? 'completed' : ''}"
                onclick="toggleBenefit('${benefit.benefitKey}')">
              <div class="benefit-checkbox"></div>
              <div class="benefit-content">
                <div class="benefit-text">${benefit.name}</div>
                <div class="benefit-description">${benefit.description}</div>
                <div style="font-size: 0.75rem; color: var(--accent-purple); margin-top: 0.25rem;">
                  Renews ${benefit.frequency}
                </div>
              </div>
              <div class="benefit-value">${typeof benefit.amount === 'number' ? (benefit.type === 'points' ? benefit.amount.toLocaleString() + ' pts' : '$' + benefit.amount.toLocaleString()) : benefit.amount}</div>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  });

  container.innerHTML = html || '';
}

// Toggle benefit completion
function toggleBenefit(benefitKey) {
  trackedBenefits[benefitKey] = !trackedBenefits[benefitKey];
  saveUserData();
  renderBenefitTrackers();
  updateStats();
}

// Update summary stats
function updateStats() {
  const monthKey = getCurrentMonthKey();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentHalf = currentMonth < 6 ? 'H1' : 'H2';

  let monthlyUsed = 0;
  let monthlyTotal = 0;
  let semiannualUsed = 0;
  let annualUsed = 0;
  let totalBenefits = 0;
  let completedBenefits = 0;

  userCards.forEach(cardId => {
    const card = CARDS_DATABASE.find(c => c.id === cardId);
    if (!card) return;

    // Monthly credits
    card.credits.filter(c => c.monthlyAmount).forEach(credit => {
      const benefitKey = `monthly_${monthKey}_${cardId}_${credit.name.replace(/\s+/g, '_')}`;
      monthlyTotal += credit.monthlyAmount;
      totalBenefits++;
      if (trackedBenefits[benefitKey]) {
        monthlyUsed += credit.monthlyAmount;
        completedBenefits++;
      }
    });

    // Semiannual credits
    card.credits.filter(c => c.frequency === 'semiannual').forEach(credit => {
      const benefitKey = `semiannual_${currentYear}_${currentHalf}_${cardId}_${credit.name.replace(/\s+/g, '_')}`;
      const periodValue = credit.semiannualAmount || (credit.amount / 2);
      totalBenefits++;
      if (trackedBenefits[benefitKey]) {
        semiannualUsed += periodValue;
        completedBenefits++;
      }
    });

    // Annual credits
    card.credits.filter(c => c.frequency === 'annual' && !c.monthlyAmount).forEach(credit => {
      const benefitKey = `annual_${currentYear}_${cardId}_${credit.name.replace(/\s+/g, '_')}`;
      totalBenefits++;
      if (trackedBenefits[benefitKey]) {
        annualUsed += typeof credit.amount === 'number' ? credit.amount : 0;
        completedBenefits++;
      }
    });
  });

  document.getElementById('credits-used').textContent = '$' + monthlyUsed;
  document.getElementById('credits-remaining').textContent = '$' + (monthlyTotal - monthlyUsed);
  document.getElementById('annual-value').textContent = '$' + (monthlyUsed + semiannualUsed + annualUsed);
  document.getElementById('completion-rate').textContent = totalBenefits > 0
    ? Math.round((completedBenefits / totalBenefits) * 100) + '%'
    : '0%';
}

// Render renewal dates section
function renderRenewalDates() {
  const container = document.getElementById('renewals-container');
  if (!container) return;

  if (userCards.length === 0) {
    container.innerHTML = '';
    return;
  }

  const renewalDates = typeof CardMaxSave !== 'undefined' ? CardMaxSave.getAllRenewalDates() : {};

  let html = `
    <div class="tracker-card">
      <p class="text-muted" style="margin-bottom: 1rem; font-size: 0.875rem;">
        Track your card anniversary dates to plan for retention calls and annual fee decisions.
      </p>
  `;

  userCards.forEach(cardId => {
    const card = CARDS_DATABASE.find(c => c.id === cardId);
    if (!card) return;

    const renewalDate = renewalDates[cardId];
    const formattedDate = renewalDate ? new Date(renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

    // Check if renewal is upcoming
    let daysUntil = null;
    let isUpcoming = false;
    if (renewalDate) {
      const now = new Date();
      const renewal = new Date(renewalDate);
      daysUntil = Math.ceil((renewal - now) / (24 * 60 * 60 * 1000));
      isUpcoming = daysUntil > 0 && daysUntil <= 30;
    }

    html += `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: var(--bg-card); border-radius: 8px; margin-bottom: 0.75rem; ${isUpcoming ? 'border-left: 3px solid var(--accent-orange);' : ''}">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="width: 12px; height: 12px; border-radius: 50%; background: ${card.color};"></span>
          <div>
            <div style="font-weight: 500;">${card.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">$${card.annualFee}/year</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          ${isUpcoming ? `<span style="font-size: 0.75rem; color: var(--accent-orange); font-weight: 600;">⚠️ ${daysUntil} days</span>` : ''}
          <input
            type="date"
            value="${renewalDate || ''}"
            onchange="updateRenewalDate('${cardId}', this.value)"
            style="padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-size: 0.875rem;"
          />
        </div>
      </div>
    `;
  });

  html += '</div>';

  // Add upcoming renewals alert
  if (typeof CardMaxSave !== 'undefined') {
    const upcoming = CardMaxSave.getUpcomingRenewals();
    if (upcoming.length > 0) {
      html = `
        <div style="background: rgba(249, 115, 22, 0.1); border: 1px solid var(--accent-orange); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem;">
          <h4 style="color: var(--accent-orange); margin-bottom: 0.5rem;">⚠️ Upcoming Renewals</h4>
          ${upcoming.map(r => `
            <div style="font-size: 0.875rem; margin-top: 0.25rem;">
              <strong>${r.card.name}</strong> renews in ${r.daysUntil} days ($${r.card.annualFee})
            </div>
          `).join('')}
        </div>
      ` + html;
    }
  }

  container.innerHTML = html;
}

// Update renewal date
function updateRenewalDate(cardId, date) {
  if (typeof CardMaxSave !== 'undefined') {
    CardMaxSave.setRenewalDate(cardId, date);
    renderRenewalDates();
    CardMaxSave.showToast('Renewal date saved!');
  }
}

// Current view state
let currentView = 'frequency';

// Switch between views
function switchView(view) {
  currentView = view;

  // Update button states
  document.querySelectorAll('.filter-btn[data-view]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });

  // Show/hide sections
  const frequencyElements = ['tracker-stats', 'monthly-tracker', 'semiannual-tracker', 'annual-tracker', 'onetime-tracker', 'renewals-tracker'];
  const byCardElements = ['by-card-view'];

  if (view === 'frequency') {
    frequencyElements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });
    byCardElements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  } else if (view === 'card') {
    frequencyElements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    byCardElements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });
    renderByCardView();
  }
}

// Render full checklist by card view
function renderByCardView() {
  const container = document.getElementById('by-card-container');
  if (!container) return;

  if (userCards.length === 0) {
    container.innerHTML = `
      <div class="tracker-card" style="text-align: center; padding: 3rem;">
        <h3 style="margin-bottom: 0.5rem;">No cards selected</h3>
        <p class="text-muted">Select cards above to start tracking your benefits</p>
      </div>
    `;
    return;
  }

  const monthKey = getCurrentMonthKey();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentHalf = currentMonth < 6 ? 'H1' : 'H2';
  let html = '';

  userCards.forEach(cardId => {
    const card = CARDS_DATABASE.find(c => c.id === cardId);
    if (!card) return;

    // Group all benefits: monthly, semiannual, annual, one-time, perks
    const monthlyCredits = card.credits.filter(c => c.monthlyAmount).map(credit => ({
      ...credit,
      benefitKey: `monthly_${monthKey}_${cardId}_${credit.name.replace(/\s+/g, '_')}`,
      isCompleted: trackedBenefits[`monthly_${monthKey}_${cardId}_${credit.name.replace(/\s+/g, '_')}`] || false,
      benefitType: 'monthly'
    }));

    const semiannualCredits = card.credits.filter(c => c.frequency === 'semiannual').map(credit => ({
      ...credit,
      benefitKey: `semiannual_${currentYear}_${currentHalf}_${cardId}_${credit.name.replace(/\s+/g, '_')}`,
      isCompleted: trackedBenefits[`semiannual_${currentYear}_${currentHalf}_${cardId}_${credit.name.replace(/\s+/g, '_')}`] || false,
      benefitType: 'semiannual',
      periodValue: credit.semiannualAmount || (credit.amount / 2)
    }));

    const annualCredits = card.credits.filter(c => c.frequency === 'annual' && !c.monthlyAmount).map(credit => ({
      ...credit,
      benefitKey: `annual_${currentYear}_${cardId}_${credit.name.replace(/\s+/g, '_')}`,
      isCompleted: trackedBenefits[`annual_${currentYear}_${cardId}_${credit.name.replace(/\s+/g, '_')}`] || false,
      benefitType: 'annual'
    }));

    const onetimeCredits = card.credits.filter(c => c.frequency.includes('every')).map(credit => ({
      ...credit,
      benefitKey: `onetime_${cardId}_${credit.name.replace(/\s+/g, '_')}`,
      isCompleted: trackedBenefits[`onetime_${cardId}_${credit.name.replace(/\s+/g, '_')}`] || false,
      benefitType: 'onetime'
    }));

    const allCredits = [...monthlyCredits, ...semiannualCredits, ...annualCredits, ...onetimeCredits];

    // Calculate totals
    const completedCount = allCredits.filter(b => b.isCompleted).length;
    const dollarCredits = allCredits.filter(b => b.type !== 'points' && typeof b.amount === 'number');
    const totalDollarValue = dollarCredits.reduce((sum, b) => sum + (b.monthlyAmount || b.amount || 0), 0);
    const usedDollarValue = dollarCredits.filter(b => b.isCompleted).reduce((sum, b) => sum + (b.monthlyAmount || b.amount || 0), 0);

    html += `
      <div class="tracker-card" style="margin-bottom: 1.5rem;">
        <div class="tracker-header">
          <div>
            <div class="tracker-title" style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 16px; height: 16px; border-radius: 50%; background: ${card.color};"></span>
              ${card.name}
            </div>
            <div class="text-muted" style="font-size: 0.875rem; margin-top: 0.25rem;">
              ${completedCount} of ${allCredits.length} credits used · $${card.annualFee}/year
            </div>
          </div>
          <div class="tracker-progress">$${usedDollarValue.toLocaleString()} / $${totalDollarValue.toLocaleString()}</div>
        </div>

        ${monthlyCredits.length > 0 ? `
          <div style="margin-top: 1rem;">
            <h4 style="font-size: 0.75rem; color: var(--accent-blue); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">📅 Monthly Credits</h4>
            <ul class="benefit-checklist">
              ${monthlyCredits.map(benefit => `
                <li class="benefit-item ${benefit.isCompleted ? 'completed' : ''}"
                    onclick="toggleBenefit('${benefit.benefitKey}')">
                  <div class="benefit-checkbox"></div>
                  <div class="benefit-content">
                    <div class="benefit-text">${benefit.name}</div>
                    <div class="benefit-description">${benefit.description}</div>
                  </div>
                  <div class="benefit-value">$${benefit.monthlyAmount}/mo</div>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        ${semiannualCredits.length > 0 ? `
          <div style="margin-top: 1rem;">
            <h4 style="font-size: 0.75rem; color: var(--accent-orange); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">📆 Semiannual Credits (${currentHalf === 'H1' ? 'Jan-Jun' : 'Jul-Dec'})</h4>
            <ul class="benefit-checklist">
              ${semiannualCredits.map(benefit => `
                <li class="benefit-item ${benefit.isCompleted ? 'completed' : ''}"
                    onclick="toggleBenefit('${benefit.benefitKey}')">
                  <div class="benefit-checkbox"></div>
                  <div class="benefit-content">
                    <div class="benefit-text">${benefit.name}</div>
                    <div class="benefit-description">${benefit.description}</div>
                  </div>
                  <div class="benefit-value">$${benefit.periodValue}</div>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        ${annualCredits.length > 0 ? `
          <div style="margin-top: 1rem;">
            <h4 style="font-size: 0.75rem; color: var(--accent-green); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">📆 Annual Credits</h4>
            <ul class="benefit-checklist">
              ${annualCredits.map(benefit => `
                <li class="benefit-item ${benefit.isCompleted ? 'completed' : ''}"
                    onclick="toggleBenefit('${benefit.benefitKey}')">
                  <div class="benefit-checkbox"></div>
                  <div class="benefit-content">
                    <div class="benefit-text">${benefit.name}</div>
                    <div class="benefit-description">${benefit.description}</div>
                  </div>
                  <div class="benefit-value">${typeof benefit.amount === 'number' ? (benefit.type === 'points' ? benefit.amount.toLocaleString() + ' pts' : '$' + benefit.amount.toLocaleString()) : benefit.amount}</div>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        ${onetimeCredits.length > 0 ? `
          <div style="margin-top: 1rem;">
            <h4 style="font-size: 0.75rem; color: var(--accent-purple); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">✅ One-Time / Multi-Year</h4>
            <ul class="benefit-checklist">
              ${onetimeCredits.map(benefit => `
                <li class="benefit-item ${benefit.isCompleted ? 'completed' : ''}"
                    onclick="toggleBenefit('${benefit.benefitKey}')">
                  <div class="benefit-checkbox"></div>
                  <div class="benefit-content">
                    <div class="benefit-text">${benefit.name}</div>
                    <div class="benefit-description">${benefit.description}</div>
                    <div style="font-size: 0.7rem; color: var(--accent-purple); margin-top: 0.25rem;">Renews ${benefit.frequency}</div>
                  </div>
                  <div class="benefit-value">${typeof benefit.amount === 'number' ? (benefit.type === 'points' ? benefit.amount.toLocaleString() + ' pts' : '$' + benefit.amount.toLocaleString()) : benefit.amount}</div>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        ${card.perks.length > 0 ? `
          <div style="margin-top: 1rem;">
            <h4 style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">🎁 Perks</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${card.perks.map(perk => `
                <span style="padding: 0.4rem 0.75rem; background: var(--bg-card); border-radius: 20px; font-size: 0.8rem;" title="${perk.description}">
                  ${perk.name}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="progress-container" style="margin-top: 1rem;">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${totalDollarValue > 0 ? (usedDollarValue / totalDollarValue) * 100 : 0}%"></div>
          </div>
          <div class="progress-text">
            <span>${totalDollarValue > 0 ? Math.round((usedDollarValue / totalDollarValue) * 100) : 0}% captured</span>
            <span>$${(totalDollarValue - usedDollarValue).toLocaleString()} remaining</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html || `
    <div class="tracker-card" style="text-align: center; padding: 2rem;">
      <p class="text-muted">No benefits to track for selected cards</p>
    </div>
  `;
}
