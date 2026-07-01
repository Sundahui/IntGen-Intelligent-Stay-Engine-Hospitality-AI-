/*
 * console-rail.js
 * Injects a collapsed icon-rail sidebar onto the Demand Forecasting console
 * (operations / lobby). Mirrors the dashboard nav so the navigation feels
 * consistent; stays collapsed to a thin icon strip and expands on hover so
 * you can always click back to the Dashboard. Pure overlay — it never touches
 * the React app's #root or its layout.
 */
(function () {
  // Paths are relative to operations/index.html and lobby/index.html (both one
  // level below the project root).
  var DASHBOARD = '../dashboard.html';
  var LOGO = '../assets/img/sunway-intgen-logo.png';

  var modules = [
    { ic: '🏠', label: 'Executive Dashboard', num: '01', locked: true },
    { ic: '🎙️', label: 'Voice AI',            num: '02', locked: true },
    { ic: '📈', label: 'Demand Forecasting',  num: '03', active: true },
    { ic: '🧑‍💼', label: 'Avatar Concierge', num: '04', locked: true },
    { ic: '🛎️', label: 'Smart Booking',       num: '05', locked: true },
    { ic: '🎓', label: 'AI Training',         num: '06', locked: true }
  ];

  function row(m) {
    var cls = 'rail__item' + (m.locked ? ' locked' : '') + (m.active ? ' active' : '');
    var lockIc = m.locked ? '🔒' : m.ic;
    var inner =
      '<span class="rail__ic">' + lockIc + '</span>' +
      '<span class="rail__label">' + m.label + '</span>' +
      '<span class="rail__num">' + m.num + '</span>';
    if (m.locked) {
      return '<span class="' + cls + '" aria-disabled="true">' + inner + '</span>';
    }
    // The unlocked Demand Forecasting row just keeps you in the console.
    return '<a class="' + cls + '" href="#/operations">' + inner + '</a>';
  }

  function build() {
    if (document.getElementById('console-rail')) return;
    var rail = document.createElement('nav');
    rail.id = 'console-rail';
    rail.setAttribute('aria-label', 'Console navigation');
    rail.innerHTML =
      '<a class="rail__brand" href="' + DASHBOARD + '" title="Back to Dashboard">' +
        '<img src="' + LOGO + '" alt="SUNWAY IntGen" />' +
      '</a>' +
      '<span class="rail__section">Overview</span>' +
      '<a class="rail__item" href="' + DASHBOARD + '" title="Back to Dashboard">' +
        '<span class="rail__ic">◧</span>' +
        '<span class="rail__label">Dashboard</span>' +
      '</a>' +
      '<span class="rail__section">Workspaces</span>' +
      modules.map(row).join('') +
      '<span class="rail__spacer"></span>';
    document.body.appendChild(rail);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
