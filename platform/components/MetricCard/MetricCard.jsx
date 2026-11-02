/* Plenix · MetricCard
   Summary: One key figure in a card, with one anatomy for every kind of data (07 › Cards and objects › Metric card;
     owner, 2026-10-19). The header names what is measured (icon, title, info, period filter, More menu, then a context line
     that says the scope or the period); the body shows the value with its unit or target, a status, the change, and the
     one visual its type draws; a footer note closes it. The type is chosen by the shape of the data, never by the look.
   Usage:
     <MetricCard icon="checklist" title="Open tasks" context="All projects" value="128"
       change={{ amount: '12', direction: 'up', versus: 'since last week' }} goodWhen="down" />
     <MetricCard type="trend" icon="image-b" title="Assets added" context="Last 30 days" value="1,284"
       change={{ amount: '12.5%', direction: 'up', versus: 'vs previous 30 days' }} goodWhen="up"
       trend={[38, 41, 40, 44, 47, 52]} trendVariant="area" footer="Updated 5 minutes ago" />
     <MetricCard type="progress" title="Tasks done" context="Kitchen renovation" value="36" target="147"
       progress={{ value: 36, max: 147 }} status={{ tone: 'active', label: '24%' }} />
     <MetricCard type="person" person={{ name: 'Maya Chen', role: 'Designer', src: '/people/mc.jpg' }} value="12" unit="open tasks" />
     <MetricCard type="month" title="Days worked" value="11" target="22 work days"
       month={{ year: 2026, month: 10, levels: [2, 3, 0, …], today: 19 }} filter={<Select size="sm" … />} />
     <MetricCard layout="tile" title="Cases to assign" value="12" href="#/cases?assigned=none" />
   Props:
     type: what the data is (default "value"):
       "value" one number | "trend" a number and its recent history | "progress" a number against a target, or rows of them
       | "gauge" a score in a fixed range with zones | "breakdown" a total split into 2–6 parts, or ordered ranges
       | "comparison" two numbers of one unit | "list" the top items, ranked bars, or records that need action
       | "summary" 2–4 figures about one subject | "person" one number about one person (the picture inside the card)
       | "week" a value or a yes / no per day | "month" a level per day of a month | "table" a total and its 3–8 rows
     layout: "stacked" (default) | "beside" (the visual at the end, beside the figure: a card two columns wide)
       | "inline" (value types: the context beside the value) | "tile" (no header: the title, then the value at the end)
       | "icon-start" (no header: a large icon, in the card's color, before the value and the title)
     appearance: "plain" (default) | "edge" (a start edge in the color) | "soft" (the color's soft fill) | "filled" (the
       color as the fill, every text white) | "gradient" (a radial gradient from color to gradientTo, every text white);
       filled and gradient only for the value and summary types, which draw no colored visual
     color: the data color of the edge, the fill and the gradient: "blue" (default) | "green" | "purple" | "red" | "brown"
       | "gray"; gradientTo: the gradient's second color (default "purple")
     size: the value's display size: "sm" (24) | "md" (default, 28) | "lg" (36, a dashboard's first row)
     icon: an icon name or element before the title (the same icon for the same subject everywhere)
     title: what is measured, a short noun phrase (required; the person's name for type person)
     context: the scope or the period the figure covers ("Last 30 days", "All projects")
     info: one to three sentences on how the figure is calculated: an info button after the title (ContextualHelp)
     filter: the card's own period control (a Select, size "sm"), only when its period differs from the page's
     menu: MenuItems for the More menu (open details, export); never the card's main action
     href: makes the title a link to the details; the whole card is then its target
     headingLevel: the title's heading level (default 3)
     value: the figure, already formatted ("1,284", "$1.77M"); missing data: leave it out and the card shows "–"
     unit: a unit after the value ("hrs", "GB", "active cases"); target: the whole it counts toward ("147": "/ 147")
     status: { tone, icon, label }: a status badge at the end of the value row (Badge tones)
     change: { amount, direction: "up" | "down", versus }: the change since the last period
     goodWhen: which way is good: "up" (higher is better) | "down" (lower is better) | "none" (default: neither): the change's color
     footer: one line: a status message, the source, when it was updated, the threshold rule
     state: "ready" (default) | "loading" (placeholders) | "empty" (no data: "–" and emptyText) | "error" (the message and
       Try again) | "stale" (an Out of date badge); emptyText: the no-data line; errorText; onRetry(): Try again
     trend: the values, oldest first (type trend); trendVariant: "line" | "area" (default) | "bar"; trendLabel: what they show
     progress: { value, max, tone } (type progress, person): a progress bar
     rows: [{ id, label, detail, value, max, tone: "good" | "bad" | "neutral" }]: progress rows (type progress), each with its percent
     gauge: { value, min, max, format, label, thresholds } (type gauge): Gauge's props
     parts: [{ id, label, value, color }] (type breakdown); breakdown: "bar" (default: a split bar and a legend) | "donut"
       | "ranges" (ordered ranges in their order, each with a bar)
     compare: [{ label, value, amount, color }, { … }] (type comparison): the two sides; amount is the number for the bar
     items: [{ id, label, value, amount, icon, color, person: { name, src }, status, href }] (type list); list: "ranked"
       (default) | "bars" | "records"
     metrics: [{ value, unit, label }] (type summary): 2–4 figures
     person: { name, role, src, gender } (type person): the picture inside the card; the name is the title, the role the context
     days: seven values, Monday first (type week): numbers for bars, true / false for marks, null for days to come; week:
       "bars" (default) | "marks"; weekMax: the bars' full height (default the largest value)
     month: { year, month (1–12), levels: one level 0–3 per working day so far, today } (type month): a month calendar, Monday first
     table: { label, columns, data } (type table): Table's props, 3–8 rows
     strings: the words it shows and announces, for other languages (see STRINGS)
     className: more classes on the root (layout integration only)
   Behavior:
     The value is the largest text in the card, never colored; the change carries good or bad with its arrow and color, the
       status with its badge. A down change shows the up arrow turned (the icon set gets no down arrow).
     The header stays in every state, so people know which card is loading or failed.
     With href, the title is the link and the whole card is its target; the info button, the filter and the menu stay their own targets.
     Colors come from the data colors only (data-plx-color); filled and gradient turn every text white and the header buttons with it.
   Notes:
     One card per subject. Cards in a row share the type, the layout, the size and the style, so they line up.
     The same metric for each project or region is the same card repeated, never a new type.
     More than eight table rows, or rows people sort and filter, is a DataGrid in a Panel, not a card.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { devWarn } from '../../utils/devWarn.ts';
import { useUid } from '../../utils/layer.ts';
import { formatPercent } from '../../utils/format.ts';
import { Icon, asIcon as iconElement, isIconModule } from '../Icon/Icon.tsx';
import { Badge } from '../Badge/Badge.tsx';
import { Avatar } from '../Avatar/Avatar.jsx';
import { Count } from '../Count/Count.tsx';
import { Button } from '../Button/Button.tsx';
import { Menu } from '../Menu/Menu.tsx';
import { ContextualHelp } from '../ContextualHelp/ContextualHelp.tsx';
import { ProgressBar } from '../ProgressBar/ProgressBar.tsx';
import { Notice } from '../Notice/Notice.tsx';
import { Skeleton } from '../Loading/Loading.tsx';
import { Table } from '../Table/Table.jsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import { Sparkline } from '../../charts/Sparkline.jsx';
import { Gauge } from '../../charts/Gauge.jsx';
import { PieChart } from '../../charts/PieChart.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ArrowUpIcon from 'plenix-platform/icons/plenix/arrow-up';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import ClockIcon from 'plenix-platform/icons/plenix/clock';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import MoreIcon from 'plenix-platform/icons/plenix/more';
import RefreshIcon from 'plenix-platform/icons/plenix/refresh';
import { dataPhrase } from '../../utils/dataText.tsx';
import { fill } from '../../utils/fill.ts';

const TYPES = ['value', 'trend', 'progress', 'gauge', 'breakdown', 'comparison', 'list', 'summary', 'person', 'week', 'month', 'table'];
const LAYOUTS = ['stacked', 'beside', 'inline', 'tile', 'icon-start'];
const APPEARANCES = ['plain', 'edge', 'soft', 'filled', 'gradient'];
const HUES = ['blue', 'green', 'purple', 'red', 'brown', 'gray'];
// a plain icon (no tile, #882) takes its data color from one of these hues; gray, or none, is the muted icon color
const iconHue = (c) => (c && c !== 'gray' && HUES.indexOf(c) >= 0 ? c : undefined);
const ORDER = ['blue', 'purple', 'brown', 'green', 'red', 'gray'];   // breakdown parts without a color, by their order

function toneOf(change, goodWhen) {
  if (!change || goodWhen === 'none' || !goodWhen) return 'neutral';
  return change.direction === goodWhen ? 'good' : 'bad';
}

// the change: arrow + amount in the good, bad or neutral color, then what it is compared with
function Change({ change, goodWhen, t }) {
  if (!change) return null;
  const tone = toneOf(change, goodWhen);
  const down = change.direction === 'down';
  return (
    <div className="plx-metric-card__change">
      <span className={cx('plx-metric-card__delta', 'plx-metric-card__delta--' + tone)}>
        {change.direction ? <Icon name={ArrowUpIcon} className={cx('plx-metric-card__arrow', down && 'plx-metric-card__arrow--down')} /> : null}
        {change.direction ? <VisuallyHidden>{(down ? t.down : t.up) + (tone === 'neutral' ? ' ' : ' (' + t[tone] + ') ')}</VisuallyHidden> : null}
        {change.amount}
      </span>
      {change.versus ? <span className="plx-metric-card__versus">{change.versus}</span> : null}
    </div>
  );
}

// the figure: value · unit · / target, with the status badge at the end of the row
function Figure({ value, unit, target, status, inlineContext, empty }) {
  const none = empty || value === undefined || value === null || value === '';
  return (
    <div className="plx-metric-card__figure">
      <span className={cx('plx-metric-card__value', none && 'plx-metric-card__value--empty')}>{none ? '–' : value}</span>
      {unit ? <span className="plx-metric-card__unit">{unit}</span> : null}
      {target ? <span className="plx-metric-card__unit">{'/ ' + target}</span> : null}
      {inlineContext ? <span className="plx-metric-card__unit">{inlineContext}</span> : null}
      {status ? <span className="plx-metric-card__status"><Badge tone={status.tone} icon={status.icon}>{status.label}</Badge></span> : null}
    </div>
  );
}

// a split bar: SVG geometry only (the parts' widths come from the data), each part in its data color
function SplitBar({ parts, label }) {
  const total = parts.reduce((s, p) => s + (p.value > 0 ? p.value : 0), 0) || 1;
  let x = 0;
  return (
    <svg className="plx-metric-card__split" viewBox="0 0 100 8" preserveAspectRatio="none" role="img" aria-label={label}>
      {parts.map((p, i) => {
        const w = (p.value > 0 ? p.value : 0) / total * 100;
        const r = <rect key={p.id || i} className="plx-metric-card__split-part" data-plx-color={p.color} x={x} y="0" width={Math.max(0, w - (i < parts.length - 1 ? 0.6 : 0))} height="8" />;
        x += w;
        return r;
      })}
    </svg>
  );
}

function Legend({ parts, total }) {
  return (
    <ul className="plx-metric-card__legend">
      {parts.map((p) => (
        <li key={p.id} className="plx-metric-card__legend-row">
          <span className="plx-metric-card__key" data-plx-color={p.color} aria-hidden="true" />
          <span className="plx-metric-card__legend-label">{p.label}</span>
          <span className="plx-metric-card__number">{p.display !== undefined ? p.display : p.value}</span>
          <span className="plx-metric-card__share">{formatPercent(total ? p.value / total : 0)}</span>
        </li>
      ))}
    </ul>
  );
}

function ProgressRows({ rows }) {
  return (
    <div className="plx-metric-card__rows">
      {rows.map((r) => {
        const ratio = r.max ? r.value / r.max : 0;
        return (
          <div key={r.id || r.label} className="plx-metric-card__progress-row">
            <div className="plx-metric-card__row-text">
              <span className="plx-metric-card__row-label">{r.label}</span>
              {r.detail ? <span className="plx-metric-card__row-detail">{r.detail}</span> : null}
            </div>
            <span className={cx('plx-metric-card__delta', 'plx-metric-card__delta--' + (r.tone || 'neutral'))}>{formatPercent(ratio)}</span>
            <div className="plx-metric-card__row-bar">
              <ProgressBar value={r.value} max={r.max} size="sm" tone={r.tone === 'good' ? 'success' : r.tone === 'bad' ? 'danger' : 'neutral'} label={r.label} labelHidden />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ListVisual({ items = [], variant, t }) {
  if (variant === 'bars') {
    const max = Math.max(1, ...items.map((i) => i.amount !== undefined ? i.amount : Number(i.value) || 0));
    return (
      <div className="plx-metric-card__rows">
        {items.map((i) => (
          <div key={i.id} className="plx-metric-card__bar-row">
            <span className="plx-metric-card__row-label">{i.label}</span>
            <ProgressBar value={i.amount !== undefined ? i.amount : Number(i.value) || 0} max={max} size="sm" label={i.label} labelHidden />
            <span className="plx-metric-card__number">{i.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <ol className={cx('plx-metric-card__list', variant === 'records' && 'plx-metric-card__list--records')}>
      {items.map((i, n) => {
        const label = i.href ? <a className="plx-metric-card__row-link" href={i.href}>{i.label}</a> : i.label;
        return (
          <li key={i.id} className="plx-metric-card__list-row">
            {variant === 'records' ? null : <span className="plx-metric-card__rank">{dataPhrase(t.rank, { n: n + 1 })}</span>}
            {variant === 'records' ? null : (i.person ? <Avatar name={i.person.name} src={i.person.src} gender={i.person.gender} size="sm" />
              : i.icon ? <Icon name={i.icon} size="sm" className="plx-metric-card__row-icon" data-plx-color={iconHue(i.color)} /> : <span />)}
            <span className="plx-metric-card__row-label">{label}</span>
            {i.status ? <Badge tone={i.status.tone} icon={i.status.icon}>{i.status.label}</Badge> : <Count variant="pill" tone="neutral" value={i.value} />}
          </li>
        );
      })}
    </ol>
  );
}

function Summary({ metrics = [] }) {
  return (
    <ul className="plx-metric-card__summary">
      {metrics.map((m, i) => (
        <li key={m.id || i} className="plx-metric-card__summary-item">
          <span className="plx-metric-card__summary-figure">
            <span className={cx('plx-metric-card__summary-value', (m.value === undefined || m.value === null || m.value === '') && 'plx-metric-card__value--empty')}>{m.value === undefined || m.value === null || m.value === '' ? '–' : m.value}</span>
            {m.unit ? <span className="plx-metric-card__unit">{m.unit}</span> : null}
          </span>
          <span className="plx-metric-card__label">{m.label}</span>
        </li>
      ))}
    </ul>
  );
}

function Week({ days = [], variant, max, t }) {
  const top = max || Math.max(1, ...days.filter((d) => typeof d === 'number'));
  const said = days.map((d, i) => t.weekdayNames[i] + ' ' + (d === null || d === undefined ? t.toCome : d === true ? t.hit : d === false ? t.missed : d)).join(', ');
  return (
    <div className="plx-metric-card__week" role="img" aria-label={said}>
      {days.map((d, i) => (
        <span key={i} className="plx-metric-card__day-cell">
          {variant === 'marks'
            ? (d === null || d === undefined ? <span className="plx-metric-card__mark plx-metric-card__mark--none">{'–'}</span>
              : <span className={cx('plx-metric-card__mark', d ? 'plx-metric-card__delta--good' : 'plx-metric-card__delta--bad')}><Icon name={d ? CheckIcon : CloseIcon} /></span>)
            : <svg className="plx-metric-card__day-bar" viewBox="0 0 12 40" preserveAspectRatio="none" aria-hidden="true">
                <rect className="plx-metric-card__day-track" x="0" y="0" width="12" height="40" />
                {typeof d === 'number' && d > 0 ? <rect className="plx-metric-card__day-fill" x="0" y={40 - Math.min(1, d / top) * 40} width="12" height={Math.min(1, d / top) * 40} /> : null}
              </svg>}
          <span className="plx-metric-card__day-letter" aria-hidden="true">{t.weekdays[i]}</span>
        </span>
      ))}
    </div>
  );
}

function Month({ month, t }) {
  if (!month) return null;
  const first = new Date(month.year, month.month - 1, 1);
  const start = (first.getDay() + 6) % 7;                                      // Monday first
  const days = new Date(month.year, month.month, 0).getDate();
  const levels = month.levels || [];
  const cells = [];
  let work = 0, done = 0;
  t.weekdays.forEach((d, i) => cells.push(<span key={'h' + i} className="plx-metric-card__day-letter" aria-hidden="true">{d}</span>));
  for (let i = 0; i < start; i++) cells.push(<span key={'e' + i} aria-hidden="true" />);
  for (let d = 1; d <= days; d++) {
    const weekend = (start + d - 1) % 7 > 4;
    const future = month.today && d > month.today;
    let level = 'none';
    if (!future) { level = weekend ? '0' : String(levels[work] || 0); if (!weekend) { work++; if (levels[work - 1] > 0) done++; } }
    cells.push(<span key={d} aria-hidden="true" className={cx('plx-metric-card__date', 'plx-metric-card__date--' + level, d === month.today && 'plx-metric-card__date--today')}>{d}</span>);
  }
  return <div className="plx-metric-card__month" role="img" aria-label={fill(t.month, { done, days: work })}>{cells}</div>;
}

function Loading() {
  return (
    <div className="plx-metric-card__placeholder">
      <Skeleton width="96px" height="32px" />
      <Skeleton width="160px" height="16px" />
      <Skeleton height="32px" />
    </div>
  );
}

export function MetricCard({ type = 'value', layout = 'stacked', appearance = 'plain', color = 'blue', gradientTo = 'purple', size = 'md',
  icon, title, context, info, filter, menu, href, headingLevel = 3, value, unit, target, status, change, goodWhen = 'none', footer,
  state = 'ready', emptyText, errorText, onRetry, trend, trendVariant = 'area', trendLabel, progress, rows, gauge, parts, breakdown = 'bar',
  compare, items, list = 'ranked', metrics, person, days, week = 'bars', weekMax, month, table, strings, className, ...rest }) {
  devWarn('MetricCard', { type, layout, appearance, size }, { type: TYPES, layout: LAYOUTS, appearance: APPEARANCES, size: ['sm', 'md', 'lg'] });
  if ((appearance === 'filled' || appearance === 'gradient') && type !== 'value' && type !== 'summary') devWarn('MetricCard', { appearance: appearance + ' with type ' + type }, { appearance: ['plain', 'edge', 'soft'] });
  const t = useStrings('metricCard', strings);
  const id = useUid('plx-metric-card');
  const H = 'h' + Math.min(6, Math.max(2, headingLevel));
  const name = type === 'person' && person ? (title || person.name) : title;
  const line = type === 'person' && person && context === undefined ? person.role : context;
  const empty = state === 'empty';
  const shownStatus = state === 'stale' && !status ? { tone: 'waiting', icon: ClockIcon, label: t.stale } : status;
  const hue = HUES.indexOf(color) >= 0 ? color : 'blue';

  const titleText = href ? <a className="plx-metric-card__link" href={href}>{name}</a> : name;
  const iconEl = icon ? <span className="plx-metric-card__icon" aria-hidden="true">{iconElement(icon)}</span> : null;
  const moreLabel = fill(t.more, { title: typeof name === 'string' ? name : '' });
  const actions = (info || filter || menu) ? (
    <div className="plx-metric-card__actions">
      {info ? <ContextualHelp title={typeof name === 'string' ? name : ''}>{info}</ContextualHelp> : null}
      {filter || null}
      {menu ? <Menu trigger={<Button iconOnly icon={MoreIcon} label={moreLabel} variant="ghost" size="sm" />} placement="bottom-end">{menu}</Menu> : null}
    </div>
  ) : null;

  const rootProps = {
    className: cx('plx-metric-card', 'plx-metric-card--' + type, 'plx-metric-card--' + layout, 'plx-metric-card--' + appearance, 'plx-metric-card--' + size, href && 'plx-metric-card--link', className),
    'data-plx-color': appearance !== 'plain' ? hue : undefined,
    'data-plx-gradient-to': appearance === 'gradient' ? gradientTo : undefined,
    'aria-labelledby': id, 'aria-busy': state === 'loading' ? true : undefined, ...rest
  };

  // the two headerless layouts: tile and icon-start
  if (layout === 'tile' || layout === 'icon-start') {
    return (
      <article {...rootProps}>
        {layout === 'icon-start' && icon ? <Icon name={typeof icon === 'string' || isIconModule(icon) ? icon : undefined} size="lg" className="plx-metric-card__lead-icon" data-plx-color={iconHue(hue)} /> : null}
        <div className="plx-metric-card__compact">
          <span className={cx('plx-metric-card__value', empty && 'plx-metric-card__value--empty')}>{empty || value === undefined ? '–' : value}</span>
          <H id={id} className="plx-metric-card__title">{titleText}</H>
        </div>
      </article>
    );
  }

  let visual = null;
  let showFigure = type !== 'gauge' && type !== 'comparison' && type !== 'summary' && !(type === 'list' && value === undefined) && !(type === 'breakdown' && (breakdown === 'donut' || value === undefined));
  if (state === 'ready' || state === 'stale') {
    if (type === 'trend' && trend && trend.length) visual = <Sparkline values={trend} variant={trendVariant} size="fill" showLast={trendVariant !== 'bar'} label={trendLabel || (typeof name === 'string' ? name : '')} />;
    if (type === 'progress' && rows) visual = <ProgressRows rows={rows} />;
    else if ((type === 'progress' || type === 'person') && progress) visual = <ProgressBar value={progress.value} max={progress.max} tone={progress.tone} size={type === 'person' ? 'sm' : 'md'} label={typeof name === 'string' ? name : ''} labelHidden />;
    if (type === 'progress' && rows && value === undefined) showFigure = false;
    if (type === 'gauge' && gauge) visual = <Gauge title={typeof name === 'string' ? name : ''} hideCaption size="sm" {...gauge} />;
    if (type === 'breakdown' && parts) {
      const coloured = parts.map((p, i) => Object.assign({}, p, { color: p.color || ORDER[i % ORDER.length] }));
      const total = coloured.reduce((s, p) => s + (p.value > 0 ? p.value : 0), 0);
      if (breakdown === 'donut') visual = <PieChart variant="donut" hideCaption size="sm" title={typeof name === 'string' ? name : ''} data={parts.map((p) => ({ id: p.id, label: p.label, value: p.value }))} centerValue={value} centerLabel={unit} />;
      else if (breakdown === 'ranges') visual = <ProgressRows rows={parts.map((p) => ({ id: p.id, label: p.label, detail: p.detail, value: p.value, max: total, tone: 'neutral' }))} />;
      else visual = <>{<SplitBar parts={coloured} label={coloured.map((p) => fill(t.parts, { label: p.label, share: formatPercent(total ? p.value / total : 0) })).join(', ')} />}<Legend parts={coloured} total={total} /></>;
      if (breakdown === 'donut') showFigure = false;
    }
    if (type === 'comparison' && compare && compare.length === 2) {
      const [a, b] = compare;
      visual = (
        <>
          <div className="plx-metric-card__compare">
            <div className="plx-metric-card__side"><span className="plx-metric-card__value">{a.value}</span><span className="plx-metric-card__label">{a.label}</span></div>
            <span className="plx-metric-card__versus">{t.vs}</span>
            <div className="plx-metric-card__side plx-metric-card__side--end"><span className="plx-metric-card__value">{b.value}</span><span className="plx-metric-card__label">{b.label}</span></div>
          </div>
          <SplitBar parts={[{ id: 'a', value: a.amount !== undefined ? a.amount : Number(a.value) || 0, color: a.color || 'green' }, { id: 'b', value: b.amount !== undefined ? b.amount : Number(b.value) || 0, color: b.color || 'gray' }]}
            label={fill(t.compare, { a: a.label, av: a.value, b: b.label, bv: b.value })} />
        </>
      );
    }
    if (type === 'list') visual = <ListVisual items={items} variant={list} t={t} />;
    if (type === 'summary') visual = <Summary metrics={metrics} />;
    if (type === 'week') visual = <Week days={days} variant={week} max={weekMax} t={t} />;
    if (type === 'month') visual = <Month month={month} t={t} />;
    if (type === 'table' && table) visual = <Table label={table.label || (typeof name === 'string' ? name : '')} columns={table.columns} data={table.data} />;
  }

  let body;
  if (state === 'loading') body = <Loading />;
  else if (state === 'error') body = (
    <>
      <Figure empty />
      <Notice tone="danger" actions={onRetry ? <Button size="xs" icon={RefreshIcon} onClick={onRetry}>{t.retry}</Button> : undefined}>{errorText || t.error}</Notice>
    </>
  );
  else {
    const figure = (showFigure || empty) ? <Figure value={value} unit={unit} target={target} status={shownStatus} empty={empty} inlineContext={layout === 'inline' ? line : undefined} /> : null;
    const block = <>{figure}{empty ? null : <Change change={change} goodWhen={goodWhen} t={t} />}</>;
    if (type === 'person' && person) body = (
      <div className="plx-metric-card__person">
        <Avatar name={person.name} src={person.src} gender={person.gender} size="2xl" />
        <div className="plx-metric-card__stack">{block}{empty ? null : visual}</div>
      </div>
    );
    else if (layout === 'beside' && visual && !empty) body = <div className="plx-metric-card__beside"><div className="plx-metric-card__stack">{block}</div><div className="plx-metric-card__visual">{visual}</div></div>;
    else body = <>{block}{empty ? null : visual}</>;
  }
  const note = empty ? (emptyText || t.empty) : footer;

  return (
    <article {...rootProps}>
      <header className="plx-metric-card__header">
        <div className="plx-metric-card__heading">
          <H id={id} className={cx('plx-metric-card__title', iconEl && 'plx-metric-card__title--icon')}>{iconEl}{titleText}</H>
          {line && layout !== 'inline' ? <p className="plx-metric-card__context">{line}</p> : null}
        </div>
        {actions}
      </header>
      <div className="plx-metric-card__body">{body}</div>
      {note ? <footer className="plx-metric-card__footer">{note}</footer> : null}
    </article>
  );
}
