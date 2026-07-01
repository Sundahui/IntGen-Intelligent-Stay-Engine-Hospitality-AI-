/* ============================================================
   Demand Forecasting - data + visualization engine
   Hotel venue map, demand forecast, staffing recommendations.
   Pure JS, no chart library.
   ============================================================ */
(function () {
  // ---- Hotel zones (the "venue map") -----------------------
  // x,y,w,h are % of the stage. occ = current occupancy %.
  const ZONES = [
    { id:'lobby',   name:'Main Lobby',        x:38, y:42, w:24, h:18, occ:74, cap:400, staff:6 },
    { id:'recep',   name:'Reception / Check-in', x:38, y:62, w:24, h:12, occ:91, cap:120, staff:5 },
    { id:'dining',  name:'Grand Dining',      x:4,  y:4,  w:30, h:24, occ:96, cap:320, staff:9 },
    { id:'cafe',    name:'Lobby Café',        x:4,  y:30, w:18, h:14, occ:62, cap:90,  staff:3 },
    { id:'bar',     name:'Sky Bar',           x:66, y:4,  w:30, h:18, occ:48, cap:150, staff:4 },
    { id:'pool',    name:'Pool Deck',         x:66, y:24, w:30, h:24, occ:88, cap:260, staff:5 },
    { id:'gym',     name:'Fitness Center',    x:66, y:50, w:18, h:16, occ:35, cap:80,  staff:2 },
    { id:'spa',     name:'Spa & Wellness',    x:85, y:50, w:11, h:16, occ:57, cap:60,  staff:4 },
    { id:'ball',    name:'Ballroom',          x:4,  y:46, w:30, h:28, occ:23, cap:600, staff:3 },
    { id:'kids',    name:'Kids Club',         x:38, y:4,  w:24, h:14, occ:41, cap:70,  staff:3 },
    { id:'retail',  name:'Retail Arcade',     x:38, y:20, w:24, h:18, occ:69, cap:140, staff:4 },
    { id:'valet',   name:'Valet / Entrance',  x:66, y:68, w:30, h:14, occ:82, cap:100, staff:4 },
    { id:'conf',    name:'Conference Hall',   x:4,  y:76, w:30, h:20, occ:14, cap:450, staff:2 },
    { id:'rooftop', name:'Rooftop Lounge',    x:38, y:78, w:24, h:18, occ:53, cap:180, staff:3 }
  ];

  const level = (o) => o >= 90 ? 'full' : o >= 70 ? 'high' : o >= 45 ? 'med' : 'low';

  // ---- count-up animation ----------------------------------
  function countUp(el, target, opts = {}) {
    const dur = opts.dur || 1200;
    const dec = opts.dec || 0;
    const start = performance.now();
    const from = 0;
    function step(now) {
      const t = Math.max(0, Math.min(1, (now - start) / dur));
      const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const v = from + (target - from) * e;
      el.textContent = opts.fmt ? opts.fmt(v) : v.toFixed(dec);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = opts.fmt ? opts.fmt(target) : target.toFixed(dec);
    }
    requestAnimationFrame(step);
  }
  const commafy = (n) => Math.round(n).toLocaleString('en-US');

  // ---- render venue map ------------------------------------
  function renderMap() {
    const stage = document.getElementById('venueStage');
    const flow = document.getElementById('flowLayer');
    if (!stage) return;
    stage.querySelectorAll('.zone').forEach(z => z.remove());

    ZONES.forEach((z, i) => {
      const el = document.createElement('div');
      el.className = 'zone';
      el.dataset.level = level(z.occ);
      el.style.left = z.x + '%'; el.style.top = z.y + '%';
      el.style.width = z.w + '%'; el.style.height = z.h + '%';
      el.style.opacity = '0';
      el.innerHTML = `
        <div class="zone__name">${z.name}</div>
        <div class="zone__occ"><span data-occ>0</span><small>% full</small></div>
        <div class="zone__pulse"></div>`;
      el.title = `${z.name} - ${z.occ}% (${Math.round(z.cap*z.occ/100)}/${z.cap}) · ${z.staff} staff`;
      stage.appendChild(el);
      // staggered reveal + count up occupancy
      setTimeout(() => {
        el.style.transition = 'opacity .5s ease';
        el.style.opacity = '1';
        countUp(el.querySelector('[data-occ]'), z.occ, { dur: 900 });
      }, 300 + i * 70);
    });

    // crowd-flow dots travelling between busy zones
    spawnFlow(flow);
  }

  // animated crowd flow between high-traffic zones
  function spawnFlow(layer) {
    if (!layer) return;
    const paths = [
      ['valet','recep'], ['recep','lobby'], ['lobby','dining'],
      ['lobby','retail'], ['lobby','pool'], ['pool','bar'], ['recep','kids']
    ];
    const center = (id) => { const z = ZONES.find(z=>z.id===id); return { x: z.x + z.w/2, y: z.y + z.h/2 }; };
    let n = 0;
    function emit() {
      const [a,b] = paths[n % paths.length]; n++;
      const A = center(a), B = center(b);
      const dot = document.createElement('div');
      dot.className = 'flow-dot';
      dot.style.left = A.x + '%'; dot.style.top = A.y + '%';
      layer.appendChild(dot);
      const dur = 2200 + Math.round((n*137)%900); // deterministic-ish variation
      dot.animate([
        { left:A.x+'%', top:A.y+'%', opacity:0 },
        { opacity:1, offset:0.15 },
        { opacity:1, offset:0.85 },
        { left:B.x+'%', top:B.y+'%', opacity:0 }
      ], { duration: dur, easing:'ease-in-out' }).onfinish = () => dot.remove();
    }
    setInterval(emit, 420);
  }

  // ---- metric sparklines -----------------------------------
  function renderSparks() {
    document.querySelectorAll('.metric__spark[data-vals]').forEach(s => {
      const vals = s.dataset.vals.split(',').map(Number);
      const max = Math.max(...vals);
      s.innerHTML = vals.map(()=>'<i style="height:0"></i>').join('');
      requestAnimationFrame(() => {
        [...s.children].forEach((b,i)=>{ b.style.height=(vals[i]/max*100)+'%'; b.style.transitionDelay=(i*40)+'ms'; });
      });
    });
  }

  // ---- staffing recommendations (derived from occupancy) ---
  function renderRecs() {
    const wrap = document.getElementById('recList'); if (!wrap) return;
    const scored = ZONES.map(z => {
      const guestsPerStaff = Math.round((z.cap*z.occ/100)/Math.max(1,z.staff));
      return { z, gps: guestsPerStaff };
    }).sort((a,b)=>b.gps-a.gps);
    const top = scored.slice(0,5);
    wrap.innerHTML = top.map(({z,gps})=>{
      let action, cls;
      if (gps > 55) { action = '+ Add staff'; cls='add'; }
      else if (gps > 35) { action = '↔ Reassign'; cls='move'; }
      else { action = '✓ Hold'; cls='hold'; }
      const load = Math.min(100, Math.round(gps/70*100));
      return `<div class="rec">
        <span class="rec__zone">${z.name}</span>
        <span class="rec__action ${cls}">${action}</span>
        <span class="rec__now">${gps} guests / staff · ${z.staff} on shift</span>
        <span></span>
        <span class="rec__bar"><i style="width:0" data-w="${load}"></i></span>
      </div>`;
    }).join('');
    requestAnimationFrame(()=> wrap.querySelectorAll('.rec__bar i').forEach(i=> i.style.width = i.dataset.w + '%'));
  }

  // ---- forecast heat strip (zone x hour) -------------------
  function renderHeat() {
    const wrap = document.getElementById('heatGrid'); if (!wrap) return;
    const zones = ['Grand Dining','Pool Deck','Lobby','Sky Bar','Spa','Ballroom'];
    // synthetic daily curve, peaks at meal/evening times, varied per zone
    const curve = (h, phase, amp) => Math.max(0, Math.sin((h-phase)/24*Math.PI*2)*amp + amp);
    const profiles = [ [13,55],[15,48],[18,40],[20,52],[12,35],[19,60] ];
    wrap.innerHTML = zones.map((zn,zi)=>{
      const [phase,amp] = profiles[zi];
      const cells = Array.from({length:24}, (_,h)=>{
        const v = Math.min(100, Math.round(curve(h,phase,amp) + ((h*zi*7)%18)));
        return `<span class="cell" data-v="${v}"></span>`;
      }).join('');
      return `<span class="zlabel">${zn}</span><span class="cells">${cells}</span>`;
    }).join('');
    // colorize (heat scale) - set immediately, stagger via CSS transition-delay
    const cells = wrap.querySelectorAll('.cell');
    const cols = 24;
    cells.forEach((c,i)=>{
      const v = +c.dataset.v;
      const col = v>=80 ? 'rgba(255,107,94,'+ (0.4+v/200) +')'
                : v>=55 ? 'rgba(216,150,80,'+ (0.35+v/200) +')'
                : v>=30 ? 'rgba(140,120,80,'+ (0.3+v/250) +')'
                : 'rgba(70,90,130,'+ (0.25+v/300) +')';
      // diagonal sweep: delay by column + row
      const col_i = i % cols, row_i = Math.floor(i / cols);
      c.style.transitionDelay = ((col_i + row_i) * 22) + 'ms';
      c.style.background = col;
    });
  }

  // ---- gauges ----------------------------------------------
  function renderGauges() {
    document.querySelectorAll('.gauge__ring[data-p]').forEach(g=>{
      const p = +g.dataset.p;
      g.style.setProperty('--p', 0);
      const valEl = g.querySelector('[data-gval]');
      requestAnimationFrame(()=>{
        // animate conic fill
        const start = performance.now(), dur=1100;
        (function tick(now){ const t=Math.min(1,(now-start)/dur), e=1-Math.pow(1-t,3);
          g.style.setProperty('--p', (p*e).toFixed(1));
          if (t<1) requestAnimationFrame(tick); })(start);
      });
      if (valEl) countUp(valEl, p, { dur:1100, fmt: v=>Math.round(v)+'%' });
    });
  }

  // ---- top-line metric count-ups ---------------------------
  function renderMetrics() {
    document.querySelectorAll('[data-count]').forEach(el=>{
      const t = parseFloat(el.dataset.count);
      const dec = +(el.dataset.dec||0);
      const comma = el.dataset.comma === '1';
      countUp(el, t, { dec, fmt: comma ? (v)=>commafy(v) : (dec? (v)=>v.toFixed(dec) : null) });
    });
  }

  // ---- skeleton -> load orchestration ----------------------
  function boot() {
    const skels = document.querySelectorAll('.skeleton');
    // simulate "data preparing" then reveal in sequence
    setTimeout(()=>{
      skels.forEach((s, i)=> setTimeout(()=> s.classList.remove('skeleton'), i*120));
      // after skeletons clear, run the live renders
      setTimeout(()=>{
        renderMetrics(); renderSparks(); renderGauges();
        renderMap(); renderRecs(); renderHeat();
      }, skels.length*120 + 60);
    }, 650);

    // fade-up reveals
    const io = new IntersectionObserver((es)=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }), {threshold:0.08});
    document.querySelectorAll('.fade-up').forEach(el=>io.observe(el));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
