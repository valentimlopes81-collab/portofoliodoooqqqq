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
   PLAYLIST — local .mp3 files
   Drop each song into assets/audio/ using the file name in `src`
   below. Optional: add a `cover` (jpg/png) next to it for artwork,
   e.g. cover: 'assets/audio/01-777-666.jpg'. Reorder / add / remove
   entries freely — the player and playlist adapt automatically.
   ------------------------------------------------------------ */
const TRACKS = [
  { title: '777-666',                  artist: 'Matuê',                               src: 'assets/audio/777-666.mp3' },
  { title: 'Never Recover',            artist: 'Lil Baby, Gunna & Drake',             src: 'assets/audio/never-recover.mp3' },
  { title: 'Nonstop',                  artist: 'Drake',                               src: 'assets/audio/nonstop.mp3' },
  { title: 'Mile High Memories',       artist: 'Future & Metro Boomin',               src: 'assets/audio/mile-high-memories.mp3' },
  { title: 'made for this shit',       artist: 'Gunna',                               src: 'assets/audio/made-for-this-shit.mp3' },
  { title: 'só penso em tu garota',    artist: 'G.A, Veigh, MC Meno K',               src: 'assets/audio/so-penso-em-tu-garota.mp3' },
  { title: 'Mist',                     artist: 'EsDeeKid & Rico Ace',                 src: 'assets/audio/mist.mp3' },
  { title: 'Floor Seats',              artist: 'A$AP Ferg',                           src: 'assets/audio/floor-seats.mp3' },
  { title: 'Slaughter',                artist: 'Central Cee & J Hus',                 src: 'assets/audio/slaughter.mp3' },
  { title: 'Odisseia',                 artist: 'Tz da Coronel',                       src: 'assets/audio/odisseia.mp3' },
  { title: 'Yesterday',                artist: 'Fimiguerrero',                        src: 'assets/audio/yesterday.mp3' },
  { title: 'Whisper My Name',          artist: 'Drake',                               src: 'assets/audio/whisper-my-name.mp3' },
  { title: 'Plot Twist',               artist: 'Drake',                               src: 'assets/audio/plot-twist.mp3' },
  { title: 'Férias',                   artist: 'Ryu, The Runner & 6ee',               src: 'assets/audio/ferias.mp3' },
  { title: 'Tic Tac Toe',              artist: 'Lil Tecca & Ken Carson',              src: 'assets/audio/tic-tac-toe.mp3' },
  { title: 'Questão de Respeito',      artist: 'Norty',                               src: 'assets/audio/questao-de-respeito.mp3' },
  { title: 'Milk',                     artist: 'fakemink',                            src: 'assets/audio/milk.mp3' },
  { title: 'Throw Away',               artist: 'Future',                              src: 'assets/audio/throw-away.mp3' },
  { title: 'Codeine Crazy',            artist: 'Future',                              src: 'assets/audio/codeine-crazy.mp3' },
  { title: 'Talk Shit Like a Preacher',artist: 'Future',                              src: 'assets/audio/talk-shit-like-a-preacher.mp3' },
  { title: 'Stick to the Models',      artist: 'Future',                              src: 'assets/audio/stick-to-the-models.mp3' },
  { title: 'Freestyle',                artist: 'Lil Baby',                            src: 'assets/audio/freestyle.mp3' },
  { title: 'Titanium',                 artist: 'Dave',                                src: 'assets/audio/titanium.mp3' },
  { title: 'Meltdown',                 artist: 'Travis Scott & Drake',                src: 'assets/audio/meltdown.mp3' },
  { title: 'Money in the Grave',       artist: 'Drake & Rick Ross',                   src: 'assets/audio/money-in-the-grave.mp3' },
  { title: 'Stop Trying to Be God',    artist: 'Travis Scott',                        src: 'assets/audio/stop-trying-to-be-god.mp3' },
  { title: 'Os Melhores',              artist: 'Matuê',                               src: 'assets/audio/os-melhores.mp3' },
  { title: 'Xtranho',                  artist: 'Matuê & Brandão85',                   src: 'assets/audio/xtranho.mp3' },
  { title: '9',                        artist: 'Drake',                               src: 'assets/audio/9.mp3' },
  { title: 'Fukk A Interview',         artist: 'Future',                              src: 'assets/audio/fukk-a-interview.mp3' },
  { title: 'Secondhand',               artist: 'Don Toliver & Rema',                  src: 'assets/audio/secondhand.mp3' },
  { title: 'Star67',                   artist: 'Drake',                               src: 'assets/audio/star67.mp3' },
  { title: 'Stop Giving Me Advice',    artist: 'Lyrical Lemonade, Jack Harlow & Dave',src: 'assets/audio/stop-giving-me-advice.mp3' },
  { title: 'Survival',                 artist: 'Drake',                               src: 'assets/audio/survival.mp3' },
];

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
    titleEl.textContent = `${TRACKS[index].title} (missing)`;
    artistEl.textContent = `Add ${TRACKS[index].src.split('/').pop()} to assets/audio/`;
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

/* Boot the player with the local-file playlist above. */
start();
