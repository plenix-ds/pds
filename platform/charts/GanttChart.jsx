/* Plenix · GanttChart
   Summary: A schedule on a time axis (07 Data Display › Charts › Gantt chart): one row per task with a bar from its start
     to its end (the part not done yet textured), diamonds for milestones, arrows from a task to the tasks that wait for it,
     and a line at today.
   Usage:
     <GanttChart title="Brand refresh schedule" description="The launch waits on the asset review, due September 26."
       tasks={[
         { id: 'brief', label: 'Brief', start: '2026-09-01', end: '2026-09-04', progress: 1 },
         { id: 'design', label: 'Design', start: '2026-09-04', end: '2026-09-18', progress: 0.6, dependsOn: ['brief'] },
         { id: 'launch', label: 'Launch', start: '2026-09-30', milestone: true, dependsOn: ['design'] }]} today={new Date(2026, 8, 15)} />
   Props:
     title: the chart's name (required); description: its takeaway (what is late, what waits on what)
     tasks: the rows, in order: [{ id, label, start, end, progress, dependsOn, milestone, status }] (required); start and
       end are dates (Date or anything Date accepts); progress 0 to 1; dependsOn the ids of the tasks it waits for
       (finish to start); milestone a single date (start); status a word ("Late", "Done") for the table and the tooltip
     today: a date for the today line, or true for the current date (default none)
     range: [start, end] of the time axis (default the tasks' span, widened to whole calendar steps)
     color: the data-viz step of the bars and milestones ("categorical-1" by default)
     size: the plot's height, as ChartFrame ("sm" | "md" | "lg" default: about ten tasks)
     strings: the words it says: { task: "Task", start: "Start", end: "End", progress: "Done", dependsOn: "Waits for",
       status: "Status", today: "Today", milestone: "Milestone", hint } (hint: the chart interaction's)
     className: more classes on the figure
   Behavior:
     Bars run from start to end on the time axis; the part not done yet carries a texture (ChartPatterns), so progress shows
       without a second color, and the share done is written after the bar. A milestone is a diamond at its date.
     A dependency is an arrow out of the task waited for, near its end, down (or up) to the row of the task that waits and
       across to its start.
     Keyboard: one Tab stop; the arrow keys move through the tasks, each spoken with its dates, progress and what it waits
       for; the pointer over a row does the same. The active task gets a ring and the tooltip.
     The frame's "Show the data" table lists every task with its start, end, progress, status and dependencies.
   Notes:
     Read-only: moving and resizing bars is an editor's job, with keyboard alternatives. Built on ChartFrame, the chart parts
       (Axis, GridLines, ReferenceLine, ChartTooltip) and the chart-a11y helpers. Status is never told by color alone: say it
       in words (status).
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatDate, formatPercent, formatList, parseDate } from '../utils/format.ts';
import { ChartFrame } from './ChartFrame.jsx';
import { scaleTime, scaleBand, seriesColor, wholeDays } from './scales.js';
import { Axis } from './parts/Axis.tsx';
import { GridLines } from './parts/GridLines.tsx';
import { ReferenceLine } from './parts/ReferenceLine.tsx';
import { ChartTooltip } from './parts/ChartTooltip.tsx';
import { DataLabel } from './parts/DataLabel.tsx';
import { scalePosition } from './parts/position.ts';
import { useChartPoints, ChartPatterns, patternFill } from './a11y.js';
import { useStrings } from '../providers/LocaleProvider.tsx';

// SVG geometry on the 4px grid: a milestone's half width, how far before a task's end its arrow leaves it, the arrowhead's
// length, the active ring's room, the task name's distance from the plot
const DIAMOND = 8, ELBOW = 8, HEAD = 4, RING = 4, NAME_GAP = 8;
// the shared reader (utils/format.ts parseDate): a date-only "YYYY-MM-DD" is that calendar day where the reader is (issue 342)
const toDate = (v) => parseDate(v) || new Date(NaN);

export function GanttChart({ title, description, tasks = [], today, range, color, size = 'lg', strings, className }) {
  const t = useStrings('chart.ganttChart', strings);
  const uid = 'plx-gantt' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const rows = tasks.map((k, i) => {
    const start = toDate(k.start), end = k.milestone ? start : toDate(k.end === undefined ? k.start : k.end);
    return { key: k.id === undefined ? String(i) : String(k.id), label: String(k.label), start, end, milestone: !!k.milestone, status: k.status,
      progress: k.progress === undefined || k.progress === null ? null : Math.min(1, Math.max(0, Number(k.progress))), dependsOn: [].concat(k.dependsOn || []).map(String), i };
  });
  const byKey = {};
  rows.forEach((r) => { byKey[r.key] = r; });
  const now = today === true ? new Date() : today ? toDate(today) : null;
  const mark = color || seriesColor(0);
  const date = (d) => formatDate(d);
  const waits = (r) => formatList(r.dependsOn.filter((k) => byKey[k]).map((k) => byKey[k].label));
  const say = (r) => r.label + ': ' + (r.milestone ? t.milestone + ', ' + date(r.start) : date(r.start) + ' – ' + date(r.end))
    + (r.progress !== null ? ', ' + formatPercent(r.progress, { decimals: 0 }) + ' ' + t.progress.toLowerCase() : '') + (r.status ? ', ' + r.status : '')
    + (r.dependsOn.length ? ', ' + t.dependsOn.toLowerCase() + ' ' + waits(r) : '');
  const keys = useChartPoints({ count: rows.length, describe: (i) => say(rows[i]) });
  const table = { columns: [{ title: t.task, field: 'label', kind: 'name', rowLabel: true }, { title: t.start, field: 'start', kind: 'data' }, { title: t.end, field: 'end', kind: 'data' },
    { title: t.progress, field: 'progress', kind: 'data', align: 'right' }, { title: t.status, field: 'status', kind: 'name' }, { title: t.dependsOn, field: 'waits', kind: 'name' }],
    data: rows.map((r, i) => ({ id: i + 1, label: r.label, start: date(r.start), end: r.milestone ? '' : date(r.end), progress: r.progress === null ? '' : formatPercent(r.progress, { decimals: 0 }), status: r.status || '', waits: waits(r) })) };
  const lo = range ? toDate(range[0]) : new Date(Math.min.apply(null, rows.map((r) => r.start.getTime()).concat(now ? [now.getTime()] : [])));
  const hi = range ? toDate(range[1]) : new Date(Math.max.apply(null, rows.map((r) => r.end.getTime()).concat(now ? [now.getTime()] : [])));
  return (
      <ChartFrame interaction={keys.interaction} title={title} description={description} size={size} table={table} className={cx('plx-gantt', className)}>
        {({ inner, margin }) => {
          // tasks dated by day get day ticks or coarser, never hours (issue 593); today's marker does not count
          const x = scaleTime({ domain: [lo, hi], range: [0, inner.width], nice: !range, unit: wholeDays(rows.map((r) => r.start).concat(rows.map((r) => r.end))) ? 'day' : undefined });
          const y = scaleBand({ domain: rows.map((r) => r.key), range: [0, inner.height], paddingInner: 0.4, paddingOuter: 0.2 });
          const mid = (r) => scalePosition(y, r.key);
          const a = keys.index !== null && keys.index !== undefined && rows[keys.index] ? rows[keys.index] : null;
          const box = (r) => (r.milestone ? { x: x(r.start) - DIAMOND, y: mid(r) - DIAMOND, width: 2 * DIAMOND, height: 2 * DIAMOND } : { x: x(r.start), y: y(r.key), width: Math.max(0, x(r.end) - x(r.start)), height: y.bandwidth() });
          return (
            <g>
              <ChartPatterns id={uid} />
              <GridLines scale={x} direction="vertical" inner={inner} />
              {rows.map((r) => <text key={'n' + r.key} className="plx-gantt__task" x={-NAME_GAP} y={mid(r)}>{r.label}</text>)}
              {rows.map((r) => r.dependsOn.filter((k) => byKey[k]).map((k) => {
                // out of the bottom (or top) edge of the task waited for, near its end, down (or up) to the waiting row, then across
                const from = byKey[k], x2 = r.milestone ? x(r.start) - DIAMOND : x(r.start), y2 = mid(r), below = y2 > mid(from);
                const fromStart = from.milestone ? x(from.start) : x(from.start), fromEnd = from.milestone ? x(from.start) : x(from.end);
                const x1 = Math.max(fromStart, Math.min(fromEnd - ELBOW, x2 - ELBOW));
                const half = from.milestone ? DIAMOND : y.bandwidth() / 2, y1 = mid(from) + (below ? half : -half);
                return (
                  <g key={'d' + k + '-' + r.key} className="plx-gantt__dependency">
                    <path className="plx-gantt__link" d={'M' + x1 + ',' + y1 + 'V' + y2 + 'H' + (x2 - HEAD)} />
                    <path className="plx-gantt__arrow" d={'M' + x2 + ',' + y2 + 'L' + (x2 - HEAD) + ',' + (y2 - HEAD) + 'L' + (x2 - HEAD) + ',' + (y2 + HEAD) + 'Z'} />
                  </g>
                );
              }))}
              {rows.map((r) => {
                if (r.milestone) {
                  const cx0 = x(r.start), cy = mid(r);
                  return <path key={'m' + r.key} className="plx-gantt__milestone" data-plx-dataviz={mark} d={'M' + cx0 + ',' + (cy - DIAMOND) + 'L' + (cx0 + DIAMOND) + ',' + cy + 'L' + cx0 + ',' + (cy + DIAMOND) + 'L' + (cx0 - DIAMOND) + ',' + cy + 'Z'} />;
                }
                const b = box(r), done = r.progress === null ? b.width : b.width * r.progress;
                return (
                  <g key={'b' + r.key}>
                    <rect className="plx-chart__mark plx-gantt__bar" data-plx-dataviz={mark} {...b} />
                    {r.progress !== null && r.progress < 1 ? <rect className="plx-chart-pattern plx-gantt__remaining" fill={patternFill(uid, 0)} x={b.x + done} y={b.y} width={Math.max(0, b.width - done)} height={b.height} /> : null}
                    {r.progress !== null ? <DataLabel x={b.x + b.width} y={mid(r)} value={formatPercent(r.progress, { decimals: 0 })} position="end" /> : null}
                  </g>
                );
              })}
              {now ? <ReferenceLine axis="x" scale={x} value={now} inner={inner} label={t.today} showValue={false} /> : null}
              <Axis scale={x} orient="bottom" inner={inner} margin={margin} />
              {rows.map((r, i) => <rect key={'h' + r.key} className="plx-chart-keys__hit" x={-margin.start} y={y(r.key) - (y.step() - y.bandwidth()) / 2} width={inner.width + margin.start} height={y.step()}
                onMouseEnter={() => keys.hover(i)} onMouseLeave={() => keys.hover(null)} />)}
              {a ? (() => { const b = box(a); return <rect className="plx-chart-keys__ring" x={b.x - RING} y={b.y - RING} width={b.width + 2 * RING} height={b.height + 2 * RING} />; })() : null}
              {a ? <ChartTooltip x={a.milestone ? x(a.start) : x(a.end)} y={mid(a)} inner={inner} title={a.label}
                items={(a.milestone ? [{ label: t.milestone, value: date(a.start), color: mark }] : [{ label: t.start, value: date(a.start), color: mark }, { label: t.end, value: date(a.end) }])
                  .concat(a.progress !== null ? [{ label: t.progress, value: formatPercent(a.progress, { decimals: 0 }) }] : [])} /> : null}
            </g>
          );
        }}
      </ChartFrame>
  );
}
