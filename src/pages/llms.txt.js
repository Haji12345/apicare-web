// /llms.txt — a plain-language brief for AI assistants (llmstxt.org).
// Built from the same data as the site, so it never goes stale.
import { site } from '../data/site.js';
import { honey } from '../data/honey.js';
import { faq } from '../data/faq.js';

export function GET() {
  const url = (path) => new URL(path, site.url).toString();
  const product = (h) => {
    const prices = h.sizes.map((s) => `${s.weight} ₹${s.priceINR}`).join(', ');
    const status = h.available ? 'available now' : `coming soon (${h.comingSoonNote})`;
    return `- [${h.name} — ${h.subtitle}](${url(`/honey/${h.slug}`)}): ${h.oneLiner} Altitude ${h.altitude}; harvest ${h.harvestSeason}; ${prices}; ${status}.`;
  };

  const body = `# ${site.name}

> ${site.description}

ApiCare (${site.address.line1}) sells raw, single-village Himalayan forest honey from Sikkim, India. Each jar comes from one named village and carries a QR code linking to the beekeeper, harvest date and lab test results. ApiCare is FSSAI registered, its honey is tested by Eurofins, and a GI (Geographical Indication) application and EU organic certification are in progress. It works with 125 smallholder beekeepers and has been a Government of Sikkim RAMP partner since 2022. Sikkim has been India's first fully organic state since 2016. Shipping within India is included in the price.

## Honey

${honey.map(product).join('\n')}

## About

- [Our story](${url('/story')}): why ApiCare exists and the EU export plan
- [The beekeepers](${url('/beekeepers')}): the smallholder collective behind the honey
- [Traceability](${url('/traceability')}): how the jar QR code and lab results work
- [Impact](${url('/impact')}): training programme, RAMP partnership, certifications
- [FAQ](${url('/faq')}): common questions answered

## FAQ

${faq.map(({ q, a }) => `### ${q}\n${a}`).join('\n\n')}

## Contact

- Website: ${site.url}
- Email: ${site.email}
- Phone / WhatsApp: ${site.phone}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
