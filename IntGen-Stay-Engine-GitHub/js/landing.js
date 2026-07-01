// Guarantee every landing video is fully silent (muted + zero volume)
document.querySelectorAll('video').forEach((v) => {
  v.muted = true;
  v.defaultMuted = true;
  v.volume = 0;
  v.removeAttribute('controls');
  const enforce = () => { v.muted = true; v.volume = 0; };
  v.addEventListener('volumechange', enforce);
  v.addEventListener('play', enforce);
});

// Topbar background on scroll
const topbar = document.getElementById('topbar');
const onScroll = () => topbar.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

document.querySelectorAll('.js-console-entry').forEach((entry) => {
  entry.addEventListener('click', (event) => {
    const target = entry.getAttribute('data-console-link') || 'operations/index.html';
    event.preventDefault();
    window.location.assign(target);
  });
});
