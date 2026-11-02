/* Plenix · Sheet
   Summary: A short, self-contained task or the details of a selection over the screen (Platforms Standard 4.2 rows 5–6,
     5.2 Supporting pane, 5.3 Sheet task, 6.5 Sheet and inspector). It changes form with the window class: at Narrow a
     bottom sheet at a medium (about half) or large height with a grabber; at Medium a side sheet (the Drawer); at Wide a
     dialog (the Dialog), unless the caller shows a pane there instead.
   Usage:
     <Sheet open={open} onClose={close} title="Rename" onDone={save}>…</Sheet>
     <Sheet open={open} onClose={close} title="Details" detent="large" footer={<…/>}>…</Sheet>
   Props:
     open: whether the sheet is shown
     onClose(): runs from Cancel (or Close), Escape, a click on the scrim and the browser's own dismissal
     title: the title in the header; it names the sheet
     description: a paragraph at the top of the body; it describes the sheet
     icon: an <Icon> (or an icon name) before the title
     onDone(): makes the sheet a task: Cancel on the leading edge of the header, Done on the trailing edge (in the footer
       of the side sheet and the dialog); without it the header ends with Close
     doneLabel: the confirm button's text (default "Done"; Save, Create, Add)
     cancelLabel: the cancel button's text (default "Cancel")
     closeLabel: the accessible name of the Close button (default "Close")
     detent: the bottom sheet's starting height: "medium" (default; about half the window) | "large"
     form: "auto" (default; by the window class) | "bottom" | "side" | "dialog"
     actions: controls at the end of the header, before Done or Close
     footer: a row of actions pinned to the bottom
     initialFocus: a ref to the element that takes focus when the sheet opens
     dismissible: false turns off Escape and the scrim click, and hides Cancel and Close (default true)
     flush: true removes the body padding (default false)
     className: more classes on the sheet
     strings: the words it announces, for other languages: { expand: "Expand sheet", shrink: "Shrink sheet" } (the grabber)
     children: the body
   Behavior:
     Focus moves in (initialFocus, else the first control in the body, else the first footer action), stays inside while
       the sheet is open, and returns to the opener when it closes.
     Escape and a click on the scrim close it, unless dismissible is false.
     The grabber is a button: pressing it moves between the medium and large heights; dragging it up opens the large
       height, dragging it down returns to the medium height or, from there, closes the sheet (the drag is useGesture's pan).
     Only one sheet shows at a time: a sheet opened while another is open shows in its place, and the first returns when
       it closes.
     The page does not scroll while the sheet is open.
   Notes:
     The window classes: Narrow under --plx-sys-shell-phone-below (600px), Medium under --plx-sys-shell-rail-below (840px).
     The side sheet and the dialog are the Drawer and the Dialog (Dialog.tsx); Cancel and Done sit in their footer, after
       the caller's footer actions, Done last (the Action bar rule).
     A caller with a pane at Wide (SidePanel) renders the sheet only below that width and passes form="bottom".
     The bottom sheet keeps the bottom safe area (--plx-sys-safe-area-bottom).
     The layer renders in a portal on document.body.
*/
import React from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.ts';
import { focusables, useLayer, useUid } from '../../utils/layer.ts';
import { asIcon } from '../Icon/Icon.tsx';
import { Button } from '../Button/Button.tsx';
import { Dialog, Drawer } from '../Dialog/Dialog.tsx';
import { useGesture } from '../../hooks/useGesture.ts';
import { useMedia, below } from '../../patterns/AppShell/AppShell.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CloseIcon from 'plenix-platform/icons/plenix/close';


// one sheet at a time (HIG › Sheets): the open sheets in the order they opened; only the last one shows
const openSheets = [];
const listeners = new Set();
const notify = () => listeners.forEach((f) => f());
function useTopSheet(open) {
  const id = React.useId();
  const [, rerender] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => { listeners.add(rerender); return () => { listeners.delete(rerender); }; }, []);
  React.useEffect(() => {
    if (!open) return undefined;
    openSheets.push(id); notify();
    return () => { openSheets.splice(openSheets.indexOf(id), 1); notify(); };
  }, [open]);
  return open && openSheets[openSheets.length - 1] === id;
}

// the window class decides the form: Narrow a bottom sheet, Medium a side sheet, Wide a dialog
function useForm(form) {
  const narrow = useMedia(below('--plx-sys-shell-phone-below'));
  const medium = useMedia(below('--plx-sys-shell-rail-below'));
  if (form && form !== 'auto') return form;
  return narrow ? 'bottom' : medium ? 'side' : 'dialog';
}

export function Sheet({ open, onClose, title, description, icon, onDone, doneLabel, cancelLabel, closeLabel,
  detent = 'medium', form, actions, footer, initialFocus, dismissible = true, flush = false, className, strings, children }) {
  const t = useStrings('sheet', strings);
  doneLabel = doneLabel ?? t.done; cancelLabel = cancelLabel ?? t.cancel; closeLabel = closeLabel ?? t.close;
  const shown = useTopSheet(!!open);
  const kind = useForm(form);
  const bottom = kind === 'bottom';
  const ref = React.useRef(null);
  const id = useUid('plx-sheet');
  const [height, setHeight] = React.useState(detent);
  React.useEffect(() => { if (open) setHeight(detent); }, [open, detent]);
  const firstFocus = () => {
    if (initialFocus && initialFocus.current) return initialFocus.current;
    const root = ref.current;
    return focusables(root.querySelector('.plx-sheet__body'))[0] || focusables(root.querySelector('.plx-sheet__footer'))[0] || null;
  };
  useLayer(ref, shown && bottom, { modal: true, onEscape: dismissible ? onClose : null, initialFocus: firstFocus });
  const task = !!onDone;
  // the grabber's drag (the shared gesture hook; a press is the button's click): a drag of at least half the grabber's height
  // up opens the large height, down returns to the medium height or, from there, closes the sheet; a canceled drag does nothing
  const grabber = React.useRef(null);
  useGesture(grabber, { disabled: !(shown && bottom), axis: 'both', onPanEnd: (g) => {
    const el = grabber.current;
    if (g.canceled || !el || Math.abs(g.dy) < el.offsetHeight / 2) return;   // a press: the click toggles
    el.dataset.plxDragged = 'true';
    if (g.dy < 0) setHeight('large');
    else if (height === 'large') setHeight('medium');
    else if (dismissible && onClose) onClose();
  } });

  if (!shown) return null;
  if (!bottom) {
    // the side sheet (Medium) and the dialog (Wide): Close in the header; Cancel and Done after the caller's footer actions
    const ends = task ? <>{dismissible ? <Button onClick={onClose}>{cancelLabel}</Button> : null}<Button variant="primary" onClick={onDone}>{doneLabel}</Button></> : null;
    const foot = footer || ends ? <>{footer}{ends}</> : null;
    const Shell = kind === 'side' ? Drawer : Dialog;
    return <Shell open onClose={onClose} title={title} description={description} icon={icon} footer={foot} initialFocus={initialFocus}
      closeLabel={closeLabel} dismissible={dismissible} flush={flush} className={cx('plx-sheet-' + kind, className)}>{actions ? <div className="plx-sheet__actions">{actions}</div> : null}{children}</Shell>;
  }

  // the grabber: a press moves between the two heights (its drag is the gesture above)
  const toggle = () => setHeight(height === 'medium' ? 'large' : 'medium');
  // capture the pointer at once, so a quick flick that leaves the grabber before the gesture's slop is still followed to its release
  const onGrabDown = (e) => { if (e.button === 0) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* the pointer is gone */ } } };
  const onGrabClick = (e) => { if (e.currentTarget.dataset.plxDragged) { delete e.currentTarget.dataset.plxDragged; return; } toggle(); };
  const onScrim = (e) => { if (dismissible && e.target === e.currentTarget && onClose) onClose(); };
  return createPortal(
    <div className="plx-modal-layer plx-modal-layer--sheet" onMouseDown={onScrim}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={id + 't'} aria-describedby={description ? id + 'd' : undefined} tabIndex={-1}
        className={cx('plx-sheet', 'plx-sheet--' + height, task && 'plx-sheet--task', className)}>
        <button ref={grabber} type="button" className="plx-sheet__grabber" aria-label={height === 'medium' ? t.expand : t.shrink} onPointerDown={onGrabDown} onClick={onGrabClick} />
        <div className="plx-sheet__header">
          {task && dismissible ? <Button variant="ghost" className="plx-sheet__cancel" onClick={onClose}>{cancelLabel}</Button> : null}
          {icon ? <span className="plx-sheet__icon" aria-hidden="true">{asIcon(icon)}</span> : null}
          <h2 id={id + 't'} className="plx-sheet__title">{title}</h2>
          {actions}
          {task ? <Button variant="primary" className="plx-sheet__done" onClick={onDone}>{doneLabel}</Button>
            : dismissible ? <Button variant="ghost" iconOnly icon={CloseIcon} label={closeLabel} className="plx-sheet__close" onClick={onClose} /> : null}
        </div>
        <div className={cx('plx-sheet__body', flush && 'plx-sheet__body--flush')}>
          {description ? <p id={id + 'd'} className="plx-dialog__description">{description}</p> : null}
          {children}
        </div>
        {footer ? <div className="plx-sheet__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
