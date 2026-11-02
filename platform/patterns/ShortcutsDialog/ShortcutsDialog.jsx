/* Plenix · ShortcutsDialog
   Summary: A searchable, grouped view of the live Platform hotkey registry.
   Usage: <ShortcutsDialog open={open} onClose={close} />
   Props:
     open, onClose: Dialog lifecycle; searchable: show search (default true).
     strings: { title, search, general, empty, close }; className.
   Behavior:
     Registry updates are reflected while open. Search matches names, groups and platform-formatted bindings.
     Disabled bindings are omitted. Kbd renders technical key names in Reddit Mono.
   Notes:
     This dialog only documents shortcuts; it never registers or changes them.
*/
import React from 'react';
import { Dialog } from '../../components/Dialog/Dialog.jsx';
import { Stack, Inline } from '../../components/Stack/Stack.tsx';
import { SearchField } from '../../components/SearchField/SearchField.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Kbd } from '../../components/Kbd/Kbd.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { useHotkeyList, hotkeyLabel } from '../../utils/hotkey.ts';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

export function ShortcutsDialog({ open, onClose, searchable = true, strings, className }) {
  const t = useStrings('shortcutsDialog', strings);
  const all = useHotkeyList(), [query, setQuery] = React.useState('');
  React.useEffect(() => { if (!open) setQuery(''); }, [open]);
  const filtered = all.filter((v) => v.enabled !== false && (v.label + ' ' + v.group + ' ' + hotkeyLabel(v.binding)).toLowerCase().includes(query.trim().toLowerCase()));
  const groups = Array.from(new Set(filtered.map((v) => v.group || t.general)));
  return <Dialog open={open} title={t.title} onClose={onClose} closeLabel={t.close} footer={<Button onClick={onClose}>{t.close}</Button>}>
    <Stack className={cx('plx-shortcuts-dialog', className)}>
      {searchable ? <SearchField value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} label={t.search} placeholder={t.search} strings={strings} /> : null}
      {groups.length ? groups.map((group) => <Stack key={group} gap="sm"><Text as="h3" variant="heading">{group}</Text>
        {filtered.filter((v) => (v.group || t.general) === group).map((v, i) => <Inline key={v.binding + i} justify="between" wrap>
          <Text>{v.label}</Text><Kbd>{hotkeyLabel(v.binding)}</Kbd></Inline>)}</Stack>) : <EmptyState title={t.empty} />}
    </Stack>
  </Dialog>;
}
