/* Plenix · Diagram
   Summary: A diagram of shapes joined by connectors (07 Data Display › Specialized displays › Diagram) that explains a
     process, a system or a structure. Flowchart: each shape says what a step is (process, decision, start or end, data)
     and the connectors carry the flow, with labels on the branches ("Yes", "No"). Boxes and arrows: every node a box
     with a title and a line, inside the group it belongs to. Laid out in layers in one reading direction (down or
     right), fitted to the plot, zoomed and panned like the network graph; interactive, one Tab stop walks the flow and
     says each step and where it leads; read-only, it is a picture with its steps as a table.
   Usage:
     <Diagram title="How an upload is approved" description="Every upload is checked; rejected ones go back to the owner."
       nodes={[{ id: 'start', label: 'Upload a file', shape: 'terminal' }, { id: 'check', label: 'Meets the rules?', shape: 'decision' },
         { id: 'ok', label: 'Publish it' }, { id: 'back', label: 'Return to the owner' }, { id: 'end', label: 'Done', shape: 'terminal' }]}
       edges={[{ source: 'start', target: 'check' }, { source: 'check', target: 'ok', label: 'Yes' }, { source: 'check', target: 'back', label: 'No' },
         { source: 'ok', target: 'end' }, { source: 'back', target: 'end' }]} />
     <Diagram variant="boxes" direction="right" groups={[{ id: 'web', label: 'Web' }, …]} nodes={[{ id: 'app', label: 'Asset app', detail: 'React', group: 'web' }, …]} edges={…} />
     <Diagram … interactive={false} />                       // read-only: no Tab stop, no zoom buttons
   Props:
     title, description: the diagram's name and what it explains (ChartFrame) (title required)
     nodes: [{ id, label, shape, detail, group }]: label short, starting with a verb for a step; shape (flowchart):
       "process" (default: a step) | "decision" (a question with branches) | "terminal" (where the flow starts or ends) |
       "data" (something put in or taken out); detail: a second line (boxes and arrows); group: the id of one of groups
     edges: [{ source, target, label }]: the flow, in its direction; label names a branch ("Yes", "No")
     variant: "flowchart" (default: shapes by meaning) | "boxes" (boxes with a title and a line, groups as containers)
     groups: [{ id, label }]: containers drawn around their nodes (boxes and arrows)
     direction: "down" (default: top to bottom) | "right" (left to right); one direction per diagram
     interactive: keyboard, pointer, tooltip, live region and the zoom controls (default true); false: read-only
     margin: as ChartFrame; the plot is as tall as the diagram (ChartFrame fitHeight): it is drawn at its own size, and
       smaller only to fit a narrower container; onSelect({ c, node }): a click or Enter on a shape
     strings: { step: "Step", kind: "Kind", next: "Leads to", previous: "Comes from", end: "End", process: "Step",
       decision: "Decision", terminal: "Start or end", data: "Data", box: "Part", group: "Group" } and the zoom words of
       the network graph
     className: more classes on the figure
   Behavior:
     One Tab stop: ↓ (or → when the diagram reads right) follows the flow to the next shape, ↑ (←) goes back, the other
       arrows move across a layer; each move says the step, its kind and where it leads in the live region. Enter
       selects (onSelect). Zoom and pan as the network graph (+ − 0, the buttons, a drag of the background).
     The table under it lists every step in order with its kind and where it leads: the diagram's text alternative.
   Notes:
     Shapes are SVG geometry on the 4px grid; labels wrap inside them (an HTML label in a foreignObject); fills, edges,
       arrows and type are --plx-comp-diagram-* tokens on existing roles (no color carries meaning: the shapes and the
       labels do). For data values use a chart; for a few steps in order, a numbered list.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatList } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.tsx';
import type { ChartFrameProps } from './ChartFrame.tsx';
import { ChartTooltip, chartTooltipText } from './parts/ChartTooltip.tsx';
import { useChartInteraction } from './interaction.ts';
import { graphLayers, graphNeighbors, useGraphView, directionalMove } from './NetworkGraph.tsx';
import { useStrings } from '../providers/LocaleProvider.tsx';

const SHAPES = ['process', 'decision', 'terminal', 'data'];
// SVG geometry, in pixels on the 4px grid: each shape's size, the gaps between layers and across them, a group's padding
const SIZE: any = { process: [144, 48], decision: [144, 64], terminal: [128, 40], data: [144, 48], box: [160, 64] };
const GAP_ALONG = 48, GAP_ACROSS = 32, GROUP_PAD = 16, GROUP_HEAD = 24, INSET = 16, SLANT = 12;

function outline(shape: any, w: any, h: any) {
  const x0 = -w / 2, y0 = -h / 2;
  if (shape === 'decision') return 'M0,' + y0 + 'L' + -x0 + ',0L0,' + -y0 + 'L' + x0 + ',0Z';
  if (shape === 'data') return 'M' + (x0 + SLANT) + ',' + y0 + 'L' + -x0 + ',' + y0 + 'L' + (-x0 - SLANT) + ',' + -y0 + 'L' + x0 + ',' + -y0 + 'Z';
  return null;
}

/** @public one node: a step, decision, terminal or data shape (flowchart), or a box with a detail line */
export type DiagramNode = { id: string | number; label: string; shape?: 'process' | 'decision' | 'terminal' | 'data'; detail?: string; group?: string | number };
/** @public one flow, in its direction; the label names a branch */
export type DiagramEdge = { source: string | number; target: string | number; label?: string };
/** @public a container drawn around its nodes (variant boxes) */
export type DiagramGroup = { id: string | number; label: string };
/** @public the prop type (ADR 0011) */
export type DiagramProps = Pick<ChartFrameProps, 'title' | 'dataView' | 'description' | 'size' | 'margin' | 'className'> & {
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  variant?: 'flowchart' | 'boxes';
  groups?: DiagramGroup[];
  direction?: 'down' | 'right';
  interactive?: boolean;
  /** a click or Enter on a shape */
  onSelect?(selection: { c: number; node: DiagramNode }): void;
  strings?: Record<string, string>;
  frameStrings?: ChartFrameProps['strings'];
  interactionStrings?: Record<string, string>;
};
export function Diagram({ title, description, dataView, nodes = [], edges = [], variant = 'flowchart', groups, direction = 'down', interactive = true, size = 'lg', margin,
  onSelect, strings, frameStrings, interactionStrings, className }: DiagramProps) {
  const t: any = useStrings('chart.diagram', strings);
  const uid = 'plx-diagram' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const boxes = variant === 'boxes';
  const right = direction === 'right';
  const shapeOf = (n: any) => (boxes ? 'box' : SHAPES.indexOf(n.shape) >= 0 ? n.shape : 'process');
  const at: any = {}; nodes.forEach((n, i) => { at[n.id] = i; });
  const nb = React.useMemo(() => graphNeighbors(nodes, edges), [nodes, edges]);
  const outs = nodes.map((n) => edges.filter((e) => e.source === n.id && at[e.target] !== undefined));
  const ins = nodes.map((n) => edges.filter((e) => e.target === n.id && at[e.source] !== undefined));
  const nextText = (i: any) => (outs[i].length ? formatList(outs[i].map((e) => nodes[at[e.target]].label + (e.label ? ' (' + e.label + ')' : ''))) : t.end);
  const kindOf = (n: any) => t[shapeOf(n)];

  // the layout in diagram units: layers along the direction, the nodes of a layer side by side, centered
  const layout = React.useMemo(() => {
    const { rank, place } = graphLayers(nodes, edges);
    const cell = Object.keys(SIZE).reduce((m, k) => [Math.max(m[0], SIZE[k][0]), Math.max(m[1], SIZE[k][1])], [0, 0]);
    const along = right ? cell[0] + GAP_ALONG : cell[1] + GAP_ALONG, across = right ? cell[1] + GAP_ACROSS : cell[0] + GAP_ACROSS;
    const p = nodes.map((n, i) => (right ? { x: rank[i] * along, y: place[i] * across } : { x: place[i] * across, y: rank[i] * along }));
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    p.forEach((q, i) => { const s = SIZE[shapeOf(nodes[i])]; x0 = Math.min(x0, q.x - s[0] / 2); x1 = Math.max(x1, q.x + s[0] / 2); y0 = Math.min(y0, q.y - s[1] / 2); y1 = Math.max(y1, q.y + s[1] / 2); });
    const pad = groups && groups.length ? GROUP_PAD + GROUP_HEAD : 0;
    return { p: p.map((q) => ({ x: q.x - x0 + INSET + pad, y: q.y - y0 + INSET + pad })), width: x1 - x0 + (INSET + pad) * 2, height: y1 - y0 + (INSET + pad) * 2 };
  }, [nodes, edges, right, boxes, groups]);   // eslint-disable-line react-hooks/exhaustive-deps

  const gv = useGraphView({ enabled: interactive, strings });
  const fitted = React.useRef<any>({ key: '', k: 1, x: 0, y: 0 });
  const ia = useChartInteraction({
    rows: 1, columns: nodes.length, mode: 'point', select: typeof onSelect === 'function', strings: interactionStrings,
    onSelect: (cell) => onSelect && onSelect(Object.assign({ node: nodes[cell.c] }, cell)),
    describe: (cell) => { const n = nodes[cell.c]; return chartTooltipText({ title: n.label, items: [{ label: t.kind, value: kindOf(n) }, { label: t.next, value: nextText(cell.c) }] }); },
    // along the flow: the first next or previous shape; across: the nearest in the same direction
    move: (a, key) => {
      const fwd = right ? 'ArrowRight' : 'ArrowDown', back = right ? 'ArrowLeft' : 'ArrowUp';
      if (key === fwd && outs[a.c].length) return { r: 0, c: at[outs[a.c][0].target] };
      if (key === back && ins[a.c].length) return { r: 0, c: at[ins[a.c][0].source] };
      return directionalMove(layout.p, nb, a, key);
    },
  });
  const pos = (i: any) => { const v = gv.view, f = fitted.current; return { x: f.x + v.x + layout.p[i].x * f.k * v.k, y: f.y + v.y + layout.p[i].y * f.k * v.k }; };
  const hit = (px: any, py: any) => {
    let best = null;
    nodes.forEach((n, i) => { const c = pos(i), s = SIZE[shapeOf(n)], k = fitted.current.k * gv.view.k; if (Math.abs(px - c.x) <= (s[0] / 2) * k && Math.abs(py - c.y) <= (s[1] / 2) * k) best = i; });
    return best;
  };
  const iaz = gv.wrap(ia, (px: any, py: any) => hit(px, py) !== null);
  const table = {
    columns: [{ title: t.step, field: 's', kind: 'name', rowLabel: true }, { title: t.kind, field: 'k', kind: 'name' }].concat(groups ? [{ title: t.group, field: 'g', kind: 'name' }] : [], [{ title: t.next, field: 'n', kind: 'name' }]),
    data: nodes.map((n, i) => ({ id: i + 1, s: n.label + (n.detail ? ' (' + n.detail + ')' : ''), k: kindOf(n), g: groups ? ((groups.find((g) => g.id === n.group) || {}).label || '') : '', n: nextText(i) })),
  };

  const draw = ({ inner }: any) => {
    gv.size.current = inner;
    // its own size, smaller only to fit a narrow plot (the plot is as tall as the diagram: fitHeight), centered
    const k = Math.min(1, inner.width / layout.width);
    fitted.current = { k, x: (inner.width - layout.width * k) / 2, y: (inner.height - layout.height * k) / 2 };
    ia.register({ nearest: (px: any, py: any) => { const i = hit(px, py); return i === null ? null : { r: 0, c: i }; } });
    const P = layout.p;
    const a = ia.active ? ia.active.c : null, sel = ia.selected ? ia.selected.c : null;
    const near = (i: any) => a === null || i === a || nb[a].indexOf(i) >= 0;
    const half = (i: any) => SIZE[shapeOf(nodes[i])].map((v: any) => v / 2);
    const tip = a !== null ? pos(a) : null;
    const groupBoxes: any[] = (groups || []).map((g) => {
      const idx = nodes.map((n, i) => (n.group === g.id ? i : -1)).filter((i) => i >= 0); if (!idx.length) return null;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      idx.forEach((i) => { const hs = half(i); x0 = Math.min(x0, P[i].x - hs[0]); x1 = Math.max(x1, P[i].x + hs[0]); y0 = Math.min(y0, P[i].y - hs[1]); y1 = Math.max(y1, P[i].y + hs[1]); });
      return { g, x: x0 - GROUP_PAD, y: y0 - GROUP_PAD - GROUP_HEAD, w: x1 - x0 + GROUP_PAD * 2, h: y1 - y0 + GROUP_PAD * 2 + GROUP_HEAD };
    }).filter(Boolean);
    return (
      <g className="plx-diagram__plot">
        <defs>
          <marker id={uid + '-arrow'} viewBox="0 0 8 8" refX="8" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
            <path className="plx-diagram__arrow" d="M0,0L8,4L0,8Z" />
          </marker>
        </defs>
        <g transform={'translate(' + (fitted.current.x + gv.view.x) + ',' + (fitted.current.y + gv.view.y) + ') scale(' + k * gv.view.k + ')'}>
          {groupBoxes.map((b) => (
            <g key={b.g.id} className="plx-diagram__group">
              <rect className="plx-diagram__group-box" x={b.x} y={b.y} width={b.w} height={b.h} />
              <text className="plx-diagram__group-label" x={b.x + GROUP_PAD} y={b.y + GROUP_HEAD / 2 + GROUP_PAD / 2}>{b.g.label}</text>
            </g>
          ))}
          {edges.map((e, n) => {
            const i = at[e.source], j = at[e.target]; if (i === undefined || j === undefined) return null;
            const s = P[i], d = P[j], hs = half(i), hd = half(j);
            // an elbow connector: out of the source's far side, across at the middle, into the target's near side
            // a branch's label sits at the elbow on the target's side
            let path, lx, ly;
            if (right) { const sx = s.x + hs[0], tx = d.x - hd[0], mx = (sx + tx) / 2; path = 'M' + sx + ',' + s.y + 'H' + mx + 'V' + d.y + 'H' + tx; lx = mx; ly = d.y; }
            else { const sy = s.y + hs[1], ty = d.y - hd[1], my = (sy + ty) / 2; path = 'M' + s.x + ',' + sy + 'V' + my + 'H' + d.x + 'V' + ty; lx = d.x; ly = my; }
            const on = a !== null && (i === a || j === a);
            return (
              <g key={n} className={cx('plx-diagram__link', 'plx-chart-dim', a !== null && !on && 'plx-chart-dim--off')}>
                <path className={cx('plx-diagram__connector', on && 'plx-diagram__connector--active')} d={path} markerEnd={'url(#' + uid + '-arrow)'} />
                {e.label ? <text className="plx-diagram__connector-label" x={lx} y={ly}>{e.label}</text> : null}
              </g>
            );
          })}
          {nodes.map((n, i) => {
            const shape = shapeOf(n), s = SIZE[shape], o = outline(shape, s[0], s[1]);
            return (
              <g key={n.id} transform={'translate(' + P[i].x + ',' + P[i].y + ')'}
                className={cx('plx-diagram__node', 'plx-diagram__node--' + shape, 'plx-chart-dim', !near(i) && 'plx-chart-dim--off', a === i && 'plx-diagram__node--active', sel === i && 'plx-diagram__node--selected')}>
                {o ? <path className="plx-diagram__shape" d={o} /> : <rect className="plx-diagram__shape" x={-s[0] / 2} y={-s[1] / 2} width={s[0]} height={s[1]} />}
                <foreignObject x={-s[0] / 2} y={-s[1] / 2} width={s[0]} height={s[1]}>
                  <div className="plx-diagram__text">
                    <span className="plx-diagram__label">{n.label}</span>
                    {boxes && n.detail ? <span className="plx-diagram__detail">{n.detail}</span> : null}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </g>
        {tip ? <ChartTooltip x={tip.x + (tip.x > inner.width / 2 ? -1 : 1) * half(a)[0] * k * gv.view.k} y={tip.y} inner={inner} title={nodes[a as number].label}
          items={[{ label: t.kind, value: kindOf(nodes[a as number]) }, { label: t.next, value: nextText(a as number) }]} /> : null}
      </g>
    );
  };

  return (
    <ChartFrame clip title={title} dataView={dataView} description={description} size={size} margin={Object.assign({ top: 0, end: 0, bottom: 0, start: 0 }, margin)} table={table}
      interaction={interactive ? iaz : undefined} actions={interactive ? gv.actions : null} strings={frameStrings} fitHeight={(w) => layout.height * Math.min(1, w / layout.width)}
      className={cx('plx-diagram', 'plx-diagram--' + (boxes ? 'boxes' : 'flowchart'), !interactive && 'plx-diagram--read-only', className)}>
      {draw}
    </ChartFrame>
  );
}
