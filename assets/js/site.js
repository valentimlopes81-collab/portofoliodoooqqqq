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

  // Turn a YouTube/Vimeo link into an autoplay embed URL (leave anything
  // that already looks like an embed URL untouched).
  function toEmbedUrl(url) {
    let m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
    if (m) return 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0';
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1';
    return url;
  }

  // Clears any previous camera/lens/exposure caption before drawing the
  // current slide's (metaItem may be null for a slide with no photo data).
  function buildMeta(metaItem) {
    media.querySelectorAll('.lightbox__meta').forEach((el) => el.remove());
    if (!metaItem) return;
    const left = [metaItem.dataset.camera, metaItem.dataset.lens].filter(Boolean).join(' — ');
    const right = [
      metaItem.dataset.iso ? 'ISO ' + metaItem.dataset.iso : null,
      metaItem.dataset.shutter,
      metaItem.dataset.aperture,
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

  // Slides come from data-slides (mixed video/image, "video:<url>" prefix
  // marks an embed), the older data-images (image-only galleries), or a
  // group of separate .item tiles sharing data-group (see openGroupGallery).
  // metaItems, when given, is a same-length array of source .item elements
  // (or null) used to redraw the camera/lens caption as slides change.
  function openGallery(item, opts) {
    const slides = (item.dataset.slides || item.dataset.images || '').split('|').filter(Boolean);
    const bgs = (item.dataset.bgs || '').split('|');
    if (!slides.length) return;
    const metaItems = (opts && opts.metaItems) || null;
    const startIndex = (opts && opts.startIndex) || 0;

    const stage = document.createElement('div');
    stage.className = 'lightbox__stage';
    const prev = document.createElement('button');
    const next = document.createElement('button');
    prev.className = 'lightbox__arrow lightbox__arrow--prev';
    next.className = 'lightbox__arrow lightbox__arrow--next';
    prev.setAttribute('aria-label', 'Previous'); next.setAttribute('aria-label', 'Next');
    prev.innerHTML = '&#8249;'; next.innerHTML = '&#8250;';
    const count = document.createElement('span');
    count.className = 'lightbox__count';

    let i = 0;
    let requestId = 0; // ignore a slow-loading slide if the user has since moved past it

    // Swaps the stage content in, then updates the caption/counter — called
    // once the slide is actually ready, so the previous slide (and the
    // arrows pinned to the media box) never collapse to an empty/loading
    // state in between.
    function render(n, node, bg) {
      i = n;
      stage.innerHTML = '';
      media.classList.toggle('lightbox__media--pad', !!bg);
      media.style.background = bg || '';
      stage.appendChild(node);
      if (metaItems) buildMeta(metaItems[i]); else buildMeta(null);
      count.textContent = (i + 1) + ' / ' + slides.length;
    }

    function show(n) {
      const target = (n + slides.length) % slides.length;
      const slide = slides[target];
      const myRequest = ++requestId;
      if (slide.startsWith('video:')) {
        const wrap = document.createElement('div');
        wrap.className = 'lightbox__embed';
        const ifr = document.createElement('iframe');
        ifr.src = toEmbedUrl(slide.slice(6));
        ifr.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
        ifr.allowFullscreen = true;
        wrap.appendChild(ifr);
        render(target, wrap, '');
      } else {
        const bg = (bgs[target] || '').trim();
        const img = new Image();
        img.src = slide;
        const go = () => { if (myRequest === requestId) render(target, img, bg); };
        if (img.complete) go(); else img.onload = img.onerror = go;
      }
    }
    // Warm the browser cache for the next/previous slide so a click swaps
    // in instantly instead of waiting on a fresh network fetch.
    function preload(n) {
      const slide = slides[(n + slides.length) % slides.length];
      if (slide && !slide.startsWith('video:')) new Image().src = slide;
    }
    // Moves by `d` from the currently *requested* slide (not necessarily
    // the one on screen yet, if a previous load is still in flight) and
    // warms the one just past it, so repeated clicks keep feeling instant.
    let requested = startIndex;
    function step(d) {
      requested = (requested + d + slides.length) % slides.length;
      show(requested);
      preload(requested + d);
    }
    prev.addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
    next.addEventListener('click', (e) => { e.stopPropagation(); step(1); });

    if (slides.length > 1) { media.appendChild(prev); media.appendChild(next); media.appendChild(count); }
    media.appendChild(stage);
    show(startIndex);
    preload(startIndex + 1);
    preload(startIndex - 1);
    gallery = { show: step, len: slides.length };
  }

  // A set of separate tiles (e.g. every still on the Stills page) sharing
  // data-group="X": open them as one gallery, starting at the clicked tile,
  // instead of each opening on its own with no way to reach the next one.
  function openGroupGallery(item) {
    const members = Array.from(document.querySelectorAll('.item[data-group="' + item.dataset.group + '"]'));
    const startIndex = Math.max(0, members.indexOf(item));
    const proxy = document.createElement('div');
    proxy.dataset.images = members.map((m) => m.dataset.full).join('|');
    openGallery(proxy, { startIndex, metaItems: members });
  }

  function open(item) {
    const type = item.dataset.type || 'image';
    const src = item.dataset.full || item.querySelector('img')?.getAttribute('src');
    media.innerHTML = '';
    media.style.background = '';
    media.classList.remove('lightbox__media--pad');
    media.classList.toggle('lightbox__media--stills', item.dataset.group === 'stills');
    gallery = null;
    if (item.dataset.group) {
      openGroupGallery(item);
      lb.classList.add('open');
      document.body.classList.add('lb-open');
      return;
    }
    if (type === 'gallery') {
      openGallery(item);
      addCaption(item);
      lb.classList.add('open');
      document.body.classList.add('lb-open');
      return;
    }
    if (type === 'video') {
      const embed = item.dataset.embed;
      if (embed) {
        const wrap = document.createElement('div');
        wrap.className = 'lightbox__embed';
        const ifr = document.createElement('iframe');
        ifr.src = toEmbedUrl(embed);
        ifr.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
        ifr.allowFullscreen = true;
        wrap.appendChild(ifr);
        media.appendChild(wrap);
      } else if (src && /\.(mp4|webm|mov)$/i.test(src)) {
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
    addCaption(item);
    lb.classList.add('open');
    document.body.classList.add('lb-open');
  }

  // One-line title shown at the bottom of the lightbox when a work is opened.
  function addCaption(item) {
    const t = item.dataset.title;
    if (!t) return;
    const cap = document.createElement('span');
    cap.className = 'lightbox__caption';
    cap.textContent = t;
    media.appendChild(cap);
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

    // Swipe left/right to move through a gallery on touch devices (arrows
    // stay hidden there — see the (hover: none) rule in style.css).
    let touchStartX = null, touchStartY = null;
    media.addEventListener('touchstart', (e) => {
      if (!gallery || e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    media.addEventListener('touchend', (e) => {
      if (!gallery || touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      touchStartX = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) gallery.show(dx < 0 ? 1 : -1);
    }, { passive: true });
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    }
  }

  // The footer's Gmail "compose" deep link (?view=cm&...) only works on
  // desktop web Gmail — on a phone it just opens the inbox instead of a
  // prefilled draft. A plain mailto: link is what actually opens a
  // prefilled draft on mobile (in Mail, Gmail, or whatever's the default),
  // so swap to it there while leaving the desktop link untouched.
  function fixMobileEmailLink() {
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('a.social[href*="mail.google.com/mail"]').forEach((a) => {
      const url = new URL(a.href);
      const to = url.searchParams.get('to');
      const su = url.searchParams.get('su');
      if (!to) return;
      a.href = 'mailto:' + to + (su ? '?subject=' + encodeURIComponent(su) : '');
    });
  }

  // (Re)bind gallery items and scroll-reveal for the current DOM.
  function initSite() {
    buildLightboxOnce();
    if (lb.classList.contains('open')) close();
    fixMobileEmailLink();

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
