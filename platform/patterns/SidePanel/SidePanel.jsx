/* Plenix · SidePanel
   Summary: The inspector panel on the right of the main region (details, a preview). Give it to the AppShell's panel.
   Usage:
     <SidePanel title="Details" icon="circle-info" open={open} onOpenChange={(next) => …} actions={<…/>} footer={<…/>}>…</SidePanel>
   Props:
     title: the panel's heading
     label: its landmark name (default: the title, or "Panel")
     icon: an icon name or element before the title
     open: true (default) shows the panel; false shows only its rail
     onOpenChange(open): runs from Collapse and Expand; without it there is no Collapse button and no rail
     actions: controls at the end of the header row
     footer: a row pinned to the panel's bottom (its actions: Save, Cancel), --plx-comp-pane-footer-height, its divider drawn inside
     collapseLabel: the Collapse button's label (default "Collapse panel")
     width: it opens at --plx-comp-side-panel-width-default: 240px, 320px from a window 1440px wide, 400px from 1920px (the -from-1440 and
       -from-1920 tokens, set in system/grid.css); a width a person dragged to wins
     the width a person dragged to is remembered per monitor (utils/monitorWidths.ts): one value per monitor, named by its physical screen size,
       used only when it still fits the window; the single value saved before carries over as the current monitor's
     resizable: its start edge can be dragged (or moved with the arrow keys) between --plx-comp-side-panel-width-min and
       -max; the width is remembered; Home and End jump to the smallest and largest (batch 259); default false
     resizeLabel: the edge's accessible name (default "Resize panel")
     className: more classes
     children: the body
   Behavior:
     The footer's actions sit at its end, the primary action last (the Action bar rule; owner, batch 272).
     Tabs inside a side panel use the Folder variant (the tab strip alone): the panel is already the frame (owner, batch 272).
     Width: --plx-sys-panel-inspector-width (by density: 320 / 360 / 400px), docked.
     Its own Collapse button starts its header row; collapsed, it is a rail with Expand.
     Below 1024px Expand opens it over the main region, between the header and the footer; Escape or a click outside closes it.
     At Narrow (under 600px, --plx-sys-shell-phone-below) Expand opens it as a bottom sheet (Sheet, form="bottom"): its title,
       icon and actions in the sheet's header with Close, its body, its footer pinned below (Platforms Standard 5.2
       Supporting pane, 6.5 Sheet and inspector); Escape, Close or a click on the scrim closes it.
     When the window becomes that small, an open docked panel collapses to its rail.
   Notes:
     Not every capability has one; it shows only where it is given.
     Without onOpenChange it cannot close, so at Narrow it stays the overlay rather than a sheet nobody can dismiss.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useLayer } from '../../utils/layer.ts';
import { Button } from '../../components/Button/Button.tsx';
import { asIcon as iconElement } from '../../components/Icon/Icon.tsx';
import { Sheet } from '../../components/Sheet/Sheet.jsx';
import { ToolRail } from '../ToolRail/ToolRail.jsx';
import { useMedia, below, PanelSplitter, tokenPx } from '../AppShell/AppShell.jsx';
import { gridWithin } from '../../utils/grid.ts';
import { DRAG_STEP } from '../../utils/sizeSteps.js';
import { paneMax } from '../../utils/paneLimit.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { useMonitorWidth } from '../../utils/monitorWidths.ts';
import PanelRightCloseIcon from 'plenix-platform/icons/plenix/panel-right-close';
import PanelRightOpenIcon from 'plenix-platform/icons/plenix/panel-right-open';

const WIDTH_KEY = 'plenix.sidePanelWidth';

export function SidePanel({ title, label, icon, open = true, onOpenChange, actions, footer, collapseLabel, resizable = false, resizeLabel, className, children }) {
  const tw = useStrings('sidePanel');
  const small = useMedia(below('--plx-sys-shell-inspector-overlay-below'));
  const narrow = useMedia(below('--plx-sys-shell-phone-below'));
  const ref = React.useRef(null);
  const set = (next) => { if (onOpenChange) onOpenChange(next); };
  // at Narrow the panel is a bottom sheet (when it can be closed): the Sheet is the layer then
  const sheet = narrow && !!onOpenChange;
  useLayer(ref, open && small && !sheet, { onEscape: () => set(false) });
  // entering a small window: the docked panel would cover the main region, so it collapses to its rail
  // (only on the change: a panel opened in a small window, a file chosen on a phone, stays open)
  const wasSmall = React.useRef(small);
  React.useEffect(() => { if (small && !wasSmall.current && open) set(false); wasSmall.current = small; }, [small]);
  const name = label || title || 'Panel';
  // the width dragged on its edge, remembered across visits (resizable, docked only)
  // remembered per monitor (utils/monitorWidths.ts); the single value saved before is this monitor's first value
  const [size, resize] = useMonitorWidth('side', { legacy: () => { try { return localStorage.getItem(WIDTH_KEY); } catch (e) { return null; } }, min: () => tokenPx('--plx-comp-side-panel-width-min'), max: () => tokenPx('--plx-comp-side-panel-width-max') });
  const docked = resizable && !small;
  const railEl = onOpenChange ? (
    <ToolRail label={tw.pane.replace('{name}', name)} className="plx-side-panel-rail"><ToolRail.Item icon={PanelRightOpenIcon} label={tw.expand} onClick={() => set(true)} /></ToolRail>
  ) : null;
  if (!open) return railEl;
  if (sheet) {
    return (
      <>
        {railEl}
        <Sheet open form="bottom" title={title} icon={icon} actions={actions} footer={footer} closeLabel={collapseLabel || 'Close panel'}
          onClose={() => set(false)} className={className}>{children}</Sheet>
      </>
    );
  }
  const pane = (
    <aside ref={ref} aria-label={name} className={cx('plx-side-panel', small && 'plx-side-panel--overlay', docked && 'plx-side-panel--resizable', docked && size && 'plx-side-panel--resized', className)}
      data-plx-width={docked && size ? gridWithin(size, tokenPx('--plx-comp-side-panel-width-min'), paneMax(tokenPx('--plx-comp-side-panel-width-max'), tokenPx('--plx-comp-side-panel-width-min')), { step: DRAG_STEP }) + 'px' : undefined}>
      <div className="plx-side-panel__header">
        {onOpenChange ? <Button size="sm" variant="ghost" iconOnly icon={PanelRightCloseIcon} label={collapseLabel || 'Collapse panel'} onClick={() => set(false)} /> : null}
        {icon ? <span className="plx-side-panel__icon" aria-hidden="true">{iconElement(icon)}</span> : null}
        <h2 className="plx-side-panel__title">{title}</h2>
        {actions}
      </div>
      <div className="plx-side-panel__body">{children}</div>
      {footer ? <div className="plx-side-panel__footer">{footer}</div> : null}
      {docked ? (
        <PanelSplitter label={resizeLabel || 'Resize panel'} edge="start" min={tokenPx('--plx-comp-side-panel-width-min')} max={() => tokenPx('--plx-comp-side-panel-width-max')}
          value={size || tokenPx('--plx-sys-panel-inspector-width')} onChange={resize} onCollapse={onOpenChange ? () => set(false) : undefined} />
      ) : null}
    </aside>
  );
  return small ? <>{railEl}<div className="plx-app-shell__scrim" aria-hidden="true" onMouseDown={() => set(false)} />{pane}</> : pane;
}
