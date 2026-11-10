/* Plenix · ActionBar
   Summary: A page's or a form's buttons in one bar on the right, kept in view at the bottom of the page while it scrolls. It is one row at every width: what does not fit folds into More actions.
   Usage:
     <ActionBar label="Asset type actions">
       <Button variant="danger-secondary" onClick={remove}>Delete</Button>
       <Button priority="high" onClick={cancel}>Cancel</Button>
       <Button type="submit" variant="primary">Save changes</Button>
     </ActionBar>
   Props:
     label: names the group of buttons for screen readers; default "Actions"
     sticky: true (default) keeps page actions at the scroll bottom; false keeps an embedded bar in normal flow
     className: more classes on the bar
     children: the buttons, in reading order, the primary action last (it sits at the right edge); a destructive action
       first, away from the primary. Button.priority ("high" | "normal" | "low", default "normal") says which fold into More first
   Behavior:
     The bar sticks to the bottom of the scrolling page (or form) it is in, so its buttons stay reachable on a long page;
     at the end of the page it sits in its place under the content.
     It never wraps to a second row (platform/standards/fit-and-overflow.md): when its buttons do not fit, the secondary actions move into
       one "More actions" (⋮) button, the Menu, in the folding order of Toolbar (low priority first, then the last button first, the danger ones
       last of theirs), and the primary action (variant primary) and the button that folds last (Cancel, by order or priority="high") stay. The
       labels never hide: a footer's actions are words. In the menu each shows its icon and full words, the danger ones after a divider.
     In a window under 400px (a phone; the window, not the bar) the primary button and the one kept beside it stack full width, the primary
       first, and every other action is in More, which sits on Cancel's row.
   Notes:
     Every page or form with actions uses it (the owner, batch 231: buttons on the right, in a bar that sticks to the
     bottom); SettingsSection's actions are drawn in one. Dialogs, panels and side panels keep their own footers (also
     on the right). A toolbar of tools (an editor's Save, Export) is a Toolbar, not an ActionBar.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useBarFit } from '../../utils/barFit.ts';
import { foldOrder, menuOrder } from '../../utils/foldOrder.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { useMedia, below } from '../AppShell/AppShell.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Menu, MenuItem, MenuDivider } from '../../components/Menu/Menu.tsx';
import MoreIcon from 'plenix-platform/icons/plenix/more';

// a Button that can fold: a text label, not a link; the primary one never does
const isButton = (el: any) => React.isValidElement(el) && el.type === Button && typeof (el as any).props.children === 'string' && !(el as any).props.href;
const collect = (nodes: any, out: any) => {
  React.Children.forEach(nodes, (el) => {
    if (!React.isValidElement(el)) return;
    if (el.type === React.Fragment) collect((el as any).props.children, out);
    else if (isButton(el)) out.push({ id: out.length, label: (el as any).props.children, icon: (el as any).props.icon, primary: (el as any).props.variant === 'primary', danger: /^danger/.test((el as any).props.variant || ''), priority: (el as any).props.priority, props: (el as any).props });
  });
  return out;
};

/** @public */
export type ActionBarProps = {
  /** names the group of buttons for screen readers (default "Actions") */
  label?: string;
  /** true (default) keeps page actions at the scroll bottom; false keeps an embedded bar in normal flow */
  sticky?: boolean;
  className?: string;
  children?: React.ReactNode;
};
export function ActionBar({ label, sticky = true, className, children }: ActionBarProps) {
  const t: any = useStrings('actionBar');
  const tc: any = useStrings('commandBar');
  const ref = React.useRef<any>(null);
  const phone = useMedia(below('--plx-sys-fit-footer-stack-width'));
  // a sticky bar marks the page (:root) so it keeps focused content clear of the bar; a :has() on :root would re-check on every DOM change (issue 1235)
  React.useEffect(() => {
    if (!sticky) return undefined;
    const root = document.documentElement, n = Number(root.getAttribute('data-plx-action-bars') || 0) + 1;
    root.setAttribute('data-plx-action-bars', String(n)); root.classList.add('plx-root-action-bar');
    return () => { const left = Number(root.getAttribute('data-plx-action-bars') || 1) - 1; if (left <= 0) { root.removeAttribute('data-plx-action-bars'); root.classList.remove('plx-root-action-bar'); } else root.setAttribute('data-plx-action-bars', String(left)); };
  }, [sticky]);
  const acts = collect(children, []);
  const foldable = acts.filter((a: any) => !a.primary);
  // the key holds the phone state: a bar measured while the window was a phone starts again when the window grows back. The button that folds last never folds on its own
  const measured = useBarFit(ref, acts.map((a: any) => a.label).join('|') + (phone ? '|phone' : ''), Math.max(0, foldable.length - 1), 0, ':self');
  // in a phone window every action but the one that folds last is in More; otherwise only what does not fit
  const fold = phone ? Math.max(0, foldable.length - 1) : measured;
  const folded = new Set(foldOrder(acts).slice(0, fold).map((a) => a.id));
  let n = 0, placed = false;
  const more = () => {
    const away = menuOrder(acts.filter((a: any) => folded.has(a.id)));
    if (!away.length) return null;
    return (
      <Menu key="plx-more" label={tc.moreLabel} placement="top-end" trigger={<Button icon={MoreIcon} variant="ghost" iconOnly label={tc.moreLabel} className="plx-action-bar__more" />}>
        {away.map((a: any, i: number) => [a.danger && i > 0 && !away[i - 1].danger ? <MenuDivider key={a.id + 'd'} /> : null,
          <MenuItem key={a.id} icon={a.icon} danger={a.danger} disabled={a.props.disabled} onSelect={a.props.onClick}>{a.label}</MenuItem>])}
      </Menu>
    );
  };
  const walk = (nodes: any): any => React.Children.map(nodes, (el) => {
    if (!React.isValidElement(el)) return el;
    if (el.type === React.Fragment) return <>{walk((el as any).props.children)}</>;
    if (!isButton(el)) return el;
    const id = n++;
    if (folded.has(id)) return null;
    const a = acts[id];
    // More sits before the primary action (or at the end), so it is on Cancel's row in a phone window
    const lead = a.primary && !placed ? (placed = true, more()) : null;
    return <>{lead}{React.cloneElement(el as any, { priority: undefined, className: cx((el as any).props.className, a.primary ? 'plx-action-bar__primary' : 'plx-action-bar__action') })}</>;
  });
  const body = walk(children);
  return <div ref={ref} role="group" aria-label={label ?? t.label} data-plx-fit-shrink={measured >= Math.max(0, foldable.length - 1) || undefined} className={cx('plx-action-bar', !sticky && 'plx-action-bar--static', className)}>{body}{placed ? null : more()}</div>;
}
