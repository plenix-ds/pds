/* Plenix · Commerce: the money and totals helpers (no components)
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import { formatCurrency } from '../../utils/format.ts';

export const money = (n: number, currency?: string) => formatCurrency(n, currency || 'USD');

export const round = (n: any) => Math.round(n * 100) / 100;

/** @public a line of an order: price and quantity count */
export type CommerceItem = { id?: string | number; name?: string; price?: number; quantity?: number; [key: string]: unknown };

/** @public the options of orderTotals */
export type OrderTotalsOptions = { discount?: number; shipping?: number; tax?: number; taxRate?: number };

export function orderTotals(items: CommerceItem[] = [], o: OrderTotalsOptions = {}) {
  const subtotal = round(items.reduce((s, x) => s + (x.price || 0) * (x.quantity || 0), 0));
  const count = items.reduce((s, x) => s + (x.quantity || 0), 0);
  const discount = round(Math.min(subtotal, o.discount || 0));
  const shipping = round(o.shipping || 0);
  const tax = o.tax !== undefined ? round(o.tax) : round((subtotal - discount) * (o.taxRate || 0));
  return { subtotal, discount, shipping, tax, total: round(subtotal - discount + shipping + tax), count };
}

