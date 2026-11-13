/* Plenix · Commerce: OrderStatus: an order status as a Badge
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { Badge } from '../../components/Badge/Badge.tsx';
import { ORDER_STATUSES } from './statuses.ts';

/** @public the prop type of OrderStatus (ADR 0011) */
export type OrderStatusProps = {
  status?: unknown;
  statuses?: unknown;
};

export function OrderStatus(props: OrderStatusProps) {
  const { status, statuses } = props as any;
  const s = (statuses || ORDER_STATUSES)[status] || { tone: 'neutral', label: String(status || '') };
  return <Badge tone={s.tone} icon={s.icon}>{s.label}</Badge>;
}

/* ── order management ── */

