/* Plenix · Tag, Chip, TagList, TagInput
   Summary: Small labels with one look: Tag for a keyword or category, Chip for the same look as a toggle button. A tag with a
     category is a category pill: its category color as a soft pill (owner, 2026-10-14, docs/pills-and-colors.md).
   Usage:
     <TagList label="Keywords">
       <Tag onRemove={() => remove('sky')}>sky</Tag>
       <Tag category="teal">Client</Tag>
       <Chip selected={on} onClick={() => setOn(!on)}>Favorites</Chip>
       <TagInput placeholder="Add a tag" onKeyDown={…} />
     </TagList>
   Props:
     Tag.onRemove(event): shows a × button that runs it
     Tag.removeLabel: the × button's accessible name; default "Remove " + the tag text
     Tag.onRename(text): makes the tag renamable: its text becomes a button; activating it turns it into a field (Enter or leaving it keeps
       the new text, Escape cancels); renameLabel: the button's accessible name (default "Rename " + the tag text)
     Tag.category: the tag's category color, one of the 19 category colors (CATEGORY_COLORS: red, green, yellow, blue, orange,
       purple, cyan, magenta, lime, pink, teal, lavender, beige, maroon, mint, olive, apricot, navy, grey); set as
       data-plx-category: background shade 100, a 1px border in shade 300, text in shade 700. Without it the tag is gray. Legacy category="brown" uses Orange.
     Tag.className: more classes on the tag
     Tag.children: the tag text
     Chip.selected: the chip is pressed (aria-pressed); default false
     Chip.onClick(event): runs when the chip is clicked
     Chip.onRemove(event): shows a × button that runs it
     Chip.removeLabel: the × button's accessible name; default "Remove " + the chip text
     Chip.className: more classes on the chip
     Chip.children: the chip text
     TagList.label: the accessible name of the group; without it the list is not a group
     TagList.className: more classes on the list
     TagList.children: the tags or chips
     TagInput.onAdd(text): adds a tag: runs on Enter with the typed text (trimmed; never empty), then the field clears;
       the application ignores a tag it already has
     TagInput.label: the accessible name of the + button and the field, and the field's placeholder (default "Add a tag")
     TagInput.collapsible: true (default): a + button that reveals the field; false: the field is always shown
     TagInput.className: more classes on the input
   Behavior:
     The × button is a 24px target in a 16px box, 44px with touch (Platforms Standard 3.1); a chip's target grows the same
       way past its 20px look. With touch, TagList parts its tags and rows, and keeps
       12px above and below itself, so the targets do not overlap each other or the controls beside the list.
     Selected chips are filled.
     TagInput is a + at the end of the tag list, drawn as a Chip (the tag look as a button: its height, corners, fill and
       border; owner, batch 272), its target 24px like the tag's × (owner, batch 271: "it should be a + and clicking that plus
       exposes the text field"): pressing it reveals a text field like every other (the input's border, hover, focus and
       disabled states), focused. Type a tag and press Enter to add it: it appears before the field, the field clears and
       stays open for the next one. Escape, or leaving the field empty, closes it and returns focus to the +. Each tag's
       × removes it. Without onAdd the field only reports what is typed (onChange, onKeyDown).
     A tag being renamed is a small field with the input's focused border.
   Notes:
     Category colors identify labels; they never mean a workflow state. A status is a Badge (its six variants), never a
       category tag, and a tag is never drawn in a status variant.
     TagList lays tags or chips out in a wrapping row; it sets no outer margin (the parent spaces it).
     TagInput is the "add a tag" field at the end of a TagList.
     Other props reach the element: the tag, the chip's toggle button, the list, or the input.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Icon } from '../Icon/Icon.tsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import AddIcon from 'plenix-platform/icons/plenix/add';

type TagWords = { rename: string; renameTag: string; remove: string; removeTag: string; removeFilter: string; label: string };
function RemoveButton({ label, onClick }: { label?: string; onClick?: React.MouseEventHandler<HTMLButtonElement> }) {
  return <button type="button" className="plx-tag__remove" aria-label={label} onClick={onClick}><span aria-hidden="true">×</span></button>;
}

export type TagProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** a category color name */
  category?: string;
  onRemove?: React.MouseEventHandler<HTMLButtonElement>;
  removeLabel?: string;
  /** makes the label editable; called with the new label */
  onRename?: (label: string) => void;
  renameLabel?: string;
};
export function Tag({ category, onRemove, removeLabel, onRename, renameLabel, className, children, ...rest }: TagProps) {
  const tw = useStrings('tag') as TagWords;
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const text = typeof children === 'string' ? children : '';
  const done = (keep: boolean) => { setEditing(false); if (keep && draft.trim() && draft.trim() !== text) (onRename as (label: string) => void)(draft.trim()); };
  return (
    <span className={cx('plx-tag', onRename && 'plx-tag--renamable', editing && 'is-editing', className)} data-plx-category={(category === 'brown' ? 'orange' : category) || undefined} {...rest}>
      {onRename && editing ? (
        <input className="plx-tag__input" value={draft} aria-label={renameLabel || (text ? tw.rename.replace('{label}', text) : tw.renameTag)} autoFocus size={Math.max(4, draft.length)}
          onChange={(e) => setDraft(e.target.value)} onBlur={() => done(true)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); done(true); } else if (e.key === 'Escape') { e.preventDefault(); done(false); } }} />
      ) : onRename ? (
        <button type="button" className="plx-tag__label plx-tag__rename" aria-label={renameLabel || (text ? tw.rename.replace('{label}', text) : tw.renameTag)} onClick={() => { setDraft(text); setEditing(true); }}>{children}</button>
      ) : <span className="plx-tag__label">{children}</span>}
      {onRemove ? <RemoveButton label={removeLabel || (typeof children === 'string' ? tw.remove.replace('{label}', children) : tw.removeTag)} onClick={onRemove} /> : null}
    </span>
  );
}

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean; onRemove?: React.MouseEventHandler<HTMLButtonElement>; removeLabel?: string };
export function Chip({ selected = false, onRemove, removeLabel, className, children, ...rest }: ChipProps) {
  const tw = useStrings('tag') as TagWords;
  if (onRemove) {
    return (
      <span className={cx('plx-tag', 'plx-tag--chip', selected && 'plx-tag--selected', className)}>
        <button type="button" className="plx-tag__toggle" aria-pressed={selected} {...rest}>{children}</button>
        <RemoveButton label={removeLabel || (typeof children === 'string' ? tw.remove.replace('{label}', children) : tw.removeFilter)} onClick={onRemove} />
      </span>
    );
  }
  return <button type="button" className={cx('plx-tag', 'plx-tag--chip', selected && 'plx-tag--selected', className)} aria-pressed={selected} {...rest}>{children}</button>;
}

export type TagListProps = React.HTMLAttributes<HTMLDivElement> & { /** names the list as a group */ label?: string };
export function TagList({ className, children, label, ...rest }: TagListProps) {
  return <div className={cx('plx-tag-list', className)} role={label ? 'group' : undefined} aria-label={label} {...rest}>{children}</div>;
}

// what onChange gets: the field's change event, or the same shape when the field is cleared
type TagInputChange = { target: { value: string }; currentTarget: { value: string } };
export type TagInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  /** a tag typed and confirmed with Enter */
  onAdd?: (tag: string) => void;
  value?: string;
  onChange?: (event: TagInputChange) => void;
  /** its name; the placeholder too */
  label?: string;
  /** a + until it is used */
  collapsible?: boolean;
};
export const TagInput = React.forwardRef(function TagInput({ onAdd, onKeyDown, value, onChange, label, collapsible = true, id, className, onBlur, ...rest }: TagInputProps, ref: React.ForwardedRef<HTMLElement>) {
  const tw = useStrings('tag') as TagWords;
  if (label === undefined) label = tw.label;
  const [own, setOwn] = React.useState('');
  const [open, setOpen] = React.useState(!collapsible);
  const text = value !== undefined ? value : own;
  const inputRef = React.useRef<HTMLInputElement>(null), plusRef = React.useRef<HTMLButtonElement>(null);
  React.useImperativeHandle(ref, () => (inputRef.current || plusRef.current) as HTMLElement);
  const wasOpen = React.useRef(open);
  React.useEffect(() => {   // opening focuses the field; closing returns focus to the + (only after a change, never on mount)
    if (wasOpen.current === open) return;
    wasOpen.current = open;
    if (open && inputRef.current) inputRef.current.focus();
    else if (!open && plusRef.current && plusRef.current.focus) plusRef.current.focus();
  }, [open]);
  const setText = (v: string) => { if (value === undefined) setOwn(v); else if (onChange) onChange({ target: { value: v }, currentTarget: { value: v } }); };
  const change = (e: React.ChangeEvent<HTMLInputElement>) => { if (value === undefined) setOwn(e.target.value); if (onChange) onChange(e); };
  const keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) onKeyDown(e);
    if (e.defaultPrevented) return;
    if (e.key === 'Escape' && collapsible) { e.preventDefault(); setText(''); setOpen(false); return; }
    if (!onAdd || e.key !== 'Enter') return;
    e.preventDefault();
    const t = String(text).trim();
    if (!t) return;
    onAdd(t);
    setText('');
  };
  const blur = (e: React.FocusEvent<HTMLInputElement>) => { if (onBlur) onBlur(e); if (collapsible && !String(text).trim()) setOpen(false); };
  if (!open) {
    return (
      <Tooltip content={label}>
        <button ref={plusRef} id={id} type="button" aria-label={label} className={cx('plx-tag', 'plx-tag--chip', 'plx-tag--add', className)} onClick={() => setOpen(true)}><Icon name={AddIcon} size="sm" /></button>
      </Tooltip>
    );
  }
  return <input ref={inputRef} id={id} type="text" aria-label={rest['aria-labelledby'] ? undefined : label} placeholder={label} className={cx('plx-input', 'plx-tag-input', className)} value={text} onChange={change} onKeyDown={keyDown} onBlur={blur} {...rest} />;
});
