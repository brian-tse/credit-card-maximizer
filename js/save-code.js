// CardMax - Save Code System
// Allows users to save/restore their data via a self-contained code string

const SAVE_CODE_PREFIX = 'CARDMAX_';

// Generate a backup code that contains ALL user data (Base64 encoded)
function generateBackupCode() {
  const data = {
    v: 2, // version
    c: JSON.parse(localStorage.getItem('cardmax_user_cards') || '[]'),
    b: JSON.parse(localStorage.getItem('cardmax_tracked_benefits') || '{}'),
    r: JSON.parse(localStorage.getItem('cardmax_renewal_dates') || '{}'),
    d: JSON.parse(localStorage.getItem('cardmax_signup_dates') || '{}')
  };

  // Compress by removing empty objects
  if (Object.keys(data.b).length === 0) delete data.b;
  if (Object.keys(data.r).length === 0) delete data.r;
  if (Object.keys(data.d).length === 0) delete data.d;

  const jsonStr = JSON.stringify(data);
  const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
  return SAVE_CODE_PREFIX + base64;
}

// Restore data from a backup code
function restoreFromCode(code) {
  if (!code || !code.startsWith(SAVE_CODE_PREFIX)) {
    throw new Error('Invalid backup code format');
  }

  try {
    const base64 = code.substring(SAVE_CODE_PREFIX.length);
    const jsonStr = decodeURIComponent(escape(atob(base64)));
    const data = JSON.parse(jsonStr);

    if (!data.c || !Array.isArray(data.c)) {
      throw new Error('Invalid data structure');
    }

    localStorage.setItem('cardmax_user_cards', JSON.stringify(data.c));
    localStorage.setItem('cardmax_tracked_benefits', JSON.stringify(data.b || {}));
    localStorage.setItem('cardmax_renewal_dates', JSON.stringify(data.r || {}));
    localStorage.setItem('cardmax_signup_dates', JSON.stringify(data.d || {}));

    return true;
  } catch (err) {
    throw new Error('Could not decode backup code: ' + err.message);
  }
}

// Legacy: Export user data as JSON (for file backup)
function exportUserData() {
  const data = {
    version: 2,
    exportedAt: new Date().toISOString(),
    cards: JSON.parse(localStorage.getItem('cardmax_user_cards') || '[]'),
    benefits: JSON.parse(localStorage.getItem('cardmax_tracked_benefits') || '{}'),
    renewalDates: JSON.parse(localStorage.getItem('cardmax_renewal_dates') || '{}'),
    signupDates: JSON.parse(localStorage.getItem('cardmax_signup_dates') || '{}')
  };
  return data;
}

// Legacy: Import user data from JSON file
function importUserData(data) {
  if (!data || !data.cards) {
    throw new Error('Invalid data format');
  }

  localStorage.setItem('cardmax_user_cards', JSON.stringify(data.cards));
  localStorage.setItem('cardmax_tracked_benefits', JSON.stringify(data.benefits || {}));
  localStorage.setItem('cardmax_renewal_dates', JSON.stringify(data.renewalDates || {}));
  localStorage.setItem('cardmax_signup_dates', JSON.stringify(data.signupDates || {}));

  return true;
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
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      importUserData(data);
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
    background: ${type === 'error' ? '#ef4444' : '#22c55e'};
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
  localStorage.setItem('cardmax_renewal_dates', JSON.stringify(dates));
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

// Render save/restore UI component
function renderSaveRestoreUI(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Check if user has any cards saved
  const userCards = JSON.parse(localStorage.getItem('cardmax_user_cards') || '[]');
  const hasData = userCards.length > 0;

  container.innerHTML = `
    <div style="background: var(--bg-secondary); border-radius: var(--radius); padding: 1.5rem; border: 1px solid var(--border-color);">
      <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
        💾 Save & Restore Your Data
      </h3>
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
          Paste a backup code to restore your cards and settings.
        </p>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: flex-start;">
          <input
            type="text"
            id="restore-code-input"
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
  renderSaveRestoreUI
};

// Also expose functions globally for onclick handlers
window.copyBackupCode = copyBackupCode;
window.downloadData = downloadData;
window.uploadData = uploadData;
window.handleRestoreFromCode = handleRestoreFromCode;
window.showToast = showToast;
