/* Plenix · DeleteFlow
   Summary: Deleting one or several items the Plenix way, in one of four forms. Confirm asks first, with the count in the
     question ("Delete 2 categories?"), names what is lost, and runs on a danger button with focus on Cancel. Type to
     confirm asks for the item's name before an action with a wide reach. Undo deletes at once and offers Undo in a toast
     for as long as it shows; the deletion is final when the toast leaves. Move to trash moves the items to the trash at
     once, with Undo in the toast (10 Patterns › Creation and editing › Delete flow; 04 Actions › Delete).
   Usage:
     <DeleteFlow items={[{ id: 'c1', label: 'Easter' }, { id: 'c2', label: 'Advent' }]} noun="category" plural="categories"
       consequence="Their 14 assets stay, without a category." onDelete={(items) => remove(items)}
       trigger={<Button variant="danger-secondary" icon="trash">Delete</Button>} />
     <DeleteFlow variant="undo" items={[asset]} noun="asset" onDelete={hide} onRestore={show} onCommit={purge}
       trigger={<Button icon="trash">Delete</Button>} />
     <DeleteFlow variant="type" items={[project]} noun="project" consequence="Its 230 assets and 12 boards are deleted too."
       open={asking} onClose={() => setAsking(false)} onDelete={removeProject} />
   Props:
     items: what is deleted: [{ id, label }] (label: the name people know it by)
     noun, plural: the kind in words ("category", "categories"; plural defaults to noun + "s")
     variant: "confirm" (default: a destructive confirmation dialog) | "type" (type to confirm: the name, or the words in
       confirmPhrase, typed before Delete runs) | "undo" (deletes at once; Undo in the toast) | "trash" (moves to the trash
       at once; Undo in the toast)
     consequence: one sentence on what else is lost or kept ("Their 14 assets stay, without a category.")
     confirmPhrase: what to type in the type form (default: the item's name; several items: strings.phraseMany)
     retention: the trash's days, said in the trash toast ("Restore it from the trash within 30 days.")
     onDelete(items): deletes them (confirm, type), hides them (undo) or moves them to the trash (trash)
     onRestore(items): puts them back (Undo in the toast); without it the toast has no Undo
     onCommit(items): the undo form's final delete, when the toast leaves without Undo
     trigger: the button that starts the flow (one element; its onClick is taken)
     open: starts the flow from elsewhere (a command bar's Delete): the dialog shows; with undo or trash the deletion runs
       at once and onClose follows
     onClose(): runs when the flow ends (deleted, canceled or done)
     strings: the words, for other languages: { title: "Delete {name}?", titleMany: "Delete {count} {plural}?", delete:
       "Delete", cancel: "Cancel", permanent: "This cannot be undone.", more: "and {count} more", typeLabel: "Type {phrase}
       to confirm", typeError: "Type {phrase} exactly as shown.", phraseMany: "delete {count} {plural}", deleted:
       "{what} deleted", trashed: "{what} moved to the trash", undo: "Undo", retention: "Restore {them} from the trash
       within {days} days." }
     className: more classes on the dialog's content
   Behavior:
     Confirm and type: an alert dialog with the destructive look; focus starts on Cancel (confirm) or the field (type);
       Escape, Cancel and the veil close it without deleting. Up to five names are listed, then "and N more".
     Type: the typed words are checked when Delete is pressed; a mismatch keeps the dialog open with the error under the
       field and focus in it (nothing is disabled).
     Undo and trash: no question; the toast says what happened and holds Undo while the pointer or focus is on it.
     After a confirmed delete a toast says what was deleted (with a ToastProvider; otherwise it is announced).
   Notes:
     Ask first only for what cannot be undone. When the items can come back, prefer undo or trash: a question slows every
       delete down, Undo only the rare mistake.
     The count is the number of items, in the question and in the button's toast, never "these items".
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { announce } from '../../utils/announce.tsx';
import { formatNumber } from '../../utils/format.ts';
import { Button } from '../../components/Button/Button.tsx';
import { Dialog } from '../../components/Dialog/Dialog.jsx';
import { Field } from '../../components/Field/Field.tsx';
import { Input } from '../../components/Input/Input.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { useOptionalToast } from '../../components/Toast/Toast.jsx';
import { useStrings, useLocale } from '../../providers/LocaleProvider.tsx';
import { dataPhrase } from '../../utils/dataText.tsx';
import { fill } from '../../utils/fill.ts';

const SHOWN = 5;

export function DeleteFlow({ items = [], noun, plural, variant = 'confirm', consequence, confirmPhrase, retention,
  onDelete, onRestore, onCommit, trigger, open, onClose, strings, className }) {
  devWarn('DeleteFlow', { variant }, { variant: ['confirm','type','undo','trash'] });
  const t = useStrings('deleteFlow', strings);
  const toast = useOptionalToast();
  const loc = useLocale();
  const builtIn = !noun && !plural;   // the default words: whole sentences with the Arabic plural forms, from the catalog
  const many = plural || (noun ? noun + 's' : t.plural);
  noun = noun ?? t.noun;
  const counted = (m) => (builtIn ? loc.t('deleteFlow.items', { count: m, n: formatNumber(m) }) : formatNumber(m) + ' ' + many);
  const n = items.length;
  const name = n === 1 ? '“' + items[0].label + '”' : '';
  const what = n === 1 ? name : counted(n);
  const [shown, setShown] = React.useState(false);
  const [typed, setTyped] = React.useState('');
  const [error, setError] = React.useState('');
  const field = React.useRef(null);
  const phrase = confirmPhrase || (n === 1 ? items[0].label : (builtIn ? loc.t('deleteFlow.phraseItems', { count: n, n: formatNumber(n) }) : fill(t.phraseMany, { count: formatNumber(n), plural: many })));
  const dialog = variant === 'confirm' || variant === 'type';
  const say = (text, options) => { if (toast) toast.show(text, options); else announce(text); };
  const close = () => { setShown(false); setTyped(''); setError(''); if (onClose) onClose(); };

  // undo and trash: no question; the toast offers Undo
  const runNow = () => {
    const list = items.slice();
    if (onDelete) onDelete(list);
    let text = fill(variant === 'trash' ? t.trashed : t.deleted, { what: n === 1 ? name : what });
    if (variant === 'trash' && retention) text += ' ' + fill(t.retention, { them: n === 1 ? t.it : t.them, days: formatNumber(retention) });
    if (toast) {
      toast.show(text, {
        action: onRestore ? { label: t.undo, onAction: () => onRestore(list) } : undefined,
        onClose: (reason) => { if (reason !== 'action' && variant === 'undo' && onCommit) onCommit(list); },
      });
    } else { announce(text); if (variant === 'undo' && onCommit) onCommit(list); }
    if (onClose) onClose();
  };
  const start = () => { if (dialog) setShown(true); else runNow(); };

  // open from elsewhere: the dialog shows, or the immediate forms run once
  const was = React.useRef(false);
  React.useEffect(() => {
    if (open && !was.current) { if (dialog) setShown(true); else runNow(); }
    if (!open && was.current && dialog) { setShown(false); setTyped(''); setError(''); }
    was.current = !!open;
  }, [open]);

  const confirm = (e) => {
    if (e) e.preventDefault();
    if (variant === 'type' && typed.trim() !== phrase) { setError(fill(t.typeError, { phrase })); if (field.current) field.current.focus(); return; }
    const list = items.slice();
    if (onDelete) onDelete(list);
    say(fill(t.deleted, { what: n === 1 ? name : what }), { tone: 'success' });
    close();
  };

  const cancelRef = React.useRef(null);
  const formId = useUid('plx-delete-flow');
  const label = String(t.typeLabel).split('{phrase}');
  const title = n === 1 ? fill(t.title, { name }) : (builtIn ? loc.t('deleteFlow.titleItems', { count: n, n: formatNumber(n) }) : fill(t.titleMany, { count: formatNumber(n), plural: many }));
  const message = (consequence ? consequence + ' ' : '') + t.permanent;
  const rest = n - SHOWN;
  const names = n > 1 ? (
    <ul className="plx-delete-flow__names" aria-label={t.names}>
      {items.slice(0, SHOWN).map((x) => <li key={x.id || x.label} className="plx-delete-flow__name">{x.label}</li>)}
      {rest > 0 ? <li className="plx-delete-flow__more">{dataPhrase(t.more, { count: rest })}</li> : null}
    </ul>
  ) : null;

  const startTrigger = trigger ? React.cloneElement(trigger, {
    onClick: (e) => { if (trigger.props.onClick) trigger.props.onClick(e); if (!e.defaultPrevented) start(); },
  }) : null;

  return (
    <>
      {startTrigger}
      {dialog ? (
        <Dialog open={shown} onClose={close} title={title} description={message} size="sm" role="alertdialog"
          className="plx-dialog--destructive" initialFocus={variant === 'type' ? field : cancelRef}
          footer={<>
            <Button ref={cancelRef} onClick={close}>{t.cancel}</Button>
            <Button variant="danger" type="submit" form={formId}>{t.delete}</Button>
          </>}>
          <form id={formId} noValidate onSubmit={confirm} className={cx('plx-delete-flow', variant === 'type' && 'plx-delete-flow--type', className)}>
            {names}
            {variant === 'type' ? (
              <Field label={<>{label[0]}<Text variant="data">{phrase}</Text>{label.slice(1).join('')}</>}
                error={error || undefined}>
                <Input ref={field} value={typed} autoComplete="off" spellCheck={false} onChange={(e) => { setTyped(e.target.value); if (error) setError(''); }} />
              </Field>
            ) : null}
          </form>
        </Dialog>
      ) : null}
    </>
  );
}
