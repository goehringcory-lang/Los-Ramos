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
| `ferry.html` | San Jorge ⇄ Ometepe ferry timetable (crawlable HTML tables + photos) |
| `404.html` | Custom not-found page (`noindex`) |
| `css/style.css` | Single stylesheet |
| `js/main.js` | Vanilla JS: language toggle, lightbox, smooth scroll, mobile menu |
| `images/` | Photography and graphics |
| `sitemap.xml`, `robots.txt` | SEO crawl files |
| `llms.txt` | Plain-text site summary for AI search engines and assistants |
| `.nojekyll` | Skips Jekyll processing on GitHub Pages (faster deploys) |

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

- Rich JSON-LD on the homepage: `TouristAttraction` / `LocalBusiness` (with `contactPoint`,
  `knowsLanguage`, `containedInPlace` → Wikipedia, `sameAs` → the community's TripAdvisor
  listing), `LodgingBusiness`, `FAQPage` (11 questions), `WebSite`. The ferry page carries
  `BreadcrumbList`, `WebPage`, and `BoatTrip` structured data.
- Bilingual (English/Spanish) via `data-es` attributes toggled client-side; `hreflang` alternates
  declared for `en`, `es`, and `x-default`.
- Image sitemap with descriptive titles in `sitemap.xml`.
- When page content changes meaningfully, bump the relevant `<lastmod>` date in `sitemap.xml`.
- **FAQ rule:** the visible FAQ items in `index.html` and the `FAQPage` JSON-LD must stay in
  sync — Google requires the schema to match on-page content. Edit both together.
- **Ferry schedule rule:** the timetable lives in crawlable HTML tables in `ferry.html` (search
  engines and AI assistants cannot read the photos). When the port posts a new schedule, update
  the tables **and** the photos **and** the "photographed [month year]" note, then bump
  `<lastmod>`.

## AI search (ChatGPT, Claude, Perplexity, Google AI Overviews)

- `llms.txt` at the site root is a plain-text summary (programs, prices, booking email, travel
  directions) that AI crawlers can ingest cheaply. Keep it in sync when prices or programs
  change — it is the most likely text to be quoted verbatim by an AI assistant.
- `robots.txt` explicitly allows the major AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended, etc.). This is deliberate: for a site whose goal is visibility, being
  citable by AI assistants is free distribution.
- The FAQ answers are written to be quotable as standalone answers ("How do I get to Ometepe
  from Costa Rica?", "Is Ometepe safe?") — this is what AI engines lift into responses.

## Growing traffic beyond the site (off-page checklist)

Most ranking gains for a small local site come from listings and links, not code. In rough
order of impact:

1. **Google Search Console** — verify the property (see above), submit `sitemap.xml`, and
   request indexing of `/` and `/ferry.html` after significant updates.
2. **Google Business Profile** ([business.google.com](https://business.google.com)) — create a
   free profile for "Los Ramos Community Tourism" (category: Tour operator / Homestay), pinned
   to the village on the map, with photos, prices, the booking email, and a link to
   visitlosramos.com. This is what puts the community on Google Maps and in the local pack.
3. **TripAdvisor** — the community already has a listing with reviews:
   [Los Ramos on TripAdvisor](https://www.tripadvisor.com/Attraction_Review-g304024-d2695343-Reviews-Los_Ramos-Isla_de_Ometepe_Rivas_Department.html).
   Claim it via TripAdvisor's owner center, add the website link and fresh photos, and ask
   happy visitors to leave a review — recent reviews move ranking on both TripAdvisor and
   Google.
4. **Bing Webmaster Tools** ([bing.com/webmasters](https://www.bing.com/webmasters)) — one-click
   import from Search Console. Bing powers ChatGPT search and DuckDuckGo.
5. **Ask for links from sites travelers already read**: Ometepe hostels and hotels ("things to
   do" pages), travel bloggers who visited, volunteer/NGO partners, and the VIAnica directory.
   One genuine link from an Ometepe hostel's website is worth more than any code change.
6. **Wikivoyage** — the Ometepe article accepts listings of genuine attractions; add Los Ramos
   with factual, non-promotional wording per their guidelines.
7. **Ask every guest** to post a review (TripAdvisor or Google) and tag the community on
   social media. Word of mouth is the community's strongest asset — reviews make it visible
   to search engines.
