/* Plenix · FileInput
   Summary: Chooses files from the device: the browser's own file input (focusable, read by assistive technology) drawn
     as a secondary Button, a line that says what is chosen, and, with showList, the chosen files one per row with their
     size and a Remove button.
   Usage:
     <Field label="Contract" description="PDF, up to 10 MB"><FileInput accept=".pdf" onChange={setFiles} /></Field>
     <Field label="Attachments"><FileInput multiple showList onChange={setFiles} /></Field>
   Props:
     accept: the file types the picker offers (".pdf,.docx", "image/*"); say them in the Field's description too
     multiple: more than one file at a time (default false)
     showList: the chosen files in a list under the button, each with its size and a Remove button (default false)
     hideSummary: the line that says what is chosen is not shown (it still describes the
       input); for a parent that shows the file itself (AvatarUpload, ImageUpload)
     onChange(files, event): the chosen files, as an array of File
     label: the accessible name when the field has no Field (default strings.choose or strings.chooseMany)
     name: the form field name, handed to the native <input type="file"> (as are form and capture)
     disabled: turns the input and its button off (default false)
     required: handed to the native input (a Field sets it)
     invalid: marks the native input invalid, aria-invalid (a Field with an error sets it)
     id: handed to the native input, with aria-describedby (a Field sets both)
     strings: the words it shows and announces, for other languages: { choose: "Choose file", chooseMany: "Choose files",
       none: "No file chosen", count: "{count} files", remove: "Remove {name}" }
     className: more classes on the outer <div>
     ref: forwarded to the native <input>
   Behavior:
     The native input is the control: it is the Tab stop, it opens the picker on Enter, Space or a click on the button,
       and a Field's label names it. The button only draws it, and shows the focus ring while the input has focus.
     The line beside the button names the one file chosen, or how many, and is read with the input (aria-describedby).
     Remove takes a file out of the input's own list (the form sends what the list shows) and returns focus to the
       input.
   Notes:
     Sizes are written by formatBytes in the data font, as file names are.
     For dragging files in, use DropZone; for images with a preview, an image upload.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useDescribedBy } from '../../utils/describedBy.ts';
import { formatBytes } from '../../utils/format.ts';
import { Icon } from '../Icon/Icon.tsx';
import { Button } from '../Button/Button.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import AttachmentIcon from 'plenix-platform/icons/plenix/attachment';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import DocTextIcon from 'plenix-platform/icons/plenix/doc-text';

type FileInputWords = { none: string; count: string; choose: string; chooseMany: string; remove: string };
export type FileInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> & {
  accept?: string;
  multiple?: boolean;
  /** lists the chosen files, each with Remove */
  showList?: boolean;
  hideSummary?: boolean;
  /** the chosen files, after a choice or a removal */
  onChange?: (files: File[], event: React.SyntheticEvent) => void;
  /** the accessible name when no Field labels it */
  label?: string;
  invalid?: boolean;
  strings?: Catalog | null;
};
export const FileInput = React.forwardRef(function FileInput({ accept, multiple = false, showList = false, hideSummary = false, onChange, label, disabled = false, required, invalid,
  id, 'aria-describedby': describedBy, strings, className, ...rest }: FileInputProps, ref: React.ForwardedRef<HTMLInputElement>) {
  const t = useStrings('fileInput', strings) as FileInputWords;
  const input = React.useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [focus, setFocus] = React.useState(false);
  const sumId = 'plx-fi' + React.useId().replace(/[^a-zA-Z0-9]/g, '') + '-s';
  const describedAt = useDescribedBy(describedBy, sumId);   // what its owner (a Field) described, then the line that names the chosen file
  const setRef = (node: HTMLInputElement | null) => { input.current = node; if (typeof ref === 'function') ref(node); else if (ref) ref.current = node; };
  const chosen = (e: React.ChangeEvent<HTMLInputElement>) => { const list = Array.from(e.target.files || []); setFiles(list); if (onChange) onChange(list, e); };
  const remove = (i: number) => (e: React.MouseEvent<HTMLElement>) => {
    const next = files.filter((_, j) => j !== i);
    // the input's own list follows, so a form sends what the list shows
    if (typeof DataTransfer !== 'undefined' && input.current) { const dt = new DataTransfer(); next.forEach((f) => dt.items.add(f)); input.current.files = dt.files; }
    setFiles(next);
    if (onChange) onChange(next, e);
    if (input.current) input.current.focus();
  };
  const summary = !files.length ? t.none : files.length === 1 ? files[0].name : t.count.replace('{count}', files.length as unknown as string);
  const choose = multiple ? t.chooseMany : t.choose;
  return (
    <div className={cx('plx-file-input', hideSummary && 'plx-file-input--hide-summary', disabled && 'is-disabled', className)}>
      <div className="plx-file-input__row">
        <label className="plx-file-input__trigger">
          <input ref={setRef} type="file" className="plx-file-input__native plx-visually-hidden" accept={accept} multiple={multiple} disabled={disabled}
            required={required} aria-invalid={invalid || undefined} id={id} aria-label={label || (id ? undefined : choose)}
            aria-describedby={describedAt} onChange={chosen}
            onFocus={(e) => setFocus((e.target as HTMLInputElement).matches(':focus-visible'))} onBlur={() => setFocus(false)} {...rest} />
          <span className={cx('plx-button', 'plx-button--secondary', 'plx-file-input__button', focus && 'is-focus-visible')} aria-hidden="true" aria-disabled={disabled || undefined}>
            <span className="plx-button__icon"><Icon name={AttachmentIcon} /></span><span className="plx-button__label">{choose}</span>
          </span>
        </label>
        <span className={cx('plx-file-input__summary', files.length === 1 && 'plx-file-input__summary--file')} id={sumId}>{summary}</span>
      </div>
      {showList && files.length ? (
        <ul className="plx-file-input__list">
          {files.map((f, i) => (
            <li key={f.name + i} className="plx-file-input__item">
              <span className="plx-file-input__icon"><Icon name={DocTextIcon} /></span>
              <span className="plx-file-input__name">{f.name}</span>
              <span className="plx-file-input__size">{formatBytes(f.size)}</span>
              <Button className="plx-file-input__remove" variant="ghost" size="xs" iconOnly icon={CloseIcon} label={t.remove.replace('{name}', f.name)} onClick={remove(i)} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});
