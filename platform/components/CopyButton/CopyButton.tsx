/* Plenix · CopyButton
   Summary: A button that copies one value (an ID, a path, a link, a code sample) to the clipboard and confirms it in
     place: the icon turns to a check (and the label to "Copied") for a moment, and the result is announced
     (04 Actions › Clipboard › Copy). Built on Button and useClipboard (utils/clipboard.ts).
   Usage:
     <CopyButton value="ASSET-0142" label="Copy ID" />                                  an icon button beside the value
     <CopyButton value={link} showLabel label="Copy link" />                            the icon and its label
     <CopyButton value={link} field fieldLabel="Share link" label="Copy link" />        the value in a read-only field, the button joined at its end
   Props:
     value: what is copied: text, a function that returns it when pressed, { html, text }, or a Blob (a picture)
     label: what it copies, as a verb phrase: the accessible name, and the visible label with showLabel ("Copy ID";
       default strings.copy)
     showLabel: the label shows beside the icon (default false: an icon-only button named by label)
     field: the value shows in a read-only field in the data font, with the button joined at its end (default false); the
       button shows strings.copy ("Copy") and is named by label ("Copy link"), or shows label with showLabel
     fieldLabel: the field's accessible name (default label's object: give it, "Share link")
     variant: the Button variant (default "ghost" for the icon button, "secondary" with a label or in a field)
     size: the Button size (default "md"; "xs" in a dense row or a card)
     timeout: how long the copied state shows, in milliseconds (default the --plx-sys-clipboard-feedback-duration token)
     onCopy(ok): runs after each copy with true, or false when the browser refused it
     disabled: nothing to copy (default false)
     strings: the words it shows and announces, for other languages: { copy: "Copy", copied: "Copied",
       failed: "Couldn’t copy. Select the text and copy it by hand." }
     className: more classes on the button (on the wrapper with field)
     ref: forwarded to the <button>
     Other props pass through to the Button.
   Behavior:
     A press, Enter or Space copies the value as it is at that moment, with nothing added. The icon turns to a check and a
       visible label to strings.copied for the timeout, then returns to rest; a second press copies again.
     "Copied" (or the failure message) is announced through the polite live region (assertive on failure); the
       accessible name stays the label, so a screen reader hears what was copied and then that it worked.
     When the browser refuses, in a field the value is selected so it can be copied by hand.
   Notes:
     Name it for what it copies ("Copy file path"), never only "Copy". Put it right after the value it copies. The field
       form is for a value people may also read or select (a share link, an API endpoint).
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { useClipboard } from '../../utils/clipboard.ts';
import { Button } from '../Button/Button.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';
import EdCopyIcon from 'plenix-platform/icons/plenix/ed-copy';


export const CopyButton = React.forwardRef(function CopyButton({ value, label, showLabel = false, field = false, fieldLabel, variant, size = 'md', timeout,
  onCopy, disabled = false, strings, className, ...rest }, ref) {
  devWarn('CopyButton', { variant, size }, { variant: ['secondary','primary','tertiary','ghost','danger','danger-secondary','quiet'], size: ['md','sm','xs','2xs','lg'] });
  const t = useStrings('copyButton', strings);
  const clip = useClipboard({ timeout, strings: { copied: t.copied, failed: t.failed } });
  const input = React.useRef(null);
  const name = label || t.copy;
  const text = typeof value === 'function' ? null : value;
  const press = async () => {
    const v = typeof value === 'function' ? value() : value;
    const ok = await clip.copy(v);
    if (!ok && input.current) input.current.select();
    if (onCopy) onCopy(ok);
  };
  const labelled = showLabel || field;
  const button = (
    <Button ref={ref} variant={variant || (labelled ? 'secondary' : 'ghost')} size={size} icon={clip.copied ? CheckIcon : EdCopyIcon} iconOnly={!labelled} label={!labelled || (field && !showLabel) ? name : undefined}
      disabled={disabled} onClick={press} joined={field ? { start: 'seam' } : undefined} className={cx('plx-copy-button', clip.copied && 'is-copied', field ? 'plx-copy-button-field__button' : className)} {...rest}>
      {labelled ? (clip.copied ? t.copied : (field && !showLabel ? t.copy : name)) : name}
    </Button>
  );
  if (!field) return button;
  return (
    <span className={cx('plx-copy-button-field', className)}>
      <input ref={input} type="text" readOnly value={text == null ? '' : String(text)} aria-label={fieldLabel || name}
        className="plx-input plx-input--data plx-copy-button-field__value" onFocus={(e) => e.target.select()} />
      {button}
    </span>
  );
});
