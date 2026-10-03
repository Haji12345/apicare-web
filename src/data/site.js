// ========================================================================
// ApiCare — Site Configuration
// ========================================================================
// Site-wide constants. Update once, propagates everywhere.
// ========================================================================

export const site = {
  name: 'ApiCare',
  tagline: 'Single-village honey from Sikkim\'s protected forests',
  // Browser-tab / Google title for the home page — lead with what people search for
  homeTitle: 'ApiCare — Raw Himalayan Forest Honey from Sikkim, India',
  description:
    'ApiCare partners with smallholder beekeepers in Sikkim — India\'s only fully organic state — to produce raw, single-village Himalayan forest honey. Lab tested by Eurofins, FSSAI registered, every jar traceable to its beekeeper.',
  url: 'https://www.apicare.co.in',
  email: 'hello@apicare.co.in', // TODO: confirm this is your real email
  phone: '+91 79080 90 298',
  address: {
    line1: 'ApiCare Organic Farms Pvt Ltd',
    line2: 'Sikkim, India',
  },
  social: {
    instagram: 'https://instagram.com/apicare', // TODO: update
    linkedin: 'https://linkedin.com/company/apicare', // TODO: update
  },
};

// =====================================================================
// ANALYTICS + SEARCH ENGINES
// =====================================================================
// Paste each ID below; anything left '' is simply not loaded.
//
// ga4Id: Google Analytics 4 → analytics.google.com → Admin → Data streams
//   → Web → "Measurement ID" (looks like G-XXXXXXXXXX). Visitors, pages,
//   traffic sources, countries, and purchases.
// clarityId: Microsoft Clarity (free) → clarity.microsoft.com → new project
//   → Settings → Setup → the 10-character project ID. Heatmaps and
//   session recordings — see where people scroll, click, and drop off.
// googleSiteVerification: Google Search Console → Add property (URL prefix
//   https://www.apicare.co.in) → "HTML tag" method → copy only the
//   content="…" value. Shows which Google searches bring people here.
// bingSiteVerification: Bing Webmaster Tools → "HTML Meta Tag" → content
//   value. Bing's index feeds ChatGPT search and Copilot, so this matters
//   for AI answers as much as for Bing itself.
export const analytics = {
  ga4Id: '',
  clarityId: '',
  googleSiteVerification: '',
  bingSiteVerification: '',
};

// =====================================================================
// SHOP — checkout + order pipeline
// =====================================================================
// Payments run through Razorpay; orders land in a Google Sheet and the
// customer gets a confirmation email. The server half lives in
// /order-pipeline (Google Apps Script) — see order-pipeline/README.md.
//
// checkoutEndpoint: the Apps Script Web App URL
//   (https://script.google.com/macros/s/…/exec). Until it is set, the
//   checkout page still collects every detail but sends the order to
//   WhatsApp instead of opening Razorpay, so no visitor is ever stuck.
//
// shippingINR and deliveryDays must match CONFIG in order-pipeline/Code.gs.
export const shop = {
  checkoutEndpoint: 'https://script.google.com/macros/s/AKfycbw19J0Auu-lIfW_vvfSK61_YzUJwCZEVMBckw2ReyN3HCjXhULjav5kKR_dY_WRyZQ3/exec',
  shippingINR: 0,      // 0 = shipping included in the jar price
  deliveryDays: 14,
  maxQuantity: 10,
  whatsapp: '917908090298', // digits only, with country code
};

// =====================================================================
// FORMS — Formspree endpoints
// =====================================================================
// Sign up at https://formspree.io (free tier: 50 submissions/month).
// Create THREE separate forms so submissions don't get mixed up:
//   1. Contact form        → general enquiries from /contact
//   2. Newsletter signup   → "Stay close" capture in footer + /journal
//   3. Product notify-me   → "Coming Soon" PDPs (Dzongu, Yuksom)
//
// Then paste the endpoint URL (looks like https://formspree.io/f/abcdwxyz)
// into the matching field below. Until you do, forms will gracefully fall
// back to a mailto: link so visitors are never stuck.
//
// To go from Formspree → Buttondown for newsletter only: swap the
// `newsletter` URL — the form code doesn't change, both accept POST.
export const forms = {
  contact: 'https://formspree.io/f/xkoyekaz',     // e.g. 'https://formspree.io/f/xxxxxxxx'
  newsletter: 'https://formspree.io/f/xwvyzajr',  // e.g. 'https://formspree.io/f/yyyyyyyy'
  notify: 'https://formspree.io/f/xrejdrvo',      // e.g. 'https://formspree.io/f/zzzzzzzz'
};

// Main navigation — top-level + dropdown structure
//
// Items with `children` render as a dropdown. The parent link itself
// goes to its href on desktop click (or expands the dropdown on mobile).
export const navigation = [
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Our Story',     href: '/story' },
      { label: 'The Beekeepers', href: '/beekeepers' },
      { label: 'Traceability',  href: '/traceability' },
    ],
  },
  { label: 'Honey Shop', href: '/honey' },
  { label: 'Impact',     href: '/impact' },
  { label: 'Contact',    href: '/contact' },
];

// Footer link groups
export const footerNav = {
  Shop: [
    { label: 'All Honey', href: '/honey' },
    { label: 'Zitlang, East Sikkim', href: '/honey/zitlang-pakyong' },
    { label: 'Kewzing, South Sikkim', href: '/honey/kewzing-south' },
  ],
  About: [
    { label: 'Our Story', href: '/story' },
    { label: 'The Beekeepers', href: '/beekeepers' },
    { label: 'Traceability', href: '/traceability' },
    { label: 'Impact', href: '/impact' },
  ],
  Connect: [
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Instagram', href: 'https://instagram.com/apicare' },
  ],
};

// Policy pages — required by Razorpay during merchant onboarding
export const policies = [
  { label: 'Shipping', href: '/shipping-policy' },
  { label: 'Refunds', href: '/refund-policy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy-policy' },
];
