// ========================================================================
// ApiCare — Site Configuration
// ========================================================================
// Site-wide constants. Update once, propagates everywhere.
// ========================================================================

export const site = {
  name: 'ApiCare',
  tagline: 'Single-village honey from Sikkim\'s protected forests',
  description:
    'ApiCare partners with smallholder beekeepers in Sikkim — India\'s only fully organic state — to produce single-village Himalayan forest honey, every jar traceable to its source.',
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
  checkoutEndpoint: 'https://script.google.com/macros/s/AKfycbw1eUvr1V3uzh7bfMtWMRV8AN5BwrpZzPvMGxhSeN7yYkYWClPizsgyrsfvYVoL4Eh4cQ/exec',
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
