/* Plenix design system · library part w13A (wave 13, lane A): commerce. Product card (07 Data display › Cards and objects:
   ProductCard: grid, list, sale, out of stock), Product options (12 Specialized › Commerce: ProductOptions: size buttons,
   color swatches, quantity) and the Commerce templates (12 Specialized › Commerce, one record at Product discovery with
   the nine other leaves as its variants: product listing, product detail, cart, checkout, payment, order confirmation,
   order management, subscription management, returns), each a kind of page of the layout standard. The demos run on
   sample data only: nothing is charged, sent or kept, and no real card data is used. Every color is an existing role;
   statuses are Badges with their icon; a product's colors are its own data (category colors by name). */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, row = H.row, box = H.box, use = H.use, noop = H.noop, q = H.q;
  var CAR = 'Carbon', ATL = 'Atlassian', MAT = 'Material 3', FLU = 'Fluent 2', POL = 'Polaris', SPE = 'Spectrum', HIG = 'Apple HIG';
  var vp = function (leaf, group, name, lab, text, use1, avoid1) { return { leaf: leaf, group: group, name: name, lab: lab, text: text, use: [use1], avoid: [avoid1] }; };
  var COMMERCE = 'Commerce';
  var ART = function (n) { return '../../dam/assets/thumb-' + n + '.svg'; };
  var say = function (text) { P.announce(text); };

  /* ── the sample shop (sample data: pictures from the asset manager's art) ── */
  var CATEGORIES = [{ value: 'candles', label: 'Candles and incense' }, { value: 'icons', label: 'Icons' }, { value: 'ropes', label: 'Prayer ropes' },
    { value: 'vestments', label: 'Vestments and linens' }, { value: 'books', label: 'Books' }];
  var pic = function (n) { return { src: ART(n), alt: '' }; };
  var PRODUCTS = [
    { id: 'taper', title: 'Beeswax taper, 12 in', meta: 'Monastery candles', category: 'candles', price: 18, rating: 4.6, reviewCount: 38, image: pic(10) },
    { id: 'votive', title: 'Votive candles, box of 24', meta: 'Monastery candles', category: 'candles', price: 22, compareAtPrice: 28, rating: 4.4, reviewCount: 52, image: pic(11) },
    { id: 'mark', title: 'Icon print, Saint Mark', meta: 'Printed on wood', category: 'icons', price: 45, rating: 4.9, reviewCount: 21, image: pic(12), outOfStock: true },
    { id: 'virgin', title: 'Icon print, the Virgin and Child', meta: 'Printed on wood', category: 'icons', price: 52, rating: 4.8, reviewCount: 17, image: pic(13) },
    { id: 'rope100', title: 'Prayer rope, 100 knots', meta: 'Wool, hand tied', category: 'ropes', price: 24, compareAtPrice: 32, rating: 4.7, reviewCount: 64, image: pic(14) },
    { id: 'rope33', title: 'Prayer rope, 33 knots', meta: 'Wool, hand tied', category: 'ropes', price: 14, rating: 4.5, reviewCount: 40, image: pic(15) },
    { id: 'robe', title: 'Choir robe', meta: 'Vestments', category: 'vestments', price: 84, rating: 4.3, reviewCount: 12, image: pic(16) },
    { id: 'cloth', title: 'Linen altar cloth', meta: 'Vestments', category: 'vestments', price: 120, rating: 4.9, reviewCount: 6, image: pic(17) },
    { id: 'psalter', title: 'Psalter, pocket edition', meta: 'Books', category: 'books', price: 19, rating: 4.8, reviewCount: 88, image: pic(18) },
    { id: 'agpeya', title: 'Agpeya, the book of hours', meta: 'Books', category: 'books', price: 26, compareAtPrice: 30, rating: 4.9, reviewCount: 102, image: pic(19) },
    { id: 'incense', title: 'Frankincense, 250 g', meta: 'Monastery incense', category: 'candles', price: 16, rating: 4.6, reviewCount: 33, image: pic(20) },
    { id: 'censer', title: 'Hand censer, brass', meta: 'Church goods', category: 'vestments', price: 68, rating: 4.2, reviewCount: 9, image: pic(21), outOfStock: true },
    { id: 'wick', title: 'Oil lamp wicks, 50', meta: 'Church goods', category: 'candles', price: 9, rating: 4.1, reviewCount: 14, image: pic(22) },
    { id: 'horologion', title: 'Horologion, hardcover', meta: 'Books', category: 'books', price: 38, rating: 4.7, reviewCount: 23, image: pic(23) }
  ];
  var byId = function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; };
  var SIZES = { name: 'size', label: 'Size', kind: 'buttons', values: [{ value: 'S' }, { value: 'M' }, { value: 'L' }, { value: 'XL', available: false, note: 'Back in November' }] };
  var COLORS = { name: 'color', label: 'Color', kind: 'swatches', values: [{ value: 'navy', label: 'Navy', category: 'navy' }, { value: 'maroon', label: 'Maroon', category: 'maroon' },
    { value: 'olive', label: 'Olive', category: 'olive', available: false }, { value: 'beige', label: 'Beige', category: 'beige' }] };
  var ROBE = Object.assign({}, byId('robe'), {
    images: [{ src: ART(16), alt: 'The choir robe from the front' }, { src: ART(24), alt: 'The choir robe from the back' }, { src: ART(25), alt: 'The robe’s collar, close up' }],
    stock: 14, options: [SIZES, COLORS],
    description: 'A full-length choir robe in a heavy cotton twill that keeps its shape through the longest liturgy. A plain yoke, wide sleeves and a hidden button front.',
    specs: [['Material', 'Cotton twill'], ['Weight', '320 g/m²', true], ['Care', 'Machine wash at 40 °C, hang to dry'], ['Made in', 'Egypt'], ['Item number', 'VR-1042', true]],
    delivery: 'Ships in 2 business days. Return it within 30 days of delivery, unworn, for a full refund.',
    sizeGuide: h(P.Link, { href: '#size-guide' }, 'Size guide')
  });
  var CART = [
    { id: 'c1', title: 'Choir robe', href: '#robe', image: pic(16), options: 'Size M · Navy', price: 84, quantity: 1, max: 14 },
    { id: 'c2', title: 'Prayer rope, 100 knots', href: '#rope100', image: pic(14), options: 'Black wool', price: 24, compareAtPrice: 32, quantity: 2, max: 10 },
    { id: 'c3', title: 'Votive candles, box of 24', href: '#votive', image: pic(11), options: 'Unscented', price: 22, quantity: 1, max: 40, warning: 'The price went down from $28.00 to $22.00 since you added it.' }
  ];
  var METHODS = [{ value: 'standard', label: 'Standard', description: '3 to 5 business days', price: 6 }, { value: 'express', label: 'Express', description: '1 to 2 business days', price: 14 },
    { value: 'pickup', label: 'Pick up at the parish shop', description: 'Ready the next day', price: 0 }];
  var SAVED = [{ id: 'visa', label: 'Visa ending 4242', description: 'Expires 08/28' }];
  // a pretend payment: it answers after a moment; a name with "decline" is declined (nothing is sent or kept)
  var pretend = function (fail) { return new Promise(function (resolve, reject) { setTimeout(function () { if (fail) reject(new Error('Your card was declined. Check the details or use another card.')); else resolve(); }, 900); }); };
  var NEXT = [
    { id: 1, time: 'Oct 15, 2026', dateTime: '2026-10-15', title: 'Order placed', icon: 'circle-check', description: 'We are packing it now.' },
    { id: 2, time: 'Oct 16, 2026', dateTime: '2026-10-16', title: 'Ships', icon: 'forward', description: 'We email the tracking number.' },
    { id: 3, time: 'Oct 19, 2026', dateTime: '2026-10-19', title: 'Arrives', icon: 'home', description: 'Standard delivery, 3 to 5 business days.' }
  ];
  var line = function (id, qty, opts) { var p = byId(id); return { id: 'l-' + id, title: p.title, image: p.image, options: opts, price: p.price, quantity: qty }; };
  var ORDERS = [
    { id: 'o1', number: 'PX-10428', date: '2026-10-15', customer: 'Maya Chen', email: 'maya@example.com', status: 'unfulfilled', items: [line('robe', 1, 'Size M · Navy'), line('rope100', 2, 'Black wool')], total: 147.22, payment: 'Visa ending 4242' },
    { id: 'o2', number: 'PX-10427', date: '2026-10-14', customer: 'Alex Kim', status: 'unfulfilled', items: [line('psalter', 3)], total: 62.13, payment: 'Mastercard ending 0005' },
    { id: 'o3', number: 'PX-10426', date: '2026-10-13', customer: 'Priya Nair', status: 'fulfilled', items: [line('virgin', 1), line('taper', 4)], total: 136.08, payment: 'Visa ending 1881' },
    { id: 'o4', number: 'PX-10425', date: '2026-10-11', customer: 'Mina Gerges', status: 'delivered', items: [line('cloth', 1)], total: 134.70, payment: 'Visa ending 4242' },
    { id: 'o5', number: 'PX-10424', date: '2026-10-10', customer: 'Sara Boulos', status: 'returning', items: [line('robe', 2, 'Size L · Maroon')], total: 186.18, payment: 'American Express ending 0005' },
    { id: 'o6', number: 'PX-10423', date: '2026-10-08', customer: 'John Tawfik', status: 'refunded', items: [line('incense', 2)], total: 40.32, payment: 'Visa ending 3220' },
    { id: 'o7', number: 'PX-10422', date: '2026-10-06', customer: 'Mary Hanna', status: 'canceled', items: [line('agpeya', 1)], total: 33.89, payment: 'Discover ending 1117' },
    { id: 'o8', number: 'PX-10421', date: '2026-10-02', customer: 'Jordan Avery', status: 'delivered', items: [line('horologion', 1), line('wick', 2)], total: 66.95, payment: 'Visa ending 4242' }
  ];
  var ORDER = Object.assign({}, ORDERS[0], { shipping: 6, tax: 9.22,
    delivery: { address: 'Maya Chen, 400 Grand Avenue, Oakland, CA 94610', method: 'Standard, 3 to 5 business days' },
    events: [{ id: 1, time: 'Oct 15, 2026, 9:12 AM', dateTime: '2026-10-15T09:12', title: 'Order placed', description: 'Maya Chen paid with Visa ending 4242.', icon: 'circle-check' },
      { id: 2, time: 'Oct 15, 2026, 9:13 AM', dateTime: '2026-10-15T09:13', title: 'Confirmation sent', description: 'To maya@example.com.', icon: 'mail' }] });
  var PLANS = [{ id: 'monthly', name: 'Candle box, monthly', price: 24, period: 'month' }, { id: 'large', name: 'Large candle box, monthly', price: 36, period: 'month' },
    { id: 'yearly', name: 'Candle box, yearly', price: 260, period: 'year' }];
  var INVOICES = [
    { id: 'i5', date: '2026-10-01', description: 'Candle box, monthly', amount: 24, status: 'paid', invoice: '#invoice-2026-10' },
    { id: 'i4', date: '2026-09-01', description: 'Candle box, monthly', amount: 24, status: 'paid', invoice: '#invoice-2026-09' },
    { id: 'i3', date: '2026-08-01', description: 'Candle box, monthly', amount: 24, status: 'refunded', invoice: '#invoice-2026-08' },
    { id: 'i2', date: '2026-07-01', description: 'Candle box, monthly', amount: 24, status: 'failed' },
    { id: 'i1', date: '2026-06-01', description: 'Candle box, monthly', amount: 24, status: 'paid', invoice: '#invoice-2026-06' }
  ];
  var RETURN_ORDER = { number: 'PX-10418', items: [
    { id: 'r1', title: 'Choir robe', options: 'Size L · Navy', price: 84, quantity: 1 },
    { id: 'r2', title: 'Prayer rope, 33 knots', options: 'Black wool', price: 14, quantity: 3 },
    { id: 'r3', title: 'Icon print, Saint Mark', options: 'Printed to order', price: 45, quantity: 1, returnable: false, reason: 'Printed to order: it cannot be returned' }] };
  var REASONS = [{ value: 'size', label: 'It does not fit' }, { value: 'damaged', label: 'It arrived damaged' }, { value: 'different', label: 'It is not as described' }, { value: 'mind', label: 'I changed my mind' }];
  var WANTS = [{ value: 'refund', label: 'A refund to the original payment method' }, { value: 'exchange', label: 'An exchange for another size or color' }];
  var SENDS = [{ value: 'dropoff', label: 'Drop it off at a carrier', description: 'Free, with the label we email you' }, { value: 'pickup', label: 'Schedule a pickup', description: 'Free, from your door' }];
  var RETURN_STATUS = [
    { id: 1, time: 'Oct 15, 2026', dateTime: '2026-10-15', title: 'Return requested', icon: 'circle-check', badge: h(P.Badge, { tone: 'success', icon: 'circle-check' }, 'Done') },
    { id: 2, time: 'Oct 15, 2026', dateTime: '2026-10-15', title: 'Label emailed', icon: 'mail', badge: h(P.Badge, { tone: 'success', icon: 'circle-check' }, 'Done') },
    { id: 3, title: 'Items received', icon: 'schedule', badge: h(P.Badge, { tone: 'waiting', icon: 'schedule' }, 'Waiting') },
    { id: 4, title: 'Refund issued', icon: 'field-currency' }
  ];

  /* ── live examples (each a small component: the spec renders an example as one) ── */
  var Product = function (p) {
    var x = byId(p.id || 'taper');
    return box(p.width || 240, h(P.ProductCard, Object.assign({ title: x.title, href: '#' + x.id, image: x.image, price: x.price, compareAtPrice: x.compareAtPrice, outOfStock: x.outOfStock,
      meta: x.meta, rating: x.rating, reviewCount: x.reviewCount, onAddToCart: function () { say(x.title + ' added to your cart'); } }, p.more || {})));
  };
  var Options = function (p) {
    var v = use(p.value || { size: 'M', color: 'navy' }), qty = use(1);
    return box(p.width || 400, h(P.ProductOptions, Object.assign({ product: 'Choir robe', options: p.options || [SIZES, COLORS], value: v[0], onChange: v[1],
      quantity: p.quantity ? qty[0] : undefined, onQuantityChange: p.quantity ? qty[1] : undefined, max: 14 }, p.more || {})));
  };
  var Frame = function (child) { return box(null, h('div', { className: 'ds-w13a-page' }, child)); };
  var Discovery = function () { return Frame(h(P.ProductDiscovery, { products: PRODUCTS, categories: CATEGORIES, recommended: [byId('agpeya'), byId('rope100'), byId('virgin'), byId('taper'), byId('cloth')], hrefFor: function (x) { return '#' + x.id; }, onAddToCart: function (x) { say(x.title + ' added to your cart'); }, pageSize: 8 })); };
  var Listing = function (p) { return Frame(h(P.ProductListing, Object.assign({ title: 'Candles and incense', description: 'Beeswax, oil and incense from monasteries we know.', products: PRODUCTS.filter(function (x) { return p.all || x.category === 'candles' || x.category === 'books'; }), categories: CATEGORIES, hrefFor: function (x) { return '#' + x.id; }, onAddToCart: function (x) { say(x.title + ' added to your cart'); }, pageSize: 8 }, p.more || {}))); };
  var Detail = function () { return Frame(h(P.ProductDetail, { product: ROBE, cartHref: '#cart', related: [byId('stole') || byId('cloth'), byId('censer'), byId('rope33'), byId('psalter')], hrefFor: function (x) { return '#' + x.id; }, onAddToCart: noop })); };
  var CartDemo = function (p) {
    var items = use(p.empty ? [] : CART);
    var set = function (fn) { items[1](fn(items[0])); };
    return Frame(h(P.ToastProvider, null, h(P.Cart, { items: items[0], continueHref: '#shop', taxRate: 0.0725, shipping: 6,
      onQuantityChange: function (x, n) { set(function (l) { return l.map(function (y) { return y.id === x.id ? Object.assign({}, y, { quantity: n }) : y; }); }); },
      onRemove: function (x) { set(function (l) { return l.filter(function (y) { return y.id !== x.id; }); }); },
      onRestore: function (x) { set(function (l) { return CART.filter(function (y) { return y.id === x.id || l.some(function (z) { return z.id === y.id; }); }).map(function (y) { return l.filter(function (z) { return z.id === y.id; })[0] || x; }); }); },
      onApplyPromo: function (code) { return /^easter/i.test(code) ? Promise.resolve({ discount: 10, label: code.toUpperCase() }) : Promise.reject(new Error('This code has ended or does not exist.')); },
      onCheckout: function () { say('Checkout opens'); } })));
  };
  var CheckoutDemo = function () { return Frame(h(P.Checkout, { items: CART, deliveryOptions: METHODS, savedMethods: SAVED, taxRate: 0.0725, signInHref: '#sign-in', onPlaceOrder: function () { return pretend(false); }, onCancel: function () { say('Back to the cart'); } })); };
  var PaymentDemo = function (p) { return Frame(box(560, h(P.Payment, { amount: 147.22, savedMethods: p.saved ? SAVED : undefined, onPay: function (d) { return pretend(/decline/i.test(d.name || '')); }, onCancel: function () { say('Payment canceled'); } }))); };
  var ConfirmationDemo = function () { return Frame(h(P.OrderConfirmation, { orderNumber: 'PX-10428', email: 'maya@example.com', items: CART.map(function (x) { return Object.assign({}, x, { warning: undefined }); }), totals: P.orderTotals(CART, { shipping: 6, taxRate: 0.0725 }), steps: NEXT, delivery: { address: '400 Grand Avenue, Oakland, CA 94610', method: 'Standard, 3 to 5 business days' }, orderHref: '#order', continueHref: '#shop', autoFocus: false })); };
  var OrdersDemo = function () {
    var list = use(ORDERS), open = use(null);
    var set = function (ids, status) { list[1](list[0].map(function (o) { return ids.indexOf(o.id) >= 0 ? Object.assign({}, o, { status: status }) : o; })); };
    if (open[0]) {
      var o = list[0].filter(function (x) { return x.id === open[0]; })[0];
      return Frame(h(P.Stack, { gap: 'md' }, h(P.Button, { icon: 'arrow-left', onClick: function () { open[1](null); } }, 'Back to the orders'),
        h(P.OrderDetail, { order: o.id === 'o1' ? Object.assign({}, ORDER, { status: o.status }) : o, onFulfill: function () { set([o.id], 'fulfilled'); }, onRefund: function () { set([o.id], 'refunded'); }, onCancel: function () { set([o.id], 'canceled'); } })));
    }
    return Frame(h(P.OrderManagement, { orders: list[0], onOpen: function (o) { open[1](o.id); },
      onFulfill: function (l) { set(l.map(function (x) { return x.id; }), 'fulfilled'); }, onCancel: function (l) { set(l.map(function (x) { return x.id; }), 'canceled'); },
      onRefund: function (o) { set([o.id], 'refunded'); } }));
  };
  var OrderDetailDemo = function () { var s = use(ORDER.status); return Frame(h(P.OrderDetail, { order: Object.assign({}, ORDER, { status: s[0] }), backHref: '#orders', onFulfill: function () { s[1]('fulfilled'); }, onRefund: function () { s[1]('refunded'); }, onCancel: function () { s[1]('canceled'); } })); };
  var SubscriptionDemo = function () {
    var sub = use({ plan: 'monthly', status: 'active', nextBilling: '2026-11-01', since: '2025-06-01', paymentMethod: { label: 'Visa ending 4242', description: 'Expires 08/28' } });
    var patch = function (o) { sub[1](Object.assign({}, sub[0], o)); return Promise.resolve(); };
    return Frame(box(720, h(P.SubscriptionManagement, { subscription: sub[0], plans: PLANS, history: INVOICES,
      onChangePlan: function (p) { return patch({ plan: p.id }); }, onPause: function () { return patch({ status: 'paused' }); }, onResume: function () { patch({ status: 'active' }); },
      onCancel: function () { return patch({ status: 'canceled', endsAt: '2026-11-01' }); }, onUpdatePayment: function () { say('The payment method form opens'); } })));
  };
  var ReturnsDemo = function () { return Frame(h(P.Returns, { order: RETURN_ORDER, reasons: REASONS, resolutions: WANTS, methods: SENDS, onSubmit: function () { return pretend(false); }, onCancel: function () { say('Return canceled'); } })); };
  var ReturnStatusDemo = function () { return Frame(box(560, h(P.Returns, { order: RETURN_ORDER, status: RETURN_STATUS }))); };

  var KINDS = [
    ['product-discovery', 'Product discovery', 'workspace', Discovery, '<ProductDiscovery products categories recommended />'],
    ['product-listing', 'Product listing', 'workspace', Listing, '<ProductListing title products categories />'],
    ['product-detail', 'Product detail', 'detail', Detail, '<ProductDetail product related />'],
    ['cart', 'Cart', 'workspace', CartDemo, '<Cart items onQuantityChange onRemove onRestore />'],
    ['checkout', 'Checkout', 'form', CheckoutDemo, '<Checkout items deliveryOptions onPlaceOrder />'],
    ['payment', 'Payment', 'form', PaymentDemo, '<Payment amount onPay />'],
    ['order-confirmation', 'Order confirmation', 'detail', ConfirmationDemo, '<OrderConfirmation orderNumber steps />'],
    ['order-management', 'Order management', 'workspace', OrdersDemo, '<OrderManagement orders onFulfill onCancel />'],
    ['subscription-management', 'Subscription management', 'settings', SubscriptionDemo, '<SubscriptionManagement subscription plans history />'],
    ['returns', 'Returns', 'form', ReturnsDemo, '<Returns order reasons resolutions methods />']
  ];
  var PAGE_TEXT = {
    'product-discovery': 'The catalog’s entry: a search with suggestions, the categories as cards that narrow the products, a carousel of recommendations, then the listing; a search with no result offers words to try.',
    'product-listing': 'A category’s products as ProductCards: the command bar’s search, Filter, the Category quick filter, Sort and View (grid at three sizes, or a list), the count at its end, Pagination below.',
    'product-detail': 'One product: its pictures in a carousel, the name, rating, price and stock Badge, ProductOptions with the quantity, Add to cart with its confirmation in place, the description, details and delivery in tabs, related products.',
    cart: 'The lines with their pictures, options, unit prices, quantity steppers and line totals; Remove with Undo; the summary at the end with the promo code, estimated tax and shipping, the total and Check out.',
    checkout: 'The Wizard’s steps (contact, delivery, payment, then the review with Place order) beside the order summary; guest checkout by default, every field with its autocomplete name.',
    payment: 'The saved card or a new card’s fields (number, expiry, security code, name), the billing address, the security note and the amount; Pay shows its spinner and takes one press. Form UI only: nothing is charged.',
    'order-confirmation': 'The success heading that takes the focus, the order number with Copy, what happens next as a Timeline, the delivery, the lines and the summary, then View your order and Continue shopping.',
    'order-management': 'Every order in the DataGrid (number, date, customer, items, total, status Badge) with the command bar’s search, Filter and Status; selecting swaps the bar to Fulfill and Cancel orders; the order’s own page (OrderDetail) holds its header, lines, delivery, history and actions.',
    'subscription-management': 'Settings cards: the plan, changing it (each plan’s price and difference), the payment method, pause or cancel (each says its effect and date first), and the billing history in the DataGrid.',
    returns: 'The Wizard: the items (those that cannot be returned stay in view with why), the reason, the resolution and how to send them, then the review with the refund and when it arrives; once requested, the return’s status as a Timeline.'
  };

  return [
    /* ── 07 Data display › Cards and objects › Product card: ProductCard ── */
    { id: 'product-card', lab: true, icon: 'tags', sec: 'data-display', sub: 'Cards and objects', leaf: 'Product card', title: 'Product card',
      plenix: 'ProductCard, ProductPrice', src: 'patterns/ProductCard/ProductCard.tsx', level: 'Pattern', interaction: 'Navigation',
      variantClasses: ['plx-product-card--grid', 'plx-product-card--list', 'plx-product-card--sale', 'plx-product-card--out-of-stock'],
      aliases: ['Product tile', 'Catalog card', 'Shop card', 'Item card'],
      text: 'One product in a catalog: its picture at a fixed ratio, its name as the card’s one link, a line of facts, its price in the data font, the rating and one action. The picture sits on top in a grid (grid) and at the row’s start in a list (list). On sale, the old price is struck through after the price and a Sale Badge shows (sale). A product that cannot be bought shows an Out of stock Badge and its action turned off, never hidden (out of stock).',
      use: ['Catalogs, category pages, search results and related products', 'grid for browsing by picture; list for search results people compare by name and price', 'compareAtPrice for a sale: the old price stays in view, struck through', 'outOfStock to keep the product findable while it cannot be bought'],
      avoid: ['Comparing many attributes: a table or a comparison view', 'Mixing product cards with other cards in one grid', 'A price change told by color alone: the old price is struck through and named “was”', 'More than one primary action per card'],
      related: ['media-card', 'card', 'product-options', 'commerce', 'content-grid', 'image'],
      states: [['Default', 'The card at rest', 'The default'], ['Hover', 'The card raises (the card’s hover shadow)', ':hover'], ['Focus', 'The ring around the whole card while its name has focus', ':focus-visible'],
        ['Action off', 'Out of stock: the action is disabled, its name says why', 'outOfStock']],
      map: [[MAT, 'Cards', 'Partial'], [CAR, 'Tile', 'Partial'], [POL, 'Media card', 'Partial'], [FLU, 'Card', 'Partial'], [SPE, 'Card', 'Partial']],
      variantPages: [
        vp('Product card grid', 'Variant', 'Grid (default)', { variant: 'grid' }, 'The picture on top at 1:1, then the Badges, the facts, the name (two lines at most), the price in the data font, the rating and Add to cart.', 'A grid of products people browse by picture (ContentGrid)', 'Search results people compare by name and price: the list'),
        vp('Product card list', 'Variant', 'List', { variant: 'list' }, 'The picture in a 120px column at the row’s start, the body beside it; the action after the price.', 'Search results and short lists people scan by name and price', 'Browsing by picture: the grid'),
        vp('Product card sale', 'Variant', 'Sale', { variant: 'sale' }, 'The Sale Badge with its icon; the price people pay, then the old price struck through in the muted color, read as “Now …, was …”.', 'A product whose price is lower than before', 'A permanent price: no compareAtPrice'),
        vp('Product card out of stock', 'Variant', 'Out of stock', { variant: 'out-of-stock' }, 'The Out of stock Badge with its icon; the action stays in view, disabled, named “… is out of stock”; the name still opens the product.', 'A product people may still want to see or follow', 'Products that are gone for good: take them out of the catalog')
      ],
      examples: [
        ['Variant', [
          ['Grid (default)', function () { return h(Product, { id: 'taper' }); }, 'plx-product-card--grid', 'layout=' + q('grid')],
          ['List', function () { return h(Product, { id: 'psalter', width: 560, more: { layout: 'list' } }); }, 'plx-product-card--list', 'layout=' + q('list')],
          ['Sale', function () { return h(Product, { id: 'rope100' }); }, 'plx-product-card--sale', 'compareAtPrice={32}'],
          ['Out of stock', function () { return h(Product, { id: 'mark' }); }, 'plx-product-card--out-of-stock', 'outOfStock']], { prop: 'variant' }],
        ['A catalog: a ContentGrid of product cards', function () {
          return box(900, h(P.ContentGrid, { size: 'md', label: 'Books' }, ['psalter', 'agpeya', 'horologion', 'virgin'].map(function (id) { var x = byId(id); return h(P.ProductCard, { key: id, title: x.title, href: '#' + id, image: x.image, price: x.price, compareAtPrice: x.compareAtPrice, meta: x.meta, rating: x.rating, reviewCount: x.reviewCount, onAddToCart: noop }); })));
        }],
        ['Without a picture, another action and another currency', function () {
          return row(box(240, h(P.ProductCard, { title: 'Gift card', onOpen: noop, price: 50, meta: 'Any amount from $10', action: h(P.Button, { size: 'xs' }, 'Choose an amount') })),
            box(240, h(P.ProductCard, { title: 'Hand censer, brass', href: '#censer', image: pic(21), price: 62, currency: 'EUR', outOfStock: true, action: h(P.Button, { size: 'xs', icon: 'hdr-bell' }, 'Notify me') })));
        }]] },

    /* ── 12 Specialized › Commerce › Product options: ProductOptions ── */
    { id: 'product-options', lab: true, icon: 'settings-customize', sec: 'specialized', sub: COMMERCE, leaf: 'Product options', title: 'Product options',
      plenix: 'ProductOptions', src: 'components/ProductOptions/ProductOptions.tsx', level: 'Component', interaction: 'Selection', variantClasses: [],
      aliases: ['Variant picker', 'Product variants', 'Size and color', 'Swatches', 'Quantity selector'],
      text: 'The controls that choose one variant of a product: sizes as small radio tiles (size buttons), colors as swatch buttons named in words (color swatches) and how many to buy with the quantity stepper (quantity). Each option says its chosen value beside its name; a choice that is out of stock stays in view, marked and explained, and cannot be chosen.',
      use: ['Product pages and quick-add surfaces', 'Any variant that changes the price, the picture, the stock or the fit', 'A note under a size (“Only 2 left”, “Back in November”)', 'The size guide as a link after the sizes'],
      avoid: ['A dropdown for fewer than about six choices', 'Hiding a choice that is out of stock: keep it in view and say why', 'Colors told by the swatch alone: every swatch is named in words', 'New palette colors for a product: a product’s colors are its own data'],
      related: ['radio-tiles', 'color-swatch', 'number-input', 'product-card', 'commerce'],
      states: [['Default', 'Each option with its chosen value beside its name', 'The default'], ['Chosen', 'The size tile selected; the swatch ringed (aria-pressed)', ':checked, [aria-pressed]'],
        ['Out of stock', 'A disabled size tile with its note; a dimmed swatch announced “…, out of stock”', '.is-unavailable, :disabled'], ['Error', 'The option’s error under it, with its icon', '.is-invalid'], ['Disabled', 'Every control off', '.is-disabled']],
      map: [[MAT, 'Chips (filter)', 'Partial'], [CAR, 'Radio button', 'Partial'], [POL, 'Choice list', 'Partial'], [HIG, 'Steppers', 'Partial']],
      variantPages: [
        vp('Product size buttons', 'Kind', 'Size buttons', { variant: 'buttons' }, 'RadioTiles at the product’s tile width (at least 64px), in one radio group; an out of stock size is disabled, with its note under it.', 'Sizes and other short choices people compare side by side', 'Long lists of choices: a select'),
        vp('Product color swatches', 'Kind', 'Color swatches', { variant: 'swatches' }, 'ColorSwatch buttons in a row, each named by its color. The chosen one has a ring and its name beside the option’s label; an out of stock one is dimmed and announced.', 'A product’s colors', 'Colors without names: every swatch has its word'),
        vp('Product quantity', 'Kind', 'Quantity', { variant: 'quantity' }, 'NumberInput’s quantity stepper in a Field: minus, the count in the data font, plus. It is named with the product and stays between min and max.', 'How many to buy, beside Add to cart', 'Large numbers people type: a number field')
      ],
      examples: [
        ['Kind', [
          ['Size buttons', function () { return h(Options, { options: [SIZES], more: { sizeGuide: h(P.Link, { href: '#size-guide' }, 'Size guide') } }); }, null, 'kind: ' + q('buttons')],
          ['Color swatches', function () { return h(Options, { options: [COLORS] }); }, null, 'kind: ' + q('swatches')],
          ['Quantity', function () { return h(Options, { options: [], quantity: true }); }, null, 'onQuantityChange']], { prop: 'kind' }],
        ['All three, nothing chosen yet, with the errors Add to cart shows', function () { return h(Options, { value: {}, quantity: true, more: { errors: { size: 'Choose a size.', color: 'Choose a color.' } } }); }],
        ['Swatches with their names as text', function () { return h(Options, { options: [COLORS], more: { swatchLabels: true } }); }]] },

    /* ── 12 Specialized › Commerce › Product discovery (and the nine other Commerce leaves): the Commerce templates ── */
    { id: 'commerce', lab: true, icon: 'field-currency', sec: 'specialized', sub: COMMERCE, leaf: 'Product discovery', title: 'Commerce templates',
      plenix: 'ProductDiscovery, ProductListing, ProductDetail, Cart, Checkout, Payment, PaymentFields, OrderConfirmation, OrderManagement, OrderDetail, SubscriptionManagement, Returns, OrderSummary, CommerceLine',
      src: 'templates/Commerce/Commerce.jsx', css: ['templates/Commerce/commerce.css'], blocks: ['plx-commerce', 'plx-commerce-line', 'plx-commerce-summary'], level: 'Template', interaction: 'Navigation', variantClasses: [],
      aliases: ['Storefront', 'Shop', 'E-commerce', 'Checkout flow', 'Order management', 'Billing'],
      covers: ['Product listing', 'Product detail', 'Cart', 'Checkout', 'Payment', 'Order confirmation', 'Order management', 'Subscription management', 'Returns'],
      text: 'Ten shop pages, built only from Platform components and patterns. Each claims its page kind from the layout standard on the AppShell around it: product discovery and product listing (workspace), product detail (detail), the cart (workspace), checkout and payment (form), the order confirmation (detail), order management (workspace; an order’s own page: detail), subscription management (settings) and returns (form). Payment is form UI only: the templates never charge, send or keep anything; the page hands the fields to its payment provider.',
      use: ['A shop, a parish bookstore, a donation store or a billing area built on the Platform', 'Each template as the page it names, with the page’s data and handlers', 'The shared parts (OrderSummary, CommerceLine, orderTotals) for pages of your own', 'A payment provider’s secure fields in place of the card fields when it supplies them'],
      avoid: ['Processing or storing card numbers in the page', 'Hiding fees until the last step: the cart says Estimated', 'Making canceling a subscription harder than starting it', 'Leaving the checkout through navigation: it keeps to its steps'],
      related: ['product-card', 'product-options', 'command-bar', 'filter-panel', 'wizard', 'number-input', 'data-grid', 'delete-flow'],
      states: [['Default', 'The page with its data', 'The default'], ['Empty', 'An empty cart, a search with no result: the empty state that leads on', 'items=[]'],
        ['Busy', 'Pay or Place order shows its spinner and takes one press', 'aria-busy'], ['Error', 'A decline or a missing option says what to do, keeping every field', 'Notice, Field error']],
      wire: { areas: ['a a', 'b c', 'd c'], cols: '3fr 1fr', rows: [36, 160, 40], regions: [['A', 'Page head', 'Text, SearchField', 'The title and the count, or the search'], ['B', 'Main column', 'ProductCard, CommerceLine, Wizard, DataGrid', 'The page’s work: products, lines, steps or orders'], ['C', 'Summary column', 'OrderSummary', 'The totals and the next step; after the main column on a narrow page'], ['D', 'Links and actions', 'Link, Button', 'Continue shopping, View your order']] },
      map: [[POL, 'Resource index and details layouts', 'Partial'], [MAT, 'Search, cards and carousel', 'Partial'], [CAR, 'Data table (orders)', 'Partial'], [HIG, 'Apple Pay and In-App Purchase', 'Partial']],
      variantPages: KINDS.map(function (k) {
        var leaf = k[1];
        return { leaf: leaf, group: 'Template', name: k[1], lab: { variant: k[0] }, text: 'Page kind: ' + k[2] + '. ' + PAGE_TEXT[k[0]],
          use: [{ 'product-discovery': 'The shop’s front page and the search’s home', 'product-listing': 'A category, a collection or a search’s results', 'product-detail': 'Every product people can buy', cart: 'The step between shopping and checkout', checkout: 'Turning a cart into an order', payment: 'Paying for an order or updating a payment method', 'order-confirmation': 'Right after an order is placed', 'order-management': 'Staff or customers finding and acting on orders', 'subscription-management': 'Account and billing settings for a recurring plan', returns: 'Customers sending items back from their order' }[k[0]]],
          avoid: [{ 'product-discovery': 'A single category: the product listing', 'product-listing': 'One product: the product detail', 'product-detail': 'A product in a dialog on a small screen: a full page', cart: 'A wishlist: saved items', checkout: 'Requiring an account to buy', payment: 'Processing or keeping card data in the page', 'order-confirmation': 'Showing it before the payment is confirmed', 'order-management': 'Orders and returns in one list without a filter', 'subscription-management': 'Hiding Cancel behind a support contact', returns: 'Asking for more detail than the return needs' }[k[0]]] };
      }),
      examples: [
        ['Template', KINDS.map(function (k) { return [k[1], function () { return h(k[3], {}); }, null, k[4]]; }), { prop: 'template' }],
        ['An order’s own page (OrderDetail, page kind detail)', function () { return h(OrderDetailDemo, {}); }],
        ['A return once requested: its status', function () { return h(ReturnStatusDemo, {}); }],
        ['Payment with a saved card (type “decline” in the name on a new card to see a decline)', function () { return h(PaymentDemo, { saved: true }); }],
        ['An empty cart', function () { return h(CartDemo, { empty: true }); }]] }
  ];
});
