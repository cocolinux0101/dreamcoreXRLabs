// About.jsx — minimal artist statement.
// Section label · two bio paragraphs · scholar link. Nothing more.
function About({ lang }) {
  const t = window.I18N[lang].about;
  return (
    <section className="about section" data-screen-label="About">
      <div className="container about__grid">
        <aside className="about__side">
          <span className="label">{t.label}</span>
          <div className="about__cloud" aria-hidden="true">
            <window.PointCloud count={220} className="about__cloud-canvas" />
          </div>
        </aside>
        <div className="about__body">
          <p className="about__p about__p--lead">{t.p1}</p>
          <p className="about__p">{t.p2}</p>
          <div className="about__links">
            <a className="arrow-link" href="https://scholar.google.com/citations?user=7tSOT2oAAAAJ&hl=zh-CN" target="_blank" rel="noopener">
              {t.scholar}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

window.About = About;
