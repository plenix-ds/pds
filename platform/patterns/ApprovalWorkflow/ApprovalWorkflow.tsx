/* Plenix · ApprovalWorkflow
   Summary: Sequential or parallel reviewer decisions composed from ReviewFlow and ordered ProgressSteps.
   Usage: <ApprovalWorkflow title="Artwork approval" steps={stages} reviewerId={me} onDecision={persistDecision} />
   Props:
     steps: [{ id, label, reviewers: [{ id, name, decision }], history }]; reviewerId: authorized current reviewer ID.
     variant: sequential (default) | parallel | status (read only); title; onDecision({ stepId, reviewerId, decision, comment }).
     strings: approve, changes, reject, comment, reason, failed, steps; reviewStrings: ReviewFlow words; className.
   Behavior:
     Sequential stages unlock only after earlier reviewers all approve. Parallel stages are independent.
     Only an undecided assigned reviewer can submit. Reject/changes require a reason; failures preserve it for retry.
   Notes:
     The caller must authorize and persist decisions and reflect them in steps. This UI never grants approval on its own.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { ReviewFlow } from '../ReviewFlow/ReviewFlow.tsx';
import { WorkflowStatus } from '../ReviewFlow/WorkflowStatus.tsx';
import { ProgressSteps } from '../../components/ProgressSteps/ProgressSteps.tsx';
import { Stack, Inline } from '../../components/Stack/Stack.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Textarea } from '../../components/Input/Input.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';

const statusOf = (step: any) => {
  const votes = (step.reviewers || []).map((a: any) => a.decision);
  return votes.includes('rejected') ? 'rejected' : votes.includes('changes-requested') ? 'changes-requested' : votes.length && votes.every((v: any) => v === 'approved') ? 'approved' : 'in-review';
};
/** @public one reviewer of a step */
export type ApprovalReviewer = { id: string | number; name: string; decision?: string };
/** @public one step of the workflow */
export type ApprovalStep = { id: string | number; label: string; reviewers: ApprovalReviewer[]; history?: unknown[] };
/** @public */
export type ApprovalWorkflowProps = {
  title?: string;
  steps?: ApprovalStep[];
  /** the authorized current reviewer's id */
  reviewerId?: string | number;
  variant?: 'sequential' | 'parallel' | 'status';
  onDecision?(decision: { stepId: string | number; reviewerId: string | number; decision: string; comment?: string }): void | Promise<void>;
  strings?: Record<string, string>;
  /** ReviewFlow's words */
  reviewStrings?: Record<string, string>;
  className?: string;
};
export function ApprovalWorkflow({ title, steps = [], reviewerId, variant = 'sequential', onDecision, strings, reviewStrings, className }: ApprovalWorkflowProps) {
  devWarn('ApprovalWorkflow', { variant }, { variant: ['sequential','parallel','status'] });
  const t: any = useStrings('approvalWorkflow', strings);
  const [comments, setComments] = React.useState<any>({}), [errors, setErrors] = React.useState<any>({}), [pending, setPending] = React.useState<any>({});
  const locks = React.useRef(new Set());
  const [submitted, setSubmitted] = React.useState<any>({});
  React.useEffect(() => { setSubmitted((p: any) => { const all = Object.entries(p), remaining = all.filter(([key]) => !steps.some((s) => (s.reviewers || []).some((a) => key === s.id + ':' + a.id && a.decision))); return remaining.length === all.length ? p : Object.fromEntries(remaining); }); }, [steps]);
  const states = steps.map(statusOf), next = states.findIndex((s) => s !== 'approved');
  const overall = states.includes('rejected') ? 'rejected' : states.includes('changes-requested') ? 'changes-requested' : states.length && next < 0 ? 'approved' : 'in-review';
  const eligible = (step: any, i: any) => !!reviewerId && !!onDecision && !submitted[step.id + ':' + reviewerId] && variant !== 'status' && (variant === 'parallel' || i === next) && states[i] === 'in-review' && (step.reviewers || []).some((a: any) => a.id === reviewerId && !a.decision);
  const decide = async (step: any, i: any, decision: any) => {
    if (locks.current.has(step.id) || !eligible(step, i)) return;
    const comment = (comments[step.id] || '').trim();
    if (decision !== 'approved' && !comment) { setErrors((p: any) => ({ ...p, [step.id]: t.reason })); return; }
    locks.current.add(step.id); setPending((p: any) => ({ ...p, [step.id]: true })); setErrors((p: any) => ({ ...p, [step.id]: '' }));
    try { await onDecision!({ stepId: step.id, reviewerId: reviewerId as string | number, decision, comment }); setSubmitted((p: any) => ({ ...p, [step.id + ':' + reviewerId]: true })); setComments((p: any) => ({ ...p, [step.id]: '' })); }
    catch (e) { setErrors((p: any) => ({ ...p, [step.id]: t.failed })); }
    finally { locks.current.delete(step.id); setPending((p: any) => ({ ...p, [step.id]: false })); }
  };
  return <Stack className={cx('plx-approval-workflow', className)}>
    <WorkflowStatus status={overall} strings={reviewStrings as any} role="status" {...({} as any)} />
    {variant === 'sequential' && steps.length ? <ProgressSteps label={t.steps} current={next < 0 ? steps.length : next} steps={steps.map((s, i) => ({ label: s.label, status: states[i] === 'approved' ? 'complete' : ['rejected', 'changes-requested'].includes(states[i]) ? 'error' : i === next ? 'current' : 'upcoming' }))} /> : null}
    {steps.map((step, i) => <Stack key={step.id} aria-busy={!!pending[step.id]}>
      <ReviewFlow {...({} as any)} title={step.label} detail={title} status={states[i]} reviewers={step.reviewers as any} history={step.history as any} strings={reviewStrings} />
      {eligible(step, i) ? <><Field label={t.comment} error={errors[step.id]}><Textarea disabled={pending[step.id]} value={comments[step.id] || ''} onChange={(e) => setComments({ ...comments, [step.id]: e.target.value })} /></Field>
        <Inline wrap>{[['rejected', t.reject], ['changes-requested', t.changes], ['approved', t.approve]].map(([decision, word]) => <Button key={decision} disabled={pending[step.id]} variant={decision === 'approved' ? 'primary' : 'secondary'} onClick={() => decide(step, i, decision)}>{word}</Button>)}</Inline></> : null}
      {submitted[step.id + ':' + reviewerId] ? <Badge tone="success" icon={CheckIcon} role="status">{t.recorded}</Badge> : null}
      {errors[step.id] && !eligible(step, i) ? <Notice tone="danger">{errors[step.id]}</Notice> : null}
    </Stack>)}
  </Stack>;
}