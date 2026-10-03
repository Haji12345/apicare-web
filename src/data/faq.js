// ========================================================================
// ApiCare — Frequently Asked Questions
// ========================================================================
// Rendered on /faq (with FAQPage structured data) and summarised in
// /llms.txt. Search engines and AI assistants quote these answers
// directly, so each one must stand on its own and be strictly true.
// Write the question the way a shopper would type it.
// ========================================================================

import { honey } from './honey.js';
import { shop } from './site.js';

const live = honey.filter((h) => h.available);
const fromPrice = Math.min(...live.flatMap((h) => h.sizes.map((s) => s.priceINR)));

export const faq = [
  {
    q: 'What is Himalayan forest honey?',
    a: 'Himalayan forest honey is made by bees foraging on wild, uncultivated forest at altitude in the Himalayas, rather than on a single farmed crop. ApiCare\'s Himalayan forest honey comes from Sikkim, where bees work oak, chestnut, alder, wild raspberry, rhododendron, large cardamom and forest wildflowers between roughly 1,200 and 2,200 metres. Because the forage changes through the year, the colour and flavour vary from harvest to harvest.',
  },
  {
    q: 'Is ApiCare honey organic?',
    a: 'ApiCare honey is produced in Sikkim, which in 2016 became the first state in India to go fully organic: synthetic fertilisers and pesticides are not permitted in the state\'s agriculture. Our hives sit in forest that has never been commercially farmed. ApiCare\'s own EU organic certification is in progress, so we do not yet label the jar "certified organic".',
  },
  {
    q: 'Is ApiCare honey raw?',
    a: 'Yes. ApiCare honey is raw, single-origin honey. Because it is raw, it may crystallise over time; that is natural and does not affect quality. Stand the jar in warm (not hot) water to make it liquid again.',
  },
  {
    q: 'What does "single-village honey" mean?',
    a: 'Every ApiCare jar comes from one named village in Sikkim, never a blend of regions. Today you can buy honey from Zitlang (East Sikkim) and Kewzing (South Sikkim). Honey from Dzongu (North Sikkim) and Yuksom (West Sikkim) is coming soon.',
  },
  {
    q: 'How is Zitlang honey different from Kewzing honey?',
    a: 'Zitlang honey, from 1,200 to 2,000 metres in East Sikkim, is a layered multi-floral honey with a faint citrus note from large cardamom. Kewzing honey, from 1,500 to 2,200 metres in South Sikkim, is darker and more savoury, closer to a European wild-forest honey, with a slow, lingering finish.',
  },
  {
    q: 'How do I know ApiCare honey is genuine?',
    a: 'ApiCare honey is tested by Eurofins, an independent international food-testing laboratory, and ApiCare is registered with FSSAI, India\'s food safety authority. Every jar also carries a QR code on the lid: scan it to see the beekeeper, the harvest date, and the lab test results for that batch.',
  },
  {
    q: 'What certifications does ApiCare have?',
    a: 'ApiCare is FSSAI registered and its honey is lab tested by Eurofins. A Geographical Indication (GI) application for Sikkim honey and EU organic certification are both in progress. ApiCare has also been a partner of the Government of Sikkim\'s RAMP programme (Raising and Accelerating MSME Performance, supported by the World Bank) since 2022.',
  },
  {
    q: 'Who are the beekeepers behind ApiCare?',
    a: 'ApiCare works with a collective of 125 smallholder beekeepers across four districts of Sikkim. Each beekeeper is trained in their own village by ApiCare\'s Master Trainers and is paid a guaranteed price, three to four times what village middlemen used to pay.',
  },
  {
    q: 'How much does ApiCare honey cost?',
    a: `ApiCare honey starts at ₹${fromPrice.toLocaleString('en-IN')} for a 250 g jar. Shipping within India is included in the price.`,
  },
  {
    q: 'Where can I buy ApiCare honey?',
    a: `Order directly at www.apicare.co.in/honey. ApiCare ships across India, and every order is packed by hand in Sikkim and delivered within ${shop.deliveryDays} days of payment.`,
  },
];
