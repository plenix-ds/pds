/* Plenix · PropertyGroup
   Summary: A group of read-only fields under its own heading (13px medium, gold, sentence case), for details split into groups.
   Usage:
     <PropertyGroup heading="Contact" level={3}>
       <PropertyList layout="stacked">
         <PropertyList.Item label="Email">sara@example.org</PropertyList.Item>
       </PropertyList>
     </PropertyGroup>
   Props:
     heading: the group's name, in sentence case (required)
     level: the heading level, 2 to 6; default 3. Pick it from the outline; it never changes the size
     className: more classes on the section
     children: one PropertyList
     ...rest: other attributes go on the section
   Behavior:
     The section is named by its heading (aria-labelledby).
     A group that follows another sits 40px below it, at every density; the first group sets no outer margin.
   Notes:
     A heading is not valid inside a <dl>, so the heading belongs to this part, not to PropertyList.
     It is not the page section heading: SectionHeading keeps the card heading style (D-0110).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';

/** @public the prop type of PropertyGroup (ADR 0033) */
export type PropertyGroupProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  heading: React.ReactNode;
  level?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  children?: React.ReactNode;
};

export function PropertyGroup({ heading, level = 3, className, children, ...rest }: PropertyGroupProps) {
  const id = React.useId();
  const Heading = ('h' + level) as 'h3';
  return (
    <section className={cx('plx-property-group', className)} aria-labelledby={id} {...rest}>
      <Heading id={id} className="plx-property-group__heading">{heading}</Heading>
      {children}
    </section>
  );
}
