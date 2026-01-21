// CardMax - Authentication & Cloud Sync
// Handles Google sign-in and Firestore data sync

// Current user state
let currentUser = null;

// Initialize auth state listener
function initAuth() {
  auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    updateAuthUI();

    // Don't auto-sync on page load - only sync when user explicitly signs in
    // This prevents reload loops
  });
}

// Sign in with Google
async function signInWithGoogle() {
  try {
    const result = await auth.signInWithPopup(googleProvider);
    const user = result.user;
    const isNewUser = result.additionalUserInfo?.isNewUser;

    if (isNewUser) {
      // First time sign in - upload localStorage to cloud
      await syncToCloud();
      showAuthToast('Account created! Your data is now synced.');
    } else {
      // Returning user - sync from cloud and reload to show synced data
      await syncFromCloud(true);
      showAuthToast('Welcome back! Data synced from your account.');
    }

    return user;
  } catch (error) {
    console.error('Sign in error:', error);
    if (error.code === 'auth/popup-blocked') {
      showAuthToast('Please allow popups to sign in.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      // User closed popup, ignore
    } else {
      showAuthToast('Sign in failed. Please try again.');
    }
    return null;
  }
}

// Sign out
async function signOutUser() {
  try {
    await auth.signOut();
    showAuthToast('Signed out successfully.');
  } catch (error) {
    console.error('Sign out error:', error);
    showAuthToast('Sign out failed.');
  }
}

// Sync local data to Firestore
async function syncToCloud() {
  if (!currentUser) return false;

  try {
    const userData = {
      selectedCards: JSON.parse(localStorage.getItem('cardmax_user_cards') || '[]'),
      cardSignupDates: JSON.parse(localStorage.getItem('cardmax_signup_dates') || '{}'),
      trackedBenefits: JSON.parse(localStorage.getItem('cardmax_tracked_benefits') || '{}'),
      sortPreference: localStorage.getItem('cardmax_sort_option') || 'issuer',
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('users').doc(currentUser.uid).set(userData, { merge: true });
    console.log('Data synced to cloud');
    return true;
  } catch (error) {
    console.error('Sync to cloud failed:', error);
    return false;
  }
}

// Sync data from Firestore to local
async function syncFromCloud(shouldReload = false) {
  if (!currentUser) return false;

  try {
    const doc = await db.collection('users').doc(currentUser.uid).get();

    if (doc.exists) {
      const data = doc.data();

      // Update localStorage with cloud data
      if (data.selectedCards) {
        localStorage.setItem('cardmax_user_cards', JSON.stringify(data.selectedCards));
      }
      if (data.cardSignupDates) {
        localStorage.setItem('cardmax_signup_dates', JSON.stringify(data.cardSignupDates));
      }
      if (data.trackedBenefits) {
        localStorage.setItem('cardmax_tracked_benefits', JSON.stringify(data.trackedBenefits));
      }
      if (data.sortPreference) {
        localStorage.setItem('cardmax_sort_option', data.sortPreference);
      }

      console.log('Data synced from cloud');

      // Only reload if explicitly requested (e.g., after sign-in)
      if (shouldReload) {
        window.location.reload();
      }
    } else {
      // No cloud data exists - upload local data
      await syncToCloud();
    }

    return true;
  } catch (error) {
    console.error('Sync from cloud failed:', error);
    return false;
  }
}

// Auto-sync when data changes (call this after any data modification)
async function autoSyncToCloud() {
  if (!currentUser) return;

  // Debounce to avoid too many writes - wait 3 seconds of inactivity
  clearTimeout(window.syncTimeout);
  window.syncTimeout = setTimeout(async () => {
    console.log('Auto-syncing to cloud...');
    await syncToCloud();
  }, 3000);
}

// Update UI based on auth state
function updateAuthUI() {
  updateNavbarAuth();
  updateAuthContainer();
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
    const displayName = currentUser.displayName || currentUser.email;
    const photoURL = currentUser.photoURL;

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
    const displayName = currentUser.displayName || email;

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
  getCurrentUser
};
