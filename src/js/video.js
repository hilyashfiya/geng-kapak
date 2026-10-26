// ============================================================
// GENG KAPAK — Video Memories (Cinematic Film Reel Archive)
// ============================================================
// 1. Memuat video dari assets/photos/vidio/ secara lazy-load (IntersectionObserver).
// 2. Sangat stabil di perangkat HP/Mobile (dukungan HTTP 206 Range + muted initial frame preview).
// 3. Estetika 35mm Vintage Film Reel nostalgia dengan tombol play emas glassmorphism.
// 4. Sinkronisasi audio otomatis dengan musik latar.
// 5. Bebas judul, label, atau caption apapun sesuai arahan scrapbook minimalis.
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

  // IntersectionObserver untuk lazy-loading video (mencegah kelebihan beban koneksi & RAM pada HP)
  const videoObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const videoEl = card.querySelector('video');
          if (videoEl && videoEl.dataset.src && !videoEl.src) {
            videoEl.muted = true;
            videoEl.playsInline = true;
            videoEl.src = videoEl.dataset.src + '#t=0.001';
            videoEl.load();
          }
          observer.unobserve(card);
        }
      });
    },
    { rootMargin: '450px 0px', threshold: 0.01 }
  );

  videoList.forEach((video, idx) => {
    const card = document.createElement('article');
    card.className = 'video-card fade-in-up in-view';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Cuplikan Video Kenangan #${idx + 1}`);
    card.style.animationDelay = `${(idx % 6) * 0.05}s`;

    const encodedSrc = `assets/photos/vidio/${encodeURIComponent(video.filename)}`;

    card.innerHTML = `
      <div class="video-player-wrap">
        <!-- Film Sprockets Top -->
        <div class="film-sprockets top" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>

        <video
          class="memory-video"
          data-src="${encodedSrc}"
          playsinline
          webkit-playsinline
          muted
          preload="metadata"
          controlslist="nodownload"
          aria-label="Video Kenangan"
        ></video>

        <!-- Aesthetic Cinematic Play Overlay -->
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

    // 6 video teratas langsung disiapkan sumbernya agar preview frame langsung muncul di HP & desktop
    if (idx < 6 && videoEl) {
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.src = encodedSrc + '#t=0.001';
      videoEl.load();
    }

    const startPlayback = () => {
      // Pause semua video lain yang sedang berputar
      document.querySelectorAll('.memory-video').forEach((v) => {
        if (v !== videoEl && !v.paused) {
          v.pause();
        }
      });

      // Pastikan video src sudah termuat
      if (!videoEl.src && videoEl.dataset.src) {
        videoEl.src = videoEl.dataset.src;
      }

      card.classList.add('is-playing');
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';

      // Aktifkan suara (unmute) dan kontrol pemutaran
      videoEl.muted = false;
      videoEl.controls = true;

      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback with audio blocked, fallback muted:', err);
          videoEl.muted = true;
          videoEl.controls = true;
          videoEl.play();
        });
      }
    };

    // Klik pada overlay / tombol play langsung memutar video
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      startPlayback();
    });

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

        // Pause video lain & pause musik latar
        document.querySelectorAll('.memory-video').forEach((v) => {
          if (v !== videoEl && !v.paused) {
            v.pause();
          }
        });
        window.dispatchEvent(new CustomEvent('video:playing'));
      });

      videoEl.addEventListener('pause', () => {
        card.classList.remove('is-playing');
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = '';

        const anyPlaying = Array.from(document.querySelectorAll('.memory-video')).some(v => !v.paused);
        if (!anyPlaying) {
          window.dispatchEvent(new CustomEvent('video:paused'));
        }
      });

      videoEl.addEventListener('ended', () => {
        card.classList.remove('is-playing');
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = '';
        window.dispatchEvent(new CustomEvent('video:paused'));
      });

      // Fallback jika browser mobile gagal parsing fragment #t=0.001
      videoEl.addEventListener('error', () => {
        if (videoEl.src && videoEl.src.includes('#t=0.001')) {
          videoEl.src = videoEl.dataset.src || encodedSrc;
          videoEl.load();
        }
      });
    }

    videoObserver.observe(card);
    container.appendChild(card);
  });
}
