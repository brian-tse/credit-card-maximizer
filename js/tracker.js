// CardMax - Benefit Tracker Logic

// State
let userCards = [];
let trackedBenefits = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  renderBenefitTrackers();
  updateStats();
  setCurrentMonth();

  // Initialize save/restore UI if available
  if (typeof CardMaxSave !== 'undefined') {
    CardMaxSave.renderSaveRestoreUI('save-restore-ui');
  }

  // Default to "By Card" view
  switchView('card');
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
                onclick="toggleBenefit('${benefit.benefitKey}', event)">
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
                onclick="toggleBenefit('${benefit.benefitKey}', event)">
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
                onclick="toggleBenefit('${benefit.benefitKey}', event)">
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
                onclick="toggleBenefit('${benefit.benefitKey}', event)">
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
function toggleBenefit(benefitKey, event) {
  // Prevent event bubbling issues
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  // Explicit toggle to handle undefined vs false properly
  if (trackedBenefits[benefitKey] === true) {
    trackedBenefits[benefitKey] = false;
  } else {
    trackedBenefits[benefitKey] = true;
  }

  saveUserData();
  renderBenefitTrackers();
  if (currentView === 'card') {
    renderByCardView();
  }
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


// Current view state
let currentView = 'card';

// Switch between views
function switchView(view) {
  currentView = view;

  // Update button states
  document.querySelectorAll('.filter-btn[data-view]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });

  // Show/hide sections
  const frequencyElements = ['tracker-stats', 'monthly-tracker', 'semiannual-tracker', 'annual-tracker', 'onetime-tracker'];
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

// Helper: Check if a credit is "actionable" (requires user action to redeem)
function isActionableCredit(credit) {
  // Passive benefits that don't need checkboxes (automatic):
  const passiveKeywords = ['anniversary', 'bonus', 'free night', 'status', 'elite'];
  const nameLower = credit.name.toLowerCase();

  // If it's a points-type credit with "anniversary" or "bonus" it's passive
  if (credit.type === 'points' && (nameLower.includes('anniversary') || nameLower.includes('bonus'))) {
    return false;
  }

  // Free night awards are passive (posted automatically)
  if (nameLower.includes('free night')) {
    return false;
  }

  // Everything else is actionable
  return true;
}

// Render full checklist by card view
function renderByCardView() {
  const container = document.getElementById('by-card-container');
  if (!container) return;

  if (userCards.length === 0) {
    container.innerHTML = `
      <div class="tracker-card" style="text-align: center; padding: 3rem;">
        <h3 style="margin-bottom: 0.5rem;">No cards selected</h3>
        <p class="text-muted">Go to the <a href="../index.html" style="color: var(--accent-blue);">Dashboard</a> to add cards to your collection</p>
      </div>
    `;
    return;
  }

  const monthKey = getCurrentMonthKey();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  let html = '';

  // Sort userCards by total benefits count (most benefits first)
  const sortedUserCards = [...userCards].sort((a, b) => {
    const cardA = CARDS_DATABASE.find(c => c.id === a);
    const cardB = CARDS_DATABASE.find(c => c.id === b);
    if (!cardA || !cardB) return 0;

    const countA = cardA.credits.length + cardA.perks.length;
    const countB = cardB.credits.length + cardB.perks.length;
    return countB - countA;  // Descending order (most benefits first)
  });

  sortedUserCards.forEach(cardId => {
    const card = CARDS_DATABASE.find(c => c.id === cardId);
    if (!card) return;

    // ===== CATEGORIZE CREDITS =====

    // Monthly credits (all actionable)
    const monthlyCredits = card.credits.filter(c => c.monthlyAmount).map(credit => ({
      ...credit,
      benefitKey: `monthly_${monthKey}_${cardId}_${credit.name.replace(/\s+/g, '_')}`,
      isCompleted: trackedBenefits[`monthly_${monthKey}_${cardId}_${credit.name.replace(/\s+/g, '_')}`] || false,
      displayValue: `$${credit.monthlyAmount}/mo`
    }));

    // Semiannual credits - create TWO checkboxes (H1 and H2)
    const semiannualCreditsRaw = card.credits.filter(c => c.frequency === 'semiannual');
    const semiannualCredits = [];
    semiannualCreditsRaw.forEach(credit => {
      const periodValue = credit.semiannualAmount || (credit.amount / 2);
      // H1: Jan-Jun
      const h1Key = `semiannual_${currentYear}_H1_${cardId}_${credit.name.replace(/\s+/g, '_')}`;
      semiannualCredits.push({
        ...credit,
        benefitKey: h1Key,
        isCompleted: trackedBenefits[h1Key] || false,
        period: 'Jan-Jun',
        periodValue: periodValue,
        displayValue: `$${periodValue}`
      });
      // H2: Jul-Dec
      const h2Key = `semiannual_${currentYear}_H2_${cardId}_${credit.name.replace(/\s+/g, '_')}`;
      semiannualCredits.push({
        ...credit,
        benefitKey: h2Key,
        isCompleted: trackedBenefits[h2Key] || false,
        period: 'Jul-Dec',
        periodValue: periodValue,
        displayValue: `$${periodValue}`
      });
    });

    // Annual credits - separate actionable from passive
    const annualCreditsRaw = card.credits.filter(c => c.frequency === 'annual' && !c.monthlyAmount);
    const actionableAnnual = [];
    const passiveAnnual = [];

    annualCreditsRaw.forEach(credit => {
      const creditData = {
        ...credit,
        benefitKey: `annual_${currentYear}_${cardId}_${credit.name.replace(/\s+/g, '_')}`,
        isCompleted: trackedBenefits[`annual_${currentYear}_${cardId}_${credit.name.replace(/\s+/g, '_')}`] || false,
        displayValue: typeof credit.amount === 'number'
          ? (credit.type === 'points' ? credit.amount.toLocaleString() + ' pts' : '$' + credit.amount.toLocaleString())
          : credit.amount
      };

      if (isActionableCredit(credit)) {
        actionableAnnual.push(creditData);
      } else {
        passiveAnnual.push(creditData);
      }
    });

    // Multi-year credits (like Global Entry) - all actionable
    const multiYearCredits = card.credits.filter(c => c.frequency && c.frequency.includes('every')).map(credit => ({
      ...credit,
      benefitKey: `multiyear_${cardId}_${credit.name.replace(/\s+/g, '_')}`,
      isCompleted: trackedBenefits[`multiyear_${cardId}_${credit.name.replace(/\s+/g, '_')}`] || false,
      displayValue: typeof credit.amount === 'number'
        ? (credit.type === 'points' ? credit.amount.toLocaleString() + ' pts' : '$' + credit.amount.toLocaleString())
        : credit.amount
    }));

    // All actionable credits for counting
    const allActionable = [...monthlyCredits, ...semiannualCredits, ...actionableAnnual, ...multiYearCredits];
    const completedCount = allActionable.filter(b => b.isCompleted).length;

    // Calculate dollar values (excluding points)
    const dollarCredits = allActionable.filter(b => b.type !== 'points' && typeof b.amount === 'number');
    const totalDollarValue = dollarCredits.reduce((sum, b) => {
      if (b.monthlyAmount) return sum + (b.monthlyAmount * 12);
      if (b.periodValue) return sum + b.periodValue;
      return sum + (b.amount || 0);
    }, 0);
    const usedDollarValue = dollarCredits.filter(b => b.isCompleted).reduce((sum, b) => {
      if (b.monthlyAmount) return sum + b.monthlyAmount;
      if (b.periodValue) return sum + b.periodValue;
      return sum + (b.amount || 0);
    }, 0);

    html += `
      <div class="tracker-card" style="margin-bottom: 1.5rem;">
        <div class="tracker-header">
          <div>
            <div class="tracker-title" style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="width: 16px; height: 16px; border-radius: 50%; background: ${card.color};"></span>
              ${card.name}
            </div>
            <div class="text-muted" style="font-size: 0.875rem; margin-top: 0.25rem;">
              ${completedCount} of ${allActionable.length} credits used · $${card.annualFee}/year
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
                    onclick="toggleBenefit('${benefit.benefitKey}', event)">
                  <div class="benefit-checkbox"></div>
                  <div class="benefit-content">
                    <div class="benefit-text">${benefit.name}</div>
                    <div class="benefit-description">${benefit.description}</div>
                  </div>
                  <div class="benefit-value">${benefit.displayValue}</div>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        ${semiannualCredits.length > 0 ? `
          <div style="margin-top: 1rem;">
            <h4 style="font-size: 0.75rem; color: var(--accent-orange); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">📆 Semiannual Credits</h4>
            <ul class="benefit-checklist">
              ${semiannualCredits.map(benefit => `
                <li class="benefit-item ${benefit.isCompleted ? 'completed' : ''}"
                    onclick="toggleBenefit('${benefit.benefitKey}', event)">
                  <div class="benefit-checkbox"></div>
                  <div class="benefit-content">
                    <div class="benefit-text">${benefit.name} <span style="color: var(--accent-orange); font-size: 0.8rem;">(${benefit.period})</span></div>
                    <div class="benefit-description">${benefit.description}</div>
                  </div>
                  <div class="benefit-value">${benefit.displayValue}</div>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        ${actionableAnnual.length > 0 ? `
          <div style="margin-top: 1rem;">
            <h4 style="font-size: 0.75rem; color: var(--accent-green); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">📆 Annual Credits</h4>
            <ul class="benefit-checklist">
              ${actionableAnnual.map(benefit => `
                <li class="benefit-item ${benefit.isCompleted ? 'completed' : ''}"
                    onclick="toggleBenefit('${benefit.benefitKey}', event)">
                  <div class="benefit-checkbox"></div>
                  <div class="benefit-content">
                    <div class="benefit-text">${benefit.name}</div>
                    <div class="benefit-description">${benefit.description}</div>
                  </div>
                  <div class="benefit-value">${benefit.displayValue}</div>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        ${multiYearCredits.length > 0 ? `
          <div style="margin-top: 1rem;">
            <h4 style="font-size: 0.75rem; color: var(--accent-purple); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">⏱️ Multi-Year Credits</h4>
            <ul class="benefit-checklist">
              ${multiYearCredits.map(benefit => `
                <li class="benefit-item ${benefit.isCompleted ? 'completed' : ''}"
                    onclick="toggleBenefit('${benefit.benefitKey}', event)"
                    title="Statement credit ${benefit.frequency}">
                  <div class="benefit-checkbox"></div>
                  <div class="benefit-content">
                    <div class="benefit-text">${benefit.name}</div>
                    <div class="benefit-description">${benefit.description}</div>
                    <div style="font-size: 0.7rem; color: var(--accent-purple); margin-top: 0.25rem;">ℹ️ Statement credit ${benefit.frequency}</div>
                  </div>
                  <div class="benefit-value">${benefit.displayValue}</div>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        ${passiveAnnual.length > 0 || card.perks.length > 0 ? `
          <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--border-color);">
            <h4 style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.75rem;">🎁 Automatic Benefits (No Action Needed)</h4>

            ${passiveAnnual.length > 0 ? `
              <div style="margin-bottom: 0.75rem;">
                ${passiveAnnual.map(benefit => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: var(--bg-card); border-radius: 6px; margin-bottom: 0.5rem;">
                    <div>
                      <span style="font-weight: 500;">${benefit.name}</span>
                      <span class="text-muted" style="font-size: 0.8rem; margin-left: 0.5rem;">${benefit.description}</span>
                    </div>
                    <span style="color: var(--accent-green); font-weight: 600;">${benefit.displayValue}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${card.perks.length > 0 ? `
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${card.perks.map(perk => `
                  <span style="padding: 0.4rem 0.75rem; background: var(--bg-card); border-radius: 20px; font-size: 0.8rem;" title="${perk.description}">
                    ${perk.name}
                  </span>
                `).join('')}
              </div>
            ` : ''}
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
