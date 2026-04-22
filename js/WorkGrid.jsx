// WorkGrid.jsx — modular gallery. Each work has gif thumb + youtube embed.
// To add a work: append to WORKS. Intros live in i18n.js under work.intros.<id>.
const WORKS = [
  {
    id: "snow-after-us",
    title: "Snow After Us",
    year: "2026",
    medium: { en: "World Labs · Unity · ElevenLabs", zh: "World Labs · Unity · ElevenLabs", de: "World Labs · Unity · ElevenLabs" },
    note: { en: "3rd place · World Labs Winter 2026", zh: "World Labs 冬季竞赛 · 季军", de: "3. Platz · World Labs Winter 2026" },
    gif: "assets/works/snow-after-us.gif",
    youtube: "_rchCfxNMgs",
  },
  {
    id: "night-of-deity",
    title: "The Night of Deities",
    year: "2026",
    medium: { en: "interactive relighting · MLSharp · Unity VFX", zh: "交互式重光照 · MLSharp · Unity VFX", de: "Interaktives Relighting · MLSharp · Unity VFX" },
    gif: "assets/works/night-of-deity.gif",
    youtube: "nM6pozCwUxw",
  },
  {
    id: "butterfly-dream",
    title: "Monet's Garden, and Zhuangzi's Butterfly Dream",
    year: "2026",
    medium: { en: "3DGS · music-driven VFX · Unity", zh: "3DGS · 音乐驱动视效 · Unity", de: "3DGS · musikgetriebene VFX · Unity" },
    gif: "assets/works/butterfly-dream.gif",
    youtube: "AJsqZk4DZz8",
  },
  {
    id: "memory",
    title: "What Is It Like to Be a Memory?",
    year: "2026",
    medium: { en: "3DGS · Gemini Live · Suno · Unity", zh: "3DGS · Gemini Live · Suno · Unity", de: "3DGS · Gemini Live · Suno · Unity" },
    gif: "assets/works/memory.gif",
    youtube: "-P7NXRn5Yow",
  },
  {
    id: "ephemeral-biomes",
    title: "Immersive Ephemeral Biomes",
    year: "2025",
    medium: { en: "3DGS · gesture interaction · Unity", zh: "3DGS · 手势交互 · Unity", de: "3DGS · Gesten-Interaktion · Unity" },
    gif: "assets/works/ephemeral-biomes.gif",
    youtube: "vL4X_rGzktQ",
  },
  {
    id: "immersive-asmr",
    title: "Immersive ASMR",
    year: "2025",
    medium: { en: "World Labs Marble · mesh colliders · Unity", zh: "World Labs Marble · 网格碰撞 · Unity", de: "World Labs Marble · Mesh-Kollider · Unity" },
    gif: "assets/works/immersive-asmr.gif",
    youtube: "ckUyu3rSN8Q",
  },
];

function WorkGrid({ lang, onOpen }) {
  const t = window.I18N[lang];
  return (
    <section className="work section" data-screen-label="Work">
      <div className="container">
        <span className="label section__label">{t.work.label}</span>
        <div className="work__grid">
          {WORKS.map((w) => (
            <WorkCard key={w.id} work={w} lang={lang} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCard({ work, lang, onOpen }) {
  const [hover, setHover] = React.useState(false);
  const [stillSrc, setStillSrc] = React.useState(null);

  // Extract first frame of the GIF once, so we can display a frozen still
  // when not hovered. The GIF itself stays loaded in a second <img> layered
  // behind the still — the browser keeps animating it regardless of opacity,
  // so revealing it on hover is instant (no re-fetch, no loading delay).
  React.useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = work.gif;
    img.onload = () => {
      if (cancelled) return;
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      try {
        setStillSrc(c.toDataURL("image/jpeg", 0.82));
      } catch (_) {
        setStillSrc(work.gif);
      }
    };
    img.onerror = () => { if (!cancelled) setStillSrc(work.gif); };
    return () => { cancelled = true; };
  }, [work.gif]);

  return (
    <a
      className={"work-card" + (hover ? " is-hover" : "")}
      onClick={() => onOpen && onOpen(work)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="hover"
    >
      <div className="work-card__thumb">
        {/* Live gif — always loaded and animating in the background */}
        <img
          src={work.gif}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="work-card__media work-card__media--live"
        />
        {/* Frozen still — sits on top when not hovered, fades out on hover */}
        {stillSrc && (
          <img
            src={stillSrc}
            alt={work.title}
            className="work-card__media work-card__media--still"
          />
        )}
        <div className="work-card__tint" />
        <div className="work-card__vignette" />
        {!hover && <div className="work-card__play-hint" aria-hidden="true">▸ hover to play</div>}
      </div>
      <div className="work-card__meta">
        <span className="work-card__year">{work.year}</span>
        <span className="work-card__title">{work.title}</span>
        <span className="work-card__medium">{work.medium[lang] || work.medium.en}</span>
        {work.note && (
          <span className="work-card__note">{work.note[lang] || work.note.en}</span>
        )}
      </div>
    </a>
  );
}

window.WorkGrid = WorkGrid;
window.WORKS = WORKS;
