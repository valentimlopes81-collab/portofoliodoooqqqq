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

  let gallery = null; // { show(n), len } while a carousel is open

  function openGallery(item) {
    const imgs = (item.dataset.images || '').split('|').filter(Boolean);
    const bgs = (item.dataset.bgs || '').split('|');
    if (!imgs.length) return;

    const img = document.createElement('img');
    const prev = document.createElement('button');
    const next = document.createElement('button');
    prev.className = 'lightbox__arrow lightbox__arrow--prev';
    next.className = 'lightbox__arrow lightbox__arrow--next';
    prev.setAttribute('aria-label', 'Previous'); next.setAttribute('aria-label', 'Next');
    prev.innerHTML = '&#8249;'; next.innerHTML = '&#8250;';
    const count = document.createElement('span');
    count.className = 'lightbox__count';

    let i = 0;
    function show(n) {
      i = (n + imgs.length) % imgs.length;
      img.src = imgs[i];
      const bg = (bgs[i] || '').trim();
      media.classList.toggle('lightbox__media--pad', !!bg);
      media.style.background = bg || '';
      count.textContent = (i + 1) + ' / ' + imgs.length;
    }
    prev.addEventListener('click', (e) => { e.stopPropagation(); show(i - 1); });
    next.addEventListener('click', (e) => { e.stopPropagation(); show(i + 1); });

    if (imgs.length > 1) { media.appendChild(prev); media.appendChild(next); media.appendChild(count); }
    media.appendChild(img);
    show(0);
    gallery = { show: (d) => show(i + d), len: imgs.length };
  }

  function open(item) {
    const type = item.dataset.type || 'image';
    const src = item.dataset.full || item.querySelector('img')?.getAttribute('src');
    media.innerHTML = '';
    media.style.background = '';
    media.classList.remove('lightbox__media--pad');
    gallery = null;
    if (type === 'gallery') {
      openGallery(item);
      lb.classList.add('open');
      document.body.classList.add('lb-open');
      return;
    }
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
    gallery = null;
    setTimeout(() => {
      media.innerHTML = '';
      media.style.background = '';
      media.classList.remove('lightbox__media--pad');
    }, 350);
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
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (gallery && e.key === 'ArrowLeft') gallery.show(-1);
      else if (gallery && e.key === 'ArrowRight') gallery.show(1);
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
