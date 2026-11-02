/* Plenix · DragHandle
   Summary: The grip an item is moved by (13 Interaction › Interaction foundations › Drag handle): a small button with the
     drag icon (six dots) that the drag-and-drop engine (utils/dnd.ts) turns into a drag for the pointer and a pick-up
     for the keyboard. Vertical (the dots stand) for rows that move up and down; horizontal (the dots lie) for columns,
     tabs and cards that move sideways.
   Usage:
     const s = useSortable({ items, onReorder: setItems });
     <DragHandle dnd={s.handleProps(i)} />                                    // the engine names it ("Move Hero banner")
     <DragHandle label="Move column Status" orientation="horizontal" dnd={…} />
     <Menu label="Move Hero banner" trigger={<DragHandle dnd={s.handleProps(i)} />}>…Move up, Move down…</Menu>
   Props:
     label: the accessible name, a verb and the item ("Move Hero banner"); default the engine's (dnd["aria-label"])
     orientation: "vertical" (default) | "horizontal"
     dnd: the engine's handle props (useSortable().handleProps(i), useDraggable().handleProps): the pointer, the keys, the
       instructions (aria-describedby) and aria-pressed while the item is picked up
     disabled: the item cannot move now (default false)
     className: more classes on the handle
     ref: the button (forwarded), so the handle can be a Menu's trigger
   Behavior:
     Pointer: press and move past the slop to drag the item; the handle shows the grab pointer, grabbing while it drags.
       A click without moving does what the handle's other props say (a Menu's trigger opens its menu of moves).
     Keyboard: Space or Enter picks the item up (aria-pressed true, the selected fill); the arrow keys move it; Space or
       Enter drops it; Escape puts it back. The engine's handlers run first, so while the item is picked up the arrow
       keys move it rather than open a menu.
     Touch: the handle takes the finger itself (touch-action none), so the page still scrolls everywhere else.
   Notes:
     Every drag has a way without dragging (WCAG 2.5.7): a menu of moves on the handle (SortableList), move buttons, or
       the keyboard. The handle is at least the inline control size (24px; larger with touch), WCAG 2.5.8.
     Other props pass through to the <button>.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { mergeDndProps } from '../../utils/dnd.ts';
import { Icon } from '../Icon/Icon.tsx';
import DragIcon from 'plenix-platform/icons/plenix/drag';

export const DragHandle = React.forwardRef(function DragHandle({ label, orientation = 'vertical', dnd, disabled = false, className, ...rest }, ref) {
  const props = mergeDndProps(dnd || {}, rest);
  return (
    <button ref={ref} type="button" {...props} aria-label={label || props['aria-label']} disabled={disabled || props.disabled || undefined}
      className={cx('plx-drag-handle', 'plx-drag-handle--' + (orientation === 'horizontal' ? 'horizontal' : 'vertical'), className)}>
      <Icon name={DragIcon} />
    </button>
  );
});
