/* Plenix · ViewMenu
   Summary: The command bar's View (6B, owner 2026-10-14): one "View" menu with the layout (List, Gallery), the gallery's
     card size (Small, Medium, Large) and the list's row height (Short, Medium, Tall, Extra tall). The row height lives
     only here: the table has no view button of its own.
   Usage:
     const [view, setView] = React.useState({ layout: 'list', size: 'm', height: 'short' });
     <ViewMenu value={view} onChange={setView} />
     {view.layout === 'list' ? <DataGrid … rowHeight={view.height} /> : <ContentGrid size={…}>…</ContentGrid>}
   Props:
     value: { layout: "list" | "gallery", size: "s" | "m" | "l", height: "short" | "medium" | "tall" | "extra-tall", editMode?: "inline" | "form" }
     editModes: the ways the table can edit, ["inline", "form"]: with both, the menu ends with an "Editing" group (Inline Edit, Form Edit); value.editMode holds the
       choice. Pass it only when the table has an editable column; without it (or with one way) nothing appears (ADR 0016, issue 477)
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
import { CommandBarButton as CommandBarButtonJs, useCommandBar as useCommandBarJs } from '../CommandBar/CommandBar.jsx';
const CommandBarButton: any = CommandBarButtonJs;
const useCommandBar: any = useCommandBarJs;
import { useStrings } from '../../providers/LocaleProvider.tsx';
import GridN2x2Icon from 'plenix-platform/icons/plenix/grid-2x2';
import ListLinesIcon from 'plenix-platform/icons/plenix/list-lines';
import RefreshIcon from 'plenix-platform/icons/plenix/refresh';
import ViewTableIcon from 'plenix-platform/icons/plenix/view-table';

const SIZES = [['s', 'cards-small'], ['m', 'cards-medium'], ['l', 'cards-large']];
const HEIGHTS = ['short', 'medium', 'tall', 'extra-tall'];

/** @public the view the menu edits */
export type ViewMenuValue = { layout: 'list' | 'gallery'; size: 's' | 'm' | 'l'; height: 'short' | 'medium' | 'tall' | 'extra-tall'; editMode?: 'inline' | 'form' };
/** @public the prop type (ADR 0011) */
export type ViewMenuProps = {
  value: ViewMenuValue;
  onChange(value: ViewMenuValue): void;
  gallery?: boolean;
  editModes?: ('inline' | 'form')[];
  strings?: Record<string, string>;
  onReset?(): void;
};
export function ViewMenu(props: ViewMenuProps) {
  const { value, onChange, gallery = true, editModes, strings, onReset } = props as any;
  const t: any = useStrings('viewMenu', strings);
  const ctx = useCommandBar();
  const v = Object.assign({ layout: 'list', size: 'm', height: 'short' }, value);
  const set = (k: any) => (x: any) => onChange(Object.assign({}, v, { [k]: x }));
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
      {Array.isArray(editModes) && editModes.length > 1 ? (
        <>
          <MenuDivider />
          <MenuRadioGroup label={t.editMode} value={v.editMode || editModes[0]} onChange={set('editMode')} keepOpen>
            {editModes.map((mode) => <MenuItem key={mode} value={mode}>{mode === 'form' ? t.editModeForm : t.editModeInline}</MenuItem>)}
          </MenuRadioGroup>
        </>
      ) : null}
      {onReset ? <><MenuDivider /><MenuItem icon={RefreshIcon} onSelect={onReset}>{t.reset}</MenuItem></> : null}
    </Menu>
  );
  return ctx.iconOnly ? <Tooltip content={t.label}>{menu}</Tooltip> : menu;
}
