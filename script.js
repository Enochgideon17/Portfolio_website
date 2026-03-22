/* ═══════════════════════════════════════════
   ENOCH G — PORTFOLIO
   script.js
═══════════════════════════════════════════ */

/* ────────────────────────────────────────
   1. CANVAS PARTICLE NETWORK
──────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.vx    = (Math.random() - 0.5) * 0.28;
    this.vy    = (Math.random() - 0.5) * 0.28;
    this.r     = Math.random() * 1.4 + 0.4;
    this.alpha = Math.random() * 0.35 + 0.08;
    const pal  = ['#00ff88','#00cfff','#ff4dff','#f0b429'];
    this.color = pal[Math.floor(Math.random() * pal.length)];
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
    const dx = this.x - mouse.x, dy = this.y - mouse.y;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d < 120) { this.x += (dx / d) * 1.1; this.y += (dy / d) * 1.1; }
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle   = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  function drawLines() {
    const MAX = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle  = particles[i].color;
          ctx.globalAlpha  = (1 - d / MAX) * 0.11;
          ctx.lineWidth    = 0.6;
          ctx.stroke();
          ctx.globalAlpha  = 1;
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }

  function init() {
    resize();
    particles = [];
    const N = Math.min(Math.floor((W * H) / 12000), 95);
    for (let i = 0; i < N; i++) particles.push(new Particle());
    loop();
  }

  window.addEventListener('resize', init);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  init();
})();


/* ────────────────────────────────────────
   2. CUSTOM CURSOR GLOW
──────────────────────────────────────── */
(function initCursor() {
  const glow = document.getElementById('cursorGlow');
  let cx = -500, cy = -500, tx = -500, ty = -500;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  (function animate() {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animate);
  })();
})();


/* ────────────────────────────────────────
   3. LIVE CLOCK
──────────────────────────────────────── */
(function initClock() {
  const el = document.getElementById('navTime');
  function tick() {
    const n  = new Date();
    const hh = String(n.getHours()).padStart(2,'0');
    const mm = String(n.getMinutes()).padStart(2,'0');
    const ss = String(n.getSeconds()).padStart(2,'0');
    el.textContent = `${hh}:${mm}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);
})();


/* ────────────────────────────────────────
   4. SCROLL REVEAL
──────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.section, .pipeline-strip');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07 });

  els.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    obs.observe(el);
  });
})();


/* ────────────────────────────────────────
   5. SKILL BAR ANIMATION ON SCROLL
──────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const obs  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.style.getPropertyValue('--w') ||
          getComputedStyle(e.target).getPropertyValue('--w');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => {
    // Read inline --w and apply on intersect
    const w = bar.style.cssText.match(/--w:\s*([^;]+)/);
    if (w) bar.dataset.width = w[1].trim();
    bar.style.width = '0%';
    obs.observe(bar);
  });

  // Re-implement because CSS custom props don't trigger width directly
  const obs2 = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.width || '0%';
        e.target.style.width = w;
        obs2.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => obs2.observe(bar));
})();


/* ────────────────────────────────────────
   6. ACTIVE NAV LINK ON SCROLL
──────────────────────────────────────── */
(function initActiveNav() {
  const links    = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.style.color = 'var(--c)';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();


/* ────────────────────────────────────────
   7. PROJECT CARD HOVER GLOW TILT
──────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
    this.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  card.addEventListener('mouseleave', function () {
    this.style.transform = '';
  });
});


/* ────────────────────────────────────────
   8. ORBIT NODE TOOLTIP
──────────────────────────────────────── */
document.querySelectorAll('.orbit-node').forEach(node => {
  node.addEventListener('mouseenter', function () {
    const tip = document.createElement('div');
    tip.id = 'orbitTip';
    tip.textContent = this.dataset.label;
    tip.style.cssText = `
      position:fixed; background:var(--surface2); border:1px solid var(--c);
      color:var(--c); font-size:0.62rem; letter-spacing:0.18em;
      padding:0.3rem 0.8rem; pointer-events:none; z-index:9000;
      font-family:'Rajdhani',sans-serif; font-weight:700;
    `;
    document.body.appendChild(tip);
  });

  node.addEventListener('mousemove', function (e) {
    const t = document.getElementById('orbitTip');
    if (t) { t.style.left = (e.clientX + 14) + 'px'; t.style.top = (e.clientY - 10) + 'px'; }
  });

  node.addEventListener('mouseleave', () => {
    const t = document.getElementById('orbitTip');
    if (t) t.remove();
  });
});


/* ────────────────────────────────────────
   9. SMOOTH SCROLL FOR NAV LINKS
──────────────────────────────────────── */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
