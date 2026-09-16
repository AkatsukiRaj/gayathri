/**
 * Ultra-Modern Cosmic Universe Engine
 * Multi-layer Starfield, Shifting Nebulae, Shooting Stars & Interactive Stardust
 */
(function() {
  const canvas = document.getElementById('universe-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let stars = [];
  let shootingStars = [];
  let stardust = [];
  let touchPos = { x: -1000, y: -1000, active: false };

  // Vibrant Cosmic Palette
  const STAR_COLORS = [
    { r: 255, g: 255, b: 255 }, // Pure Bright White
    { r: 255, g: 77,  b: 141 }, // Cyber Pink
    { r: 168, g: 85,  b: 247 }, // Starlight Violet
    { r: 0,   g: 240, b: 255 }, // Electric Cyan
    { r: 251, g: 191, b: 36  }, // Warm Golden Star
    { r: 255, g: 105, b: 180 }  // Rose Stardust
  ];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    initStars();
  }

  function initStars() {
    stars = [];
    const count = Math.min(Math.floor((width * height) / 3800), 240);
    for (let i = 0; i < count; i++) {
      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        radius: Math.random() * 1.8 + 0.4,
        color: color,
        alpha: Math.random() * 0.75 + 0.25,
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        isFlare: Math.random() < 0.12
      });
    }

    // Floating Stardust Particles
    stardust = [];
    for (let i = 0; i < 40; i++) {
      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      stardust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.3 - 0.08,
        radius: Math.random() * 2.2 + 1,
        color: color,
        alpha: Math.random() * 0.5 + 0.15
      });
    }
  }

  function createShootingStar() {
    const startX = Math.random() * (width * 0.85) + width * 0.1;
    const startY = Math.random() * (height * 0.35);
    const speed = Math.random() * 8 + 8;
    const angle = (Math.PI / 4.2) + (Math.random() - 0.5) * 0.3;

    const colors = ['#00f0ff', '#ff007f', '#a855f7', '#ffffff', '#ffd166'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    shootingStars.push({
      x: startX,
      y: startY,
      speed: speed,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      life: 0,
      maxLife: Math.random() * 40 + 30,
      color: color,
      trail: []
    });
  }

  let lastShootingStarTime = 0;
  let nebulaTime = 0;

  function render(time) {
    nebulaTime += 0.002;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Subtle Dynamic Cosmic Nebulae
    const g1x = width * 0.2 + Math.sin(nebulaTime) * 40;
    const g1y = height * 0.25 + Math.cos(nebulaTime) * 30;
    const rad1 = ctx.createRadialGradient(g1x, g1y, 10, g1x, g1y, width * 0.7);
    rad1.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
    rad1.addColorStop(0.5, 'rgba(255, 42, 122, 0.08)');
    rad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad1;
    ctx.fillRect(0, 0, width, height);

    const g2x = width * 0.8 + Math.cos(nebulaTime * 0.8) * 50;
    const g2y = height * 0.7 + Math.sin(nebulaTime * 0.8) * 40;
    const rad2 = ctx.createRadialGradient(g2x, g2y, 10, g2x, g2y, width * 0.65);
    rad2.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
    rad2.addColorStop(0.6, 'rgba(255, 0, 128, 0.06)');
    rad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad2;
    ctx.fillRect(0, 0, width, height);

    // 2. Render Twinkling Stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha > 0.98) { s.alpha = 0.98; s.twinkleDir = -1; }
      else if (s.alpha < 0.2) { s.alpha = 0.2; s.twinkleDir = 1; }

      if (touchPos.active) {
        const dx = s.x - touchPos.x;
        const dy = s.y - touchPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const force = (90 - dist) / 90;
          s.x += (dx / dist) * force * 3;
          s.y += (dy / dist) * force * 3;
        }
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${s.alpha})`;
      
      if (s.isFlare && s.alpha > 0.65) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgb(${s.color.r}, ${s.color.g}, ${s.color.b})`;
        ctx.fill();

        ctx.strokeStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${s.alpha * 0.45})`;
        ctx.lineWidth = 0.8;
        const flareLen = s.radius * 3.5;
        ctx.beginPath();
        ctx.moveTo(s.x - flareLen, s.y);
        ctx.lineTo(s.x + flareLen, s.y);
        ctx.moveTo(s.x, s.y - flareLen);
        ctx.lineTo(s.x + flareLen, s.y);
        ctx.stroke();
      } else {
        ctx.shadowBlur = s.radius > 1.2 ? 6 : 0;
        ctx.shadowColor = '#ff2a7a';
        ctx.fill();
      }
    }
    ctx.shadowBlur = 0;

    // 3. Render Floating Stardust Particles
    for (let i = 0; i < stardust.length; i++) {
      const p = stardust[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) p.y = height + 10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // 4. Periodically Spawn Shooting Stars
    if (time - lastShootingStarTime > 2200) {
      if (Math.random() < 0.85) {
        createShootingStar();
      }
      lastShootingStarTime = time;
    }

    // 5. Update and Draw Shooting Stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.trail.push({ x: ss.x, y: ss.y });
      if (ss.trail.length > 15) ss.trail.shift();

      ss.x += ss.dx;
      ss.y += ss.dy;
      ss.life++;

      const progress = ss.life / ss.maxLife;
      const alpha = Math.sin(progress * Math.PI);

      if (ss.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(ss.trail[0].x, ss.trail[0].y);
        for (let t = 1; t < ss.trail.length; t++) {
          ctx.lineTo(ss.trail[t].x, ss.trail[t].y);
        }
        ctx.strokeStyle = ss.color;
        ctx.lineWidth = 2.2;
        ctx.shadowBlur = 14;
        ctx.shadowColor = ss.color;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = ss.color;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (ss.life >= ss.maxLife) {
        shootingStars.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  function onPointerMove(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    touchPos.x = clientX;
    touchPos.y = clientY;
    touchPos.active = true;
  }

  function onPointerEnd() {
    touchPos.active = false;
  }

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerEnd, { passive: true });

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(render);
})();
