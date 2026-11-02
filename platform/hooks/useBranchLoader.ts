/* Plenix · useBranchLoader, BranchStatus
   Summary: Loads a branch of a hierarchy only when it is first opened (issue 814): the one mechanism Tree, TreeSelect and
     Cascader (through MillerColumns) share, so a big hierarchy opens at once.
   Usage:
     const loader = useBranchLoader(loadChildren);
     const tree = loader.merge(nodes);                 // the nodes with every loaded branch's children in place
     loader.needs(node)                                // a branch whose children are not here yet
     React.useEffect(() => { loader.ensure(openNodes); });   // load each open branch once
     <li className="plx-tree__status">{h(BranchStatus, { loader, node })}</li>
   Props:
     loadChildren(node): returns the branch's children (an array, or a promise of one); none: nothing loads, and the
       hook only passes the nodes through
     options.strings: the words, over the catalog's "branch" section (platform/i18n: English, Arabic): { loading:
       "Loading…", loadingName: "Loading {label}", failed: "Couldn’t load these items", failedName: "Couldn’t load {label}",
       retry: "Try again" }
     returns { needs(node), statusOf(node), load(node), retry(node), ensure(nodes), merge(nodes), strings }:
       needs: true for a node with hasChildren: true and no children array, while loadChildren is set
       statusOf: "idle" | "loading" | "failed" | "done" ("done" for a node whose children are here)
       load: asks for the children once and resolves with them (null when it failed); a branch already loading returns the
         same promise, a loaded one never asks again
       retry: asks again after a failure
       ensure: loads every node of the list that needs it and has not been asked for yet, and asks again for one that failed
         when it is newly in the list (an effect calls it with the open branches, so a branch opened by a click, a key or an
         expanded list loads the same way, and a failed one closed and opened again retries)
       merge: the nodes with each loaded branch's children in place (the same array while nothing has loaded)
     BranchStatus({ loader, node, className }): what an opened branch shows while it loads (a spinner and "Loading…", the
       spinner announcing "Loading {label}") or after a failure ("Couldn’t load these items" and a Try again button)
   Behavior:
     A branch to load is a node with hasChildren: true and no children array; a node with a children array, or without
       hasChildren, is as before, so existing hierarchies work unchanged.
     A failure is announced (announce(), polite) and keeps the branch closed to nothing else: opening it again, or Try
       again, asks once more. Children that arrived are kept for the hook's life; a failure is not.
     Search, choosing and the keys work on the loaded hierarchy: a branch not yet opened is found by its own label, its
       children once they have loaded.
*/
import React from 'react';
import { announce } from '../utils/announce.tsx';
import { fill } from '../utils/fill.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';
import type { Catalog } from '../providers/LocaleProvider.tsx';
import { Button } from '../components/Button/Button.tsx';
import { Spinner } from '../components/Loading/Loading.tsx';

const h = React.createElement;
// the props this hook gives Button and Spinner (both still JavaScript, issue 708: their props are not typed yet)
const RetryButton = Button as unknown as React.ComponentType<{ variant: string; size: string; onClick: (e: React.MouseEvent) => void; children?: React.ReactNode }>;
const LoadingSpinner = Spinner as unknown as React.ComponentType<{ size: string; label: string }>;

// a node of a hierarchy: an id, a label, and either its children or hasChildren (children still to load)
export interface BranchNode {
  id: string | number;
  label?: React.ReactNode;
  hasChildren?: boolean;
  children?: BranchNode[] | null;
  [key: string]: unknown;
}
export type BranchStatusName = 'idle' | 'loading' | 'failed' | 'done';
type Key = string | number;
type Entry<T extends BranchNode> = { status: 'loading' | 'failed' } | { status: 'done'; children: T[] };
export type LoadChildren<T extends BranchNode> = (node: T) => T[] | null | undefined | Promise<T[] | null | undefined>;
export interface BranchWords { loading: string; loadingName: string; failed: string; failedName: string; retry: string }
export interface BranchLoader<T extends BranchNode = BranchNode> {
  needs: (node: T | null | undefined) => boolean;
  statusOf: (node: T | null | undefined) => BranchStatusName;
  load: (node: T) => Promise<T[] | null>;
  retry: (node: T) => Promise<T[] | null>;
  ensure: (nodes: ReadonlyArray<T | null | undefined> | null | undefined) => void;
  merge: (nodes: T[]) => T[];
  strings: BranchWords;
}

export function useBranchLoader<T extends BranchNode = BranchNode>(loadChildren?: LoadChildren<T> | null, options: { strings?: Partial<BranchWords> } = {}): BranchLoader<T> {
  const t = useStrings('branch', (options.strings || null) as Catalog | null) as unknown as BranchWords;
  const [entries, setEntries] = React.useState<Record<Key, Entry<T>>>({});
  const live = React.useRef(entries); live.current = entries;
  const promises = React.useRef<Record<Key, Promise<T[] | null>>>({});
  const mounted = React.useRef(true);
  React.useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const set = (id: Key, entry: Entry<T>) => { live.current = Object.assign({}, live.current, { [id]: entry }); if (mounted.current) setEntries(live.current); };
  const childrenOf = (n: T): T[] | null => (Array.isArray(n.children) ? (n.children as T[]) : null);

  const needs = (n: T | null | undefined): boolean => !!(loadChildren && n && n.hasChildren && !Array.isArray(n.children));
  const statusOf = (n: T | null | undefined): BranchStatusName => {
    if (!n) return 'done';
    if (Array.isArray(n.children)) return 'done';
    const e = live.current[n.id];
    return e ? e.status : needs(n) ? 'idle' : 'done';
  };
  const load = (n: T): Promise<T[] | null> => {
    if (!needs(n) || !loadChildren) return Promise.resolve(n ? childrenOf(n) : null);
    const e = live.current[n.id];
    if (e && e.status === 'done') return Promise.resolve(e.children);
    const pending = promises.current[n.id];
    if (e && e.status === 'loading' && pending) return pending;
    set(n.id, { status: 'loading' });
    const p = Promise.resolve().then(() => loadChildren(n)).then(
      (kids): T[] => { const children = Array.isArray(kids) ? kids : []; set(n.id, { status: 'done', children }); delete promises.current[n.id]; return children; },
      (): null => { set(n.id, { status: 'failed' }); delete promises.current[n.id]; announce(fill(t.failedName, { label: n.label })); return null; });
    promises.current[n.id] = p;
    return p;
  };
  const retry = (n: T): Promise<T[] | null> => {
    const e = n ? live.current[n.id] : undefined;
    if (e && e.status === 'failed') { const next = Object.assign({}, live.current); delete next[n.id]; live.current = next; }
    return load(n);
  };
  // the branches open at the last ensure: one that failed asks again when it is opened anew (closed, then opened)
  const wasOpen = React.useRef<Set<Key>>(new Set());
  const ensure = (list: ReadonlyArray<T | null | undefined> | null | undefined): void => {
    const now = new Set<Key>();
    (list || []).forEach((n) => {
      if (!n) return;
      now.add(n.id);
      const e = live.current[n.id];
      if (!needs(n)) return;
      if (!e) load(n);
      else if (e.status === 'failed' && !wasOpen.current.has(n.id)) retry(n);
    });
    wasOpen.current = now;
  };

  // the nodes with each loaded branch in place; the same array (and the same node objects) while nothing under them loaded
  // (kept per nodes array, so a loader shared by two parts, Cascader and its columns, keeps both results)
  const cache = React.useRef(new WeakMap<T[], { entries: Record<Key, Entry<T>>; out: T[] }>());
  const merge = (nodes: T[]): T[] => {
    if (!nodes || typeof nodes !== 'object') return nodes;
    const c = cache.current.get(nodes);
    if (c && c.entries === entries) return c.out;
    const done = Object.keys(entries).filter((id) => entries[id].status === 'done');
    const walk = (list: T[]): T[] => {
      let changed = false;
      const out = list.map((n): T => {
        let kids = childrenOf(n);
        const e = kids ? undefined : entries[n.id];
        if (e && e.status === 'done') kids = e.children;
        if (!kids) return n;
        const merged = walk(kids);
        if (merged === n.children) return n;
        changed = true;
        return Object.assign({}, n, { children: merged });
      });
      return changed ? out : list;
    };
    const out = done.length ? walk(nodes) : nodes;
    cache.current.set(nodes, { entries, out });
    return out;
  };
  return { needs, statusOf, load, retry, ensure, merge, strings: t };
}

// what an opened branch shows while its children load, or after they failed
export function BranchStatus<T extends BranchNode>({ loader, node, className }: { loader: BranchLoader<T>; node: T; className: string }): React.ReactElement | null {
  const status = loader.statusOf(node), t = loader.strings;
  if (status === 'failed') {
    return h('span', { className: className + ' is-failed' },
      h('span', { className: className + '-text' }, t.failed),
      h(RetryButton, { variant: 'ghost', size: 'sm', onClick: (e: React.MouseEvent) => { e.stopPropagation(); loader.retry(node); } }, t.retry));
  }
  if (status === 'loading' || status === 'idle') {
    return h('span', { className: className + ' is-loading' },
      h(LoadingSpinner, { size: 'sm', label: fill(t.loadingName, { label: node.label }) }),
      h('span', { className: className + '-text', 'aria-hidden': 'true' }, t.loading));
  }
  return null;
}
