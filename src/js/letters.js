// ============================================================
// GENG KAPAK — Private Letters System (Surat Khusus)
// ============================================================
// 1. Amplop bersegel personal tanpa membocorkan tanggal lahir.
// 2. Parser tanggal yang fleksibel (DD/MM/YYYY, DD-MM-YYYY, DD MM YYYY, dll).
// 3. Menampilkan surat seperti kertas surat editorial mewah.
// 4. Integrasi aksi: Salin Surat & Balas langsung via WhatsApp.
// ============================================================

import { letters, letterList } from '../data/letters.js';

let activeLetterId = null;
let previousFocusedElement = null;

export function initLetters() {
  renderEnvelopes();
  initLetterModal();
}

// ── Render Amplop Bersegel ──────────────────────────────────────────────────
export function renderEnvelopes() {
  const container = document.getElementById('envelopes-grid');
  if (!container) return;

  container.innerHTML = '';

  letterList.forEach((letter) => {
    const isUnlocked = isLetterUnlocked(letter.id);
    const card = document.createElement('article');
    card.className = `envelope-card ${isUnlocked ? 'is-unlocked' : ''}`;
    card.dataset.id = letter.id;
    card.style.setProperty('--env-color', letter.envelopeColor);
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Amplop surat khusus untuk ${letter.name}`);

    card.innerHTML = `
      <div class="envelope-wax-seal" style="background:${letter.envelopeColor};">
        <span class="wax-monogram">${letter.sealText || letter.name.substring(0, 2).toUpperCase()}</span>
      </div>
      <div class="envelope-info">
        <span class="envelope-tag">Surat Pribadi</span>
        <h3 class="envelope-name">Untuk ${letter.name}</h3>
        <p class="envelope-fullname">${letter.fullName}</p>
        <p class="envelope-hint">
          ${isUnlocked ? 'Telah terbuka di sesi ini' : 'Disegel khusus · Buka dengan tanggal lahir'}
        </p>
      </div>
      <button class="envelope-open-btn" type="button">
        ${isUnlocked ? 'Baca Kembali Surat' : 'Buka Segel Amplop'}
      </button>
    `;

    const handleOpen = () => openEnvelope(letter.id, card);
    card.addEventListener('click', handleOpen);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });

    container.appendChild(card);
  });
}

function isLetterUnlocked(id) {
  try {
    return sessionStorage.getItem(`gengkapak_unlocked_${id}`) === 'true';
  } catch (e) {
    return false;
  }
}

function setLetterUnlocked(id) {
  try {
    sessionStorage.setItem(`gengkapak_unlocked_${id}`, 'true');
  } catch (e) {}
}

// ── Modal Surat & Pembuka Segel ─────────────────────────────────────────────
function initLetterModal() {
  const modal = document.getElementById('letter-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('modal-close');
  const submitBtn = document.getElementById('unlock-submit');
  const inputEl = document.getElementById('unlock-input');

  closeBtn?.addEventListener('click', closeLetterModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('letter-modal-backdrop')) {
      closeLetterModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLetterModal();
  });

  submitBtn?.addEventListener('click', handleUnlockAttempt);
  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUnlockAttempt();
  });
}

function openEnvelope(letterId, triggerEl) {
  const modal = document.getElementById('letter-modal');
  const letter = letters[letterId];
  if (!modal || !letter) return;

  activeLetterId = letterId;
  previousFocusedElement = triggerEl || document.activeElement;

  const unlockStep = modal.querySelector('#unlock-step');
  const contentStep = modal.querySelector('#letter-content');
  const errorEl = modal.querySelector('#unlock-error');
  const inputEl = modal.querySelector('#unlock-input');
  const forNameEl = modal.querySelector('#unlock-for-name');

  if (forNameEl) forNameEl.textContent = letter.name;
  if (errorEl) errorEl.textContent = '';
  if (inputEl) inputEl.value = '';

  // Jika sudah pernah dibuka di sesi ini, langsung tampilkan surat
  if (isLetterUnlocked(letterId)) {
    unlockStep?.classList.add('hidden');
    contentStep?.classList.remove('hidden');
    renderStationery(letter);
  } else {
    unlockStep?.classList.remove('hidden');
    contentStep?.classList.add('hidden');
    setTimeout(() => inputEl?.focus(), 250);
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

export function closeLetterModal() {
  const modal = document.getElementById('letter-modal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  activeLetterId = null;

  if (previousFocusedElement && typeof previousFocusedElement.focus === 'function') {
    previousFocusedElement.focus();
  }
}

// Parser fleksibel: mendukung 21/09/2004, 21-09-2004, 21 09 2004, 21092004, 8/6/2005
function parseBirthDate(str) {
  if (!str) return null;
  const cleaned = str.trim();

  // Pola dengan pemisah: slash, dash, spasi, titik
  const separatorMatch = cleaned.match(/^(\d{1,2})[\/\-\.\s](\d{1,2})[\/\-\.\s](\d{4})$/);
  if (separatorMatch) {
    return {
      day: parseInt(separatorMatch[1], 10),
      month: parseInt(separatorMatch[2], 10),
      year: parseInt(separatorMatch[3], 10)
    };
  }

  // Pola tanpa pemisah (DDMMYYYY) 8 digit
  const continuousMatch = cleaned.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (continuousMatch) {
    return {
      day: parseInt(continuousMatch[1], 10),
      month: parseInt(continuousMatch[2], 10),
      year: parseInt(continuousMatch[3], 10)
    };
  }

  return null;
}

function handleUnlockAttempt() {
  const inputEl = document.getElementById('unlock-input');
  const errorEl = document.getElementById('unlock-error');
  if (!inputEl || !activeLetterId) return;

  const letter = letters[activeLetterId];
  if (!letter) return;

  const val = inputEl.value;
  const parsed = parseBirthDate(val);

  if (!parsed) {
    showError('Gunakan format DD/MM/YYYY (contoh: 21/09/2004).');
    return;
  }

  const isMatch =
    parsed.day === letter.birthDate.day &&
    parsed.month === letter.birthDate.month &&
    parsed.year === letter.birthDate.year;

  if (isMatch) {
    setLetterUnlocked(letter.id);
    renderEnvelopes(); // Perbarui status amplop di latar

    const modal = document.getElementById('letter-modal');
    const unlockStep = modal?.querySelector('#unlock-step');
    const contentStep = modal?.querySelector('#letter-content');

    if (unlockStep) unlockStep.classList.add('hidden');
    if (contentStep) {
      contentStep.classList.remove('hidden');
      renderStationery(letter);
    }
  } else {
    showError('Tanggal lahir belum sesuai. Coba cek lagi ya! 🤍');
    inputEl.classList.add('shake');
    setTimeout(() => inputEl.classList.remove('shake'), 500);
  }
}

function showError(msg) {
  const errorEl = document.getElementById('unlock-error');
  if (errorEl) errorEl.textContent = msg;
}

function renderStationery(letter) {
  const contentStep = document.getElementById('letter-content');
  if (!contentStep) return;

  const paragraphs = letter.content.split('\n\n').filter(p => p.trim());
  const bodyHtml = paragraphs
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');

  contentStep.innerHTML = `
    <div class="stationery-paper">
      <div class="stationery-seal" style="background:${letter.envelopeColor};">
        <span>${letter.sealText || 'GK'}</span>
      </div>
      <header class="stationery-header">
        <span class="stationery-badge">Surat Pribadi</span>
        <h2 class="stationery-greeting">${letter.greeting || `Untuk ${letter.name},`}</h2>
        <p class="stationery-recipient">${letter.fullName}</p>
      </header>
      <div class="stationery-body">
        ${bodyHtml}
      </div>
      <footer class="stationery-footer">
        <p class="stationery-sig">${letter.signature}</p>
        <div class="stationery-actions">
          <button id="copy-letter-btn" class="stationery-btn secondary" type="button">
            📋 Salin Isi Surat
          </button>
          <button id="reply-letter-btn" class="stationery-btn primary" type="button">
            💬 Balas ke Hilya
          </button>
        </div>
      </footer>
    </div>
  `;

  // Tombol salin pesan
  const copyBtn = contentStep.querySelector('#copy-letter-btn');
  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(letter.content);
      copyBtn.textContent = 'Tersalin ke Clipboard! ✓';
      setTimeout(() => {
        copyBtn.textContent = '📋 Salin Isi Surat';
      }, 2000);
    } catch (e) {
      copyBtn.textContent = 'Gagal menyalin';
    }
  });

  // Tombol balas via WhatsApp langsung ke Hilya
  const replyBtn = contentStep.querySelector('#reply-letter-btn');
  replyBtn?.addEventListener('click', () => {
    const defaultMsg = `Halo Hilya 🤍\n\nIni ${letter.name}, aku udah baca suratmu di Memory Book Geng Kapak...`;
    const waUrl = `https://wa.me/6285222317554?text=${encodeURIComponent(defaultMsg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });
}
