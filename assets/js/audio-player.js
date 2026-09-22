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
  { title: '777-666',                  artist: 'Matuê',                               src: 'assets/audio/777-666.mp3', cover: 'assets/audio/777-666.jpg' },
  { title: 'Never Recover',            artist: 'Lil Baby, Gunna & Drake',             src: 'assets/audio/never-recover.mp3', cover: 'assets/audio/never-recover.jpg' },
  { title: 'Nonstop',                  artist: 'Drake',                               src: 'assets/audio/nonstop.mp3', cover: 'assets/audio/nonstop.jpg' },
  { title: 'Mile High Memories',       artist: 'Future & Metro Boomin',               src: 'assets/audio/mile-high-memories.mp3', cover: 'assets/audio/mile-high-memories.jpg' },
  { title: 'made for this shit',       artist: 'Gunna',                               src: 'assets/audio/made-for-this-shit.mp3', cover: 'assets/audio/made-for-this-shit.jpg' },
  { title: 'só penso em tu garota',    artist: 'G.A, Veigh, MC Meno K',               src: 'assets/audio/so-penso-em-tu-garota.mp3', cover: 'assets/audio/so-penso-em-tu-garota.jpg' },
  { title: 'Mist',                     artist: 'EsDeeKid & Rico Ace',                 src: 'assets/audio/mist.mp3', cover: 'assets/audio/mist.jpg' },
  { title: 'Floor Seats',              artist: 'A$AP Ferg',                           src: 'assets/audio/floor-seats.mp3', cover: 'assets/audio/floor-seats.jpg' },
  { title: 'Slaughter',                artist: 'Central Cee & J Hus',                 src: 'assets/audio/slaughter.mp3', cover: 'assets/audio/slaughter.jpg' },
  { title: 'Yesterday',                artist: 'Fimiguerrero',                        src: 'assets/audio/yesterday.mp3', cover: 'assets/audio/yesterday.jpg' },
  { title: 'Whisper My Name',          artist: 'Drake',                               src: 'assets/audio/whisper-my-name.mp3', cover: 'assets/audio/whisper-my-name.jpg' },
  { title: 'Plot Twist',               artist: 'Drake',                               src: 'assets/audio/plot-twist.mp3', cover: 'assets/audio/plot-twist.jpg' },
  { title: 'Férias',                   artist: 'Ryu, The Runner & 6ee',               src: 'assets/audio/ferias.mp3', cover: 'assets/audio/ferias.jpg' },
  { title: 'Tic Tac Toe',              artist: 'Lil Tecca & Ken Carson',              src: 'assets/audio/tic-tac-toe.mp3', cover: 'assets/audio/tic-tac-toe.jpg' },
  { title: 'Questão de Respeito',      artist: 'Norty',                               src: 'assets/audio/questao-de-respeito.mp3', cover: 'assets/audio/questao-de-respeito.jpg' },
  { title: 'Milk',                     artist: 'fakemink',                            src: 'assets/audio/milk.mp3', cover: 'assets/audio/milk.jpg' },
  { title: 'Throw Away',               artist: 'Future',                              src: 'assets/audio/throw-away.mp3', cover: 'assets/audio/throw-away.jpg' },
  { title: 'Codeine Crazy',            artist: 'Future',                              src: 'assets/audio/codeine-crazy.mp3', cover: 'assets/audio/codeine-crazy.jpg' },
  { title: 'Talk Shit Like a Preacher',artist: 'Future',                              src: 'assets/audio/talk-shit-like-a-preacher.mp3', cover: 'assets/audio/talk-shit-like-a-preacher.jpg' },
  { title: 'Stick to the Models',      artist: 'Future',                              src: 'assets/audio/stick-to-the-models.mp3', cover: 'assets/audio/stick-to-the-models.jpg' },
  { title: 'Titanium',                 artist: 'Dave',                                src: 'assets/audio/titanium.mp3', cover: 'assets/audio/titanium.jpg' },
  { title: 'Meltdown',                 artist: 'Travis Scott & Drake',                src: 'assets/audio/meltdown.mp3', cover: 'assets/audio/meltdown.jpg' },
  { title: 'Money in the Grave',       artist: 'Drake & Rick Ross',                   src: 'assets/audio/money-in-the-grave.mp3', cover: 'assets/audio/money-in-the-grave.jpg' },
  { title: 'Os Melhores',              artist: 'Matuê',                               src: 'assets/audio/os-melhores.mp3', cover: 'assets/audio/os-melhores.jpg' },
  { title: 'Xtranho',                  artist: 'Matuê & Brandão85',                   src: 'assets/audio/xtranho.mp3', cover: 'assets/audio/xtranho.jpg' },
  { title: '9',                        artist: 'Drake',                               src: 'assets/audio/9.mp3', cover: 'assets/audio/9.jpg' },
  { title: 'Fukk A Interview',         artist: 'Future',                              src: 'assets/audio/fukk-a-interview.mp3', cover: 'assets/audio/fukk-a-interview.jpg' },
  { title: 'Secondhand',               artist: 'Don Toliver & Rema',                  src: 'assets/audio/secondhand.mp3', cover: 'assets/audio/secondhand.jpg' },
  { title: 'Star67',                   artist: 'Drake',                               src: 'assets/audio/star67.mp3', cover: 'assets/audio/star67.jpg' },
  { title: 'Stop Giving Me Advice',    artist: 'Lyrical Lemonade, Jack Harlow & Dave',src: 'assets/audio/stop-giving-me-advice.mp3', cover: 'assets/audio/stop-giving-me-advice.jpg' },
  { title: 'Survival',                 artist: 'Drake',                               src: 'assets/audio/survival.mp3', cover: 'assets/audio/survival.jpg' },

  { title: 'Tz Da Coronel',            artist: 'Glocks & Bersa',                      src: 'assets/audio/glocks-bersa-tz-da-coronel.mp3', cover: 'assets/audio/glocks-e-bersa.jpeg' },
  { title: 'Hun43rd',                  artist: 'A$AP Rocky',                          src: 'assets/audio/asap-rocky-hun43rd.mp3', cover: 'assets/audio/asap-rocky-testing.jpeg' },
  { title: 'Fukk Sleep',               artist: 'A$AP Rocky feat. FKA twigs',          src: 'assets/audio/asap-rocky-fukk-sleep.mp3', cover: 'assets/audio/asap-rocky-testing.jpeg' },
  { title: 'Cold Shoulder',            artist: 'Drake feat. Don Toliver',             src: 'assets/audio/drake-cold-shoulder.mp3', cover: 'assets/audio/drake-fomo.jpg' },
  { title: 'Blue Green Red',           artist: 'Drake',                               src: 'assets/audio/drake-blue-green-red.mp3', cover: 'assets/audio/100-gigs.jpeg' },
  { title: 'Circadian Rhythm',         artist: 'Drake',                               src: 'assets/audio/drake-circadian-rhythm.mp3', cover: 'assets/audio/100-gigs.jpeg' },
  { title: 'No Face',                  artist: 'Drake',                               src: 'assets/audio/drake-no-face.mp3', cover: 'assets/audio/100-gigs.jpeg' },
  { title: "Choosin' Texas (Remix)",   artist: 'Drake, Don Toliver & Ella Langley',   src: 'assets/audio/drake-choosin-texas-remix.mp3', cover: 'assets/audio/drake-fomo.jpg' },
  { title: 'Max Win',                  artist: 'Isak, Zigarro & Armando Teles',       src: 'assets/audio/isak-zigarro-armando-teles-max-win.mp3', cover: 'assets/audio/max-win.png' },
  { title: 'Sete Vidas',               artist: 'Isak, Zigarro & Armando Teles',       src: 'assets/audio/isak-zigarro-armando-teles-sete-vidas.mp3', cover: 'assets/audio/jon.png' },
  { title: 'Cínicos',                  artist: 'LON3R JOHNY',                         src: 'assets/audio/lon3r-johny-cinicos.mp3', cover: 'assets/audio/cinicos.jpeg' },
  { title: 'A Morte do Autotune',      artist: 'Matuê',                               src: 'assets/audio/matue-a-morte-do-autotune.mp3', cover: 'assets/audio/morte-do-autotune.jpeg' },
  { title: 'Fim Do Nada',              artist: 'Mizzy Miles, T-Rex & Zara G',         src: 'assets/audio/mizzy-miles-fim-do-nada.mp3', cover: 'assets/audio/fim-do-nada.jpeg' },
  { title: 'Eu Sou A Sh!t',            artist: 'Norty',                               src: 'assets/audio/norty-eu-sou-a-shit.mp3', cover: 'assets/audio/eu-sou-a-shit.jpeg' },
  { title: 'Guttmann',                 artist: 'Norty',                               src: 'assets/audio/norty-guttmann.mp3', cover: 'assets/audio/guttman.jpeg' },
  { title: 'Champagne',                artist: 'Orochi, PL Quest, BIN, Kizzy & Mainstreet', src: 'assets/audio/orochi-champagne.mp3', cover: 'assets/audio/champagne.jpeg' },
  { title: 'Tango',                    artist: 'Supernova Ent, Ghard, G.A, Veigh & Niink', src: 'assets/audio/supernova-ent-tango.mp3', cover: 'assets/audio/supernova.jpeg' },
  { title: 'CRXSHOUT',                 artist: 'Yuri NR5',                            src: 'assets/audio/yuri-nr5-crxshout.mp3', cover: 'assets/audio/crsxhout.jpeg' },
  { title: 'ESTÁBULO',                 artist: 'Yuri NR5',                            src: 'assets/audio/yuri-nr5-estabulo.mp3', cover: 'assets/audio/estabulo.jpeg' },
  { title: 'G-$TAR',                   artist: 'Yuri NR5',                            src: 'assets/audio/yuri-nr5-g-star.mp3', cover: 'assets/audio/pele-e-osso.jpeg' },
  { title: 'Ninguém',                  artist: 'Yuri NR5',                            src: 'assets/audio/yuri-nr5-ninguem.mp3', cover: 'assets/audio/pele-e-osso.jpeg' },
  { title: 'Mundo Todo x Nightime',    artist: 'Yuri NR5',                            src: 'assets/audio/mundo-todo-x-nightime.mp3', cover: 'assets/audio/mundo-tudo.jpeg' },
  { title: 'Fashion Safari',           artist: 'xandre',                              src: 'assets/audio/xandre-fashion-safari.mp3', cover: 'assets/audio/xandre.jpeg' },
  { title: 'Nouveau Riche',            artist: 'xandre',                              src: 'assets/audio/xandre-nouveau-riche.mp3', cover: 'assets/audio/xandre.jpeg' },
  { title: '5 Figures',                artist: 'xandre, SKURTY & G6Revy',             src: 'assets/audio/xandre-5-figures.mp3', cover: 'assets/audio/xandre.jpeg' },
];

function start() {
  if (!TRACKS.length) return;

  // ---- Random order, once per visit ----
  // The playlist is shuffled the first time the site is opened in a tab and
  // that order is kept while the visitor moves between pages (stored in
  // sessionStorage). A new visit (new tab/session) reshuffles, so it doesn't
  // always start in the same order it was added.
  const ORDER_KEY = 'dq_order';
  const shuffle = (n) => {
    const a = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  let order = null, freshOrder = false;
  try { const s = JSON.parse(sessionStorage.getItem(ORDER_KEY) || 'null'); if (Array.isArray(s) && s.length === TRACKS.length) order = s; } catch (e) {}
  if (!order) { order = shuffle(TRACKS.length); freshOrder = true; try { sessionStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch (e) {} }
  const orig = TRACKS.slice();
  TRACKS.splice(0, TRACKS.length, ...order.map((i) => orig[i]));

  const STORAGE_KEY = 'dq_player_state';
  const loadState = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { return {}; } };
  const saveState = (partial) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.assign(loadState(), partial))); } catch (e) {} };

  const state = loadState();
  // On a fresh (reshuffled) visit, start at the top of the new order instead
  // of resuming a saved position that now points at a different song.
  let index = (!freshOrder && Number.isInteger(state.index) && TRACKS[state.index]) ? state.index : 0;
  let wasPlaying = !freshOrder && !!state.playing;
  const startTime = !freshOrder && typeof state.time === 'number' ? state.time : 0;
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
    // Assume the cover will load: show the image and hide the note right away
    // (prevents the note peeking through). Only fall back on a real error.
    imgEl.hidden = false;
    fallbackEl.hidden = true;
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
