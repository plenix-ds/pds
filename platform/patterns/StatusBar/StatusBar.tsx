/* Plenix · StatusBar
   Summary: The thin line at the foot of an application window with library-wide facts.
   Usage:
     <StatusBar start={<>…</>} end={<>…</>} />
   Props:
     start: the facts at the start of the line
     end: the facts at the end of the line
     className: more classes
   Notes:
     It is a footer (contentinfo landmark) on the inverse surface.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';

/** @public the prop type (ADR 0011) */
export type StatusBarProps = { start?: React.ReactNode; end?: React.ReactNode; className?: string };
export function StatusBar(props: StatusBarProps) {
  const { start, end, className } = props as any;
  return (
    <footer className={cx('plx-status-bar', className)}>
      <span className="plx-status-bar__start">{start}</span>
      {end ? <span className="plx-status-bar__end">{end}</span> : null}
    </footer>
  );
}
