/* Plenix · PanelTrigger, PanelHead, Pick, MultiPick, Pill, useReorder
   (platform/patterns/CommandBar; internal, not part of the public API)
   Summary: The find-and-view panels' shared parts. FilterPanel, SortPanel, GroupPanel, ColumnsMenu and QuickFilter are built
     from these, so the panels share one row (owner, 2026-10-14: "Group, Sort and Filter panels share row geometry"): the
     same control height, the same spacing.
   Usage:
     <PanelTrigger icon="sort" label="Sort" count={levels.length}><div className="plx-find-panel">…</div></PanelTrigger>
     const ro = useReorder(levels, setLevels, (l) => l.field, t);
   Props:
     PanelTrigger: the bar button (CommandBarButton) and its Popover; or, inline, the panel's body alone in a frame
     PanelHead: the panel's title, its info button (a tooltip) and its actions on the right; a line under it
     Pick: a select drawn as a menu button (the field with its type icon, the direction, the operator)
     MultiPick: a multi-select whose chosen values show as pills in their colors
     Pill: a value in its category color
     useReorder: rows that move by drag, by their handle's Move up and Move down, or by Alt + Arrow Up / Down on a focused
       row; each move is announced (WCAG 2.5.7: a way without dragging) */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Button } from '../../components/Button/Button.tsx';
import { Menu, MenuItem, MenuRadioGroup } from '../../components/Menu/Menu.jsx';
import { Popover } from '../../components/Popover/Popover.jsx';
import { Text } from '../../components/Text/Text.tsx';
import { Tooltip } from '../../components/Tooltip/Tooltip.tsx';
import { LiveRegion } from '../../utils/announce.tsx';
import { CommandBarButton, useCommandBar } from './CommandBar.jsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';
import ChevronUpIcon from 'plenix-platform/icons/plenix/chevron-up';
import CircleInfoIcon from 'plenix-platform/icons/plenix/circle-info';
import DragIcon from 'plenix-platform/icons/plenix/drag';
import { fill } from '../../utils/fill.ts';

export const toggle = (list, v) => (list.indexOf(v) >= 0 ? list.filter((x) => x !== v) : list.concat(v));
// the bar button and its panel; inline: the body alone (a panel drawn open, or in a side panel). current: the choice in
// force, shown in the button ("Status: Active", a pop-up button in Apple's words) in place of the count badge; open and
// onOpenChange control the panel from outside
export function PanelTrigger({ icon, label, current, count = 0, active, caret = false, size = 'auto', title, footer, inline = false, placement, className, open, onOpenChange, children }) {
  const ctx = useCommandBar();
  const box = React.useRef(null);
  // the focus goes to the panel's first row control, else its Add button: not the info button of its head
  const first = { get current() { const el = box.current; return el ? el.querySelector('[data-plx-panel-first] button:not([disabled]), [data-plx-panel-first] input, .plx-find-panel__rows button:not([disabled]), .plx-find-panel__rows input, .plx-find-panel__add button:not([disabled]), .plx-find-panel input') : null; } };
  const body = <div ref={box} className={cx('plx-find-panel-body', className)}>{children}</div>;
  if (inline) return <div className="plx-find-panel-frame">{children}</div>;
  const words = current ? label + ': ' + current : label;
  // icons only: no room for the words, so the count badge stays; the tooltip says the choice
  const trigger = current && !ctx.iconOnly ? <CommandBarButton icon={icon} label={label} active caret={caret} aria-label={words}>{words}</CommandBarButton>
    : <CommandBarButton icon={icon} label={label} count={count} active={active} caret={caret} />;
  const pop = <Popover label={title ? undefined : label} title={title} size={size} trigger={trigger} footer={footer} placement={placement} initialFocus={first} {...(open === undefined ? null : { open })} onOpenChange={onOpenChange}>{body}</Popover>;
  return ctx.iconOnly ? <Tooltip content={words}>{pop}</Tooltip> : pop;
}

export function PanelHead({ title, info, infoLabel, sub, actions }) {
  return (
    <div className="plx-find-panel__head">
      <div className="plx-find-panel__title-row">
        <span className="plx-find-panel__title">
          <Text variant="heading" as="span">{title}</Text>
          {info ? <Tooltip content={info}><Button size="xs" variant="ghost" icon={CircleInfoIcon} iconOnly label={infoLabel || title} /></Tooltip> : null}
        </span>
        {actions ? <span className="plx-find-panel__actions">{actions}</span> : null}
      </div>
      {sub ? <Text variant="secondary">{sub}</Text> : null}
    </div>
  );
}

// a select as a menu button: the current option's icon and words
export function Pick({ label, value, options, onChange, size = 'field', disabled }) {
  const cur = options.find((o) => o.value === value) || options[0] || { label: '' };
  return (
    <Menu label={label} trigger={<Button icon={cur.icon} caret truncate disabled={disabled} className={cx('plx-find-pick', 'plx-find-pick--' + size)} title={cur.label} aria-label={label + ': ' + cur.label}>{cur.label}</Button>}>
      <MenuRadioGroup label={label} value={value} onChange={onChange}>
        {options.map((o) => <MenuItem key={o.value} value={o.value} icon={o.icon}>{o.label}</MenuItem>)}
      </MenuRadioGroup>
    </Menu>
  );
}

export const Pill = ({ color, children }) => <span className="plx-find-pill" data-plx-category={color || 'gray'}>{children}</span>;

// a multi-select: the chosen values as pills, or the placeholder
export function MultiPick({ label, options, value, onChange, placeholder }) {
  const chosen = value.map((v) => options.find((o) => o.value === v) || { value: v, label: v });
  return (
    <Menu label={label} trigger={<Button caret truncate className="plx-find-pick plx-find-pick--value" aria-label={label + ': ' + (chosen.length ? chosen.map((o) => o.label).join(', ') : placeholder)}>
      {chosen.length ? <span className="plx-find-pick__pills">{chosen.map((o) => <Pill key={o.value} color={o.color}>{o.label}</Pill>)}</span>
        : <span className="plx-find-pick__placeholder">{placeholder}</span>}</Button>}>
      {options.map((o) => <MenuItem key={o.value} checked={value.indexOf(o.value) >= 0} keepOpen onSelect={() => onChange(toggle(value, o.value))}><Pill color={o.color}>{o.label}</Pill></MenuItem>)}
    </Menu>
  );
}

// rows that reorder: drag, the handle's menu, Alt + Arrow Up / Down on a focused row; announced
export function useReorder(items, setItems, nameOf, t) {
  const [msg, setMsg] = React.useState('');
  const drag = React.useRef(null);
  const box = React.useRef(null);
  const [dragging, setDragging] = React.useState(-1);
  const move = (i, to, focus) => {
    if (to < 0 || to >= items.length || to === i) return;
    const next = items.slice(); const [x] = next.splice(i, 1); next.splice(to, 0, x);
    setItems(next);
    setMsg(fill(t.moved, { name: nameOf(x), position: to + 1, total: items.length }));
    if (focus) setTimeout(() => { const el = box.current && box.current.querySelectorAll(':scope > [data-plx-row]')[to]; if (el) el.focus(); }, 0);
  };
  const rowProps = (i, name) => ({
    'data-plx-row': '', tabIndex: 0, draggable: true, 'aria-label': fill(t.row, { name, position: i + 1, total: items.length }),
    'aria-keyshortcuts': 'Alt+ArrowUp Alt+ArrowDown',
    className: cx('plx-find-panel__row', dragging === i && 'is-dragging'),
    onKeyDown: (e) => { if (e.target !== e.currentTarget || !e.altKey) return; if (e.key === 'ArrowUp') { e.preventDefault(); move(i, i - 1, true); } if (e.key === 'ArrowDown') { e.preventDefault(); move(i, i + 1, true); } },
    onDragStart: (e) => { e.stopPropagation(); drag.current = i; setDragging(i); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(i)); },
    onDragEnd: () => { drag.current = null; setDragging(-1); },
    onDragOver: (e) => e.preventDefault(),
    onDrop: (e) => { e.preventDefault(); e.stopPropagation(); const from = drag.current; drag.current = null; setDragging(-1); if (from !== null && from !== i) move(from, i); },
  });
  const handle = (i, name) => (
    <Menu label={fill(t.reorder, { name })} placement="bottom-end" trigger={<Button variant="ghost" icon={DragIcon} iconOnly label={fill(t.reorder, { name })} className="plx-find-panel__handle" />}>
      <MenuItem icon={ChevronUpIcon} disabled={i === 0} onSelect={() => move(i, i - 1, true)}>{t.moveUp}</MenuItem>
      <MenuItem icon={ChevronDownIcon} disabled={i === items.length - 1} onSelect={() => move(i, i + 1, true)}>{t.moveDown}</MenuItem>
    </Menu>
  );
  const status = <LiveRegion kind="status">{msg}</LiveRegion>;
  return { box, rowProps, handle, status };
}
// the words of a row that reorders are in the catalog under each panel's section (moved, row, reorder, moveUp, moveDown)
