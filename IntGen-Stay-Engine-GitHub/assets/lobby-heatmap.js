(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const FLOORPLAN_URL = new URL('img/lobby-floorplan-wire.png', document.currentScript.src).href;

  function makeRows(rows) {
    return rows.flatMap(([x, y, count, dx, dy], rowIndex) =>
      Array.from({ length: count }, (_, index) => {
        const wobble = Math.sin((index + 1) * 1.73 + rowIndex * 0.91);
        const lift = Math.cos((index + 2) * 1.27 + rowIndex * 1.33);
        return [
          Math.round(x + index * dx + wobble * 1.45),
          Math.round(y + index * dy + lift * 0.9)
        ];
      })
    );
  }

  const zones = [
    {
      id: 'reception',
      name: 'Reception',
      count: 602,
      label: [228, 428],
      outline: 'M128 430 L380 372 L432 490 L178 558 Z',
      points: makeRows([
        [148, 470, 18, 12, -3],
        [158, 490, 19, 12, -3],
        [172, 511, 18, 12, -3],
        [194, 532, 15, 12, -3]
      ]),
      hot: 0.86
    },
    {
      id: 'central',
      name: 'Central Lounge',
      count: 503,
      label: [600, 426],
      outline: 'M512 430 L698 376 L786 458 L594 540 Z',
      points: makeRows([
        [532, 462, 14, 12, -4],
        [550, 482, 16, 12, -4],
        [572, 503, 15, 12, -4],
        [604, 524, 11, 12, -4]
      ]),
      hot: 0.72
    },
    {
      id: 'gate',
      name: 'Gate & Lift',
      count: 604,
      label: [922, 382],
      outline: 'M730 362 L1058 274 L1200 408 L872 552 Z',
      points: makeRows([
        [758, 398, 19, 12, -4],
        [780, 419, 21, 12, -4],
        [804, 441, 22, 12, -4],
        [832, 463, 20, 12, -4],
        [866, 486, 16, 12, -4]
      ]),
      hot: 0.94
    },
    {
      id: 'vip',
      name: 'VIP Lounge',
      count: 302,
      label: [628, 578],
      outline: 'M520 570 L706 508 L794 594 L604 704 Z',
      points: makeRows([
        [554, 610, 12, 12, -5],
        [582, 632, 13, 12, -5],
        [610, 654, 12, 12, -5],
        [640, 676, 9, 12, -5]
      ]),
      hot: 0.46
    },
    {
      id: 'east',
      name: 'East Lounge',
      count: 402,
      label: [1038, 544],
      outline: 'M914 558 L1114 492 L1248 576 L1040 706 Z',
      points: makeRows([
        [950, 594, 12, 12, -5],
        [978, 616, 14, 12, -5],
        [1006, 638, 13, 12, -5],
        [1036, 660, 10, 12, -5]
      ]),
      hot: 0.58
    }
  ];

  function createElement(name, attrs = {}) {
    const el = document.createElementNS(SVG_NS, name);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') {
        el.setAttribute('class', value);
      } else if (key === 'textContent') {
        el.textContent = value;
      } else {
        el.setAttribute(key, value);
      }
    });
    return el;
  }

  function densityHeight(zone, index, x, y) {
    const wave = Math.sin((x * 0.033) + (y * 0.021) + index * 0.73);
    const pulse = Math.cos(index * 1.41 + zone.hot * 2.6);
    const seed = Math.sin(index * 12.9898 + x * 0.7823 + y * 0.37719 + zone.hot * 9.31) * 43758.5453;
    const rand = seed - Math.floor(seed);
    const local = Math.max(0, Math.min(1, zone.hot * 0.35 + rand * 0.55 + wave * 0.08 + pulse * 0.07));

    if (rand < 0.23) return Math.round(6 + local * 22);
    if (rand > 0.78) return Math.round(72 + local * 42);
    return Math.round(20 + local * 66);
  }

  function columnWidth(index) {
    return 2.4 + (index % 4) * 0.45;
  }

  function colorProfile(zone, index, height) {
    const v = Math.abs(Math.sin(index * 1.91 + zone.hot * 4.7 + height * 0.033));
    const redEnd = Math.round(8 + v * 18 + zone.hot * 7);
    const amberEnd = Math.round(redEnd + 5 + (1 - v) * 5);
    const whiteStart = Math.round(amberEnd + 4 + v * 6);
    return {
      redEnd,
      amberEnd,
      whiteStart: Math.max(18, Math.min(54, whiteStart)),
      hot: zone.hot > 0.68 || height > 68
    };
  }

  function appendColumnGradient(defs, id, profile) {
    const gradient = createElement('linearGradient', {
      id,
      x1: '0',
      x2: '0',
      y1: '1',
      y2: '0'
    });
    const base = profile.hot ? '#e01515' : '#6f3d23';
    const mid = profile.hot ? '#ff6a38' : '#b2703d';
    gradient.append(createElement('stop', { offset: '0%', 'stop-color': base, 'stop-opacity': profile.hot ? '1' : '0.9' }));
    gradient.append(createElement('stop', { offset: `${profile.redEnd}%`, 'stop-color': base, 'stop-opacity': profile.hot ? '0.98' : '0.84' }));
    gradient.append(createElement('stop', { offset: `${profile.amberEnd}%`, 'stop-color': mid, 'stop-opacity': '0.86' }));
    gradient.append(createElement('stop', { offset: `${profile.whiteStart}%`, 'stop-color': '#fff0c2', 'stop-opacity': '0.94' }));
    gradient.append(createElement('stop', { offset: '100%', 'stop-color': '#ffffff', 'stop-opacity': '1' }));
    defs.append(gradient);
  }

  function renderDensityMap(originalSvg) {
    const stage = document.createElement('div');
    stage.className = 'lobby-density-stage';

    const svg = createElement('svg', {
      viewBox: '0 0 1360 768',
      role: 'img',
      'aria-label': 'Lobby guest density heatmap'
    });

    const defs = createElement('defs');
    defs.innerHTML = `
      <radialGradient id="lobby-column-cap" cx="50%" cy="46%" r="64%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
        <stop offset="60%" stop-color="#fff1bf" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#e01515" stop-opacity="0.16"/>
      </radialGradient>
      <filter id="lobby-column-glow" x="-70%" y="-30%" width="240%" height="170%">
        <feGaussianBlur stdDeviation="0.75" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="lobby-floor-glow">
        <feDropShadow dx="0" dy="0" stdDeviation="2.4" flood-color="#ffffff" flood-opacity="0.24"/>
      </filter>
    `;
    svg.append(defs);

    svg.append(createElement('rect', { width: '1360', height: '768', fill: '#010101' }));
    svg.append(createElement('image', {
      href: FLOORPLAN_URL,
      x: '0',
      y: '0',
      width: '1360',
      height: '768',
      preserveAspectRatio: 'xMidYMid meet',
      opacity: '0.92',
      filter: 'url(#lobby-floor-glow)'
    }));
    svg.append(createElement('path', {
      d: 'M92 590 L654 330 L1208 520',
      fill: 'none',
      stroke: 'rgba(255,255,255,0.28)',
      'stroke-width': '1.2',
      'stroke-dasharray': '7 8'
    }));

    const selectedId = originalSvg.dataset.lobbySelected || 'reception';
    zones.forEach((zone) => {
      const group = createElement('g', {
        className: `lobby-density-zone${zone.id === selectedId ? ' is-selected' : ''}`,
        'data-zone-id': zone.id
      });

      group.append(createElement('path', {
        className: 'zone-outline',
        d: zone.outline,
        fill: 'rgba(212,191,139,0.035)',
        stroke: 'rgba(255,238,196,0.78)',
        'stroke-width': '2',
        'stroke-linejoin': 'round'
      }));

      zone.points.forEach(([x, y], index) => {
        const width = columnWidth(index);
        const height = densityHeight(zone, index, x, y);
        const gradientId = `lobby-column-${zone.id}-${index}`;
        appendColumnGradient(defs, gradientId, colorProfile(zone, index, height));
        const column = createElement('g', {
          className: 'lobby-density-column',
          filter: 'url(#lobby-column-glow)',
          style: `animation-delay:${index * 14}ms`
        });
        column.append(createElement('ellipse', {
          cx: x,
          cy: y + 2,
          rx: width * 1.28,
          ry: '1.2',
          fill: 'rgba(224,21,21,0.18)'
        }));
        column.append(createElement('rect', {
          x: x - width / 2,
          y: y - height,
          width,
          height,
          rx: '0.5',
          fill: `url(#${gradientId})`
        }));
        column.append(createElement('ellipse', {
          cx: x,
          cy: y - height + 1,
          rx: width / 2,
          ry: '1.15',
          fill: 'url(#lobby-column-cap)'
        }));
        group.append(column);
      });

      group.append(createElement('text', {
        className: 'lobby-density-label',
        x: zone.label[0],
        y: zone.label[1],
        fill: zone.id === selectedId ? '#fff3c9' : 'rgba(255,255,255,0.74)',
        textContent: zone.name
      }));
      group.append(createElement('text', {
        className: 'lobby-density-count',
        x: zone.label[0],
        y: zone.label[1] + 21,
        fill: zone.hot > 0.68 ? '#f3b06b' : '#d4bf8b',
        textContent: zone.count
      }));

      group.addEventListener('click', () => {
        svg.querySelectorAll('.lobby-density-zone').forEach((item) => item.classList.remove('is-selected'));
        group.classList.add('is-selected');
        originalSvg.dataset.lobbySelected = zone.id;
      });

      svg.append(group);
    });

    svg.append(createElement('image', {
      href: FLOORPLAN_URL,
      x: '0',
      y: '0',
      width: '1360',
      height: '768',
      preserveAspectRatio: 'xMidYMid meet',
      opacity: '0.36',
      style: 'mix-blend-mode:screen;pointer-events:none'
    }));

    stage.append(svg);
    originalSvg.replaceWith(stage);
  }

  function enhance() {
    const headings = Array.from(document.querySelectorAll('h2'));
    const staffingHeading = headings.find((heading) => heading.textContent.trim() === 'Recommended Staffing');
    const section = staffingHeading && staffingHeading.closest('section');
    const originalSvg = section && section.querySelector('svg:not([data-lobby-enhanced])');
    if (!originalSvg || section.querySelector('.lobby-density-stage')) return false;
    originalSvg.dataset.lobbyEnhanced = 'true';
    renderDensityMap(originalSvg);
    return true;
  }

  const observer = new MutationObserver(() => {
    if (enhance()) observer.disconnect();
  });

  window.addEventListener('DOMContentLoaded', () => {
    if (!enhance()) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
})();
