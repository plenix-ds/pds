/* Plenix · TimelineChart
   Summary: When things happened and how long they lasted, on one time axis (07 Data Display › Specialized displays ›
     Timeline visualization): events as points at their date, periods as bars from their start to their end, on one
     track or on several lanes (one per asset, team or category), each with its short name, under a time axis on
     calendar steps and an optional today line. Drawn in ChartFrame with a tooltip and the data grid.
   Usage:
     <TimelineChart title="Campaign assets" description="The video ran past its review; the banners shipped early."
       lanes={[{ id: 'video', label: 'Video' }, { id: 'banners', label: 'Banners' }]}
       items={[{ id: 1, lane: 'video', label: 'Shoot', start: '2026-09-01', end: '2026-09-12' },
               { id: 2, lane: 'video', label: 'Approved', start: '2026-09-30' },
               { id: 3, lane: 'banners', label: 'Design', start: '2026-09-05', end: '2026-09-19' }]} today />
   Props:
     title: the chart's name (required); description: its takeaway (ChartFrame)
     items: [{ id, lane, label, start, end, color }]: an item with an end is a period (a bar), without one an event (a
       point); start and end are Dates or anything Date accepts (a date-only string, "2026-09-10", is that day in local
       time); color an optional data-viz step (default the lane's)
     lanes: [{ id, label }]: the tracks, top to bottom (default one track); each lane takes the next categorical color
     domain: [from, to]: the time span shown (default the items' span on calendar steps)
     today: true (now) or a date: a reference line labeled strings.today
     labels: writes each item's name above its mark (default true)
     formatDate: (date) => text for the tooltip and the table (default formatDate, with the year when it is not this year)
     tooltip: shows the item under the pointer: its name, its date or its dates and length (default true)
     size, margin, hideCaption, className, legend, legendPosition: ChartFrame's
     strings: { item: "Item", lane: "Lane", start: "Start", end: "End", today: "Today", date: "Date", dates: "Dates" } and
       ChartFrame's strings
   Behavior:
     Lanes share the time axis; their names are the start axis. Items keep the data's order inside a lane; names that
       would overlap are better kept short (a noun phrase) or left to the tooltip (labels={false}).
     Hover an item: the tooltip gives its name and full dates. The data grid lists every item, its lane and dates.
   Notes:
     Bars and points are the frame's marks and points in their lane's data-viz color; names are UI text with a halo
       (timeline-chart tokens); the today line is a ReferenceLine. For tasks with dependencies use a Gantt chart; for a
       short activity log, the Timeline list.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatDate as fmtDate } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.tsx';
import { scaleBand, scaleTime, seriesColor, wholeDays } from './scales.ts';
import { Axis } from './parts/Axis.tsx';
import { GridLines } from './parts/GridLines.tsx';
import { ChartTooltip } from './parts/ChartTooltip.tsx';
import { ReferenceLine } from './parts/ReferenceLine.tsx';
import { useChartHover, labelRoom, halfRoom } from './chart-kit.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';

const MARK = 0.4;   // a period's bar thickness, a share of its lane
// a date-only string (2026-09-10) is that day in local time, as people read it; anything else as Date reads it
const toTime = (v) => { if (v instanceof Date) return v.getTime(); const d = typeof v === 'string' && /^(\d{4})-(\d{2})-(\d{2})$/.exec(v); return d ? new Date(+d[1], +d[2] - 1, +d[3]).getTime() : new Date(v).getTime(); };

export function TimelineChart({ title, description, hideCaption, size, items = [], lanes, domain, today, labels = true, formatDate, tooltip = true,
  legend, legendPosition, margin, strings, className }) {
  const t = useStrings('chart.timelineChart', strings);
  const fd = (d) => (typeof formatDate === 'function' ? formatDate(new Date(toTime(d))) : fmtDate(new Date(toTime(d))));
  const [active, hover] = useChartHover();
  const tracks = lanes && lanes.length ? lanes.map((l, i) => ({ id: l.id === undefined ? String(i) : l.id, label: l.label, color: l.color || seriesColor(i) }))
    : [{ id: '__one', label: '', color: seriesColor(0) }];
  const one = !(lanes && lanes.length);
  const laneOf = {};
  tracks.forEach((l) => { laneOf[l.id] = l; });
  const list = items.map((it, i) => Object.assign({}, it, { id: it.id === undefined ? String(i) : it.id, lane: one ? '__one' : it.lane, t0: toTime(it.start), t1: it.end === undefined || it.end === null ? null : toTime(it.end) }))
    .filter((it) => isFinite(it.t0) && laneOf[it.lane]);
  const now = today === true ? Date.now() : today ? toTime(today) : null;
  let lo = Infinity, hi = -Infinity;
  list.forEach((it) => { lo = Math.min(lo, it.t0); hi = Math.max(hi, it.t1 === null ? it.t0 : it.t1); });
  if (now !== null && isFinite(lo)) { lo = Math.min(lo, now); hi = Math.max(hi, now); }
  const dom = domain ? [toTime(domain[0]), toTime(domain[1])] : isFinite(lo) ? [lo, hi] : [Date.now() - 864e5 * 15, Date.now() + 864e5 * 15];
  const m = Object.assign({ end: halfRoom('00000000') }, one ? { start: halfRoom('00000000') } : { start: labelRoom(tracks.map((l) => l.label)) }, margin);
  const table = {
    columns: [{ title: t.item, field: 'item', kind: 'name', rowLabel: true }].concat(one ? [] : [{ title: t.lane, field: 'lane', kind: 'name' }])
      .concat([{ title: t.start, field: 'start', kind: 'data' }, { title: t.end, field: 'end', kind: 'data' }]),
    data: list.map((it, i) => ({ id: i + 1, item: it.label, lane: laneOf[it.lane].label, start: fd(it.t0), end: it.t1 === null ? '' : fd(it.t1) }))
  };
  return (
    <ChartFrame title={title} description={description} hideCaption={hideCaption} size={size} margin={m} legend={legend} legendPosition={legendPosition}
      table={table} strings={strings} className={cx('plx-timeline-chart', one && 'plx-timeline-chart--single', className)}>
      {({ inner, margin: fm }) => {
        // items dated by day get day ticks or coarser, never hours (issue 593); today's marker does not count
        const x = scaleTime({ domain: dom, range: [0, inner.width], nice: !domain, unit: wholeDays(list.map((it) => it.t0).concat(list.filter((it) => it.t1 !== null).map((it) => it.t1))) ? 'day' : undefined });
        const y = scaleBand({ domain: tracks.map((l) => l.id), range: [0, inner.height], paddingInner: 0, paddingOuter: 0 });
        const thick = y.bandwidth();
        // a mark sits in the lower part of its lane; its name above it
        const markY = (lane) => y(lane) + thick * (1 - MARK) * 0.75;
        const bar = thick * MARK;
        let tip = null;
        if (tooltip && active !== null) {
          const it = list.filter((i) => String(i.id) === String(active))[0];
          if (it) {
            const lane = laneOf[it.lane];
            tip = <ChartTooltip x={it.t1 === null ? x(it.t0) : (x(it.t0) + x(it.t1)) / 2} y={markY(it.lane)} inner={inner} title={it.label}
              items={[{ label: one ? (it.t1 === null ? t.date : t.dates) : lane.label, value: it.t1 === null ? fd(it.t0) : fd(it.t0) + ' – ' + fd(it.t1), color: it.color || lane.color }]} />;
          }
        }
        return (
          <g>
            <GridLines scale={x} direction="vertical" inner={inner} />
            {tracks.slice(1).map((l) => <line key={l.id} className="plx-chart__grid-line plx-timeline-chart__lane-line" x1={0} x2={inner.width} y1={y(l.id)} y2={y(l.id)} />)}
            {list.map((it) => {
              const color = it.color || laneOf[it.lane].color, top = markY(it.lane);
              const h = tooltip ? hover(String(it.id)) : {};
              return it.t1 === null
                ? <circle key={it.id} className="plx-chart__point plx-timeline-chart__event" data-plx-dataviz={color} cx={x(it.t0)} cy={top + bar / 2} {...h} />
                : <rect key={it.id} className="plx-chart__mark plx-timeline-chart__range" data-plx-dataviz={color} x={x(it.t0)} y={top} width={Math.max(0, x(it.t1) - x(it.t0))} height={bar} {...h} />;
            })}
            {labels ? list.map((it) => <text key={'l' + it.id} className={cx('plx-timeline-chart__label', it.t1 === null && 'plx-timeline-chart__label--event')} x={x(it.t0)} y={markY(it.lane)}>{it.label}</text>) : null}
            {now !== null ? <ReferenceLine axis="x" scale={x} value={new Date(now)} inner={inner} label={t.today} showValue={false} /> : null}
            <Axis scale={x} orient="bottom" inner={inner} margin={fm} />
            {one ? null : <Axis scale={y} orient="left" inner={inner} margin={fm} line={false} format={(id) => laneOf[id].label} />}
            {tip}
          </g>
        );
      }}
    </ChartFrame>
  );
}
