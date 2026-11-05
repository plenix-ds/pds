/* Plenix · EventChip
   Summary: An event in a calendar: its title and time on a soft surface with an edge in the event's own color
     (03 › Data display › Specialized displays › Calendar view).
   Usage:
     <EventChip title="Site visit" time="10:00" color={calendar.color} onClick={() => open(e)} />
     <EventChip title="Design review" time="14:00–15:30" fill />
   Props:
     title: the event's name
     time: when, as shown
     color: the event's or its calendar's color, a data color: a hue name (blue, green, purple, red, brown, gray: the --plx-sys-data-color-<hue> tokens), set as data-plx-color; no value is written (batch 280); it draws the start edge
     fill: the chip fills its box (an event placed in a time grid); default false
     onClick(event): makes the chip a button that opens the event
     className: more classes on the chip
   Behavior:
     With onClick it is a button (focus ring, Enter and Space); without, plain text.
   Notes:
     The hue reaches the stylesheet as the data-plx-color attribute, the only way a data color enters (no style is written).
     Other props pass through to the element.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';

/** @public the prop type (ADR 0011) */
export type EventChipProps = Omit<React.HTMLAttributes<HTMLElement>, 'onClick' | 'title' | 'color'> & {
  /** the event's name */
  title?: React.ReactNode;
  /** when, as shown */
  time?: React.ReactNode;
  /** a data color: a hue name (blue, green, purple, red, brown, gray) */
  color?: string;
  /** the chip fills its box (an event placed in a time grid) */
  fill?: boolean;
  /** makes the chip a button that opens the event */
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
};

export function EventChip({ title, time, color, fill = false, onClick, className, ...rest }: EventChipProps) {
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} className={cx('plx-event-chip', fill && 'plx-event-chip--fill', onClick && 'plx-event-chip--interactive', className)}
      data-plx-color={color || undefined} {...rest}>
      {time ? <span className="plx-event-chip__time">{time}</span> : null}
      <span className="plx-event-chip__title">{title}</span>
    </Tag>
  );
}
