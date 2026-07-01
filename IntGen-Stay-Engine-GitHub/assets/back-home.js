/* Floating "Back to Home" button — injected into each standalone app.
   Set data-home on the <script> tag to point at the landing index.
   Falls back to a sensible relative path. */
(function () {
  var me = document.currentScript;
  var home = (me && me.getAttribute('data-home')) || '../../index.html';

  var css = '' +
    '#ig-home{position:fixed;left:18px;bottom:18px;z-index:99999;display:inline-flex;align-items:center;gap:8px;' +
    'padding:10px 16px 10px 13px;border-radius:999px;text-decoration:none;font:600 13px/1 Inter,system-ui,sans-serif;' +
    'color:#f5f8ff;background:rgba(12,14,20,.72);border:1px solid rgba(255,255,255,.16);' +
    'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 10px 30px rgba(0,0,0,.45);' +
    'transition:transform .25s,border-color .25s,background .25s;opacity:.92}' +
    '#ig-home:hover{transform:translateY(-2px);border-color:rgba(212,191,139,.6);background:rgba(20,22,30,.85);opacity:1}' +
    '#ig-home .ar{font-size:15px;transition:transform .25s}#ig-home:hover .ar{transform:translateX(-3px)}' +
    '#ig-home .lbl small{display:block;font-weight:500;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,248,255,.5);margin-bottom:2px}';
  var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);

  function mount() {
    if (document.getElementById('ig-home')) return;
    var a = document.createElement('a');
    a.id = 'ig-home';
    a.href = home;
    a.innerHTML = '<span class="ar">←</span><span class="lbl"><small>IntGen Stay</small>Back to Home</span>';
    document.body.appendChild(a);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
