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

  // Builds the bottom-left / bottom-right caption text from whichever
  // data-* attributes are present on the item, so it's fine to leave
  // any of them out for a given photo.
  function buildMeta(item) {
    const camera = item.dataset.camera;
    const lens = item.dataset.lens;
    const iso = item.dataset.iso;
    const shutter = item.dataset.shutter;
    const aperture = item.dataset.aperture;

    const left = [camera, lens].filter(Boolean).join(' — ');
    const right = [
      iso ? 'ISO ' + iso : null,
      shutter,
      aperture,
    ].filter(Boolean).join(' · ');

    if (!left && !right) return;

    if (left) {
      const el = document.createElement('span');
      el.className = 'lightbox__meta lightbox__meta--left';
      el.textContent = left;
      media.appendChild(el);
    }
    if (right) {
      const el = document.createElement('span');
      el.className = 'lightbox__meta lightbox__meta--right';
      el.textContent = right;
      media.appendChild(el);
    }
  }

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
      buildMeta(item);
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

  // --- Scroll reveal: items and home category blocks appear as you scroll ---
  const revealEls = document.querySelectorAll('.item, .cat');
  revealEls.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('open')) close();
  });
})();
