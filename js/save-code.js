// CardMax - Anonymous Save Code System
// Allows users to save/restore their data without full authentication

const SAVE_CODE_PREFIX = 'CM';

// Generate a random save code
function generateSaveCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0,O,1,I)
  let code = SAVE_CODE_PREFIX;
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Get or create user's save code
function getUserSaveCode() {
  let code = localStorage.getItem('cardmax_save_code');
  if (!code) {
    code = generateSaveCode();
    localStorage.setItem('cardmax_save_code', code);
  }
  return code;
}

// Export user data as JSON
function exportUserData() {
  const data = {
    code: getUserSaveCode(),
    version: 1,
    exportedAt: new Date().toISOString(),
    cards: JSON.parse(localStorage.getItem('cardmax_user_cards') || '[]'),
    benefits: JSON.parse(localStorage.getItem('cardmax_tracked_benefits') || '{}'),
    renewalDates: JSON.parse(localStorage.getItem('cardmax_renewal_dates') || '{}')
  };
  return data;
}

// Import user data from JSON
function importUserData(data) {
  if (!data || !data.cards) {
    throw new Error('Invalid data format');
  }

  localStorage.setItem('cardmax_user_cards', JSON.stringify(data.cards));
  localStorage.setItem('cardmax_tracked_benefits', JSON.stringify(data.benefits || {}));
  localStorage.setItem('cardmax_renewal_dates', JSON.stringify(data.renewalDates || {}));

  if (data.code) {
    localStorage.setItem('cardmax_save_code', data.code);
  }

  return true;
}

// Copy save code to clipboard
function copySaveCode() {
  const code = getUserSaveCode();
  navigator.clipboard.writeText(code).then(() => {
    showToast('Save code copied: ' + code);
  });
}

// Download data as JSON file
function downloadData() {
  const data = exportUserData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cardmax-backup-${data.code}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Backup downloaded!');
}

// Show file picker to import data
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
      // Reload the page to reflect changes
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showToast('Error importing data: ' + err.message, 'error');
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

  const code = getUserSaveCode();

  container.innerHTML = `
    <div style="background: var(--bg-secondary); border-radius: var(--radius); padding: 1.5rem; border: 1px solid var(--border-color);">
      <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
        💾 Save Your Data
      </h3>
      <p class="text-muted" style="margin-bottom: 1rem; font-size: 0.875rem;">
        Your data is saved locally. Use your save code or download a backup to restore on another device.
      </p>

      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding: 1rem; background: var(--bg-card); border-radius: 8px;">
        <div style="flex: 1;">
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Your Save Code</div>
          <div style="font-size: 1.5rem; font-weight: 700; font-family: monospace; letter-spacing: 2px;">${code}</div>
        </div>
        <button class="btn btn-secondary" onclick="copySaveCode()">Copy</button>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="downloadData()">
          ⬇️ Download Backup
        </button>
        <button class="btn btn-secondary" onclick="uploadData()">
          ⬆️ Restore from Backup
        </button>
      </div>
    </div>
  `;
}

// Export functions
window.CardMaxSave = {
  generateSaveCode,
  getUserSaveCode,
  exportUserData,
  importUserData,
  copySaveCode,
  downloadData,
  uploadData,
  showToast,
  setRenewalDate,
  getRenewalDate,
  getAllRenewalDates,
  getUpcomingRenewals,
  renderSaveRestoreUI
};
