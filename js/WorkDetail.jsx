// WorkDetail.jsx — modal overlay with YouTube embed + ambient "bloom" atmosphere.
// Instead of literal flowers we emit luminous motes that drift upward across the
// stage (matches the site's bioluminescent language). A radiant ring pulses
// around the video when the modal opens.
function WorkDetail({ work, lang, onClose }) {
  const intros = (window.I18N[lang].work && window.I18N[lang].work.intros) || {};
  const intro = intros[work.id] || {};
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => setMounted(true));
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
      cancelAnimationFrame(id);
    };
  }, [onClose]);

  if (!work) return null;

  // deterministic mote positions so they don't reshuffle on re-render
  const motes = React.useMemo(() => {
    const rng = mulberry32(hashStr(work.id));
    return Array.from({ length: 28 }, () => {
      const x = rng() * 100;                         // 0..100 %
      const drift = (rng() - 0.5) * 30;              // horizontal wobble
      const delay = rng() * 1400;
      const duration = 3400 + rng() * 2800;
      const scale = 0.4 + rng() * 1.2;
      // two hues: site cyan-blue, and occasional warm gold for depth
      const warm = rng() > 0.85;
      const hue = warm ? 40 + rng() * 15 : 190 + rng() * 25;
      return { x, drift, delay, duration, scale, hue };
    });
  }, [work.id]);

  return (
    <div className={"work-detail" + (mounted ? " is-mounted" : "")} onClick={onClose}>
      <div className="work-detail__inner" onClick={(e) => e.stopPropagation()}>
        <button className="work-detail__close" onClick={onClose} data-cursor="hover" aria-label="close">
          <span className="work-detail__close-x">×</span>
        </button>

        <div className="work-detail__stage">
          {/* ambient bloom ring that pulses outward on mount */}
          <div className="work-detail__ring" aria-hidden="true" />
          <div className="work-detail__ring work-detail__ring--delayed" aria-hidden="true" />

          <div className="work-detail__video-wrap">
            <iframe
              className="work-detail__video"
              src={`https://www.youtube-nocookie.com/embed/${work.youtube}?rel=0&modestbranding=1&playsinline=1`}
              title={work.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="lazy"
            />
            {/* Fallback thumbnail click-through — shown if the iframe fails
                to play (e.g. YouTube error 150/153 for shorts with embed
                disabled). Always present beneath the iframe, revealed via
                the "watch on youtube" CTA below as well. */}
            <a
              className="work-detail__video-fallback"
              href={`https://www.youtube.com/watch?v=${work.youtube}`}
              target="_blank"
              rel="noopener"
              style={{ backgroundImage: `url(https://img.youtube.com/vi/${work.youtube}/hqdefault.jpg)` }}
              aria-label="open on youtube"
            >
              <span className="work-detail__video-fallback-play">▸</span>
              <span className="work-detail__video-fallback-label">if playback is blocked · open on youtube ↗</span>
            </a>
          </div>

          {/* luminous motes — drift upward across the stage */}
          <div className="work-detail__motes" aria-hidden="true">
            {motes.map((m, i) => (
              <span
                key={i}
                className="mote"
                style={{
                  left: `${m.x}%`,
                  animationDelay: `${m.delay}ms`,
                  animationDuration: `${m.duration}ms`,
                  "--mote-drift": `${m.drift}px`,
                  "--mote-scale": m.scale,
                  "--mote-hue": m.hue,
                }}
              />
            ))}
          </div>
        </div>

        <div className="work-detail__meta">
          <div className="work-detail__meta-head">
            <span className="label">{work.year} · {work.medium[lang] || work.medium.en}</span>
            {work.note && <span className="work-detail__note">{work.note[lang] || work.note.en}</span>}
          </div>
          <h2 className="work-detail__title">{work.title}</h2>
          {intro.body && (
            <div className="work-detail__body">
              {intro.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}
          {intro.tech && (
            <div className="work-detail__tech">
              <span className="label">{intro.techLabel || "technology"}</span>
              {intro.tech.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}
          {intro.quotes && intro.quotes.length > 0 && (
            <div className="work-detail__quotes">
              <span className="label">voices</span>
              {intro.quotes.map((q, i) => (
                <blockquote key={i} className="work-detail__quote">
                  <p>{q.text}</p>
                  <cite>— {q.author}</cite>
                </blockquote>
              ))}
            </div>
          )}
          <a
            className="arrow-link"
            href={`https://www.youtube.com/watch?v=${work.youtube}`}
            target="_blank"
            rel="noopener"
          >watch on youtube ↗</a>
        </div>
      </div>
    </div>
  );
}

// deterministic RNG + hash so motes are stable per work
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

window.WorkDetail = WorkDetail;
