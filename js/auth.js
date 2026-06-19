/* ═══════════════════════════════════════════════════
   TANGLISH → TAMIL TRANSLATOR  |  auth.js
   Login · Signup · Forgot Password · Validation
═══════════════════════════════════════════════════ */
if (typeof API_BASE === 'undefined') {
  var API_BASE = `http://${window.location.hostname || 'localhost'}:5000`;
}

// Fetch with abort timeout to prevent infinite hanging requests on mobile networks
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 4000 } = options; // 4 seconds timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}


// ── USER STORE ────────────────────────────────────────
function getUsers()        { return JSON.parse(localStorage.getItem('tnlp_users') || '[]'); }
function saveUsers(users)  { localStorage.setItem('tnlp_users', JSON.stringify(users)); }

// Seed demo account on first load
(function seedDemo() {
  const users = getUsers();
  if (!users.find(u => u.email === 'demo@tnlp.in')) {
    users.push({
      name: 'Arjun Kumar', username: 'arjun_k',
      email: 'demo@tnlp.in', password: btoa('password'),
      college: 'Sri Eshwar College of Engineering',
      course: 'B.E. Computer Science',
      mobile: '+91 98765 43210',
      lastLogin: new Date().toLocaleString(),
    });
    saveUsers(users);
  }
})();

// ── LOGIN ─────────────────────────────────────────────
async function doLogin() {
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value.trim();
  let ok = true;
  if (!u) { showFieldError('err-login-user'); ok = false; } else hideFieldError('err-login-user');
  if (!p) { showFieldError('err-login-pass'); ok = false; } else hideFieldError('err-login-pass');
  if (!ok) return;

  const btn = document.querySelector('.btn-primary-auth');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Connecting...';

  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ u, p: btoa(p) }),
      timeout: 4000
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Invalid credentials', 'error');
      btn.disabled = false;
      btn.innerHTML = originalText;
      return;
    }
    setSession(data.user);
    showToast('Welcome back, ' + data.user.name.split(' ')[0] + '! 🙏', 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 700);
  } catch (err) {
    console.warn('Unable to connect to backend server, attempting offline login fallback.', err);
    const users = getUsers();
    const found = users.find(user => 
      (user.username.toLowerCase() === u.toLowerCase() || user.email.toLowerCase() === u.toLowerCase()) && 
      user.password === btoa(p)
    );
    if (found) {
      setSession(found);
      showToast('Welcome back, ' + found.name.split(' ')[0] + '! 🙏 (Offline Mode)', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 700);
    } else {
      showToast('Connection timed out. Check if backend is running.', 'error');
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }
}

// ── SIGN UP ───────────────────────────────────────────
async function doSignup() {
  const name  = document.getElementById('su-name').value.trim();
  const uname = document.getElementById('su-uname').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const pass  = document.getElementById('su-pass').value.trim();
  const conf  = document.getElementById('su-confirm').value.trim();
  let ok = true;

  if (!name)                       { showFieldError('err-su-name');    ok = false; } else hideFieldError('err-su-name');
  if (!uname)                      { showFieldError('err-su-uname');   ok = false; } else hideFieldError('err-su-uname');
  if (!email || !email.includes('@')) { showFieldError('err-su-email'); ok = false; } else hideFieldError('err-su-email');
  if (!pass || pass.length < 8)    { showFieldError('err-su-pass');    ok = false; } else hideFieldError('err-su-pass');
  if (pass !== conf)               { showFieldError('err-su-confirm'); ok = false; } else hideFieldError('err-su-confirm');
  if (!ok) return;

  const btn = document.querySelector('.btn-primary-auth');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Creating account...';

  try {
    const res = await fetchWithTimeout(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username: uname, email, password: btoa(pass) }),
      timeout: 4000
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Registration failed', 'error');
      btn.disabled = false;
      btn.innerHTML = originalText;
      return;
    }
    showToast('Account created successfully! Please sign in. 🎉', 'success');
    setTimeout(() => window.location.href = 'login.html', 1200);
  } catch (err) {
    showToast('Connection timed out. Check if backend is running.', 'error');
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// ── FORGOT PASSWORD ───────────────────────────────────
function doForgot() {
  const email = document.getElementById('forgot-email').value.trim();
  if (!email || !email.includes('@')) {
    showFieldError('err-forgot-email'); return;
  }
  hideFieldError('err-forgot-email');
  showToast('Password reset link sent to ' + email, 'success');
  setTimeout(() => window.location.href = 'login.html', 1800);
}

// ── PASSWORD TOGGLE ───────────────────────────────────
function togglePass(inputId, btn) {
  const inp    = document.getElementById(inputId);
  const isPass = inp.type === 'password';
  inp.type     = isPass ? 'text' : 'password';
  btn.querySelector('i').className = isPass ? 'fa fa-eye' : 'fa fa-eye-slash';
}

// ── FIELD ERROR HELPERS ───────────────────────────────
function showFieldError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}
function hideFieldError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}
