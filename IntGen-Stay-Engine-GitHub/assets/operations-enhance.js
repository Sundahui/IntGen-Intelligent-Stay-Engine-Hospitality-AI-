(function () {
  const summaries = {
    'Lobby Sensor': 'Primary arrival signal for lobby demand, walk-in flow, and check-in queue pressure.',
    'Main Access Hub': 'Aggregates entrances, lift lobby movement, and cross-zone traffic into the operations graph.',
    'Front Desk Node': 'Tracks desk utilization, queue build-up, and staffing pressure at check-in counters.',
    'Concierge Station': 'Monitors service requests, guest routing, and concierge response load.',
    'Guest Arrival Zone': 'Captures curbside arrivals, luggage handoff volume, and incoming guest pulses.',
    'Food & Beverage Zone': 'Critical demand area combining dining reservations, walk-ins, and service load.',
    'Spa Checkpoint': 'Spa access point for appointment arrivals and dwell-time monitoring.',
    'Pool Activity No...': 'Outdoor leisure activity signal with elevated crowd and amenity demand.',
    'Conference Wing Node': 'Event-side traffic and meeting room activity signal.',
    'Gym Entry Monitor': 'Fitness facility entry and utilization monitor.'
  };

  function statusLabel(status) {
    if (status === 'critical') return 'Critical';
    if (status === 'warning') return 'Warning';
    return 'Active';
  }

  function ensurePanel() {
    let panel = document.querySelector('.ops-node-panel');
    if (panel) return panel;
    panel = document.createElement('aside');
    panel.className = 'ops-node-panel';
    panel.innerHTML = `
      <div class="ops-node-panel__head">
        <span class="ops-node-panel__icon"></span>
        <div>
          <h3 class="ops-node-panel__title"></h3>
          <div class="ops-node-panel__meta"></div>
        </div>
        <button class="ops-node-panel__close" type="button" aria-label="Close node details">×</button>
      </div>
      <div class="ops-node-panel__body">
        <div class="ops-node-panel__grid">
          <div class="ops-node-panel__metric"><span>Health</span><strong data-health></strong></div>
          <div class="ops-node-panel__metric"><span>Count</span><strong data-count></strong></div>
          <div class="ops-node-panel__metric"><span>Status</span><strong data-status></strong></div>
        </div>
        <p class="ops-node-panel__summary"></p>
        <div class="ops-node-panel__bar"><i></i></div>
      </div>
    `;
    panel.querySelector('.ops-node-panel__close').addEventListener('click', () => {
      panel.classList.remove('is-open');
    });
    document.body.append(panel);
    return panel;
  }

  function showNode(detail) {
    if (!detail || !detail.name) return;
    if (detail.name === 'Lobby Sensor') {
      window.location.href = '../lobby/index.html#/lobby';
      return;
    }
    const panel = ensurePanel();
    panel.querySelector('.ops-node-panel__title').textContent = detail.name;
    panel.querySelector('.ops-node-panel__meta').textContent = `${detail.kind || 'node'} / ${statusLabel(detail.status)}`;
    panel.querySelector('[data-health]').textContent = `${detail.healthPercent}%`;
    panel.querySelector('[data-count]').textContent = Number(detail.count || 0).toLocaleString();
    panel.querySelector('[data-status]').textContent = statusLabel(detail.status);
    panel.querySelector('.ops-node-panel__summary').textContent = summaries[detail.name] || 'Live operational signal with current utilization, guest activity, and service pressure telemetry.';
    panel.querySelector('.ops-node-panel__bar i').style.setProperty('--health', `${detail.healthPercent || 0}%`);
    panel.classList.add('is-open');
  }

  window.addEventListener('operations-node-select', (event) => showNode(event.detail));
})();
