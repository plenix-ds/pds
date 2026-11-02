/* Plenix · SegmentedControl
   Summary: One choice from a few short options, shown together (S | M | L; Light | Dark | System): a bordered group of
     joined segments at the button height; the chosen one is tinted blue with blue text and icon (look A, owner, 2026-10-14).
     It sets a value (a radio group).
   Usage:
     <SegmentedControl label="Theme" value={theme} onChange={setTheme}
       options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }]} />
   Props:
     options: the choices, in order: [{ value, label, icon, ariaLabel }]
     options[].icon: an icon name; optional
     options[].ariaLabel: the accessible name of an icon-only option; default its value
     value: the chosen value
     onChange(value): runs when another option is chosen
     label: the group's accessible name
     size: "md" (default) | "sm"
     className: more classes on the group
     fold: "auto" (default) | "never"
     readOnly: shows the chosen option and does not let it change; default the nearest ReadOnly region's (useReadOnly)
     ...rest: other attributes go on the group element
   Behavior:
     Read-only: the options keep their place and focus (the chosen one is the Tab stop), but a click, the arrow keys, Home and End
       do not choose another option; the group is marked aria-readonly. Folded into the drop-down list, the Select is read-only too.
     Arrow keys move to the next or previous option and choose it, wrapping around; Home and End go to the first and last.
     Only the chosen option is in the Tab order.
     When the options do not fit their room, the control becomes a drop-down list (Select) with the same options, value
       and onChange; it comes back once the room is wide enough. The room is measured, never a fixed breakpoint: the
       control's own width, plus the free space of a row it sits in. fold="never" keeps the segments.
   Notes:
     To switch between panels of content, use Tabs (variant "segmented").
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { arrowStep } from '../../utils/direction.ts';
import { cx } from '../../utils/cx.ts';
import { useReadOnly } from '../../providers/ReadOnly.tsx';
import { stateIcon } from '../Icon/Icon.tsx';
import type { IconValue } from '../Icon/Icon.tsx';
import { Select } from '../Input/Input.tsx';

/* the room the control may take: its frame's width, plus the free space left in a flex row it sits in (the frame takes
   its content's width there, so a folded control alone could never see the room come back) */
function roomOf(frame: HTMLElement): number {
  const width = frame.getBoundingClientRect().width, parent = frame.parentElement;
  if (!parent) return width;
  const cs = getComputedStyle(parent);
  if (!/flex/.test(cs.display) || /column/.test(cs.flexDirection)) return width;
  const inner = parent.clientWidth - parseFloat((cs.paddingLeft || 0) as string) - parseFloat((cs.paddingRight || 0) as string);
  const kids = Array.prototype.filter.call(parent.children, (el: Element) => { const k = getComputedStyle(el); return k.display !== 'none' && k.position !== 'absolute' && k.position !== 'fixed'; });
  const used = (kids as Element[]).reduce((n, el) => { const k = getComputedStyle(el); return n + el.getBoundingClientRect().width + parseFloat((k.marginLeft || 0) as string) + parseFloat((k.marginRight || 0) as string); }, 0);
  const gap = (parseFloat(cs.columnGap) || 0) * Math.max(0, kids.length - 1);
  return width + Math.max(0, inner - used - gap);
}

/* folded: true while the segments' own width is more than the room. The segments' width is measured while they show and
   kept while folded; a change of options or size unfolds to measure again. */
function useFold(frameRef: React.RefObject<HTMLDivElement | null>, groupRef: React.RefObject<HTMLDivElement | null>, key: string, enabled: boolean): boolean {
  const [folded, setFolded] = React.useState(false);
  const natural = React.useRef(0);
  React.useLayoutEffect(() => { natural.current = 0; setFolded(false); }, [key]);
  const check = React.useCallback(() => {
    const frame = frameRef.current;
    if (!frame || !enabled) return;
    const group = groupRef.current;
    if (group) natural.current = group.scrollWidth;
    if (!natural.current) return;
    setFolded(natural.current > roomOf(frame) + 0.5);
  }, [enabled]);
  React.useLayoutEffect(check);
  React.useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || !enabled || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(check);
    ro.observe(frame); if (frame.parentElement) ro.observe(frame.parentElement);
    // the segments' own size too: it changes when the font arrives after the first measure
    if (groupRef.current) ro.observe(groupRef.current);
    return () => ro.disconnect();
  }, [check, enabled, folded]);
  return enabled && folded;
}

export type SegmentedOption = { value: string | number; label?: React.ReactNode; icon?: IconValue; ariaLabel?: string };
export type SegmentedControlProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  options: SegmentedOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  /** the accessible name of the group */
  label?: string;
  size?: 'md' | 'sm';
  /** "auto": a Select when the segments do not fit; "never" */
  fold?: 'auto' | 'never';
  readOnly?: boolean;
};
export function SegmentedControl({ options, value, onChange, label, size = 'md', fold = 'auto', readOnly, className, ...rest }: SegmentedControlProps) {
  devWarn('SegmentedControl', { size, fold }, { size: ['md','sm'], fold: ['auto','never'] });
  const locked = useReadOnly(readOnly);
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const frame = React.useRef<HTMLDivElement>(null), group = React.useRef<HTMLDivElement>(null);
  const folded = useFold(frame, group, size + '|' + options.map((o) => String(o.value) + ':' + (o.label || '') + ':' + (o.icon || '')).join('|'), fold !== 'never');
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const move = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n: number | null = null;
    const step = arrowStep(e, e.currentTarget);   // in reading order: right to left reverses Left and Right (batch 213)
    if (step > 0) n = (i + 1) % options.length;
    if (step < 0) n = (i - 1 + options.length) % options.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = options.length - 1;
    if (n === null) return;
    e.preventDefault();
    if (locked) return;   // read-only: the keys move nothing and choose nothing
    onChange(options[n].value); if (refs.current[n]) refs.current[n]!.focus();
  };
  if (folded) {
    const at = options.findIndex((o) => o.value === value);
    return (
      <div ref={frame} className="plx-segmented-fit">
        <Select aria-label={label} size={size} className={className} value={String(Math.max(0, at))}
          options={options.map((o, i) => ({ value: String(i), label: o.label || o.ariaLabel || String(o.value) }))}
          readOnly={locked || undefined} onChange={(e) => { if (!locked) onChange(options[+e.target.value].value); }} {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)} />
      </div>
    );
  }
  const segments = (
    <div ref={group} role="radiogroup" aria-label={label} aria-readonly={locked || undefined} className={cx('plx-segmented', size === 'sm' && 'plx-segmented--sm', className)} {...rest}>
      {options.map((o, i) => (
        <button key={o.value} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" aria-checked={o.value === value} tabIndex={i === index ? 0 : -1}
          aria-label={o.icon && !o.label ? o.ariaLabel || String(o.value) : undefined}
          className={cx('plx-segmented__item', size === 'sm' && 'plx-segmented__item--sm', o.value === value && 'is-selected')} onClick={() => { if (!locked) onChange(o.value); }} onKeyDown={(e) => move(e, i)}>
          {o.icon ? stateIcon(o.icon, o.value === value) : null}{o.label ? <span>{o.label}</span> : null}
        </button>
      ))}
    </div>
  );
  return fold === 'never' ? segments : <div ref={frame} className="plx-segmented-fit">{segments}</div>;
}
