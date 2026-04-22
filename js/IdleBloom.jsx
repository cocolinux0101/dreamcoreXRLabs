// IdleBloom.jsx — signature interactive moment.
// If the cursor stays still for ~1.8s, a slow halo blooms from its position,
// breathing once, then fading. Resets on any movement.
function IdleBloom() {
  const [bloom, setBloom] = React.useState(null);
  const timerRef = React.useRef(null);
  const posRef = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const clear = () => {
      clearTimeout(timerRef.current);
      setBloom(null);
    };
    const schedule = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setBloom({ ...posRef.current, id: Math.random() });
        // auto-clear after the animation completes so it can retrigger
        setTimeout(() => setBloom(null), 4200);
      }, 1800);
    };

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      clear();
      schedule();
    };
    const onDown = () => { clear(); schedule(); };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!bloom) return null;
  return (
    <div
      key={bloom.id}
      className="idle-bloom"
      style={{ left: bloom.x, top: bloom.y }}
      aria-hidden="true"
    />
  );
}

window.IdleBloom = IdleBloom;
