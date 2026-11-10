/* Plenix · ChartFrame
   Summary: The frame every Plenix chart is drawn in (07 Data Display › Charts › Chart foundations): a figure with the
     chart's title and description, a responsive SVG plot that measures itself (a ResizeObserver) and hands its size and
     inner area (the plot less its margins) to the chart, and the data as a table for people who cannot see the chart.
   Usage:
     <ChartFrame title="Uploads per month" description="Uploads rose every month from January to June."
       table={{ columns: [{ title: 'Month', field: 'month', kind: 'name' }, { title: 'Uploads', field: 'n', kind: 'data' }], data: rows }}>
       {({ inner }) => { const x = scaleBand({ domain: months, range: [0, inner.width] }); … return <g>…</g>; }}
     </ChartFrame>
     <ChartFrame title="…" interaction={useChartInteraction({ columns: rows.length, describe })}>…</ChartFrame>
   Props:
     title: the chart's name (required): the caption's title and the SVG's accessible name
     description: one or two sentences that say what the chart shows (its takeaway); the SVG's description
     hideCaption: keeps the title and description for assistive technology only (default false), when a heading beside
       the chart already shows them
     size: the plot's height: "sm" (160px) | "md" (240px, default) | "lg" (320px); the width is the container's
     margin: the room around the plot for axes and labels, in pixels: { top, end, bottom, start } (each optional; the
       defaults are the --plx-comp-chart-margin-* tokens); values snap to the 4px grid; start and end follow the writing
       direction
     table: the data as a table: { columns, data } as the Table takes them (technical values kind "data"); always one
       click away behind "Show the data"
     dataView: "dialog" (default: the button opens a Dialog titled with the chart's title and holding the table) |
       "inline" (a Details line under the chart that expands the table in the card) (ADR 0054)
     legend: the chart's legend (a ChartLegend), placed by legendPosition (chart parts, wave 8)
     legendPosition: "bottom" (default: under the plot) | "top" (between the caption and the plot: tight dashboard
       cards) | "end" (beside the
       plot, after it; give the legend orientation="vertical"); the plot keeps the rest of the width
     interaction: the chart's interaction (useChartInteraction, platform/charts/interaction.ts; wave 9): the plot becomes
       one Tab stop named "{title}, interactive chart" with the keyboard hint as its description, and hands its keys and
       the pointer (in plot coordinates) to the interaction; a Reset zoom button shows above the plot while it is zoomed
     actions: controls above the plot, at its end (a network graph's zoom buttons); Buttons of size sm
     clip: clips the SVG at its viewport (default false); Diagram and NetworkGraph opt in instead of styling its parts.
     fitHeight: (width) => the plot's height in pixels for its width, for a chart whose height follows its content (a
       diagram drawn at its own size); the plot's height is then the SVG's, not the size's
     children: a function ({ width, height, inner: { width, height }, margin }) returning the chart's SVG content, drawn
       inside a group already moved by the margins; or SVG nodes
     strings: the words it shows, for other languages: { showData: "Show the data", table: "{title}: data" } (the
       interaction's words are the interaction's strings)
     className: more classes on the figure
   Behavior:
     Point dimming publishes --plx-comp-chart-dim-opacity on the plot; dim marks read it with opacity 1 as fallback.
     The plot fills its container's width and follows it when it resizes; the chart is drawn once the size is known.
     The SVG is one image to assistive technology (role img, named by the title and described by the description);
       its marks are hidden from it, so the table carries the values.
     Interactive (interaction): the plot takes focus once (its border takes the focus color, no outer ring) and hands
       the arrow keys, Home, End, Enter, Space, Escape and the pointer to the interaction, which says each value in the
       live region; the tooltip and the focus ring the chart draws follow it.
     Marks take their colors from the data-viz scales: data-plx-dataviz="<scale>-<step>" on a mark (seriesColor(i))
       and the frame's mark classes (plx-chart__mark, plx-chart__line, plx-chart__point) fill or stroke it with that
       step; axis lines, grid lines and tick labels have their classes too (plx-chart__axis-line, plx-chart__grid-line,
       plx-chart__tick-label: the data font).
   Notes:
     No color, size or font is written in a chart: only SVG geometry (x, y, width, height, d, transform) and classes.
     Chart parts (platform/charts/parts: Axis, GridLines, ChartLegend, ChartTooltip, DataLabel, ReferenceLine,
       ChartAnnotation; wave 8) and the charts themselves (wave 9) build on this frame.
*/
import React from 'react';
import type { ChartInner, ChartMargin } from './chart-types.ts';
import type { TableProps } from '../components/Table/Table.tsx';
import type { useChartInteraction } from './interaction.ts';
import { cx } from '../utils/cx.ts';
import { dataWhenText } from '../utils/dataText.tsx';
import { isRtl } from '../utils/direction.ts';
import { ChartData } from './ChartData.tsx';
import type { ChartDataView } from './ChartData.tsx';
import { Button } from '../components/Button/Button.tsx';
import { snapToGrid } from '../utils/grid.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';
import RefreshIcon from 'plenix-platform/icons/plenix/refresh';

const MARGIN_TOKENS = { top: '--plx-comp-chart-margin-block-start', end: '--plx-comp-chart-margin-inline-end', bottom: '--plx-comp-chart-margin-block-end', start: '--plx-comp-chart-margin-inline-start' };

/** @public what a chart's children function gets */
export type ChartFrameDraw = { width: number; height: number; inner: ChartInner; margin: Required<ChartMargin> };
/** @public */
export type ChartFrameProps = {
  title: string;
  description?: string;
  hideCaption?: boolean;
  size?: 'sm' | 'md' | 'lg';
  margin?: ChartMargin;
  legend?: React.ReactNode;
  legendPosition?: 'bottom' | 'top' | 'end';
  /** the data as a table under the chart, as Table takes it */
  /** how the data table shows: a Dialog (default) or inline under the chart */
  dataView?: ChartDataView;
  table?: { columns: NonNullable<TableProps['columns']>; data: Record<string, unknown>[]; index?: string };
  interaction?: ReturnType<typeof useChartInteraction>;
  actions?: React.ReactNode;
  fitHeight?(width: number): number;
  clip?: boolean;
  strings?: { showData?: string; table?: string };
  className?: string;
  children?: React.ReactNode | ((draw: ChartFrameDraw) => React.ReactNode);
};
export function ChartFrame({ title, description, hideCaption = false, size = 'md', margin, legend, legendPosition = 'bottom', dataView = 'dialog', table, interaction, actions, fitHeight, clip = false, strings, className, children }: ChartFrameProps) {
  const t: any = useStrings('chart.chartFrame', strings);
  const uid = 'plx-chart' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const frame = React.useRef<any>(null), plot = React.useRef<any>(null);
  const [box, setBox] = React.useState({ width: 0, height: 0, rtl: false, tokens: null });
  React.useLayoutEffect(() => {
    const el = plot.current;
    if (!el) return undefined;
    const measure = () => {
      const cs = getComputedStyle(frame.current);
      const tokens: any = {};
      Object.keys(MARGIN_TOKENS).forEach((k) => { tokens[k] = parseFloat(cs.getPropertyValue((MARGIN_TOKENS as Record<string, string>)[k])) || 0; });
      const r = el.getBoundingClientRect();
      // an interactive plot has a border (its focus border): the SVG is drawn inside it
      const next = { width: Math.floor(r.width - el.clientLeft * 2), height: Math.floor(r.height - el.clientTop * 2), rtl: isRtl(el), tokens };
      setBox((b) => (b.width === next.width && b.height === next.height && b.rtl === next.rtl && JSON.stringify(b.tokens) === JSON.stringify(tokens) ? b : next));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const m: any = {};
  Object.keys(MARGIN_TOKENS).forEach((k) => { m[k] = snapToGrid(margin && (margin as any)[k] !== undefined ? (margin as any)[k] : box.tokens ? box.tokens[k] : 0); });
  // the drawing is left to right in every language (time runs left to right, owner issue 584 B), so the start margin,
  // where the labels sit, stays at the left
  const left = m.start;
  const fit = typeof fitHeight === 'function';
  const height = fit ? (box.width > 0 ? Math.max(1, Math.ceil(fitHeight(box.width))) : 0) : box.height;
  const inner = { width: Math.max(0, box.width - m.start - m.end), height: Math.max(0, height - m.top - m.bottom) };
  const dims = { width: box.width, height, inner, margin: m };
  const titleId = uid + '-title', descId = uid + '-desc', hintId = uid + '-hint';
  const ia = interaction && interaction.interactive ? interaction : null;
  // the pointer in plot coordinates: inside the border, less the margins
  const local = (e: any) => {
    const el = plot.current, r = el.getBoundingClientRect();
    return [e.clientX - r.left - el.clientLeft - left, e.clientY - r.top - el.clientTop - m.top];
  };
  const on = (fn: any) => (e: any) => { const p = local(e); fn(p[0], p[1], e); };
  const plotProps = ia ? {
    tabIndex: 0, role: 'group', 'aria-label': ia.strings.plot.replace('{title}', title || ''), 'aria-describedby': hintId,
    onKeyDown: ia.keyDown, onFocus: ia.onFocus, onBlur: ia.onBlur, onPointerDown: on(ia.pointerDown), onPointerMove: on(ia.pointerMove),
    onPointerUp: on(ia.pointerUp), onPointerLeave: ia.pointerLeave,
  } : {};
  const toolbar = (ia && ia.zoomed) || actions ? (
    <div className="plx-chart__actions">
      {actions}
      {ia && ia.zoomed ? <Button size="sm" icon={RefreshIcon} onClick={ia.resetZoom}>{ia.strings.resetZoom}</Button> : null}
    </div>
  ) : null;
  const caption = (
    <figcaption className={cx('plx-chart__caption', hideCaption && 'plx-visually-hidden')}>
      <span id={titleId} className="plx-chart__title">{title}</span>
      {description ? <span id={descId} className="plx-chart__description">{dataWhenText(description)}</span> : null}
    </figcaption>
  );
  // the legend (chart parts): before the plot, after it, or beside it in a row with it
  const lp = ['top', 'bottom', 'end'].indexOf(legendPosition) >= 0 ? legendPosition : 'bottom';
  const key = legend ? <div className={cx('plx-chart__legend', 'plx-chart__legend--' + lp)}>{legend}</div> : null;
  const plotArea = (
    <div ref={plot} className={cx('plx-chart__plot', fit && 'plx-chart__plot--fit', ia && 'plx-chart__plot--interactive', ia && ia.mode === 'point' && ia.active && 'plx-chart__plot--dimming')} {...plotProps}>
      {ia ? <span id={hintId} className="plx-visually-hidden">{ia.hint}</span> : null}
      {box.width > 0 && height > 0 ? (
        <svg className={cx('plx-chart__svg', clip && 'plx-chart__svg--clipped')} width={box.width} height={height} viewBox={'0 0 ' + box.width + ' ' + height}
          role="img" aria-labelledby={titleId} aria-describedby={description ? descId : undefined} focusable="false">
          <g transform={'translate(' + left + ',' + m.top + ')'} aria-hidden="true">
            {typeof children === 'function' ? children(dims) : children}
          </g>
        </svg>
      ) : null}
    </div>
  );
  return (
    <figure ref={frame} className={cx('plx-chart', 'plx-chart--' + size, className)}>
      {caption}
      {toolbar}
      {lp === 'top' ? key : null}
      {lp === 'end' && key ? <div className="plx-chart__body">{plotArea}{key}</div> : plotArea}
      {lp === 'bottom' ? key : null}
      {table && table.data ? (
        <ChartData title={title} summary={t.showData} tableLabel={t.table.replace('{title}', title || '')} columns={table.columns} data={table.data} index={table.index} dataView={dataView} />
      ) : null}
    </figure>
  );
}
