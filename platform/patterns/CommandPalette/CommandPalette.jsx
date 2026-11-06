/* Plenix · CommandPalette
   Summary: The command menu in a dialog, opened with a shortcut (04 Actions & Commands › Menus and commands › Command
     palette): Ctrl K (⌘ K on a Mac) anywhere in the app, or in one region when it is scoped, and from a visible control.
     Type to find a command or a place, Enter to run it; the palette closes and focus returns.
   Usage:
     <CommandPalette items={commands} trigger={<Button icon="search">Commands</Button>} />           // global: Ctrl K
     <CommandPalette items={editorCommands} scope={editorRef} hotkey="Mod+Shift+P" title="Editor commands" />
     <CommandPalette items={commands} open={open} onOpenChange={setOpen} hotkey={null} />            // opened by the app
   Props:
     items: the commands, as CommandMenu.items (groups, shortcuts, pages)
     hotkey: the binding that opens it (default "Mod+K"); null for none
     scope: a ref to the region the hotkey belongs to: it opens only while focus is inside it (default: the whole page)
     trigger: a control that opens it (one element; it gets aria-haspopup="dialog" and aria-keyshortcuts)
     open, defaultOpen: whether it is open (controlled) or opens at first (default false)
     onOpenChange(open): runs when it opens or closes
     title: the dialog title (default strings.title)
     placeholder, loading, query, onQueryChange, filter: as CommandMenu
     onSelect(item): runs after a command runs (the palette has closed)
     strings: the words it shows and announces, for other languages: { title: "Commands", close: "Close" } and the
       CommandMenu strings
     className: more classes on the dialog
   Behavior:
     The hotkey (useHotkey, listed in the shortcuts dialog under General with the title) opens it, also from a text field;
       pressed again while it is open, it closes it.
     It is a modal Dialog (size md) at the top of the window, so the list grows downward without moving the field. The
       field takes focus; the CommandMenu keys apply; a command runs and the palette closes, focus returning to where it
       was. Escape or the close button close it without running anything.
     Each time it opens the text is empty and the first page shows.
   Notes:
     A faster way to commands that are also in the interface, never the only way. Name commands as in the menus.
     Built only from Platform parts: Dialog, CommandMenu and useHotkey.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useHotkey, isMac } from '../../utils/hotkey.ts';
import { Dialog } from '../../components/Dialog/Dialog.tsx';
import { CommandMenu } from '../../components/CommandMenu/CommandMenu.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';


// a one-step binding as aria-keyshortcuts writes it (Mod+K: Control+K, or Meta+K on a Mac)
const keyshortcut = (b) => (/\s/.test(String(b).trim()) ? undefined : String(b).trim().split('+').map((k) => (/^mod$/i.test(k) ? (isMac() ? 'Meta' : 'Control') : /^ctrl$/i.test(k) ? 'Control' : k)).join('+'));

export function CommandPalette({ items = [], hotkey = 'Mod+K', scope, trigger, open: openProp, defaultOpen = false, onOpenChange, title, placeholder,
  loading, query, onQueryChange, filter, onSelect, strings, className }) {
  const t = useStrings('commandPalette', strings);
  const controlled = openProp !== undefined;
  const [own, setOwn] = React.useState(!!defaultOpen);
  const open = controlled ? !!openProp : own;
  const setOpen = (v) => { if (!controlled) setOwn(v); if (onOpenChange) onOpenChange(v); };
  const field = React.useRef(null);
  const name = title || t.title;
  useHotkey(hotkey, () => setOpen(!open), { scope, allowInFields: true, label: name, group: 'General', enabled: !!hotkey });
  const chosen = (item) => { setOpen(false); if (onSelect) onSelect(item); };
  const opener = trigger ? React.cloneElement(React.Children.only(trigger), {
    'aria-haspopup': 'dialog', 'aria-keyshortcuts': hotkey ? keyshortcut(hotkey) : undefined,
    onClick: (e) => { if (trigger.props.onClick) trigger.props.onClick(e); setOpen(true); },
  }) : null;
  return (
    <>
      {opener}
      <Dialog open={open} onClose={() => setOpen(false)} title={name} size="md" initialFocus={field} closeLabel={t.close}
        className={cx('plx-command-palette', className)}>
        {open ? <CommandMenu ref={field} items={items} label={name} placeholder={placeholder} loading={loading} query={query} onQueryChange={onQueryChange}
          filter={filter} onSelect={chosen} strings={strings} className="plx-command-palette__menu" /> : null}
      </Dialog>
    </>
  );
}
