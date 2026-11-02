/* Plenix · Commerce templates: after the order
   Summary: The pages that manage orders and plans (platform/templates/Commerce): order management (OrderManagement: the
     orders in the DataGrid with the command bar's search, filter, status and selection actions; OrderDetail: one order's
     header, lines, totals, delivery, payment and history), subscription management (SubscriptionManagement: the plan,
     changing it, the payment method, pausing or canceling, and the billing history, in settings cards) and returns
     (Returns: the Wizard's items, reason, resolution and return method, the review with the refund, then the return's
     status). Order statuses are Badges with their icon (ORDER_STATUSES). Commerce.jsx documents every template.
   Usage:
     <OrderManagement orders={orders} onOpen={open} onFulfill={fulfill} onCancel={cancel} onRefund={refund} />
     <OrderDetail order={order} backHref="#/orders" onFulfill={…} onRefund={…} onCancel={…} />
     <SubscriptionManagement subscription={sub} plans={PLANS} history={invoices} onChangePlan={change} onPause={pause} onCancel={cancel} />
     <Returns order={order} reasons={REASONS} onSubmit={(request) => api.requestReturn(request)} />
   Props:
     See Commerce.jsx (ORDER_STATUSES, OrderManagement, OrderDetail, SubscriptionManagement, Returns).
   Behavior:
     See Commerce.jsx.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { announce } from '../../utils/announce.tsx';
import { formatDate, formatNumber } from '../../utils/format.ts';
import { useCollectionView } from '../../hooks/useCollectionView.ts';
import { CommandBar, CommandBarSearch } from '../../patterns/CommandBar/CommandBar.jsx';
import { FilterPanel } from '../../patterns/FilterPanel/FilterPanel.jsx';
import { QuickFilter } from '../../patterns/QuickFilter/QuickFilter.jsx';
import { EntityHeader } from '../../patterns/EntityHeader/EntityHeader.jsx';
import { PropertyList } from '../../patterns/PropertyList/PropertyList.jsx';
import { Wizard } from '../../patterns/Wizard/Wizard.jsx';
import { SettingsSection } from '../../patterns/SettingsLayout/SettingsLayout.jsx';
import { DataGrid } from '../../components/DataGrid/DataGrid.jsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { ConfirmDialog } from '../../components/Dialog/Dialog.jsx';
import { Panel } from '../../components/Card/Card.jsx';
import { Timeline } from '../../components/Timeline/Timeline.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { RadioTiles } from '../../components/RadioTiles/RadioTiles.tsx';
import { Checkbox, RadioGroup } from '../../components/Checkbox/Checkbox.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Textarea } from '../../components/Input/Input.tsx';
import { NumberInput } from '../../components/NumberInput/NumberInput.tsx';
import { CommerceLine, OrderSummary, orderTotals, money, useCommercePage } from './shared.jsx';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import AlertIcon from 'plenix-platform/icons/plenix/alert';
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import DoNotDisturbIcon from 'plenix-platform/icons/plenix/do-not-disturb';
import DocTextIcon from 'plenix-platform/icons/plenix/doc-text';
import EdUndoIcon from 'plenix-platform/icons/plenix/ed-undo';
import ForwardIcon from 'plenix-platform/icons/plenix/forward';
import OpenIcon from 'plenix-platform/icons/plenix/open';
import ProgressIcon from 'plenix-platform/icons/plenix/progress';
import ReplyIcon from 'plenix-platform/icons/plenix/reply';
import ScheduleIcon from 'plenix-platform/icons/plenix/schedule';
import { dataPhrase } from '../../utils/dataText.tsx';

// a calendar day ("2026-10-15") read in the reader's locale, at noon so no time zone moves it to another day
const day = (iso) => (iso ? formatDate(/T/.test(iso) ? iso : iso + 'T12:00:00') : '');

// the order statuses: each a Badge with its icon (never a dot); the actions each one allows
export const ORDER_STATUSES = {
  unfulfilled: { tone: 'waiting', icon: ScheduleIcon, label: 'Unfulfilled' },
  fulfilled: { tone: 'active', icon: ForwardIcon, label: 'Shipped' },
  delivered: { tone: 'success', icon: CircleCheckIcon, label: 'Delivered' },
  returning: { tone: 'action-required', icon: EdUndoIcon, label: 'Return requested' },
  refunded: { tone: 'neutral', icon: EdUndoIcon, label: 'Refunded' },
  canceled: { tone: 'neutral', icon: DoNotDisturbIcon, label: 'Canceled' },
};
const canFulfill = (o) => o.status === 'unfulfilled';
const canRefund = (o) => o.status === 'delivered' || o.status === 'returning' || o.status === 'fulfilled';
const canCancel = (o) => o.status === 'unfulfilled';
export function OrderStatus({ status, statuses }) {
  const s = (statuses || ORDER_STATUSES)[status] || { tone: 'neutral', label: String(status || '') };
  return <Badge tone={s.tone} icon={s.icon}>{s.label}</Badge>;
}

/* ── order management ── */

export function OrderManagement({ orders = [], currency = 'USD', onOpen, onFulfill, onCancel, onRefund, statuses, strings, className }) {
  useCommercePage('order-management');
  const t = useStrings('commerce.orders', strings);
  const S = statuses || ORDER_STATUSES;
  const fields = React.useMemo(() => [
    { value: 'number', label: t.number, kind: 'text' },
    { value: 'customer', label: t.customer, kind: 'text' },
    { value: 'date', label: t.date, kind: 'date' },
    { value: 'total', label: t.total, kind: 'number' },
    { value: 'status', label: t.status, kind: 'select', options: Object.keys(S).map((k) => ({ value: k, label: S[k].label })) },
  ], [S]);
  const v = useCollectionView(fields, { text: (o) => [o.number, o.customer, o.email].join(' '), quick: { status: 'list' } });
  const [selected, setSelected] = React.useState([]);
  const [asking, setAsking] = React.useState(null);
  const chosen = orders.filter((o) => selected.indexOf(o.id) >= 0);
  const what = (list) => (list.length === 1 ? list[0].number : formatNumber(list.length) + ' ' + t.plural);
  const fulfill = (list) => { if (onFulfill) onFulfill(list); announce(fill(t.fulfilled, { what: what(list) })); };
  const shown = orders.filter(v.test).length;
  // the rows and columns keep their identity between renders, so the table is not rebuilt (and keeps its row labels)
  const rows = React.useMemo(() => orders.map((o) => Object.assign({ count: (o.items || []).reduce((s, x) => s + (x.quantity || 0), 0) }, o)), [orders]);
  const columns = React.useMemo(() => [
    { title: t.number, field: 'number', kind: ['name', 'data'], width: '--plx-ref-size-120px' },
    { title: t.date, field: 'date', kind: 'data', sorter: 'date', render: (o) => day(o.date) },
    { title: t.customer, field: 'customer' },
    { title: t.items, field: 'count', kind: 'data', sorter: 'number', align: 'right', headerAlign: 'right', width: '--plx-ref-size-80px' },
    { title: t.total, field: 'total', kind: 'data', sorter: 'number', align: 'right', headerAlign: 'right', render: (o) => money(o.total, o.currency || currency) },
    { title: t.status, field: 'status', kind: 'center', render: (o) => <OrderStatus status={o.status} statuses={S} /> },
  ], [S, currency, strings]);
  return (
    <section className={cx('plx-commerce', 'plx-commerce--orders', className)} aria-label={t.label}>
      <CommandBar label={t.label} count={shown === 1 ? t.one : fill(t.count, { n: formatNumber(shown) })}
        find={<><CommandBarSearch value={v.search} onChange={(e) => v.setSearch(e.target.value)} onClear={() => v.setSearch('')} placeholder={t.search} label={t.search} />
          <FilterPanel {...v.filterProps} />
          <QuickFilter label={t.status} icon={ProgressIcon} noun={t.status.toLowerCase()} options={Object.keys(S).map((k) => ({ value: k, label: S[k].label }))} {...v.quickProps('status')} /></>}
        selection={{ count: chosen.length, noun: t.noun, plural: t.plural, onClear: () => setSelected([]), actions: [
          { id: 'fulfill', label: t.fulfill, icon: CircleCheckIcon, disabled: !chosen.every(canFulfill), why: t.notFulfillable, onSelect: () => fulfill(chosen) },
          { id: 'cancel', label: t.cancelMany, icon: DoNotDisturbIcon, danger: true, disabled: !chosen.every(canCancel), why: t.notCancelable, onSelect: () => setAsking(chosen) }] }} />
      <DataGrid label={t.label} data={rows} columns={columns}
        selectable selected={selected} onSelectionChange={setSelected} filter={v.test}
        rowMenu={(o) => [
          { label: t.open, icon: OpenIcon, onSelect: () => onOpen && onOpen(o) },
          { label: t.fulfill, icon: CircleCheckIcon, disabled: !canFulfill(o), onSelect: () => fulfill([o]) },
          { label: t.refund, icon: EdUndoIcon, disabled: !canRefund(o), onSelect: () => onRefund && onRefund(o) },
          { separator: true },
          { label: t.cancel, icon: DoNotDisturbIcon, danger: true, disabled: !canCancel(o), onSelect: () => setAsking([o]) }]}
        onRowDoubleClick={onOpen ? (order) => onOpen(orders.find((o) => o.id === order.id)) : undefined} />
      <ConfirmDialog open={!!asking} destructive title={asking ? fill(t.cancelTitle, { what: what(asking) }) : ''} message={t.cancelText}
        confirmLabel={asking && asking.length > 1 ? t.cancelMany : t.cancel} cancelLabel={t.keep}
        onConfirm={() => { if (onCancel) onCancel(asking); announce(fill(t.canceled, { what: what(asking) })); setSelected([]); setAsking(null); }} onCancel={() => setAsking(null)} />
    </section>
  );
}

/* ── one order ── */

export function OrderDetail({ order, currency = 'USD', backHref, onFulfill, onRefund, onCancel, onReturn, statuses, headingLevel = 1, strings, className }) {
  useCommercePage('order-detail');
  const t = useStrings('commerce.orderDetail', strings);
  const o = order || {};
  const uid = useUid('plx-commerce');
  const [asking, setAsking] = React.useState(false);
  const cur = o.currency || currency;
  const actions = [];
  if (onFulfill) actions.push({ icon: CircleCheckIcon, label: t.fulfill, primary: true, disabled: !canFulfill(o), onClick: () => onFulfill(o) });
  if (onRefund) actions.push({ icon: EdUndoIcon, label: t.refund, disabled: !canRefund(o), onClick: () => onRefund(o) });
  if (onReturn) actions.push({ icon: ReplyIcon, label: t.return, disabled: o.status !== 'delivered', onClick: () => onReturn(o) });
  const more = onCancel && canCancel(o) ? [{ icon: DoNotDisturbIcon, label: t.cancel, danger: true, onSelect: () => setAsking(true) }] : undefined;
  const H2 = 'h' + Math.min(6, headingLevel + 1);
  return (
    <article className={cx('plx-commerce', 'plx-commerce--order', className)}>
      {backHref ? <Link href={backHref} back>{t.back}</Link> : null}
      <EntityHeader media={{ icon: DocTextIcon, hue: 'gray' }} context={t.context} title={o.number} headingLevel={headingLevel}
        status={<OrderStatus status={o.status} statuses={statuses} />}
        facts={[<Text key="d" variant="data">{day(o.date)}</Text>, o.customer, <Text key="t" variant="data">{money(o.total, cur)}</Text>].filter(Boolean)}
        actions={actions.length ? actions : undefined} moreActions={more} />
      <div className="plx-commerce__columns">
        <div className="plx-commerce__main">
          <ul className="plx-commerce-lines" aria-label={t.items}>{(o.items || []).map((x) => <CommerceLine key={x.id} item={x} currency={cur} />)}</ul>
          {o.delivery ? (
            <Panel title={t.delivery} headingLevel={Math.min(6, headingLevel + 1)}>
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
          <OrderSummary items={o.items || []} currency={cur} totals={o.totals || orderTotals(o.items || [], { shipping: o.shipping, tax: o.tax })} headingLevel={Math.min(6, headingLevel + 1)}>
            {o.payment ? <PropertyList><PropertyList.Item label={t.payment}>{o.payment}</PropertyList.Item></PropertyList> : null}
          </OrderSummary>
        </aside>
      </div>
      <ConfirmDialog open={asking} destructive title={fill(t.cancelTitle, { number: o.number })} message={t.cancelText} confirmLabel={t.cancel} cancelLabel={t.keep}
        onConfirm={() => { setAsking(false); if (onCancel) onCancel(o); }} onCancel={() => setAsking(false)} />
    </article>
  );
}

/* ── subscription management ── */
const SUB_TONES = { active: ['success', CircleCheckIcon], paused: ['waiting', ScheduleIcon], canceled: ['neutral', DoNotDisturbIcon], paid: ['success', CircleCheckIcon], refunded: ['neutral', EdUndoIcon], failed: ['negative', AlertIcon] };

export function SubscriptionManagement({ subscription = {}, plans = [], history = [], currency = 'USD', onChangePlan, onPause, onResume, onCancel, onUpdatePayment, strings, className }) {
  useCommercePage('subscription-management');
  const t = useStrings('commerce.subscription', strings);
  const st = t.statuses;   // merged key by key with the strings prop
  const s = subscription;
  const current = plans.find((p) => p.id === s.plan) || {};
  const [pick, setPick] = React.useState(s.plan);
  const [asking, setAsking] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const target = plans.find((p) => p.id === pick);
  const per = (p) => fill(t.perPeriod, { price: money(p.price, p.currency || currency), period: p.period });
  const badge = (k) => <Badge tone={(SUB_TONES[k] || ['neutral'])[0]} icon={(SUB_TONES[k] || [])[1]}>{st[k] || k}</Badge>;
  const diff = (p) => {
    if (!current.price || p.id === current.id || p.period !== current.period) return '';
    const d = p.price - current.price;
    return d ? ' · ' + fill(d > 0 ? t.more : t.less, { amount: money(Math.abs(d), currency) }) : '';
  };
  const confirm = async () => {
    const kind = asking;
    setBusy(true);
    try {
      if (kind === 'change' && onChangePlan) { await onChangePlan(target); announce(fill(t.changed, { plan: target.name, date: day(s.nextBilling) })); }
      if (kind === 'pause' && onPause) { await onPause(); announce(t.paused); }
      if (kind === 'cancel' && onCancel) { await onCancel(); announce(t.canceled); }
    } finally { setBusy(false); setAsking(null); }
  };
  const dialog = {
    change: target ? { title: fill(t.changeTitle, { plan: target.name }), message: fill(t.changeText, { price: per(target), date: day(s.nextBilling) }), confirm: t.changeConfirm } : null,
    pause: { title: t.pauseTitle, message: t.pauseText, confirm: t.pause },
    cancel: { title: t.cancelTitle, message: fill(t.cancelText, { date: day(s.nextBilling) }), confirm: t.cancel, destructive: true },
  }[asking];
  const columns = [
    { title: t.date, field: 'date', kind: 'data', sorter: 'date', render: (r) => day(r.date) },
    { title: t.description, field: 'description', kind: 'wrap' },
    { title: t.amount, field: 'amount', kind: 'data', sorter: 'number', align: 'right', headerAlign: 'right', render: (r) => money(r.amount, r.currency || currency) },
    { title: t.status, field: 'status', kind: 'center', render: (r) => badge(r.status) },
    { title: t.invoice, field: 'invoice', kind: 'center', sortable: false, render: (r) => (r.invoice ? <Link href={r.invoice} variant="subtle">{fill(t.invoiceFor, { date: day(r.date) })}</Link> : null) },
  ];
  return (
    <div className={cx('plx-commerce', 'plx-commerce--subscription', className)}>
      <SettingsSection title={t.plan}>
        <PropertyList>
          <PropertyList.Item label={t.planName}>{current.name}</PropertyList.Item>
          {current.price !== undefined ? <PropertyList.Item label={t.price} data>{per(current)}</PropertyList.Item> : null}
          <PropertyList.Item label={t.status}>{badge(s.status || 'active')}</PropertyList.Item>
          {s.status === 'canceled' ? <PropertyList.Item label={t.ends} data>{day(s.endsAt || s.nextBilling)}</PropertyList.Item>
            : s.nextBilling ? <PropertyList.Item label={t.next} data>{day(s.nextBilling)}</PropertyList.Item> : null}
          {s.since ? <PropertyList.Item label={t.since} data>{day(s.since)}</PropertyList.Item> : null}
        </PropertyList>
      </SettingsSection>
      {plans.length > 1 && s.status !== 'canceled' ? (
        <SettingsSection title={t.change}>
          <RadioTiles legend={t.plans} legendHidden value={pick} onChange={setPick}
            options={plans.map((p) => ({ value: p.id, label: p.name, description: (p.id === s.plan ? t.current + ' · ' : '') + per(p) + diff(p) }))} />
          <span className="plx-commerce__row-actions"><Button variant="primary" disabled={!target || pick === s.plan} onClick={() => setAsking('change')}>{t.change}</Button></span>
        </SettingsSection>
      ) : null}
      {s.paymentMethod ? (
        <SettingsSection title={t.method}>
          <span className="plx-commerce__method">
            <span className="plx-commerce__method-text"><Text>{s.paymentMethod.label}</Text>{s.paymentMethod.description ? <Text variant="secondary">{s.paymentMethod.description}</Text> : null}</span>
            {onUpdatePayment ? <Button onClick={onUpdatePayment}>{t.update}</Button> : null}
          </span>
        </SettingsSection>
      ) : null}
      {s.status !== 'canceled' && (onPause || onResume || onCancel) ? (
        <SettingsSection title={t.manage}>
          <Text as="p" variant="secondary">{fill(t.manageText, { date: day(s.nextBilling) })}</Text>
          <span className="plx-commerce__row-actions">
            {s.status === 'paused' ? (onResume ? <Button onClick={onResume}>{t.resume}</Button> : null) : onPause ? <Button onClick={() => setAsking('pause')}>{t.pause}</Button> : null}
            {onCancel ? <Button variant="danger-secondary" onClick={() => setAsking('cancel')}>{t.cancel}</Button> : null}
          </span>
        </SettingsSection>
      ) : null}
      {history.length ? (
        <SettingsSection title={t.history}>
          <DataGrid label={t.history} data={history} columns={columns} />
        </SettingsSection>
      ) : null}
      <ConfirmDialog open={!!dialog} title={dialog ? dialog.title : ''} message={dialog ? dialog.message : ''} confirmLabel={dialog ? dialog.confirm : ''} cancelLabel={t.keep}
        destructive={!!(dialog && dialog.destructive)} onConfirm={busy ? undefined : confirm} onCancel={() => setAsking(null)} />
    </div>
  );
}

/* ── returns ── */

export function Returns({ order = {}, reasons = [], resolutions = [], methods = [], currency = 'USD', status, onSubmit, onCancel, headingLevel = 2, strings, className }) {
  useCommercePage('returns');
  const t = useStrings('commerce.returns', strings);
  const items = order.items || [];
  const [chosen, setChosen] = React.useState({});
  const [reason, setReason] = React.useState('');
  const [note, setNote] = React.useState('');
  const [resolution, setResolution] = React.useState('');
  const [method, setMethod] = React.useState('');
  const [done, setDone] = React.useState(false);
  const cur = order.currency || currency;
  const lines = items.filter((x) => chosen[x.id]).map((x) => Object.assign({}, x, { quantity: chosen[x.id] }));
  const refund = lines.reduce((s, x) => s + x.price * x.quantity, 0);
  const count = lines.reduce((s, x) => s + x.quantity, 0);
  const label = (list, v) => (list.find((x) => x.value === v) || {}).label || '';
  const steps = [
    { id: 'items', label: t.items, validate: () => (lines.length ? '' : t.choose), content: (
      <>
        <Text as="p" variant="secondary">{order.window || t.window}</Text>
        <ul className="plx-commerce__returnables" aria-label={t.items}>
          {items.map((x) => {
            const off = x.returnable === false;
            return (
              <li key={x.id} className="plx-commerce__returnable">
                <Checkbox label={x.title} description={off ? (x.reason || t.notReturnable) : x.options} disabled={off} checked={!!chosen[x.id]}
                  onChange={(e) => { const n = Object.assign({}, chosen); if (e.target.checked) n[x.id] = x.quantity; else delete n[x.id]; setChosen(n); }} />
                {chosen[x.id] && x.quantity > 1 ? <NumberInput stepper="quantity" value={chosen[x.id]} min={1} max={x.quantity} aria-label={fill(t.quantity, { title: x.title })}
                  onChange={(n) => { if (n) setChosen(Object.assign({}, chosen, { [x.id]: n })); }} /> : null}
              </li>
            );
          })}
        </ul>
      </>) },
    { id: 'reason', label: t.reason, validate: () => (reason ? '' : t.whyRequired), content: (
      <>
        <RadioGroup label={t.why} value={reason} onChange={setReason} options={reasons} />
        <Field label={t.note}><Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
      </>) },
    { id: 'resolution', label: t.resolution, validate: () => (!resolution ? t.wantRequired : methods.length && !method ? t.sendRequired : ''), content: (
      <>
        <RadioGroup label={t.want} value={resolution} onChange={setResolution} options={resolutions} />
        {methods.length ? <RadioGroup label={t.send} value={method} onChange={setMethod} options={methods} /> : null}
      </>) },
  ];
  const review = (
    <>
      <PropertyList>
        <PropertyList.Item label={t.items}>{lines.map((x) => x.title + (x.quantity > 1 ? ' × ' + formatNumber(x.quantity) : '')).join(', ')}</PropertyList.Item>
        <PropertyList.Item label={t.reason}>{label(reasons, reason)}{note ? ' · ' + note : ''}</PropertyList.Item>
        <PropertyList.Item label={t.resolution}>{label(resolutions, resolution)}</PropertyList.Item>
        {methods.length ? <PropertyList.Item label={t.send}>{label(methods, method)}</PropertyList.Item> : null}
        <PropertyList.Item label={t.refund} data>{money(refund, cur)}</PropertyList.Item>
      </PropertyList>
      <Text as="p" variant="secondary">{t.refundTiming}</Text>
    </>
  );
  const H = 'h' + Math.min(6, Math.max(1, headingLevel));
  if (done || status) {
    return (
      <section className={cx('plx-commerce', 'plx-commerce--returns', className)} aria-label={t.status}>
        <Notice tone="success" title={t.requested}>{t.requestedText}</Notice>
        <H className="plx-commerce__subtitle">{t.status}</H>
        <Timeline label={t.status} items={status || []} />
      </section>
    );
  }
  return (
    <section className={cx('plx-commerce', 'plx-commerce--returns', className)} aria-label={t.label}>
      <div className="plx-commerce__columns">
        <div className="plx-commerce__main">
          <Wizard label={t.label} steps={steps} summary={review} onCancel={onCancel} strings={{ complete: t.submit, summary: t.review, cancel: t.cancel }}
            onComplete={async () => { if (onSubmit) await onSubmit({ order: order.number, items: lines.map((x) => ({ id: x.id, quantity: x.quantity })), reason, note, resolution, method }); setDone(true); announce(t.requested); }} />
        </div>
        <aside className="plx-commerce__aside" aria-label={t.refund}>
          <Panel title={t.refund} headingLevel={Math.min(6, headingLevel + 1)}>
            <PropertyList>
              <PropertyList.Item label={t.items}>{dataPhrase(count === 1 ? t.returningOne : t.returning, { n: count })}</PropertyList.Item>
              <PropertyList.Item label={t.refund} data>{money(refund, cur)}</PropertyList.Item>
            </PropertyList>
          </Panel>
        </aside>
      </div>
    </section>
  );
}
