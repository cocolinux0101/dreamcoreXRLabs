// App.jsx — stitches all the components together
function App() {
  const [lang, setLang] = React.useState(() => localStorage.getItem("dc-lang") || "en");
  const [route, setRoute] = React.useState(() => localStorage.getItem("dc-route") || "home");
  const [openWork, setOpenWork] = React.useState(null);

  React.useEffect(() => { localStorage.setItem("dc-lang", lang); }, [lang]);
  React.useEffect(() => { localStorage.setItem("dc-route", route); }, [route]);

  // scroll to section when route changes
  React.useEffect(() => {
    if (route === "home") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const el = document.querySelector(`[data-screen-label="${route[0].toUpperCase() + route.slice(1)}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [route]);

  return (
    <>
      <window.Cursor />
      <window.ParallaxDust />
      <window.Bioluminescence />
      <window.IdleBloom />
      <window.Header route={route} setRoute={setRoute} lang={lang} setLang={setLang} />
      <main>
        <window.Hero lang={lang} setRoute={setRoute} />
        <window.WorkGrid lang={lang} onOpen={setOpenWork} />
        <window.About lang={lang} />
        <window.Shop lang={lang} />
        <window.Contact lang={lang} />
      </main>
      <window.Footer lang={lang} />
      {openWork && <window.WorkDetail work={openWork} lang={lang} onClose={() => setOpenWork(null)} />}
    </>
  );
}

window.App = App;
