# ApiCare — Product Requirements Document (PRD)

**Project:** ApiCare website (apicare.co.in)
**Document version:** 1.0
**Last updated:** 29 April 2026
**Owner:** Nikhil Pradhan, CEO/Founder
**Status:** Active development — MVP build phase

---

## Purpose of this document

This PRD captures the full context, decisions, and current state of the ApiCare website build. It exists so that:

1. The work can resume cleanly in any new session, with any AI assistant or human developer
2. Context is preserved across long gaps (MBA finals, travel, etc.)
3. Decisions are traceable — every "why" has a written answer
4. The site can be handed off to a freelance developer with minimal onboarding

---

## 1. Company context

### 1.1 What is ApiCare

ApiCare Organic Farms Pvt Ltd is a smallholder honey collective from Sikkim, India. The company partners with verified beekeepers across four districts to produce single-village Himalayan forest honey, with full digital traceability from hive to jar.

| Fact | Value |
|---|---|
| Founded | 2020 |
| Beekeepers in network | 125 verified |
| Districts covered | 4 (North, East, West, South Sikkim) |
| Operating model | RAMP partner (Government of Sikkim) |
| Pricing to beekeepers | 3–4× local middleman rate (₹1,000–1,200/kg vs ₹300–500/kg market) |
| Current revenue | Primarily from RAMP grants |
| EU export status | Pipeline in progress, ETA ~18 months from April 2026 |

### 1.2 Strategic positioning

ApiCare's category: **Single-Origin Provenance-Led DTC Storytelling Commerce.** Reference brands: Araku Coffee (closest analogue), Heavenly Organics, Last Forest, Marou Chocolate, Aesop, Blue Bottle.

The structural moat: **regional naming + verified traceability**. Honey is named by source village (e.g., "Dzongu, North Sikkim — Himalayan Forest Honey") rather than by floral source. This creates geographic monopoly — only ApiCare can produce "Dzongu honey." Combined with FarmLedger traceability, it justifies premium pricing in a way that floral naming cannot.

### 1.3 Sister project: FarmLedger

FarmLedger is the digital traceability infrastructure that powers the QR codes on ApiCare jars. The website's `/traceability` page is the public-facing argument for why this matters. FarmLedger is being built in parallel; the website assumes it will exist by launch.

---

## 2. Site architecture

### 2.1 Final sitemap (9 routes)

| Route | Purpose | Status |
|---|---|---|
| `/` | Home — hero, story preview, featured honey, beekeepers, traceability teaser | ✅ Built |
| `/honey` | Catalogue with district-filter map view | ✅ Built |
| `/honey/[slug]` | PDP — generated per honey from data file | ✅ 4 generated |
| `/beekeepers` | Beekeeper index with FPIC framing — named profiles + collective counter | ✅ Built |
| `/beekeepers/[slug]` | Individual beekeeper profile (only generates routes for consentLevel >= 2) | ✅ 1 generated (Dal Bhadur Rai) |
| `/story` | 4-chapter editorial founding narrative | ✅ Built with real copy |
| `/programs` | Programs & Recognition — RAMP, training, audits, certifications | ✅ Built |
| `/traceability` | Why traceability matters + FarmLedger explainer | ✅ Built with real copy |
| `/journal` | Blog index (currently "first letter coming soon" framing) | ✅ Built |
| `/contact` | Contact form, no separate wholesale page | ✅ Built |

**Pages intentionally NOT built:**
- Wholesale page — B2B inquiries route through Contact until EU export is real
- About Us — merged into Our Story
- FAQ — merged into product pages and Contact
- Cart page — Snipcart provides overlay UI, no dedicated route needed

### 2.2 Navigation structure (v9)

```
Header:
  ApiCare (logo)  |  ABOUT ▾  |  HONEY SHOP  |  IMPACT  |  CONTACT  |  ₹ INR / $ USD  |  CART

  ABOUT dropdown (hover on desktop, tap-accordion on mobile):
    ├── Our Story
    ├── The Beekeepers
    └── Traceability

  Clicking ABOUT itself → /about (overview page summarizing all three)

Footer:    Brand block | Shop links | About links | Connect links
           Newsletter capture, copyright

Routes:    /, /about, /honey, /honey/[slug], /beekeepers, /beekeepers/[slug],
           /story, /traceability, /impact, /contact

Renamed in v9: /programs → /impact (same content, page renamed only)
```

---

## 3. Brand system

### 3.1 Visual identity

| Token | Value | Notes |
|---|---|---|
| **Primary background** | `#FAF7F2` (warm cream) | Not pure white — feels like premium paper |
| **Section divider bg** | `#F4EFE6` (deeper cream) | Used for alternating sections |
| **Card background** | `#FBFAF6` (paper) | For product cards, map containers |
| **Primary text** | `#1A1916` (near-black) | Editorial, not pure black |
| **Secondary text** | `#403D37` | Body copy |
| **Muted text** | `#7A7269` | Captions, eyebrows |
| **Faded** | `#B8B0A4` | Disabled state, dividers |
| **Brand accent (honey)** | `#B8541A` | Single accent color, target <5% of any page |
| **Brand accent deep** | `#9A4516` | Hover state |
| **Brand accent warm** | `#C8651E` | Lighter highlights |

**Critical brand rule:** The honey accent is used SPARINGLY — only for buttons, key emphasis, hover states, and visual punctuation. Never for backgrounds, large text blocks, or borders. Restraint is the look.

### 3.2 Typography

| Element | Font | Notes |
|---|---|---|
| **Headlines** | Cormorant Garamond | Transitional serif, Aesop-adjacent. Free on Google Fonts. |
| **Body & UI** | Inter | Neutral grotesque sans. Free. |
| **Combination** | Serif headlines + sans body | Non-negotiable for editorial heritage feel |

The pairing was chosen as the closest free-font equivalent to Aesop's proprietary Suisse Works + Suisse Int'l.

### 3.3 Layout philosophy

- **Generous whitespace** — sections are 5.5rem (88px) padding top/bottom on mobile, 7.5rem (120px) on desktop
- **Reading-width prose** — long-form text capped at 38rem (~600px) for readability
- **Editorial layouts** — long-form pages use 12-column grid with text + side rails (stats, quotes, maps), not full-width prose
- **Hairline dividers** — 1px lines in `#B8B0A4`, used as section breaks
- **Eyebrow labels** — small caps tracking-widest, used above all section headers

### 3.4 Motion

- **Hero ken-burns** — 30s slow zoom on hero image
- **Bee animation** — 26s curving flight path across hero, single bee, brand-colored, restrained
- **Fade-up entrance** — staggered 200ms delays on hero text elements
- **Scroll reveal** — IntersectionObserver triggers fade-up on sections as they enter viewport
- **All animations respect `prefers-reduced-motion`**

---

## 4. Product catalogue

### 4.1 Naming convention (locked)

Format: `[Village], [District] — Himalayan Forest Honey`

Example: "Dzongu, North Sikkim — Himalayan Forest Honey"

This mirrors the Burgundy wine naming pattern (e.g., "Gevrey-Chambertin, Côte de Nuits"). The naming creates geographic exclusivity — only ApiCare beekeepers in Dzongu can produce Dzongu honey.

### 4.2 Phase 1 SKUs (4 total)

| Slug | Village | District | Status | Price (250g/500g INR) |
|---|---|---|---|---|
| `zitlang-pakyong` | Zitlang | East/Pakyong | ✅ Live | ₹650 / ₹1,200 |
| `kewzing-south` | Kewzing | South | ✅ Live | ₹650 / ₹1,200 |
| `dzongu-north` | Dzongu | North | ⏳ Coming Soon (late 2026) | ₹850 / ₹1,600 (premium pricing) |
| `yuksom-west` | Yuksom | West | ⏳ Coming Soon (2027) | ₹750 / ₹1,400 |

**Why Dzongu is flagship despite being unavailable:** Dzongu has the strongest brand story (Lepcha Reserve, Khangchendzonga Biosphere, restricted entry). It still appears first on the home page because the *story* sells the brand even before the jar ships. When live, it justifies premium pricing.

**District naming nuance:** Site uses 4 historical districts (N/E/W/S) for navigation/UX clarity even though Sikkim now has 6 administrative districts (Pakyong and Soreng were carved out in 2021). Product names use the modern district where it matters (e.g., "Pakyong" for Zitlang) but the catalogue filter UI uses 4-district framework.

### 4.3 Coming Soon behavior

- Card displays "Coming Soon" badge in honey accent color, top-left
- Card opacity reduced slightly (80%)
- PDP replaces "Add to Cart" button with email capture form ("Notify Me")
- All storytelling remains visible — just no purchase action
- Single source of truth: `available: false` flag in `src/data/honey.js`

---

## 5. Tech stack

| Layer | Tool | Why |
|---|---|---|
| **Framework** | Astro 4 | Static site generation; ships zero JS by default; perfect for content sites |
| **Styling** | Tailwind CSS 3 | Utility-first; design tokens centralized in config |
| **Fonts** | Google Fonts (Cormorant Garamond, Inter) | Free, brand-appropriate |
| **Hosting** | GitHub Pages | Free, static hosting, automatic SSL |
| **Domain** | apicare.co.in (custom domain on GitHub Pages via CNAME) | Already owned |
| **Checkout** | Snipcart (lightweight overlay cart) | 2% transaction fee, no monthly cost; multi-currency native |
| **Currency** | INR + USD with localStorage-persisted toggle | Indian + international DTC |
| **Forms** | TODO: Formspree/Basin (contact), Buttondown/Mailchimp (newsletter) | Currently scaffolded, not wired |
| **Analytics** | TODO: Plausible (recommended, privacy-friendly) | Not yet added |

---

## 6. File structure

```
apicare-web/
├── README.md
├── package.json
├── astro.config.mjs              # Domain config, integrations
├── tailwind.config.mjs           # ALL design tokens (colors, fonts, spacing)
├── .github/workflows/deploy.yml  # Auto-deploy to GitHub Pages on push to main
├── .gitignore
├── public/
│   ├── CNAME                     # apicare.co.in for GitHub Pages
│   ├── images/
│   │   ├── hero.jpg              # Khangchendzonga hero shot
│   │   ├── honey/                # TODO: real product photos
│   │   ├── beekeepers/           # TODO: real portraits
│   │   └── landscape/            # TODO: regional landscape shots
│   └── favicon.svg               # TODO: real favicon
└── src/
    ├── data/                     # SINGLE SOURCE OF TRUTH
    │   ├── site.js               # Nav, contact, Snipcart key, social
    │   ├── honey.js              # Product catalogue (4 SKUs)
    │   └── beekeepers.js         # Beekeeper profiles
    ├── components/
    │   ├── Header.astro          # Sticky nav with currency toggle
    │   ├── Footer.astro          # Newsletter capture, link grid
    │   ├── Bee.astro             # Animated SVG bee
    │   ├── JarSilhouette.astro   # Placeholder honey jar SVG
    │   └── SikkimMap.astro       # Schematic 4-region map with district highlighting
    ├── layouts/
    │   └── BaseLayout.astro      # HTML head, header, footer, scroll-reveal
    ├── pages/
    │   ├── index.astro           # Home
    │   ├── story.astro           # Editorial 4-chapter founding narrative
    │   ├── traceability.astro    # FarmLedger argument + 3-layer scan demo
    │   ├── contact.astro
    │   ├── honey/
    │   │   ├── index.astro       # Catalogue with grid/region toggle
    │   │   └── [slug].astro      # Dynamic PDP, generated per honey
    │   ├── beekeepers/
    │   │   ├── index.astro
    │   │   └── [slug].astro      # Dynamic profile
    │   └── journal/
    │       └── index.astro       # Blog index (empty state with email capture)
    └── styles/
        └── global.css            # Base styles, hero CSS, animations, scroll reveal
```

---

## 7. Key data models

### 7.1 Honey SKU schema (`src/data/honey.js`)

```javascript
{
  slug: 'dzongu-north',           // URL-safe, used in /honey/[slug]
  name: 'Dzongu, North Sikkim',   // Display name (no "Himalayan Forest Honey")
  subtitle: 'Himalayan Forest Honey',  // Italic line under name
  district: 'North',              // For map filtering (one of: North/East/West/South)
  districtFull: 'North Sikkim',   // For display
  village: 'Dzongu',
  oneLiner: '...',                // ~15 words, used on cards and PDP
  placeStory: '...',              // ~150 words, "The Place" section on PDP
  forestStory: '...',             // ~80 words, "The Forest" section on PDP
  beekeepers: ['dal-bhadur-rai'], // Array of beekeeper slugs (for "Your Beekeepers" section)
  altitude: '700 – 6,000 m',
  harvestSeason: 'Late Spring',
  sizes: [
    { weight: '250g', priceINR: 850, priceUSD: 16 },
    { weight: '500g', priceINR: 1600, priceUSD: 30 },
  ],
  image: '/images/honey/dzongu.jpg',  // TODO: real image when available
  available: false,               // Toggle for live vs coming soon
  comingSoonNote: 'First commercial harvest expected late 2026.',
  flagship: true,                 // Optional, appears first on home page
}
```

### 7.2 Beekeeper schema (`src/data/beekeepers.js`)

```javascript
{
  slug: 'dal-bhadur-rai',
  name: 'Dal Bhadur Rai',
  role: 'Master Trainer',
  village: 'Zitlang',
  district: 'East',
  yearsWithApiCare: 'Since 2021',
  hives: 24,
  bio: '...',                     // ~150 words, in their voice
  quote: '...',                   // Optional, max 20 words
  portrait: '/images/beekeepers/dal-bhadur-rai.jpg',
  actionShot: '/images/beekeepers/dal-bhadur-rai-work.jpg',
  honeySlugs: ['zitlang-pakyong'],  // Which honey(s) they produce
}
```

---

## 8. Locked decisions

These are fully decided and should not be relitigated without strong reason.

| # | Decision | Rationale |
|---|---|---|
| 1 | **Region-based naming, not floral** | Geographic monopoly = pricing power. Burgundy/champagne model. |
| 2 | **Domain: apicare.co.in** | Already owned, GitHub Pages compatible |
| 3 | **GitHub Pages, not paid hosting** | Free, sufficient for traffic, simple deploy |
| 4 | **No paid theme** | Custom architecture matches brand requirements better than off-the-shelf |
| 5 | **Snipcart over Shopify** | Lightweight, no monthly fee, integrates with static sites |
| 6 | **INR + USD currency toggle, not per-region pricing** | Simpler logistics during launch |
| 7 | **Cormorant Garamond + Inter fonts** | Closest free pairing to Aesop-adjacent feel |
| 8 | **Warm-white background, not pure white** | Premium paper feel, less clinical |
| 9 | **Single honey accent color, used <5% of page** | Restraint creates premium signal |
| 10 | **First-person plural voice ("we", "our beekeepers")** | More human than third-person, less autobiographical than founder voice |
| 11 | **EU export referenced as imminent in copy** | Builds expectation, supports premium positioning |
| 12 | **RAMP mentioned, World Bank kept in background** | RAMP is the operational reality; World Bank is too far removed for consumer-facing copy |
| 13 | **No wholesale page at MVP** | Premature; B2B inquiries via Contact form |
| 14 | **Schematic Sikkim map, hand-drawn version later** | Phase C; current schematic is placeholder for real illustration |
| 15 | **Photography ranks higher than theme purchase as visual upgrade** | $300–600 photographer >> $99 theme |
| 16 | **FPIC consent framework for beekeepers** | Three-tier system; only consenting beekeepers shown publicly. See section 8b. |

---

## 8b. FPIC Consent Framework for Beekeepers

This is one of the most important decisions in the project — both ethically and strategically. ApiCare follows the principle of Free, Prior, and Informed Consent (FPIC) for any decision about how a beekeeper's name, photo, or story is used in public.

### Why this matters

Naming a smallholder beekeeper on a global e-commerce site exposes them to risks they may not fully understand: targeted contact from buyers/journalists, income visibility creating community pressure, loss of bargaining position, image rights drift if ApiCare is acquired, and permanence on the internet (Wayback Machine, screenshots).

For Lepcha and other indigenous communities (especially Dzongu), there are additional cultural sensitivities about name + image use that go beyond standard data privacy. ApiCare being a Government of Sikkim RAMP partner makes FPIC compliance not just ethical but operationally relevant — RAMP and the World Bank both have explicit FPIC requirements for smallholder programmes.

### The three-tier system

Every beekeeper has a `consentLevel` field in `src/data/beekeepers.js` that controls public visibility:

| Tier | What's shown publicly | Trigger |
|---|---|---|
| **0 — Hidden** | Nothing. Counted in collective total only. | Default for placeholder/unconfirmed beekeepers |
| **1 — Collective only** | Counted in collective total only. **No name, no photo, no village-level breakdown.** | Default for new beekeepers until consent documented |
| **2 — First name + role** | "Pema, Beekeeper from Zitlang" + work-in-action photo (no face) | Beekeeper signs Tier 2 consent form |
| **3 — Full profile** | Name + portrait + bio + quote on a dedicated profile page | Beekeeper signs Tier 3 consent form |

**Locked decision (29 April 2026):** For Tier 0/1 beekeepers, the public site displays only the *aggregate total* (e.g., "121 unnamed beekeepers"). Village-level breakdowns are tracked in the internal `collective.byVillage` object for audits, RAMP submissions, and operational planning, but **never rendered publicly**. This is the most defensible privacy posture and is documented in this PRD as a locked decision.

### Code enforcement

The `getStaticPaths()` function in `/beekeepers/[slug].astro` only generates routes for beekeepers with `consentLevel >= 2`. All public-facing beekeeper data goes through `getPublicBeekeepers()` which filters out anything below Tier 2. This is enforced at build time — there is no way to accidentally expose a Tier 0/1 beekeeper through normal site navigation.

### Operational requirements

Before setting any beekeeper to consentLevel 2 or 3:
1. A signed consent form must exist on file
2. The form must specify the exact tier of visibility
3. The beekeeper must understand the global, permanent nature of web publication
4. The form must be in their language with witness signature
5. The right-to-withdraw clause must be active — within 24 hours of any request

Phase 1 launch plan: 4 named beekeepers (one per Phase 1 village) at Tier 3, all with documented consent. The remaining 121 stay at Tier 1 (counted only) until they explicitly request and sign higher visibility.

### Public-facing copy

The home page and `/beekeepers` page use this framing:
> *"125 beekeepers. The ones you meet here, chose to be here. A beekeeper's name and face on a global website is a permanent thing. We never publish either without explicit consent."*

This is *more* premium and trustworthy than the previous "every one of them, named" framing. It signals to discerning buyers that ApiCare takes its smallholder partnerships seriously beyond the marketing language of traceability.

---

## 9. Build phases

### ✅ Phase A — Critical bugs (complete)
- Astro `site` updated to `https://www.apicare.co.in`, `base: '/'`
- Hero image path corrected (was hardcoded to `/apicare-web/`)
- CNAME file fixed (was a directory, not a file)
- `site.js` URL updated for SEO meta tags

### ✅ Phase B — Bee redesign (complete)
- Replaced cartoonish yellow bee with editorial brand-colored silhouette
- Curved organic flight path with hover moments and pauses
- Mobile-responsive sizing
- `prefers-reduced-motion` respect

### ✅ Phase D — Real copy (complete)
- Story page: 4 chapters, ~1,100 words, first-person plural voice
- Traceability page: ~700 words across 3 essay sections
- Zitlang PDP: full placeStory + forestStory
- Kewzing PDP: full placeStory + forestStory
- Dzongu PDP: full storytelling, marked Coming Soon
- Yuksom PDP: full storytelling, marked Coming Soon
- Dal Bhadur Rai beekeeper profile

### ✅ Phase C-light — Layout fixes + schematic map (complete)
- Story + Traceability rebuilt with editorial 12-col layout (text column + side rails with stats, pull-quotes, timelines)
- Catalogue rebuilt: All Villages = 4-up grid, Region click = single-region view + Sikkim map
- Empty product cards replaced with `JarSilhouette` SVG component
- Schematic Sikkim SVG map with 4-region district highlighting

### 🔜 Phase C-full — Real Sikkim map (pending)
- Replace schematic SVG with hand-drawn topographic illustration
- Commission illustrator (~$150–400) OR commission via Behance/Fiverr
- Same component API — drop-in replacement of inner SVG paths

### 🔜 Phase E — Photography & content polish (pending)
- Hire Sikkim-based photographer for 2-day shoot (~$300–600)
- Shot list: beekeeper portraits, honey jars, landscape, lifestyle
- Replace `JarSilhouette` placeholders with real product photos
- Add 4–7 more beekeeper profiles

### 🔜 Phase F — Forms & integrations (pending)
- Connect contact form to Formspree or Basin (~10 min setup)
- Connect newsletter forms to Buttondown or Mailchimp
- Wire Snipcart with real public API key
- Add Plausible analytics
- Test full purchase flow

### 🔜 Phase G — Production deploy (pending)
- Push to GitHub repo
- Configure GitHub Pages with custom domain
- DNS setup at registrar (apicare.co.in points to GitHub Pages)
- Verify SSL, sitemap, OG tags work in production

---

## 10. Outstanding TODOs in code

Search for `TODO` in the codebase to find these markers:

| Location | Task |
|---|---|
| `src/data/site.js` | Replace `YOUR_SNIPCART_PUBLIC_API_KEY_HERE` with real key |
| `src/data/site.js` | Confirm email is `hello@apicare.co.in` (or correct to real address) |
| `src/data/site.js` | Update Instagram, LinkedIn URLs |
| `src/data/honey.js` | Verify `comingSoonNote` dates for Dzongu and Yuksom |
| `src/data/beekeepers.js` | Replace invented Dal Bhadur Rai quote with real one |
| `src/data/beekeepers.js` | Add 4-7 more beekeeper profiles |
| `src/pages/contact.astro` | Connect form to Formspree/Basin |
| `src/components/Footer.astro` | Connect newsletter form to email service |
| `src/pages/journal/index.astro` | Connect newsletter form |
| `src/pages/honey/[slug].astro` | Connect Notify-Me form for Coming Soon SKUs |
| `src/layouts/BaseLayout.astro` | Add real favicon (replace TODO comment) |
| `public/images/honey/*` | Add real product photos |
| `public/images/beekeepers/*` | Add real portraits |

---

## 11. Voice & copy guidelines

For anyone writing or editing copy on this site:

### 11.1 Voice rules

- **First-person plural** — "we", "our beekeepers", never "I" or "ApiCare does"
- **Restrained, factual, slightly editorial** — Read like *The New Yorker*, not like a startup landing page
- **Concrete numbers over vague claims** — "₹300–500/kg" not "below market rate"; "ten to fifteen times" not "much more"
- **No marketing-speak** — never "premium," "world-class," "best-in-class," "amazing," "delicious"
- **No exclamation marks anywhere**
- **Sentence case for headlines** — "Single-village honey from Sikkim's protected forests." NOT Title Case
- **British/editorial spelling acceptable** — "professionalise," "colour" (matches Aesop, *Guardian* register)

### 11.2 Brand phrasing (use these)

- "Single-village honey" (not "single-origin" — too coffee)
- "Smallholder beekeepers" (not "farmers" or "producers")
- "Verified beekeepers" (not "our beekeepers")
- "Himalayan Forest Honey" (the master subtitle)
- "Sikkim's protected forests" / "Sikkim, India's only fully organic state"
- "FarmLedger" (the proof system)
- "The honey is what people taste. The system behind the honey is what we are actually building." (signature manifesto line)

### 11.3 Phrases to avoid

- "Award-winning" (until you have actual awards)
- "Sustainable" (overused, adds nothing)
- "Crafted with love" (saccharine)
- "Pure" / "natural" (regulatory grey area)
- "Honey gold" or other purple-prose color descriptions

---

## 12. How to update the site

### 12.1 Add a new honey

Edit `src/data/honey.js`. Add a new object to the `honey` array following the schema in section 7.1. The PDP at `/honey/[your-slug]` is generated automatically on build. Catalogue and home page also update automatically.

### 12.2 Add a new beekeeper

Edit `src/data/beekeepers.js`. Add a new object following section 7.2. Profile page generates automatically. Link to honey via `honeySlugs` array.

### 12.3 Change brand colors

Edit `tailwind.config.mjs` — `theme.extend.colors`. Search for the color name (e.g., `honey`) to find its uses across the codebase if needed.

### 12.4 Change fonts

Edit two files:
- `tailwind.config.mjs` → `theme.extend.fontFamily`
- `src/styles/global.css` → top `@import url(...)` for Google Fonts

### 12.5 Update navigation / contact info

Edit `src/data/site.js`. All header, footer, and metadata pull from this file.

### 12.6 Change layout / page structure

Edit the `.astro` file in `src/pages/`. Each page is self-contained.

---

## 13. Deployment

### 13.1 GitHub Pages workflow

The repo includes `.github/workflows/deploy.yml` which auto-deploys on every push to `main`. No manual steps after initial setup:

1. Create a GitHub repo
2. Push code
3. In repo Settings → Pages → Source: GitHub Actions
4. Custom domain in Settings → Pages → enter `www.apicare.co.in`
5. Configure DNS at registrar (CNAME `www` → `[username].github.io`)

### 13.2 Local development

```bash
cd apicare-web
npm install        # only first time
npm run dev        # http://localhost:4321
npm run build      # produces ./dist
npm run preview    # preview the production build locally
```

### 13.3 Custom domain switching

The Astro config at `astro.config.mjs` has commented alternates for switching between custom domain (`apicare.co.in`) and GitHub Pages preview URL (`username.github.io/apicare-web`). Use the latter for staging deploys without the custom domain.

---

## 14. Known limitations

| Issue | Impact | Plan |
|---|---|---|
| Schematic map, not topographic | Functional but not yet brand-defining | Phase C-full will replace |
| All product images are SVG silhouettes | Cards look intentional but not photographic | Phase E (photography) |
| Forms are scaffolded, not wired | No actual data capture yet | Phase F (10-min Formspree setup) |
| Snipcart key is placeholder | Cannot take real orders yet | Phase F (5-min Snipcart signup) |
| Only 1 beekeeper profile | "125 beekeepers" claim feels thin | Add 4-7 profiles via Phase E |
| No analytics | Cannot measure traffic | Phase F (Plausible) |

---

## 15. Cost summary (to date and projected)

| Item | Cost (INR) | Cost (USD) | Status |
|---|---|---|---|
| Domain (apicare.co.in) | Already owned | — | ✅ Owned |
| GitHub Pages hosting | ₹0 | $0 | ✅ Free |
| Astro + Tailwind + fonts | ₹0 | $0 | ✅ Free |
| Snipcart fees | 2% per transaction | 2% per transaction | Pay-per-sale |
| Photography shoot (planned) | ₹25,000–60,000 | $300–700 | 🔜 Phase E |
| Sikkim map illustration (planned) | ₹12,000–35,000 | $150–400 | 🔜 Phase C-full |
| Form services (Formspree/Buttondown free tiers) | ₹0 | $0 | 🔜 Phase F |
| Plausible analytics | ₹750/month | $9/month | 🔜 Phase F |

**Total projected MVP launch cost:** ₹40,000–100,000 (~$500–1,200), excluding ongoing Plausible.

---

## 16. Reference materials

### 16.1 Aesthetic references
- Araku Coffee — https://arakucoffee.in (closest direct analogue)
- Heavenly Organics — direct honey competitor
- Last Forest Honey — direct honey competitor
- Aesop — typography and restraint reference
- Blue Bottle — minimal commerce reference
- Marou Chocolate — single-origin storytelling reference
- Patagonia — long-form editorial reference

### 16.2 Brand inspiration phrases
- "The honey is what people taste. The system behind the honey is what we are actually building."
- "Single-village honey, never blended."
- "Every jar carries a village name. Every village has a story."
- "125 beekeepers. Every one of them, named."

---

## 17. Glossary

| Term | Definition |
|---|---|
| **RAMP** | Government of Sikkim's Raising and Accelerating MSME Performance programme; ApiCare is a recognised partner |
| **FarmLedger** | ApiCare's digital traceability product; powers QR codes and provenance verification |
| **PDP** | Product Detail Page — `/honey/[slug]` |
| **Single-village** | ApiCare's category positioning — honey is bottled by source village, never blended |
| **Master Trainer** | Beekeeper role — trains other beekeepers in their region (e.g., Dal Bhadur Rai in Zitlang) |
| **Snipcart** | Lightweight cart/checkout overlay; 2% transaction fee, no monthly cost |
| **EMU** | Erasmus Mundus Joint Master — Nikhil's MBA programme (context for project timeline) |

---

*This document is the canonical source of truth for the ApiCare website project. Update it when major decisions change. Push it to git alongside the code so it travels with the project.*
