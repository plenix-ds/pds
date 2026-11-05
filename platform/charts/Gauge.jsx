/* Plenix · Gauge
   Summary: A gauge (07 Data Display › Charts › Gauge): one value inside a known range, as a semicircle track filled up to
     the value, the value in the data font in its middle, the minimum and maximum at the ends, and, with thresholds, the
     warning and critical ranges along the outside of the track with a status badge that names the range the value is in.
     A meter to assistive technology (role meter with its value, minimum, maximum and value text).
   Usage:
     <Gauge title="Storage used" value={72} format={(v) => v + '%'} label="of 100 GB" />
     <Gauge title="Storage used" value={86} format={(v) => v + '%'}
       thresholds={[{ value: 80, level: 'warning', label: 'Nearly full' }, { value: 95, level: 'critical', label: 'Full' }]} />
   Props:
     title: what is measured (required): the caption's title and the meter's name
     description: one sentence on what the value means
     value: the value (required); min, max: the range (default 0 and 100); values outside are drawn at the ends
     format: (value) => text for the value, the ends and the table (default formatNumber)
     label: a few words under the value that say its unit or its whole ("of 100 GB", "score")
     thresholds: the ranges that call for attention, from their start upward: [{ value, level: "warning" | "critical",
       label }]; each range runs to the next threshold or the maximum, along the outside of the track in the data-viz
       alert color; the range the value is in shows as a status badge with its label
     size: "sm" (160px wide) | "md" (default, 200px) | "lg" (240px)
     hideCaption: keeps the title and description for assistive technology only (default false)
     strings: the words it shows, for other languages: { showData: "Show the data", table: "{title}: data",
       measure: "Measure", value: "Value", min: "Minimum", max: "Maximum", ok: "" (a badge for the range under every
       threshold; empty: none) }
     className: more classes on the figure
   Behavior:
     Static: it has no keyboard stop of its own; the meter's value text says the value, its label and its range's name
       ("86%, of 100 GB, Nearly full"). The data grid under it lists the value, the ends and the thresholds.
     The status badge pairs the range's color with its name and icon, so color is never the only cue.
   Notes:
     The track, the fill and the bands are SVG paths (geometry only) colored by classes: the fill the first categorical
       data-viz color, the bands the alert scale; sizes, widths and type are --plx-comp-gauge-* tokens. One value per
       gauge: to compare values, use a bar or bullet chart; for a value without a range, a metric.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber } from '../utils/format.ts';
import { dataWhenText } from '../utils/dataText.tsx';
import { Details } from '../components/Details/Details.tsx';
import { Table } from '../components/Table/Table.tsx';
import { Badge } from '../components/Badge/Badge.tsx';
import { seriesColor } from './scales.js';
import { useStrings } from '../providers/LocaleProvider.tsx';
import AlertIcon from 'plenix-platform/icons/plenix/alert';
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import WarningIcon from 'plenix-platform/icons/plenix/warning';

const SIZES = ['sm', 'md', 'lg'];
const LEVELS = { warning: { tone: 'waiting', icon: WarningIcon }, critical: { tone: 'negative', icon: AlertIcon } };
// the dial's geometry in SVG user units (the SVG is scaled to the size's width): the center, the track's radius and the
// thresholds' radius outside it
const VB_W = 160, VB_H = 88, CX = 80, CY = 80, R = 60, RB = 74;

const arc = (r, t0, t1) => {
  const at = (t) => { const a = Math.PI * (1 - t); return [CX + r * Math.cos(a), CY - r * Math.sin(a)]; };
  const p = at(t0), q = at(t1);
  return 'M' + p[0] + ',' + p[1] + 'A' + r + ',' + r + ' 0 0 1 ' + q[0] + ',' + q[1];
};

export function Gauge({ title, description, value, min = 0, max = 100, format, label, thresholds = [], size = 'md', hideCaption = false, strings, className }) {
  const t = useStrings('chart.gauge', strings);
  const uid = 'plx-gauge' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const fmt = typeof format === 'function' ? format : (v) => formatNumber(v);
  const span = max - min || 1;
  const frac = (v) => Math.min(1, Math.max(0, (Number(v) - min) / span));
  const v = Number(value);
  const bands = thresholds.filter((x) => x && LEVELS[x.level]).slice().sort((a, b) => a.value - b.value);
  const now = bands.filter((b) => v >= b.value).pop();
  const status = now ? { tone: LEVELS[now.level].tone, icon: LEVELS[now.level].icon, label: now.label } : t.ok ? { tone: 'success', icon: CircleCheckIcon, label: t.ok } : null;
  const valueText = [fmt(v), label, status && status.label].filter(Boolean).join(', ');
  const s = SIZES.indexOf(size) >= 0 ? size : 'md';
  const table = {
    columns: [{ title: t.measure, field: 'm', kind: 'name', rowLabel: true }, { title: t.value, field: 'v', kind: 'data', align: 'right' }],
    data: [{ id: 1, m: t.value, v: fmt(v) }, { id: 2, m: t.min, v: fmt(min) }, { id: 3, m: t.max, v: fmt(max) }]
      .concat(bands.map((b, i) => ({ id: 4 + i, m: b.label || b.level, v: fmt(b.value) }))),
  };
  return (
    <figure className={cx('plx-chart', 'plx-gauge', 'plx-gauge--' + s, bands.length && 'plx-gauge--thresholds', className)}>
      <figcaption className={cx('plx-chart__caption', hideCaption && 'plx-visually-hidden')}>
        <span id={uid + '-title'} className="plx-chart__title">{title}</span>
        {description ? <span id={uid + '-desc'} className="plx-chart__description">{dataWhenText(description)}</span> : null}
      </figcaption>
      <div className="plx-gauge__meter" role="meter" aria-labelledby={uid + '-title'} aria-describedby={description ? uid + '-desc' : undefined}
        aria-valuenow={v} aria-valuemin={min} aria-valuemax={max} aria-valuetext={valueText}>
        <div className="plx-gauge__dial">
          <svg className="plx-gauge__svg" viewBox={'0 0 ' + VB_W + ' ' + VB_H} aria-hidden="true" focusable="false">
            {bands.map((b, i) => (
              <path key={i} className="plx-gauge__band" data-plx-dataviz={'alert-' + b.level} d={arc(RB, frac(b.value), i + 1 < bands.length ? frac(bands[i + 1].value) : 1)} />
            ))}
            <path className="plx-gauge__track" d={arc(R, 0, 1)} />
            {frac(v) > 0 ? <path className="plx-gauge__fill" data-plx-dataviz={seriesColor(0)} d={arc(R, 0, frac(v))} /> : null}
          </svg>
          <div className="plx-gauge__readout" aria-hidden="true">
            <span className="plx-gauge__value">{fmt(v)}</span>
            {label ? <span className="plx-gauge__label">{label}</span> : null}
          </div>
        </div>
        <div className="plx-gauge__range" aria-hidden="true">
          <span className="plx-gauge__end">{fmt(min)}</span>
          <span className="plx-gauge__end">{fmt(max)}</span>
        </div>
        {status ? <Badge className="plx-gauge__status" tone={status.tone} icon={status.icon}>{status.label}</Badge> : null}
      </div>
      <Details summary={t.showData} variant="inline" className="plx-chart__data">
        <Table label={t.table.replace('{title}', title || '')} columns={table.columns} data={table.data} />
      </Details>
    </figure>
  );
}
