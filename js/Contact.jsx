// Contact.jsx — opens the visitor's mail client pre-filled via mailto:.
// Static-hosting-friendly (GitHub Pages / any CDN) — no backend needed.
// Tradeoff: users without a configured mail client see nothing happen, so we
// always expose the email address as copy-able text in the "sent" state.

const CONTACT_EMAIL = "cocolinux0101@gmail.com";

function Contact({ lang }) {
  const t = window.I18N[lang].contact;
  const [sent, setSent] = React.useState(false);
  const [subj, setSubj] = React.useState(t.subject_opts[0]);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => { setSubj(t.subject_opts[0]); }, [lang]);

  const submit = (e) => {
    e.preventDefault();
    const subject = `[cocolinux portfolio] ${subj}`;
    const body = `${message}\n\n—\nfrom: ${name}\nreply to: ${email}`;
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
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
              <p className="caption contact__sent-fallback">
                if your mail app didn't open, write directly to{" "}
                <a className="arrow-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>
            </div>
          ) : (
            <>
              <div className="field-row">
                <label>{t.name}</label>
                <input
                  className="field"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="field-row">
                <label>{t.email}</label>
                <input
                  className="field"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                <textarea
                  className="field"
                  name="message"
                  rows="4"
                  placeholder={t.placeholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
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
