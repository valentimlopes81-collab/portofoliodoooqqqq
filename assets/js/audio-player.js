/* ============================================================
   DOOOQQQQ — floating MP3 player
   - fixed widget, top-left, on every page
   - expands sideways into a horizontal iOS-style "now playing" bar
     so it never covers the page content underneath it
   - play / pause / prev / next, seek bar, volume, playlist
   - remembers track + position + volume across page navigation
     (via localStorage) so visitors can browse the site while
     listening
   ============================================================

   TO ADD YOUR OWN MUSIC:
   1. Drop your .mp3 files into assets/audio/
   2. Edit the TRACKS array right below — one entry per song:
      { title: "Song name", artist: "Artist", src: "assets/audio/file.mp3", cover: "assets/audio/file.jpg" }
      (cover is optional — leave it out and a music-note icon is shown instead)
   That's it — the player below works with any number of tracks.
*/

/* ------------------------------------------------------------
   PLAYLIST
   Each line is a search string looked up live on the iTunes Search
   API, which returns a legal 30-second preview + cover art — no audio
   files to host. Edit freely: "Artist – Title" matches best, but a
   title alone works too. Results are cached in the browser so the list
   only has to be resolved once.
   ------------------------------------------------------------ */
const QUERIES = [
  '777-666',
  'Never recover Lil Baby Gunna Drake',
  'Nonstop Drake',
  'O QUE FOR PRECISO',
  'Hours in silence',
  'Mile High Memories',
  'made for this shit',
  'só penso em tu garota ga veigh',
  'Mist',
  'Floor Seats A$AP Ferg',
  'Fukk sleep A$AP Rocky',
  'Toxic',
  'Ric flair drip Offset Metro Boomin',
  'Slaughter JHus',
  'Trojan Horse',
  'Odisseia',
  'Yesterday',
  'Fim do Nada',
  'Whisper my Name',
  'Plot Twist',
  'FERIAS',
  'Tic Tac Toe',
  'Questão de Respeito Norty',
  'Milk fakemink',
  'Throw Away Future',
  'Codeine Crazy Future',
  'Talk shit like a preacher',
  'Stick to the Models',
  'Freestyle',
  'Ten',
  'Titanium',
  'Meltdown Travis Scott Drake',
  'Money in the grave Drake',
  'Snow on tha bluff J Cole',
  'Stop trying to be God Travis Scott',
];

const TRACKS = [];

function start() {
  if (!TRACKS.length) return;

  const STORAGE_KEY = 'dq_player_state';

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  }

  function saveState(partial) {
    try {
      const current = loadState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.assign(current, partial)));
    } catch (e) { /* ignore quota / privacy-mode errors */ }
  }

  const state = loadState();
  let index = Number.isInteger(state.index) && TRACKS[state.index] ? state.index : 0;
  let wasPlaying = !!state.playing;
  const startTime = typeof state.time === 'number' ? state.time : 0;
  const startVolume = typeof state.volume === 'number' ? state.volume : 0.7;
  const startMuted = !!state.muted;
  // Default open on first visit — except on small screens, where a wide
  // bar popping open over the header looks cramped before anyone has
  // asked for it. There it starts as just the small icon; a tap still
  // opens it, and once a visitor has explicitly opened or closed it,
  // that choice (state.expanded) is remembered on every screen size.
  const isSmallScreen = window.innerWidth <= 640;
  const startExpanded = typeof state.expanded === 'boolean' ? state.expanded : !isSmallScreen;

  /* ---------------- Build DOM ---------------- */
  const root = document.createElement('div');
  root.className = 'audio-player' + (startExpanded ? ' is-open' : '');
  root.innerHTML = `
    <button class="audio-player__toggle" aria-label="Toggle music player" aria-expanded="${startExpanded}">
      <span class="audio-player__toggle-art">
        <img class="audio-player__toggle-img" alt="" hidden />
        <svg viewBox="0 0 24 24" class="icon-note"><path d="M9 18V5.5a1 1 0 0 1 .8-.98l9-1.8A1 1 0 0 1 20 3.7V16a3 3 0 1 1-2-2.83V6.42l-7 1.4V18a3 3 0 1 1-2 2.83V18Z"/></svg>
      </span>
      <span class="audio-player__bars" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>

    <div class="audio-player__panel" role="region" aria-label="Music player">
      <div class="audio-player__row">
        <div class="audio-player__art">
          <img class="audio-player__art-img" alt="" hidden />
          <svg class="audio-player__art-fallback icon-note" viewBox="0 0 24 24"><path d="M9 18V5.5a1 1 0 0 1 .8-.98l9-1.8A1 1 0 0 1 20 3.7V16a3 3 0 1 1-2-2.83V6.42l-7 1.4V18a3 3 0 1 1-2 2.83V18Z"/></svg>
        </div>

        <div class="audio-player__meta">
          <p class="audio-player__title">—</p>
          <p class="audio-player__artist">—</p>
        </div>

        <div class="audio-player__controls">
          <button class="audio-player__btn" data-action="prev" aria-label="Previous track">
            <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6V6Zm3.5 6 10.5-6v12L9.5 12Z"/></svg>
          </button>
          <button class="audio-player__btn audio-player__btn--play" data-action="play" aria-label="Play">
            <svg class="icon-play" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg>
            <svg class="icon-pause" viewBox="0 0 24 24" hidden><path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z"/></svg>
          </button>
          <button class="audio-player__btn" data-action="next" aria-label="Next track">
            <svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2V6Zm-2 6L3.5 6v12L14 12Z"/></svg>
          </button>
        </div>

        <div class="audio-player__volume">
          <button class="audio-player__btn audio-player__btn--mute" data-action="mute" aria-label="Mute">
            <svg class="icon-vol-on" viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4V9Zm11.5 1.5c1 1 1 4 0 5m2.3-7.3c2 2 2 6.5 0 8.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>
            <svg class="icon-vol-off" viewBox="0 0 24 24" hidden><path d="M4 9h4l5-4v14l-5-4H4V9Zm12 1.5 4 4m0-4-4 4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>
          </button>
          <input type="range" class="audio-player__volume-range" min="0" max="100" value="${Math.round(startVolume * 100)}" aria-label="Volume" />
        </div>

        <button class="audio-player__queue-toggle" data-action="queue" aria-label="Show playlist">
          <svg viewBox="0 0 24 24"><path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h10v2H4v-2Z"/></svg>
        </button>
        <button class="audio-player__close" aria-label="Minimize player">&times;</button>
      </div>

      <div class="audio-player__seek-row">
        <span class="audio-player__time audio-player__time--cur">0:00</span>
        <input type="range" class="audio-player__range" min="0" max="1000" value="0" aria-label="Seek" />
        <span class="audio-player__time audio-player__time--dur">0:00</span>
      </div>

      <ul class="audio-player__list"></ul>
    </div>
  `;
  document.body.appendChild(root);

  const audio = new Audio();
  audio.preload = 'metadata';
  audio.volume = startVolume;
  audio.muted = startMuted;

  const toggleBtn = root.querySelector('.audio-player__toggle');
  const toggleArt = root.querySelector('.audio-player__toggle-art');
  const closeBtn = root.querySelector('.audio-player__close');
  const queueBtn = root.querySelector('.audio-player__queue-toggle');
  const artImg = root.querySelector('.audio-player__art-img');
  const artFallback = root.querySelector('.audio-player__art-fallback');
  const titleEl = root.querySelector('.audio-player__title');
  const artistEl = root.querySelector('.audio-player__artist');
  const playBtn = root.querySelector('[data-action="play"]');
  const iconPlay = playBtn.querySelector('.icon-play');
  const iconPause = playBtn.querySelector('.icon-pause');
  const prevBtn = root.querySelector('[data-action="prev"]');
  const nextBtn = root.querySelector('[data-action="next"]');
  const muteBtn = root.querySelector('[data-action="mute"]');
  const iconVolOn = muteBtn.querySelector('.icon-vol-on');
  const iconVolOff = muteBtn.querySelector('.icon-vol-off');
  const volumeRange = root.querySelector('.audio-player__volume-range');
  const seekRange = root.querySelector('.audio-player__range');
  const curTimeEl = root.querySelector('.audio-player__time--cur');
  const durTimeEl = root.querySelector('.audio-player__time--dur');
  const listEl = root.querySelector('.audio-player__list');

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function renderList() {
    listEl.innerHTML = TRACKS.map((t, i) =>
      `<li class="audio-player__item${i === index ? ' is-active' : ''}" data-index="${i}">
         <span class="audio-player__item-title">${t.title}</span>
         <span class="audio-player__item-artist">${t.artist || ''}</span>
       </li>`
    ).join('');
  }

  function setArt(imgEl, fallbackEl, src) {
    if (!src) {
      imgEl.hidden = true;
      fallbackEl.hidden = false;
      return;
    }
    imgEl.onload = () => { imgEl.hidden = false; fallbackEl.hidden = true; };
    imgEl.onerror = () => { imgEl.hidden = true; fallbackEl.hidden = false; };
    imgEl.src = src;
  }

  const toggleImg = toggleArt.querySelector('.audio-player__toggle-img');
  const toggleFallback = toggleArt.querySelector('.icon-note');

  function updateMeta() {
    const t = TRACKS[index];
    titleEl.textContent = t.title;
    artistEl.textContent = t.artist || '';
    setArt(artImg, artFallback, t.cover);
    setArt(toggleImg, toggleFallback, t.cover);
    [...listEl.children].forEach((li, i) => li.classList.toggle('is-active', i === index));
  }

  function setPlayingUI(playing) {
    root.classList.toggle('is-playing', playing);
    iconPlay.hidden = playing;
    iconPause.hidden = !playing;
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  }

  function loadTrack(i, { autoplay = false, time = 0 } = {}) {
    index = (i + TRACKS.length) % TRACKS.length;
    audio.src = TRACKS[index].src;
    updateMeta();
    if (time) {
      const onReady = () => { audio.currentTime = time; audio.removeEventListener('loadedmetadata', onReady); };
      audio.addEventListener('loadedmetadata', onReady);
    }
    if (autoplay) {
      audio.play().catch(() => setPlayingUI(false));
    }
    saveState({ index });
  }

  function play() {
    audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
  }
  function pause() {
    audio.pause();
    setPlayingUI(false);
  }

  /* ---------------- Events ---------------- */
  toggleBtn.addEventListener('click', () => {
    const open = root.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', open);
    saveState({ expanded: open });
  });
  closeBtn.addEventListener('click', () => {
    root.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    saveState({ expanded: false });
  });
  queueBtn.addEventListener('click', () => {
    root.classList.toggle('is-queue-open');
  });

  playBtn.addEventListener('click', () => (audio.paused ? play() : pause()));
  prevBtn.addEventListener('click', () => loadTrack(index - 1, { autoplay: !audio.paused || wasPlaying }));
  nextBtn.addEventListener('click', () => loadTrack(index + 1, { autoplay: !audio.paused || wasPlaying }));

  listEl.addEventListener('click', (e) => {
    const li = e.target.closest('.audio-player__item');
    if (!li) return;
    const i = Number(li.dataset.index);
    if (i === index) { audio.paused ? play() : pause(); return; }
    loadTrack(i, { autoplay: true });
  });

  audio.addEventListener('ended', () => loadTrack(index + 1, { autoplay: true }));
  audio.addEventListener('error', () => {
    titleEl.textContent = `${TRACKS[index].title} (unavailable)`;
    artistEl.textContent = 'Preview not available — skipping…';
    // Auto-advance past a dead preview, but stop if the whole list is bad.
    if (TRACKS.length > 1) setTimeout(() => loadTrack(index + 1, { autoplay: true }), 1200);
  });

  let seeking = false;
  audio.addEventListener('timeupdate', () => {
    if (!seeking && audio.duration) {
      seekRange.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
    }
    curTimeEl.textContent = fmt(audio.currentTime);
  });
  audio.addEventListener('loadedmetadata', () => {
    durTimeEl.textContent = fmt(audio.duration);
  });
  audio.addEventListener('play', () => { setPlayingUI(true); saveState({ playing: true }); });
  audio.addEventListener('pause', () => { setPlayingUI(false); saveState({ playing: false }); });

  seekRange.addEventListener('input', () => { seeking = true; });
  seekRange.addEventListener('change', () => {
    if (audio.duration) audio.currentTime = (Number(seekRange.value) / 1000) * audio.duration;
    seeking = false;
  });

  volumeRange.addEventListener('input', () => {
    const v = Number(volumeRange.value) / 100;
    audio.volume = v;
    audio.muted = false;
    updateMuteIcon();
    saveState({ volume: v, muted: false });
  });

  function updateMuteIcon() {
    const muted = audio.muted || audio.volume === 0;
    iconVolOn.hidden = muted;
    iconVolOff.hidden = !muted;
  }
  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    updateMuteIcon();
    saveState({ muted: audio.muted });
  });

  // Periodically persist playback position so resuming on another page
  // continues close to where the visitor left off.
  setInterval(() => {
    if (!audio.paused) saveState({ time: audio.currentTime, index });
  }, 2000);
  window.addEventListener('pagehide', () => saveState({ time: audio.currentTime, index, playing: !audio.paused }));

  /* ---------------- Init ---------------- */
  renderList();
  updateMeta();
  updateMuteIcon();
  loadTrack(index, { time: startTime });

  if (wasPlaying) {
    // Browsers block autoplay without a user gesture on most pages; this
    // best-effort call resumes playback if the browser allows it (e.g. the
    // visitor already interacted with the page), otherwise it stays paused
    // and a tap on Play continues right where they left off.
    audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
  }
}

/* ============================================================
   Resolve the QUERIES into playable 30s previews via the iTunes
   Search API (JSONP → no CORS issue), then boot the player.
   Cached in localStorage so it only resolves once per song list.
   ============================================================ */
(function bootstrap() {
  const CACHE_KEY = 'dq_tracks_cache_v2';
  const signature = QUERIES.join('|');

  function useTracks(list) {
    if (!list || !list.length) return;
    list.forEach((t) => TRACKS.push(t));
    start();
  }

  // 1) Try the cache first — instant on repeat visits / page changes.
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && cached.signature === signature && Array.isArray(cached.tracks) && cached.tracks.length) {
      useTracks(cached.tracks);
      return;
    }
  } catch (e) { /* ignore */ }

  // 2) Otherwise resolve each query with a JSONP call to iTunes.
  function itunesSearch(term) {
    return new Promise((resolve) => {
      const cb = 'dq_itunes_' + Math.random().toString(36).slice(2);
      const s = document.createElement('script');
      const cleanup = () => { try { delete window[cb]; } catch (e) { window[cb] = undefined; } s.remove(); };
      const timer = setTimeout(() => { cleanup(); resolve(null); }, 8000);
      window[cb] = (data) => {
        clearTimeout(timer); cleanup();
        resolve((data && data.results && data.results[0]) || null);
      };
      s.onerror = () => { clearTimeout(timer); cleanup(); resolve(null); };
      s.src = 'https://itunes.apple.com/search?media=music&entity=song&limit=1' +
        '&term=' + encodeURIComponent(term) + '&callback=' + cb;
      document.head.appendChild(s);
    });
  }

  Promise.all(QUERIES.map(itunesSearch)).then((results) => {
    const tracks = [];
    results.forEach((r, i) => {
      if (r && r.previewUrl) {
        tracks.push({
          title: r.trackName || QUERIES[i],
          artist: r.artistName || '',
          src: r.previewUrl,
          cover: r.artworkUrl100 ? r.artworkUrl100.replace('100x100bb', '300x300bb') : '',
        });
      }
    });
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ signature, tracks })); } catch (e) { /* ignore */ }
    useTracks(tracks);
  });
})();
