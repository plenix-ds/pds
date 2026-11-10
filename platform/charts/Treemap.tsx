/* Plenix · Treemap
   Summary: The parts of a whole as rectangles whose areas are their sizes (07 Data Display › Charts › Treemap): many parts
     in little room, flat (one level) or nested (parts in their groups, each group framed and named). Laid out by the
     squarified algorithm, largest first from the top start corner.
   Usage:
     <Treemap title="Storage by folder" description="Video takes over half of the 412 GB." valueTitle="Size (GB)"
       data={[{ label: 'Video', value: 220 }, { label: 'Photos', value: 96 }, …]} />
     <Treemap title="Storage by team and folder" data={[{ label: 'Design', children: [{ label: 'Video', value: 120 }, …] }, …]} />
   Props:
     title: the chart's name (required); description: its takeaway
     data: the parts: [{ label, value }] (flat), or the groups [{ label, children: [{ label, value }] }] (nested) (required)
     variant: "flat" | "nested" (default: nested when the data has groups)
     color: the data-viz step of a flat treemap's tiles ("categorical-1" by default); nested groups take the categorical
       colors by their order
     format: (value) => text (default formatNumber)
     valueTitle: what the size measures, with its unit: the table's column and the tooltip's name
     size: the plot's height, as ChartFrame ("sm" | "md" | "lg" default)
     strings: the words it says: { group: "Group", item: "Part", value: "Value", share: "Share", hint } (hint: the chart interaction's)
     className: more classes on the figure
   Behavior:
     Each tile's area is its share of the whole; tiles are ordered largest to smallest. A tile shows its name, and its value
       under it, only when they fit (the tooltip and the table always have both); names are clipped to their tile.
     Nested: each group is framed and named above its tiles; its tiles take the group's color.
     Keyboard: one Tab stop; the arrow keys move through the tiles (by group, largest first), each spoken with its value and
       share; the pointer over a tile does the same. The active tile gets a ring and the tooltip.
     The frame's "Show the data" table lists every part with its value and share.
   Notes:
     Built on ChartFrame, ChartTooltip and the chart-a11y helpers. Tiles are separated by gaps in the surface color; tile
       names and values sit on a halo in the surface color (like centered data labels), so they read on any data color.
     For precise comparison use a bar chart; for two to five parts a donut or bars.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber, formatPercent } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.tsx';
import { seriesColor } from './scales.ts';
import { ChartTooltip } from './parts/ChartTooltip.tsx';
import { useChartPoints } from './a11y.ts';
import { useEChartsPlot } from './echarts/EChartsPlot.tsx';
import { useStrings } from '../providers/LocaleProvider.tsx';

// the group's name row, the ring's room (the 4px grid)
const GROUP_HEAD = 20, RING = 0;

/** @public a part of a treemap, or a group with parts of its own */
export type TreemapNode = { label: string; value?: number; children?: { label: string; value: number }[] };
/** @public the prop type (ADR 0011) */
export type TreemapProps = {
  /** how the data table shows: a Dialog (default) or inline under the chart (ADR 0054) */
  dataView?: 'dialog' | 'inline';
  title: string;
  description?: string;
  data?: TreemapNode[];
  variant?: 'flat' | 'nested';
  /** the data-viz step of a flat treemap's tiles ("categorical-1" by default) */
  color?: string;
  format?(value: number): string;
  valueTitle?: string;
  size?: 'sm' | 'md' | 'lg';
  strings?: Record<string, string>;
  className?: string;
};
export function Treemap({ title, description, dataView, data = [], variant, color, format, valueTitle, size = 'lg', strings, className }: TreemapProps) {
  const t: any = useStrings('chart.treemap', strings);
  const nested = variant ? variant === 'nested' : data.some((d) => Array.isArray(d.children));
  const v = nested ? 'nested' : 'flat';
  // the groups (one unnamed group when flat), each with its parts largest first
  const groups = (nested ? data : [{ label: '', children: data }]).map((g, gi) => {
    const parts = (g.children || []).map((c) => ({ label: String(c.label), value: Math.max(0, Number(c.value) || 0) })).filter((c) => c.value > 0).sort((a, b) => b.value - a.value);
    return { label: String(g.label || ''), color: nested ? seriesColor(gi) : color || seriesColor(0), parts, value: parts.reduce((a, c) => a + c.value, 0) };
  }).filter((g) => g.value > 0).sort((a, b) => b.value - a.value);
  const total = groups.reduce((a, g) => a + g.value, 0);
  const tiles: any[] = [];
  groups.forEach((g) => g.parts.forEach((p) => tiles.push(Object.assign({ group: g, share: total ? p.value / total : 0 }, p))));
  const fmt = (n: any) => (typeof format === 'function' ? format(n) : formatNumber(n));
  const pct = (n: any) => formatPercent(n, { decimals: n < 0.1 ? 1 : 0 });
  const keys = useChartPoints({ count: tiles.length, describe: (i) => (nested ? tiles[i].group.label + ', ' : '') + tiles[i].label + ': ' + fmt(tiles[i].value) + ', ' + pct(tiles[i].share) });
  const table: any = { columns: ([] as any[]).concat(nested ? [{ title: t.group, field: 'group', kind: 'name' }] : [], [{ title: t.item, field: 'label', kind: 'name', rowLabel: true },
    { title: valueTitle || t.value, field: 'shown', kind: 'data', align: 'right' }, { title: t.share, field: 'share', kind: 'data', align: 'right' }]),
    data: tiles.map((p, i) => ({ id: i + 1, group: p.group.label, label: p.label, shown: fmt(p.value), share: pct(p.share) })) };
  // the format the drawing calls, kept current without redrawing (a format written inline is a new function each render)
  const fmts = React.useRef<any>(null); fmts.current = { fmt };

  const plot = useEChartsPlot();
  const dataKey = JSON.stringify(groups.map((g) => [g.label, g.color, g.parts.map((p) => [p.label, p.value])])) + '|' + v;
  const option = React.useCallback((tk: any) => {
    const k = tk.treemap, label = k.label, value = k.value;
    const line = label.fontSize + 4, rich = { n: { lineHeight: line, color: label.color, fontFamily: label.fontFamily, fontSize: label.fontSize, fontWeight: label.fontWeight, textBorderColor: label.halo, textBorderWidth: label.haloWidth },
      v: { lineHeight: line, color: label.color, fontFamily: value.fontFamily, fontSize: value.fontSize, fontWeight: value.fontWeight, textBorderColor: label.halo, textBorderWidth: label.haloWidth } };
    const leaf = (g: any) => g.parts.map((p: any) => ({ name: p.label, value: p.value, itemStyle: { color: tk.color(g.color) } }));
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      series: [{ type: 'treemap', id: 'tiles', silent: true, roam: false, nodeClick: false, breadcrumb: { show: false }, left: 0, top: 0, right: 0, bottom: 0, sort: false, squareRatio: 1.618, visibleMin: 0, animation: false,
        label: { show: true, position: 'insideTopLeft', overflow: 'truncate', formatter: (p: any) => '{n|' + p.name + '}\n{v|' + fmts.current.fmt(p.value) + '}', rich },
        // level 0 is the series' own root (no frame, no name); then the groups (a frame and their name above) when nested; then the tiles (a gap in the surface color)
        levels: ([{ itemStyle: { borderWidth: 0, gapWidth: 0 }, upperLabel: { show: false } }] as any[])
          .concat(nested ? [{ itemStyle: { borderColor: k.gap.color, borderWidth: k.group.width, gapWidth: 0 }, upperLabel: { show: true, height: GROUP_HEAD, formatter: '{b}', color: k.group.label.color, fontFamily: k.group.label.fontFamily, fontSize: k.group.label.fontSize, fontWeight: k.group.label.fontWeight } }] : [])
          .concat([{ itemStyle: { borderColor: k.gap.color, borderWidth: k.gap.width, gapWidth: 0 }, upperLabel: { show: false } }]),
        data: nested ? groups.map((g) => ({ name: g.label, itemStyle: { color: 'transparent' }, children: leaf(g) })) : leaf(groups[0] || { parts: [], color: seriesColor(0) }) }],
    };
  }, [dataKey]);   // eslint-disable-line react-hooks/exhaustive-deps

  const draw = (dims: any) => {
    const layer = plot.layer(dims, option);
    const c = plot.chart;
    const seriesModel = c ? c.getModel().getSeriesByIndex(0) : null;
    const tree = seriesModel && seriesModel.getData() && seriesModel.getData().tree;
    if (!tree) return layer;
    // the leaves in the order they were given (by group, largest first): the rectangle ECharts laid each one in
    const rects: any[] = [];
    // a child's rectangle is relative to its parent's: the leaf's place is the sum along its way down
    const walk = (node: any, ox: any, oy: any) => { const l = node.getLayout() || { x: 0, y: 0, width: 0, height: 0 }; if (node.children && node.children.length) node.children.forEach((child: any) => walk(child, ox + l.x, oy + l.y)); else rects.push({ x: ox + l.x, y: oy + l.y, width: l.width, height: l.height }); };
    tree.root.children.forEach((node: any) => walk(node, 0, 0));
    const inner = { width: dims.width, height: dims.height };
    const a = keys.index !== null && keys.index !== undefined && rects[keys.index] ? keys.index : null;
    keys.interaction.register({ nearest: (px: any, py: any) => { const i = rects.findIndex((r) => px >= r.x && px <= r.x + r.width && py >= r.y && py <= r.y + r.height); return i < 0 ? null : { r: 0, c: i }; } });
    return [layer, (
      <g key="plx-chart-overlay">
        {rects.map((r, i) => <rect key={'h' + i} className="plx-chart-keys__hit" x={r.x} y={r.y} width={r.width} height={r.height} onMouseEnter={() => keys.hover(i)} onMouseLeave={() => keys.hover(null)} />)}
        {a !== null ? <rect className="plx-chart-keys__ring" x={rects[a].x + RING} y={rects[a].y + RING} width={Math.max(0, rects[a].width - 2 * RING)} height={Math.max(0, rects[a].height - 2 * RING)} /> : null}
        {a !== null ? <ChartTooltip x={rects[a].x + rects[a].width / 2} y={rects[a].y + rects[a].height / 2} inner={inner} title={(nested ? tiles[a].group.label + ' \u00b7 ' : '') + tiles[a].label}
          items={[{ label: valueTitle || t.value, value: fmt(tiles[a].value), color: tiles[a].group.color }, { label: t.share, value: pct(tiles[a].share) }]} /> : null}
      </g>
    )];
  };

  return (
    <ChartFrame interaction={keys.interaction} title={title} dataView={dataView} description={description} size={size} table={table} margin={{ top: 0, end: 0, bottom: 0, start: 0 }} className={cx('plx-treemap', 'plx-treemap--' + v, className)}>
      {draw}
    </ChartFrame>
  );
}
