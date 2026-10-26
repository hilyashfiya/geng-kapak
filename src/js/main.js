import { initOpening, setupImageWithFallback, initPhotoAutoWatcher } from './opening.js?v=20';
import { initGallery, initLightbox } from './gallery.js?v=20';
import { initLetters } from './letters.js?v=20';
import { initMusicPlayer } from './music.js?v=20';
import { initVideoGallery } from './video.js?v=20';

document.addEventListener('DOMContentLoaded', () => {
  initOpening();
  initGallery();
  initLightbox();
  initVideoGallery();
  initLetters();
  initMusicPlayer();
  initStoryVisual();
  initPhotoAutoWatcher();
  initScrollAnimations();
  initNavigation();
  initEasterEgg();
  logPhotoGuide();
});

function initStoryVisual() {
  const storyImg = document.querySelector('.spf-photo img');
  const storyFrame = document.querySelector('.story-polaroid-frame');
  if (storyImg && storyFrame) {
    const originalSrc = storyImg.getAttribute('src') || 'assets/photos/pmb.jpeg';
    setupImageWithFallback(
      storyImg,
      {
        id: 'pmb-1',
        title: 'Awal Mula PMB',
        src: originalSrc
      },
      () => {
        storyFrame.classList.add('has-photo');
        storyFrame.classList.remove('fallback-mode');
        storyImg.style.display = '';
      },
      () => {
        // Sesuai instruksi user: foto kalau tidak ada, hapus framenya
        if (!storyImg.complete || storyImg.naturalWidth === 0) {
          storyFrame.remove();
        }
      }
    );

    storyImg.addEventListener('error', () => {
      storyFrame.remove();
    });
  }
}

function logPhotoGuide() {
  try {
    console.groupCollapsed('%c📸 Geng Kapak — Sistem Auto-Foto Aktif', 'color:#C2A878;font-size:13px;font-weight:bold;');
    console.log('%cKamu cukup memasukkan foto ke folder "assets/photos/" sesuai judul frame (format .jpg, .jpeg, .png, .webp). Website akan otomatis mendeteksi tanpa perlu ubah kode!', 'color:#8A9E7E;font-size:12px;');
    console.table([
      { 'Judul Frame di Web': 'Selasar FPIPS', 'Contoh Nama File': 'Selasar FPIPS.jpg / selasar-fpips.jpg' },
      { 'Judul Frame di Web': 'Garnadi Days', 'Contoh Nama File': 'Garnadi Days.jpg / garnadi-days.jpg' },
      { 'Judul Frame di Web': 'Jalan Menuju Gerlong', 'Contoh Nama File': 'Jalan Menuju Gerlong.jpg / gerlong.jpg' },
      { 'Judul Frame di Web': 'Braga Diaries — Berlima', 'Contoh Nama File': 'Braga Diaries — Berlima.jpg / braga-1.jpg' },
      { 'Judul Frame di Web': 'Sudut Jalan Braga', 'Contoh Nama File': 'Sudut Jalan Braga.jpg / braga-2.jpg' },
      { 'Judul Frame di Web': 'Candid di Braga', 'Contoh Nama File': 'Candid di Braga.jpg / braga-3.jpg' },
      { 'Judul Frame di Web': 'Awal Mula PMB', 'Contoh Nama File': 'Awal Mula PMB.jpg / pmb.jpg' },
      { 'Judul Frame di Web': 'Movie Night & Nginep', 'Contoh Nama File': 'Movie Night & Nginep.jpg / bioskop.jpg' },
      { 'Judul Frame di Web': 'Basecamp Kos Nass', 'Contoh Nama File': 'Basecamp Kos Nass.jpg / kos-nass.jpg' },
      { 'Judul Frame di Web': 'P2M Bersama', 'Contoh Nama File': 'P2M Bersama.jpg / p2m-bersama.jpg' },
      { 'Judul Frame di Web': 'Di Balik Layar P2M', 'Contoh Nama File': 'Di Balik Layar P2M.jpg / p2m-2.jpg' },
      { 'Judul Frame di Web': 'Birthday Planning Group', 'Contoh Nama File': 'Birthday Planning Group.jpg / surprise-1.jpg' },
      { 'Judul Frame di Web': 'Surprise!', 'Contoh Nama File': 'Surprise.jpg / surprise-2.jpg' },
      { 'Judul Frame di Web': 'Debat Makanan (Spin Dulu)', 'Contoh Nama File': 'Debat Makanan.jpg / spin-dulu.jpg' },
      { 'Judul Frame di Web': 'Galeri Hilya (Komuk Edition)', 'Contoh Nama File': 'Galeri Hilya.jpg / komuk.jpg' },
      { 'Judul Frame di Web': 'Anomali Dresscode', 'Contoh Nama File': 'Anomali Dresscode.jpg / dresscode.jpg' },
      { 'Judul Frame di Web': 'Trend TikTok Sarwendah', 'Contoh Nama File': 'Trend TikTok Sarwendah.jpg / sarwendah.jpg' },
      { 'Judul Frame di Web': 'Nugas di Rumah Uwa', 'Contoh Nama File': 'Nugas di Rumah Uwa.jpg / rumah-uwa.jpg' }
    ]);
    console.groupEnd();
  } catch (e) {}
}

// ── Smooth Scroll Animations (IntersectionObserver) ──────────────────────────
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in').forEach(el => {
      el.classList.add('in-view');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in').forEach(el => {
    observer.observe(el);
  });
}

// ── Navigation, Sticky Header & Scrollspy ─────────────────────────────────────
function initNavigation() {
  const nav = document.getElementById('site-nav');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('#nav-links .nav-link');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const headerOffset = 75;

  let isClickScrolling = false;
  let clickScrollTimer = null;

  // Header scroll appearance
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  function setActiveLink(activeEl) {
    navLinks.forEach(link => {
      if (link === activeEl) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'true');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Smooth scroll links with offset
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();

        // If this link is in navbar, set active immediately
        if (link.classList.contains('nav-link')) {
          isClickScrolling = true;
          setActiveLink(link);
          clearTimeout(clickScrollTimer);
          clickScrollTimer = setTimeout(() => {
            isClickScrolling = false;
          }, 800);
        }

        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  // Mobile navigation drawer toggle
  const navToggle = document.getElementById('nav-menu-toggle');
  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinksContainer.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(a => {
      a.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navLinksContainer.classList.contains('open')) {
        if (!navLinksContainer.contains(e.target) && !navToggle.contains(e.target)) {
          navLinksContainer.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // Scrollspy: update active link based on viewport
  const sectionMap = [
    { id: 'the-five-of-us', navHref: '#the-five-of-us' },
    { id: 'how-it-started', navHref: '#how-it-started' },
    { id: 'memories', navHref: '#memories' },
    { id: 'reflection', navHref: '#reflection' },
    { id: 'private-letters', navHref: '#private-letters' },
    { id: 'final-screen', navHref: '#private-letters' }
  ];

  function updateScrollSpy() {
    if (isClickScrolling) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // At top of page (opening screen), no chapter is active
    if (scrollY < 220) {
      navLinks.forEach(l => {
        l.classList.remove('active');
        l.removeAttribute('aria-current');
      });
      return;
    }

    // At bottom of page, activate Surat Pribadi
    if (scrollY + windowHeight >= docHeight - 60) {
      const lastLink = document.querySelector('#nav-links a[href="#private-letters"]');
      if (lastLink) setActiveLink(lastLink);
      return;
    }

    // Active section detection point (viewport eye line, ~30% down from top)
    const probePoint = scrollY + headerOffset + (windowHeight * 0.3);
    let matchedHref = null;

    for (let i = 0; i < sectionMap.length; i++) {
      const item = sectionMap[i];
      const el = document.getElementById(item.id);
      if (!el) continue;

      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;

      if (probePoint >= top && probePoint < bottom) {
        matchedHref = item.navHref;
        break;
      }
    }

    if (matchedHref) {
      const targetLink = document.querySelector(`#nav-links a[href="${matchedHref}"]`);
      if (targetLink && !targetLink.classList.contains('active')) {
        setActiveLink(targetLink);
      }
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollSpy();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateScrollSpy();
}

// ── Easter Egg: Klik Kapak 5× ───────────────────────────────────────────────
function initEasterEgg() {
  const kapak = document.getElementById('kapak-icon');
  if (!kapak) return;

  let clicks = 0;
  let resetTimer = null;

  const toasts = [
    "1/5... 🪓",
    "2/5... masih penasaran? 🪓",
    "3/5... sedikit lagi! 🪓",
    "4/5... satu klik lagi! 🪓"
  ];

  kapak.addEventListener('click', (e) => {
    e.preventDefault();
    clicks++;

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      clicks = 0;
    }, 4000);

    // Micro rotation
    kapak.classList.remove('kapak-spin');
    void kapak.offsetWidth; // trigger reflow
    kapak.classList.add('kapak-spin');

    if (clicks < 5) {
      showToast(toasts[clicks - 1]);
    } else {
      clicks = 0;
      openEasterEggModal();
    }
  });
}

function showToast(msg) {
  const existing = document.querySelector('.kapak-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'kapak-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 1800);
}

function openEasterEggModal() {
  const existing = document.querySelector('.easter-egg-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'easter-egg-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Pesan Rahasia Geng Kapak');

  overlay.innerHTML = `
    <div class="easter-egg-box">
      <div class="easter-egg-badge">🪓 Pesan Rahasia Terbuka</div>
      <h3 class="easter-egg-title">Untuk Kita Berlima</h3>
      <div class="easter-egg-content">
        <p>kalau kamu nemuin pesan rahasia ini, berarti kamu beneran iseng ngeklik kapak berkali-kali wkwk.</p>
        <p>terima kasih banyak ya udah jadi orang-orang yang bikin masa kuliahku nggak cuma tentang tugas dan capek, tapi juga tentang ketawa sampai perut sakit.</p>
        <p>di tengah padatnya proses magang dan semester akhir ini, jangan lupa kalau kita selalu punya satu sama lain. 🤍</p>
      </div>
      <p class="easter-egg-sign">— hilya 🤍</p>
      <button class="easter-egg-btn" type="button">tutup arsip rahasia</button>
    </div>
  `;

  const closeBtn = overlay.querySelector('.easter-egg-btn');
  const close = () => {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.remove(), 300);
  };

  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('visible'));
}
