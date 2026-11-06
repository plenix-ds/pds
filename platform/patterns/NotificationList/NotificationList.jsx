/* Plenix · NotificationList
   Summary: The signed-in person's notifications, as a list (the session's, unless items are given).
   Usage:
     <NotificationList limit={5} onViewAll={() => …} onOpen={(n) => …} />
   Props:
     items: [{ id, text, time, unread }] (default: useSession().notifications)
     onChange(next): runs with the updated list after a read
     onOpen(n): runs when a notification is opened
     onViewAll(): adds a "View all" button that runs it
     limit: how many to show (default: all)
     label: the list's accessible name (default strings.label: "Notifications")
     footer: true (default) shows Mark all read and View all under the list; false when the page puts Mark all read in its
       own header (useSession().setNotifications)
     className: more classes
     strings: the words it shows and announces, for other languages: { label: "Notifications", empty: "No notifications",
       markAllRead: "Mark all read", viewAll: "View all" }
   Behavior:
     Unread ones are marked (ActivityList's unread dot) and bold.
     Opening one marks it read; Mark all read clears them, and is disabled when none are unread.
     Without items, the reads are saved to the session.
     With no notifications it says "No notifications".
   Notes:
     It lives in the page (the dashboard's Notifications section), not in the header: the header carries no notifications.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useSession } from '../../providers/SessionProvider.tsx';
import { ActivityList } from '../ActivityList/ActivityList.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';


export function NotificationList({ items, onChange, onOpen, onViewAll, limit, label, footer = true, strings, className }) {
  const t = useStrings('notificationList', strings);
  const session = useSession();
  const own = items || session.notifications;
  const unread = own.filter((n) => n.unread).length;
  const save = (next) => { if (!items) session.setNotifications(next); if (onChange) onChange(next); };
  const markAll = () => save(own.map((n) => Object.assign({}, n, { unread: false })));
  const open = (n) => { if (n.unread) save(own.map((x) => (x.id === n.id ? Object.assign({}, x, { unread: false }) : x))); if (onOpen) onOpen(n); };
  const shown = limit ? own.slice(0, limit) : own;
  return (
    <div className={cx('plx-notification-list', className)}>
      {shown.length ? (
        <ActivityList label={label || t.label} titleLines={2}>
          {shown.map((n) => (
            <ActivityList.Item key={n.id} title={n.text} time={n.time} unread={!!n.unread} onOpen={() => open(n)} />
          ))}
        </ActivityList>
      ) : <EmptyState size="inline">{t.empty}</EmptyState>}
      {footer ? <div className="plx-notification-list__footer">
        <Button size="sm" variant="ghost" disabled={!unread} onClick={markAll}>{t.markAllRead}</Button>
        {onViewAll ? <Button size="sm" variant="ghost" onClick={onViewAll}>{t.viewAll}</Button> : null}
      </div> : null}
    </div>
  );
}
