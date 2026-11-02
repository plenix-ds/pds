/* Plenix · Toolbar, Toolbar.Group, Toolbar.Spacer
   Summary: One row of controls (role="toolbar"). It never wraps to a second row: when its Buttons do not fit, they drop their words, then fold into More actions.
   Usage:
     <Toolbar label="Asset actions">
       <Toolbar.Group>…</Toolbar.Group>
       <Toolbar.Spacer/>
       <Toolbar.Group>…</Toolbar.Group>
     </Toolbar>
   Props:
     Toolbar.label: its accessible name
     Toolbar.variant: "default" (one row, gaps follow the density; its Buttons fold, below) | "bar" (one row, fixed gaps, no folding of its own: CommandBar, which has its own ladder)
     Toolbar.onKeyDown(event): runs first; preventDefault stops the toolbar's own key handling
     Toolbar.className: more classes on the toolbar
     Toolbar.children: controls, groups and spacers. Stack and Inline layout wrappers (also nested inside Group) are transparent: toolbar spacing applies to their controls.
       Keep semantic composites together; do not wrap popup internals in a layout wrapper intended to be flattened.
     Toolbar.Group.className: more classes on the group
     Toolbar.Group.children: the controls in the group
     Toolbar.Spacer: pushes what follows to the end of the row; no props
     Button.priority (read by the Toolbar): "high" | "normal" | "low" (default "normal"): low folds into More first, then normal, then high; within a priority the last
       Button first, the danger ones (variant danger or danger-secondary) last of theirs. The primary Button (variant primary) never folds and keeps its words longest
   Behavior:
     Fit (platform/standards/fit-and-overflow.md): the toolbar measures itself. When its Buttons do not fit, step 1 drops the words of the Buttons that have an icon (the
       icon stays; the name is the accessible name and shows in a tooltip on hover and keyboard focus); then one Button per step moves into one "More actions" (⋮) button,
       the Menu, in the order above; in the menu each shows its icon and full words, the danger ones last after a divider. More shows only when something has
       folded, and the steps start again whenever the width or the Buttons change. Only a Button with a text label folds; fields, selects and menus stay where they are.
       The focus order does not change when Buttons fold: the toolbar stays one Tab stop and More is one more control in it.
     One Tab stop: Tab enters and leaves the toolbar; the current control (the one last used) is in the Tab order.
     Arrow keys move between its controls in reading order (wrapping; reversed in right to left); Home and End jump to the
     first and last.
     Tab leaves the toolbar.
     Text fields, text areas, selects and editable regions keep their own arrow and Home/End behavior.
     Descendant controls are discovered through wrappers; nested toolbars retain their own focus scope.
     In a radio group, only the checked option is a stop.
   Notes:
     Every control in it takes the toolbar control height.
     Its one Tab stop and its arrow keys are the shared focus group (useFocusGroup, hooks/useFocusable.ts).
     Other props reach the toolbar or group element.
*/
import React from 'react';
import { roveTo } from '../../utils/roving.ts';
import { useFocusGroup } from '../../hooks/useFocusable.ts';
import { cx } from '../../utils/cx.ts';
import { useBarFit } from '../../utils/barFit.ts';
import { foldOrder, menuOrder } from '../../utils/foldOrder.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { Button } from '../Button/Button.tsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { Menu, MenuItem, MenuDivider } from '../Menu/Menu.tsx';
import MoreIcon from 'plenix-platform/icons/plenix/more';

const POPUP = '[role="dialog"],[role="alertdialog"],[role="menu"],[role="listbox"],[role="tree"],[role="grid"],[role="tablist"]';
const FOCUSABLE = 'button,input,textarea,select,a[href],[tabindex],[contenteditable="true"]';

// A Button that a toolbar can fold: words it can drop (its icon stays) and, past that, a place in More; an icon-only Button (it has a label) only has the place in More. Not a link or a menu-trigger button.
const nameOf = (p) => (typeof p.children === 'string' ? p.children : p.iconOnly && typeof p.label === 'string' ? p.label : null);
const isFoldable = (el) => React.isValidElement(el) && el.type === Button && nameOf(el.props) !== null && !el.props.href && !el.props.caret;
// a menu whose trigger is a Button with an icon and words (Delete ▾): at the icon-only step it drops its words too, and stays where it is
const isTrimmable = (el) => React.isValidElement(el) && el.type === Menu && React.isValidElement(el.props.trigger) && el.props.trigger.type === Button && typeof el.props.trigger.props.children === 'string' && !!el.props.trigger.props.icon && !el.props.trigger.props.iconOnly;
const collect = (nodes, out) => {
  React.Children.forEach(nodes, (el) => {
    if (!React.isValidElement(el)) return;
    if (el.type === Toolbar.Group || el.type === React.Fragment) collect(el.props.children, out);
    else if (isFoldable(el)) out.push({ id: out.length, label: nameOf(el.props), iconOnly: !!el.props.iconOnly, icon: el.props.icon, primary: el.props.variant === 'primary', danger: /^danger/.test(el.props.variant || '') || !!el.props.danger, priority: el.props.priority, props: el.props });
  });
  return out;
};

export function Toolbar({ label, variant = 'default', className, children, onKeyDown, onFocus, ...rest }) {
  const ref = React.useRef(null);
  const t = useStrings('commandBar');
  // the ladder (platform/standards/fit-and-overflow.md): one row at every width. Step 0 shows every Button as written; step 1 drops the words of the
  // Buttons that have an icon (the icon stays, with the name as a tooltip and the accessible name); then one Button per step moves into More. A bar variant
  // (CommandBar) has its own ladder and is left as it is. Only a Button with a text label folds; other controls (fields, selects, menus) stay where they are
  const ladder = variant !== 'bar';
  const acts = ladder ? collect(children, []) : [];
  const step = useBarFit(ref, acts.map((a) => a.label).join('|'), ladder && acts.length ? 1 + acts.length : 0, 0, ':self');
  const iconOnly = ladder && step >= 1;
  const folded = new Set(foldOrder(acts).slice(0, ladder ? Math.max(0, step - 1) : 0).map((a) => a.id));
  let n = 0;
  const walk = (nodes) => React.Children.map(nodes, (el) => {
    if (!React.isValidElement(el)) return el;
    if (el.type === Toolbar.Group) return React.cloneElement(el, undefined, walk(el.props.children));
    if (el.type === React.Fragment) return <>{walk(el.props.children)}</>;
    if (ladder && isTrimmable(el)) return iconOnly ? React.cloneElement(el, { trigger: React.cloneElement(el.props.trigger, { children: undefined, 'aria-label': el.props.trigger.props.children }) }) : el;
    if (!ladder || !isFoldable(el)) return el;
    const id = n++;
    if (folded.has(id)) return null;
    const a = acts[id];
    if (!a.icon || a.primary || a.iconOnly) return el;   // no icon to keep (or the primary action: it keeps its words longest): it stays as written
    // always wrapped, so a Button keeps its place (and its focus) when its words go; the tooltip shows only while it is an icon
    return <Tooltip content={a.label} disabled={!iconOnly}>{iconOnly ? React.cloneElement(el, { iconOnly: true, label: a.label, priority: undefined }) : React.cloneElement(el, { priority: undefined })}</Tooltip>;
  });
  const away = menuOrder(acts.filter((a) => folded.has(a.id)));
  const more = away.length ? (
    <Menu label={t.moreLabel} placement="bottom-end" trigger={<Button icon={MoreIcon} variant="ghost" iconOnly label={t.moreLabel} size={acts[0] && acts[0].props.size} />}>
      {away.map((a, i) => [a.danger && i > 0 && !away[i - 1].danger ? <MenuDivider key={a.id + 'd'} /> : null,
        <MenuItem key={a.id} icon={a.icon} danger={a.danger} disabled={a.props.disabled} onSelect={a.props.onClick}>{a.label}</MenuItem>])}
    </Menu>
  ) : null;
  const itemsOf = () => (ref.current ? Array.prototype.filter.call(ref.current.querySelectorAll(FOCUSABLE), (el) =>
    el.closest('[role="toolbar"]') === ref.current && (!el.closest(POPUP) || !ref.current.contains(el.closest(POPUP))) && el.getClientRects().length && getComputedStyle(el).visibility === 'visible'
    && !el.matches(':disabled,[aria-disabled="true"]') && !el.closest('[inert],[aria-hidden="true"]')
    && !el.closest('[role="radiogroup"] [aria-checked="false"]')
    && (el.matches('button,input,textarea,select,a[href],[contenteditable="true"]') || el.tabIndex >= 0 || el.hasAttribute('data-plx-roving'))) : []);
  React.useEffect(() => {
    const root = ref.current; if (!root) return;
    const refresh = () => {
      root.querySelectorAll('[data-plx-toolbar-layout]').forEach((el) => { if (el.closest('[role="toolbar"]') === root) el.removeAttribute('data-plx-toolbar-layout'); });
      const visit = (parent) => Array.from(parent.children).forEach((el) => {
        if (el.matches('.plx-stack,.plx-inline') && getComputedStyle(el).display !== 'none') { el.setAttribute('data-plx-toolbar-layout', ''); visit(el); }
        else if (el.classList.contains('plx-toolbar__group')) visit(el);
      });
      visit(root);
      const items = itemsOf();
      roveTo(ref, items, items.find((el) => el.getAttribute('data-plx-roving') === 'current') || items[0]);
    };
    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'hidden', 'inert', 'aria-hidden', 'aria-disabled', 'class'] });
    const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(refresh) : null;
    if (resize) resize.observe(root);
    window.addEventListener('resize', refresh);
    return () => { observer.disconnect(); if (resize) resize.disconnect(); window.removeEventListener('resize', refresh); };
  }, []);
  // one Tab stop and the arrow keys: the shared focus group (hooks/useFocusable.ts), with the toolbar's own item rules. The
  // keys stay a text field's, a select's, an editable region's, a popup's and a nested toolbar's own (ignore).
  const { groupProps } = useFocusGroup(ref, {
    items: itemsOf, orientation: 'horizontal', loop: true, modifiers: true, onKeyDown,
    ignore: (e) => /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable
      || (e.target.closest(POPUP) && ref.current.contains(e.target.closest(POPUP))) || e.target.closest('[role="toolbar"]') !== ref.current
  });
  const onFocusIn = (e) => { if (onFocus) onFocus(e); groupProps.onFocus(e); };
  return <div ref={ref} role="toolbar" aria-label={label} className={cx('plx-toolbar', variant === 'bar' && 'plx-toolbar--bar', className)} onKeyDown={groupProps.onKeyDown} onFocus={onFocusIn} data-plx-fit-shrink={ladder ? (acts.length ? step >= 1 + acts.length : true) || undefined : undefined} {...rest}>{ladder ? walk(children) : children}{more}</div>;
}
Toolbar.Group = function ToolbarGroup({ className, children, ...rest }) {
  return <div className={cx('plx-toolbar__group', className)} {...rest}>{children}</div>;
};
Toolbar.Spacer = function ToolbarSpacer() {
  return <div className="plx-toolbar__spacer" aria-hidden="true" />;
};
