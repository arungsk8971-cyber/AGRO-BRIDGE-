import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const htmlPath = path.resolve(process.cwd(), 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, 'Expected inline <script> in index.html');

const ctx: Record<string, any> = {
  Date,
  Math,
  Number,
  String,
  Object,
  Array,
  setTimeout,
  clearTimeout
};
vm.createContext(ctx);
vm.runInContext(scriptMatch[1], ctx);
const exportsFromVm = vm.runInContext('({ BASE_RATES, state })', ctx);
Object.assign(ctx, exportsFromVm);

test('HTML structure adheres to self-contained and forbidden-pattern rules', () => {
  assert.equal(/<form[\s>]/i.test(html), false, 'Must not contain <form> tags');
  assert.equal(/localStorage|sessionStorage/.test(html), false, 'Must not use web storage');
  assert.equal(/window\.alert|window\.open/.test(html), false, 'Must not use window.alert/open');
  assert.match(html, /fonts\.googleapis\.com\/css2\?family=Fraunces/);
  assert.match(html, /Inter/);
});

test('Pricing rules and grade multipliers stay consistent', () => {
  assert.equal(ctx.getGradeRate('Tomato', 'A'), 9);
  assert.equal(ctx.getGradeRate('Tomato', 'B'), Math.round(9 * 0.92));
  assert.equal(ctx.getGradeRate('Tomato', 'C'), Math.round(9 * 0.85));
  assert.equal(ctx.getGradeRate('Chilli', 'A'), 68);
  assert.equal(ctx.getGradeRate('Chilli', 'B'), Math.round(68 * 0.92));
  assert.equal(ctx.getGradeRate('Chilli', 'C'), Math.round(68 * 0.85));

  for (const crop of Object.keys(ctx.BASE_RATES)) {
    const stats = ctx.getMarketStats(crop);
    assert.ok(stats.baseRate > stats.minEntry.price, `${crop} base rate must exceed surplus city rate`);
    assert.ok(stats.baseRate < stats.maxEntry.price, `${crop} base rate must sit below destination city rate`);
    assert.equal(stats.gap, stats.maxEntry.price - stats.minEntry.price);
  }
});

test('Earnings calculator computes extra income over local surplus price', () => {
  // Tomato: base 9, Kolar 8 -> 1/kg extra * 1000 = 1000
  assert.equal(ctx.calculateEarningsExtra('Tomato', 1000), 1000);
  // Banana: base 10, Theni 9 -> 1/kg extra * 500 = 500
  assert.equal(ctx.calculateEarningsExtra('Banana', 500), 500);
  // Chilli: base 68, Guntur 62 -> 6/kg extra * 200 = 1200
  assert.equal(ctx.calculateEarningsExtra('Chilli', 200), 1200);
});

test('Seed lots payout, status, and payment references match specification', () => {
  const seedLots = ctx.state.lots;
  assert.equal(seedLots.length, 2);
  // AB-2291: Tomato, 1200 kg, stage 4, Grade A, ₹9 -> ₹10,800 pending
  assert.equal(ctx.getPendingPayout(seedLots), 10800);
  // AB-2270: Potato, 900 kg, stage 6, Grade B, ₹11 -> ₹9,900 received
  assert.equal(ctx.getReceivedPayout(seedLots), 9900);

  assert.deepEqual(JSON.parse(JSON.stringify(ctx.getPaymentStatus(seedLots[0]))), {
    label: 'Due on delivery',
    tone: 'warn'
  });
  assert.deepEqual(JSON.parse(JSON.stringify(ctx.getPaymentStatus(seedLots[1]))), {
    label: 'Paid',
    tone: 'success'
  });

  // Reference only shown when paid (stage 6)
  assert.equal(ctx.getPaymentRef(seedLots[0]), '—');
  assert.match(ctx.getPaymentRef(seedLots[1]), /^UPI-\d{6}$/);
  assert.match(ctx.getPaymentRef({ id: 'AB-2295', stage: 6, pm: 'Bank transfer' }), /^IMPS-\d{6}$/);
  assert.match(ctx.getPaymentRef({ id: 'AB-2296', stage: 6, pm: 'Cash at hub' }), /^CASH-\d{6}$/);
});

test('Quality checklist hint thresholds work accurately', () => {
  assert.equal(ctx.estimateGradeHint(0), 'Tick what applies to estimate your grade.');
  assert.equal(ctx.estimateGradeHint(1), 'Tick what applies to estimate your grade.');
  assert.equal(ctx.estimateGradeHint(2), 'Likely Grade B');
  assert.equal(ctx.estimateGradeHint(3), 'Good chance of Grade A');
  assert.equal(ctx.estimateGradeHint(4), 'Good chance of Grade A');
});

test('Cart totals, delivery fee threshold, and Adjust from payout checks', () => {
  // Empty cart
  assert.deepEqual(JSON.parse(JSON.stringify(ctx.calculateCartTotals({}))), {
    itemCount: 0,
    subtotal: 0,
    delivery: 0,
    total: 0
  });

  // Below ₹2,000 -> ₹80 delivery (Urea 267 * 2 = 534 + 80 = 614)
  const lowCart = ctx.calculateCartTotals({ 0: 2 });
  assert.equal(lowCart.itemCount, 2);
  assert.equal(lowCart.subtotal, 534);
  assert.equal(lowCart.delivery, 80);
  assert.equal(lowCart.total, 614);

  // At or above ₹2,000 -> free delivery (DAP 1350 * 2 = 2700 + 0)
  const highCart = ctx.calculateCartTotals({ 1: 2 });
  assert.equal(highCart.subtotal, 2700);
  assert.equal(highCart.delivery, 0);
  assert.equal(highCart.total, 2700);

  // Adjust from payout validation
  assert.equal(ctx.canAdjustFromPayout(10800, 10800), true);
  assert.equal(ctx.canAdjustFromPayout(10801, 10800), false);
  assert.equal(ctx.canAdjustFromPayout(0, 10800), false);
});

test('Veggie & fruit icons and free-delivery remaining helpers work properly', () => {
  for (const crop of Object.keys(ctx.BASE_RATES)) {
    const iconName = ctx.cropIconName(crop);
    const svg = ctx.iconSvg(iconName);
    assert.match(svg, /^<svg viewBox="0 0 64 64"/);
    assert.ok(svg.includes('<path'), `${crop} SVG should contain line-art path`);
  }
  assert.equal(ctx.getFreeDeliveryRemaining(0), 0);
  assert.equal(ctx.getFreeDeliveryRemaining(267), 1733);
  assert.equal(ctx.getFreeDeliveryRemaining(2000), 0);
  assert.equal(ctx.getFreeDeliveryRemaining(2500), 0);
});
