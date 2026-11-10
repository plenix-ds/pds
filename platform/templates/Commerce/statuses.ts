/* Plenix · Commerce: the order statuses, each a Badge with its icon
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import DoNotDisturbIcon from 'plenix-platform/icons/plenix/do-not-disturb';
import EdUndoIcon from 'plenix-platform/icons/plenix/ed-undo';
import ForwardIcon from 'plenix-platform/icons/plenix/forward';
import ScheduleIcon from 'plenix-platform/icons/plenix/schedule';

// the order statuses: each a Badge with its icon (never a dot); the actions each one allows
export const ORDER_STATUSES = {
  unfulfilled: { tone: 'waiting', icon: ScheduleIcon, label: 'Unfulfilled' },
  fulfilled: { tone: 'active', icon: ForwardIcon, label: 'Shipped' },
  delivered: { tone: 'success', icon: CircleCheckIcon, label: 'Delivered' },
  returning: { tone: 'action-required', icon: EdUndoIcon, label: 'Return requested' },
  refunded: { tone: 'neutral', icon: EdUndoIcon, label: 'Refunded' },
  canceled: { tone: 'neutral', icon: DoNotDisturbIcon, label: 'Canceled' },
};

