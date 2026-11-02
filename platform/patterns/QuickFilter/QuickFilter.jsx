/* Plenix · QuickFilter
   Summary: An application's own shortcut beside Filter (owner, 2026-10-14): Category, Type, Tags or Date. An app that has
     categories or types shows its own button; otherwise not. The Filter panel still holds every possibility.
     kind "list" (Category, Type, Tags): a button that opens a searchable checklist of the field's values, shown as their
     pills (the GitHub labels style). kind "date" (Date): a button that opens presets (Any time, Last 7 days, Last 30 days,
     This year) and a custom range (the Google Analytics style).
   Usage:
     <QuickFilter label="Tags" icon="tags" noun="tag" options={tags} value={chosen} onChange={setChosen} />
     <QuickFilter kind="date" label="Modified" icon="calendar" value={range} onChange={setRange} />
   Props:
     kind: "list" (default) | "single" | "date"
     required: (single) hides All and Clear; defaults an empty choice to the first option
     Single choices use the same array value shape as list filters, with at most one entry.
     label: the button's words ("Category", "Type", "Tags", "Date")
     icon: its icon
     noun: (list) the word for one value, for the find field ("Find a tag")
     options: (list, single) the values: [{ value, label, color, count }] or strings; colors default to the category colors in order
     counts: optional Map (or object) from option value to faceted count; useCollectionView.quickProps supplies it
       An option's explicit count wins, including zero; without counts the existing labels remain unchanged
     value: (list) the chosen values; (date) { preset: "any" | "7" | "30" | "year" | "custom", from, to } (ISO dates)
     onChange(value): runs on every change
     inline: draws the panel alone (open, in a frame); default false
     strings: { find: "Find a {noun}", none: "No {noun} matches", clear: "Clear", presets: [{ value, label }…],
       custom: "Custom range", from: "From", to: "To" }
   Behavior:
     The button shows the choice in force (a pop-up button, Apple HIG): its label alone while it does not filter; "Status:
       Active" with one value, "Tags: Urgent +2" with more, "Modified: Last 7 days" for a date; it takes the tint while it
       filters.
     The checklist's find field fills the panel (owner, 2026-10-14); each value is a checkbox with its pill. A date
     range typed by hand chooses Custom range. Clear (the panel's footer) empties it; it is disabled while nothing is
     chosen. A required single choice omits All and Clear.
   Notes:
     The page applies the choice (useCollectionView, or matchesDate from utils/fields.ts). */
import React from 'react';
import { singleChoice } from './single-choice.js';
import { Button } from '../../components/Button/Button.tsx';
import { Checkbox, RadioGroup } from '../../components/Checkbox/Checkbox.tsx';
import { Field } from '../../components/Field/Field.tsx';
import { Input } from '../../components/Input/Input.tsx';
import { SearchField } from '../../components/SearchField/SearchField.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Inline } from '../../components/Stack/Stack.tsx';
import { formatNumber } from '../../utils/format.ts';
import { PanelTrigger, Pill, toggle } from '../CommandBar/panel-parts.jsx';
import { fill } from '../../utils/fill.ts';
import { CATEGORY_ORDER, fieldWords } from '../../utils/fields.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CalendarIcon from 'plenix-platform/icons/plenix/calendar';
import FilterOffIcon from 'plenix-platform/icons/plenix/filter-off';

// the choice in force, in words: the first chosen value's label, "+N" for the rest
const nameOf = (list, chosen) => {
  if (!chosen || !chosen.length) return undefined;
  const o = list.find((x) => x.value === chosen[0]);
  return String(o ? o.label : chosen[0]) + (chosen.length > 1 ? ' +' + (chosen.length - 1) : '');
};
const asOptions = (options) => (options || []).map((o) => (typeof o === 'string' ? { value: o } : o)).map((o, i) => Object.assign({ label: o.value, color: CATEGORY_ORDER[i % CATEGORY_ORDER.length] }, o));

export function QuickFilter({ kind = 'list', label, icon, noun = 'value', options, value, onChange, counts, required = false, inline = false, strings }) {
  const fw = useStrings('fields');
  const t = Object.assign({ presets: fieldWords.presets(fw) }, useStrings('quickFilter', strings));   // the date presets' labels are the catalog's (fields.presets)
  const [q, setQ] = React.useState('');
  const first = (options || [])[0], firstValue = typeof first === 'string' ? first : first && first.value;
  React.useEffect(() => {
    if (kind === 'single' && required && (!value || !value.length) && firstValue !== undefined && onChange) onChange([firstValue]);
  }, [kind, required, value, firstValue, onChange]);
  const countOf = (o) => o.count !== undefined ? o.count : counts instanceof Map ? counts.get(o.value) || 0 : counts ? Object.prototype.hasOwnProperty.call(counts, o.value) ? counts[o.value] : 0 : undefined;
  const counted = (o, label) => { const n = countOf(o); return n === undefined || n === null ? label : <Inline as="span" gap="xs">{label}<Text variant="data">{formatNumber(n)}</Text></Inline>; };
  if (kind === 'date') {
    const d = Object.assign({ preset: 'any', from: '', to: '' }, value);
    const range = (k, v) => onChange(Object.assign({}, d, { preset: 'custom', [k]: v }));
    const on = d.preset && d.preset !== 'any';
    const body = (
      <div className="plx-find-panel plx-find-panel--date">
        <RadioGroup label={label} value={d.preset} onChange={(v) => onChange(Object.assign({}, d, { preset: v }))}
          options={t.presets.map((x) => ({ value: x.value, label: counted(x, x.label) })).concat({ value: 'custom', label: counted({ value: 'custom' }, t.custom) })} />
        <div className="plx-find-panel__range">
          <Field label={t.from}><Input type="date" data value={d.from} onChange={(e) => range('from', e.target.value)} /></Field>
          <Field label={t.to}><Input type="date" data value={d.to} onChange={(e) => range('to', e.target.value)} /></Field>
        </div>
      </div>
    );
    const footer = <Button size="sm" variant="ghost" icon={FilterOffIcon} disabled={!on} onClick={() => onChange({ preset: 'any', from: '', to: '' })}>{t.clear}</Button>;
    const preset = t.presets.find((x) => x.value === d.preset);
    const current = !on ? undefined : d.preset === 'custom' ? [d.from, d.to].filter(Boolean).join(' – ') || t.custom : preset ? preset.label : undefined;
    return <PanelTrigger icon={icon || CalendarIcon} label={label} current={current} title={label} count={on ? 1 : 0} caret size="sm" footer={footer} inline={inline}>{body}</PanelTrigger>;
  }
  const list = asOptions(options);
  if (kind === 'single') {
    const chosen = singleChoice(list, value, required);
    const choices = list.map(o => ({ value: o.value, label: counted(o, <Pill color={o.color}>{o.label}</Pill>) }));
    if (!required) choices.unshift({ value: '', label: t.all });
    const body = <div className="plx-find-panel"><RadioGroup label={label} value={chosen.length ? chosen[0] : ''} options={choices} onChange={v => onChange(v === '' ? [] : [v])} /></div>;
    const footer = required ? null : <Button size="sm" variant="ghost" icon={FilterOffIcon} disabled={!chosen.length} onClick={() => onChange([])}>{t.clear}</Button>;
    return <PanelTrigger icon={icon} label={label} current={nameOf(list, chosen)} title={label} count={chosen.length} caret size="sm" footer={footer} inline={inline}>{body}</PanelTrigger>;
  }
  const chosen = value || [];
  const shown = list.filter((o) => String(o.label).toLowerCase().indexOf(q.trim().toLowerCase()) >= 0);
  const body = (
    <div className="plx-find-panel plx-find-panel--checklist">
      <SearchField width="fill" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} placeholder={fill(t.find, { noun })} label={fill(t.find, { noun })} />
      <div className="plx-find-panel__checklist">
        {shown.length ? shown.map((o) => <Checkbox key={o.value} label={counted(o, <Pill color={o.color}>{o.label}</Pill>)} checked={chosen.indexOf(o.value) >= 0} onChange={() => onChange(toggle(chosen, o.value))} />)
          : <Text variant="secondary">{fill(t.none, { noun })}</Text>}
      </div>
    </div>
  );
  const footer = <Button size="sm" variant="ghost" icon={FilterOffIcon} disabled={!chosen.length} onClick={() => onChange([])}>{t.clear}</Button>;
  return <PanelTrigger icon={icon} label={label} current={nameOf(list, chosen)} title={label} count={chosen.length} caret size="sm" footer={footer} inline={inline}>{body}</PanelTrigger>;
}
