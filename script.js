const GROQ_API_KEY = "YOUR_API_KEY_HERE";

// VAULT STORAGE
let vaultItems = [];
let currentPassword = '';

// COMMON PASSWORDS LIST
const commonPasswords = [
  'password', '123456', 'password123',
  'admin', 'letmein', 'qwerty',
  'abc123', 'monkey', 'master',
  'dragon', 'welcome', 'login',
  'iloveyou', 'sunshine', 'princess'
];

// ==================
// TAB SWITCHING
// ==================
function switchTab(tabName) {
  document.querySelectorAll('.tab')
    .forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content')
    .forEach(t => t.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById(tabName)
    .classList.add('active');
}

// ==================
// PASSWORD GENERATOR
// ==================
function updateLength() {
  const val = document
    .getElementById('lengthSlider').value;
  document.getElementById('lengthVal')
    .textContent = val;
}

function generatePassword() {
  const length = parseInt(
    document.getElementById('lengthSlider').value
  );
  const useUpper = document
    .getElementById('useUpper').checked;
  const useLower = document
    .getElementById('useLower').checked;
  const useNumbers = document
    .getElementById('useNumbers').checked;
  const useSymbols = document
    .getElementById('useSymbols').checked;

  let chars = '';
  if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (useNumbers) chars += '0123456789';
  if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) {
    document.getElementById('genStatus')
      .textContent = 'Select at least one option!';
    return;
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  currentPassword = password;
  document.getElementById('generatedPwd')
    .textContent = password;
  document.getElementById('genStatus')
    .textContent = '✅ Password generated!';

  setTimeout(() => {
    document.getElementById('genStatus')
      .textContent = '';
  }, 2000);
}

function copyGenerated() {
  const pwd = document
    .getElementById('generatedPwd').textContent;
  if (pwd === 'Click Generate!') return;

  navigator.clipboard.writeText(pwd);
  document.getElementById('genStatus')
    .textContent = '📋 Copied to clipboard!';

  setTimeout(() => {
    document.getElementById('genStatus')
      .textContent = '';
  }, 2000);
}

function saveToVault() {
  if (!currentPassword ||
    currentPassword === 'Click Generate!') {
    document.getElementById('genStatus')
      .textContent = 'Generate a password first!';
    return;
  }

  // SWITCH TO VAULT TAB
  document.querySelectorAll('.tab')
    .forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content')
    .forEach(t => t.classList.remove('active'));

  document.querySelectorAll('.tab')[1]
    .classList.add('active');
  document.getElementById('vault')
    .classList.add('active');

  document.getElementById('vaultPwd')
    .value = currentPassword;
}

// ==================
// VAULT
// ==================
function toggleVaultPwd() {
  const input = document
    .getElementById('vaultPwd');
  input.type = input.type === 'password'
    ? 'text' : 'password';
}

function addToVault() {
  const site = document
    .getElementById('vaultSite').value.trim();
  const user = document
    .getElementById('vaultUser').value.trim();
  const pwd = document
    .getElementById('vaultPwd').value.trim();

  if (!site || !pwd) {
    alert('Please enter website and password!');
    return;
  }

  const item = {
    id: Date.now(),
    site,
    user,
    pwd,
    hidden: true
  };

  vaultItems.push(item);
  renderVault();

  // CLEAR INPUTS
  document.getElementById('vaultSite').value = '';
  document.getElementById('vaultUser').value = '';
  document.getElementById('vaultPwd').value = '';
}

function renderVault() {
  const list = document
    .getElementById('vaultList');

  if (vaultItems.length === 0) {
    list.innerHTML = '<p class="empty-msg">No secrets stored yet...</p>';
    return;
  }

  list.innerHTML = vaultItems.map(item => `
    <div class="vault-item">
      <div class="vault-item-info">
        <div class="vault-site">🌐 ${item.site}</div>
        <div class="vault-user">👤 ${item.user || 'No username'}</div>
        <div class="vault-pwd">
          🔑 ${item.hidden
            ? '•'.repeat(item.pwd.length)
            : item.pwd}
        </div>
      </div>
      <div class="vault-actions">
        <button class="icon-btn"
          onclick="toggleItemPwd(${item.id})">
          👁️
        </button>
        <button class="icon-btn"
          onclick="copyItemPwd(${item.id})">
          📋
        </button>
        <button class="icon-btn"
          onclick="deleteItem(${item.id})"
          style="border-color:#cc0000;color:#cc0000">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

function toggleItemPwd(id) {
  const item = vaultItems.find(i => i.id === id);
  if (item) {
    item.hidden = !item.hidden;
    renderVault();
  }
}

function copyItemPwd(id) {
  const item = vaultItems.find(i => i.id === id);
  if (item) {
    navigator.clipboard.writeText(item.pwd);
  }
}

function deleteItem(id) {
  vaultItems = vaultItems.filter(i => i.id !== id);
  renderVault();
}

// ==================
// STRENGTH CHECKER
// ==================
function toggleStrengthPwd() {
  const input = document
    .getElementById('strengthPwd');
  input.type = input.type === 'password'
    ? 'text' : 'password';
}

function checkStrength() {
  const pwd = document
    .getElementById('strengthPwd').value;

  if (!pwd) {
    resetStrength();
    return;
  }

  // CHECKS
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
  const isCommon = commonPasswords
    .includes(pwd.toLowerCase());
  const length = pwd.length;

  // SCORE
  let score = 0;
  if (length >= 8) score += 10;
  if (length >= 12) score += 15;
  if (length >= 16) score += 15;
  if (hasUpper) score += 15;
  if (hasLower) score += 15;
  if (hasNumber) score += 15;
  if (hasSymbol) score += 20;
  if (isCommon) score = Math.min(score, 20);
  score = Math.min(score, 100);

  // CRACK TIME
  const crackTime = estimateCrackTime(
    pwd, hasUpper, hasLower,
    hasNumber, hasSymbol
  );

  // UPDATE UI
  updateStrengthBar(score);
  updateReportCards(
    length, hasUpper, hasLower,
    hasNumber, hasSymbol,
    crackTime, isCommon, score
  );

  // AI ANALYSIS (debounced)
  clearTimeout(window.aiTimer);
  window.aiTimer = setTimeout(() => {
    getAIAnalysis(pwd, score, crackTime);
  }, 1000);
}

function estimateCrackTime(
  pwd, hasUpper, hasLower,
  hasNumber, hasSymbol
) {
  let charSet = 0;
  if (hasLower) charSet += 26;
  if (hasUpper) charSet += 26;
  if (hasNumber) charSet += 10;
  if (hasSymbol) charSet += 32;
  if (charSet === 0) charSet = 26;

  const combinations = Math.pow(charSet, pwd.length);
  const guessesPerSecond = 1e10;
  const seconds = combinations / guessesPerSecond;

  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds/60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds/3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds/86400)} days`;
  if (seconds < 3153600000) return `${Math.round(seconds/31536000)} years`;
  return `${(seconds/3153600000).toExponential(1)} centuries`;
}

function updateStrengthBar(score) {
  const fill = document
    .getElementById('strengthFill');
  const label = document
    .getElementById('strengthLabel');

  fill.style.width = score + '%';

  if (score >= 80) {
    fill.style.background = '#00ff41';
    label.textContent = 'STRONG';
    label.style.color = '#00ff41';
  } else if (score >= 60) {
    fill.style.background = '#cccc00';
    label.textContent = 'MODERATE';
    label.style.color = '#cccc00';
  } else if (score >= 40) {
    fill.style.background = '#cc6600';
    label.textContent = 'WEAK';
    label.style.color = '#cc6600';
  } else {
    fill.style.background = '#cc0000';
    label.textContent = 'VERY WEAK';
    label.style.color = '#cc0000';
  }
}

function updateReportCards(
  length, hasUpper, hasLower,
  hasNumber, hasSymbol,
  crackTime, isCommon, score
) {
  setCard('reportLength',
    `Length: ${length} chars`,
    length >= 12);
  setCard('reportUpper',
    `Uppercase: ${hasUpper ? '✅ Yes' : '❌ No'}`,
    hasUpper);
  setCard('reportLower',
    `Lowercase: ${hasLower ? '✅ Yes' : '❌ No'}`,
    hasLower);
  setCard('reportNumbers',
    `Numbers: ${hasNumber ? '✅ Yes' : '❌ No'}`,
    hasNumber);
  setCard('reportSymbols',
    `Symbols: ${hasSymbol ? '✅ Yes' : '❌ No'}`,
    hasSymbol);
  setCard('reportCrack',
    `Crack Time: ${crackTime}`,
    crackTime !== 'Instantly' &&
    !crackTime.includes('seconds'));
  setCard('reportCommon',
    `Common Password: ${isCommon ? '❌ YES' : '✅ No'}`,
    !isCommon);
  setCard('reportScore',
    `Security Score: ${score}/100`,
    score >= 60);
}

function setCard(id, text, pass) {
  const card = document.getElementById(id);
  card.querySelector('.report-text')
    .textContent = text;
  card.className = 'report-card ' +
    (pass ? 'pass' : 'fail');
}

function resetStrength() {
  document.getElementById('strengthFill')
    .style.width = '0%';
  document.getElementById('strengthLabel')
    .textContent = '—';
  document.querySelectorAll('.report-text')
    .forEach(el => el.textContent = '—');
  document.querySelectorAll('.report-card')
    .forEach(el => el.className = 'report-card');
  document.getElementById('aiText')
    .textContent = 'Enter a password to get AI analysis...';
}

async function getAIAnalysis(pwd, score, crackTime) {
  document.getElementById('aiText')
    .textContent = '🤖 Analyzing...';

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + GROQ_API_KEY
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 200,
          messages: [{
            role: 'user',
            content: `Analyze this password security:
Password length: ${pwd.length} characters
Security score: ${score}/100
Estimated crack time: ${crackTime}

Give a 2-3 sentence security analysis.
Be direct and helpful.
Don't show the actual password.
Suggest one specific improvement if needed.`
          }]
        })
      }
    );

    const data = await response.json();
    document.getElementById('aiText')
      .textContent = data.choices[0]
        .message.content;

  } catch (error) {
    document.getElementById('aiText')
      .textContent = 'AI analysis unavailable.';
  }
}