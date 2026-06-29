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

// ── Contact form — Formspree ──────────────────────────────────
(function () {
  // ✏️  Remplace cette URL par ton endpoint Formspree personnel
  const FORMSPREE_URL = 'https://formspree.io/f/xojolwla';

  const btn      = document.getElementById('send-btn');
  const fieldName = document.getElementById('fn');
  const fieldEmail = document.getElementById('fe');
  const fieldSubject = document.getElementById('fs');
  const fieldMsg  = document.getElementById('fm');
  const formWrap  = document.querySelector('.contact-form');

  if (!btn || !fieldMsg) return;

  // Affiche un message d'erreur sous un champ
  function setError(field, msg) {
    clearError(field);
    field.style.borderColor = '#E07B8A';
    const err = document.createElement('p');
    err.className = 'form-error';
    err.style.cssText = 'color:#E07B8A;font-size:.8rem;margin-top:4px';
    err.textContent = msg;
    field.parentNode.appendChild(err);
  }

  function clearError(field) {
    field.style.borderColor = '';
    const prev = field.parentNode.querySelector('.form-error');
    if (prev) prev.remove();
  }

  // Validation légère côté client
  function validate() {
    let ok = true;
    clearError(fieldMsg);
    clearError(fieldName);

    if (!fieldName.value.trim()) {
      setError(fieldName, 'Merci d\'indiquer un prénom ou un pseudo.');
      ok = false;
    }
    if (!fieldMsg.value.trim()) {
      setError(fieldMsg, 'Le message ne peut pas être vide.');
      ok = false;
    }
    return ok;
  }

  // État du bouton
  function setLoading(on) {
    btn.disabled = on;
    btn.textContent = on ? 'Envoi en cours…' : 'Envoyer mon message';
    btn.style.opacity = on ? '0.7' : '1';
  }

  function showSuccess() {
    // Remplace le formulaire par un message de confirmation
    formWrap.innerHTML = `
      <div style="text-align:center;padding:48px 24px">
        <div style="font-size:3rem;margin-bottom:16px">✅</div>
        <h3 style="font-family:var(--ff-display);font-size:1.6rem;margin-bottom:10px">
          Message bien reçu !
        </h3>
        <p style="color:var(--muted);font-size:.95rem;line-height:1.7;max-width:360px;margin:0 auto">
          Un pair-aidant te répondra sous 24h à l'adresse indiquée.
          En attendant, le <a href="tel:3114" style="color:var(--teal);font-weight:600">3114</a>
          reste disponible 24h/24 si tu as besoin de parler maintenant.
        </p>
      </div>
    `;
  }

  function showNetworkError() {
    const existing = formWrap.querySelector('.form-global-error');
    if (existing) existing.remove();
    const el = document.createElement('p');
    el.className = 'form-global-error';
    el.style.cssText = 'background:#FFF0F0;border:1px solid #E07B8A;color:#C0394A;border-radius:8px;padding:12px 16px;font-size:.88rem;margin-bottom:16px';
    el.textContent = 'Une erreur est survenue. Vérifie ta connexion et réessaie, ou appelle directement le 3114.';
    btn.insertAdjacentElement('beforebegin', el);
  }

  btn.addEventListener('click', async () => {
    if (!validate()) return;

    // Alerte si l'URL n'a pas été remplacée
    if (FORMSPREE_URL.includes('XXXXXXXX')) {
      alert('⚠️ Remplace FORMSPREE_URL dans main.js par ton vrai endpoint Formspree.');
      return;
    }

    setLoading(true);

    const payload = {
      prenom:  fieldName.value.trim(),
      email:   fieldEmail.value.trim(),
      sujet:   fieldSubject.value,
      message: fieldMsg.value.trim(),
      _subject: `[Reborn] Nouveau message de ${fieldName.value.trim()}`,
      // Honeypot anti-spam (Formspree ignore ce champ si rempli par un bot)
      _gotcha: '',
    };

    try {
      const res = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (res.ok) {
        showSuccess();
      } else {
        const data = await res.json().catch(() => ({}));
        console.error('Formspree error:', data);
        setLoading(false);
        showNetworkError();
      }
    } catch (err) {
      console.error('Network error:', err);
      setLoading(false);
      showNetworkError();
    }
  });
})();