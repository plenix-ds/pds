/* Plenix · SortableList
   Summary: A list people put in their own order (10 Patterns › Selection and organization › Sortable list; also
     Reordering): each item drags by its handle, moves with the keyboard (pick up, arrows, drop) and has a way without
     dragging, its handle's menu of moves or move buttons. A column of rows (vertical) or tiles in a grid; lists of one
     group take each other's items. Built on the drag-and-drop engine (utils/dnd.ts) with DragHandle, Menu and Button.
   Usage:
     <SortableList label="Steps" items={steps} onReorder={setSteps} renderItem={(s) => s.title} />
     <SortableList label="Pinned views" layout="grid" items={views} onReorder={setViews} renderItem={(v) => <Persona … />} />
     <SortableList label="Columns" items={cols} onReorder={setCols} moveButtons renderItem={(c) => c.label} />
     <SortableList id="todo" group="board" label="To do" items={todo} onMove={move} onReorder={setTodo} renderItem={…} />
   Props:
     items: the list, in order: [{ id, name, … }] (required)
     renderItem(item, index): draws an item's content (default its name)
     onReorder(next, { item, from, to }): runs with the new order after a drop, a key move, a menu move or a move button;
       without it the list cannot be reordered
     label: the list's accessible name ("Steps"), spoken when an item moves to it from another list (required)
     getId(item) (default item.id); getName(item): the item's name in the handle's label and the announcements (default
       item.name, item.label, else the id)
     layout: "vertical" (default; one row per item) | "grid" (tiles in rows that wrap; the arrow keys move a tile across
       and up and down a row)
     handles: true (default) each item has a DragHandle whose click opens its menu of moves (Move up, Move down, Move to
       the start, Move to the end); false the whole item drags (on touch after a long press) and is one tab stop
     moveButtons: Move up and Move down buttons at the end of each item, always visible (default false)
     id, group, onMove({ item, from: { list, index }, to: { list, index } }): lists of one group take each other's items;
       give each its id and the same onMove, which moves the item between the page's lists
     disabled: the order cannot change now (default false)
     strings: the words it shows and announces, for other languages: { moveMenu: "Move {name}", moveUp: "Move up",
       moveDown: "Move down", moveEarlier: "Move earlier", moveLater: "Move later", moveFirst: "Move to the start",
       moveLast: "Move to the end", moveUpNamed: "Move {name} up", moveDownNamed: "Move {name} down" } and the engine's
       announcements (DND_STRINGS)
     className: more classes on the list
   Behavior:
     Pointer: drag an item by its handle (or anywhere on it with handles={false}); the item follows the pointer, raised,
       and the insertion line shows where it lands; release drops it; Escape puts it back. Near the edges of a scrolling
       region the region scrolls.
     Keyboard: Space or Enter on the handle picks the item up; Arrow Up / Down (in a grid also Left / Right, in reading
       order) move it, Home and End to the start and the end; Space or Enter drops it, Escape puts it back where it was.
       In a group, Arrow Left / Right move it to the neighboring list.
     Without dragging (WCAG 2.5.7): a click on the handle opens the menu of moves; move buttons move one place.
     Every move is announced ("Hero banner, position 2 of 5"); focus stays on the moved item's handle.
   Notes:
     The list never changes the order by itself: onReorder (and onMove) hand the new order to the page, which keeps it.
     A list of fields in a find panel reorders with the panels' own rows (Reordering, the columns list); a dashboard's
       widgets with WidgetGrid. Other props pass through to the <ul>.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useSortable } from '../../utils/dnd.ts';
import { DragHandle } from '../../components/DragHandle/DragHandle.tsx';
import { Menu, MenuItem, MenuDivider } from '../../components/Menu/Menu.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';
import ChevronUpIcon from 'plenix-platform/icons/plenix/chevron-up';
import { fill } from '../../utils/fill.ts';

// after a move button moves its item, focus stays on that button in the moved item (the other one at the list's end)
const keep = (dir: any) => (itemEl: any) => {
  const own = itemEl.querySelector('[data-plx-move="' + dir + '"]'), other = itemEl.querySelector('[data-plx-move="' + (dir === 'up' ? 'down' : 'up') + '"]');
  return own && !own.disabled ? own : other;
};

/** @public the prop type (ADR 0011) */
export type SortableListProps<T = { id: string | number; name?: string }> = Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onSelect'> & {
  items: T[];
  renderItem?(item: T, index: number): React.ReactNode;
  /** without it the list cannot be reordered */
  onReorder?(next: T[], change: { item: T; from: number; to: number }): void;
  label: string;
  getId?(item: T): string | number;
  getName?(item: T): string;
  layout?: 'vertical' | 'grid';
  handles?: boolean;
  moveButtons?: boolean;
  id?: string;
  group?: string;
  onMove?(move: { item: T; from: { list: string; index: number }; to: { list: string; index: number } }): void;
  disabled?: boolean;
  strings?: Record<string, string>;
  className?: string;
};
export function SortableList<T = { id: string | number; name?: string }>(props: SortableListProps<T>) {
  const { items = [], renderItem, onReorder, label, getId = (x: any) => x.id, getName, layout = 'vertical', handles = true, moveButtons = false,
  id, group, onMove, disabled = false, strings, className, ...rest } = props as any;
  const t: any = useStrings('sortableList', strings);
  const nameOf = getName || ((x: any) => String(x.name != null ? x.name : x.label != null ? x.label : getId(x)));
  const grid = layout === 'grid';
  const off = disabled || !onReorder;
  const s = useSortable({ items, onReorder, getId, getName: nameOf, label, orientation: grid ? 'grid' : 'vertical', handle: handles, id, group, onMove, disabled: off, strings });
  const last = items.length - 1;
  return (
    <ul {...rest} {...s.listProps} aria-label={label}
      className={cx('plx-sortable-list', 'plx-sortable-list--' + (grid ? 'grid' : 'vertical'), handles && 'plx-sortable-list--handles', moveButtons && 'plx-sortable-list--buttons', className)}>
      {items.map((item: any, i: any) => {
        const name = nameOf(item), ip = s.itemProps(i);
        const handle = handles ? (
          <Menu label={fill(t.moveMenu, { name })} placement="bottom-start" className="plx-sortable-list__menu"
            trigger={<DragHandle dnd={s.handleProps(i)} disabled={off} className="plx-sortable-list__handle" />}>
            <MenuItem icon={ChevronUpIcon} disabled={!s.canMove(i, -1)} onSelect={() => s.moveTo(i, i - 1)}>{grid ? t.moveEarlier : t.moveUp}</MenuItem>
            <MenuItem icon={ChevronDownIcon} disabled={!s.canMove(i, 1)} onSelect={() => s.moveTo(i, i + 1)}>{grid ? t.moveLater : t.moveDown}</MenuItem>
            <MenuDivider />
            <MenuItem disabled={i === 0} onSelect={() => s.moveTo(i, 0)}>{t.moveFirst}</MenuItem>
            <MenuItem disabled={i === last} onSelect={() => s.moveTo(i, last)}>{t.moveLast}</MenuItem>
          </Menu>
        ) : null;
        return (
          <li key={getId(item)} {...ip} className={cx('plx-sortable-list__item', ip.className)}>
            {handle}
            <div className="plx-sortable-list__content">{renderItem ? renderItem(item, i) : name}</div>
            {moveButtons ? (
              <span className="plx-sortable-list__buttons">
                <Button size="xs" variant="ghost" iconOnly icon={ChevronUpIcon} label={fill(t.moveUpNamed, { name })} disabled={off || !s.canMove(i, -1)} data-plx-move="up" onClick={() => s.moveTo(i, i - 1, { focus: keep('up') })} />
                <Button size="xs" variant="ghost" iconOnly icon={ChevronDownIcon} label={fill(t.moveDownNamed, { name })} disabled={off || !s.canMove(i, 1)} data-plx-move="down" onClick={() => s.moveTo(i, i + 1, { focus: keep('down') })} />
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
