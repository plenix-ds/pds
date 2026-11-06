/* Plenix · MentionInput
   Summary: Mention a directory entity in plain text with EntityPicker, or in rich text with the existing editor engine.
   Usage: <MentionInput label="Comment" value={text} onChange={setText} options={people} onMention={rememberEntity} />
   Props:
     mode: textarea (default) | rich; label; value, onChange(text): controlled plain text; defaultValue: initial rich HTML.
     options: EntityPicker records [{ value, label, description }]; loadOptions(query): optional async directory.
     onMention(option): plain-text selection callback, for retaining entity IDs; disabled; readOnly; strings: add, choose.
     editorStrings: RichTextEditor words; pickerStrings: EntityPicker words; className; ref: textarea or rich wrapper.
   Behavior:
     Typing @ opens a named picker. Arrow Down moves into it; Escape closes it. The Add mention button opens it explicitly.
     A selection replaces the trigger/query at the stored caret and returns focus. Rich text retains atomic engine mentions.
   Notes:
     Plain text is not an identity store: retain IDs through onMention. Rich HTML is cleaned by RichTextEditor.
*/
import React from 'react';
import { Textarea } from '../Input/Input.tsx';
import { RichTextEditor } from '../RichTextEditor/RichTextEditor.jsx';
import { EntityPicker, type EntityPickerOption } from '../EntityPicker/EntityPicker.tsx';
import { Button } from '../Button/Button.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { useReadOnly } from '../../providers/ReadOnly.tsx';

/** @public the prop type (ADR 0011) */
export type MentionInputProps = {
  mode?: 'textarea' | 'rich';
  label?: string;
  /** controlled plain text */
  value?: string;
  onChange?: (value: string) => void;
  /** the initial rich HTML */
  defaultValue?: string;
  options?: EntityPickerOption[];
  loadOptions?: (query: string) => EntityPickerOption[] | Promise<EntityPickerOption[]>;
  onMention?: (option: EntityPickerOption) => void;
  disabled?: boolean;
  readOnly?: boolean;
  strings?: Record<string, unknown> | null;
  editorStrings?: Record<string, unknown> | null;
  pickerStrings?: Record<string, unknown> | null;
  className?: string;
};

export const MentionInput = React.forwardRef<HTMLTextAreaElement | HTMLDivElement, MentionInputProps>(function MentionInput({ mode = 'textarea', label, value = '', onChange, defaultValue = '', options = [], loadOptions,
  onMention, disabled = false, readOnly: readOnlyOwn, strings, editorStrings, pickerStrings, className }, ref) {
  const readOnly = useReadOnly(readOnlyOwn);   // its own readOnly, else the nearest ReadOnly region's
  const t = useStrings('mentionInput', strings) as Record<string, string>;
  const input = React.useRef<(HTMLTextAreaElement & HTMLDivElement) | null>(null), picker = React.useRef<HTMLInputElement | null>(null), range = React.useRef({ start: value.length, end: value.length });
  const [open, setOpen] = React.useState(false), [query, setQuery] = React.useState('');
  React.useImperativeHandle(ref, () => input.current as HTMLTextAreaElement & HTMLDivElement, [mode]);
  const search = (q: string) => loadOptions ? loadOptions(q) : options.filter((o) => (o.label + ' ' + (o.description || '')).toLowerCase().includes(q.toLowerCase()));
  const capture = (el: HTMLTextAreaElement) => { range.current = { start: el.selectionStart, end: el.selectionEnd }; };
  const change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value; capture(e.target); if (onChange) onChange(next);
    const match = next.slice(0, e.target.selectionStart).match(/(?:^|\s)@([^\s@]*)$/);
    setOpen(!!match); setQuery(match ? match[1] : '');
  };
  const pick = (_id: unknown, option?: EntityPickerOption) => {
    if (!option || disabled || readOnly) return;
    const { start, end } = range.current, before = value.slice(0, start), trigger = before.match(/(?:^|\s)@([^\s@]*)$/);
    const at = trigger ? start - trigger[1].length - 1 : start, inserted = '@' + option.label + ' ', next = value.slice(0, at) + inserted + value.slice(end);
    if (onChange) onChange(next); if (onMention) onMention(option); setOpen(false);
    requestAnimationFrame(() => { if (input.current) { input.current.focus(); input.current.setSelectionRange(at + inserted.length, at + inserted.length); } });
  };
  // RichTextEditor is still JS, so its props infer as all required: the cast goes when wave 1 converts it
  return <div ref={mode === 'rich' ? input : undefined} className={cx('plx-mention-input', 'plx-stack', className)}>
    {mode === 'rich' ? <RichTextEditor {...({ label, defaultValue, onChange, disabled, readOnly, strings: editorStrings, mentions: { search } } as React.ComponentProps<typeof RichTextEditor>)} />
      : <><Textarea ref={input} aria-label={label} value={value} onChange={change} onSelect={(e) => capture(e.target as HTMLTextAreaElement)} disabled={disabled} readOnly={readOnly}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); else if (e.key === 'ArrowDown' && open && picker.current) { e.preventDefault(); picker.current.focus(); picker.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })); } }} />
        {!disabled && !readOnly ? <Button onClick={() => { if (input.current) capture(input.current); setQuery(''); setOpen(!open); }}>{t.add}</Button> : null}
        {open && !disabled && !readOnly ? <EntityPicker key={query} ref={picker} kind="people" label={t.choose} options={loadOptions ? [] : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))}
          loadOptions={loadOptions ? (text) => loadOptions(text || query) : undefined} minChars={0} onChange={pick} strings={pickerStrings} /> : null}</>}
  </div>;
});