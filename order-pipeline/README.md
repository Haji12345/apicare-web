# ApiCare order pipeline

How an order on apicare.co.in becomes money in the bank, a row in a Google Sheet,
and a confirmation email to the customer. No server to run or pay for.

```
/checkout ──create──▶ Apps Script ──▶ Razorpay order + Sheet row "Awaiting payment"
Razorpay Checkout (UPI / card / netbanking) — customer pays
/checkout ──verify──▶ Apps Script ──▶ signature checked ──▶ row "Paid"
                                                      └──▶ email: customer + you
Every 10 min: catches payments whose browser closed early; unpaid > 48h → "Abandoned"
```

**What gets recorded per order:** order ref, product, size, quantity, total, name,
email, phone, delivery address, mailing address (or "same"), note, Razorpay ids,
paid time, deliver-by date (paid + 14 days), whether the customer email went out,
and a blank **Dispatched** column for you. Add your own columns (courier,
tracking no.) to the right; the script finds columns by name.

The Sheet lives in your Google Drive. To keep a copy on your computer:
**File → Download → Microsoft Excel (.xlsx)**, any time. Razorpay's dashboard
keeps its own record of every payment too.

---

## One-time setup (about 20 minutes)

### 1. Razorpay
1. Finish KYC at https://dashboard.razorpay.com (company PAN, GSTIN, bank account,
   FSSAI). The site's policy pages for their review are live at `/terms`,
   `/privacy-policy`, `/refund-policy`, `/shipping-policy`, plus `/contact`.
2. Stay in **Test Mode** first. Go to **Account & Settings → API Keys → Generate Test Key**.
   Copy the **Key Id** (`rzp_test_…`) and **Key Secret**. The secret is shown only once.

### 2. Google Sheet + script
1. Create a new Google Sheet, e.g. "ApiCare Orders", while signed in to the Google
   account the confirmation emails should come **from**.
2. **Extensions → Apps Script**. Delete the sample code, paste in all of
   [`Code.gs`](Code.gs), and save.
3. **Project Settings** (gear icon):
   - Time zone: `(GMT+05:30) India Standard Time`
   - **Script Properties → Add**:
     | Property | Value |
     |---|---|
     | `RAZORPAY_KEY_ID` | `rzp_test_…` |
     | `RAZORPAY_KEY_SECRET` | the secret |
     | `NOTIFY_EMAIL` | where new-order alerts go, e.g. `hello@apicare.co.in` |
4. Back in the editor, choose **`setup`** in the function dropdown and press **Run**.
   Google asks for permission (Sheets, send email, external requests, triggers).
   Accept it: it is your own script. You should get an email titled
   "ApiCare order pipeline connected", and the sheet gets an **Orders** tab.

### 3. Publish the script as a Web App
1. **Deploy → New deployment → ⚙ → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
2. Copy the Web App URL (`https://script.google.com/macros/s/…/exec`).
3. Paste it into `src/data/site.js`:
   ```js
   export const shop = {
     checkoutEndpoint: 'https://script.google.com/macros/s/…/exec',
   ```
   Commit and push; GitHub Pages redeploys. The checkout button changes from
   "Place order on WhatsApp" to "Pay ₹…".

> **Changing Code.gs later?** Paste the new code, then **Deploy → Manage
> deployments → ✏ → Version: New version → Deploy**. Editing the old version
> keeps the same URL; creating a brand-new deployment gives a new URL.

### 4. Test, then go live
1. On the site, order one jar. In Razorpay's test checkout use UPI ID
   `success@razorpay`, or a test card from
   https://razorpay.com/docs/payments/payments/test-card-details/.
2. Check: the row turns **Paid**, the customer email arrives, and you get the alert.
3. Close the payment window halfway through once. The row should stay
   "Awaiting payment", and pressing Pay again should reuse the same row.
4. Going live: generate **Live** keys in Razorpay, replace the two `RAZORPAY_*`
   Script Properties, and run `setup` once more. No redeploy needed. Place one real
   ₹650 order, confirm it settles to the bank (T+2), then refund it from the
   Razorpay dashboard.

---

## Changing prices, products or delivery time

Prices are enforced **in the script**, so a visitor cannot edit the price in
their browser. If you change any of these, change both places:

| What | Website | Script (`Code.gs`) |
|---|---|---|
| Prices, sizes, available products | `src/data/honey.js` | `CATALOGUE` |
| Shipping charge, delivery days, max quantity | `shop` in `src/data/site.js` | `CONFIG` |

Then run `node order-pipeline/test.mjs`. It fails if the two disagree. Paste the
new `Code.gs` and publish a new version (see above).

## WhatsApp messages

Confirmations go by email. Automated WhatsApp messages need the WhatsApp
Business Platform: a Meta-verified business, an approved message template, and
a small per-message fee. It can be added to `settle_()` later. Meanwhile the
owner alert email includes the customer's phone number for a manual WhatsApp.

## Limits worth knowing

- Gmail accounts can send ~100 emails/day from Apps Script (Google Workspace:
  1,500). Each order uses two.
- One product per order. A customer wanting both villages places two orders.
- Gift / bulk / international orders: route through `/contact`.
