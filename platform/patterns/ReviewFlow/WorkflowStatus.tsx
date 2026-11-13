/* Plenix · WorkflowStatus
   Summary: The status badge the review parts share (10 Patterns › Review and approval): a Badge of the status's meaning with its icon. It is its own module so an
     import of WorkflowStatus or WORKFLOW_STATUSES loads only this badge, not the review panel or the queue (ADR 0052, issue 1268). The words, props and behavior are
     documented in ReviewFlow.tsx, with the review panel and the queue.
   Usage:
     <WorkflowStatus status="changes-requested" />
   Props:
     status: "draft" | "in-review" | "approved" | "changes-requested" | "rejected" | "published" | "scheduled"; label; size: "md" (default) | "sm"; strings; className.
*/
import React from 'react';
import type { IconValue } from '../../components/Icon/Icon.tsx';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Badge } from '../../components/Badge/Badge.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import english from '../../i18n/en.js';
import AlertIcon from 'plenix-platform/icons/plenix/alert';
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import DocSearchIcon from 'plenix-platform/icons/plenix/doc-search';
import PencilIcon from 'plenix-platform/icons/plenix/pencil';
import ScheduleIcon from 'plenix-platform/icons/plenix/schedule';
import VisibilityIcon from 'plenix-platform/icons/plenix/visibility';

// the workflow statuses: a Badge variant by meaning, and its icon (owner, 2026-10-15)
// the labels are the catalog's (reviewFlow.statuses): this constant keeps its shape and its English labels for apps that read it
const STATUS_LABELS = english.reviewFlow.statuses;
type WorkflowStatusEntry = { tone: string; icon: IconValue; label: string };
export const WORKFLOW_STATUSES: Record<string, WorkflowStatusEntry> = {
  draft: { tone: 'neutral', icon: PencilIcon, label: STATUS_LABELS.draft },
  'in-review': { tone: 'active', icon: DocSearchIcon, label: STATUS_LABELS['in-review'] },
  approved: { tone: 'success', icon: CircleCheckIcon, label: STATUS_LABELS.approved },
  'changes-requested': { tone: 'action-required', icon: AlertIcon, label: STATUS_LABELS['changes-requested'] },
  rejected: { tone: 'negative', icon: CloseIcon, label: STATUS_LABELS.rejected },
  published: { tone: 'success', icon: VisibilityIcon, label: STATUS_LABELS.published },
  scheduled: { tone: 'waiting', icon: ScheduleIcon, label: STATUS_LABELS.scheduled },
};

/** @public a workflow status */
export type WorkflowStatusName = 'draft' | 'in-review' | 'approved' | 'changes-requested' | 'rejected' | 'published' | 'scheduled';
/** @public a reviewer's decision */
export type ReviewDecision = 'approved' | 'changes-requested' | 'rejected';
/** @public the prop type of WorkflowStatus (ADR 0011) */
export type WorkflowStatusProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & { status?: WorkflowStatusName; label?: string; size?: 'md' | 'sm'; strings?: Record<string, string>; className?: string };
export function WorkflowStatus(props: WorkflowStatusProps) {
  const { status = 'draft', label, size, strings, className, ...rest } = props as any;
  devWarn('WorkflowStatus', { size }, { size: ['md','sm'] });
  const s = WORKFLOW_STATUSES[status] || WORKFLOW_STATUSES.draft;
  const names: any = useStrings('reviewFlow.statuses');
  const words = label || (strings && strings[status]) || names[status] || s.label;
  return <Badge tone={s.tone} icon={s.icon} size={size} className={cx('plx-workflow-status', className)} {...rest}>{words}</Badge>;
}
