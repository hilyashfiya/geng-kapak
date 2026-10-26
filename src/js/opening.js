// ============================================================
// GENG KAPAK — Opening & Epilogue Portrait System
// ============================================================

import { memberProfiles, photos } from '../data/photos.js';

// Kamus alias nama file otomatis untuk setiap frame di website
export const FRAME_ALIASES = {
  // Bab IV — Braga Diaries
  'braga-1': ['braga-diaries-berlima', 'braga-berlima', 'braga-diaries', 'braga-1', 'braga1', 'braga'],
  'braga-2': ['sudut-jalan-braga', 'jalan-braga', 'sudut-braga', 'braga-2', 'braga2'],
  'braga-3': ['candid-di-braga', 'candid-braga', 'braga-3', 'braga3'],

  // Bab IV — Kampus & Daily
  'kampus-1': ['selasar-fpips', 'selasar', 'fpips', 'kampus-1', 'kampus1'],
  'kampus-2': ['garnadi-days', 'garnadi', 'kampus-2', 'kampus2'],
  'gerlong-1': ['jalan-menuju-gerlong', 'gerlong', 'menuju-gerlong', 'gerlong-1', 'gerlong1'],
  'pmb-1': ['awal-mula-pmb', 'pmb-2023', 'pmb', 'pmb-1', 'pmb1', 'awal-dari-segalanya'],

  // Bab IV — Momen Spesial
  'bioskop-1': ['movie-night-nginep', 'movie-night', 'bioskop', 'bioskop-1', 'bioskop1'],
  'nginep-1': ['basecamp-kos-nass', 'kos-nass', 'kos-nazwa', 'basecamp', 'nginep-1', 'nginep1', 'nginep'],
  'p2m-1': ['p2m-bersama', 'p2m-1', 'p2m1', 'p2m'],
  'p2m-2': ['di-balik-layar-p2m', 'balik-layar-p2m', 'p2m-2', 'p2m2'],
  'surprise-1': ['birthday-planning-group', 'planning-group', 'bday-rush', 'surprise-1', 'surprise1'],
  'surprise-2': ['surprise', 'tradisi-ulang-tahun', 'celebrate', 'surprise-2', 'surprise2'],

  // Bab IV — Arsip Random
  'random-1': ['debat-makanan-spin-dulu', 'debat-makanan', 'spin-dulu', 'spin', 'random-1', 'random1'],
  'random-2': ['galeri-hilya-komuk-edition', 'galeri-hilya', 'komuk-edition', 'komuk', 'random-2', 'random2'],

  // Bab VI — Candaan Internal (Chaos Scrapbook)
  'chaos-1': ['anomali-dresscode', 'dresscode', 'anomali', 'chaos-1', 'chaos1'],
  'chaos-2': ['trend-tiktok-sarwendah', 'sarwendah', 'tiktok-sarwendah', 'trend-tiktok', 'chaos-2', 'chaos2'],
  'chaos-3': ['nugas-di-rumah-uwa', 'rumah-uwa', 'nugas-uwa', 'chaos-3', 'chaos3'],

  // Anggota (Bab I, Sampul, & Epilog)
  'hilya': ['member-aku', 'member-hilya', 'hilya', 'aku'],
  'uswa': ['member-uwa', 'member-uswa', 'uwa', 'uswa', 'uswatun-hasanah'],
  'salwa': ['member-umi', 'member-salwa', 'umi', 'salwa', 'salwa-izdihar-jinan'],
  'tyan': ['member-tyan', 'tyan', 'destyani', 'destyani-dwi-nur-haliza'],
  'nazwa': ['member-nass', 'member-nazwa', 'nass', 'nazwa', 'rd-nazwa-ghaitsa-yosefa']
};

function addTitleVariations(str, set) {
  if (!str) return;
  const raw = String(str).trim();
  if (!raw) return;

  set.add(raw);

  // 1. Normalisasi em-dash & en-dash
  const normalizedDash = raw.replace(/[—–]/g, '-');
  set.add(normalizedDash);

  // 2. Tanpa tanda baca
  const cleanPunct = normalizedDash.replace(/[!?()[\]{}'"]/g, '').trim();
  set.add(cleanPunct);

  // 3. Kebab-case (huruf kecil strip)
  const slug = cleanPunct
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (slug) set.add(slug);

  // 4. Snake_case (underscore)
  if (slug) set.add(slug.replace(/-/g, '_'));

  // 5. Huruf kecil dengan spasi
  if (slug) set.add(slug.replace(/-/g, ' '));

  // 6. Jika ada kurung, ambil teks sebelum tanda kurung
  const matchParen = raw.match(/^(.*?)\s*\(.*?\)/);
  if (matchParen && matchParen[1].trim()) {
    const beforeParen = matchParen[1].trim();
    set.add(beforeParen);
    const parenSlug = beforeParen.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (parenSlug) set.add(parenSlug);
  }

  // 7. Jika ada dash pemisah (misal "Braga Diaries - Berlima")
  if (normalizedDash.includes('-')) {
    normalizedDash.split('-').forEach((part) => {
      const p = part.trim();
      if (p.length > 3) {
        set.add(p);
        const pSlug = p.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        if (pSlug) set.add(pSlug);
      }
    });
  }
}

export function getFrameTokens(item) {
  const tokens = new Set();
  if (!item) return [];

  let targetObj = typeof item === 'object' ? item : null;
  const rawStr = typeof item === 'string' ? item : null;

  // Jika item adalah string, coba cari padanan objeknya di data foto/member
  if (rawStr) {
    const cleanStr = rawStr.replace(/\.[a-zA-Z0-9]+$/, '');
    const filename = cleanStr.split('/').pop();
    tokens.add(filename);
    addTitleVariations(filename, tokens);

    // Cari di data foto
    const allPhotos = [...(photos || [])];
    const matchedPhoto = allPhotos.find(
      (p) => p.id === filename || (p.src && p.src.includes(filename))
    );
    if (matchedPhoto) {
      targetObj = matchedPhoto;
    }

    // Cari di data member
    if (memberProfiles) {
      const matchedMember = Object.values(memberProfiles).find(
        (m) => m.id === filename || (m.photo && m.photo.includes(filename))
      );
      if (matchedMember) {
        targetObj = matchedMember;
      }
    }
  }

  if (targetObj) {
    if (targetObj.title) {
      addTitleVariations(targetObj.title, tokens);
    }

    if (targetObj.name) {
      addTitleVariations(targetObj.name, tokens);
    }

    if (targetObj.fullName) {
      addTitleVariations(targetObj.fullName, tokens);
    }

    if (targetObj.id) {
      tokens.add(targetObj.id);
      tokens.add(targetObj.id.replace(/-/g, ''));
      tokens.add(targetObj.id.replace(/-/g, '_'));
      if (FRAME_ALIASES[targetObj.id]) {
        FRAME_ALIASES[targetObj.id].forEach((a) => tokens.add(a));
      }
    }

    if (targetObj.src) {
      const srcName = targetObj.src.replace(/\.[a-zA-Z0-9]+$/, '').split('/').pop();
      if (srcName) tokens.add(srcName);
    }

    if (targetObj.photo) {
      const photoName = targetObj.photo.replace(/\.[a-zA-Z0-9]+$/, '').split('/').pop();
      if (photoName) tokens.add(photoName);
    }

    if (targetObj.filmStamp && targetObj.filmStamp.length > 2) {
      addTitleVariations(targetObj.filmStamp, tokens);
    }
  }

  return Array.from(tokens);
}

export function buildCandidateUrls(target) {
  const tokens = getFrameTokens(target);
  const extensions = ['.jpeg', '.jpg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'];
  const folders = [
    'assets/photos/',
    'assets/photos/dokumentasi/',
    'assets/dokumentasi/',
    'assets/'
  ];

  const urlList = [];

  // 1. Coba path src / photo langsung jika ada
  const directPath = (target && (target.src || target.photo)) || (typeof target === 'string' ? target : null);
  if (directPath) {
    urlList.push(directPath);
    const baseSrc = directPath.replace(/\.[a-zA-Z0-9]+$/, '');
    extensions.forEach((ext) => urlList.push(`${baseSrc}${ext}`));
  }

  // 2. Coba setiap token di folder assets/photos/ dan assets/
  folders.forEach((folder) => {
    tokens.forEach((tok) => {
      extensions.forEach((ext) => {
        urlList.push(`${folder}${tok}${ext}`);
      });
    });
  });

  return [...new Set(urlList)];
}

// Utilitas cerdas: Uji muat kandidat URL tanpa merusak DOM sebelum sukses
export function setupImageWithFallback(imgElement, targetConfig, onLoaded, onFailed) {
  if (!targetConfig) {
    if (onFailed) onFailed();
    return;
  }

  const candidateUrls = buildCandidateUrls(targetConfig);
  let currentIndex = 0;
  let isDone = false;

  function tryNext() {
    if (isDone) return;
    if (currentIndex >= candidateUrls.length) {
      isDone = true;
      if (onFailed) onFailed();
      return;
    }

    const currentUrl = candidateUrls[currentIndex++];
    const testImg = new Image();

    testImg.onload = () => {
      if (isDone) return;
      isDone = true;
      imgElement.src = currentUrl;
      if (onLoaded) onLoaded(currentUrl);
    };

    testImg.onerror = () => {
      if (!isDone) {
        tryNext();
      }
    };

    testImg.src = currentUrl;
  }

  tryNext();
}

export function initOpening() {
  const ctaBtn = document.getElementById('cta-enter');

  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      const nextSection = document.getElementById('the-five-of-us');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
      // Mulai musik secara halus lewat user gesture
      window.dispatchEvent(new CustomEvent('music:start'));
    });
  }

  renderOpeningMemberPolaroids();
  renderTheFiveOfUsCards();
  renderStorytellerAvatar();
  renderFinalScreenPolaroids();
}

// Render mini polaroid 5 sahabat di opening screen
function renderOpeningMemberPolaroids() {
  const container = document.getElementById('opening-members-row');
  if (!container) return;

  container.innerHTML = '';
  const profiles = Object.values(memberProfiles);
  const tilts = [-4, 3, -2, 4, -3];

  profiles.forEach((member, i) => {
    const card = document.createElement('div');
    card.className = 'op-member-polaroid';
    card.dataset.id = member.id;
    card.style.setProperty('--rot', `${tilts[i % tilts.length]}deg`);

    card.innerHTML = `
      <div class="op-photo-box" style="--tint:${member.placeholder};">
        <img class="op-photo-img" src="" alt="${member.name}" loading="eager" />
        <div class="op-photo-fallback" aria-hidden="true">
          <span class="op-fallback-initial">${member.initial}</span>
        </div>
      </div>
      <p class="op-member-name">${member.name}</p>
    `;

    const img = card.querySelector('.op-photo-img');
    if (img) {
      setupImageWithFallback(
        img,
        member,
        () => card.classList.add('has-photo'),
        () => {
          img.style.display = 'none';
          card.classList.add('fallback-mode');
        }
      );
    }

    container.appendChild(card);
  });
}

// Render avatar Hilya di Catatan Hilya (Bab I)
function renderStorytellerAvatar() {
  const seal = document.querySelector('.stn-seal');
  if (!seal || !memberProfiles.hilya) return;

  const hilyaProfile = memberProfiles.hilya;
  const avatarImg = document.createElement('img');
  avatarImg.className = 'stn-photo-img';
  avatarImg.alt = 'Hilya';
  avatarImg.loading = 'lazy';

  setupImageWithFallback(
    avatarImg,
    hilyaProfile,
    () => {
      seal.classList.add('has-photo');
      seal.innerHTML = '';
      seal.appendChild(avatarImg);
    },
    () => {
      seal.classList.remove('has-photo');
    }
  );
}

// Render polaroids di final screen
function renderFinalScreenPolaroids() {
  const container = document.getElementById('final-members-row');
  if (!container) return;

  container.innerHTML = '';
  const profiles = Object.values(memberProfiles);
  const tilts = [-3, 2, -2, 3, -1];

  profiles.forEach((member, i) => {
    const card = document.createElement('div');
    card.className = 'final-polaroid';
    card.dataset.id = member.id;
    card.style.setProperty('--rot', `${tilts[i % tilts.length]}deg`);

    card.innerHTML = `
      <div class="fp-photo-box" style="--tint:${member.placeholder};">
        <img class="fp-photo-img" src="" alt="${member.name}" loading="lazy" />
        <div class="fp-photo-fallback" aria-hidden="true">
          <span>${member.initial}</span>
        </div>
      </div>
      <p class="fp-name">${member.name}</p>
    `;

    const img = card.querySelector('.fp-photo-img');
    if (img) {
      setupImageWithFallback(
        img,
        member,
        () => card.classList.add('has-photo'),
        () => {
          img.style.display = 'none';
          card.classList.add('fallback-mode');
        }
      );
    }

    container.appendChild(card);
  });
}

// Render kartu detail di Bab I: The Five of Us (Tentang Kita)
function renderTheFiveOfUsCards() {
  const container = document.getElementById('members-detail-grid');
  if (!container) return;

  container.innerHTML = '';
  const friends = [
    memberProfiles.uswa,
    memberProfiles.salwa,
    memberProfiles.tyan,
    memberProfiles.nazwa
  ];

  friends.forEach((member) => {
    const card = document.createElement('article');
    card.className = 'member-detail-card fade-in-up';
    card.dataset.id = member.id;
    card.setAttribute('role', 'listitem');

    card.innerHTML = `
      <div class="mdc-photo-wrapper" style="--tint:${member.placeholder};">
        <img class="mdc-photo-img" src="" alt="${member.name}" loading="lazy" />
        <div class="mdc-photo-fallback" aria-hidden="true">
          <span class="mdc-initial">${member.initial}</span>
        </div>
      </div>
      <div class="mdc-body">
        <span class="mdc-role">${member.role}</span>
        <h3 class="mdc-name">${member.name}</h3>
        <p class="mdc-fullname">${member.fullName}</p>
        <p class="mdc-desc">${member.desc}</p>
      </div>
    `;

    const img = card.querySelector('.mdc-photo-img');
    if (img) {
      setupImageWithFallback(
        img,
        member,
        () => card.classList.add('has-photo'),
        () => {
          img.style.display = 'none';
          card.classList.add('fallback-mode');
        }
      );
    }

    container.appendChild(card);
  });
}

// Watcher otomatis: Bila user kembali ke browser setelah menambahkan foto ke folder assets, auto-cek ulang
export function initPhotoAutoWatcher() {
  let isScanning = false;

  const rescanMissing = () => {
    if (isScanning) return;
    isScanning = true;

    // 1. Rescan kartu galeri
    document.querySelectorAll('.analog-polaroid.fallback-photo').forEach((card) => {
      const imgEl = card.querySelector('.polaroid-real-img');
      if (card.__photoObj && imgEl) {
        setupImageWithFallback(
          imgEl,
          card.__photoObj,
          (winningUrl) => {
            card.__photoObj.resolvedSrc = winningUrl;
            card.classList.remove('fallback-photo');
            card.classList.add('has-real-photo');
            imgEl.style.display = '';
          }
        );
      }
    });

    // 2. Rescan story polaroid di Bab II
    const storyFrame = document.querySelector('.story-polaroid-frame.fallback-mode');
    if (storyFrame) {
      const storyImg = storyFrame.querySelector('img');
      if (storyImg) {
        setupImageWithFallback(
          storyImg,
          { id: 'pmb-1', title: 'Awal Mula PMB', src: 'assets/photos/pmb-1.jpg' },
          () => {
            storyFrame.classList.remove('fallback-mode');
            storyFrame.classList.add('has-photo');
            storyImg.style.display = '';
          }
        );
      }
    }

    // 3. Rescan foto profil yang belum termuat
    document.querySelectorAll('.op-member-polaroid.fallback-mode, .final-polaroid.fallback-mode, .member-detail-card.fallback-mode').forEach((card) => {
      const id = card.dataset.id;
      const member = memberProfiles[id];
      const img = card.querySelector('img');
      if (member && img) {
        setupImageWithFallback(
          img,
          member,
          () => {
            card.classList.remove('fallback-mode');
            card.classList.add('has-photo');
            img.style.display = '';
          }
        );
      }
    });

    setTimeout(() => {
      isScanning = false;
    }, 800);
  };

  window.addEventListener('focus', rescanMissing);
}
