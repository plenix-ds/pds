/* Plenix · DataPill
   Summary: A value shown as a pill: the value itself (a case number, a person, a date, a price, an airport code, Yes or
     No) at the size of the text around it, in a color and with an icon that say something about it (owner, 2026-10-19:
     "data placed organized in pill style"). It never makes a row taller: its height is the density's inline control
     height. A person's pill (or plain name) carries their gender: blue with the male icon, pink with the female icon.
   Usage:
     <DataPill data>CTM-2026-00061</DataPill>
     <DataPill gender="female" fill>Marina Abdel-Malik</DataPill>
     <DataPill tone="green" variant="solid" data>$639</DataPill>
     <DataPill tone="orange" icon="calendar">Sat May 9</DataPill>
     <DataPill gender="male" variant="plain">Patrick O'Brien</DataPill>
   Props:
     children: the value
     tone: its color, a category color by name (CATEGORY_COLORS: red, green, yellow, blue, orange, purple, cyan, magenta,
       lime, pink, teal, lavender, beige, maroon, mint, olive, apricot, navy, gray). The pill writes exactly the value given
       (data-plx-category). "grey" is Deprecated (issue 882): write "gray", which draws the same. The default, no tone,
       is still "grey" in this release (Deprecated: CTM's stylesheet selects it); it becomes "gray" in a later release
     variant: "soft" (default: a soft fill, a 1px border two shades darker, the text in the darkest shade) | "solid" (the
       color as the fill, its own text color: a strong value such as a price band) | "plain" (no box: the icon and the
       text in the color, a name in running text)
     size: (default) the height of the text line it sits in (the density's inline control height) | "md": 24px tall, 4px
       before the icon (or the value) and 4px after the value, equal to the space above and below the text, at every density (owner, 2026-10-22 and
       2026-10-29; a DataGrid or Table cell's pill). A pill the grid widens to its column's shared width centers its content, so the extra splits between the sides
     icon: an icon name before the value (a calendar for a date, the sun or the moon for a time); false: no icon at all,
       not even the gender's: a name beside the person's avatar or picture never repeats its icon (owner, 2026-10-19)
     data: a technical value (a code, a number, a time, a price): the data font
     fill: the pill takes the whole width of its cell or container
     gender: "male" | "female": a person's pill: blue with the person-male icon or pink with the person-female icon, and
       the gender said to assistive technology; any other value (or none) with a person: the default (grey) with the default person
       icon. Set person to show the default icon when the gender is unknown
     person: the value is a person (the person icon when no gender is known)
     strings: the words it announces, for other languages: { male: "male", female: "female" }
     className: more classes on the pill
     ...rest: other attributes go on the pill
   Behavior:
     The text never wraps; a value too long for a filled pill ends in an ellipsis and its full text is the tooltip (title).
     The pill is not interactive: a value that opens something is a Link inside it, or the cell's own action.
   Notes:
     Writing direction (owner, ctm-needs-34): with data, the value keeps its own direction (dir="auto") in a right-to-left page.
     kind="id" (owner, issue 606): the value is a computed identifier or case number. It follows the direction around it, so in a right-to-left
       page it reads 01-20261020 and in a left-to-right one 20261020-01; an email, a URL, a phone number or a code stays data (left to right).
     Not a Tag (a keyword next to content, 10px) and not a Badge (a status): a DataPill is the value itself.
     DataGrid: a column's pill option draws each value as a DataPill (DataGrid.tsx).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { devWarn } from '../../utils/devWarn.ts';
import { Icon } from '../Icon/Icon.tsx';
import type { IconModule, IconValue } from '../Icon/Icon.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import { Isolate } from '../Isolate/Isolate.tsx';
import PersonIcon from 'plenix-platform/icons/plenix/person';
import PersonFemaleIcon from 'plenix-platform/icons/plenix/person-female';
import PersonMaleIcon from 'plenix-platform/icons/plenix/person-male';

const GENDER: Record<string, { tone: string; icon: IconModule }> = { male: { tone: 'blue', icon: PersonMaleIcon }, female: { tone: 'pink', icon: PersonFemaleIcon } };

export type DataPillProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** a category color by name (the default is grey, this release) */
  tone?: string;
  variant?: 'soft' | 'solid' | 'plain';
  size?: 'sm' | 'md';
  /** false: no icon */
  icon?: IconValue | false;
  /** a data value (its own reading direction) */
  data?: boolean;
  /** "id": an identifier, isolated */
  kind?: string;
  /** it fills its cell, cut with an ellipsis */
  fill?: boolean;
  /** "male" | "female": the gender icon and color */
  gender?: string;
  /** the person icon */
  person?: boolean;
  strings?: Catalog | null;
};
export function DataPill({ children, tone, variant = 'soft', size, icon, data = false, kind, fill = false, gender, person = false, strings, className, ...rest }: DataPillProps) {
  devWarn('DataPill', { variant }, { variant: ['soft', 'solid', 'plain'] });
  const t = useStrings('dataPill', strings) as Record<string, string>;
  const g = GENDER[gender as string];
  const color = g ? g.tone : (tone || (variant === 'plain' ? undefined : 'grey'));   // a plain value with no color keeps the text color; the default stays "grey" this release (Deprecated, issue 882: CTM selects it)
  const glyph = icon === false ? null : g ? g.icon : (icon || (person ? PersonIcon : null));   // icon={false}: a picture beside it already says it
  const title = fill && (typeof children === 'string' || typeof children === 'number') ? String(children) : undefined;
  return (
    <span className={cx('plx-data-pill', size === 'md' && variant !== 'plain' && 'plx-data-pill--md', 'plx-data-pill--' + variant, data && 'plx-data-pill--data', fill && 'plx-data-pill--fill', className)} data-plx-category={color} title={title} {...rest}>
      {glyph ? <Icon name={glyph} size="sm" className="plx-data-pill__icon" filled={!!g} /> : null}
      <span className="plx-data-pill__value" dir={data && kind !== 'id' ? 'auto' : undefined}>{kind === 'id' ? <Isolate kind="id">{children}</Isolate> : children}</span>
      {g ? <span className="plx-visually-hidden">{', ' + t[gender as string]}</span> : null}
    </span>
  );
}
