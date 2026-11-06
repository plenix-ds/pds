/* Plenix · Retry (useRetry, RetryNotice)
   Summary: Recovering from a failed load or save: useRetry runs a task, counts its attempts and, when asked, tries again by
     itself after a growing wait (backoff); RetryNotice is the danger Notice that says what failed, how long until the next
     attempt and which attempt it is, with the Retry button.
   Usage:
     const load = useRetry(() => fetchAssets(), { auto: true, attempts: 3 });
     <RetryNotice retry={load} title="The assets could not load" showCount>The server did not answer.</RetryNotice>
     {load.status === 'done' ? <AssetGrid items={load.result} /> : null}
   Props:
     useRetry(task, options): task() returns a promise (or a value); options:
       attempts: the attempts in one series, the first included (default 3)
       auto: after a failure, try again by itself until the series ends (default false: only the Retry button does)
       delay: the first wait in milliseconds (default the --plx-comp-retry-delay token); each next wait doubles
       maxDelay: the longest wait in milliseconds (default the --plx-comp-retry-delay-max token)
       immediate: run the task when the component mounts (default true)
     useRetry returns { status, attempt, attempts, seconds, error, result, retry, cancel }:
       status: "idle" | "running" | "waiting" (auto: counting down to the next attempt) | "failed" | "done"
       attempt: the number of the current or last attempt (1 is the first); seconds: the seconds left while waiting
       retry(): runs the task now (from a failure, a wait or a finished series; after the last attempt it starts a new series)
       cancel(): stops the countdown; the status becomes "failed"
     RetryNotice.retry: what useRetry returned
     RetryNotice.title: what failed, in a few words (default strings.title)
     RetryNotice.children: why, or what people can do meanwhile
     RetryNotice.tone: "danger" (default) | "warning" (a failure that leaves the page usable)
     RetryNotice.showCount: show which attempt it is ("Attempt 2 of 3") (default false)
     RetryNotice.onDismiss(event): a dismiss button, for a failure people may leave as it is
     RetryNotice.strings: { title: "Couldn’t load", retry: "Retry", retryNow: "Retry now", retrying: "Retrying…",
       waiting: "Retrying in {time}", attempt: "Attempt {attempt} of {attempts}", stopped: "Stopped after {attempts} attempts",
       dismiss: "Dismiss" } ({…} are filled with the values, set in the data font)
     RetryNotice.className: more classes on the notice
   Behavior:
     RetryNotice shows only while there is a failure: from the first failed attempt until an attempt succeeds. While an
       attempt runs the Retry button shows its spinner and does nothing more; while waiting it reads Retry now.
     A danger notice is an alert when it appears; each later wait and each failure after the first are announced
       politely (announce), never every second of the countdown.
     The wait doubles after each failed attempt (2, 4, 8 … seconds with the default tokens), up to maxDelay; the timer and
       a late answer are dropped when the component unmounts.
   Notes:
     A whole region that could not load uses EmptyState tone="error" with useRetry's retry as its action; RetryNotice is
       for a message beside content that is still there (a list that could not refresh, a save that failed).
     Other props of RetryNotice pass through to the Notice.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { tokenMs } from '../../utils/tokenTime.ts';
import { announce } from '../../utils/announce.tsx';
import { formatDuration } from '../../utils/format.ts';
import { Notice } from '../../components/Notice/Notice.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import RefreshIcon from 'plenix-platform/icons/plenix/refresh';
import { fill } from '../../utils/fill.ts';
import { fillNodes } from '../../utils/fillNodes.tsx';

/** @public what useRetry returns */
export type RetryState<T = unknown> = {
  status: 'idle' | 'running' | 'waiting' | 'failed' | 'done';
  attempt: number;
  attempts: number;
  seconds: number;
  error: unknown;
  result: T | undefined;
  retry(): void;
  cancel(): void;
};
/** @public the options of useRetry */
export type RetryOptions = { attempts?: number; auto?: boolean; delay?: number; maxDelay?: number; immediate?: boolean };
export function useRetry<T = unknown>(task: () => T | Promise<T>, { attempts = 3, auto = false, delay, maxDelay, immediate = true }: RetryOptions = {}): RetryState<T> {
  const [state, setState] = React.useState<any>({ status: immediate ? 'running' : 'idle', attempt: immediate ? 1 : 0, seconds: 0, error: null, result: undefined });
  const live = React.useRef<any>({ run: 0, timer: null, tick: null, mounted: true });
  const taskRef = React.useRef(task);
  taskRef.current = task;
  const opts = React.useRef<any>({});
  opts.current = { attempts, auto, delay, maxDelay };

  const stopTimers = () => { clearTimeout(live.current.timer); clearInterval(live.current.tick); live.current.timer = null; live.current.tick = null; };

  const run = React.useCallback((attempt: any) => {
    stopTimers();
    const id = ++live.current.run;
    setState((s: any) => Object.assign({}, s, { status: 'running', attempt, seconds: 0 }));
    Promise.resolve().then(() => taskRef.current()).then((result) => {
      if (!live.current.mounted || id !== live.current.run) return;
      setState({ status: 'done', attempt, seconds: 0, error: null, result });
    }, (error) => {
      if (!live.current.mounted || id !== live.current.run) return;
      const o = opts.current;
      if (!o.auto || attempt >= o.attempts) { setState((s: any) => Object.assign({}, s, { status: 'failed', attempt, seconds: 0, error })); return; }
      const first = o.delay !== undefined ? o.delay : tokenMs('--plx-comp-retry-delay', 2000);
      const most = o.maxDelay !== undefined ? o.maxDelay : tokenMs('--plx-comp-retry-delay-max', 30000);
      const wait = Math.min(first * Math.pow(2, attempt - 1), most);
      const until = Date.now() + wait;
      setState((s: any) => Object.assign({}, s, { status: 'waiting', attempt, seconds: Math.ceil(wait / 1000), error }));
      live.current.tick = setInterval(() => {
        if (live.current.mounted) setState((s: any) => Object.assign({}, s, { seconds: Math.max(0, Math.ceil((until - Date.now()) / 1000)) }));
      }, 1000);
      live.current.timer = setTimeout(() => run(attempt + 1), wait);
    });
  }, []);

  React.useEffect(() => {
    live.current.mounted = true;
    if (immediate) run(1);
    return () => { live.current.mounted = false; stopTimers(); };
  }, []);

  const current = React.useRef(state);
  current.current = state;
  const retry = React.useCallback(() => {
    const s = current.current;
    if (s.status === 'running') return;
    run(s.status === 'done' || s.attempt === 0 || s.attempt >= opts.current.attempts ? 1 : s.attempt + 1);
  }, [run]);
  const cancel = React.useCallback(() => {
    stopTimers();
    live.current.run++;
    setState((s: any) => (s.status === 'waiting' ? Object.assign({}, s, { status: 'failed', seconds: 0 }) : s));
  }, []);

  return Object.assign({}, state, { attempts, retry, cancel });
}


// a string with {name} places filled by values in the data font (numbers and durations are technical values)

/** @public the prop type of RetryNotice (ADR 0011) */
export type RetryNoticeProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
  retry: RetryState<unknown>;
  title?: string;
  tone?: 'danger' | 'warning';
  showCount?: boolean;
  onDismiss?(event: React.SyntheticEvent): void;
  strings?: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
};
export function RetryNotice({ retry, title, tone = 'danger', showCount = false, onDismiss, strings, className, children, ...rest }: RetryNoticeProps) {
  devWarn('RetryNotice', { tone }, { tone: ['danger','warning'] });
  const t: any = useStrings('retry', strings);
  const r = retry || {};
  const failing = r.status === 'failed' || r.status === 'waiting' || (r.status === 'running' && r.attempt > 1);
  const values = { attempt: r.attempt, attempts: r.attempts, time: formatDuration(r.seconds || 0) };
  const shown = React.useRef(false);
  React.useEffect(() => {
    if (!failing) { shown.current = false; return; }
    if (!shown.current) { shown.current = true; return; }   // the notice's own alert says the first failure
    if (r.status === 'waiting') announce(fill(t.waiting, values));
    else if (r.status === 'failed') announce((title || t.title) + '. ' + fill(r.attempt >= r.attempts ? t.stopped : t.attempt, values));
  }, [r.status, r.attempt]);
  if (!failing) return null;
  const stopped = r.status === 'failed' && r.attempt >= r.attempts;
  const status = r.status === 'waiting' ? fillNodes(t.waiting, values) : r.status === 'running' ? t.retrying : stopped && showCount ? fillNodes(t.stopped, values) : null;
  const count = showCount && !stopped ? fillNodes(t.attempt, values) : null;
  return (
    <Notice className={cx('plx-retry', className)} tone={tone} title={title || t.title} onDismiss={onDismiss} strings={{ dismiss: t.dismiss }}
      actions={<Button size="xs" icon={RefreshIcon} loading={r.status === 'running'} onClick={r.retry}>{r.status === 'waiting' ? t.retryNow : t.retry}</Button>} {...rest}>
      {children}
      {status || count ? (
        <span className="plx-retry__status">
          {status ? <span className="plx-retry__wait">{status}</span> : null}
          {count ? <span className="plx-retry__count">{count}</span> : null}
        </span>
      ) : null}
    </Notice>
  );
}
