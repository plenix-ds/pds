/* Plenix · utils/frame.ts
   Summary: whether an AppShell is showing its frame (frame="centered" in a window wider than the frame, D-0093, ADR 0023). The shell tells it; the parts that
     are drawn at the window's edge (a Drawer, the Toast region) ask, and keep to the frame.
   Usage:
     setFramed(true)          // AppShell, while its frame shows
     const framed = useFramed();   // Drawer, Toast: add the framed class, the stylesheet moves the part in by the width of the sides
   Notes:
     One value for the page. Two shells on one page are not a case (an application has one).
*/
import React from 'react';

let framed = false;
const listeners = new Set<() => void>();
export function setFramed(next: boolean): void {
  if (next === framed) return;
  framed = next;
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export function useFramed(): boolean {
  return React.useSyncExternalStore(subscribe, () => framed, () => false);
}
