# ApiCare tracking plan

Owner: ApiCare (apicarebusiness@gmail.com), maintained by Nikhil Pradhan · Property: GA4 `G-V6JJSE8GGH` · Last updated: 8 Nov 2026

This file is the contract between the business questions and the code.
Every event below exists because it answers a question. If an event stops
answering a question someone acts on, remove it.

## 1. Measurement framework

**North star: paid orders.** Goal: 1,000 orders a year. Peak demand is
October to January (Dussehra, Diwali, Christmas, New Year), so monthly
targets are weighted, not 1,000 ÷ 12. *(Year and peak share: to be set.)*

```
Orders = Sessions × Conversion rate

Conversion rate = (product viewers / sessions)        interest
                × (checkout starters / product viewers) intent
                × (forms submitted / checkout starters) checkout form
                × (orders / forms submitted)           payment
```

| Level | KPI | Source of truth | Event(s) |
|---|---|---|---|
| North star | Paid orders (and revenue) | Orders sheet (Razorpay) | `purchase` |
| Driver 1 | Sessions, by channel | GA4 | automatic |
| Driver 2a | Interest rate | GA4 | `view_item` |
| Driver 2b | Intent rate | GA4 | `begin_checkout` |
| Driver 2c | Checkout-form completion | GA4 + Orders sheet | `add_shipping_info` |
| Driver 2d | Payment completion | GA4 + Orders sheet | `add_payment_info`, `purchase`, `payment_window_closed` |

Dimensions to slice by: channel (source / medium), product, jar size,
device, delivery state (Orders sheet only).

Measured baseline, 11 Oct – 7 Nov 2026 (GA4 page views + Orders sheet):
117 users → ≥25 product viewers → 12 reached checkout → 4 submitted the
form → 3 paid. Biggest drop: checkout page → form submitted. Sample is
small and includes internal visits.

## 2. Events

All ecommerce events use GA4's recommended names and an `items` array,
so GA4 builds its purchase-journey reports automatically. Currency is
always `INR`. `item_id` is the honey slug everywhere (e.g. `zitlang-pakyong`).

| Event | Fires when | Key parameters | File |
|---|---|---|---|
| `view_item_list` | /honey loads | `item_list_id`, `items` | `src/pages/honey/index.astro` |
| `view_item` | a product page loads (available products) | `value`, `items` | `src/pages/honey/[slug].astro` |
| `begin_checkout` | /checkout loads | `value`, `items` | `src/pages/checkout.astro` |
| `add_shipping_info` | checkout form passes validation and is sent | `value`, `items`, `shipping_tier` | `src/pages/checkout.astro` |
| `add_payment_info` | Razorpay window opens | `value`, `items`, `payment_type` | `src/pages/checkout.astro` |
| `payment_window_closed` | customer closes Razorpay without paying | `order_ref` | `src/pages/checkout.astro` |
| `purchase` | Razorpay reports success; sent after the server verify call (or its failure, since money has moved) | `transaction_id` = order ref, `value` = server amount, `items` | `src/pages/checkout.astro` |
| `generate_lead` | contact, newsletter or notify-me form succeeds | `lead_type` | `src/layouts/BaseLayout.astro` |
| `consent_update` | visitor makes a cookie choice | `consent_analytics`, `consent_marketing` | `src/layouts/BaseLayout.astro` |

Automatic and enhanced-measurement events (`page_view`, `session_start`,
`first_visit`, `user_engagement`, `scroll`, `click`) come from GA4 itself.

Key events in GA4: `purchase` (set). Candidate: `generate_lead`.

## 3. Consent (Google Consent Mode v2)

- Defaults run before any tag loads (`BaseLayout.astro`).
- EEA, UK, Switzerland: all four signals `denied` until the visitor accepts.
- Elsewhere: `analytics_storage` granted, advertising signals denied.
- Banner (`src/components/ConsentBanner.astro`): "Accept" and "Only
  necessary" carry equal weight; "Cookie settings" in the footer reopens it.
- Microsoft Clarity loads only after the visitor accepts analytics.
- Choice stored in `localStorage` key `apicare_consent_v1`.

## 4. Governance rules

1. **No personal data in analytics.** Never send names, emails, phones or
   addresses to GA4 or Clarity. GA4 joins to the Orders sheet on
   `transaction_id` only.
2. **The Orders sheet is the source of truth for orders and revenue.**
   GA4 is for behaviour and funnels.
3. **Reconcile weekly**: paid orders in the sheet vs `purchase` in GA4.
   Expect GA4 to be lower (ad blockers, consent refusals, closed tabs).
   Investigate if the gap moves sharply.
4. **Test orders are marked** in the sheet's Note column and excluded.
5. **Internal traffic** is filtered with GA4's internal-traffic data filter.
6. New events are added here first, then in code.

## 5. Tag delivery

- Now: hard-coded GA4 tag (`analytics.ga4Id`) receives events through
  `apicareTrack()`.
- Next: Google Tag Manager. Set `analytics.gtmId` in `src/data/site.js`;
  GA4 and Clarity then move into GTM, reading the same `dataLayer` events.
  No page code changes.

## 6. Known gaps

- GA4 missed 1 of 3 real orders in the baseline window. Fix: send
  `purchase` from the server (GA4 Measurement Protocol, from
  `order-pipeline/Code.gs` when a payment settles).
- No raw-data warehouse yet. Next: GA4 → BigQuery export.
