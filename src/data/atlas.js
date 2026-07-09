// src/data/atlas.js
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for the Origin Atlas map component.
// Edit region facts here; <OriginAtlas /> renders from this array.
//
// PROVENANCE OF VALUES
//   These fields were carried over from the illustrator's Origin Atlas export
//   (a Claude Design component). Fields are tagged below as:
//     ✅ verified   — cross-checked against known facts / your brand canon
//     ⚠️ CONFIRM    — plausible but NOT independently verified; treat as draft
//   Do not ship ⚠️ fields as fact until you confirm them. See notes per region.
//
// MAP GEOMETRY
//   `x` / `y` are the marker's position on sikkim.svg as a percentage of the
//   map's width/height (top-left origin). RECOMPUTED for the cropped viewBox
//   "695 468 2877 2269". If sikkim.svg's viewBox changes again, these MUST be
//   remapped: newPct = (oldPct/100*4267 - vbX) / vbW * 100.
// ─────────────────────────────────────────────────────────────────────────────

export const atlas = [
  {
    key: 'zitlang',
    no: '01',
    name: 'Zitlang',
    district: 'Pakyong',                 // ✅ Pakyong is a district (carved out 2021)
    tagline: 'Where Apicare began.',      // ✅ internal brand fact (origin plate)
    altitude: '~1,400 m',                 // ⚠️ CONFIRM — approximate
    flora: 'Wildflower & Cardamom',       // ⚠️ CONFIRM dominant forage
    harvest: 'October – November',        // ⚠️ CONFIRM — outstanding input from you
    honey: 'Classic Himalayan amber — round, warm, unhurried.', // ⚠️ CONFIRM tasting note
    glyph: '/images/atlas/glyph-bee.svg',
    glyphAlt: 'Bee',
    plate: '/images/atlas/zitlang.svg',
    href: '/honey/zitlang-pakyong',                     // ✅ PDP slug from index.astro's old district map
    x: 49.9,
    y: 90.8,
  },
  {
    key: 'dzongu',
    no: '02',
    name: 'Dzongu',
    district: 'North Sikkim',             // ✅
    tagline: 'A Lepcha homeland.',         // ✅ protected Lepcha reserve
    altitude: '~1,700 m',                 // ⚠️ CONFIRM — approximate
    flora: 'Large Cardamom',              // ✅ cornerstone crop of Dzongu
    harvest: 'October – December',        // ⚠️ CONFIRM — outstanding input from you
    honey: 'Dark and resinous, with a faint spice of cardamom groves.', // ⚠️ CONFIRM
    glyph: '/images/atlas/glyph-cardamom.svg',
    glyphAlt: 'Cardamom pod',
    plate: '/images/atlas/dzongu.svg',
    href: '/honey/dzongu-north',                     // ✅ PDP slug from index.astro's old district map
    x: 39.9,
    y: 36.5,
  },
  {
    key: 'yuksom',
    no: '03',
    name: 'Yuksom',
    district: 'West Sikkim',              // ✅
    tagline: 'First capital, 1642.',       // ✅ first Chogyal consecrated at Yuksom, 1642
    altitude: '~1,780 m',                 // ⚠️ CONFIRM — approximate
    flora: 'Rhododendron',                // ⚠️ CONFIRM dominant forage
    harvest: 'April – May',               // ⚠️ CONFIRM — outstanding input from you
    honey: 'Pale gold and floral — the lightest cup of the four.', // ⚠️ CONFIRM
    glyph: '/images/atlas/glyph-chorten.svg',
    glyphAlt: 'Chorten',
    plate: '/images/atlas/yuksom.svg',
    href: '/honey/yuksom-west',                     // ✅ PDP slug from index.astro's old district map
    x: 14.1,
    y: 59.6,
  },
  {
    key: 'kewzing',
    no: '04',
    name: 'Kewzing',
    district: 'South Sikkim',             // ✅
    tagline: 'Southern terraced hills.',   // ⚠️ CONFIRM framing (Bhutia village)
    altitude: '~1,360 m',                 // ⚠️ CONFIRM — approximate
    flora: 'Buckwheat',                   // ⚠️ CONFIRM — note: glyph is a WHEAT sheaf,
                                          //    brand descriptor is "land of wheat fields";
                                          //    "Buckwheat" here may be an export guess.
    harvest: 'November',                  // ⚠️ CONFIRM — outstanding input from you
    honey: 'Malty, deep ochre, quietly mineral.', // ⚠️ CONFIRM
    glyph: '/images/atlas/glyph-wheat.svg',
    glyphAlt: 'Wheat sheaf',
    plate: '/images/atlas/kewzing.svg',
    href: '/honey/kewzing-south',                     // ✅ PDP slug from index.astro's old district map
    x: 74.8,
    y: 69.4,
  },
];

// Ordered honey-trail connecting the origins on the overview map (optional flourish).
// Coordinates are in the 1000×750 overlay space, REMAPPED for sikkim.svg's
// cropped viewBox "695 468 2877 2269". Remap again if that viewBox changes.
export const honeyTrail = [
  'M141,448 C218,360 322,294 399,274',
  'M399,274 C530,332 663,431 748,519',
  'M748,519 C678,586 586,638 499,682',
];

export default atlas;
