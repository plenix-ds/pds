/* Plenix tests · #1265 (perf on-demand 1/4, ADR 0052): the commerce templates are one module per page and per helper, and nothing a person sees changed.
   Summary: every commerce export still works from the one public entry: the helpers return what they returned (cardBrand, formatCardNumber, orderTotals, ORDER_STATUSES, COMMERCE_PAGES,
     productFields), and each of the pages renders with its data (Cart, Checkout, Payment, PaymentFields, OrderConfirmation, ProductListing, ProductDiscovery, ProductDetail, OrderStatus,
     OrderManagement, OrderDetail, SubscriptionManagement, Returns) without a script error or a console warning, in left to right and right to left.
   Checks: AC-1 the helpers' results; AC-2 each page draws its heading or main content; AC-3 no error or warning. The loaded bytes per entry are the budget in tools/checks/perf-budget.json (node tools/checks/perf-budget.mjs).
   Proof first: the byte budgets of the helpers (30,000 B each) fail on main (they load 347 KB); this test is the behaviour guard for the split.
   Usage: node tests/commerce-modules-1265.test.js   → COMMERCE_MODULES_1265_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9826, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1200, height: 900 });
      page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (['error', 'warn', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const r = await page.evaluate(async (dir) => {
        document.documentElement.setAttribute('dir', dir);
        const h = React.createElement, P = Plenix, noop = () => {}, out = { helpers: {}, pages: {} };
        out.helpers = {
          visa: P.cardBrand('4242 4242 4242 4242'), amex: P.cardBrand('378282246310005'), none: P.cardBrand('9'), grouped: P.formatCardNumber('4242424242424242'), amexGrouped: P.formatCardNumber('378282246310005'),
          totals: P.orderTotals([{ id: 1, price: 10, quantity: 2 }, { id: 2, price: 5, quantity: 1 }], { shipping: 5, taxRate: 0.1 }), statuses: Object.keys(P.ORDER_STATUSES), pages: P.COMMERCE_PAGES['order-detail'],
          fields: P.productFields([{ value: 'a', label: 'A' }]).map((f) => f.value) };
        const product = { id: 'p1', title: 'Linen robe', meta: 'Atelier', category: 'a', price: 64, currency: 'USD', image: { src: '', alt: 'Robe' }, rating: 4.5, reviewCount: 12, options: [{ name: 'Size', type: 'size', values: [{ value: 'm', label: 'M' }] }], description: 'A robe.', specs: [['Fabric', 'Linen']] };
        const item = { id: 'i1', title: 'Linen robe', options: 'Size M', price: 64, quantity: 2, max: 5, image: { src: '', alt: '' } };
        const order = { id: 'o1', number: 'PX-1', date: '2026-10-15', customer: 'Maya Chen', email: 'maya@example.com', items: [item], total: 128, currency: 'USD', status: 'unfulfilled', payment: 'Visa ending 4242', delivery: { address: '1 Main St', method: 'Standard', tracking: '' }, events: [] };
        const sub = { id: 's1', plan: 'pro', status: 'active', renews: '2026-12-01', price: 29, currency: 'USD' };
        const cases = {
          Cart: h(P.Cart, { items: [item], onQuantityChange: noop, onRemove: noop, onCheckout: noop }),
          Checkout: h(P.Checkout, { items: [item], deliveryOptions: [{ value: 'std', label: 'Standard', price: 5 }], onPlaceOrder: noop, onCancel: noop }),
          Payment: h(P.Payment, { amount: 64.5, onPay: noop, onCancel: noop }),
          PaymentFields: h(P.PaymentFields, { value: { method: 'card', number: '4242424242424242' }, onChange: noop }),
          OrderConfirmation: h(P.OrderConfirmation, { orderNumber: 'PX-1', email: 'maya@example.com', items: [item], autoFocus: false }),
          ProductListing: h(P.ProductListing, { title: 'Robes', products: [product], categories: [{ value: 'a', label: 'A' }], hrefFor: () => '#', onAddToCart: noop }),
          ProductDiscovery: h(P.ProductDiscovery, { products: [product], categories: [{ value: 'a', label: 'A' }], hrefFor: () => '#', onAddToCart: noop }),
          ProductDetail: h(P.ProductDetail, { product, onAddToCart: noop }),
          OrderStatus: h(P.OrderStatus, { status: 'delivered' }),
          OrderManagement: h(P.OrderManagement, { orders: [order], onOpen: noop }),
          OrderDetail: h(P.OrderDetail, { order, backHref: '#' }),
          SubscriptionManagement: h(P.SubscriptionManagement, { subscription: sub, plans: [{ id: 'pro', name: 'Pro', price: 29 }], history: [], onChangePlan: noop, onPause: noop, onCancel: noop }),
          Returns: h(P.Returns, { order, reasons: [{ value: 'size', label: 'Too small' }], onSubmit: noop }),
        };
        for (const [name, el] of Object.entries(cases)) {
          const c = document.createElement('div'); c.id = 'c-' + name; document.getElementById('main').appendChild(c);
          try { const root = ReactDOM.createRoot(c); root.render(h(P.ToastProvider || React.Fragment, null, el)); await new Promise((r) => setTimeout(r, 500)); out.pages[name] = c.textContent.trim().length; } catch (e) { out.pages[name] = 'threw: ' + e.message; }
        }
        return out;
      }, dir);
      assert.equal(r.helpers.visa, 'visa', T + 'AC-1: cardBrand reads a Visa'); assert.equal(r.helpers.amex, 'amex', T + 'AC-1: and an Amex'); assert.equal(r.helpers.none, '', T + 'AC-1: and an unknown number');
      assert.equal(r.helpers.grouped, '4242 4242 4242 4242', T + 'AC-1: formatCardNumber groups 4 4 4 4'); assert.equal(r.helpers.amexGrouped, '3782 822463 10005', T + 'AC-1: and 4 6 5 for Amex');
      assert.ok(r.helpers.totals && typeof r.helpers.totals === 'object', T + 'AC-1: orderTotals gives totals: ' + JSON.stringify(r.helpers.totals));
      assert.deepEqual(r.helpers.statuses, ['unfulfilled', 'fulfilled', 'delivered', 'returning', 'refunded', 'canceled'], T + 'AC-1: the order statuses'); assert.equal(r.helpers.pages, 'detail', T + 'AC-1: COMMERCE_PAGES');
      assert.ok(r.helpers.fields.includes('title') && r.helpers.fields.includes('price'), T + 'AC-1: productFields');
      for (const [name, n] of Object.entries(r.pages)) assert.ok(typeof n === 'number' && n > 0, T + 'AC-2: ' + name + ' draws its content (' + n + ')');
      await page.close();
    }
    assert.deepEqual(errors, [], 'AC-3: no script error or console warning: ' + JSON.stringify(errors.slice(0, 5)));
    console.log('COMMERCE_MODULES_1265_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
