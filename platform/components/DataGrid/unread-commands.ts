/* Plenix · DataGrid.unreadCommands
   Summary: The unread filter and the Mark as read / Mark as unread commands for an app's CommandBar, the Fluent (Outlook)
     way: nothing is drawn above the grid's column headers (owner, 2026-10-24).
   Usage:
     const unread = DataGrid.unreadCommands({ unreadKeys, onUnreadChange: setUnreadKeys, selected, unreadOnly, onUnreadOnlyChange: setUnreadOnly });
     <CommandBar actions={[...pageActions, unread.filter]} selection={{ count: selected.length, actions: [...unread.selection, ...others] }} />
     <DataGrid unreadKeys={unreadKeys} onUnreadChange={setUnreadKeys} unreadOnly={unreadOnly} onUnreadOnlyChange={setUnreadOnly} … />
   Props:
     unreadKeys: the unread record keys; onUnreadChange(keys, { unreadCount }): the change
     selected: the selected record keys (the selection commands act on them)
     unreadOnly, onUnreadOnlyChange(next): the filter (the grid's own props of the same names)
     strings: { unread: "Unread ({count})", markRead: "Mark as read", markUnread: "Mark as unread" }
   Behavior: filter is a toggle command for the CommandBar ("Unread (2)", pressed while only unread rows show), as
     Outlook's Unread filter; selection is two
     commands, each disabled while it would change nothing (no selected unread row, no selected read row).
   Notes: The row menu offers the same two commands for one row; the grid keeps unread rows bold with the start bar. */
import MailIcon from 'plenix-platform/icons/plenix/mail';
import MarkUnreadIcon from 'plenix-platform/icons/plenix/mark-unread';
type UnreadKey = string | number;
export interface UnreadCommandsOptions {
  unreadKeys?: UnreadKey[];
  onUnreadChange?: (keys: string[], info: { unreadCount: number }) => void;
  selected?: UnreadKey[];
  unreadOnly?: boolean;
  onUnreadOnlyChange?: (next: boolean) => void;
  strings?: { unread?: string; markRead?: string; markUnread?: string };
}
export function unreadCommands({ unreadKeys = [], onUnreadChange, selected = [], unreadOnly = false, onUnreadOnlyChange, strings }: UnreadCommandsOptions = {}) {
  const t = Object.assign({ unread: 'Unread ({count})', markRead: 'Mark as read', markUnread: 'Mark as unread' }, strings);
  const keys = new Set(unreadKeys.map(String)), picked = selected.map(String);
  const change = (next: Iterable<string>) => { const list = [...next]; onUnreadChange && onUnreadChange(list, { unreadCount: list.length }); };
  const anyUnread = picked.some((k) => keys.has(k)), anyRead = picked.some((k) => !keys.has(k));
  return {
    filter: { id: 'unread', label: t.unread.replace('{count}', String(keys.size)), icon: MarkUnreadIcon, toggle: true, pressed: !!unreadOnly,
      onSelect: (next?: unknown) => onUnreadOnlyChange && onUnreadOnlyChange(typeof next === 'boolean' ? next : !unreadOnly) },
    selection: [
      { id: 'mark-read', label: t.markRead, icon: MailIcon, disabled: !anyUnread, onSelect: () => change([...keys].filter((k) => !picked.includes(k))) },
      { id: 'mark-unread', label: t.markUnread, icon: MarkUnreadIcon, disabled: !anyRead, onSelect: () => change(new Set([...keys, ...picked])) },
    ],
  };
}
