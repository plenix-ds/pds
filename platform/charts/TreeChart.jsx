/* Plenix · TreeChart
   Summary: A hierarchy as a tree (07 Data Display › Charts › Tree chart; owner, 2026-10-26, charts-tree-26): one root,
     its children and theirs, joined by curved lines, drawn left to right or top to bottom. Each branch folds away and
     opens again. Drawn by Apache ECharts' tree in ChartFrame, with the Plenix keyboard, live region and data grid.
   Usage:
     <TreeChart title="How the ministries report to the clergy" description="Education and worship report to the parish priest."
       data={{ id: 'parish', label: 'St. John the Beloved', detail: 'The parish', children: [
         { id: 'c1', label: 'Fr. Daniel Boulos', detail: 'Parish priest', children: [{ id: 'edu', label: 'Education', children: […] }] }] }} />
     <TreeChart orientation="top-to-bottom" title="…" data={root} defaultFolded={['c2']} />
   Props:
     title: the chart's name (required); description: its takeaway (ChartFrame)
     data: the root: { id, label, detail, children: [the same] } (id unique in the tree; detail an optional second line:
       a role, a count)
     orientation: "left-to-right" (default: the root at the start, the leaves at the end) | "top-to-bottom" (the root at
       the top, the leaves along the bottom, their labels turned to read upward)
     defaultFolded: ids of the branches folded at first; folded / onFoldedChange(ids): the parent keeps them
     interactive: keyboard, pointer and live region (default true)
     hideCaption, className: ChartFrame's
     strings: { name: "Name", detail: "Detail", parent: "Reports to", level: "Level", folded: "folded", open: "open" } and
       the interaction's words (interaction: { hint, hintSelect })
   Behavior:
     A click on a node with children folds its branch away, and again opens it; a folded node is a filled dot. The
       chart's height follows what is open: left to right, one row per leaf shown; top to bottom, one band per level.
     One Tab stop. Left to right: ↑ ↓ move to the node before and after, → opens a folded branch or steps into it, ←
       folds an open branch or steps back to its parent (mirrored in a right-to-left page); top to bottom: ← → move, ↓
       opens or steps in, ↑ folds or steps out. Home and End go to the first and last node shown; Enter or Space folds
       or opens. The node in focus takes the focus ring and a semibold name; under the pointer or in focus, the path up
       to the root stands out and the rest dims. The live region says each node ("Education, 4 ministries, open").
     Labels never collide: a name or detail longer than its room ends in an ellipsis (top to bottom, the leaves keep
       only their name when two lines do not fit). The data grid ("Show the data") lists every node with its detail,
       its parent and its level.
     The plot draws once the chart engine has loaded (the first chart on a page loads it); the caption and data grid
       show at once.
   Notes:
     For a few levels and up to a few dozen nodes; a large hierarchy belongs in a Tree (the list) or MillerColumns. The
       lines, the nodes, the focus ring and the fonts are --plx-comp-tree-chart-* tokens read by the ECharts theme
       (echarts/engine.js); ECharts' own tooltip is not used. No style is written here: ECharts writes only the sizes
       and fonts the page checks allow inside .plx-chart__engine (font weights from the font-weight tokens).
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { snapToGrid } from '../utils/grid.ts';
import { ChartFrame } from './ChartFrame.tsx';
import { useChartInteraction } from './interaction.ts';
import { useEChartsPlot, NO_MARGIN } from './echarts/EChartsPlot.tsx';
import { useStrings } from '../providers/LocaleProvider.tsx';

const INTERACTION = { hint: 'Use the arrow keys to move through the tree.', hintSelect: ' Enter folds or opens a branch.', selected: '{text}' };
const ORIENTATIONS = ['left-to-right', 'top-to-bottom'];
const NONE = Object.freeze([]);

// the tree as a list in reading order, each node with its parent and depth
function flatten(root) {
  const nodes = [], byId = new Map();
  (function walk(n, parent, depth) {
    if (!n) return;
    const id = n.id === undefined ? (parent ? parent.id + '/' + nodes.length : 'root') : String(n.id);
    const node = { id, label: n.label, detail: n.detail, parent, depth, children: [] };
    nodes.push(node); byId.set(id, node);
    if (parent) parent.children.push(node);
    (n.children || []).forEach((c) => walk(c, node, depth + 1));
  })(root, null, 0);
  return { nodes, byId };
}

// a canvas to measure label widths in the chart's own fonts (nothing is drawn with it)
let canvas = null;
const measure = (text, f) => {
  if (!text || typeof document === 'undefined') return 0;
  canvas = canvas || document.createElement('canvas');
  const c = canvas.getContext('2d');
  c.font = (f.fontWeight || 400) + ' ' + f.fontSize + 'px ' + f.fontFamily;
  return c.measureText(String(text)).width;
};
// a token in pixels, read where the page sets it (the chart's spacing for its height before the engine has drawn)
const tokenPx = (name) => {
  if (typeof document === 'undefined') return 0;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return /rem$/.test(v) ? parseFloat(v) * parseFloat(getComputedStyle(document.documentElement).fontSize) : parseFloat(v) || 0;
};

export function TreeChart({ title, description, hideCaption, data, orientation = 'left-to-right', defaultFolded = NONE, folded: foldedProp, onFoldedChange,
  interactive = true, strings, className }) {
  const t = useStrings('chart.treeChart', strings);
  const down = orientation === 'top-to-bottom';
  const { nodes, byId } = React.useMemo(() => flatten(data), [data]);
  const [own, setOwn] = React.useState(() => new Set(defaultFolded));
  const folded = foldedProp ? new Set(foldedProp) : own;
  const foldedRef = React.useRef(folded); foldedRef.current = folded;
  const setFolded = (next) => { foldedRef.current = next; if (!foldedProp) setOwn(next); if (onFoldedChange) onFoldedChange([...next]); };
  const toggle = (n) => {
    if (!n || !n.children.length) return;
    const next = new Set(foldedRef.current);
    if (next.has(n.id)) next.delete(n.id); else next.add(n.id);
    setFolded(next);
  };
  // the nodes shown, in reading order (a folded branch's children are not)
  const shown = React.useMemo(() => { const out = []; (function walk(n) { if (!n) return; out.push(n); if (!folded.has(n.id)) n.children.forEach(walk); })(nodes[0]); return out; },
    [nodes, [...folded].sort().join('|')]);
  const leafNodes = shown.filter((n) => !n.children.length || folded.has(n.id));
  // the engine's tree layout keeps one unit between two leaves of the same parent and two between cousins: the breadth
  // the leaves take is counted in those units, so each unit gets a whole leaf's room
  const units = leafNodes.reduce((u, n, i) => u + (i === 0 ? 0 : (n.parent === leafNodes[i - 1].parent ? 1 : 2)), 0);
  const depth = shown.reduce((d, n) => Math.max(d, n.depth), 0);

  const rtl = React.useRef(false);
  const say = (n) => (n ? [n.label, n.detail, n.children.length ? (foldedRef.current.has(n.id) ? t.folded : t.open) : null].filter(Boolean).join(', ') : '');
  const ia = useChartInteraction({
    rows: 1, columns: Math.max(1, shown.length), mode: 'point', select: true,
    strings: Object.assign({}, INTERACTION, strings && strings.interaction),
    first: () => ({ r: 0, c: 0 }),
    labelOf: (c) => (shown[c] ? shown[c].label : ''),
    describe: ({ c }) => say(shown[c]),
    onSelect: ({ c }) => toggle(shown[c]),
    // the arrow keys follow the orientation: along the reading order, into a branch, back out of it
    move: (cur, k) => {
      const n = shown[cur.c];
      if (!n) return cur;
      const across = down ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
      let into = down ? 'ArrowDown' : (rtl.current ? 'ArrowLeft' : 'ArrowRight'), out = down ? 'ArrowUp' : (rtl.current ? 'ArrowRight' : 'ArrowLeft');
      if (down && rtl.current) { across.reverse(); }
      if (k === 'Home') return { r: 0, c: 0 };
      if (k === 'End') return { r: 0, c: shown.length - 1 };
      if (k === across[0]) return { r: 0, c: Math.max(0, cur.c - 1) };
      if (k === across[1]) return { r: 0, c: Math.min(shown.length - 1, cur.c + 1) };
      if (k === into && n.children.length) {
        if (foldedRef.current.has(n.id)) { toggle(n); return cur; }
        return { r: 0, c: shown.indexOf(n.children[0]) };
      }
      if (k === out) {
        if (n.children.length && !foldedRef.current.has(n.id)) { toggle(n); return cur; }
        if (n.parent) return { r: 0, c: shown.indexOf(n.parent) };
      }
      return cur;
    },
  });
  const active = ia.active && shown[ia.active.c] ? shown[ia.active.c] : null;
  const focusId = active && ia.focused && ia.source === 'keyboard' ? active.id : null;

  // the height follows what is open: a row per leaf (left to right) or a band per level and the turned leaf labels
  const fitHeight = (width) => {
    const leaf = tokenPx('--plx-comp-tree-chart-leaf-spacing') || 40, level = tokenPx('--plx-comp-tree-chart-level-spacing') || 80;
    if (!down) return snapToGrid(Math.max(1, units) * leaf + leaf, { round: 'up' });
    const room = Math.min(width * 0.4, level * 2);
    return snapToGrid(level * (depth + 0.5) + room, { round: 'up' });
  };

  // where each node shown is drawn (from the engine's layout), for the pointer and the label rooms; top to bottom, a
  // change of layout draws the labels again within their new rooms
  const positions = React.useRef(new Map()), index = React.useRef(new Map());
  const [layout, setLayout] = React.useState('');
  const plot = useEChartsPlot();
  const key = shown.map((n) => n.id + (folded.has(n.id) ? '+' : '')).join('|');
  const option = React.useCallback((tk, dims) => {
    const T = tk.tree, gap = T.gap, line = (f) => f.fontSize + 4;
    rtl.current = tk.rtl;
    const W = dims.width, H = dims.height;
    const ellipsis = (f, w) => ({ width: Math.max(gap, Math.floor(w)), overflow: 'truncate', ellipsis: '…' });
    const fits = (n, f) => Math.max(measure(n.label, f), measure(n.detail, T.detail)) + gap;
    let box, labelFor;
    if (!down) {
      // the root's label before it, the leaves' after them, the others above their node; each label within its room
      const rootW = Math.min(fits(nodes[0], T.nameFocus), W * 0.25);
      const leafW = Math.min(leafNodes.reduce((m, n) => Math.max(m, fits(n, T.nameFocus)), 0), W * 0.35);
      // the root's room on its side, the leaves' on theirs: in right to left the root is at the right (#413 batch 4)
      const rootRoom = snapToGrid(rootW + gap * 2, { round: 'up' }), leafRoom = snapToGrid(leafW + gap * 2, { round: 'up' });
      box = { left: tk.rtl ? leafRoom : rootRoom, right: tk.rtl ? rootRoom : leafRoom, top: snapToGrid(T.leaf / 2, { round: 'up' }), bottom: snapToGrid(T.leaf / 2, { round: 'up' }) };
      const step = depth ? (W - box.left - box.right) / depth : W;
      labelFor = (n, leafish) => (n.depth === 0 ? Object.assign({ position: tk.rtl ? 'right' : 'left', align: tk.rtl ? 'left' : 'right', verticalAlign: 'middle' }, ellipsis(T.name, rootW))
        : leafish ? Object.assign({ position: tk.rtl ? 'left' : 'right', align: tk.rtl ? 'right' : 'left', verticalAlign: 'middle' }, ellipsis(T.name, leafW))
        : Object.assign({ position: 'top', align: 'center', verticalAlign: 'bottom' }, ellipsis(T.name, step - gap * 2)));
    } else {
      // the root's label above it; the others beside their node, within the room to the next node; the leaves' turned
      // under them, the detail only when two lines fit across a leaf's room
      const leafRoom = (W - gap * 2) / Math.max(1, units);
      const twoLines = leafRoom >= line(T.name) + line(T.detail);
      const turned = Math.min(H - T.level * (depth + 0.5), W * 0.4);
      // the reading side's margin leaves the last branch at each level room for its label (at most 15% of the width)
      const branchW = Math.min(shown.filter((n) => n.depth > 0 && n.children.length && !folded.has(n.id)).reduce((m, n) => Math.max(m, fits(n, T.nameFocus)), 0), W * 0.15);
      const endMargin = snapToGrid(Math.max(gap, branchW), { round: 'up' });
      box = { left: snapToGrid(tk.rtl ? endMargin : gap, { round: 'up' }), right: snapToGrid(tk.rtl ? gap : endMargin, { round: 'up' }), top: snapToGrid(line(T.name) * 2 + gap, { round: 'up' }), bottom: snapToGrid(Math.max(gap, turned), { round: 'up' }) };
      labelFor = (n, leafish, room) => (n.depth === 0 ? Object.assign({ position: 'top', align: 'center', verticalAlign: 'bottom' }, ellipsis(T.name, W - gap * 2))
        : leafish ? Object.assign({ position: 'bottom', rotate: 90, align: 'right', verticalAlign: 'middle', twoLines }, ellipsis(T.name, turned - gap))
        : Object.assign(room.end ? { position: 'right', align: 'left' } : { position: 'left', align: 'right' }, { verticalAlign: 'middle' }, ellipsis(T.name, room.width)));
    }
    // top to bottom, a branch label's room: the distance to the next node at its level on its reading side (the plot's
    // edge for the last one), read from the last drawing
    const roomOf = (n) => {
      const pos = positions.current, me = pos.get(n.id);
      if (!me) return { end: !tk.rtl, width: W / 4 };
      let next = tk.rtl ? gap : W - gap;
      pos.forEach((p, id) => { const o = byId.get(id); if (o && o.depth === n.depth && id !== n.id && (tk.rtl ? p[0] < me[0] : p[0] > me[0])) next = tk.rtl ? Math.max(next, p[0]) : Math.min(next, p[0]); });
      return { end: !tk.rtl, width: Math.max(gap, Math.abs(next - me[0]) - gap * 3) };
    };
    const item = (n) => {
      const isFolded = folded.has(n.id), leafish = !n.children.length || isFolded, focus = n.id === focusId;
      const lab = labelFor(n, leafish, down ? roomOf(n) : null);
      const both = !(down && leafish && n.depth > 0 && !lab.twoLines) && n.detail;
      delete lab.twoLines;
      return {
        name: n.label, value: n.detail || '', plxId: n.id, collapsed: isFolded,
        symbolSize: T.node.r * 2,
        itemStyle: { color: n.children.length && isFolded ? T.folded : T.node.fill, borderColor: focus ? T.focus.color : T.node.color, borderWidth: focus ? T.focus.width : T.node.width },
        label: Object.assign(lab, {
          formatter: (p) => '{n|' + p.name + '}' + (both ? '\n{d|' + p.value + '}' : ''),
          rich: {
            n: { color: T.name.color, fontFamily: T.name.fontFamily, fontSize: T.name.fontSize, fontWeight: focus ? T.nameFocus.fontWeight : T.name.fontWeight, lineHeight: line(T.name) },
            d: { color: T.detail.color, fontFamily: T.detail.fontFamily, fontSize: T.detail.fontSize, fontWeight: T.detail.fontWeight, lineHeight: line(T.detail) },
          },
        }),
        children: n.children.map(item),
      };
    };
    return {
      animationDuration: tk.motion, animationDurationUpdate: tk.motion,
      series: [{
        type: 'tree', id: 'tree', data: [item(nodes[0])], orient: down ? 'TB' : (tk.rtl ? 'RL' : 'LR'),
        left: box.left, right: box.right, top: box.top, bottom: box.bottom,
        symbol: 'circle', expandAndCollapse: false, roam: false, initialTreeDepth: -1, edgeShape: 'curve',
        lineStyle: { color: T.link.color, width: T.link.width, curveness: 0.5 },
        label: { distance: gap, color: T.name.color, fontFamily: T.name.fontFamily, fontSize: T.name.fontSize },
        emphasis: { focus: 'ancestor', lineStyle: { width: T.link.width * 2 } },
        blur: { itemStyle: { opacity: tk.dim }, lineStyle: { opacity: tk.dim }, label: { opacity: tk.dim } },
      }],
    };
  }, [key, down, focusId, layout]);

  React.useEffect(() => {
    const c = plot.chart;
    if (!c) return;
    const s = c.getModel().getSeriesByIndex(0);
    if (!s) return;
    const d = s.getData(), tree = d.tree, box = s.layoutInfo || { x: 0, y: 0 };
    const pos = new Map(), idx = new Map();
    tree.eachNode((node) => {
      const id = node.getModel().get('plxId'), l = node.getLayout();
      idx.set(id, node.dataIndex);
      if (l && shown.some((n) => n.id === id)) pos.set(id, [box.x + l.x, box.y + l.y]);
    });
    positions.current = pos; index.current = idx;
    const k = [...pos].map(([id, p]) => id + ':' + Math.round(p[0]) + ',' + Math.round(p[1])).join('|');
    if (down && k !== layout) setLayout(k);
  });

  // the path to the root of the node under the pointer or in focus stands out (the engine's ancestor emphasis)
  const activeId = active ? active.id : '';
  React.useEffect(() => {
    const c = plot.chart;
    if (!c) return;
    c.dispatchAction({ type: 'downplay', seriesIndex: 0 });
    if (activeId && index.current.has(activeId)) c.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: index.current.get(activeId) });
  }, [activeId, plot.chart, key]);

  const table = {
    columns: [{ title: t.name, field: 'name', kind: 'name', rowLabel: true }, { title: t.detail, field: 'detail' }, { title: t.parent, field: 'parent' }, { title: t.level, field: 'level', kind: 'data', align: 'right' }],
    data: nodes.map((n, i) => ({ id: i + 1, name: n.label, detail: n.detail || '', parent: n.parent ? n.parent.label : '', level: String(n.depth + 1) })),
  };

  const draw = (dims) => {
    const layer = plot.layer(dims, option);
    ia.register({
      nearest: (px, py) => {
        let best = null, bd = Infinity;
        positions.current.forEach((p, id) => { const dd = Math.hypot(p[0] - px, p[1] - py); if (dd < bd) { bd = dd; best = id; } });
        const reach = Math.max(16, (plot.tokens ? plot.tokens.tree.gap : 8) * 2);
        return best !== null && bd <= reach ? { r: 0, c: shown.findIndex((n) => n.id === best) } : null;
      },
    });
    return layer;
  };

  return (
    <ChartFrame title={title} description={description} hideCaption={hideCaption} margin={NO_MARGIN} table={table} fitHeight={fitHeight}
      interaction={interactive ? ia : undefined} strings={strings} className={cx('plx-tree-chart', 'plx-tree-chart--' + (ORIENTATIONS.indexOf(orientation) >= 0 ? orientation : 'left-to-right'), className)}>
      {draw}
    </ChartFrame>
  );
}
