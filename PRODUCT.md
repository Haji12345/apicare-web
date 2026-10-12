# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Urban Indian online shoppers buying honey for themselves: health- and origin-conscious, comparing ApiCare against supermarket and other "raw/organic" honey brands, usually on a phone. They pay ₹650 (250 g) to ₹1,200 (500 g) a jar and need to believe the jar is genuinely different before they do.

Secondary audiences reach the site through the same pages: Government of Sikkim / RAMP stakeholders and partners checking ApiCare's credibility, and press. Trade and EU export buyers are not served by the site for now; export happens in direct conversations.

## Product Purpose

ApiCare (ApiCare Organic Farms Pvt Ltd) sells raw, single-village Himalayan forest honey from Sikkim direct to customers in India. It exists so smallholder beekeepers are paid a guaranteed price (three to four times what village middlemen paid) by proving the origin of each harvest to the buyer. Success is repeat D2C orders at premium prices from people who understand why this honey costs what it does.

## Positioning

Every jar comes from one named village in Sikkim, never a blend of regions, harvested by a trained collective of 125 smallholder beekeepers. Sikkim has been India's first fully organic state since 2016. Neighbouring "Himalayan" or "organic" brands blend across regions and cannot name the village.

## Operating Context

- Shop: two live honeys, Zitlang (East Sikkim) and Kewzing (South Sikkim), each in 250 g and 500 g; Dzongu (North) and Yuksom (West) are coming soon with email notify-me.
- Checkout: Razorpay (UPI, card, netbanking); orders land in a Google Sheet via Apps Script and both customer and ApiCare get emails. Shipping is included in the price, India only, delivery within 14 days.
- Each village has its own story, altitude, harvest season and forage (src/data/honey.js).
- The Origin Atlas maps the four districts and villages.

## Capabilities and Constraints

- Static Astro 4 site on GitHub Pages; backend is Razorpay + Google Apps Script (order-pipeline/). Frontend changes must not alter checkout logic, prices (set server-side in Code.gs and must match src/data/honey.js), or the order pipeline.
- Beekeeper names and faces are published only with documented consent. Today one beekeeper (Dal Bhadur Rai) has a public profile; 124 stay private by choice. Never show unconsented faces as identified beekeepers or display village-level headcounts (internal only).
- Per-jar traceability (FarmLedger) is being built. The QR on the jar currently opens a sample profile, so the site must describe scanning as in progress, not promise that a scan shows your beekeeper, harvest date or lab results today.
- Jar photos are shared between villages (same jar and label); there are no village-specific product photos yet.

## Brand Commitments

- Name: ApiCare. Logo: public/apicare-logo.svg (bee monogram). Voice: restrained, specific, honest; short declarative lines ("Two villages live. Two more on the way.", "One letter per harvest. Nothing more.").
- Claims stay within the paperwork: FSSAI registered (done), Eurofins lab tested (done), GI tag in progress, EU organic certification in progress. Never write "certified organic" or "GI certified" until confirmed; "100% organic" refers to Sikkim the state, not a product certification.
- Government of Sikkim RAMP partner since 2022.

## Evidence on Hand

- Logos: FSSAI, Eurofins, Government of Sikkim emblem (public/images/logos/).
- Photography: hero landscapes and beekeeping (src/assets/hero/), training and community photos (public/images/), shared jar photos (public/images/honey/), one consented portrait (public/images/beekeepers/dal-bhadur-rai.jpg).
- Origin Atlas illustrated plates (public/images/atlas/).
- No customer testimonials, reviews, press quotes or per-jar lab reports are published yet; do not fabricate any.

## Product Principles

1. Prove, don't claim: every statement on the site must be backed by a certificate, a photo, or a named fact.
2. The village is the product: make the difference between villages visible at the moment of choice.
3. Consent before visibility: people appear only as far as they have agreed to.
4. Get the honey in front of the buyer early; story supports the purchase, it doesn't delay it.

## Accessibility & Inclusion

Mostly mobile visitors in India, often on mid-range Android phones and patchy connections: text contrast at WCAG AA, touch targets at least 44 px, light pages, and respect for reduced-motion settings.
