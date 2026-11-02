/* Plenix · Popover
   Summary: A small non-modal surface anchored to its trigger that shows related content or a few controls in context:
     a short form, a filter, details or an explanation (09 Overlays › Contextual overlays › Popover; also Popup, Inline
     dialog and, opened on hover, Hover card). It opens in the browser's top layer and is placed beside the trigger by CSS
     anchor positioning (utils/floating.ts), so no card, pane or scroll area can cover or clip it.
   Usage:
     <Popover trigger={<Button caret>Filter</Button>} title="Filter">…</Popover>
     <Popover trigger={<Button>Share</Button>} title="Share" footer={<Button variant="primary" size="sm">Send</Button>} closeButton>…</Popover>
     <Popover trigger={<Link href="/people/maya">Maya Chen</Link>} triggerOn="hover" label="Maya Chen" size="sm">…</Popover>
     <Popover trigger={target} triggerOn="manual" open={open} onOpenChange={setOpen} arrow placement="bottom">…</Popover>
   Props:
     trigger: the element that opens it (one element; it gets the ref, and for a click popover aria-haspopup="dialog",
       aria-expanded and aria-controls)
     triggerOn: "click" (default: click, Enter or Space on the trigger) | "hover" (a hover card: opens after
       --plx-comp-popover-hover-open-delay on pointer hover and on keyboard focus, and stays open while the pointer is in
       it) | "manual" (only the open prop opens it: a teaching bubble pointing at its target)
     open, defaultOpen: whether it is open (controlled) or opens at first (default false)
     onOpenChange(open): runs when it opens or closes
     title: the title in its header; it names the popover
     label: the accessible name when there is no title
     footer: a row of actions at the bottom, at the end edge
     closeButton: a Close button at the end of the header (default false; Escape and a click outside always close it)
     placement: where it sits against the trigger: "bottom-start" (default) | "bottom" | "bottom-end" | "top" | "top-start"
       | "top-end" | "start" | "start-top" | "start-bottom" | "end" | "end-top" | "end-bottom" (start and end follow the
       writing direction)
     size: "md" (default; 320px wide) | "sm" (240px) | "lg" (400px) | "auto" (as wide as its content); never wider than
       the window less its margins
     arrow: a caret on the edge that faces the trigger, pointing at it (default false)
     role: "dialog" (default) | "alertdialog" (a question that needs an answer: Popconfirm) | null (a disclosure panel of
       links, MegaMenu: no popup role, and the trigger is a plain disclosure button with aria-expanded)
     initialFocus: a ref to the element that takes focus when it opens (default: the first control in its body, else its
       first control (Close, a footer action), else the popover)
     focusOnOpen: focus moves into it when it opens (default true for a click popover, false for hover and manual)
     sheetOnNarrow: at the Narrow window class a click popover opens as a bottom Sheet instead (default true; a hover
       card never does)
     strings: the words it shows and announces, for other languages: { close: "Close" }
     className: more classes on the popover
     anchorClassName: a layout class for the anchor (the trigger's box in the page): its owner's placement of it (DatePicker, TreeSelect)
     children: the content
     Other props pass through to the popover's <div> (aria-describedby).
   Behavior:
     Click: the trigger opens and closes it; focus moves into it (initialFocus, else the first control in its body, else
       its first control, else the popover) and returns to the trigger when Escape closes it, or when it closes while
       focus is inside it (Close, an action). Escape, a click outside, and Tab out of it close it. It is not modal: the
       page stays usable and focus is not trapped.
     Hover: opens after the open delay on pointer hover, and at once on keyboard focus of the trigger; closes
       --plx-comp-popover-hover-close-delay after the pointer leaves both, on blur, and with Escape. Touch has no hover:
       a tap follows the trigger (a link), so a hover card holds nothing that is only there.
     Manual: opens and closes only by the open prop (a click outside does not close it); Escape asks to close it
       (onOpenChange(false)) and returns focus to the trigger.
     Placement: by CSS anchor positioning it flips to the other side and shifts its alignment to stay in the window, and
       follows the trigger on scroll and resize; without it, it is drawn inside the trigger's wrapper on its side. With an
       arrow it keeps its side and alignment, so the arrow always points at the trigger.
     At the Narrow window class (under --plx-sys-shell-phone-below) a click popover is a bottom Sheet: the same title,
       content and footer, modal, with the sheet's own close.
   Notes:
     One popover at a time; never a popover inside a popover. A hint of a few words is a Tooltip; a decision that blocks
       the task is a Dialog. Popovers are border-only with the menu shadow (as Menu).
     ContextualHelp, Popconfirm, TeachingBubble and MegaMenu are built on it.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { elementMs as ms } from '../../utils/tokenTime.ts';
import { focusables, useLayer, useUid } from '../../utils/layer.ts';
import { useFloating, PLACEMENTS, TOP_LAYER } from '../../utils/floating.ts';
import type { FloatingPlacement } from '../../utils/floating.ts';
import { Button } from '../Button/Button.tsx';
import { Sheet } from '../Sheet/Sheet.tsx';
import { useMedia, below } from '../../patterns/AppShell/AppShell.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import CloseIcon from 'plenix-platform/icons/plenix/close';

const SIZES = ['sm', 'md', 'lg', 'auto'];



// what Popover reads from, and gives, its trigger
type PopoverTriggerProps = { onClick?: (e: React.MouseEvent<HTMLElement>) => void };
export type PopoverProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'role'> & {
  /** the element that opens it: one element */
  trigger: React.ReactElement;
  /** "click" (a dialog), "hover" (a hover card) or "manual" (open and onOpenChange only) */
  triggerOn?: 'click' | 'hover' | 'manual';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  /** its accessible name when there is no title */
  label?: string;
  footer?: React.ReactNode;
  closeButton?: boolean;
  placement?: FloatingPlacement;
  size?: 'sm' | 'md' | 'lg' | 'auto';
  arrow?: boolean;
  /** "dialog" (default), or null for no role */
  role?: string | null;
  /** what takes focus when it opens */
  initialFocus?: React.RefObject<HTMLElement | null>;
  focusOnOpen?: boolean;
  /** a bottom sheet on a narrow screen (click popovers) */
  sheetOnNarrow?: boolean;
  strings?: Catalog | null;
  /** more classes on the anchor wrapper */
  anchorClassName?: string;
};
export function Popover({ trigger, triggerOn = 'click', open: openProp, defaultOpen = false, onOpenChange, title, label, footer, closeButton = false,
  placement = 'bottom-start', size = 'md', arrow = false, role = 'dialog', initialFocus, focusOnOpen, sheetOnNarrow = true, strings, className, anchorClassName, children, ...rest }: PopoverProps) {
  devWarn('Popover', { size }, { size: ['md','sm','lg','auto'] });
  const t = useStrings('popover', strings) as { close: string };
  const id = useUid('plx-popover');
  const controlled = openProp !== undefined;
  const [own, setOwn] = React.useState(!!defaultOpen);
  const open = controlled ? !!openProp : own;
  const setOpen = React.useCallback((v: boolean) => { if (!controlled) setOwn(v); if (onOpenChange) onOpenChange(v); }, [controlled, onOpenChange]);
  const wrap = React.useRef<HTMLSpanElement>(null), panel = React.useRef<HTMLDivElement>(null), anchor = React.useRef<HTMLElement | null>(null), timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hover = triggerOn === 'hover', click = triggerOn === 'click';
  const narrow = useMedia(below('--plx-sys-shell-phone-below'));
  const asSheet = click && sheetOnNarrow && narrow;
  const floating = open && !asSheet;
  const where = PLACEMENTS.indexOf(placement) >= 0 ? placement : 'bottom-start';
  const { placement: used } = useFloating(anchor, panel, { open: floating, placement: where, offset: arrow ? 'md' : 'xs', flip: !arrow, shift: !arrow });
  const [side, align] = used.split('-');

  const close = React.useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus && anchor.current && anchor.current.focus) anchor.current.focus();
  }, [setOpen]);
  useLayer(panel, floating, { onEscape: () => close(!hover) });

  // into the top layer as soon as it is in the page, before focus moves in
  React.useLayoutEffect(() => { const el = panel.current; if (floating && TOP_LAYER && el && el.showPopover && !el.matches(':popover-open')) el.showPopover(); }, [floating]);
  // a click popover takes focus (and a manual one that asks for it); a click outside closes a click popover
  const takeFocus = focusOnOpen !== undefined ? !!focusOnOpen : click;
  React.useEffect(() => {
    if (!floating) return undefined;
    if (takeFocus) {
      const root = panel.current as HTMLDivElement;
      const wanted = initialFocus && initialFocus.current;
      const first = wanted || focusables(root.querySelector('.plx-popover__body'))[0] || focusables(root)[0] || root;
      if (first) first.focus({ preventScroll: true });
    }
    if (!click) return undefined;
    const outside = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, [floating]);
  React.useEffect(() => () => clearTimeout(timer.current as ReturnType<typeof setTimeout>), []);
  // closed while focus was inside it (Close, an action, the open prop): focus goes back to the trigger, not the page
  const inside = React.useRef(false);
  React.useEffect(() => {
    if (floating || !inside.current) return;
    inside.current = false;
    const a = document.activeElement;
    if ((!a || a === document.body) && anchor.current && anchor.current.focus) anchor.current.focus();
  }, [floating]);

  // the hover card's timers: open after the open delay, close after the close delay (cancelled by coming back)
  const later = (v: boolean) => {
    clearTimeout(timer.current as ReturnType<typeof setTimeout>);
    const el = wrap.current;
    timer.current = setTimeout(() => setOpen(v), ms(el, v ? '--plx-comp-popover-hover-open-delay' : '--plx-comp-popover-hover-close-delay'));
  };
  const hoverProps: React.HTMLAttributes<HTMLSpanElement> = hover ? {
    onPointerEnter: (e) => { if (e.pointerType !== 'touch') later(true); },
    onPointerLeave: (e) => { if (e.pointerType !== 'touch') later(false); },
    onFocus: (e) => { if (e.target === anchor.current && e.target.matches(':focus-visible')) { clearTimeout(timer.current as ReturnType<typeof setTimeout>); setOpen(true); } },
    onBlur: (e) => { if (!wrap.current!.contains(e.relatedTarget as Node | null)) { clearTimeout(timer.current as ReturnType<typeof setTimeout>); setOpen(false); } },
  } : click ? {
    // Tab out of the popover (or the trigger) to somewhere else closes it; a click on its text does not (no related target)
    onBlur: (e) => { if (floating && e.relatedTarget && !wrap.current!.contains(e.relatedTarget as Node)) setOpen(false); },   // the sheet is a portal: not while it shows
  } : {};

  const child = React.Children.only(trigger) as React.ReactElement<PopoverTriggerProps>;
  const triggerEl = React.cloneElement(child, click ? {
    ref: anchor, 'aria-haspopup': role ? 'dialog' : undefined, 'aria-expanded': open, 'aria-controls': open ? id : undefined, expanded: undefined,
    onClick: (e: React.MouseEvent<HTMLElement>) => { if (child.props.onClick) child.props.onClick(e); setOpen(!open); },
  } as Record<string, unknown> : { ref: anchor });

  const s = SIZES.indexOf(size) >= 0 ? size : 'md';
  const titleId = id + 't';
  const header = title || closeButton ? (
    <div className="plx-popover__header">
      {title ? <h2 id={titleId} className="plx-popover__title">{title}</h2> : null}
      {closeButton ? <Button variant="ghost" size="xs" iconOnly icon={CloseIcon} label={t.close} className="plx-popover__close" onClick={() => close(true)} /> : null}
    </div>
  ) : null;

  return (
    <span ref={wrap} className={cx('plx-popover-anchor', anchorClassName)} {...hoverProps}>
      {triggerEl}
      {floating ? (
        <div ref={panel} id={id} role={role || undefined} aria-labelledby={role && title ? titleId : undefined} aria-label={role && !title ? label : undefined} tabIndex={-1}
          popover={TOP_LAYER ? 'manual' : undefined} data-plx-popover-side={side} data-plx-popover-align={align || 'center'}
          className={cx('plx-popover', 'plx-popover--' + s, arrow && 'plx-popover--arrow', hover && 'plx-popover--hover', className)}
          onFocus={() => { inside.current = true; }} onBlur={(e) => { inside.current = !!(panel.current && panel.current.contains(e.relatedTarget as Node | null)); }} {...rest}>
          {arrow ? <span className={cx('plx-popover__arrow', 'plx-popover__arrow--' + side, 'plx-popover__arrow--' + (side === 'top' || side === 'bottom' ? 'inline-' + (align || 'center') : 'block-' + (({ top: 'start', bottom: 'end' } as Record<string, string>)[align] || 'center')))} aria-hidden="true" /> : null}
          {header}
          <div className="plx-popover__body">{children}</div>
          {footer ? <div className="plx-popover__footer">{footer}</div> : null}
        </div>
      ) : null}
      {asSheet ? <Sheet open={open} onClose={() => setOpen(false)} title={title || label} footer={footer} form="bottom" initialFocus={initialFocus} closeLabel={t.close}>{children}</Sheet> : null}
    </span>
  );
}
