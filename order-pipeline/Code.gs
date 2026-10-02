/**
 * ============================================================================
 * ApiCare — Order pipeline (Google Apps Script, bound to the Orders sheet)
 * ============================================================================
 *
 *   apicare.co.in/checkout ── POST create ──▶ this script ──▶ Razorpay order
 *                                                 └──▶ Sheet row "Awaiting payment"
 *   Razorpay Checkout (UPI / card / netbanking) — customer pays
 *   apicare.co.in/checkout ── POST verify ──▶ this script
 *                                                 ├─ checks Razorpay's signature
 *                                                 ├─ re-reads the payment from Razorpay
 *                                                 ├─ Sheet row → "Paid"
 *                                                 └─ emails the customer + ApiCare
 *
 *   Every 10 minutes reconcilePending() catches payments whose browser closed
 *   before "verify" ran, and marks unpaid rows older than 48h "Abandoned".
 *
 * Secrets live in Project Settings → Script Properties, never in this file:
 *   RAZORPAY_KEY_ID       rzp_test_… while testing, rzp_live_… when live
 *   RAZORPAY_KEY_SECRET   Razorpay Dashboard → Account & Settings → API Keys
 *   NOTIFY_EMAIL          where new-order alerts go, e.g. hello@apicare.co.in
 *
 * Setup: order-pipeline/README.md. Tests: node order-pipeline/test.mjs
 * ============================================================================
 */

const CONFIG = {
  SHEET_NAME: 'Orders',
  CURRENCY: 'INR',
  SHIPPING_INR: 0, // must match shop.shippingINR in src/data/site.js
  DELIVERY_DAYS: 14, // must match shop.deliveryDays in src/data/site.js
  MAX_QTY: 10,
  ABANDON_AFTER_HOURS: 48,
  TIMEZONE: 'Asia/Kolkata',
  BRAND: 'ApiCare',
  SITE_URL: 'https://www.apicare.co.in',
  WHATSAPP: '+91 79080 90298',
};

// Prices are set here, never taken from the browser. Must match the
// available products in src/data/honey.js (test.mjs checks this).
const CATALOGUE = {
  'zitlang-pakyong': { name: 'Zitlang, East Sikkim', sizes: { '250g': 650, '500g': 1200 } },
  'kewzing-south': { name: 'Kewzing, South Sikkim', sizes: { '250g': 650, '500g': 1200 } },
};

// Must match src/data/india.js (test.mjs checks this).
const STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

// Sheet columns, in order. Rows are read and written by header name, so you
// can add your own columns (e.g. courier, tracking no.) to the right freely.
const COLUMNS = [
  'Order ref', 'Created at', 'Status', 'Product', 'Size', 'Unit price (INR)', 'Quantity',
  'Shipping (INR)', 'Total (INR)', 'Name', 'Email', 'Phone',
  'Delivery address 1', 'Delivery address 2', 'Delivery city', 'Delivery state', 'Delivery PIN',
  'Mailing same as delivery', 'Mailing address 1', 'Mailing address 2', 'Mailing city',
  'Mailing state', 'Mailing PIN', 'Note', 'Razorpay order id', 'Razorpay payment id',
  'Paid at', 'Deliver by', 'Customer emailed', 'Dispatched',
];

const STATUS = { PENDING: 'Awaiting payment', PAID: 'Paid', ABANDONED: 'Abandoned' };

/** An error whose message is safe to show the customer. */
class UserError extends Error {}

// ============================================================================
// Web app entry points
// ============================================================================

function doGet() {
  return json_({ ok: true, service: 'apicare-orders' });
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action === 'create') return json_(createOrder_(body));
    if (body.action === 'verify') return json_(verifyPayment_(body));
    throw new UserError('Unknown request.');
  } catch (err) {
    if (err instanceof UserError) return json_({ ok: false, error: err.message });
    console.error(err && err.stack ? err.stack : err);
    return json_({
      ok: false,
      error: `Something went wrong on our side. Please try again, or WhatsApp us on ${CONFIG.WHATSAPP}.`,
    });
  }
}

// ============================================================================
// create — validate, price, open a Razorpay order, log the row
// ============================================================================

function createOrder_(input) {
  if (str_(input.website)) throw new UserError('Could not place this order.'); // honeypot
  const o = validateOrder_(input);
  const ref = newRef_();

  const rzpOrder = razorpay_('post', '/orders', {
    amount: o.total * 100, // paise
    currency: CONFIG.CURRENCY,
    receipt: ref,
    notes: { ref: ref, product: o.productName, size: o.size, quantity: String(o.quantity) },
  });

  const d = o.shipping;
  const m = o.mailing;
  appendRow_({
    'Order ref': ref,
    'Created at': new Date(),
    'Status': STATUS.PENDING,
    'Product': o.productName,
    'Size': o.size,
    'Unit price (INR)': o.unitPrice,
    'Quantity': o.quantity,
    'Shipping (INR)': o.shippingFee,
    'Total (INR)': o.total,
    'Name': o.name,
    'Email': o.email,
    'Phone': o.phone,
    'Delivery address 1': d.line1,
    'Delivery address 2': d.line2,
    'Delivery city': d.city,
    'Delivery state': d.state,
    'Delivery PIN': d.pin,
    'Mailing same as delivery': o.mailingSame ? 'Yes' : 'No',
    'Mailing address 1': m.line1,
    'Mailing address 2': m.line2,
    'Mailing city': m.city,
    'Mailing state': m.state,
    'Mailing PIN': m.pin,
    'Note': o.notes,
    'Razorpay order id': rzpOrder.id,
  });

  return {
    ok: true,
    ref: ref,
    orderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
    keyId: prop_('RAZORPAY_KEY_ID'),
    description: `${o.productName} · ${o.size} × ${o.quantity}`,
    prefill: { name: o.name, email: o.email, contact: o.phone },
  };
}

function validateOrder_(i) {
  const sku = str_(i.sku);
  const product = CATALOGUE[sku];
  if (!product) throw new UserError('That honey is not available to order.');
  const size = str_(i.size);
  const unitPrice = product.sizes[size];
  if (!unitPrice) throw new UserError('Please choose a jar size.');
  const quantity = Number(i.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > CONFIG.MAX_QTY) {
    throw new UserError(`Quantity must be between 1 and ${CONFIG.MAX_QTY}.`);
  }

  const name = required_(i.name, 'your full name', 100);
  const email = required_(i.email, 'your email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new UserError('Please enter a valid email address.');
  const phone = phone_(i.phone);
  const shipping = address_(i.shipping, 'delivery');
  const mailingSame = i.mailingSame !== false;
  const mailing = mailingSame ? shipping : address_(i.mailing, 'mailing');

  return {
    sku: sku,
    productName: product.name,
    size: size,
    unitPrice: unitPrice,
    quantity: quantity,
    shippingFee: CONFIG.SHIPPING_INR,
    total: unitPrice * quantity + CONFIG.SHIPPING_INR,
    name: name,
    email: email,
    phone: phone,
    shipping: shipping,
    mailingSame: mailingSame,
    mailing: mailing,
    notes: str_(i.notes).slice(0, 500),
  };
}

function address_(a, label) {
  a = a || {};
  const state = str_(a.state);
  if (STATES.indexOf(state) === -1) throw new UserError(`Please choose the ${label} state.`);
  const pin = str_(a.pin).replace(/\s/g, '');
  const result = {
    line1: required_(a.line1, `your ${label} address`, 200),
    line2: str_(a.line2).slice(0, 200),
    city: required_(a.city, `the ${label} city or town`, 100),
    state: state,
    pin: pin,
  };
  if (!/^[1-9]\d{5}$/.test(pin)) throw new UserError(`Please enter a valid 6-digit ${label} PIN code.`);
  return result;
}

function phone_(raw) {
  let d = str_(raw).replace(/\D/g, '');
  if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
  if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
  if (!/^[6-9]\d{9}$/.test(d)) throw new UserError('Please enter a valid 10-digit Indian mobile number.');
  return '+91' + d;
}

function newRef_() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
  let tail = '';
  for (let i = 0; i < 4; i++) tail += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  return `APC-${Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyMMdd')}-${tail}`;
}

// ============================================================================
// verify — Razorpay's success callback, relayed by the browser
// ============================================================================

function verifyPayment_(i) {
  const orderId = str_(i.razorpay_order_id);
  const paymentId = str_(i.razorpay_payment_id);
  const signature = str_(i.razorpay_signature);
  if (!orderId || !paymentId || !signature) throw new UserError('Missing payment details.');

  const expected = hmacHex_(`${orderId}|${paymentId}`, prop_('RAZORPAY_KEY_SECRET'));
  if (!safeEqual_(expected, signature)) {
    throw new UserError('We could not verify this payment. If money left your account, WhatsApp us and we will sort it out.');
  }

  const row = settle_(orderId, paymentId);
  return { ok: true, ref: row['Order ref'], deliverBy: formatDate_(row['Deliver by']) };
}

/**
 * Confirms a payment with Razorpay and marks its row Paid (once).
 * Safe to call repeatedly and from both verify and the reconcile trigger.
 */
function settle_(orderId, paymentId) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sh = sheet_();
    const found = findRow_(sh, 'Razorpay order id', orderId);
    if (!found) throw new Error(`No sheet row for Razorpay order ${orderId}`);
    if (found.record['Status'] === STATUS.PAID) return found.record;

    let payment = razorpay_('get', `/payments/${encodeURIComponent(paymentId)}`);
    const expectedPaise = Math.round(Number(found.record['Total (INR)']) * 100);
    if (payment.order_id !== orderId || Number(payment.amount) !== expectedPaise) {
      throw new Error(`Payment ${paymentId} does not match order ${orderId}`);
    }
    if (payment.status === 'authorized') {
      payment = razorpay_('post', `/payments/${encodeURIComponent(paymentId)}/capture`, {
        amount: payment.amount,
        currency: payment.currency,
      });
    }
    if (payment.status !== 'captured') {
      throw new UserError('Your payment has not completed yet. If money left your account, it will be confirmed within 15 minutes.');
    }

    const paidAt = new Date();
    const deliverBy = new Date(paidAt.getTime() + CONFIG.DELIVERY_DAYS * 864e5);
    const update = {
      'Status': STATUS.PAID,
      'Razorpay payment id': paymentId,
      'Paid at': paidAt,
      'Deliver by': deliverBy,
    };
    setCells_(sh, found, update);
    SpreadsheetApp.flush();
    const record = Object.assign({}, found.record, update);

    let emailed;
    try {
      sendCustomerEmail_(record);
      emailed = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm');
    } catch (err) {
      console.error(err);
      emailed = `FAILED: ${err.message}`;
    }
    setCells_(sh, found, { 'Customer emailed': emailed });

    try {
      sendOwnerEmail_(record, sh.getParent().getUrl());
    } catch (err) {
      console.error(err);
    }
    return record;
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// reconcilePending — time-driven trigger, every 10 minutes (see setup())
// ============================================================================

function reconcilePending() {
  const sh = sheet_();
  const data = sh.getDataRange().getValues();
  const header = data[0];
  const now = Date.now();

  for (let r = 1; r < data.length; r++) {
    const rec = toRecord_(header, data[r]);
    if (rec['Status'] !== STATUS.PENDING || !rec['Razorpay order id']) continue;
    try {
      const orderId = rec['Razorpay order id'];
      const payments = razorpay_('get', `/orders/${encodeURIComponent(orderId)}/payments`).items || [];
      const paid =
        payments.find((p) => p.status === 'captured') || payments.find((p) => p.status === 'authorized');
      if (paid) {
        settle_(orderId, paid.id);
      } else if (now - new Date(rec['Created at']).getTime() > CONFIG.ABANDON_AFTER_HOURS * 36e5) {
        setCells_(sh, { rowNumber: r + 1, header: header }, { 'Status': STATUS.ABANDONED });
      }
    } catch (err) {
      console.error(`reconcile ${rec['Order ref']}: ${err.message}`);
    }
  }
}

// ============================================================================
// setup — run once from the editor after setting Script Properties
// ============================================================================

function setup() {
  prop_('RAZORPAY_KEY_ID');
  prop_('RAZORPAY_KEY_SECRET');
  razorpay_('get', '/orders?count=1'); // fails loudly if the keys are wrong
  sheet_();

  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'reconcilePending')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('reconcilePending').timeBased().everyMinutes(10).create();

  const notify = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (notify) {
    MailApp.sendEmail(notify, `${CONFIG.BRAND} order pipeline connected`,
      'Razorpay keys work, the Orders sheet is ready, and the 10-minute reconcile trigger is installed.');
  }
  console.log('Setup complete. Now deploy as a Web App (see README).');
}

// ============================================================================
// Emails
// ============================================================================

function sendCustomerEmail_(r) {
  const first = String(r['Name']).split(/\s+/)[0];
  const deliverBy = formatDate_(r['Deliver by']);
  const address = deliveryAddress_(r);
  const total = rupees_(r['Total (INR)']);
  const shipping = Number(r['Shipping (INR)']) ? rupees_(r['Shipping (INR)']) : 'Included';

  const text = [
    `Hi ${first},`,
    '',
    `Thank you. Your order ${r['Order ref']} is placed and paid, and will be delivered within ${deliveryWindow_()} (by ${deliverBy}).`,
    '',
    `${r['Product']} · ${r['Size']} × ${r['Quantity']}`,
    `Shipping: ${shipping}`,
    `Total paid: ${total}`,
    '',
    'Delivering to:',
    `${r['Name']}`,
    address,
    `${r['Phone']}`,
    '',
    `Questions? Reply to this email or WhatsApp us on ${CONFIG.WHATSAPP}.`,
    '',
    `— ${CONFIG.BRAND}, Sikkim`,
    CONFIG.SITE_URL,
  ].join('\n');

  const e = escape_;
  const html = `
<div style="font-family:Georgia,serif;color:#1A1916;max-width:560px;line-height:1.6">
  <p style="font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:#B8541A;margin:0 0 16px">Order placed</p>
  <h1 style="font-weight:400;font-size:26px;margin:0 0 16px">Thank you, ${e(first)}.</h1>
  <p>Your order <strong>${e(r['Order ref'])}</strong> is placed and paid, and will be delivered
     within ${e(deliveryWindow_())}: <strong>by ${e(deliverBy)}</strong>.</p>
  <table style="width:100%;border-collapse:collapse;margin:24px 0;font-family:Arial,sans-serif;font-size:14px">
    <tr><td style="padding:8px 0;border-top:1px solid #ddd">${e(r['Product'])} · ${e(r['Size'])} × ${e(r['Quantity'])}</td>
        <td style="padding:8px 0;border-top:1px solid #ddd;text-align:right">${e(rupees_(r['Unit price (INR)'] * r['Quantity']))}</td></tr>
    <tr><td style="padding:8px 0">Shipping</td><td style="padding:8px 0;text-align:right">${e(shipping)}</td></tr>
    <tr><td style="padding:8px 0;border-top:1px solid #1A1916"><strong>Total paid</strong></td>
        <td style="padding:8px 0;border-top:1px solid #1A1916;text-align:right"><strong>${e(total)}</strong></td></tr>
  </table>
  <p style="font-family:Arial,sans-serif;font-size:14px;margin:0 0 4px;color:#7A7269">Delivering to</p>
  <p style="font-family:Arial,sans-serif;font-size:14px;margin:0 0 24px">${e(r['Name'])}<br>${e(address).replace(/\n/g, '<br>')}<br>${e(r['Phone'])}</p>
  <p style="font-size:15px">Questions? Reply to this email or WhatsApp us on ${e(CONFIG.WHATSAPP)}.</p>
  <p style="font-size:15px">— ${e(CONFIG.BRAND)}, Sikkim<br><a href="${CONFIG.SITE_URL}" style="color:#B8541A">${CONFIG.SITE_URL.replace('https://', '')}</a></p>
</div>`;

  const options = { name: CONFIG.BRAND, htmlBody: html };
  const notify = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (notify) options.replyTo = notify;
  MailApp.sendEmail(r['Email'], `Your ${CONFIG.BRAND} order ${r['Order ref']} is confirmed`, text, options);
}

function sendOwnerEmail_(r, sheetUrl) {
  const notify = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!notify) return;
  const mailing = r['Mailing same as delivery'] === 'Yes' ? 'Same as delivery' : [
    r['Mailing address 1'], r['Mailing address 2'], r['Mailing city'],
    `${r['Mailing state']} ${r['Mailing PIN']}`,
  ].filter(Boolean).join('\n');
  const text = [
    `${r['Order ref']} · PAID ${rupees_(r['Total (INR)'])}`,
    `${r['Product']} · ${r['Size']} × ${r['Quantity']}`,
    `Deliver by ${formatDate_(r['Deliver by'])}`,
    '',
    `${r['Name']} · ${r['Phone']} · ${r['Email']}`,
    '',
    'Delivery address:',
    deliveryAddress_(r),
    '',
    'Mailing address:',
    mailing,
    r['Note'] ? `\nNote: ${r['Note']}` : '',
    '',
    `Razorpay payment: ${r['Razorpay payment id']}`,
    `Sheet: ${sheetUrl}`,
  ].join('\n');
  MailApp.sendEmail(notify,
    `New order ${r['Order ref']}: ${r['Product']} ${r['Size']} × ${r['Quantity']} (${rupees_(r['Total (INR)'])})`,
    text, { name: `${CONFIG.BRAND} orders`, replyTo: r['Email'] });
}

function deliveryWindow_() {
  const n = CONFIG.DELIVERY_DAYS;
  return n % 7 === 0 ? `${n / 7} week${n === 7 ? '' : 's'}` : `${n} days`;
}

function deliveryAddress_(r) {
  return [
    r['Delivery address 1'], r['Delivery address 2'], r['Delivery city'],
    `${r['Delivery state']} ${r['Delivery PIN']}`,
  ].filter(Boolean).join('\n');
}

// ============================================================================
// Sheet helpers — rows are addressed by header name
// ============================================================================

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sh) sh = ss.insertSheet(CONFIG.SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function header_(sh) {
  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
}

function appendRow_(record) {
  const sh = sheet_();
  sh.appendRow(header_(sh).map((h) => (h in record ? cell_(record[h]) : '')));
}

function findRow_(sh, column, value) {
  const data = sh.getDataRange().getValues();
  const header = data[0];
  const c = header.indexOf(column);
  for (let r = data.length - 1; r >= 1; r--) {
    if (data[r][c] === value) return { rowNumber: r + 1, header: header, record: toRecord_(header, data[r]) };
  }
  return null;
}

function setCells_(sh, found, values) {
  Object.keys(values).forEach((k) => {
    const c = found.header.indexOf(k);
    if (c === -1) throw new Error(`Sheet is missing the "${k}" column`);
    sh.getRange(found.rowNumber, c + 1).setValue(cell_(values[k]));
  });
}

function toRecord_(header, row) {
  const rec = {};
  header.forEach((h, i) => (rec[h] = row[i]));
  return rec;
}

/** Store customer text as text: no formulas, keeps "+91…" and PIN codes intact. */
function cell_(v) {
  if (typeof v !== 'string') return v;
  return /^[=+\-@\d]/.test(v) ? `'${v}` : v;
}

// ============================================================================
// Razorpay + small utilities
// ============================================================================

function razorpay_(method, path, payload) {
  const auth = Utilities.base64Encode(`${prop_('RAZORPAY_KEY_ID')}:${prop_('RAZORPAY_KEY_SECRET')}`);
  const options = { method: method, headers: { Authorization: `Basic ${auth}` }, muteHttpExceptions: true };
  if (payload) {
    options.contentType = 'application/json';
    options.payload = JSON.stringify(payload);
  }
  const res = UrlFetchApp.fetch(`https://api.razorpay.com/v1${path}`, options);
  const code = res.getResponseCode();
  const text = res.getContentText();
  let body = {};
  try { body = JSON.parse(text || '{}'); } catch (_) { /* non-JSON error page */ }
  if (code === 401) {
    throw new Error('Razorpay rejected the API keys (401). Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Script Properties: same test/live mode, no extra characters.');
  }
  if (code >= 300) {
    const reason = (body.error && body.error.description) || text.slice(0, 200);
    throw new Error(`Razorpay ${method.toUpperCase()} ${path} → ${code}: ${reason}`);
  }
  return body;
}

function hmacHex_(message, secret) {
  return Utilities.computeHmacSha256Signature(message, secret)
    .map((b) => ('0' + (b & 0xff).toString(16)).slice(-2))
    .join('');
}

function safeEqual_(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function prop_(key) {
  const v = (PropertiesService.getScriptProperties().getProperty(key) || '').trim();
  if (!v) throw new Error(`Script Property ${key} is not set (Project Settings → Script Properties).`);
  return v;
}

function required_(v, label, max) {
  const s = str_(v);
  if (!s) throw new UserError(`Please enter ${label}.`);
  if (s.length > max) throw new UserError(`That is too long for ${label}.`);
  return s;
}

function str_(v) {
  return v == null ? '' : String(v).trim();
}

function rupees_(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function formatDate_(d) {
  return d ? Utilities.formatDate(new Date(d), CONFIG.TIMEZONE, 'EEEE, d MMMM yyyy') : '';
}

function escape_(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
