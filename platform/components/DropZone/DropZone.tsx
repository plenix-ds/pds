/* Plenix · DropZone
   Summary: Where files are dropped (an upload area): a dashed region on the sunken surface. It is also a drop target for
     items dragged in the page (a data drop target: an asset dropped on a folder, a card on a column; 10 Patterns ›
     Drop target), through the drag-and-drop engine, and shows whether it takes what is over it.
   Usage:
     <DropZone as="button" active={dragging} onClick={openPicker} onDragOver={…} onDrop={…}>Drop files or click to choose</DropZone>
     <DropZone name="Archive" accepts={(data, type) => type === 'asset'} onDropItem={(asset) => archive(asset)}>Archive</DropZone>
     <DropZone reject={wrongType} rejectContent="Only images can go here" …>Drop images here</DropZone>
   Props:
     as: "div" (default) | "button" (opens the file picker on click)
     active: shows the highlight while files are dragged over it (default false)
     reject: shows that what is dragged over it is not taken (default false): the border in the danger color and the
       not-allowed pointer; the page sets it while it handles the browser's drag events itself
     rejectContent: what the zone says while it does not take what is over it ("Only images can go here"), so the state
       is never told by color alone (default: its children)
     overlay: covers its positioned parent while files are dragged over a page (the asset browser), and lets the drop
       reach the page (default false)
     onDropItem(data, type): makes the zone a drop target for items dragged in the page with the drag-and-drop engine
       (utils/dnd.ts: useDraggable, a sortable list's items do not drop here); it runs when one is dropped on it
     accepts(data, type): with onDropItem, true when the zone takes the item (default: every item)
     name: with onDropItem, the zone's name in the announcements ("Over Archive", "Archive does not take Cross 014")
     children: the zone's content
     className: more classes on the zone
   Behavior:
     The zone is highlighted while active, or while an item it takes is over it; it shows the reject state while
       reject is set, or while an item it does not take is over it.
     With onDropItem the keyboard reaches it too: a picked-up item (Space or Enter on its handle) moves from target to
       target with the arrow keys and drops with Space or Enter; each target is announced.
   Notes:
     The page handles the browser's drag and drop events (files); other props (onDragOver, onDrop, onClick, …) pass
       through to the element.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useDropTarget } from '../../utils/dnd.ts';
import type { DropTargetOptions } from '../../utils/dnd.ts';

export type DropZoneProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  active?: boolean;
  reject?: boolean;
  /** what it shows while it refuses the thing dragged over it */
  rejectContent?: React.ReactNode;
  overlay?: boolean;
  /** makes it a drop target of the Platform's drag and drop (utils/dnd.ts) */
  onDropItem?: DropTargetOptions['onDrop'];
  accepts?: DropTargetOptions['accepts'];
  name?: string;
};
export function DropZone({ as: As = 'div', active = false, reject = false, rejectContent, overlay = false, onDropItem, accepts, name, className, children, ...rest }: DropZoneProps) {
  const target = useDropTarget({ name, accepts, onDrop: onDropItem, disabled: !onDropItem });
  const st = onDropItem ? target.state : null;
  const refused = reject || st === 'reject';
  const extra = onDropItem ? { ref: target.ref, 'data-plx-dnd-target': target.props['data-plx-dnd-target'], 'data-plx-drop-state': target.props['data-plx-drop-state'] } : null;
  return (
    <As type={As === 'button' ? 'button' : undefined} {...extra}
      className={cx('plx-drop-zone', (active || st === 'over') && 'is-active', refused && 'is-reject', overlay && 'plx-drop-zone--overlay', className)} {...rest}>
      {refused && rejectContent != null ? rejectContent : children}
    </As>
  );
}
