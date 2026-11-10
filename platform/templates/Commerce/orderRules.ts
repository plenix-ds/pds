/* Plenix · Commerce: what an order's status allows, and a day read in the reader's locale
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import { formatDate } from '../../utils/format.ts';

// a calendar day ("2026-10-15") read in the reader's locale, at noon so no time zone moves it to another day
export const day = (iso: any) => (iso ? formatDate(/T/.test(iso) ? iso : iso + 'T12:00:00') : '');

export const canFulfill = (o: any) => o.status === 'unfulfilled';

export const canRefund = (o: any) => o.status === 'delivered' || o.status === 'returning' || o.status === 'fulfilled';

export const canCancel = (o: any) => o.status === 'unfulfilled';

