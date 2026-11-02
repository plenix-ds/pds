/* Plenix · SplitView, ReadingPane
   Summary: Two panels that share their room (02 Page structures › Workspace structures › Split workspace): a list or
     table and the item chosen in it, side by side or stacked, both the full height (or width) of their room, each
     scrolling on its own, with a divider between them to resize (owner, 2026-10-16: the Outlook-style layout).
     ReadingPane is the second panel's surface: the table's frame, an actions row with a thin line under it that stops
     short of the edges, and the item below.
   Usage:
     <AppShell …>
       <SplitView label="Inbox" orientation="side-by-side" firstLabel="Message list" defaultSize={560}
         first={<DataGrid label="Inbox" … />}
         second={<ReadingPane label={item.subject} actions={<Toolbar …/>}>…</ReadingPane>} />
     </AppShell>
     <SplitView orientation="stacked" defaultSize={320} first={…} second={…} />
   Props:
     orientation: "side-by-side" (default; the first panel at the start, the divider between, the second fills the rest)
       | "stacked" (the first on top; both the full width)
     first, second: the two panels' content (the first is usually a DataGrid, which brings its own frame; the second a
       ReadingPane)
     label: the split view's accessible name (a group); firstLabel: what the divider resizes ("Message list"; default
       "First panel"), its name is "{firstLabel} width" or "… height"
     defaultSize: the first panel's starting width (side by side) or height (stacked), in pixels; size /
       onSizeChange(px): the parent keeps it (keep it in the view to remember it per person)
     minSize: a number: the first panel's floor in pixels (default 360 side by side, 200 stacked); never above the ceiling, so both
       panels stay usable
     maxSize: a number: stacked, the first panel's ceiling in pixels (default 500). Side by side it is deprecated and no longer caps
       the drag (issue 873): the ceiling is the room, as below; a larger maxSize is the room anyway, a smaller one is ignored
       (no error)
     steps: settled sizes allowed; the divider follows the pointer within its limits and snaps to these on release.
       Without steps it settles on the 4px grid. Side by side, the other pane retains its token minimum width;
       stacked, its token minimum height.
     className: more classes on the split view
     ReadingPane.label: its region's name (the item's title); actions: the actions row (a Toolbar); empty: what shows
       when nothing is chosen (an EmptyState); children: the item; className
   Behavior:
     Claims master-detail through useAppLayout().claimPage while mounted inside AppShell; cleanup restores the shell page.
     Each panel scrolls on its own; the page never scrolls as a whole (the multi-pane page kind). The divider is the whole
       8px gutter between the panels (owner, 2026-10-26: the uiwjs look): the resize pointer anywhere along it, a thin
       line on each side, a light fill and a grip of three short lines in the middle; the gutter tints on hover, and its
       lines and grip take the focus color while focused or dragged. Stacked, the same turned a quarter.
     Dragging: the divider moves one grid line (4px) at a time within the limits and stays on the grid when let go, or
       settles on the nearest of the steps when there are steps. Sizes are honoured up to 1600px (Resizable's
       GRID_BOX_MAX): a larger size lands on 1600px.
     Side by side, how far (issue 873, the owner: "I need to be able to resize any split view screen"): the first panel
       drags as far as the split view's room allows while the second keeps its token minimum width
       (--plx-comp-split-view-second-min-width), and never past the window's share (--plx-sys-shell-pane-window-share, 90%,
       read as Resizable's side panels read it). There is no fixed 720px ceiling. defaultSize stays the starting width; a
       remembered size (size, onSizeChange) comes back up to that ceiling. At the room's limit the words say the other pane
       needs its minimum; at the window's share, "Largest width for … (Npx)" names the width. The keyboard's End and the
       separator's aria-valuemax follow the same ceiling, and a smaller window lowers it at once.
     Keyboard: the divider is a separator in the Tab order; the arrow keys step to the next size, Home and End to the
       limits. There is no size menu (owner, 2026-10-16).
     Stacked when there is no room side by side: under 900px of the split view's own width the panels stack (container
       query), whatever the orientation, and the divider is the stacked one: a horizontal separator under the first panel
       that drags its height (200–500px, starting at 320) and that Up and Down move. Above 900px it is the side divider
       again. Each orientation keeps the person's own size (issue 237).
     Stacked, by its orientation or its room (issue 560): the divider is a horizontal bar the full width between the two
       panels, its grip turned a quarter, a separator with aria-orientation="horizontal". It drags vertically; Up and
       Down step it, Home and End go to the limits. The second panel keeps at least 160px
       (--plx-comp-split-view-second-min-height), so the divider stops short of it in a short room and says why. Only
       one divider is drawn at a time: switching layouts never leaves a side divider at the first panel's end.
     Room and corners (owner, 2026-10-27, splitview-design-29): the split view keeps 16px of room all around
       (--plx-comp-split-view-padding), so its panels never touch the rest of the screen. Both panels round their outer
       corners by the same 6px (--plx-comp-split-view-radius, shape-md), and the corners at the divider are square, side
       by side and stacked: each panel hands its corners to its content as context tokens
       (--plx-comp-data-grid-context-<corner>-radius, --plx-comp-reading-pane-context-<corner>-radius).
   Notes:
     Built on Resizable (the first panel); the divider is Resizable's divider variant (resizable.css,
     --plx-comp-resizable-divider-* tokens), its size SplitView's gap (--plx-comp-split-view-gap). Colors, sizes and
     spacing are --plx-comp-split-view-*, --plx-comp-resizable-divider-* and --plx-comp-reading-pane-* tokens on existing roles; the reading pane's frame is the
     data grid's (data-grid-border, shape-md, border-width-thin).
*/
import React from 'react';
import { GridPane } from '../../components/DataGrid/room.js';
import { useAppLayout } from '../AppShell/AppShell.jsx';
import { cx } from '../../utils/cx.ts';
import { Resizable } from '../../components/Resizable/Resizable.tsx';
import { useStrings, useDigits } from '../../providers/LocaleProvider.tsx';
import { localDigits } from '../../utils/digits.ts';
import { shareOf } from '../../utils/paneLimit.ts';

// side by side: the floor and the starting width (the ceiling is the room, never more than the window's share: issue 873);
// stacked: the floor, the ceiling and the starting height
const LIMITS = { 'side-by-side': [360, Infinity, 560], stacked: [200, 500, 320] };

export function SplitView({ orientation = 'side-by-side', first, second, label, firstLabel, defaultSize, size, onSizeChange,
  minSize, maxSize, steps, className, ...rest }) {
  const tw = useStrings('splitView');
  const digits = useDigits();
  // the other pane's minimum in the words at the limit, in the page's digits (Arabic-Indic in Arabic)
  const otherNeeds = (n) => tw.maxWidth.replace('{n}', localDigits(String(n), { digits }));
  if (firstLabel === undefined) firstLabel = tw.firstLabel;
  const shell = useAppLayout();
  const claim = shell && shell.claimPage;
  React.useEffect(() => (claim ? claim('master-detail') : undefined), [claim]);
  const side = orientation !== 'stacked';
  const [lo, hi, start] = LIMITS[side ? 'side-by-side' : 'stacked'];
  const container = React.useRef(null);
  const [available, setAvailable] = React.useState(null);
  // stacked by its room (issue 237): under 900px a side-by-side split view stacks in CSS (the container query); its divider
  // then becomes the stacked one, read from the layout the CSS chose, so the two never disagree
  const [roomStacked, setRoomStacked] = React.useState(false);
  // measured before the first paint, so a narrow split view never draws a frame with the side settings
  React.useLayoutEffect(() => {
    const element = container.current, win = element && element.ownerDocument.defaultView;
    if (!element || !win) return;
    const measure = () => {
      const panels = element.firstElementChild, second = panels && panels.lastElementChild;
      const horizontal = side && panels && win.getComputedStyle(panels).flexDirection === 'row';
      // never while a divider is dragged: the switch waits for the drag to end (the pointerup below measures again)
      if (!/\bis-resizing-/.test(element.ownerDocument.documentElement.className)) setRoomStacked(side && !!panels && !horizontal);
      if (!panels || !second) { setAvailable(null); return; }
      // the room the first panel may take: the panels' width (side by side) or height (stacked, issue 560) less the gap
      // and the second panel's token minimum (--plx-comp-split-view-second-min-width or -min-height)
      const secondStyle = win.getComputedStyle(second), panelsStyle = win.getComputedStyle(panels), box = panels.getBoundingClientRect();
      const minimum = parseFloat(horizontal ? secondStyle.minInlineSize : secondStyle.minBlockSize) || 0;
      const gap = parseFloat(horizontal ? panelsStyle.columnGap : panelsStyle.rowGap) || 0;
      const floor = horizontal || !side ? (minSize ?? lo) : LIMITS.stacked[0];
      const max = Math.max(floor, (horizontal ? box.width : box.height) - gap - minimum);
      // the window's share (--plx-sys-shell-pane-window-share, 90%, on the 4px grid), as Resizable's side panels read it (issue 873)
      const share = shareOf(win.innerWidth, element);
      setAvailable(previous => previous && previous.max === max && previous.minimum === minimum && previous.horizontal === horizontal && previous.share === share ? previous : { max, minimum, horizontal, share });
    };
    measure();
    const observer = win.ResizeObserver ? new win.ResizeObserver(measure) : null;
    if (observer) observer.observe(element);
    win.addEventListener('resize', measure);
    // after a drag ends, a switch it held back happens; any other click measures nothing
    const settle = () => { if (/\bis-resizing-/.test(element.ownerDocument.documentElement.className)) win.requestAnimationFrame(measure); };
    win.addEventListener('pointerup', settle, true); win.addEventListener('pointercancel', settle, true);
    return () => { if (observer) observer.disconnect(); win.removeEventListener('resize', measure); win.removeEventListener('pointerup', settle, true); win.removeEventListener('pointercancel', settle, true); };
  }, [side, minSize, lo]);
  // side by side (issue 873, the owner: "I need to be able to resize any split view screen"): the first panel drags as far as the
  // room allows while the second keeps its token minimum, and never past the window's share (90%). maxSize no longer caps it:
  // a larger one is the room anyway, a smaller one is ignored (deprecated). Before the first measure: the window's share.
  const sideRoom = side && available && available.horizontal ? available : null;
  const windowShare = available ? available.share : (typeof window === 'undefined' ? Infinity : shareOf(window.innerWidth));
  const sideMax = sideRoom ? Math.min(sideRoom.max, windowShare) : windowShare;
  const requestedMax = side ? sideMax : (maxSize ?? hi);
  // at the room's limit the words say why (the other pane's minimum); at the window's share, Resizable's own words with the width
  const constrained = !!sideRoom && sideRoom.max <= windowShare;
  const widthMax = sideMax;
  // minSize stays a floor, never above the ceiling, so both panels stay usable
  const widthMin = Math.min(minSize || lo, sideMax);
  // stacked (by its orientation or its room): the divider stops where the second panel would get shorter than its token
  // minimum (issue 560), and says so at that limit
  const stackRoom = available && !available.horizontal ? available : null;
  const heightMax = (wanted) => (stackRoom && stackRoom.max < wanted ? stackRoom.max : wanted);
  const heightWords = (wanted) => (stackRoom && stackRoom.max < wanted ? { maxHeight: otherNeeds(stackRoom.minimum) } : undefined);
  const [, , stackedStart] = LIMITS.stacked;
  const box = side && roomStacked
    // stacked by its room: the stacked divider, its height limits and start, a horizontal separator that Up and Down move
    ? { axis: 'vertical', defaultWidth: defaultSize != null ? defaultSize : start, minWidth: widthMin, maxWidth: requestedMax, defaultHeight: stackedStart, minHeight: LIMITS.stacked[0], maxHeight: heightMax(LIMITS.stacked[1]), strings: heightWords(LIMITS.stacked[1]) }
    : side
    ? { axis: 'horizontal', defaultHeight: stackedStart, minHeight: LIMITS.stacked[0], maxHeight: LIMITS.stacked[1], defaultWidth: defaultSize != null ? defaultSize : start, width: size, minWidth: widthMin, maxWidth: widthMax, strings: constrained ? { maxWidth: otherNeeds(available.minimum) } : undefined, onResize: onSizeChange ? (s) => onSizeChange(s.width) : undefined }
    : { axis: 'vertical', defaultHeight: defaultSize != null ? defaultSize : start, height: size, minHeight: minSize || lo, maxHeight: heightMax(maxSize || hi), strings: heightWords(maxSize || hi), onResize: onSizeChange ? (s) => onSizeChange(s.height) : undefined };
  return (
    <GridPane.Provider value={true}><div ref={container} role="group" aria-label={label} className={cx('plx-split-view', 'plx-split-view--' + (side ? 'side-by-side' : 'stacked'), className)} {...rest}>
      <div className="plx-split-view__panels">
        <Resizable label={firstLabel} steps={steps} variant="divider" fill className={cx('plx-split-view__first', 'plx-split-view__first--' + (side ? 'side-by-side' : 'stacked'))} {...box}>{first}</Resizable>
        <div className={cx('plx-split-view__second', 'plx-split-view__second--' + (side ? 'side-by-side' : 'stacked'))}>{second}</div>
      </div>
    </div></GridPane.Provider>
  );
}

export function ReadingPane({ label, actions, empty, className, children }) {
  return (
    <section aria-label={label} className={cx('plx-reading-pane', className)}>
      {actions ? <div className="plx-reading-pane__actions">{actions}</div> : null}
      <div className="plx-reading-pane__body">{children || (empty ? <div className="plx-reading-pane__empty">{empty}</div> : null)}</div>
    </section>
  );
}
