/* =========================================================================
   Aura — shared shell: sidebar nav, topbar clock, pills, toast.
   Each page sets  window.AURA_PAGE = '<id>'  before loading this script.
   ========================================================================= */
(function () {
  const PAGE = window.AURA_PAGE || 'live';
  const OPS_PAGE = document.body.classList.contains('ops-page');

  const NAV = [
    { group: 'Operations' },
    { id: 'live', href: 'index.html', ico: '◎', label: 'Live Surveillance',
      sub: [
        { href: 'index.html#lobby', label: 'Lobby & Public Areas', zone: 'lobby', badge: 3 },
        { href: 'index.html#fnb',   label: 'F&B & Leisure',        zone: 'fnb', badge: 1 },
        { href: 'index.html#rooms', label: 'Guest Floors',         zone: 'rooms', badge: 2 },
      ]},
    { id: 'events',     href: 'events.html',     ico: '⚡', label: 'Security Incidents', badge: 8 },
    { id: 'voice',      href: 'voice.html',      ico: '🎙', label: 'Voice AI Execution' },
    { id: 'escalation', href: 'escalation.html', ico: '↑', label: 'Escalation Matrix' },
    { group: 'Intelligence' },
    { id: 'risk',       href: 'risk.html',       ico: '◔', label: 'Risk Forecast' },
    { id: 'systems',    href: 'systems.html',    ico: '⊞', label: 'Connected Systems' },
    { id: 'analytics',  href: 'analytics.html',  ico: '◫', label: 'Resolution Analytics' },
  ];

  function navHtml() {
  let h = ``;

    NAV.forEach(n => {
      if (n.group) { h += `<div class="nav-label">${n.group}</div>`; return; }
      const active = n.id === PAGE;
      if (n.sub) {
        h += `<a class="nav-item has-sub ${active ? 'active' : ''}" href="${n.href}" data-nav-id="${n.id}">${OPS_PAGE ? '' : `<span class="ico">${n.ico}</span>`}<span class="nav-text">${n.label}</span> <span class="chev" role="button" aria-label="Expand Live Surveillance">▾</span></a>`;
        h += `<div class="submenu" data-submenu-for="${n.id}">` + n.sub.map(s =>
          `<a class="sub-item" href="${s.href}">${s.label}${navBadge(s) != null ? `<span class="badge">${navBadge(s)}</span>` : ''}</a>`).join('') + `</div>`;
      } else {
        h += `<a class="nav-item ${active ? 'active' : ''}" href="${n.href}">${OPS_PAGE ? '' : `<span class="ico">${n.ico}</span>`}<span class="nav-text">${n.label}</span>${n.badge != null ? `<span class="badge">${n.badge}</span>` : ''}</a>`;
      }
    });
    h += `<div style="flex:1"></div>
      <a class="nav-item" style="color:var(--text-faint)" href="#">${OPS_PAGE ? '' : '<span class="ico">⚙</span>'} Settings</a>`;
    return h;
  }

function navBadge(item) {
  if (item.zone && Array.isArray(window.AURA_EVENTS)) {
    return window.AURA_EVENTS.filter(e => e.zone === item.zone && e.stage < 6).length;
  }

  return item.badge;
}

function topbarHtml(crumb) {
  const menuLabel = '☰';
  return `
    <div class="topbar-left">
      <button class="topbar-menu-btn" id="sidebarToggle">${menuLabel}</button>

      <div class="topbar-brand">
        <img src="assets/sunway-intgen-logo.png" class="topbar-logo" alt="Sunway IntGen">
        <span class="topbar-title">Security Command Center</span>
      </div>
    </div>

    <span class="spacer"></span>

    <span class="clock" id="clock"></span>`;
}

  // ---- mount sidebar + topbar if placeholders exist ----
  const sb = document.querySelector('.sidebar');
if (sb) {
  sb.innerHTML = `
    <div class="sidebar-drawer open" id="sidebarDrawer">
      ${navHtml()}
    </div>
  `;
}
  const tb = document.querySelector('.topbar');
  if (tb && !tb.dataset.custom) tb.innerHTML = topbarHtml(tb.dataset.crumb || 'Command Center');
  const defaultSidebarToggle = document.getElementById('sidebarToggle');
  if (defaultSidebarToggle) defaultSidebarToggle.classList.add('open');

  // ---- clock ----
  function tick() {
    const el = document.getElementById('clock'); if (!el) return;
    const d = new Date();
    el.textContent = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      + ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  setInterval(tick, 1000); tick();

  // ---- toast (global) ----
  let toastEl = document.getElementById('toast');
  if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.id = 'toast'; document.body.appendChild(toastEl); }
  let toastTimer;
  window.toast = function (msg) {
    toastEl.innerHTML = `<span class="dot live"></span>${msg}`;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3400);
  };

  // ---- pill toggles ----
  const feed = document.getElementById('feedPill');
  if (feed) feed.addEventListener('click', function () {
    const on = this.textContent.includes('On');
    this.innerHTML = `<span class="dot ${on ? '' : 'live'}" style="${on ? 'background:var(--text-faint)' : ''}"></span> Live feed: ${on ? 'Off' : 'On'}`;
    window.toast(on ? 'Live feed paused' : 'Live feed resumed — events stream in real time');
  });
  const ap = document.getElementById('autopilotPill');
  if (ap) ap.addEventListener('click', function () {
    const on = this.textContent.includes('On');
    this.innerHTML = `<span class="dot" style="background:${on ? 'var(--text-faint)' : 'var(--accent-2)'}"></span> AI Autopilot: ${on ? 'Off' : 'On'}`;
    window.toast(on ? 'AI Autopilot paused — recommendations require manual approval' : 'AI Autopilot on — low-risk actions auto-executed');
  });


const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarDrawer = document.getElementById('sidebarDrawer');

if (sidebarToggle && sidebarDrawer) {
sidebarToggle.addEventListener('click', function () {
  const isOpen = sidebarDrawer.classList.toggle('open');
  sidebarToggle.classList.toggle('open', isOpen);
  updateMapSwitcher();
});
}

function updateMapSwitcher() {
  const mapSwitcher = document.getElementById('mapSwitcher');
  if (!mapSwitcher || !sidebarDrawer) return;

  const liveOpen = !!document.querySelector('[data-nav-id="live"].open');
  mapSwitcher.classList.toggle('hidden', !(sidebarDrawer.classList.contains('open') && liveOpen));
}

document.querySelectorAll('.nav-item.has-sub .chev').forEach(btn => {
  btn.addEventListener('click', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    const nav = this.closest('.nav-item.has-sub');
    const id = nav && nav.dataset.navId;
    const submenu = id ? document.querySelector(`[data-submenu-for="${id}"]`) : null;
    const isOpen = nav.classList.toggle('open');

    if (submenu) submenu.classList.toggle('open', isOpen);
    this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    updateMapSwitcher();
  });
});

updateMapSwitcher();
})();
