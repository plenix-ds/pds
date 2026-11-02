/* Plenix · ViewMenu
   Summary: The command bar's View (6B, owner 2026-10-14): one "View" menu with the layout (List, Gallery), the gallery's
     card size (Small, Medium, Large) and the list's row height (Short, Medium, Tall, Extra tall). The row height lives
     only here: the table has no view button of its own.
   Usage:
     const [view, setView] = React.useState({ layout: 'list', size: 'm', height: 'short' });
     <ViewMenu value={view} onChange={setView} />
     {view.layout === 'list' ? <DataGrid … rowHeight={view.height} /> : <ContentGrid size={…}>…</ContentGrid>}
   Props:
     value: { layout: "list" | "gallery", size: "s" | "m" | "l", height: "short" | "medium" | "tall" | "extra-tall" }
     onReset(): optional Reset view action (useCollectionView supplies it)
     onChange(value): runs on every change
     gallery: the collection has a gallery layout; without it Gallery and the card sizes are disabled; default true
     strings: { label: "View", layout: "Layout", list: "List", gallery: "Gallery", size: "Card size (gallery)",
       s: "Small", m: "Medium", l: "Large", height: "Row height (list)", short: "Short", medium: "Medium", tall: "Tall",
       'extra-tall': "Extra tall" }
   Behavior:
     The parts that do not apply to the current layout are disabled, never hidden (owner, 2026-10-14): the card size in
       the list, the row height in the gallery. The menu stays open while choosing (keepOpen).
     The button reads "View" with the thin chevron; icons only, its icon and tooltip. */
import React from 'react';
import { Menu, MenuItem, MenuDivider, MenuGroup, MenuRadioGroup } from '../../components/Menu/Menu.tsx';
import { Tooltip } from '../../components/Tooltip/Tooltip.tsx';
import { CommandBarButton, useCommandBar } from '../CommandBar/CommandBar.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import GridN2x2Icon from 'plenix-platform/icons/plenix/grid-2x2';
import ListLinesIcon from 'plenix-platform/icons/plenix/list-lines';
import RefreshIcon from 'plenix-platform/icons/plenix/refresh';
import ViewTableIcon from 'plenix-platform/icons/plenix/view-table';

const SIZES = [['s', 'cards-small'], ['m', 'cards-medium'], ['l', 'cards-large']];
const HEIGHTS = ['short', 'medium', 'tall', 'extra-tall'];

export function ViewMenu({ value, onChange, gallery = true, strings, onReset }) {
  const t = useStrings('viewMenu', strings);
  const ctx = useCommandBar();
  const v = Object.assign({ layout: 'list', size: 'm', height: 'short' }, value);
  const set = (k) => (x) => onChange(Object.assign({}, v, { [k]: x }));
  const menu = (
    <Menu label={t.label} placement="bottom-end" trigger={<CommandBarButton icon={ViewTableIcon} label={t.label} caret />}>
      <MenuRadioGroup label={t.layout} value={v.layout} onChange={set('layout')} keepOpen>
        <MenuItem value="list" icon={ListLinesIcon}>{t.list}</MenuItem>
        <MenuItem value="gallery" icon={GridN2x2Icon} disabled={!gallery}>{t.gallery}</MenuItem>
      </MenuRadioGroup>
      <MenuDivider />
      <MenuGroup label={t.size}>
        {SIZES.map(([k, icon]) => <MenuItem key={k} type="radio" checked={v.size === k} icon={icon} disabled={!gallery || v.layout !== 'gallery'} keepOpen onSelect={() => set('size')(k)}>{t[k]}</MenuItem>)}
      </MenuGroup>
      <MenuDivider />
      <MenuGroup label={t.height}>
        {HEIGHTS.map((k) => <MenuItem key={k} type="radio" checked={v.height === k} disabled={v.layout !== 'list'} keepOpen onSelect={() => set('height')(k)}>{t[k]}</MenuItem>)}
      </MenuGroup>
      {onReset ? <><MenuDivider /><MenuItem icon={RefreshIcon} onSelect={onReset}>{t.reset}</MenuItem></> : null}
    </Menu>
  );
  return ctx.iconOnly ? <Tooltip content={t.label}>{menu}</Tooltip> : menu;
}
