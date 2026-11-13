/* Plenix · Commerce: SubscriptionManagement: the subscription settings page
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { announce } from '../../utils/announce.tsx';
import { PropertyList as PropertyListJs } from '../../patterns/PropertyList/PropertyList.tsx';
import { SettingsSection as SettingsSectionJs } from '../../patterns/SettingsLayout/SettingsLayout.tsx';
import { DataGrid } from '../../components/DataGrid/DataGrid.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { ConfirmDialog } from '../../components/Dialog/Dialog.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { RadioTiles } from '../../components/RadioTiles/RadioTiles.tsx';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import AlertIcon from 'plenix-platform/icons/plenix/alert';
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import DoNotDisturbIcon from 'plenix-platform/icons/plenix/do-not-disturb';
import EdUndoIcon from 'plenix-platform/icons/plenix/ed-undo';
import ScheduleIcon from 'plenix-platform/icons/plenix/schedule';
import { day } from './orderRules.ts';
import { useCommercePage } from './useCommercePage.ts';
import { money } from './totals.ts';
const PropertyList: any = PropertyListJs;
const SettingsSection: any = SettingsSectionJs;

/* ── subscription management ── */
const SUB_TONES: Record<string, any[]> = { active: ['success', CircleCheckIcon], paused: ['waiting', ScheduleIcon], canceled: ['neutral', DoNotDisturbIcon], paid: ['success', CircleCheckIcon], refunded: ['neutral', EdUndoIcon], failed: ['negative', AlertIcon] };

/** @public the prop type of SubscriptionManagement (ADR 0011) */
export type SubscriptionManagementProps = {
  subscription?: Record<string, unknown>;
  plans?: unknown[];
  history?: unknown[];
  currency?: string;
  onChangePlan?: (plan: unknown) => unknown;
  onPause?: () => unknown;
  onResume?: () => unknown;
  onCancel?: () => unknown;
  onUpdatePayment?: () => unknown;
  strings?: Record<string, string>;
  className?: string;
};

export function SubscriptionManagement(props: SubscriptionManagementProps) {
  const { subscription = {}, plans = [], history = [], currency = 'USD', onChangePlan, onPause, onResume, onCancel, onUpdatePayment, strings, className } = props as any;
  useCommercePage('subscription-management');
  const t: any = useStrings('commerce.subscription', strings);
  const st = t.statuses;   // merged key by key with the strings prop
  const s = subscription;
  const current = plans.find((p: any) => p.id === s.plan) || {};
  const [pick, setPick] = React.useState(s.plan);
  const [asking, setAsking] = React.useState<any>(null);
  const [busy, setBusy] = React.useState(false);
  const target = plans.find((p: any) => p.id === pick);
  const per = (p: any) => fill(t.perPeriod, { price: money(p.price, p.currency || currency), period: p.period });
  const badge = (k: any) => <Badge tone={(SUB_TONES[k] || ['neutral'])[0]} icon={(SUB_TONES[k] || [])[1]}>{st[k] || k}</Badge>;
  const diff = (p: any) => {
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
  const dialog = ({
    change: target ? { title: fill(t.changeTitle, { plan: target.name }), message: fill(t.changeText, { price: per(target), date: day(s.nextBilling) }), confirm: t.changeConfirm } : null,
    pause: { title: t.pauseTitle, message: t.pauseText, confirm: t.pause },
    cancel: { title: t.cancelTitle, message: fill(t.cancelText, { date: day(s.nextBilling) }), confirm: t.cancel, destructive: true },
  } as Record<string, any>)[asking];
  const columns = [
    { title: t.date, field: 'date', kind: 'data', sorter: 'date', render: (r: any) => day(r.date) },
    { title: t.description, field: 'description', kind: 'wrap' },
    { title: t.amount, field: 'amount', kind: 'data', sorter: 'number', align: 'right', headerAlign: 'right', render: (r: any) => money(r.amount, r.currency || currency) },
    { title: t.status, field: 'status', kind: 'center', render: (r: any) => badge(r.status) },
    { title: t.invoice, field: 'invoice', kind: 'center', sortable: false, render: (r: any) => (r.invoice ? <Link href={r.invoice} variant="subtle">{fill(t.invoiceFor, { date: day(r.date) })}</Link> : null) },
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
            options={plans.map((p: any) => ({ value: p.id, label: p.name, description: (p.id === s.plan ? t.current + ' · ' : '') + per(p) + diff(p) }))} />
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
          <DataGrid label={t.history} data={history} columns={columns as any} />
        </SettingsSection>
      ) : null}
      <ConfirmDialog open={!!dialog} title={dialog ? dialog.title : ''} message={dialog ? dialog.message : ''} confirmLabel={dialog ? dialog.confirm : ''} cancelLabel={t.keep}
        destructive={!!(dialog && dialog.destructive)} onConfirm={busy ? undefined : confirm} onCancel={() => setAsking(null)} />
    </div>
  );
}

/* ── returns ── */

