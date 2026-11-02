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
     loading: a placeholder in place of the text (two bars, the icon's place kept); the item is aria-busy
     className: more classes on the wrapper
   Behavior:
     The title and the subtitle each stay on one line; a cut one shows its whole text in a tooltip on hover and focus, only
       while it is cut (issue 558). The icon and the tag never shrink; the text takes the rest.
     Not interactive itself: put it inside the row's or the card's link or button; it adds no Tab stop.
     Its lines are 20px (the title, a list row's text line and a badge's height) and 16px (the subtitle): one line 20px,
       two 36px, on the 4px grid, loading as tall as loaded. No padding of its own: a list row or a card keeps its rules.
     loading with subtitle (any truthy value) shows the second bar, so a two-line item keeps its height while it loads.
   Notes:
     The icon is decorative (aria-hidden): the title names the item.
     Other props pass through to the wrapper.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useTruncated } from '../../utils/overflow.ts';
import { asIcon } from '../Icon/Icon.tsx';
import { Badge } from '../Badge/Badge.tsx';
import { Tag } from '../Tag/Tag.tsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { Skeleton } from '../Loading/Loading.tsx';

// one line that ends in "…" when cut; its whole text in a tooltip only while it is cut
function Line({ as: As = 'span', className, children }) {
  const ref = React.useRef(null);
  const text = typeof children === 'string' || typeof children === 'number' ? String(children) : '';
  const cut = useTruncated(ref, text);
  return (
    <Tooltip content={text} disabled={!cut || !text} describe={false} className="plx-entity-title__tip">
      <As ref={ref} className={className}>{children}</As>
    </Tooltip>
  );
}

const tagOf = (tag) => {
  if (tag === undefined || tag === null || tag === false || tag === '') return null;
  if (React.isValidElement(tag)) return tag;
  if (typeof tag === 'string' || typeof tag === 'number') return <Tag>{tag}</Tag>;
  if (tag.category) return <Tag category={tag.category}>{tag.label}</Tag>;
  return <Badge tone={tag.tone} icon={tag.icon}>{tag.label}</Badge>;
};

export function EntityTitle({ title, icon, subtitle, tag, level, loading = false, className, ...rest }) {
  const heading = level >= 1 && level <= 6 ? 'h' + Math.round(level) : 'span';
  const badge = loading ? null : tagOf(tag);
  return (
    <div className={cx('plx-entity-title', subtitle && 'plx-entity-title--subtitle', loading && 'is-loading', className)} aria-busy={loading || undefined} {...rest}>
      {icon ? <span className="plx-entity-title__icon" aria-hidden="true">{asIcon(icon)}</span> : null}
      {loading ? (
        <span className="plx-entity-title__placeholder">
          <span className="plx-entity-title__bar-line"><Skeleton width="160px" height="12px" className="plx-entity-title__bar" /></span>
          {subtitle ? <span className="plx-entity-title__bar-line plx-entity-title__bar-line--subtitle"><Skeleton width="96px" height="8px" className="plx-entity-title__bar" /></span> : null}
        </span>
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
