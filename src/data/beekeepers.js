// ========================================================================
// ApiCare — Beekeeper Profiles with FPIC Consent Tiers
// ========================================================================
//
// CONSENT MODEL (FPIC: Free, Prior, Informed Consent)
//
// Every beekeeper has a `consentLevel` that controls what we display:
//
//   Tier 1 — collective only:
//     Counted in totals only. Not displayed by name or photo.
//     Default for new beekeepers until consent is documented.
//
//   Tier 2 — first name + role:
//     "Pema, Beekeeper from Zitlang" + work-in-action photo (no face).
//     Beekeeper has signed Tier 2 consent.
//
//   Tier 3 — full profile:
//     Name + portrait + bio + quote on a dedicated profile page.
//     Beekeeper has signed Tier 3 consent, knows page is public globally,
//     and can withdraw at any time.
//
// CRITICAL: Never set consentLevel to 2 or 3 without a signed consent
// form on file. A beekeeper's entry can be edited down at any time —
// for example, if they later request privacy.
// ========================================================================

// ----------------------------------------------------------------------
// INTERNAL OPERATIONAL DATABASE — NOT PUBLICLY DISPLAYED
//
// This object tracks the full collective for internal reporting,
// RAMP audit purposes, and operational planning. The PUBLIC site
// displays only `totalBeekeepers` — never the village-level breakdown.
//
// To see/use this internally: import `collective` directly.
// To display anything publicly: use `getTotalBeekeeperCount()` only.
// ----------------------------------------------------------------------
export const collective = {
  totalBeekeepers: 125,

  // INTERNAL ONLY — do NOT render this object on any public page.
  // Used for audit reports, RAMP submissions, internal dashboards.
  byVillage: {
    Zitlang:  32,
    Kewzing:  28,
    Yuksom:   18,
    Dzongu:   12,
    Pelling:  14,
    Ravangla: 11,
    Aritar:    6,
    Lachen:    4,
  },
};

// ----------------------------------------------------------------------
// NAMED PROFILES — only beekeepers with documented consent
// To add a new named beekeeper, you must:
//   1. Have a signed FPIC consent form on file
//   2. Use only the consent level they signed for (never higher)
//   3. Be ready to remove the entry within 24 hours if they withdraw
// ----------------------------------------------------------------------
export const beekeepers = [

  // ====================================================================
  // TIER 3 — Full profile (name, portrait, bio)
  // ====================================================================
  {
    slug: 'dal-bhadur-rai',
    name: 'Dal Bhadur Rai',
    role: 'Master Trainer',
    village: 'Zitlang',
    district: 'East',
    yearsWithApiCare: 'Since 2021',
    hives: 24,
    bio:
      'Dal Bhadur Rai was the first beekeeper we worked with in Zitlang. He had been keeping bees in hollow log hives — the traditional Sikkim method — since he was a teenager, and was already known across his side of the valley as someone you went to when a neighbour\'s colony was failing. ' +
      'He was sceptical of us at first. Frame hives, removable supers, hygiene protocols — most of it sounded, in his words, like extra work for the same honey. He took six months to fully switch his apiary over. He took another year to start training the next generation of beekeepers in the village. ' +
      'Today Dal Bhadur runs the Zitlang collective and trains beekeepers across East Sikkim. He is the reason this whole project works.',
    quote: '', // TODO: replace with a real quote from Dal Bhadur. Empty until verified.
    portrait: '/images/beekeepers/dal-bhadur-rai.jpg',
    actionShot: '/images/beekeepers/dal-bhadur-rai-work.jpg',
    honeySlugs: ['zitlang-pakyong'],
    consentLevel: 3,
    consentDate: '', // TODO: fill with real date when form signed
  },

  // ====================================================================
  // PLACEHOLDER ENTRIES — 3 more Tier 3 profiles to add
  //
  // These are DRAFT placeholders. Do NOT treat them as real beekeepers.
  // Each must be replaced with a real beekeeper who has signed Tier 3
  // consent. Setting consentLevel=0 keeps them OUT of public display
  // until consent is confirmed.
  //
  // When ready: change consentLevel to 3 + add real bio + portrait.
  // ====================================================================
  {
    slug: 'placeholder-kewzing-1',
    name: '[Beekeeper name pending]',
    role: 'Beekeeper',
    village: 'Kewzing',
    district: 'South',
    yearsWithApiCare: '',
    hives: 0,
    bio: '',
    quote: '',
    portrait: '',
    actionShot: '',
    honeySlugs: ['kewzing-south'],
    consentLevel: 0, // Hidden from public display until consent documented
  },
  {
    slug: 'placeholder-yuksom-1',
    name: '[Beekeeper name pending]',
    role: 'Beekeeper',
    village: 'Yuksom',
    district: 'West',
    yearsWithApiCare: '',
    hives: 0,
    bio: '',
    quote: '',
    portrait: '',
    actionShot: '',
    honeySlugs: ['yuksom-west'],
    consentLevel: 0,
  },
  {
    slug: 'placeholder-dzongu-1',
    name: '[Beekeeper name pending]',
    role: 'Beekeeper',
    village: 'Dzongu',
    district: 'North',
    yearsWithApiCare: '',
    hives: 0,
    bio: '',
    quote: '',
    portrait: '',
    actionShot: '',
    honeySlugs: ['dzongu-north'],
    consentLevel: 0,
  },
];

// ======================================================================
// HELPERS — consent-aware getters. Always use these, never raw arrays.
// ======================================================================

// Public-facing list: only beekeepers with consentLevel >= 2
export function getPublicBeekeepers() {
  return beekeepers.filter((b) => (b.consentLevel || 0) >= 2);
}

// Full-profile list: only beekeepers with consentLevel === 3
export function getFullProfileBeekeepers() {
  return beekeepers.filter((b) => b.consentLevel === 3);
}

// Get one beekeeper by slug — only returns if they have public consent
export function getBeekeeper(slug) {
  const b = beekeepers.find((b) => b.slug === slug);
  if (!b || (b.consentLevel || 0) < 2) return null;
  return b;
}

// Beekeepers visible in a village — for the Beekeepers index
export function getBeekeepersByVillage(village) {
  return getPublicBeekeepers().filter((b) => b.village === village);
}

// Beekeepers linked to a honey product — only ones with public consent
export function getBeekeepersForHoney(honeySlugs = []) {
  return getPublicBeekeepers().filter((b) =>
    honeySlugs.some((s) => b.honeySlugs.includes(s))
  );
}

// Total count for "125 beekeepers" claim — pulled from collective config
export function getTotalBeekeeperCount() {
  return collective.totalBeekeepers;
}

// How many are publicly profiled (the "named" subset)
export function getPubliclyProfiledCount() {
  return getPublicBeekeepers().length;
}

// How many are in the collective but not publicly profiled
export function getUnnamedCollectiveCount() {
  return collective.totalBeekeepers - getPubliclyProfiledCount();
}
