/* ============================================================
   DOOOQQQQ — shared site behaviour
   - builds the lightbox (once)
   - opens images / videos over a blurred, darkened site
   - hides the overlay text of the clicked item while open
   - exposes window.initSite() so seamless navigation (nav.js) can
     re-bind gallery items after swapping the page content
   ============================================================ */

(function () {
  let lb, media, closeBtn, io;

  function buildMeta(item) {
    const left = [item.dataset.camera, item.dataset.lens].filter(Boolean).join(' — ');
    const right = [
      item.dataset.iso ? 'ISO ' + item.dataset.iso : null,
      item.dataset.shutter,
      item.dataset.aperture,
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
      if (src && /\.(mp4|webm|mov)$/i.test(src)) {
        const v = document.createElement('video');
        v.src = src; v.controls = true; v.autoplay = true; v.playsInline = true;
        media.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = item.dataset.poster || src; img.alt = '';
        media.appendChild(img);
      }
    } else {
      const img = document.createElement('img');
      img.src = src; img.alt = '';
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

  function buildLightboxOnce() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lightbox__close" aria-label="Close">&times;</button>' +
      '<div class="lightbox__media"></div>';
    document.body.appendChild(lb);
    media = lb.querySelector('.lightbox__media');
    closeBtn = lb.querySelector('.lightbox__close');
    closeBtn.addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lb.classList.contains('open')) close();
    });
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    }
  }

  // (Re)bind gallery items and scroll-reveal for the current DOM.
  function initSite() {
    buildLightboxOnce();
    if (lb.classList.contains('open')) close();

    document.querySelectorAll('.item').forEach((item) => {
      if (item.dataset.bound) return;
      item.dataset.bound = '1';
      item.addEventListener('click', () => open(item));
    });

    const revealEls = document.querySelectorAll('.item, .cat');
    revealEls.forEach((el) => el.classList.add('reveal'));
    if (io) revealEls.forEach((el) => { if (!el.classList.contains('in')) io.observe(el); });
    else revealEls.forEach((el) => el.classList.add('in'));
  }

  window.initSite = initSite;
  initSite();
})();
