/* Shared left-nav renderer.
   Each page sets <body data-page="..." data-base=""> (base = "" root, "../" inside /modules).
   Pages: dashboard | voice-ai | avatar-concierge | workforce-intelligence | smart-booking | ai-training
*/
(function () {
  const body = document.body;
  const page = body.dataset.page || '';
  const base = body.dataset.base || '';

  const modules = [
    { id: 'executive-dashboard', label: 'Executive Dashboard', idx: '01', locked: true },
    { id: 'voice-ai', label: 'Voice AI', idx: '02', locked: true },
    { id: 'demand-forecasting', label: 'Demand Forecasting', href: base + 'operations/index.html', idx: '03' },
    { id: 'avatar-concierge', label: 'Avatar Concierge', idx: '04', locked: true },
    { id: 'smart-booking', label: 'Smart Booking', idx: '05', locked: true },
    { id: 'ai-training', label: 'AI Training', idx: '06', locked: true }
  ];

  const act = (id) => page === id ? ' active' : '';

  const modHtml = modules.map(m => {
    if (m.locked) {
      return `<span class="nav__item locked" aria-disabled="true"><span>🔒 ${m.label}</span><span class="idx">${m.idx}</span></span>`;
    }

    return `<a class="nav__item${act(m.id)}" href="${m.href}"><span>${m.label}</span><span class="idx">${m.idx}</span></a>`;
  }).join('');

  const html = `
    <a class="nav__brand logo" href="${base}index.html">
      <img class="logo__img" src="${base}assets/img/sunway-intgen-logo.png" alt="SUNWAY IntGen" />
    </a>

    <span class="nav__section-label">Overview</span>
    <span class="nav__item locked" aria-disabled="true"><span>🔒 Dashboard</span></span>

    <span class="nav__section-label">Workspaces</span>
    ${modHtml}

    <div class="nav__foot">
      <div class="nav__user">
        <span class="nav__avatar">QS</span>
        <span class="meta"><b>Q. Sun</b><span>Operations Director</span></span>
      </div>
    </div>
  `;

  const nav = document.getElementById('nav');
  if (nav) nav.innerHTML = html;

  // reveal observer for any app page
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();
