# dist/ — deploy folder

Self-contained static build of the Dreamcore XR Labs website. Drag this folder onto https://app.netlify.com/drop and it will go live immediately. No build step.

## Layout

```
dist/
├── index.html          entry point
├── site.css            bundled design tokens + site styles
├── _redirects          Netlify SPA fallback
├── netlify.toml        headers + caching + redirect rules
├── js/
│   ├── i18n.js         translation dictionary (EN/ZH/DE)
│   └── *.jsx           React components (compiled in-browser by Babel Standalone)
└── assets/
    ├── logo.png
    ├── shop/glitter-demo.png
    └── works/*.gif
```

## Deploy to Netlify (drag & drop)

1. Go to https://app.netlify.com/drop
2. Drag the **`dist/` folder itself** (not its contents) onto the drop zone
3. Netlify publishes it under a `*.netlify.app` URL. Rename the site or attach a custom domain in the dashboard.

## Local preview

No build step. Open with any static server:

```bash
# Python 3
python -m http.server 8080

# Node
npx serve .
```

Then visit http://localhost:8080. Opening `index.html` directly via `file://` will NOT work — the `fetch`-based loading of `.jsx` scripts by Babel Standalone requires an HTTP origin.

## Notes

- **Runtime JSX compilation.** The site uses `@babel/standalone` to transpile `.jsx` on every page load. Fine for a portfolio; if you ever need faster first-paint, swap in a Vite/esbuild pre-build — the JSX is vanilla React, nothing exotic.
- **Fonts** come from Google Fonts CDN (VT323, Special Elite, JetBrains Mono, Noto Sans/Serif SC).
- **Custom cursor** hides the OS cursor. The CSS disables `cursor: auto` via `body { cursor: none }`. If that ever feels wrong, add `class="no-custom-cursor"` to `<body>`.
- **Contact form** is client-side only (no POST endpoint). To wire it up for real, either:
  - Add `name="contact"` + `data-netlify="true"` to the `<form>` in `js/Contact.jsx` (Netlify Forms), or
  - Replace the `submit` handler with a `fetch()` to your own endpoint.
