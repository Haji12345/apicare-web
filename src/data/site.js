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

// Snipcart configuration — public API key, safe to commit
// Get yours from https://snipcart.com → Account → API Keys
// IMPORTANT: Replace this placeholder with your real public test key, then
// switch to live key when ready to take real orders.
export const snipcart = {
  publicApiKey: 'NzBjYzFkZjQtMmZkZC00NjA2LWIyNjUtMjY1ZDY0ODkzMDE4NjM5MTM1MzI0ODg0NTAxMjg1',
  // Snipcart supports multiple currencies natively
  currencies: [
    { code: 'inr', symbol: '₹', name: 'INR' },
    { code: 'usd', symbol: '$', name: 'USD' },
  ],
  defaultCurrency: 'inr',
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
    { label: 'Dzongu, North Sikkim', href: '/honey/dzongu-north' },
    { label: 'Yuksom, West Sikkim', href: '/honey/yuksom-west' },
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
