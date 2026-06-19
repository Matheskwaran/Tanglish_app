/* ═══════════════════════════════════════════════════
   TANGLISH → TAMIL TRANSLATOR  |  translator.js
   NLP Engine · Two-way Translation · OCR Helper
   ═══════════════════════════════════════════════════ */
if (typeof API_BASE === 'undefined') {
  var API_BASE = `http://${window.location.hostname || 'localhost'}:5000`;
}

// ── TANGLISH → TAMIL DICTIONARY ───────────────────────
const TANGLISH_MAP = {
  'vanakkam':         'வணக்கம்',
  'nandri':           'நன்றி',
  'romba nandri':     'மிகவும் நன்றி',
  'eppadi irukkinga': 'எப்படி இருக்கீங்க',
  'eppadi':           'எப்படி',
  'naan':             'நான்',
  'nee':              'நீ',
  'avan':             'அவன்',
  'aval':             'அவள்',
  'avanga':           'அவங்க',
  'yaar':             'யார்',
  'enna':             'என்ன',
  'enge':             'எங்கே',
  'engae':            'எங்கே',
  'eppo':             'எப்போ',
  'seri':             'சரி',
  'sari':             'சரி',
  'vaa':              'வா',
  'sollu':            'சொல்லு',
  'paaru':            'பாரு',
  'konjam':           'கொஞ்சம்',
  'romba':            'ரொம்ப',
  'nalla':            'நல்ல',
  'peyar':            'பெயர்',
  'en peyar':         'என் பெயர்',
  'unnoda peyar':     'உன்னோட பெயர்',
  'kadhalikkiren':    'காதலிக்கிறேன்',
  'ini enna':         'இனி என்ன',
  'pannalaam':        'பண்ணலாம்',
  'panna':            'பண்ண',
  'pannuvom':         'பண்ணுவோம்',
  'irukken':          'இருக்கேன்',
  'irukka':           'இருக்க',
  'irukkinga':        'இருக்கீங்க',
  'varuven':          'வருவேன்',
  'poguven':          'போவேன்',
  'solluven':         'சொல்லுவேன்',
  'theriyum':         'தெரியும்',
  'theriyathu':       'தெரியாது',
  'purigirathu':      'புரிகிறது',
  'puriyathu':        'புரியாது',
  'summa':            'சும்மா',
  'thevai':           'தேவை',
  'illai':            'இல்லை',
  'aama':             'ஆமா',
  'illa':             'இல்ல',
  'ungalai':          'உங்களை',
  'ungalukku':        'உங்களுக்கு',
  'enakku':           'எனக்கு',
  'unakku':           'உனக்கு',
  'thamizh':          'தமிழ்',
  'tamil':            'தமிழ்',
  'chennai':          'சென்னை',
  'madurai':          'மதுரை',
  'coimbatore':       'கோயம்புத்தூர்',
  'tiruppur':         'திருப்பூர்',
  'school':           'பள்ளி',
  'college':          'கல்லூரி',
  'padikkiren':       'படிக்கிறேன்',
  'padikarom':        'படிக்கிறோம்',
  'vaazhthukal':      'வாழ்த்துகள்',
  'nan':              'நான்',
  'la irukken':       'ல இருக்கேன்',
  'la':               'ல',
  'un':               'உன்',
  'en':               'என்',
  'po':               'போ',
};

// ── SYLLABLE FALLBACK ─────────────────────────────────
const SYLLABLE_RULES = [
  [/th/g,'த்'], [/sh/g,'ஷ்'], [/ch/g,'ச்'], [/ng/g,'ங்'], [/nj/g,'ஞ்'],
  [/aa/g,'ஆ'],  [/ee/g,'ஈ'],  [/oo/g,'ஊ'],  [/ai/g,'ஐ'],  [/au/g,'ஔ'],
  [/kk/g,'க்க'],[/tt/g,'ட்ட'],[/pp/g,'ப்ப'],[/nn/g,'ன்ன'],[/mm/g,'ம்ம'],
  [/ka/g,'க'],  [/ki/g,'கி'], [/ku/g,'கு'], [/ke/g,'கே'], [/ko/g,'கோ'],
  [/ga/g,'க'],  [/gi/g,'கி'], [/gu/g,'கு'],
  [/ta/g,'த'],  [/ti/g,'தி'], [/tu/g,'து'], [/te/g,'தே'], [/to/g,'தோ'],
  [/da/g,'த'],  [/di/g,'தி'], [/du/g,'து'],
  [/pa/g,'ப'],  [/pi/g,'பி'], [/pu/g,'பு'], [/pe/g,'பே'], [/po/g,'போ'],
  [/ba/g,'ப'],  [/bi/g,'பி'], [/bu/g,'பு'],
  [/ma/g,'ம'],  [/mi/g,'மி'], [/mu/g,'மு'], [/me/g,'மே'], [/mo/g,'மோ'],
  [/na/g,'ந'],  [/ni/g,'நி'], [/nu/g,'நு'], [/ne/g,'நே'], [/no/g,'நோ'],
  [/va/g,'வ'],  [/vi/g,'வி'], [/vu/g,'வு'], [/ve/g,'வே'], [/vo/g,'வோ'],
  [/ya/g,'ய'],  [/yi/g,'யி'], [/yu/g,'யு'], [/ye/g,'யே'], [/yo/g,'யோ'],
  [/ra/g,'ர'],  [/ri/g,'ரி'], [/ru/g,'ரு'], [/re/g,'ரே'], [/ro/g,'ரோ'],
  [/la/g,'ல'],  [/li/g,'லி'], [/lu/g,'லு'], [/le/g,'லே'], [/lo/g,'லோ'],
  [/sa/g,'ச'],  [/si/g,'சி'], [/su/g,'சு'], [/se/g,'சே'], [/so/g,'சோ'],
  [/ja/g,'ஜ'],  [/ji/g,'ஜி'], [/ju/g,'ஜு'],
  [/ha/g,'ஹ'],  [/hi/g,'ஹி'], [/hu/g,'ஹு'],
  [/a/g,'அ'],   [/i/g,'இ'],   [/u/g,'உ'],   [/e/g,'எ'],   [/o/g,'ஓ'],
  [/k/g,'க்'],  [/g/g,'க்'],  [/t/g,'த்'],  [/d/g,'த்'],
  [/p/g,'ப்'],  [/b/g,'ப்'],  [/m/g,'ம்'],  [/n/g,'ன்'],
  [/v/g,'வ்'],  [/w/g,'வ்'],  [/y/g,'ய்'],  [/r/g,'ர்'],
  [/l/g,'ல்'],  [/s/g,'ஸ்'],  [/h/g,'ஹ்'],  [/j/g,'ஜ்'],
  [/f/g,'ஃப்'],[/z/g,'ஸ்'],
];

let translationDirection = 'en-ta'; // Default: English to Tamil
let ocrImageSource = null;
let ocrCameraStream = null;

function transliterate(input) {
  if (!input.trim()) return '';
  let text = input.toLowerCase().trim();
  // Longest-match dictionary lookup first
  const keys = Object.keys(TANGLISH_MAP).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const re = new RegExp('\\b' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    text = text.replace(re, TANGLISH_MAP[key]);
  }
  // Syllable-level fallback for remaining Latin words
  text = text.replace(/\b([a-z]+)\b/g, (m) => {
    let w = m;
    for (const [re, rep] of SYLLABLE_RULES) w = w.replace(re, rep);
    return w;
  });
  return text;
}

// ── DUAL LANGUAGE ROTATION ────────────────────────────
function toggleTranslationDirection() {
  translationDirection = translationDirection === 'en-ta' ? 'ta-en' : 'en-ta';
  
  const lblSrc = document.getElementById('label-lang-src');
  const lblTgt = document.getElementById('label-lang-tgt');
  const lblInp = document.getElementById('lbl-input-title');
  const lblOut = document.getElementById('lbl-output-title');
  const inpField = document.getElementById('tanglish-input-2');
  const outField = document.getElementById('tamil-output-2');
  
  if (translationDirection === 'en-ta') {
    if (lblSrc) lblSrc.textContent = 'Tanglish/English';
    if (lblTgt) lblTgt.textContent = 'Tamil (தமிழ்)';
    if (lblInp) lblInp.textContent = 'English / Tanglish Script Input';
    if (lblOut) lblOut.textContent = 'Tamil Output (Unicode)';
    if (inpField) inpField.placeholder = 'Type or paste Tanglish text...';
    if (outField) outField.placeholder = 'தமிழ் மொழிபெயர்ப்பு...';
  } else {
    if (lblSrc) lblSrc.textContent = 'Tamil (தமிழ்)';
    if (lblTgt) lblTgt.textContent = 'English (ஆங்கிலம்)';
    if (lblInp) lblInp.textContent = 'Tamil Unicode Input';
    if (lblOut) lblOut.textContent = 'English Output';
    if (inpField) inpField.placeholder = 'தமிழ் எழுத்துக்களை தட்டச்சு செய்ய அல்லது ஒட்டவும்...';
    if (outField) outField.placeholder = 'English Translation...';
  }
  
  // Clear areas
  if (inpField) inpField.value = '';
  if (outField) outField.value = '';
  showToast('Translation direction swapped!', 'info');
}

// ── MYMEMORY TRANSLATION API INTEGRATION ──────────────
async function fetchTranslation(text, dir) {
  const pair = dir === 'en-ta' ? 'en|ta' : 'ta|en';
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
  } catch (err) {
    console.warn('API Translation failed, falling back to local model', err);
  }
  return null;
}

// ── HISTORY HELPERS ───────────────────────────────────
function getHistoryKey() {
  const session = JSON.parse(localStorage.getItem('tnlp_session') || 'null');
  return session ? 'tnlp_hist_' + session.username : null;
}
// ── HISTORY HELPERS ───────────────────────────────────
function getHistoryKey() {
  const session = JSON.parse(localStorage.getItem('tnlp_session') || 'null');
  return session ? 'tnlp_hist_' + session.username : null;
}
async function loadHistory() {
  const session = JSON.parse(localStorage.getItem('tnlp_session') || 'null');
  if (!session) return [];
  try {
    const res = await fetch(`${API_BASE}/api/history?username=` + session.username);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to load history from MongoDB:', err);
  }
  return [];
}
async function addToHistory(input, output) {
  const session = JSON.parse(localStorage.getItem('tnlp_session') || 'null');
  if (!session) return;
  try {
    await fetch(`${API_BASE}/api/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: session.username, input, output })
    });
  } catch (err) {
    console.error('Failed to add to history in MongoDB:', err);
  }
}
async function clearHistory() {
  const session = JSON.parse(localStorage.getItem('tnlp_session') || 'null');
  if (!session) return;
  try {
    const res = await fetch(`${API_BASE}/api/history?username=` + session.username, {
      method: 'DELETE'
    });
    if (res.ok) {
      await renderDashboardHistory();
      showToast('History cleared', 'info');
    }
  } catch (err) {
    showToast('Failed to clear history on backend', 'error');
  }
}

// ── TRANSLATE ACTIONS ─────────────────────────────────

// Smart heuristic to check if input is phonetic Tanglish or formal English
function isTanglishInput(text) {
  const commonTanglish = [
    'vanakkam', 'nandri', 'romba', 'eppadi', 'iruk', 'naan', 'nee', 'enna', 
    'yaar', 'seri', 'sari', 'vaa', 'sollu', 'paaru', 'nalla', 'peyar', 'en', 
    'un', 'po', 'la', 'unga', 'eppadi', 'epadi', 'theriyum', 'illai', 'illa',
    'enoda', 'unnoda', 'kadhal', 'kathal', 'aval', 'avan', 'avanga', 'aama'
  ];
  const lowercase = text.toLowerCase().trim();
  
  // Single or two-word queries are usually transliterated phonetically
  if (lowercase.split(/\s+/).length <= 2) return true;
  
  // Contains common Tanglish roots
  const hasTanglishWord = commonTanglish.some(word => {
    const re = new RegExp('\\b' + word, 'i');
    return re.test(lowercase);
  });
  if (hasTanglishWord) return true;
  
  // Absence of typical English stop words implies Tanglish
  const englishStopWords = [' the ', ' and ', ' of ', ' to ', ' is ', ' you ', ' are ', ' was ', ' for ', ' they ', ' that '];
  const hasEnglishStop = englishStopWords.some(stop => lowercase.includes(stop));
  
  return !hasEnglishStop;
}

/* Dashboard quick translator */
async function doTranslate() {
  const inp     = document.getElementById('tanglish-input');
  const out     = document.getElementById('tamil-output');
  const overlay = document.getElementById('loading-overlay');
  if (!inp || !inp.value.trim()) { showToast('Please enter some text', 'info'); return; }
  if (overlay) overlay.classList.add('show');
  
  const text = inp.value.trim();
  let result = null;
  
  if (translationDirection === 'en-ta') {
    if (isTanglishInput(text)) {
      result = transliterate(text);
    } else {
      result = await fetchTranslation(text, 'en-ta');
      // Verify the API actually returned Tamil characters, else fallback to transliterating
      if (!result || !/[\u0B80-\u0BFF]/.test(result)) {
        result = transliterate(text);
      }
    }
  }
  
  if (out) out.value = result;
  if (overlay) overlay.classList.remove('show');
  
  await addToHistory(text, result);
  await renderDashboardHistory();
  await checkFavoriteState(text, 'btn-fav');
  showToast('Translation complete! 🎉', 'success');
  await updateStats();
}

/* Full translator page with MyMemory translation */
async function doTranslate2() {
  const inp = document.getElementById('tanglish-input-2');
  const out = document.getElementById('tamil-output-2');
  if (!inp || !inp.value.trim()) { showToast('Please enter some text', 'info'); return; }
  
  const text = inp.value.trim();
  let result = null;
  
  if (translationDirection === 'en-ta') {
    if (isTanglishInput(text)) {
      result = transliterate(text);
    } else {
      result = await fetchTranslation(text, 'en-ta');
      // Verify the API actually returned Tamil characters, else fallback to transliterating
      if (!result || !/[\u0B80-\u0BFF]/.test(result)) {
        result = transliterate(text);
      }
    }
  } else {
    // Tamil to English translation
    result = await fetchTranslation(text, 'ta-en');
    if (!result) {
      // Reverse word-by-word matching fallback
      const words = text.split(/\s+/);
      const reverseMap = {};
      Object.entries(TANGLISH_MAP).forEach(([k, v]) => { reverseMap[v] = k; });
      result = words.map(w => reverseMap[w] || w).join(' ');
    }
  }
  
  if (out) out.value = result;
  await addToHistory(text, result);
  await checkFavoriteState(text, 'btn-fav-2');
  showToast('Translation complete! 🎉', 'success');
}

/* Copy buttons */
function copyOutput()  { copyToClipboard(document.getElementById('tamil-output')?.value); }
function copyOutput2() { copyToClipboard(document.getElementById('tamil-output-2')?.value); }
function copyToClipboard(text) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!', 'success'));
}

/* Clear buttons */
function clearAll() {
  const inp = document.getElementById('tanglish-input');
  const out = document.getElementById('tamil-output');
  if (inp) { inp.value = ''; document.getElementById('char-count').textContent = '0'; }
  if (out)  out.value = '';
  const btn = document.getElementById('btn-fav');
  if (btn) {
    const icon = btn.querySelector('i');
    if (icon) { icon.className = 'fa-regular fa-star'; icon.style.color = ''; }
  }
}
function clearAll2() {
  const inp = document.getElementById('tanglish-input-2');
  const out = document.getElementById('tamil-output-2');
  if (inp) { inp.value = ''; document.getElementById('char-count-2').textContent = '0'; }
  if (out)  out.value = '';
  const btn = document.getElementById('btn-fav-2');
  if (btn) {
    const icon = btn.querySelector('i');
    if (icon) { icon.className = 'fa-regular fa-star'; icon.style.color = ''; }
  }
}

/* Speak (TTS) */
function speakOutput()  { speak(document.getElementById('tamil-output')?.value, 'ta-IN'); }
function speakOutput2() {
  const lang = translationDirection === 'en-ta' ? 'ta-IN' : 'en-US';
  speak(document.getElementById('tamil-output-2')?.value, lang);
}
function speak(text, lang) {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel(); // Prevent queue delays
  
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang || 'ta-IN';
  u.rate = 0.9;
  
  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').includes(u.lang.toLowerCase().replace('_', '-')));
  if (matchingVoice) {
    u.voice = matchingVoice;
  } else {
    // Loose matching fallback
    const looseVoice = voices.find(v => v.lang.startsWith(u.lang.split('-')[0]));
    if (looseVoice) u.voice = looseVoice;
  }
  
  window.speechSynthesis.speak(u);
}

/* Download */
function downloadOutput2() {
  const text = document.getElementById('tamil-output-2')?.value;
  if (!text) { showToast('Nothing to download', 'info'); return; }
  const a = document.createElement('a');
  a.href     = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
  a.download = 'tamil_translation.txt';
  a.click();
}

/* Character counters */
function updateChar()  {
  const inp = document.getElementById('tanglish-input');
  const cc  = document.getElementById('char-count');
  if (inp && cc) cc.textContent = inp.value.length;
}
function updateChar2() {
  const inp = document.getElementById('tanglish-input-2');
  const cc  = document.getElementById('char-count-2');
  if (inp && cc) cc.textContent = inp.value.length;
}

/* Quick chip helpers */
function setInput(t)  { const inp = document.getElementById('tanglish-input');  if (inp) { inp.value = t; updateChar();  } }
function setInput2(t) { const inp = document.getElementById('tanglish-input-2'); if (inp) { inp.value = t; updateChar2(); } }

// ── HISTORY RENDER ────────────────────────────────────
async function renderDashboardHistory() {
  const el = document.getElementById('dashboard-history-body');
  if (!el) return;
  const hist = (await loadHistory()).slice(0, 5);
  if (!hist.length) {
    el.innerHTML = '<div class="empty-history"><i class="fa fa-language"></i><p>No translations yet. Try translating something!</p></div>';
    return;
  }
  el.innerHTML = buildTable(hist);
}

function buildTable(arr) {
  return `<table class="history-table">
    <thead><tr><th>#</th><th>Input Text</th><th>Output Translation</th><th>Time</th></tr></thead>
    <tbody>${arr.map((h, i) => `
      <tr>
        <td style="color:var(--text-muted);font-size:0.78rem">${i + 1}</td>
        <td>${esc(h.input)}</td>
        <td class="tamil-cell">${esc(h.output)}</td>
        <td class="time-cell">${new Date(h.ts).toLocaleString()}</td>
      </tr>`).join('')}</tbody></table>`;
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── STATS UPDATE ──────────────────────────────────────
async function updateStats() {
  const hist   = await loadHistory();
  const total  = hist.length;
  const today  = hist.filter(h => new Date(h.ts).toDateString() === new Date().toDateString()).length;
  const session = JSON.parse(localStorage.getItem('tnlp_session') || 'null');

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('stat-total', total);
  set('stat-today', today);
  set('stat-last',  session?.lastLogin?.split(',')[0] || '–');
}

// ── OCR FUNCTIONS ─────────────────────────────────────
function handleOCRUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const imgEl = document.getElementById('ocr-preview-img');
    imgEl.src = e.target.result;
    imgEl.style.display = 'block';
    ocrImageSource = e.target.result;
    
    // Enable OCR execution button
    document.getElementById('btn-run-ocr').style.display = 'block';
    showToast('Image uploaded successfully! Click Extract to run OCR.', 'success');
  };
  reader.readAsDataURL(file);
}

function toggleOCRCamera() {
  const panel = document.getElementById('ocr-camera-wrapper');
  const video = document.getElementById('ocr-video');
  
  if (ocrCameraStream) {
    stopOCRCamera();
    panel.style.display = 'none';
  } else {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        ocrCameraStream = stream;
        video.srcObject = stream;
        video.play();
        panel.style.display = 'flex';
      })
      .catch(err => {
        showToast('Camera blocked or unavailable', 'error');
        console.error(err);
      });
  }
}

function stopOCRCamera() {
  if (ocrCameraStream) {
    ocrCameraStream.getTracks().forEach(track => track.stop());
    ocrCameraStream = null;
  }
}

function captureOCRSnapshot() {
  const video = document.getElementById('ocr-video');
  const canvas = document.getElementById('ocr-snap-canvas');
  const imgEl = document.getElementById('ocr-preview-img');
  
  if (!video || !canvas) return;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const snapUrl = canvas.toDataURL('image/png');
  imgEl.src = snapUrl;
  imgEl.style.display = 'block';
  ocrImageSource = snapUrl;
  
  document.getElementById('btn-run-ocr').style.display = 'block';
  stopOCRCamera();
  document.getElementById('ocr-camera-wrapper').style.display = 'none';
  showToast('Snapshot captured!', 'success');
}

function handleOCRProgress(m) {
  const container = document.getElementById('ocr-progress-container');
  const statusEl = document.getElementById('ocr-status-text');
  const pctEl = document.getElementById('ocr-pct-text');
  const fillEl = document.getElementById('ocr-progress-fill');
  
  if (!container) return;
  container.style.display = 'flex';
  
  if (m.status === 'recognizing text') {
    statusEl.textContent = 'Extracting Text (Tesseract OCR)...';
    const pct = Math.round(m.progress * 100);
    pctEl.textContent = pct + '%';
    fillEl.style.width = pct + '%';
  } else {
    statusEl.textContent = m.status;
    pctEl.textContent = '...';
  }
}

function performOCRTextExtraction() {
  if (!ocrImageSource) {
    showToast('Please upload or capture an image first', 'info');
    return;
  }
  
  if (typeof Tesseract === 'undefined') {
    showToast('OCR engine not loaded yet. Check internet connection.', 'error');
    return;
  }
  
  document.getElementById('btn-run-ocr').disabled = true;
  document.getElementById('btn-run-ocr').innerHTML = `<i class="fa fa-spinner fa-spin"></i> Processing OCR...`;
  
  // Set language preference depending on current direction or load both (English + Tamil)
  const ocrLang = translationDirection === 'en-ta' ? 'eng+tam' : 'tam+eng';
  
  Tesseract.recognize(
    ocrImageSource,
    ocrLang,
    { logger: handleOCRProgress }
  ).then(({ data: { text } }) => {
    document.getElementById('ocr-progress-container').style.display = 'none';
    document.getElementById('btn-run-ocr').disabled = false;
    document.getElementById('btn-run-ocr').innerHTML = `<i class="fa fa-search"></i> Extract &amp; Translate Text`;
    
    if (!text.trim()) {
      showToast('No text detected in the image', 'error');
      return;
    }
    
    showToast('OCR Extraction complete! 🎉', 'success');
    
    // Inject into translator input
    const inp = document.getElementById('tanglish-input-2');
    if (inp) {
      inp.value = text.trim();
      inp.dispatchEvent(new Event('input'));
      
      // Auto-translate
      doTranslate2();
    }
  }).catch(err => {
    document.getElementById('ocr-progress-container').style.display = 'none';
    document.getElementById('btn-run-ocr').disabled = false;
    document.getElementById('btn-run-ocr').innerHTML = `<i class="fa fa-search"></i> Extract &amp; Translate Text`;
    showToast('OCR Processing failed', 'error');
    console.error(err);
  });
}

// ── SAVED VOCABULARY (FAVORITES) INTEGRATION ───────────
async function loadFavorites() {
  const session = JSON.parse(localStorage.getItem('tnlp_session') || 'null');
  if (!session) return [];
  const localKey = 'tnlp_favs_' + session.username;
  try {
    const res = await fetch(`${API_BASE}/api/favorites?username=` + session.username);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(localKey, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Failed to load favorites from backend, falling back to localStorage:', err);
  }
  return JSON.parse(localStorage.getItem(localKey) || '[]');
}

async function toggleFavorite(input, output, starBtnId) {
  const session = JSON.parse(localStorage.getItem('tnlp_session') || 'null');
  if (!session) {
    showToast('Please login to save words', 'info');
    return;
  }
  const btn = document.getElementById(starBtnId);
  const icon = btn?.querySelector('i');
  if (!icon) return;

  const isStarred = icon.classList.contains('fa-solid');
  const localKey = 'tnlp_favs_' + session.username;
  let localFavs = JSON.parse(localStorage.getItem(localKey) || '[]');

  try {
    if (isStarred) {
      // Unstar
      const res = await fetch(`${API_BASE}/api/favorites?username=${session.username}&input=${encodeURIComponent(input)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        icon.className = 'fa-regular fa-star';
        icon.style.color = '';
        showToast('Removed from Saved Vocabulary', 'info');
      }
      localFavs = localFavs.filter(f => f.input !== input);
      localStorage.setItem(localKey, JSON.stringify(localFavs));
    } else {
      // Star
      const res = await fetch(`${API_BASE}/api/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: session.username, input, output })
      });
      if (res.ok) {
        icon.className = 'fa-solid fa-star';
        icon.style.color = '#f1c40f';
        showToast('Saved to Vocabulary! ⭐', 'success');
      }
      if (!localFavs.some(f => f.input === input)) {
        localFavs.push({ username: session.username, input, output, ts: Date.now() });
        localStorage.setItem(localKey, JSON.stringify(localFavs));
      }
    }
    await renderDashboardFavorites();
  } catch (err) {
    // Local offline toggle fallback
    if (isStarred) {
      icon.className = 'fa-regular fa-star';
      icon.style.color = '';
      localFavs = localFavs.filter(f => f.input !== input);
      showToast('Removed from Saved Vocabulary (Offline)', 'info');
    } else {
      icon.className = 'fa-solid fa-star';
      icon.style.color = '#f1c40f';
      if (!localFavs.some(f => f.input === input)) {
        localFavs.push({ username: session.username, input, output, ts: Date.now() });
      }
      showToast('Saved to Vocabulary (Offline)! ⭐', 'success');
    }
    localStorage.setItem(localKey, JSON.stringify(localFavs));
    await renderDashboardFavorites();
  }
}

async function checkFavoriteState(input, starBtnId) {
  const btn = document.getElementById(starBtnId);
  const icon = btn?.querySelector('i');
  if (!icon) return;
  if (!input.trim()) {
    icon.className = 'fa-regular fa-star';
    icon.style.color = '';
    return;
  }
  const favs = await loadFavorites();
  const found = favs.some(f => f.input.toLowerCase() === input.trim().toLowerCase());
  if (found) {
    icon.className = 'fa-solid fa-star';
    icon.style.color = '#f1c40f';
  } else {
    icon.className = 'fa-regular fa-star';
    icon.style.color = '';
  }
}

async function renderDashboardFavorites() {
  const el = document.getElementById('dashboard-favorites-body');
  if (!el) return;
  const favs = await loadFavorites();
  if (!favs.length) {
    el.innerHTML = '<div class="empty-history" style="padding: 10px 0;"><p style="font-size:0.8rem">Star translations to save them here for practice.</p></div>';
    return;
  }
  el.innerHTML = favs.map(f => `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:8px; margin-bottom:4px; gap:8px">
      <div style="flex:1; min-width:0">
        <div style="font-weight:600; font-size:0.82rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--text)">${esc(f.input)}</div>
        <div style="font-family:\'Lora\',serif; font-size:0.88rem; color:var(--maroon); overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${esc(f.output)}</div>
      </div>
      <button class="nav-icon-btn" onclick="speak(\'${esc(f.output.replace(/\'/g, "\\\'"))}\', \'ta-IN\')" style="width:28px; height:28px; font-size:12px; background:none; flex-shrink:0" title="Listen"><i class="fa fa-volume-up"></i></button>
      <button class="nav-icon-btn" onclick="deleteFavoriteDirect(\'${esc(f.input.replace(/\'/g, "\\\'"))}\')" style="width:28px; height:28px; font-size:12px; background:none; color:#e74c3c; flex-shrink:0" title="Delete"><i class="fa fa-trash"></i></button>
    </div>
  `).join('');
}

async function deleteFavoriteDirect(input) {
  const session = JSON.parse(localStorage.getItem('tnlp_session') || 'null');
  if (!session) return;
  const localKey = 'tnlp_favs_' + session.username;
  try {
    const res = await fetch(`${API_BASE}/api/favorites?username=${session.username}&input=${encodeURIComponent(input)}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      showToast('Removed from Saved Vocabulary', 'info');
    }
  } catch (err) {
    showToast('Removed from Saved Vocabulary (Offline)', 'info');
  }
  let localFavs = JSON.parse(localStorage.getItem(localKey) || '[]');
  localFavs = localFavs.filter(f => f.input !== input);
  localStorage.setItem(localKey, JSON.stringify(localFavs));
  await renderDashboardFavorites();
  
  // Refresh current page UI states
  const currentInp = document.getElementById('tanglish-input')?.value || '';
  const currentInp2 = document.getElementById('tanglish-input-2')?.value || '';
  if (currentInp) checkFavoriteState(currentInp, 'btn-fav');
  if (currentInp2) checkFavoriteState(currentInp2, 'btn-fav-2');
}

function toggleFavoriteCurrent() {
  const inp = document.getElementById('tanglish-input')?.value || '';
  const out = document.getElementById('tamil-output')?.value || '';
  if (!inp.trim() || !out.trim()) {
    showToast('Translate something first to save it', 'info');
    return;
  }
  toggleFavorite(inp, out, 'btn-fav');
}

function toggleFavoriteCurrent2() {
  const inp = document.getElementById('tanglish-input-2')?.value || '';
  const out = document.getElementById('tamil-output-2')?.value || '';
  if (!inp.trim() || !out.trim()) {
    showToast('Translate something first to save it', 'info');
    return;
  }
  toggleFavorite(inp, out, 'btn-fav-2');
}

// ── INIT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderDashboardHistory();
  renderDashboardFavorites();
  updateStats();
  // Check active panel states
  const currentInp = document.getElementById('tanglish-input')?.value || '';
  if (currentInp) checkFavoriteState(currentInp, 'btn-fav');
  const currentInp2 = document.getElementById('tanglish-input-2')?.value || '';
  if (currentInp2) checkFavoriteState(currentInp2, 'btn-fav-2');
  
  // Ctrl+Enter shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (document.getElementById('tanglish-input-2')) doTranslate2();
      else doTranslate();
    }
  });
});
