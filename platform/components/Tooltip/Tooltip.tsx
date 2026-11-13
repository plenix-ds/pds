/* Plenix · Tooltip
   Summary: A short label for a control, shown on hover, on keyboard focus and, on touch, on a long press. The rich
     tooltip (09 Overlays › Contextual overlays › Rich tooltip) adds a title, a few sentences and, as a toggletip, one action.
   Usage:
     <Tooltip content="Upload files" placement="bottom"><Button …/></Tooltip>
     <Tooltip title="Retention" content="Deleted files stay in the trash for 30 days."><Button …/></Tooltip>
     <Tooltip title="Smart crop" content="…" action={<Link href="#crop" variant="standalone">About smart crop</Link>}><Button …/></Tooltip>
   Props:
     content: the tooltip text (in a rich tooltip, its body: one to three sentences)
     placement: "bottom" (default) | "top" | "start" | "end" (start and end follow the writing direction)
     title: a short title above the body; it makes the tooltip rich
     action: an element: one action under the body (a standalone Link, or a small Button); it makes the tooltip rich and a toggletip:
       it opens on click (Enter or Space on the trigger) instead of on hover and focus
     rich: the rich look without a title or an action (default false; true when title or action is given)
     describe: false keeps the tooltip from describing the trigger (no aria-describedby) and hides the bubble from assistive technology (aria-hidden; sighted users still see it) when the trigger's own name already says the same text, as a cut heading's or label's
       full text does, so a screen reader does not read it twice (default true)
     disabled: the tooltip neither shows nor describes the trigger (default false); for a label that is shown in full most of
       the time and only needs its tooltip when it is cut short
     className: more classes on the wrapper
     children: the control it labels (one element)
   Behavior:
     It shows on hover (a mouse or a pen) and on keyboard focus, and hides on leave, on blur and with Escape. Inside a
       TooltipFocusScope (internal: a Field's cut label) focus anywhere in the scope's element shows it too.
     On touch there is no hover (Platforms Standard 6.5): a long press (--plx-comp-tooltip-long-press-delay) shows it, and
     it hides --plx-comp-tooltip-touch-dismiss-delay after the finger lifts, or when the finger moves away or is cancelled.
     A tap does not show it (focus that follows a touch is ignored; mouse events emulated from touch are not listened to),
     and the long press neither opens the browser's context menu nor activates the control (the click that may follow the
     release is dropped): a long press asks what a control is, it does not use it.
     The trigger is described by the tooltip (aria-describedby), added to any it already has.
     Placement: where the browser has CSS anchor positioning (utils/floating.ts) the bubble is placed against the trigger by
       useFloating while it shows (offset sm), so no scroll area or pane clips it; elsewhere it is drawn inside the wrapper
       on its side, as before. A tooltip with an arrow keeps its side; a rich tooltip (no arrow) flips and shifts to stay in
       the window.
     Rich: a text-only rich tooltip opens on hover and focus like a plain one and stays open while the pointer is over it
       (it hides --plx-comp-tooltip-rich-close-delay after the pointer leaves both). With an action it is a toggletip: the
       trigger toggles it (aria-expanded, aria-controls), Tab from the trigger reaches the action, and Escape, a click
       outside or focus leaving it closes it (Escape returns focus to the trigger); a tap opens it on touch.
   Notes:
     An icon-only Button shows its name (and its shortcut) as a tooltip by itself; inside a Tooltip it leaves that to the
       Tooltip (InTooltip), so a control never gets two.
     An icon-only control still needs its own label (aria-label): the tooltip repeats it visually, it is never the only
     way to learn the control's name.
     Not for essential content. Only the rich tooltip holds an action, and then it opens on click: interactive content never
     depends on hover.
     The rich surface is the popover's (the overlay surface with its border, radius and shadow), with no arrow.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { elementMs as ms } from '../../utils/tokenTime.ts';
import { useFloating, FLOATING_ANCHOR } from '../../utils/floating.ts';
import { useDescriptionId, useDescribedBy } from '../../utils/describedBy.ts';

const SIDES = ['bottom', 'top', 'start', 'end'];
type Timer = ReturnType<typeof setTimeout>;

// true inside a Tooltip's trigger: a Button there does not add its own (an icon-only Button shows its name by itself)
export const InTooltip = React.createContext(false);

// the last way the person reached for the page: a touch, or a mouse, pen or key. Focus that follows a tap does not open
// the tooltip (a long press does); focus that follows a key does. One listener pair for every tooltip, added by the first.
let lastInput = 'key', listening = false;
const listen = () => {
  if (listening) return; listening = true;
  document.addEventListener('pointerdown', (e) => { lastInput = e.pointerType === 'touch' ? 'touch' : 'pointer'; }, true);
  document.addEventListener('keydown', () => { lastInput = 'key'; }, true);
};

// an element around the trigger whose focus also shows the tooltip (internal; not part of the public API): a Field gives its own element,
// so a cut label's full text shows while its control has focus, with no new tab stop (issue 1337). Escape still closes it.
export const TooltipFocusScope = React.createContext<React.RefObject<HTMLElement | null> | null>(null);
// the props Tooltip reads from, and puts on, its one child (the trigger)
type TriggerProps = { 'aria-describedby'?: string; onClick?: (e: React.MouseEvent<HTMLElement>) => void };
export type TooltipProps = {
  content?: React.ReactNode;
  placement?: 'bottom' | 'top' | 'start' | 'end';
  title?: React.ReactNode;
  action?: React.ReactNode;
  rich?: boolean;
  disabled?: boolean;
  describe?: boolean;
  className?: string;
  /** the trigger: one element */
  children: React.ReactElement;
};
export function Tooltip({ content, placement = 'bottom', title, action, rich = false, disabled = false, describe = true, className, children }: TooltipProps) {
  const id = useDescriptionId('tt');   // plx-tt<id> (utils/describedBy.ts)
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef<HTMLSpanElement>(null);
  const bubble = React.useRef<HTMLSpanElement>(null);
  const press = React.useRef<Timer | null>(null);     // the long-press timer
  const hide = React.useRef<Timer | null>(null);      // the timer that hides a tooltip a long press (or a rich tooltip's leave) started
  const pressed = React.useRef(false);  // this touch opened the tooltip by a long press
  const isRich = !!(rich || title || action);
  const toggle = !!action;              // a toggletip: opened by a click on the trigger
  const side = SIDES.indexOf(placement) >= 0 ? placement : 'bottom';
  const clear = () => { clearTimeout(press.current as Timer); clearTimeout(hide.current as Timer); };
  React.useEffect(() => { listen(); return clear; }, []);
  // placed against the trigger by anchor positioning while it shows; the arrow keeps its side (no flip, no shift)
  useFloating(wrap, bubble, { open: open && !disabled && FLOATING_ANCHOR, placement: side, offset: 'sm', flip: isRich, shift: isRich });
  React.useEffect(() => {
    if (!open) return undefined;
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const inside = wrap.current && wrap.current.contains(document.activeElement);
      setOpen(false);
      // a toggletip gives focus back to its trigger when Escape closes it from inside
      if (toggle && inside && wrap.current!.firstElementChild && (wrap.current!.firstElementChild as HTMLElement).focus) (wrap.current!.firstElementChild as HTMLElement).focus();
    };
    const outside = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', esc);
    if (toggle) document.addEventListener('mousedown', outside);
    return () => { document.removeEventListener('keydown', esc); document.removeEventListener('mousedown', outside); };
  }, [open, toggle]);
  // focus anywhere in the scope (TooltipFocusScope) opens the tooltip, as focus on the trigger does; leaving the scope closes it
  const scope = React.useContext(TooltipFocusScope);
  React.useEffect(() => {
    const el = scope && scope.current;
    if (!el || disabled || toggle) return undefined;
    const enter = () => { if (lastInput !== 'touch') setOpen(true); };
    const leave = (e: FocusEvent) => { if (!el.contains(e.relatedTarget as Node | null)) setOpen(false); };
    el.addEventListener('focusin', enter); el.addEventListener('focusout', leave);
    return () => { el.removeEventListener('focusin', enter); el.removeEventListener('focusout', leave); setOpen(false); };
  }, [scope, disabled, toggle]);
  const child = React.Children.only(children) as React.ReactElement<TriggerProps>;
  const describedBy = useDescribedBy(child.props['aria-describedby'], id);
  const described = describe ? { 'aria-describedby': describedBy } : {};   // describe={false}: the trigger's own name is the same text, so it is not described by it again
  const trigger = disabled ? child : React.cloneElement(child, toggle ? Object.assign(described, {
    'aria-expanded': open, 'aria-controls': open ? id + 'b' : undefined,
    onClick: (e: React.MouseEvent<HTMLElement>) => { if (child.props.onClick) child.props.onClick(e); setOpen(!open); },
  }) : described);
  if (disabled) return <span className={cx('plx-tooltip', className)}><InTooltip.Provider value>{trigger}</InTooltip.Provider></span>;
  const onPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== 'touch' || toggle) return;
    clear(); pressed.current = false;
    press.current = setTimeout(() => { pressed.current = true; setOpen(true); }, ms(wrap.current, '--plx-comp-tooltip-long-press-delay'));
  };
  const onPointerEnd = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== 'touch' || toggle) return;
    clearTimeout(press.current as Timer);
    if (pressed.current) hide.current = setTimeout(() => { setOpen(false); pressed.current = false; }, e.type === 'pointercancel' ? 0 : ms(wrap.current, '--plx-comp-tooltip-touch-dismiss-delay'));
  };
  const onEnter = (e: React.PointerEvent<HTMLSpanElement>) => { if (e.pointerType === 'touch' || toggle) return; clearTimeout(hide.current as Timer); setOpen(true); };
  const onLeave = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType === 'touch' || toggle) return;
    // a rich tooltip waits a moment, so the pointer can move into it; a plain one hides at once
    if (isRich) { clearTimeout(hide.current as Timer); hide.current = setTimeout(() => setOpen(false), ms(wrap.current, '--plx-comp-tooltip-rich-close-delay')); }
    else setOpen(false);
  };
  const bubbleCls = cx('plx-tooltip__bubble', 'plx-tooltip__bubble--' + side, isRich && 'plx-tooltip__bubble--rich', open && 'is-open');
  return (
    <span ref={wrap} className={cx('plx-tooltip', className)}
      onPointerEnter={onEnter} onPointerLeave={onLeave}
      onPointerDown={onPointerDown} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}
      onContextMenu={(e) => { if (pressed.current) e.preventDefault(); }}
      onClickCapture={(e) => { if (pressed.current) { e.preventDefault(); e.stopPropagation(); pressed.current = false; } }}
      onFocus={() => { if (!toggle && lastInput !== 'touch') setOpen(true); }}
      onBlur={(e) => { if (!pressed.current && !(wrap.current && wrap.current.contains(e.relatedTarget as Node | null))) setOpen(false); }}>
      <InTooltip.Provider value>{trigger}</InTooltip.Provider>
      {isRich ? (
        <span ref={bubble} id={id + 'b'} className={bubbleCls} aria-hidden={describe ? undefined : true}>
          <span role="tooltip" id={id} className="plx-tooltip__content">
            {title ? <span className="plx-tooltip__title">{title}</span> : null}
            <span className="plx-tooltip__body">{content}</span>
          </span>
          {action ? <span className="plx-tooltip__action">{action}</span> : null}
        </span>
      ) : <span ref={bubble} role="tooltip" id={id} className={bubbleCls} aria-hidden={describe ? undefined : true}>{content}</span>}
    </span>
  );
}
