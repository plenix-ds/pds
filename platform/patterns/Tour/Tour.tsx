/* Plenix · Tour
   Summary: A skippable, resumable sequence of TeachingBubbles around real controls.
   Usage: <Tour open={open} onOpenChange={setOpen} steps={steps} defaultStep={savedStep} onStepChange={remember} />
   Props:
     steps: [{ id, target, title, content, placement }]; target is a Platform control rendered in place.
     open, onOpenChange(next): controlled visibility; step: controlled index; defaultStep: resume index.
     onStepChange(index): persist progress; onFinish(reason): "complete" or "skip"; spotlight: dim other regions (default true).
     strings: { next, back, finish, skip, resume, close, step }; className: extra classes.
   Behavior:
     Targets remain mounted. Only the current bubble opens. Escape and Close skip; Back preserves progress.
     Resume reopens at the saved step. The last Next completes the tour; keyboard focus enters each bubble.
   Notes:
     Tour progress storage belongs to the caller; never force a completed tour to restart.
*/
import React from 'react';
import { Inline } from '../../components/Stack/Stack.tsx';
import { TeachingBubble } from '../../components/TeachingBubble/TeachingBubble.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

/** @public one step of a Tour; target is a Platform control rendered in place */
export type TourStep = { id: string; target: React.ReactNode; title?: React.ReactNode; content?: React.ReactNode; placement?: string };
/** @public the prop type (ADR 0011) */
export type TourProps = {
  steps: TourStep[];
  open?: boolean;
  onOpenChange?(next: boolean): void;
  /** the controlled step index */
  step?: number;
  defaultStep?: number;
  onStepChange?(index: number): void;
  onFinish?(reason: 'complete' | 'skip'): void;
  spotlight?: boolean;
  strings?: Record<string, string>;
  className?: string;
};
export function Tour(props: TourProps) {
  const { steps = [], open = false, onOpenChange, step, defaultStep = 0, onStepChange, onFinish, spotlight = true, strings, className } = props as any;
  const t: any = useStrings('tour', strings);
  const [own, setOwn] = React.useState(defaultStep);
  const at = Math.max(0, Math.min(step === undefined ? own : step, steps.length - 1));
  const move = (n: any) => { if (step === undefined) setOwn(n); if (onStepChange) onStepChange(n); };
  const finish = (reason: any) => { if (onOpenChange) onOpenChange(false); if (onFinish) onFinish(reason); };
  if (!steps.length) return null;
  return <Inline wrap className={cx('plx-tour', className)}>
    {steps.map((s: any, i: any) => <TeachingBubble key={s.id} target={s.target} open={open && i === at} title={s.title} placement={s.placement}
      spotlight={spotlight} focusOnOpen step={{ current: i + 1, total: steps.length }} strings={t} onDismiss={() => finish('skip')}
      primaryAction={{ label: i === steps.length - 1 ? t.finish : t.next, onClick: () => i === steps.length - 1 ? finish('complete') : move(i + 1) }}
      secondaryAction={i > 0 ? { label: t.back, onClick: () => move(i - 1) } : { label: t.skip, onClick: () => finish('skip') }}>{s.content}</TeachingBubble>)}
    {open ? <Button onClick={() => finish('skip')}>{t.skip}</Button> : onOpenChange ? <Button onClick={() => onOpenChange(true)}>{t.resume}</Button> : null}
  </Inline>;
}
