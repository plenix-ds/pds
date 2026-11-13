/* Plenix · Commerce: OrderConfirmation: the order confirmation page
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { PropertyList as PropertyListJs } from '../../patterns/PropertyList/PropertyList.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { CopyButton } from '../../components/CopyButton/CopyButton.tsx';
import { Timeline } from '../../components/Timeline/Timeline.tsx';
import { StatusIcon } from '../../components/Icon/Icon.tsx';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { useCommercePage } from './useCommercePage.ts';
import { CommerceLine, OrderSummary } from './shared.tsx';
const PropertyList: any = PropertyListJs;

/** @public the prop type of OrderConfirmation (ADR 0011) */
export type OrderConfirmationProps = {
  orderNumber?: unknown;
  email?: unknown;
  items?: unknown[];
  currency?: string;
  totals?: unknown;
  delivery?: Record<string, unknown>;
  steps?: unknown[];
  orderHref?: string;
  continueHref?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  autoFocus?: boolean;
  strings?: Record<string, string>;
  className?: string;
};

export function OrderConfirmation(props: OrderConfirmationProps) {
  const { orderNumber, email, items = [], currency = 'USD', totals, delivery = {}, steps = [], orderHref, continueHref, headingLevel = 1, autoFocus = true, strings, className } = props as any;
  useCommercePage('order-confirmation');
  const t: any = useStrings('commerce.confirm', strings);
  const uid = useUid('plx-commerce');
  const heading = React.useRef<any>(null);
  // the page's heading takes the focus when it opens: the success is the first thing read
  React.useEffect(() => { if (autoFocus && heading.current) heading.current.focus(); }, []);
  const H: any = 'h' + Math.min(6, Math.max(1, headingLevel)), H2: any = 'h' + Math.min(6, headingLevel + 1);
  return (
    <article className={cx('plx-commerce', 'plx-commerce--confirmation', className)}>
      <header className="plx-commerce__confirmed">
        <StatusIcon tone="success" size="lg" />
        <H ref={heading} tabIndex={-1} className="plx-commerce__title">{t.title}</H>
        <span className="plx-commerce__order-number">
          <Text variant="secondary">{t.number}</Text>
          <Text variant="data">{orderNumber}</Text>
          <CopyButton value={orderNumber} label={t.copy} size="xs" />
        </span>
        {email ? <Text as="p">{fill(t.sent, { email })}</Text> : null}
      </header>
      <div className="plx-commerce__columns">
        <div className="plx-commerce__main">
          {steps.length ? (
            <section className="plx-commerce__section" aria-labelledby={uid + '-next'}>
              <H2 id={uid + '-next'} className="plx-commerce__subtitle">{t.next}</H2>
              <Timeline label={t.next} items={steps} />
            </section>
          ) : null}
          {delivery.address || delivery.method ? (
            <PropertyList>
              {delivery.address ? <PropertyList.Item label={t.delivery}>{delivery.address}</PropertyList.Item> : null}
              {delivery.method ? <PropertyList.Item label={t.method}>{delivery.method}</PropertyList.Item> : null}
            </PropertyList>
          ) : null}
          <ul className="plx-commerce-lines" aria-label={t.items}>{items.map((x: any) => <CommerceLine key={x.id} item={x} currency={currency} />)}</ul>
          <span className="plx-commerce__links">
            {orderHref ? <Link href={orderHref} variant="standalone">{t.view}</Link> : null}
            {continueHref ? <Link href={continueHref} variant="standalone">{t.continue}</Link> : null}
          </span>
        </div>
        <aside className="plx-commerce__aside" aria-label={t.items}>
          <OrderSummary items={items} currency={currency} totals={totals} headingLevel={Math.min(6, headingLevel + 1) as 1 | 2 | 3 | 4 | 5 | 6} />
        </aside>
      </div>
    </article>
  );
}

