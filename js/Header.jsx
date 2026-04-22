// Header.jsx — fixed header with language toggle
function Header({ route, setRoute, lang, setLang }) {
  const [scrolled, setScrolled] = React.useState(false);
  const t = window.I18N[lang];

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { k: "work",    label: t.nav.work },
    { k: "about",   label: t.nav.about },
    { k: "shop",    label: t.nav.shop },
    { k: "contact", label: t.nav.contact },
  ];

  return (
    <header className={"site-header " + (scrolled ? "scrolled" : "")}>
      <div className="site-header__inner">
        <a className="brand" onClick={() => setRoute("home")}>
          <span className="brand-mark" style={{
            background: "radial-gradient(circle, rgba(143,224,240,0.9), rgba(143,224,240,0.2) 60%, transparent 70%)",
          }}/>
          <span className="brand-word">cocolinux</span>
        </a>

        <nav className="site-nav">
          {items.map((it) => (
            <a
              key={it.k}
              className={"nav-link " + (route === it.k ? "active" : "")}
              onClick={() => setRoute(it.k)}
            >
              {it.label}
            </a>
          ))}
        </nav>

        <div className="lang">
          {["en", "zh", "de"].map((code, i) => (
            <React.Fragment key={code}>
              <span
                className={"lang-chip " + (lang === code ? "active" : "")}
                onClick={() => setLang(code)}
              >
                {code === "zh" ? "中文" : code.toUpperCase()}
              </span>
              {i < 2 && <span className="lang-sep">·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </header>
  );
}

window.Header = Header;
