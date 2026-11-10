/* Plenix · Commerce: OrderManagement: the orders workspace
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { announce } from '../../utils/announce.tsx';
import { formatNumber } from '../../utils/format.ts';
import { useCollectionView } from '../../hooks/useCollectionView.ts';
import { CommandBar as CommandBarJs, CommandBarSearch as CommandBarSearchJs } from '../../patterns/CommandBar/CommandBar.tsx';
import { FilterPanel } from '../../patterns/FilterPanel/FilterPanel.tsx';
import { QuickFilter as QuickFilterJs } from '../../patterns/QuickFilter/QuickFilter.tsx';
import { DataGrid } from '../../components/DataGrid/DataGrid.tsx';
import { ConfirmDialog } from '../../components/Dialog/Dialog.tsx';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import DoNotDisturbIcon from 'plenix-platform/icons/plenix/do-not-disturb';
import EdUndoIcon from 'plenix-platform/icons/plenix/ed-undo';
import OpenIcon from 'plenix-platform/icons/plenix/open';
import ProgressIcon from 'plenix-platform/icons/plenix/progress';
import { OrderStatus } from './OrderStatus.tsx';
import { canCancel, canFulfill, canRefund, day } from './orderRules.ts';
import { useCommercePage } from './useCommercePage.ts';
import { ORDER_STATUSES } from './statuses.ts';
import { money } from './totals.ts';
const CommandBar: any = CommandBarJs;
const CommandBarSearch: any = CommandBarSearchJs;
const QuickFilter: any = QuickFilterJs;

/** @public the prop type of OrderManagement (ADR 0011) */
export type OrderManagementProps = {
  orders?: unknown[];
  currency?: string;
  onOpen?: (order: unknown) => void;
  onFulfill?: (orders: unknown[]) => unknown;
  onCancel?: (orders: unknown[]) => unknown;
  onRefund?: (order: unknown) => unknown;
  statuses?: unknown;
  strings?: Record<string, string>;
  className?: string;
};

export function OrderManagement(props: OrderManagementProps) {
  const { orders = [], currency = 'USD', onOpen, onFulfill, onCancel, onRefund, statuses, strings, className } = props as any;
  useCommercePage('order-management');
  const t: any = useStrings('commerce.orders', strings);
  const S = statuses || ORDER_STATUSES;
  const fields = React.useMemo(() => [
    { value: 'number', label: t.number, kind: 'text' },
    { value: 'customer', label: t.customer, kind: 'text' },
    { value: 'date', label: t.date, kind: 'date' },
    { value: 'total', label: t.total, kind: 'number' },
    { value: 'status', label: t.status, kind: 'select', options: Object.keys(S).map((k) => ({ value: k, label: S[k].label })) },
  ], [S]);
  const v = useCollectionView(fields, { text: (o) => [o.number, o.customer, o.email].join(' '), quick: { status: 'list' } });
  const [selected, setSelected] = React.useState<any>([]);
  const [asking, setAsking] = React.useState<any>(null);
  const chosen = orders.filter((o: any) => selected.indexOf(o.id) >= 0);
  const what = (list: any) => (list.length === 1 ? list[0].number : formatNumber(list.length) + ' ' + t.plural);
  const fulfill = (list: any) => { if (onFulfill) onFulfill(list); announce(fill(t.fulfilled, { what: what(list) })); };
  const shown = orders.filter(v.test).length;
  // the rows and columns keep their identity between renders, so the table is not rebuilt (and keeps its row labels)
  const rows = React.useMemo(() => orders.map((o: any) => Object.assign({ count: (o.items || []).reduce((s: any, x: any) => s + (x.quantity || 0), 0) }, o)), [orders]);
  const columns = React.useMemo(() => [
    { title: t.number, field: 'number', kind: ['name', 'data'], width: '--plx-ref-size-30u' },
    { title: t.date, field: 'date', kind: 'data', sorter: 'date', render: (o: any) => day(o.date) },
    { title: t.customer, field: 'customer' },
    { title: t.items, field: 'count', kind: 'data', sorter: 'number', align: 'right', headerAlign: 'right', width: '--plx-ref-size-20u' },
    { title: t.total, field: 'total', kind: 'data', sorter: 'number', align: 'right', headerAlign: 'right', render: (o: any) => money(o.total, o.currency || currency) },
    { title: t.status, field: 'status', kind: 'center', render: (o: any) => <OrderStatus status={o.status} statuses={S} /> },
  ], [S, currency, strings]);
  return (
    <section className={cx('plx-commerce', 'plx-commerce--orders', className)} aria-label={t.label}>
      <CommandBar label={t.label} count={shown === 1 ? t.one : fill(t.count, { n: formatNumber(shown) })}
        find={<><CommandBarSearch value={v.search} onChange={(e: any) => v.setSearch(e.target.value)} onClear={() => v.setSearch('')} placeholder={t.search} label={t.search} />
          <FilterPanel {...(v.filterProps as any)} />
          <QuickFilter label={t.status} icon={ProgressIcon} noun={t.status.toLowerCase()} options={Object.keys(S).map((k) => ({ value: k, label: S[k].label }))} {...v.quickProps('status')} /></>}
        selection={{ count: chosen.length, noun: t.noun, plural: t.plural, onClear: () => setSelected([]), actions: [
          { id: 'fulfill', label: t.fulfill, icon: CircleCheckIcon, disabled: !chosen.every(canFulfill), why: t.notFulfillable, onSelect: () => fulfill(chosen) },
          { id: 'cancel', label: t.cancelMany, icon: DoNotDisturbIcon, danger: true, disabled: !chosen.every(canCancel), why: t.notCancelable, onSelect: () => setAsking(chosen) }] }} />
      <DataGrid label={t.label} data={rows} columns={columns as any}
        selectable selected={selected} onSelectionChange={setSelected} filter={v.test}
        rowMenu={(o) => [
          { label: t.open, icon: OpenIcon, onSelect: () => onOpen && onOpen(o) },
          { label: t.fulfill, icon: CircleCheckIcon, disabled: !canFulfill(o), onSelect: () => fulfill([o]) },
          { label: t.refund, icon: EdUndoIcon, disabled: !canRefund(o), onSelect: () => onRefund && onRefund(o) },
          { separator: true },
          { label: t.cancel, icon: DoNotDisturbIcon, danger: true, disabled: !canCancel(o), onSelect: () => setAsking([o]) }]}
        onRowDoubleClick={onOpen ? (order) => onOpen(orders.find((o: any) => o.id === order.id)) : undefined} />
      <ConfirmDialog open={!!asking} destructive title={asking ? fill(t.cancelTitle, { what: what(asking) }) : ''} message={t.cancelText}
        confirmLabel={asking && asking.length > 1 ? t.cancelMany : t.cancel} cancelLabel={t.keep}
        onConfirm={() => { if (onCancel) onCancel(asking); announce(fill(t.canceled, { what: what(asking) })); setSelected([]); setAsking(null); }} onCancel={() => setAsking(null)} />
    </section>
  );
}

/* ── one order ── */

