/* Plenix · WidgetGrid
   Summary: A dashboard's widgets in a grid that people reorder by dragging a widget's handle, or with the arrow keys on it
     (04 › Layout › Layout patterns › Dashboard grid).
   Usage:
     <WidgetGrid label="Dashboard" items={widgets} onReorder={(ids) => setOrder(ids)}
       renderItem={(w) => <Panel title={w.title} flush>{w.body}</Panel>} />
   Props:
     items: the widgets, in order: [{ id, title, span }] (span: "1" (default) | "2" columns)
     renderItem(item, handle): draws a widget (usually a Panel). A renderer that takes the second argument places the
       handle itself (in the Panel's actions); otherwise the grid puts it in the widget's top corner
     onReorder(ids): runs with the new order after a drop or a key move; without it the grid cannot be reordered
     label: the accessible name of the grid
     columns: "auto" (default; as many as fit) | 2 | 3 | 4
     className: more classes on the grid
     strings: the words it announces, for other languages: { widget: "Widget", widgetLower: "widget", move: "Move {title}
       (arrow keys)", position: "{title}, position {index} of {total}", earlier: "Move earlier", later: "Move later",
       first: "Move to the start", last: "Move to the end" } (widget and widgetLower stand in for a widget without a
       title, in the announcement and in the handle's name)
   Behavior:
     Drag and drop (batch 271): the handle shows the grab cursor, grabbing while held or while its widget moves.
     Each widget gets a handle (a button) when the grid can be reordered: drag it onto another widget to place it there;
     or focus it and press Arrow Up (earlier) or Arrow Down (later); Arrow Left / Right follow reading order (in a
     right-to-left page Arrow Right is earlier).
     Without dragging (WCAG 2.5.7): a click on the handle (or Enter or Space) opens its menu: Move earlier, Move later,
     Move to the start and Move to the end (the ones that cannot move are disabled).
     While dragging, the widget under the pointer shows the drop ring.
     The new place is announced ("Site visits, position 2 of 6").
   Notes:
     The grid never changes the order by itself: onReorder hands the new order to the page, which keeps it.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Icon } from '../../components/Icon/Icon.tsx';
import { LiveRegion } from '../../utils/announce.tsx';
import { arrowStep } from '../../utils/direction.ts';
import { Menu, MenuItem } from '../../components/Menu/Menu.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import DragIcon from 'plenix-platform/icons/plenix/drag';
import { fill } from '../../utils/fill.ts';

const move = (ids: any, from: any, to: any) => { const next = ids.slice(); const [x] = next.splice(from, 1); next.splice(to, 0, x); return next; };

// the handle: a menu button (Menu gives it the click, Enter and Space) whose arrow keys move the widget instead of
// opening the menu, so the keys keep their meaning on the handle
const Handle = React.forwardRef(function Handle({ onStep, onKeyDown, expanded, ...rest }: any, ref: any) {
  return <button ref={ref} type="button" {...rest} onKeyDown={(e) => {
    const step = arrowStep(e, e.currentTarget);
    if (step) { e.preventDefault(); onStep(step); return; }
    if (onKeyDown) onKeyDown(e);
  }} />;
});

/** @public one widget; span is the number of columns it takes */
export type Widget = { id: string | number; title?: string; span?: '1' | '2' };
/** @public the prop type (ADR 0011) */
export type WidgetGridProps<T extends Widget = Widget> = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  items: T[];
  /** a renderer that takes the handle places it itself */
  renderItem(item: T, handle?: React.ReactNode): React.ReactNode;
  /** without it the grid cannot be reordered */
  onReorder?(ids: (string | number)[]): void;
  label?: string;
  columns?: 'auto' | 2 | 3 | 4;
  strings?: Record<string, string>;
  className?: string;
};
export function WidgetGrid<T extends Widget = Widget>(props: WidgetGridProps<T>) {
  const { items = [], renderItem, onReorder, label, columns = 'auto', strings, className, ...rest } = props as any;
  const t: any = useStrings('widgetGrid', strings);
  const [dragging, setDragging] = React.useState<any>(null);
  const [over, setOver] = React.useState<any>(null);
  const [said, setSaid] = React.useState('');
  const ids = items.map((i: any) => i.id);
  const place = (from: any, to: any) => {
    if (!onReorder || to < 0 || to >= ids.length || from === to) return;
    onReorder(move(ids, from, to));
    const it = items[from]; setSaid(fill(t.position, { title: it.title || t.widget, index: to + 1, total: ids.length }));
  };
  return (
    <>
    <div className={cx('plx-widget-grid', 'plx-widget-grid--' + columns, className)} role="list" aria-label={label} {...rest}>
      {items.map((it: any, i: any) => (
        <div key={it.id} role="listitem" className={cx('plx-widget-grid__item', it.span === '2' && 'plx-widget-grid__item--wide', dragging === it.id && 'is-dragging', over === it.id && dragging !== it.id && 'is-drop-target')}
          onDragOver={onReorder ? (e) => { e.preventDefault(); setOver(it.id); } : undefined}
          onDragLeave={onReorder ? () => setOver((o: any) => (o === it.id ? null : o)) : undefined}
          onDrop={onReorder ? (e) => { e.preventDefault(); const from = ids.indexOf(dragging); setOver(null); setDragging(null); place(from, i); } : undefined}>
          {(() => { const handle = onReorder ? (
            <Menu label={fill(t.move, { title: it.title || t.widgetLower })} placement="bottom-end"
              className={cx('plx-widget-grid__menu', renderItem && renderItem.length > 1 && 'plx-widget-grid__menu--inline')}
              trigger={
                <Handle className={cx('plx-widget-grid__handle', renderItem && renderItem.length > 1 && 'plx-widget-grid__handle--inline')} draggable aria-label={fill(t.move, { title: it.title || t.widgetLower })}
                  onDragStart={(e: any) => { setDragging(it.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(it.id)); }}
                  onDragEnd={() => { setDragging(null); setOver(null); }}
                  onStep={(step: any) => place(i, i + step)}>
                  <Icon name={DragIcon} size="md" />
                </Handle>
              }>
              <MenuItem disabled={i === 0} onSelect={() => place(i, i - 1)}>{t.earlier}</MenuItem>
              <MenuItem disabled={i === items.length - 1} onSelect={() => place(i, i + 1)}>{t.later}</MenuItem>
              <MenuItem disabled={i === 0} onSelect={() => place(i, 0)}>{t.first}</MenuItem>
              <MenuItem disabled={i === items.length - 1} onSelect={() => place(i, items.length - 1)}>{t.last}</MenuItem>
            </Menu>
          ) : null;
          return renderItem && renderItem.length > 1 ? renderItem(it, handle) : <>{handle}{renderItem ? renderItem(it) : null}</>; })()}
        </div>
      ))}
    </div>
    {/* the reorder announcement: beside the list, since a list holds only its items */}
    <LiveRegion kind="status">{said}</LiveRegion>
    </>
  );
}
