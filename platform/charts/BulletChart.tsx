/* Plenix · BulletChart
   Summary: Key measures against their targets (07 Data Display › Charts › Bullet chart): for each measure a short value
     bar over bands that mark its qualitative ranges (poor, fair, good, in three neutral shades) and a line across at its
     target, on one value axis from zero; horizontal (rows) or vertical (columns). Takes far less room than a gauge, so a
     dashboard can stack several. Drawn in ChartFrame with a tooltip and the data grid.
   Usage:
     <BulletChart title="Quarter against targets" description="Uploads and reviews are on target; approvals are behind."
       items={[{ id: 'up', label: 'Uploads', value: 820, target: 750, ranges: [400, 700, 1000] },
               { id: 'rv', label: 'Reviews', value: 610, target: 600, ranges: [300, 550, 1000] }]} valueLabel="Count" />
   Props:
     title: the chart's name (required); description: its takeaway (ChartFrame)
     items: the measures: [{ id, label, value, target, ranges }]; ranges are the upper ends of up to three bands, lowest
       first (poor, fair, good); target is optional
     orientation: "horizontal" (default: one row per measure, names on the start side) | "vertical" (one column per
       measure, names along the bottom)
     max: the value axis's end (default the largest range, value or target, on a round number)
     valueLabel: the value axis's title (the measure's unit); format: (value) => text (ticks, tooltip, table)
     tooltip: shows the measure's value, target and ranges under the pointer (default true)
     size, margin, hideCaption, className, legend, legendPosition: ChartFrame's
     strings: { measure: "Measure", value: "Value", target: "Target", ranges: "Ranges", poor: "Poor", fair: "Fair",
       good: "Good" } and ChartFrame's strings
   Behavior:
     Every measure shares one value axis from zero: give measures of different units their own chart.
     Hover a measure: the tooltip lists its value, its target and the range it is in. The data grid lists them all.
   Notes:
     The value bar is the frame's mark (the first categorical color); the ranges are three neutral surface and border
       shades and the target the default content color (bullet-chart tokens): color is not the only cue, the target is
       a line across and the ranges are named in the tooltip and the table.
*/
import React from 'react';
import type { ChartMargin } from './chart-types.ts';
import { cx } from '../utils/cx.ts';
import { formatNumber } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.tsx';
import { ChartTooltip } from './parts/ChartTooltip.tsx';
import { useChartHover, finite } from './chart-kit.ts';
import { useEChartsPlot, plotGrid } from './echarts/EChartsPlot.tsx';
import { gridRoom } from './chart-helpers.ts';
import { snapToGrid } from '../utils/grid.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';

const NO_MARGIN = Object.freeze({ top: 0, end: 0, bottom: 0, start: 0 });
const BAND = 1 / 1.4;   // a measure's band as a share of its row (the room between rows is 40% of a band)
const BAR = 1 / 3;      // the value bar's thickness, a share of the band
const TARGET = 2 / 3;   // the target line's length, a share of the band

/** @public one measure of a bullet chart; `ranges` are the upper ends of up to three bands, lowest first */
export type BulletItem = { id: string; label: string; value: number; target?: number; ranges?: number[] };
/** @public */
export type BulletChartProps = {
  title: string;
  description?: string;
  hideCaption?: boolean;
  size?: 'sm' | 'md' | 'lg';
  items?: BulletItem[];
  orientation?: 'horizontal' | 'vertical';
  max?: number;
  valueLabel?: string;
  format?(value: number): string;
  tooltip?: boolean;
  legend?: boolean;
  legendPosition?: 'bottom' | 'top' | 'end';
  margin?: ChartMargin;
  strings?: Record<string, string>;
  className?: string;
};
export function BulletChart({ title, description, hideCaption, size, items = [], orientation = 'horizontal', max, valueLabel, format, tooltip = true,
  legend, legendPosition, margin, strings, className }: BulletChartProps) {
  const t: any = useStrings('chart.bulletChart', strings);
  const o = orientation === 'vertical' ? 'vertical' : 'horizontal';
  const across = o === 'horizontal';
  const fmt = (v: any) => (typeof format === 'function' ? format(v) : formatNumber(v));
  const [active, hover] = useChartHover();
  const list = items.map((it, i) => Object.assign({}, it, { id: it.id === undefined ? String(i) : it.id, ranges: (it.ranges || []).slice(0, 3).map(finite) }));
  const top = max !== undefined ? Number(max) : list.reduce((a, it) => Math.max(a, finite(it.value), finite(it.target), Math.max.apply(null, [0].concat(it.ranges))), 0) || 1;
  const names = [t.poor, t.fair, t.good];
  const rangeOf = (it: any) => { const v = finite(it.value); for (let i = 0; i < it.ranges.length; i++) if (v <= it.ranges[i]) return names[i + (3 - it.ranges.length)]; return names[2]; };
  const table: any = {
    columns: [{ title: t.measure, field: 'measure', kind: 'name', rowLabel: true }, { title: t.value, field: 'value', kind: 'data', align: 'right' },
      { title: t.target, field: 'target', kind: 'data', align: 'right' }, { title: t.ranges, field: 'ranges', kind: 'data' }],
    data: list.map((it, i) => ({ id: i + 1, measure: it.label, value: fmt(finite(it.value)), target: it.target === undefined || it.target === null ? '' : fmt(it.target),
      ranges: it.ranges.map(fmt).join(' \u00b7 ') + (it.ranges.length ? ' (' + rangeOf(it) + ')' : '') }))
  };
  // the format the drawing calls, kept current without redrawing (a format written inline is a new function each render)
  const fmts = React.useRef<any>(null); fmts.current = { fmt };

  const plot = useEChartsPlot();
  const dataKey = JSON.stringify(list.map((it) => [it.id, it.label, it.value, it.target, it.ranges])) + '|' + o + '|' + max + '|' + valueLabel + '|' + (margin ? [margin.top, margin.end, margin.bottom, margin.start].join(':') : '');
  const option = React.useCallback((tk: any) => {
    const room = gridRoom(margin, 0);
    // (horizontal: the value axis's labels and title under the plot are laid out by ECharts; vertical: the measures' names need their line)
    if (!across) room.bottom = Math.max(room.bottom, snapToGrid(tk.tickOffset + tk.tick.fontSize, { round: 'up' }));
    const named = { nameLocation: 'middle', nameMoveOverlap: true };
    const nameRoom = tk.tickOffset * 2 + tk.tick.fontSize;
    const valAxis = Object.assign({ type: 'value', min: 0, max: max === undefined ? undefined : Number(max), name: valueLabel, nameGap: across ? nameRoom : 0, inverse: across && tk.rtl,
      axisLabel: { formatter: (v: any) => fmts.current.fmt(v) }, axisLine: { show: across, lineStyle: { color: tk.axis.color, width: tk.axis.width } } }, named);
    const catAxis = Object.assign({ type: 'category', data: list.map((it) => it.label), inverse: across, position: across ? (tk.rtl ? 'right' : 'left') : 'bottom', boundaryGap: true, axisLine: { show: false } }, named);
    const pct = (share: any) => (Math.round(share * BAND * 10000) / 100) + '%';   // a share of a measure's band, as a share of its row
    const fill = (i: any, n: any) => tk.bullet.ranges[i + (3 - n)];
    // the bands, widest first (so the narrower sit in front of them), all on one row; then the value bar, narrower, on a second (hidden) category axis so it
    // sits centred on the same row. The target mark is the frame's overlay (it needs the row's exact size)
    const series: any = [];
    [2, 1, 0].forEach((r) => series.push({ type: 'bar', id: 'r' + r, silent: true, barGap: '-100%', barWidth: pct(1), z: 1 + (2 - r) * 0.1, emphasis: { disabled: true },
      data: list.map((it) => (it.ranges[r] === undefined ? null : { value: it.ranges[r], itemStyle: { color: fill(r, it.ranges.length) } })) }));
    series.push({ type: 'bar', id: 'value', silent: true, barWidth: pct(BAR), z: 3, itemStyle: { color: tk.color('categorical-1') }, emphasis: { disabled: true }, data: list.map((it) => finite(it.value)),
      [across ? 'yAxisIndex' : 'xAxisIndex']: 1 });
    const spare = Object.assign({}, catAxis, { show: false });
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      grid: Object.assign(room, { outerBoundsMode: 'same', outerBoundsContain: 'all' }),
      xAxis: across ? valAxis : [catAxis, spare], yAxis: across ? [catAxis, spare] : valAxis, series,
    };
  }, [dataKey]);   // eslint-disable-line react-hooks/exhaustive-deps

  const draw = (dims: any) => {
    const layer = plot.layer(dims, option);
    const c = plot.chart;
    const g = c ? plotGrid(c) : null;
    if (!g || !list.length) return layer;
    const step = (across ? g.height : g.width) / list.length;
    const at = (i: any, v: any) => { const p = c.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, across ? [v, i] : [i, v]); return { x: p[0] - g.x, y: p[1] - g.y }; };
    const inner = { width: g.width, height: g.height };
    const ai = active === null ? -1 : list.findIndex((x) => x.id === active);
    let tip: any = null;
    if (tooltip && ai >= 0) {
      const it = list[ai], end = at(ai, finite(it.value));
      const shown = fmt(finite(it.value)) + (it.target === undefined || it.target === null ? '' : ' \u00b7 ' + t.target + ' ' + fmt(it.target));
      tip = <ChartTooltip x={end.x} y={end.y} inner={inner} title={it.label + (it.ranges.length ? ' \u00b7 ' + rangeOf(it) : '')} items={[{ label: t.value, value: shown, color: 'categorical-1' }]} />;
    }
    // the target marks: a line across each row at its target (the frame's overlay: it needs the row's exact size)
    const len = step * BAND * TARGET;
    return [layer, (
      <g key="plx-chart-overlay" transform={'translate(' + g.x + ',' + g.y + ')'}>
        {list.map((it, i) => {
          if (it.target === undefined || it.target === null) return null;
          const p = at(i, finite(it.target));
          return across ? <line key={'t' + it.id} className="plx-bullet-chart__target" x1={p.x} x2={p.x} y1={p.y - len / 2} y2={p.y + len / 2} /> : <line key={'t' + it.id} className="plx-bullet-chart__target" x1={p.x - len / 2} x2={p.x + len / 2} y1={p.y} y2={p.y} />;
        })}
        {tooltip ? list.map((it, i) => {
          const p = at(i, 0);
          return across
            ? <rect key={it.id} className="plx-bullet-chart__item" fill="none" pointerEvents="all" x={0} y={p.y - step / 2} width={g.width} height={step} {...hover(it.id)} />
            : <rect key={it.id} className="plx-bullet-chart__item" fill="none" pointerEvents="all" x={p.x - step / 2} y={0} width={step} height={g.height} {...hover(it.id)} />;
        }) : null}
        {tip}
      </g>
    )];
  };

  return (
    <ChartFrame title={title} description={description} hideCaption={hideCaption} size={size} margin={NO_MARGIN} legend={legend} legendPosition={legendPosition}
      table={table} strings={strings} className={cx('plx-bullet-chart', 'plx-bullet-chart--' + o, className)}>
      {draw}
    </ChartFrame>
  );
}
