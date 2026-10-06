# Mergui Boss front store

Public website for Mergui Boss Money Exchange. React + Vite + Tailwind, installable as a PWA, built to static files for cPanel hosting.

The previous Bootstrap template is kept in `legacy/` for reference.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then build to dist/
npm run preview    # serve dist/ at http://localhost:4173
```

## Deploy to cPanel (Z.com)

1. `npm run build`
2. Upload **the contents of `dist/`** (including the hidden `.htaccess`) into `public_html`
   using cPanel File Manager or FTP.
3. The site must be served over HTTPS for install and offline mode to work. `.htaccess` redirects HTTP to HTTPS.

`.htaccess` also sends every page path to `index.html`, keeps `index.html` and the service worker uncached so updates reach visitors immediately, and caches the hashed files in `assets/` for a year.

## Live rates

Without configuration the site shows **sample rates**, clearly labelled "Sample" on the page.
To show real rates, expose a public, read-only endpoint from the Laravel backend and set:

```bash
# .env.local (not committed)
VITE_RATES_URL=https://api.example.com/api/v1/rates
```

Expected response: an array (or `{ data: [...] }`) of rows shaped like the `rates` table:

```json
[{ "currency": "THB", "country": "Thailand", "buy": "128.0", "sell": "129.5",
   "buy_status": 1, "sell_status": 0, "updated_at": "2026-10-05T09:30:00Z" }]
```

- `buy` / `sell` = MMK per 1 unit of the currency.
- `buy_status` / `sell_status`: `1` = up, `2` = down, anything else = unchanged. Confirm against the admin panel (see `src/data/rates.ts`).
- The backend must allow the website's origin in CORS.
- Rates refresh every 60 seconds; when offline, the service worker serves the last copy.

## Where to change things

| What | File |
|---|---|
| Phone numbers, email, address, hours | `src/config/site.ts` |
| Brand colours and fonts | `src/index.css` (`@theme`) |
| Sections | `src/components/*.tsx`, order in `src/App.tsx` |
| App name and icons for install | `vite.config.ts` (`manifest`), `public/icon-*.png` |
