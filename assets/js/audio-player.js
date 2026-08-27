/* ============================================================
   DOOOQQQQ — floating music player (compact vertical card)
   - small round button, top-left; opens an iOS-style "now playing" card
   - one play/pause toggle, prev/next, a draggable seek bar with times,
     and a speaker button that mutes on click plus a volume slider
   - no visible queue/playlist
   - remembers track + position + volume across page navigation
   ============================================================

   PLAYLIST — local .mp3 files in assets/audio/. Edit TRACKS below:
   { title, artist, src, cover? }  (cover optional; a note icon is used
   when it's absent). Reorder / add / remove freely.
*/

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
  const loadState = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { return {}; } };
  const saveState = (partial) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.assign(loadState(), partial))); } catch (e) {} };

  const state = loadState();
  let index = Number.isInteger(state.index) && TRACKS[state.index] ? state.index : 0;
  let wasPlaying = !!state.playing;
  const startTime = typeof state.time === 'number' ? state.time : 0;
  const startVolume = typeof state.volume === 'number' ? state.volume : 0.8;
  const startMuted = !!state.muted;
  const startExpanded = typeof state.expanded === 'boolean' ? state.expanded : (window.innerWidth > 640);

  const NOTE = '<svg viewBox="0 0 24 24" class="icon-note"><path d="M9 18V5.5a1 1 0 0 1 .8-.98l9-1.8A1 1 0 0 1 20 3.7V16a3 3 0 1 1-2-2.83V6.42l-7 1.4V18a3 3 0 1 1-2 2.83V18Z"/></svg>';

  const root = document.createElement('div');
  root.className = 'audio-player' + (startExpanded ? ' is-open' : '') + (startMuted ? ' is-muted' : '');
  root.innerHTML = `
    <button class="audio-player__toggle" aria-label="Music" aria-expanded="${startExpanded}">
      <span class="audio-player__toggle-art">
        <img class="audio-player__toggle-img" alt="" hidden />
        ${NOTE}
      </span>
      <span class="audio-player__bars" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>

    <div class="audio-player__bar" role="region" aria-label="Music player">
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
            <svg class="icon-pause" viewBox="0 0 24 24"><path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z"/></svg>
          </button>
          <button class="audio-player__btn" data-action="next" aria-label="Next track">
            <svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2V6Zm-2 6L3.5 6v12L14 12Z"/></svg>
          </button>
        </div>

        <div class="audio-player__volume">
          <button class="audio-player__btn audio-player__btn--mute" data-action="mute" aria-label="Mute">
            <svg class="icon-vol-on" viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4V9Zm11.5 1.5c1 1 1 4 0 5m2.3-7.3c2 2 2 6.5 0 8.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>
            <svg class="icon-vol-off" viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4V9Zm12 1.5 4 4m0-4-4 4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>
          </button>
          <input type="range" class="audio-player__volume-range" min="0" max="100" value="${Math.round(startVolume * 100)}" aria-label="Volume" />
        </div>

        <button class="audio-player__close" aria-label="Minimize player">&times;</button>
      </div>

      <div class="audio-player__seek-row">
        <span class="audio-player__time audio-player__time--cur">0:00</span>
        <input type="range" class="audio-player__range" min="0" max="1000" value="0" aria-label="Seek" />
        <span class="audio-player__time audio-player__time--dur">0:00</span>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  const audio = new Audio();
  audio.preload = 'metadata';
  audio.volume = startVolume;
  audio.muted = startMuted;

  const $ = (s) => root.querySelector(s);
  const toggleBtn = $('.audio-player__toggle');
  const toggleImg = $('.audio-player__toggle-img');
  const toggleFallback = $('.audio-player__toggle-art .icon-note');
  const closeBtn = $('.audio-player__close');
  const artImg = $('.audio-player__art-img');
  const artFallback = $('.audio-player__art-fallback');
  const titleEl = $('.audio-player__title');
  const artistEl = $('.audio-player__artist');
  const playBtn = $('[data-action="play"]');
  const prevBtn = $('[data-action="prev"]');
  const nextBtn = $('[data-action="next"]');
  const muteBtn = $('[data-action="mute"]');
  const volumeRange = $('.audio-player__volume-range');
  const seekRange = $('.audio-player__range');
  const curTimeEl = $('.audio-player__time--cur');
  const durTimeEl = $('.audio-player__time--dur');

  const fmt = (sec) => {
    if (!isFinite(sec) || sec < 0) sec = 0;
    return Math.floor(sec / 60) + ':' + Math.floor(sec % 60).toString().padStart(2, '0');
  };

  function setArt(imgEl, fallbackEl, src) {
    if (!src) { imgEl.hidden = true; fallbackEl.hidden = false; return; }
    imgEl.onload = () => { imgEl.hidden = false; fallbackEl.hidden = true; };
    imgEl.onerror = () => { imgEl.hidden = true; fallbackEl.hidden = false; };
    imgEl.src = src;
  }

  function updateMeta() {
    const t = TRACKS[index];
    titleEl.textContent = t.title;
    artistEl.textContent = t.artist || '';
    setArt(artImg, artFallback, t.cover);
    setArt(toggleImg, toggleFallback, t.cover);
  }

  // Icon visibility is driven purely by root classes (see CSS), so only
  // one of play/pause and one of sound/mute is ever shown.
  const setPlayingUI = (playing) => {
    root.classList.toggle('is-playing', playing);
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  };
  const updateMuteUI = () => {
    const muted = audio.muted || audio.volume === 0;
    root.classList.toggle('is-muted', muted);
    muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
  };

  function loadTrack(i, { autoplay = false, time = 0 } = {}) {
    index = (i + TRACKS.length) % TRACKS.length;
    audio.src = TRACKS[index].src;
    updateMeta();
    if (time) {
      const onReady = () => { audio.currentTime = time; audio.removeEventListener('loadedmetadata', onReady); };
      audio.addEventListener('loadedmetadata', onReady);
    }
    if (autoplay) audio.play().catch(() => setPlayingUI(false));
    saveState({ index });
  }

  const play = () => audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
  const pause = () => { audio.pause(); setPlayingUI(false); };

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

  playBtn.addEventListener('click', () => (audio.paused ? play() : pause()));
  prevBtn.addEventListener('click', () => loadTrack(index - 1, { autoplay: !audio.paused || wasPlaying }));
  nextBtn.addEventListener('click', () => loadTrack(index + 1, { autoplay: !audio.paused || wasPlaying }));

  audio.addEventListener('ended', () => loadTrack(index + 1, { autoplay: true }));
  audio.addEventListener('error', () => {
    titleEl.textContent = `${TRACKS[index].title} (missing)`;
    artistEl.textContent = `Add ${TRACKS[index].src.split('/').pop()} to assets/audio/`;
  });

  let seeking = false;
  audio.addEventListener('timeupdate', () => {
    if (!seeking && audio.duration) seekRange.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
    curTimeEl.textContent = fmt(audio.currentTime);
  });
  audio.addEventListener('loadedmetadata', () => { durTimeEl.textContent = fmt(audio.duration); });
  audio.addEventListener('play', () => { setPlayingUI(true); saveState({ playing: true }); });
  audio.addEventListener('pause', () => { setPlayingUI(false); saveState({ playing: false }); });

  // Draggable seek: preview while dragging, commit on release.
  seekRange.addEventListener('input', () => {
    seeking = true;
    if (audio.duration) curTimeEl.textContent = fmt((Number(seekRange.value) / 1000) * audio.duration);
  });
  seekRange.addEventListener('change', () => {
    if (audio.duration) audio.currentTime = (Number(seekRange.value) / 1000) * audio.duration;
    seeking = false;
  });

  volumeRange.addEventListener('input', () => {
    const v = Number(volumeRange.value) / 100;
    audio.volume = v;
    audio.muted = false;
    updateMuteUI();
    saveState({ volume: v, muted: false });
  });
  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    updateMuteUI();
    saveState({ muted: audio.muted });
  });

  setInterval(() => { if (!audio.paused) saveState({ time: audio.currentTime, index }); }, 2000);
  window.addEventListener('pagehide', () => saveState({ time: audio.currentTime, index, playing: !audio.paused }));

  updateMeta();
  updateMuteUI();
  loadTrack(index, { time: startTime });
  if (wasPlaying) audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
}

/* Boot the player with the local-file playlist above. */
start();
