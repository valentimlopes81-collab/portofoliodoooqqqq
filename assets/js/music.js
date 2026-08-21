/* ============================================================
   DOOOQQQQ — floating Spotify player
   Set SPOTIFY to your playlist / album / track link (or bare ID).
   Browsers block autoplay with sound, so playback starts when the
   visitor opens the player and hits play inside the Spotify embed.
   ============================================================ */

(function () {
  // 👉 Paste your Spotify playlist link here, e.g.
  //    'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'
  //    Album and track links also work. Leave the placeholder to hide the player.
  const SPOTIFY = 'https://open.spotify.com/playlist/PLAYLIST_ID';

  // Don't render the player until a real link is set.
  if (/PLAYLIST_ID/.test(SPOTIFY)) return;

  // Parse "playlist | album | track" and the id from a full URL, URI or bare id.
  function parse(src) {
    let m = src.match(/(playlist|album|track|artist|show|episode)[/:]([A-Za-z0-9]+)/);
    if (m) return { type: m[1], id: m[2] };
    m = src.match(/^([A-Za-z0-9]{16,})$/); // bare id → assume playlist
    if (m) return { type: 'playlist', id: m[1] };
    return null;
  }

  const info = parse(SPOTIFY);
  if (!info) return;

  const embed =
    'https://open.spotify.com/embed/' + info.type + '/' + info.id +
    '?utm_source=generator&theme=0';

  const wrap = document.createElement('div');
  wrap.className = 'music';
  wrap.innerHTML =
    '<div class="music__panel">' +
      '<iframe title="DOOOQQQQ playlist" src="' + embed + '" height="152" ' +
      'allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" ' +
      'loading="lazy"></iframe>' +
    '</div>' +
    '<button class="music__toggle" aria-label="Music" aria-expanded="false">' +
      '<svg class="note" viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z"/></svg>' +
      '<span class="bars"><i></i><i></i><i></i><i></i></span>' +
    '</button>';

  document.body.appendChild(wrap);

  const toggle = wrap.querySelector('.music__toggle');
  toggle.addEventListener('click', () => {
    const open = wrap.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
})();
