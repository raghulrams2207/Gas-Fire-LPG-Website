/* =========================================
   LPG GASFIRE — main.js
   ========================================= */

'use strict';

// ── Custom Cursor ──────────────────────────────────────
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let dotX   = 0, dotY   = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  dotX  += (mouseX - dotX)  * 0.85;
  dotY  += (mouseY - dotY)  * 0.85;
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  if (cursorDot)  cursorDot.style.transform  = `translate(${dotX - 4}px, ${dotY - 4}px)`;
  if (cursorRing) cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;

  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover expand
document.querySelectorAll('a, button, .btn, .feature-card, .product-card, .testimonial-card, .nav-toggle')
  .forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

// ── Navbar Scroll Effect ──────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Scroll Reveal (IntersectionObserver) ─────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── Progress Bars ─────────────────────────────────────
const progressBars = document.querySelectorAll('.progress-fill');

const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

progressBars.forEach(bar => progressObserver.observe(bar));

// ── Animated Counters ─────────────────────────────────
function animateCount(el, target, duration = 1800) {
  const start    = performance.now();
  const isFloat  = target % 1 !== 0;

  function step(ts) {
    const elapsed  = ts - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = target * ease;
    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseFloat(entry.target.getAttribute('data-count'));
      animateCount(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

counterEls.forEach(el => counterObserver.observe(el));

// ── Mobile Nav Toggle ─────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  if (navMenu) {
    const isOpen = navToggle.classList.contains('open');
    navMenu.style.display    = isOpen ? 'flex' : 'none';
    navMenu.style.flexDirection = 'column';
    navMenu.style.position   = 'absolute';
    navMenu.style.top        = '70px';
    navMenu.style.left       = '0';
    navMenu.style.right      = '0';
    navMenu.style.background = 'rgba(10,10,12,0.98)';
    navMenu.style.backdropFilter = 'blur(24px)';
    navMenu.style.padding    = '24px 40px';
    navMenu.style.borderBottom = '1px solid rgba(240,237,232,0.08)';
    navMenu.style.gap        = '20px';
  }
});

// ── Testimonials Drag / Swipe Scroll ─────────────────
const track = document.querySelector('.testimonials-track');
let isDragging = false;
let startX, scrollLeft;

if (track) {
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX     = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x    = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });

  ['mouseup', 'mouseleave'].forEach(ev => {
    track.addEventListener(ev, () => {
      isDragging = false;
      track.style.cursor = 'grab';
    });
  });
}

// ── Subtle Tilt on Product / Feature Cards ────────────
document.querySelectorAll('.product-card, .feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const rx     = dy * -5;
    const ry     = dx *  5;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Smooth anchor scrolling ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Close mobile nav if open
    if (navToggle?.classList.contains('open')) {
      navToggle.classList.remove('open');
      if (navMenu) navMenu.style.display = 'none';
    }
  });
});

// ── Active nav link on scroll ─────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'var(--text-primary)' : '';
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => sectionObserver.observe(s));

// ── Toast notification helper (for form) ─────────────
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <span style="font-size:1.1rem">${type === 'success' ? '✓' : '!'}</span>
    <span>${msg}</span>
  `;

  Object.assign(toast.style, {
    position:      'fixed',
    bottom:        '30px',
    right:         '30px',
    background:    type === 'success' ? 'var(--accent-fire)' : '#e03e3e',
    color:         '#fff',
    fontFamily:    'var(--font-ui)',
    fontSize:      '0.82rem',
    fontWeight:    '600',
    letterSpacing: '0.06em',
    padding:       '14px 24px',
    borderRadius:  'var(--radius-pill)',
    display:       'flex',
    alignItems:    'center',
    gap:           '10px',
    zIndex:        '99999',
    boxShadow:     '0 10px 40px rgba(0,0,0,0.5)',
    animation:     'fadeInUp 0.4s ease both',
  });

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ── Order form submit ─────────────────────────────────
const orderForm = document.querySelector('#order-form');
orderForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = orderForm.querySelector('button[type="submit"]');
  btn.textContent = 'Booking…';
  btn.disabled = true;
  setTimeout(() => {
    showToast('Your cylinder booking is confirmed!');
    orderForm.reset();
    btn.textContent = 'Book Now';
    btn.disabled = false;
  }, 1600);
});

// ── Log ───────────────────────────────────────────────
console.log('%cGASFIRE LPG 🔥', 'color:#e8632a;font-size:20px;font-weight:900;');
console.log('%cPremium Gas Delivery — Ready.', 'color:#f5a623;font-size:13px;');
