/* Plenix · ActivityList
   Summary: A list of things that happened or arrived (messages, versions, notifications, notes).
   Usage:
     <ActivityList label="Recent emails">
       <ActivityList.Item leading={<Avatar…/>} title="Maya Chen" meta="Round 3 concepts"
         time="10:24 AM" dateTime="2026-10-05T10:24" unread onOpen={() => …} actions={<…/>} />
     </ActivityList>
   Props:
     label: the list's accessible name
     stacked: the meta on its own line under the title, in the smallest type (12px, the type floor): for narrow panes
       such as an inspector (batch 260); default false: title and meta on one line
     titleLines: 1 (default; the title on one line, cut with an ellipsis) | 2 (the title wraps onto two lines and takes
       the room it needs, in regular weight; unread titles stay semibold): for notifications
     className: more classes on the list
     children: the ActivityList.Item rows
     ActivityList.Item.leading: content before the text (an avatar, an icon)
     ActivityList.Item.title: the row's title; it opens the item when onOpen or href is given
     ActivityList.Item.meta: a line under the title
     ActivityList.Item.time: the time shown at the row's end
     ActivityList.Item.dateTime: the machine-readable time of the time element
     ActivityList.Item.unread: a dot and a bold title (and "Unread" for screen readers); default false
     ActivityList.Item.selected: the row whose details are shown (aria-current); default false
     ActivityList.Item.onOpen(): runs when the title is activated (the title is a button)
     ActivityList.Item.href: the title is a link that opens the item (instead of onOpen)
     ActivityList.Item.actions: controls at the row's end
     ActivityList.Item.className: more classes on the row
   Behavior:
     Alignment (owner, batch 271): a row's content starts and ends at the list's edges, in line with a section heading and
       its line; a row that opens keeps a small inset for its hover fill, pulled back by the same token.
     With onOpen or href the title opens the item and covers the row: one Tab stop, and the actions stay reachable.
     Row padding follows the density.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { dataWhenText } from '../../utils/dataText.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';

// stacked lists set the meta's text in the smallest type: text inside the meta follows it (data-plx-text-follow)
const StackedContext = React.createContext(false);

/** @public */
export type ActivityListProps = {
  label?: string;
  /** the meta on its own line under the title (narrow panes) */
  stacked?: boolean;
  /** 1 (default) or 2 title lines */
  titleLines?: 1 | 2;
  className?: string;
  /** the ActivityList.Item rows */
  children?: React.ReactNode;
};
export function ActivityList({ label, stacked = false, titleLines = 1, className, children }: ActivityListProps) {
  return <StackedContext.Provider value={stacked}><ul aria-label={label} className={cx('plx-activity-list', stacked && 'plx-activity-list--stacked', titleLines === 2 && 'plx-activity-list--title-2', className)}>{children}</ul></StackedContext.Provider>;
}

export type ActivityListItemProps = {
  leading?: React.ReactNode; title?: React.ReactNode; meta?: React.ReactNode; time?: React.ReactNode;
  /** the machine-readable time of the time element */ dateTime?: string;
  unread?: boolean; selected?: boolean; onOpen?: React.MouseEventHandler<HTMLButtonElement>; href?: string; actions?: React.ReactNode; className?: string;
};
ActivityList.Item = function ActivityListItem({ leading, title, meta, time, dateTime, unread = false, selected = false, onOpen, href, actions, className }: ActivityListItemProps) {
  const stacked = React.useContext(StackedContext);
  const words: any = useStrings('activityList');
  const opener = href ? <a href={href} className="plx-activity-list__opener">{title}</a>
    : onOpen ? <button type="button" className="plx-activity-list__opener" onClick={onOpen}>{title}</button>
      : <span className="plx-activity-list__opener">{title}</span>;
  return (
    <li className={cx('plx-activity-list__item', (href || onOpen) && 'is-interactive', unread && 'is-unread', selected && 'is-selected', className)} aria-current={selected ? 'true' : undefined}>
      {unread ? <span className="plx-activity-list__unread"><span className="plx-visually-hidden">{words.unread}</span></span> : null}
      {leading ? <span className="plx-activity-list__leading">{leading}</span> : null}
      <span className="plx-activity-list__text">
        <span className="plx-activity-list__title">{opener}</span>
        {meta ? <span className="plx-activity-list__meta" data-plx-text-follow={stacked ? 'size' : undefined}>{dataWhenText(meta)}</span> : null}
      </span>
      {time ? <time className="plx-activity-list__time" dateTime={dateTime}>{time}</time> : null}
      {actions ? <span className="plx-activity-list__actions">{actions}</span> : null}
    </li>
  );
};
