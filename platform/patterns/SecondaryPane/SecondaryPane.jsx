/* Plenix · SecondaryPane
   Summary: A narrow pane beside the main content, inside the main region (under the header, beside the navigation pane):
     the asset browser's Files pane, the spec's "On this page", a project's capabilities. It can collapse to a rail and be
     resized by dragging its edge.
   Usage:
     <SecondaryPane title="Files" icon="folder-open" actions={…} side="start" width="md">…</SecondaryPane>
     <SecondaryPane title="Kitchen Renovation" collapsible resizable rail={<><ToolRail.Item … /></>}>…</SecondaryPane>
     <div className="plx-page-panes">
       <SecondaryPane title="Notes" detailOpen={!!note} onBack={() => loc.parent('/')}>{the list}</SecondaryPane>
       <PageContent>{the open note}</PageContent>
     </div>
   Props:
     title: the title in the header row
     label: its landmark name (default: the title)
     icon: an icon name or element at the start of the header row
     actions: controls at the end of the header row
     side: "start" (default; before the content) | "end"
     width: "sm" (180px) | "md" (220px, default) | "lg" (280px), from --plx-comp-secondary-pane-width-*; each steps up one size from a window
       1440px wide (220 | 260 | 320) and again from 1920px (260 | 320 | 400), set in system/grid.css from the -from-1440 and -from-1920 tokens
     collapsible: a Collapse button in the header folds the pane to a rail (an Expand button, then the rail items); default false
     collapsed / onCollapsedChange(next): the folded state, controlled; defaultCollapsed: its first state when not controlled
     rail: the items the folded rail shows under Expand (ToolRail.Item elements)
     onClose(): a Close button ends the header row; given by the applications whose pane can be closed (the Asset Manager's
       Files pane), left out where the pane is always there (batch 259)
     resizable: the pane's content edge can be dragged (or moved with the arrow keys) between its sm width and
       --plx-comp-secondary-pane-width-max; default false
     size / onSizeChange(px): the dragged width, controlled (an application keeps it between visits, useViewState);
       defaultSize: the first dragged width when not controlled
     detailOpen: the pane is the list of a list-detail screen (Platforms Standard 5.2): true while an item's detail shows
       beside it. At Narrow (under 600px, --plx-sys-shell-phone-below) one pane shows at a time: the list fills the
       width while detailOpen is false; while it is true the list steps aside and a Back control leads the detail
     onBack(): the Back control's action at Narrow (the detail's parent, the list: useScreenLocation's parent('/'))
     scrollTop / onScrollChange(top): the body's scroll position, to restore it (on load and when the list comes back
       at Narrow) and to keep it
     className: more classes
     children: the body
     strings: the words it announces, for other languages: { expand: "Expand {name}", collapse: "Collapse {name}", resize:
       "Resize {name}", close: "Close {name}", back: "Back to {name}" } ({name} is the label, or the title)
   Behavior:
     The body scrolls on its own while the content scrolls beside it.
     The resize edge is a separator (role="separator", aria-valuenow); Arrow Left / Right move the edge, mirrored in a
     right-to-left page (as is dragging); Home and End jump to the smallest and largest width;
     Enter or a double click folds the pane when it is collapsible.
     List-detail at Narrow (with detailOpen): the list fills the main region and the panes beside it are hidden; choosing
       an item opens its detail (the application gives it an address and a history entry, so the browser's Back returns
       to the list), the list steps aside (it stays mounted: its state and scroll position are kept) and a bar with
       "Back to {name}" leads the detail; focus moves to it. Where the shell draws a parent row (NavPane at Narrow
       without a bottom navigation bar), that row becomes the Back and the pane draws no bar of its own: one back
       control. Back brings the list back with focus on the item that was chosen. The application shows no selection in the list at Narrow (useAppLayout().narrow). The pane does not fold
       or resize at Narrow.
   Notes:
     It has the page surface, a divider on its content side, a header row (icon, title, actions) and a body.
     A dragged width reaches the stylesheet as --plx-comp-secondary-pane-width (no style is written).
     Other props go on its aside element.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { asIcon as iconElement } from '../../components/Icon/Icon.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { ToolRail } from '../ToolRail/ToolRail.jsx';
import { PanelSplitter, tokenPx, below, useMedia, useAppLayout } from '../AppShell/AppShell.jsx';
import { focusables } from '../../utils/layer.ts';
import { gridWithin } from '../../utils/grid.ts';
import { DRAG_STEP } from '../../utils/sizeSteps.js';
import { paneMax } from '../../utils/paneLimit.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ArrowLeftIcon from 'plenix-platform/icons/plenix/arrow-left';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import PanelLeftCloseIcon from 'plenix-platform/icons/plenix/panel-left-close';
import PanelLeftOpenIcon from 'plenix-platform/icons/plenix/panel-left-open';
import PanelRightCloseIcon from 'plenix-platform/icons/plenix/panel-right-close';
import PanelRightOpenIcon from 'plenix-platform/icons/plenix/panel-right-open';

export function SecondaryPane({ title, label, icon, actions, side = 'start', width = 'md', collapsible = false, collapsed, defaultCollapsed = false,
  onCollapsedChange, rail, resizable = false, size: sizeProp, defaultSize = null, onSizeChange, detailOpen, onBack, scrollTop, onScrollChange,
  onClose, strings, className, children, ...rest }) {
  const t = useStrings('secondaryPane', strings);
  const [ownCollapsed, setOwnCollapsed] = React.useState(defaultCollapsed);
  const narrow = useMedia(below('--plx-sys-shell-phone-below'));
  const listDetail = detailOpen !== undefined;
  const stepAside = narrow && listDetail && !!detailOpen;   // at Narrow the detail shows alone, led by the Back bar
  const folded = collapsible && !(narrow && listDetail) && (collapsed !== undefined ? collapsed : ownCollapsed);
  const setFolded = (next) => { if (collapsed === undefined) setOwnCollapsed(next); if (onCollapsedChange) onCollapsedChange(next); };
  const [ownSize, setOwnSize] = React.useState(defaultSize);
  const size = sizeProp !== undefined ? sizeProp : ownSize;
  const setSize = (w) => { if (sizeProp === undefined) setOwnSize(w); if (onSizeChange) onSizeChange(w); };
  const name = label || title;
  const named = (s) => s.split('{name}').join(name);
  // the body's scroll position: restored when the body appears (on load, and when the list comes back at Narrow)
  const body = React.useRef(null);
  const top = React.useRef(scrollTop || 0);
  const frame = React.useRef(0);
  const onScroll = (e) => {
    top.current = e.currentTarget.scrollTop;
    if (onScrollChange && !frame.current) frame.current = requestAnimationFrame(() => { frame.current = 0; onScrollChange(top.current); });
  };
  React.useLayoutEffect(() => { if (body.current && !stepAside && top.current) body.current.scrollTop = top.current; }, [stepAside, folded]);
  // the Back control: the shell's parent row when there is one (one back control at Narrow), else the pane's own bar
  const layout = useAppLayout();
  const back = React.useRef(null);
  const backAction = React.useRef(onBack);
  backAction.current = onBack;
  const backLabel = named(t.back);
  const claimBack = layout ? layout.claimBack : null;
  React.useLayoutEffect(() => (stepAside && claimBack
    ? claimBack({ label: backLabel, onBack: (e) => { if (backAction.current) backAction.current(e); }, ref: back }) : undefined), [stepAside, backLabel, claimBack]);
  const ownBar = stepAside && !(layout && layout.parentRow);
  // focus: to the Back control when the detail opens at Narrow; back to the chosen item when the list returns
  const chosen = React.useRef(-1);
  const was = React.useRef(stepAside);
  React.useEffect(() => {
    if (was.current === stepAside) return;
    was.current = stepAside;
    if (stepAside) {   // the shell's row takes the control a moment later (its own render): focus it once it is there
      const go = () => { if (back.current) back.current.focus(); };
      if (back.current) go(); else requestAnimationFrame(go);
      return;
    }
    const items = body.current ? focusables(body.current) : [];
    const item = items[chosen.current] || items[0];
    // the Back control took focus with it, or focus stayed on the shell's row (which is now the way to the pane)
    const ae = document.activeElement;
    const lost = !ae || ae === document.body || !!(layout && layout.parentEl && layout.parentEl.contains(ae));
    if (item && lost) item.focus();
  }, [stepAside]);
  const onBodyClick = (e) => {
    const items = body.current ? focusables(body.current) : [];
    chosen.current = items.findIndex((x) => x === e.target || x.contains(e.target));
  };
  if (folded) {
    return (
      <ToolRail label={name} className={cx('plx-secondary-pane-rail', 'plx-secondary-pane-rail--' + side, className)}>
        <ToolRail.Item icon={side === 'start' ? PanelLeftOpenIcon : PanelRightOpenIcon} label={named(t.expand)} onClick={() => setFolded(false)} />
        {rail ? <><ToolRail.Divider />{rail}</> : null}
      </ToolRail>
    );
  }
  const min = () => tokenPx('--plx-comp-secondary-pane-width-min');   // its own token: the small width rises on larger windows, the narrowest drag does not
  const max = () => tokenPx('--plx-comp-secondary-pane-width-max');
  const sized = size && !(narrow && listDetail);
  const pane = (
    <aside aria-label={name} className={cx('plx-secondary-pane', 'plx-secondary-pane--' + side, 'plx-secondary-pane--' + width, sized && 'plx-secondary-pane--resized',
      narrow && listDetail && (stepAside ? 'plx-secondary-pane--aside' : 'plx-secondary-pane--list'), className)}
      data-plx-width={sized ? gridWithin(size, min(), paneMax(max(), min()), { step: DRAG_STEP }) + 'px' : undefined} {...rest}>
      <div className="plx-secondary-pane__header">
        {icon ? iconElement(icon) : null}
        <span className="plx-secondary-pane__title">{title}</span>
        {actions}
        {collapsible ? <Button size="xs" variant="ghost" iconOnly icon={side === 'start' ? PanelLeftCloseIcon : PanelRightCloseIcon} label={named(t.collapse)} onClick={() => setFolded(true)} /> : null}
        {onClose ? <Button size="xs" variant="ghost" iconOnly icon={CloseIcon} label={named(t.close)} onClick={onClose} /> : null}
      </div>
      <div ref={body} className="plx-secondary-pane__body" onScroll={onScroll} onClick={listDetail ? onBodyClick : undefined}>{children}</div>
      {resizable && !(narrow && listDetail) ? (
        <PanelSplitter label={named(t.resize)} edge={side === 'start' ? 'end' : 'start'} min={min()} max={max}
          value={size || (tokenPx('--plx-comp-secondary-pane-width-' + width) || min())} onChange={setSize}
          onCollapse={collapsible ? () => setFolded(true) : undefined} />
      ) : null}
    </aside>
  );
  // at Narrow with the detail open: the list stays mounted (hidden) and the Back bar leads the detail (unless the shell's
  // parent row is the Back)
  return ownBar ? (
    <>
      {pane}
      <div className="plx-secondary-pane-back">
        <Button ref={back} size="sm" variant="ghost" icon={ArrowLeftIcon} onClick={onBack}>{backLabel}</Button>
      </div>
    </>
  ) : pane;
}
