/* Plenix · NetworkGraph
   Summary: A graph of nodes joined by edges (07 Data Display › Specialized displays › Graph / network): how items
     connect (dependencies, lineage, assets and the collections that use them). Laid out by a force simulation (force:
     connected nodes pull together, all nodes push apart) or in layers from the roots (hierarchical); edges may be
     directed (an arrowhead) and labeled, with a dashed line for a second kind of link. Zoom and pan with the buttons
     above the plot, the keys or a drag; one Tab stop, the arrow keys move along the edges, and the node in focus and its
     neighbors stand out while the rest step back.
   Usage:
     <NetworkGraph title="Where the brand assets are used" description="The logo is used by every campaign."
       nodes={[{ id: 'logo', label: 'Logo', group: 'asset' }, { id: 'spring', label: 'Spring campaign', group: 'campaign' }]}
       edges={[{ source: 'spring', target: 'logo', label: 'uses' }]} groups={[{ id: 'asset', label: 'Assets' }, { id: 'campaign', label: 'Campaigns' }]} directed />
     <NetworkGraph … layout="hierarchical" direction="right" onSelect={({ node }) => open(node.id)} />
   Props:
     title, description: the chart's name and its takeaway (ChartFrame) (title required)
     nodes: [{ id, label, group }] (ids unique; label short: the full name goes in the table)
     edges: [{ source, target, label, kind }]: kind "solid" (default) | "dashed" (a second kind of link, named in the
       description or the legend so the line style is not the only cue)
     directed: draws an arrowhead at each edge's target (default false)
     layout: "force" (default: the structure finds its own shape; stable for the same data) | "hierarchical" (layers
       from the roots, nodes with no incoming edge) ; direction: "down" (default) | "right" (hierarchical)
     groups: [{ id, label }]: the node groups in the legend's order; their colors follow it (categorical data-viz)
     zoomable: the Zoom in, Zoom out and Fit buttons, + − 0 keys and dragging the background (default true)
     size, margin: as ChartFrame (default size "lg")
     interactive: keyboard, pointer, tooltip, live region and highlighting (default true); onSelect({ c, node }): a click
       or Enter on a node
     strings: { node: "Node", group: "Group", links: "Connected to", none: "None", zoomIn: "Zoom in", zoomOut: "Zoom out",
       fit: "Fit", hintZoom: " Plus and minus zoom, 0 fits the graph." }
     className: more classes on the figure
   Behavior:
     One Tab stop: an arrow key moves to the connected node most in that direction (or the nearest node that way when
       none is connected), Home and End to the first and last node; each says the node, its group and what it is connected
       to in the live region. Enter selects (onSelect); Escape clears.
     The node in focus or under the pointer and its neighbors keep their color; the other nodes and edges step back
       (reduced motion: at once). Zoom keeps the middle of the plot in place; Fit shows the whole graph again.
     The table under the graph lists every node, its group and its connections: the graph's text alternative.
   Notes:
     Layouts are computed in plot pixels each time the plot's size or the data changes (no animation), so the same data
     always draws the same graph. Nodes, edges, arrows and labels are classes on --plx-comp-network-graph-* tokens and
     the categorical data-viz colors. Hundreds of nodes: filter or cluster first; a strict hierarchy: a tree view.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatList } from '../utils/format.ts';
import { Button } from '../components/Button/Button.tsx';
import { ChartFrame } from './ChartFrame.tsx';
import { seriesColor } from './scales.ts';
import { ChartLegend } from './parts/ChartLegend.tsx';
import { ChartTooltip, chartTooltipText } from './parts/ChartTooltip.tsx';
import { useChartInteraction } from './interaction.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';
import EdRecenterIcon from 'plenix-platform/icons/plenix/ed-recenter';
import EdZoomInIcon from 'plenix-platform/icons/plenix/ed-zoom-in';
import EdZoomOutIcon from 'plenix-platform/icons/plenix/ed-zoom-out';

// SVG geometry, in plot pixels: the room kept around the layout for the labels (a label is centered under its node), the
// node's hit radius, the zoom steps
const INSET_X = 64, INSET_TOP = 24, INSET_BOTTOM = 40, HIT = 16, ZOOM_STEP = 1.25, ZOOM_MIN = 0.5, ZOOM_MAX = 4;

// the neighbors of each node (both directions), by index
export function graphNeighbors(nodes, edges) {
  const at = {}; nodes.forEach((n, i) => { at[n.id] = i; });
  const out = nodes.map(() => []);
  (edges || []).forEach((e) => { const a = at[e.source], b = at[e.target]; if (a === undefined || b === undefined || a === b) return; if (out[a].indexOf(b) < 0) out[a].push(b); if (out[b].indexOf(a) < 0) out[b].push(a); });
  return out;
}

// a force layout (Fruchterman–Reingold), deterministic: the nodes start on a circle in their order
export function forceLayout(nodes, edges, width, height) {
  const n = nodes.length; if (!n) return [];
  const W = Math.max(1, width - INSET_X * 2), H = Math.max(1, height - INSET_TOP - INSET_BOTTOM);
  const k = Math.sqrt((W * H) / n) * 0.75;
  const p = nodes.map((x, i) => ({ x: W / 2 + (W / 3) * Math.cos((2 * Math.PI * i) / n), y: H / 2 + (H / 3) * Math.sin((2 * Math.PI * i) / n) }));
  const nb = graphNeighbors(nodes, edges);
  let temp = W / 8;
  for (let it = 0; it < 300; it++) {
    const d = p.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      let dx = p[i].x - p[j].x, dy = p[i].y - p[j].y; let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.01) { dx = 0.01 * (i - j); dy = 0.01; dist = 0.02; }
      const f = (k * k) / dist; d[i].x += (dx / dist) * f; d[i].y += (dy / dist) * f; d[j].x -= (dx / dist) * f; d[j].y -= (dy / dist) * f;
    }
    nb.forEach((list, i) => list.forEach((j) => {
      if (j < i) return;
      const dx = p[i].x - p[j].x, dy = p[i].y - p[j].y, dist = Math.max(0.01, Math.sqrt(dx * dx + dy * dy)), f = (dist * dist) / k;
      d[i].x -= (dx / dist) * f; d[i].y -= (dy / dist) * f; d[j].x += (dx / dist) * f; d[j].y += (dy / dist) * f;
    }));
    // a weak pull to the middle keeps parts that are not connected on screen
    p.forEach((q, i) => { d[i].x += (W / 2 - q.x) * 0.05; d[i].y += (H / 2 - q.y) * 0.05; });
    p.forEach((q, i) => {
      const len = Math.max(0.01, Math.sqrt(d[i].x * d[i].x + d[i].y * d[i].y)), step = Math.min(len, temp);
      q.x = Math.min(W, Math.max(0, q.x + (d[i].x / len) * step)); q.y = Math.min(H, Math.max(0, q.y + (d[i].y / len) * step));
    });
    temp *= 0.985;
  }
  return fitInto(p, width, height);
}

// layers from the roots (longest path), ordered by the mean place of their parents: each node's rank (its layer) and
// place (its offset across the layer, centered on 0), and the widest layer
export function graphLayers(nodes, edges) {
  const n = nodes.length;
  const at = {}; nodes.forEach((x, i) => { at[x.id] = i; });
  const out = nodes.map(() => []), inc = nodes.map(() => []);
  (edges || []).forEach((e) => { const a = at[e.source], b = at[e.target]; if (a === undefined || b === undefined || a === b) return; out[a].push(b); inc[b].push(a); });
  const rank = nodes.map(() => -1);
  const roots = nodes.map((x, i) => i).filter((i) => !inc[i].length);
  const queue = (roots.length ? roots : [0]).slice(); queue.forEach((i) => { rank[i] = 0; });
  for (let guard = 0; queue.length && guard < n * n + n; guard++) {
    const i = queue.shift();
    out[i].forEach((j) => { if (rank[j] < rank[i] + 1 && rank[i] + 1 < n) { rank[j] = rank[i] + 1; queue.push(j); } });
  }
  rank.forEach((r, i) => { if (r < 0) rank[i] = 0; });
  const layers = []; rank.forEach((r, i) => { (layers[r] = layers[r] || []).push(i); });
  const place = nodes.map(() => 0);
  layers.forEach((l, r) => {
    if (r) l.sort((a, b) => { const m = (x) => (inc[x].length ? inc[x].reduce((s, q) => s + place[q], 0) / inc[x].length : place[x]); return m(a) - m(b); });
    l.forEach((i, k) => { place[i] = k - (l.length - 1) / 2; });
  });
  return { rank, place, wide: n ? Math.max.apply(null, layers.map((l) => l.length)) : 0, layers: layers.length };
}

// the layers laid out in the plot; direction "down" or "right"
export function layeredLayout(nodes, edges, width, height, direction = 'down') {
  if (!nodes.length) return [];
  const { rank, place, wide } = graphLayers(nodes, edges);
  const p = nodes.map((x, i) => {
    const along = rank[i], across = place[i] + (wide - 1) / 2;
    return direction === 'right' ? { x: along, y: across } : { x: across, y: along };
  });
  return fitInto(p, width, height);
}

// scales points into the plot, keeping the insets around them (a single row or column is centered)
function fitInto(p, width, height) {
  const xs = p.map((q) => q.x), ys = p.map((q) => q.y);
  const x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
  const W = Math.max(1, width - INSET_X * 2), H = Math.max(1, height - INSET_TOP - INSET_BOTTOM);
  const sx = x1 > x0 ? W / (x1 - x0) : 1, sy = y1 > y0 ? H / (y1 - y0) : 1;
  return p.map((q) => ({ x: x1 > x0 ? INSET_X + (q.x - x0) * sx : width / 2, y: y1 > y0 ? INSET_TOP + (q.y - y0) * sy : height / 2 }));
}

// zoom and pan of a graph's layer: { k, x, y } with the controls, keys and the drag of the background
export function useGraphView({ enabled = true, strings } = {}) {
  const t = useStrings('chart.networkGraph', strings);
  const [view, setView] = React.useState({ k: 1, x: 0, y: 0 });
  const size = React.useRef({ width: 0, height: 0 });
  const drag = React.useRef(null);
  const zoomBy = (f) => setView((v) => {
    const k = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, v.k * f)), cx0 = size.current.width / 2, cy0 = size.current.height / 2;
    return { k, x: cx0 - ((cx0 - v.x) / v.k) * k, y: cy0 - ((cy0 - v.y) / v.k) * k };
  });
  const fit = () => setView({ k: 1, x: 0, y: 0 });
  const actions = enabled ? [
    <Button key="in" size="sm" iconOnly icon={EdZoomInIcon} label={t.zoomIn} onClick={() => zoomBy(ZOOM_STEP)} />,
    <Button key="out" size="sm" iconOnly icon={EdZoomOutIcon} label={t.zoomOut} onClick={() => zoomBy(1 / ZOOM_STEP)} />,
    <Button key="fit" size="sm" icon={EdRecenterIcon} onClick={fit}>{t.fit}</Button>,
  ] : null;
  // wraps an interaction: the background drags the view, + − 0 zoom; everything else goes to the interaction
  const wrap = (ia, hitNode) => {
    if (!enabled || !ia) return ia;
    return Object.assign({}, ia, {
      hint: ia.hint + t.hintZoom,
      keyDown: (e) => {
        if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomBy(ZOOM_STEP); return; }
        if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomBy(1 / ZOOM_STEP); return; }
        if (e.key === '0') { e.preventDefault(); fit(); return; }
        ia.keyDown(e);
      },
      pointerDown: (px, py, e) => { if (!hitNode(px, py)) drag.current = { px, py, x: view.x, y: view.y, moved: false }; else ia.pointerDown(px, py, e); },
      pointerMove: (px, py, e) => {
        const d = drag.current;
        if (d) { if (Math.abs(px - d.px) + Math.abs(py - d.py) > 2) d.moved = true; if (d.moved) { setView((v) => ({ k: v.k, x: d.x + px - d.px, y: d.y + py - d.py })); return; } }
        ia.pointerMove(px, py, e);
      },
      pointerUp: (px, py, e) => { const d = drag.current; drag.current = null; if (d && d.moved) return; ia.pointerUp(px, py, e); },
      pointerLeave: () => { drag.current = null; ia.pointerLeave(); },
    });
  };
  return { view, setView, zoomBy, fit, actions, wrap, size, transform: 'translate(' + view.x + ',' + view.y + ') scale(' + view.k + ')',
    toScreen: (p) => ({ x: view.x + p.x * view.k, y: view.y + p.y * view.k }), toLayer: (px, py) => ({ x: (px - view.x) / view.k, y: (py - view.y) / view.k }) };
}

// the next node from a in the arrow's direction: a neighbor if one lies that way, else the nearest node that way
export function directionalMove(pos, neighbors, a, key) {
  const n = pos.length;
  if (key === 'Home') return { r: 0, c: 0 };
  if (key === 'End') return { r: 0, c: n - 1 };
  const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[key];
  const p = pos[a.c]; if (!d || !p) return a;
  const pick = (list) => {
    let best = null, bd = Infinity;
    list.forEach((i) => {
      const q = pos[i]; if (!q || i === a.c) return;
      const dx = q.x - p.x, dy = q.y - p.y, along = dx * d[0] + dy * d[1], off = Math.abs(dx * d[1] + dy * d[0]);
      if (along <= 0 || off > along * 2) return;
      const dist = along + off * 2; if (dist < bd) { bd = dist; best = i; }
    });
    return best;
  };
  const all = pos.map((q, i) => i);
  const next = pick(neighbors[a.c] || []);
  const any = next === null ? pick(all) : next;
  return any === null ? a : { r: 0, c: any };
}

export function NetworkGraph({ title, description, nodes = [], edges = [], directed = false, layout = 'force', direction = 'down', groups, zoomable = true,
  size = 'lg', margin, interactive = true, onSelect, strings, frameStrings, interactionStrings, className }) {
  const t = useStrings('chart.networkGraph', strings);
  const uid = 'plx-graph' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const nb = React.useMemo(() => graphNeighbors(nodes, edges), [nodes, edges]);
  const gIndex = (g) => (groups || []).findIndex((x) => x.id === g);
  const colorOf = (node) => seriesColor(Math.max(0, gIndex(node.group)));
  const groupName = (node) => (groups && gIndex(node.group) >= 0 ? groups[gIndex(node.group)].label : '');
  const links = (i) => (nb[i].length ? formatList(nb[i].map((j) => nodes[j].label)) : t.none);
  const pos = React.useRef([]);
  const gv = useGraphView({ enabled: zoomable, strings });
  const ia = useChartInteraction({
    rows: 1, columns: nodes.length, mode: 'point', select: typeof onSelect === 'function', strings: interactionStrings,
    onSelect: (cell) => onSelect && onSelect(Object.assign({ node: nodes[cell.c] }, cell)),
    describe: (cell) => chartTooltipText({ title: nodes[cell.c].label, items: (groups ? [{ label: t.group, value: groupName(nodes[cell.c]) }] : []).concat([{ label: t.links, value: links(cell.c) }]) }),
    move: (a, key) => directionalMove(pos.current, nb, a, key),
  });
  const hitNode = (px, py) => { const q = gv.toLayer(px, py); return pos.current.some((p) => p && Math.hypot(p.x - q.x, p.y - q.y) <= HIT / gv.view.k); };
  const iaz = gv.wrap(ia, hitNode);
  const table = {
    columns: [{ title: t.node, field: 'n', kind: 'name', rowLabel: true }].concat(groups ? [{ title: t.group, field: 'g', kind: 'name' }] : [], [{ title: t.links, field: 'l', kind: 'name' }]),
    data: nodes.map((x, i) => ({ id: i + 1, n: x.label, g: groupName(x), l: links(i) })),
  };
  const legendNode = groups && groups.length ? <ChartLegend items={groups.map((g, i) => ({ id: g.id, label: g.label, color: seriesColor(i) }))} /> : null;
  const memo = React.useRef({ key: '', pos: [] });

  const draw = ({ inner }) => {
    gv.size.current = inner;
    const key = inner.width + 'x' + inner.height + layout + direction + nodes.map((x) => x.id).join() + edges.map((e) => e.source + '>' + e.target).join();
    if (memo.current.key !== key) memo.current = { key, pos: layout === 'hierarchical' ? layeredLayout(nodes, edges, inner.width, inner.height, direction) : forceLayout(nodes, edges, inner.width, inner.height) };
    const p = memo.current.pos; pos.current = p;
    const at = {}; nodes.forEach((x, i) => { at[x.id] = i; });
    ia.register({
      nearest: (px, py) => {
        const q = gv.toLayer(px, py); let best = null, bd = HIT / gv.view.k;
        p.forEach((v, i) => { const d = Math.hypot(v.x - q.x, v.y - q.y); if (d <= bd) { bd = d; best = i; } });
        return best === null ? null : { r: 0, c: best };
      },
    });
    const a = ia.active && p[ia.active.c] ? ia.active.c : null, sel = ia.selected ? ia.selected.c : null;
    const near = (i) => a === null || i === a || nb[a].indexOf(i) >= 0;
    const tip = a !== null ? gv.toScreen(p[a]) : null;
    return (
      <g className="plx-network-graph__plot">
        {directed ? (
          <defs>
            <marker id={uid + '-arrow'} viewBox="0 0 8 8" refX="8" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
              <path className="plx-network-graph__arrow" d="M0,0L8,4L0,8Z" />
            </marker>
          </defs>
        ) : null}
        <g transform={gv.transform}>
          {edges.map((e, k) => {
            const i = at[e.source], j = at[e.target]; if (i === undefined || j === undefined) return null;
            const s = p[i], d = p[j], len = Math.max(0.01, Math.hypot(d.x - s.x, d.y - s.y)), ux = (d.x - s.x) / len, uy = (d.y - s.y) / len;
            const r = HIT * 0.75;
            const on = a !== null && (i === a || j === a);
            return (
              <g key={k} className={cx('plx-network-graph__link', 'plx-chart-dim', a !== null && !on && 'plx-chart-dim--off')}>
                <line className={cx('plx-network-graph__edge', e.kind === 'dashed' && 'plx-network-graph__edge--dashed', on && 'plx-network-graph__edge--active')}
                  x1={s.x + ux * r} y1={s.y + uy * r} x2={d.x - ux * r} y2={d.y - uy * r} markerEnd={directed ? 'url(#' + uid + '-arrow)' : undefined} />
                {e.label ? <text className="plx-network-graph__edge-label" x={(s.x + d.x) / 2} y={(s.y + d.y) / 2}>{e.label}</text> : null}
              </g>
            );
          })}
          {nodes.map((x, i) => (
            <g key={x.id} className={cx('plx-network-graph__node', 'plx-chart-dim', !near(i) && 'plx-chart-dim--off', a === i && 'plx-network-graph__node--active', sel === i && 'plx-network-graph__node--selected')}>
              <circle className={cx('plx-network-graph__dot', sel === i && 'plx-chart-selected')} data-plx-dataviz={colorOf(x)} cx={p[i].x} cy={p[i].y} />
              <text className="plx-network-graph__label" x={p[i].x} y={p[i].y}>{x.label}</text>
            </g>
          ))}
        </g>
        {tip ? <ChartTooltip x={tip.x + (tip.x > inner.width / 2 ? -HIT : HIT)} y={tip.y} inner={inner} title={nodes[a].label}
          items={(groups ? [{ label: t.group, value: groupName(nodes[a]), color: colorOf(nodes[a]) }] : []).concat([{ label: t.links, value: String(nb[a].length) }])} /> : null}
      </g>
    );
  };

  return (
    <ChartFrame clip title={title} description={description} size={size} margin={Object.assign({ top: 0, end: 0, bottom: 0, start: 0 }, margin)} table={table} legend={legendNode}
      interaction={interactive ? iaz : undefined} actions={gv.actions} strings={frameStrings}
      className={cx('plx-network-graph', 'plx-network-graph--' + (layout === 'hierarchical' ? 'hierarchical' : 'force'), className)}>
      {draw}
    </ChartFrame>
  );
}
