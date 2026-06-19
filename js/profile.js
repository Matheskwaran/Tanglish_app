/* ═══════════════════════════════════════════════════
   TANGLISH → TAMIL TRANSLATOR  |  profile.js
   Profile Edit · Picture Upload · Stats · Settings
═══════════════════════════════════════════════════ */
if (typeof API_BASE === 'undefined') {
  var API_BASE = `http://${window.location.hostname || 'localhost'}:5000`;
}

// ── LOAD PROFILE ──────────────────────────────────────
// ── LOAD PROFILE ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const session = JSON.parse(localStorage.getItem('tnlp_session') || 'null');
  if (!session) return;

  // Populate form fields
  setVal('prof-name',    session.name     || '');
  setVal('prof-uname',   session.username || '');
  setVal('prof-email',   session.email    || '');
  setVal('prof-mobile',  session.mobile   || '');
  setVal('prof-college', session.college  || '');
  setVal('prof-course',  session.course   || '');

  // Header display
  setText('profile-display-name',   session.name);
  setText('profile-display-email',  session.email);
  setText('profile-display-college', session.college || 'No institution set');

  // Initials avatar
  const init = session.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  setText('profile-initials', init);

  // Stats - load from MongoDB history
  try {
    const res = await fetch(`${API_BASE}/api/history?username=` + session.username);
    if (res.ok) {
      const hist = await res.json();
      const weekly = hist.filter(h => (Date.now() - h.ts) < 7 * 24 * 3600000).length;
      setText('stat-total-p', hist.length);
      setText('stat-week-p',  weekly);
    }
  } catch (err) {
    console.warn('Failed to load history stats from backend:', err);
  }
  setText('stat-last-p',  session.lastLogin?.split(',')[0] || '–');

  // Gamification & Streaks synchronization
  const streakVal = parseInt(localStorage.getItem('tnlp_streak_' + session.username) || '1');
  const starsVal = parseInt(localStorage.getItem('tnlp_kids_stars_' + session.username) || '0');

  setText('profile-streak-badge', streakVal);
  setText('profile-stars-badge', starsVal);

  // Auto-award Streak Starter if streak >= 1
  const badgesKey = 'tnlp_badges_' + session.username;
  let badges = JSON.parse(localStorage.getItem(badgesKey) || '[]');
  if (streakVal >= 1 && !badges.includes('streak_starter')) {
    badges.push('streak_starter');
    localStorage.setItem(badgesKey, JSON.stringify(badges));
  }

  // Draw badges status
  const badgeList = ['streak_starter', 'kids_champion', 'voice_commander', 'gesture_typer'];
  badgeList.forEach(bId => {
    const el = document.getElementById('badge-' + bId);
    if (el) {
      if (badges.includes(bId)) {
        el.style.opacity = '1';
        el.style.filter = 'none';
        el.style.borderColor = 'var(--gold)';
        el.style.background = 'rgba(255, 215, 0, 0.05)';
      } else {
        el.style.opacity = '0.4';
        el.style.filter = 'grayscale(100%)';
      }
    }
  });
});

// ── SAVE PROFILE ──────────────────────────────────────
async function saveProfile() {
  const session = JSON.parse(localStorage.getItem('tnlp_session') || 'null');
  if (!session) return;

  const name = getVal('prof-name');
  const email = getVal('prof-email');
  const mobile = getVal('prof-mobile');
  const college = getVal('prof-college');
  const course = getVal('prof-course');

  try {
    const res = await fetch(`${API_BASE}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: session.username,
        name,
        email,
        mobile,
        college,
        course
      })
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Failed to update profile', 'error');
      return;
    }

    // Update local session cache
    localStorage.setItem('tnlp_session', JSON.stringify(data.user));

    // Refresh header display
    setText('profile-display-name',    data.user.name);
    setText('profile-display-college', data.user.college || 'No institution set');
    const init = data.user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    setText('profile-initials', init);
    const av = document.getElementById('nav-avatar');
    if (av) av.textContent = init;
    const sa = document.getElementById('sidebar-avatar');
    if (sa) sa.textContent = init;

    showToast('Profile updated successfully! ✅', 'success');
  } catch (err) {
    showToast('Unable to connect to backend server', 'error');
  }
}

// ── PROFILE PICTURE UPLOAD ────────────────────────────
function handlePicUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const pic = document.getElementById('profile-pic-display');
    if (pic) pic.innerHTML = `<img src="${e.target.result}" alt="Profile" />`;
    showToast('Profile picture updated!', 'success');
  };
  reader.readAsDataURL(file);
}

// ── HELPERS ───────────────────────────────────────────
function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val; }
function getVal(id)      { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function setText(id, val){ const el = document.getElementById(id); if (el) el.textContent = val; }
