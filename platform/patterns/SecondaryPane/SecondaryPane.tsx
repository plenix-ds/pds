/* Plenix · SecondaryPane
   Summary: A narrow pane beside the main content, inside the main region (under the header, beside the navigation pane):
     the asset browser's Files pane, the spec's "On this page", a project's capabilities. It can collapse to a rail and be
     resized by dragging its edge.
   Usage:
     <SecondaryPane title="Files" icon="folder-open" actions={…} side="start" width="md">…</SecondaryPane>
     <SecondaryPane title="Kitchen Renovation" collapsible resizable rail={<><ToolRail.Item … /></>}>…</SecondaryPane>
     <PagePanes>
       <SecondaryPane title="Notes" detailOpen={!!note} onBack={() => loc.parent('/')}>{the list}</SecondaryPane>
       <PageContent>{the open note}</PageContent>
     </PagePanes>
   PagePanes: the wrapper of a pane and the content beside it (renders <div class="plx-page-panes">, div attributes pass through).
     Writing the plx-page-panes class by hand is deprecated; it becomes internal in 2.0.0 (ADR 0040).
   Props:
     title: the title in the header row
     label: its landmark name (default: the title)
     icon: an icon name or element at the start of the header row
     actions: controls at the end of the header row
     side: "start" (default; before the content) | "end"
     width: "sm" (180px) | "md" (240px, default: the standard width of a navigation pane) | "lg" (280px), from --plx-comp-secondary-pane-width-*, the same
       at every window size (ADR 0057)
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
     back: { parent, href | onClick }: a quiet row above the title, "Back to {parent}" (strings.back), a link with href else a button; the arrow
       mirrors in right to left; folded, it is the rail's first control. The title (15px, 700) is the strongest text in the pane, then the items, then the back row
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
     Enter or a double click returns the pane to its standard width (240px for md) and clears a kept size (onSizeChange(0));
       folding is the Collapse button (issue 1243).
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
import type { IconValue } from '../../components/Icon/Icon.tsx';
import { cx } from '../../utils/cx.ts';
import { asIcon as iconElement } from '../../components/Icon/Icon.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Tooltip } from '../../components/Tooltip/Tooltip.tsx';
import { ToolRail } from '../ToolRail/ToolRail.tsx';
import { PanelSplitter, tokenPx, below, useMedia, useAppLayout } from '../AppShell/AppShell.tsx';
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

/** @public the prop type (ADR 0011) */
export type SecondaryPaneProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
  title?: React.ReactNode;
  label?: string;
  icon?: string | IconValue;
  actions?: React.ReactNode;
  side?: 'start' | 'end';
  width?: 'sm' | 'md' | 'lg';
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?(next: boolean): void;
  /** the items the folded rail shows (ToolRail.Item elements) */
  rail?: React.ReactNode;
  resizable?: boolean;
  /** the dragged width in pixels */
  size?: number;
  defaultSize?: number | null;
  onSizeChange?(px: number): void;
  /** the pane is the list of a list-detail screen, an item's detail showing beside it */
  detailOpen?: boolean;
  onBack?(): void;
  /** a back-to-parent row above the title: a link with href, else a button (ADR 0038) */
  back?: { parent: string; href?: string; onClick?(event: React.MouseEvent<HTMLElement>): void };
  scrollTop?: number;
  onScrollChange?(top: number): void;
  onClose?(): void;
  strings?: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
};
export function SecondaryPane(props: SecondaryPaneProps) {
  const { title, label, icon, actions, side = 'start', width = 'md', collapsible = false, collapsed, defaultCollapsed = false,
  onCollapsedChange, rail, resizable = false, size: sizeProp, defaultSize = null, onSizeChange, detailOpen, onBack, back: backItem, scrollTop, onScrollChange,
  onClose, strings, className, children, ...rest } = props as any;
  const t: any = useStrings('secondaryPane', strings);
  const [ownCollapsed, setOwnCollapsed] = React.useState(defaultCollapsed);
  const narrow = useMedia(below('--plx-sys-shell-phone-below'));
  const listDetail = detailOpen !== undefined;
  const stepAside = narrow && listDetail && !!detailOpen;   // at Narrow the detail shows alone, led by the Back bar
  const folded = collapsible && !(narrow && listDetail) && (collapsed !== undefined ? collapsed : ownCollapsed);
  // folding or unfolding unmounts the pressed button: focus goes to the button that takes its place (the Expand button in the rail, the Collapse button in the header)
  const refocus = React.useRef<any>(null);
  const collapseBtn = React.useRef<any>(null);
  const setFolded = (next: any) => { refocus.current = next ? 'expand' : 'collapse'; if (collapsed === undefined) setOwnCollapsed(next); if (onCollapsedChange) onCollapsedChange(next); };
  const [ownSize, setOwnSize] = React.useState(defaultSize);
  const size = sizeProp !== undefined ? sizeProp : ownSize;
  const setSize = (w: any) => { if (sizeProp === undefined) setOwnSize(w); if (onSizeChange) onSizeChange(w); };
  const name = label || title;
  const named = (s: any) => s.split('{name}').join(name);
  // the body's scroll position: restored when the body appears (on load, and when the list comes back at Narrow)
  const body = React.useRef<any>(null);
  const top = React.useRef(scrollTop || 0);
  const frame = React.useRef(0);
  const onScroll = (e: any) => {
    top.current = e.currentTarget.scrollTop;
    if (onScrollChange && !frame.current) frame.current = requestAnimationFrame(() => { frame.current = 0; onScrollChange(top.current); });
  };
  React.useLayoutEffect(() => { if (body.current && !stepAside && top.current) body.current.scrollTop = top.current; }, [stepAside, folded]);
  // the Back control: the shell's parent row when there is one (one back control at Narrow), else the pane's own bar
  const layout = useAppLayout();
  const back = React.useRef<any>(null);
  const backAction = React.useRef<any>(onBack);
  backAction.current = onBack;
  const backLabel = named(t.back);
  // the Tooltip shows only when the text is cut short (the NavList ladder, fit-and-overflow.md)
  const backTextEl = React.useRef<HTMLElement | null>(null);
  const [backCut, setBackCut] = React.useState(false);
  React.useEffect(() => {
    const el: any = backTextEl.current; if (!el) return undefined;
    const measure = () => setBackCut(el.scrollWidth > el.clientWidth + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect();
  });
  const backText = backItem ? t.back.split('{name}').join(backItem.parent) : '';
  const claimBack = layout ? layout.claimBack : null;
  React.useLayoutEffect(() => (stepAside && claimBack
    ? claimBack({ label: backLabel, onBack: () => { if (backAction.current) backAction.current(); }, ref: back }) : undefined), [stepAside, backLabel, claimBack]);
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
  React.useEffect(() => {
    const want = refocus.current; refocus.current = null;
    if (want === 'collapse' && !folded && collapseBtn.current) collapseBtn.current.focus();
    else if (want === 'expand' && folded) {
      const label = named(t.expand), all: any[] = Array.from(document.querySelectorAll('.plx-secondary-pane-expand'));
      const b = all.find((x) => x.getAttribute('aria-label') === label);
      if (b) b.focus();
    }
  }, [folded]);
  const onBodyClick = (e: any) => {
    const items = body.current ? focusables(body.current) : [];
    chosen.current = items.findIndex((x) => x === e.target || x.contains(e.target));
  };
  if (folded) {
    return (
      <ToolRail label={name} className={cx('plx-secondary-pane-rail', 'plx-secondary-pane-rail--' + side, className)}>
        {backItem ? <ToolRail.Item icon={ArrowLeftIcon} label={backText} onClick={(e: any) => { if (backItem.onClick) backItem.onClick(e); else if (backItem.href) window.location.assign(backItem.href); }} /> : null}
        <ToolRail.Item className="plx-secondary-pane-expand" icon={side === 'start' ? PanelLeftOpenIcon : PanelRightOpenIcon} label={named(t.expand)} onClick={() => setFolded(false)} />
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
      {backItem ? (
        <Tooltip content={backText} disabled={!backCut} describe={false}>
          {backItem.href
            ? <a className="plx-secondary-pane__back" href={backItem.href} onClick={backItem.onClick}>{iconElement(ArrowLeftIcon, { className: 'plx-secondary-pane__back-icon' })}<span ref={backTextEl} className="plx-secondary-pane__back-text">{backText}</span></a>
            : <button type="button" className="plx-secondary-pane__back" onClick={backItem.onClick}>{iconElement(ArrowLeftIcon, { className: 'plx-secondary-pane__back-icon' })}<span ref={backTextEl} className="plx-secondary-pane__back-text">{backText}</span></button>}
        </Tooltip>) : null}
      <div className={cx('plx-secondary-pane__header', backItem && 'plx-secondary-pane__header--after-back')}>
        {icon ? iconElement(icon) : null}
        <span className="plx-secondary-pane__title">{title}</span>
        {actions}
        {collapsible ? <Button ref={collapseBtn} size="xs" variant="ghost" iconOnly icon={side === 'start' ? PanelLeftCloseIcon : PanelRightCloseIcon} label={named(t.collapse)} onClick={() => setFolded(true)} /> : null}
        {onClose ? <Button size="xs" variant="ghost" iconOnly tooltip={false} icon={CloseIcon} label={named(t.close)} onClick={onClose} /> : null}
      </div>
      <div ref={body} className="plx-secondary-pane__body" onScroll={onScroll} onClick={listDetail ? onBodyClick : undefined}>{children}</div>
      {resizable && !(narrow && listDetail) ? (
        <PanelSplitter label={named(t.resize)} edge={side === 'start' ? 'end' : 'start'} min={min()} max={max}
          value={size || (tokenPx('--plx-comp-secondary-pane-width-' + width) || min())} onChange={setSize}
          onReset={() => setSize(0)} />
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

export type PagePanesProps = React.HTMLAttributes<HTMLDivElement>;
export function PagePanes({ className, children, ...rest }: PagePanesProps) {
  return <div className={cx('plx-page-panes', className)} {...rest}>{children}</div>;
}
