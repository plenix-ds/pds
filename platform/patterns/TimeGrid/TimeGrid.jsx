/* Plenix · TimeGrid
   Summary: A calendar's week or day view: days as columns, hours as rows, today's column marked, and events placed by their
     start and end (03 › Data display › Specialized displays › Calendar view).
   Usage:
     <TimeGrid label="Week of 5 October" startHour={8} endHour={18}
       days={[{ key: 'mon', weekday: 'Mon', day: 5 }, { key: 'tue', weekday: 'Tue', day: 6, today: true }]}
       events={[{ id: 1, day: 'tue', start: 10, end: 11.5, title: 'Site visit', time: '10:00', color: c, onClick: open }]} />
   Props:
     days: the columns: [{ key, weekday, day, dateTime, today }]
     startHour / endHour: the first and the last hour shown (default 8 and 18)
     events: [{ id, day (a day key), start, end (hours, e.g. 9.5 for 9:30), title, time, color, onClick }]
     hourLabel(hour): how an hour is written (default "9:00")
     label: the accessible name of the grid
     className: more classes on the grid
   Behavior:
     An event is placed on quarter hours (start and end round to 15 minutes; at least 30 minutes tall): the grid takes its
     hours, days and each event's place as attributes, and system/steps.css has a rule per step (no style attribute).
     Each day is a group named by its date; its events are buttons when they have onClick (EventChip).
     The grid scrolls inside its own box when it is taller than its container.
   Notes:
     An event's place reaches the stylesheet as --plx-comp-time-grid-start and --plx-comp-time-grid-span (in hours from the
     first hour), and the row height is --plx-comp-time-grid-hour (a size token): nothing is positioned by a style.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { DateBadge } from '../../components/DateBadge/DateBadge.tsx';
import { EventChip } from '../../components/EventChip/EventChip.jsx';

const hourText = (h) => h + ':00';

export function TimeGrid({ days = [], startHour = 8, endHour = 18, events = [], hourLabel = hourText, label, className, ...rest }) {
  const hours = [];
  for (let h = startHour; h < endHour; h++) hours.push(h);
  return (
    <div className={cx('plx-time-grid', className)} role="group" aria-label={label} data-plx-hours={endHour - startHour} data-plx-days={days.length} {...rest}>
      <div className="plx-time-grid__corner" aria-hidden="true" />
      {days.map((d) => <div key={d.key} className={cx('plx-time-grid__head', d.today && 'is-today')}><DateBadge day={d.day} weekday={d.weekday} today={d.today} dateTime={d.dateTime} /></div>)}
      <div className="plx-time-grid__hours" aria-hidden="true">{hours.map((h) => <div key={h} className="plx-time-grid__hour">{hourLabel(h)}</div>)}</div>
      {days.map((d) => (
        <div key={d.key} className={cx('plx-time-grid__day', d.today && 'is-today')} role="group" aria-label={[d.weekday, d.day].filter(Boolean).join(' ')}>
          {hours.map((h) => <div key={h} className="plx-time-grid__slot" aria-hidden="true" />)}
          {events.filter((e) => e.day === d.key).map((e) => (
            <div key={e.id} className="plx-time-grid__event" data-plx-start={Math.max(0, Math.round((e.start - startHour) * 4))} data-plx-span={Math.max(2, Math.round((e.end - e.start) * 4))}>
              <EventChip fill title={e.title} time={e.time} color={e.color} onClick={e.onClick} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
