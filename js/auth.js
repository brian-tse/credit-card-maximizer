// CardMax authentication and conflict-aware sync. No whole-snapshot last-writer wins.
let currentUser = null;
let authInitialized = false;
let authGeneration = 0;
let explicitSignIn = false;
let unsubscribeCloud = null;
let syncPromise = null;
let syncAgain = false;
let syncStatus = 'Saved in this browser';

function setSyncStatus(message) {
  syncStatus = message;
  const node = document.getElementById('cardmax-sync-status');
  if (node) node.textContent = message;
  window.dispatchEvent(new CustomEvent('cardmax-sync-status', { detail: message }));
}

function initAuth() {
  if (authInitialized || typeof auth === 'undefined' || typeof CardMaxStorage === 'undefined') return;
  authInitialized = true;
  auth.onAuthStateChanged(async user => {
    const generation = ++authGeneration;
    clearTimeout(window.syncTimeout);
    if (unsubscribeCloud) unsubscribeCloud();
    unsubscribeCloud = null;
    try {
      CardMaxStorage.switchAccount(user?.uid || null, explicitSignIn);
      currentUser = user;
      explicitSignIn = false;
      updateAuthUI();
      if (!user) { setSyncStatus('Saved in this browser'); return; }
      setSyncStatus('Syncing…');
      await syncToCloud();
      if (generation !== authGeneration || !currentUser || !ownsAccount(user.uid)) return;
      unsubscribeCloud = db.collection('users').doc(user.uid).onSnapshot(snapshot => {
        if (generation !== authGeneration || currentUser?.uid !== user.uid || !ownsAccount(user.uid) || snapshot.metadata?.hasPendingWrites) return;
        try {
          const local = CardMaxStorage.captureChanges(user.uid);
          const merged = CardMaxStorage.mergeState(local, CardMaxStorage.cloudState(snapshot.exists ? snapshot.data() : {}));
          if (JSON.stringify(local) !== JSON.stringify(merged)) CardMaxStorage.applyState(merged, true, { expectedOwner: user.uid });
          setSyncStatus('Synced');
        } catch (_) { setSyncStatus('Sync failed — your local data is saved'); }
      }, () => setSyncStatus('Offline or sync unavailable — saved locally'));
    } catch (_) { currentUser = null; explicitSignIn = false; updateAuthUI(); setSyncStatus('Could not open this account — browser data remains saved'); }
  });
  window.addEventListener('online', () => syncToCloud());
  window.addEventListener('focus', () => { if (!guardActiveAccount()) return; if (currentUser) syncToCloud(); });
  for (const type of ['click', 'input', 'change', 'submit', 'keydown', 'beforeinput']) document.addEventListener(type, event => {
    if (ownsAccount() || event.target.closest?.('[data-cardmax-reload], #navbar-auth')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    guardActiveAccount();
  }, true);
  window.addEventListener('storage', event => {
    if (event.key?.startsWith('cardmax_') && event.key !== 'cardmax_last_rollback') {
      // Other tabs share the account owner; never write another account's data.
      if (!guardActiveAccount()) return;
      window.dispatchEvent(new Event('cardmax-data-changed'));
    }
  });
}

async function signInWithGoogle() {
  try {
    explicitSignIn = true;
    const result = await auth.signInWithPopup(googleProvider);
    return result.user;
  } catch (error) {
    explicitSignIn = false;
    if (error.code === 'auth/popup-blocked') showAuthToast('Please allow popups to sign in.');
    else if (!['auth/cancelled-popup-request', 'auth/popup-closed-by-user'].includes(error.code)) showAuthToast('Sign in failed. Your local data is unchanged.');
    return null;
  }
}

async function signOutUser() {
  try {
    await syncToCloud();
    await auth.signOut();
    showAuthToast('Signed out. Account data remains separate from this browser’s guest data.');
  } catch (_) { showAuthToast('Sign out failed. Please try again.'); }
}

function ownsAccount(uid = currentUser?.uid || 'anonymous') { return CardMaxStorage.owner() === uid; }

// Older tabs must not write stale form/card state into another account's
// shared browser keys. Capture-phase blocking runs before page event handlers.
function guardActiveAccount() {
  const matching = ownsAccount();
  document.querySelectorAll?.('.container, [role="dialog"]').forEach(element => { element.inert = !matching; });
  const existing = document.getElementById('cardmax-account-changed');
  if (matching) { existing?.remove(); return true; }
  if (!existing && document.body) {
    const banner = document.createElement('div');
    banner.id = 'cardmax-account-changed';
    banner.setAttribute('role', 'alert');
    banner.style.cssText = 'position:sticky;top:0;z-index:20000;padding:1rem;background:#fff4d6;color:#402900;display:flex;gap:1rem;align-items:center;justify-content:center';
    const message = document.createElement('span');
    message.textContent = 'Account changed in another tab. Reload before editing cards or restoring data.';
    const button = document.createElement('button');
    button.className = 'btn btn-primary'; button.textContent = 'Reload account'; button.dataset.cardmaxReload = 'true';
    button.addEventListener('click', () => window.location.reload());
    banner.append(message, button); document.body.prepend(banner);
  }
  setSyncStatus('Account changed in another tab — reload before editing');
  return false;
}

async function syncToCloud() {
  if (typeof CardMaxStorage === 'undefined' || !ownsAccount()) return false;
  try { CardMaxStorage.captureChanges(currentUser?.uid || 'anonymous'); } catch (_) { setSyncStatus('Could not save changes — check browser storage'); return false; }
  if (!currentUser) { setSyncStatus('Saved in this browser'); return false; }
  if (syncPromise) { syncAgain = true; return syncPromise; }
  const uid = currentUser.uid, generation = authGeneration;
  if (localStorage.getItem('cardmax_state_owner') !== uid) return false;
  setSyncStatus('Syncing…');
  syncPromise = (async () => {
    try {
      const ref = db.collection('users').doc(uid);
      const local = CardMaxStorage.captureChanges(uid);
      const merged = await db.runTransaction(async transaction => {
        if (!ownsAccount(uid) || generation !== authGeneration || currentUser?.uid !== uid) throw new Error('Account changed');
        const snapshot = await transaction.get(ref);
        if (!ownsAccount(uid) || generation !== authGeneration || currentUser?.uid !== uid) throw new Error('Account changed');
        const state = CardMaxStorage.mergeState(local, CardMaxStorage.cloudState(snapshot.exists ? snapshot.data() : {}));
        transaction.set(ref, { stateV3: state, schemaVersion: 3, lastUpdated: firebase.firestore.FieldValue.serverTimestamp() }, { mergeFields: ['stateV3', 'schemaVersion', 'lastUpdated'] });
        return state;
      });
      if (generation !== authGeneration || currentUser?.uid !== uid || localStorage.getItem('cardmax_state_owner') !== uid) return false;
      // Include changes made while the network request was running.
      const latest = CardMaxStorage.captureChanges(uid);
      const combined = CardMaxStorage.mergeState(merged, latest);
      if (JSON.stringify(latest) !== JSON.stringify(combined)) CardMaxStorage.applyState(combined, true, { expectedOwner: uid });
      if (JSON.stringify(merged) !== JSON.stringify(combined)) syncAgain = true;
      setSyncStatus('Synced');
      return true;
    } catch (_) { setSyncStatus('Sync failed — your local data is saved'); return false; }
    finally { syncPromise = null; if (syncAgain) { syncAgain = false; autoSyncToCloud(); } }
  })();
  return syncPromise;
}

async function syncFromCloud() { return syncToCloud(); }

function autoSyncToCloud() {
  if (!ownsAccount()) { setSyncStatus('Account changed in another tab — refresh before editing'); return; }
  try { CardMaxStorage.captureChanges(currentUser?.uid || 'anonymous'); } catch (_) { setSyncStatus('Could not save changes — check browser storage'); return; }
  clearTimeout(window.syncTimeout);
  if (!currentUser) { setSyncStatus('Saved in this browser'); return; }
  setSyncStatus('Changes saved locally; sync pending');
  window.syncTimeout = setTimeout(syncToCloud, 400);
}

// Update UI based on auth state
function updateAuthUI() {
  guardActiveAccount();
  updateNavbarAuth();
  updateAuthContainer();
  renderLegacyRecovery();
  let status = document.getElementById('cardmax-sync-status');
  const navbar = document.getElementById('navbar-auth');
  if (!status && navbar) { status = document.createElement('span'); status.id = 'cardmax-sync-status'; status.setAttribute('role', 'status'); status.style.cssText = 'font-size:0.7rem;display:block;max-width:210px'; navbar.appendChild(status); }
  if (status) status.textContent = syncStatus;
  // Update quick save button visibility (hide when signed in)
  if (typeof updateQuickSaveVisibility === 'function') {
    updateQuickSaveVisibility();
  }
}

// Update navbar auth (top of page)
function updateNavbarAuth() {
  const navbarAuth = document.getElementById('navbar-auth');
  if (!navbarAuth) return;

  if (currentUser) {
    const displayName = escapeAuthText(currentUser.displayName || currentUser.email || 'Account');
    const photoURL = /^https:\/\//.test(currentUser.photoURL || '') ? escapeAuthText(currentUser.photoURL) : null;

    navbarAuth.innerHTML = `
      <div class="navbar-auth-user">
        ${photoURL ? `<img src="${photoURL}" alt="Profile">` : ''}
        <span class="navbar-auth-name">${displayName}</span>
        <button class="navbar-auth-signout" onclick="signOutUser()">Sign out</button>
      </div>
    `;
  } else {
    navbarAuth.innerHTML = `
      <button class="navbar-auth-btn" onclick="signInWithGoogle()">Sign In</button>
    `;
  }
}

// Update auth container (original location, if present)
function updateAuthContainer() {
  const authContainer = document.getElementById('auth-container');
  if (!authContainer) return;

  if (currentUser) {
    // Signed in state
    const email = currentUser.email;
    const displayName = escapeAuthText(currentUser.displayName || email || 'Account');

    authContainer.innerHTML = `
      <div class="auth-signed-in">
        <span class="auth-status">Signed in as ${displayName}</span>
        <button class="auth-link" onclick="signOutUser()">Sign out</button>
      </div>
    `;
  } else {
    // Signed out state
    authContainer.innerHTML = `
      <div class="auth-signed-out">
        <span class="auth-hint">Want to sync across devices?</span>
        <button class="auth-link" onclick="signInWithGoogle()">Sign up for an account</button>
      </div>
    `;
  }
}

// Pre-upgrade data has no reliable account owner. Keep it available without
// silently uploading it to whichever account happens to be remembered.
function renderLegacyRecovery() {
  const existing = document.getElementById('cardmax-data-recovery');
  const recovery = CardMaxStorage.legacyRecovery();
  if (!currentUser || !recovery) { existing?.remove(); return; }
  const host = document.querySelector?.('.container') || document.getElementById('navbar-auth');
  if (!host) return;
  const panel = existing || document.createElement('div');
  panel.id = 'cardmax-data-recovery';
  panel.style.cssText = 'padding:1rem;margin:1rem 0;border:1px solid var(--border-color);border-radius:8px;font-size:0.875rem';
  panel.innerHTML = `<details><summary>Saved browser data from before this update</summary><p>This older data was saved without an account owner. Download it to review, or add its missing items to ${escapeAuthText(currentUser.displayName || currentUser.email || 'this account')}. Existing account choices will be kept.</p>
    <button class="btn btn-secondary" type="button" onclick="downloadLegacyBrowserData()">Download saved browser data</button>
    ${recovery.imported ? '<p>Saved data has been imported. The original recovery copy remains available to download.</p>' : '<button class="btn btn-primary" type="button" onclick="importLegacyBrowserData()">Import saved data into this account</button>'}</details>`;
  if (!existing) host.prepend(panel);
}

function downloadLegacyBrowserData() {
  const recovery = CardMaxStorage.legacyRecovery();
  if (!recovery) return;
  const backup = { version: 3, exportedAt: new Date().toISOString(), snapshot: CardMaxStorage.materialize(recovery.state), stateV3: recovery.state };
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = 'cardmax-before-update-backup.json'; link.click(); URL.revokeObjectURL(url);
}

function importLegacyBrowserData() {
  if (!currentUser || !ownsAccount()) return;
  try {
    CardMaxStorage.importLegacy(currentUser.uid);
    autoSyncToCloud();
    renderLegacyRecovery();
    showAuthToast('Saved browser data imported. Existing account choices were kept.');
  } catch (_) { showAuthToast('Could not import saved data. The original recovery copy is unchanged.'); }
}

// Show toast notification for auth events
function showAuthToast(message) {
  // Use existing toast function if available
  if (typeof CardMaxSave !== 'undefined' && CardMaxSave.showToast) {
    CardMaxSave.showToast(message);
  } else {
    // Fallback toast
    const toast = document.createElement('div');
    toast.className = 'auth-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #1a1a1a;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 10000;
      font-size: 14px;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

// Check if user is signed in
function isSignedIn() {
  return currentUser !== null;
}

// Get current user
function getCurrentUser() {
  return currentUser;
}

// Export functions
window.CardMaxAuth = {
  init: initAuth,
  signIn: signInWithGoogle,
  signOut: signOutUser,
  syncToCloud,
  syncFromCloud,
  autoSync: autoSyncToCloud,
  isSignedIn,
  getCurrentUser,
  importLegacyBrowserData,
  downloadLegacyBrowserData
};

function escapeAuthText(value) { return String(value).replace(/[&<>\"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;'}[c])); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAuth);
else initAuth();
