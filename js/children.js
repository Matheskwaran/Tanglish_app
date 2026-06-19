/* ═══════════════════════════════════════════════════
   TANGLISH → TAMIL TRANSLATOR  |  children.js
   Alphabet arrays · Story narrator · Quiz Arena
   ═══════════════════════════════════════════════════ */

// ── DATA ARRAYS ───────────────────────────────────────
const VOWELS = [
  { char: 'அ', word: 'அணில்', trans: 'Squirrel', emoji: '🐿️' },
  { char: 'ஆ', word: 'ஆடு', trans: 'Goat', emoji: '🐐' },
  { char: 'இ', word: 'இலை', trans: 'Leaf', emoji: '🍃' },
  { char: 'ஈ', word: 'ஈட்டி', trans: 'Spear', emoji: '🔱' },
  { char: 'உ', word: 'உரல்', trans: 'Mortar', emoji: '🥣' },
  { char: 'ஊ', word: 'ஊஞ்சல்', trans: 'Swing', emoji: '🎡' },
  { char: 'எ', word: 'எலி', trans: 'Rat', emoji: '🐀' },
  { char: 'ஏ', word: 'ஏணி', trans: 'Ladder', emoji: '🪜' },
  { char: 'ஐ', word: 'ஐந்து', trans: 'Five', emoji: '5️⃣' },
  { char: 'ஒ', word: 'ஒட்டகம்', trans: 'Camel', emoji: '🐫' },
  { char: 'ஓ', word: 'ஓடம்', trans: 'Boat', emoji: '⛵' },
  { char: 'ஔ', word: 'ஔவையார்', trans: 'Poet Avvaiyar', emoji: '👵' },
  { char: 'ஃ', word: 'எஃகு', trans: 'Sword/Steel', emoji: '⚔️' }
];

const CONSONANTS = [
  { char: 'க்', word: 'கொக்கு', trans: 'Crane', emoji: '🦩' },
  { char: 'ங்', word: 'சிங்கம்', trans: 'Lion', emoji: '🦁' },
  { char: 'ச்', word: 'எலுமிச்சை', trans: 'Lemon', emoji: '🍋' },
  { char: 'ஞ்', word: 'ஊஞ்சல்', trans: 'Swing', emoji: '🎡' },
  { char: 'ட்', word: 'பட்டம்', trans: 'Kite', emoji: '🪁' },
  { char: 'ண்', word: 'வண்டு', trans: 'Beetle', emoji: '🪲' },
  { char: 'த்', word: 'தக்காளி', trans: 'Tomato', emoji: '🍅' },
  { char: 'ந்', word: 'நண்டு', trans: 'Crab', emoji: '🦀' },
  { char: 'ப்', word: 'பந்து', trans: 'Ball', emoji: '⚽' },
  { char: 'ம்', word: 'மரம்', trans: 'Tree', emoji: '🌳' },
  { char: 'ய்', word: 'நாய்', trans: 'Dog', emoji: '🐶' },
  { char: 'ர்', word: 'தேர்', trans: 'Chariot', emoji: '🛕' },
  { char: 'ல்', word: 'சேவல்', trans: 'Rooster', emoji: '🐓' },
  { char: 'வ்', word: 'செவ்வானம்', trans: 'Sunset', emoji: '🌅' },
  { char: 'ழ்', word: 'யாழ்', trans: 'Yazh Lute', emoji: '🪕' },
  { char: 'ள்', word: 'வாள்', trans: 'Sword', emoji: '⚔️' },
  { char: 'ற்', word: 'பறவை', trans: 'Bird', emoji: '🐦' },
  { char: 'ன்', word: 'மீன்', trans: 'Fish', emoji: '🐟' }
];

const KIDS_STORIES = [
  {
    id: 1,
    title: 'ஆமையும் முயலும் (The Hare & Tortoise)',
    emoji: '🐢',
    desc: 'முயல் மற்றும் ஆமை பந்தயம் வைத்த கதை.',
    content: 'முயலும் ஆமையும் பந்தயம் வைத்தன. முயல் மிக வேகமாக ஓடிவிட்டு, வழியில் ஒரு மரத்தின் அடியில் தூங்கிவிட்டது. ஆனால் ஆமை மெதுவாக, விடாமுயற்சியுடன் தொடர்ந்து நடந்து பந்தயத்தில் வெற்றி பெற்றது. விடாமுயற்சி எப்போதுமே வெற்றியை தரும் குட்டீஸ்!',
    moral: 'விடாமுயற்சி விஸ்வரூப வெற்றி.'
  },
  {
    id: 2,
    title: 'தாகமுள்ள காகம் (The Thirsty Crow)',
    emoji: '🐦',
    desc: 'புத்திசாலி காகம் தண்ணீர் குடித்த கதை.',
    content: 'ஒரு காகத்திற்கு தாகம் எடுத்தது. அது ஒரு பானையில் தண்ணீர் இருப்பதைக் கண்டது. ஆனால் தண்ணீர் பானையின் அடியில் இருந்தது. காகம் யோசித்து சிறிய கற்களை ஒவ்வொன்றாக பானையில் போட்டது. தண்ணீர் மேலே வந்தது. காகம் தண்ணீர் குடித்து பறந்து சென்றது!',
    moral: 'புத்திசாலித்தனமே சிறந்த பலம்.'
  },
  {
    id: 3,
    title: 'சிங்கமும் எலியும் (The Lion & Mouse)',
    emoji: '🦁',
    desc: 'ஒரு சிறு எலி சிங்கத்திற்கு உதவிய கதை.',
    content: 'ஒரு முறை சிங்கம் ஒன்று வலையில் சிக்கியது. ஒரு சிறிய எலி ஓடி வந்து தனது கூர்மையான பற்களால் வலையை கடித்து சிங்கத்தைக் காப்பாற்றியது. யாருக்கு எப்போது உதவ முடியும் என்று சொல்ல முடியாது. எனவே எல்லோரையும் மதியுங்கள்!',
    moral: 'சிறு துரும்பும் பல்குத்த உதவும்.'
  }
];

const KIDS_QUIZ_QUESTIONS = [
  {
    emoji: '🐿️',
    question: 'identify the correct Tamil word for the "Squirrel" picture:',
    options: ['அணில் (Anil)', 'ஆடு (Aadu)', 'இலை (Ilai)', 'மரம் (Maram)'],
    correctIndex: 0,
    point: 10
  },
  {
    emoji: '🦁',
    question: 'What is the correct Tamil word for "Lion"?',
    options: ['யானை', 'சிங்கம்', 'நாய்', 'பூனை'],
    correctIndex: 1,
    point: 10
  },
  {
    emoji: 'அ',
    question: 'Which word starts with the vowel letter "அ"?',
    options: ['ஆடு', 'இலை', 'அணில்', 'ஈட்டி'],
    correctIndex: 2,
    point: 10
  },
  {
    emoji: '🍇',
    question: 'Choose the correct meaning of the Tamil word "நன்றி" (Nandri):',
    options: ['Welcome', 'Thank you', 'Goodbye', 'Sorry'],
    correctIndex: 1,
    point: 10
  },
  {
    emoji: '🐟',
    question: 'What is the correct Tamil word for "Fish"?',
    options: ['மீன் (Meen)', 'நண்டு (Nandu)', 'நாய் (Naai)', 'பறவை (Paravai)'],
    correctIndex: 0,
    point: 10
  }
];

// ── GLOBAL KIDS STATES ────────────────────────────────
let currentSelectedLetter = null;
let currentSelectedStory = KIDS_STORIES[0];
let currentQuizIndex = 0;
let quizScore = 0;
let currentDictCategory = 'animals';

const KIDS_DICTIONARY = {
  animals: [
    { tamil: 'சிங்கம்', english: 'Lion', emoji: '🦁' },
    { tamil: 'யானை', english: 'Elephant', emoji: '🐘' },
    { tamil: 'புலி', english: 'Tiger', emoji: '🐯' },
    { tamil: 'குரங்கு', english: 'Monkey', emoji: '🐒' },
    { tamil: 'பசு', english: 'Cow', emoji: '🐄' },
    { tamil: 'பூனை', english: 'Cat', emoji: '🐱' },
    { tamil: 'நாய்', english: 'Dog', emoji: '🐶' }
  ],
  fruits: [
    { tamil: 'மாம்பழம்', english: 'Mango', emoji: '🥭' },
    { tamil: 'வாழைப்பழம்', english: 'Banana', emoji: '🍌' },
    { tamil: 'ஆப்பிள்', english: 'Apple', emoji: '🍎' },
    { tamil: 'திராட்சை', english: 'Grapes', emoji: '🍇' },
    { tamil: 'கொய்யா', english: 'Guava', emoji: '🍏' },
    { tamil: 'ஆரஞ்சு', english: 'Orange', emoji: '🍊' }
  ],
  colors: [
    { tamil: 'சிகப்பு', english: 'Red', emoji: '🔴' },
    { tamil: 'நீலம்', english: 'Blue', emoji: '🔵' },
    { tamil: 'பச்சை', english: 'Green', emoji: '🟢' },
    { tamil: 'மஞ்சள்', english: 'Yellow', emoji: '🟡' },
    { tamil: 'வெள்ளை', english: 'White', emoji: '⚪' },
    { tamil: 'கருப்பு', english: 'Black', emoji: '⚫' }
  ],
  numbers: [
    { tamil: 'ஒன்று', english: 'One', emoji: '1️⃣' },
    { tamil: 'இரண்டு', english: 'Two', emoji: '2️⃣' },
    { tamil: 'மூன்று', english: 'Three', emoji: '3️⃣' },
    { tamil: 'நான்கு', english: 'Four', emoji: '4️⃣' },
    { tamil: 'ஐந்து', english: 'Five', emoji: '5️⃣' },
    { tamil: 'ஆறு', english: 'Six', emoji: '6️⃣' }
  ]
};

// Optional audio map: map english keys to audio file paths (add files to these paths)
// Public-domain CDN fallbacks (Wikimedia Commons links). These may fail offline
// and will gracefully fall back to TTS effects.
const DICT_AUDIO_MAP = {
  lion: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_roar.ogg',
  elephant: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Elephant_trumpet.ogg',
  tiger: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Tiger_growl.ogg',
  monkey: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Monkey_chatter.ogg',
  cow: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Cow_moo.ogg',
  cat: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat_meow.ogg',
  dog: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Dog_barking.ogg'
};

const DICT_EFFECTS_MAP = {
  lion: 'Roar!',
  elephant: 'Trumpet!',
  tiger: 'Growl!',
  monkey: 'Chatter!',
  cow: 'Moo!',
  cat: 'Meow!',
  dog: 'Woof!'
};

// Cute bubble popup audio chime for kids click effect
function playKidsBubbleSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    console.warn('Kids bubble sound playback failed:', e);
  }
}

// Robust English speech synthesis utility
function speakEnglishText(text, rate = 0.9, onEndCallback = null) {
  if (!text || !window.speechSynthesis) {
    if (onEndCallback) onEndCallback();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;

  if (onEndCallback) {
    utterance.onend = onEndCallback;
    utterance.onerror = (event) => {
      console.warn('English speech error:', event);
      onEndCallback();
    };
  }

  const speakWithVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith('en')) || voices[0];
    if (enVoice) utterance.voice = enVoice;
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    speakWithVoice();
  } else {
    // Fallback if voices are not loaded yet
    window.speechSynthesis.speak(utterance);
  }
}

// ── INITIALIZER ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderAlphabetGrid();
  renderStoriesList();
  renderStory(KIDS_STORIES[0]);
  initQuiz();
  loadKidsStars();
  renderDictionary();
  // Ensure speech is unlocked by a user gesture in Edge/Chromium
  initSpeechUnlock();
});

// Some browsers (Edge/Chrome) require a user gesture to enable TTS voices.
function initSpeechUnlock() {
  if (!('speechSynthesis' in window)) return;
  const unlock = () => {
    try {
      // short neutral utterance to initialize voices and audio context
      const u = new SpeechSynthesisUtterance('ready');
      u.lang = 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      console.log('speech unlocked via user gesture');
    } catch (e) {
      console.warn('speech unlock failed', e);
    }
    document.removeEventListener('click', unlock);
    document.removeEventListener('touchstart', unlock);
  };
  document.addEventListener('click', unlock, { once: true });
  document.addEventListener('touchstart', unlock, { once: true });
}

// ── RENDER FUNCTIONS ──────────────────────────────────
function renderAlphabetGrid() {
  const vowelsBox = document.getElementById('vowels-container');
  const consBox = document.getElementById('consonants-container');
  
  if (vowelsBox) {
    vowelsBox.innerHTML = VOWELS.map((v, i) => `
      <div class="letter-card card-color-${i % 6}" onclick="openLetterPopup('vowel', ${i})">
        ${v.char}
      </div>
    `).join('');
  }
  
  if (consBox) {
    consBox.innerHTML = CONSONANTS.map((c, i) => `
      <div class="letter-card card-color-${(i + 3) % 6}" onclick="openLetterPopup('consonant', ${i})">
        ${c.char}
      </div>
    `).join('');
  }
}

function openLetterPopup(type, index) {
  const item = type === 'vowel' ? VOWELS[index] : CONSONANTS[index];
  currentSelectedLetter = item;
  
  document.getElementById('modal-letter').textContent = item.char;
  document.getElementById('modal-word').textContent = item.word;
  document.getElementById('modal-translation').textContent = item.trans;
  document.getElementById('modal-emoji').textContent = item.emoji;
  
  document.getElementById('letter-popup').classList.add('show');
  
  // Auto-play sound
  speakCurrentLetter();
}

function closeLetterPopup() {
  document.getElementById('letter-popup').classList.remove('show');
  currentSelectedLetter = null;
}

// Robust Tamil speech synthesis utility
function speakTamilText(text, rate = 0.8, onEndCallback = null) {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel(); // Terminate any queued audio

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ta-IN';
  utterance.rate = rate;

  if (onEndCallback) {
    utterance.onend = onEndCallback;
    utterance.onerror = (event) => {
      console.warn('Tamil speech error:', event);
      onEndCallback();
    };
  }

  const speakWithVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const taVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith('ta')) || voices.find(v => v.lang.toLowerCase().includes('ta'));
    const fallbackVoice = voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices[0];

    if (taVoice) {
      utterance.voice = taVoice;
    } else if (fallbackVoice) {
      utterance.voice = fallbackVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const useVoices = () => {
    if (window.speechSynthesis.getVoices().length > 0) {
      speakWithVoice();
    } else {
      // If voices are not available yet, still speak immediately with the browser default.
      window.speechSynthesis.speak(utterance);
    }
  };

  window.speechSynthesis.addEventListener('voiceschanged', useVoices);
  useVoices();
}

function speakCurrentLetter() {
  if (!currentSelectedLetter) return;
  const text = `${currentSelectedLetter.char} ... ${currentSelectedLetter.word}`;
  speakTamilText(text, 0.75);
}

// ── NARRATION / STORIES ───────────────────────────────
function renderStoriesList() {
  const menu = document.getElementById('stories-menu');
  if (!menu) return;
  menu.innerHTML = KIDS_STORIES.map(s => `
    <div class="story-card-link ${currentSelectedStory.id === s.id ? 'active' : ''}" id="story-link-${s.id}" onclick="selectStory(${s.id})">
      <div class="icon">${s.emoji}</div>
      <div style="flex:1">
        <h4>${s.title}</h4>
        <p>${s.desc}</p>
      </div>
    </div>
  `).join('');
}

function selectStory(id) {
  stopStory();
  const story = KIDS_STORIES.find(s => s.id === id);
  currentSelectedStory = story;
  renderStory(story);
  
  // Highlight in list
  document.querySelectorAll('.story-card-link').forEach(el => el.classList.remove('active'));
  document.getElementById('story-link-' + id)?.classList.add('active');
}

function renderStory(story) {
  const pic = document.getElementById('story-pic');
  const title = document.getElementById('story-title');
  const content = document.getElementById('story-content');
  if (pic) pic.textContent = story.emoji;
  if (title) title.textContent = story.title;
  if (content) content.innerHTML = `<p>${story.content}</p><p style="margin-top:14px; font-weight:700; color:var(--kids-orange)">Moral: ${story.moral}</p>`;
}

function narrateStory() {
  if (!currentSelectedStory) return;
  const text = `${currentSelectedStory.title} ... ${currentSelectedStory.content} ... நீதி ... ${currentSelectedStory.moral}`;
  
  // Change button state
  const btn = document.getElementById('btn-narrate-story');
  if (btn) btn.innerHTML = `<i class="fa fa-spinner fa-spin"></i> Narrating...`;
  
  speakTamilText(text, 0.85, () => {
    if (btn) btn.innerHTML = `<i class="fa fa-volume-up"></i> Listen to Story`;
  });
}

function stopStory() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  const btn = document.getElementById('btn-narrate-story');
  if (btn) btn.innerHTML = `<i class="fa fa-volume-up"></i> Listen to Story`;
}

// ── KIDS QUIZ ARENA ───────────────────────────────────
function initQuiz() {
  currentQuizIndex = 0;
  quizScore = 0;
  document.getElementById('quiz-local-score').textContent = '0';
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = KIDS_QUIZ_QUESTIONS[currentQuizIndex];
  document.getElementById('q-num').textContent = currentQuizIndex + 1;
  document.getElementById('quiz-progress').style.width = ((currentQuizIndex + 1) / KIDS_QUIZ_QUESTIONS.length * 100) + '%';
  document.getElementById('quiz-emoji').textContent = q.emoji;
  document.getElementById('quiz-question-text').textContent = q.question;
  document.getElementById('quiz-next-footer').style.display = 'none';
  
  const optionsBox = document.getElementById('quiz-options-box');
  optionsBox.innerHTML = q.options.map((opt, i) => `
    <button class="quiz-opt-btn" onclick="submitQuizAnswer(${i}, this)">
      <span style="background:var(--kids-orange); color:white; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:800">${String.fromCharCode(65 + i)}</span>
      <span>${opt}</span>
    </button>
  `).join('');
}

function submitQuizAnswer(index, btn) {
  const q = KIDS_QUIZ_QUESTIONS[currentQuizIndex];
  
  // Disable all options
  document.querySelectorAll('.quiz-opt-btn').forEach(b => b.disabled = true);
  
  if (index === q.correctIndex) {
    btn.classList.add('correct');
    quizScore += 1;
    document.getElementById('quiz-local-score').textContent = quizScore;
    
    // Play celebratory sound
    playBeep(523.25, 'sine', 0.15); // C5 note
    setTimeout(() => playBeep(659.25, 'sine', 0.15), 150); // E5 note
    setTimeout(() => playBeep(783.99, 'sine', 0.3), 300); // G5 note
    
    showToast('Correct! Awesome! 🌟', 'success');
    addKidsStar(1); // Add Kids Star
  } else {
    btn.classList.add('wrong');
    // Highlight correct option
    const optButtons = document.querySelectorAll('.quiz-opt-btn');
    optButtons[q.correctIndex].classList.add('correct');
    
    playBeep(220, 'sawtooth', 0.4); // Failure sound
    showToast('Oops! Try again next time. 😊', 'error');
  }
  
  document.getElementById('quiz-next-footer').style.display = 'flex';
}

function nextQuizQuestion() {
  currentQuizIndex++;
  if (currentQuizIndex < KIDS_QUIZ_QUESTIONS.length) {
    renderQuizQuestion();
  } else {
    // End of quiz
    showToast(`Quiz completed! You scored ${quizScore}/${KIDS_QUIZ_QUESTIONS.length} 🎉`, 'success');
    
    // If user got perfect score, award extra XP
    if (quizScore === KIDS_QUIZ_QUESTIONS.length) {
      showToast('Perfect Score Badge Unlocked! 🏆', 'success');
      unlockBadge('kids_champion');
    }
    
    // Restart quiz
    setTimeout(() => initQuiz(), 3000);
  }
}

// ── REWARDS UTILITIES ─────────────────────────────────
function loadKidsStars() {
  const session = JSON.parse(localStorage.getItem('tnlp_session') || 'null');
  if (!session) return;
  let stars = parseInt(localStorage.getItem('tnlp_kids_stars_' + session.username));
  if (isNaN(stars)) {
    stars = session.stars || 0;
    localStorage.setItem('tnlp_kids_stars_' + session.username, stars);
  }
  const starsEl = document.getElementById('kids-stars');
  if (starsEl) starsEl.textContent = stars;
}

async function addKidsStar(count) {
  const session = JSON.parse(localStorage.getItem('tnlp_session') || 'null');
  if (!session) return;
  let stars = parseInt(localStorage.getItem('tnlp_kids_stars_' + session.username) || '0');
  stars += count;
  localStorage.setItem('tnlp_kids_stars_' + session.username, stars);
  const starsEl = document.getElementById('kids-stars');
  if (starsEl) starsEl.textContent = stars;

  // Sync to database
  const xp = parseInt(localStorage.getItem('tnlp_xp_' + session.username) || '120');
  const streak = parseInt(localStorage.getItem('tnlp_streak_' + session.username) || '1');
  const badgesKey = 'tnlp_badges_' + session.username;
  const badges = JSON.parse(localStorage.getItem(badgesKey) || '[]');
  if (typeof syncGamification === 'function') {
    await syncGamification(xp, streak, badges, stars);
  }
}

// Web Audio API helper for offline sound effects
function playBeep(freq, type, duration) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Web Audio not supported or blocked');
  }
}

// Global Tab switcher in kids mode
function switchKidsTab(tabName) {
  stopStory();
  document.querySelectorAll('.kids-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.kids-view').forEach(view => view.classList.remove('active'));
  
  if (tabName === 'letters') {
    document.getElementById('kids-view-letters').classList.add('active');
    document.getElementById('tab-btn-letters')?.classList.add('active');
  } else if (tabName === 'stories') {
    document.getElementById('kids-view-stories').classList.add('active');
    document.getElementById('tab-btn-stories')?.classList.add('active');
  } else if (tabName === 'quiz') {
    document.getElementById('kids-view-quiz').classList.add('active');
    document.getElementById('tab-btn-quiz')?.classList.add('active');
    initQuiz();
  } else if (tabName === 'dictionary') {
    document.getElementById('kids-view-dictionary').classList.add('active');
    document.getElementById('tab-btn-dictionary')?.classList.add('active');
    renderDictionary();
  }
}

// ── DICTIONARY FUNCTIONS ────────────────────────────────
function renderDictionary() {
  const container = document.getElementById('dict-container');
  if (!container) return;

  const items = KIDS_DICTIONARY[currentDictCategory] || [];
  container.innerHTML = items.map((item, idx) => {
    const key = (item.english || '').toLowerCase();
    const audioPath = DICT_AUDIO_MAP[key] || '';
    return `
    <div class="dict-card">
      <span class="dict-emoji">${item.emoji}</span>
      <div class="dict-tamil">${item.tamil}</div>
      <div class="dict-english">${item.english}</div>
      <button class="btn-dict-sound" onclick="speakTamilDictWord('${item.tamil.replace(/'/g, "\\'")}', '${item.english.replace(/'/g, "\\'")}')" data-audio="${audioPath}" title="Play Sound">
        <i class="fa fa-volume-up"></i>
      </button>
    </div>
  `;
  }).join('');
}

function filterDictCategory(catName) {
  currentDictCategory = catName;
  
  // Highlight active category chip (remove outline class, add to others)
  document.querySelectorAll('.dict-controls button').forEach(btn => {
    btn.classList.add('outline');
  });
  
  const activeBtn = document.getElementById(`dict-cat-${catName}`);
  if (activeBtn) {
    activeBtn.classList.remove('outline');
  }
  
  renderDictionary();
}

function speakTamilDictWord(tamilWord, englishWord) {
  console.log('speakTamilDictWord called with:', tamilWord, englishWord);
  if (!tamilWord) {
    console.warn('speakTamilDictWord: empty word');
    return;
  }

  const text = String(tamilWord).trim();
  const key = String(englishWord || '').toLowerCase().trim();

  // Cancel any active speech synthesis and stop any playing Audio
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (window.dictAudio) {
    try {
      window.dictAudio.pause();
    } catch (e) {
      console.warn('Error pausing audio:', e);
    }
    window.dictAudio = null;
  }

  // Increment voice generation ID to cancel any active callbacks from previous runs
  const currentGenId = (window.dictVoiceGenerationId || 0) + 1;
  window.dictVoiceGenerationId = currentGenId;

  // Play bubble pop click sound for kids
  playKidsBubbleSound();

  // Start the voice sequence: Tamil word -> English word -> Animal Sound effect (if animal)
  setTimeout(() => {
    if (currentGenId !== window.dictVoiceGenerationId) return;

    speakTamilText(text, 0.95, () => {
      if (currentGenId !== window.dictVoiceGenerationId) return;

      setTimeout(() => {
        if (currentGenId !== window.dictVoiceGenerationId) return;

        speakEnglishText(englishWord, 0.9, () => {
          if (currentGenId !== window.dictVoiceGenerationId) return;

          // If the active category is animals, play the animal sound clip or speak the sound effect
          if (currentDictCategory === 'animals') {
            const audioUrl = DICT_AUDIO_MAP[key];
            if (audioUrl) {
              const audio = new Audio(audioUrl);
              window.dictAudio = audio;

              let fallbackTriggered = false;
              const triggerFallback = () => {
                if (fallbackTriggered) return;
                fallbackTriggered = true;
                if (currentGenId !== window.dictVoiceGenerationId) return;
                const effect = DICT_EFFECTS_MAP[key] || '';
                if (effect) {
                  speakEnglishText(effect, 0.9);
                }
              };

              // Safety timeout for network/CORS issues with Wikimedia Commons
              const timeoutId = setTimeout(() => {
                console.warn('Audio play timeout, falling back to TTS effect');
                triggerFallback();
              }, 2500);

              audio.play().then(() => {
                console.log('Playing animal sound for', key);
                audio.onended = () => {
                  clearTimeout(timeoutId);
                };
              }).catch(err => {
                console.warn('Audio play failed, falling back to TTS effect', err);
                clearTimeout(timeoutId);
                triggerFallback();
              });
            } else {
              // Fallback for animals without audio URLs
              const effect = DICT_EFFECTS_MAP[key] || '';
              if (effect) {
                setTimeout(() => {
                  if (currentGenId !== window.dictVoiceGenerationId) return;
                  speakEnglishText(effect, 0.9);
                }, 100);
              }
            }
          }
        });
      }, 150); // small delay between languages
    });
  }, 100); // delay after bubble click sound
}
