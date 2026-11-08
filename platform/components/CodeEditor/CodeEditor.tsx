/* Plenix · CodeEditor
   Summary: A multi-line field for code people write: the code font (Reddit Mono), the CodeBlock's colors as they type,
     optional line numbers, indentation with Tab, and a read-only form. It is a native <textarea> laid over the colored
     copy of its text, so typing, selection, undo, spell check off and assistive technology are the browser's own; no
     editor engine is loaded.
   Usage:
     <Field label="Query (CSS)"><CodeEditor language="css" value={css} onChange={setCss} lineNumbers /></Field>
     <CodeEditor language="jsx" defaultValue={sample} readOnly label="Example" />
   Props:
     value: the code; with onChange, a controlled field
     defaultValue: the first code of an uncontrolled field (default "")
     onChange(code, event): the new code after each edit
     language: "jsx" (default) | "js" | "css" | "html" | "text" (not colored): the CodeBlock's highlighter
     lineNumbers: a gutter with the line numbers (default false)
     readOnly: people can read, select and copy, not edit (the read-only fill; Tab leaves) (default false)
     height: "sm" | "md" (default) | "lg": the least height (about 5, 10 or 20 lines)
     maxHeight: "none" (default; it grows with the code) | "tall" (a box that scrolls, for long files)
     tabSize: the spaces Tab inserts (default 2)
     label: the accessible name when it has no Field
     invalid: marks the editor invalid: the danger border and aria-invalid (a Field with an error sets it)
     warning: true shows a warning state beside invalid (a Field with a warning sets it): a warning border and fill; the Field draws its icon and message
     disabled: turns the editor off (default false)
     required: handed to the <textarea> (a Field sets it)
     id: handed to the <textarea>, with aria-describedby (a Field sets both)
     strings: the words it announces, for other languages: { hint: "Tab indents. Press Escape, then Tab, to leave the
       editor." }
     className: more classes on the editor
     ref: forwarded to the <textarea>
   Behavior:
     Tab indents (the selected lines, or inserts spaces at the caret) and Shift+Tab outdents; Escape, then Tab, leaves the
       editor, so the keyboard is never trapped; the hint says so (aria-describedby). Read-only and disabled editors
       keep Tab for moving on.
     Enter starts the new line at the indentation of the line above.
     The editor scrolls as one: the code, the gutter's numbers (which stay in view on the start side) and the caret move
       together; long lines scroll sideways, never wrap.
     The border turns the focus color while the editor has focus (border only), the danger color when it is invalid.
     Edits made with Tab, Shift+Tab and Enter join the browser's undo history where it allows (Ctrl+Z).
   Notes:
     Other props pass through to the <textarea> (name, placeholder, onBlur…).
     For code people only read, use CodeBlock. A real editor engine (completion, folding, error markers) is not part of
       Plenix; ask before adding one.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useDescribedBy } from '../../utils/describedBy.ts';
import { highlight } from '../CodeBlock/CodeBlock.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import { useReadOnly } from '../../providers/ReadOnly.tsx';

// replaces the textarea's selection with text through the browser's editing, so it joins the undo history; falls back to
// setting the value (and telling React) where execCommand is not available
function insert(el: HTMLTextAreaElement, text: string, selStart?: number, selEnd?: number) {
  el.focus();
  if (selStart !== undefined && selEnd !== undefined) el.setSelectionRange(selStart, selEnd);
  let done = false;
  try { done = typeof document !== 'undefined' && document.execCommand && document.execCommand('insertText', false, text); } catch (e) { done = false; }
  if (!done) {
    el.setRangeText(text, el.selectionStart, el.selectionEnd, 'end');
    el.dispatchEvent(new Event('input', { bubbles: true }));   // React reads the new value as a change
  }
}

/** @public the prop type (ADR 0011) */
export type CodeEditorProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value' | 'defaultValue'> & {
  /** the code (controlled) */
  value?: string | null;
  defaultValue?: string;
  /** the new code and the change event */
  onChange?: (code: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** "jsx" (default) | "js" | "css" | "html" | "text" (not colored) */
  language?: 'jsx' | 'js' | 'css' | 'html' | 'text';
  lineNumbers?: boolean;
  readOnly?: boolean;
  /** "sm" | "md" (default) | "lg" */
  height?: 'sm' | 'md' | 'lg';
  /** "none" (default) | "tall" */
  maxHeight?: 'none' | 'tall';
  /** spaces a Tab inserts (default 2) */
  tabSize?: number;
  /** the accessible name */
  label?: string;
  invalid?: boolean;
  /** a warning, shown as data-plx-warning */
  warning?: string | boolean;
  disabled?: boolean;
  required?: boolean;
  strings?: Catalog | null;
  className?: string;
};

export const CodeEditor = React.forwardRef<HTMLTextAreaElement, CodeEditorProps>(function CodeEditor({ value, defaultValue = '', onChange, language = 'jsx', lineNumbers = false, readOnly: readOnlyOwn,
  height = 'md', maxHeight = 'none', tabSize = 2, label, invalid, warning, disabled = false, required, id, 'aria-describedby': describedBy, strings, className, onKeyDown, ...rest }, ref) {
  const readOnly = useReadOnly(readOnlyOwn);   // its own readOnly, else the nearest ReadOnly region's
  const t = useStrings('codeEditor', strings) as Record<string, string>;
  const area = React.useRef<HTMLTextAreaElement | null>(null);
  const release = React.useRef(false);   // Escape was pressed: the next Tab leaves the editor
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue);
  const code = controlled ? (value == null ? '' : String(value)) : inner;
  const hintId = 'plx-ce' + React.useId().replace(/[^a-zA-Z0-9]/g, '') + '-h';
  const setRef = (node: HTMLTextAreaElement | null) => { area.current = node; if (typeof ref === 'function') ref(node); else if (ref) ref.current = node; };
  const colored = React.useMemo(() => highlight(code, language), [code, language]);
  const lines = code.split('\n').length;
  const editable = !readOnly && !disabled;
  const describedAt = useDescribedBy(describedBy, editable ? hintId : null);   // what its owner (a Field) described, then the Tab hint while it can be edited
  const pad = ' '.repeat(tabSize);

  const changed = (e: React.ChangeEvent<HTMLTextAreaElement>) => { if (!controlled) setInner(e.target.value); if (onChange) onChange(e.target.value, e); };
  const keys = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onKeyDown) onKeyDown(e);
    if (e.defaultPrevented || !editable) return;
    const el = e.currentTarget;
    if (e.key === 'Escape') { release.current = true; return; }
    if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (release.current) { release.current = false; return; }   // leave the editor
      e.preventDefault();
      const v = el.value, s = el.selectionStart, end = el.selectionEnd;
      const from = v.lastIndexOf('\n', s - 1) + 1;
      if (!e.shiftKey && s === end) { insert(el, pad); return; }
      // indent or outdent every line the selection touches
      const to = end > s && v[end - 1] === '\n' ? end - 1 : end;
      const block = v.slice(from, to);
      const next = block.split('\n').map((l) => (e.shiftKey ? l.replace(new RegExp('^ {1,' + tabSize + '}'), '') : pad + l)).join('\n');
      if (next === block) return;
      insert(el, next, from, to);
      el.setSelectionRange(s === end ? Math.max(from, s + (next.length - block.length)) : from, from + next.length);
      return;
    }
    release.current = false;
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const v = el.value, s = el.selectionStart;
      const indent = (/^[ \t]*/.exec(v.slice(v.lastIndexOf('\n', s - 1) + 1, s)) || [''])[0];
      if (!indent) return;
      e.preventDefault();
      insert(el, '\n' + indent);
    }
  };

  return (
    <div className={cx('plx-code-editor', lineNumbers && 'plx-code-editor--line-numbers', readOnly && 'plx-code-editor--readonly', 'plx-code-editor--height-' + height,
      maxHeight === 'tall' && 'plx-code-editor--tall', invalid && 'is-invalid', disabled && 'is-disabled', className)} data-plx-warning={warning || undefined}>
      <div className="plx-code-editor__scroller">
        {lineNumbers ? (
          <div className="plx-code-editor__gutter" aria-hidden="true">
            {Array.from({ length: lines }, (_, i) => <span key={i} className="plx-code-editor__number">{i + 1}</span>)}
          </div>
        ) : null}
        <div className="plx-code-editor__code">
          <textarea ref={setRef} className="plx-code-editor__input" value={code} onChange={changed} onKeyDown={keys} readOnly={readOnly} disabled={disabled}
            required={required} id={id} aria-label={label} aria-invalid={invalid || undefined} rows={1} wrap="off" spellCheck={false} autoCapitalize="off"
            autoComplete="off" autoCorrect="off" data-gramm="false" aria-describedby={describedAt} {...rest} />
          {/* the colored copy lies over the textarea (its text is transparent): the selection and the caret show through */}
          <pre className="plx-code-editor__pre" aria-hidden="true" aria-disabled={disabled || undefined}><code data-plx-language={language}>{colored}{code.endsWith('\n') || !code ? ' ' : ''}</code></pre>
        </div>
      </div>
      {editable ? <span id={hintId} className="plx-visually-hidden">{t.hint}</span> : null}
    </div>
  );
});
