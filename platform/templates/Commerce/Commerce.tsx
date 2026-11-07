/* Plenix · Commerce
   Summary: The commerce templates (12 Specialized › Commerce): ten pages built only from Platform components and
     patterns, each a kind of page of the layout standard (platform/standards/layout.json), which it claims on the AppShell
     around it. Product discovery and product listing (workspace), product detail (detail), the cart (workspace), checkout
     and payment (form; payment is form UI only: nothing is charged, sent or kept by the template), the order confirmation
     (detail), order management (workspace, with the order's own page: detail), subscription management (settings) and
     returns (form). Every amount is written by formatCurrency in the data font, every status is a Badge with its icon,
     every table is the DataGrid, and every change goes to the page through a handler.
   Usage:
     <ProductDiscovery products={products} categories={CATEGORIES} recommended={picks} hrefFor={(p) => '#/p/' + p.id} onAddToCart={add} />
     <ProductListing title="Candles" products={candles} categories={CATEGORIES} hrefFor={…} onAddToCart={add} />
     <ProductDetail product={robe} cartHref="#/cart" onAddToCart={(p, choice, qty) => add(p, choice, qty)} related={more} />
     <Cart items={cart} onQuantityChange={(item, n) => …} onRemove={remove} onRestore={restore} onApplyPromo={check} onCheckout={go} continueHref="#/shop" />
     <Checkout items={cart} deliveryOptions={METHODS} savedMethods={cards} onPlaceOrder={(details) => api.place(details)} onCancel={back} />
     <Payment amount={64.5} savedMethods={cards} onPay={(details) => provider.confirm(details)} onCancel={back} />
     <OrderConfirmation orderNumber="PX-10428" email="maya@example.com" items={cart} steps={NEXT} orderHref="#/orders/PX-10428" continueHref="#/shop" />
     <OrderManagement orders={orders} onOpen={open} onFulfill={fulfill} onCancel={cancel} onRefund={refund} />
     <OrderDetail order={order} backHref="#/orders" onFulfill={fulfill} onRefund={refund} onCancel={cancel} />
     <SubscriptionManagement subscription={sub} plans={PLANS} history={invoices} onChangePlan={change} onPause={pause} onResume={resume} onCancel={end} />
     <Returns order={order} reasons={REASONS} resolutions={WANTS} methods={SENDS} onSubmit={(request) => api.requestReturn(request)} />
   Props:
     The data, shared by every template:
       product: { id, title, meta (the brand or the category, a short line), category, price, compareAtPrice (the price
         before a sale), currency (ISO 4217, default "USD"), image: { src, alt }, images (the product page's pictures),
         rating, reviewCount, outOfStock, stock (how many are left), options (ProductOptions' options; a value may carry
         price, stock, available, images), description, specs: [[label, value, data]] (data: the value is technical, DM
         Mono), delivery (the delivery and returns text), sizeGuide (a Link) }
       item (a line of a cart or an order): { id, title, href, image, options (a line: "Size M · Navy"), price,
         compareAtPrice, quantity, max, warning (a price or stock change since it was added), returnable, reason }
       order: { id, number, date (ISO), customer, email, items, total, currency, status (a key of ORDER_STATUSES), payment
         (a line: "Visa ending 4242"), delivery: { address, method, tracking }, events (Timeline items), totals, shipping, tax }
     COMMERCE_PAGES: each template's kind of page: { "product-discovery": "workspace", "product-listing": "workspace",
       "product-detail": "detail", cart: "workspace", checkout: "form", payment: "form", "order-confirmation": "detail",
       "order-management": "workspace", "order-detail": "detail", "subscription-management": "settings", returns: "form" }
     ProductListing: products, categories ([{ value, label }]: the Category quick filter), title, description,
       headingLevel (default 1), hrefFor(product) (each card's link) or onOpen(product), onAddToCart(product), pageSize
       (default 12: Pagination below), search (the bar's search; default true), query and onQueryChange (the search text
       kept by the page), defaultView ({ layout: "gallery" | "list", size: "s" | "m" | "l" }), strings
     ProductDiscovery: products, categories, recommended (products for the Recommended carousel), suggestions (words to
       try when a search finds nothing; default the categories), title, headingLevel, hrefFor, onOpen, onAddToCart,
       pageSize, strings
     ProductDetail: product, value / defaultValue / onChange(choice, name) (the chosen options), quantity /
       onQuantityChange, onAddToCart(product, choice, quantity), cartHref (View cart, after adding), related (products),
       hrefFor, onOpen, maxQuantity, headingLevel, strings
     Cart: items, currency, onQuantityChange(item, n), onRemove(item), onRestore(item) (Undo), onApplyPromo(code)
       (a promise of { discount, label }; a rejection's message is the field's error), onCheckout(), continueHref,
       shipping, taxRate, discount, title, headingLevel, strings
     Checkout: items, currency, deliveryOptions ([{ value, label, description, price }]), savedMethods ([{ id, label,
       description }]: the person's saved cards, shown by their label only), defaultValue, taxRate, discount,
       onPlaceOrder(details) (a promise; a rejection keeps the review open with the Wizard's error), onCancel,
       signInHref (guest checkout stays the default), strings
     PaymentFields: value ({ method, number, expiry, cvc, name, billingSame, billingStreet, billingCity, billingPostal }),
       onChange(value), savedMethods, amount, currency, billing (default true), disabled, strings
     Payment: amount, currency, savedMethods, defaultValue, onPay(details) (a promise; a rejection's message is the
       decline's text), onCancel, title, strings
     cardBrand(number), formatCardNumber(number): the brand from the first digits; the number in groups as typed
     OrderConfirmation: orderNumber, email, items, currency, totals, delivery ({ address, method }), steps (Timeline items:
       what happens next), orderHref, continueHref, headingLevel, autoFocus (the heading takes the focus when the page
       opens; default true: false only where the template is not the page, as in documentation), strings
     ORDER_STATUSES: { unfulfilled, fulfilled, delivered, returning, refunded, canceled }: each { tone, icon, label }
     OrderStatus: { status, statuses }: an order's status Badge with its icon
     OrderManagement: orders, currency, onOpen(order) (a double-click or Open in the row menu), onFulfill(orders),
       onCancel(orders) (after the confirmation), onRefund(order), statuses, strings
     OrderDetail: order, currency, backHref, onFulfill(order), onRefund(order), onCancel(order) (after the confirmation),
       onReturn(order), statuses, headingLevel, strings
     SubscriptionManagement: subscription ({ plan, status: "active" | "paused" | "canceled", nextBilling, since, endsAt,
       paymentMethod: { label, description } }), plans ([{ id, name, price, period, currency }]), history ([{ id, date,
       description, amount, status: "paid" | "refunded" | "failed", invoice (a link) }]), currency, onChangePlan(plan),
       onPause(), onResume(), onCancel() (each may return a promise), onUpdatePayment(), strings
     Returns: order, reasons, resolutions, methods ([{ value, label, description }] each), currency, status (Timeline
       items: the return's status, shown once it is requested), onSubmit(request) (a promise), onCancel, headingLevel,
       strings
     OrderSummary, CommerceLine, orderTotals, useCommercePage: the shared parts (shared.tsx)
     strings: every template's words, for other languages (each template's STRINGS: titles, labels, messages)
   Behavior:
     Listing and discovery: the command bar holds the search, Filter (by name, category, price, rating, availability,
       sale), the Category quick filter, Sort and View (a grid of cards at three sizes, or a list); the count is at its
       end and is announced when it changes; Pagination below; no result shows an empty state that clears the filters.
       Discovery leads with a search with suggestions, the categories as cards that narrow the products, and a
       carousel of recommendations; a search with no result offers words to try instead.
     Product detail: choosing an option updates the price (announced), the picture and the stock; Add to cart says which
       option is missing in the option's own error, and confirms what was added in place, with View cart.
     Cart: a quantity changes the totals at once (the total is announced); Remove deletes at once with Undo in the toast
       (with a ToastProvider) or in a notice above the lines; tax and shipping say Estimated; an empty cart leads back to
       the shop.
     Checkout: the Wizard's steps check their fields as people leave each step (required fields, the email, the card's
       number, expiry and security code by pattern), keep everything when people go back, and end on a review of the
       answers with Place order; the order summary stays beside the steps (above them on a narrow window).
     Payment: card fields with the payment autocomplete names and numeric keyboards, the number grouped and its brand
       named as people type; Pay shows its spinner and refuses a second press until the page answers; a decline keeps
       every field and says what to try.
     Order confirmation: the heading takes the focus when the page opens; the order number is in the data font with Copy.
     Order management: the DataGrid's selection swaps the bar to Fulfill and Cancel orders; an action the status does
       not allow is disabled with its reason; Cancel asks first; every change is announced.
     Subscription management: changing the plan, pausing and canceling each say their effect and date before they run;
       canceling is as easy as the other actions and says when access ends.
     Returns: items that cannot be returned stay in view with their reason; the review shows the refund and when it
       arrives; once requested the return's status is a Timeline.
     On a narrow window every two-column page stacks: the main column first, the summary after it.
   Notes:
     The templates never process payments: Payment and Checkout collect the fields and hand them to the page, which
     passes them to a payment provider's secure fields or API. Never keep card numbers; never put real card data in
     demos. The page owns the data, the URL (filters, the open product) and every request.
*/
export { COMMERCE_PAGES, useCommercePage, orderTotals, CommerceLine, OrderSummary } from './shared.tsx';
export { ProductListing, ProductDiscovery, ProductDetail, productFields } from './Storefront.tsx';
export { Cart, Checkout, Payment, PaymentFields, OrderConfirmation, cardBrand, formatCardNumber } from './Checkout.tsx';
export { ORDER_STATUSES, OrderStatus, OrderManagement, OrderDetail, SubscriptionManagement, Returns } from './Account.tsx';
