// Contact.jsx — simple minimal form
function Contact({ lang }) {
  const t = window.I18N[lang].contact;
  const [sent, setSent] = React.useState(false);
  const [subj, setSubj] = React.useState(t.subject_opts[0]);

  React.useEffect(() => { setSubj(t.subject_opts[0]); }, [lang]);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="contact section" data-screen-label="Contact">
      <div className="container contact__grid">
        <div className="contact__intro">
          <span className="label">{t.label}</span>
          <h2 className="contact__title">{t.title}</h2>
          <p className="muted">{t.body}</p>
        </div>
        <form className="contact__form" onSubmit={submit}>
          {sent ? (
            <div className="contact__sent">
              <span className="label">✓</span>
              <p>{t.sent}</p>
            </div>
          ) : (
            <>
              <div className="field-row">
                <label>{t.name}</label>
                <input className="field" required />
              </div>
              <div className="field-row">
                <label>{t.email}</label>
                <input className="field" type="email" required />
              </div>
              <div className="field-row">
                <label>{t.subject}</label>
                <div className="subject-opts">
                  {t.subject_opts.map((o) => (
                    <span
                      key={o}
                      className={"subject-chip " + (subj === o ? "active" : "")}
                      onClick={() => setSubj(o)}
                    >{o}</span>
                  ))}
                </div>
              </div>
              <div className="field-row">
                <label>{t.message}</label>
                <textarea className="field" rows="4" placeholder={t.placeholder} required/>
              </div>
              <button className="btn btn--primary" type="submit">{t.submit} →</button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

window.Contact = Contact;
