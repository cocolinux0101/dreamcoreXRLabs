// Contact.jsx — posts the form to Web3Forms (https://web3forms.com),
// a free, GitHub-Pages-friendly form endpoint. No backend required.
//
// To wire it up:
//   1. Grab an access key at https://web3forms.com/ (one-click, no account).
//   2. Replace WEB3FORMS_ACCESS_KEY below with the UUID that arrives by email.
//   3. In the Web3Forms dashboard, restrict "Allowed Origins" to your
//      github.io / custom domain so other sites can't abuse the key.
//
// If the POST fails (network issue, rate limit, key not set), we surface a
// mailto: fallback so nobody hits a dead end.

const WEB3FORMS_ACCESS_KEY = "12ebbc83-c795-4947-8ace-e77fbd0a21d5";
const CONTACT_EMAIL        = "cocolinux0101@gmail.com";

function Contact({ lang }) {
  const t = window.I18N[lang].contact;
  const [status, setStatus] = React.useState("idle"); // idle | sending | sent | error
  const [subj, setSubj] = React.useState(t.subject_opts[0]);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => { setSubj(t.subject_opts[0]); }, [lang]);

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `[cocolinux portfolio] ${subj}`,
      from_name: "cocolinux portfolio",
      name, email, message,
      topic: subj,
      botcheck: "",                // honeypot — bots fill this, humans can't
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus("sent");
      } else {
        console.warn("Web3Forms error:", data);
        setStatus("error");
      }
    } catch (err) {
      console.warn("Web3Forms network error:", err);
      setStatus("error");
    }
  };

  const mailtoHref = (() => {
    const subject = `[cocolinux portfolio] ${subj}`;
    const body = `${message}\n\n—\nfrom: ${name}\nreply to: ${email}`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  })();

  return (
    <section className="contact section" data-screen-label="Contact">
      <div className="container contact__grid">
        <div className="contact__intro">
          <span className="label">{t.label}</span>
          <h2 className="contact__title">{t.title}</h2>
          <p className="muted">{t.body}</p>
        </div>
        <form className="contact__form" onSubmit={submit} noValidate>
          {status === "sent" ? (
            <div className="contact__sent">
              <span className="label">✓</span>
              <p>{t.sent}</p>
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
                  disabled={status === "sending"}
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
                  disabled={status === "sending"}
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
                      onClick={() => status !== "sending" && setSubj(o)}
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
                  disabled={status === "sending"}
                  required
                />
              </div>

              {/* honeypot — hidden from humans, filled by bots */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex="-1"
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px" }}
                aria-hidden="true"
              />

              {status === "error" && (
                <p className="caption contact__error">
                  sending failed. try again, or write directly to{" "}
                  <a className="arrow-link" href={mailtoHref}>{CONTACT_EMAIL}</a>
                </p>
              )}

              <button
                className="btn btn--primary"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "sending…" : `${t.submit} →`}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

window.Contact = Contact;
