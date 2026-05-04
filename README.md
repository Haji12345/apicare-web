# ApiCare — Website

Single-village honey from Sikkim's protected forests.
Built with Astro + Tailwind. Deployed to GitHub Pages. Snipcart for checkout.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Astro 4 (static site generation) |
| Styling | Tailwind CSS 3 |
| Fonts | Cormorant Garamond + Inter (Google Fonts) |
| Checkout | Snipcart (2% transaction fee) |
| Hosting | GitHub Pages (free) |
| Currency | INR + USD with toggle |

## Quick Start

You need Node.js 18+ installed.

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
# → opens at http://localhost:4321

# 3. Build for production
npm run build
# → output goes to ./dist/

# 4. Preview production build locally
npm run preview
```

## Project Structure

```
apicare-web/
├── src/
│   ├── pages/                    # One file = one URL
│   │   ├── index.astro           # Home /
│   │   ├── story.astro           # /story
│   │   ├── traceability.astro    # /traceability
│   │   ├── contact.astro         # /contact
│   │   ├── honey/
│   │   │   ├── index.astro       # /honey (catalogue)
│   │   │   └── [slug].astro      # /honey/dzongu-north etc.
│   │   ├── beekeepers/
│   │   │   ├── index.astro       # /beekeepers
│   │   │   └── [slug].astro      # /beekeepers/dal-bhadur-rai etc.
│   │   └── journal/
│   │       └── index.astro       # /journal
│   ├── layouts/
│   │   └── BaseLayout.astro      # Wraps every page
│   ├── components/
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── data/                     # SINGLE SOURCE OF TRUTH
│   │   ├── honey.js              # ← Add/edit honey SKUs here
│   │   ├── beekeepers.js         # ← Add/edit beekeeper profiles here
│   │   └── site.js               # Nav, contact info, Snipcart key
│   └── styles/
│       └── global.css            # Base styles + utility classes
├── public/                        # Static assets, served as-is
│   └── images/
│       ├── honey/                # Product photos (4:5 ratio recommended)
│       ├── beekeepers/           # Portraits (3:4 ratio recommended)
│       └── landscape/            # Sikkim landscape shots
├── astro.config.mjs               # Astro config (site URL, base path)
├── tailwind.config.mjs            # ALL DESIGN TOKENS HERE
└── package.json
```

## Editing Content

### Add a new honey SKU
Open `src/data/honey.js`, copy an existing entry, change the values. The PDP at `/honey/your-slug` is generated automatically.

### Add a new beekeeper
Open `src/data/beekeepers.js`, add to the array. Profile at `/beekeepers/your-slug` is generated automatically.

### Change brand colors / fonts / spacing
Open `tailwind.config.mjs`. Edit the `theme.extend` section. All pages update.

### Change navigation / contact info
Open `src/data/site.js`.

## Photography

Drop photos into the matching folder under `public/images/`:
- `public/images/honey/zitlang.jpg` (4:5 ratio works best)
- `public/images/beekeepers/dal-bhadur-rai.jpg` (3:4 ratio)
- `public/images/landscape/dzongu-valley.jpg` (16:9 or 21:9)

Then update the `image:` field in the relevant data file.

Until photos exist, the site shows elegant placeholder blocks — looks intentional, not broken.

## Snipcart Setup

1. Sign up at https://snipcart.com (free until you sell)
2. Get your **public test API key** from Account → API Keys
3. Open `src/data/site.js` and replace `YOUR_SNIPCART_PUBLIC_API_KEY_HERE`
4. Add INR and USD as accepted currencies in Snipcart dashboard
5. When ready to take real orders, swap the test key for the live key

## Deployment to GitHub Pages

### One-time setup

1. Create a GitHub repo (e.g., `apicare-web`)
2. Push this code to the repo
3. In GitHub → Settings → Pages:
   - Source: **GitHub Actions**
4. Open `astro.config.mjs` and update:
   - `site:` to `https://YOUR-USERNAME.github.io`
   - `base:` to `/apicare-web` (the repo name)
5. Push the change — the workflow at `.github/workflows/deploy.yml` builds and deploys automatically on every push to `main`.

### Custom domain (later)

When you buy `apicare.in`:
1. Add a `CNAME` file to `public/` containing `apicare.in`
2. Update `astro.config.mjs`: `site: 'https://apicare.in'`, `base: '/'`
3. Configure DNS at your registrar to point at GitHub Pages

## What's Done vs TODO

✅ **Done (Day 1 scaffold):**
- All 7 pages built and routable
- Design tokens locked (colors, fonts, spacing)
- Header + footer with currency toggle
- Snipcart integration wired
- Honey + beekeeper data models in place
- 4 PDPs auto-generated from data
- Sitemap + SEO meta tags

🔨 **TODO (your work):**
- Write copy on Story, Traceability, Journal pages (search for `[ TODO` in code)
- Add real photos to `public/images/`
- Replace Snipcart API key with real one
- Add remaining beekeepers to `src/data/beekeepers.js`
- Fill `placeStory` and `forestStory` in `src/data/honey.js` for each SKU
- Replace placeholder Sikkim map with real SVG illustration (Day 6 work)
- Connect newsletter form to email service
- Connect contact form to form handler

## Memory of Decisions

- Region-based naming format locked: `[Village], [District] — Himalayan Forest Honey`
- Phase 1 SKUs: Zitlang (Pakyong), Kewzing (South), Dzongu (North), Yuksom (West)
- Reference aesthetic: Araku Coffee + Aesop minimalism
- Brand: warm white + single golden-red accent, no other colors
- Wholesale page intentionally not built — B2B routes through Contact
