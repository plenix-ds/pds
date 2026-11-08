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
     variant: "default" | "tiles" (default "default"): "tiles" is the read-only look of D-0106 (a tile per field, two per row) for the PropertyList inside; the list's own variant wins (ADR 0044)
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
import { PropertyVariantContext } from '../PropertyList/PropertyList.tsx';

/** @public the prop type of PropertyGroup (ADR 0033) */
export type PropertyGroupProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  heading: React.ReactNode;
  level?: 2 | 3 | 4 | 5 | 6;
  /** "tiles": the read-only look (D-0106) for the list inside */
  variant?: 'default' | 'tiles';
  className?: string;
  children?: React.ReactNode;
};

export function PropertyGroup({ heading, level = 3, variant = 'default', className, children, ...rest }: PropertyGroupProps) {
  const id = React.useId();
  const Heading = ('h' + level) as 'h3';
  return (
    <section className={cx('plx-property-group', variant === 'tiles' && 'plx-property-group--tiles', className)} aria-labelledby={id} {...rest}>
      <Heading id={id} className="plx-property-group__heading">{heading}</Heading>
      <PropertyVariantContext.Provider value={variant}>{children}</PropertyVariantContext.Provider>
    </section>
  );
}
