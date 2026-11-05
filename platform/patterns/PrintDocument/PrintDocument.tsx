/* Plenix · PrintDocument (pattern)
   Summary: An A4 document. On screen a sheet that looks like a card (210mm wide, at least 297mm tall, it grows with its
     content); on paper A4 with 20mm margins, the letterhead at the top and the footer once, at the end (D-0052, D-0053).
   Usage:
     <PrintDocument header={<img src={seal} alt="" />} footer={<p>Issued 2026-11-05</p>} dir="rtl" lang="ar">
       <h1>…</h1><AnswerLines label="Notes" lines={4} /><PageBreak />
     </PrintDocument>
   Props:
     header: the letterhead or seal; first sheet, top, kept together
     footer: printed once, in flow, at the end of the document (no running footer, no page numbers)
     children: the content, in normal flow; any child may set its own dir
     dir, lang: on the sheet's root
     className, ...rest: on the sheet
*/
import React from 'react';

export type PrintDocumentProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  dir?: 'ltr' | 'rtl';
  lang?: string;
};
export function PrintDocument({ header, footer, children, className, ...rest }: PrintDocumentProps) {
  return (
    <div className={['plx-print-document', className].filter(Boolean).join(' ')} data-plx-density="standard" {...rest}>
      {header ? <div className="plx-print-document__header">{header}</div> : null}
      {children}
      {footer ? <div className="plx-print-document__footer">{footer}</div> : null}
    </div>
  );
}
