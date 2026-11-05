/* Plenix · MenuBar, MenuBarMenu
   Summary: A bar of menus across an application (File, Edit, View): a row of menu buttons that work together, as the menu bar pattern of the
     WAI-ARIA Authoring Practices (issue 805, owner 2026-11-02; the keys are Radix Menubar's). Each menu is the Menu: its items, check and radio
     items, groups and sub menus are the Menu's own. A menu bar is for the commands of an application, not for links between pages (that is
     navigation: MegaMenu or the navigation list).
   Usage:
     <MenuBar label="Application">
       <MenuBarMenu label="File">
         <MenuItem onSelect={newFile}>New</MenuItem>
         <MenuSub label="Open recent"><MenuItem onSelect={…}>Report.docx</MenuItem></MenuSub>
         <MenuDivider/>
         <MenuItem checked={ruler} onSelect={toggleRuler}>Show ruler</MenuItem>
       </MenuBarMenu>
       <MenuBarMenu label="Edit">…</MenuBarMenu>
     </MenuBar>
   Props:
     MenuBar.label: the accessible name of the bar ("Application"); without it the bar has no name
     MenuBar.size: the size of the menu buttons: "sm" | "md" (default "md")
     MenuBar.strings: the words it shows and announces, for other languages: { more: "More menus" }
     MenuBar.className: more classes on the bar
     MenuBar.children: the menus, in order: MenuBarMenu
     MenuBarMenu.label: the menu button's text (File), also the menu's accessible name
     MenuBarMenu.children: the menu's items: MenuItem, MenuGroup, MenuRadioGroup, MenuSub, MenuDivider, as in Menu
   Behavior:
     One Tab stop: Tab reaches the bar once, on the menu button that last had focus (the first, at first), and Tab leaves it again.
     Left and Right move between the menu buttons (Right and Left in right-to-left, as the eye reads), wrapping; Home and End go to the first and
       last. Typing a letter moves to the next menu button whose text starts with it.
     Down, Enter or Space opens the menu on its first item; Up opens it on its last.
     With a menu open: Left and Right switch to the neighboring menu (a sub menu takes them first: Right opens it, Left closes it, mirrored in
       right-to-left); Escape closes the menu and returns focus to its button; Tab closes it and leaves the bar.
     Hover does nothing until a menu is open; once one is, pointing at another menu button opens that one.
     The bar never wraps. The menus that do not fit fold into a "More menus" button at its end, from the last one, each as a labeled group of its
       items (the fit is the command bar's, utils/barFit.ts: it refits when the width, the menus or the fonts change, and waits while a menu is
       open so the list under the person never changes). When the button that has focus folds, focus moves to "More menus".
   Notes:
     The look is Radix Menubar's: a bordered bar with a little padding, the menu buttons as ghost buttons, the open one filled. Tokens only.
     Use Menu for one list opened from a button; use MenuBar for File, Edit and View across an application; use the command bar (CommandBar) for the
       buttons over a table, which swaps to the selection's commands when rows are ticked. Toolbar and DataToolbar are building blocks of bars of buttons.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useBarFit } from '../../utils/barFit.ts';
import { isRtl } from '../../utils/direction.ts';
import { Button } from '../Button/Button.tsx';
import { Menu, MenuGroup } from '../Menu/Menu.tsx';
import type { MenuStart } from '../Menu/Menu.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import MoreIcon from 'plenix-platform/icons/plenix/more';

// a declaration: the bar reads the label and the items of each menu and draws them itself (as a button and a Menu, or as a group in More)
export function MenuBarMenu(_props: { label: React.ReactNode; children?: React.ReactNode }): null { return null; }

type MenuBarProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** the bar's accessible name */
  label?: string;
  /** the buttons' size; default "md" */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** { more } */
  strings?: Catalog | null;
  /** MenuBarMenu elements: { label, children (MenuItems) } */
  children?: React.ReactNode;
};
type OpenAt = { index: number; start: MenuStart };
export function MenuBar({ label, size = 'md', strings, className, children, ...rest }: MenuBarProps) {
  const t = useStrings('menuBar', strings) as { more: string };
  const menus = React.Children.toArray(children).filter((c): c is React.ReactElement<{ label: React.ReactNode; children?: React.ReactNode }> => React.isValidElement(c));
  const bar = React.useRef<HTMLDivElement>(null), focused = React.useRef(false);
  const [active, setActive] = React.useState(0);   // the one Tab stop: the index of the top item that last had focus
  const [openAt, setOpenAt] = React.useState<OpenAt | null>(null);   // { index, start }: which menu is open, and where focus lands in it
  const key = menus.map((m) => m.props.label).join('|') + '|' + size;
  const step = useBarFit(bar, key, menus.length, 0, ':self', openAt !== null);
  const shown = Math.max(0, menus.length - step), folded = menus.slice(shown);
  const stops = shown + (folded.length ? 1 : 0);   // the top items: the menus that fit, then "More menus"
  const at = Math.min(active, Math.max(0, stops - 1));

  const items = (): HTMLElement[] => (bar.current ? Array.prototype.slice.call(bar.current.querySelectorAll('[data-plx-menubar-item]')) : []);
  const focusTop = (i: number) => { const el = items()[i]; if (el) el.focus(); };
  const towards = (e: React.KeyboardEvent) => (e.key === 'ArrowRight' ? 1 : -1) * (isRtl(bar.current as Element) ? -1 : 1);
  const labelAt = (i: number) => (i < shown ? String(menus[i].props.label) : t.more);

  // the menu button that had focus folded away: focus would fall to the page; "More menus" takes it
  React.useLayoutEffect(() => {
    const el = bar.current;
    if (!el || !focused.current || el.contains(document.activeElement)) return;
    const more = items()[stops - 1];
    if (more) { focused.current = false; more.focus(); }
  }, [shown]);   // eslint-disable-line react-hooks/exhaustive-deps

  // the keys of the menu buttons (a menu's own keys, Down and Up, are the Menu's)
  const onButtonKey = (i: number) => (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); focusTop((i + towards(e) + stops) % stops); }
    else if (e.key === 'Home') { e.preventDefault(); focusTop(0); }
    else if (e.key === 'End') { e.preventDefault(); focusTop(stops - 1); }
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      // type-ahead: the next menu button whose text starts with the letter, wrapping
      const k = e.key.toLocaleLowerCase();
      for (let n = 1; n <= stops; n += 1) { const j = (i + n) % stops; if (labelAt(j).toLocaleLowerCase().startsWith(k)) { e.preventDefault(); focusTop(j); break; } }
    }
  };
  // Left and Right inside an open menu switch to the neighboring one (a sub menu takes them first and stops them)
  const onBarKey = (e: React.KeyboardEvent) => {
    if (openAt === null || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') || !(e.target as Element).closest('[role="menu"]') || e.ctrlKey || e.metaKey || e.altKey) return;
    e.preventDefault();
    const j = (openAt.index + towards(e) + stops) % stops;
    setActive(j);
    setOpenAt({ index: j, start: 'first' });
  };
  const change = (i: number) => (open: boolean, where?: { start?: MenuStart }) => setOpenAt((cur) => (open ? { index: i, start: (where && where.start) || 'first' } : cur && cur.index === i ? null : cur));
  const button = (i: number, content: React.ReactNode, extra?: Record<string, unknown>) => (
    <Button variant="ghost" size={size} role="menuitem" tabIndex={at === i ? 0 : -1} data-plx-menubar-item="" className="plx-menubar__item"
      onFocus={() => { focused.current = true; setActive(i); }} onBlur={() => { focused.current = false; }}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse' && openAt !== null && openAt.index !== i) setOpenAt({ index: i, start: 'first' }); }}
      onKeyDown={onButtonKey(i)} {...extra}>{content}</Button>
  );
  return (
    <div ref={bar} role="menubar" aria-label={label || undefined} className={cx('plx-menubar', className)} onKeyDown={onBarKey} {...rest}>
      {menus.slice(0, shown).map((m, i) => (
        <Menu key={m.key || i} label={String(m.props.label)} className="plx-menubar__menu" open={openAt !== null && openAt.index === i} openStart={openAt !== null && openAt.index === i ? openAt.start : undefined}
          onOpenChange={change(i)} trigger={button(i, m.props.label)}>
          {m.props.children}
        </Menu>
      ))}
      {folded.length ? (
        <Menu label={t.more} placement="bottom-end" className="plx-menubar__menu" open={openAt !== null && openAt.index === shown} openStart={openAt !== null && openAt.index === shown ? openAt.start : undefined}
          onOpenChange={change(shown)} trigger={button(shown, null, { iconOnly: true, icon: MoreIcon, label: t.more })}>
          {folded.map((m, i) => <MenuGroup key={m.key || i} label={m.props.label}>{m.props.children}</MenuGroup>)}
        </Menu>
      ) : null}
    </div>
  );
}
