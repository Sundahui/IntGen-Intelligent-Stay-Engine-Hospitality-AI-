(function () {
  const driverConfigs = {
    'Base Occupancy': {
      key: 'BO',
      title: 'Base Occupancy',
      source: 'Historical PMS and access telemetry',
      render: () => `
        <section class="forecast-driver-card">
          <div class="forecast-driver-card__label">Baseline from prior stay patterns</div>
          <div class="driver-metric-grid">
            <div class="driver-metric"><span>Current</span><strong>78%</strong></div>
            <div class="driver-metric"><span>7-day avg</span><strong>72%</strong></div>
            <div class="driver-metric"><span>Variance</span><strong>+6%</strong></div>
          </div>
          <div class="history-chart" aria-label="Historical occupancy trend">
            ${[54, 62, 58, 71, 74, 68, 78, 82, 73, 76, 84, 79].map(v => `<i style="--h:${v}%"></i>`).join('')}
          </div>
          <div class="forecast-driver-cta">API target: connect PMS occupancy history, same-day booking pickup, cancellation rate, and hourly access counts.</div>
        </section>
        <section class="forecast-driver-card">
          <div class="forecast-driver-card__label">Operational read</div>
          <div class="signal-list">
            <div class="signal-row"><span>14:00</span><strong>Check-in compression above baseline</strong><em class="impact-pill">Medium</em></div>
            <div class="signal-row"><span>15:00</span><strong>Lobby seating utilization expected to rise</strong><em class="impact-pill">High</em></div>
            <div class="signal-row"><span>16:30</span><strong>Arrival curve normalizes after group check-in</strong><em class="impact-pill">Low</em></div>
          </div>
        </section>`
    },
    'Event Impact': {
      key: 'EV',
      title: 'Event Impact',
      source: 'Hotel event calendar',
      render: () => `
        <section class="forecast-driver-card">
          <div class="forecast-driver-card__label">Event calendar proximity</div>
          <div class="mini-calendar">
            ${Array.from({ length: 14 }, (_, i) => `<span class="${[3, 7, 10].includes(i) ? 'has-event' : ''}">${i + 17}${[3, 7, 10].includes(i) ? '<br>Event' : ''}</span>`).join('')}
          </div>
        </section>
        <section class="forecast-driver-card">
          <div class="forecast-driver-card__label">Upcoming drivers</div>
          <div class="event-list">
            <div class="event-row"><span>Today<br>14:30</span><strong>Regional leadership arrival</strong><em class="impact-pill">+8%</em></div>
            <div class="event-row"><span>Today<br>18:00</span><strong>Ballroom dinner reception</strong><em class="impact-pill">+11%</em></div>
            <div class="event-row"><span>Tomorrow<br>09:00</span><strong>Conference breakfast wave</strong><em class="impact-pill">+6%</em></div>
          </div>
          <div class="forecast-driver-cta">API target: connect event calendar, banquet schedule, guest list ETA, room block arrivals, and venue turnover reminders.</div>
        </section>`
    },
    'Weather Impact': {
      key: 'WX',
      title: 'Weather Impact',
      source: 'Weather API forecast',
      render: () => `
        <section class="forecast-driver-card">
          <div class="weather-now">
            <div>
              <div class="forecast-driver-card__label">Sunway Resort Area</div>
              <div class="weather-now__temp">31</div>
              <div class="weather-now__copy">Warm, partly cloudy. Afternoon shower risk may shift arrivals from outdoor zones back into lobby and F&B.</div>
            </div>
            <div class="weather-glyph" aria-hidden="true"></div>
          </div>
        </section>
        <section class="forecast-driver-card">
          <div class="forecast-driver-card__label">Hourly forecast</div>
          <div class="hourly-strip">
            ${[
              ['Now', '31', '#fff'], ['15', '32', '#fff1bf'], ['16', '30', '#d4bf8b'], ['17', '29', '#e01515'],
              ['18', '28', '#e01515'], ['19', '28', '#d4bf8b'], ['20', '27', '#fff1bf'], ['21', '27', '#fff']
            ].map(([h, t, c]) => `<div class="hourly-cell"><b>${h}</b><div class="forecast-dot" style="--dot:${c}"></div><span>${t} C</span></div>`).join('')}
          </div>
        </section>
        <section class="forecast-driver-card">
          <div class="forecast-driver-card__label">Next 5 days</div>
          <div class="day-list">
            ${[
              ['Tue', 'Scattered rain', '72'], ['Wed', 'Cloudy', '54'], ['Thu', 'Storm risk', '88'], ['Fri', 'Warm', '45'], ['Sat', 'Clear', '35']
            ].map(([d, label, w]) => `<div class="day-row"><b>${d}</b><div><span>${label}</span><div class="day-bar"><i style="--w:${w}%"></i></div></div><b>${w}%</b></div>`).join('')}
          </div>
          <div class="forecast-driver-cta">API target: current conditions, hourly forecast, precipitation probability, severe weather alerts, and arrival-zone weighting.</div>
        </section>`
    },
    'Promotional Impact': {
      key: 'PR',
      title: 'Promotional Impact',
      source: 'Campaign and offer engine',
      render: () => `
        <section class="forecast-driver-card">
          <div class="driver-metric-grid">
            <div class="driver-metric"><span>Offer pull</span><strong>-3%</strong></div>
            <div class="driver-metric"><span>Redemption</span><strong>18%</strong></div>
            <div class="driver-metric"><span>Lift risk</span><strong>Low</strong></div>
          </div>
        </section>
        <section class="forecast-driver-card">
          <div class="forecast-driver-card__label">Campaign signals</div>
          <div class="signal-list">
            <div class="signal-row"><span>App</span><strong>Suite upgrade offer tapering</strong><em class="impact-pill">-2%</em></div>
            <div class="signal-row"><span>F&B</span><strong>Dinner voucher opens at 17:00</strong><em class="impact-pill">+4%</em></div>
            <div class="signal-row"><span>Spa</span><strong>Low campaign pressure today</strong><em class="impact-pill">Flat</em></div>
          </div>
          <div class="forecast-driver-cta">API target: campaign calendar, offer redemption, guest segments, channel mix, and real-time conversion.</div>
        </section>`
    },
    'Final Forecast': {
      key: 'FF',
      title: 'Final Forecast',
      source: 'Demand model output',
      render: () => `
        <section class="forecast-driver-card">
          <div class="driver-metric-grid">
            <div class="driver-metric"><span>Forecast</span><strong>92%</strong></div>
            <div class="driver-metric"><span>Peak</span><strong>15:40</strong></div>
            <div class="driver-metric"><span>Action</span><strong>+6 staff</strong></div>
          </div>
        </section>
        <section class="forecast-driver-card">
          <div class="forecast-driver-card__label">Model composition</div>
          <div class="signal-list">
            <div class="signal-row"><span>Base</span><strong>Historical occupancy and check-in curve</strong><em class="impact-pill">78%</em></div>
            <div class="signal-row"><span>Event</span><strong>Calendar-driven arrival compression</strong><em class="impact-pill">+12%</em></div>
            <div class="signal-row"><span>Weather</span><strong>Outdoor-to-indoor flow adjustment</strong><em class="impact-pill">+5%</em></div>
            <div class="signal-row"><span>Promo</span><strong>Offer taper reduces incremental arrivals</strong><em class="impact-pill">-3%</em></div>
          </div>
        </section>`
    },
    'Forecast Confidence': {
      key: 'CF',
      title: 'Forecast Confidence',
      source: 'Model confidence diagnostics',
      render: () => `
        <section class="forecast-driver-card">
          <div class="driver-metric-grid">
            <div class="driver-metric"><span>Confidence</span><strong>87%</strong></div>
            <div class="driver-metric"><span>Data health</span><strong>Good</strong></div>
            <div class="driver-metric"><span>Drift</span><strong>Low</strong></div>
          </div>
        </section>
        <section class="forecast-driver-card">
          <div class="forecast-driver-card__label">Confidence inputs</div>
          <div class="signal-list">
            <div class="signal-row"><span>PMS</span><strong>Room inventory sync complete</strong><em class="impact-pill">98%</em></div>
            <div class="signal-row"><span>Sensor</span><strong>Lobby counter heartbeat stable</strong><em class="impact-pill">94%</em></div>
            <div class="signal-row"><span>Calendar</span><strong>Event data updated 11 min ago</strong><em class="impact-pill">86%</em></div>
            <div class="signal-row"><span>Weather</span><strong>Forecast uncertainty rising after 17:00</strong><em class="impact-pill">72%</em></div>
          </div>
          <div class="forecast-driver-cta">API target: source freshness, missing data checks, model drift, prediction interval, and fallback state.</div>
        </section>`
    }
  };

  function createDrawer() {
    const backdrop = document.createElement('div');
    backdrop.className = 'forecast-driver-backdrop';
    const drawer = document.createElement('aside');
    drawer.className = 'forecast-driver-drawer';
    drawer.innerHTML = `
      <header class="forecast-driver-drawer__head">
        <div class="forecast-driver-drawer__mark"></div>
        <div>
          <div class="forecast-driver-drawer__eyebrow"></div>
          <h2 class="forecast-driver-drawer__title"></h2>
        </div>
        <button class="forecast-driver-drawer__close" type="button" aria-label="Close forecast driver">x</button>
      </header>
      <div class="forecast-driver-drawer__body"></div>
    `;
    const close = () => {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
    };
    drawer.querySelector('.forecast-driver-drawer__close').addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.body.append(backdrop, drawer);
    return { backdrop, drawer };
  }

  function openDriver(label) {
    const config = driverConfigs[label];
    if (!config) return;
    const ui = window.__forecastDriverDrawer || (window.__forecastDriverDrawer = createDrawer());
    ui.drawer.querySelector('.forecast-driver-drawer__mark').textContent = config.key;
    ui.drawer.querySelector('.forecast-driver-drawer__eyebrow').textContent = config.source;
    ui.drawer.querySelector('.forecast-driver-drawer__title').textContent = config.title;
    ui.drawer.querySelector('.forecast-driver-drawer__body').innerHTML = config.render();
    ui.drawer.classList.add('is-open');
    ui.backdrop.classList.add('is-open');
  }

  function enhanceDrivers() {
    const heading = Array.from(document.querySelectorAll('h1, h2')).find(el => el.textContent.trim() === 'Forecast Drivers');
    const section = heading && heading.closest('section');
    if (!section || section.dataset.forecastDriversEnhanced === 'true') return false;
    const cards = Array.from(section.querySelectorAll('article'));
    cards.forEach(card => {
      const label = Object.keys(driverConfigs).find(name => card.textContent.includes(name));
      if (!label) return;
      card.classList.add('forecast-driver-clickable');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Open ${label} details`);
      card.addEventListener('click', () => openDriver(label));
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDriver(label);
        }
      });
    });
    section.dataset.forecastDriversEnhanced = 'true';
    return true;
  }

  const observer = new MutationObserver(() => {
    if (enhanceDrivers()) observer.disconnect();
  });

  window.addEventListener('DOMContentLoaded', () => {
    if (!enhanceDrivers()) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
})();
