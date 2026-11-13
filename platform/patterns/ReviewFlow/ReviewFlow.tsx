/* Plenix · ReviewFlow, ReviewQueue, WorkflowStatus
   Summary: The review of one item and the queue of many. ReviewFlow is a review panel: the item's status as a badge with
     its icon, the reviewers and their decisions, a comment, and the decisions in order (Reject, Request changes, Approve
     last); Reject and Request changes need a reason, said under the comment field. Its history lists every decision.
     kind="human" is the human review of generated content: a notice says a person must check it first. ReviewQueue is
     the data review workflow: a DataGrid of items waiting for review under a CommandBar whose selection holds Approve,
     Request changes and Reject; the bulk decisions that need a reason ask for it with the count ("Reject 2 items?").
     WorkflowStatus is the status badge they share (10 Patterns › Review and approval).
   Usage:
     <ReviewFlow title="Easter banner" status="in-review" reviewers={reviewers} history={history}
       onDecision={(decision, comment) => save(decision, comment)} />
     <ReviewFlow kind="human" title="Summary of the vestry minutes" status="in-review" onDecision={decide} />
     <ReviewQueue label="Waiting for review" items={items} noun="item" onDecision={(ids, decision, reason) => …} />
     <WorkflowStatus status="changes-requested" />
   Props:
     WorkflowStatus.status: "draft" (neutral, pencil) | "in-review" (active, doc-search) | "approved" (success, circle-check)
       | "changes-requested" (action-required, alert) | "rejected" (negative, close) | "published" (success, visibility)
       | "scheduled" (waiting, schedule): a Badge of its meaning with its icon
     WorkflowStatus.label: other words for the status (default strings[status])
     WorkflowStatus.size: Badge's size: "md" (default) | "sm"
     ReviewFlow.status: the item's status (WorkflowStatus.status)
     ReviewFlow.title: what is reviewed (the item's name), a heading
     ReviewFlow.headingLevel: the title's level (default 3)
     ReviewFlow.detail: one line under the title ("Submitted by Maya Chen")
     ReviewFlow.kind: "review" (default) | "human" (the human review of generated content: the notice first)
     ReviewFlow.reviewers: [{ id, name, src, color, decision }]: each reviewer with their decision ("approved",
       "changes-requested", "rejected"; none yet: waiting)
     ReviewFlow.history: [{ id, name, src, color, decision, comment, time, dateTime }]: the decisions so far, newest first
     ReviewFlow.onDecision(decision, comment): runs with "approved", "changes-requested" or "rejected" and the comment;
       without it the panel is read only (no comment, no decisions)
     ReviewFlow.decisions: the decisions offered, in order (default ["rejected", "changes-requested", "approved"])
     ReviewFlow.reasonFor: the decisions that need a comment (default ["rejected", "changes-requested"])
     ReviewQueue.items: [{ id, name, type, submittedBy, submitted, status }] (submitted "YYYY-MM-DD")
     ReviewQueue.label: names the bar and the table ("Waiting for review")
     ReviewQueue.noun, plural: the item in words ("item", "items")
     ReviewQueue.onDecision(ids, decision, reason): runs for the selected rows
     ReviewQueue.selected, onSelectionChange(ids): the selection, when the page keeps it (default: kept inside)
     strings: the words, for other languages (ReviewFlow: { reviewers, history, comment, commentHint, reason, approved,
       "changes-requested", rejected, approve, changes, reject, waiting, human, needReason }; ReviewQueue: { name, type,
       submittedBy, submitted, status, approve, changes, reject, rejectTitle, changesTitle, reason, changesLabel,
       needReason, done })
     className: more classes
   Behavior:
     ReviewFlow: Approve runs at once with the comment if there is one. Reject and Request changes run only with a
       comment: without one, the field shows the error and takes focus (nothing is disabled). The decision is announced.
     The status is always a Badge with its icon (never a dot): the word says the state, the color and icon repeat it.
     ReviewQueue: the command bar swaps to the selection's commands while rows are selected; Approve runs at once,
       Reject and Request changes open a PromptDialog named with the count that asks for the reason, then run; the
       selection clears after a decision and a toast says what happened.
   Notes:
     The review panel goes in a side panel, a card or a page section; it draws no frame of its own.
     Decisions are final for the reviewer; to change one, decide again (the history keeps both).
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { announce } from '../../utils/announce.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Textarea } from '../../components/Input/Input.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { Persona } from '../../components/Persona/Persona.tsx';
import { Avatar } from '../../components/Avatar/Avatar.tsx';
import { useOptionalToast } from '../../components/Toast/Toast.tsx';
import { ActivityList } from '../ActivityList/ActivityList.tsx';
import { WorkflowStatus, WORKFLOW_STATUSES } from './WorkflowStatus.tsx';
import type { WorkflowStatusName, ReviewDecision } from './WorkflowStatus.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
import { fill } from '../../utils/fill.ts';

const VERB: Record<string, any> = { approved: 'approve', 'changes-requested': 'changes', rejected: 'reject' };
const LOOK: Record<string, any> = { approved: 'primary', 'changes-requested': 'secondary', rejected: 'danger-secondary' };

/** @public one reviewer, with their decision (none yet: waiting) */
export type Reviewer = { id: string | number; name: string; src?: string; color?: string; decision?: ReviewDecision };
/** @public one decision in the history */
export type ReviewEntry = Reviewer & { comment?: string; time?: string; dateTime?: string };
/** @public the prop type of ReviewFlow (ADR 0011) */
export type ReviewFlowProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
  status?: WorkflowStatusName;
  title?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  detail?: string;
  kind?: 'review' | 'human';
  reviewers?: Reviewer[];
  history?: ReviewEntry[];
  /** without it the panel is read only */
  onDecision?(decision: ReviewDecision, comment: string): unknown;
  decisions?: ReviewDecision[];
  reasonFor?: ReviewDecision[];
  strings?: Record<string, string>;
  className?: string;
};
export function ReviewFlow(props: ReviewFlowProps) {
  const { status = 'in-review', title, headingLevel = 3, detail, kind = 'review', reviewers = [], history = [],
  onDecision, decisions = ['rejected', 'changes-requested', 'approved'], reasonFor = ['rejected', 'changes-requested'],
  strings, className, ...rest } = props as any;
  const t: any = useStrings('reviewFlow.flow', strings);
  const toast = useOptionalToast();
  const [comment, setComment] = React.useState('');
  const [error, setError] = React.useState('');
  const field = React.useRef<any>(null);
  const H = ('h' + Math.min(6, Math.max(2, headingLevel))) as React.ElementType;
  const names: any = useStrings('reviewFlow.statuses');
  const word = (d: any) => (t[d] || names[d] || WORKFLOW_STATUSES[d].label);
  const decide = (d: any) => {
    if (reasonFor.indexOf(d) >= 0 && !comment.trim()) { setError(t.needReason); if (field.current) field.current.focus(); return; }
    setError('');
    onDecision(d, comment.trim());
    setComment('');
    const said = fill(t.done, { decision: word(d), title: title || '' });
    if (toast) toast.show(said, { tone: d === 'approved' ? 'success' : 'info' }); else announce(said);
  };
  return (
    <section className={cx('plx-review-flow', kind === 'human' && 'plx-review-flow--human', className)} aria-label={title} {...rest}>
      <div className="plx-review-flow__head">
        <div className="plx-review-flow__heading">
          {title ? <H className="plx-review-flow__title">{title}</H> : null}
          {detail ? <span className="plx-review-flow__detail">{detail}</span> : null}
        </div>
        <WorkflowStatus status={status} strings={strings} />
      </div>
      {kind === 'human' ? <Notice tone="info" icon={SparkleIcon}>{t.human}</Notice> : null}
      {reviewers.length ? (
        <div className="plx-review-flow__section">
          <p className="plx-review-flow__label">{t.reviewers}</p>
          <ul className="plx-review-flow__reviewers">
            {reviewers.map((r: any) => (
              <li key={r.id || r.name} className="plx-review-flow__reviewer">
                <Persona name={r.name} src={r.src} color={r.color} size="xs" />
                {r.decision ? <WorkflowStatus status={r.decision} strings={strings} />
                  : <span className="plx-review-flow__waiting">{t.waiting}</span>}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {onDecision ? (
        <div className="plx-review-flow__decide">
          <Field label={t.comment} description={t.commentHint} error={error || undefined}>
            <Textarea ref={field} rows={3} value={comment} onChange={(e) => { setComment(e.target.value); if (error) setError(''); }} />
          </Field>
          <div className="plx-review-flow__actions" role="group" aria-label={t.decisions}>
            {decisions.map((d: any) => <Button key={d} variant={LOOK[d]} onClick={() => decide(d)}>{t[VERB[d]]}</Button>)}
          </div>
        </div>
      ) : null}
      {history.length ? (
        <div className="plx-review-flow__section">
          <p className="plx-review-flow__label">{t.history}</p>
          <ActivityList label={t.history} stacked>
            {history.map((x: any) => (
              <ActivityList.Item key={x.id || x.name + x.time} leading={<Avatar name={x.name} src={x.src} color={x.color} size="xs" />}
                title={x.name} meta={word(x.decision) + (x.comment ? ': ' + x.comment : '')} time={x.time} dateTime={x.dateTime} />
            ))}
          </ActivityList>
        </div>
      ) : null}
    </section>
  );
}
