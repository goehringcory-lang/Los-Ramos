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

## Browser security warnings

### Red "Dangerous site" / "Deceptive site ahead" page (Google Safe Browsing)

If browsers show a **full-screen red warning** before the site loads, the domain has been
flagged by Google Safe Browsing. The site's code has been audited and is clean — no forms, no
logins, no downloads, no third-party scripts beyond Google Fonts and Google Analytics — so this
is a false positive (or leftover reputation from a previous owner of the domain). **The flag can
only be removed by asking Google to re-review the site.** Steps for the site owner:

1. **Verify ownership in [Google Search Console](https://search.google.com/search-console).**
   Add a *URL-prefix* property for `https://visitlosramos.com/`. The easiest verification method
   is **Google Analytics** — the GA4 tag (`G-G204EQWS47`) is already in the `<head>` of every
   page, so verification is automatic *if you sign in with the Google account that has edit
   access to that GA4 property*. Fallback: choose the **HTML file** method and commit the
   verification file to this repository's root.
2. Open **Security & Manual Actions → Security issues**. This shows exactly what Google claims
   (deceptive pages / malware / harmful downloads) and which URLs are affected.
3. Click **Request review** and state briefly: *"Static informational tourism website for a
   community project. No forms, no logins, no downloads, no user data collection. Content has
   been reviewed and contains nothing deceptive or harmful."* Reviews typically resolve within
   **1–3 days** (malware-class flags can take longer), plus up to 72 h for the warning to clear
   from all browsers. Don't submit repeated requests — that slows the queue.
4. **If the Security issues report is empty** but browsers still show the warning, report the
   false positive directly at
   <https://safebrowsing.google.com/safebrowsing/report_error/>.
5. Check current status any time at
   <https://transparencyreport.google.com/safe-browsing/search?url=visitlosramos.com>.

> Note: no HTTP→HTTPS redirect script has been added to the pages, deliberately. GitHub Pages
> already 301-redirects server-side when **Enforce HTTPS** is on, a client-side redirect adds no
> security (it runs only after the insecure load), and adding redirect scripts while under
> Safe Browsing review can itself look suspicious to scanners.

### "Your connection is not private" / `net::ERR_CERT_COMMON_NAME_INVALID`

A **full-screen red "Your connection is not private"** warning (Chrome:
`net::ERR_CERT_COMMON_NAME_INVALID`; Firefox: `SSL_ERROR_BAD_CERT_DOMAIN`; Safari: *"this website
may be impersonating…"*) means the TLS certificate the server handed the browser does **not** list
`visitlosramos.com` in its Common Name / Subject Alternative Names. On GitHub Pages this almost
always means **GitHub has not (yet) provisioned the free Let's Encrypt certificate for the custom
domain**, so it is falling back to its default certificate (issued for `*.github.io`, not this
domain) — whose name doesn't match, hence the error.

This is **not** a bug in this repository and **cannot be fixed by a commit**. DNS is already
correct — the apex *and* `www` resolve to GitHub Pages' `185.199.108–111.153`, and the `CNAME`
file is correct — so the fix is in **repo Settings → Pages** and, in rare cases, at the **DNS
provider**. Work through these in order:

1. **Re-provision the certificate.** Repo **Settings → Pages**. Confirm the custom domain reads
   `visitlosramos.com` with a green check. If the HTTPS section shows a certificate error, or
   **Enforce HTTPS** is greyed out with a "not yet available" / "provisioning" message: clear the
   **Custom domain** field, **Save**, wait ~1 minute, re-enter `visitlosramos.com`, **Save** again.
   That re-runs domain verification and re-requests the certificate. (The committed `CNAME` file
   keeps the domain pinned across deploys — this toggle is only to re-trigger issuance; do **not**
   delete `CNAME` from the repo.) Issuance is usually minutes but can take up to **24 h**; when it
   completes, tick **Enforce HTTPS**.
2. **Check for a blocking CAA record.** If a DNS `CAA` record exists that does not authorize Let's
   Encrypt, GitHub can *never* issue the certificate and step 1 will never finish. Check with
   `dig CAA visitlosramos.com +short` (or your DNS provider's dashboard). If **any** `CAA` record
   is present, make sure one of them is `0 issue "letsencrypt.org"` — otherwise remove the `CAA`
   records or add that line.
3. **If this domain was ever used on another GitHub account or repo,** GitHub may refuse to issue
   until ownership is re-proven: Settings → Pages will ask for a
   `_github-pages-challenge-goehringcory-lang` **TXT** record — add it at the DNS provider, then
   re-add the domain.
4. **Test the apex, not `www`.** Load `https://visitlosramos.com` directly. The managed certificate
   covers both the apex and `www`, but only once provisioning (step 1) has completed.
5. **After it's fixed,** the browser may still show the old cached certificate — hard-reload, or
   confirm in a fresh Incognito / Private window.

Check the live certificate any time (a healthy result shows `subject=CN=visitlosramos.com` issued
by Let's Encrypt, **not** `*.github.io`):

```bash
echo | openssl s_client -servername visitlosramos.com -connect visitlosramos.com:443 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
```

### "Not secure" in the address bar (plain HTTP)

If the browser shows a **"Not secure"** label next to the URL, the fix is in GitHub, not in
this repository's code (the site itself loads no insecure resources, and DNS already points at
GitHub Pages correctly):

1. Go to repo **Settings → Pages**.
2. Check **Enforce HTTPS**.
3. If the checkbox is greyed out with a message about the certificate, GitHub is still
   provisioning the TLS certificate for `visitlosramos.com` — wait up to 24 h. If it stays stuck,
   remove the custom domain on that page, save, re-add it, and try again; provisioning re-runs.

Without **Enforce HTTPS**, `http://visitlosramos.com` is served as plain HTTP instead of
redirecting to HTTPS, which is what triggers the browser warning.

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
