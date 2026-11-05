/* Plenix · PageBreak
   Summary: Starts a new sheet on paper. Nothing is drawn on screen; preview draws a dashed line so a reviewer sees where.
   Usage:
     <PageBreak />
     <PageBreak preview />
   Props:
     preview: draw the dashed line on screen; it never prints
     className, ...rest: on the element
*/
import React from 'react';

type PageBreakProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & { preview?: boolean };
export function PageBreak({ preview, className, ...rest }: PageBreakProps) {
  const cls = ['plx-page-break', preview && 'plx-page-break--preview', className].filter(Boolean).join(' ');
  return <div className={cls} aria-hidden="true" {...rest} />;
}
