// ============================================================
//  SAMIRA'S PODCAST — Shared App Logic v2
//  Fixes: petals (no canvas dependency), better player utils
// ============================================================

const STORAGE_KEY = 'samira_podcast_episodes';
const PASS_KEY    = 'samira_admin_pass';
const DEFAULT_PASSWORD = 'teamo123';

const DEFAULT_EPISODES = [
  {
    id: "ep-1",
    title: "El Día que Todo Cambió 🌹",
    src: "audio/1.mp3",
    description: "Nuestra historia desde el 3 de marzo de 2023. Te amo mucho, Ssamira, mi niñita hermosa.",
    emoji: "💖",
    createdAt: "2026-06-22T23:51:53.000Z",
    cachedDuration: ""
  }
];

/* ── Data Layer ──────────────────────────────────────────── */
function getEpisodes() {
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (!local) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EPISODES));
      return DEFAULT_EPISODES;
    }
    const parsed = JSON.parse(local);
    return (Array.isArray(parsed) && parsed.length > 0) ? parsed : DEFAULT_EPISODES;
  }
  catch {
    return DEFAULT_EPISODES;
  }
}
function saveEpisodes(eps) { localStorage.setItem(STORAGE_KEY, JSON.stringify(eps)); }
function addEpisode(ep) {
  const eps = getEpisodes();
  ep.id = Date.now().toString();
  ep.createdAt = new Date().toISOString();
  eps.unshift(ep);
  saveEpisodes(eps);
  return ep;
}
function deleteEpisode(id) { saveEpisodes(getEpisodes().filter(e => e.id !== id)); }
function updateEpisode(id, data) {
  saveEpisodes(getEpisodes().map(e => e.id === id ? { ...e, ...data } : e));
}

/* ── Password ────────────────────────────────────────────── */
function getPassword()      { return localStorage.getItem(PASS_KEY) || DEFAULT_PASSWORD; }
function checkPassword(inp) { return inp === getPassword(); }
function changePassword(np) { localStorage.setItem(PASS_KEY, np); }

/* ── Formatters ──────────────────────────────────────────── */
function formatTime(s) {
  if (isNaN(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2,'0')}`;
}
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── Toast Notifications ─────────────────────────────────── */
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: '💌' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]||'💌'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── Audio Player (Singleton) ────────────────────────────── */
const Player = (() => {
  const audio = new Audio();
  let currentId   = null;
  let cbTime      = null;
  let cbPlay      = null;
  let cbEnded     = null;
  let cbError     = null;

  audio.addEventListener('timeupdate', () => cbTime && cbTime(audio.currentTime, audio.duration));
  audio.addEventListener('play',       () => cbPlay && cbPlay(true));
  audio.addEventListener('pause',      () => cbPlay && cbPlay(false));
  audio.addEventListener('ended',      () => cbEnded && cbEnded());
  audio.addEventListener('error',      () => cbError && cbError(audio.error));

  return {
    get isPlaying()   { return !audio.paused; },
    get currentTime() { return audio.currentTime; },
    get duration()    { return audio.duration; },
    get currentId()   { return currentId; },

    load(episode) {
      if (!episode || !episode.src) {
        showToast('Este episodio no tiene audio asignado aún', 'error');
        return;
      }
      if (currentId === episode.id) {
        audio.paused ? audio.play().catch(()=>{}) : audio.pause();
        return;
      }
      audio.src = episode.src;
      currentId = episode.id;
      audio.load();
      const promise = audio.play();
      if (promise) promise.catch(err => {
        console.warn('Audio play failed:', err);
        showToast('No se pudo reproducir el audio. Verifica que el archivo existe.', 'error');
      });
    },

    toggle() { audio.paused ? audio.play().catch(()=>{}) : audio.pause(); },
    seek(s)  { audio.currentTime = Math.max(0, Math.min(audio.duration||0, s)); },
    seekPercent(p) { if (!isNaN(audio.duration)) audio.currentTime = audio.duration * p; },
    setVolume(v)   { audio.volume = Math.max(0, Math.min(1, v)); },

    onTimeUpdate(fn) { cbTime   = fn; },
    onPlay(fn)       { cbPlay   = fn; },
    onEnded(fn)      { cbEnded  = fn; },
    onError(fn)      { cbError  = fn; },
  };
})();

/* ── Floating Petals (Fixed — no DOM dependency) ─────────── */
function createPetals() {
  const symbols = ['🌸', '🌹', '💗', '✨', '🌺', '💖', '🍀', '💕', '🌷'];
  const count   = window.innerWidth < 600 ? 10 : 18;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className   = 'petal';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left               = `${Math.random() * 100}vw`;
    el.style.animationDuration  = `${14 + Math.random() * 18}s`;
    el.style.animationDelay     = `${Math.random() * 18}s`;
    el.style.fontSize           = `${0.65 + Math.random() * 1.1}rem`;
    el.style.opacity            = '0';
    document.body.appendChild(el);
  }
}

/* Run petals ASAP (no DOMContentLoaded dependency needed) */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createPetals);
} else {
  createPetals();
}

/* ── Dynamic Beating Heart Favicon ────────────────────────── */
function initDynamicFavicon() {
  const favicon = document.getElementById('dynamic-favicon') || (() => {
    const link = document.createElement('link');
    link.id = 'dynamic-favicon';
    link.rel = 'icon';
    document.head.appendChild(link);
    return link;
  })();

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  let frame = 0;
  // Latido "lub-dub" realista: alternamos tamaño y emojis de amor
  const emojis = ['❤️', '💖', '💗', '💖'];
  const scales = [1.0, 1.25, 1.0, 1.15];

  function drawFavicon() {
    ctx.clearRect(0, 0, 32, 32);
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const idx = frame % 4;
    const scale = scales[idx];
    const emoji = emojis[idx];
    
    ctx.save();
    ctx.translate(16, 16);
    ctx.scale(scale, scale);
    ctx.fillText(emoji, 0, 2);
    ctx.restore();

    favicon.href = canvas.toDataURL('image/png');
    frame++;
  }

  // Intervalo de 300ms para simular el latido del corazón
  setInterval(drawFavicon, 300);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDynamicFavicon);
} else {
  initDynamicFavicon();
}
