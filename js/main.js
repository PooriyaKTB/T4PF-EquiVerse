/* ═══════════════════════════════════════════════════
   ThisAbility Business Website — main.js
   Navbar · Mobile nav · Scroll animations · Counters
   ═══════════════════════════════════════════════════ */

// ── Navbar scroll state ────────────────────────────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile nav toggle ─────────────────────────────
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ── Smooth scroll for anchor links ────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Scroll reveal animations ──────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => {
  el.classList.add('will-animate');
  revealObserver.observe(el);
});

// ── Active nav link on scroll ─────────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${id}`
        ? 'var(--text)'
        : '';
    });
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

// ── Stat number counter animation ─────────────────
function parseStatText(text) {
  text = text.trim();
  const hasPound  = text.startsWith('£');
  const raw       = hasPound ? text.slice(1) : text;
  const hasB      = raw.endsWith('B');
  const hasM      = raw.endsWith('M');
  const hasK      = raw.endsWith('K');
  const hasPlus   = raw.endsWith('+');
  const hasSlash  = raw.includes('/');

  if (hasSlash) return null; // e.g. £8/day — skip

  let numStr = raw.replace(/[BMK+,]/g, '');
  const base = parseFloat(numStr);
  if (isNaN(base)) return null;

  // Expand to absolute value so formatStat's division lands correctly
  let num = base;
  if (hasB) num = base * 1e9;
  else if (hasM) num = base * 1e6;
  else if (hasK) num = base * 1e3;

  return { num, hasPound, hasB, hasM, hasK, hasPlus };
}

function formatStat(val, info) {
  const { hasPound, hasB, hasM, hasK, hasPlus } = info;
  let formatted;
  if      (hasB) formatted = (val / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  else if (hasM) formatted = Math.round(val / 1e6) + 'M';
  else if (hasK) formatted = Math.round(val / 1000) + 'K';
  else           formatted = Math.round(val).toLocaleString();

  return (hasPound ? '£' : '') + formatted + (hasPlus ? '+' : '');
}

function animateCounter(el) {
  const original = el.textContent.trim();
  const info = parseStatText(original);
  if (!info) return;

  const target   = info.num;
  const duration = 2000;
  const startTs  = performance.now();

  function tick(now) {
    const elapsed  = now - startTs;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current  = target * eased;

    el.textContent = formatStat(current, info);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = original; // snap to exact original
    }
  }

  el.textContent = formatStat(0, info);
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-number, .market-number').forEach(el => {
  if (/\d/.test(el.textContent)) counterObserver.observe(el);
});

// ── Equalize biz-metric heights so price rows align ──
function equalizeBizMetrics() {
  const metrics = [...document.querySelectorAll('.biz-metric')];
  if (!metrics.length) return;
  metrics.forEach(m => m.style.minHeight = '');
  const maxH = Math.max(...metrics.map(m => m.offsetHeight));
  metrics.forEach(m => m.style.minHeight = maxH + 'px');
}

document.fonts.ready.then(equalizeBizMetrics).catch(() => equalizeBizMetrics());
let _bizResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(_bizResizeTimer);
  _bizResizeTimer = setTimeout(equalizeBizMetrics, 150);
}, { passive: true });
