/* Plenix · DataGrid engine · cutTextDialog (loaded on first use)
   Summary: The cell of a column with overflow: "dialog" (ADR 0047): the text, the corner button and the open-cell store. cells.tsx loads this file with React.lazy
     the first time such a cell draws, so a grid without that column does not carry it (the grid's default path was 2.7 KB heavier with it).
   Usage: <CutTextDialog label={column title} text={string} className={...}>{the text, drawn}</CutTextDialog>
   Behavior: see the comment below; keys.ts finds the button through [data-plx-full-text], so it imports nothing from here. */
import React from 'react';
import { isCut } from '../../../utils/overflow.ts';
import { Rare } from './rare.tsx';
import { Button } from '../../Button/Button.tsx';
import { fill } from '../../../utils/fill.ts';
import { useStrings } from '../../../providers/LocaleProvider.tsx';
import ExpandIcon from 'plenix-platform/icons/plenix/expand';

// overflow: "dialog" (#1122, ADR 0047, design 1122): the cell's text is clamped as for the tooltip; while the pointer is on the cell or the cell is the active one, and the text is cut, a small
// button at the cell's inline end opens the whole text in a Dialog titled with the column's title. The cut is measured on demand (hover or focus), never when the row draws. The button is not a Tab stop:
// the grid keeps one, so F2 on the focused read-only cell opens the Dialog (keys.ts). Closing it returns focus to the cell.
let openFullText: string | null = null;
const fullTextWatchers = new Set<() => void>();
const fullTextSubscribe = (watch: () => void) => { fullTextWatchers.add(watch); return () => { fullTextWatchers.delete(watch); }; };
const setFullText = (address: string | null) => { openFullText = address; fullTextWatchers.forEach((watch) => watch()); };
const gridNumbers = new WeakMap<Element, number>();
let gridCount = 0;
const cellAddress = (cell: Element) => {   // the grid, the row and the field: two grids on a page with the same record ids do not open each other's Dialog
  const grid = cell.closest('[role=grid],[role=treegrid],[role=table]'), row = cell.closest('[role=row]');
  if (grid && !gridNumbers.has(grid)) gridNumbers.set(grid, ++gridCount);
  return (grid ? gridNumbers.get(grid) : 0) + '|' + (row ? row.getAttribute('data-plx-record') : '') + '|' + cell.getAttribute('data-plx-field');
};
export default function CutTextDialog({ label, text, className, children }: { label: string; text: string; className: string; children: React.ReactNode }) {
  const box = React.useRef<HTMLSpanElement>(null), [cutFor, setCutFor] = React.useState<string | null>(null), [on, setOn] = React.useState(false), [mine, setMine] = React.useState<string | null>(null);
  const words = useStrings('text') as Record<string, string>;
  // the grid draws a cell anew when its row or its active state changes, so the open Dialog is kept outside the cell, by the cell's address (row and field)
  const shown = React.useSyncExternalStore(fullTextSubscribe, () => openFullText, () => null);
  const open = mine !== null && shown === mine;
  const measure = React.useCallback(() => { const el = box.current; if (el) setCutFor(isCut(el) ? text : null); }, [text]);
  React.useEffect(() => {
    const el = box.current, cell = el && el.closest('[role=gridcell]');
    if (!cell) return undefined;
    setMine(cellAddress(cell));
    const enter = () => { measure(); setOn(true); }, leave = () => setOn(document.activeElement === cell || cell.matches(':hover'));   // hovered or active: it stays while either holds
    if (cell.matches(':hover') || document.activeElement === cell) enter();   // the cell may be drawn anew under the pointer (a hover redraws the row): pick the state up
    cell.addEventListener('pointerenter', enter); cell.addEventListener('pointerleave', leave); cell.addEventListener('focus', enter); cell.addEventListener('blur', leave);
    return () => { cell.removeEventListener('pointerenter', enter); cell.removeEventListener('pointerleave', leave); cell.removeEventListener('focus', enter); cell.removeEventListener('blur', leave); };
  }, [measure]);
  // the cell is the focus stop that a screen reader announces: it says F2 opens the full text while the text is cut
  React.useEffect(() => {
    const cell = box.current && box.current.closest('[role=gridcell]');
    if (!cell) return undefined;
    if (cutFor === text) cell.setAttribute('aria-keyshortcuts', 'F2'); else cell.removeAttribute('aria-keyshortcuts');
    return () => cell.removeAttribute('aria-keyshortcuts');
  }, [cutFor, text]);
  // the cell may have been drawn anew while the Dialog was open, so it is found again by its address
  const close = () => { const address = mine; setFullText(null); if (address) { const back = () => { const cell = [...document.querySelectorAll('[role=gridcell]')].find((c) => cellAddress(c) === address) as HTMLElement | undefined; if (cell && document.activeElement !== cell) cell.focus(); }; setTimeout(back, 0); setTimeout(back, 250); } };   // after the Dialog has handed focus back to the button
  return (
    <>
      <span ref={box} className={className}>{children}</span>
      {cutFor === text && (on || open) ? <span className="plx-data-grid__full-text-action"><Button variant="ghost" size="2xs" iconOnly icon={ExpandIcon} label={label ? fill(words.fullTextOf, { label }) : words.fullText} tooltip={words.fullText} tabIndex={-1} aria-haspopup="dialog" aria-keyshortcuts="F2" data-plx-full-text="" onClick={(event) => { const cell = (event.currentTarget as HTMLElement).closest('[role=gridcell]') as HTMLElement | null; if (cell) cell.focus(); setFullText(mine); }} /></span> : null}
      {open ? <Rare part="fullTextDialog" args={{ label, text, onClose: close }} /> : null}
    </>
  );
}
