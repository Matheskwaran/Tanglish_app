/* ═══════════════════════════════════════════════════
   TANGLISH → TAMIL TRANSLATOR  |  gesture.js
   MediaPipe Hand Tracking · Dwell-Timer Keyboard
   ═══════════════════════════════════════════════════ */

const KEYBOARD_LAYOUT_EN = [
  ['Lang', 'Size', 'Space', 'Back', 'Clear', 'Enter'],
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l',';'],
  ['z','x','c','v','b','n','m',',','.','?']
];

const KEYBOARD_LAYOUT_TA = [
  ['Lang', 'Size', 'Space', 'Back', 'Clear', 'Enter'],
  ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ', 'ஃ'],
  ['க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல'],
  ['வ', 'ழ', 'ள', 'ற', 'ன', 'ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை'],
  ['ொ', 'ோ', 'ௌ', '்', '!', '?', ',', '.', '(', ')']
];

let webcamStream = null;
let cameraHelper = null;
let mpHands = null;
let isGestureActive = false;
let dwellKey = null;
let dwellStart = null;
let hoverTimerInterval = null;

let currentKeyboardLang = 'en'; // 'en' or 'ta'
let currentKeyboardSize = 'normal'; // 'normal' or 'large'

// Inject dynamic stylesheet for large size and controls
(function injectKBStyles() {
  if (document.getElementById('gesture-kb-custom-style')) return;
  const style = document.createElement('style');
  style.id = 'gesture-kb-custom-style';
  style.textContent = `
    .gesture-kb-box.kb-large .g-kb-key {
      height: 56px !important;
      font-size: 1.25rem !important;
      border-radius: 10px !important;
    }
    .g-kb-key.ctrl-key {
      background: rgba(230, 126, 34, 0.15) !important;
      color: #e67e22 !important;
      border-color: rgba(230, 126, 34, 0.3) !important;
    }
    .g-kb-key.ctrl-key.hovered {
      background: #e67e22 !important;
      color: white !important;
    }
  `;
  document.head.appendChild(style);
})();

// Initialize keyboard keys
function initGestureKeyboard() {
  const container = document.getElementById('gesture-keyboard');
  if (!container) return;
  
  if (currentKeyboardSize === 'large') {
    container.classList.add('kb-large');
  } else {
    container.classList.remove('kb-large');
  }

  const layout = currentKeyboardLang === 'en' ? KEYBOARD_LAYOUT_EN : KEYBOARD_LAYOUT_TA;
  
  container.innerHTML = layout.map(row => `
    <div class="g-kb-row">
      ${row.map(key => {
        let cls = 'g-kb-key';
        let displayLabel = key;
        
        if (key === 'Space') cls += ' space-key';
        if (key === 'Back' || key === 'Clear' || key === 'Enter') cls += ' fn-key';
        
        if (key === 'Lang' || key === 'Size') {
          cls += ' ctrl-key';
          if (key === 'Lang') displayLabel = currentKeyboardLang === 'en' ? '🌐 English' : '🌐 தமிழ்';
          if (key === 'Size') displayLabel = currentKeyboardSize === 'normal' ? '🔍 Normal' : '🔍 Large';
        }
        
        return `<button class="${cls}" data-key="${key}" id="gkey-${key}">
          <span class="key-txt">${displayLabel}</span>
          <span class="key-progress" id="gprogress-${key}"></span>
        </button>`;
      }).join('')}
    </div>
  `).join('') + `<div id="gesture-cursor"></div>`;
  
  // Award badge if first opened
  unlockBadge('gesture_typer');
  
  // Add mouse fallback events for easy testing without webcam
  setupMouseFallback();
}

// Global active target input
function getTargetInput() {
  return document.getElementById('tanglish-input-2') || document.getElementById('tanglish-input');
}

function handleKeyPress(key) {
  // Custom command toggling
  if (key === 'Lang') {
    playClickSound();
    currentKeyboardLang = currentKeyboardLang === 'en' ? 'ta' : 'en';
    initGestureKeyboard();
    showToast(`Keyboard language switched to ${currentKeyboardLang === 'en' ? 'English' : 'Tamil'}`, 'info');
    return;
  }
  
  if (key === 'Size') {
    playClickSound();
    currentKeyboardSize = currentKeyboardSize === 'normal' ? 'large' : 'normal';
    initGestureKeyboard();
    showToast(`Keyboard size set to ${currentKeyboardSize.toUpperCase()}`, 'info');
    return;
  }

  const inp = getTargetInput();
  if (!inp) return;
  
  // Custom click sound
  playClickSound();

  if (key === 'Space') {
    inp.value += ' ';
  } else if (key === 'Back') {
    inp.value = inp.value.slice(0, -1);
  } else if (key === 'Clear') {
    inp.value = '';
  } else if (key === 'Enter') {
    // Trigger translator
    if (typeof doTranslate2 === 'function' && document.getElementById('tanglish-input-2')) {
      doTranslate2();
    } else if (typeof doTranslate === 'function' && document.getElementById('tanglish-input')) {
      doTranslate();
    }
  } else {
    inp.value += key;
  }
  
  // Dispatch input event to update char counters
  inp.dispatchEvent(new Event('input'));
}

function playClickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch(e){}
}

// ── MOUSE FALLBACK ────────────────────────────────────
function setupMouseFallback() {
  const gKb = document.getElementById('gesture-keyboard');
  if (!gKb) return;

  gKb.addEventListener('mousemove', (e) => {
    const rect = gKb.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    detectKeyboardCollision(x, y);
  });

  gKb.addEventListener('mouseleave', () => {
    const cursorEl = document.getElementById('gesture-cursor');
    if (cursorEl) cursorEl.style.display = 'none';
    cancelDwell();
  });

  document.querySelectorAll('.g-kb-key').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      cancelDwell();
      handleKeyPress(btn.getAttribute('data-key'));
    });
  });
}

// ── DWELL TIMER ALGORITHM ──────────────────────────────
function startDwell(key) {
  if (dwellKey === key) return;
  cancelDwell();
  
  dwellKey = key;
  dwellStart = Date.now();
  
  const progressEl = document.getElementById(`gprogress-${key}`);
  if (progressEl) progressEl.style.width = '0%';
  
  hoverTimerInterval = setInterval(() => {
    if (!dwellKey) return;
    const elapsed = Date.now() - dwellStart;
    const pct = Math.min(100, (elapsed / 2000) * 100);
    
    if (progressEl) progressEl.style.width = pct + '%';
    
    if (elapsed >= 2000) {
      handleKeyPress(dwellKey);
      // Give a tiny flash feedback
      const keyBtn = document.getElementById(`gkey-${dwellKey}`);
      if (keyBtn) {
        keyBtn.classList.add('key-activated');
        setTimeout(() => keyBtn.classList.remove('key-activated'), 150);
      }
      cancelDwell();
    }
  }, 50);
}

function cancelDwell() {
  if (dwellKey) {
    const progressEl = document.getElementById(`gprogress-${dwellKey}`);
    if (progressEl) progressEl.style.width = '0%';
  }
  clearInterval(hoverTimerInterval);
  dwellKey = null;
  dwellStart = null;
}

// ── CAMERA ENUMERATION & SWITCHING ────────────────────
function updateCameraDeviceList(activeDeviceId = null) {
  const select = document.getElementById('gesture-camera-select');
  if (!select) return;
  
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      
      // Auto-prioritize built-in webcam if no activeDeviceId is saved yet
      let defaultSelectId = activeDeviceId;
      if (!defaultSelectId && videoDevices.length > 0) {
        const builtIn = videoDevices.find(d => 
          d.label.toLowerCase().includes('integrated') || 
          d.label.toLowerCase().includes('built-in') ||
          d.label.toLowerCase().includes('webcam') ||
          d.label.toLowerCase().includes('front')
        );
        defaultSelectId = builtIn ? builtIn.deviceId : videoDevices[0].deviceId;
      }
      
      select.innerHTML = videoDevices.map((d, i) => `
        <option value="${d.deviceId}" ${defaultSelectId === d.deviceId ? 'selected' : ''}>
          ${d.label || 'Webcam ' + (i + 1)}
        </option>
      `).join('');
      
      if (videoDevices.length === 0) {
        select.innerHTML = '<option value="">No cameras found</option>';
      }
    })
    .catch(err => {
      console.warn('Enumerate devices failed: ', err);
    });
}

function changeGestureCamera() {
  if (isGestureActive) {
    stopWebcam();
    startWebcam();
  } else {
    showToast('Camera changed. Click "Open Keyboard" to start!', 'info');
  }
}

// ── WEBCAM & MEDIAPIPE GESTURES ────────────────────────
function toggleGestureKeyboard() {
  const wrapper = document.getElementById('gesture-section-wrapper');
  const btn = document.getElementById('btn-toggle-gesture');
  
  if (!wrapper) return;
  
  if (isGestureActive) {
    // STOP
    isGestureActive = false;
    wrapper.style.display = 'none';
    if (btn) btn.innerHTML = `<i class="fa fa-keyboard"></i> Open Accessibility Keyboard`;
    stopWebcam();
  } else {
    // START
    isGestureActive = true;
    wrapper.style.display = 'block';
    if (btn) btn.innerHTML = `<i class="fa fa-times"></i> Close Accessibility Keyboard`;
    initGestureKeyboard();
    startWebcam();
  }
}

function startWebcam() {
  const video = document.getElementById('gesture-video');
  const canvas = document.getElementById('gesture-canvas');
  const overlay = document.getElementById('gesture-loading-overlay');
  const cameraSelect = document.getElementById('gesture-camera-select');
  
  if (!video || !canvas) return;
  
  if (overlay) overlay.style.display = 'flex';
  
  let constraints = { video: true };
  if (cameraSelect && cameraSelect.value) {
    constraints = { video: { deviceId: { exact: cameraSelect.value } } };
  }
  
  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      webcamStream = stream;
      video.srcObject = stream;
      video.play();
      
      // Get actual active track and deviceId to select in dropdown
      const activeTrack = stream.getVideoTracks()[0];
      const activeSettings = activeTrack ? activeTrack.getSettings() : {};
      const activeId = activeSettings.deviceId || (cameraSelect ? cameraSelect.value : null);
      
      // Re-populate device list with real labels (now that permission is granted)
      updateCameraDeviceList(activeId);
      
      // Load MediaPipe Hands
      loadMediaPipeScripts(() => {
        initMediaPipeHands(video, canvas);
        if (overlay) overlay.style.display = 'none';
      });
    })
    .catch(err => {
      showToast('Could not access camera. Mouse fallback mode is active!', 'info');
      if (overlay) overlay.style.display = 'none';
      console.warn('Camera blocked/unavailable: ', err);
    });
}

function stopWebcam() {
  cancelDwell();
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
  if (cameraHelper) {
    cameraHelper.stop();
    cameraHelper = null;
  }
  mpHands = null;
}

function loadMediaPipeScripts(callback) {
  if (window.Hands) {
    callback();
    return;
  }
  
  // Load Camera utils first
  const camScript = document.createElement('script');
  camScript.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
  camScript.crossOrigin = "anonymous";
  camScript.onload = () => {
    // Load Hands library next
    const handsScript = document.createElement('script');
    handsScript.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
    handsScript.crossOrigin = "anonymous";
    handsScript.onload = callback;
    document.body.appendChild(handsScript);
  };
  document.body.appendChild(camScript);
}

function initMediaPipeHands(video, canvas) {
  const ctx = canvas.getContext('2d');
  
  mpHands = new window.Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });
  
  mpHands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
  });
  
  mpHands.onResults((results) => {
    // Draw feed and tracking skeleton on canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw mirrored video frame
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      
      // Index finger tip is landmark index 8
      const indexTip = landmarks[8];
      
      // Mirror the x-coordinate because the feed is mirrored
      const cursorX = 1 - indexTip.x;
      const cursorY = indexTip.y;
      
      // Draw index tip point on canvas
      ctx.beginPath();
      ctx.arc(cursorX * canvas.width, cursorY * canvas.height, 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#ff7f50';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw tracking line
      drawHandSkeleton(ctx, landmarks, canvas.width, canvas.height);
      
      // Map indexTip to the virtual keyboard bounding boxes
      detectKeyboardCollision(cursorX, cursorY);
    } else {
      // Hide cursor if no hand is detected
      const cursorEl = document.getElementById('gesture-cursor');
      if (cursorEl) cursorEl.style.display = 'none';
      cancelDwell();
    }
  });
  
  cameraHelper = new window.Camera(video, {
    onFrame: async () => {
      if (isGestureActive && mpHands) {
        await mpHands.send({ image: video });
      }
    },
    width: 320,
    height: 240
  });
  cameraHelper.start();
}

function drawHandSkeleton(ctx, landmarks, w, h) {
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
  ctx.lineWidth = 2;
  // Connection pathways (simple tracing of finger lines)
  const connections = [
    [0, 1, 2, 3, 4], // Thumb
    [0, 5, 6, 7, 8], // Index
    [0, 9, 10, 11, 12], // Middle
    [0, 13, 14, 15, 16], // Ring
    [0, 17, 18, 19, 20] // Pinky
  ];
  connections.forEach(path => {
    ctx.beginPath();
    path.forEach((idx, step) => {
      const pt = landmarks[idx];
      const x = (1 - pt.x) * w;
      const y = pt.y * h;
      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}

function detectKeyboardCollision(x, y) {
  const cursorEl = document.getElementById('gesture-cursor');
  const gKb = document.getElementById('gesture-keyboard');
  if (!cursorEl || !gKb) return;
  
  const gKbRect = gKb.getBoundingClientRect();
  
  // Position virtual cursor on top of the keyboard element
  cursorEl.style.display = 'block';
  const leftPos = x * gKb.offsetWidth;
  const topPos = y * gKb.offsetHeight;
  
  cursorEl.style.left = leftPos + 'px';
  cursorEl.style.top = topPos + 'px';
  
  // Calculate absolute coordinates of cursor to find intersection key
  const cursorAbsX = gKbRect.left + leftPos;
  const cursorAbsY = gKbRect.top + topPos;
  
  let hoveredKeyBtn = null;
  
  document.querySelectorAll('.g-kb-key').forEach(btn => {
    const r = btn.getBoundingClientRect();
    if (cursorAbsX >= r.left && cursorAbsX <= r.right && cursorAbsY >= r.top && cursorAbsY <= r.bottom) {
      hoveredKeyBtn = btn;
    }
  });
  
  if (hoveredKeyBtn) {
    const key = hoveredKeyBtn.getAttribute('data-key');
    // Highlight hover visual feedback
    document.querySelectorAll('.g-kb-key').forEach(b => b.classList.remove('hovered'));
    hoveredKeyBtn.classList.add('hovered');
    startDwell(key);
  } else {
    document.querySelectorAll('.g-kb-key').forEach(b => b.classList.remove('hovered'));
    cancelDwell();
  }
}



// Populate camera dropdown on initial DOM load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('gesture-camera-select')) {
    updateCameraDeviceList();
  }
});
