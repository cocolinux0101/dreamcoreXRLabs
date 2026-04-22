// Hero.jsx — minimal, content-forward dreamcore landing.
// Lead with name + a short line of expertise tags. Intro paragraph. Inline CTAs.
// A tiny "currently" footnote at the bottom — no giant marquee type.
function Hero({ lang, setRoute }) {
  const L = {
    en: {
      role: ["mixed-reality researcher", "technical artist"],
      quote: "trying to use computer graphics to articulate the feelings humans can't put into words.",
      intro: "Bringing the dreamcore aesthetic to spatial computing — through 3D Gaussian Splatting, generative world models, and a little bit of nostalgia for places that never existed.",
      credits: [
        "Unity · VFX · 3DGS · computer graphics",
        "product design · research · product development",
        "200+ studios using the unity 3dgs toolkit",
        "published at tvcg · ismar · ieee vr · iros",
      ],
      viewWork: "selected work",
      viewShop: "visit the shop",
    },
    zh: {
      role: ["混合现实研究员", "技术美术"],
      quote: "尝试用计算机图形学，去诠释人类说不上来的感觉。",
      intro: "将梦核美学引入空间计算——通过 3D 高斯泼溅、生成式世界模型，以及一点点对从未存在过的场所的怀念。",
      credits: [
        "Unity · VFX · 3DGS · 计算机图形",
        "产品设计 · 科研 · 产品开发",
        "200+ 工作室在使用 Unity 3DGS 工具包",
        "发表于 TVCG · ISMAR · IEEE VR · IROS",
      ],
      viewWork: "查看作品",
      viewShop: "前往商店",
    },
    de: {
      role: ["mixed-reality-forscherin", "technische künstlerin"],
      quote: "mit computergrafik versuchen, auszudrücken, was sich nicht in worte fassen lässt.",
      intro: "Dreamcore-Ästhetik für Spatial Computing — via 3D Gaussian Splatting, generative Weltmodelle und ein wenig Sehnsucht nach Orten, die nie existiert haben.",
      credits: [
        "Unity · VFX · 3DGS · Computer Graphics",
        "Product Design · Research · Product Development",
        "200+ Studios nutzen das Unity 3DGS Toolkit",
        "publiziert bei TVCG · ISMAR · IEEE VR · IROS",
      ],
      viewWork: "arbeiten ansehen",
      viewShop: "zum shop",
    },
  }[lang];

  return (
    <section className="hero hero--mini" data-screen-label="Home">
      <div className="hero__halo" />
      <div className="hero__cloud" aria-hidden="true">
        <window.PointCloud count={380} className="hero__cloud-canvas" />
      </div>
      <div className="container hero__grid">
        {/* LEFT — identity plate */}
        <div className="hero__left">
          <div className="logo-stage" aria-label="cocolinux">
            <div className="logo-stage__halo" />
            <img src="assets/logo.png" alt=""/>
          </div>
          <div className="hero__id">
            <span className="hero__name">cocolinux</span>
            <div className="hero__role-stack">
              {L.role.map((r, i) => (
                <span key={i} className="hero__role-line">{r}</span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — intro + arrow-itemized credits + actions */}
        <div className="hero__right">
          <blockquote className="hero__quote">
            <span className="hero__quote-bar" aria-hidden="true" />
            <p>{L.quote}</p>
          </blockquote>
          <p className="hero__intro">{L.intro}</p>

          <ul className="hero__credits">
            {L.credits.map((c, i) => (
              <li key={i}><span className="hero__bullet">›</span>{c}</li>
            ))}
          </ul>

          <div className="hero__ctas">
            <a className="arrow-link" onClick={() => setRoute("work")}>
              {L.viewWork} <span>↓</span>
            </a>
            <a className="arrow-link" href="https://payhip.com/DreamcoreXR" target="_blank" rel="noopener">
              {L.viewShop} <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
