/* Plenix · FullTextDialog (internal, not exported: ADR 0047, D-0142, issue 1137)
   Summary: The Dialog that shows the whole text of a cut text. It is its own file so FullTextAction loads it with one dynamic import on the first open: a bundle that uses Text, or a
     DataGrid without a "dialog" column, does not carry Dialog.
*/
import React from 'react';
import { Dialog } from '../Dialog/Dialog.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';

export type FullTextDialogProps = { open: boolean; onClose: () => void; label?: string; strings?: Catalog | null; children?: React.ReactNode };
export function FullTextDialog({ open, onClose, label, strings, children }: FullTextDialogProps) {
  const words = useStrings('text', strings) as Record<string, string>;
  return (
    <Dialog open={open} onClose={onClose} size="md" title={label || words.fullTextTitle}>
      <div className="plx-text-full__body" dir="auto">{children}</div>
    </Dialog>
  );
}
