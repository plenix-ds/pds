/* Plenix · Commerce: Cart: the cart page
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { announce } from '../../utils/announce.tsx';
import { formatNumber } from '../../utils/format.ts';
import { useOptionalToast } from '../../components/Toast/Toast.tsx';
import { DeleteFlow } from '../../patterns/DeleteFlow/DeleteFlow.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Input } from '../../components/Input/Input.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import BriefcaseIcon from 'plenix-platform/icons/plenix/briefcase';
import EdUndoIcon from 'plenix-platform/icons/plenix/ed-undo';
import TrashIcon from 'plenix-platform/icons/plenix/trash';
import { useCommercePage } from './useCommercePage.ts';
import { CommerceLine, OrderSummary } from './shared.tsx';
import { CommerceItem, money, orderTotals } from './totals.ts';

/** @public the prop type of Cart (ADR 0011) */
export type CartProps = {
  items?: unknown[];
  currency?: string;
  onQuantityChange?: (item: CommerceItem, quantity: number) => void;
  onRemove?: (item: CommerceItem) => void;
  onRestore?: (item: CommerceItem) => void;
  onCheckout?: () => void;
  continueHref?: string;
  shipping?: unknown;
  taxRate?: unknown;
  discount?: unknown;
  onApplyPromo?: (code: string) => unknown;
  title?: React.ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  strings?: Record<string, string>;
  className?: string;
};

export function Cart(props: CartProps) {
  const { items = [], currency = 'USD', onQuantityChange, onRemove, onRestore, onCheckout, continueHref, shipping, taxRate, discount, onApplyPromo,
  title, headingLevel = 1, strings, className } = props as any;
  useCommercePage('cart');
  const t: any = useStrings('commerce.cart', strings);
  const toast = useOptionalToast();
  const [removed, setRemoved] = React.useState<any>(null);
  const [code, setCode] = React.useState('');
  const [promo, setPromo] = React.useState({ discount: 0, label: '', error: '', busy: false });
  const totals = orderTotals(items, { shipping, taxRate, discount: (discount || 0) + promo.discount });
  const H: any = 'h' + Math.min(6, Math.max(1, headingLevel));
  // the total is announced when it changes (a quantity, a removal, a promo code)
  const first = React.useRef(true);
  React.useEffect(() => { if (first.current) { first.current = false; return; } announce(fill(t.total, { total: money(totals.total, currency) })); }, [totals.total]);
  const apply = async (e: any) => {
    if (e) e.preventDefault();
    if (!code.trim() || !onApplyPromo) return;
    setPromo((p) => Object.assign({}, p, { busy: true, error: '' }));
    try {
      const r = await onApplyPromo(code.trim());
      setPromo({ discount: (r && r.discount) || 0, label: (r && r.label) || code.trim(), error: '', busy: false });
      announce(fill(t.applied, { code: code.trim() }));
    } catch (err: any) { setPromo({ discount: 0, label: '', error: (err && err.message) || t.promoError, busy: false }); }
  };
  const count = totals.count === 1 ? t.item : fill(t.items, { n: formatNumber(totals.count) });
  if (!items.length && !removed) {
    return (
      <section className={cx('plx-commerce', 'plx-commerce--cart', className)} aria-label={title || t.title}>
        <EmptyState size="page" icon={BriefcaseIcon} title={t.empty} action={continueHref ? <Link href={continueHref} variant="standalone">{t.continue}</Link> : undefined}>{t.emptyText}</EmptyState>
      </section>
    );
  }
  return (
    <section className={cx('plx-commerce', 'plx-commerce--cart', className)} aria-label={title || t.title}>
      <header className="plx-commerce__head">
        <H className="plx-commerce__title">{title || t.title}</H>
        <Text variant="data">{count}</Text>
      </header>
      <div className="plx-commerce__columns">
        <div className="plx-commerce__main">
          {removed ? <Notice tone="info" actions={onRestore ? <Button size="xs" icon={EdUndoIcon} onClick={() => { onRestore(removed); setRemoved(null); }}>{t.undo}</Button> : undefined}
            onDismiss={() => setRemoved(null)}>{fill(t.removed, { title: removed.title })}</Notice> : null}
          <ul className="plx-commerce-lines" aria-label={t.lines}>
            {items.map((x: any) => (
              <CommerceLine key={x.id} item={x} currency={currency} onQuantityChange={onQuantityChange ? (n: any) => onQuantityChange(x, n) : undefined}
                remove={onRemove ? <DeleteFlow variant="undo" items={[{ id: x.id, label: x.title }]} noun={t.noun}
                  onDelete={() => { onRemove(x); if (!toast) setRemoved(x); }} onRestore={onRestore ? () => onRestore(x) : undefined}
                  trigger={<Button variant="ghost" size="xs" iconOnly icon={TrashIcon} label={fill(t.remove, { title: x.title })} />} /> : null} />
            ))}
          </ul>
        </div>
        <aside className="plx-commerce__aside" aria-label={t.checkout}>
          <OrderSummary items={items} currency={currency} totals={totals} estimated>
            {onApplyPromo ? (
              <form className="plx-commerce__promo" onSubmit={apply}>
                <Field label={t.promo} error={promo.error} description={promo.label ? fill(t.applied, { code: promo.label }) : undefined}>
                  <Input value={code} data autoComplete="off" onChange={(e) => setCode(e.target.value)} />
                </Field>
                <Button type="submit" loading={promo.busy}>{t.apply}</Button>
              </form>
            ) : null}
            <Button variant="primary" size="lg" disabled={!items.length} onClick={onCheckout}>{t.checkout}</Button>
            {continueHref ? <Link href={continueHref} variant="standalone">{t.continue}</Link> : null}
          </OrderSummary>
        </aside>
      </div>
    </section>
  );
}

