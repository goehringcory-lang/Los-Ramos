# Los Ramos — visitlosramos.com

Marketing and information site for **Los Ramos**, a community-tourism and cultural-immersion
project run by an indigenous community on Ometepe Island, Lake Nicaragua. The site promotes
homestays, cooking classes, horseback tours, Spanish lessons, kayaking, beekeeping, and other
experiences, with bookings handled by email.

## Tech stack

Hand-coded **static site** — no build step, no framework.

| Path | Purpose |
|------|---------|
| `index.html` | Homepage (all content + JSON-LD schema) |
| `ferry.html` | San Jorge ⇄ Moyogalpa ferry schedule |
| `404.html` | Custom not-found page (`noindex`) |
| `css/style.css` | Single stylesheet |
| `js/main.js` | Vanilla JS: language toggle, lightbox, smooth scroll, mobile menu |
| `images/` | Photography and graphics |
| `sitemap.xml`, `robots.txt` | SEO crawl files |

## Local development

No tooling required — open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deployment

Hosted on **GitHub Pages**. The workflow `.github/workflows/static.yml` deploys the repository
root on every push to `main` (typically live within 1–3 minutes, allowing for CDN cache).

To ship a change: merge to `main` → wait for the **Deploy static content to Pages** Action to go
green (repo **Actions** tab) → verify on the live domain.

## Custom domain (`visitlosramos.com`)

The `CNAME` file pins the **apex** domain `visitlosramos.com`. This is the canonical host used in
all `<link rel="canonical">`, Open Graph, hreflang, and sitemap URLs.

### Optional: make `www.visitlosramos.com` work too

The apex works out of the box. To also serve `www` (GitHub Pages will automatically **redirect
`www` → apex** once DNS is in place), add this record at your DNS provider — this is a DNS change,
**not** a repository change:

| Type  | Host / Name | Value |
|-------|-------------|-------|
| CNAME | `www`       | `goehringcory-lang.github.io` |

Then, in the repo, go to **Settings → Pages** and keep **Enforce HTTPS** enabled. After DNS
propagates, `https://www.visitlosramos.com` will 301-redirect to `https://visitlosramos.com`.

> If `www` is not configured, tools that probe `www.visitlosramos.com` (including Google's tag
> checker) will fail to find the site there — always test against the apex `visitlosramos.com`.

## Analytics

**Google Analytics 4** is installed via `gtag.js` on all three pages with Measurement ID
`G-G204EQWS47` (a public ID — safe to keep in source).

To verify tracking: open `https://visitlosramos.com`, then watch **GA4 → Reports → Realtime**
(disable ad/tracking blockers, which suppress `gtag`). GA's "tag wasn't detected" wizard is
unreliable; Realtime and viewing page source for `G-G204EQWS47` are the dependable checks.

## SEO notes

- Rich JSON-LD on the homepage: `TouristAttraction` / `LocalBusiness`, `LodgingBusiness`,
  `FAQPage`, `WebSite`; `BreadcrumbList` on the ferry page.
- Bilingual (English/Spanish) via `data-es` attributes toggled client-side; `hreflang` alternates
  declared for `en`, `es`, and `x-default`.
- Image sitemap with descriptive titles in `sitemap.xml`.
- When page content changes meaningfully, bump the relevant `<lastmod>` date in `sitemap.xml`.
