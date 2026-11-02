/* Plenix · QueryBuilder, formatQuery
   Summary: Builds a query from rules and groups of rules, for advanced search, saved views, automations and audience
     rules: each rule is a field, an operator in the field type's words and a value in the field type's own control (text,
     a NumberInput, a DatePicker, a Combobox of options); a group joins its rules with And or Or and can hold groups of its
     own (nested, up to maxDepth). The text view reads the whole query back as one sentence. It uses the command bar's
     condition model (utils/fields.ts), so matchesFilter tests rows against it like FilterPanel's filter.
   Usage:
     const [query, setQuery] = React.useState({ join: 'and', items: [] });
     <QueryBuilder label="Audience" fields={fields} value={query} onChange={setQuery} matches={rows.filter((r) => matchesFilter(query, r, fields)).length} />
     formatQuery(query, fields)   // "Type is any of “Image” and (Size > 40 or Modified is within the past week)"
   Props:
     fields: the fields rules test: [{ value, label, kind: "text" | "select" | "multi" | "number" | "date", options, get }]
       (utils/fields.ts)
     value: the query: { join: "and" | "or", items: [rule | { group: true, id, join, items }] }; a rule is { id, field, op,
       value } (FilterPanel's filter, with groups to any depth)
     onChange(value): runs on every change
     label: the builder's accessible name (default "Query")
     maxDepth: how many levels of groups, the query itself counted: 1 (rules only) | 2 | 3 (default)
     view, onViewChange(view): "builder" | "text", when the page controls it; otherwise the builder keeps its own
     views: shows the Builder and Text switch (default true)
     matches: how many records the query matches, shown beside the switch ("128 matches", the number in the data font)
     strings: the words, for other languages: { builder: "Builder", text: "Text", viewLabel: "View", where: "Where",
       and: "And", or: "Or", andWord: "and", orWord: "or", join: "Match", all: "All rules", any: "Any rule",
       addRule: "Add rule", addGroup: "Add group", removeRule: "Remove rule", removeGroup: "Remove group", field: "Field",
       operator: "Operator", value: "Value", rule: "Rule {n}", group: "Group {n}", empty: "No rules: every record matches.",
       everything: "Every record", matches: "{n} matches", match: "{n} match", textTitle: "Query", added: "Rule added",
       groupAdded: "Group added", removed: "Rule removed", groupRemoved: "Group removed" }
     className: more classes on the builder
   Behavior:
     Each control is a labeled form control (Field, Operator, Value; the rule's number in its group's name). Changing the
       field gives the rule its type's first operator and an empty value; "is empty" and "is not empty" take no value.
     Add rule and Add group add at the end of their group and move focus to the new rule's field; removing moves focus to
       its group's Add rule. Each is announced.
     A rule without a value does not count yet (it matches everything), as in FilterPanel; the text view leaves it out.
     The text view is a CodeBlock of the sentence (Copy included); it is read only: people edit in the builder.
   Notes:
     For narrowing a collection in its command bar use FilterPanel (groups one level deep). The query builder is for a
     query that is its own object: a saved search, an automation's trigger, a segment. Nesting deeper than three levels is
     hard to read; keep maxDepth at 3 or less.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { announce } from '../../utils/announce.tsx';
import { formatNumber } from '../../utils/format.ts';
import { WITHIN, fieldOf, kindOf, optionsOf, newCondition, nextId, fieldWords, blank } from '../../utils/fields.ts';
import { Button } from '../../components/Button/Button.tsx';
import { Input, Select } from '../../components/Input/Input.tsx';
import { NumberInput } from '../../components/NumberInput/NumberInput.tsx';
import { DatePicker } from '../../components/DatePicker/DatePicker.jsx';
import { Combobox } from '../../components/Combobox/Combobox.tsx';
import { SegmentedControl } from '../../components/SegmentedControl/SegmentedControl.tsx';
import { CodeBlock } from '../../components/CodeBlock/CodeBlock.jsx';
import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { createTranslator } from '../../providers/LocaleProvider.tsx';
import { formatLocale } from '../../utils/format.ts';
import PlusIcon from 'plenix-platform/icons/plenix/plus';
import TrashIcon from 'plenix-platform/icons/plenix/trash';
import { fill } from '../../utils/fill.ts';

const NO_VALUE = { empty: true, nempty: true };
const quote = (s) => '“' + s + '”';

// the query as one sentence: rules in the field type's words, groups in parentheses; unfinished rules left out
export function formatQuery(node, fields = [], strings) {
  const t = Object.assign({}, createTranslator(formatLocale()).section('queryBuilder'), strings);   // a plain function: no hook
  const fw = createTranslator(formatLocale()).section('fields');   // a plain function: no hook
  const words = (f, op) => (fieldWords.operators(fw, kindOf(f)).find((o) => o[0] === op) || [op, op])[1];
  const rule = (c) => {
    const f = fieldOf(fields, c.field);
    if (!f) return null;
    if (NO_VALUE[c.op]) return f.label + ' ' + words(f, c.op);
    if (blank(c.value)) return null;
    const k = kindOf(f);
    let v;
    if (k === 'select' || k === 'multi') { const o = optionsOf(f); v = [].concat(c.value).map((x) => quote((o.find((p) => p.value === x) || { label: x }).label)).join(', '); }
    else if (k === 'date' && c.op === 'within') v = (fieldWords.within(fw).find((w) => w.value === c.value) || fieldWords.within(fw)[0]).label;
    else if (k === 'text') v = quote(c.value);
    else v = String(c.value);
    return f.label + ' ' + words(f, c.op) + ' ' + v;
  };
  const group = (g, top) => {
    const parts = (g.items || []).map((x) => (x.group ? group(x, false) : rule(x))).filter(Boolean);
    if (!parts.length) return null;
    const s = parts.join(' ' + (g.join === 'or' ? t.orWord : t.andWord) + ' ');
    return top || parts.length < 2 ? s : '(' + s + ')';
  };
  return group(node || { items: [] }, true) || t.everything;
}

function Count({ n, t }) {
  const [before, after] = (n === 1 ? t.match : t.matches).split('{n}');
  return <span className="plx-query-builder__matches" aria-live="polite">{before}<span className="plx-query-builder__number">{formatNumber(n)}</span>{after}</span>;
}

// a form control with its hidden label (the rule's controls sit in a row: their names are read, not shown)
const Labeled = ({ id, text, children }) => <>{<VisuallyHidden as="label" htmlFor={id}>{text}</VisuallyHidden>}{children}</>;

function RuleValue({ c, f, set, id, label }) {
  const fw = useStrings('fields');
  const k = kindOf(f);
  if (NO_VALUE[c.op]) return <span className="plx-query-builder__value plx-query-builder__value--none" />;
  let control;
  if (k === 'select' || k === 'multi') {
    control = <Combobox id={id} multiple className="plx-query-builder__value" options={optionsOf(f).map((o) => ({ value: o.value, label: o.label }))}
      values={[].concat(c.value || [])} onChange={(v) => set({ value: v })} />;
  } else if (k === 'date' && c.op === 'within') {
    control = <Select id={id} className="plx-query-builder__value" value={c.value || WITHIN[0].value} options={fieldWords.within(fw).map((w) => ({ value: w.value, label: w.label }))} onChange={(e) => set({ value: e.target.value })} />;
  } else if (k === 'date') {
    control = <DatePicker id={id} className="plx-query-builder__value" value={c.value || null} onChange={(v) => set({ value: v || '' })} />;
  } else if (k === 'number') {
    control = <NumberInput id={id} className="plx-query-builder__value" value={blank(c.value) ? null : Number(c.value)} onChange={(v) => set({ value: v === null || v === undefined ? '' : v })} />;
  } else {
    control = <Input id={id} className="plx-query-builder__value" value={c.value || ''} onChange={(e) => set({ value: e.target.value })} />;
  }
  return <Labeled id={id} text={label}>{control}</Labeled>;
}

function Rule({ c, index, fields, uid, put, remove, t }) {
  const fw = useStrings('fields');
  const f = fieldOf(fields, c.field);
  const base = uid + '-' + c.id;
  const name = fill(t.rule, { n: index + 1 });
  return (
    <div className="plx-query-builder__rule" role="group" aria-label={name} data-plx-rule={c.id}>
      <Labeled id={base + '-f'} text={name + ', ' + t.field}>
        <Select id={base + '-f'} className="plx-query-builder__field" value={c.field} options={fields.map((x) => ({ value: x.value, label: x.label }))}
          onChange={(e) => put(newCondition(fieldOf(fields, e.target.value)))} />
      </Labeled>
      <Labeled id={base + '-o'} text={name + ', ' + t.operator}>
        <Select id={base + '-o'} className="plx-query-builder__operator" value={c.op} options={fieldWords.operators(fw, kindOf(f)).map(([value, label]) => ({ value, label }))}
          onChange={(e) => { const op = e.target.value; put({ op, value: op === 'within' ? WITHIN[0].value : c.op === 'within' || NO_VALUE[op] ? '' : c.value }); }} />
      </Labeled>
      <RuleValue c={c} f={f} set={put} id={base + '-v'} label={name + ', ' + t.value} />
      <Button size="sm" variant="ghost" icon={TrashIcon} iconOnly label={name + ': ' + t.removeRule} className="plx-query-builder__remove" onClick={remove} />
    </div>
  );
}

function Group({ node, setNode, depth, index, maxDepth, fields, uid, focus, onRemove, t }) {
  const items = node.items || [];
  const setItems = (list) => setNode(Object.assign({}, node, { items: list }));
  const put = (i, ch) => setItems(items.map((x, j) => (j === i ? Object.assign({}, x, ch) : x)));
  const addRule = () => { const c = newCondition(fields[0]); setItems(items.concat(c)); focus.current = { rule: c.id }; announce(t.added); };
  const addGroup = () => { const c = newCondition(fields[0]); setItems(items.concat({ id: nextId(), group: true, join: 'and', items: [c] })); focus.current = { rule: c.id }; announce(t.groupAdded); };
  const removeAt = (i) => { const g = items[i].group; setItems(items.filter((_, j) => j !== i)); focus.current = { add: node.id || 'root' }; announce(g ? t.groupRemoved : t.removed); };
  const joinWord = node.join === 'or' ? t.orWord : t.andWord;
  const name = depth ? fill(t.group, { n: index + 1 }) : null;
  let groups = 0;
  return (
    <div className="plx-query-builder__group" data-plx-depth={Math.min(depth, 2)} role={depth ? 'group' : undefined} aria-label={name || undefined}>
      <div className="plx-query-builder__group-head">
        <SegmentedControl size="sm" label={(name ? name + ', ' : '') + t.join} value={node.join === 'or' ? 'or' : 'and'}
          options={[{ value: 'and', label: t.and }, { value: 'or', label: t.or }]} onChange={(v) => setNode(Object.assign({}, node, { join: v }))} />
        <span className="plx-query-builder__hint">{node.join === 'or' ? t.any : t.all}</span>
        {onRemove ? <Button size="sm" variant="ghost" icon={TrashIcon} iconOnly label={name + ': ' + t.removeGroup} className="plx-query-builder__remove" onClick={onRemove} /> : null}
      </div>
      {items.length ? (
        <ul className="plx-query-builder__items">
          {items.map((x, i) => (
            <li key={x.id} className={cx('plx-query-builder__item', x.group && 'plx-query-builder__item--group')}>
              <span className="plx-query-builder__join" aria-hidden="true">{i === 0 ? t.where : joinWord}</span>
              {x.group
                ? <Group node={x} setNode={(n) => put(i, n)} depth={depth + 1} index={groups++} maxDepth={maxDepth} fields={fields} uid={uid} focus={focus} onRemove={() => removeAt(i)} t={t} />
                : <Rule c={x} index={i} fields={fields} uid={uid} put={(ch) => put(i, ch)} remove={() => removeAt(i)} t={t} />}
            </li>
          ))}
        </ul>
      ) : <p className="plx-query-builder__empty">{t.empty}</p>}
      <div className="plx-query-builder__add" data-plx-add={node.id || 'root'}>
        <Button size="sm" variant="ghost" icon={PlusIcon} disabled={!fields.length} onClick={addRule}>{t.addRule}</Button>
        {depth + 1 < maxDepth ? <Button size="sm" variant="ghost" icon={PlusIcon} disabled={!fields.length} onClick={addGroup}>{t.addGroup}</Button> : null}
      </div>
    </div>
  );
}

export function QueryBuilder({ fields = [], value, onChange, label, maxDepth = 3, view: viewProp, onViewChange, views = true, matches, strings, className }) {
  const t = useStrings('queryBuilder', strings);
  label = label ?? t.textTitle;
  const node = value || { join: 'and', items: [] };
  const [own, setOwn] = React.useState('builder');
  const view = viewProp || own;
  const setView = (v) => { if (!viewProp) setOwn(v); if (onViewChange) onViewChange(v); };
  const uid = 'plx-qb-' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const root = React.useRef(null), focus = React.useRef(null);
  // after an add or a remove: the new rule's field, or the group's Add rule
  React.useEffect(() => {
    const want = focus.current, el = root.current;
    if (!want || !el) return;
    focus.current = null;
    const target = want.rule ? el.querySelector('[data-plx-rule="' + want.rule + '"] select') : el.querySelector('[data-plx-add="' + want.add + '"] button');
    if (target) target.focus();
  });
  const depth = Math.max(1, Math.min(3, maxDepth));
  return (
    <div ref={root} className={cx('plx-query-builder', className)} role="group" aria-label={label}>
      {views || typeof matches === 'number' ? (
        <div className="plx-query-builder__bar">
          {views ? <SegmentedControl size="sm" label={t.viewLabel} value={view} options={[{ value: 'builder', label: t.builder }, { value: 'text', label: t.text }]} onChange={setView} /> : null}
          {typeof matches === 'number' ? <Count n={matches} t={t} /> : null}
        </div>
      ) : null}
      {view === 'text'
        ? <CodeBlock language="text" title={t.textTitle} className="plx-query-builder__text">{formatQuery(node, fields, t)}</CodeBlock>
        : <Group node={node} setNode={onChange} depth={0} index={0} maxDepth={depth} fields={fields} uid={uid} focus={focus} t={t} />}
    </div>
  );
}
