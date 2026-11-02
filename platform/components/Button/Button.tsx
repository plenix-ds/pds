/* Plenix · Button, ButtonGroup
   Summary: A button for an action, in one of several emphasis levels and sizes; ButtonGroup joins buttons that act as a set.
   Usage:
     <Button variant="primary" icon="save" onClick={() => …}>Save</Button>
     <Button iconOnly icon="more_horiz" label="More actions" caret expanded={open} />
     <ButtonGroup label="Transfer"><Button>Import</Button><Button>Export</Button></ButtonGroup>
   Props:
     variant: "secondary" (default; white with a border, reversible actions) | "primary" (filled; the main action, usually one
       per view) | "tertiary" (outlined in the action color, no fill; fills on hover) | "ghost" (no fill or border until
       hovered, when its icon turns the action color; the lowest emphasis) | "danger" (filled red; destructive) | "danger-secondary"
       (red outline, fills on hover). There is no link look: a link goes somewhere (Link), a button does something
     truncate: the label fills the button from its start edge and ends in an ellipsis (a long choice)
     stackedLabel: the label’s lines stack, start-aligned and wrapping; the gap is --plx-comp-button-context-label-gap (SuggestedAction)
     labelRow: the label lays out a row of its own (an avatar and a name); the gap is
       --plx-comp-button-context-label-row-gap (AppHeader’s account)
     joined: { start, end }: "square" | "seam": its corners square where it meets a neighbor; a seam also drops that border (ButtonGroup, InputGroup and CopyButton set it)"md" (default; the standard control role) | "sm" (the toolbar role: compact text, gray) | "xs" (the inline-action
       role: dense row and card actions, never in a toolbar) | "2xs" (the smallest: "Show more" under a list; 11px text, a blue
       tint on hover) | "lg" (the prominent role: page actions)
     icon: an <Icon> (or an icon name) before the label
     iconEnd: an <Icon> (or an icon name) after the label
     iconOnly: a square button with only its icon; give it a label (default false)
     label: the accessible name (aria-label); an icon-only button falls back to string children
     tooltip: the tooltip it shows (default: an icon-only button shows its label; others none); false: none (Carbon,
       Atlassian: every icon-only button names itself). Inside a Tooltip the button leaves it to that Tooltip
     shortcut: its keyboard shortcut, as a hotkey binding ("Mod+Shift+A"): shown in its tooltip as keys (Ctrl or ⌘) and set as
       aria-keyshortcuts. It only shows the shortcut: bind it with useHotkey
     caret: the button opens a menu: the thin outline chevron (expand_more) after the label, in the muted color on the
       unfilled variants (owner, 2026-10-14: it replaces the small filled triangle); default false
     expanded: sets aria-expanded, for a button that opens a menu
     pressed: makes a toggle button (aria-pressed): true when on, false when off (undefined: not a toggle)
     tone: "success" | "danger" | "neutral": the chosen state (pressed or selected) fills in that feedback color (green, red,
       gray) instead of the selected gray; the rest state stays the variant's, so a choice not taken is the plain button
       (owner, vote-screen-37: a vote's Approve, Deny and Abstain). Default none
     selected: shows the selected state without a toggle role (default false)
     loading: shows a spinner in place of the icon (default false)
     disabled: the button does nothing (default false)
     href: renders a link styled as a button
     type: the button type (default "button")
     onClick(event): runs when the button is clicked, unless disabled or loading
     children: the button label
     className: more classes on the button
     strings: the words it announces, for other languages: { working: "Working" } (the loading spinner's name)
     ref: forwarded to the <button> or <a>
     ButtonGroup.label: the accessible name of the group
     ButtonGroup.children: the buttons
     ButtonGroup.className: more classes on the group
   Behavior:
     Placement can also set the role: a dialog footer gives its buttons the dialog role.
     Selected, pressed and expanded all show the selected state.
     A toggle button (pressed true or false) keeps its label and icon when it turns on or off: the label names the option
       (Bold, Show grid), aria-pressed says whether it is on, and every variant shows "on" with the selected state.
     Loading keeps the width and the name, and stays focusable but inert (aria-disabled, aria-busy): the spinner takes the
       icon's place, or, with no icon, sits over the label, which stays (unseen) to hold the width and name the button.
     A disabled link loses its href.
   Notes:
     Other props pass through to the <button> or <a> (and to ButtonGroup's <div>).
     For one choice from several, use SegmentedControl instead of ButtonGroup.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { Icon, stateIcon } from '../Icon/Icon.tsx';
import type { IconModule } from '../Icon/Icon.tsx';
import { Spinner } from '../Loading/Loading.tsx';
import { SurfaceContext } from '../../providers/Surface.tsx';
import { Tooltip, InTooltip } from '../Tooltip/Tooltip.tsx';
import { Kbd } from '../Kbd/Kbd.tsx';
import { parseHotkey, hotkeyLabel } from '../../utils/hotkey.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';

const TONES = ['success', 'danger', 'neutral'];

// the icon takes the button's state as its own (Styling Standard 3.6): filled while the button is selected, pressed or
// open; an Icon element the caller gives keeps its own fill when it sets one

// a one-step binding as aria-keyshortcuts ("Control+Shift+A"); a sequence has no ARIA form, so none
const ARIA_MODS: Array<['ctrl' | 'alt' | 'shift' | 'meta', string]> = [['ctrl', 'Control'], ['alt', 'Alt'], ['shift', 'Shift'], ['meta', 'Meta']];
const ariaShortcut = (binding: string) => {
  const steps = parseHotkey(binding);
  if (steps.length !== 1 || !steps[0].key) return undefined;
  const k = steps[0].key;
  return ARIA_MODS.filter(([m]) => steps[0][m]).map(([, n]) => n).concat(k.length === 1 ? k.toUpperCase() : k.charAt(0).toUpperCase() + k.slice(1)).join('+');
};

// where two buttons meet in a group, each side's corner: square, or the seam the later button draws
export type ButtonJoined = { start?: 'square' | 'seam'; end?: 'square' | 'seam' };
export type ButtonProps = Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> & {
  variant?: 'secondary' | 'primary' | 'tertiary' | 'ghost' | 'danger' | 'danger-secondary' | 'quiet';
  size?: 'md' | 'sm' | 'xs' | '2xs' | 'lg';
  /** an <Icon>, an icon name or an imported icon module, before the label */
  icon?: React.ReactNode | IconModule;
  /** the same, after the label */
  iconEnd?: React.ReactNode | IconModule;
  iconOnly?: boolean;
  /** the accessible name (aria-label) */
  label?: string;
  caret?: boolean;
  expanded?: boolean;
  pressed?: boolean;
  selected?: boolean;
  tone?: 'success' | 'danger' | 'neutral';
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  /** with href: the name to save the linked file as (the link's download attribute, passed on) */
  download?: string;
  type?: 'button' | 'submit' | 'reset';
  /** the id of the form a submit button belongs to (the button's form attribute, passed on) */
  form?: string;
  joined?: ButtonJoined;
  truncate?: boolean;
  stackedLabel?: boolean;
  labelRow?: boolean;
  /** its tooltip; false: none */
  tooltip?: React.ReactNode;
  /** a hotkey binding ("Mod+Shift+A") */
  shortcut?: string;
  /** read by a Toolbar or ActionBar that folds it into More */
  priority?: 'high' | 'normal' | 'low';
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  strings?: Catalog | null;
};
export const Button = React.forwardRef(function Button({ variant = 'secondary', size = 'md', icon, iconEnd, iconOnly = false, label, caret = false,
  expanded, pressed, selected = false, tone, loading = false, disabled = false, href, type = 'button', joined, truncate = false, stackedLabel = false, labelRow = false, tooltip, shortcut, priority, className, children, onClick, strings, ...rest }: ButtonProps, ref: React.ForwardedRef<HTMLElement>) {   // priority: read by a Toolbar or ActionBar that folds it into More; the Button itself ignores it
  devWarn('Button', { variant, size }, { variant: ['secondary','primary','tertiary','ghost','danger','danger-secondary','quiet'], size: ['md','sm','xs','2xs','lg'] });
  const t = useStrings('button', strings);
  // a colored surface around the button (TeachingBubble, the accent AppHeader) gives it that surface's look
  const surface = React.useContext(SurfaceContext);
  const classes = cx('plx-button', 'plx-button--' + (variant === 'quiet' ? 'ghost' : variant), size !== 'md' && 'plx-button--size-' + size, iconOnly && 'plx-button--icon-only',
    caret && 'plx-button--caret', TONES.includes(tone as string) && 'plx-button--tone-' + tone, (selected || pressed || expanded) && 'is-selected', loading && 'is-loading', truncate && 'plx-button--truncate', stackedLabel && 'plx-button--stacked-label', labelRow && 'plx-button--label-row', joined && joined.start && 'plx-button--joined-start-' + joined.start, joined && joined.end && 'plx-button--joined-end-' + joined.end, joined && (joined.start || joined.end) && 'plx-button--joined', (surface === 'inverse' || surface === 'accent') && 'plx-button--on-' + surface, className);
  // the parts take the button's state as their own classes (Styling Standard 3.6: no rule reaches from the button into them)
  const v = variant === 'quiet' ? 'ghost' : variant;
  const on = !!(selected || pressed || expanded);
  const labelClass = cx('plx-button__label', truncate && 'plx-button__label--truncate', !truncate && stackedLabel && 'plx-button__label--stacked', !truncate && !stackedLabel && labelRow && 'plx-button__label--row');
  const caretClass = cx('plx-button__caret', (v === 'primary' || v === 'danger' || disabled || loading) && 'plx-button__caret--current', expanded && 'plx-button__caret--open');
  const hasLabel = !iconOnly && children !== undefined && children !== null;
  // loading: the spinner takes the icon's place; with no icon it sits over the label, which keeps the width and the name
  // (aria-busy says it is working, so the spinner itself is not read)
  const over = loading && !icon && hasLabel;
  const spinner = (cls: string) => <span className={cls} aria-hidden="true"><Spinner size="sm" label={t.working as React.ReactNode} /></span>;
  const content = (
    <>
      {loading && !over ? spinner('plx-button__icon') : (icon ? <span className="plx-button__icon">{stateIcon(icon, on)}</span> : null)}
      {over ? <span className="plx-button__stack"><span className={cx(labelClass, 'plx-button__label--waiting')}>{children}</span>{spinner('plx-button__icon plx-button__icon--over')}</span>
        : (hasLabel ? <span className={labelClass}>{children}</span> : null)}
      {iconEnd ? <span className="plx-button__icon">{stateIcon(iconEnd, on)}</span> : null}
      {caret ? <span className={caretClass} aria-hidden="true"><Icon icon={ChevronDownIcon} filled={false} /></span> : null}
    </>
  );
  const a11y = { 'aria-label': iconOnly ? (label || (typeof children === 'string' ? children : undefined)) : label, 'aria-expanded': expanded,
    'aria-pressed': pressed, 'aria-disabled': disabled || loading ? true : undefined, 'aria-busy': loading || undefined,
    'aria-keyshortcuts': shortcut ? ariaShortcut(shortcut) : undefined };
  const handle = (e: React.MouseEvent<HTMLElement>) => { if (disabled || loading) { e.preventDefault(); return; } if (onClick) onClick(e); };
  const el = href ? <a ref={ref as React.Ref<HTMLAnchorElement>} href={disabled ? undefined : href} className={classes} {...a11y} onClick={handle} {...rest}>{content}</a>
    : <button ref={ref as React.Ref<HTMLButtonElement>} type={type} className={classes} disabled={disabled && !loading ? true : undefined} {...a11y} onClick={handle} {...rest}>{content}</button>;
  // its tooltip: the name of an icon-only button (or the tooltip it was given), with its shortcut's keys; none inside a
  // Tooltip, which already names it
  const inTooltip = React.useContext(InTooltip);
  const tip = tooltip === false ? null : (tooltip !== undefined ? tooltip : (iconOnly ? a11y['aria-label'] : null));
  if (!tip || inTooltip) return el;
  return <Tooltip content={shortcut ? <>{tip}{' '}<Kbd>{hotkeyLabel(shortcut)}</Kbd></> : tip}>{el}</Tooltip>;
});

/* ButtonGroup: joined buttons that act as a set (Import | Export). For one choice from several, use SegmentedControl. */
export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> & { label?: string };
export function ButtonGroup({ label, className, children, ...rest }: ButtonGroupProps) {
  // its buttons meet: each passes on which of its sides is joined (the later button's start edge is the seam)
  const all = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<{ joined?: ButtonJoined }>[];
  return <div role="group" aria-label={label} className={cx('plx-button-group', className)} {...rest}>{all.map((el, i) => React.cloneElement(el, { joined: { start: i > 0 ? 'seam' : undefined, end: i < all.length - 1 ? 'square' : undefined } }))}</div>;
}
