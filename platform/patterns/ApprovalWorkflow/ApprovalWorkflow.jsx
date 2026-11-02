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
import { ReviewFlow, WorkflowStatus } from '../ReviewFlow/ReviewFlow.jsx';
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

const statusOf = (step) => {
  const votes = (step.reviewers || []).map((a) => a.decision);
  return votes.includes('rejected') ? 'rejected' : votes.includes('changes-requested') ? 'changes-requested' : votes.length && votes.every((v) => v === 'approved') ? 'approved' : 'in-review';
};
export function ApprovalWorkflow({ title, steps = [], reviewerId, variant = 'sequential', onDecision, strings, reviewStrings, className }) {
  devWarn('ApprovalWorkflow', { variant }, { variant: ['sequential','parallel','status'] });
  const t = useStrings('approvalWorkflow', strings);
  const [comments, setComments] = React.useState({}), [errors, setErrors] = React.useState({}), [pending, setPending] = React.useState({});
  const locks = React.useRef(new Set());
  const [submitted, setSubmitted] = React.useState({});
  React.useEffect(() => { setSubmitted((p) => { const all = Object.entries(p), remaining = all.filter(([key]) => !steps.some((s) => (s.reviewers || []).some((a) => key === s.id + ':' + a.id && a.decision))); return remaining.length === all.length ? p : Object.fromEntries(remaining); }); }, [steps]);
  const states = steps.map(statusOf), next = states.findIndex((s) => s !== 'approved');
  const overall = states.includes('rejected') ? 'rejected' : states.includes('changes-requested') ? 'changes-requested' : states.length && next < 0 ? 'approved' : 'in-review';
  const eligible = (step, i) => !!reviewerId && !!onDecision && !submitted[step.id + ':' + reviewerId] && variant !== 'status' && (variant === 'parallel' || i === next) && states[i] === 'in-review' && (step.reviewers || []).some((a) => a.id === reviewerId && !a.decision);
  const decide = async (step, i, decision) => {
    if (locks.current.has(step.id) || !eligible(step, i)) return;
    const comment = (comments[step.id] || '').trim();
    if (decision !== 'approved' && !comment) { setErrors((p) => ({ ...p, [step.id]: t.reason })); return; }
    locks.current.add(step.id); setPending((p) => ({ ...p, [step.id]: true })); setErrors((p) => ({ ...p, [step.id]: '' }));
    try { await onDecision({ stepId: step.id, reviewerId, decision, comment }); setSubmitted((p) => ({ ...p, [step.id + ':' + reviewerId]: true })); setComments((p) => ({ ...p, [step.id]: '' })); }
    catch (e) { setErrors((p) => ({ ...p, [step.id]: t.failed })); }
    finally { locks.current.delete(step.id); setPending((p) => ({ ...p, [step.id]: false })); }
  };
  return <Stack className={cx('plx-approval-workflow', className)}>
    <WorkflowStatus status={overall} strings={reviewStrings} role="status" />
    {variant === 'sequential' && steps.length ? <ProgressSteps label={t.steps} current={next < 0 ? steps.length : next} steps={steps.map((s, i) => ({ label: s.label, status: states[i] === 'approved' ? 'complete' : ['rejected', 'changes-requested'].includes(states[i]) ? 'error' : i === next ? 'current' : 'upcoming' }))} /> : null}
    {steps.map((step, i) => <Stack key={step.id} aria-busy={!!pending[step.id]}>
      <ReviewFlow title={step.label} detail={title} status={states[i]} reviewers={step.reviewers} history={step.history} strings={reviewStrings} />
      {eligible(step, i) ? <><Field label={t.comment} error={errors[step.id]}><Textarea disabled={pending[step.id]} value={comments[step.id] || ''} onChange={(e) => setComments({ ...comments, [step.id]: e.target.value })} /></Field>
        <Inline wrap>{[['rejected', t.reject], ['changes-requested', t.changes], ['approved', t.approve]].map(([decision, word]) => <Button key={decision} disabled={pending[step.id]} variant={decision === 'approved' ? 'primary' : 'secondary'} onClick={() => decide(step, i, decision)}>{word}</Button>)}</Inline></> : null}
      {submitted[step.id + ':' + reviewerId] ? <Badge tone="success" icon={CheckIcon} role="status">{t.recorded}</Badge> : null}
      {errors[step.id] && !eligible(step, i) ? <Notice tone="danger">{errors[step.id]}</Notice> : null}
    </Stack>)}
  </Stack>;
}