/* Plenix · Commerce: Returns: the returns page
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { announce } from '../../utils/announce.tsx';
import { formatNumber } from '../../utils/format.ts';
import { PropertyList as PropertyListJs } from '../../patterns/PropertyList/PropertyList.tsx';
import { Wizard as WizardJs } from '../../patterns/Wizard/Wizard.tsx';
import { Panel } from '../../components/Card/Card.tsx';
import { Timeline } from '../../components/Timeline/Timeline.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { Checkbox, RadioGroup } from '../../components/Checkbox/Checkbox.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Textarea } from '../../components/Input/Input.tsx';
import { NumberInput } from '../../components/NumberInput/NumberInput.tsx';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { dataPhrase } from '../../utils/dataText.tsx';
import { useCommercePage } from './useCommercePage.ts';
import { money } from './totals.ts';
const PropertyList: any = PropertyListJs;
const Wizard: any = WizardJs;

/** @public the prop type of Returns (ADR 0011) */
export type ReturnsProps = {
  order?: Record<string, unknown>;
  reasons?: unknown[];
  resolutions?: unknown[];
  methods?: unknown[];
  currency?: string;
  status?: unknown;
  onSubmit?: (request: Record<string, unknown>) => unknown;
  onCancel?: () => void;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  strings?: Record<string, string>;
  className?: string;
};

export function Returns(props: ReturnsProps) {
  const { order = {}, reasons = [], resolutions = [], methods = [], currency = 'USD', status, onSubmit, onCancel, headingLevel = 2, strings, className } = props as any;
  useCommercePage('returns');
  const t: any = useStrings('commerce.returns', strings);
  const items = order.items || [];
  const [chosen, setChosen] = React.useState<any>({});
  const [reason, setReason] = React.useState('');
  const [note, setNote] = React.useState('');
  const [resolution, setResolution] = React.useState('');
  const [method, setMethod] = React.useState('');
  const [done, setDone] = React.useState(false);
  const cur = order.currency || currency;
  const lines = items.filter((x: any) => chosen[x.id]).map((x: any) => Object.assign({}, x, { quantity: chosen[x.id] }));
  const refund = lines.reduce((s: any, x: any) => s + x.price * x.quantity, 0);
  const count = lines.reduce((s: any, x: any) => s + x.quantity, 0);
  const label = (list: any, v: any) => (list.find((x: any) => x.value === v) || {}).label || '';
  const steps = [
    { id: 'items', label: t.items, validate: () => (lines.length ? '' : t.choose), content: (
      <>
        <Text as="p" variant="secondary">{order.window || t.window}</Text>
        <ul className="plx-commerce__returnables" aria-label={t.items}>
          {items.map((x: any) => {
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
        <RadioGroup label={t.why} value={reason} onChange={(v: any) => setReason(v)} options={reasons} />
        <Field label={t.note}><Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
      </>) },
    { id: 'resolution', label: t.resolution, validate: () => (!resolution ? t.wantRequired : methods.length && !method ? t.sendRequired : ''), content: (
      <>
        <RadioGroup label={t.want} value={resolution} onChange={(v: any) => setResolution(v)} options={resolutions} />
        {methods.length ? <RadioGroup label={t.send} value={method} onChange={(v: any) => setMethod(v)} options={methods} /> : null}
      </>) },
  ];
  const review = (
    <>
      <PropertyList>
        <PropertyList.Item label={t.items}>{lines.map((x: any) => x.title + (x.quantity > 1 ? ' × ' + formatNumber(x.quantity) : '')).join(', ')}</PropertyList.Item>
        <PropertyList.Item label={t.reason}>{label(reasons, reason)}{note ? ' · ' + note : ''}</PropertyList.Item>
        <PropertyList.Item label={t.resolution}>{label(resolutions, resolution)}</PropertyList.Item>
        {methods.length ? <PropertyList.Item label={t.send}>{label(methods, method)}</PropertyList.Item> : null}
        <PropertyList.Item label={t.refund} data>{money(refund, cur)}</PropertyList.Item>
      </PropertyList>
      <Text as="p" variant="secondary">{t.refundTiming}</Text>
    </>
  );
  const H: any = 'h' + Math.min(6, Math.max(1, headingLevel));
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
            onComplete={async () => { if (onSubmit) await onSubmit({ order: order.number, items: lines.map((x: any) => ({ id: x.id, quantity: x.quantity })), reason, note, resolution, method }); setDone(true); announce(t.requested); }} />
        </div>
        <aside className="plx-commerce__aside" aria-label={t.refund}>
          <Panel title={t.refund} headingLevel={Math.min(6, headingLevel + 1) as 1 | 2 | 3 | 4 | 5 | 6}>
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

