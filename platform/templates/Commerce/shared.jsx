/* Plenix · Commerce templates: shared parts
   Summary: What the Commerce templates share (platform/templates/Commerce): the kind of page each template is
     (COMMERCE_PAGES, from the layout standard's kinds), the hook a template claims its kind with on an AppShell page
     (useCommercePage), the order's totals (orderTotals), a line of an order (CommerceLine: its picture, name, options,
     price, quantity and line total) and the order summary (OrderSummary: the lines in short and the totals in a Panel).
   Usage:
     useCommercePage('checkout');                  // the shell lays the page out as a "form" page
     const totals = orderTotals(items, { shipping: 6, taxRate: 0.0725, discount: 5 });
     <OrderSummary items={items} currency="USD" totals={totals} estimated>{<Button variant="primary">Check out</Button>}</OrderSummary>
     <ul className="plx-commerce-lines"><CommerceLine item={item} currency="USD" onQuantityChange={(n) => …} remove={…} /></ul>
   Props:
     COMMERCE_PAGES: { <template>: <page kind> } (workspace, detail, form, settings: platform/standards/layout.json)
     useCommercePage(template): claims the template's page kind on the AppShell around it (nothing outside a shell)
     orderTotals(items, { shipping, taxRate, tax, discount }): { subtotal, discount, shipping, tax, total, count }
     CommerceLine.item: { id, title, href, image: { src, alt }, options (a line: "Size M · Navy"), price, compareAtPrice,
       quantity, max, warning }
     CommerceLine.currency: the ISO 4217 code (default "USD")
     CommerceLine.onQuantityChange(n): the quantity is NumberInput's stepper (else the count, in the data font)
     CommerceLine: the unit price is ProductPrice at its small size; the line total is in the data font at the line's size
     CommerceLine.remove: the element that removes the line (a DeleteFlow's trigger), at the line's end
     CommerceLine.strings: { quantity: "Quantity, {title}", qty: "Qty {n}", each: "{price} each" }
     OrderSummary.items: the lines, drawn in short (title × quantity, the line total) when showItems
     OrderSummary.totals: orderTotals' result (default: computed from items)
     OrderSummary.estimated: tax and shipping are not final: their names say Estimated (default false)
     OrderSummary.showItems: the lines in short above the totals (default false)
     OrderSummary.title: the Panel's title (default strings.title)
     OrderSummary.children: the summary's actions, under the totals (Check out, Place order)
     OrderSummary.strings: { title: "Order summary", subtotal: "Subtotal", discount: "Discount", shipping: "Shipping",
       shippingEstimated: "Estimated shipping", tax: "Tax", taxEstimated: "Estimated tax", total: "Total", free: "Free",
       items: "{n} items", item: "1 item", times: "× {n}" }
   Behavior:
     Every amount is written by formatCurrency in the data font; the total is the summary's last row, in the strong weight.
     A line's quantity stepper is named with the product ("Quantity, Beeswax taper") and keeps the line's max.
   Notes:
     The templates never charge, store or send anything: every change goes to the page through its handlers.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { formatCurrency, formatNumber } from '../../utils/format.ts';
import { useAppLayout } from '../../patterns/AppShell/AppShell.jsx';
import { Panel } from '../../components/Card/Card.jsx';
import { Image } from '../../components/Image/Image.jsx';
import { Link } from '../../components/Link/Link.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Icon } from '../../components/Icon/Icon.tsx';
import { NumberInput } from '../../components/NumberInput/NumberInput.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { ProductPrice } from '../../patterns/ProductCard/ProductCard.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ImageBIcon from 'plenix-platform/icons/plenix/image-b';
import { dataPhrase } from '../../utils/dataText.tsx';
import { fill } from '../../utils/fill.ts';

export const COMMERCE_PAGES = {
  'product-discovery': 'workspace', 'product-listing': 'workspace', 'product-detail': 'detail', cart: 'workspace', checkout: 'form',
  payment: 'form', 'order-confirmation': 'detail', 'order-management': 'workspace', 'order-detail': 'detail', 'subscription-management': 'settings', returns: 'form',
};

// a template claims its kind of page on the AppShell around it (the layout standard lays it out)
export function useCommercePage(template) {
  const shell = useAppLayout();
  const claim = shell && shell.claimPage;
  const kind = COMMERCE_PAGES[template];
  React.useEffect(() => (claim && kind ? claim(kind) : undefined), [claim, kind]);
}

export const money = (n, currency) => formatCurrency(n, currency || 'USD');
const round = (n) => Math.round(n * 100) / 100;

export function orderTotals(items = [], o = {}) {
  const subtotal = round(items.reduce((s, x) => s + (x.price || 0) * (x.quantity || 0), 0));
  const count = items.reduce((s, x) => s + (x.quantity || 0), 0);
  const discount = round(Math.min(subtotal, o.discount || 0));
  const shipping = round(o.shipping || 0);
  const tax = o.tax !== undefined ? round(o.tax) : round((subtotal - discount) * (o.taxRate || 0));
  return { subtotal, discount, shipping, tax, total: round(subtotal - discount + shipping + tax), count };
}


export function CommerceLine({ item, currency = 'USD', onQuantityChange, remove, strings, className }) {
  const t = useStrings('commerce.line', strings);
  const name = typeof item.title === 'string' ? item.title : '';
  return (
    <li className={cx('plx-commerce-line', className)}>
      <span className="plx-commerce-line__media">
        {item.image && item.image.src ? <Image src={item.image.src} alt={item.image.alt || ''} ratio="1-1" />
          : <span className="plx-commerce-line__placeholder plx-ratio-1-1" aria-hidden="true"><Icon name={ImageBIcon} /></span>}
      </span>
      <span className="plx-commerce-line__text">
        <span className="plx-commerce-line__title">{item.href ? <Link href={item.href} variant="subtle">{item.title}</Link> : item.title}</span>
        {item.options ? <Text variant="secondary">{item.options}</Text> : null}
        <ProductPrice size="sm" price={item.price} currency={currency} compareAtPrice={item.compareAtPrice} className="plx-commerce-line__unit" />
      </span>
      <span className="plx-commerce-line__quantity">
        {onQuantityChange ? <NumberInput stepper="quantity" value={item.quantity} min={1} max={item.max || 99} onChange={(n) => { if (n) onQuantityChange(n); }}
          aria-label={fill(t.quantity, { title: name })} />
          : <Text variant="secondary">{dataPhrase(t.qty, { n: item.quantity })}</Text>}
      </span>
      <span className="plx-commerce-line__total">{money(item.price * item.quantity, currency)}</span>
      {remove ? <span className="plx-commerce-line__remove">{remove}</span> : null}
      {item.warning ? <span className="plx-commerce-line__warning"><Notice tone="warning">{item.warning}</Notice></span> : null}
    </li>
  );
}


export function OrderSummary({ items = [], currency = 'USD', totals, estimated = false, showItems = false, title, headingLevel = 2, children, strings, className }) {
  const t = useStrings('commerce.summary', strings);
  const s = totals || orderTotals(items);
  const row = (key, label, value, cls) => (
    <div key={key} className={cx('plx-commerce-summary__row', cls)}>
      <dt className="plx-commerce-summary__label">{label}</dt>
      <dd className="plx-commerce-summary__value">{value}</dd>
    </div>
  );
  return (
    <Panel title={title || t.title} headingLevel={headingLevel} className={cx('plx-commerce-summary', className)}>
      {showItems && items.length ? (
        <ul className="plx-commerce-summary__items" aria-label={s.count === 1 ? t.item : fill(t.items, { n: formatNumber(s.count) })}>
          {items.map((x) => (
            <li key={x.id} className="plx-commerce-summary__item">
              <span className="plx-commerce-summary__name">{x.title} {dataPhrase(t.times, { n: x.quantity })}</span>
              <span className="plx-commerce-summary__value">{money(x.price * x.quantity, currency)}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <dl className="plx-commerce-summary__totals">
        {row('subtotal', t.subtotal, money(s.subtotal, currency))}
        {s.discount ? row('discount', t.discount, money(-s.discount, currency)) : null}
        {row('shipping', estimated ? t.shippingEstimated : t.shipping, s.shipping ? money(s.shipping, currency) : t.free)}
        {row('tax', estimated ? t.taxEstimated : t.tax, money(s.tax, currency))}
        {row('total', t.total, money(s.total, currency), 'plx-commerce-summary__row--total')}
      </dl>
      {children ? <div className="plx-commerce-summary__actions">{children}</div> : null}
    </Panel>
  );
}
