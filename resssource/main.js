// Add js-ready class so CSS animations only activate with JS
document.body.classList.add('js-ready');

/* ============================================================
   REBORN v3 — main.js
   ============================================================ */

// ── Starfield canvas ─────────────────────────────────────────
(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  const STAR_COUNT = 180;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildStars();
  }

  function buildStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.004,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a = Math.max(0.1, Math.min(1, s.a + s.da));
      if (s.a <= 0.1 || s.a >= 1) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ── Hero dawn effect on scroll ────────────────────────────────
(function () {
  const dawn = document.getElementById('hero-dawn');
  const hero = document.getElementById('hero');
  if (!dawn || !hero) return;

  window.addEventListener('scroll', () => {
    const heroH = hero.offsetHeight;
    const scrolled = window.scrollY;
    if (scrolled > heroH * 0.2) {
      dawn.classList.add('visible');
    } else {
      dawn.classList.remove('visible');
    }
  }, { passive: true });
})();

// ── Burger menu ───────────────────────────────────────────────
(function () {
  const btn  = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });
})();

// ── Smooth scroll with header offset ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 74;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

// ── Fade-up on scroll ─────────────────────────────────────────
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
})();

// ── Methods tabs ──────────────────────────────────────────────
(function () {
  document.querySelectorAll('.m-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.dataset.panel;
      document.querySelectorAll('.m-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.m-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.add('active');
        // Re-trigger fade-ups in new panel
        panel.querySelectorAll('.fade-up').forEach(el => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), 50);
        });
      }
    });
  });
})();

// ── Quiz ──────────────────────────────────────────────────────
(function () {
  const boxes  = document.querySelectorAll('.qcb');
  const fill   = document.getElementById('quiz-fill');
  const label  = document.getElementById('quiz-label');
  const msg    = document.getElementById('quiz-msg');
  const link   = document.getElementById('quiz-link');
  if (!boxes.length) return;

  const msgs = [
    '', // 0
    'Un point mérite attention. Rester attentif·ve à votre consommation.',
    'Deux points : un signe que quelque chose mérite d\'être exploré.',
    'Trois points ou plus : parler à un professionnel pourrait vraiment vous aider.',
    'Quatre réponses : nous vous encourageons à contacter une structure d\'aide.',
    'Cinq réponses : vous avez tout le courage qu\'il faut — l\'aide est là pour vous.',
  ];

  function update() {
    const count = Array.from(boxes).filter(b => b.checked).length;
    if (fill)  fill.style.width = (count / 5 * 100) + '%';
    if (label) label.textContent = count + ' / 5';
    if (msg)   msg.textContent   = msgs[count] || '';
    if (link)  link.style.display = count >= 2 ? 'inline-block' : 'none';
  }

  boxes.forEach(b => b.addEventListener('change', update));
})();

// ── FAQ accordion ─────────────────────────────────────────────
(function () {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer  = btn.nextElementSibling;
      const isOpen  = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });

      // Open this one if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
})();

// ── Contact form ──────────────────────────────────────────────
(function () {
  const btn = document.getElementById('send-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const msg = document.getElementById('fm');
    if (!msg || !msg.value.trim()) {
      msg.focus();
      msg.style.borderColor = '#E07B8A';
      setTimeout(() => { msg.style.borderColor = ''; }, 2500);
      return;
    }
    btn.textContent = '✓ Message envoyé — réponse sous 24h';
    btn.style.background = 'var(--teal-dk)';
    btn.disabled = true;
    msg.value = '';
  });
})();