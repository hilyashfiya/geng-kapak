// ============================================================
// GENG KAPAK — Video Memories (Cinematic Film Reel Archive)
// ============================================================
// Fix v2: Perbaikan URL encoding, lazy-load, dan mobile playback.
// ============================================================

import { videoList } from '../data/videos.js';

/** Encode hanya nama file, bukan seluruh path */
function encodePath(rawPath) {
  return rawPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

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

  // IntersectionObserver: lazy-load video saat mendekati viewport
  const videoObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const videoEl = card.querySelector('video');
          const rawSrc = videoEl && videoEl.dataset.src;
          if (videoEl && rawSrc && !videoEl.dataset.loaded) {
            videoEl.dataset.loaded = '1';
            videoEl.src = encodePath(rawSrc);
            videoEl.load();
          }
          observer.unobserve(card);
        }
      });
    },
    { rootMargin: '500px 0px', threshold: 0.01 }
  );

  videoList.forEach((video, idx) => {
    const card = document.createElement('article');
    card.className = 'video-card fade-in-up in-view';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Cuplikan Video Kenangan #${idx + 1}`);
    card.style.animationDelay = `${(idx % 6) * 0.05}s`;

    // Path asli tanpa encoding — encoding dilakukan saat assign ke src
    const rawSrc = `assets/photos/Vidio/${video.filename}`;

    card.innerHTML = `
      <div class="video-player-wrap">
        <!-- Film Sprockets Top -->
        <div class="film-sprockets top" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>

        <video
          class="memory-video"
          data-src="${rawSrc.replace(/"/g, '&quot;')}"
          playsinline
          webkit-playsinline
          muted
          preload="none"
          aria-label="Video Kenangan"
        ></video>

        <!-- Cinematic Play Overlay -->
        <div class="video-play-overlay">
          <!-- Retro Camcorder REC Badge -->
          <div class="cam-rec-badge" aria-hidden="true">
            <span class="rec-dot"></span>
            <span class="rec-text">REC</span>
          </div>

          <!-- Golden Glassmorphism Play Button -->
          <button class="cine-play-btn" type="button" aria-label="Putar Video">
            <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 3 20 12 6 21 6 3"></polygon>
            </svg>
          </button>
        </div>

        <!-- Film Sprockets Bottom -->
        <div class="film-sprockets bottom" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
    `;

    const videoEl = card.querySelector('video');
    const overlay = card.querySelector('.video-play-overlay');

    // 6 video teratas: langsung load agar thumbnail frame muncul
    if (idx < 6 && videoEl) {
      videoEl.dataset.loaded = '1';
      videoEl.src = encodePath(rawSrc);
      videoEl.preload = 'metadata';
      videoEl.load();
    }

    const startPlayback = () => {
      // Pause semua video lain
      document.querySelectorAll('.memory-video').forEach((v) => {
        if (v !== videoEl && !v.paused) {
          v.pause();
        }
      });

      // Pastikan src sudah diset (untuk video yang belum lazy-load)
      if (!videoEl.src || videoEl.src === window.location.href) {
        videoEl.dataset.loaded = '1';
        videoEl.src = encodePath(rawSrc);
        videoEl.preload = 'metadata';
        videoEl.load();
      }

      card.classList.add('is-playing');
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';

      // Unmute dan tampilkan kontrol
      videoEl.muted = false;
      videoEl.controls = true;

      const tryPlay = () => {
        const promise = videoEl.play();
        if (promise !== undefined) {
          promise.catch(() => {
            // Browser blokir autoplay dengan suara → fallback muted
            videoEl.muted = true;
            videoEl.play().catch(() => {});
          });
        }
      };

      // Jika metadata belum dimuat, tunggu dulu
      if (videoEl.readyState < 1) {
        videoEl.addEventListener('loadedmetadata', tryPlay, { once: true });
      } else {
        tryPlay();
      }
    };

    // Klik overlay → putar
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      startPlayback();
    });

    // Keyboard
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startPlayback();
      }
    });

    if (videoEl) {
      videoEl.addEventListener('play', () => {
        card.classList.add('is-playing');
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';

        document.querySelectorAll('.memory-video').forEach((v) => {
          if (v !== videoEl && !v.paused) v.pause();
        });
        window.dispatchEvent(new CustomEvent('video:playing'));
      });

      videoEl.addEventListener('pause', () => {
        card.classList.remove('is-playing');
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = '';

        const anyPlaying = Array.from(document.querySelectorAll('.memory-video')).some(
          (v) => !v.paused
        );
        if (!anyPlaying) {
          window.dispatchEvent(new CustomEvent('video:paused'));
        }
      });

      videoEl.addEventListener('ended', () => {
        card.classList.remove('is-playing');
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = '';
        videoEl.controls = false;
        window.dispatchEvent(new CustomEvent('video:paused'));
      });
    }

    videoObserver.observe(card);
    container.appendChild(card);
  });
}
