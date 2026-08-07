/* ============================================================
   DOOOQQQQ — Contact questionnaire (3 steps)
   Date  →  Service  →  Details
   Set CONTACT_EMAIL to the address the request should be sent to.
   ============================================================ */

(function () {
  // 👉 Replace with the real email before going live:
  const CONTACT_EMAIL = 'hello@example.com';

  const state = { date: null, service: null };

  const steps = Array.from(document.querySelectorAll('.step'));
  const labels = Array.from(document.querySelectorAll('.steps__item'));
  let current = 0;

  function show(i) {
    current = i;
    steps.forEach((s, idx) => s.classList.toggle('active', idx === i));
    labels.forEach((l, idx) => l.classList.toggle('active', idx === i));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('[data-next]').forEach((b) =>
    b.addEventListener('click', () => show(Math.min(current + 1, steps.length - 1)))
  );
  document.querySelectorAll('[data-back]').forEach((b) =>
    b.addEventListener('click', () => show(Math.max(current - 1, 0)))
  );

  function setNextEnabled(stepIdx, enabled) {
    const btn = steps[stepIdx].querySelector('[data-next]');
    if (btn) btn.disabled = !enabled;
  }

  /* ---------------- Step 1: Calendar ---------------- */
  const monthEl = document.getElementById('calMonth');
  const gridEl = document.getElementById('calGrid');
  const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Sun..Sat
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let view = new Date(today.getFullYear(), today.getMonth(), 1);

  function renderCalendar() {
    monthEl.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
    gridEl.innerHTML = '';

    DOW.forEach((d) => {
      const c = document.createElement('div');
      c.className = 'cal__dow';
      c.textContent = d;
      gridEl.appendChild(c);
    });

    const firstDay = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const e = document.createElement('div');
      e.className = 'cal__day is-empty';
      gridEl.appendChild(e);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'cal__day';
      cell.textContent = d;
      const date = new Date(view.getFullYear(), view.getMonth(), d);

      if (date < today) {
        cell.classList.add('is-past');
      } else {
        cell.addEventListener('click', () => {
          gridEl.querySelectorAll('.cal__day.selected').forEach((x) => x.classList.remove('selected'));
          cell.classList.add('selected');
          state.date = date;
          setNextEnabled(0, true);
        });
      }

      if (state.date && date.getTime() === state.date.getTime()) {
        cell.classList.add('selected');
      }
      gridEl.appendChild(cell);
    }
  }

  document.getElementById('calPrev').addEventListener('click', () => {
    view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    renderCalendar();
  });
  document.getElementById('calNext').addEventListener('click', () => {
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    renderCalendar();
  });
  renderCalendar();

  /* ---------------- Step 2: Service ---------------- */
  document.querySelectorAll('.service-opt').forEach((opt) => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.service-opt').forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      state.service = opt.dataset.value;
      setNextEnabled(1, true);
    });
  });

  /* ---------------- Step 3: Submit ---------------- */
  const form = document.getElementById('wizard');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const dateStr = state.date
      ? state.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : '—';

    const lines = [
      'New booking request — DOOOQQQQ',
      '',
      'Date: ' + dateStr,
      'Service: ' + (state.service || '—'),
      'Name: ' + (fd.get('name') || '—'),
      'Email: ' + (fd.get('email') || '—'),
      'Instagram: ' + (fd.get('instagram') || '—'),
      'Budget: ' + (fd.get('budget') || '—'),
      'Location: ' + (fd.get('location') || '—'),
      '',
      'Idea:',
      (fd.get('idea') || '—')
    ];

    const subject = encodeURIComponent('Booking request — ' + (state.service || '') + ' — ' + (fd.get('name') || ''));
    const body = encodeURIComponent(lines.join('\n'));

    form.style.display = 'none';
    document.querySelector('.steps').style.display = 'none';
    document.getElementById('thanks').style.display = 'block';

    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
  });
})();
