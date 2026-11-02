/* Plenix · VersionCompare, diffLines
   Summary: What changed between two versions of one item (12 Specialized › Files, assets, and DAM › Version comparison):
     the two version pickers (Compare … with …, and Swap) above the ComparisonView of the two, side by side with their
     changed attributes marked (side by side), or their pictures over each other with the line people move (slider), or
     the text's lines with the added and removed ones marked and Previous and Next change to step through them (text
     diff). Built from Platform components only: Select, Field, Button, SegmentedControl and ComparisonView.
   Usage:
     <VersionCompare label="Compare versions of Easter banner" versions={[
         { id: 'v2', label: 'Version 2', date: '2026-10-02', author: 'Maya Chen', image: { src: v2, alt: 'Easter banner, version 2' }, values: { size: '2.4 MB' }, text: '…' },
         { id: 'v3', label: 'Version 3', date: '2026-10-09', author: 'Alex Kim', image: { src: v3, alt: 'Easter banner, version 3' }, values: { size: '3.1 MB' }, text: '…' }]}
       attributes={[{ key: 'size', label: 'Size', kind: 'data' }]} defaultBase="v2" defaultTarget="v3" />
   Props:
     versions: the versions, newest last or in any order: [{ id, label ("Version 3"), date ("YYYY-MM-DD" or a Date), author,
       image { src, alt }, media (a node instead of the picture), values (the attributes by key), text (the content as
       text, for the text diff) }] (required)
     attributes: the attributes compared side by side: [{ key, label, kind: "data" }] (ComparisonView's)
     base: the baseline version's id (Compare), kept by the page
     defaultBase: the first baseline when the view keeps it (default the second to last version)
     target: the other version's id (With), kept by the page
     defaultTarget: the first other version when the view keeps it (default the last version)
     onChange(pair): runs with { base, target } when people pick or swap
     mode: "columns" (side by side) | "slider" | "text", kept by the page
     defaultMode: the first view when the view keeps it (default "columns")
     onModeChange(mode): runs when people switch views
     modes: the views people can switch between (default: side by side, plus the slider when both versions have a picture
       and the text diff when both have text)
     context: the unchanged lines kept around each change in the text diff; longer runs fold into "Show N unchanged
       lines" (default 3)
     ratio: the pictures' shape ("16-9" default, "4-3", "3-2", "1-1")
     scroll: the panes scroll together at a fixed height (ComparisonView; default false)
     label: the view's accessible name (default strings.label)
     strings: { label: "Version comparison", compare: "Compare", with: "With", swap: "Swap", swapLabel: "Swap the two
       versions", view: "View", columns: "Side by side", slider: "Slider", text: "Text", by: "by {author}", diff:
       "Changes from {base} to {target}", added: "Added", removed: "Removed", same: "No changes in the text", summary:
       "{added} added, {removed} removed", lines: "{n} lines", line: "1 line", previous: "Previous change", next: "Next
       change", at: "Change {n} of {total}", unchanged: "Show {n} unchanged lines", empty: "Choose two versions to compare." }
     className: more classes on the view
   Behavior:
     Each picker lists every version but the one the other picker shows; Swap exchanges them. The first (Compare) is
       the baseline: the second's changed values carry ComparisonView's Changed badge, its added lines are marked
       Added, the first's removed lines Removed.
     The text diff compares line by line (the longest common subsequence): an added line has a plus and "Added" for
       screen readers, a removed one a minus and "Removed", never only a color; both line numbers are in the data font.
       Unchanged runs longer than the context fold into a button that shows them. Previous change and Next change move
       the focus to the change's first line and say which change it is ("Change 2 of 5"); the lines are a named region in
       the Tab order that scrolls with the arrow keys.
     Side by side and the slider are ComparisonView's (Show only differences, linked scrolling, the Platform Slider).
     On a narrow view the pickers stack, then the panes (ComparisonView).
   Notes:
     Label each side by its version and date, always. A list of changed fields alone (only metadata changed) is the
     side-by-side view with Show only differences on; versions of different items are not compared here.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { formatDate, formatNumber } from '../../utils/format.ts';
import { announce } from '../../utils/announce.tsx';
import { useUid } from '../../utils/layer.ts';
import { Field } from '../../components/Field/Field.tsx';
import { Select } from '../../components/Input/Input.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { SegmentedControl } from '../../components/SegmentedControl/SegmentedControl.tsx';
import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { ComparisonView } from '../ComparisonView/ComparisonView.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';
import ChevronUpIcon from 'plenix-platform/icons/plenix/chevron-up';
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import DocSearchIcon from 'plenix-platform/icons/plenix/doc-search';
import { dataPhrase } from '../../utils/dataText.tsx';
import { fill } from '../../utils/fill.ts';

// the lines of two texts, compared: [{ kind: "same" | "add" | "del", text, a (the line number before), b (after) }]
export function diffLines(before, after) {
  const A = String(before || '').split('\n'), B = String(after || '').split('\n');
  const n = A.length, m = B.length;
  const out = [];
  if (n * m > 4000000) {   // too large to compare line by line: everything before removed, everything after added
    A.forEach((text, i) => out.push({ kind: 'del', text, a: i + 1 }));
    B.forEach((text, j) => out.push({ kind: 'add', text, b: j + 1 }));
    return out;
  }
  // the longest common subsequence, from the end
  const L = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { out.push({ kind: 'same', text: A[i], a: i + 1, b: j + 1 }); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) { out.push({ kind: 'del', text: A[i], a: i + 1 }); i++; }
    else { out.push({ kind: 'add', text: B[j], b: j + 1 }); j++; }
  }
  while (i < n) { out.push({ kind: 'del', text: A[i], a: i + 1 }); i++; }
  while (j < m) { out.push({ kind: 'add', text: B[j], b: j + 1 }); j++; }
  return out;
}

function TextDiff({ base, target, context, t, uid }) {
  const lines = React.useMemo(() => diffLines(base.text, target.text), [base.text, target.text]);
  const [shown, setShown] = React.useState({});   // the folded runs people opened, by their first index
  const [at, setAt] = React.useState(-1);
  const refs = React.useRef({});
  React.useEffect(() => { setShown({}); setAt(-1); }, [base.id, target.id]);
  const added = lines.filter((x) => x.kind === 'add').length, removed = lines.filter((x) => x.kind === 'del').length;
  const count = (k) => (k === 1 ? t.line : fill(t.lines, { n: formatNumber(k) }));
  // where each change starts (a run of added and removed lines)
  const starts = lines.reduce((a, x, i) => (x.kind !== 'same' && (i === 0 || lines[i - 1].kind === 'same') ? a.concat(i) : a), []);
  // the rows: unchanged runs longer than the context on both sides fold
  const rows = [];
  let k = 0;
  while (k < lines.length) {
    if (lines[k].kind !== 'same') { rows.push({ line: lines[k], i: k }); k++; continue; }
    let e = k; while (e < lines.length && lines[e].kind === 'same') e++;
    const lead = k === 0 ? 0 : context, tail = e === lines.length ? 0 : context;
    if (e - k > lead + tail + 1 && !shown[k]) {
      for (let x = k; x < k + lead; x++) rows.push({ line: lines[x], i: x });
      rows.push({ fold: true, from: k + lead, n: e - k - lead - tail, key: k });
      for (let x = e - tail; x < e; x++) rows.push({ line: lines[x], i: x });
    } else for (let x = k; x < e; x++) rows.push({ line: lines[x], i: x });
    k = e;
  }
  const go = (step) => {
    if (!starts.length) return;
    const next = at < 0 ? (step > 0 ? 0 : starts.length - 1) : (at + step + starts.length) % starts.length;
    setAt(next);
    const el = refs.current[starts[next]];
    if (el) { el.focus(); if (el.scrollIntoView) el.scrollIntoView({ block: 'nearest' }); }
    announce(fill(t.at, { n: formatNumber(next + 1), total: formatNumber(starts.length) }));
  };
  if (!added && !removed) return <EmptyState icon={CircleCheckIcon} title={t.same} />;
  return (
    <div className="plx-version-compare__diff">
      <div className="plx-version-compare__diff-bar">
        <p className="plx-version-compare__summary">{fill(t.summary, { added: count(added), removed: count(removed) })}</p>
        <span className="plx-version-compare__steps">
          <Button size="sm" variant="ghost" icon={ChevronUpIcon} onClick={() => go(-1)}>{t.previous}</Button>
          <Button size="sm" variant="ghost" icon={ChevronDownIcon} onClick={() => go(1)}>{t.next}</Button>
        </span>
      </div>
      <div className="plx-version-compare__lines" tabIndex={0} role="region" aria-label={fill(t.diff, { base: base.label, target: target.label })}>
        <ol className="plx-version-compare__list">
          {rows.map((r) => {
            if (r.fold) {
              return (
                <li key={'fold' + r.key} className="plx-version-compare__fold">
                  <Button size="xs" variant="ghost" icon={ChevronDownIcon} onClick={() => setShown(Object.assign({}, shown, { [r.key]: true }))}>{dataPhrase(t.unchanged, { n: r.n })}</Button>
                </li>
              );
            }
            const x = r.line, isStart = starts.indexOf(r.i) >= 0;
            return (
              <li key={r.i} id={uid + '-l' + r.i} ref={isStart ? (el) => { refs.current[r.i] = el; } : undefined} tabIndex={isStart ? -1 : undefined}
                className={cx('plx-version-compare__line', x.kind === 'add' && 'plx-version-compare__line--added', x.kind === 'del' && 'plx-version-compare__line--removed')}>
                <span className="plx-version-compare__number" aria-hidden="true">{x.a || ''}</span>
                <span className="plx-version-compare__number" aria-hidden="true">{x.b || ''}</span>
                <span className="plx-version-compare__sign" aria-hidden="true">{x.kind === 'add' ? '+' : x.kind === 'del' ? '−' : ''}</span>
                <span className="plx-version-compare__text">{x.kind === 'add' ? <VisuallyHidden>{t.added + ': '}</VisuallyHidden> : x.kind === 'del' ? <VisuallyHidden>{t.removed + ': '}</VisuallyHidden> : null}{x.text || ' '}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function VersionCompare({ versions = [], attributes = [], base, defaultBase, target, defaultTarget, onChange, mode, defaultMode = 'columns', onModeChange, modes, context = 3,
  ratio = '16-9', scroll = false, label, strings, className }) {
  const t = useStrings('versionCompare', strings);
  const uid = useUid('plx-version-compare');
  const ids = versions.map((v) => v.id);
  const [own, setOwn] = React.useState({ base: defaultBase !== undefined ? defaultBase : ids[ids.length - 2], target: defaultTarget !== undefined ? defaultTarget : ids[ids.length - 1] });
  const pair = { base: base !== undefined ? base : own.base, target: target !== undefined ? target : own.target };
  const setPair = (next) => { if (base === undefined && target === undefined) setOwn(next); if (onChange) onChange(next); };
  const a = versions.find((v) => v.id === pair.base), b = versions.find((v) => v.id === pair.target);
  const all = ['columns'].concat(a && b && a.image && b.image ? ['slider'] : [], a && b && typeof a.text === 'string' && typeof b.text === 'string' ? ['text'] : []);
  const choices = (modes && modes.length ? modes : all).filter((m) => ['columns', 'slider', 'text'].indexOf(m) >= 0);
  const [ownMode, setOwnMode] = React.useState(defaultMode);
  const want = mode !== undefined ? mode : ownMode;
  const current = choices.indexOf(want) >= 0 ? want : choices[0] || 'columns';
  const setMode = (m) => { if (mode === undefined) setOwnMode(m); if (onModeChange) onModeChange(m); };
  const metaOf = (v) => [v.date ? formatDate(v.date, { dateStyle: 'medium' }) : null, v.author ? fill(t.by, { author: v.author }) : null].filter(Boolean).join(' · ');
  const optionLabel = (v) => [v.label, v.date ? formatDate(v.date, { dateStyle: 'medium' }) : null].filter(Boolean).join(' · ');
  const pick = (which, other) => versions.filter((v) => v.id !== pair[other]).map((v) => ({ value: v.id, label: optionLabel(v) }));
  const item = (v) => ({ id: v.id, title: v.label, meta: metaOf(v), image: v.image, media: v.media, values: v.values || {} });

  const body = !a || !b ? <EmptyState icon={DocSearchIcon} title={t.empty} />
    : current === 'text' ? <TextDiff base={a} target={b} context={context} t={t} uid={uid} />
      : <ComparisonView label={label || t.label} items={[item(a), item(b)]} attributes={attributes} mode={current} modes={[current]} ratio={ratio} scroll={scroll} />;
  return (
    <section className={cx('plx-version-compare', 'plx-version-compare--' + current, className)} aria-label={label || t.label}>
      <div className="plx-version-compare__pickers">
        <Field label={t.compare} className="plx-version-compare__picker">
          <Select value={pair.base || ''} options={pick('base', 'target')} onChange={(e) => setPair({ base: e.target.value, target: pair.target })} />
        </Field>
        <Button className="plx-version-compare__swap" variant="ghost" size="sm" aria-label={t.swapLabel} onClick={() => setPair({ base: pair.target, target: pair.base })}>{t.swap}</Button>
        <Field label={t.with} className="plx-version-compare__picker">
          <Select value={pair.target || ''} options={pick('target', 'base')} onChange={(e) => setPair({ base: pair.base, target: e.target.value })} />
        </Field>
        {choices.length > 1 ? (
          <SegmentedControl className="plx-version-compare__modes" label={t.view} size="sm" value={current} onChange={setMode}
            options={choices.map((m) => ({ value: m, label: t[m] }))} />
        ) : null}
      </div>
      {body}
    </section>
  );
}
