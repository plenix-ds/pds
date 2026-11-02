/* Plenix · EntityHeader
   Summary: The header of a page that shows one entity (a contact, a project, an email, a note, a component page), and of a
     section inside it. Header style 1, Structured · Top row · Small (owner, 2026-10-19, "Plenix page headers"): the media
     beside the title and subtitle, an accent rule, a row of fact tiles with the Status tile first, and an aside with the
     next step over the entity's actions. A section header is the same anatomy one step smaller.
     Header style 2, Facts with actions (owner, 2026-10-23): the same anatomy, but each fact box carries its own action
     (the count large, its button right after it) and the entity's state is a box of its own among the facts (states);
     with every action in a box there is no aside.
   Usage:
     <EntityHeader media={{ person: 'Maya Chen', color: 'blue' }} title="Maya Chen" subtitle="Creative Director · Apex Co"
       status={{ tone: 'action-required', icon: 'alert', label: 'Reconnect due' }}
       facts={[{ label: 'Last message', value: '10:24 AM', data: true }, { label: 'Owner', value: 'Sam Patel' }]}
       next={{ title: 'Send the revised quote', detail: 'Due tomorrow · Sam Patel' }}
       actions={[{ icon: 'phone', label: 'Call' }, { icon: 'message', label: 'Message', primary: true }, { icon: 'share', label: 'Share' }]} />
     <EntityHeader kind="section" media={{ icon: 'message', hue: 'blue' }} title="Comments" summary="3 open · 5 resolved"
       actions={[{ icon: 'plus', label: 'Add comment' }]} />
     Header style 2 (the fact boxes carry their actions):
     <EntityHeader media={{ icon: 'calendar', hue: 'surface' }} title="Council Session 2026-10-22" subtitle="Thursday, October 22, 2026 at 10:00 AM"
       facts={[{ icon: 'person', label: 'Presiding', value: 'H.E. Metropolitan Serapion' },
         { icon: 'person', label: 'Council Attendance', value: 12, data: true, action: { label: 'Attendance', icon: 'edit', name: 'Take council attendance' } },
         { icon: 'folder', label: 'Cases to assign', value: 10, data: true, action: { label: 'Add more', name: 'Add cases to assign' } }]}
       states={{ value: 'in-progress', onChange: setState, options: [{ value: 'draft', label: 'Draft', icon: 'pencil', tone: 'waiting' },
         { value: 'in-progress', label: 'In progress', icon: 'clock', tone: 'success' }, { value: 'adjourned', label: 'Adjourned', icon: 'do-not-disturb', tone: 'negative' }] }} />
   Props:
     headerStyle: "structured" (default: header style 1, the props below) | "streamlined" (the study's header style 2,
       Streamlined: one line of media, title with badges and subtitle, then people, inline progress and actions; under a
       divider the details strip). Streamlined reads media (null: none), title, subtitle (**names** in bold; their dates and numbers in the data font), status (the
       first badge), and:
       badges: more badges after the status: [{ label, tone, icon }]
       people: { label, list: [{ name, src }], max (default 3), onMore }: an AvatarGroup (32px, stacked, +N)
       progress: { label, value, max }: an inline progress, its label over a 4px bar
       actions: [{ icon, label, onClick, text, primary }]: icon buttons, then labeled ones (text), then one primary button
       detail: the details strip: { progress: { label, valueText, value, max }, facts: [{ label, value, data, tone }]
         (tiles under the bar; a tone makes a status tile), tags: [{ label, category }], items: [{ icon, label, tone
         (success | warning), data }], text, end: { badge: { tone, icon, label } } | { link: { label, href } } | an element
         (at the end of the strip) }
       view: "detailed" (default) | "compact" (the top line only)
       kind "section": its icon, title and summary (a badge), with its actions
     kind: "page" (default) | "section": a section header (32px icon, 15px title, 4px rule, a summary instead of tiles)
     layout: where the media sits and how big it is (header style 1, the owner's study "Plenix page headers"):
       "top-small" (default): a 44px square beside the title (a section: 32px);
       "top-large": a 72px square beside the title (48px);
       "column-small": a 44px square in a column of its own, at its top (32px);
       "column-large": a square in its own column spanning the title and the details, as tall as they are (at least 112px;
         64px), on the size tokens;
       "edge": the media fills the card's start edge, top to bottom, with one line at its inner side (at least 128px; 80px)
     title: the entity's name, in the Title role (20px bold; 15px in a section); a long name wraps, never cut off
     subtitle: the line under the title: the entity's description, where it belongs or who it involves; wraps
     media: the entity's picture, always shown: { person, src, color, gender } an Avatar (gender: its icon when there is no
       picture); { icon, hue } a generic icon for the
       entity's kind, tinted in a data color (hue: blue, green, purple, red, brown, gray; default gray) or on the surface
       (hue: surface, a white tile); or an element. 44px square (32px in a section)
     status: the Status tile, first in the details, in its tone as a whole: { tone, label, icon } (tone: a Badge tone:
       neutral, success, active, waiting, action-required, negative; info, warning and danger still work)
     facts: up to four fact tiles after the Status tile, each as wide as its content: [{ label, value, data, icon, action }];
       dates, times and numbers in a value are set in the data font and its words in the normal font; data: true
       sets the whole value in the data font, data: false none of it
       (data: a technical value, in the data font); a plain string or element is a tile with no label. icon: the fact's
       identifying icon, in a 40px square at its start. action (header style 2): { label, icon (default add), name,
       onClick, disabled }: the fact becomes a count box, its icon before the label, the value large, the action's button
       right after the value (name: the button's accessible name, which says what it adds)
     states (header style 2): the entity's state as a box among the facts, after them: { value, onChange, label (default
       strings.status), disabled, options: [{ value, label, icon, tone }] } (tone: waiting, success, negative, active,
       neutral): each state with its icon in its tone, the current one filled; a radio group
     summary: a section header's summary under its rule (a count, a state): text
     next: the aside's next step: { title, detail, label } (label: the eyebrow; default strings.next, "Next step")
     actions: the actions that act on this entity, 32px icon buttons at the end of the aside: [{ icon, label, onClick,
       primary, disabled }]; label is the tooltip and the accessible name; at most four buttons, More last. Never
       capability actions (New …)
     actionLabels: "icon" (default: icon buttons, the label as tooltip and name) | "text" (the icon and its label)
     actionsLayout: "row" (default: side by side, folding into More from the end) | "column" (stacked at the end, each as
       wide as the widest)
     control: a control that sets the entity's state, in the aside above the actions (a SegmentedControl for Draft · In
       session · Adjourned, a Select); it keeps its own label
     moreActions: items only in the More menu: [{ icon, label, onSelect, danger }]
     headingLevel: the title's heading level (default 1; 2 in a section)
     className: more classes on the header
     strings: the words it shows and announces, for other languages: { more: "More actions", status: "Status",
       next: "Next step" }
     description, context: the older names for the subtitle (description wins); live: the older name for the status
   Behavior:
     A card. Its background follows the user's settings on the page root: data-plx-header-tint none (default: white) | gray
       | blue | warm | green | purple | red, and data-plx-header-tint-style fade (default) | flat.
     Two columns with a divider between them: the divider starts at 63% of the width (main 1.7 to aside 1) and moves
       toward the end when the title needs the room; the aside keeps at least 220px (entity-header-aside-min-width), and
       past that the title wraps and the actions fold into More. With no next step and no actions there is no aside.
     The accent rule runs 10% past the wider of the heading and the details.
     The tiles wrap on narrow screens; under 640px of the header's own width the aside moves under the main column (its
       divider above it, at the start edge).
     The actions fold from the end into More when the aside is too narrow.
     Header style 2 follows the button rule of a command bar: while the facts would wrap, first the count buttons show
       their icon only, then the states too, each with its words as its tooltip and name; past that the boxes wrap.
   Notes:
     Writing direction (owner, arabic-batch4-36; issue 606): title, subtitle and summary are plain text. Plain text reads an ID or a
       case number as 01-20261020 (the owner's format for computed identifiers) only when it follows an Arabic letter in the same text
       ("القضية 20261020-01") or is written in Arabic-Indic digits. An ID with Latin digits and no Arabic letter before it
       (a title or subtitle that is only the ID) stays 20261020-01 in plain text: wrap it in <Isolate kind="id">, which reads
       01-20261020 in a right-to-left page and 20261020-01 in a left-to-right one, for Latin and Arabic-Indic digits alike. A value that
       must stay left to right (an email, a URL, a phone number) is wrapped in <Isolate kind="email"> (or url) instead
       (subtitle={['البريد ', <Isolate kind="email">a@b.org</Isolate>]}). Plenix does not guess. The same goes for a fact's value.
     Not for settings screens: use RecordPage.Header. A small uppercase group label is SectionHeading.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useOverflow, splitAt } from '../../utils/overflow.ts';
import { useBarFit } from '../../utils/barFit.ts';
import { SIZE_STEPS } from '../../utils/sizeSteps.js';
import { Avatar } from '../../components/Avatar/Avatar.jsx';
import { Button } from '../../components/Button/Button.tsx';
import { Icon } from '../../components/Icon/Icon.tsx';
import { Menu, MenuItem } from '../../components/Menu/Menu.jsx';
import { Text } from '../../components/Text/Text.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { AvatarGroup } from '../../components/AvatarGroup/AvatarGroup.jsx';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar.tsx';
import { Tag } from '../../components/Tag/Tag.tsx';
import { Link } from '../../components/Link/Link.tsx';
import AddIcon from 'plenix-platform/icons/plenix/add';
import DocTextIcon from 'plenix-platform/icons/plenix/doc-text';
import MoreIcon from 'plenix-platform/icons/plenix/more';

const HUES = ['blue', 'green', 'purple', 'red', 'brown', 'gray', 'surface'];
const TONES = ['neutral', 'success', 'active', 'waiting', 'action-required', 'negative'];
const ALIASES = { info: 'active', warning: 'waiting', danger: 'negative' };
const MAX_BUTTONS = 4;   // at most four buttons in the aside: three actions, then More (always last)

const LAYOUTS = ['top-small', 'top-large', 'column-small', 'column-large', 'edge'];
const STRETCH = { 'column-large': 1, edge: 1 };
// the stretched media's smallest square, by kind (the size tokens entity-header-[section-]media-size-column-large, -edge)
const STRETCH_MIN = { page: { 'column-large': 112, edge: 128 }, section: { 'column-large': 64, edge: 80 } };
// and its largest: the size tokens up to here, and never more than a quarter of the header's width (so a narrow header,
// whose text wraps taller, does not grow the square without end)
const STRETCH_MAX = { page: { 'column-large': 160, edge: 180 }, section: { 'column-large': 96, edge: 112 } };

// the media: its size by kind and layout (a class of its own); a stretched media (column, large and edge to edge) is a
// square as tall as its row, on the size tokens (data-plx-size, system/steps.css), measured here
function Media({ media, section, layout }) {
  const kind = section ? 'section' : 'page';
  const stretch = !!STRETCH[layout];
  const ref = React.useRef(null);
  const [size, setSize] = React.useState(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!stretch || !el || typeof ResizeObserver === 'undefined') { setSize(null); return undefined; }
    const min = STRETCH_MIN[kind][layout];
    const body = el.nextElementSibling, card = el.closest('.plx-entity-header');
    // the largest size token that fits its row's height, within the layout's limits
    const fit = () => {
      const h = el.getBoundingClientRect().height;   // stretched: the row's height (edge: with the card's padding it covers)
      const max = Math.min(STRETCH_MAX[kind][layout], card ? card.getBoundingClientRect().width / 4 : Infinity);
      const s = SIZE_STEPS.filter((x) => x >= min && x <= h && x <= max).pop() || min;
      setSize((v) => (v === s ? v : s));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    if (body) ro.observe(body);
    if (card) ro.observe(card);
    return () => ro.disconnect();
  }, [stretch, kind, layout]);
  let inner;
  if (React.isValidElement(media)) inner = media;
  else if (media.person || media.src) inner = <Avatar className="plx-entity-header__avatar" name={media.person} src={media.src} color={media.color} gender={media.gender} size={section ? 'md' : 'xl'} />;
  else {
    const hue = HUES.indexOf(media.hue) >= 0 ? media.hue : 'gray';
    const optical = !(section && (layout === 'top-small' || layout === 'column-small'));
    inner = <span className="plx-entity-header__tile" data-plx-media-hue={hue} data-plx-icon-optical={optical ? '24' : undefined} aria-hidden="true"><Icon name={media.icon} /></span>;
  }
  return (
    <span ref={ref} data-plx-size={size ? size + 'px' : undefined}
      className={cx('plx-entity-header__media', 'plx-entity-header__media--' + kind + '-' + layout, stretch && 'plx-entity-header__media--stretch', layout === 'edge' && 'plx-entity-header__media--edge', layout === 'column-small' && 'plx-entity-header__media--start')}>
      {inner}
    </span>
  );
}

// header style 2 (owner, 2026-10-23): the entity's state as a box of its own, each state with its icon and tone, the
// current one filled; a radio group (arrow keys move and select)
function States({ states, label, iconOnly }) {
  const opts = (states.options || []).filter(Boolean);
  const refs = React.useRef([]);
  const pick = (i) => { const o = opts[(i + opts.length) % opts.length]; if (o && states.onChange) states.onChange(o.value); refs.current[(i + opts.length) % opts.length]?.focus(); };
  const key = (e, i) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (step) { e.preventDefault(); pick(i + step); }
  };
  return (
    <div className="plx-entity-header__fact plx-entity-header__fact--states">
      <dt className="plx-entity-header__fact-label">{states.label || label}</dt>
      <dd className="plx-entity-header__fact-line"><div className="plx-entity-header__states" role="radiogroup" aria-label={states.label || label}>
        {opts.map((o, i) => {
          const on = o.value === states.value, tone = TONES.indexOf(ALIASES[o.tone] || o.tone) >= 0 ? (ALIASES[o.tone] || o.tone) : 'neutral';
          return (
            <button key={o.value} ref={(el) => { refs.current[i] = el; }} type="button" role="radio" aria-checked={on} tabIndex={on || (!opts.some((x) => x.value === states.value) && i === 0) ? 0 : -1}
              disabled={states.disabled} onClick={() => states.onChange && states.onChange(o.value)} onKeyDown={(e) => key(e, i)}
              aria-label={iconOnly && o.icon ? o.label : undefined} title={iconOnly && o.icon ? o.label : undefined}
              className={cx('plx-entity-header__state', 'plx-entity-header__state--' + tone, on && 'is-selected')}>
              {o.icon ? <span className={cx('plx-entity-header__state-icon', 'plx-entity-header__state-icon--' + tone, on && 'plx-entity-header__state-icon--on')}><Icon name={o.icon} /></span> : null}
              {iconOnly && o.icon ? null : <span className="plx-entity-header__state-label">{o.label}</span>}
            </button>
          );
        })}
      </div></dd>
    </div>
  );
}

// a fact: label over value; with an icon, the icon in a square at its start; with an action (header style 2), the icon
// before the label, the value large, and the action right after the value
// numbers and dates in the data font, words in the normal font (owner, 2026-10-24): a fact's value is set in the
// data role where it is a date, a time or a number (with its currency, percent, separators and units), word by word
const MONTH = '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\\.?';
const DATUM = new RegExp('(\\d{4}-\\d{2}-\\d{2}(?:[ T]\\d{1,2}:\\d{2})?|' + MONTH + ' \\d{1,2}(?:, \\d{4})?|\\d{1,2}:\\d{2}(?:\\s?[AP]M)?|[$€£]?\\d[\\d,.]*(?:\\s?(?:%|[kKMB]\\b|KB|MB|GB|TB))?(?:\\s?[×x]\\s?\\d[\\d,.]*)?)', 'g');
function dataText(value) {
  if (typeof value === 'number') return <Text variant="data">{value}</Text>;
  if (typeof value !== 'string' || !/\d/.test(value)) return value;
  const parts = value.split(DATUM);
  return parts.map((p, i) => (i % 2 ? <Text key={i} variant="data">{p}</Text> : p || null));
}

function Fact({ f, iconOnly }) {
  const value = f.data ? <Text variant="data">{f.value}</Text> : f.data === false ? f.value : dataText(f.value);
  if (f.action) {
    const a = f.action;
    return (
      <div className="plx-entity-header__fact plx-entity-header__fact--action">
        <dt className="plx-entity-header__fact-label plx-entity-header__fact-label--icon">{f.icon ? <span className="plx-entity-header__fact-label-icon" aria-hidden="true"><Icon name={f.icon} /></span> : null}{f.label}</dt>
        <dd className="plx-entity-header__fact-line">
          <span className="plx-entity-header__fact-value plx-entity-header__fact-value--count">{f.data ? <span className="plx-entity-header__count-data">{f.value}</span> : f.value}</span>
          {iconOnly
            ? <Button size="xs" variant="secondary" iconOnly icon={a.icon || AddIcon} label={a.name || a.label} title={a.label} disabled={a.disabled} onClick={a.onClick} />
            : <Button size="xs" variant="secondary" icon={a.icon || AddIcon} aria-label={a.name} disabled={a.disabled} onClick={a.onClick}>{a.label}</Button>}
        </dd>
      </div>
    );
  }
  if (f.icon) {
    return (
      <div className="plx-entity-header__fact plx-entity-header__fact--icon">
        <dt className="plx-entity-header__fact-label plx-entity-header__fact-label--tile"><span className="plx-entity-header__fact-icon" aria-hidden="true"><Icon name={f.icon} /></span><span className="plx-entity-header__fact-name">{f.label}</span></dt>
        <dd className="plx-entity-header__fact-value plx-entity-header__fact-value--tile">{value}</dd>
      </div>
    );
  }
  return (
    <div className="plx-entity-header__fact">
      {f.label ? <dt className="plx-entity-header__fact-label">{f.label}</dt> : null}
      <dd className="plx-entity-header__fact-value">{value}</dd>
    </div>
  );
}

function Details({ status, states, facts, strings, step = 0 }) {
  const tiles = [];
  if (status && React.isValidElement(status)) tiles.push(<div key="st" className="plx-entity-header__fact">{status}</div>);
  else if (status) {
    const tone = TONES.indexOf(ALIASES[status.tone] || status.tone) >= 0 ? (ALIASES[status.tone] || status.tone) : 'neutral';
    tiles.push(
      <div key="st" className="plx-entity-header__fact plx-entity-header__fact--status" data-plx-tone={tone}>
        <dt className="plx-entity-header__fact-label">{strings.status}</dt>
        <dd className="plx-entity-header__fact-value plx-entity-header__status-value">{status.icon ? <Icon name={status.icon} size="sm" /> : null}{dataText(status.label)}</dd>
      </div>
    );
  }
  (facts || []).filter(Boolean).slice(0, 4).forEach((f, i) => {
    const plain = typeof f === 'string' || typeof f === 'number' || React.isValidElement(f);
    tiles.push(plain
      ? <div key={'f' + i} className="plx-entity-header__fact"><dd className="plx-entity-header__fact-value">{dataText(f)}</dd></div>
      : <Fact key={'f' + i} f={f} iconOnly={step >= 1} />);
  });
  if (states) tiles.push(<States key="states" states={states} label={strings.status} iconOnly={step >= 2} />);
  return tiles.length ? <dl className="plx-entity-header__details">{tiles}</dl> : null;
}

function Actions({ actions, moreActions, size, strings, labels = 'icon', layout = 'row' }) {
  const text = labels === 'text', column = layout === 'column';
  const ref = React.useRef(null);
  const extra = moreActions || [];
  let list = actions || [];
  let folded = [];
  if (list.length > MAX_BUTTONS - 1) { folded = list.slice(MAX_BUTTONS - 1); list = list.slice(0, MAX_BUTTONS - 1); }
  const none = React.useRef(null);   // a column is not measured: the helper would hide what sits below the first row
  const measured = useOverflow(column ? none : ref, list.length, list.map((a) => a.label).join('|') + labels + layout);
  const fit = column ? list.length : measured;   // a column has room for every action: nothing folds
  const items = list.map((a) => (
    <span key={a.label} data-plx-overflow-item="" className={cx('plx-entity-header__action', column && 'plx-entity-header__action--stretch')}>
      {text
        ? <Button size={size} icon={a.icon} variant={a.primary ? 'primary' : 'secondary'} disabled={a.disabled} onClick={a.onClick}>{a.label}</Button>
        : <Button size={size} iconOnly icon={a.icon} label={a.label} title={a.label} variant={a.primary ? 'primary' : 'secondary'} disabled={a.disabled} onClick={a.onClick} />}
    </span>
  ));
  const hidden = list.slice(fit).concat(folded);
  const more = (
    <span key="plx-more" data-plx-overflow-more="" className={cx('plx-entity-header__action', column && 'plx-entity-header__action--stretch')}>
      <Menu label={strings.more} placement="bottom-end" trigger={text ? <Button size={size} icon={MoreIcon} variant="secondary">{strings.more}</Button> : <Button size={size} iconOnly icon={MoreIcon} label={strings.more} title={strings.more} variant="secondary" />}>
        {hidden.map((a) => <MenuItem key={a.label} icon={a.icon} disabled={a.disabled} onSelect={a.onClick}>{a.label}</MenuItem>)}
        {extra.map((a) => <MenuItem key={a.label} icon={a.icon} danger={a.danger} onSelect={a.onSelect}>{a.label}</MenuItem>)}
      </Menu>
    </span>
  );
  return <div ref={ref} className={cx('plx-entity-header__actions', column && 'plx-entity-header__actions--column', size === 'sm' && 'plx-entity-header__actions--sm')}>{splitAt(items, fit, more)}</div>;
}

// a subtitle written with **names** in bold (a string); an element passes as it is. A bold part's dates, times and
// numbers are in the data font, as in the facts (#260)
function strongText(text) {
  if (typeof text !== 'string' || text.indexOf('**') < 0) return text;
  return text.split('**').map((part, i) => (i % 2 ? <strong key={i} className="plx-entity-header__strong">{dataText(part)}</strong> : part));
}
const toneOf = (t) => (TONES.indexOf(ALIASES[t] || t) >= 0 ? (ALIASES[t] || t) : 'neutral');

// a detail item: its icon and text, colored when it is on track (success) or needs attention (warning)
function Item({ it }) {
  return (
    <span className={cx('plx-entity-header__item', it.tone === 'success' && 'plx-entity-header__item--success', it.tone === 'warning' && 'plx-entity-header__item--warning')}>
      {it.icon ? <span className="plx-entity-header__item-icon" aria-hidden="true"><Icon name={it.icon} /></span> : null}
      {it.data ? <Text variant="data">{it.label}</Text> : it.label}
    </span>
  );
}

// header style Streamlined (the owner's study "Plenix page headers", 2026-10-19): the media, the title with its badges
// (status first) over the subtitle; at the end the people, an inline progress and the actions (one primary); under a
// divider the details strip (Detailed view only). A section: its icon, title and summary badge, with its actions.
function Streamlined({ section, H, title, sub, media, status, badges, summary, people, progress, actions, detail, view, className, strings }) {
  const list = (actions || []).filter(Boolean);
  const icons = list.filter((a) => !a.primary && !a.text), labeled = list.filter((a) => !a.primary && a.text), primary = list.filter((a) => a.primary).slice(0, 1);
  const allBadges = (section ? (summary || sub ? [{ label: summary || sub, tone: 'neutral' }] : [])
    : [status && !React.isValidElement(status) ? status : null].concat(badges || [])).filter(Boolean);
  const d = !section && view !== 'compact' ? detail : null;
  const endItem = d && d.end ? (d.end.link
    ? <Link href={d.end.link.href} variant="standalone">{d.end.link.label}</Link>
    : d.end.badge ? <Badge tone={toneOf(d.end.badge.tone)} icon={d.end.badge.icon}>{d.end.badge.label}</Badge> : d.end) : null;
  return (
    <header className={cx('plx-entity-header', 'plx-entity-header--streamlined', section && 'plx-entity-header--section', view === 'compact' && 'plx-entity-header--compact', className)}>
      <div className="plx-entity-header__top">
        <div className="plx-entity-header__start">
          {media === null ? null : <Media media={media || { icon: DocTextIcon }} section={section} layout={section ? 'top-small' : 'streamlined'} />}
          <div className="plx-entity-header__head">
            <div className="plx-entity-header__title-row">
              <H className="plx-entity-header__title">{title}</H>
              {allBadges.length ? <span className="plx-entity-header__badges">{allBadges.map((b, i) => <Badge key={i} tone={toneOf(b.tone)} icon={b.icon}>{b.label}</Badge>)}</span> : null}
            </div>
            {sub && !section ? <p className="plx-entity-header__subtitle plx-entity-header__subtitle--streamlined">{strongText(sub)}</p> : null}
          </div>
        </div>
        {people || progress || list.length ? (
          <div className="plx-entity-header__end">
            {people && !section ? <AvatarGroup label={people.label || strings.people} people={people.list || []} max={people.max || 3} size="md" onMore={people.onMore} /> : null}
            {progress && !section ? (
              <div className="plx-entity-header__mini-progress">
                <span className="plx-entity-header__mini-progress-label">{progress.label}</span>
                <span className="plx-entity-header__mini-progress-bar"><ProgressBar value={progress.value} max={progress.max} size="sm" label={progress.label} labelHidden /></span>
              </div>
            ) : null}
            {list.length ? (
              <div className="plx-entity-header__buttons">
                {icons.map((a) => <Button key={a.label} size={section ? 'sm' : 'md'} iconOnly icon={a.icon} label={a.label} title={a.label} variant="secondary" disabled={a.disabled} onClick={a.onClick} />)}
                {labeled.map((a) => <Button key={a.label} size="sm" icon={a.icon} variant="secondary" disabled={a.disabled} onClick={a.onClick}>{a.label}</Button>)}
                {primary.map((a) => <Button key={a.label} size={section ? 'sm' : 'md'} icon={a.icon} variant="primary" disabled={a.disabled} onClick={a.onClick}>{a.label}</Button>)}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {d ? (
        <div className="plx-entity-header__strip">
          {d.progress ? (
            <div className="plx-entity-header__progress">
              <div className="plx-entity-header__progress-row">
                <span className="plx-entity-header__progress-label">{d.progress.label}</span>
                <span className="plx-entity-header__progress-value">{d.progress.valueText}</span>
              </div>
              <ProgressBar value={d.progress.value} max={d.progress.max} label={d.progress.label} labelHidden />
              {d.facts && d.facts.length ? (
                <dl className="plx-entity-header__details plx-entity-header__details--strip">
                  {d.facts.map((f, i) => (f.tone
                    ? <div key={i} className="plx-entity-header__fact plx-entity-header__fact--status" data-plx-tone={toneOf(f.tone)}><dt className="plx-entity-header__fact-label">{f.label}</dt><dd className="plx-entity-header__fact-value">{f.data ? <Text variant="data">{f.value}</Text> : dataText(f.value)}</dd></div>
                    : <Fact key={i} f={f} />))}
                </dl>
              ) : null}
            </div>
          ) : null}
          {(d.tags || []).map((t, i) => <Tag key={'t' + i} category={t.category}>{t.label}</Tag>)}
          {(d.items || []).map((it, i) => <Item key={'i' + i} it={it} />)}
          {d.text ? <span className="plx-entity-header__strip-text">{d.text}</span> : null}
          {endItem ? <span className="plx-entity-header__strip-end">{endItem}</span> : null}
        </div>
      ) : null}
    </header>
  );
}

// the header style picks the component: Structured (style 1, default) or Streamlined
export function EntityHeader(props) {
  if (props.headerStyle !== 'streamlined') return <Structured {...props} />;
  const { kind = 'page', title, subtitle, description, context, media, status, live, badges, summary, people, progress, actions, detail, view = 'detailed', headingLevel, className, strings } = props;
  const section = kind === 'section';
  return <Streamlined section={section} H={'h' + (headingLevel || (section ? 2 : 1))} title={title} sub={subtitle !== undefined ? subtitle : (description !== undefined ? description : context)}
    media={media} status={status || live} badges={badges} summary={summary} people={people} progress={progress} actions={actions} detail={detail} view={view}
    className={className} strings={{ people: 'People', ...strings }} />;
}

function Structured({ kind = 'page', layout = 'top-small', title, subtitle, media, status, states, facts, summary, next, actions, moreActions,
  actionLabels = 'icon', actionsLayout = 'row', control, description, context, live, headingLevel, className, strings }) {
  const section = kind === 'section';
  const lay = LAYOUTS.indexOf(layout) >= 0 ? layout : 'top-small';
  const top = lay === 'top-small' || lay === 'top-large';
  const H = 'h' + (headingLevel || (section ? 2 : 1));
  const s = { more: 'More actions', status: 'Status', next: 'Next step', ...strings };
  const sub = subtitle !== undefined ? subtitle : (description !== undefined ? description : context);
  const st = status || live;
  const hasActions = (actions && actions.length) || (moreActions && moreActions.length);
  const aside = !!(next && !section) || !!hasActions || !!control;
  // header style 2, the button rule (as in a command bar): while the facts would wrap, step 1 shows the count buttons as
  // their icons, step 2 the states too (each keeps its words as its tooltip and name); past that the boxes wrap
  const root = React.useRef(null);
  const fitted = !section && ((facts || []).some((f) => f && f.action) || !!states);
  const fitKey = (facts || []).map((f) => (f && (f.label || '') + (f.value || '') + (f.action ? f.action.label : ''))).join('|') + '§' + (states ? states.value + (states.options || []).map((o) => o.label).join(',') : '');
  const step = useBarFit(root, fitKey, fitted ? 2 : 0, 0, '.plx-entity-header__details');
  // top row: the media beside the title; column and edge: the media in a column of its own, before the text
  const mediaEl = <Media media={media || { icon: DocTextIcon }} section={section} layout={lay} />;
  const lead = (
    <div className="plx-entity-header__lead">
      <div className="plx-entity-header__heading">
        {top ? mediaEl : null}
        <div className="plx-entity-header__text">
          <H className="plx-entity-header__title">{title}</H>
          {sub && !section ? <p className="plx-entity-header__subtitle">{sub}</p> : null}
        </div>
      </div>
      <div className="plx-entity-header__rule" aria-hidden="true" />
      {section ? (summary || sub ? <p className="plx-entity-header__summary">{summary || sub}</p> : null) : <Details status={st} states={states} facts={facts} strings={s} step={step} />}
    </div>
  );
  return (
    <header ref={root} className={cx('plx-entity-header', section && 'plx-entity-header--section', !aside && 'plx-entity-header--solo', className)}>
      <div className="plx-entity-header__layout">
        <div className="plx-entity-header__main">
          {top ? lead : (
            <div className={cx('plx-entity-header__split', section && 'plx-entity-header__split--section')}>
              {mediaEl}
              <div className="plx-entity-header__body">{lead}</div>
            </div>
          )}
        </div>
        {aside ? (
          <div className="plx-entity-header__aside">
            {next && !section ? (
              <div className="plx-entity-header__next">
                <p className="plx-entity-header__eyebrow">{next.label || s.next}</p>
                <p className="plx-entity-header__next-title">{next.title}</p>
                {next.detail ? <p className="plx-entity-header__next-detail">{next.detail}</p> : null}
              </div>
            ) : null}
            {control || hasActions ? (
              <div className="plx-entity-header__tools">
                {control ? <div className="plx-entity-header__control">{control}</div> : null}
                {hasActions ? <Actions actions={actions} moreActions={moreActions} size={section ? 'sm' : 'md'} strings={s} labels={actionLabels} layout={actionsLayout} /> : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
