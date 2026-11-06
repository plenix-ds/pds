/* Plenix · DataGrid engine · Form Edit (the record in a drawer or dialog)
   Summary: The Form Edit way of editing a row (ADR 0016, #84 F2; design form-edit.md): FormFlow's drawer (or dialog) titled "Edit <name>", one field per
     visible column in the table's order. An editable column is a Field (its title above its control, the column's editor at form size, with its own
     border and fill); another column is its title over its value as plain text, an empty one a dash that a screen reader reads as "No value". Save
     calls onRecordEdit(record, changes) with only the changed fields (without it, onCellEdit runs for each changed cell); a value `validate` refuses
     shows under its field and stops the save; a refused save keeps the form open with every value and shows the application's message.
   Usage:
     <FormEdit record={record} rowKey={key} columns={visibleColumns} isEditable={(c) => …} name="Person 1" types={['select']} surface="drawer"
       onRecordEdit={…} commitEdit={…} onClose={() => …} S={strings} />
   Props:
     record, rowKey: the row being edited and its key; columns: the visible columns in order; isEditable(column): whether the record's cell can be edited;
     name: the record's name (the key column's value); types: the editor types the table turned on (editing.types); surface: "drawer" (default) | "dialog";
     onRecordEdit(record, changes): saves; may return a promise; commitEdit(key, field, value): the fallback; onClose(): after Save or Cancel; S: the grid's strings.
   Notes:
     Loaded on first use (one dynamic import from DataGridEngine.jsx), so a table that never edits in a form does not carry it.
*/
import React from 'react';
import { FormFlow } from '../../../patterns/FormFlow/FormFlow.jsx';
import { Field } from '../../Field/Field.tsx';
import { Input, Select, Textarea } from '../../Input/Input.tsx';
import { NumberInput } from '../../NumberInput/NumberInput.tsx';
import { DatePicker } from '../../DatePicker/DatePicker.tsx';
import { Checkbox } from '../../Checkbox/Checkbox.tsx';
import { Combobox } from '../../Combobox/Combobox.tsx';
import { EntityPicker } from '../../EntityPicker/EntityPicker.jsx';
import { ErrorSummary } from '../../ErrorSummary/ErrorSummary.tsx';
import { Text } from '../../Text/Text.tsx';
import { VisuallyHidden } from '../../VisuallyHidden/VisuallyHidden.tsx';
import { useDirection } from '../../../providers/DirectionProvider.tsx';
import { valueText } from '../cells.jsx';
import { valueAt } from '../state.js';

const BUILT_IN = ['select', 'combobox', 'tags', 'date', 'checkbox', 'textarea', 'person'];
// the kind of control a column's editor gets in the form: input and number always; the other built-in types only when the table turned them on
function kindOf(column, types) {
  const e = column.editor;
  if (e && typeof e === 'object' && typeof e.component === 'function') return 'custom';
  if (e === 'number') return 'number';
  return BUILT_IN.includes(e) && (types || []).includes(e) ? e : 'input';
}

const idOf = (column) => 'plx-form-edit-' + String(column.field).replace(/[^\w-]/g, '-');
function Control({ column, kind, value, set, invalid, record }) {
  const label = column.title,
    id = idOf(column),
    options = column.editorProps?.options ?? [],
    load = column.editorProps?.loadOptions,
    { dir } = useDirection();
  switch (kind) {
    case 'number':
      return <NumberInput id={id} value={value ?? null} onChange={set} aria-label={label} />;
    case 'textarea':
      return <Textarea id={id} value={value ?? ''} onChange={(e) => set(e.target.value)} autoGrow aria-label={label} />;
    case 'select':
      return <Select id={id} options={options} value={value ?? ''} onChange={(e) => set(e.target.value)} aria-label={label} block />;
    case 'date':
      return <DatePicker id={id} value={value || null} onChange={set} width="fill" aria-label={label} />;
    case 'checkbox':
      return <Checkbox id={id} checked={!!value} onChange={(e) => set(e.target.checked)} aria-label={label} />;
    case 'combobox':
      return <Combobox id={id} {...(load ? { loadOptions: load } : { options })} value={value ?? ''} onChange={set} label={label} width="fill" />;
    case 'tags':
      return <Combobox id={id} multiple creatable {...(load ? { loadOptions: load } : { options })} values={Array.isArray(value) ? value : []} onChange={set} label={label} width="fill" />;
    case 'person':
      return <EntityPicker id={id} kind="people" {...(load ? { loadOptions: load } : { options })} value={value ?? ''} onChange={set} label={label} width="fill" />;
    case 'custom': {
      const Editor = column.editor.component;
      return <Editor {...(column.editor.props || {})} value={value} record={record} field={column.field} dir={dir} autoFocus={false} invalid={invalid || undefined}
        onChange={set} onCommit={(v) => { if (v !== undefined) set(v); }} onCancel={() => {}} />;
    }
    default:
      return <Input id={id} value={value ?? ''} onChange={(e) => set(e.target.value)} aria-label={label} />;
  }
}

export default function FormEdit({ record, rowKey, columns, isEditable, name, types, surface = 'drawer', onRecordEdit, commitEdit, onClose, S }) {
  const editable = columns.filter((c) => c.editor && isEditable(c)),
    initial = React.useMemo(() => Object.fromEntries(editable.map((c) => [c.field, valueAt(record, c.field)])), [record]),
    [errors, setErrors] = React.useState({}),
    [refusal, setRefusal] = React.useState(null);
  const title = S.formTitle.replace('{name}', name);
  const validate = async (value) => {
    const found = {};
    for (const c of editable) {
      const message = c.validate ? await c.validate(value[c.field], record) : null;
      if (message) found[c.field] = message;
    }
    setErrors(found);
    const first = editable.find((c) => found[c.field]);
    if (first) setTimeout(() => document.getElementById(idOf(first))?.focus(), 0);
    return first ? false : '';
  };
  const submit = async (value) => {
    const changes = {};
    for (const c of editable) if (!Object.is(value[c.field], initial[c.field])) changes[c.field] = value[c.field];
    setRefusal(null);
    try {
      if (onRecordEdit) await onRecordEdit(record, changes);
      else for (const [field, v] of Object.entries(changes)) commitEdit(rowKey, field, v);
    } catch (error) {
      setRefusal((error && error.message) || S.formSaveRefused.replace('{name}', name));
      throw error;
    }
  };
  return (
    <FormFlow
      mode="edit"
      surface={surface === 'dialog' ? 'dialog' : 'drawer'}
      title={title}
      initialValue={initial}
      sessionKey={String(rowKey)}
      validate={validate}
      onSubmit={submit}
      onSuccess={onClose}
      onCancel={onClose}
      strings={{ saved: S.formSaved.replace('{name}', name), failed: '' }}
    >
      {({ value, setValue }) => (
        <>
          {refusal ? <ErrorSummary errors={[{ target: idOf(editable[0] || columns[0]), message: refusal }]} /> : null}
          {columns.map((c) => {
            if (editable.includes(c)) {
              return (
                <Field key={c.field} label={c.title} error={errors[c.field]}>
                  <Control column={c} kind={kindOf(c, types)} value={value[c.field]} record={record} invalid={errors[c.field]} set={(v) => setValue({ ...value, [c.field]: v })} />
                </Field>
              );
            }
            const shown = valueAt(record, c.field);
            const empty = shown === undefined || shown === null || shown === '';
            return (
              <div key={c.field} className="plx-field">
                <span className="plx-field__label">{c.title}</span>
                <Text as="div">
                  {empty ? (
                    <>
                      <span aria-hidden="true">{S.emptyValue}</span>
                      <VisuallyHidden>{S.noValue}</VisuallyHidden>
                    </>
                  ) : (
                    valueText(shown)
                  )}
                </Text>
              </div>
            );
          })}
        </>
      )}
    </FormFlow>
  );
}
