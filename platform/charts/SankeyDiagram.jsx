/* Plenix · SankeyDiagram
   Summary: How a quantity flows, splits and merges through stages (07 Data Display › Charts › Sankey diagram): a bar
     for each node (a source, a stage, an outcome) in columns from left to right, and between them bands whose widths
     are the amounts that move from one node to the next. Its own layout (no dependency): columns by the longest path,
     nodes ordered to keep bands from crossing. Drawn in ChartFrame with node names and totals, a tooltip and the data
     table of every flow.
   Usage:
     <SankeyDiagram title="Where uploads end up" description="Most uploads are approved; a quarter are rejected or wait."
       nodes={[{ id: 'web', label: 'Web' }, { id: 'app', label: 'App' }, { id: 'review', label: 'Review' }, { id: 'ok', label: 'Approved' }, { id: 'no', label: 'Rejected' }]}
       links={[{ source: 'web', target: 'review', value: 620 }, { source: 'app', target: 'review', value: 380 }, { source: 'review', target: 'ok', value: 740 }, { source: 'review', target: 'no', value: 260 }]} />
   Props:
     title: the chart's name (required); description: its takeaway (ChartFrame)
     nodes: [{ id, label, color }] (color an optional data-viz step; default by the node's order in the data)
     links: [{ source, target, value }]: the flows between nodes by id (values above zero; a flow back to an earlier
       column is not drawn: the diagram flows one way)
     format: (value) => text (node totals, tooltip, table); default formatNumber
     showValues: writes each node's total after its name (default true)
     tooltip: shows the flow or the node under the pointer (default true)
     size (default "lg"), margin, hideCaption, className, legend, legendPosition: ChartFrame's
     strings: { source: "Source", target: "Target", value: "Value", total: "Total" } and ChartFrame's strings
   Behavior:
     A node's height is the larger of what flows into it and out of it; nodes with no flow out sit in the last column.
     Hover a band: it darkens and the tooltip says "Source → Target" and its amount; hover a node: its bands darken and the
       tooltip gives its total. The data grid lists every flow: the chart's keyboard and screen reader view.
   Notes:
     A band takes its source node's data-viz color at the low opacity (the middle opacity when highlighted); node names
       are UI text with a halo in the surface color, totals the data font (sankey-diagram tokens). Group small flows:
       many thin bands do not read. For a linear drop-off use a funnel.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.jsx';
import { seriesColor } from './scales.js';
import { ChartTooltip } from './parts/ChartTooltip.tsx';
import { useChartHover, finite } from './chart-kit.js';
import { useStrings } from '../providers/LocaleProvider.tsx';

// px: a node's bar and the least space between two nodes of a column (on the 4px grid)
const NODE_WIDTH = 12, NODE_GAP = 12;
const PLOT_MARGIN = { top: 8, end: 8, bottom: 8, start: 8 };

// the layout: nodes with x0, x1, y0, y1, depth, value; links with width, y0 (at the source), y1 (at the target)
export function sankeyLayout(nodes, links, { width, height, nodeWidth = NODE_WIDTH, nodeGap = NODE_GAP, iterations = 8 } = {}) {
  const N = (nodes || []).map((n, i) => ({ id: n.id === undefined ? String(i) : n.id, label: n.label, color: n.color || seriesColor(i), index: i, sourceLinks: [], targetLinks: [], depth: 0 }));
  const byId = {};
  N.forEach((n) => { byId[n.id] = n; });
  const L = (links || []).map((l, i) => ({ index: i, source: byId[l.source], target: byId[l.target], value: Math.max(0, finite(l.value)) }))
    .filter((l) => l.source && l.target && l.source !== l.target && l.value > 0);
  // columns by the longest path from a source (a flow back is dropped)
  for (let pass = 0; pass < N.length; pass++) L.forEach((l) => { if (l.target.depth <= l.source.depth) l.target.depth = l.source.depth + 1; });
  const fwd = L.filter((l) => l.target.depth > l.source.depth);
  fwd.forEach((l) => { l.source.sourceLinks.push(l); l.target.targetLinks.push(l); });
  const maxDepth = N.reduce((a, n) => Math.max(a, n.depth), 0);
  N.forEach((n) => { if (!n.sourceLinks.length && n.targetLinks.length) n.depth = maxDepth; });
  N.forEach((n) => { n.value = Math.max(n.sourceLinks.reduce((a, l) => a + l.value, 0), n.targetLinks.reduce((a, l) => a + l.value, 0)); });
  const cols = [];
  N.forEach((n) => { (cols[n.depth] = cols[n.depth] || []).push(n); });
  const columns = cols.filter(Boolean);
  const step = maxDepth ? (width - nodeWidth) / maxDepth : 0;
  N.forEach((n) => { n.x0 = n.depth * step; n.x1 = n.x0 + nodeWidth; });
  const ky = Math.max(0, Math.min.apply(null, columns.map((c) => (height - (c.length - 1) * nodeGap) / Math.max(1e-9, c.reduce((a, n) => a + n.value, 0)))));
  columns.forEach((c) => { let y = 0; c.forEach((n) => { n.y0 = y; n.y1 = y + n.value * ky; y = n.y1 + nodeGap; }); });
  const center = (n) => (n.y0 + n.y1) / 2;
  const settle = (c) => {   // nodes in order, apart by the gap, inside the height
    c.sort((a, b) => a.y0 - b.y0);
    let y = 0;
    c.forEach((n) => { const d = y - n.y0; if (d > 0) { n.y0 += d; n.y1 += d; } y = n.y1 + nodeGap; });
    let over = y - nodeGap - height;
    for (let i = c.length - 1; i >= 0 && over > 0; i--) {
      const n = c[i]; n.y0 -= over; n.y1 -= over;
      over = i > 0 ? c[i - 1].y1 + nodeGap - n.y0 : 0;
    }
  };
  for (let it = 0, alpha = 1; it < iterations; it++, alpha *= 0.9) {
    columns.slice(1).forEach((c) => { c.forEach((n) => { const w = n.targetLinks.reduce((a, l) => a + l.value, 0); if (!w) return; const want = n.targetLinks.reduce((a, l) => a + center(l.source) * l.value, 0) / w; const d = (want - center(n)) * alpha; n.y0 += d; n.y1 += d; }); settle(c); });
    columns.slice(0, -1).reverse().forEach((c) => { c.forEach((n) => { const w = n.sourceLinks.reduce((a, l) => a + l.value, 0); if (!w) return; const want = n.sourceLinks.reduce((a, l) => a + center(l.target) * l.value, 0) / w; const d = (want - center(n)) * alpha; n.y0 += d; n.y1 += d; }); settle(c); });
  }
  N.forEach((n) => {
    n.sourceLinks.sort((a, b) => a.target.y0 - b.target.y0);
    n.targetLinks.sort((a, b) => a.source.y0 - b.source.y0);
    let sy = n.y0; n.sourceLinks.forEach((l) => { l.width = l.value * ky; l.y0 = sy + l.width / 2; sy += l.width; });
    let ty = n.y0; n.targetLinks.forEach((l) => { l.y1 = ty + (l.value * ky) / 2; ty += l.value * ky; });
  });
  return { nodes: N, links: fwd, maxDepth };
}

// a band from the source's end to the target's start, its width the flow's
function band(l) {
  const x0 = l.source.x1, x1 = l.target.x0, xm = (x0 + x1) / 2, h = l.width / 2;
  return 'M' + x0 + ',' + (l.y0 - h) + 'C' + xm + ',' + (l.y0 - h) + ' ' + xm + ',' + (l.y1 - h) + ' ' + x1 + ',' + (l.y1 - h)
    + 'L' + x1 + ',' + (l.y1 + h) + 'C' + xm + ',' + (l.y1 + h) + ' ' + xm + ',' + (l.y0 + h) + ' ' + x0 + ',' + (l.y0 + h) + 'Z';
}

export function SankeyDiagram({ title, description, hideCaption, size = 'lg', nodes = [], links = [], format, showValues = true, tooltip = true, legend, legendPosition,
  margin, strings, className }) {
  const t = useStrings('chart.sankeyDiagram', strings);
  const fmt = (v) => (typeof format === 'function' ? format(v) : formatNumber(v));
  const [active, hover] = useChartHover();
  const nameOf = {};
  nodes.forEach((n, i) => { nameOf[n.id === undefined ? String(i) : n.id] = n.label; });
  const table = {
    columns: [{ title: t.source, field: 'source', kind: 'name', rowLabel: true }, { title: t.target, field: 'target', kind: 'name' }, { title: t.value, field: 'value', kind: 'data', align: 'right' }],
    data: links.filter((l) => nameOf[l.source] !== undefined && nameOf[l.target] !== undefined).map((l, i) => ({ id: i + 1, source: nameOf[l.source], target: nameOf[l.target], value: fmt(finite(l.value)) }))
  };
  return (
    <ChartFrame title={title} description={description} hideCaption={hideCaption} size={size} margin={Object.assign({}, PLOT_MARGIN, margin)} legend={legend}
      legendPosition={legendPosition} table={table} strings={strings} className={cx('plx-sankey-diagram', className)}>
      {({ inner }) => {
        const lay = sankeyLayout(nodes, links, { width: inner.width, height: inner.height });
        const on = String(active === null ? '' : active);
        const lit = (l) => on === 'l' + l.index || on === 'n' + l.source.id || on === 'n' + l.target.id;
        let tip = null;
        if (tooltip && on) {
          const l = on[0] === 'l' ? lay.links.filter((x) => 'l' + x.index === on)[0] : null;
          const n = on[0] === 'n' ? lay.nodes.filter((x) => 'n' + x.id === on)[0] : null;
          if (l) tip = <ChartTooltip x={(l.source.x1 + l.target.x0) / 2} y={(l.y0 + l.y1) / 2} inner={inner} title={l.source.label + ' → ' + l.target.label}
            items={[{ label: t.value, value: fmt(l.value), color: l.source.color }]} />;
          if (n) tip = <ChartTooltip x={n.depth === lay.maxDepth ? n.x0 : n.x1} y={(n.y0 + n.y1) / 2} inner={inner} title={n.label}
            items={[{ label: t.total, value: fmt(n.value), color: n.color }]} />;
        }
        return (
          <g>
            <g className="plx-sankey-diagram__links">
              {lay.links.map((l) => <path key={l.index} className={cx('plx-sankey-diagram__link', lit(l) && 'is-active')} data-plx-dataviz={l.source.color} d={band(l)} {...(tooltip ? hover('l' + l.index) : {})} />)}
            </g>
            {lay.nodes.filter((n) => n.value > 0).map((n) => (
              <rect key={n.id} className="plx-chart__mark plx-sankey-diagram__node" data-plx-dataviz={n.color} x={n.x0} y={n.y0} width={n.x1 - n.x0} height={Math.max(0, n.y1 - n.y0)} {...(tooltip ? hover('n' + n.id) : {})} />
            ))}
            {lay.nodes.filter((n) => n.value > 0).map((n) => {
              const last = n.depth === lay.maxDepth && lay.maxDepth > 0;
              return (
                <text key={'t' + n.id} className={cx('plx-sankey-diagram__label', last ? 'plx-sankey-diagram__label--before' : 'plx-sankey-diagram__label--after')} x={last ? n.x0 : n.x1} y={(n.y0 + n.y1) / 2}>
                  <tspan className="plx-sankey-diagram__name">{n.label}</tspan>
                  {showValues ? ' ' : null}
                  {showValues ? <tspan className="plx-sankey-diagram__value">{fmt(n.value)}</tspan> : null}
                </text>
              );
            })}
            {tip}
          </g>
        );
      }}
    </ChartFrame>
  );
}
