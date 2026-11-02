/* Plenix · ComparisonView
   Summary: Two to four items or versions side by side with their differences marked (07 Data Display › Specialized
     displays › Comparison view; 10 Patterns › Review and approval › Compare): a pane per item with its name, its date or
     version, its preview and its attributes in aligned rows (columns), the same attributes as a table with a column per
     item (matrix), or two pictures over each other with a slider that moves the line between before and after
     (slider). Values that differ from the first item carry a Changed badge, the count of differences heads the view,
     and "Show only differences" hides the rows that match. Built from Platform components only.
   Usage:
     <ComparisonView label="Compare versions" items={[
         { id: 'v2', title: 'Version 2', meta: '2 Oct 2026', image: { src: v2, alt: 'Hero banner, version 2' }, values: { format: 'JPEG', size: '2.4 MB', width: '1920 px' } },
         { id: 'v3', title: 'Version 3', meta: '9 Oct 2026', image: { src: v3, alt: 'Hero banner, version 3' }, values: { format: 'PNG', size: '3.1 MB', width: '1920 px' } }]}
       attributes={[{ key: 'format', label: 'Format' }, { key: 'size', label: 'Size', kind: 'data' }, { key: 'width', label: 'Width', kind: 'data' }]}
       modes={['columns', 'matrix', 'slider']} />
   Props:
     items: the items, in order (the first is the baseline the others are compared with): [{ id, title, meta, image,
       media, content, values }]; meta a short line (a version, a date: technical values are the data font), image
       { src, alt } its picture (the preview, and the slider's layers), media a node instead of the picture, content
       more of the item under its preview (columns), values its attributes by key (text or nodes)
     attributes: the rows compared: [{ key, label, kind }]; kind "data" writes the values in the data font (sizes, dates,
       IDs, versions)
     mode: "columns" (default: panes side by side) | "matrix" (a Table: a row per attribute, a column per item) |
       "slider" (the first two items' pictures over each other); defaultMode when uncontrolled; onModeChange(mode)
     modes: the modes people can switch between (a segmented control when there are two or more; default [mode])
     highlight: marks each value that differs from the first item's with a Changed badge (default true)
     onlyDifferences, defaultOnlyDifferences, onOnlyDifferencesChange(on): "Show only differences", a switch beside the
       count when highlight is on (default off)
     scroll: the panes' bodies scroll at a fixed height and scroll together (columns; default false)
     ratio: the slider's picture shape: "16-9" (default) | "4-3" | "3-2" | "1-1"
     defaultPosition: where the slider's line starts, 0–100 (default 50)
     headingLevel: the level of the panes' headings (default 3)
     label: the view's accessible name (default strings.label)
     strings: { label: "Comparison", modes: "View", columns: "Side by side", matrix: "Table", slider: "Slider",
       onlyDifferences: "Show only differences", changed: "Changed", attribute: "Attribute", position: "Position",
       none: "No differences", one: "1 difference", many: "{n} differences", empty: "—" }
     className: more classes on the view
   Behavior:
     A value differs when its text is not the first item's; the count says how many attributes differ in any item.
     Show only differences hides every row whose values all match, in every mode, so long lists stay short.
     With scroll, scrolling one pane scrolls the others to the same place (linked scrolling), so matching rows stay side
       by side; each scrolling pane is a named region in the Tab order, scrolled with the arrow keys.
     The slider is the Platform Slider (arrows, Page Up/Down, Home, End): the first item's picture shows before the line,
       the second's after it.
     On a narrow view (600px or less) the panes stack, one under the other.
   Notes:
     Differences are marked with a badge and its word, never with color alone. Name each pane by its version and date.
     Compare at most four items side by side; let people choose which (a picker above the view) when there are more.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Badge } from '../../components/Badge/Badge.tsx';
import { SegmentedControl } from '../../components/SegmentedControl/SegmentedControl.tsx';
import { Switch } from '../../components/Checkbox/Checkbox.tsx';
import { Slider } from '../../components/Slider/Slider.tsx';
import { Table } from '../../components/Table/Table.jsx';
import { Image } from '../../components/Image/Image.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import PencilIcon from 'plenix-platform/icons/plenix/pencil';

const MODES = ['columns', 'matrix', 'slider'];
// the slider's drawing area (SVG user units; the picture fills it, cropped to the ratio)
const RATIOS = { '16-9': [1600, 900], '4-3': [1600, 1200], '3-2': [1500, 1000], '1-1': [1200, 1200] };

const text = (v) => (v === undefined || v === null ? '' : typeof v === 'object' ? '' : String(v));

export function ComparisonView({ items = [], attributes = [], mode, defaultMode = 'columns', onModeChange, modes, highlight = true, onlyDifferences, defaultOnlyDifferences = false,
  onOnlyDifferencesChange, scroll = false, ratio = '16-9', defaultPosition = 50, headingLevel = 3, label, strings, className }) {
  const t = useStrings('comparisonView', strings);
  const uid = 'plx-cmp' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const [ownMode, setOwnMode] = React.useState(MODES.indexOf(defaultMode) >= 0 ? defaultMode : 'columns');
  const current = mode !== undefined && MODES.indexOf(mode) >= 0 ? mode : ownMode;
  const [ownOnly, setOwnOnly] = React.useState(!!defaultOnlyDifferences);
  const only = onlyDifferences === undefined ? ownOnly : !!onlyDifferences;
  const [pos, setPos] = React.useState(Math.min(100, Math.max(0, Number(defaultPosition) || 0)));
  const bodies = React.useRef([]);
  const syncing = React.useRef(false);
  const choices = (modes && modes.length ? modes : [current]).filter((x) => MODES.indexOf(x) >= 0);
  const setMode = (m) => { if (mode === undefined) setOwnMode(m); if (onModeChange) onModeChange(m); };
  const setOnly = (on) => { if (onlyDifferences === undefined) setOwnOnly(on); if (onOnlyDifferencesChange) onOnlyDifferencesChange(on); };

  // which values differ from the first item's
  const base = items[0] || { values: {} };
  const differs = (it, a) => it !== base && text((it.values || {})[a.key]) !== text((base.values || {})[a.key]);
  const changedRows = attributes.filter((a) => items.some((it) => differs(it, a)));
  const rows = only && highlight ? changedRows : attributes;
  const count = changedRows.length;
  const summary = count === 0 ? t.none : count === 1 ? t.one : t.many.replace('{n}', String(count));
  const valueOf = (it, a) => {
    const v = (it.values || {})[a.key];
    const shown = v === undefined || v === null || v === '' ? t.empty : v;
    return a.kind === 'data' ? <span className="plx-comparison-view__data">{shown}</span> : shown;
  };
  const badge = (it, a) => (highlight && differs(it, a) ? <Badge tone="active" icon={PencilIcon} size="sm">{t.changed}</Badge> : null);
  const H = 'h' + Math.min(6, Math.max(2, headingLevel));

  // linked scrolling: one pane's scroll moves the others to the same place
  const onScroll = (i) => (e) => {
    if (syncing.current) return;
    syncing.current = true;
    const top = e.currentTarget.scrollTop;
    bodies.current.forEach((el, j) => { if (el && j !== i && el.scrollTop !== top) el.scrollTop = top; });
    window.requestAnimationFrame(() => { syncing.current = false; });
  };

  const bar = (
    <div className="plx-comparison-view__bar">
      <p className="plx-comparison-view__summary" aria-live="polite">{attributes.length && highlight ? summary : null}</p>
      <div className="plx-comparison-view__controls">
        {highlight && attributes.length && current !== 'slider' ? <Switch label={t.onlyDifferences} checked={only} onChange={(e) => setOnly(e.target.checked)} /> : null}
        {choices.length > 1 ? <SegmentedControl label={t.modes} size="sm" value={current} onChange={setMode}
          options={choices.map((m) => ({ value: m, label: t[m] }))} /> : null}
      </div>
    </div>
  );

  let body = null;
  if (current === 'matrix') {
    body = (
      <Table label={(label || t.label) + ': ' + t.matrix} index="key"
        columns={[{ title: t.attribute, field: 'attribute', kind: 'name', rowLabel: true }].concat(items.map((it, i) => ({
          title: it.title, field: 'i' + i, kind: 'wrap',
          render: (row) => <span className="plx-comparison-view__cell">{valueOf(it, row.a)}{badge(it, row.a)}</span>
        })))}
        data={rows.map((a) => ({ key: a.key, attribute: a.label, a }))} />
    );
  } else if (current === 'slider') {
    const [before, after] = items.filter((it) => it.image && it.image.src).slice(0, 2);
    const box = RATIOS[ratio] || RATIOS['16-9'];
    const x = (box[0] * pos) / 100;
    body = before && after ? (
      <figure className="plx-comparison-view__slider">
        <div className="plx-comparison-view__slider-head">
          <span className="plx-comparison-view__side"><span className="plx-comparison-view__title">{before.title}</span>{before.meta ? <span className="plx-comparison-view__meta">{before.meta}</span> : null}</span>
          <span className="plx-comparison-view__side plx-comparison-view__side--end"><span className="plx-comparison-view__title">{after.title}</span>{after.meta ? <span className="plx-comparison-view__meta">{after.meta}</span> : null}</span>
        </div>
        <svg className="plx-comparison-view__stage" viewBox={'0 0 ' + box[0] + ' ' + box[1]} role="img" aria-label={before.image.alt + ' · ' + after.image.alt} focusable="false">
          <defs><clipPath id={uid + '-clip'}><rect x={0} y={0} width={x} height={box[1]} /></clipPath></defs>
          <image href={after.image.src} x={0} y={0} width={box[0]} height={box[1]} preserveAspectRatio="xMidYMid slice" />
          <image href={before.image.src} x={0} y={0} width={box[0]} height={box[1]} preserveAspectRatio="xMidYMid slice" clipPath={'url(#' + uid + '-clip)'} />
          <line className="plx-comparison-view__divider" x1={x} x2={x} y1={0} y2={box[1]} vectorEffect="non-scaling-stroke" />
        </svg>
        <Slider className="plx-comparison-view__position" label={t.position} value={pos} min={0} max={100} unit="%" onChange={setPos} />
      </figure>
    ) : null;
  } else {
    body = (
      <div className={cx('plx-comparison-view__panes', 'plx-comparison-view__panes--' + Math.min(4, Math.max(1, items.length)))}>
        {items.map((it, i) => (
          <article key={it.id === undefined ? i : it.id} className="plx-comparison-view__pane" aria-labelledby={uid + '-t' + i}>
            <header className="plx-comparison-view__head">
              {React.createElement(H, { id: uid + '-t' + i, className: 'plx-comparison-view__title' }, it.title)}
              {it.meta ? <span className="plx-comparison-view__meta">{it.meta}</span> : null}
            </header>
            <div ref={(el) => { bodies.current[i] = el; }} className={cx('plx-comparison-view__body', scroll && 'plx-comparison-view__body--scroll')}
              tabIndex={scroll ? 0 : undefined} role={scroll ? 'region' : undefined} aria-label={scroll ? it.title : undefined} onScroll={scroll ? onScroll(i) : undefined}>
              {it.media ? <div className="plx-comparison-view__media">{it.media}</div>
                : it.image && it.image.src ? <div className="plx-comparison-view__media"><Image src={it.image.src} alt={it.image.alt || ''} ratio={ratio} /></div> : null}
              {it.content ? <div className="plx-comparison-view__content">{it.content}</div> : null}
              {rows.length ? (
                <dl className="plx-comparison-view__list">
                  {rows.map((a) => (
                    <div key={a.key} className="plx-comparison-view__row">
                      <dt className="plx-comparison-view__label">{a.label}</dt>
                      <dd className="plx-comparison-view__value">{valueOf(it, a)}{badge(it, a)}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    );
  }
  return (
    <section className={cx('plx-comparison-view', 'plx-comparison-view--' + current, className)} aria-label={label || t.label}>
      {bar}
      {body}
    </section>
  );
}
