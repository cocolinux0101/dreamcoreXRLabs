// Bioluminescence.jsx — always-on cursor draw trail + click bursts.
function Bioluminescence() {
  const canvasRef = React.useRef(null);
  const particlesRef = React.useRef([]);
  const rafRef = React.useRef(null);
  const lastMoveRef = React.useRef({ x: 0, y: 0, t: 0 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (x, y, opts = {}) => {
      const { count = 1, spread = 4, speed = 1, life = 1, size = 1, alpha = 1, upward = true } = opts;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const s = (0.25 + Math.random() * 1.2) * speed;
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * spread,
          y: y + (Math.random() - 0.5) * spread,
          vx: Math.cos(angle) * s * 0.5,
          vy: upward ? (-Math.abs(Math.sin(angle) * s) - 0.3) : Math.sin(angle) * s * 0.5,
          life, decay: (0.005 + Math.random() * 0.006) / life,
          r: (0.8 + Math.random() * 1.6) * size,
          hue: 185 + Math.random() * 40,
          baseAlpha: alpha,
        });
      }
    };

    const onDown = (e) => {
      spawn(e.clientX, e.clientY, { count: 10, spread: 6, speed: 1.2, size: 1.1, life: 1.2, alpha: 0.8 });
    };

    // mouse move — ALWAYS draws, regardless of mouse button state
    const onMove = (e) => {
      const now = performance.now();
      const prev = lastMoveRef.current;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 3) {
        const steps = Math.min(5, Math.ceil(dist / 12));
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          spawn(prev.x + dx * t, prev.y + dy * t, {
            count: 1, spread: 2, speed: 0.55, size: 0.85, life: 0.95, alpha: 0.6,
          });
        }
      }
      lastMoveRef.current = { x: e.clientX, y: e.clientY, t: now };
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      const ps = particlesRef.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.x += p.vx; p.y += p.vy;
        p.vy -= 0.008; p.vx *= 0.982; p.vy *= 0.992;
        p.life -= p.decay;
        if (p.life <= 0) { ps.splice(i, 1); continue; }
        const alpha = Math.max(0, p.life) * p.baseAlpha;
        const radius = p.r * (1 + (1 - p.life) * 0.6);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 7);
        g.addColorStop(0, `hsla(${p.hue}, 95%, 78%, ${alpha * 0.35})`);
        g.addColorStop(0.3, `hsla(${p.hue}, 90%, 60%, ${alpha * 0.14})`);
        g.addColorStop(1, `hsla(${p.hue}, 90%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, radius * 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${alpha * 0.75})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="bioluminescence" aria-hidden="true" />;
}

window.Bioluminescence = Bioluminescence;
