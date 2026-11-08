/* Plenix · EntityTitle
   Summary: A short title line for a list row or a card (issue 803): an icon, the title on one line (cut with "…"), a
     subtitle under it and a tag after it; a loading placeholder while the item loads. EntityHeader is the full page header.
   Usage:
     <EntityTitle icon="document" title="Easter flyer.pdf" subtitle="Edited 2 hours ago" />
     <EntityTitle icon="folder" title="Parish photos" tag="Archive" />
     <EntityTitle title="Budget 2027" subtitle="Finance" tag={{ label: 'Approved', tone: 'success', icon: 'check' }} level={3} />
     <EntityTitle loading />
   Props:
     title: the item's name (required; any node, a string is best): one line, cut with "…" when it does not fit
     icon: an icon name (platform/icons/map.json), an icon module or an Icon element, before the text; plain, never in a box
     subtitle: an element or text: one line under the title, in the muted color (a type, a date, a place), cut with "…" too
     tag: after the title: a string is a Tag (a category, neutral); { label, tone, icon, category } is a status Badge with
       its icon (tone and icon as Badge takes them; the icon is required by the status rule) or, with category, a Tag of
       that category color; an element is drawn as given
     level: a number, 1 to 6: makes the title a heading of that level (a card's title); default none (a span, for list rows)
     loading: a small spinner in place of the text (the icon's place kept, shown after about 1s); the item is aria-busy
     className: more classes on the wrapper
   Behavior:
     The title and the subtitle each stay on one line; a cut one shows its whole text in a tooltip on hover and focus, only
       while it is cut (issue 558). The icon and the tag never shrink; the text takes the rest.
     Not interactive itself: put it inside the row's or the card's link or button; it adds no Tab stop.
     Its lines are 20px (the title, a list row's text line and a badge's height) and 16px (the subtitle): one line 20px,
       two 36px, on the 4px grid, loading as tall as loaded. No padding of its own: a list row or a card keeps its rules.
     loading with subtitle (any truthy value) keeps the two-line height while it loads.
   Notes:
     The icon is decorative (aria-hidden): the title names the item.
     Other props pass through to the wrapper.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useTruncated } from '../../utils/overflow.ts';
import { asIcon } from '../Icon/Icon.tsx';
import type { IconValue } from '../Icon/Icon.tsx';
import { Badge } from '../Badge/Badge.tsx';
import type { BadgeProps } from '../Badge/Badge.tsx';
import { Tag } from '../Tag/Tag.tsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { Spinner } from '../Loading/Loading.tsx';

// one line that ends in "…" when cut; its whole text in a tooltip only while it is cut
function Line({ as: As = 'span', className, children }: { as?: React.ElementType; className?: string; children?: React.ReactNode }) {
  const ref = React.useRef<HTMLElement>(null);
  const text = typeof children === 'string' || typeof children === 'number' ? String(children) : '';
  const cut = useTruncated(ref, text);
  return (
    <Tooltip content={text} disabled={!cut || !text} describe={false} className="plx-entity-title__tip">
      <As ref={ref} className={className}>{children}</As>
    </Tooltip>
  );
}

type TagObject = { label?: React.ReactNode; category?: string; tone?: BadgeProps['tone']; icon?: IconValue };
type EntityTag = React.ReactNode | TagObject;
const tagOf = (tag: EntityTag): React.ReactNode => {
  if (tag === undefined || tag === null || tag === false || tag === '') return null;
  if (React.isValidElement(tag)) return tag;
  if (typeof tag === 'string' || typeof tag === 'number') return <Tag>{tag}</Tag>;
  const object = tag as TagObject;
  if (object.category) return <Tag category={object.category}>{object.label}</Tag>;
  return <Badge tone={object.tone} icon={object.icon}>{object.label}</Badge>;
};

/** @public */
export type EntityTitleProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
  /** the title line */
  title?: React.ReactNode;
  /** an icon before the title */
  icon?: IconValue;
  subtitle?: React.ReactNode;
  /** a tag after the title: text, an element, { label, category } (a Tag) or { label, tone, icon } (a Badge) */
  tag?: EntityTag;
  /** draws the title as a heading of this level (1 to 6) */
  level?: number;
  /** shows a placeholder in place of the text */
  loading?: boolean;
};
export function EntityTitle({ title, icon, subtitle, tag, level, loading = false, className, ...rest }: EntityTitleProps) {
  const heading = (level !== undefined && level >= 1 && level <= 6 ? 'h' + Math.round(level) : 'span') as React.ElementType;
  const badge = loading ? null : tagOf(tag);
  return (
    <div className={cx('plx-entity-title', subtitle && 'plx-entity-title--subtitle', loading && 'is-loading', className)} aria-busy={loading || undefined} {...rest}>
      {icon ? <span className="plx-entity-title__icon" aria-hidden="true">{asIcon(icon)}</span> : null}
      {loading ? (
        <span className={cx('plx-entity-title__placeholder', subtitle && 'plx-entity-title__placeholder--subtitle')}><Spinner size="sm" labelPosition="hidden" delay="region" /></span>
      ) : (
        <span className="plx-entity-title__text">
          <span className="plx-entity-title__line">
            <Line as={heading} className="plx-entity-title__title">{title}</Line>
            {badge ? <span className="plx-entity-title__tag">{badge}</span> : null}
          </span>
          {subtitle ? <Line className="plx-entity-title__subtitle">{subtitle}</Line> : null}
        </span>
      )}
    </div>
  );
}
