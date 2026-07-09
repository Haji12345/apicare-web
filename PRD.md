# ApiCare — Product Requirements Document (PRD)

**Project:** ApiCare website (apicare.co.in)
**Document version:** 2.0
**Last updated:** 9 July 2026
**Owner:** Nikhil Pradhan, CEO/Founder
**Status:** Active development — MVP build phase
**Supersedes:** v1.0 (29 April 2026)

> **How to use this document.** Paste this file at the start of any new session
> with an AI assistant or developer. It is designed to be sufficient context on
> its own. Sections marked ⚠️ contain *unverified* data that must not be shipped
> as fact. Sections marked 🔴 are known contradictions awaiting your decision.

---

## 0. What changed in v2.0

| # | Change | Why |
|---|---|---|
| 1 | **Origin Atlas shipped** — illustrated topographic map replaces the schematic placeholder | Phase C-full complete (was §14 "Known limitation #1") |
| 2 | Added §5.3 **Animation stack** — settles the GSAP question definitively | Recurring question; now answered from the lockfile |
| 3 | Added §7.3 **atlas.js schema** + 🔴 §7.4 data-duplication conflict | New data file introduced a second source of truth |
| 4 | Corrected §6 file structure to match the **actual** repo | v1.0 drifted from code in 4 places (see §0.1) |
| 5 | Added §14 **Shippability audit** — what is genuinely blocking launch | "Is it shippable?" needed a real answer |
| 6 | Added §18 **Verification protocol** | Encodes the accuracy-over-narrative principle as process |

### 0.1 Corrections to v1.0 (documentation drift)

These were found by diffing v1.0's claims against the real `index.astro`:

| v1.0 claimed | Reality in code | Action |
|---|---|---|
| `public/images/hero.jpg` (single hero shot) | `hero1.jpg` … `hero5.jpg` — it's a **5-image slider** with prev/next buttons | §6 corrected |
| `src/components/SikkimMap.astro` exists and is used | `index.astro` **never imported it**; the map was an inline placeholder div | Replaced by `OriginAtlas.astro` |
| Sitemap has `/about` and `/impact` (v9 nav) | `index.astro` only links `/honey`, `/story`, `/beekeepers`, `/traceability` | 🔴 See §2.3 |
| README says 7 pages, `/programs` | PRD says 10 routes, `/impact` | 🔴 README and PRD disagree — reconcile |

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

Category: **Single-Origin Provenance-Led DTC Storytelling Commerce.** Reference brands: Araku Coffee (closest analogue), Heavenly Organics, Last Forest, Marou Chocolate, Aesop, Blue Bottle.

The structural moat: **regional naming + verified traceability**. Honey is named by source village (e.g., "Dzongu, North Sikkim — Himalayan Forest Honey") rather than by floral source. This creates geographic monopoly — only ApiCare can produce "Dzongu honey." Combined with FarmLedger traceability, it justifies premium pricing in a way floral naming cannot.

### 1.3 Sister project: FarmLedger

FarmLedger is the digital traceability infrastructure powering the QR codes on ApiCare jars. The `/traceability` page is the public-facing argument for why this matters. FarmLedger is being built in parallel; the website assumes it will exist by launch.

---

## 2. Site architecture

### 2.1 Routes

| Route | Purpose | Status |
|---|---|---|
| `/` | Home — hero slider, story preview, **Origin Atlas**, featured honey, beekeepers, traceability teaser | ✅ Built |
| `/honey` | Catalogue with district-filter view | ✅ Built |
| `/honey/[slug]` | PDP — generated per honey from `honey.js` | ✅ 4 generated |
| `/beekeepers` | Beekeeper index with FPIC framing | ✅ Built |
| `/beekeepers/[slug]` | Individual profile (only for `consentLevel >= 2`) | ✅ 1 generated |
| `/story` | 4-chapter editorial founding narrative | ✅ Built, real copy |
| `/traceability` | FarmLedger explainer | ✅ Built, real copy |
| `/journal` | Blog index ("first letter coming soon") | ✅ Built |
| `/contact` | Contact form | ✅ Built |

**Intentionally NOT built:** Wholesale (routes through Contact until EU export is real) · About Us (merged into Our Story) · FAQ (merged into product pages + Contact) · Cart page (Snipcart provides overlay UI).

### 2.2 Navigation (v9 target)

```
Header:  ApiCare  |  ABOUT ▾  |  HONEY SHOP  |  IMPACT  |  CONTACT  |  ₹ INR / $ USD  |  CART

  ABOUT dropdown (hover desktop, tap-accordion mobile):
    ├── Our Story          → /story
    ├── The Beekeepers     → /beekeepers
    └── Traceability       → /traceability

Footer:  Brand block | Shop | About | Connect | Newsletter capture | Copyright
```

### 2.3 🔴 Unresolved: `/programs` vs `/impact` vs `/about`

Three documents disagree:

- **PRD v1.0 §2.2** — nav has `ABOUT` (clicking → `/about` overview page) and `IMPACT`; says "renamed in v9: `/programs` → `/impact`"
- **README** — lists `/programs`, no `/about`, no `/impact`
- **`index.astro`** — links to neither; only `/honey`, `/story`, `/beekeepers`, `/traceability`

**Decide one and propagate.** Until then, do not add nav links to routes that may not exist — they will 404 on GitHub Pages.

---

## 3. Brand system

### 3.1 Colour tokens

Source of truth: `tailwind.config.mjs` → `theme.extend.colors`.

| Token | Hex | Use |
|---|---|---|
| `cream.DEFAULT` | `#FAF7F2` | Primary background (warm white, not pure) |
| `cream.deep` | `#F4EFE6` | Alternating section divider |
| `cream.paper` | `#FBFAF6` | Card backgrounds |
| `ink.DEFAULT` | `#1A1916` | Primary text (editorial near-black) |
| `ink.soft` | `#403D37` | Body copy |
| `ink.mute` | `#7A7269` | Captions, eyebrows |
| `ink.fade` | `#B8B0A4` | Dividers, disabled |
| `honey.DEFAULT` | `#B8541A` | **The** brand accent — CTAs, emphasis |
| `honey.deep` | `#9A4516` | Hover |
| `honey.warm` | `#C8651E` | Lighter highlight |
| `honey.glow` | `#E8A87C` | 20% tint background |
| `moss` | `#5A6E4A` | Regional indicator (map) |

**Critical brand rule:** the honey accent is used SPARINGLY — buttons, key emphasis, hover, punctuation. Never for backgrounds, large text blocks, or borders. Target **<5% of any page**. Restraint is the look.

> ⚠️ **Palette exception — Origin Atlas.** The illustrated plates were drawn with a
> distinct ochre `#B9831C` and greige stage `#E7E0CF`, baked into the SVG artwork.
> These do **not** match `honey.DEFAULT` (`#B8541A`). This is intentional and
> contained: the atlas reads as an inset "atlas panel," like a plate tipped into a
> book. Both values are exposed as CSS variables (§9.3) if you want to reconcile
> them — but reconciling means **re-exporting the SVGs**, not just changing CSS.

### 3.2 Typography

| Element | Font | Notes |
|---|---|---|
| Headlines | **Cormorant Garamond** | Transitional serif, Aesop-adjacent. Google Fonts. |
| Body & UI | **Inter** | Neutral grotesque. Google Fonts. |

Chosen as the closest free equivalent to Aesop's Suisse Works + Suisse Int'l. Serif headlines + sans body is **non-negotiable**.

> The illustrator's original atlas export shipped **Spectral** + **Spline Sans Mono**
> (27 embedded woff2 files). These were **removed** during integration — the site's
> own fonts are used instead. Do not reintroduce them.

### 3.3 Layout philosophy

- **Generous whitespace** — 5.5rem (88px) section padding mobile, 7.5rem (120px) desktop
- **Reading-width prose** — capped at `max-w-reading` = 38rem (~600px)
- **Editorial layouts** — 12-column grid with text + side rails, not full-width prose
- **Hairline dividers** — 1px `ink.fade`
- **Eyebrow labels** — small caps, `tracking-widest`, above every section header

---

## 4. Product catalogue

### 4.1 Naming convention (locked)

Format: `[Village], [District] — Himalayan Forest Honey`
Example: *"Dzongu, North Sikkim — Himalayan Forest Honey"*

Mirrors Burgundy wine naming (*"Gevrey-Chambertin, Côte de Nuits"*). Creates geographic exclusivity.

### 4.2 Phase 1 SKUs

| Slug | Village | District | Status | Price (250g/500g INR) |
|---|---|---|---|---|
| `zitlang-pakyong` | Zitlang | East/Pakyong | ✅ Live | ₹650 / ₹1,200 |
| `kewzing-south` | Kewzing | South | ✅ Live | ₹650 / ₹1,200 |
| `dzongu-north` | Dzongu | North | ⏳ Coming Soon (late 2026) | ₹850 / ₹1,600 |
| `yuksom-west` | Yuksom | West | ⏳ Coming Soon (2027) | ₹750 / ₹1,400 |

**Why Dzongu is flagship despite being unavailable:** strongest brand story (Lepcha Reserve, Khangchendzonga Biosphere, restricted entry). The *story* sells the brand before the jar ships.

**District naming nuance:** the site uses 4 historical districts (N/E/W/S) for nav clarity even though Sikkim now has 6 administrative districts (Pakyong and Soreng carved out in 2021). Product names use the modern district where it matters ("Pakyong" for Zitlang); the catalogue filter uses the 4-district framework.

### 4.3 Coming Soon behaviour

- "Coming Soon" badge, honey accent, top-left of card
- Card opacity 80%
- PDP swaps "Add to Cart" → "Notify Me" email capture
- All storytelling remains visible
- Single source of truth: `available: false` in `src/data/honey.js`

---

## 5. Tech stack

### 5.1 Core

| Layer | Tool | Why |
|---|---|---|
| Framework | **Astro 4** (`^4.16.19`) | SSG; ships **zero JS by default** |
| Styling | **Tailwind CSS 3** (`^3.4.13`) | Utility-first; tokens centralised in config |
| Tailwind integration | `@astrojs/tailwind` (`^5.1.5`) | — |
| Fonts | Google Fonts (Cormorant Garamond, Inter) | Free, brand-appropriate |
| Hosting | GitHub Pages | Free, static, auto-SSL |
| Domain | `apicare.co.in` via CNAME | Already owned |
| Checkout | Snipcart | 2% per transaction, no monthly cost |
| Currency | INR + USD, localStorage-persisted toggle | Indian + international DTC |
| Forms | ⚠️ TODO — Formspree/Basin, Buttondown/Mailchimp | Scaffolded, not wired |
| Analytics | ⚠️ TODO — Plausible | Not added |

**Complete `dependencies` — there are only three:**

```json
{
  "@astrojs/tailwind": "^5.1.5",
  "astro": "^4.16.19",
  "tailwindcss": "^3.4.13"
}
```

### 5.2 ❌ Does the site use GSAP? **No.**

Answered definitively by auditing `package-lock.json` (445 packages, lockfileVersion 3):

| Library | In dependency tree? |
|---|---|
| **gsap** | ❌ **absent** — the string `gsap` appears **0 times** in the entire lockfile |
| framer-motion, animejs, motion | ❌ absent |
| lenis, locomotive-scroll, AOS, ScrollReveal | ❌ absent |
| three.js | ❌ absent |
| React, Vue, Svelte, Alpine | ❌ absent |

**The stack is: Astro + Tailwind. Nothing else.** No animation library, no UI framework.

### 5.3 How the site actually animates (no library needed)

| Effect | Mechanism | Lives in |
|---|---|---|
| Hero image slider | Vanilla JS — `classList` toggle on `.hero-slider img`, prev/next listeners | inline `<script>` in `index.astro` |
| Hero ken-burns (30s zoom) | CSS `@keyframes` + `transform` | `src/styles/global.css` |
| Bee flight path (26s) | CSS animation on inline SVG | `src/components/Bee.astro` |
| Fade-up entrance | CSS `transition`, staggered delays | `global.css` |
| Scroll reveal (`data-reveal`) | `IntersectionObserver` | ⚠️ **not in `index.astro`** — presumably `BaseLayout.astro` or `global.css`. **Unverified; that file has never been shared.** |
| Hover states | Tailwind `transition-colors duration-400 ease-editorial` | utility classes |
| Origin Atlas zoom/crossfade | Vanilla JS (~50 lines) + CSS transitions | `OriginAtlas.astro` |

**Design principle:** the whole point of Astro here is shipping zero JS. Every animation above is CSS or a handful of vanilla lines. **Adding GSAP (~70 KB gzipped) would contradict the architecture** — reach for it only if you need timeline-sequenced, scrubbed, or physics-based motion that CSS genuinely cannot express. Nothing currently in scope qualifies.

---

## 6. File structure (verified against actual repo)

```
apicare-web/
├── README.md
├── PRD.md                        # ← this file. Keep in git.
├── package.json                  # 3 deps. No GSAP.
├── package-lock.json
├── astro.config.mjs              # site: https://www.apicare.co.in, base: '/'
├── tailwind.config.mjs           # ALL design tokens
├── .github/workflows/deploy.yml  # auto-deploy on push to main
├── .gitignore                    # node_modules, dist, .astro, .DS_Store, *.log, .env*
├── public/
│   ├── CNAME                     # apicare.co.in
│   ├── favicon.svg               # ⚠️ TODO real favicon
│   └── images/
│       ├── hero1.jpg … hero5.jpg # 5-image hero slider (NOT a single hero.jpg)
│       ├── atlas/                # ★ NEW — Origin Atlas assets
│       │   ├── sikkim.svg        #   master relief map (overview)
│       │   ├── zitlang.svg       #   region plate
│       │   ├── dzongu.svg        #   region plate
│       │   ├── yuksom.svg        #   region plate
│       │   ├── kewzing.svg       #   region plate
│       │   ├── glyph-bee.svg     #   Zitlang glyph
│       │   ├── glyph-cardamom.svg#   Dzongu glyph
│       │   ├── glyph-chorten.svg #   Yuksom glyph
│       │   └── glyph-wheat.svg   #   Kewzing glyph
│       ├── honey/                # ⚠️ TODO real product photos
│       ├── beekeepers/           # ⚠️ TODO real portraits
│       └── landscape/            # ⚠️ TODO
└── src/
    ├── data/                     # SINGLE SOURCE OF TRUTH
    │   ├── site.js               # Nav, contact, Snipcart key, social
    │   ├── honey.js              # Product catalogue (4 SKUs)
    │   ├── beekeepers.js         # Beekeeper profiles
    │   └── atlas.js              # ★ NEW — Origin Atlas region data
    ├── components/
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── Bee.astro
    │   ├── JarSilhouette.astro
    │   └── OriginAtlas.astro     # ★ NEW — replaces the never-used SikkimMap.astro
    ├── layouts/
    │   └── BaseLayout.astro      # head, header, footer, scroll-reveal observer
    ├── pages/
    │   ├── index.astro
    │   ├── story.astro
    │   ├── traceability.astro
    │   ├── contact.astro
    │   ├── honey/{index,[slug]}.astro
    │   ├── beekeepers/{index,[slug]}.astro
    │   └── journal/index.astro
    └── styles/
        └── global.css            # base styles, hero CSS, animations, scroll reveal
```

---

## 7. Key data models

### 7.1 Honey SKU (`src/data/honey.js`)

```javascript
{
  slug: 'dzongu-north',                // URL-safe → /honey/[slug]
  name: 'Dzongu, North Sikkim',        // Display name
  subtitle: 'Himalayan Forest Honey',  // Italic line under name
  district: 'North',                   // North | East | West | South
  districtFull: 'North Sikkim',
  village: 'Dzongu',
  oneLiner: '...',                     // ~15 words — cards + PDP
  placeStory: '...',                   // ~150 words — "The Place"
  forestStory: '...',                  // ~80 words — "The Forest"
  beekeepers: ['dal-bhadur-rai'],      // beekeeper slugs
  altitude: '700 – 6,000 m',
  harvestSeason: 'Late Spring',
  sizes: [
    { weight: '250g', priceINR: 850,  priceUSD: 16 },
    { weight: '500g', priceINR: 1600, priceUSD: 30 },
  ],
  image: '/images/honey/dzongu.jpg',
  available: false,
  comingSoonNote: 'First commercial harvest expected late 2026.',
  flagship: true,
}
```

### 7.2 Beekeeper (`src/data/beekeepers.js`)

```javascript
{
  slug: 'dal-bhadur-rai',
  name: 'Dal Bhadur Rai',
  role: 'Master Trainer',
  village: 'Zitlang',
  district: 'East',
  yearsWithApiCare: 'Since 2021',
  hives: 24,
  bio: '...',                          // ~150 words, in their voice
  quote: '...',                        // optional, max 20 words
  portrait: '/images/beekeepers/dal-bhadur-rai.jpg',
  actionShot: '/images/beekeepers/dal-bhadur-rai-work.jpg',
  honeySlugs: ['zitlang-pakyong'],
}
```

### 7.3 ★ Atlas region (`src/data/atlas.js`)

Every field carries an inline `✅ verified` or `⚠️ CONFIRM` tag.

```javascript
{
  key: 'dzongu',                       // internal id
  no: '02',                            // "Origin Nº 02"
  name: 'Dzongu',
  district: 'North Sikkim',            // ✅
  tagline: 'A Lepcha homeland.',       // ✅
  altitude: '~1,700 m',                // ⚠️ CONFIRM
  flora: 'Large Cardamom',             // ✅
  harvest: 'October – December',       // ⚠️ CONFIRM
  honey: 'Dark and resinous...',       // ⚠️ CONFIRM tasting note
  glyph: '/images/atlas/glyph-cardamom.svg',
  glyphAlt: 'Cardamom pod',
  plate: '/images/atlas/dzongu.svg',
  href: '/honey/dzongu-north',         // ✅ must match honey.js slug
  x: 43.2,  y: 40.5,                   // marker % position on sikkim.svg
}
```

### 7.4 🔴 CONFLICT: two sources of truth for region facts

`atlas.js` and `honey.js` **both** store altitude and harvest, and **they disagree**:

| Field | `honey.js` (Dzongu) | `atlas.js` (Dzongu) |
|---|---|---|
| altitude | `'700 – 6,000 m'` | `'~1,700 m'` |
| harvest | `harvestSeason: 'Late Spring'` | `harvest: 'October – December'` |

This violates the repo's own single-source-of-truth principle, and a visitor
clicking from the map to the PDP will see **contradictory facts on consecutive
screens**. Both cannot be right.

**Recommended fix (do this before launch):**

1. Decide which numbers are true (see §18 verification protocol).
2. Make `honey.js` the owner of altitude + harvest.
3. Have `atlas.js` *import* from `honey.js` rather than restate:
   ```javascript
   import { honey } from './honey.js';
   const bySlug = Object.fromEntries(honey.map(h => [h.slug, h]));
   // then: altitude: bySlug['dzongu-north'].altitude
   ```
4. `atlas.js` keeps only what is genuinely map-specific: `x`, `y`, `plate`,
   `glyph`, `no`, `tagline`.

Note the altitude discrepancy may not be an error at all — `700–6,000 m` plausibly
describes *Dzongu the region*, while `~1,700 m` describes *the apiary site*. If so,
they are different fields and should be **named** differently
(`regionAltitudeRange` vs `apiaryAltitude`), not silently duplicated.

---

## 8. Locked decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Region-based naming, not floral | Geographic monopoly = pricing power |
| 2 | Domain `apicare.co.in` | Already owned, Pages-compatible |
| 3 | Cormorant Garamond + Inter | Free Aesop-equivalent pairing |
| 4 | Single honey accent, <5% of page | Restraint is the look |
| 5 | Snipcart over Shopify | 2% vs monthly fee at low volume |
| 6 | Astro static, zero-JS default | Content site; speed + SEO |
| 7 | No wholesale page | B2B via Contact until EU export is real |
| 8 | Dzongu flagship despite unavailable | Story sells before jar ships |
| 9 | ★ **Native components over vendor bundles** | See §9.1 |
| 10 | ★ **Accuracy over narrative** | See §18 |

---

## 9. ★ The Origin Atlas

### 9.1 Why it was rebuilt, not embedded

The illustrator delivered `Apicare_Origin_Atlas.html` — a 1.2 MB self-hydrating
bundle from Claude Design. Its real structure: three JSON `<script>` blocks
(a gzip+base64 asset `manifest`, `ext_resources`, and a `template`) unpacked at
runtime into blob URLs by a proprietary React-dependent `dc-runtime`.

It was **unbundled and reimplemented natively**:

| Concern | Ship the bundle | Native `OriginAtlas.astro` |
|---|---|---|
| Weight | ~1.2 MB + React | 9 SVGs + **0 JS files emitted** (script inlined) |
| Fonts | Spectral + Spline Sans Mono (27 woff2) | Site's Cormorant Garamond + Inter |
| SEO | iframe → content invisible | Server-rendered DOM; all 4 regions in HTML |
| Editability | opaque export | `src/data/atlas.js` |
| Responsive | desktop-only, fixed 1240px | container-query driven |
| Framework | React | none |

Built HTML: **16 KB**. Astro emits **zero** JS files — the ~50-line vanilla script is inlined.

### 9.2 How it works

- **Overview:** `sikkim.svg` master relief map + 4 pulsing contour-ring markers + a dotted "honey trail" connecting them.
- **Select** (click marker or chip) → `data-active` attribute set on `.atlas__stage`; master map scales toward that marker's coordinates (`--zoom-origin`) and fades; the region panel crossfades in.
- **Panel:** region plate SVG + fact card (Origin Nº, name, tagline, altitude/district/flora/harvest grid, tasting note, "See the Honey →" CTA to the PDP).
- **Back:** `← All Origins` button or `Escape` key.
- **Progressive enhancement:** with JS disabled, the overview map still renders and all region content is present in the DOM.

### 9.3 Retuning (CSS variables, scoped to `.atlas`)

| Variable | Default | Purpose |
|---|---|---|
| `--atlas-stage-bg` | `#E7E0CF` | Surface behind the plates. **The plates are transparent** (`fill:none` background rect) — this variable *is* their background. Set to `#FAF7F2` to blend into site cream. |
| `--atlas-accent` | `#B9831C` | Marker rings, labels, active chip. Matches ochre baked into the SVGs. |
| `--atlas-ink` | `#20201E` | Lines and text |
| `--atlas-paper` | `#FFFDF6` | Fact-card background |
| `--font-display` | Cormorant Garamond | Region names, facts |
| `--font-label` | Inter | Eyebrows, chips |

### 9.4 Critical implementation note — container queries

The component uses `container-type: inline-size` + `@container atlas (max-width: 760px)`,
**not** a viewport media query. Reason: it was originally placed in a `md:col-span-7`
column (~640px) on a wide desktop. A viewport-based `@media (max-width: 760px)` would
never fire there, leaving the detail panel permanently cramped. A container query
responds to the *component's* width. A `@supports not (container-type: inline-size)`
fallback covers pre-Chrome-105 / pre-Safari-16.

**If you ever move the atlas into a narrow column, it will now stack correctly on its own.**

### 9.5 Marker coordinates

`x` / `y` in `atlas.js` are percentages of `sikkim.svg`'s box (top-left origin), tuned
to that specific artwork. **If the master map is re-exported, these must be re-tuned.**

| Region | x | y |
|---|---|---|
| Zitlang | 49.9 | 79.0 |
| Dzongu | 43.2 | 40.5 |
| Yuksom | 25.8 | 56.9 |
| Kewzing | 66.7 | 63.8 |

All five plates share `viewBox="0 0 4267 3200"` (exact 4:3).

---

## 10. ⚠️ Unverified content — DO NOT SHIP AS FACT

Tagged inline in `src/data/atlas.js`. Highest priority first:

| # | Item | Status | Note |
|---|---|---|---|
| 1 | **Harvest months, all 4 regions** | ⚠️ CONFIRM | Long-outstanding input. Values in the illustrator's export are likely auto-generated placeholders. Also conflicts with `honey.js` (§7.4). |
| 2 | **Kewzing flora: "Buckwheat"** | 🔴 CONFLICT | Contradicts the **wheat-sheaf glyph** and the brand descriptor "land of wheat fields." Buckwheat (*Fagopyrum*) is not wheat and is not a grass. Pick one; make glyph + flora agree. |
| 3 | **Altitudes, all 4 regions** | ⚠️ CONFIRM | Prefixed `~`. Approximate, not surveyed. See §7.4. |
| 4 | **Tasting notes, all 4** | ⚠️ CONFIRM | Evocative copy; confirm they describe the real product. Requires honey in hand. |
| 5 | Zitlang flora "Wildflower & Cardamom" | ⚠️ CONFIRM | — |
| 6 | Yuksom flora "Rhododendron" | ⚠️ CONFIRM | — |
| 7 | Kewzing tagline "Southern terraced hills." | ⚠️ CONFIRM | Kewzing is a Bhutia village with a community homestay cooperative — the tagline may under-sell that. |
| 8 | Beekeeper quote (Dal Bhadur Rai) | 🔴 **INVENTED** | v1.0 §10 flags this as placeholder. **Must be replaced with a real quote before launch** — attributing invented words to a named, real person is the most serious accuracy failure on the site. |

**Verified ✅ (safe to ship):** district assignments · Yuksom as first capital, 1642 · Dzongu as a protected Lepcha reserve · Dzongu → large cardamom · Zitlang as Apicare's founding location · Sikkim as India's only fully organic state.

**Zitlang's special status:** unlike the other three, Zitlang's significance is *internal to Apicare's founding story*, not external cultural heritage. Frame it as "Where Apicare began," never with unverifiable superlatives ("strongest bee community in Sikkim").

---

## 11. Voice & copy guidelines

### 11.1 Voice rules

- **First-person plural** — "we," "our beekeepers." Never "I" or "ApiCare does."
- **Restrained, factual, slightly editorial** — read like *The New Yorker*, not a startup landing page
- **Concrete numbers over vague claims** — "₹300–500/kg," not "below market rate"
- **No marketing-speak** — never "premium," "world-class," "amazing," "delicious"
- **No exclamation marks anywhere**
- **Sentence case for headlines** — not Title Case
- **British/editorial spelling acceptable** — "professionalise," "colour"

### 11.2 Brand phrasing (use these)

- "Single-village honey" (not "single-origin" — too coffee)
- "Smallholder beekeepers" (not "farmers"/"producers")
- "Verified beekeepers"
- "Himalayan Forest Honey" (master subtitle)
- "Sikkim's protected forests" / "Sikkim, India's only fully organic state"
- "FarmLedger" (the proof system)
- *"The honey is what people taste. The system behind the honey is what we are actually building."*

### 11.3 Avoid

"Award-winning" (until you have awards) · "Sustainable" (overused) · "Crafted with love" · "Pure"/"natural" (regulatory grey area) · "Honey gold" and other purple-prose colour descriptions.

---

## 12. How to update the site

| Task | File |
|---|---|
| Add a honey SKU | `src/data/honey.js` — PDP auto-generates at `/honey/[slug]` |
| Add a beekeeper | `src/data/beekeepers.js` — profile auto-generates |
| **Edit atlas region facts** | `src/data/atlas.js` |
| **Retune atlas colours** | CSS vars at top of `src/components/OriginAtlas.astro` (§9.3) |
| **Move an atlas marker** | `x` / `y` in `atlas.js` (§9.5) |
| Change brand colours | `tailwind.config.mjs` → `theme.extend.colors` |
| Change fonts | `tailwind.config.mjs` **and** `src/styles/global.css` `@import` |
| Nav / contact info | `src/data/site.js` |
| Page structure | the `.astro` file in `src/pages/` |

---

## 13. Deployment

### 13.1 Local

```bash
npm install        # first time only
npm run dev        # http://localhost:4321
npm run build      # → ./dist
npm run preview    # preview production build
```

### 13.2 Ship

```bash
git add -A
git commit -m "feat: <what changed>"
git push origin main     # .github/workflows/deploy.yml deploys to Pages
```

### 13.3 One-time setup

1. GitHub repo → Settings → Pages → Source: **GitHub Actions**
2. Custom domain: `www.apicare.co.in`
3. DNS at registrar: CNAME `www` → `[username].github.io`
4. `public/CNAME` contains `apicare.co.in`

### 13.4 Staging without the custom domain

`astro.config.mjs` has commented alternates. Switch to:
```js
site: 'https://YOUR-USERNAME.github.io',
base: '/apicare-web',
```
⚠️ If you set a `base`, absolute asset paths like `/images/atlas/sikkim.svg` **break**. Prefix them with `import.meta.env.BASE_URL`. Currently `base: '/'`, so they are fine.

---

## 14. ★ Shippability audit

**Can the site go live today?** Technically yes — it builds clean and deploys.
**Should it?** Not until the 🔴 items below are cleared.

### 14.1 🔴 Blocking launch

| # | Blocker | Why it blocks |
|---|---|---|
| 1 | Invented beekeeper quote (§10 #8) | Words attributed to a real, named person. Reputational + ethical risk. |
| 2 | Atlas ↔ honey.js data conflict (§7.4) | Visitor sees contradictory altitude/harvest one click apart. Destroys the traceability claim the whole brand rests on. |
| 3 | Kewzing "Buckwheat" vs wheat glyph (§10 #2) | Visible self-contradiction on a provenance-led site. |
| 4 | Snipcart key is a placeholder | **Cannot take a single order.** |
| 5 | Contact + newsletter forms unwired | Submissions vanish silently — worse than no form. |
| 6 | 🔴 `/programs` vs `/impact` vs `/about` (§2.3) | Nav links may 404. |

### 14.2 ⚠️ Should fix before launch

| # | Item |
|---|---|
| 7 | Harvest months + altitudes unverified (§10 #1, #3) |
| 8 | Real favicon (`public/favicon.svg` is a TODO) |
| 9 | Product photography — cards are SVG silhouettes |
| 10 | Only 1 beekeeper profile vs "125 beekeepers" claim |
| 11 | `data-reveal` handler unverified — confirm `BaseLayout.astro` has the IntersectionObserver, or sections may never fade in |
| 12 | No analytics (Plausible) |

### 14.3 ✅ Done / not blocking

Origin Atlas shipped · design tokens locked · 9 routes built · 4 PDPs generated · sitemap + SEO meta · GitHub Actions deploy · Astro build passes clean (0 errors, 0 failed requests over HTTP).

### 14.4 Minimum path to a real, transacting site

```
1. Replace the invented quote            → src/data/beekeepers.js      (30 min, needs Nikhil)
2. Resolve atlas ↔ honey data conflict   → §7.4                        (1 hr)
3. Fix Kewzing flora/glyph               → atlas.js + maybe re-export  (30 min)
4. Snipcart signup, real key             → src/data/site.js            (5 min)
5. Formspree + Buttondown                → contact.astro, Footer.astro (20 min)
6. Reconcile /programs vs /impact        → site.js + nav               (15 min)
7. Real favicon                          → public/favicon.svg          (10 min)
──────────────────────────────────────────────────────────────────────
   ≈ 3 hours of work, of which ~1 hour needs YOUR knowledge (items 1–3)
```

Everything else (photography, more beekeepers, analytics) can ship post-launch.

---

## 15. Known limitations

| Issue | Impact | Plan |
|---|---|---|
| ~~Schematic map, not topographic~~ | — | ✅ **RESOLVED** — Origin Atlas shipped |
| Product images are SVG silhouettes | Intentional-looking, not photographic | Phase E |
| Forms scaffolded, not wired | No data capture | Phase F (~20 min) |
| Snipcart key placeholder | Cannot take orders | Phase F (~5 min) |
| 1 beekeeper profile vs 125 claimed | Claim feels thin | Phase E |
| No analytics | Cannot measure traffic | Phase F |
| Atlas plates ~300 KB each | 1.6 MB if all loaded | Mitigated: `loading="lazy"` per region; only `sikkim.svg` loads upfront. Consider SVGO if it becomes an issue. |

---

## 16. Cost summary

| Item | INR | USD | Status |
|---|---|---|---|
| Domain (apicare.co.in) | owned | — | ✅ |
| GitHub Pages | ₹0 | $0 | ✅ |
| Astro + Tailwind + fonts | ₹0 | $0 | ✅ |
| Sikkim map illustration | ₹12,000–35,000 | $150–400 | ✅ **Delivered** |
| Snipcart | 2%/txn | 2%/txn | Pay-per-sale |
| Photography shoot | ₹25,000–60,000 | $300–700 | 🔜 Phase E |
| Formspree/Buttondown | ₹0 | $0 | 🔜 Phase F |
| Plausible | ₹750/mo | $9/mo | 🔜 Phase F |

**Projected MVP launch cost:** ₹40,000–100,000 (~$500–1,200), excluding Plausible.

---

## 17. Reference materials

**Aesthetic:** Araku Coffee (arakucoffee.in — closest analogue) · Heavenly Organics · Last Forest Honey · Aesop (typography, restraint) · Blue Bottle · Marou Chocolate · Patagonia (long-form editorial).

**Brand lines:**
- *"The honey is what people taste. The system behind the honey is what we are actually building."*
- *"Single-village honey, never blended."*
- *"Every jar carries a village name. Every village has a story."*
- *"125 beekeepers. Every one of them, named."*

---

## 18. ★ Verification protocol (accuracy over narrative)

This project's core claim is **traceability**. A single invented fact undermines
the entire premise. Therefore:

1. **Tag every data field** `✅ verified` or `⚠️ CONFIRM` at the point of writing.
   `atlas.js` already does this; extend the pattern to `honey.js` and `beekeepers.js`.
2. **Never invent a quote, name, date, or measurement.** A `⚠️ CONFIRM` placeholder
   is always better than a plausible fabrication — placeholders get caught, plausible
   fabrications ship.
3. **Superlatives require evidence.** "Strongest bee community in Sikkim" is
   unverifiable; "where Apicare began" is a fact. Prefer mission framing
   ("building Sikkim's strongest beekeeping community") over unearned claims.
4. **Symbols need cultural vetting.** The Bon *yungdrung* was replaced with a wheat
   sheaf for Kewzing because of how it reads to Western audiences. Vet before drawing.
5. **One fact, one owner.** If two files state the same fact, one must import from the
   other. Duplication guarantees eventual contradiction (§7.4 is the live example).
6. **Distinguish "not found" from "false."** If a fact can't be verified, mark it
   ⚠️ and route it to Nikhil — don't quietly drop or soften it.

---

## 19. Glossary

| Term | Definition |
|---|---|
| **RAMP** | Govt. of Sikkim's Raising and Accelerating MSME Performance programme; ApiCare is a recognised partner |
| **FarmLedger** | ApiCare's digital traceability product; powers QR codes and provenance verification |
| **PDP** | Product Detail Page — `/honey/[slug]` |
| **Single-village** | Category positioning — honey bottled by source village, never blended |
| **Master Trainer** | Beekeeper who trains others in their region |
| **Snipcart** | Cart/checkout overlay; 2% fee, no monthly cost |
| **Origin Atlas** | The interactive illustrated map on the home page |
| **Plate** | One of the four regional topographic SVG illustrations |
| **Glyph** | The small emblem per region (bee, cardamom pod, chorten, wheat sheaf) |
| **dc-runtime** | Claude Design's React runtime — **removed** during atlas integration |
| **EMU** | Erasmus Mundus Joint Master — Nikhil's MBA programme |

---

*This document is the canonical source of truth for the ApiCare website project.
Update it when major decisions change. Push it to git alongside the code so it
travels with the project. When starting a new session, paste this file first.*
