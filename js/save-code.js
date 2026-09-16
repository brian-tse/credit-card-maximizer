// Complete, validated backups. Restore keeps a rollback snapshot before changing data.
const SAVE_CODE_PREFIX = 'CARDMAX_';

function exportUserData() {
  const stateV3 = CardMaxStorage.captureChanges();
  return { version: 3, exportedAt: new Date().toISOString(), snapshot: CardMaxStorage.materialize(stateV3), stateV3 };
}

function generateBackupCode() {
  return SAVE_CODE_PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify(exportUserData()))));
}

function backupSnapshot(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid backup data');
  const version = data.version ?? data.v ?? 1;
  if (![1, 2, 3].includes(version)) throw new Error('Unsupported backup version');
  if (version === 3) {
    const snapshot = CardMaxStorage.validateSnapshot(data.snapshot);
    if (data.stateV3) {
      CardMaxStorage.validateState(data.stateV3);
      if (JSON.stringify(CardMaxStorage.materialize(data.stateV3)) !== JSON.stringify(snapshot)) throw new Error('Backup state and snapshot do not match');
    }
    return snapshot;
  }
  return CardMaxStorage.validateSnapshot({ cards: data.cards ?? data.c, benefits: data.benefits ?? data.b ?? {}, renewalDates: data.renewalDates ?? data.r ?? {}, signupDates: data.signupDates ?? data.d ?? {}, annualFees: data.annualFees || {}, settings: data.settings || { sortPreference: data.sortPreference || 'issuer', pointValuations: data.pointValuations || {} } });
}

function importUserData(data, expectedOwner) {
  // Validation is complete before a single active storage key is written.
  const snapshot = backupSnapshot(data);
  CardMaxStorage.restore(snapshot, expectedOwner);
  if (typeof CardMaxAuth !== 'undefined') CardMaxAuth.autoSync();
  return true;
}

function restoreFromCode(code) {
  if (typeof code !== 'string' || !code.startsWith(SAVE_CODE_PREFIX) || code.length > 10000000) throw new Error('Invalid backup code format');
  let data;
  try { data = JSON.parse(decodeURIComponent(escape(atob(code.slice(SAVE_CODE_PREFIX.length))))); }
  catch (_) { throw new Error('Could not decode backup code'); }
  return importUserData(data);
}

// Copy backup code to clipboard
function copyBackupCode() {
  const code = generateBackupCode();
  navigator.clipboard.writeText(code).then(() => {
    showToast('Backup code copied! Save it somewhere safe.');
  }).catch(() => {
    // Fallback for older browsers
    prompt('Copy this backup code:', code);
  });
}

// Download data as JSON file (alternative backup method)
function downloadData() {
  const data = exportUserData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cardmax-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Backup file downloaded!');
}

// Show file picker to import data from JSON file
function uploadData() {
  const expectedOwner = CardMaxStorage.owner();
  CardMaxStorage.assertOwner(typeof CardMaxAuth !== 'undefined' ? CardMaxAuth.getCurrentUser()?.uid || 'anonymous' : expectedOwner);
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      importUserData(data, expectedOwner);
      showToast('Data restored successfully!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showToast('Error importing file: ' + err.message, 'error');
    }
  };
  input.click();
}

// Simple toast notification
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.getElementById('cardmax-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'cardmax-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem 2rem;
    background: ${type === 'error' ? '#b91c1c' : '#15803d'};
    color: white;
    border-radius: 8px;
    font-weight: 500;
    z-index: 10000;
    animation: slideUp 0.3s ease;
  `;
  toast.textContent = message;

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Set renewal date for a card
function setRenewalDate(cardId, date) {
  const dates = JSON.parse(localStorage.getItem('cardmax_renewal_dates') || '{}');
  dates[cardId] = date;
  CardMaxStorage.validateSnapshot({ ...CardMaxStorage.readSnapshot(), renewalDates: dates });
  localStorage.setItem('cardmax_renewal_dates', JSON.stringify(dates));
  if (typeof CardMaxAuth !== 'undefined') CardMaxAuth.autoSync();
}

// Get renewal date for a card
function getRenewalDate(cardId) {
  const dates = JSON.parse(localStorage.getItem('cardmax_renewal_dates') || '{}');
  return dates[cardId] || null;
}

// Get all renewal dates
function getAllRenewalDates() {
  return JSON.parse(localStorage.getItem('cardmax_renewal_dates') || '{}');
}

// Check for upcoming renewals (within 30 days)
function getUpcomingRenewals() {
  const dates = getAllRenewalDates();
  const upcoming = [];
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  Object.entries(dates).forEach(([cardId, dateStr]) => {
    const renewalDate = new Date(dateStr);
    if (renewalDate >= now && renewalDate <= thirtyDaysLater) {
      const card = CARDS_DATABASE.find(c => c.id === cardId);
      if (card) {
        upcoming.push({
          card,
          date: renewalDate,
          daysUntil: Math.ceil((renewalDate - now) / (24 * 60 * 60 * 1000))
        });
      }
    }
  });

  return upcoming.sort((a, b) => a.date - b.date);
}

// Render save/restore UI component (collapsible)
function renderSaveRestoreUI(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Check if user has any cards saved
  const userCards = JSON.parse(localStorage.getItem('cardmax_user_cards') || '[]');
  const hasData = userCards.length > 0;

  container.innerHTML = `
    <details style="background: var(--bg-secondary); border-radius: var(--radius); border: 1px solid var(--border-color);">
      <summary style="padding: 1rem 1.5rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; list-style: none;">
        <span style="transition: transform 0.2s;" class="collapse-arrow">▶</span>
        💾 Save & Restore Your Data
      </summary>
      <div style="padding: 0 1.5rem 1.5rem 1.5rem;">
        <p class="text-muted" style="margin-bottom: 1rem; font-size: 0.875rem;">
          Your data is saved locally in this browser. Copy your backup code to restore on another device or browser.
        </p>

        <!-- Backup Section -->
        <div style="margin-bottom: 1.5rem;">
          <div style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Create Backup</div>
          <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 0.75rem;">
            ${hasData ? `You have ${userCards.length} card${userCards.length > 1 ? 's' : ''} saved. Click below to copy your backup code.` : 'Add cards to your collection first to create a backup.'}
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="copyBackupCode()" ${!hasData ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
              📋 Copy Backup Code
            </button>
            <button class="btn btn-secondary" onclick="downloadData()" ${!hasData ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
              ⬇️ Download JSON File
            </button>
          </div>
        </div>

        <!-- Restore Section -->
        <div style="border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
          <div style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Restore from Backup</div>
          <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 0.75rem;">
            Restoring replaces this account’s cards, history and settings. A recovery snapshot is saved in this browser before changes are applied.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: flex-start;">
            <input
              type="text"
              id="restore-code-input"
              aria-label="Backup code"
              placeholder="Paste backup code here (starts with CARDMAX_)"
              style="flex: 1; min-width: 200px; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-card); color: var(--text-primary); font-family: monospace; font-size: 0.875rem;"
            >
            <button class="btn btn-secondary" onclick="handleRestoreFromCode()">
              ⬆️ Restore
            </button>
          </div>
          <div style="margin-top: 0.75rem;">
            <button class="btn btn-secondary" onclick="uploadData()" style="font-size: 0.875rem;">
              📁 Or upload JSON file
            </button>
          </div>
        </div>
      </div>
    </details>
    <style>
      details[open] .collapse-arrow { transform: rotate(90deg); }
      details summary::-webkit-details-marker { display: none; }
    </style>
  `;
}

// Handle restore from pasted code
function handleRestoreFromCode() {
  const input = document.getElementById('restore-code-input');
  const code = input.value.trim();

  if (!code) {
    showToast('Please paste a backup code first', 'error');
    return;
  }

  try {
    restoreFromCode(code);
    showToast('Data restored successfully! Reloading...');
    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Floating Quick Save Button (for non-logged-in users)
function renderQuickSaveButton() {
  // Don't render if already exists
  if (document.getElementById('quick-save-fab')) return;

  const userCards = JSON.parse(localStorage.getItem('cardmax_user_cards') || '[]');
  const hasData = userCards.length > 0;

  // Only show if user has data and is NOT signed in
  // We'll check auth state and hide/show accordingly
  const fab = document.createElement('button');
  fab.id = 'quick-save-fab';
  fab.className = 'quick-save-fab';
  fab.setAttribute('aria-label', 'Copy backup code');
  fab.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
    <span class="quick-save-text">Copy backup</span>
  `;

  fab.onclick = () => {
    if (!CardMaxStorage.readSnapshot().cards.length) {
      showToast('Add some cards first to create a backup', 'error');
      return;
    }
    copyBackupCode();
  };

  (document.querySelector('.site-utilities') || document.body).appendChild(fab);

  // Update visibility based on auth state
  updateQuickSaveVisibility();
}

// Update visibility of quick save button based on auth state
function updateQuickSaveVisibility() {
  const fab = document.getElementById('quick-save-fab');
  if (!fab) return;

  const userCards = JSON.parse(localStorage.getItem('cardmax_user_cards') || '[]');
  const hasData = userCards.length > 0;
  const isSignedIn = typeof CardMaxAuth !== 'undefined' && CardMaxAuth.isSignedIn();

  // Show only if: has data AND not signed in
  if (hasData && !isSignedIn) {
    fab.style.display = 'flex';
  } else {
    fab.style.display = 'none';
  }
}

// Initialize quick save button on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to let auth initialize first
  setTimeout(renderQuickSaveButton, 500);
});

// Export functions to CardMaxSave namespace
window.CardMaxSave = {
  generateBackupCode,
  restoreFromCode,
  exportUserData,
  importUserData,
  copyBackupCode,
  handleRestoreFromCode,
  downloadData,
  uploadData,
  showToast,
  setRenewalDate,
  getRenewalDate,
  getAllRenewalDates,
  getUpcomingRenewals,
  renderSaveRestoreUI,
  updateQuickSaveVisibility
};

// Also expose functions globally for onclick handlers
window.copyBackupCode = copyBackupCode;
window.downloadData = downloadData;
window.uploadData = uploadData;
window.handleRestoreFromCode = handleRestoreFromCode;
window.showToast = showToast;
window.updateQuickSaveVisibility = updateQuickSaveVisibility;
