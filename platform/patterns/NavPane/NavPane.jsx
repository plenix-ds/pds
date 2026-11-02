/* Plenix · NavPane
   Summary: The navigation pane, the same on every page of every application. Give it to the AppShell's sideNav (or a
     SideNavPortal); the shell owns its size and state.
   Usage:
     <NavPane label="Categories and collections" title="Asset Manager" actions={<…/>}
       header={<…/>} rail={<…/>} footer={<…/>}>{children}</NavPane>
   Props:
     label: names the navigation landmark (also the rail and the splitter)
     title: the pane's title, the application's or the page's name (Messages, Asset Manager, System Settings)
     actions: the pane's actions in the title row: small icon buttons such as Filter and New, or a field such as a project switcher (a Select).
       They fit the pane (issue 677): a field shrinks to the fit-field minimum (--plx-sys-fit-field-min-width) and shows its cut text in full in a
       tooltip; a button with words ends in an ellipsis; with no title the actions fill the row
     as: "nav" (default; a navigation landmark) | "div" (when the content brings its own landmark, a NavList)
     header: a second row under the title row, for the pane's own shortcuts (the asset browser's Home and Files); they fit the pane the same way
     footer: a row pinned to the bottom (--plx-comp-pane-footer-height, its divider drawn inside): the app's or section's
       settings, or the way back from a settings screen
     rail: the page's rail items (<ToolRail.Item…/>), shown when the pane is collapsed; at Narrow, the destinations of the
       bottom navigation bar
     collapseAt: "end" (default; the row's end, facing the main region) | "start" (only for a pane on the right)
     width: its own width outside an AppShell (default: the shell navigation width)
     strings: the words it shows, for other languages: { browse: "Browse" } (the bar's destination that opens the pane)
     className: more classes on the pane
     children: the body: NavList groups (whose headings are collapsible section headers), a filter field, buttons
   Behavior:
     Its size follows the Layout grid's shell: --plx-sys-shell-nav-width (240px; 272px from a window 1440px wide, 320px from 1920px: the -from-1440 and -from-1920 tokens, set in system/grid.css; its dragged width is remembered per monitor, utils/monitorWidths.ts), resizable 140–320px (dragged, 144–320px: the 8px drag grid inside those limits, issue 882) with the splitter on its
       edge: dragged, it moves one drag-grid line (8px, issue 882) at a time and stays on the grid; the arrow keys move it by
       --plx-sys-shell-splitter-step; Enter or a double-click on the edge folds the pane to its rail.
     The first row is the same on every pane: the title, the actions, then the Collapse button at the row's end, on the side
       that faces the main region.
     Collapsed, it is a rail (ToolRail) of the page's rail items with Expand always first, at the top, then a divider.
     The window class (Platforms Standard 3.3) decides its form (4.1, 6.4):
       Wide (840px and up): beside the main region, as above.
       Medium (600–839px): a rail whose Expand opens the expanded rail over the main region; Escape or a click outside
         closes it.
       Narrow (under 600px): never a drawer. With two or more rail items, the page's top-level destinations are a bottom
         navigation bar: up to four of them, then Browse, which opens the pane as a screen of its own (every other
         destination is in it). Without, the pane is the first screen of a stack, and a parent row at the top of the page
         (the pane's title after a back arrow) opens it. While a list-detail's detail shows (SecondaryPane detailOpen),
         the parent row is that detail's Back instead ("Back to {list}"; it returns to the list), so the page has one back
         control; when the list shows again, the row opens the pane as before. Choosing a destination, a link or a list item in the pane shows the
         main region again; Escape does too.
     The body scrolls; its bar shows on hover.
     Outside an AppShell it is a plain pane (width: its own, or the shell navigation width) with no Collapse button.
   Notes:
     The shared first row dates from batch 153; the Narrow forms from batch 311.
     Every page's pane has a footer.
     The content is the page's.
*/
import React from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.ts';
import { useLayer } from '../../utils/layer.ts';
import { Button } from '../../components/Button/Button.tsx';
import { ToolRail, BarContext } from '../ToolRail/ToolRail.jsx';
import { useAppLayout, PanelSplitter, tokenPx } from '../AppShell/AppShell.jsx';
import { gridWithin } from '../../utils/grid.ts';
import { DRAG_STEP } from '../../utils/sizeSteps.js';
import { paneMax } from '../../utils/paneLimit.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ArrowLeftIcon from 'plenix-platform/icons/plenix/arrow-left';
import MenuLinesIcon from 'plenix-platform/icons/plenix/menu-lines';
import PanelLeftCloseIcon from 'plenix-platform/icons/plenix/panel-left-close';
import PanelLeftOpenIcon from 'plenix-platform/icons/plenix/panel-left-open';

// the rail's items out of their fragments (the bar draws destinations, never dividers)
const railItems = (rail) => {
  const out = [];
  const walk = (c) => React.Children.forEach(c, (el) => {
    if (!React.isValidElement(el)) return;
    if (el.type === React.Fragment) walk(el.props.children); else if (el.type !== ToolRail.Divider) out.push(el);
  });
  walk(rail);
  return out;
};
// in the pane's screen (Narrow), choosing something to show takes the person to it
const CHOOSES = 'a[href], .plx-nav-list__item:not(.plx-nav-list__item--group), [role="treeitem"]';

export function NavPane({ label, title, actions, as = 'nav', header, footer, rail, collapseAt = 'end', width, strings, className, children }) {
  const layout = useAppLayout();
  const ref = React.useRef(null);
  const t = useStrings('navPane', strings);
  const Tag = as;
  const mode = layout && layout.hasSideNav ? layout.mode : 'static';
  const narrow = mode === 'bar' || mode === 'screen';
  const items = narrow ? railItems(rail) : [];
  // the parent row (Narrow, fewer than two destinations) tells the shell it is drawn, so a list-detail's Back joins it
  const rowed = narrow && items.length < 2 && !!(layout && layout.parentEl);
  const claimRow = layout ? layout.claimParentRow : null;
  React.useLayoutEffect(() => (rowed && claimRow ? claimRow() : undefined), [rowed, claimRow]);
  // the overlay and the screen are layers: Escape closes them
  useLayer(ref, mode === 'overlay' || mode === 'screen', { onEscape: layout ? layout.close : undefined });
  const expand = <ToolRail.Item icon={PanelLeftOpenIcon} label={t.expand} onClick={layout ? layout.toggle : undefined} />;
  const railEl = mode === 'rail' || mode === 'overlay' ? (
    <ToolRail label={label || 'Navigation'} className="plx-nav-pane-rail">{rail ? <>{expand}<ToolRail.Divider />{rail}</> : expand}</ToolRail>
  ) : null;
  if (mode === 'rail') return railEl;

  // Narrow: the bottom navigation bar (two or more destinations) or the parent row, put in the shell's slots
  let narrowEl = null;
  if (narrow) {
    const close = (fn) => (e) => { layout.close(); if (fn) fn(e); };
    if (items.length >= 2) {
      narrowEl = layout.barEl ? createPortal(
        <nav aria-label={label || 'Navigation'} className="plx-nav-bar">
          <BarContext.Provider value>
            {items.slice(0, 4).map((el, i) => React.cloneElement(el, { key: el.key || i, pressed: mode === 'screen' ? false : el.props.pressed, onClick: close(el.props.onClick) }))}
            <ToolRail.Item icon={MenuLinesIcon} label={t.browse} pressed={mode === 'screen'} onClick={layout.toggle} />
          </BarContext.Provider>
        </nav>, layout.barEl) : null;
    } else if (layout.parentEl && mode === 'bar') {
      const back = layout.detailBack;   // a list-detail's detail shows: the row is its Back
      narrowEl = createPortal(
        <div className="plx-nav-pane-parent">
          {back
            ? <Button ref={back.ref} size="sm" variant="ghost" icon={ArrowLeftIcon} onClick={back.onBack}>{back.label}</Button>
            : <Button size="sm" variant="ghost" icon={ArrowLeftIcon} onClick={layout.toggle}>{title || label || t.browse}</Button>}
        </div>, layout.parentEl);
    }
    if (mode === 'bar') return narrowEl;
  }

  // a width only the page or the person knows (the width prop, or the splitter's) reaches the stylesheet as the pane's width, on the grid
  const w = mode === 'static' ? width : narrow ? null : layout.width;
  const paneWidth = w ? gridWithin(parseInt(w, 10), tokenPx('--plx-sys-shell-nav-min-width'), paneMax(tokenPx('--plx-sys-shell-nav-max-width'), tokenPx('--plx-sys-shell-nav-min-width')), { step: DRAG_STEP }) + 'px' : undefined;
  const collapse = mode === 'static' || narrow ? null : (
    <span className={cx('plx-nav-pane__collapse', 'plx-nav-pane__collapse--' + collapseAt)}>
      <Button size="sm" variant="ghost" iconOnly icon={PanelLeftCloseIcon} label={t.collapse} onClick={layout.toggle} />
    </span>
  );
  const onChoose = narrow ? (e) => { if (e.target.closest && e.target.closest(CHOOSES)) layout.close(); } : undefined;
  const pane = (
    <Tag ref={ref} aria-label={Tag === 'nav' ? label : undefined} className={cx('plx-nav-pane', mode !== 'static' && 'plx-nav-pane--' + mode, className)} data-plx-width={paneWidth}>
      {title || actions || collapse ? (
        <div className="plx-nav-pane__header">
          {collapseAt === 'start' ? collapse : null}
          {title ? <span className="plx-nav-pane__title">{title}</span> : null}
          {actions ? <span className={cx('plx-nav-pane__actions', !title && 'plx-nav-pane__actions--fill')}>{actions}</span> : null}
          {collapseAt !== 'start' ? collapse : null}
        </div>) : null}
      {header ? <div className="plx-nav-pane__subheader">{header}</div> : null}
      <div className="plx-nav-pane__body" onClick={onChoose}>{children}</div>
      {footer ? <div className="plx-nav-pane__footer">{footer}</div> : null}
      {mode === 'inline' ? <PanelSplitter label={label ? t.resize.replace('{name}', label) : t.resizeNavigation} value={layout.width || tokenPx('--plx-sys-shell-nav-width')}
        min={tokenPx('--plx-sys-shell-nav-min-width')} max={() => tokenPx('--plx-sys-shell-nav-max-width')} onChange={layout.setWidth}
        onCollapse={layout.toggle} edge="end" /> : null}
    </Tag>
  );
  // Narrow: the pane is a screen over the main region, with the bar still below it
  if (mode === 'screen') return <>{pane}{narrowEl}</>;
  // Medium: the rail stays in place; the expanded rail opens over the main region
  return mode === 'overlay' ? <>{railEl}<div className="plx-app-shell__scrim" aria-hidden="true" onMouseDown={layout.close} />{pane}</> : pane;
}
