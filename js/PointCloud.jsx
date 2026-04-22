// PointCloud.jsx — 3DGS-inspired point cloud that reacts to cursor proximity.
// Points drift on their own Lissajous orbits; mouse nudges them outward (subtle).
// Used as the landing hero's right-side visual.
function PointCloud({ count = 380, className = "point-cloud", height }) {
  const canvasRef = React.useRef(null);
  const pointsRef = React.useRef([]);
  const mouseRef = React.useRef({ x: -1000, y: -1000, inside: false });
  const rafRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // seed points filling the rect
      if (!pointsRef.current.length) {
        for (let i = 0; i < count; i++) {
          pointsRef.current.push({
            // baseline position
            bx: Math.random() * rect.width,
            by: Math.random() * rect.height,
            // orbit params (slow lissajous)
            ax: 8 + Math.random() * 22,
            ay: 8 + Math.random() * 22,
            fx: 0.00015 + Math.random() * 0.0005,
            fy: 0.00015 + Math.random() * 0.0005,
            phase: Math.random() * Math.PI * 2,
            // displacement from mouse (eased)
            dx: 0, dy: 0,
            // depth (0..1) — controls size & alpha
            z: Math.pow(Math.random(), 1.4),
            hue: 185 + Math.random() * 35,
            // current position (computed each frame)
            x: 0, y: 0,
          });
        }
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      mouseRef.current = { x, y, inside };
    };
    const onLeave = () => { mouseRef.current.inside = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const tick = (t) => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      const m = mouseRef.current;
      const influenceR = 140;
      const influenceR2 = influenceR * influenceR;

      for (const p of pointsRef.current) {
        // lissajous drift
        const ox = Math.cos(t * p.fx + p.phase) * p.ax;
        const oy = Math.sin(t * p.fy + p.phase * 1.3) * p.ay;

        // mouse repulsion — soft, falls off with distance
        let targetDx = 0, targetDy = 0;
        if (m.inside) {
          const dx = (p.bx + ox) - m.x;
          const dy = (p.by + oy) - m.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < influenceR2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = (1 - d / influenceR) * 28 * (0.4 + p.z * 0.8);
            targetDx = (dx / d) * force;
            targetDy = (dy / d) * force;
          }
        }
        // ease toward target
        p.dx += (targetDx - p.dx) * 0.08;
        p.dy += (targetDy - p.dy) * 0.08;

        p.x = p.bx + ox + p.dx;
        p.y = p.by + oy + p.dy;

        const size = 0.6 + p.z * 2.4;
        const alpha = 0.25 + p.z * 0.55;

        // soft halo
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
        g.addColorStop(0,   `hsla(${p.hue}, 95%, 80%, ${alpha * 0.7})`);
        g.addColorStop(0.5, `hsla(${p.hue}, 85%, 60%, ${alpha * 0.22})`);
        g.addColorStop(1,   `hsla(${p.hue}, 85%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
        ctx.fill();

        // bright core
        ctx.fillStyle = `hsla(${p.hue}, 100%, 92%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [count]);

  return <canvas ref={canvasRef} className={className} style={height ? { height } : undefined} aria-hidden="true" />;
}

window.PointCloud = PointCloud;
