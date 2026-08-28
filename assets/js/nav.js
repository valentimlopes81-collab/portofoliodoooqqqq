/* ============================================================
   DOOOQQQQ — seamless navigation
   Swaps page content without a full reload so the music keeps
   playing between pages (no pause). The floating audio player,
   header and footer stay in the DOM the whole time.

   Fully progressive: if anything goes wrong, or for external /
   hash / new-tab links, it falls back to a normal page load.
   ============================================================ */

(function () {
  if (!window.history || !window.fetch || !document.querySelector('main')) return;

  const sameOrigin = (url) => {
    try { return new URL(url, location.href).origin === location.origin; } catch (e) { return false; }
  };

  // Should this click be handled in-page?
  function isInternal(a) {
    if (!a || !a.href) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download')) return false;
    if (!sameOrigin(a.href)) return false;
    const url = new URL(a.href, location.href);
    if (url.pathname === location.pathname && url.hash) return false; // in-page anchor
    return /\.html$/.test(url.pathname) || url.pathname.endsWith('/');
  }

  function reinit() {
    if (typeof window.initSite === 'function') { try { window.initSite(); } catch (e) {} }
    if (typeof window.initContact === 'function') { try { window.initContact(); } catch (e) {} }
    // keep the footer year fresh
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  let navigating = false;

  async function navigate(url, push) {
    if (navigating) return;
    navigating = true;
    try {
      const res = await fetch(url, { headers: { 'X-Requested-With': 'fetch' } });
      if (!res.ok) throw new Error('bad status');
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const newMain = doc.querySelector('main');
      const curMain = document.querySelector('main');
      if (!newMain || !curMain) throw new Error('no main');

      curMain.replaceWith(newMain);
      document.title = doc.title || document.title;

      // Update the header's right-side link (Contact vs. Close) to match.
      const newRight = doc.querySelector('.header__right');
      const curRight = document.querySelector('.header__right');
      if (newRight && curRight) curRight.innerHTML = newRight.innerHTML;

      if (push) history.pushState({ dq: true }, '', url);
      window.scrollTo({ top: 0, behavior: 'auto' });
      reinit();
    } catch (e) {
      // Graceful fallback: let the browser do a normal navigation.
      window.location.href = url;
    } finally {
      navigating = false;
    }
  }

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a');
    if (!isInternal(a)) return;
    e.preventDefault();
    const url = new URL(a.href, location.href).href;
    if (url === location.href) return;
    navigate(url, true);
  });

  window.addEventListener('popstate', () => navigate(location.href, false));
})();
