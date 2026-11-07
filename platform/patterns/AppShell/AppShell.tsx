/* Plenix · AppShell, PageContent, SideNavPortal, Show, Hide
   Summary: The root of an application page, after the Layout grid's shell: the header across the top, a body row with the
     navigation (left), the main region and the inspector panel (right), then the footer across the bottom.
   Usage:
     <AppShell header={<AppHeader…/>} sideNav={<NavPane…/>} panel={<SidePanel…/>} footer={<StatusBar…/>}>
       <PageContent>…</PageContent>
     </AppShell>
     <SideNavPortal><NavPane…/></SideNavPortal>
     <Show above="wide"><Text variant="data">2.4 MB</Text></Show>      <Hide below="medium"><Toolbar…/></Hide>
     <Show print><Text>Printed 12 October 2026</Text></Show>          <Hide print><ActionBar…/></Hide>
   Props:
     header: the header across the top (AppHeader)
     sideNav: an element: the navigation on the left (NavPane); without it a screen can fill the area through SideNavPortal
     panel: an element: the inspector panel on the right (SidePanel)
     footer: the footer across the bottom (StatusBar)
     page: what kind of page this is (default "workspace"): "workspace" | "dashboard" | "settings" | "form" | "detail" |
       "master-detail" | "editor". The design system's layout standard (providers/pageLayouts.js) decides its layout mode:
       fluid (full width), contained (one centered column at the 960px form width), hybrid (full width, text at 760px and
       forms at 960px), multi-pane (panes that each scroll on their own) or focus (navigation and inspector hidden).
       An application never sets the mode itself; a pattern that is a kind of page claims it (SettingsLayout: "settings").
     mainId: the main region's id, the skip link's target (default "main")
     mainClassName: more classes on the main region
     frame: "full" (default: the app fills the window) | "centered" (D-0093, ADR 0023): the shell is --plx-sys-shell-frame-width (1366px) wide, centered
       at the window's full height on a grey backdrop (--plx-sys-shell-frame-outside) with the frame's shadow (--plx-sys-shell-frame-shadow). In
       a window wider than the frame, the AppHeader shows a toggle at its end: "Expand to full window" and back ("Restore to 1366 width"),
       remembered in local storage (plenix.shell.frame.full). In a window 1366px wide or narrower the shell fills it, with no sides and no
       toggle. Print is unchanged. A new project chooses the default at intake; CTM uses "centered"
     minSize: true turns on the screen-size check (default false; ADR 0010, D-0044). Narrower than --plx-sys-shell-min-width
       (1024px) or lower than --plx-sys-shell-min-height (640px), the shell shows a "Screen size not supported" notice (an h1 in
       the main landmark) and keeps the app mounted, hidden and inert, so its state survives a resize; "Continue anyway" shows the
       app at the current size for the browser session. It follows the window live. The sizes are the tokens, never numbers in an app
     className: more classes on the shell
     children: the main region's content
     strings: the words it shows, for other languages: { skip: "Skip to main content" } (the skip link),
       minSize: { title, text, continue } (text has {width} and {height})
     PageContent.as: "section" (default) | "div"
     PageContent.className: more classes on the column
     PageContent.children: the page's parts
     SideNavPortal.children: the navigation (a NavPane) that a screen hands to the shell's navigation area
     Show / Hide (responsive visibility, the Hide / show page): show or hide their children by the window class, or on paper:
       above: a breakpoint: Show is there from it up (Hide removes it there): "medium" (600px, --plx-sys-shell-phone-below),
         "wide" (840px, --plx-sys-shell-rail-below), "inspector" (1024px, --plx-sys-shell-inspector-overlay-below), or any
         breakpoint token's name
       below: a breakpoint: Show is there only under it (Hide removes it there); with above too, both must hold
       print: Show only on paper; Hide never on paper (the window class does not apply)
       fallback: what is drawn where the children are not (the place a hidden action moved to, e.g. a menu item; default none)
       children: what is shown or hidden
     useAppLayout(): the layout state for the panes, or null outside an AppShell:
       { mode, open, expanded, width, setWidth, toggle, close, small, narrow, barEl, parentEl, hasSideNav, page, layout,
         claimPage(kind), parentRow, claimParentRow(), detailBack, claimBack({ label, onBack, ref }) }; mode is "inline",
         "rail", "overlay" (Medium), "bar" or "screen" (Narrow) or "none". parentRow is true while NavPane draws the parent
         row at Narrow; detailBack is a list-detail's Back (SecondaryPane, while its detail shows at Narrow), which the
         parent row then becomes; each claim returns its release
   Behavior:
     The areas are the shell's immediate children.
     The header and the footer always span the full width, above and below both side areas.
     The side areas live between the header and the footer, also when they open as overlays.
     Navigation: --plx-sys-shell-nav-width (240px), resizable 140–320px with the splitter on its edge; the width is remembered.
     While dragged the edge moves one grid line (4px) at a time and stays on the grid when let go (owner, 2026-10-26); the
       arrow keys move it by --plx-sys-shell-splitter-step, Home and End go to the limits.
     The splitters follow the writing direction: in a right-to-left page the edges are mirrored, so dragging and Arrow Left /
       Right move the edge the mirrored way (the key toward the outside widens the area).
     The navigation's own Collapse button (in the pane's header), Ctrl+[, or Enter or a double-click on its edge collapses it
       to a rail whose Expand button opens it again; this is remembered.
     The window classes (Platforms Standard 3.3) decide the navigation's form (4.1): Wide (840px and up, from
       --plx-sys-shell-rail-below) the pane beside the main region; Medium (600-839px) a rail whose Expand opens the
       expanded rail over the main region (Escape or a click outside closes it); Narrow (under 600px,
       --plx-sys-shell-phone-below) never a drawer: the page's top-level destinations in a bottom navigation bar, always
       visible and labeled, and the pane a screen of its own, opened from the bar's Browse destination or the parent row
       at the top (NavPane).
     The shell keeps the safe areas (viewport-fit=cover): the header below the top inset, the bottom bar or footer above
       the bottom inset, both sides inside theirs.
     Inspector panel: see SidePanel (--plx-sys-panel-inspector-width by density; it collapses to a rail).
     The main region fills the rest and scrolls itself; the content grid lives in it.
     The layout mode is data-plx-layout on the shell and on the main region; app-shell.css draws each mode (batch 217).
     The mode comes from the page's kind through the layout standard (providers/pageLayouts.js; batch 218).
     A skip link is the first stop.
     PageContent fills the rest of the main region (beside a SecondaryPane, if any) and scrolls itself.
     PageContent keeps the layout padding (--plx-sys-space-layout-*) and stacks its parts --plx-sys-space-stack-md apart.
     PageContent is positioned, so a DropZone overlay covers it.
   Notes:
     PageContent is the content column of a page inside the main region; other props go on its element.
     SideNavPortal is for a screen that owns its navigation's state (a settings screen, a project list): it hands the
       navigation to the shell's navigation area from inside the main content, where it then behaves as above.
     Outside an AppShell, SideNavPortal renders its children in place.
     PanelSplitter, the resize edge of the panes, is the Resizable component's (components/Resizable); AppShell imports
       and re-exports it, so the panes import it from here as before.
     Show and Hide work anywhere (inside an AppShell or not). Off screen means not rendered at all: what is hidden by width
       leaves the page, the Tab order and the accessibility tree; on paper they toggle display (the content stays in the
       page for screen readers). Every hidden action needs a place where it still is (fallback, a menu, the detail view).
*/
import React from 'react';
import { setFramed } from '../../utils/frame.ts';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.ts';
import { pageLayout } from '../../providers/pageLayouts.js';
import { PanelSplitter } from '../../components/Resizable/Resizable.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import { useMonitorWidth } from '../../utils/monitorWidths.ts';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { fill } from '../../utils/fill.ts';
import ComputerIcon from 'plenix-platform/icons/plenix/computer';

// the five layout modes (the Layout foundation; app-shell.css draws them)
const LAYOUTS = ['fluid', 'contained', 'hybrid', 'multi-pane', 'focus'];

// a list-detail's Back, handed to the parent row at Narrow
export type AppLayoutBack = { label: React.ReactNode; onBack(): void; ref?: React.RefObject<HTMLElement | null> };
// what useAppLayout gives the panes (the same shape as useAppLayout.types.d.ts, which build-types.js publishes until #708 slice 20)
export type AppLayoutState = {
  mode: 'inline' | 'rail' | 'overlay' | 'bar' | 'screen' | 'none'; open: boolean; expanded: boolean; width: number | null;
  setWidth(width: number): void; toggle(): void; close(): void; small: boolean; narrow: boolean;
  barEl: HTMLElement | null; parentEl: HTMLElement | null; slotEl: HTMLElement | null; hasSideNav: boolean;
  registerPortal(): () => void; page: string; layout: string;
  claimPage(kind: string): () => void; parentRow: boolean; claimParentRow(): () => void;
  detailBack: AppLayoutBack | null; claimBack(back: AppLayoutBack): () => void;
  /** the frame's toggle (frame="centered" in a window wider than the frame): null when there is nothing to toggle */
  frame: { full: boolean; toggle(): void } | null;
};
const LayoutContext = React.createContext<AppLayoutState | null>(null);
export const useAppLayout = () => React.useContext(LayoutContext);
/* the shell's sizes and breakpoints come from the tokens, never from numbers here:
   --plx-sys-shell-nav-width, -min-width, -max-width, --plx-sys-shell-splitter-step, --plx-sys-shell-rail-below,
   --plx-sys-shell-inspector-overlay-below */
export const tokenValue = (name: string): string => (typeof document === 'undefined' ? '' : getComputedStyle(document.documentElement).getPropertyValue(name).trim());
export const tokenPx = (name: string): number => parseFloat(tokenValue(name)) || 0;
// a media query for "narrower than the breakpoint token" (range syntax: the token's value is used as written)
export const below = (name: string): string => '(width < ' + (tokenValue(name) || '0px') + ')';

export function useMedia(query: string): boolean {
  const get = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false);
  const [on, setOn] = React.useState(get);
  React.useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(query), f = () => setOn(mq.matches);
    f(); mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, [query]);
  return on;
}
const readPref = <T,>(key: string, fallback: T): T => { try { const v = JSON.parse(localStorage.getItem(key) as string); return v === null || v === undefined ? fallback : v; } catch (e) { return fallback; } };
const writePref = (key: string, value: unknown) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* not stored: it lasts for this visit */ } };

export type AppShellProps = {
  header?: React.ReactNode;
  /** the navigation pane (NavPane); a screen can fill it through SideNavPortal instead */
  sideNav?: React.ReactNode;
  /** the end pane (an inspector) */
  panel?: React.ReactNode;
  footer?: React.ReactNode;
  /** the page's kind: the design system's layout standard picks its layout mode */
  page?: string;
  /** the main region's id (the skip link's target) */
  mainId?: string;
  mainClassName?: string;
  /** turn on the screen-size check: below the shell's minimum screen a notice replaces the view (sizes from tokens) */
  minSize?: boolean;
  /** "full" (default): the app fills the window. "centered": the shell is 1366px wide, centered on a grey page with a shadow, and the header's toggle expands it to the window and back (D-0093) */
  frame?: 'full' | 'centered';
  /** the person's toggle between the two (the frame the app shows now) */
  onFrameChange?(frame: 'full' | 'centered'): void;
  strings?: Catalog | null;
  className?: string;
  children?: React.ReactNode;
};
const MIN_SIZE_KEY = 'plx-shell-min-size-dismissed';
export function AppShell({ header, sideNav, panel, footer, page = 'workspace', mainId = 'main', mainClassName, minSize = false, frame = 'full', onFrameChange, strings, className, children }: AppShellProps) {
  // the page's kind, claimed by a pattern on the page when it is that kind of page (SettingsLayout), else the page prop
  const [claimed, setClaimed] = React.useState<string | null>(null);
  const claimPage = React.useCallback((kind: string) => { setClaimed(kind); return () => setClaimed((k) => (k === kind ? null : k)); }, []);
  const layout = pageLayout(claimed || page);   // the design system's layout standard decides the mode
  const t = useStrings('appShell', strings) as { skip: string; minSize: { title: string; text: string; continue: string }; frame: { expand: string; restore: string } };
  // the screen-size check (ADR 0010): live, from the two tokens; the person may go on for the session
  const tooSmall = useMedia(minSize ? '(width < ' + (tokenValue('--plx-sys-shell-min-width') || '0px') + '), (height < ' + (tokenValue('--plx-sys-shell-min-height') || '0px') + ')' : 'not all');
  const [goOn, setGoOn] = React.useState(() => { try { return sessionStorage.getItem(MIN_SIZE_KEY) === '1'; } catch (e) { return false; } });
  const blocked = minSize && tooSmall && !goOn;
  const continueAnyway = () => { try { sessionStorage.setItem(MIN_SIZE_KEY, '1'); } catch (e) { /* not stored: it lasts until the next render of the page */ } setGoOn(true); };
  // the frame (D-0093): in a window wider than the frame a person can expand the shell to the window and back, remembered on this origin like the navigation's width
  const wide = useMedia(frame === 'centered' ? '(width > ' + (tokenValue('--plx-sys-shell-frame-width') || '0px') + ')' : 'not all');
  const [fullWindow, setFullWindow] = React.useState(() => readPref('plenix.shell.frame.full', false));
  const toggleFrame = React.useCallback(() => setFullWindow((f) => { writePref('plenix.shell.frame.full', !f); if (onFrameChange) onFrameChange(f ? 'centered' : 'full'); return !f; }), [onFrameChange]);
  const framed = frame === 'centered' && wide && !fullWindow;
  React.useEffect(() => { setFramed(framed); return () => setFramed(false); }, [framed]);
  const frameCtx = React.useMemo(() => (frame === 'centered' && wide ? { full: fullWindow, toggle: toggleFrame } : null), [frame, wide, fullWindow, toggleFrame]);
  const small = useMedia(below('--plx-sys-shell-rail-below'));
  const narrow = useMedia(below('--plx-sys-shell-phone-below'));
  const [barEl, setBarEl] = React.useState<HTMLElement | null>(null);         // where NavPane puts the bottom navigation bar at Narrow
  const [parentEl, setParentEl] = React.useState<HTMLElement | null>(null);   // where it puts the parent row (the way to the pane) at Narrow
  const [expanded, setExpanded] = React.useState(() => readPref('plenix.sideNav.expanded', true));
  // the navigation pane's dragged width, remembered per monitor (utils/monitorWidths.ts); the single value saved before is this monitor's first value
  const [width, setWidth] = useMonitorWidth('nav', { legacy: () => readPref<number | null>('plenix.sideNav.width', null), min: () => tokenPx('--plx-sys-shell-nav-min-width'), max: () => tokenPx('--plx-sys-shell-nav-max-width') });
  const [overlay, setOverlay] = React.useState(false);
  const [slotEl, setSlotEl] = React.useState<HTMLElement | null>(null);   // the side-navigation area a screen fills through SideNavPortal
  const [portals, setPortals] = React.useState(0);
  const registerPortal = React.useCallback(() => { setPortals((n) => n + 1); return () => setPortals((n) => n - 1); }, []);
  const hasSide = !!sideNav || portals > 0;
  // one back control at Narrow: the parent row (NavPane) says it is drawn; a list-detail's Back (SecondaryPane) hands
  // itself to it while the detail shows, so the page never has two back rows
  const [parentRow, setParentRow] = React.useState(false);
  const [detailBack, setDetailBack] = React.useState<AppLayoutBack | null>(null);
  const claimParentRow = React.useCallback(() => { setParentRow(true); return () => setParentRow(false); }, []);
  const claimBack = React.useCallback((b: AppLayoutBack) => { setDetailBack(b); return () => setDetailBack((x) => (x === b ? null : x)); }, []);
  const toggle = React.useCallback(() => {
    if (small) setOverlay((o) => !o);
    else setExpanded((e) => { writePref('plenix.sideNav.expanded', !e); return !e; });
  }, [small]);
  React.useEffect(() => { setOverlay(false); }, [small, narrow]);
  // Ctrl+[ collapses and expands the navigation from anywhere on the page
  React.useEffect(() => {
    if (!hasSide) return undefined;
    const key = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === '[') { e.preventDefault(); toggle(); } };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [toggle, hasSide]);
  const mode = !hasSide ? 'none' : narrow ? (overlay ? 'screen' : 'bar') : small ? (overlay ? 'overlay' : 'rail') : expanded ? 'inline' : 'rail';
  const ctx = React.useMemo((): AppLayoutState => ({ hasSideNav: hasSide, slotEl, registerPortal, small, narrow, barEl, parentEl, mode, open: mode === 'inline' || mode === 'overlay' || mode === 'screen',
    expanded: small ? overlay : expanded, width, setWidth, toggle, close: () => setOverlay(false), page: claimed || page, layout, claimPage,
    parentRow, claimParentRow, detailBack, claimBack, frame: frameCtx }),
  [hasSide, slotEl, registerPortal, small, narrow, barEl, parentEl, mode, overlay, expanded, width, setWidth, toggle, claimed, page, layout, claimPage,
    parentRow, claimParentRow, detailBack, claimBack, frameCtx]);
  const shell = (
    <LayoutContext.Provider value={ctx}>
      <div className={cx('plx-app-shell', frame === 'centered' && 'plx-app-shell--frame', framed && 'plx-app-shell--framed', className)} data-plx-layout={LAYOUTS.indexOf(layout) >= 0 ? layout : 'fluid'} hidden={blocked || undefined} {...(blocked ? { inert: '' } : null)}>
        <a className="plx-app-shell__skip" href={'#' + mainId}>{t.skip}</a>
        {header}
        {narrow && hasSide ? <div ref={setParentEl} className="plx-app-shell__parent-slot" /> : null}
        <div className="plx-app-shell__body">
          <div className="plx-app-shell__side plx-app-shell__side--start">{sideNav || <div ref={setSlotEl} className="plx-app-shell__slot" />}</div>
          <main id={mainId} tabIndex={-1} className={cx('plx-app-shell__main', mainClassName)} data-plx-layout={LAYOUTS.indexOf(layout) >= 0 ? layout : 'fluid'}>{children}</main>
          <div className="plx-app-shell__side plx-app-shell__side--end">{panel}</div>
        </div>
        {footer}
        {narrow && hasSide ? <div ref={setBarEl} className="plx-app-shell__bar-slot" /> : null}
      </div>
    </LayoutContext.Provider>
  );
  const framedShell = frame === 'centered' ? <div className="plx-app-frame" data-plx-frame={framed ? 'framed' : 'full'}>{shell}</div> : shell;
  if (!minSize) return framedShell;
  // the notice is a sibling of the shell, so the app (the shell) keeps its place in the tree and its state while it is hidden
  const size = { width: tokenValue('--plx-sys-shell-min-width'), height: tokenValue('--plx-sys-shell-min-height') };
  return (
    <>
      {blocked ? (
        <main className="plx-app-shell__min-size">
          <EmptyState size="page" icon={ComputerIcon} title={<h1 className="plx-app-shell__min-size-title">{t.minSize.title}</h1>}
            action={<Button onClick={continueAnyway}>{t.minSize.continue}</Button>}>{fill(t.minSize.text, size)}</EmptyState>
        </main>
      ) : null}
      {framedShell}
    </>
  );
}

/* the drag handle on a resizable area's inner edge (PanelSplitter) lives with the Resizable component since library wave
   10; the panes (NavPane, SecondaryPane, SidePanel) still import it from here */
export { PanelSplitter };

/** @public */
export type SideNavPortalProps = { children?: React.ReactNode };
export function SideNavPortal({ children }: SideNavPortalProps) {
  const layout = useAppLayout();
  React.useEffect(() => (layout && layout.registerPortal ? layout.registerPortal() : undefined), []);
  if (!layout || !layout.registerPortal) return children as React.ReactElement;   // outside an AppShell: render in place
  return layout.slotEl ? createPortal(children, layout.slotEl) : null;
}

/* <Show> and <Hide>: responsive visibility by the window class (the breakpoint tokens), or on paper; see the header. */
const BREAKPOINTS: Record<string, string> = { medium: '--plx-sys-shell-phone-below', wide: '--plx-sys-shell-rail-below', inspector: '--plx-sys-shell-inspector-overlay-below' };
// a window class (medium, wide, inspector) or a breakpoint token's name
export type Breakpoint = 'medium' | 'wide' | 'inspector' | (string & {});
const breakpointQuery = (b: Breakpoint | undefined) => (b ? below(BREAKPOINTS[b] || b) : 'not all');
// true where the window is at or above "above" and under "below" (an omitted bound always holds)
function useWithin(above: Breakpoint | undefined, under: Breakpoint | undefined) {
  const underAbove = useMedia(breakpointQuery(above));
  const underBelow = useMedia(breakpointQuery(under));
  return (!above || !underAbove) && (!under || underBelow);
}
export type VisibilityProps = { above?: Breakpoint; below?: Breakpoint; /** on paper only (Show) or never on paper (Hide) */ print?: boolean; fallback?: React.ReactNode; children?: React.ReactNode };
/** @public */
export type ShowProps = VisibilityProps;
/** @public */
export type HideProps = VisibilityProps;
export function Show({ above, below: under, print = false, fallback = null, children }: ShowProps) {
  const within = useWithin(above, under);
  if (print) return <div className="plx-visibility plx-visibility--print-only">{children}</div>;
  return (within ? children : fallback) as React.ReactElement;
}
export function Hide({ above, below: under, print = false, fallback = null, children }: HideProps) {
  const within = useWithin(above, under);
  if (print) return <div className="plx-visibility plx-visibility--no-print">{children}</div>;
  return ((above || under) && within ? fallback : children) as React.ReactElement;
}

/* <PageContent>: the content column of a page inside the main region; see the header comment. */
export type PageContentProps = React.HTMLAttributes<HTMLElement> & { as?: React.ElementType };
export function PageContent({ as: As = 'section', className, children, ...rest }: PageContentProps) {
  return <As className={cx('plx-page-content', className)} {...rest}>{children}</As>;
}
