/* Plenix · DataGrid engine · Form Edit (the record in a drawer or dialog)
   Summary: The Form Edit way of editing a row (ADR 0016, #84 F2; design form-edit.md): FormFlow's drawer (or dialog) titled "Edit <name>", one field per
     visible column in the table's order. An editable column is a Field (its title above its control, the column's editor at form size, with its own
     border and fill); another column is its title over its value as plain text, an empty one a dash that a screen reader reads as "No value". Save
     calls onRecordEdit(record, changes) with only the changed fields (without it, onCellEdit runs for each changed cell); a value `validate` refuses
     shows under its field and stops the save; a refused save keeps the form open with every value and shows the application's message.
   Usage:
     <FormEdit record={record} rowKey={key} columns={visibleColumns} isEditable={(c) => …} name="Person 1" types={['select']} surface="drawer"
       onRecordEdit={…} commitEdit={…} commitCells={…} recordEdited={…} onClose={() => …} S={strings} />
   Props:
     record, rowKey: the row being edited and its key; columns: the visible columns in order; isEditable(column): whether the record's cell can be edited;
     name: the record's name (the key column's value); types: the editor types the table turned on (editing.types); surface: "drawer" (default) | "dialog";
     onRecordEdit(record, changes): saves; may return a promise; commitEdit(key, field, value): the fallback; commitCells(key, changes) saves the changed fields as one undo step and recordEdited(key, changes) remembers a record the application saved (editing.undo); onClose(): after Save or Cancel; S: the grid's strings.
   Notes:
     Loaded on first use (one dynamic import from DataGridEngine.tsx), so a table that never edits in a form does not carry it.
*/
import React from 'react';
import { createPortal } from 'react-dom';
import { development } from '../../../utils/devWarn.ts';
import { FormFlow } from '../../../patterns/FormFlow/FormFlow.jsx';
import { Field } from '../../Field/Field.tsx';
import { Input, Select, Textarea } from '../../Input/Input.tsx';
import { NumberInput } from '../../NumberInput/NumberInput.tsx';
import { DatePicker } from '../../DatePicker/DatePicker.tsx';
import { Checkbox } from '../../Checkbox/Checkbox.tsx';
import { Combobox } from '../../Combobox/Combobox.tsx';
import { EntityPicker } from '../../EntityPicker/EntityPicker.tsx';
import { ErrorSummary } from '../../ErrorSummary/ErrorSummary.tsx';
import { Text } from '../../Text/Text.tsx';
import { VisuallyHidden } from '../../VisuallyHidden/VisuallyHidden.tsx';
import { useDirection } from '../../../providers/DirectionProvider.tsx';
import { valueText } from '../cells.tsx';
import { valueAt } from '../state.ts';

const BUILT_IN = ['select', 'combobox', 'tags', 'date', 'checkbox', 'textarea', 'person'];
// the kind of control a column's editor gets in the form: input and number always; the other built-in types only when the table turned them on
function kindOf(column: any, types: any) {
  const e = column.editor;
  if (e && typeof e === 'object' && typeof e.component === 'function') return 'custom';
  if (e === 'number') return 'number';
  return BUILT_IN.includes(e) && (types || []).includes(e) ? e : 'input';
}

const idOf = (column: any) => 'plx-form-edit-' + String(column.field).replace(/[^\w-]/g, '-');
function Control({ column, kind, value, set, invalid, record }: any) {
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
        onChange={set} onCommit={(v: any) => { if (v !== undefined) set(v); }} onCancel={() => {}} />;
    }
    default:
      return <Input id={id} value={value ?? ''} onChange={(e) => set(e.target.value)} aria-label={label} />;
  }
}

export default function FormEdit({ record, rowKey, columns, isEditable, name, types, surface = 'drawer', renderForm, openKey, onRecordEdit, commitEdit, commitCells, recordEdited, onClose, S }: any) {
  const editable = columns.filter((c: any) => c.editor && isEditable(c)),
    initial = React.useMemo(() => Object.fromEntries(editable.map((c: any) => [c.field, valueAt(record, c.field)])), [record]),
    [errors, setErrors] = React.useState<any>({}),
    [refusal, setRefusal] = React.useState<any>(null);
  const title = S.formTitle.replace('{name}', name);
  // formSurface={{ panel: ref }} (ADR 0016 addendum): the whole form goes into the application's own panel, which is marked while it is open; no element: the drawer
  const wantsPanel = surface && typeof surface === 'object',
    panelEl = wantsPanel ? surface.panel?.current ?? null : null;
  const [moved, setMoved] = React.useState(false);
  React.useEffect(() => {
    if (wantsPanel && !panelEl && development()) console.warn('[Plenix] DataGrid: formSurface.panel has no element; the form opens in the drawer');
    if (!panelEl || moved) return undefined;
    panelEl.setAttribute('data-plx-form-open', '');
    return () => panelEl.removeAttribute('data-plx-form-open');
  }, [panelEl, wantsPanel, moved]);
  // the application's close button moves the open row away from the edited record: while the form is in its panel that is Cancel (ADR 0016
  // addendum D-0063). With no changes the form just closes. With unsaved changes the form moves to the drawer with its draft (FormFlow's
  // defaultValue, #465) and asks there, so Leave closes it and Keep editing leaves the draft in the drawer: nothing is lost
  const draft = React.useRef(initial),
    movedAsked = React.useRef(false),
    inPanel = !!panelEl && !moved;
  const changed = (value: any) => Object.keys(value).some((field) => !Object.is(value[field], field in initial ? initial[field] : valueAt(record, field)));
  React.useEffect(() => {
    if (!panelEl || openKey === undefined || String(openKey ?? '') === String(rowKey) || moved) return;
    if (changed(draft.current)) {
      setMoved(true);
      return;
    }
    const cancel = panelEl.querySelector('.plx-form-actions button:not([type="submit"])');
    if (cancel) cancel.click();
  }, [panelEl, openKey, rowKey]);
  // once the drawer has the draft, ask there (its Cancel is FormFlow's own question)
  React.useEffect(() => {
    if (!moved || movedAsked.current) return undefined;
    const later = setTimeout(() => {
      movedAsked.current = true;
      (document.querySelector('[role="dialog"] .plx-form-actions button:not([type="submit"])') as HTMLElement | null)?.click();
    }, 400);
    return () => clearTimeout(later);
  }, [moved]);
  const validate = async (value: any) => {
    const found: any = {};
    for (const c of editable) {
      const message = c.validate && c.field in value ? await c.validate(value[c.field], record) : null;
      if (message) found[c.field] = message;
    }
    setErrors(found);
    const first = editable.find((c: any) => found[c.field]);
    if (first) setTimeout(() => document.getElementById(idOf(first))?.focus(), 0);
    return first ? false : '';
  };
  const submit = async (value: any) => {
    const changes: any = {};
    for (const field of Object.keys(value)) if (!Object.is(value[field], field in initial ? initial[field] : valueAt(record, field))) changes[field] = value[field];
    setRefusal(null);
    try {
      if (onRecordEdit) {
        await onRecordEdit(record, changes, { source: 'edit' });
        recordEdited?.(rowKey, changes);   // the saved record is one undo step (editing.undo, ADR 0021)
      } else if (commitCells) commitCells(rowKey, changes);   // one step, one onCellEdit call per changed field
      else for (const [field, v] of Object.entries(changes)) commitEdit(rowKey, field, v);
    } catch (error) {
      setRefusal((error && (error as any).message) || S.formSaveRefused.replace('{name}', name));
      throw error;
    }
  };
  const flow = (
    <FormFlow className={undefined as any}
      mode="edit"
      surface={inPanel ? 'page' : surface === 'dialog' && !moved ? 'dialog' : 'drawer'}
      title={title}
      initialValue={initial}
      defaultValue={moved ? draft.current : undefined}
      sessionKey={String(rowKey)}
      validate={validate}
      onSubmit={submit}
      onSuccess={onClose}
      onCancel={onClose}
      strings={{ saved: S.formSaved.replace('{name}', name), failed: '' }}
    >
      {({ value, setValue, busy }: any) => {
        draft.current = value;
        return (
        <>
          {refusal ? <ErrorSummary errors={[{ target: idOf(editable[0] || columns[0]), message: refusal }]} /> : null}
          {renderForm ? renderForm(record, { value, setValue, errors, busy }) : columns.map((c: any) => {
            if (editable.includes(c)) {
              return (
                <Field key={c.field} label={c.title} error={errors[c.field]}>
                  <Control column={c} kind={kindOf(c, types)} value={value[c.field]} record={record} invalid={errors[c.field]} set={(v: any) => setValue({ ...value, [c.field]: v })} />
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
      );
      }}
    </FormFlow>
  );
  return inPanel ? createPortal(flow, panelEl) : flow;
}
