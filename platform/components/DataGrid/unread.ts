/* Plenix · unread records
   Summary: Key-based unread state shared by DataGrid, Table and VirtualList.
   Usage: useUnread(records, keyOf, props).
   Props: unread(record), unreadKeys, onUnreadChange(keys, {unreadCount}), markReadOnOpen, readDelay.
   Behavior: Controlled keys stay authoritative; predicate mode keeps local read overrides. Timers are canceled on unmount.
   Notes: Records are never mutated. */
import React from 'react';
export interface UnreadProps {
  unread?: (record: any) => boolean;
  unreadKeys?: unknown[];
  onUnreadChange?: (keys: any[], info: { unreadCount: number }) => void;
  markReadOnOpen?: boolean;
  readDelay?: number;
}
export function useUnread(records: any[], keyOf: (record: any) => any, props: UnreadProps) {
  const [overrides, setOverrides] = React.useState<Map<any, boolean>>(() => new Map());
  const enabled = typeof props.unread === 'function' || Array.isArray(props.unreadKeys);
  const keys = React.useMemo(() => {
    if (Array.isArray(props.unreadKeys)) return new Set(props.unreadKeys);
    return new Set(records.filter(record => overrides.has(keyOf(record)) ? overrides.get(keyOf(record)) : props.unread?.(record)).map(keyOf));
  }, [records, keyOf, props.unread, props.unreadKeys, overrides]);
  const current = React.useRef<any>(); current.current = { keys, props, keyOf };
  const timers = React.useRef(new Map<any, ReturnType<typeof setTimeout>>());
  React.useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);
  const mark = React.useCallback((items: any[], value: boolean) => {
    const { keys, props, keyOf } = current.current, next = new Set(keys), changes: any[] = [];
    for (const record of items) { const key = keyOf(record); clearTimeout(timers.current.get(key)); timers.current.delete(key); if (next.has(key) === value) continue; value ? next.add(key) : next.delete(key); changes.push(key); }
    if (!changes.length) return;
    if (!Array.isArray(props.unreadKeys)) setOverrides((old: Map<any, boolean>) => { const next = new Map(old); changes.forEach(key => next.set(key, value)); return next; });
    props.onUnreadChange?.([...next], { unreadCount: next.size });
  }, []);
  const open = React.useCallback((record: any) => {
    const { keys, props, keyOf } = current.current, key = keyOf(record);
    if (props.markReadOnOpen === false || !keys.has(key) || timers.current.has(key)) return;
    const delay = Math.max(0, Number(props.readDelay) || 0);
    if (delay) timers.current.set(key, setTimeout(() => { timers.current.delete(key); mark([record], false); }, delay));
    else mark([record], false);
  }, [mark]);
  return { enabled, keys, count: keys.size, has: (record: any) => keys.has(keyOf(record)), mark, open };
}
