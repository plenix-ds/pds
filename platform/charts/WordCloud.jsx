/* Plenix · WordCloud
   Summary: A word cloud (07 Data Display › Charts › Word cloud): the main terms of a body of text, each sized by how
     often it appears (five steps of the type scale) and placed around the middle, the largest first: on a round spiral
     (spiral) or a square one (rectangular). Words stay horizontal; groups (a topic, a sentiment) take the categorical
     data-viz colors with a legend. A first impression only: the table under it lists every term and its count, sorted.
   Usage:
     <WordCloud title="What people asked for" description="Search and sharing lead the feedback." words={[{ text: 'search',
       value: 48 }, { text: 'sharing', value: 41 }, …]} valueLabel="Mentions" onSelect={({ word }) => filterBy(word.text)} />
     <WordCloud … layout="rectangular" groups={[{ id: 'praise', label: 'Praise' }, { id: 'issue', label: 'Issues' }]} />
   Props:
     title, description: the chart's name and its takeaway (ChartFrame) (title required)
     words: the terms: [{ text, value, group }]; group is the id of one of groups
     layout: "spiral" (default: round, the largest word in the middle) | "rectangular" (a square spiral: a boxier cloud
       that fills a wide plot)
     groups: [{ id, label }]: the groups words belong to, in the legend's order (their colors follow it)
     max: the most words drawn (default 50, the largest); the table keeps them all
     valueLabel: what a value is ("Mentions") (default strings.value); format: (value) => text (default formatNumber)
     size, margin: as ChartFrame
     interactive: keyboard, pointer, tooltip and live region (default true); onSelect({ c, word }): a click or Enter on a
       word (filter a list by it)
     strings: { value: "Count", word: "Term", group: "Group" }
     className: more classes on the figure
   Behavior:
     The words are measured in their own type (after the fonts load) and placed without overlapping; a word that does
       not fit in the plot is left out of the picture (it stays in the table).
     One Tab stop: ← → ↑ ↓ move to the nearest word in that direction, Home and End to the largest and the smallest; each
       says "<word>: <count>" in the live region and shows it in the tooltip; the other words step back.
   Notes:
     Sizes are the --plx-comp-word-cloud-size-1 … 5 tokens (the type scale); words without a group take the content
       color, grouped words the categorical data-viz colors. Never use it to compare values exactly: a sorted bar chart.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.tsx';
import { seriesColor } from './scales.ts';
import { ChartLegend } from './parts/ChartLegend.tsx';
import { ChartTooltip, chartTooltipText } from './parts/ChartTooltip.tsx';
import { useChartInteraction } from './interaction.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';

const STEPS = 5;
// the space kept around each word while placing, and the spiral's step (SVG geometry, pixels)
const PAD = 4, STEP = 4;

// where each word goes: centers of non-overlapping boxes around the middle, the largest first; null when it does not fit
export function wordCloudLayout(boxes, width, height, layout = 'spiral') {
  const placed = [], out = [];
  const hit = (b) => placed.some((p) => b.x0 < p.x1 && b.x1 > p.x0 && b.y0 < p.y1 && b.y1 > p.y0);
  const ratio = width / Math.max(1, height);
  // the candidate offsets from the middle, nearest first: an Archimedean spiral, or the rings of a square spiral; both
  // stretched to the plot's shape
  const reach = Math.max(width / ratio, height) / 2 + STEP * 2;
  const candidates = [];
  if (layout === 'rectangular') {
    candidates.push([0, 0]);
    for (let r = STEP; r <= reach; r += STEP) {
      for (let a = -r; a < r; a += STEP) candidates.push([a, -r]);
      for (let a = -r; a < r; a += STEP) candidates.push([r, a]);
      for (let a = r; a > -r; a -= STEP) candidates.push([a, r]);
      for (let a = r; a > -r; a -= STEP) candidates.push([-r, a]);
    }
  } else {
    for (let i = 0, d = 0; d <= reach; i++) { const th = i * 0.1; d = (STEP * th) / (2 * Math.PI) * 2; candidates.push([d * Math.cos(th), d * Math.sin(th)]); }
  }
  boxes.forEach((s) => {
    const w = s.width + PAD, h = s.height + PAD;
    let spot = null;
    for (let i = 0; i < candidates.length && !spot; i++) {
      const cx0 = width / 2 + candidates[i][0] * ratio, cy0 = height / 2 + candidates[i][1];
      const b = { x0: cx0 - w / 2, x1: cx0 + w / 2, y0: cy0 - h / 2, y1: cy0 + h / 2 };
      if (b.x0 < 0 || b.y0 < 0 || b.x1 > width || b.y1 > height) continue;
      if (!hit(b)) spot = b;
    }
    if (spot) { placed.push(spot); out.push({ x: (spot.x0 + spot.x1) / 2, y: (spot.y0 + spot.y1) / 2 }); } else out.push(null);
  });
  return out;
}

export function WordCloud({ title, description, words = [], layout = 'spiral', groups, max = 50, valueLabel, format, size = 'md', margin, interactive = true, onSelect,
  strings, frameStrings, interactionStrings, className }) {
  const t = useStrings('chart.wordCloud', strings);
  const fmt = typeof format === 'function' ? format : (v) => formatNumber(v);
  const vLabel = valueLabel || t.value;
  const sorted = words.filter((w) => w && w.text).slice().sort((a, b) => b.value - a.value);
  const shown = sorted.slice(0, Math.max(0, max));
  const vals = shown.map((w) => w.value);
  const lo = vals.length ? Math.min.apply(null, vals) : 0, hi = vals.length ? Math.max.apply(null, vals) : 1;
  // the size step: the square root of the value's place in the range, so the largest words do not crowd the rest
  const stepOf = (v) => (hi === lo ? 3 : Math.min(STEPS, 1 + Math.floor(Math.sqrt((v - lo) / (hi - lo)) * STEPS)));
  const gIndex = (g) => (groups || []).findIndex((x) => x.id === g);
  const colorOf = (w) => (w.group !== undefined && gIndex(w.group) >= 0 ? seriesColor(gIndex(w.group)) : undefined);
  const layer = React.useRef(null);
  const where = React.useRef([]);
  const [boxes, setBoxes] = React.useState({ key: '', list: [] });
  const [fonts, setFonts] = React.useState(0);
  const key = shown.map((w) => w.text + ':' + stepOf(w.value)).join('|') + '#' + fonts;
  React.useEffect(() => { if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) document.fonts.ready.then(() => setFonts(1)); }, []);
  React.useLayoutEffect(() => {
    if (!layer.current || boxes.key === key) return;
    const list = Array.from(layer.current.querySelectorAll('.plx-word-cloud__word--measure')).map((el) => { const b = el.getBBox(); return { width: b.width, height: b.height }; });
    if (list.length === shown.length) setBoxes({ key, list });
  });

  const ia = useChartInteraction({
    rows: 1, columns: shown.length, mode: 'point', select: typeof onSelect === 'function', strings: interactionStrings,
    onSelect: (cell) => onSelect && onSelect(Object.assign({ word: shown[cell.c] }, cell)),
    describe: (cell) => chartTooltipText({ title: shown[cell.c].text, items: [{ label: vLabel, value: fmt(shown[cell.c].value) }] }),
    // the nearest placed word in the arrow's direction; Home the largest, End the smallest
    move: (a, k) => {
      const at = where.current;
      if (k === 'Home' || k === 'End') { const idx = at.map((p, i) => (p ? i : -1)).filter((i) => i >= 0); return idx.length ? { r: 0, c: k === 'Home' ? idx[0] : idx[idx.length - 1] } : a; }
      const p = at[a.c]; if (!p) return a;
      const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k];
      let best = null, bd = Infinity;
      at.forEach((q, i) => {
        if (!q || i === a.c) return;
        const dx = q.x - p.x, dy = q.y - p.y, along = dx * d[0] + dy * d[1];
        if (along <= 0) return;
        const dist = along + 2 * Math.abs(dx * d[1] + dy * d[0]);
        if (dist < bd) { bd = dist; best = i; }
      });
      return best === null ? a : { r: 0, c: best };
    },
    first: () => { const i = where.current.findIndex((p) => !!p); return i >= 0 ? { r: 0, c: i } : null; },
  });

  const table = {
    columns: [{ title: t.word, field: 'w', kind: 'name', rowLabel: true }].concat(groups ? [{ title: t.group, field: 'g', kind: 'name' }] : [], [{ title: vLabel, field: 'v', kind: 'data', align: 'right' }]),
    data: sorted.map((w, i) => ({ id: i + 1, w: w.text, g: groups && gIndex(w.group) >= 0 ? groups[gIndex(w.group)].label : '', v: fmt(w.value) })),
  };
  const legendNode = groups && groups.length ? <ChartLegend items={groups.map((g, i) => ({ id: g.id, label: g.label, color: seriesColor(i) }))} /> : null;

  const draw = ({ inner }) => {
    const ready = boxes.key === key && boxes.list.length === shown.length;
    const at = ready ? wordCloudLayout(boxes.list, inner.width, inner.height, layout === 'rectangular' ? 'rectangular' : 'spiral') : [];
    where.current = at;
    ia.register({
      nearest: (px, py) => {
        let best = null;
        at.forEach((p, i) => { if (p && boxes.list[i] && Math.abs(px - p.x) <= boxes.list[i].width / 2 && Math.abs(py - p.y) <= boxes.list[i].height / 2) best = i; });
        return best === null ? null : { r: 0, c: best };
      },
    });
    const a = ia.active && at[ia.active.c] ? ia.active : null, sel = ia.selected;
    return (
      <g ref={layer} className="plx-word-cloud__plot">
        {!ready ? shown.map((w, i) => <text key={'m' + i} className={cx('plx-word-cloud__word', 'plx-word-cloud__word--measure', 'plx-word-cloud__word--' + stepOf(w.value))} x={0} y={0}>{w.text}</text>) : null}
        {ready ? shown.map((w, i) => (at[i] ? (
          <text key={i} className={cx('plx-word-cloud__word', 'plx-word-cloud__word--' + stepOf(w.value), 'plx-chart-dim', a && a.c !== i && 'plx-chart-dim--off', a && a.c === i && 'plx-word-cloud__word--active', sel && sel.c === i && 'plx-word-cloud__word--selected')}
            data-plx-dataviz={colorOf(w)} x={at[i].x} y={at[i].y}>{w.text}</text>
        ) : null)) : null}
        {a ? <ChartTooltip x={at[a.c].x + (at[a.c].x > inner.width / 2 ? -1 : 1) * boxes.list[a.c].width / 2} y={at[a.c].y} inner={inner} title={shown[a.c].text} items={[{ label: vLabel, value: fmt(shown[a.c].value), color: colorOf(shown[a.c]) }]} /> : null}
      </g>
    );
  };

  return (
    <ChartFrame title={title} description={description} size={size} margin={Object.assign({ top: 8, end: 8, bottom: 8, start: 8 }, margin)} table={table} legend={legendNode}
      interaction={interactive ? ia : undefined} strings={frameStrings}
      className={cx('plx-word-cloud', 'plx-word-cloud--' + (layout === 'rectangular' ? 'rectangular' : 'spiral'), className)}>
      {draw}
    </ChartFrame>
  );
}
