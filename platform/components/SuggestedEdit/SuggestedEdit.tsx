/* Plenix · SuggestedEdit
   Summary: Review plain text changes and explicitly accept or reject individual edits or all outstanding edits.
   Usage: <SuggestedEdit edits={edits} onDecision={persistDecision} />
   Props: edits: [{id,before,after,status:"pending"|"accepted"|"rejected"}]; variant: diff|accept|reject|all; onDecision({ids,decision}): async; disabled; strings: label,before,after,accept,reject,acceptAll,accepted,rejected,empty,failed; className.
   Behavior: Never applies edits automatically. Success records only the submitted edit version, failures preserve pending text, and a synchronous lock blocks duplicate requests.
   Notes: Existing roles and the existing sparkle icon only. Caller owns AI output, data, authorization and persistence.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Stack, Inline } from '../Stack/Stack.tsx';
import { Button } from '../Button/Button.tsx';
import { Text } from '../Text/Text.tsx';
import { Notice } from '../Notice/Notice.tsx';
import { Badge } from '../Badge/Badge.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import SparkleIcon from 'plenix-platform/icons/plenix/sparkle';
type Edit = { id: string; before?: React.ReactNode; after?: React.ReactNode; status?: 'pending' | 'accepted' | 'rejected' };
type Decision = 'accepted' | 'rejected';
const version = (e: Edit) => JSON.stringify([e.id, e.before, e.after]);
type SuggestedEditProps = {
  /** the edits: { id, before, after, status? } */
  edits?: Edit[];
  /** "diff" (default) | "accept" | "reject" | "all" */
  variant?: 'diff' | 'accept' | 'reject' | 'all';
  /** a decision: ({ ids, decision }); async */
  onDecision?(info: { ids: string[]; decision: Decision }): unknown;
  disabled?: boolean;
  strings?: Catalog | null;
  className?: string;
};
export function SuggestedEdit({ edits = [], variant = 'diff', onDecision, disabled = false, strings, className }: SuggestedEditProps) {
  devWarn('SuggestedEdit', { variant }, { variant: ['diff', 'accept', 'reject', 'all'] });
  const t = useStrings('suggestedEdit', strings) as Record<string, string>,
    [done, setDone] = React.useState<Record<string, Decision>>({}),
    [busy, setBusy] = React.useState(false),
    [error, setError] = React.useState('');
  const lock = React.useRef(false),
    alive = React.useRef(true);
  React.useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const state = (e: Edit) => (e.status && e.status !== 'pending' ? e.status : done[version(e)]),
    pending = edits.filter((e) => !state(e));
  async function decide(list: Edit[], decision: Decision) {
    if (disabled || lock.current || !onDecision || !list.length) return;
    const keys = list.map(version);
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      await onDecision({ ids: list.map((e) => e.id), decision });
      if (alive.current)
        setDone((p) => {
          const next = { ...p };
          keys.forEach((k) => {
            next[k] = decision;
          });
          return next;
        });
    } catch (e) {
      if (alive.current) setError(t.failed);
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  return (
    <Stack
      className={cx('plx-suggested-edit', className)}
      role="group"
      aria-label={t.label}
      aria-busy={busy || undefined}
    >
      <Badge icon={SparkleIcon}>{t.label}</Badge>
      {!edits.length ? <Text>{t.empty}</Text> : null}
      {edits.map((e) => {
        const s = state(e);
        return (
          <Stack key={e.id} className="plx-suggested-edit__item">
            <Text as="p">
              <VisuallyHidden>{t.before + ': '}</VisuallyHidden>
              <del className="plx-suggested-edit__before">{e.before}</del>{' '}
              <VisuallyHidden>{t.after + ': '}</VisuallyHidden>
              <ins className="plx-suggested-edit__after">{e.after}</ins>
            </Text>
            {s ? (
              <Badge icon={s === 'accepted' ? CheckIcon : CloseIcon} role="status">
                {s === 'accepted' ? t.accepted : t.rejected}
              </Badge>
            ) : (
              <Inline wrap>
                {variant !== 'reject' ? (
                  <Button disabled={disabled || busy || !onDecision} onClick={() => decide([e], 'accepted')}>
                    {t.accept}
                  </Button>
                ) : null}
                {variant !== 'accept' ? (
                  <Button
                    variant="secondary"
                    disabled={disabled || busy || !onDecision}
                    onClick={() => decide([e], 'rejected')}
                  >
                    {t.reject}
                  </Button>
                ) : null}
              </Inline>
            )}
          </Stack>
        );
      })}
      {variant === 'all' && pending.length ? (
        <Button disabled={disabled || busy || !onDecision} onClick={() => decide(pending, 'accepted')}>
          {t.acceptAll}
        </Button>
      ) : null}
      {error ? <Notice tone="danger">{error}</Notice> : null}
    </Stack>
  );
}
