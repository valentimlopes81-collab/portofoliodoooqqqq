/* ============================================================
   DOOOQQQQ — shared site behaviour
   - builds the lightbox
   - opens images / videos over a blurred, darkened site
   - hides the overlay text of the clicked item while open
   ============================================================ */

(function () {
  // --- Build lightbox once ---
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML =
    '<button class="lightbox__close" aria-label="Close">&times;</button>' +
    '<div class="lightbox__media"></div>';
  document.body.appendChild(lb);

  const media = lb.querySelector('.lightbox__media');
  const closeBtn = lb.querySelector('.lightbox__close');

  function open(item) {
    const type = item.dataset.type || 'image';
    const src = item.dataset.full || item.querySelector('img')?.getAttribute('src');
    media.innerHTML = '';

    if (type === 'video') {
      // If a real video source is provided, play it; otherwise show the poster.
      if (src && /\.(mp4|webm|mov)$/i.test(src)) {
        const v = document.createElement('video');
        v.src = src;
        v.controls = true;
        v.autoplay = true;
        v.playsInline = true;
        media.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = item.dataset.poster || src;
        img.alt = '';
        media.appendChild(img);
      }
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      media.appendChild(img);
    }

    lb.classList.add('open');
    document.body.classList.add('lb-open');
  }

  function close() {
    lb.classList.remove('open');
    document.body.classList.remove('lb-open');
    const v = media.querySelector('video');
    if (v) v.pause();
    setTimeout(() => { media.innerHTML = ''; }, 350);
  }

  document.querySelectorAll('.item').forEach((item) => {
    item.addEventListener('click', () => open(item));
  });

  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('open')) close();
  });
})();
