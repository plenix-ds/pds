/* Plenix · FullTextAction (internal, not exported: ADR 0047, issue 1122)
   Summary: The small corner button that shows the full text of a text that is cut (clamped to N lines or cut on one line), and the Dialog it opens. Text and PropertyList.Item use it.
   Props:
     target: a ref to the cut text's element; the button shows only while isCut(target) (measured again when the box changes size)
     label: the field's name; it names the button ("Show full text: {label}") and titles the Dialog; without it the generic words
     strings: the words (text.fullText, text.fullTextOf, text.fullTextTitle; Close is dialog.close)
     children: the whole text, shown in the Dialog (its line breaks kept)
   Behavior:
     The button is the ghost, icon-only Button, size 2xs (the "expand" glyph, which has no direction), at the inline end of the text; click, Enter and Space open the Dialog; closing it returns focus to the button.
*/
import React from 'react';
import { Button } from '../Button/Button.tsx';
import { Dialog } from '../Dialog/Dialog.tsx';
import { isCut } from '../../utils/overflow.ts';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import ExpandIcon from 'plenix-platform/icons/plenix/expand';

/** the Dialog alone (the DataGrid cell opens it from its own overlay button) */
export function FullTextDialog({ open, onClose, label, strings, children }: { open: boolean; onClose: () => void; label?: string; strings?: Catalog | null; children?: React.ReactNode }) {
  const words = useStrings('text', strings) as Record<string, string>;
  return (
    <Dialog open={open} onClose={onClose} size="md" title={label || words.fullTextTitle}>
      <div className="plx-text-full__body" dir="auto">{children}</div>
    </Dialog>
  );
}

export type FullTextActionProps = { target: React.RefObject<HTMLElement | null>; label?: string; strings?: Catalog | null; onCutChange?: (cut: boolean) => void; children?: React.ReactNode };
export function FullTextAction({ target, label, strings, onCutChange, children }: FullTextActionProps) {
  const words = useStrings('text', strings) as Record<string, string>;
  const [cut, setCut] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const button = React.useRef<HTMLButtonElement>(null);
  React.useLayoutEffect(() => {
    const el = target.current;
    if (!el) return undefined;
    const measure = () => { const c = isCut(el); setCut(c); if (onCutChange) onCutChange(c); };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const watch = new ResizeObserver(measure);
    watch.observe(el);
    return () => watch.disconnect();
  }, [target, children]);
  const close = () => { setOpen(false); if (button.current) button.current.focus(); };
  const name = label ? fill(words.fullTextOf, { label }) : words.fullText;
  return (
    <>
      {cut ? <Button ref={button} variant="ghost" size="2xs" iconOnly icon={ExpandIcon} label={name} tooltip={words.fullText} aria-haspopup="dialog" className="plx-text-full__action" onClick={() => setOpen(true)} /> : null}
      <FullTextDialog open={open} onClose={close} label={label} strings={strings}>{children}</FullTextDialog>
    </>
  );
}
