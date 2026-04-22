// Footer.jsx — external links + copyright
function Footer({ lang }) {
  const t = window.I18N[lang].footer;
  const socials = [
    { label: "youtube",  url: "https://www.youtube.com/@cocolinux0101" },
    { label: "bilibili", url: "https://space.bilibili.com/cocolinux" },
    { label: "rednote",  url: "https://www.xiaohongshu.com/user/profile/67a22636000000000e013837" },
    { label: "scholar",  url: "https://scholar.google.com/citations?user=7tSOT2oAAAAJ&hl=zh-CN" },
    { label: "shop",     url: "https://payhip.com/DreamcoreXR" },
  ];
  return (
    <footer className="site-footer" data-screen-label="Footer">
      <div className="container site-footer__inner">
        <div className="site-footer__col">
          <span className="label">{t.socials}</span>
          <ul className="site-footer__list">
            {socials.map((s) => (
              <li key={s.label}>
                <a className="arrow-link" href={s.url} target="_blank" rel="noopener">{s.label} ↗</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="site-footer__col site-footer__col--right">
          <span className="brand-word" style={{ fontStyle: "italic", fontSize: 20 }}>cocolinux</span>
          <span className="caption">{t.copyright}</span>
        </div>
      </div>
    </footer>
  );
}

window.Footer = Footer;
