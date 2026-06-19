/* ═══════════════════════════════════════════════════
   TANGLISH → TAMIL TRANSLATOR  |  app.js
   Shared utilities · Session · Toast · Sidebar
═══════════════════════════════════════════════════ */

// Force-purge Service Worker Caches to load fresh updates
(function purgeCaches() {
  const PURGE_KEY = 'tnlp_cache_purge_v9';
  if (!localStorage.getItem(PURGE_KEY)) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        for (let r of regs) {
          r.unregister();
        }
      });
    }
    if (window.caches) {
      caches.keys().then(names => {
        for (let name of names) {
          caches.delete(name);
        }
      });
    }
    localStorage.setItem(PURGE_KEY, 'true');
    // Force reload page to apply
    setTimeout(() => window.location.reload(true), 300);
  }
})();

// Dynamic backend host configuration to support accessing from mobile devices or different hostnames
if (typeof API_BASE === 'undefined') {
  var API_BASE = `http://${window.location.hostname || 'localhost'}:5000`;
}

// ── SESSION ───────────────────────────────────────────
function getSession() {
  return JSON.parse(localStorage.getItem('tnlp_session') || 'null');
}
function setSession(user) {
  localStorage.setItem('tnlp_session', JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem('tnlp_session');
}

// Guard: redirect to login if no session
(function() {
  const currentPage = window.location.pathname.split('/').pop();
  const authPages   = new Set(['login.html', 'signup.html', 'forgot_password.html', '']);
  const session     = getSession();

  // Allow unauthenticated users on auth pages and common entry routes
  // (also resilient to service worker routing and query/hash)
  const isAuthRoute = authPages.has(currentPage) ||
    window.location.pathname.endsWith('/') ||
    window.location.pathname.endsWith('index.html');

  if (isAuthRoute && session) {
    window.location.replace('dashboard.html');
    return;
  }
  if (!isAuthRoute && !session) {
    // Use absolute relative path so redirects work regardless of current folder
    window.location.replace('login.html');
    return;
  }
  if (session) populateSidebarUser(session);
})();

function populateSidebarUser(user) {
  if (!user) return;
  const init = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const avatarEl  = document.getElementById('nav-avatar');
  const sAvatar   = document.getElementById('sidebar-avatar');
  const sName     = document.getElementById('sidebar-name');
  if (avatarEl) avatarEl.textContent = init;
  if (sAvatar)  sAvatar.textContent  = init;
  if (sName)    sName.textContent    = user.name;
}

function doLogout() {
  clearSession();
  window.location.href = 'login.html';
}

// ── TOAST ─────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast-msg ${type}`;
  t.innerHTML = `<i class="fa ${icons[type] || icons.info}"></i> ${msg}`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ── SIDEBAR TOGGLE (mobile) ───────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('sidebar-overlay')?.classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('show');
}

// ── THEME, FONT SIZE & LANGUAGE ──────────────────────
function applyTheme() {
  const theme = localStorage.getItem('tnlp_theme');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

function applyFontSize() {
  const size = localStorage.getItem('tnlp_font_size') || 'Medium';
  const sizeMap = {
    'Small': '14px',
    'Medium': '16px',
    'Large': '19px',
    'Extra Large': '22px'
  };
  document.documentElement.style.setProperty('--base-font-size', sizeMap[size] || '16px');
  document.body.style.fontSize = sizeMap[size] || '16px';
}

// Global UI Translation Dictionary
const UI_LANG_MAP = {
  ta: {
    'Dashboard': 'முகப்பு (Dashboard)',
    'Translator': 'மொழிபெயர்ப்பு (Translator)',
    'History': 'வரலாறு (History)',
    'Profile': 'சுயவிவரம் (Profile)',
    'Settings': 'அமைப்புகள் (Settings)',
    'Logout': 'வெளியேறு (Logout)',
    'Main': 'முக்கிய பக்கங்கள்',
    'Account': 'கணக்கு',
    'NLP Student': 'மாணவர்',
    'Children Mode': 'குழந்தைகள் பிரிவு (Kids)',
    'Welcome Back': 'மீண்டும் வருக',
    'Sign in to continue translating': 'மொழிபெயர்க்க உள்நுழையவும்',
    'Email or Username': 'மின்னஞ்சல் அல்லது பயனர் பெயர்',
    'Password': 'கடவுச்சொல்',
    'Remember me': 'என்னை நினைவில் கொள்',
    'Forgot Password?': 'கடவுச்சொல் மறந்துவிட்டதா?',
    'Sign In': 'உள்நுழையவும்',
    'Don\'t have an account?': 'கணக்கு இல்லையா?',
    'Create Account': 'புதிய கணக்கு உருவாக்கு'
  },
  en: {
    'Dashboard': 'Dashboard',
    'Translator': 'Translator',
    'History': 'History',
    'Profile': 'Profile',
    'Settings': 'Settings',
    'Logout': 'Logout',
    'Main': 'Main',
    'Account': 'Account',
    'NLP Student': 'NLP Student',
    'Children Mode': 'Children Mode',
    'Welcome Back': 'Welcome Back',
    'Sign in to continue translating': 'Sign in to continue translating',
    'Email or Username': 'Email or Username',
    'Password': 'Password',
    'Remember me': 'Remember me',
    'Forgot Password?': 'Forgot Password?',
    'Sign In': 'Sign In',
    'Don\'t have an account?': 'Don\'t have an account?',
    'Create Account': 'Create Account'
  }
};

function applyInterfaceLanguage() {
  const langPref = localStorage.getItem('tnlp_lang_pref') || 'English';
  const langCode = langPref.includes('Tamil') || langPref.includes('தமிழ்') ? 'ta' : 'en';
  const dict = UI_LANG_MAP[langCode];

  // Add Children Mode link if sidebar exists and is not present yet
  const sidebarNav = document.querySelector('.sidebar-nav');
  if (sidebarNav && !document.getElementById('nav-children-mode')) {
    // Find the Account divider or end of Main section
    const labels = Array.from(sidebarNav.querySelectorAll('.sidebar-section-label'));
    const accountLabel = labels.find(el => el.textContent.includes('Account') || el.textContent.includes('கணக்கு'));
    
    const childLink = document.createElement('a');
    childLink.id = 'nav-children-mode';
    childLink.className = 'nav-item';
    childLink.href = 'children.html';
    childLink.innerHTML = `<i class="fa fa-child" style="color:#e67e22"></i> <span>Children Mode</span> <span class="badge-pill" style="background:#e67e22; color:#fff">Kids</span>`;
    
    // Highlight if active
    if (window.location.pathname.includes('children.html')) {
      childLink.className += ' active';
    }

    if (accountLabel) {
      sidebarNav.insertBefore(childLink, accountLabel);
    } else {
      sidebarNav.appendChild(childLink);
    }
  }

  // Walk text elements and translate if they match keys
  const walkNodes = (parent) => {
    for (let node of parent.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (dict[text]) {
          node.textContent = node.textContent.replace(text, dict[text]);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
        // Also translate placeholders
        if (node.placeholder && dict[node.placeholder.trim()]) {
          node.placeholder = dict[node.placeholder.trim()];
        }
        walkNodes(node);
      }
    }
  };
  walkNodes(document.body);
}

// ── GAMIFICATION (XP, Streaks, Badges, Stars) ───────
async function syncGamification(xp, streak, badges, stars) {
  const session = getSession();
  if (!session) return;
  try {
    const res = await fetch(`${API_BASE}/api/gamification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: session.username,
        xp,
        streak,
        badges,
        stars
      })
    });
    const data = await res.json();
    if (res.ok) {
      // Update local session cache
      localStorage.setItem('tnlp_session', JSON.stringify(data.user));
    }
  } catch (err) {
    console.error('Failed to sync gamification metrics with backend:', err);
  }
}

async function unlockBadge(badgeId) {
  const session = getSession();
  if (!session) return;
  const badgesKey = 'tnlp_badges_' + session.username;
  const badges = JSON.parse(localStorage.getItem(badgesKey) || '[]');
  if (!badges.includes(badgeId)) {
    badges.push(badgeId);
    localStorage.setItem(badgesKey, JSON.stringify(badges));
    showToast('New Badge Earned! Check your Profile! 🏅', 'success');
    
    const xp = parseInt(localStorage.getItem('tnlp_xp_' + session.username) || '120');
    const streak = parseInt(localStorage.getItem('tnlp_streak_' + session.username) || '1');
    const stars = parseInt(localStorage.getItem('tnlp_kids_stars_' + session.username) || '0');
    await syncGamification(xp, streak, badges, stars);
  }
}

async function initGamification() {
  const session = getSession();
  if (!session) return;
  
  let xp = parseInt(localStorage.getItem('tnlp_xp_' + session.username) || '0');
  if (!xp) {
    xp = session.xp || 120;
    localStorage.setItem('tnlp_xp_' + session.username, xp);
  }
  
  // Streak tracking
  const lastActiveDate = localStorage.getItem('tnlp_last_active_' + session.username);
  const todayStr = new Date().toDateString();
  let streak = parseInt(localStorage.getItem('tnlp_streak_' + session.username) || '0');
  if (!streak) streak = session.streak || 1;
  
  let changed = false;
  if (!lastActiveDate) {
    streak = 1;
    localStorage.setItem('tnlp_streak_' + session.username, '1');
    localStorage.setItem('tnlp_last_active_' + session.username, todayStr);
    changed = true;
  } else if (lastActiveDate !== todayStr) {
    const lastActiveTime = new Date(lastActiveDate).getTime();
    const todayTime = new Date(todayStr).getTime();
    const diffDays = Math.round((todayTime - lastActiveTime) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak += 1;
      localStorage.setItem('tnlp_streak_' + session.username, streak);
      showToast(`Daily streak active! Day ${streak} 🔥`, 'success');
    } else if (diffDays > 1) {
      streak = 1;
      localStorage.setItem('tnlp_streak_' + session.username, '1');
      showToast('Streak reset. Start learning daily to keep it up!', 'info');
    }
    localStorage.setItem('tnlp_last_active_' + session.username, todayStr);
    changed = true;
  }
  
  const badgesKey = 'tnlp_badges_' + session.username;
  let badges = JSON.parse(localStorage.getItem(badgesKey) || '[]');
  if (!badges.length && session.badges) {
    badges = session.badges;
    localStorage.setItem(badgesKey, JSON.stringify(badges));
  }
  const stars = parseInt(localStorage.getItem('tnlp_kids_stars_' + session.username) || '0');

  // Sync state initially
  await syncGamification(xp, streak, badges, stars);
}

async function addXP(points) {
  // XP points system disabled by user request
}

// ── INIT RUNNERS ────────────────────────────────────
applyTheme();
applyFontSize();

document.addEventListener('DOMContentLoaded', () => {
  initGamification();
  applyInterfaceLanguage();
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js')
      .then((reg) => console.log('ServiceWorker registered successfully', reg.scope))
      .catch((err) => {
        // Retry path for main pages or subdirectories
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => console.log('ServiceWorker registered at root', reg.scope))
          .catch((e) => console.warn('ServiceWorker registration failed', e));
      });
  });
}

