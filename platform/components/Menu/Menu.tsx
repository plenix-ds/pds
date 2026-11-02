/* Plenix · Menu, MenuItem, MenuGroup, MenuDivider, MenuRadioGroup, MenuSub, ContextMenu
   Summary: A list of actions opened from a button (the menu button pattern); ContextMenu opens the same list at the
     pointer on a right-click or a long press, or at its target on Shift+F10 or the Menu key (the context menu pattern).
     Items are actions, checkbox items, radio items in a MenuRadioGroup (one of a set) and submenus (MenuSub).
   Usage:
     <Menu trigger={<Button caret>Actions</Button>} placement="bottom-start">
       <MenuItem icon="pencil" onSelect={rename}>Rename</MenuItem>
       <MenuDivider/>
       <MenuItem icon="trash" danger onSelect={remove}>Delete</MenuItem>
     </Menu>
     <MenuRadioGroup label="Sort by" value={sort} onChange={setSort}>
       <MenuItem value="name">Name</MenuItem><MenuItem value="date">Date modified</MenuItem>
     </MenuRadioGroup>
     <MenuSub label="Move to" icon="move"><MenuItem onSelect={…}>Brand kit</MenuItem><MenuItem onSelect={…}>Archive</MenuItem></MenuSub>
     <ContextMenu target={<div tabIndex={0} className="…">Cross 014</div>} label="Asset actions">
       <MenuItem icon="pencil" onSelect={rename}>Rename</MenuItem>
     </ContextMenu>
   Props:
     Menu.trigger: the button that opens the menu (one element)
     Menu.label: the accessible name of the menu
     Menu.placement: "bottom-start" (default) | "bottom-end" | "top-start" | "top-end"
     Menu.open: true or false: who is open is the caller's (a MenuBar keeps one of its menus open at a time); leave it out and the menu keeps its own state
     Menu.openStart: "first" | "last": the item that takes focus when the caller opens it; Menu.onOpenChange(open, { start }): runs when it opens or closes, from the trigger or by a key
     Menu.className: more classes on the anchor around the trigger and menu
     Context hook: a container sets --plx-comp-menu-context-anchor-width on its own element (100% for a full-width trigger)
     Menu.children: the items: MenuItem, MenuGroup, MenuDivider
     MenuItem.icon: an icon name or element before the label
     MenuItem.danger: shows the item in the danger color (a destructive action); default false
     MenuItem.disabled: skips the item; it cannot be chosen; default false
     MenuItem.checked: makes it a checkbox item, checked or not; leave it out for a plain item
     MenuItem.type: a string: "radio" makes it a radio item (menuitemradio): one of a set, checked shows which (inside a
       MenuRadioGroup a MenuItem with a value is a radio item without it)
     MenuItem.value: a string: a radio item's value in its MenuRadioGroup (checked when it is the group's value)
     MenuItem.keepOpen: leaves the menu open after choosing (for choosing several); default false
     MenuItem.href: renders the item as a link
     MenuItem.onSelect(event): runs when the item is chosen
     MenuItem.className: more classes on the item
     MenuItem.children: the item's label
     MenuGroup.label: the label of a set of items
     MenuGroup.children: the items in the set
     MenuDivider: a line between items; no props
     MenuRadioGroup.label: the name of the set ("Sort by"), shown as the group's label
     MenuRadioGroup.value: the value of the checked item; MenuRadioGroup.onChange(value): runs when another is chosen
     MenuRadioGroup.keepOpen: the menu stays open after a choice (default false: it closes, as any item)
     MenuRadioGroup.children: its MenuItems, each with a value
     MenuSub.label: the submenu item's label; MenuSub.icon: its icon; MenuSub.disabled: it cannot open (default false)
     MenuSub.className: more classes on the submenu's wrapper
     MenuSub.children: the submenu's items (one level: no submenu inside a submenu)
     ContextMenu.target: the element it belongs to (one element: a row, a card, a canvas); it gets the ref and the
       context-menu handlers. Make it focusable (a row of a grid, tabIndex 0) so the keyboard can open it.
     ContextMenu.label: the accessible name of the menu ("Asset actions")
     ContextMenu.onOpenChange(open): runs when it opens or closes (to select the row it acts on)
     ContextMenu.disabled: the browser's own menu shows instead (default false)
     ContextMenu.children: the items, as Menu's
   Behavior:
     Enter, Space or Arrow Down on the trigger opens the menu on the first item; Arrow Up opens it on the last.
     Arrow keys, Home and End move between items. Typing a letter moves to the next item whose label starts with it (type-ahead).
     Escape closes the menu and returns focus to the trigger.
     Tab closes the menu and moves on.
     A click outside closes the menu.
     Choosing an item closes the menu and returns focus to the trigger, unless keepOpen.
     A radio item checks itself and unchecks the others of its group (onChange); the menu shows the current choice
       when it opens.
     A checked checkbox or radio item shows a check (check-bold, 13 by 10px, as large as Blueprint's tick) in the item's
       start slot.
     A submenu item shows an end-pointing caret (triangle-right, as Blueprint's caret-right; mirrored in right to left); Arrow Right (Arrow Left in right-to-left), Enter, Space or a click
       opens the submenu beside it on its first item, and pointer hover opens it too; Arrow Left (Arrow Right in
       right-to-left) or Escape closes it and returns to its item. It sits at the item's end edge and flips to the
       other side when there is no room. Choosing an item in it closes every level.
     ContextMenu: a right-click or a long press (touch and pen, --plx-sys-gesture-long-press-delay) opens it at the
       pointer, kept inside the window (useFloating's point); Shift+F10 or the Menu key opens it at the target's start
       edge, below it. Focus moves to the first item; Escape, Tab, a choice or a click outside close it and return
       focus to where it was. It renders in the top layer (Portal), so a scroll area or a dialog never clips it.
     The menu opens on top of everything (batch 272): in the browser's top layer (popover), placed beside its trigger by
       useFloating (CSS anchor positioning), so no card, pane or scroll area can cover or clip it, and it follows the
       trigger on scroll and resize; near an edge the menu flips to the other side. A submenu is placed the same way at its
       item's end edge. A browser without anchor positioning draws them inside the wrapper as before.
   Notes:
     Menus are border-only (no shadow, D9); dialogs keep their shadow.
     A context menu is a shortcut: every action in it is also reachable another way (a toolbar, a row's More menu).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useLayer, useUid } from '../../utils/layer.ts';
import { Icon, asIcon } from '../Icon/Icon.tsx';
import { Portal } from '../../utils/portal.tsx';
import { useFloating, TOP_LAYER } from '../../utils/floating.ts';
import { useGesture } from '../../hooks/useGesture.ts';
import TriangleRightIcon from 'plenix-platform/icons/plenix/triangle-right';
import CheckIcon from 'plenix-platform/icons/plenix/check-bold';

const MenuContext = React.createContext(null);
const RadioContext = React.createContext(null);
// the menu's own items (not those of a submenu inside it)
const itemsIn = (list) => (list ? Array.prototype.filter.call(list.querySelectorAll('[data-plx-menu-item]:not([aria-disabled="true"])'), (el) => el.closest('[role="menu"]') === list) : []);
const isRtl = (el) => !!el && getComputedStyle(el).direction === 'rtl';
// Arrow keys, Home and End between a list's own items; true when the key moved focus
function moveIn(list, e) {
  const items = itemsIn(list);
  const at = items.indexOf(document.activeElement);
  let next = null;
  if (e.key === 'ArrowDown') next = (at + 1) % items.length;
  else if (e.key === 'ArrowUp') next = (at - 1 + items.length) % items.length;
  else if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = items.length - 1;
  else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
    // type-ahead (issue 706): a letter moves to the next item whose label starts with it, wrapping; nothing matches, nothing moves.
    // Only when focus is on one of this list's own items: a letter from a sub menu or a text field inside the menu is not this list's to take
    if (at < 0) return false;
    const k = e.key.toLocaleLowerCase();
    const label = (el) => ((el.querySelector('.plx-menu__label') || el).textContent || '').trim().toLocaleLowerCase();
    const hit = items.slice(at + 1).concat(items.slice(0, at + 1)).find((el) => label(el).startsWith(k));
    if (!hit) return false;
    next = items.indexOf(hit);
  } else return false;
  e.preventDefault();
  if (items[next]) items[next].focus();
  return true;
}

export function Menu({ trigger, label, placement = 'bottom-start', open: openProp, openStart, onOpenChange, className, children }) {
  const id = useUid('plx-menu');
  // who is open (issue 805): the menu keeps its own open state; a MenuBar passes open and onOpenChange so one of its menus is open at a time
  const [own, setOwn] = React.useState(false);
  const controlled = openProp !== undefined;
  const open = controlled ? !!openProp : own;
  const [first, setStart] = React.useState('first');
  const start = openStart || first;
  const wrap = React.useRef(null), list = React.useRef(null), button = React.useRef(null);
  const tell = React.useRef(onOpenChange);
  tell.current = onOpenChange;
  const setOpen = React.useCallback((next, where) => { if (!controlled) setOwn(next); if (tell.current) tell.current(next, { start: where || 'first' }); }, [controlled]);
  const close = React.useCallback((refocus) => { setOpen(false); if (refocus && button.current) button.current.focus(); }, [setOpen]);
  useLayer(list, open, { onEscape: () => close(true) });
  // placed against its trigger's wrapper by useFloating (anchor positioning, in the top layer); without it, drawn inside the wrapper
  useFloating(wrap, list, { open: open && TOP_LAYER, placement });
  // into the top layer as soon as it is in the page (before the first item takes focus)
  React.useLayoutEffect(() => { const el = list.current; if (open && TOP_LAYER && el && el.showPopover && !el.matches(':popover-open')) el.showPopover(); }, [open]);
  React.useEffect(() => {
    if (!open) return undefined;
    const items = itemsIn(list.current);
    if (items.length) (start === 'last' ? items[items.length - 1] : items[0]).focus();
    const outside = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, [open]);
  const openAt = (where) => { setStart(where); setOpen(true, where); };
  const child = React.Children.only(trigger);
  const triggerEl = React.cloneElement(child, {
    ref: button, 'aria-haspopup': 'menu', 'aria-expanded': open, 'aria-controls': open ? id : undefined, expanded: undefined,
    onClick: (e) => { if (child.props.onClick) child.props.onClick(e); if (open) close(false); else openAt('first'); },
    onKeyDown: (e) => {
      if (child.props.onKeyDown) child.props.onKeyDown(e);
      if (e.key === 'ArrowDown') { e.preventDefault(); openAt('first'); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); openAt('last'); }
    },
  });
  const onKeyDown = (e) => {
    if (e.key === 'Tab') { setOpen(false); return; }
    moveIn(list.current, e);
  };
  return (
    <span ref={wrap} className={cx('plx-menu-anchor', className)}>
      {triggerEl}
      {open ? (
        <MenuContext.Provider value={close}>
          <div ref={list} id={id} role="menu" aria-label={label} popover={TOP_LAYER ? 'manual' : undefined} className={cx('plx-menu', 'plx-menu--' + placement)} onKeyDown={onKeyDown}>{children}</div>
        </MenuContext.Provider>
      ) : null}
    </span>
  );
}

export function MenuItem({ icon, danger = false, disabled = false, checked, type, value, keepOpen = false, href, onSelect, className, children, ...rest }) {
  const close = React.useContext(MenuContext);
  const group = React.useContext(RadioContext);
  const radio = type === 'radio' || (!!group && value !== undefined);
  const on = radio && group && value !== undefined ? group.value === value : checked;
  const marked = radio || checked !== undefined;
  const role = radio ? 'menuitemradio' : checked === undefined ? 'menuitem' : 'menuitemcheckbox';
  const stay = keepOpen || (radio && !!group && group.keepOpen);
  const props = {
    role, tabIndex: -1, 'data-plx-menu-item': '', 'aria-checked': marked ? !!on : undefined,
    'aria-disabled': disabled || undefined, className: cx('plx-menu__item', danger && 'plx-menu__item--danger', className),
    onClick: (e) => {
      if (disabled) { e.preventDefault(); return; }
      if (radio && group && value !== undefined && group.onChange && group.value !== value) group.onChange(value);
      if (onSelect) onSelect(e);
      if (close && !stay) close(true);
    },
    ...rest,
  };
  const content = (
    <>
      {marked ? <span className={cx('plx-menu__check', radio && 'plx-menu__check--radio', on && 'is-checked')} aria-hidden="true">{on ? <Icon icon={CheckIcon} filled={false} /> : null}</span> : null}
      {icon ? <span className="plx-menu__icon">{asIcon(icon)}</span> : null}
      <span className="plx-menu__label">{children}</span>
    </>
  );
  return href && !disabled ? <a href={href} {...props}>{content}</a> : <button type="button" {...props}>{content}</button>;
}

export function MenuDivider() {
  return <div role="separator" className="plx-menu__divider" />;
}

export function MenuGroup({ label, children }) {
  const id = useUid('plx-mg');
  return (
    <div role="group" aria-labelledby={id} className="plx-menu__group">
      <div id={id} className="plx-menu__group-label">{label}</div>
      {children}
    </div>
  );
}

/* MenuRadioGroup: a labeled set of radio items, one checked (a sort order, a view) */
export function MenuRadioGroup({ label, value, onChange, keepOpen = false, children }) {
  const id = useUid('plx-mrg');
  const ctx = React.useMemo(() => ({ value, onChange, keepOpen }), [value, onChange, keepOpen]);
  return (
    <div role="group" aria-labelledby={label ? id : undefined} className="plx-menu__group plx-menu__group--radio">
      {label ? <div id={id} className="plx-menu__group-label">{label}</div> : null}
      <RadioContext.Provider value={ctx}>{children}</RadioContext.Provider>
    </div>
  );
}

/* MenuSub: an item that opens a submenu beside it (one level) */
export function MenuSub({ label, icon, disabled = false, className, children }) {
  const id = useUid('plx-menu-sub');
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null), item = React.useRef(null), list = React.useRef(null), focusFirst = React.useRef(false);
  const back = React.useCallback(() => { setOpen(false); if (item.current) item.current.focus(); }, []);
  useLayer(list, open, { onEscape: back });
  // at the item's end edge, level with it (useFloating end-top; the gap is the menu's own, menu.css)
  useFloating(item, list, { open: open && TOP_LAYER, placement: 'end-top', offset: 'none' });
  React.useLayoutEffect(() => { const el = list.current; if (open && TOP_LAYER && el && el.showPopover && !el.matches(':popover-open')) el.showPopover(); }, [open]);
  React.useEffect(() => {
    if (!open || !focusFirst.current) return;
    focusFirst.current = false;
    const items = itemsIn(list.current);
    if (items.length) items[0].focus();
  }, [open]);
  const openIt = (withFocus) => { if (disabled) return; focusFirst.current = withFocus; setOpen(true); };
  const forward = (e) => (isRtl(wrap.current) ? e.key === 'ArrowLeft' : e.key === 'ArrowRight');
  const backward = (e) => (isRtl(wrap.current) ? e.key === 'ArrowRight' : e.key === 'ArrowLeft');
  const onItemKey = (e) => {
    if (forward(e) || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); openIt(true); }
  };
  const onListKey = (e) => {
    if (backward(e)) { e.preventDefault(); e.stopPropagation(); back(); return; }
    if (e.key === 'Tab') return;   // the root menu closes
    if (moveIn(list.current, e)) e.stopPropagation();
  };
  return (
    <div ref={wrap} className={cx('plx-menu-sub', className)}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setOpen(false); }}
      onBlur={(e) => { if (open && e.relatedTarget && wrap.current && !wrap.current.contains(e.relatedTarget)) setOpen(false); }}>
      <button ref={item} type="button" role="menuitem" tabIndex={-1} data-plx-menu-item="" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined}
        aria-disabled={disabled || undefined} className={cx('plx-menu__item', 'plx-menu-sub__item', open && 'is-open')}
        onClick={(e) => { e.preventDefault(); if (open) setOpen(false); else openIt(true); }} onKeyDown={onItemKey}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse' && !open) openIt(false); }}>
        {icon ? <span className="plx-menu__icon">{asIcon(icon)}</span> : null}
        <span className="plx-menu__label">{label}</span>
        <span className="plx-menu-sub__arrow" aria-hidden="true"><Icon name={TriangleRightIcon} /></span>
      </button>
      {open ? (
        <div ref={list} id={id} role="menu" aria-label={typeof label === 'string' ? label : undefined} popover={TOP_LAYER ? 'manual' : undefined}
          className="plx-menu plx-menu-sub__list" onKeyDown={onListKey}>{children}</div>
      ) : null}
    </div>
  );
}

/* ContextMenu: the menu of a target, at the pointer (right-click, long press) or at the target (Shift+F10, Menu key) */
export function ContextMenu({ target, label, onOpenChange, disabled = false, children }) {
  const id = useUid('plx-context-menu');
  const [point, setPoint] = React.useState(null);
  const open = !!point;
  const anchor = React.useRef(null), list = React.useRef(null), opener = React.useRef(null);
  const show = React.useCallback((p) => {
    opener.current = document.activeElement;
    setPoint(p);
    if (onOpenChange) onOpenChange(true);
  }, [onOpenChange]);
  const close = React.useCallback((refocus) => {
    setPoint(null);
    if (onOpenChange) onOpenChange(false);
    const back = opener.current && opener.current !== document.body && document.contains(opener.current) ? opener.current : anchor.current;
    if (refocus && back && back.focus) back.focus();
  }, [onOpenChange]);
  useLayer(list, open, { onEscape: () => close(true) });
  useFloating(anchor, list, { open, placement: 'bottom-start', virtual: point });
  // at the target: its start edge, below it (where a keyboard opening puts it)
  const atTarget = () => {
    const r = anchor.current.getBoundingClientRect();
    return { x: Math.round(isRtl(anchor.current) ? r.right : r.left), y: Math.round(r.bottom) };
  };
  useGesture(anchor, { disabled, onLongPress: (g) => { if (g.pointerType !== 'mouse' && !open) show({ x: g.x, y: g.y }); } });
  React.useEffect(() => {
    if (!open) return undefined;
    const items = itemsIn(list.current);
    if (items.length) items[0].focus({ preventScroll: true });
    const outside = (e) => { if (list.current && !list.current.contains(e.target)) close(false); };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, [open]);
  const child = React.Children.only(target);
  const targetEl = React.cloneElement(child, disabled ? {} : {
    ref: anchor,   // no popup ARIA on the target: a row or a card keeps its own role (aria-haspopup is for buttons and menu items)
    onContextMenu: (e) => {
      if (child.props.onContextMenu) child.props.onContextMenu(e);
      e.preventDefault();
      // a keyboard opening has no pointer position: the target's is used
      show(e.clientX || e.clientY ? { x: e.clientX, y: e.clientY } : atTarget());
    },
    onKeyDown: (e) => {
      if (child.props.onKeyDown) child.props.onKeyDown(e);
      if ((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu') { e.preventDefault(); show(atTarget()); }
    },
  });
  const onKeyDown = (e) => {
    if (e.key === 'Tab') { close(false); return; }
    moveIn(list.current, e);
  };
  return (
    <>
      {targetEl}
      {open ? (
        <Portal layer="top">
          <MenuContext.Provider value={close}>
            <div ref={list} id={id} role="menu" aria-label={label} className="plx-menu plx-context-menu" onKeyDown={onKeyDown}>{children}</div>
          </MenuContext.Provider>
        </Portal>
      ) : null}
    </>
  );
}
