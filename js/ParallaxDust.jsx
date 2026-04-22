// ParallaxDust.jsx — subtle drifting stars everywhere behind content.
function ParallaxDust() {
  const canvasRef = React.useRef(null);
  const layersRef = React.useRef([]);
  const scrollRef = React.useRef(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const makeParticle = (w, h, depth) => ({
      x: Math.random() * w,
      y: Math.random() * h * 1.4 - h * 0.2,
      r: 0.4 + Math.random() * (depth > 0.5 ? 0.9 : 0.5),
      vy: 0.015 + Math.random() * 0.04 * depth,
      vx: (Math.random() - 0.5) * 0.03 * depth,
      a: 0.08 + Math.random() * 0.4 * depth,
      depth,
      phase: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const densityFar = Math.round((w * h) / 12000);
      const densityNear = Math.round((w * h) / 20000);
      layersRef.current = [
        Array.from({ length: densityFar }, () => makeParticle(w, h, 0.35)),
        Array.from({ length: densityNear }, () => makeParticle(w, h, 0.75)),
      ];
    };

    resize();
    window.addEventListener("resize", resize);
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf, t = 0;
    const tick = () => {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);
      const parallaxY = scrollRef.current * 0.05;
      for (const layer of layersRef.current) {
        for (const p of layer) {
          p.y += p.vy; p.x += p.vx;
          if (p.y - parallaxY * p.depth > h + 20) {
            p.y = -20 + parallaxY * p.depth;
            p.x = Math.random() * w;
          }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          const flicker = 0.82 + 0.18 * Math.sin(t * 2 + p.phase);
          const drawY = p.y - parallaxY * p.depth;
          ctx.beginPath();
          ctx.arc(p.x, drawY, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(210, 235, 245, ${p.a * flicker})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="parallax-dust" aria-hidden="true" />;
}

window.ParallaxDust = ParallaxDust;
