/* Plenix · PropertyList
   Summary: Label and value pairs (metadata, details, settings summaries), as a description list.
   Usage:
     <PropertyList layout="columns">
       <PropertyList.Item label="Size" data>2.4 MB</PropertyList.Item>
     </PropertyList>
   Props:
     layout: "columns" (default; label and value side by side on a shared baseline) | "stacked" (label above value)
     variant: "default" | "tiles" (the read-only look of D-0106, set in one go: stacked items, each field on its own tile, two per row 16px apart,
       one per row when the list is narrower than 496px). Default: the enclosing PropertyGroup's variant, else "default". An explicit layout
       that is not "stacked" wins over "tiles" and warns in development (ADR 0044)
     className: more classes on the list
     children: the PropertyList.Item pairs
     PropertyList.Item.label: the label
     PropertyList.Item.htmlFor: the id of a control in the item, so the label names it
     PropertyList.Item.description: a line under the label
     PropertyList.Item.data: the value is a technical value (a size, a date, an ID, a file name): the data font, Reddit Mono,
       at the value size, so it shares the label's baseline; names, descriptions and statuses stay DM Sans; default false.
       It keeps its own writing direction in a right-to-left page (Isolate dir="auto"); a data value is text only (no links,
       controls or other parts inside it)
     PropertyList.Item.kind: "id" for a computed identifier or case number: it follows the page's direction (01-20261020 in a
       right-to-left page, 20261020-01 in a left-to-right one; owner, issue 606). Pair it with data for the data font
     PropertyList.Item.status: { label, tone, icon }: the value is a Badge with its icon (the icon is required: a status always has one); wins over children
     PropertyList.Item.lines: 2 | 3 | 4: the value is cut to that many lines (an ellipsis on the last); any other number warns and does not cut (ADR 0047)
     PropertyList.Item.overflow: "dialog" (default when lines is set) | "none": while the value is cut, a small corner button opens the whole value in a Dialog titled with the label; "none" opts out. Ignored with status
     PropertyList.Item.span: "full": in a tiles list the tile takes the whole row (a long note among short fields); no effect elsewhere (ADR 0045)
     PropertyList.Item.className: more classes on the pair
     PropertyList.Item.children: the value
   Notes:
     For an editable value put the control in the item and pass htmlFor (its id) so the label names it.
     A list of name/value facts shown as reference (a component's details, a capability's facts) is the defined data grid
       with a header row (Table / DataGrid), not a PropertyList (owner, 2026-10-09, replacing batch 296's rule); a
       PropertyList is for an item's own details in a panel (an inspector, a form's summary).
     Other props (aria-label) reach the <dl>.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useTruncated } from '../../utils/overflow.ts';
import { Tooltip } from '../../components/Tooltip/Tooltip.tsx';
import { Isolate } from '../../components/Isolate/Isolate.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import type { BadgeProps } from '../../components/Badge/Badge.tsx';
import type { IconValue } from '../../components/Icon/Icon.tsx';
import { devWarn } from '../../utils/devWarn.ts';

/** the variation a PropertyGroup gives its lists (internal, not exported from the package) */
export const PropertyVariantContext = React.createContext<'default' | 'tiles'>('default');
const TilesContext = React.createContext(false);   // the list is a tiles list (its items draw the tile)

/** @public the prop type of PropertyList (ADR 0011) */
export type PropertyListProps = React.HTMLAttributes<HTMLDListElement> & { layout?: 'columns' | 'stacked'; variant?: 'default' | 'tiles'; className?: string; children?: React.ReactNode };
/** @public the prop type of PropertyList.Item (ADR 0011) */
export type PropertyListItemProps = {
  label: React.ReactNode;
  /** the id of a control in the item, so the label names it */
  htmlFor?: string;
  description?: React.ReactNode;
  /** the value is a technical value: the data font */
  data?: boolean;
  /** "id": a computed identifier that follows the page's direction */
  kind?: 'id';
  /** the value as a Badge with its icon (the icon is required) */
  status?: { label: React.ReactNode; tone: BadgeProps['tone']; icon: IconValue };
  /** "full": the tile takes the whole row in a tiles list */
  span?: 'full';
  /** the value is cut to this many lines (2, 3 or 4) */
  lines?: 2 | 3 | 4;
  /** "dialog" (the default with lines): a corner button opens the whole value while it is cut; "none": no button */
  overflow?: 'none' | 'dialog';
  className?: string;
  children?: React.ReactNode;
};
export function PropertyList({ layout, variant, className, children, ...rest }: PropertyListProps) {
  const inherited = React.useContext(PropertyVariantContext);
  const tiles = (variant ?? inherited) === 'tiles';
  devWarn('PropertyList', { layout: tiles ? layout : undefined }, { layout: ['stacked'] });   // variant tiles is stacked: another layout wins
  const shown = layout ?? (tiles ? 'stacked' : 'columns');
  const isTiles = tiles && shown === 'stacked';
  return <TilesContext.Provider value={isTiles}><dl className={cx('plx-property-list', 'plx-property-list--' + shown, isTiles && 'plx-property-list--tiles', className)} {...rest}>{children}</dl></TilesContext.Provider>;
}

PropertyList.Item = function PropertyListItem({ label, htmlFor, description, data = false, kind, status, span, lines, overflow, className, children }: PropertyListItemProps) {
  const textRef = React.useRef<any>(null);
  const cut = useTruncated(textRef);
  const tile = React.useContext(TilesContext);
  devWarn('PropertyList.Item', { lines: lines !== undefined && [2, 3, 4].indexOf(Number(lines)) < 0 ? lines : undefined }, { lines: [2, 3, 4] });
  const cutTo = !status && [2, 3, 4].indexOf(Number(lines)) >= 0 ? Number(lines) : null;
  const value = kind === 'id' ? <Isolate kind="id">{children}</Isolate> : data ? <Isolate dir="auto">{children}</Isolate> : children;
  const cutValue = cutTo ? <Text as="span" lines={cutTo} overflow={(overflow || 'dialog') === 'dialog' ? 'dialog' : 'none'} overflowLabel={typeof label === 'string' ? label : undefined}>{value}</Text> : null;
  devWarn('PropertyList.Item', { status: status && !status.icon ? 'without an icon' : undefined, children: status && children ? 'beside a status' : undefined }, { status: ['with an icon'], children: ['alone'] });   // a status needs its icon and wins over children
  return (
    <div className={cx('plx-property-list__item', tile && 'plx-property-list__item--tile', span === 'full' && 'plx-property-list__item--full', className)}>
      <dt className="plx-property-list__label"><Tooltip content={label} disabled={!cut} describe={false} className="plx-property-list__label-tip"><span ref={textRef} className="plx-property-list__label-text">{htmlFor ? <label htmlFor={htmlFor}>{label}</label> : label}</span></Tooltip>
        {description ? <span className="plx-property-list__description" data-plx-text-follow="size">{description}</span> : null}
      </dt>
      <dd className={cx('plx-property-list__value', tile && 'plx-property-list__value--tile', data && 'plx-property-list__value--data')} data-plx-text-follow="size">{status ? <span className="plx-property-list__status"><Badge tone={status.tone} icon={status.icon}>{status.label}</Badge></span> : cutValue || value}</dd>
    </div>
  );
};
