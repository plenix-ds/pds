/* Plenix · useUnsavedGuard, confirmLeave, hasUnsaved, leavePage
   Summary: Protects unsaved work (Platforms Standard 4.3, Guard): while a screen, a form or a dialog has unsaved changes,
     leaving it asks first, with a Plenix confirmation dialog ("Leave without saving?"), never the browser's confirm().
   Usage:
     const guard = useUnsavedGuard(dirty, 'Your changes to this note will be lost.');
     <Dialog onClose={guard(onClose)} …>                    // closing the dialog asks while it is dirty
     useUnsavedGuard(dirty, message, { keeps: (next) => true });   // sections that stay mounted: only leaving the page asks
     leavePage('../settings/index.html#/general');           // a page change from code, asked like a link
   Props:
     useUnsavedGuard(dirty, message, options): dirty: true while there are unsaved changes; message: the explanation in the
       dialog (default "Your changes will be lost."); options.keeps(next): true when the next screen (useScreenLocation's
       { path, parts, params }) still shows this work, so changing to it does not ask; options.strings: { title, leave,
       stay } for other languages. Returns guard(fn): fn wrapped so that, while dirty, it runs only after the person
       chooses Leave (for a dialog's Close and Cancel)
     hasUnsaved(next): true when a dirty guard would lose its work by changing to next (null: another page)
     confirmLeave(next): resolves true when nothing unsaved is in the way of the screen change (next: the next screen, or
       null for another page), or when the person chose Leave; false when they stay
     leavePage(url): goes to another page, asking first while something is unsaved
   Behavior:
     While anything is dirty:
     - closing or reloading the tab asks (beforeunload; the browser words that question itself);
     - a link to another page (the header's applications, a navigation pane's links, a Button with href) asks with the
       Plenix dialog: Leave follows the link, Keep editing stays;
     - a screen change through useScreenLocation (opening a screen, Back, Forward, the parent control) asks the same, and
       Back or Forward is undone when the person stays.
     The dialog is a destructive ConfirmDialog: it starts on Keep editing, Escape and the veil keep editing.
     Only one question shows at a time; a second request while it is open waits for the same answer.
   Notes:
     The dialog renders in its own root on document.body, so a guard works on any page, with or without an AppShell.
     A link that opens a new tab or window (target, Ctrl, Shift, the middle button) never asks: nothing is lost.
*/
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfirmDialog } from '../components/Dialog/Dialog.tsx';
import { useStrings } from './LocaleProvider.tsx';

// ConfirmDialog as this file draws it (Dialog.tsx is not typed yet: its inferred props would all be required)
const LeaveDialog = ConfirmDialog as React.ComponentType<{
  open?: boolean; destructive?: boolean; title?: string; message?: string; confirmLabel?: string; cancelLabel?: string;
  onConfirm?(): void; onCancel?(): void;
}>;

export type GuardStrings = { title?: string; message?: string; leave?: string; stay?: string };
// the next screen (useScreenLocation's { path, parts, params }), or null for another page
export type NextScreen = { path: string; parts: string[]; params: Record<string, string> } | null;
export type GuardOptions = { keeps?(next: NonNullable<NextScreen>): boolean; strings?: GuardStrings };
type GuardState = { dirty: boolean; message?: string; options: GuardOptions; words: GuardStrings };

const guards = new Set<React.MutableRefObject<GuardState | null>>();          // every mounted guard: a ref to { dirty, message, options }
let leaving = false;               // the person chose Leave: the page may unload without asking again
let pending: Promise<boolean> | null = null;                // the question on screen, if any (one at a time)

// the first dirty guard that the next screen would lose (next null: another page)
function blocking(next: NextScreen): GuardState | null {
  for (const g of guards) {
    const c = g.current!;
    if (c.dirty && !(next && c.options.keeps && c.options.keeps(next))) return c;
  }
  return null;
}

// asks with the Plenix dialog in a root of its own; resolves true for Leave
function ask(c: GuardState): Promise<boolean> {
  if (pending) return pending;
  const t = c.words;
  pending = new Promise((resolve) => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const root = createRoot(el);
    const done = (ok: boolean) => { queueMicrotask(() => { root.unmount(); el.remove(); pending = null; resolve(ok); }); };
    root.render(<LeaveDialog open destructive title={t.title} message={c.message || t.message} confirmLabel={t.leave} cancelLabel={t.stay}
      onConfirm={() => done(true)} onCancel={() => done(false)} />);
  });
  return pending;
}

export function hasUnsaved(next?: NextScreen): boolean { return !!blocking(next === undefined ? null : next); }

export function confirmLeave(next?: NextScreen): Promise<boolean> {
  const c = blocking(next === undefined ? null : next);
  return c ? ask(c) : Promise.resolve(true);
}

export function leavePage(url: string): Promise<boolean> {
  return confirmLeave(null).then((ok) => { if (ok) { leaving = true; location.href = url; } return ok; });
}

// the page-wide listeners, installed with the first guard
let installed = false;
function install() {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  window.addEventListener('beforeunload', (e) => {
    if (leaving || !blocking(null)) return;
    e.preventDefault();
    e.returnValue = '';
  });
  // a link to another page: ask before following it (capture: before the link's own handlers navigate)
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    const a = e.target && (e.target as Element).closest ? (e.target as Element).closest<HTMLAnchorElement>('a[href]') : null;
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const to = new URL(a.href, location.href);
    if (to.origin === location.origin && to.pathname === location.pathname && to.search === location.search) return;   // this page: a screen (useScreenLocation)
    if (!blocking(null)) return;
    e.preventDefault();
    e.stopPropagation();
    leavePage(to.href);
  }, true);
}

export function useUnsavedGuard(dirty: unknown, message?: string, options?: GuardOptions) {
  const ref = React.useRef<GuardState | null>(null);
  // the dialog draws in a root of its own, outside the app's LocaleProvider: its words are read here, from the catalog
  // (providers.UnsavedGuard, in the page's language), with options.strings on top (#668)
  const words = useStrings('providers.UnsavedGuard', options && options.strings) as GuardStrings;
  ref.current = { dirty: !!dirty, message, options: options || {}, words };
  React.useEffect(() => {
    install();
    guards.add(ref);
    return () => { guards.delete(ref); };
  }, []);
  return React.useCallback(<A extends unknown[], R>(fn?: ((...args: A) => R) | null) => (...args: A) => {
    const c = ref.current!;
    if (!c.dirty) return fn && fn(...args);
    return ask(c).then((ok) => (ok && fn ? fn(...args) : undefined));
  }, []);
}
