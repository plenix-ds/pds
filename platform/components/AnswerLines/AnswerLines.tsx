/* Plenix · AnswerLines
   Summary: Ruled writing lines for a printed form, 32px apart (about 8.5mm), kept on one sheet.
   Usage:
     <AnswerLines label="Notes" lines={4} />
   Props:
     lines: a whole number from 1 to 40; missing or invalid gives 3
     label: names the group (role="group"); without it the lines are hidden from assistive technology
     className, ...rest: on the block
*/
import React from 'react';

type AnswerLinesProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & { lines?: number; label?: React.ReactNode };
const DEFAULT = 3, MAX = 40;
function count(lines: unknown): number {
  if (lines === undefined) return DEFAULT;
  const n = Number(lines);
  if (!Number.isFinite(n) || n < 1) return DEFAULT;
  return Math.min(MAX, Math.floor(n));
}
export function AnswerLines({ lines, label, className, ...rest }: AnswerLinesProps) {
  const id = React.useId();
  const rows = Array.from({ length: count(lines) }, (_, i) => <span key={i} className="plx-answer-lines__row" />);
  const cls = ['plx-answer-lines', className].filter(Boolean).join(' ');
  if (label) {
    return (
      <div className={cls} role="group" aria-labelledby={id} {...rest}>
        <span id={id} className="plx-answer-lines__label">{label}</span>
        {rows}
      </div>
    );
  }
  return <div className={cls} aria-hidden="true" {...rest}>{rows}</div>;
}
