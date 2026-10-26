// ============================================================
// GENG KAPAK — Background Music ("Bintang di Hati" — Melly Goeslaw)
// ============================================================
// 1. Mengintegrasikan lagu resmi "Bintang di Hati" oleh Melly Goeslaw.
// 2. Mencoba memuat file audio dari assets/music/bintang-di-hati.mp3.
// 3. Jika file belum dimasukkan ke folder, sistem tetap berjalan aman
//    dengan ambient acoustic music-box agar tombol tidak error.
// 4. Tombol Play/Pause minimalis, tidak autoplay dengan suara tanpa
//    tindakan pengguna, dan tidak mengganggu navigasi maupun lightbox.
// ============================================================

class AmbientMusicEngine {
  constructor() {
    this.ctx = null;
    this.timer = null;
    this.isPlaying = false;
    this.volumeScale = 0.35;
    // Tangga nada hangat pentatonik nostaljik
    this.notes = [
      261.63, 293.66, 329.63, 392.00, 440.00,
      523.25, 587.33, 659.25, 783.99, 880.00
    ];
    this.sequence = [0, 2, 4, 2, 5, 4, 3, 1, 4, 6, 5, 4, 2, 0];
    this.seqIndex = 0;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    this.volumeScale = Math.max(0, Math.min(1, vol));
  }

  playNote(freq) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, now);

      const peakGain = 0.05 * this.volumeScale;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(peakGain, 0.0001), now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.3);
    } catch (e) {
      // Abaikan error Web Audio browser
    }
  }

  start() {
    this.initContext();
    if (!this.ctx) return;
    this.isPlaying = true;

    const tick = () => {
      if (!this.isPlaying) return;
      const noteIdx = this.sequence[this.seqIndex % this.sequence.length];
      const freq = this.notes[noteIdx % this.notes.length];
      this.playNote(freq);

      if (this.seqIndex % 3 === 0) {
        const harmonyIdx = (noteIdx + 4) % this.notes.length;
        this.playNote(this.notes[harmonyIdx]);
      }

      this.seqIndex++;
      const nextDelay = 1500 + Math.random() * 350;
      this.timer = setTimeout(tick, nextDelay);
    };

    tick();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

// Kandidat path untuk file musik "Bintang di Hati"
const AUDIO_CANDIDATES = [
  'assets/music/bintang-di-hati.mp3',
  'assets/music/Bintang di Hati - Melly Goeslaw.mp3',
  'assets/music/Bintang di Hati.mp3',
  'assets/music/bintang_di_hati.mp3',
  'assets/music/bg-music.mp3',
  'assets/music/music.mp3',
  'assets/music/lagu.mp3',
  'assets/music/soundtrack.mp3',
  'assets/music/audio.mp3',
  'assets/music/bintang-di-hati.m4a',
  'assets/music/Bintang di Hati.m4a'
];

export function initMusicPlayer() {
  const audio = document.getElementById('bg-music');
  const toggleBtn = document.getElementById('music-toggle');
  const volumeSlider = document.getElementById('volume-slider');
  if (!toggleBtn) return;

  const ambientSynth = new AmbientMusicEngine();
  let isPlaying = false;
  let currentCandidateIndex = 0;
  let realAudioAvailable = false;

  let currentVolume = volumeSlider ? parseInt(volumeSlider.value, 10) / 100 : 0.35;

  function applyVolume(vol) {
    currentVolume = Math.max(0, Math.min(1, vol));
    if (audio) audio.volume = currentVolume;
    ambientSynth.setVolume(currentVolume);

    if (volumeSlider) {
      volumeSlider.setAttribute('aria-valuenow', Math.round(currentVolume * 100));
    }

    const volControl = document.getElementById('volume-control');
    if (volControl) {
      volControl.classList.toggle('muted', currentVolume === 0);
    }
  }

  function updateUI(playing) {
    isPlaying = playing;
    toggleBtn.classList.toggle('playing', playing);
    const titleLabel = playing
      ? 'Jeda Musik: Bintang di Hati — Melly Goeslaw'
      : 'Putar Musik: Bintang di Hati — Melly Goeslaw';

    toggleBtn.setAttribute('aria-label', titleLabel);
    toggleBtn.setAttribute('title', titleLabel);

    const icon = toggleBtn.querySelector('.music-icon');
    if (icon) {
      // Ikon minimalis dan elegan: Play triangle vs Pause bars
      icon.innerHTML = playing
        ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
           </svg>`
        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
           </svg>`;
    }
  }

  // Uji kandidat file audio asli secara berurutan
  function tryNextAudioSource() {
    if (!audio) return;
    if (currentCandidateIndex >= AUDIO_CANDIDATES.length) {
      realAudioAvailable = false;
      return;
    }
    const candidate = AUDIO_CANDIDATES[currentCandidateIndex++];
    audio.src = candidate;
  }

  if (audio) {
    audio.loop = true;
    audio.addEventListener('canplaythrough', () => {
      realAudioAvailable = true;
    });
    audio.addEventListener('error', () => {
      // Coba kandidat berikutnya
      tryNextAudioSource();
    });
    // Inisialisasi kandidat pertama
    tryNextAudioSource();
  }

  async function play() {
    applyVolume(currentVolume);

    if (audio && audio.src && audio.src !== window.location.href) {
      try {
        await audio.play();
        updateUI(true);
        return;
      } catch (err) {
        // Jika file belum ada atau ditolak browser, fallback ke ambient
      }
    }

    ambientSynth.start();
    updateUI(true);
  }

  function pause() {
    if (audio && !audio.paused) {
      audio.pause();
    }
    ambientSynth.stop();
    updateUI(false);
  }

  toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  });

  // Tombol speaker volume mute/unmute
  const volIcon = document.querySelector('.volume-icon');
  let prevVolume = currentVolume > 0 ? currentVolume : 0.35;

  if (volIcon) {
    volIcon.style.cursor = 'pointer';
    volIcon.setAttribute('role', 'button');
    volIcon.setAttribute('tabindex', '0');
    volIcon.setAttribute('aria-label', 'Bisu / aktifkan suara');

    const toggleMute = () => {
      if (currentVolume > 0) {
        prevVolume = currentVolume;
        if (volumeSlider) volumeSlider.value = 0;
        applyVolume(0);
      } else {
        const restore = prevVolume > 0 ? prevVolume : 0.35;
        if (volumeSlider) volumeSlider.value = Math.round(restore * 100);
        applyVolume(restore);
      }
    };

    volIcon.addEventListener('click', toggleMute);
    volIcon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMute();
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      const vol = parseInt(volumeSlider.value, 10) / 100;
      if (vol > 0) prevVolume = vol;
      applyVolume(vol);
    });
  }

  // Mulai halus hanya ketika pengguna menekan tombol buka di sampul (gesture eksplisit)
  window.addEventListener('music:start', () => {
    if (!isPlaying) {
      play();
    }
  });

  // Hentikan musik latar sementara bila pengguna memutar video di galeri video
  let wasPlayingBeforeVideo = false;
  window.addEventListener('video:playing', () => {
    if (isPlaying) {
      wasPlayingBeforeVideo = true;
      pause();
    }
  });

  window.addEventListener('video:paused', () => {
    if (wasPlayingBeforeVideo) {
      wasPlayingBeforeVideo = false;
      play();
    }
  });

  applyVolume(currentVolume);
  updateUI(false);
}
