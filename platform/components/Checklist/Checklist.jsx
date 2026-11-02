/* Plenix · Checklist
   Summary: Named setup tasks with completion progress, optional collapse and dismissal.
   Usage: <Checklist title="Get started" items={tasks} completed={done} onChange={setDone} />
   Props:
     title: group heading; items: [{ id, label, description, disabled }]; completed: completed ids.
     onChange(ids, changedId): controlled updates; progress: show progress (default true).
     collapsible: show a CollapsibleSection (default false); onDismiss(): optional dismissal action.
     strings: { dismiss, progress }; className: extra classes.
   Behavior:
     Native checkboxes support pointer, Space and labels. Disabled tasks cannot change.
     Completion is derived from unique known ids; empty lists report zero. Collapsing preserves state.
   Notes:
     Completion and dismissal persistence belong to the caller. Technical counts use Reddit Mono.
*/
import React from 'react';
import { Stack, Inline } from '../Stack/Stack.tsx';
import { Checkbox } from '../Checkbox/Checkbox.tsx';
import { ProgressBar } from '../ProgressBar/ProgressBar.tsx';
import { Button } from '../Button/Button.tsx';
import { Text } from '../Text/Text.tsx';
import { CollapsibleSection } from '../CollapsibleSection/CollapsibleSection.jsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

export function Checklist({ title, items = [], completed = [], onChange, progress = true, collapsible = false, onDismiss, strings, className }) {
  const t = useStrings('checklist', strings);
  const done = items.filter((item) => completed.includes(item.id)).length;
  const body = <Stack className="plx-checklist__items">
    {progress ? <Stack gap="xs"><Text variant="data" role="status">{done + ' / ' + items.length}</Text>
      <ProgressBar value={items.length ? done / items.length * 100 : 0} label={t.progress} /></Stack> : null}
    {items.map((item) => <Checkbox key={item.id} label={item.label} description={item.description} checked={completed.includes(item.id)}
      disabled={item.disabled || !onChange} onChange={(e) => {
        const known = completed.filter((id) => items.some((v) => v.id === id));
        if (onChange) onChange(e.target.checked ? Array.from(new Set(known.concat(item.id))) : known.filter((id) => id !== item.id), item.id);
      }} />)}
  </Stack>;
  return <Stack className={cx('plx-checklist', className)}>
    {(!collapsible && title || onDismiss) ? <Inline justify="between" wrap>{!collapsible && title ? <Text as="h3" variant="heading">{title}</Text> : null}
      {onDismiss ? <Button size="sm" onClick={onDismiss}>{t.dismiss}</Button> : null}</Inline> : null}
    {collapsible ? <CollapsibleSection title={title}>{body}</CollapsibleSection> : body}
  </Stack>;
}
