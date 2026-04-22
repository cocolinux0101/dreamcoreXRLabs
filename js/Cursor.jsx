// Cursor.jsx — glowing cyan sphere that replaces the system cursor.
// Layered as: ambient halo (blurred gradient) + soft sphere (radial gradient)
// + specular highlight. Ripple on click for tactile feedback.
function Cursor() {
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  const targetRef = React.useRef({ x: -100, y: -100 });
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  React.useEffect(() => {
    const onMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      const el = e.target;
      const interactive = el && el.closest && el.closest("a,button,input,textarea,select,[data-cursor='hover']");
      setHover(!!interactive);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => { targetRef.current = { x: -200, y: -200 }; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // smooth follow via rAF
  React.useEffect(() => {
    let raf;
    const tick = () => {
      setPos((p) => ({
        x: p.x + (targetRef.current.x - p.x) * 0.22,
        y: p.y + (targetRef.current.y - p.y) * 0.22,
      }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const dotSize   = pressed ? 14 : hover ? 26 : 16;
  const haloSize  = pressed ? 140 : hover ? 180 : 110;
  const haloOp    = pressed ? 0.55 : hover ? 0.38 : 0.22;
  const dotBrightness = pressed ? 1.4 : hover ? 1.15 : 1.0;

  return (
    <>
      {/* outer ambient halo */}
      <div className="cursor-halo" style={{
        left: pos.x, top: pos.y,
        width: haloSize, height: haloSize,
        opacity: haloOp,
      }}/>
      {/* glowing sphere with radial gradient (no flat dot) */}
      <div className="cursor-sphere" style={{
        left: pos.x, top: pos.y,
        width: dotSize, height: dotSize,
        filter: `brightness(${dotBrightness})`,
      }}/>
    </>
  );
}

window.Cursor = Cursor;
