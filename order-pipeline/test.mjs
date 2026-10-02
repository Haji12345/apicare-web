// ========================================================================
// Local tests for order-pipeline/Code.gs — no Google account needed.
//   node order-pipeline/test.mjs
// Runs Code.gs in a sandbox with fake Sheets / Mail / Razorpay, and checks
// that its catalogue, states and shop settings match the website's data.
// ========================================================================

import { readFileSync } from 'node:fs';
import { createHmac } from 'node:crypto';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const here = new URL('.', import.meta.url);
const code = readFileSync(new URL('Code.gs', here), 'utf8');
const { honey } = await import(new URL('../src/data/honey.js', here));
const { indianStates } = await import(new URL('../src/data/india.js', here));
const { shop } = await import(new URL('../src/data/site.js', here));

const KEY_ID = 'rzp_test_abc';
const SECRET = 'test_secret_123';

// ---------------------------------------------------------------- fakes
function makeWorld() {
  const props = { RAZORPAY_KEY_ID: KEY_ID, RAZORPAY_KEY_SECRET: SECRET, NOTIFY_EMAIL: 'owner@apicare.test' };
  const mail = [];
  const rawWrites = [];
  const rzp = { orders: {}, payments: {}, seq: 0 };

  const strip = (v) => (typeof v === 'string' && v.startsWith("'") ? v.slice(1) : v);
  const sheet = {
    rows: [],
    getLastRow() { return this.rows.length; },
    getLastColumn() { return Math.max(0, ...this.rows.map((r) => r.length)); },
    getRange(r, c, nr = 1, nc = 1) {
      const sh = this;
      return {
        setValues(v) {
          v.forEach((row, i) => row.forEach((x, j) => {
            (sh.rows[r - 1 + i] ||= [])[c - 1 + j] = strip(x);
          }));
          return this;
        },
        getValues() {
          return Array.from({ length: nr }, (_, i) =>
            Array.from({ length: nc }, (_, j) => sh.rows[r - 1 + i]?.[c - 1 + j] ?? ''));
        },
        setValue(v) { rawWrites.push(v); (sh.rows[r - 1] ||= [])[c - 1] = strip(v); return this; },
        setFontWeight() { return this; },
      };
    },
    appendRow(row) { rawWrites.push(...row); this.rows.push(row.map(strip)); },
    getDataRange() { return { getValues: () => this.rows.map((r) => [...r]) }; },
    setFrozenRows() {},
    getParent() { return ss; },
  };
  const ss = {
    getSheetByName: (n) => (n === 'Orders' && sheet.inserted ? sheet : null),
    insertSheet: () => { sheet.inserted = true; return sheet; },
    getUrl: () => 'https://docs.google.com/spreadsheets/d/test',
  };

  const reply = (code, body) => ({ getResponseCode: () => code, getContentText: () => JSON.stringify(body) });
  const UrlFetchApp = {
    fetch(url, opts) {
      const auth = Buffer.from(opts.headers.Authorization.replace('Basic ', ''), 'base64').toString();
      if (auth !== `${KEY_ID}:${SECRET}`) return reply(401, { error: { description: 'bad auth' } });
      const path = url.replace('https://api.razorpay.com/v1', '');
      const body = opts.payload ? JSON.parse(opts.payload) : null;
      let m;
      if (opts.method === 'post' && path === '/orders') {
        const id = `order_${++rzp.seq}`;
        rzp.orders[id] = { id, amount: body.amount, currency: body.currency, receipt: body.receipt, notes: body.notes };
        return reply(200, rzp.orders[id]);
      }
      if (opts.method === 'get' && path.startsWith('/orders?')) return reply(200, { items: [] });
      if ((m = path.match(/^\/orders\/([^/]+)\/payments$/))) {
        return reply(200, { items: Object.values(rzp.payments).filter((p) => p.order_id === m[1]) });
      }
      if ((m = path.match(/^\/payments\/([^/]+)\/capture$/))) {
        const p = rzp.payments[m[1]];
        assert.equal(body.amount, p.amount);
        p.status = 'captured';
        return reply(200, p);
      }
      if ((m = path.match(/^\/payments\/([^/]+)$/))) {
        const p = rzp.payments[m[1]];
        return p ? reply(200, p) : reply(400, { error: { description: 'not found' } });
      }
      return reply(404, { error: { description: `no route ${opts.method} ${path}` } });
    },
  };

  const fmt = (d, _tz, f) => {
    const p = Object.fromEntries(
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric',
        weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false,
      }).formatToParts(d).map((x) => [x.type, x.value]));
    const mm = String(new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).getMonth() + 1).padStart(2, '0');
    const dd = p.day.padStart(2, '0');
    if (f === 'yyMMdd') return p.year.slice(2) + mm + dd;
    if (f === 'yyyy-MM-dd HH:mm') return `${p.year}-${mm}-${dd} ${p.hour}:${p.minute}`;
    if (f === 'EEEE, d MMMM yyyy') return `${p.weekday}, ${Number(p.day)} ${p.month} ${p.year}`;
    throw new Error(`fmt ${f}`);
  };

  const triggers = [];
  const ctx = vm.createContext({
    console: { log() {}, error() {} },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] ?? null }) },
    Utilities: {
      base64Encode: (s) => Buffer.from(s).toString('base64'),
      computeHmacSha256Signature: (msg, key) => [...new Int8Array(createHmac('sha256', key).update(msg).digest())],
      formatDate: fmt,
    },
    SpreadsheetApp: { getActiveSpreadsheet: () => ss, flush() {} },
    UrlFetchApp,
    MailApp: { sendEmail: (to, subject, body, options = {}) => mail.push({ to, subject, body, ...options }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    ContentService: {
      MimeType: { JSON: 'json' },
      createTextOutput: (s) => ({ setMimeType() { return this; }, s }),
    },
    ScriptApp: {
      getProjectTriggers: () => triggers,
      deleteTrigger: (t) => triggers.splice(triggers.indexOf(t), 1),
      newTrigger: (fn) => ({ timeBased: () => ({ everyMinutes: () => ({ create: () => triggers.push({ getHandlerFunction: () => fn }) }) }) }),
    },
  });
  vm.runInContext(`${code}\n;globalThis.__api = { doPost, reconcilePending, setup, CONFIG, CATALOGUE, STATES };`, ctx);
  const api = ctx.__api;
  const post = (body) => JSON.parse(api.doPost({ postData: { contents: JSON.stringify(body) } }).s);
  const rows = () => {
    const [h, ...rest] = sheet.rows;
    return rest.map((r) => Object.fromEntries(h.map((k, i) => [k, r[i]])));
  };
  // Simulate the customer paying inside the Razorpay modal
  const pay = (orderId, status = 'captured') => {
    const id = `pay_${++rzp.seq}`;
    rzp.payments[id] = { id, order_id: orderId, amount: rzp.orders[orderId].amount, currency: 'INR', status };
    return id;
  };
  const sign = (orderId, paymentId) => createHmac('sha256', SECRET).update(`${orderId}|${paymentId}`).digest('hex');
  return { api, post, rows, pay, sign, mail, rawWrites, rzp, sheet, triggers };
}

const validOrder = () => ({
  action: 'create',
  sku: 'kewzing-south',
  size: '250g',
  quantity: 2,
  name: 'Pema Lepcha',
  email: 'Pema@Example.com',
  phone: '098765 43210',
  shipping: { line1: '12 MG Marg', line2: 'Near post office', city: 'Gangtok', state: 'Sikkim', pin: '737101' },
  mailingSame: true,
  mailing: null,
  notes: 'Gift for my mother',
  website: '',
});

// ---------------------------------------------------------------- tests
const tests = [];
const test = (name, fn) => tests.push({ name, fn });

test('catalogue matches src/data/honey.js', () => {
  const { api } = makeWorld();
  const site = Object.fromEntries(honey.filter((h) => h.available).map((h) => [
    h.slug, { name: h.name, sizes: Object.fromEntries(h.sizes.map((s) => [s.weight, s.priceINR])) },
  ]));
  assert.deepEqual(JSON.parse(JSON.stringify(api.CATALOGUE)), site);
});

test('states match src/data/india.js', () => {
  assert.deepEqual([...makeWorld().api.STATES], indianStates);
});

test('shipping and delivery days match src/data/site.js', () => {
  const { CONFIG } = makeWorld().api;
  assert.equal(CONFIG.SHIPPING_INR, shop.shippingINR);
  assert.equal(CONFIG.DELIVERY_DAYS, shop.deliveryDays);
  assert.equal(CONFIG.MAX_QTY, shop.maxQuantity);
});

test('create: prices server-side, opens Razorpay order, logs every detail', () => {
  const w = makeWorld();
  const res = w.post({ ...validOrder(), price: 1, amount: 100 }); // browser-sent prices ignored
  assert.equal(res.ok, true, res.error);
  assert.match(res.ref, /^APC-\d{6}-[A-Z2-9]{4}$/);
  assert.equal(res.amount, 130000);
  assert.equal(res.keyId, KEY_ID);
  assert.deepEqual({ ...res.prefill }, { name: 'Pema Lepcha', email: 'pema@example.com', contact: '+919876543210' });
  const [row] = w.rows();
  assert.equal(row['Status'], 'Awaiting payment');
  assert.equal(row['Total (INR)'], 1300);
  assert.equal(row['Quantity'], 2);
  assert.equal(row['Phone'], '+919876543210');
  assert.equal(row['Delivery PIN'], '737101');
  assert.equal(row['Delivery city'], 'Gangtok');
  assert.equal(row['Mailing same as delivery'], 'Yes');
  assert.equal(row['Mailing address 1'], '12 MG Marg');
  assert.equal(row['Note'], 'Gift for my mother');
  assert.equal(row['Razorpay order id'], res.orderId);
  assert.equal(w.mail.length, 0, 'no email before payment');
});

test('create: separate mailing address is stored', () => {
  const w = makeWorld();
  const res = w.post({
    ...validOrder(),
    mailingSame: false,
    mailing: { line1: 'Flat 4B, Park St', line2: '', city: 'Kolkata', state: 'West Bengal', pin: '700016' },
  });
  assert.equal(res.ok, true, res.error);
  const [row] = w.rows();
  assert.equal(row['Mailing same as delivery'], 'No');
  assert.equal(row['Mailing city'], 'Kolkata');
  assert.equal(row['Mailing PIN'], '700016');
});

test('create: rejects bad input with a readable message', () => {
  const w = makeWorld();
  const cases = [
    [{ sku: 'dzongu-north' }, /not available/],
    [{ size: '1kg' }, /jar size/],
    [{ quantity: 0 }, /between 1 and 10/],
    [{ quantity: 11 }, /between 1 and 10/],
    [{ quantity: 1.5 }, /between 1 and 10/],
    [{ name: '  ' }, /full name/],
    [{ email: 'nope' }, /valid email/],
    [{ phone: '12345' }, /mobile number/],
    [{ phone: '5876543210' }, /mobile number/],
    [{ shipping: { ...validOrder().shipping, pin: '012345' } }, /PIN/],
    [{ shipping: { ...validOrder().shipping, state: 'Narnia' } }, /state/],
    [{ shipping: { ...validOrder().shipping, line1: '' } }, /delivery address/],
    [{ mailingSame: false, mailing: null }, /mailing state/],
    [{ website: 'http://spam' }, /Could not place/],
  ];
  for (const [patch, msg] of cases) {
    const res = w.post({ ...validOrder(), ...patch });
    assert.equal(res.ok, false, JSON.stringify(patch));
    assert.match(res.error, msg, JSON.stringify(patch));
  }
  assert.equal(w.rows().length, 0, 'nothing logged for rejected orders');
});

test('create: spreadsheet formulas in customer text are neutralised', () => {
  const w = makeWorld();
  w.post({ ...validOrder(), name: '=HYPERLINK("http://evil","x")' });
  assert.ok(w.rawWrites.includes(`'=HYPERLINK("http://evil","x")`));
});

test('verify: forged signature is rejected, nothing marked paid', () => {
  const w = makeWorld();
  const c = w.post(validOrder());
  const paymentId = w.pay(c.orderId);
  const res = w.post({ action: 'verify', razorpay_order_id: c.orderId, razorpay_payment_id: paymentId, razorpay_signature: 'f'.repeat(64) });
  assert.equal(res.ok, false);
  assert.equal(w.rows()[0]['Status'], 'Awaiting payment');
  assert.equal(w.mail.length, 0);
});

test('verify: marks paid, sets deliver-by, emails customer and owner exactly once', () => {
  const w = makeWorld();
  const c = w.post(validOrder());
  const paymentId = w.pay(c.orderId);
  const body = { action: 'verify', razorpay_order_id: c.orderId, razorpay_payment_id: paymentId, razorpay_signature: w.sign(c.orderId, paymentId) };
  const res = w.post(body);
  assert.equal(res.ok, true, res.error);
  assert.equal(res.ref, c.ref);
  assert.match(res.deliverBy, /^\w+day, \d+ \w+ \d{4}$/);

  const [row] = w.rows();
  assert.equal(row['Status'], 'Paid');
  assert.equal(row['Razorpay payment id'], paymentId);
  const days = (row['Deliver by'] - row['Paid at']) / 864e5;
  assert.equal(days, 14);
  assert.match(row['Customer emailed'], /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);

  assert.equal(w.mail.length, 2);
  const [customer, owner] = w.mail;
  assert.equal(customer.to, 'pema@example.com');
  assert.match(customer.subject, new RegExp(c.ref));
  assert.match(customer.body, /delivered within 2 weeks/);
  assert.match(customer.body, /Gangtok/);
  assert.match(customer.htmlBody, /₹1,300/);
  assert.equal(customer.replyTo, 'owner@apicare.test');
  assert.equal(owner.to, 'owner@apicare.test');
  assert.match(owner.body, /\+919876543210/);
  assert.match(owner.body, /Gift for my mother/);

  // Browser retries verify: no duplicate emails
  assert.equal(w.post(body).ok, true);
  assert.equal(w.mail.length, 2);
});

test('verify: authorized payments are captured', () => {
  const w = makeWorld();
  const c = w.post(validOrder());
  const paymentId = w.pay(c.orderId, 'authorized');
  const res = w.post({ action: 'verify', razorpay_order_id: c.orderId, razorpay_payment_id: paymentId, razorpay_signature: w.sign(c.orderId, paymentId) });
  assert.equal(res.ok, true, res.error);
  assert.equal(w.rzp.payments[paymentId].status, 'captured');
  assert.equal(w.rows()[0]['Status'], 'Paid');
});

test('verify: payment for a different amount is not accepted', () => {
  const w = makeWorld();
  const c = w.post(validOrder());
  const paymentId = w.pay(c.orderId);
  w.rzp.payments[paymentId].amount = 100;
  const res = w.post({ action: 'verify', razorpay_order_id: c.orderId, razorpay_payment_id: paymentId, razorpay_signature: w.sign(c.orderId, paymentId) });
  assert.equal(res.ok, false);
  assert.equal(w.rows()[0]['Status'], 'Awaiting payment');
});

test('reconcile: catches paid orders whose browser closed, abandons stale ones', () => {
  const w = makeWorld();
  const paidLater = w.post(validOrder());
  w.pay(paidLater.orderId); // paid, but verify never arrived
  const stale = w.post({ ...validOrder(), email: 'stale@example.com' });
  const fresh = w.post({ ...validOrder(), email: 'fresh@example.com' });
  // Age the stale order past 48h
  const h = w.sheet.rows[0];
  w.sheet.rows[2][h.indexOf('Created at')] = new Date(Date.now() - 49 * 36e5);

  w.api.reconcilePending();
  const byOrder = Object.fromEntries(w.rows().map((r) => [r['Razorpay order id'], r['Status']]));
  assert.equal(byOrder[paidLater.orderId], 'Paid');
  assert.equal(byOrder[stale.orderId], 'Abandoned');
  assert.equal(byOrder[fresh.orderId], 'Awaiting payment');
  assert.equal(w.mail.filter((m) => m.to === 'pema@example.com').length, 1);

  w.api.reconcilePending(); // idempotent
  assert.equal(w.mail.length, 2);
});

test('setup: creates the sheet and exactly one reconcile trigger', () => {
  const w = makeWorld();
  w.api.setup();
  w.api.setup();
  assert.equal(w.triggers.length, 1);
  assert.equal(w.sheet.rows[0][0], 'Order ref');
  assert.equal(w.mail.at(-1).to, 'owner@apicare.test');
});

let failed = 0;
for (const t of tests) {
  try {
    t.fn();
    console.log(`  ✓ ${t.name}`);
  } catch (err) {
    failed++;
    console.log(`  ✗ ${t.name}\n    ${err.message.split('\n').join('\n    ')}`);
  }
}
console.log(failed ? `\n${failed} failed` : `\nAll ${tests.length} passed`);
process.exit(failed ? 1 : 0);
