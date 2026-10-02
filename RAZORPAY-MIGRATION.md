# ApiCare — Snipcart → Razorpay Migration Spec

**Version** 1.0 · **Date** 13 September 2026 · **Status** Ready to execute
**Execute after** 1 October 2026 (WBG YPP application takes priority until 30 September)
**Repo** `apicare-web-v9/apicare-web` · **Site** https://www.apicare.co.in

> **Status, 2 October 2026: implemented, with one change to §2.** Instead of hosted
> Payment Pages, the site has its own `/checkout` that opens Razorpay Checkout through
> a Google Apps Script (`order-pipeline/`). Reasons: Apps Script cannot read request
> headers, so it cannot verify a Payment Page webhook; one checkout replaces three
> hand-made Payment Pages; and the script sends the customer confirmation email itself.
> The currency toggle was removed (§6, option 1). Setup: `order-pipeline/README.md`.

---

## 0. Why we are migrating

The Snipcart integration is not merely unconfigured — it cannot serve the primary market.

| Constraint | Evidence | Consequence |
|---|---|---|
| Stripe is invite-only in India | Stripe India docs: businesses "can't sign up for a new Stripe account through our website"; support focused on international expansion | Snipcart's flagship gateway is unavailable to ApiCare |
| Stripe India is export-oriented | Requires an Importer Exporter Code (DGFT) for physical goods, plus an RBI transaction purpose code | Wrong instrument for domestic INR sales |
| Snipcart has no native Razorpay or PayU | Snipcart staff: "some backend services are needed for that" | Would require building and hosting a custom gateway |
| GitHub Pages is static | No server-side runtime | Nowhere to host that custom gateway |
| Primary market is domestic INR | Products priced ₹650–₹1200; billing addresses in Sikkim | The one configuration this stack cannot process |

**Decision:** Razorpay hosted Payment Pages, linked from the static site. Keeps the site on GitHub Pages with no backend, and reaches real INR / UPI / card payments immediately.

**Accepted trade-off:** checkout leaves `apicare.co.in` for `pages.razorpay.com`. Mitigated by branding the Payment Page. Revisit an embedded checkout only once order volume justifies maintaining a backend.

---

## 1. Prerequisites — complete before touching code

### 1.1 Razorpay account activation

| Item | Detail | Status |
|---|---|---|
| Business type | Private Limited Company | ApiCare Organic Farms Pvt Ltd |
| PAN | Company PAN | Have |
| GST registration | GSTIN | Have |
| Bank account | Current account + cancelled cheque — use the YES Bank account | Confirm which account receives settlements |
| FSSAI licence | Mandatory for food category | **Confirmed held** |
| KYC fee | One-time ₹199 | — |

### 1.2 Commercials

- **Transaction fee:** 2% + 18% GST on the fee → **≈2.36% effective** on UPI, debit cards, credit cards, netbanking and wallets
- **No setup fee, no annual maintenance** on standard accounts
- **Promotion:** accounts activated after 1 July 2026 get zero platform fee on domestic payments up to ₹5 lakh GMV or 90 days, whichever comes first. GST still applies. Reverts to standard automatically — diarise the expiry
- **Settlement:** T+2 business days domestic

> Cash-cycle note: T+2 settlement against the 3–4 month receivable cycle on PPP disbursement means every D2C rupee arrives roughly 50× faster than every programme rupee. Worth modelling in the FY26–FY29 plan.

### 1.3 Policy pages — likely a hard blocker

Indian payment gateways check during onboarding that the merchant site publishes:

- Terms & Conditions
- Privacy Policy
- Refund / Cancellation Policy
- Shipping & Delivery Policy
- Contact details with a verifiable address

`apicare.co.in` currently has none of these. **Verify the exact list with Razorpay during KYC** — requirements vary by merchant category — but assume all five are needed. Writing them is a prerequisite, not a follow-up, and is on the critical path.

---

## 2. Architecture

**Current**

```
Astro static site  →  Snipcart JS (placeholder key)  →  Snipcart checkout  →  [dead end]
```

**Target**

```
Astro static site  →  per-SKU Razorpay Payment Page link
                        →  Razorpay hosted checkout (UPI / cards / netbanking)
                        →  Razorpay Dashboard (order + customer record)
                        →  webhook  →  Google Sheet (live operational copy)
```

No backend. No hosting change. No new dependencies — consistent with the repo's zero-dependency principle.

---

## 3. SKU mapping

From `src/data/honey.js`:

| Region | Size | Price | Available | Payment Page needed |
|---|---|---|---|---|
| Zitlang, East Sikkim | 250 g | ₹650 | Yes | Yes |
| Zitlang, East Sikkim | 500 g | ₹1,200 | Yes | Yes |
| Kewzing, South Sikkim | 250 g | ₹650 | Yes | Yes |
| Dzongu, North Sikkim | — | — | No (late 2026) | No — keep notify-me |
| Yuksom, West Sikkim | — | — | No (2027) | No — keep notify-me |

**Recommendation:** one Payment Page per SKU rather than a single page with a product dropdown. Cleaner per-SKU analytics, cleaner links from each PDP, and each page can carry its own region photography and story.

**Before going live:** confirm whether ₹650 and ₹1,200 are inclusive of shipping and GST. The displayed price must equal the amount charged.

---

## 4. Customer data capture

This is the "buyer's data sent to us, transaction recorded, details saved" requirement.

### 4.1 Fields to configure on each Payment Page

Razorpay Payment Pages support adding and modifying custom fields.

| Field | Type | Required | Note |
|---|---|---|---|
| Full name | Text | Yes | Razorpay default |
| Email | Email | Yes | Razorpay default |
| Phone | Phone | Yes | Razorpay default; the practical contact channel |
| Address line 1 | Text | Yes | |
| Address line 2 | Text | No | |
| City | Text | Yes | |
| State | Dropdown | Yes | |
| PIN code | Number | Yes | Validate 6 digits |
| Quantity | Number | Yes | Set max against available stock |
| Gift message | Text | No | |
| How did you hear about ApiCare | Dropdown | No | Cheap attribution data |

### 4.2 Where the data lands

1. **Razorpay Dashboard** — every payment with its custom fields, filterable and CSV-exportable. This is the system of record.
2. **Automated receipts** — triggered per payment, no manual work.
3. **Google Sheet (recommended)** — configure a Razorpay webhook on `payment.captured` pointing at a Google Apps Script Web App, which appends a row. Gives a live operational sheet for packing and dispatch without logging into Razorpay, and needs no server.

### 4.3 Data protection

Collecting names, addresses and phone numbers of Indian customers brings obligations under India's data protection regime. Keep the Privacy Policy (§1.3) accurate about what is collected, why, and how long it is retained. Do not duplicate customer data into more places than the two above.

---

## 5. Code changes, file by file

### 5.1 `src/data/site.js`

Remove the `snipcart` export entirely (currently lines 25–37, holding the placeholder key). Replace with:

```js
// Razorpay hosted Payment Pages — one per available SKU.
// Created in Razorpay Dashboard → Payment Pages. Paste the live URLs here.
export const payments = {
  'zitlang-east-250g': 'https://pages.razorpay.com/REPLACE',
  'zitlang-east-500g': 'https://pages.razorpay.com/REPLACE',
  'kewzing-south-250g': 'https://pages.razorpay.com/REPLACE',
};
```

### 5.2 `src/layouts/BaseLayout.astro`

Remove, in roughly this order:

- `snipcart` from the `site.js` import (line 11)
- Snipcart preconnect links (lines ~59–61)
- Snipcart stylesheet `<link>` (line ~79)
- `<div id="snipcart" …>` (lines ~82–86)
- Snipcart `<script async>` (line ~87)
- The entire currency-bridge script (lines ~89–105)

Keep the universal form handler — it is unrelated and working.

### 5.3 `src/pages/honey/index.astro`

Replace each Snipcart add-to-cart button with a link to the SKU's Payment Page. The `!h.available` branch already renders the notify-me treatment and needs no change.

### 5.4 `src/pages/honey/[slug].astro`

Same replacement. Remove all `data-item-*` attributes (`data-item-image` at line ~133 and siblings) — they exist only for Snipcart.

### 5.5 `src/components/Header.astro`

- Remove the cart count indicator
- **Decide on the currency toggle** (see §8)

### 5.6 Dead references to clean while in there

- `beekeepers.js` defines `actionShot: '/images/beekeepers/dal-bhadur-rai-work.jpg'` — referenced by no page and the file does not exist. Either wire it into the beekeeper detail page or delete the field
- `honey.js` points `image` at `/images/honey/dzongu.jpg` and `/images/honey/yuksom.jpg` — neither file exists. Harmless today because they only fed Snipcart cart thumbnails, but the references become genuinely dead after migration
- `src/components/SikkimMap.astro` — superseded by `RegionMap.astro` and imported nowhere

---

## 6. The currency toggle decision

Razorpay Payment Pages charge in INR. The site's `₹ INR / $ USD` toggle currently switches Snipcart's currency too.

| Option | Effect |
|---|---|
| **Remove the toggle** (recommended for phase 1) | Honest and simple. The site sells in India, in rupees |
| Keep as display-only | Shows indicative USD, charges INR. Must be labelled or it reads as a bait-and-switch |
| Keep real dual currency | Needs the Stripe export route from §0 — IEC, purpose code, separate integration. A later phase, not this one |

---

## 7. Test plan

1. Razorpay **test mode**: complete one purchase per SKU end to end
2. Confirm every custom field appears in the Dashboard record
3. Confirm the webhook fires and the Google Sheet row is correct
4. Confirm the automated receipt reaches the buyer
5. Switch to **live mode**, run one real ₹650 purchase with your own card, verify settlement lands in the YES Bank account at T+2, then refund it
6. Verify on a real phone over mobile data — the majority of Indian traffic
7. Confirm the notify-me flow for Dzongu and Yuksom is untouched

---

## 8. Rollback

Every change is in Git. If the Payment Page route fails KYC or proves unworkable, `git revert` the migration commit and the site returns to its current state. Because Snipcart was never live, nothing in production is at risk — there are no historical orders to migrate and no customers mid-checkout.

Keep the migration as **one commit**, or a tight series, to make this true.

---

## 9. Sequence

| # | Task | Blocked by | Owner |
|---|---|---|---|
| 1 | Write the five policy pages | — | Nikhil (Claude can draft) |
| 2 | Razorpay account + KYC | 1 | Nikhil |
| 3 | Create 3 Payment Pages with custom fields | 2 | Nikhil / Claude |
| 4 | Code changes §5 | 3 (needs live URLs) | Claude |
| 5 | Webhook → Google Sheet | 2 | Claude |
| 6 | Test plan §7 | 4, 5 | Both |
| 7 | Go live | 6 | Nikhil |

Steps 1 and 2 are the long poles and neither is code. Start them the day the YPP application is submitted.

---

## 10. Open questions

1. Which bank account receives settlements — the YES Bank account, or another?
2. Are ₹650 / ₹1,200 inclusive of shipping and GST?
3. What is the shipping policy — flat rate, free above a threshold, courier partner, delivery window?
4. What is the returns policy for a food product? (Most Indian honey brands accept returns only for damage in transit — this needs to be stated, not improvised)
5. Currency toggle — which option in §6?
6. Is there stock to fulfil orders today? Memory says ~500 kg handled while farmers are not yet fully mobilised. Going live without fulfilment capacity is the one failure mode that damages the brand rather than merely delaying it

---

## Sources

- Stripe — Accept international payments from India: https://docs.stripe.com/india-accept-international-payments
- Snipcart — Custom payment gateway: https://docs.snipcart.com/v3/custom-payment-gateway
- Snipcart support — Razorpay/PayU thread: https://support.snipcart.com/t/has-anyone-integrated-razorpay-or-payu-in-snipcart/1257
- Razorpay — Payment Pages: https://razorpay.com/payment-pages/
- Razorpay — Payment gateway pricing: https://razorpay.com/blog/razorpay-payment-gateway-pricing-explained/
