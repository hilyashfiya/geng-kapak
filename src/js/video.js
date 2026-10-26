// ============================================================
// GENG KAPAK — Video Moments Gallery
// ============================================================
// 1. Memuat video dari assets/photos/vidio/ secara ringkas & responsif.
// 2. Mempertahankan rasio alami video (portrait maupun landscape).
// 3. Kontrol pemutaran bawaan (play, pause, seek, volume, fullscreen).
// 4. Sinkronisasi audio: menghentikan musik latar saat video diputar.
// ============================================================

import { videoList } from '../data/videos.js';

export function initVideoGallery() {
  const container = document.getElementById('video-grid');
  if (!container) return;

  container.innerHTML = '';

  if (!videoList || videoList.length === 0) {
    container.innerHTML = `
      <div class="video-empty-state">
        <p>Belum ada video di folder <code>assets/photos/vidio/</code>.</p>
      </div>
    `;
    return;
  }

  videoList.forEach((video, idx) => {
    const card = document.createElement('article');
    card.className = 'video-card fade-in-up in-view';
    card.setAttribute('role', 'listitem');
    card.style.animationDelay = `${(idx % 8) * 0.05}s`;

    const encodedSrc = `assets/photos/vidio/${encodeURIComponent(video.filename)}`;

    card.innerHTML = `
      <div class="video-player-wrap">
        <video
          class="memory-video"
          src="${encodedSrc}"
          controls
          playsinline
          preload="metadata"
          aria-label="Cuplikan Video #${idx + 1}"
        ></video>
      </div>
    `;


    const videoEl = card.querySelector('video');
    if (videoEl) {
      // Pause video lain & pause background music saat video ini diputar
      videoEl.addEventListener('play', () => {
        document.querySelectorAll('.memory-video').forEach((v) => {
          if (v !== videoEl && !v.paused) {
            v.pause();
          }
        });
        window.dispatchEvent(new CustomEvent('video:playing'));
      });

      videoEl.addEventListener('pause', () => {
        // Cek apakah masih ada video lain yang aktif
        const anyPlaying = Array.from(document.querySelectorAll('.memory-video')).some(v => !v.paused);
        if (!anyPlaying) {
          window.dispatchEvent(new CustomEvent('video:paused'));
        }
      });

      videoEl.addEventListener('ended', () => {
        window.dispatchEvent(new CustomEvent('video:paused'));
      });
    }

    container.appendChild(card);
  });
}
