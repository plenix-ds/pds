/* Plenix · Commerce: OrderDetail: one order's page
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { EntityHeader as EntityHeaderJs } from '../../patterns/EntityHeader/EntityHeader.tsx';
import { PropertyList as PropertyListJs } from '../../patterns/PropertyList/PropertyList.tsx';
import { ConfirmDialog } from '../../components/Dialog/Dialog.tsx';
import { Panel } from '../../components/Card/Card.tsx';
import { Timeline } from '../../components/Timeline/Timeline.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import DoNotDisturbIcon from 'plenix-platform/icons/plenix/do-not-disturb';
import DocTextIcon from 'plenix-platform/icons/plenix/doc-text';
import EdUndoIcon from 'plenix-platform/icons/plenix/ed-undo';
import ReplyIcon from 'plenix-platform/icons/plenix/reply';
import { OrderStatus } from './OrderStatus.tsx';
import { canCancel, canFulfill, canRefund, day } from './orderRules.ts';
import { useCommercePage } from './useCommercePage.ts';
import { CommerceLine, OrderSummary } from './shared.tsx';
import { money, orderTotals } from './totals.ts';
const EntityHeader: any = EntityHeaderJs;
const PropertyList: any = PropertyListJs;

/** @public the prop type of OrderDetail (ADR 0011) */
export type OrderDetailProps = {
  order?: unknown;
  currency?: string;
  backHref?: string;
  onFulfill?: (order: unknown) => unknown;
  onRefund?: (order: unknown) => unknown;
  onCancel?: (order: unknown) => unknown;
  onReturn?: (order: unknown) => unknown;
  statuses?: unknown;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  strings?: Record<string, string>;
  className?: string;
};

export function OrderDetail(props: OrderDetailProps) {
  const { order, currency = 'USD', backHref, onFulfill, onRefund, onCancel, onReturn, statuses, headingLevel = 1, strings, className } = props as any;
  useCommercePage('order-detail');
  const t: any = useStrings('commerce.orderDetail', strings);
  const o = order || {};
  const uid = useUid('plx-commerce');
  const [asking, setAsking] = React.useState(false);
  const cur = o.currency || currency;
  const actions = [];
  if (onFulfill) actions.push({ icon: CircleCheckIcon, label: t.fulfill, primary: true, disabled: !canFulfill(o), onClick: () => onFulfill(o) });
  if (onRefund) actions.push({ icon: EdUndoIcon, label: t.refund, disabled: !canRefund(o), onClick: () => onRefund(o) });
  if (onReturn) actions.push({ icon: ReplyIcon, label: t.return, disabled: o.status !== 'delivered', onClick: () => onReturn(o) });
  const more = onCancel && canCancel(o) ? [{ icon: DoNotDisturbIcon, label: t.cancel, danger: true, onSelect: () => setAsking(true) }] : undefined;
  const H2: any = 'h' + Math.min(6, headingLevel + 1);
  return (
    <article className={cx('plx-commerce', 'plx-commerce--order', className)}>
      {backHref ? <Link href={backHref} back>{t.back}</Link> : null}
      <EntityHeader media={{ icon: DocTextIcon, hue: 'gray' }} context={t.context} title={o.number} headingLevel={headingLevel}
        status={<OrderStatus status={o.status} statuses={statuses} />}
        facts={[<Text key="d" variant="data">{day(o.date)}</Text>, o.customer, <Text key="t" variant="data">{money(o.total, cur)}</Text>].filter(Boolean)}
        actions={actions.length ? actions : undefined} moreActions={more} />
      <div className="plx-commerce__columns">
        <div className="plx-commerce__main">
          <ul className="plx-commerce-lines" aria-label={t.items}>{(o.items || []).map((x: any) => <CommerceLine key={x.id} item={x} currency={cur} />)}</ul>
          {o.delivery ? (
            <Panel title={t.delivery} headingLevel={Math.min(6, headingLevel + 1) as 1 | 2 | 3 | 4 | 5 | 6}>
              <PropertyList>
                {o.delivery.address ? <PropertyList.Item label={t.address}>{o.delivery.address}</PropertyList.Item> : null}
                {o.delivery.method ? <PropertyList.Item label={t.method}>{o.delivery.method}</PropertyList.Item> : null}
                {o.delivery.tracking ? <PropertyList.Item label={t.tracking} data>{o.delivery.tracking}</PropertyList.Item> : null}
              </PropertyList>
            </Panel>
          ) : null}
          {o.events && o.events.length ? (
            <section className="plx-commerce__section" aria-labelledby={uid + '-history'}>
              <H2 id={uid + '-history'} className="plx-commerce__subtitle">{t.history}</H2>
              <Timeline label={t.history} items={o.events} />
            </section>
          ) : null}
        </div>
        <aside className="plx-commerce__aside" aria-label={t.payment}>
          <OrderSummary items={o.items || []} currency={cur} totals={o.totals || orderTotals(o.items || [], { shipping: o.shipping, tax: o.tax })} headingLevel={Math.min(6, headingLevel + 1) as 1 | 2 | 3 | 4 | 5 | 6}>
            {o.payment ? <PropertyList><PropertyList.Item label={t.payment}>{o.payment}</PropertyList.Item></PropertyList> : null}
          </OrderSummary>
        </aside>
      </div>
      <ConfirmDialog open={asking} destructive title={fill(t.cancelTitle, { number: o.number })} message={t.cancelText} confirmLabel={t.cancel} cancelLabel={t.keep}
        onConfirm={() => { setAsking(false); if (onCancel) onCancel(o); }} onCancel={() => setAsking(false)} />
    </article>
  );
}

