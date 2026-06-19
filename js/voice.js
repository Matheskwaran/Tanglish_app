/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TANGLISH â†’ TAMIL TRANSLATOR  |  voice.js
   Speech-to-Text Commands Â· Global Voice Assistant
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

let voiceRecognition = null;
let isVoiceListening = false;

document.addEventListener('DOMContentLoaded', () => {
  injectVoiceAssistantUI();
  initVoiceRecognition();
});

// Dynamic Injection of floating Voice Assistant FAB & styles
function injectVoiceAssistantUI() {
  if (document.getElementById('voice-assistant-fab')) return;
  
  // Style injection
  const css = document.createElement('style');
  css.textContent = `
    .voice-fab {
      position: fixed; bottom: 24px; left: 24px; z-index: 1000;
      width: 54px; height: 54px; border-radius: 50%;
      background: linear-gradient(135deg, #800020, #a5003a);
      color: #FFD700; border: 2px solid #FFD700;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; cursor: pointer;
      box-shadow: 0 4px 20px rgba(128,0,32,0.4);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .voice-fab:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(128,0,32,0.5); }
    .voice-fab.listening {
      background: #e74c3c; border-color: white; color: white;
      animation: pulseMic 1.5s infinite;
    }
    
    .voice-panel {
      position: fixed; bottom: 90px; left: 24px; z-index: 1000;
      width: 280px; background: var(--card-bg, white);
      border: 1.5px solid var(--border, rgba(128,0,32,0.15));
      border-radius: 16px; padding: 16px; display: none;
      box-shadow: var(--shadow, 0 8px 40px rgba(128,0,32,0.12));
      animation: slideUpVoice 0.3s ease both;
      color: var(--text, #333);
    }
    
    .voice-panel-title { font-weight: 800; font-size: 0.95rem; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; color: var(--maroon, #800020); }
    .voice-panel-transcript { font-size: 0.85rem; color: #7f8c8d; min-height: 40px; border: 1px dashed var(--border); border-radius: 8px; padding: 8px; margin-bottom: 8px; background: rgba(0,0,0,0.02); }
    .voice-panel-tip { font-size: 0.72rem; color: var(--text-muted, #7a6a5a); line-height: 1.4; }
    
    @keyframes pulseMic {
      0% { box-shadow: 0 0 0 0 rgba(231,76,60,0.6); }
      70% { box-shadow: 0 0 0 15px rgba(231,76,60,0); }
      100% { box-shadow: 0 0 0 0 rgba(231,76,60,0); }
    }
    @keyframes slideUpVoice {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(css);
  
  // HTML injection
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="voice-panel" id="voice-panel">
      <div class="voice-panel-title"><i class="fa fa-microphone"></i> Tamil Voice Assistant</div>
      <div class="voice-panel-transcript" id="voice-transcript">Say a command, e.g. "go to children mode" or "translate hello"</div>
      <div class="voice-panel-tip">
        <strong>Try speaking (English/Tamil):</strong><br/>
        â€¢ "go to translator" / "à®®à¯Šà®´à®¿à®ªà¯†à®¯à®°à¯à®ªà¯à®ªà¯"<br/>
        â€¢ "enable dark mode" / "à®‡à®°à¯à®³à¯ à®®à¯à®±à¯ˆ"<br/>
        â€¢ "translate eppadi" / "à®®à¯Šà®´à®¿à®ªà¯†à®¯à®°à¯à®•à¯à®• hello"<br/>
        â€¢ "speak à®µà®£à®•à¯à®•à®®à¯"
      </div>
    </div>
    <button class="voice-fab" id="voice-assistant-fab" onclick="toggleVoiceAssistant()" title="Voice Assistant">
      <i class="fa fa-microphone" id="voice-fab-icon"></i>
    </button>
  `;
  document.body.appendChild(wrapper);
}

function initVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Speech Recognition not supported in this browser.');
    return;
  }
  
  voiceRecognition = new SpeechRecognition();
  voiceRecognition.continuous = false;
  voiceRecognition.interimResults = false;
  
  // Set listener language based on user settings
  const langPref = localStorage.getItem('tnlp_lang_pref') || 'English';
  const langCode = (langPref.includes('Tamil') || langPref.includes('à®¤à®®à®¿à®´à¯')) ? 'ta-IN' : 'en-US';
  voiceRecognition.lang = langCode;
  
  voiceRecognition.onstart = () => {
    isVoiceListening = true;
    document.getElementById('voice-assistant-fab').classList.add('listening');
    document.getElementById('voice-transcript').textContent = "Listening... Speak now!";
  };
  
  voiceRecognition.onresult = (e) => {
    const text = e.results[0][0].transcript.trim();
    const displayText = text.toLowerCase();
    document.getElementById('voice-transcript').textContent = `You said: "${displayText}"`;
    executeVoiceCommand(displayText);
  };
  
  voiceRecognition.onerror = (e) => {
    console.error('Speech error: ', e);
    document.getElementById('voice-transcript').textContent = "Error recognizing speech. Try again!";
    stopVoiceListening();
  };
  
  voiceRecognition.onend = () => {
    stopVoiceListening();
  };
}

function toggleVoiceAssistant() {
  const panel = document.getElementById('voice-panel');

  if (!voiceRecognition) {
    showToast('Voice Recognition is not supported in this browser (use Chrome/Edge).', 'error');
    return;
  }

  // Ensure panel exists
  if (panel) panel.style.display = 'block';


  if (isVoiceListening) {
    if (panel) panel.style.display = 'none';
    try { voiceRecognition.abort(); } catch (_) {}
    return;
  }

  if (panel) panel.style.display = 'block';

  // Re-verify language constraint in case it was updated in settings
  const langPref = localStorage.getItem('tnlp_lang_pref') || 'English';
  voiceRecognition.lang = (langPref.includes('Tamil') || langPref.includes('à®¤à®®à®¿à®´à¯')) ? 'ta-IN' : 'en-US';

  // Avoid â€œstart() called twiceâ€ errors
  try {
    if (typeof voiceRecognition.stop === 'function') {
      try { voiceRecognition.stop(); } catch (_) {}
    }
    voiceRecognition.start();
  } catch (e) {
    console.warn('SpeechRecognition start failed:', e);
    document.getElementById('voice-transcript').textContent =
      'Mic is busy or permission blocked. Please allow microphone and try again.';
    stopVoiceListening();
  }
}

function stopVoiceListening() {
  isVoiceListening = false;
  const fab = document.getElementById('voice-assistant-fab');
  if (fab) fab.classList.remove('listening');
}

// â”€â”€ COMMAND ROUTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function executeVoiceCommand(cmd) {
  const cleanCmd = cmd.trim().toLowerCase();
  const normalizedCmd = cleanCmd.replace(/^(go to|goto|go)\s+/i, '');
  
  if (typeof unlockBadge === 'function') unlockBadge('voice_commander');

  const isTranslatorPage = window.location.pathname.includes('translator.html');
  const goPage = (page, message) => {
    speakBack(message, 'en-US');
    setTimeout(() => window.location.href = page, 700);
  };

  if (normalizedCmd.match(/\b(dashboard|home|à®®à¯à®•à®ªà¯à®ªà¯|à®®à¯ˆà®ªà¯à®ªà¯à®ªà¯ à®ªà®•à¯à®•à®®à¯|à®Ÿà®¾à®·à¯à®ªà¯‹à®°à¯à®Ÿà¯)\b/)) {
    return goPage('dashboard.html', 'Navigating to Dashboard');
  }
  if (normalizedCmd.match(/\b(translator|translation|à®®à¯Šà®´à®¿à®ªà¯†à®¯à®°à¯à®ªà¯à®ªà¯|à®®à¯Šà®´à®¿à®ªà¯†à®¯à®°à¯à®ªà¯à®ªà®¾à®³à®°à¯|à®®à¯Šà®´à®¿à®ªà¯†à®¯à®°à¯à®•à¯à®• à®ªà®•à¯à®•à®®à¯|translate page)\b/)) {
    return goPage('translator.html', 'Navigating to Translator');
  }
  if (normalizedCmd.match(/\b(history|logs|à®µà®°à®²à®¾à®±à¯|à®ªà®¤à®¿à®µà¯à®•à®³à¯|à®¹à®¿à®¸à¯à®Ÿà®°à®¿)\b/)) {
    return goPage('history.html', 'Navigating to History');
  }
  if (normalizedCmd.match(/\b(profile|account|à®šà¯à®¯à®µà®¿à®µà®°à®®à¯|à®ªà®¯à®©à®°à¯|à®ªà®¯à®©à®°à¯ à®µà®¿à®ªà®°à®®à¯)\b/)) {
    return goPage('profile.html', 'Navigating to Profile');
  }
  if (normalizedCmd.match(/\b(settings?|config|à®…à®®à¯ˆà®ªà¯à®ªà¯à®•à®³à¯|à®…à®®à¯ˆà®ªà¯à®ªà¯|à®…à®®à¯ˆà®ªà¯à®ªà¯à®•à®³à¯ à®ªà®•à¯à®•à®®à¯|à®…à®®à¯ˆà®ªà¯à®ªà¯ à®ªà®•à¯à®•à®®à¯)\b/)) {
    return goPage('settings.html', 'Navigating to Settings');
  }
  if (normalizedCmd.match(/\b(story mode|stories|story section|open stories|open story section|show story section|kids stories|tell me a story|story voice|children story|storytime|story time|story mode)\b/)) {
    if (isChildrenPage && typeof switchKidsTab === 'function') {
      switchKidsTab('stories');
      speakBack('Opening stories section');
      return;
    }
    return goPage('children.html', 'Opening Children Stories');
  }
  if (normalizedCmd.match(/\b(children|kids|à®•à¯à®´à®¨à¯à®¤à¯ˆà®•à®³à¯|à®•à¯à®Ÿà¯à®Ÿà®¿|à®•à¯à®´à®¨à¯à®¤à¯ˆà®•à®³à¯ à®ªà®•à¯à®¤à®¿|à®•à¯à®´à®¨à¯à®¤à¯ˆ à®®à¯†à®©à¯)\b/)) {
    return goPage('children.html', 'Navigating to Children Mode');
  }
  if (normalizedCmd.match(/\b(log out|logout|sign out|signoff|sign off|à®µà¯†à®³à®¿à®¯à¯‡à®±à¯|à®µà¯†à®³à®¿à®¯à¯‡à®±|à®¯à®¾à®°à¯ à®µà¯†à®³à®¿à®¯à¯‡à®±à¯)\b/)) {
    if (typeof doLogout === 'function') {
      doLogout();
      speakBack('Logging out', 'en-US');
      return;
    }
  }

  if (normalizedCmd.match(/\b(dark mode|dark theme|enable dark|à®‡à®°à¯à®³à¯ à®®à¯à®±à¯ˆ|à®Ÿà®¾à®°à¯à®•à¯ à®®à¯‹à®Ÿà¯)\b/)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('tnlp_theme', 'dark');
    const chk = document.getElementById('dark-mode-toggle');
    if (chk) chk.checked = true;
    speakBack('Dark mode enabled');
    if (typeof showToast === 'function') showToast('Dark mode enabled ðŸŒ™', 'info');
    return;
  }
  if (normalizedCmd.match(/\b(light mode|light theme|enable light|à®’à®³à®¿ à®®à¯à®±à¯ˆ|à®²à¯ˆà®Ÿà¯ à®®à¯‹à®Ÿà¯)\b/)) {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('tnlp_theme', 'light');
    const chk = document.getElementById('dark-mode-toggle');
    if (chk) chk.checked = false;
    speakBack('Light mode enabled');
    if (typeof showToast === 'function') showToast('Light mode enabled â˜€ï¸', 'info');
    return;
  }

  const isDashboardPage = window.location.pathname.includes('dashboard.html');
  const isHistoryPage = window.location.pathname.includes('history.html');
  const isChildrenPage = window.location.pathname.includes('children.html');
  const isProfilePage = window.location.pathname.includes('profile.html');
  const isSettingsPage = window.location.pathname.includes('settings.html');

  if ((isTranslatorPage || isDashboardPage) && normalizedCmd.match(/\b(tamil to english|english to tamil|swap translation|switch direction|change direction|à®®à¯Šà®´à®¿ à®®à®¾à®±à¯à®±à¯|à®¤à®®à®¿à®´à¯ à®‡à®°à¯à®¨à¯à®¤à¯ à®†à®™à¯à®•à®¿à®²à®®à¯|à®†à®™à¯à®•à®¿à®²à®®à¯ à®‡à®°à¯à®¨à¯à®¤à¯ à®¤à®®à®¿à®´à¯)\b/)) {
    if (typeof toggleTranslationDirection === 'function') {
      toggleTranslationDirection();
      speakBack('Translation direction switched');
      return;
    }
  }

  if (isTranslatorPage && normalizedCmd.match(/\b(translate now|translate text|translate it|translate this|convert now|translate the text)\b/)) {
    if (typeof doTranslate2 === 'function' && document.getElementById('tanglish-input-2')) {
      doTranslate2();
      speakBack('Translating now');
      return;
    }
    if (typeof doTranslate === 'function' && document.getElementById('tanglish-input')) {
      doTranslate();
      speakBack('Translating now');
      return;
    }
  }

  if (normalizedCmd.match(/\b(copy output|copy result|copy translation|à®¨à®•à®²à¯†à®Ÿà¯|à®¨à®•à®²à¯)\b/)) {
    if (typeof copyOutput2 === 'function' && document.getElementById('tamil-output-2')) {
      copyOutput2();
      speakBack('Copied output to clipboard');
      return;
    }
    if (typeof copyOutput === 'function' && document.getElementById('tamil-output')) {
      copyOutput();
      speakBack('Copied output to clipboard');
      return;
    }
  }

  if (normalizedCmd.match(/\b(listen output|play output|à®ªà¯‡à®šà®¿|à®•à¯‡à®³à¯)\b/)) {
    if (typeof speakOutput2 === 'function' && document.getElementById('tamil-output-2')) {
      speakOutput2();
      speakBack('Playing translation audio');
      return;
    }
    if (typeof speakOutput === 'function' && document.getElementById('tamil-output')) {
      speakOutput();
      speakBack('Playing translation audio');
      return;
    }
  }

  if (normalizedCmd.match(/\b(clear input|clear text|remove input|à®šà®¿à®µà®ªà¯à®ªà¯ à®‰à®³à¯à®³à¯€à®Ÿà¯ à®…à®´à®¿|à®‰à®³à¯à®³à¯€à®Ÿà¯à®Ÿà¯ˆ à®®à¯à®±à¯ˆà®¯à®¾à®• à®…à®´à®¿)\b/)) {
    const inp = document.getElementById('tanglish-input-2') || document.getElementById('tanglish-input');
    if (inp) inp.value = '';
    speakBack('Input cleared');
    return;
  }

  if (normalizedCmd.match(/\b(clear output|clear result|remove output|à®¤à®¿à®°à¯à®®à¯à®ª à®ªà¯†à®±à¯à®¤à®²à¯ à®…à®´à®¿|à®µà¯†à®³à®¿à®¯à¯€à®Ÿà¯à®Ÿà¯ˆ à®…à®´à®¿)\b/)) {
    const out = document.getElementById('tamil-output-2') || document.getElementById('tamil-output');
    if (out) out.value = '';
    speakBack('Output cleared');
    return;
  }

  if (isHistoryPage && normalizedCmd.match(/\b(clear history|delete history|remove history|history clear|clear all history|history à®…à®´à®¿|à®µà®°à®²à®¾à®±à¯ à®…à®´à®¿|à®…à®©à¯ˆà®¤à¯à®¤à¯ à®µà®°à®²à®¾à®±à¯à®±à¯ˆ à®…à®´à®¿|à®ªà®¤à®¿à®µà¯à®•à®³à¯ˆ à®…à®´à®¿|à®ªà®¤à®¿à®µà¯à®•à®³à¯ˆ à®¨à¯€à®•à¯à®•à¯)\b/)) {
    if (typeof clearHistory === 'function') {
      clearHistory();
      speakBack('History cleared');
      return;
    }
  }

  if (isChildrenPage && normalizedCmd.match(/\b(start quiz|open quiz|kids quiz|play quiz|switch to quiz|begin quiz|à®•à¯à®¯à®¿à®¸à¯ à®¤à¯Šà®Ÿà®™à¯à®•|à®•à¯à®´à®¨à¯à®¤à¯ˆà®•à®³à¯ à®µà®¿à®©à®¾à®Ÿà®¿|à®µà®¿à®©à®¾à®Ÿà®¿ à®¤à¯Šà®Ÿà®™à¯à®•à¯|à®•à¯à®¯à®¿à®¸à¯ à®¤à¯Šà®Ÿà®™à¯à®•à¯)\b/)) {
    if (typeof switchKidsTab === 'function') {
      switchKidsTab('quiz');
      speakBack('Opening kids quiz');
      return;
    }
  }

  if (isChildrenPage && normalizedCmd.match(/\b(?:tell me a story|read(?: the){0,2}(?: full)? story|play(?: the)? story|listen story|start story|à®•à®¤à¯ˆ à®•à¯‡à®³à¯|story play|listen to story|à®•à®¤à¯ˆ à®ªà®¾à®°à¯|à®•à®¤à¯ˆ à®µà®¾à®šà®¿|à®•à®¤à¯ˆ à®µà®¿à®³à®•à¯à®•à¯|story voice|storytime|story time)\b/)) {
    if (typeof narrateStory === 'function') {
      narrateStory();
      speakBack('Playing story');
      return;
    }
  }

  if (isChildrenPage && normalizedCmd.match(/\b(stop story|pause story|stop narration|pause narration|halt story|stop playback|à®¨à®¿à®±à¯à®¤à¯à®¤à¯ à®•à®¤à¯ˆ|à®•à®¤à¯ˆ à®¨à®¿à®±à¯à®¤à¯à®¤à¯|à®•à®¤à¯ˆ à®¨à®¿à®±à¯à®¤)\b/)) {
    if (typeof stopStory === 'function') {
      stopStory();
      speakBack('Story stopped');
      return;
    }
  }

  if (isChildrenPage && normalizedCmd.match(/\b(open letters|alphabet board|show letters|à®…à®•à®° à®µà®°à®¿à®šà¯ˆ|à®…à®•à®°à®ªà¯à®ªà®²à®•à¯ˆ|à®…à®•à®° à®µà®°à®¿à®šà¯ˆà®¯à¯ˆ à®•à®¾à®Ÿà¯à®Ÿà¯|à®Žà®´à¯à®¤à¯à®¤à¯à®•à¯à®•à®³à¯|à®Žà®´à¯à®¤à¯à®¤à¯à®•à¯à®•à®³à¯ˆ à®•à®¾à®Ÿà¯à®Ÿà¯)\b/)) {
    if (typeof switchKidsTab === 'function') {
      switchKidsTab('letters');
      speakBack('Opening alphabet board');
      return;
    }
  }

  if (isChildrenPage && normalizedCmd.match(/\b(open stories|story section|à®•à®¤à¯ˆà®•à®³à¯ à®ªà®•à¯à®¤à®¿|stories section|à®•à®¤à¯ˆà®•à®³à¯ à®¤à®¿à®±|à®•à®¤à¯ˆà®•à®³à¯ à®ªà®¾à®°à¯à®•à¯à®•)\b/)) {
    if (typeof switchKidsTab === 'function') {
      switchKidsTab('stories');
      speakBack('Opening stories section');
      return;
    }
  }

  if (isChildrenPage && normalizedCmd.match(/\b(?:animals|animal words|animal dictionary|fruits|fruit words|fruit dictionary|colors|color words|color dictionary|numbers|number words|number dictionary)\b/)) {
    if (typeof switchKidsTab === 'function') {
      switchKidsTab('dictionary');
    }
    if (normalizedCmd.match(/\b(?:animals|animal words|animal dictionary)\b/) && typeof filterDictCategory === 'function') {
      filterDictCategory('animals');
      speakBack('Showing animals');
      return;
    }
    if (normalizedCmd.match(/\b(?:fruits|fruit words|fruit dictionary)\b/) && typeof filterDictCategory === 'function') {
      filterDictCategory('fruits');
      speakBack('Showing fruits');
      return;
    }
    if (normalizedCmd.match(/\b(?:colors|colour words|color words|color dictionary)\b/) && typeof filterDictCategory === 'function') {
      filterDictCategory('colors');
      speakBack('Showing colors');
      return;
    }
    if (normalizedCmd.match(/\b(?:numbers|number words|number dictionary)\b/) && typeof filterDictCategory === 'function') {
      filterDictCategory('numbers');
      speakBack('Showing numbers');
      return;
    }
    if (typeof switchKidsTab === 'function') {
      switchKidsTab('dictionary');
      speakBack('Opening picture dictionary');
      return;
    }
  }

  if (isChildrenPage && normalizedCmd.match(/\b(open dictionary|picture dictionary|picture book|à®ªà®Ÿ à®…à®•à®°à®¾à®¤à®¿|à®…à®•à®°à®¾à®¤à®¿ à®¤à®¿à®±|à®…à®•à®°à®¾à®¤à®¿à®¯à¯ˆ à®¤à®¿à®±|à®…à®•à®°à®¾à®¤à®¿ à®ªà®¾à®°à¯à®•à¯à®•)\b/)) {
    if (typeof switchKidsTab === 'function') {
      switchKidsTab('dictionary');
      speakBack('Opening picture dictionary');
      return;
    }
  }

  if (isProfilePage && normalizedCmd.match(/\b(save profile|save changes|update profile|profile save|à®šà¯à®¯à®µà®¿à®µà®°à®¤à¯à®¤à¯ˆ à®šà¯‡à®®à®¿|à®®à®¾à®±à¯à®±à®™à¯à®•à®³à¯ˆ à®šà¯‡à®®à®¿|à®šà¯‡à®®à®¿|à®šà¯‡à®®à®¿à®¤à¯à®¤à®¿à®Ÿà¯)\b/)) {
    if (typeof saveProfile === 'function') {
      saveProfile();
      speakBack('Profile saved');
      return;
    }
  }

  if (isSettingsPage && normalizedCmd.match(/\b(save settings|apply settings|update settings|settings save|à®šà¯‡à®®à®¿ à®…à®®à¯ˆà®ªà¯à®ªà¯à®•à®³à¯|à®…à®®à¯ˆà®ªà¯à®ªà¯à®•à®³à¯ˆ à®šà¯‡à®®à®¿|à®…à®®à¯ˆà®ªà¯à®ªà¯à®•à®³à¯ˆà®ªà¯ à®ªà®¤à®¿à®µà¯ à®šà¯†à®¯à¯)\b/)) {
    if (typeof saveSettings === 'function') {
      saveSettings();
      speakBack('Settings saved');
      return;
    }
  }

  const translateMatch = normalizedCmd.match(/(?:translate|à®®à¯Šà®´à®¿à®ªà¯†à®¯à®°à¯à®•à¯à®•|à®®à¯Šà®´à®¿à®ªà¯†à®¯à®°à¯à®ªà¯à®ªà¯)\s*(.*)/i);
  if (translateMatch && translateMatch[1]) {
    const textToTranslate = translateMatch[1].trim();
    if (textToTranslate) {
      const langCode = inferSpeechLang(textToTranslate);
      speakBack(`Translating ${textToTranslate}`, langCode);
      const inp = document.getElementById('tanglish-input-2') || document.getElementById('tanglish-input');
      if (inp) {
        inp.value = textToTranslate;
        inp.dispatchEvent(new Event('input'));
        if (document.getElementById('tanglish-input-2') && typeof doTranslate2 === 'function') {
          setTimeout(doTranslate2, 500);
        } else if (document.getElementById('tanglish-input') && typeof doTranslate === 'function') {
          setTimeout(doTranslate, 500);
        }
      } else if (typeof showToast === 'function') {
        showToast(`Translate: "${textToTranslate}"`, 'info');
      }
      return;
    }
  }

  const speakMatch = normalizedCmd.match(/(?:speak|say|à®šà¯Šà®²à¯à®²à¯)\s+(.*)/i);
  if (speakMatch && speakMatch[1]) {
    const textToSpeak = speakMatch[1].trim();
    speakBack(textToSpeak, inferSpeechLang(textToSpeak));
    return;
  }

  speakBack('Command not recognized. Please try again.', 'en-US');
}

function inferSpeechLang(text) {
  return /[\u0B80-\u0BFF]/.test(text) || /\b(à®µà®£à®•à¯à®•à®®à¯|à®¨à®©à¯à®±à®¿|à®¤à®®à®¿à®´à¯|à®®à¯Šà®±à¯ˆ|à®®à¯Šà®´à®¿)\b/.test(text) ? 'ta-IN' : 'en-US';
}

function speakBack(text, lang = 'en-US') {
  if (!('speechSynthesis' in window) || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95;

  const chooseVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const normalizedLang = lang.toLowerCase().replace('_', '-');
    const exact = voices.find(v => v.lang.toLowerCase().replace('_', '-').includes(normalizedLang));
    if (exact) return exact;
    return voices.find(v => v.lang.toLowerCase().startsWith(normalizedLang.split('-')[0]));
  };

  const voice = chooseVoice();
  if (voice) utterance.voice = voice;
  if (!window.speechSynthesis.getVoices().length) {
    window.speechSynthesis.onvoiceschanged = () => {
      const delayedVoice = chooseVoice();
      if (delayedVoice) utterance.voice = delayedVoice;
      window.speechSynthesis.speak(utterance);
    };
  } else {
    window.speechSynthesis.speak(utterance);
  }
}



