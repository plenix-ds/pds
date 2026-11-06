/* Plenix · Chart scales (platform/charts/scales.ts)
   Summary: The math every Plenix chart shares (07 Data Display › Charts › Chart foundations): scales that turn a value
     into a position (linear, log, band, time), "nice" tick values on round numbers and calendar steps, tick labels in
     the reader's locale (utils/format.ts), and the series color of the data-viz scales (utils/dataviz.ts). No
     dependency: ChartFrame draws the SVG, the chart parts (wave 8) and the charts (wave 9) build on these.
   Usage:
     import { scaleLinear, scaleBand, scaleTime, scaleLog, niceTicks, seriesColor } from 'plenix-platform';
     const y = scaleLinear({ domain: [0, max], range: [inner.height, 0], nice: true });
     y(42)            // the position of 42
     y.ticks()        // [0, 20, 40, 60, 80, 100]: about five round values inside the domain
     y.format(20)     // "20", in the reader's locale with the ticks' precision
     const x = scaleBand({ domain: ['Jan', 'Feb', 'Mar'], range: [0, inner.width] });
     x('Feb'), x.bandwidth()
     <rect className="plx-chart__mark" data-plx-dataviz={seriesColor(i)} … />
   Props:
     niceTicks(min, max, count?): { start, stop, step, ticks } on steps of 1, 2 or 5 × 10ⁿ, about count (default 5) of them,
       start and stop widened to whole steps
     scaleLinear({ domain, range, nice, clamp, count }): a continuous scale; nice widens the domain to whole tick steps
       (count ticks, default 5); clamp keeps positions inside the range
     scaleLog({ domain, range, base, clamp }): a logarithmic scale (domain above 0; base default 10); ticks are the powers
       of the base, with 2 and 5 between them over two decades or less
     scaleBand({ domain, range, paddingInner, paddingOuter, align }): one band per category, in the domain's order;
       paddingInner (default 0.2) and paddingOuter (default 0.1) are fractions of a step; align (default 0.5) places the
       bands when there is room left
     scaleTime({ domain, range, nice, clamp, count, unit }): a continuous scale over dates (Date or anything Date accepts);
       ticks fall on calendar steps (seconds to years) in local time; unit ("second" … "year") is the smallest step it
       may use: "day" for dates without a time, so their ticks land on days or coarser, never hours
     wholeDays(dates) (the charts' own, from './scales.ts'): true when every date is a whole day (a date-only
       "YYYY-MM-DD" or a Date at local midnight); the charts pass unit: "day" to their time scale then
     Every continuous scale: scale(value) → position; scale.invert(position) → value; scale.ticks(count?);
       scale.format(value, count?) → the tick label; scale.domain(), scale.range(); scale.type
     A band scale: scale(key) → start of its band (undefined for an unknown key); scale.bandwidth(); scale.step();
       scale.ticks() → the keys; scale.format(key) → String(key)
     seriesColor(index): the categorical data-viz step of a series ("categorical-1" …), for data-plx-dataviz
   Behavior:
     Scales are plain functions: no state, no DOM. A domain of one value (min = max) is widened by half a step on each
       side, so a flat series still sits in the middle.
     Tick labels use the reader's locale and the same number of decimals for every tick of an axis (Numbers and units).
   Notes:
     A series keeps its color by its order in the data, never by rank (Data visualization colors). Positions are SVG user
       units (pixels inside ChartFrame's plot).
*/
import { formatNumber, formatLocale, numeralLocale, parseDate } from '../utils/format.ts';
import { datavizCategory } from '../utils/dataviz.ts';

/** the plot area's size in pixels (ChartFrame's inner) */
/** @public (ADR 0011) */
export type PlotSize = { width: number; height: number };
/** a value on a scale: a number, a category key, or a date (a Date, a time in milliseconds or a date text) */
/** @public (ADR 0011) */
export type ScaleValue = number | string | Date;
/** a position pair [start, end] */
type Pair = [number, number];
type FormatOptions = { locale?: string };
type ScaleCommon = {
  domain(): ScaleValue[];
  range(): number[];
  format(value: ScaleValue, count?: number, options?: FormatOptions): string;
};
/** a continuous scale of numbers */
/** @public (ADR 0011) */
export type LinearScale = ScaleCommon & { (value: ScaleValue): number; invert(position: number): number; ticks(count?: number): number[]; type: 'linear' };
/** a logarithmic scale of numbers above 0 */
/** @public (ADR 0011) */
export type LogScale = ScaleCommon & { (value: ScaleValue): number; invert(position: number): number; ticks(): number[]; type: 'log' };
/** one band per category */
/** @public (ADR 0011) */
export type BandScale = ScaleCommon & { (key: ScaleValue): number | undefined; bandwidth(): number; step(): number; ticks(): ScaleValue[]; type: 'band' };
/** a continuous scale of dates */
/** @public (ADR 0011) */
export type TimeScale = ScaleCommon & { (value: ScaleValue): number; invert(position: number): Date; step(count?: number): TimeStep; ticks(count?: number): Date[]; type: 'time' };
/** any Plenix scale */
/** @public (ADR 0011) */
export type Scale = LinearScale | LogScale | BandScale | TimeScale;
/** a calendar step: [unit, amount, approximate milliseconds] */
/** @public (ADR 0011) */
export type TimeStep = [TimeUnit, number, number];
/** @public (ADR 0011) */
export type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
/** the result of niceTicks */
export type NiceTicks = { start: number; stop: number; step: number; ticks: number[] };

const E10 = Math.sqrt(50), E5 = Math.sqrt(10), E2 = Math.sqrt(2);
// a step of 1, 2 or 5 × 10ⁿ for about count ticks over the span
function tickStep(span: number, count: number): number {
  const raw = Math.abs(span) / Math.max(1, count);
  if (!raw || !isFinite(raw)) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const err = raw / pow;
  return (err >= E10 ? 10 : err >= E5 ? 5 : err >= E2 ? 2 : 1) * pow;
}
const decimalsOf = (step: number): number => Math.max(0, -Math.floor(Math.log10(Math.abs(step)) + 1e-9));
const round = (v: number, d: number): number => Number(v.toFixed(Math.min(20, d)));

export function niceTicks(min: number | string, max: number | string, count = 5): NiceTicks {
  let lo = Number(min), hi = Number(max);
  if (lo > hi) { const t = lo; lo = hi; hi = t; }
  if (lo === hi) { const half = tickStep(Math.abs(lo) || 1, count) / 2; lo -= half; hi += half; }
  const step = tickStep(hi - lo, count), d = decimalsOf(step);
  const start = round(Math.floor(lo / step) * step, d), stop = round(Math.ceil(hi / step) * step, d);
  const ticks: number[] = [];
  for (let v = start, i = 0; v <= stop + step / 2 && i < 1000; i++, v = start + i * step) ticks.push(round(v, d));
  return { start, stop, step, ticks };
}

const pair = <T>(a: T[] | undefined, fallback: T[]): T[] => (Array.isArray(a) && a.length === 2 ? a.slice() : fallback.slice());
const interpolate = (r0: number, r1: number, t: number): number => r0 + (r1 - r0) * t;

type LinearOptions = { domain?: ScaleValue[]; range?: number[]; nice?: boolean; clamp?: boolean; count?: number };
export function scaleLinear({ domain = [0, 1], range = [0, 1], nice = false, clamp = false, count = 5 }: LinearOptions = {}): LinearScale {
  let d = pair<ScaleValue>(domain, [0, 1]).map(Number);
  const r = pair<number>(range, [0, 1]).map(Number);
  if (d[0] === d[1]) { const n = niceTicks(d[0], d[1], count); d = [n.start, n.stop]; }
  if (nice) { const n = niceTicks(Math.min(d[0], d[1]), Math.max(d[0], d[1]), count); d = d[0] <= d[1] ? [n.start, n.stop] : [n.stop, n.start]; }
  const scale = ((v: ScaleValue) => {
    let t = (Number(v) - d[0]) / (d[1] - d[0]);
    if (clamp) t = Math.min(1, Math.max(0, t));
    return interpolate(r[0], r[1], t);
  }) as LinearScale;
  scale.invert = (p: number) => d[0] + ((Number(p) - r[0]) / (r[1] - r[0])) * (d[1] - d[0]);
  scale.ticks = (n: number = count) => niceTicks(Math.min(d[0], d[1]), Math.max(d[0], d[1]), n).ticks.filter((v) => v >= Math.min(d[0], d[1]) - 1e-9 && v <= Math.max(d[0], d[1]) + 1e-9);
  scale.format = (v: ScaleValue, n: number = count, o: FormatOptions = {}) => formatNumber(Number(v), { decimals: decimalsOf(tickStep(d[1] - d[0], n)), locale: o.locale });
  scale.domain = () => d.slice();
  scale.range = () => r.slice();
  scale.type = 'linear';
  return scale;
}

type LogOptions = { domain?: ScaleValue[]; range?: number[]; base?: number; clamp?: boolean };
export function scaleLog({ domain = [1, 10], range = [0, 1], base = 10, clamp = false }: LogOptions = {}): LogScale {
  const d = pair<ScaleValue>(domain, [1, 10]).map((v) => Math.max(Number(v), Number.MIN_VALUE));
  const r = pair<number>(range, [0, 1]).map(Number);
  const log = (v: number): number => Math.log(v) / Math.log(base);
  const l0 = log(d[0]), l1 = log(d[1]);
  const scale = ((v: ScaleValue) => {
    let t = (log(Math.max(Number(v), Number.MIN_VALUE)) - l0) / ((l1 - l0) || 1);
    if (clamp) t = Math.min(1, Math.max(0, t));
    return interpolate(r[0], r[1], t);
  }) as LogScale;
  scale.invert = (p: number) => Math.pow(base, l0 + ((Number(p) - r[0]) / (r[1] - r[0])) * (l1 - l0));
  scale.ticks = () => {
    const lo = Math.min(d[0], d[1]), hi = Math.max(d[0], d[1]);
    const e0 = Math.floor(log(lo)), e1 = Math.ceil(log(hi));
    const between = e1 - e0 <= 2 && base === 10 ? [1, 2, 5] : [1];
    const out: number[] = [];
    for (let e = e0; e <= e1; e++) between.forEach((m) => { const v = m * Math.pow(base, e); if (v >= lo * (1 - 1e-9) && v <= hi * (1 + 1e-9)) out.push(Number(v.toPrecision(12))); });
    return out;
  };
  scale.format = (v: ScaleValue, _n?: number, o: FormatOptions = {}) => formatNumber(Number(v), { decimals: Number(v) < 1 ? decimalsOf(Number(v)) : 0, locale: o.locale });
  scale.domain = () => d.slice();
  scale.range = () => r.slice();
  scale.type = 'log';
  return scale;
}

type BandOptions = { domain?: ScaleValue[]; range?: number[]; paddingInner?: number; paddingOuter?: number; align?: number };
export function scaleBand({ domain = [], range = [0, 1], paddingInner = 0.2, paddingOuter = 0.1, align = 0.5 }: BandOptions = {}): BandScale {
  const keys = Array.from(domain);
  const r = pair<number>(range, [0, 1]).map(Number);
  const n = keys.length;
  const reverse = r[1] < r[0];
  const r0 = reverse ? r[1] : r[0], r1 = reverse ? r[0] : r[1];
  const step = (r1 - r0) / Math.max(1, n - paddingInner + paddingOuter * 2);
  const start = r0 + (r1 - r0 - step * (n - paddingInner)) * align;
  const band = step * (1 - paddingInner);
  const scale = ((key: ScaleValue) => {
    const i = keys.indexOf(key);
    if (i < 0) return undefined;
    return start + step * (reverse ? n - 1 - i : i);
  }) as BandScale;
  scale.bandwidth = () => band;
  scale.step = () => step;
  scale.ticks = () => keys.slice();
  scale.format = (key: ScaleValue) => String(key);
  scale.domain = () => keys.slice();
  scale.range = () => r.slice();
  scale.type = 'band';
  return scale;
}

// calendar steps, shortest first: [unit, amount, approximate milliseconds]
const S = 1000, MIN = 60 * S, H = 60 * MIN, DAY = 24 * H;
const TIME_STEPS: TimeStep[] = [['second', 1, S], ['second', 5, 5 * S], ['second', 15, 15 * S], ['second', 30, 30 * S], ['minute', 1, MIN], ['minute', 5, 5 * MIN],
  ['minute', 15, 15 * MIN], ['minute', 30, 30 * MIN], ['hour', 1, H], ['hour', 3, 3 * H], ['hour', 6, 6 * H], ['hour', 12, 12 * H], ['day', 1, DAY],
  ['day', 2, 2 * DAY], ['week', 1, 7 * DAY], ['month', 1, 30 * DAY], ['month', 3, 91 * DAY], ['year', 1, 365 * DAY]];
// a time value: a Date, a number, or a text read by the shared reader (a date-only "YYYY-MM-DD" is that calendar day where
// the reader is, issue 342)
const toTime = (v: ScaleValue): number => { if (typeof v === 'number') return v; const d = parseDate(v); return d ? d.getTime() : NaN; };
// the start of the step that holds t (local time)
function floorTo(t: number, unit: TimeUnit, amount: number): Date {
  const x = new Date(t);
  if (unit === 'second') { x.setMilliseconds(0); x.setSeconds(Math.floor(x.getSeconds() / amount) * amount); }
  else if (unit === 'minute') { x.setSeconds(0, 0); x.setMinutes(Math.floor(x.getMinutes() / amount) * amount); }
  else if (unit === 'hour') { x.setMinutes(0, 0, 0); x.setHours(Math.floor(x.getHours() / amount) * amount); }
  else if (unit === 'day') { x.setHours(0, 0, 0, 0); }
  else if (unit === 'week') { x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - x.getDay()); }
  else if (unit === 'month') { x.setHours(0, 0, 0, 0); x.setDate(1); x.setMonth(Math.floor(x.getMonth() / amount) * amount); }
  else { x.setHours(0, 0, 0, 0); x.setMonth(0, 1); x.setFullYear(Math.floor(x.getFullYear() / amount) * amount); }
  return x;
}
function addTo(x: Date, unit: TimeUnit, amount: number): Date {
  const y = new Date(x.getTime());
  if (unit === 'second') y.setSeconds(y.getSeconds() + amount);
  else if (unit === 'minute') y.setMinutes(y.getMinutes() + amount);
  else if (unit === 'hour') y.setHours(y.getHours() + amount);
  else if (unit === 'day') y.setDate(y.getDate() + amount);
  else if (unit === 'week') y.setDate(y.getDate() + 7 * amount);
  else if (unit === 'month') y.setMonth(y.getMonth() + amount);
  else y.setFullYear(y.getFullYear() + amount);
  return y;
}
// the steps a scale may use: all of them, or from a smallest unit up (issue 593: dates without a time get day ticks or
// coarser, never hours)
const UNITS: TimeUnit[] = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
const stepsFrom = (unit?: TimeUnit): TimeStep[] => {
  const from = unit ? UNITS.indexOf(unit) : -1;
  return from > 0 ? TIME_STEPS.filter((s) => UNITS.indexOf(s[0]) >= from) : TIME_STEPS;
};
function timeStep(span: number, count: number, unit?: TimeUnit): TimeStep {
  const target = Math.abs(span) / Math.max(1, count);
  if (target <= 365 * DAY) {   // the calendar step nearest the wanted one (by ratio)
    const steps = stepsFrom(unit);
    const gap = (s: TimeStep): number => Math.abs(Math.log(s[2] / Math.max(1, target)));
    return steps.reduce((best, s) => (gap(s) < gap(best) ? s : best), steps[0]);
  }
  const years = tickStep(target / (365 * DAY), 1);
  return ['year', Math.max(1, years), years * 365 * DAY];
}
const TIME_LABELS: Record<TimeUnit, Intl.DateTimeFormatOptions> = { second: { hour: 'numeric', minute: '2-digit', second: '2-digit' }, minute: { hour: 'numeric', minute: '2-digit' }, hour: { hour: 'numeric', minute: '2-digit' },
  day: { month: 'short', day: 'numeric' }, week: { month: 'short', day: 'numeric' }, month: { month: 'short', year: 'numeric' }, year: { year: 'numeric' } };

// true when every date is a whole day: a date-only value ("2026-10-01") or a Date at local midnight (issue 593)
export function wholeDays(dates?: Iterable<ScaleValue> | null): boolean {
  const list = Array.from(dates || []).map((v) => (typeof v === 'number' ? new Date(v) : parseDate(v)));
  return list.length > 0 && list.every((x) => x && x.getHours() === 0 && x.getMinutes() === 0 && x.getSeconds() === 0 && x.getMilliseconds() === 0);
}

type TimeOptions = { domain?: ScaleValue[]; range?: number[]; nice?: boolean; clamp?: boolean; count?: number; unit?: TimeUnit };
export function scaleTime({ domain = [0, DAY], range = [0, 1], nice = false, clamp = false, count = 5, unit: least }: TimeOptions = {}): TimeScale {
  let d = pair<ScaleValue>(domain, [0, DAY]).map(toTime);
  const r = pair<number>(range, [0, 1]).map(Number);
  if (d[0] === d[1]) d = [d[0] - DAY / 2, d[1] + DAY / 2];
  const timeStepOf = (span: number, n: number): TimeStep => timeStep(span, n, least);
  if (nice) {
    const [unit, amount] = timeStepOf(d[1] - d[0], count);
    const lo = Math.min(d[0], d[1]), hi = Math.max(d[0], d[1]);
    const start = floorTo(lo, unit, amount).getTime();
    let stop = floorTo(hi, unit, amount); if (stop.getTime() < hi) stop = addTo(stop, unit, amount);
    d = d[0] <= d[1] ? [start, stop.getTime()] : [stop.getTime(), start];
  }
  const scale = ((v: ScaleValue) => {
    let t = (toTime(v) - d[0]) / (d[1] - d[0]);
    if (clamp) t = Math.min(1, Math.max(0, t));
    return interpolate(r[0], r[1], t);
  }) as TimeScale;
  scale.invert = (p: number) => new Date(d[0] + ((Number(p) - r[0]) / (r[1] - r[0])) * (d[1] - d[0]));
  scale.step = (n: number = count) => timeStepOf(d[1] - d[0], n);
  scale.ticks = (n: number = count) => {
    const [unit, amount] = timeStepOf(d[1] - d[0], n);
    const lo = Math.min(d[0], d[1]), hi = Math.max(d[0], d[1]);
    const out: Date[] = [];
    let x = floorTo(lo, unit, amount);
    if (x.getTime() < lo) x = addTo(x, unit, amount);
    for (let i = 0; x.getTime() <= hi && i < 1000; i++, x = addTo(x, unit, amount)) out.push(new Date(x.getTime()));
    return out;
  };
  scale.format = (v: ScaleValue, n: number = count, o: FormatOptions = {}) => new Intl.DateTimeFormat(numeralLocale(o.locale || formatLocale()), TIME_LABELS[timeStepOf(d[1] - d[0], n)[0]]).format(new Date(toTime(v)));
  scale.domain = () => d.map((t) => new Date(t));
  scale.range = () => r.slice();
  scale.type = 'time';
  return scale;
}

export function seriesColor(index: number): string { return datavizCategory(index); }

