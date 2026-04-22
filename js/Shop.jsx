// Shop.jsx — promo for Dreamcore XR Labs Payhip shop.
// Features a 3DGS-captured "machine in the garden" showpiece — color-shifted
// into the site's cool cyan palette via a layered blend stack so the warm
// roses read as bioluminescent blooms instead of competing with the theme.
function Shop({ lang }) {
  const t = window.I18N[lang].shop;
  return (
    <section className="shop section" data-screen-label="Shop">
      <div className="container shop__grid">
        <div className="shop__visual">
          <div className="shop__image-stage">
            <img
              className="shop__image"
              src="assets/shop/glitter-demo.png"
              alt="3DGS scene rendered with the Dreamcore XR toolkit — a vintage mac buried in blooms of glittering gaussian splats"
              loading="lazy"
            />
            <div className="shop__image-tint" aria-hidden="true" />
            <div className="shop__image-glow" aria-hidden="true" />
            <div className="shop__image-scan" aria-hidden="true" />
            <div className="shop__image-corners" aria-hidden="true">
              <span /><span /><span /><span />
            </div>
            <div className="shop__image-caption">
              <span className="shop__image-tag">▸ volumetric relighting · real-time</span>
              <span className="shop__image-tag shop__image-tag--muted">rendered in unity with the dreamcore 3dgs toolkit</span>
            </div>
          </div>
        </div>
        <div className="shop__body">
          <span className="label">{t.label}</span>
          <h2 className="shop__title">{t.title}</h2>
          <p className="shop__desc muted">{t.body}</p>
          <ul className="shop__features">
            {(t.features || []).map((f, i) => (
              <li key={i}><span className="shop__bullet">›</span>{f}</li>
            ))}
          </ul>
          <a className="btn btn--primary" href="https://payhip.com/DreamcoreXR" target="_blank" rel="noopener">
            {t.cta}
          </a>
          <span className="shop__trust caption">{t.trust}</span>
        </div>
      </div>
    </section>
  );
}

window.Shop = Shop;
