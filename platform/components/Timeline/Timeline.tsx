/* Plenix · Timeline
   Summary: Events in the order they happened (07 Data Display › Lists and collections › Timeline): each a marker on one
     line, with its date or time, a title and a few words; down the page (vertical), across it (horizontal), or on both
     sides of the line (alternating). A marker is a small circle, or the event's icon in a circle (with icons).
   Usage:
     <Timeline label="Project history" items={[
       { id: 1, time: 'Oct 2, 2026', dateTime: '2026-10-02', title: 'Project created', description: 'Maya Chen set up the project.' },
       { id: 2, time: 'Oct 9, 2026', dateTime: '2026-10-09', title: 'Quotes uploaded', icon: 'upload', badge: <Badge tone="success">Approved</Badge> }]} />
     <Timeline orientation="horizontal" label="Release plan" items={milestones} />
     <Timeline align="alternate" label="Our story" items={events} />
   Props:
     items: the events, oldest first (or newest first, as the page reads): [{ id, time, dateTime, title, description,
       icon, badge, content }]
     items[].time: the date or time as people read it (drawn in the data font)
     items[].dateTime: the machine-readable date of the <time> element (ISO 8601)
     items[].title: what happened (required)
     items[].description: a line or two about it
     items[].icon: an icon name (platform/icons/map.json): the marker is the icon in a circle; without it a small circle
     items[].badge: a Badge after the title, for the event's status (a status is always a Badge, never the marker)
     items[].content: more under the description (a link, a file, an avatar)
     orientation: "vertical" (default) | "horizontal" (the events in a row that scrolls sideways when it does not fit)
     align: "start" (default; every event after the line) | "alternate" (vertical only: the events take turns on each side
       of a line down the middle; one side again at Narrow widths)
     label: the timeline's accessible name (required when no heading names it)
     variant: "default" (the marker-and-line timeline) | "grouped" (ADR 0036, ADR 0036: events grouped by year, each in a container tinted by
       its category, with a calendar date tile; vertical only, so orientation and align are ignored)
     Grouped only:
       items[].dateTime: required (ISO 8601); the year groups and the date tile come from it. An upcoming event may leave it out.
       items[].category: { id, label, color }: the tag at the event's end and its tint; color is "1" to "8" or a category hue name
       items[].upcoming: a dashed outline and a grey band; the tile shows the month and day, or the word Pending when there is no dateTime
       density: "page" (default; the standard look, its padding following the region density) | "compact" (ADR 0048: the Key Dates look at one fixed size:
         no watermark, one line per event (title, description cut with an ellipsis, category tag at the inline end), a 40px date tile, at most 760px wide at
         the inline start; an upcoming event's tag adds "· upcoming", or "· Pending" with no date, from the patterns tagUpcoming and tagPending). Ignored, with a development warning, by variant "default".
       legend: a row of toggle buttons that hide a category's events (default false)
       hiddenCategories, onHiddenCategoriesChange: the hidden category ids, to control the legend (without them it keeps its own)
       headingLevel: 2 to 6, the year headings (default 3)
       strings: the words (pending, tagUpcoming, tagPending, legend), for other languages
     className: more classes on the list
   Behavior:
     The timeline is an ordered list (<ol>): each event is announced with its place (1 of 5), its time and title.
     It is static: put links or buttons inside an event's title or content when it opens something.
     Horizontal: the row scrolls sideways when it is wider than its container; the row is one Tab stop and the arrow keys
       scroll it (tabIndex 0, named by label).
     Alternating falls back to every event after the line below the Narrow width (600px).
   Notes:
     The markers and the line are neutral: they show order, not state. Show an event's state with a Badge (badge).
     More than about a dozen events: show the latest and a "Show earlier" button, or use the activity stream.
     Other props pass through to the <ol>.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Icon } from '../Icon/Icon.tsx';
import type { IconValue } from '../Icon/Icon.tsx';
import { Button } from '../Button/Button.tsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import { development, devWarn } from '../../utils/devWarn.ts';
import { useTruncated } from '../../utils/overflow.ts';
import { formatDate, formatLocale, numeralLocale, parseDate } from '../../utils/format.ts';

export type TimelineItem = {
  id?: string | number;
  /** an icon name or an imported module in the marker; none: a dot */
  icon?: IconValue | null;
  /** the time as shown */
  time?: React.ReactNode;
  /** the machine-readable time (the time element's dateTime) */
  dateTime?: string;
  title?: React.ReactNode;
  badge?: React.ReactNode;
  description?: React.ReactNode;
  content?: React.ReactNode;
  /** grouped: the category (its label is the tag, its color the tint) */
  category?: TimelineCategory;
  /** grouped: not happened yet: a dashed outline and Pending */
  upcoming?: boolean;
};
/** a category slot "1" to "8", or a category hue name (platform/system/steps.css) */
export type CategoryColor = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | (string & {});
export type TimelineCategory = { id: string; label: React.ReactNode; color: CategoryColor };
type TimelineWords = { pending: string; tagUpcoming: string; tagPending: string; legend: string };
export type TimelineProps = Omit<React.HTMLAttributes<HTMLOListElement>, 'children'> & {
  items?: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  align?: 'start' | 'alternate';
  /** the accessible name (aria-label) */
  label?: string;
  variant?: 'default' | 'grouped';
  /** grouped: "page" (default) the standard look, its spacing following the region density; "compact" the Key Dates look at one fixed size (ADR 0048) */
  density?: 'page' | 'compact';
  legend?: boolean;
  hiddenCategories?: string[];
  onHiddenCategoriesChange?: (ids: string[]) => void;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  strings?: Catalog | null;
};
let warnedDensity = false;
export function Timeline({ variant = 'default', density = 'page', ...props }: TimelineProps) {
  devWarn('Timeline', { variant, density }, { variant: ['default', 'grouped'], density: ['page', 'compact'] });
  if (variant !== 'grouped' && density !== 'page' && development() && !warnedDensity) { warnedDensity = true; console.warn('[Plenix] Timeline: density applies to variant="grouped" only; it is ignored here.'); }
  return variant === 'grouped' ? <GroupedTimeline density={density} {...props} /> : <PlainTimeline {...props} />;
}
// compact: one line that ends in an ellipsis when its box is narrower than its text; the whole text shows in a Tooltip only while it is cut (fit-and-overflow §5)
function CutLine({ as: Tag, className, tip, children }: { as: 'span' | 'p'; className: string; tip: string; children?: React.ReactNode }) {
  const ref = React.useRef<HTMLElement>(null);
  const text = typeof children === 'string' ? children : '';
  const cut = useTruncated(ref, text);
  return (
    <Tooltip content={text} disabled={!cut || !text} describe={false} className={tip}>
      <Tag ref={ref as React.RefObject<never>} className={className}>{children}</Tag>
    </Tooltip>
  );
}
// compact: an upcoming event's tag says so ("{category} · upcoming"; undated: "{category} · Pending", the tile has no room for the word). The catalog
// holds the whole pattern with its {category} slot, so each language orders the words as it needs; the label (any node) goes into the slot
function tagLabel(it: TimelineItem, dated: boolean, t: TimelineWords): React.ReactNode {
  const label = it.category ? it.category.label : null;
  if (!it.upcoming) return label;
  const [before, after] = String(dated ? t.tagUpcoming : t.tagPending).split('{category}');
  return typeof label === 'string' ? (before || '') + label + (after || '') : <>{before}{label}{after}</>;
}
type Row = { it: TimelineItem; key: React.Key; date: Date | null; year: number | null };
let warnedDates = false, warnedLayout = false;
function GroupedTimeline({ density = 'page', items = [], label, className, legend = false, hiddenCategories, onHiddenCategoriesChange, headingLevel = 3, strings, orientation, align, ...rest }: TimelineProps) {
  const t = useStrings('timeline', strings) as TimelineWords;
  const uid = React.useId();
  const [own, setOwn] = React.useState<string[]>([]);
  const hidden = hiddenCategories || own;
  const locale = formatLocale(), numerals = numeralLocale(locale);
  if (development()) {
    const missing = items.filter((it) => !it.upcoming && !parseDate(it.dateTime)).map((it, i) => it.id !== undefined ? it.id : i);
    if (missing.length && !warnedDates) { warnedDates = true; console.warn('[Plenix] Timeline: variant="grouped" needs a dateTime (ISO 8601) on every item that is not upcoming. Missing on: ' + missing.join(', ') + '.'); }
    if (((orientation && orientation !== 'vertical') || (align && align !== 'start')) && !warnedLayout) { warnedLayout = true; console.warn('[Plenix] Timeline: variant="grouped" is vertical only; orientation and align are ignored.'); }
  }
  const kinds: TimelineCategory[] = [];
  items.forEach((it) => { if (it.category && !kinds.some((k) => k.id === it.category!.id)) kinds.push(it.category); });
  const toggle = (id: string) => {
    const next = hidden.includes(id) ? hidden.filter((x) => x !== id) : hidden.concat(id);
    if (!hiddenCategories) setOwn(next);
    if (onHiddenCategoriesChange) onHiddenCategoriesChange(next);
  };
  const groups: { year: number | null; rows: Row[] }[] = [];
  items.forEach((it, i) => {
    if (it.category && hidden.includes(it.category.id)) return;
    const date = parseDate(it.dateTime), year = date ? date.getFullYear() : null, row: Row = { it, key: it.id !== undefined ? it.id : i, date, year };
    const last = groups[groups.length - 1];
    if (last && (year === null || last.year === year)) last.rows.push(row); else groups.push({ year, rows: [row] });
  });
  const compact = density === 'compact';
  const H = ('h' + headingLevel) as 'h2';
  const digits = (n: number | string, o?: Intl.NumberFormatOptions) => new Intl.NumberFormat(numerals, { useGrouping: false, ...o }).format(Number(n));
  return (
    <section aria-label={label} className={cx('plx-timeline', 'plx-timeline--grouped', compact && 'plx-timeline--compact', className)} {...(rest as React.HTMLAttributes<HTMLElement>)}>
      {legend && kinds.length ? (
        <div role="group" aria-label={t.legend} className="plx-timeline__legend">
          {kinds.map((k) => {
            const on = !hidden.includes(k.id);
            return (
              <Button key={k.id} variant="ghost" size="sm" aria-pressed={on} data-plx-category={k.color} className={cx('plx-timeline__legend-item', !on && 'plx-timeline__legend-item--off')} onClick={() => toggle(k.id)}>
                <span className={cx('plx-timeline__swatch', !on && 'plx-timeline__swatch--off')} aria-hidden="true" />{k.label}
              </Button>
            );
          })}
        </div>
      ) : null}
      {groups.map((g, gi) => {
        const hid = uid + '-' + gi;
        return (
          <section key={g.year === null ? 'none' + gi : g.year} className={cx('plx-timeline__group', compact && 'plx-timeline__group--compact')} aria-labelledby={g.year === null ? undefined : hid} aria-label={g.year === null ? label : undefined}>
            {g.year === null ? null : <H id={hid} className={cx('plx-timeline__year', compact && 'plx-timeline__year--compact')}>{digits(g.year)}</H>}
            <ol className={cx('plx-timeline__events', compact && 'plx-timeline__events--compact')}>
              {g.rows.map((r) => {
                const { it, date } = r, year = date ? date.getFullYear() : g.year;
                const full = date ? formatDate(date, { dateStyle: 'long' }) : '';
                return (
                  <li key={r.key} className={cx('plx-timeline__row', (year === null || compact) && 'plx-timeline__row--bare')}>
                    {year === null || compact ? null : <span className="plx-timeline__watermark" aria-hidden="true">{digits(year)}</span>}
                    <div className={cx('plx-timeline__event', compact && 'plx-timeline__event--compact', it.upcoming && 'plx-timeline__event--upcoming')} data-plx-category={it.category ? it.category.color : undefined}>
                      <span className={cx('plx-timeline__date', compact && 'plx-timeline__date--compact', it.upcoming && 'plx-timeline__date--upcoming')} aria-hidden="true">
                        <span className={cx('plx-timeline__date-band', compact && 'plx-timeline__date-band--compact', it.category && 'plx-timeline__date-band--category', it.upcoming && 'plx-timeline__date-band--upcoming')} />
                        {!date
                          ? (compact ? null : <span className="plx-timeline__date-pending">{it.upcoming ? t.pending : ''}</span>)
                          : <><span className={cx('plx-timeline__date-month', compact && 'plx-timeline__date-month--compact', it.category && !it.upcoming && 'plx-timeline__date-month--category')}>{new Intl.DateTimeFormat(numerals, { month: 'short' }).format(date)}</span><span className={cx('plx-timeline__date-day', compact && 'plx-timeline__date-day--compact')}>{digits(date.getDate())}</span></>}
                      </span>
                      <div className={cx('plx-timeline__event-body', compact && 'plx-timeline__event-body--compact')}>
                        <div className={cx('plx-timeline__heading', compact && 'plx-timeline__heading--compact')}>
                          {compact
                            ? <CutLine as="span" tip="plx-timeline__title-tip" className={cx('plx-timeline__event-title', 'plx-timeline__event-title--compact', it.category && 'plx-timeline__event-title--category')}>{it.title}</CutLine>
                            : <span className={cx('plx-timeline__event-title', it.category && 'plx-timeline__event-title--category')}>{it.title}</span>}
                          {it.badge ? <span className="plx-timeline__badge">{it.badge}</span> : null}
                        </div>
                        {it.dateTime ? <time className="plx-visually-hidden" dateTime={it.dateTime}>{full}</time> : null}
                        {it.description ? (compact ? <CutLine as="p" tip="plx-timeline__description-tip" className="plx-timeline__event-description plx-timeline__event-description--compact">{it.description}</CutLine> : <p className="plx-timeline__event-description">{it.description}</p>) : null}
                        {it.content ? <div className="plx-timeline__extra">{it.content}</div> : null}
                      </div>
                      {it.category ? (compact
                        ? <CutLine as="span" tip="plx-timeline__tag-tip" className="plx-timeline__tag plx-timeline__tag--compact plx-timeline__tag--category">{tagLabel(it, !!date, t)}</CutLine>
                        : <span className="plx-timeline__tag plx-timeline__tag--category">{it.category.label}</span>) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </section>
  );
}
function PlainTimeline({ items = [], orientation = 'vertical', align = 'start', label, className, legend: _l, hiddenCategories: _h, onHiddenCategoriesChange: _o, headingLevel: _hl, strings: _s, ...rest }: TimelineProps) {
  const horizontal = orientation === 'horizontal';
  const alternate = !horizontal && align === 'alternate';
  return (
    <ol aria-label={label} tabIndex={horizontal ? 0 : undefined}
      className={cx('plx-timeline', horizontal && 'plx-timeline--horizontal', alternate && 'plx-timeline--alternate', className)} {...rest}>
      {items.map((it, i) => (
        <li key={it.id !== undefined ? it.id : i} className="plx-timeline__item">
          <span className={cx('plx-timeline__marker', it.icon && 'plx-timeline__marker--icon')} aria-hidden="true">
            {it.icon ? <Icon name={it.icon} /> : <span className="plx-timeline__dot" />}
          </span>
          <div className="plx-timeline__content">
            {it.time ? <time className="plx-timeline__time" dateTime={it.dateTime}>{it.time}</time> : null}
            <div className="plx-timeline__heading">
              <span className="plx-timeline__title">{it.title}</span>
              {it.badge ? <span className="plx-timeline__badge">{it.badge}</span> : null}
            </div>
            {it.description ? <p className="plx-timeline__description">{it.description}</p> : null}
            {it.content ? <div className="plx-timeline__extra">{it.content}</div> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
