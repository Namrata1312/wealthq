/* ======================================================
   WealthQ Chat — Application Logic
   ====================================================== */

// ---------- Config ----------
var BACKEND_URL = 'https://wealthq.onrender.com';

var CATEGORIES = [
  { id:'protection', label:'Protection', desc:'Insurance & Emergency Fund',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    opener:'Let\'s look at your safety net. Do you currently have any insurance policies?',
    options:['Yes, I have some policies','No, I don\'t have any yet','I\'m not sure what I have'] },
  { id:'growth', label:'Growth', desc:'Investments & Mutual Funds',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
    opener:'Let\'s talk about growing your money. Are you currently investing?',
    options:['Yes, in mutual funds','Yes, in stocks','I have FDs / savings only','Not yet, want to start'] },
  { id:'debt', label:'Debt', desc:'Loans & EMI Management',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    opener:'Let\'s review your debt situation. Do you have any active loans or EMIs?',
    options:['Yes, home loan','Yes, personal / car loan','Yes, credit card debt','No active loans'] },
  { id:'goals', label:'Goal Planning', desc:'Home, Car, Education, Travel',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    opener:'Let\'s plan for your goals. What are you saving up for?',
    options:['Buying a home','Child\'s education','A big purchase (car, travel)','I\'m not sure yet \u2014 help me think'] },
  { id:'optimise', label:'Optimisation', desc:'Tax & Expense Saving',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    opener:'Let\'s find savings you might be missing. Which area interests you?',
    options:['Tax saving options','Reducing monthly expenses','Optimising my investments','All of the above'] },
  { id:'annual', label:'Annual Plan', desc:'Budget & Cash Flow',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    opener:'Let\'s build your annual plan. What\'s your approximate monthly income?',
    options:['Under \u20b950K','50K \u2013 1L','1L \u2013 3L','Above 3L','Prefer not to say'] },
  { id:'retirement', label:'Retirement', desc:'NPS, Pension & FIRE',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    opener:'Let\'s think about your future. How old are you currently?',
    options:['20\u201330','30\u201340','40\u201350','50+'] }
];

// ---------- State ----------
var chatHistory = [];
var pendingFile = null;
var isListening = false;
var recognition = null;
var currentCategory = null;
var config = { testerName:'anonymous', language:'english' };
var sidebarCards = {};
var isTyping = false;
var pendingMCQ = null;
var pendingTypeTimer = null;

// ---------- i18n ----------
var STRINGS = {
  english:{ dashTitle:"What do you need help with?", dashDesc:"Pick a category to continue where you left off, or start fresh.", otherChat:"I want to talk about something else", placeholder:"Type here...", hint:"PDF / CSV / Photos \u2014 not financial advice", langChanged:"Language changed to English", systemLangNote:"Always respond in English.", statusLabel:"Online", toastNoBackend:"Backend not configured", toastFileType:"Only PDF, CSV, and images supported", toastFileSize:"File too large \u2014 keep under 10MB", toastMicError:"Mic error: ", toastMicUnsupported:"Speech not supported. Try Chrome.", errorServer:"Could not reach the server." },
  hindi:{ dashTitle:"\u0906\u092A\u0915\u094B \u0915\u093F\u0938\u092E\u0947\u0902 \u092E\u0926\u0926 \u091A\u093E\u0939\u093F\u090F?", dashDesc:"\u0915\u0948\u091F\u0947\u0917\u0930\u0940 \u091A\u0941\u0928\u0947\u0902 \u092F\u093E \u0928\u0908 \u092C\u093E\u0924 \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902\u0964", otherChat:"\u0915\u0941\u091B \u0914\u0930 \u092A\u0942\u091B\u0928\u093E \u0939\u0948", placeholder:"\u092F\u0939\u093E\u0901 \u0932\u093F\u0916\u0947\u0902...", hint:"PDF / CSV / \u092B\u093C\u094B\u091F\u094B \u2014 \u0935\u093F\u0924\u094D\u0924\u0940\u092F \u0938\u0932\u093E\u0939 \u0928\u0939\u0940\u0902", langChanged:"\u092D\u093E\u0937\u093E \u0939\u093F\u0902\u0926\u0940 \u092E\u0947\u0902 \u092C\u0926\u0932 \u0917\u0908", systemLangNote:"Ab se hamesha Devanagari script mein shuddh Hindi mein jawab do.", statusLabel:"\u0932\u093E\u0907\u0935", toastNoBackend:"\u092C\u0948\u0915\u0947\u0902\u0921 \u0928\u0939\u0940\u0902", toastFileType:"\u0938\u093F\u0930\u094D\u092B PDF, CSV, \u0907\u092E\u0947\u091C", toastFileSize:"10MB \u0938\u0947 \u0915\u092E", toastMicError:"\u092E\u093E\u0907\u0915 \u090F\u0930\u0930: ", toastMicUnsupported:"\u0938\u094D\u092A\u0940\u091A \u0928\u0939\u0940\u0902", errorServer:"\u0938\u0930\u094D\u0935\u0930 \u0928\u0939\u0940\u0902 \u092E\u093F\u0932\u093E" },
  hinglish:{ dashTitle:"Kisme help chahiye?", dashDesc:"Category chuno ya kuch naya poocho.", otherChat:"Kuch aur puchna hai", placeholder:"Yahan likho...", hint:"PDF / CSV / Photos \u2014 financial advice nahi hai", langChanged:"Language Hinglish ho gayi", systemLangNote:"Hamesha Hinglish mein jawab do - Roman script mein Hindi aur English mix karke.", statusLabel:"LIVE", toastNoBackend:"Backend nahi", toastFileType:"Sirf PDF, CSV, images", toastFileSize:"File badi hai", toastMicError:"Mic error: ", toastMicUnsupported:"Speech nahi hai", errorServer:"Server nahi mila" }
};
function t(key) { var l = config.language || 'english'; return (STRINGS[l] && STRINGS[l][key]) || (STRINGS.english[key]) || key; }

// ---------- Safe localStorage ----------
function safeSetItem(key, value) {
  try { localStorage.setItem(key, value); return true; }
  catch(e) { if (e.name === 'QuotaExceededError') showToast('Storage full \u2014 some data may not be saved'); return false; }
}

// ---------- Persistence ----------
function loadCatState() { try { return JSON.parse(localStorage.getItem('wq_cat_state') || '{}'); } catch(e) { return {}; } }
function saveCatState(state) { safeSetItem('wq_cat_state', JSON.stringify(state)); }
function getCatProgress(id) { var s = loadCatState(); return s[id] || { progress:0, hasNotif:false, status:'new' }; }
function setCatProgress(id, progress, status) { var s = loadCatState(); s[id] = { progress:Math.min(100,progress), hasNotif:false, status:status||'progress' }; saveCatState(s); }

function loadConfig() { try { var s = JSON.parse(localStorage.getItem('wealthq_config') || '{}'); config.testerName = s.testerName || 'anonymous'; config.language = s.language || 'english'; } catch(e) {} }
function saveConfig() { safeSetItem('wealthq_config', JSON.stringify(config)); }
function getPersistentUserId() { var u = localStorage.getItem('wealthq_uid'); if (!u) { u = 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2,7); safeSetItem('wealthq_uid', u); } return u; }
var sessionId = getPersistentUserId();

// ---------- Toast ----------
function showToast(msg) { var el = document.getElementById('toast'); el.textContent = msg; el.classList.add('show'); setTimeout(function() { el.classList.remove('show'); }, 2500); }

// ---------- Header State ----------
function setHeaderForDashboard() {
  var center = document.getElementById('header-center');
  var right = document.getElementById('header-right');
  center.innerHTML = '';
  right.innerHTML = buildLangToggle() + '<div class="status-dot"><div class="dot"></div><span>Online</span></div>';
}

function setHeaderForChat(cat) {
  var center = document.getElementById('header-center');
  var right = document.getElementById('header-right');
  center.innerHTML = '<button class="back-btn" onclick="goBack()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg></button>' +
    '<div class="chat-cat-info"><div class="chat-cat-icon">' + cat.icon + '</div><div class="chat-cat-label">' + cat.label + '</div></div>';
  right.innerHTML = buildLangToggle();
}

function buildLangToggle() {
  return '<div class="lang-toggle">' +
    '<button class="lang-btn' + (config.language==='english'?' active':'') + '" data-lang="english" onclick="switchLang(\'english\')">EN</button>' +
    '<button class="lang-btn' + (config.language==='hindi'?' active':'') + '" data-lang="hindi" onclick="switchLang(\'hindi\')">HI</button>' +
    '<button class="lang-btn' + (config.language==='hinglish'?' active':'') + '" data-lang="hinglish" onclick="switchLang(\'hinglish\')">MIX</button>' +
    '</div>';
}

// ---------- Dashboard ----------
function renderDashboard() {
  var grid = document.getElementById('cat-grid');
  grid.innerHTML = '';
  CATEGORIES.forEach(function(cat) {
    var st = getCatProgress(cat.id);
    var pct = st.progress || 0;
    var r = 17; var circ = 2 * Math.PI * r;
    var offset = circ * (1 - pct / 100);
    var strokeColor = pct >= 100 ? 'var(--green)' : pct > 0 ? 'var(--orange)' : 'var(--surface3)';
    var statusText = pct >= 100 ? 'Complete' : pct > 0 ? pct + '%' : '';
    var statusColor = pct >= 100 ? 'color:var(--green)' : pct > 0 ? 'color:var(--orange)' : 'color:var(--text-quaternary)';
    var card = document.createElement('div');
    card.className = 'cat-card'; card.tabIndex = 0;
    card.onclick = function() { openCategory(cat.id); };
    card.onkeydown = function(e) { if (e.key === 'Enter') openCategory(cat.id); };
    card.innerHTML =
      '<div class="notif-badge' + (st.hasNotif ? '' : ' hidden') + '"></div>' +
      '<div class="ring-wrap"><svg class="ring-svg" viewBox="0 0 42 42"><circle class="ring-bg" cx="21" cy="21" r="' + r + '"/><circle class="ring-progress" cx="21" cy="21" r="' + r + '" stroke="' + strokeColor + '" stroke-dasharray="' + circ + '" stroke-dashoffset="' + offset + '"/></svg><div class="ring-icon">' + cat.icon + '</div></div>' +
      '<div class="cat-content"><div class="cat-label">' + cat.label + '</div><div class="cat-desc">' + cat.desc + '</div>' + (statusText ? '<div class="cat-status" style="' + statusColor + '">' + statusText + '</div>' : '') + '</div>';
    grid.appendChild(card);
  });
}

// ---------- Navigation ----------
function cleanupTyping() {
  if (pendingTypeTimer) { clearTimeout(pendingTypeTimer); pendingTypeTimer = null; }
  isTyping = false; pendingMCQ = null;
}

function openCategory(catId) {
  var cat = CATEGORIES.find(function(c) { return c.id === catId; });
  if (!cat) return;
  currentCategory = cat;
  chatHistory = [];
  sidebarCards = {};
  cleanupTyping(); clearSidebar();
  try { var saved = localStorage.getItem('wq_chat_' + catId); if (saved) chatHistory = JSON.parse(saved); } catch(e) {}
  setHeaderForChat(cat);
  document.getElementById('dashboard-view').classList.add('hidden');
  document.getElementById('chat-view').classList.remove('hidden');
  document.getElementById('chat').innerHTML = '';
  if (chatHistory.length > 0) {
    chatHistory.forEach(function(msg) { var text = typeof msg.content === 'string' ? msg.content : '[file]'; appendMessage(msg.role === 'user' ? 'user' : 'bot', text, true); });
  } else {
    setTimeout(function() { typeMessage(cat.opener, function() { renderMCQ(cat.options); }); setCatProgress(catId, Math.max(getCatProgress(catId).progress, 5), 'progress'); }, 300);
  }
}

function openFreeChat() {
  currentCategory = { id:'free', label:'Ask Anything', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', opener:'', options:[] };
  chatHistory = []; sidebarCards = {};
  cleanupTyping(); clearSidebar();
  try { var saved = localStorage.getItem('wq_chat_free'); if (saved) chatHistory = JSON.parse(saved); } catch(e) {}
  setHeaderForChat(currentCategory);
  document.getElementById('dashboard-view').classList.add('hidden');
  document.getElementById('chat-view').classList.remove('hidden');
  document.getElementById('chat').innerHTML = '';
  if (chatHistory.length > 0) {
    chatHistory.forEach(function(msg) { var text = typeof msg.content === 'string' ? msg.content : '[file]'; appendMessage(msg.role === 'user' ? 'user' : 'bot', text, true); });
  } else {
    setTimeout(function() { typeMessage('What\u2019s on your mind? Ask me anything about your finances.'); }, 300);
  }
}

function goBack() {
  cleanupTyping();
  if (currentCategory) { try { safeSetItem('wq_chat_' + currentCategory.id, JSON.stringify(chatHistory)); } catch(e) {} }
  currentCategory = null; chatHistory = []; sidebarCards = {};
  clearSidebar(); setHeaderForDashboard();
  document.getElementById('chat-view').classList.add('hidden');
  document.getElementById('dashboard-view').classList.remove('hidden');
  document.querySelector('.shell').classList.remove('has-sidebar');
  renderDashboard();
}

// ---------- Language ----------
function applyLanguage(lang) {
  config.language = lang; saveConfig();
  document.querySelectorAll('.lang-btn').forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-lang') === lang); });
  var el;
  el = document.getElementById('dash-title'); if (el) el.textContent = t('dashTitle');
  el = document.getElementById('dash-desc'); if (el) el.textContent = t('dashDesc');
  el = document.getElementById('other-chat-btn'); if (el) el.textContent = t('otherChat');
  el = document.getElementById('user-input'); if (el) el.placeholder = t('placeholder');
  el = document.getElementById('input-hint'); if (el) el.textContent = t('hint');
}
function switchLang(lang) {
  applyLanguage(lang); showToast(t('langChanged'));
  if (chatHistory.length > 0) {
    chatHistory.push({ role:'user', content:'[Language changed to ' + lang + '. ' + t('systemLangNote') + ']' });
    chatHistory.push({ role:'assistant', content:t('langChanged') + '.' });
  }
}

// ---------- Messages ----------
function appendMessage(role, text, skipAnim) {
  var chat = document.getElementById('chat');
  if (!chat) return;
  var wrap = document.createElement('div'); wrap.className = 'msg ' + role;
  if (skipAnim) wrap.style.animation = 'none';
  var bubble = document.createElement('div'); bubble.className = 'bubble';
  if (role === 'bot') {
    var parsed = renderVisualComponents(text);
    bubble.innerHTML = parsed.html;
    if (parsed.vizCards && parsed.vizCards.length > 0) parsed.vizCards.forEach(function(vc) { upsertSidebarCard(vc.type, vc.summary, vc.html); });
  } else { bubble.textContent = text; }
  var meta = document.createElement('div'); meta.className = 'msg-meta';
  meta.textContent = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  wrap.appendChild(bubble); wrap.appendChild(meta); chat.appendChild(wrap); chat.scrollTop = chat.scrollHeight;
}

// ---------- Typing Animation ----------
function typeMessage(fullText, onComplete) {
  isTyping = true;
  var chat = document.getElementById('chat');
  if (!chat) { isTyping = false; return; }
  var wrap = document.createElement('div'); wrap.className = 'msg bot';
  var bubble = document.createElement('div'); bubble.className = 'bubble';
  var meta = document.createElement('div'); meta.className = 'msg-meta';
  meta.textContent = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  wrap.appendChild(bubble); wrap.appendChild(meta); chat.appendChild(wrap);

  var parsed = renderVisualComponents(fullText);
  var htmlToType = parsed.html;
  if (parsed.vizCards && parsed.vizCards.length > 0) parsed.vizCards.forEach(function(vc) { upsertSidebarCard(vc.type, vc.summary, vc.html); });

  var tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlToType;
  var plainText = tempDiv.textContent || tempDiv.innerText || '';
  var words = plainText.split(/(\s+)/);
  var hasViz = htmlToType.indexOf('viz-') !== -1;

  if (hasViz || words.length < 3) {
    bubble.style.opacity = '0'; bubble.innerHTML = htmlToType;
    bubble.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(function() { bubble.style.opacity = '1'; });
    chat.scrollTop = chat.scrollHeight;
    pendingTypeTimer = setTimeout(function() { pendingTypeTimer = null; isTyping = false; if (onComplete) onComplete(); revealPendingMCQ(); }, 400);
    return;
  }

  var wordIndex = 0;
  var cursor = document.createElement('span'); cursor.className = 'typing-cursor';
  bubble.appendChild(cursor);
  var WORDS_PER_TICK = 3, TICK_MS = 30;

  function tick() {
    if (!document.body.contains(wrap)) { isTyping = false; pendingTypeTimer = null; return; }
    if (wordIndex >= words.length) {
      bubble.innerHTML = htmlToType; isTyping = false; pendingTypeTimer = null;
      chat.scrollTop = chat.scrollHeight;
      if (onComplete) onComplete(); revealPendingMCQ(); return;
    }
    var chunk = '';
    for (var i = 0; i < WORDS_PER_TICK && wordIndex < words.length; i++, wordIndex++) chunk += words[wordIndex];
    if (cursor.parentNode) cursor.parentNode.insertBefore(document.createTextNode(chunk), cursor);
    chat.scrollTop = chat.scrollHeight;
    pendingTypeTimer = setTimeout(tick, TICK_MS);
  }
  tick();
}

function revealPendingMCQ() { var el = document.getElementById('active-mcq'); if (el && el.classList.contains('pending')) el.classList.remove('pending'); }

// ---------- Typing Indicator ----------
function showTyping() { var chat = document.getElementById('chat'); if (!chat) return; var wrap = document.createElement('div'); wrap.className = 'msg bot'; wrap.id = 'typing-indicator'; var bubble = document.createElement('div'); bubble.className = 'bubble typing-bubble'; bubble.innerHTML = '<span></span><span></span><span></span>'; wrap.appendChild(bubble); chat.appendChild(wrap); chat.scrollTop = chat.scrollHeight; }
function removeTyping() { var el = document.getElementById('typing-indicator'); if (el) el.remove(); }

// ---------- MCQ ----------
function renderMCQ(options, freeTextHint) {
  if (!options || options.length === 0) return;
  var chat = document.getElementById('chat'); if (!chat) return;
  var wrap = document.createElement('div');
  wrap.className = 'mcq-options' + (isTyping ? ' pending' : '');
  wrap.id = 'active-mcq';
  var keys = ['A','B','C','D','E','F'];
  options.forEach(function(opt, i) {
    var btn = document.createElement('button'); btn.className = 'mcq-btn';
    btn.innerHTML = '<span class="mcq-key">' + (keys[i] || (i+1)) + '</span><span class="mcq-text">' + opt + '</span>';
    btn.onclick = function() { selectMCQ(opt); };
    wrap.appendChild(btn);
  });
  var openBtn = document.createElement('button'); openBtn.className = 'open-end';
  openBtn.textContent = freeTextHint || 'Or type your own answer\u2026';
  openBtn.onclick = function() { removeMCQ(); document.getElementById('user-input').focus(); };
  wrap.appendChild(openBtn); chat.appendChild(wrap); chat.scrollTop = chat.scrollHeight;
}
function selectMCQ(text) { removeMCQ(); sendMessageDirect(text); }
function removeMCQ() { var el = document.getElementById('active-mcq'); if (el) el.remove(); }

// ---------- Visual Components Parser ----------
function renderVisualComponents(text) {
  if (typeof marked === 'undefined') return { html: escapeHtml(text), vizCards: [] };
  var vizCards = [];

  text = text.replace(/:::metric\s+title="([^"]*?)"\s+value="([^"]*?)"\s*(?:change="([^"]*?)")?\s*(?:trend="([^"]*?)")?\s*:::/g, function(m, title, value, change, trend) {
    var ch = change ? '<div class="viz-metric-change ' + (trend||'') + '">' + change + '</div>' : '';
    var html = '<div class="viz-metric"><div><div class="viz-metric-label">' + title + '</div><div class="viz-metric-value">' + value + '</div>' + ch + '</div></div>';
    vizCards.push({ type:'metric-' + title.toLowerCase().replace(/\s+/g,'-'), summary: title + ': ' + value, html: html });
    return html;
  });

  text = text.replace(/:::progress\s+title="([^"]*?)"\s+current="([^"]*?)"\s+target="([^"]*?)"\s*(?:unit="([^"]*?)")?\s*:::/g, function(m, title, current, target, unit) {
    var pct = Math.min(100, Math.round((parseFloat(current) / parseFloat(target)) * 100)); var u = unit || '';
    var color = pct >= 100 ? 'var(--green)' : 'var(--orange)';
    var html = '<div class="viz-progress"><div class="viz-progress-header"><span class="viz-progress-title">' + title + '</span><span class="viz-progress-nums">\u20b9' + current + u + ' / \u20b9' + target + u + '</span></div><div class="viz-progress-track"><div class="viz-progress-fill" style="width:' + pct + '%;background:' + color + '"></div></div></div>';
    vizCards.push({ type:'progress-' + title.toLowerCase().replace(/\s+/g,'-'), summary: title + ': ' + pct + '%', html: html });
    return html;
  });

  text = text.replace(/:::goal\s+title="([^"]*?)"\s+current="([^"]*?)"\s+target="([^"]*?)"\s*(?:unit="([^"]*?)")?\s*:::/g, function(m, title, current, target, unit) {
    var pct = Math.min(100, Math.round((parseFloat(current) / parseFloat(target)) * 100)); var u = unit || '';
    var color = pct >= 100 ? 'var(--green)' : 'var(--accent)';
    var r = 20; var circ = 2 * Math.PI * r; var off = circ * (1 - pct / 100);
    var html = '<div class="viz-goal"><div class="viz-goal-ring"><svg viewBox="0 0 48 48"><circle class="ring-bg" cx="24" cy="24" r="' + r + '"/><circle class="ring-fill" cx="24" cy="24" r="' + r + '" stroke="' + color + '" stroke-dasharray="' + circ + '" stroke-dashoffset="' + off + '"/></svg><div class="viz-goal-pct">' + pct + '%</div></div><div class="viz-goal-info"><div class="viz-goal-title">' + title + '</div><div class="viz-goal-sub">' + current + u + ' of ' + target + u + '</div></div></div>';
    vizCards.push({ type:'goal-' + title.toLowerCase().replace(/\s+/g,'-'), summary: title + ': ' + pct + '%', html: html });
    return html;
  });

  text = text.replace(/:::compare\s+title="([^"]*?)"\n([\s\S]*?):::/g, function(m, title, body) {
    var rows = body.trim().split('\n').map(function(l) { return l.split('|').map(function(s) { return s.trim(); }); });
    var maxVal = 0; rows.forEach(function(r) { var v = parseFloat(r[1]); if (v > maxVal) maxVal = v; });
    var colors = ['var(--accent)','var(--orange)','#6366f1','#ec4899','#0ea5e9'];
    var html = '<div class="viz-compare"><div class="viz-compare-title">' + title + '</div>';
    rows.forEach(function(r, i) { var v = parseFloat(r[1]); var pct = maxVal > 0 ? Math.round((v / maxVal) * 100) : 0; html += '<div class="viz-compare-row"><span class="viz-compare-label">' + r[0] + '</span><div class="viz-compare-bar-wrap"><div class="viz-compare-bar" style="width:' + pct + '%;background:' + colors[i % colors.length] + '"></div></div><span class="viz-compare-val">' + r[1] + '</span></div>'; });
    html += '</div>';
    vizCards.push({ type:'compare-' + title.toLowerCase().replace(/\s+/g,'-'), summary: title, html: html });
    return html;
  });

  text = text.replace(/:::journey\s+title="([^"]*?)"\n([\s\S]*?):::/g, function(m, title, body) {
    var steps = body.trim().split('\n').map(function(l) { return l.split('|').map(function(s) { return s.trim(); }); });
    var html = '<div class="viz-journey"><div class="viz-journey-title">' + title + '</div>';
    steps.forEach(function(s) { var dc = s[1] === 'done' ? 'done' : s[1] === 'active' ? 'active' : ''; html += '<div class="viz-journey-step"><div class="viz-journey-dot-col"><div class="viz-journey-dot ' + dc + '"></div><div class="viz-journey-line"></div></div><div class="viz-journey-content"><div class="viz-journey-label">' + s[0] + '</div>' + (s[2] ? '<div class="viz-journey-detail">' + s[2] + '</div>' : '') + '</div></div>'; });
    html += '</div>';
    vizCards.push({ type:'journey-' + title.toLowerCase().replace(/\s+/g,'-'), summary: title, html: html });
    return html;
  });

  var optionsMatch = text.match(/:::options\n([\s\S]*?):::/);
  if (optionsMatch) {
    text = text.replace(/:::options\n[\s\S]*?:::/g, '');
    var opts = optionsMatch[1].trim().split('\n').map(function(l) { return l.replace(/^[-*]\s*/, '').trim(); }).filter(function(l) { return l.length > 0; });
    pendingMCQ = opts;
  }

  return { html: marked.parse(text), vizCards: vizCards };
}

function escapeHtml(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

// ---------- Sidebar ----------
function upsertSidebarCard(type, summary, html) { sidebarCards[type] = { summary: summary, html: html }; rebuildSidebar(); }

function rebuildSidebar() {
  var container = document.getElementById('sidebar-cards');
  var sidebar = document.getElementById('sidebar');
  if (!container || !sidebar) return;
  container.innerHTML = '';
  var keys = Object.keys(sidebarCards);
  if (keys.length === 0) { sidebar.classList.remove('has-cards'); container.innerHTML = '<div class="sidebar-empty">Insights will appear here as we chat</div>'; return; }
  sidebar.classList.add('has-cards');
  keys.forEach(function(key) {
    var card = sidebarCards[key];
    var el = document.createElement('div'); el.className = 'sidebar-card'; el.setAttribute('data-card-type', key);
    el.innerHTML = '<div class="sidebar-card-head" onclick="toggleSidebarCard(this)"><span class="sidebar-card-type">' + key.split('-')[0] + '</span><span class="sidebar-card-summary">' + card.summary + '</span><svg class="sidebar-card-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div><div class="sidebar-card-body">' + card.html + '</div>';
    container.appendChild(el);
  });
  if (!sidebar.classList.contains('manually-closed')) { sidebar.classList.add('open'); document.querySelector('.shell').classList.add('has-sidebar'); }
}

function clearSidebar() { var c = document.getElementById('sidebar-cards'); var s = document.getElementById('sidebar'); if (c) c.innerHTML = ''; if (s) s.classList.remove('open','has-cards','manually-closed'); }
function toggleSidebarCard(headEl) { headEl.parentElement.classList.toggle('collapsed'); }
function toggleSidebar() { var s = document.getElementById('sidebar'); var sh = document.querySelector('.shell'); if (s.classList.contains('open')) { s.classList.remove('open'); s.classList.add('manually-closed'); sh.classList.remove('has-sidebar'); } else { s.classList.add('open'); s.classList.remove('manually-closed'); sh.classList.add('has-sidebar'); } }
function closeSidebar() { var s = document.getElementById('sidebar'); s.classList.remove('open'); s.classList.add('manually-closed'); document.querySelector('.shell').classList.remove('has-sidebar'); }

// ---------- File Handling ----------
var ALLOWED_TYPES = { 'application/pdf':{label:'PDF',icon:'[PDF]',type:'document'},'text/csv':{label:'CSV',icon:'[CSV]',type:'text'},'text/plain':{label:'CSV',icon:'[CSV]',type:'text'},'image/jpeg':{label:'Image',icon:'[IMG]',type:'image'},'image/png':{label:'Image',icon:'[IMG]',type:'image'},'image/webp':{label:'Image',icon:'[IMG]',type:'image'},'image/heic':{label:'Image',icon:'[IMG]',type:'image'} };

function handleFileSelect(event) {
  var file = event.target.files[0]; if (!file) return;
  var isCSV = file.name.toLowerCase().endsWith('.csv'); var mimeType = isCSV ? 'text/csv' : file.type;
  var allowed = ALLOWED_TYPES[mimeType];
  if (!allowed) { showToast(t('toastFileType')); event.target.value = ''; return; }
  if (file.size > 10*1024*1024) { showToast(t('toastFileSize')); event.target.value = ''; return; }
  var reader = new FileReader();
  reader.onload = function(e) { var base64 = e.target.result.split(',')[1]; pendingFile = { base64:base64, mediaType:mimeType, name:file.name, kind:allowed.type, icon:allowed.icon }; document.getElementById('file-chip-icon').textContent = allowed.icon + ' '; document.getElementById('file-chip-name').textContent = file.name; document.getElementById('file-preview').classList.remove('hidden'); };
  reader.readAsDataURL(file); event.target.value = '';
}
function removeFile() { pendingFile = null; document.getElementById('file-preview').classList.add('hidden'); }

// ---------- Logging ----------
function logToSheets(userMsg, botReply) { if (!config.sheetsUrl) return; fetch(config.sheetsUrl, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ sessionId:sessionId, testerName:config.testerName, timestamp:new Date().toISOString(), userMessage:userMsg, botReply:botReply }) }).catch(function(){}); }

// ---------- Input ----------
function autoResize(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }
function handleKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }

// ---------- System Prompt ----------
function getSystemContext() {
  var catContext = '';
  if (currentCategory && currentCategory.id !== 'free') catContext = 'The user selected the "' + currentCategory.label + '" category (' + currentCategory.desc + '). Stay focused on this topic.\n\n';
  return catContext + 'You are WealthQ AI, a financial thinking partner for Indian users. Follow these rules strictly:\n\nINTERACTION STYLE:\n- Ask ONE question at a time. Keep it simple and conversational.\n- ALWAYS provide 2-4 clickable options for the user to choose from when the question has finite answers.\n- Format options using this EXACT syntax (the frontend will render them as buttons):\n:::options\n- Option 1\n- Option 2\n- Option 3\n:::\n- Only skip options when the question truly requires free-form input (like entering a number or name).\n- Be concise. No lengthy explanations unless asked.\n\nVISUAL DATA (use these when presenting numbers, comparisons, or progress):\n- Metric card: :::metric title="Label" value="\u20b912L" change="+15%" trend="up":::\n- Progress bar: :::progress title="Home Fund" current="12" target="50" unit="L":::\n- Goal ring: :::goal title="Emergency Fund" current="2" target="6" unit=" months":::\n- Comparison: :::compare title="Returns Comparison"\nFD|6.5%\nMutual Fund|12.3%\nPPF|7.1%\n:::\n- Journey: :::journey title="Your Plan"\nStep 1|done|Completed\nStep 2|active|In progress\nStep 3|pending|Coming up\n:::\n- Use these visual components generously whenever showing numbers or comparisons.\n- You can combine text with multiple visual components in one response.\n\n' + t('systemLangNote');
}

// ---------- Sending Messages ----------
function sendMessageDirect(text) { document.getElementById('user-input').value = ''; autoResize(document.getElementById('user-input')); sendWithText(text, null); }
function sendMessage() { var input = document.getElementById('user-input'); var text = input.value.trim(); if (!text && !pendingFile) return; var fileToSend = pendingFile; input.value = ''; autoResize(input); if (fileToSend) removeFile(); sendWithText(text, fileToSend); }

function sendWithText(text, fileToSend) {
  if (!BACKEND_URL) { showToast(t('toastNoBackend')); return; }
  removeMCQ(); pendingMCQ = null; document.getElementById('send-btn').disabled = true;
  var displayText = fileToSend ? (text ? text + ' ' + fileToSend.icon + ' ' + fileToSend.name : fileToSend.icon + ' ' + fileToSend.name) : text;
  appendMessage('user', displayText);

  var messageContent;
  if (fileToSend) { messageContent = []; if (fileToSend.kind === 'image') messageContent.push({ type:'image', source:{ type:'base64', media_type:fileToSend.mediaType, data:fileToSend.base64 }}); else if (fileToSend.kind === 'document') messageContent.push({ type:'document', source:{ type:'base64', media_type:'application/pdf', data:fileToSend.base64 }}); else { messageContent.push({ type:'text', text:'CSV (' + fileToSend.name + '):\n\n' + atob(fileToSend.base64) }); } messageContent.push({ type:'text', text:text || 'Please analyse this file.' }); }
  else { messageContent = text; }

  var sysCtx = getSystemContext(); var messagesForAPI = chatHistory.slice();
  if (messagesForAPI.length === 0) { messagesForAPI = [{ role:'user', content:sysCtx + '\n\n' + (typeof messageContent === 'string' ? messageContent : JSON.stringify(messageContent)) }]; }
  else { if (typeof messagesForAPI[0].content === 'string' && !messagesForAPI[0].content.startsWith('You are WealthQ')) messagesForAPI[0] = { role:'user', content:sysCtx + '\n\n' + messagesForAPI[0].content }; messagesForAPI.push({ role:'user', content:messageContent }); }
  chatHistory.push({ role:'user', content:messageContent }); showTyping();

  var wakeTimer = null;
  if (chatHistory.length <= 2) wakeTimer = setTimeout(function() { showToast('Server waking up \u2014 may take 30s\u2026'); }, 5000);

  var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  var fetchTimeout = setTimeout(function() { if (controller) controller.abort(); }, 60000);
  var fetchOpts = { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ messages:messagesForAPI, sessionId:sessionId, testerName:config.testerName, language:config.language }) };
  if (controller) fetchOpts.signal = controller.signal;

  fetch(BACKEND_URL + '/chat', fetchOpts)
  .then(function(res) { clearTimeout(fetchTimeout); if (wakeTimer) clearTimeout(wakeTimer); return res.json(); })
  .then(function(data) {
    if (data.error) { removeTyping(); appendMessage('bot', 'Error: ' + data.error); document.getElementById('send-btn').disabled = false; return; }
    var reply = data.reply; removeTyping(); pendingMCQ = null;
    typeMessage(reply, function() { if (pendingMCQ && pendingMCQ.length > 0) { renderMCQ(pendingMCQ); pendingMCQ = null; } });
    chatHistory.push({ role:'assistant', content:reply }); logToSheets(displayText, reply);
    if (currentCategory) { try { safeSetItem('wq_chat_' + currentCategory.id, JSON.stringify(chatHistory)); } catch(e) {} var msgCount = chatHistory.filter(function(m) { return m.role === 'user'; }).length; var pct = Math.min(95, msgCount * 15); setCatProgress(currentCategory.id, Math.max(getCatProgress(currentCategory.id).progress, pct), 'progress'); }
  })
  .catch(function(err) { clearTimeout(fetchTimeout); removeTyping(); appendMessage('bot', err.name === 'AbortError' ? 'Request timed out. Please try again.' : t('errorServer')); console.error(err); })
  .finally(function() { document.getElementById('send-btn').disabled = false; var inp = document.getElementById('user-input'); if (inp) inp.focus(); });
}

// ---------- Mic ----------
function toggleMic() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) { showToast(t('toastMicUnsupported')); return; }
  if (isListening) { if (recognition) recognition.stop(); return; }
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition; recognition = new SR();
  recognition.lang = config.language === 'hindi' ? 'hi-IN' : 'en-IN'; recognition.interimResults = true; recognition.continuous = false;
  recognition.onstart = function() { isListening = true; document.getElementById('mic-btn').classList.add('listening'); };
  recognition.onresult = function(e) { var txt = ''; for (var i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript; var inp = document.getElementById('user-input'); inp.value = txt; autoResize(inp); };
  recognition.onerror = function(e) { showToast(t('toastMicError') + e.error); stopMic(); };
  recognition.onend = function() { stopMic(); }; recognition.start();
}
function stopMic() { isListening = false; var btn = document.getElementById('mic-btn'); if (btn) btn.classList.remove('listening'); }

// ---------- Keyboard shortcuts ----------
document.addEventListener('keydown', function(e) {
  var mcq = document.getElementById('active-mcq');
  if (!mcq || mcq.classList.contains('pending')) return;
  var btns = mcq.querySelectorAll('.mcq-btn');
  var map = { a:0, b:1, c:2, d:3, e:4, f:5 };
  var idx = map[e.key.toLowerCase()];
  if (idx !== undefined && idx < btns.length) btns[idx].click();
});

// ---------- Init ----------
loadConfig();
setHeaderForDashboard();
applyLanguage(config.language);
renderDashboard();
