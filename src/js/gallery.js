// ============================================================
// GENG KAPAK — Editorial Photo & Documentation Gallery
// ============================================================
// Gaya: Editorial Photography & Memory Journal minimalis.
// - Menata foto kurasi perjalanan dan dokumentasi dengan rapi.
// - Mempertahankan rasio alami foto agar tidak terpotong.
// - Menyediakan filter kategori: Semua, Braga, Kampus, Momen, Dokumentasi.
// - Terhubung ke Lightbox layar penuh dengan navigasi keyboard & swipe.
// ============================================================

import { photos } from '../data/photos.js';
import { setupImageWithFallback } from './opening.js';

let activeCategory = 'all';
let currentLightboxList = [];
let currentLightboxIndex = 0;
let previousActiveElement = null;

/**
 * Filter foto sesuai kategori aktif
 */
export function getFilteredPhotos() {
  if (activeCategory === 'all') return photos;
  return photos.filter(p => p.category === activeCategory);
}

/**
 * Membuat kartu foto scrapbook estetik.
 * Foto tampil utuh dan berada tepat di tengah dengan object-fit contain.
 */
export function createPhotoCard(photo, index, options = {}) {
  const card = document.createElement('article');
  card.className = `editorial-photo-card is-${photo.aspect || 'portrait'} fade-in-up in-view`;
  card.setAttribute('role', 'listitem');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `${photo.shortNote || photo.title || 'Foto kenangan'}`);
  card.style.animationDelay = `${(index % 12) * 0.03}s`;

  card.dataset.id = photo.id;
  card.__photoObj = photo;

  card.innerHTML = `
    <div class="epc-frame">
      <div class="epc-img-box">
        <img
          class="epc-img"
          src="${photo.src}"
          alt="${photo.title || 'Foto Geng Kapak'}"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  `;

  // Fallback handler: jika foto tidak ada, hapus kartu
  const imgEl = card.querySelector('.epc-img');

  if (imgEl) {
    setupImageWithFallback(
      imgEl,
      photo,
      (resolvedSrc) => {
        photo.resolvedSrc = resolvedSrc;
        card.classList.add('has-photo');
        imgEl.style.display = '';
      },
      () => {
        if (imgEl.complete && imgEl.naturalWidth > 0) {
          card.classList.add('has-photo');
        } else {
          card.remove();
        }
      }
    );

    imgEl.addEventListener('error', () => {
      card.remove();
    });
  }

  // Interaktivitas klik & keyboard untuk Lightbox
  const onActivate = () => {
    const list = options.customList || getFilteredPhotos();
    const idx = list.findIndex(p => p.id === photo.id);
    openLightbox(list, idx !== -1 ? idx : index, card);
  };

  card.addEventListener('click', onActivate);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate();
    }
  });

  return card;
}

/**
 * Render grid galeri foto
 */
export function renderGalleryGrid() {
  const container = document.getElementById('memory-grid');
  if (!container) return;

  container.innerHTML = '';
  const filtered = getFilteredPhotos();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="gallery-empty-state">
        <p>Belum ada foto dalam kategori ini.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((photo, idx) => {
    container.appendChild(createPhotoCard(photo, idx, { customList: filtered }));
  });
}

/**
 * Inisialisasi Galeri & Kategori
 */
export function initGallery() {
  renderGalleryGrid();

  // Filter tabs
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeCategory = btn.dataset.category || 'all';
      renderGalleryGrid();
    });
  });
}

// ── Lightbox System ──────────────────────────────────────────────────────────
export function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  const closeBtn = lb.querySelector('.lb-close');
  const prevBtn = lb.querySelector('.lb-prev');
  const nextBtn = lb.querySelector('.lb-next');

  closeBtn?.addEventListener('click', closeLightbox);

  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.classList.contains('lb-backdrop')) {
      closeLightbox();
    }
  });

  prevBtn?.addEventListener('click', () => navigateLightbox(-1));
  nextBtn?.addEventListener('click', () => navigateLightbox(1));

  // Navigasi Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // Touch Swipe Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lb.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lb.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) navigateLightbox(-1);
      else navigateLightbox(1);
    }
  }, { passive: true });
}

export function openLightbox(list, index, triggerEl) {
  const lb = document.getElementById('lightbox');
  if (!lb || !list || list.length === 0) return;

  previousActiveElement = triggerEl || document.activeElement;
  currentLightboxList = list;
  currentLightboxIndex = index >= 0 && index < list.length ? index : 0;

  updateLightboxView();
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Fokus tombol tutup untuk aksesibilitas
  setTimeout(() => {
    lb.querySelector('.lb-close')?.focus();
  }, 100);
}

export function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    previousActiveElement.focus();
  }
}

function navigateLightbox(direction) {
  if (currentLightboxList.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex + direction + currentLightboxList.length) % currentLightboxList.length;
  updateLightboxView();
}

function updateLightboxView() {
  const lb = document.getElementById('lightbox');
  if (!lb || currentLightboxList.length === 0) return;

  const photo = currentLightboxList[currentLightboxIndex];
  if (!photo) return;

  const imgBox = lb.querySelector('.lb-img-box');
  const titleEl = lb.querySelector('.lb-title');
  const captionEl = lb.querySelector('.lb-caption');
  const dateEl = lb.querySelector('.lb-date');
  const counterEl = lb.querySelector('.lb-counter');

  if (imgBox) {
    imgBox.innerHTML = '';
    const img = document.createElement('img');
    img.className = 'lb-img';
    img.alt = photo.title || 'Foto Kenangan Geng Kapak';

    // Prioritaskan resolvedSrc jika sudah sukses diuji
    img.src = photo.resolvedSrc || photo.src;
    imgBox.appendChild(img);
  }

  if (titleEl) titleEl.textContent = photo.title || 'Foto Kenangan';
  if (captionEl) {
    if (photo.caption) {
      captionEl.textContent = photo.caption;
      captionEl.style.display = 'block';
    } else {
      captionEl.textContent = '';
      captionEl.style.display = 'none';
    }
  }
  if (dateEl) dateEl.textContent = photo.date || '';
  if (counterEl) {
    counterEl.textContent = `${currentLightboxIndex + 1} / ${currentLightboxList.length}`;
  }
}
