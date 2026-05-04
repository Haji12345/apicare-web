// ========================================================================
// ApiCare — Product Catalogue
// ========================================================================
// Single source of truth for all honey SKUs.
// Adding a product here automatically generates its PDP and lists it
// in the catalogue grid and home featured section.
//
// AVAILABILITY:
//   available: true   → buy buttons enabled, normal pricing flow
//   available: false  → "Coming soon" badge, email-capture instead of buy
// ========================================================================

export const honey = [

  // =====================================================================
  // ZITLANG — LIVE
  // =====================================================================
  {
    slug: 'zitlang-pakyong',
    name: 'Zitlang, East Sikkim',
    subtitle: 'Himalayan Forest Honey',
    district: 'East',
    districtFull: 'East Sikkim',
    village: 'Zitlang',
    oneLiner:
      'Mid-altitude forest honey from the eastern slopes above Pakyong.',
    placeStory:
      'Zitlang sits at the eastern edge of Sikkim, on slopes that drop from oak-and-cardamom forest down toward the Teesta valley. The village is small — a few hundred households spread across stepped terraces — and the surrounding forest has never been commercially logged. ' +
      'It was the first place we set up a beekeeper collective in 2021. The conditions are close to ideal: dense undergrowth, a long flowering season, and almost no agricultural runoff because Sikkim has been fully organic since 2016. ' +
      'Most of our Zitlang beekeepers grew up watching their parents keep hives in hollow tree trunks. What we added was the equipment, the training, and a guaranteed price — three to four times what they were getting from the village middleman.',
    forestStory:
      'Bees here forage on a shifting palette through the year — wild raspberry and rhododendron in spring, buckwheat and large-cardamom in summer, and bramble and forest wildflowers in autumn. ' +
      'The result is a layered, multi-floral honey with a faint citrus note from the cardamom, and a honey colour that shifts harvest to harvest depending on what was in bloom.',
    beekeepers: ['dal-bhadur-rai'],
    altitude: '1,200 – 2,000 m',
    harvestSeason: 'Spring & Autumn',
    sizes: [
      { weight: '250g', priceINR: 650, priceUSD: 12 },
      { weight: '500g', priceINR: 1200, priceUSD: 22, image: '/images/honey/zitlang.jpg' },
    ],
    // Default image (used in catalogue + home cards). For per-size images,
    // see sizes[].image — currently only 500g has a real photo. 250g falls
    // back to the JarSilhouette placeholder.
    image: '/images/honey/zitlang.jpg',
    available: true,
  },

  // =====================================================================
  // KEWZING — LIVE
  // =====================================================================
  {
    slug: 'kewzing-south',
    name: 'Kewzing, South Sikkim',
    subtitle: 'Himalayan Forest Honey',
    district: 'South',
    districtFull: 'South Sikkim',
    village: 'Kewzing',
    oneLiner:
      'Mid-altitude monastery-valley honey from southern Sikkim.',
    placeStory:
      'Kewzing is a Bhutia village in South Sikkim, set in a wide bowl of pine and broadleaf forest below the Maenam ridge. It is best known for two things: an active Buddhist monastery built in the 1980s, and a community-tourism programme that has kept its forest cover unusually intact for the region. ' +
      'For us, that forest cover is everything. Kewzing\'s beekeepers maintain their hives at the edge of monastery land, where the forage is wild, the canopy is closed, and the disturbance from human activity is minimal. ' +
      'We started working here in 2022. Today the Kewzing collective is one of our most consistent — partly because the beekeepers are veterans, and partly because the monastery has, in its own quiet way, protected this forest for forty years.',
    forestStory:
      'The Kewzing forage is dominated by oak, chestnut, alder, and a long succession of understorey wildflowers. Spring brings a heavy rhododendron bloom; later in the year, the bees work alder catkins and forest mint. ' +
      'The honey is darker and more savoury than Zitlang — closer to the European wild-forest style — with a slow, lingering finish.',
    beekeepers: [],
    altitude: '1,500 – 2,200 m',
    harvestSeason: 'Spring',
    sizes: [
      { weight: '250g', priceINR: 650, priceUSD: 12 },
      { weight: '500g', priceINR: 1200, priceUSD: 22 },
    ],
    image: '/images/honey/kewzing.jpg',
    available: true,
  },

  // =====================================================================
  // DZONGU — COMING SOON (flagship story preserved)
  // =====================================================================
  {
    slug: 'dzongu-north',
    name: 'Dzongu, North Sikkim',
    subtitle: 'Himalayan Forest Honey',
    district: 'North',
    districtFull: 'North Sikkim',
    village: 'Dzongu',
    oneLiner:
      'From the Lepcha Reserve, bordering the Khangchendzonga Biosphere Reserve.',
    placeStory:
      'Dzongu is a protected reserve in North Sikkim, set aside for the Lepcha — Sikkim\'s indigenous people, and one of the oldest continuously settled communities in the eastern Himalayas. Entry is restricted. The forest is intact in a way that almost nothing else in mainland India is. ' +
      'The reserve borders the Khangchendzonga Biosphere Reserve and rises from sub-tropical valley floor at 700 metres to alpine pasture above 6,000. In a single day\'s walk, you cross five distinct forest types. ' +
      'We have been working with Lepcha beekeepers in Dzongu since 2024, slowly and on their terms. The first commercial harvest is expected in the coming season. We are not in a hurry — Dzongu honey is the slowest, rarest jar we will ever produce, and we would rather it arrive late than arrive wrong.',
    forestStory:
      'The Dzongu canopy is the richest forage we have ever sourced from. Oak, magnolia, and rhododendron at higher altitudes give way to wild banana, tree-fern, and broadleaf evergreens lower down. Lepcha ethnobotany names dozens of bee-forage plants that don\'t appear on any commercial list. ' +
      'When this honey arrives, it will be unlike anything else in our catalogue.',
    beekeepers: [],
    altitude: '700 – 6,000 m',
    harvestSeason: 'Late Spring',
    sizes: [
      { weight: '250g', priceINR: 850, priceUSD: 16 },
      { weight: '500g', priceINR: 1600, priceUSD: 30 },
    ],
    image: '/images/honey/dzongu.jpg',
    available: false,
    comingSoonNote: 'First commercial harvest expected late 2026.',
    flagship: true, // still appears first on home — story sells the brand even before the jar ships
  },

  // =====================================================================
  // YUKSOM — COMING SOON
  // =====================================================================
  {
    slug: 'yuksom-west',
    name: 'Yuksom, West Sikkim',
    subtitle: 'Himalayan Forest Honey',
    district: 'West',
    districtFull: 'West Sikkim',
    village: 'Yuksom',
    oneLiner:
      "Honey from Sikkim's first capital, gateway to Khangchendzonga National Park.",
    placeStory:
      'Yuksom was the first capital of Sikkim, founded in 1642 when three lamas met under a pine to consecrate the kingdom. The pine still stands. The village is now the trailhead for treks into Khangchendzonga National Park, and the surrounding forest is part of the protected buffer zone. ' +
      'We are mid-way through onboarding beekeepers in Yuksom. The terrain is harder than our southern villages — steeper, colder, more remote — and we are taking it slowly. The first harvest will come from a small group of high-altitude apiaries set just below the national park boundary.',
    forestStory:
      'Yuksom\'s forage is drawn from a high-altitude mix of rhododendron, oak, and a dense understorey of forest herbs. The honey is expected to be lighter and more floral than Kewzing, with a clearer rhododendron note and a faint pine resin finish.',
    beekeepers: [],
    altitude: '1,800 – 2,500 m',
    harvestSeason: 'Spring & Autumn',
    sizes: [
      { weight: '250g', priceINR: 750, priceUSD: 14 },
      { weight: '500g', priceINR: 1400, priceUSD: 26 },
    ],
    image: '/images/honey/yuksom.jpg',
    available: false,
    comingSoonNote: 'First commercial harvest expected 2027.',
  },
];

// =====================================================================
// HELPERS
// =====================================================================

export function getHoney(slug) {
  return honey.find((h) => h.slug === slug);
}

// Featured for home: flagship first (even if coming soon — story sells brand),
// then prioritize available SKUs to fill remaining slots.
export function getFeaturedHoney() {
  const flagship = honey.find((h) => h.flagship);
  const live = honey.filter((h) => h.available && !h.flagship);
  const result = [];
  if (flagship) result.push(flagship);
  result.push(...live.slice(0, 3 - result.length));
  return result;
}

export function getHoneyByDistrict() {
  return {
    North: honey.filter((h) => h.district === 'North'),
    East: honey.filter((h) => h.district === 'East'),
    West: honey.filter((h) => h.district === 'West'),
    South: honey.filter((h) => h.district === 'South'),
  };
}

// New: get only purchasable honey for catalogue and Snipcart
export function getAvailableHoney() {
  return honey.filter((h) => h.available);
}

export function getComingSoonHoney() {
  return honey.filter((h) => !h.available);
}
