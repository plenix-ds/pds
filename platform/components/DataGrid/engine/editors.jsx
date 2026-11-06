/* Plenix · DataGrid engine · editors (the cell editors that are not the one-line input)
   Summary: The long-text, select, date, combobox, tags, person editors and an application's own component (ADR 0016, #84), in one file that
     parts.jsx's CellEditor loads with one dynamic import the first time a column asks for one of them, so a grid that edits only text and
     numbers does not carry Select, DatePicker, Combobox and EntityPicker (the DataGrid import budget). In the iife builds the import is inlined.
   Usage:
     <LazyEditor kind="select" draft={…} setDraft={…} … />   (inside React.Suspense; see CellEditor in parts.jsx)
   Props:
     kind: "area" | "select" | "date" | "combobox" | "tags" | "person" | "custom"; the rest is what CellEditor hands every editor: draft, setDraft,
       invalid, setInvalid, messageId, finish(move, picked), cancel, input, done, label, options, load, and for "custom" column, record and editor.
   Notes:
     Moved out of parts.jsx without any change to the editors.
*/
import React from 'react';
import { useFloating } from '../../../utils/floating.ts';
import { Select } from '../../Input/Input.tsx';
import { useDirection } from '../../../providers/DirectionProvider.tsx';
import { DatePicker } from '../../DatePicker/DatePicker.tsx';
import { Combobox } from '../../Combobox/Combobox.tsx';
import { EntityPicker } from '../../EntityPicker/EntityPicker.jsx';
import { Avatar } from '../../Avatar/Avatar.tsx';
import { EditorMessage } from './parts.jsx';

// the long-text editor (ADR 0016): the cell shows the value's first line; a box over the cell (top layer, placed under the cell,
// at least as wide as it) holds the text area, which grows to 8 lines and then scrolls. Enter adds a line, Ctrl or Command with
// Enter saves, Escape cancels, a click outside saves, Tab saves and moves. A refusal's message sits under the text.
const AREA_LINES = 8;
function AreaEditor({ draft, setDraft, invalid, setInvalid, messageId, finish, cancel, input, label, done }) {
  const first = React.useRef(null),
    cell = React.useRef(null),
    box = React.useRef(null);
  React.useLayoutEffect(() => {
    cell.current = first.current?.closest('[role="gridcell"]') ?? null;
    const el = box.current;
    if (el?.showPopover && !el.matches(':popover-open')) el.showPopover();
    input.current?.focus();
    input.current?.setSelectionRange(input.current.value.length, input.current.value.length);   // the caret after the text
  }, []);
  useFloating(cell, box, { open: true, placement: 'bottom-start', matchWidth: true });
  return (
    <>
      <span ref={first} className="plx-data-grid__editor-first">
        {draft.split('\n')[0]}
      </span>
      <span ref={box} popover="manual" className="plx-data-grid__editor-box">
        <textarea
          ref={input}
          className="plx-data-grid__editor plx-data-grid__editor--area"
          aria-label={label}
          aria-invalid={invalid ? 'true' : undefined}
          aria-describedby={invalid ? messageId : undefined}
          rows={Math.min(AREA_LINES, Math.max(2, draft.split('\n').length))}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (invalid) setInvalid(null);
          }}
          onBlur={() => finish()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Escape') {
              done.current = true;
              cancel();
            } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              finish();
            } else if (e.key === 'Tab' && !e.altKey && !e.ctrlKey && !e.metaKey) {
              e.preventDefault();
              finish(e.shiftKey ? -1 : 1);
            }
          }}
        />
        {invalid ? (
          <span id={messageId} role="alert" className="plx-data-grid__editor-message">
            {invalid}
          </span>
        ) : null}
      </span>
    </>
  );
}

// the select editor (ADR 0016): Plenix's own Select inside the cell, its list open, drawn bare by Input's context hooks (the cell's
// outline is the frame). Picking an option saves it; with the list closed Enter saves the current choice, Escape cancels, Tab saves and moves.
function SelectEditor({ draft, setDraft, invalid, messageId, finish, cancel, input, done, options, label }) {
  const wrap = React.useRef(null);
  React.useEffect(() => {
    const field = wrap.current?.querySelector('[role="combobox"]');
    field?.focus();
    field?.click();
  }, []);
  return (
    <>
      <span ref={wrap} className="plx-data-grid__editor-field"
        dir="auto">
        <Select
          ref={input}
          aria-label={label}
          aria-describedby={invalid ? messageId : undefined}
          invalid={!!invalid}
          options={options}
          value={draft ?? ''}
          block
          onChange={(e) => {
            setDraft(e.target.value);
            finish(0, e.target.value);
          }}
          onBlur={() => finish()}
          onKeyDown={(e) => {
            const open = e.currentTarget?.getAttribute?.('aria-expanded') === 'true' || !!e.target?.closest?.('[aria-expanded="true"]');
            if (e.key === 'Tab' && !e.altKey && !e.ctrlKey && !e.metaKey) {
              e.preventDefault();
              e.stopPropagation();
              finish(e.shiftKey ? -1 : 1);
            } else if (!open && e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              done.current = true;
              cancel();
            } else if (!open && e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              finish();
            } else e.stopPropagation();
          }}
        />
      </span>
      {invalid ? <EditorMessage id={messageId} anchor={wrap} message={invalid} /> : null}
    </>
  );
}

// the date editor (ADR 0016): Plenix's DatePicker field inside the cell, drawn bare like the select. A date typed (read when Enter
// is pressed or the field is left) or chosen in the calendar saves at once; Escape cancels; Tab reads what was typed, saves and moves.
function DateEditor({ draft, setDraft, invalid, messageId, finish, cancel, input, done, label }) {
  const wrap = React.useRef(null),
    move = React.useRef(0),
    latest = React.useRef(draft);
  React.useEffect(() => {
    wrap.current?.querySelector('input')?.focus();
  }, []);
  return (
    <>
      <span
        ref={wrap}
        className="plx-data-grid__editor-field"
        dir="auto"
        onBlur={(e) => {
          // focus leaving the field and its calendar (a click elsewhere) saves what it holds
          if (!wrap.current?.contains(e.relatedTarget)) setTimeout(() => finish(move.current, latest.current), 0);
        }}
        onKeyDownCapture={(e) => {
          if (e.key === 'Tab' && !e.altKey && !e.ctrlKey && !e.metaKey && e.target.tagName === 'INPUT') {
            // leave the field so the picker reads the typed text, then save and move
            e.preventDefault();
            e.stopPropagation();
            move.current = e.shiftKey ? -1 : 1;
            e.target.blur();
            setTimeout(() => finish(move.current, latest.current), 0);
          } else if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            // the picker reads the typed text on Enter; then the cell saves what it holds
            setTimeout(() => finish(0, latest.current), 0);
          } else if (e.key === 'Escape' && !wrap.current?.querySelector('[aria-expanded="true"]')) {
            e.preventDefault();
            e.stopPropagation();
            done.current = true;
            cancel();
          }
        }}
      >
        <DatePicker
          ref={input}
          aria-label={label}
          aria-describedby={invalid ? messageId : undefined}
          invalid={!!invalid}
          width="fill"
          value={draft || null}
          onChange={(v) => {
            // the picker also reports the text it read when the field is left (to press its calendar button): only a changed date saves
            if (v === latest.current) return;
            latest.current = v;
            setDraft(v);
            finish(move.current, v);
          }}
        />
      </span>
      {invalid ? <EditorMessage id={messageId} anchor={wrap} message={invalid} /> : null}
    </>
  );
}

// the combobox editor (ADR 0016): Plenix's Combobox inside the cell, bare, its list open as it takes the focus. Typing filters (or loads
// the options), choosing one saves it at once; with the list closed Enter saves the current value; Escape closes the list, then cancels.
function ComboboxEditor({ draft, setDraft, invalid, messageId, finish, cancel, input, done, options, load, label }) {
  const wrap = React.useRef(null);
  React.useEffect(() => {
    wrap.current?.querySelector('input')?.focus();
  }, []);
  return (
    <>
      <span
        ref={wrap}
        className="plx-data-grid__editor-field"
        dir="auto"
        onKeyDownCapture={(e) => {
          // before the combobox's own keys: Tab and the closed-list Enter and Escape are the cell's; the rest (arrows, typing, Enter on an open list) are the combobox's
          const open = e.target.getAttribute?.('aria-expanded') === 'true';
          if (e.key === 'Tab' && !e.altKey && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            finish(e.shiftKey ? -1 : 1);
          } else if (!open && e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            done.current = true;
            cancel();
          } else if (!open && e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            finish();
          }
        }}
      >
        <Combobox
          ref={input}
          label={label}
          aria-describedby={invalid ? messageId : undefined}
          invalid={!!invalid}
          width="fill"
          {...(load ? { loadOptions: load } : { options })}
          value={draft ?? ''}
          onChange={(v) => {
            setDraft(v);
            finish(0, v);
          }}
          onBlur={() => finish()}
        />
      </span>
      {invalid ? <EditorMessage id={messageId} anchor={wrap} message={invalid} /> : null}
    </>
  );
}

// an application's own editor (ADR 0016, editor: { component, props }): it gets CellEditorProps inside the same frame and calls
// onChange(draft), onCommit(value?) (the draft when no value is given) or onCancel(); Tab saves the draft and moves, Escape the
// component did not handle cancels, and the focus leaving the editor saves the draft.
function ComponentEditor({ editor, column, record, draft, setDraft, invalid, messageId, finish, cancel, done }) {
  const wrap = React.useRef(null),
    latest = React.useRef(draft),
    { dir } = useDirection(),
    Editor = editor.component;
  return (
    <>
      <span
        ref={wrap}
        className="plx-data-grid__editor-field"
        dir="auto"
        onBlur={(e) => {
          if (!wrap.current?.contains(e.relatedTarget)) setTimeout(() => finish(0, latest.current), 0);
        }}
        onKeyDown={(e) => {
          if (e.defaultPrevented) return;
          if (e.key === 'Escape') {
            e.stopPropagation();
            done.current = true;
            cancel();
          } else if (e.key === 'Tab' && !e.altKey && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            finish(e.shiftKey ? -1 : 1, latest.current);
          } else e.stopPropagation();
        }}
      >
        <Editor
          {...(editor.props || {})}
          value={draft}
          record={record}
          field={column.field}
          dir={dir}
          autoFocus
          invalid={invalid || undefined}
          aria-describedby={invalid ? messageId : undefined}
          onChange={(v) => {
            latest.current = v;
            setDraft(v);
          }}
          onCommit={(v) => finish(0, v === undefined ? latest.current : v)}
          onCancel={() => {
            done.current = true;
            cancel();
          }}
        />
      </span>
      {invalid ? <EditorMessage id={messageId} anchor={wrap} message={invalid} /> : null}
    </>
  );
}

// the tags editor (ADR 0016): Plenix's Combobox with several values inside the cell, bare, the current tags as chips and its list of suggestions
// open. Choosing a suggestion adds a tag and the list stays open; a new text and Enter adds it (the Combobox is creatable); Backspace in the empty
// field removes the last tag. With the list closed Enter saves the array of tags; the first Escape closes the list, the second cancels; Tab saves and
// moves; the focus leaving the editor (and its chips) saves.
function TagsEditor({ draft, setDraft, invalid, messageId, finish, cancel, input, done, options, load, label }) {
  const wrap = React.useRef(null),
    latest = React.useRef(draft),
    values = Array.isArray(draft) ? draft : draft == null || draft === '' ? [] : [draft];
  React.useEffect(() => {
    wrap.current?.querySelector('input')?.focus();
  }, []);
  return (
    <>
      <span
        ref={wrap}
        className="plx-data-grid__editor-field"
        dir="auto"
        onBlur={(e) => {
          if (!wrap.current?.contains(e.relatedTarget)) setTimeout(() => finish(0, latest.current), 0);
        }}
        onKeyDownCapture={(e) => {
          const open = e.target.getAttribute?.('aria-expanded') === 'true';
          if (e.key === 'Tab' && !e.altKey && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            finish(e.shiftKey ? -1 : 1, latest.current);
          } else if (!open && e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            done.current = true;
            cancel();
          } else if (!open && e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            finish(0, latest.current);
          }
        }}
      >
        <Combobox
          ref={input}
          label={label}
          aria-describedby={invalid ? messageId : undefined}
          invalid={!!invalid}
          width="fill"
          multiple
          creatable
          {...(load ? { loadOptions: load } : { options })}
          values={values}
          onChange={(next) => {
            latest.current = next;
            setDraft(next);
          }}
          onCreate={(text) => {
            const next = [...(Array.isArray(latest.current) ? latest.current : []), text];
            latest.current = next;
            setDraft(next);
          }}
        />
      </span>
      {invalid ? <EditorMessage id={messageId} anchor={wrap} message={invalid} /> : null}
    </>
  );
}

// the person editor (ADR 0016): Plenix's EntityPicker (people) inside the cell, bare, its list open as it takes the focus. Typing filters (or loads
// the options), choosing one saves it at once; with the list closed Enter saves the current value; Escape closes the list, then cancels.
function PersonEditor({ draft, setDraft, invalid, messageId, finish, cancel, input, done, options, load, label }) {
  const wrap = React.useRef(null),
    [typed, setTyped] = React.useState(false),
    current = options.find((o) => String(o.value) === String(draft));
  React.useEffect(() => {
    wrap.current?.querySelector('input')?.focus();
  }, []);
  return (
    <>
      <span
        ref={wrap}
        className="plx-data-grid__editor-field"
        dir="auto"
        onInput={() => setTyped(true)}
        onKeyDownCapture={(e) => {
          // before the combobox's own keys: Tab and the closed-list Enter and Escape are the cell's; the rest (arrows, typing, Enter on an open list) are the combobox's
          const open = e.target.getAttribute?.('aria-expanded') === 'true';
          if (e.key === 'Tab' && !e.altKey && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            finish(e.shiftKey ? -1 : 1);
          } else if (!open && e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            done.current = true;
            cancel();
          } else if (!open && e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            finish();
          }
        }}
      >
        {current && !typed ? (
          <span className="plx-data-grid__person plx-data-grid__person--over" aria-hidden="true">
            <Avatar size="xs" name={current.label} src={current.src} color={current.color} />
            <span className="plx-data-grid__person-name">{current.label}</span>
          </span>
        ) : null}
        <EntityPicker
          ref={input}
          kind="people"
          placeholder={current && !typed ? ' ' : undefined}
          label={label}
          aria-describedby={invalid ? messageId : undefined}
          invalid={!!invalid}
          width="fill"
          {...(load ? { loadOptions: load } : { options })}
          value={draft ?? ''}
          onChange={(v) => {
            setDraft(v);
            finish(0, v);
          }}
          onBlur={() => finish()}
        />
      </span>
      {invalid ? <EditorMessage id={messageId} anchor={wrap} message={invalid} /> : null}
    </>
  );
}

// one entry for the lazy import: the editor of a kind, by name
export default function Editor({ kind, ...props }) {
  switch (kind) {
    case 'area':
      return <AreaEditor {...props} />;
    case 'select':
      return <SelectEditor {...props} />;
    case 'date':
      return <DateEditor {...props} />;
    case 'combobox':
      return <ComboboxEditor {...props} />;
    case 'tags':
      return <TagsEditor {...props} />;
    case 'person':
      return <PersonEditor {...props} />;
    default:
      return <ComponentEditor {...props} />;
  }
}
