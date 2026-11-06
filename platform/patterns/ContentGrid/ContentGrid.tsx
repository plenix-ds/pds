/* Plenix · ContentGrid
   Summary: A responsive grid of cards, a masonry of pictures of mixed heights, or justified rows of pictures.
   Usage:
     <ContentGrid size="md" label="Assets"><Card…/><Card…/></ContentGrid>
     <ContentGrid layout="masonry" size="sm" label="Photos"><Image…/><Image…/></ContentGrid>
     <ContentGrid layout="justified" label="Photos"><Image ratio="16-9" …/><Image ratio="3-4" …/></ContentGrid>
   Props:
     size: "xs" | "sm" | "md" (default) | "lg"; sets the smallest card width (100, 140, 180, 240px), and in justified rows
       the row height
     layout: "grid" (default: rows of equal cells) | "masonry" (columns of the card width; each item keeps its own height)
       | "justified" (rows of the size's height that fill the width; each item as wide as its ratio)
     virtualized: true draws only the card rows in view (default false; ADR 0019): the grid becomes a scroll area at its container's
       block size, so give the container a height. The columns follow the width and size as today's grid; each card keeps its place in
       the whole set (aria-posinset of aria-setsize), and a card that has the focus stays drawn when it scrolls out of view. Only for
       layout "grid" (masonry and justified ignore it, with one development warning); the cards are a flat list
       (a row is as tall as its tallest card, as in the same grid drawn all at once; the 4:3 size is only the estimate for the rows not yet drawn)
     label: names the list
     className: more classes on the grid
     children: the cards; each child is one list item (null, undefined and false are skipped). In justified rows each
       child's ratio prop ("1-1", "4-3", "3-2", "16-9", "21-9", "3-4", "9-16"; the aspect-ratio scale) sets its width;
       a child without one is 4:3
   Behavior:
     Columns fill the width.
     The gap follows the density (--plx-sys-card-grid-gap).
     Masonry fills each column from top to bottom in the markup order, so reading and Tab go down the first column, then
       the next; where the browser lays out a masonry grid (grid-template-rows: masonry) it fills row by row instead.
       An item never breaks across two columns.
     Justified rows keep the row height and widen each item by its ratio until the row is full; the last row keeps its
       items at their own width. Pictures in it fill their cell (cover), so a few pixels of their edges may be cropped.
   Notes:
     Masonry and justified rows are for browsing pictures; when the order matters (sorted results) use the grid.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { useVirtualizer, VirtualGap, VirtualProbe } from '../../hooks/useVirtualizer.ts';

const RATIOS = ['1-1', '4-3', '3-2', '16-9', '21-9', '3-4', '9-16'];

/** @public */
export type ContentGridProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  layout?: 'grid' | 'masonry' | 'justified';
  /** draws only the card rows in view (ADR 0019); layout "grid" */
  virtualized?: boolean;
  label?: string;
  className?: string;
  children?: React.ReactNode;
};
export function ContentGrid({ size = 'md', layout = 'grid', virtualized = false, label, className, children }: ContentGridProps) {
  devWarn('ContentGrid', { size }, { size: ['xs','sm','md','lg'] });
  if (virtualized && layout !== 'grid') devWarn('ContentGrid', { virtualized: 'with layout ' + layout }, { virtualized: ['with layout grid (masonry and justified draw every card)'] });
  if (virtualized && layout === 'grid') return <VirtualGrid size={size} label={label} className={className}>{children}</VirtualGrid>;
  const justified = layout === 'justified';
  return (
    <ul aria-label={label} className={cx('plx-content-grid', 'plx-content-grid--' + size, layout !== 'grid' ? 'plx-content-grid--' + layout : null, className)}>
      {React.Children.map(children, (c) => {
        if (c === null || c === undefined || c === false) return null;
        const ratio = justified ? ((c as any).props && RATIOS.indexOf((c as any).props.ratio) >= 0 ? (c as any).props.ratio : '4-3') : undefined;
        return <li className="plx-content-grid__item" data-plx-ratio={ratio}>{c}</li>;
      })}
    </ul>
  );
}

// the virtualized grid (ADR 0019): the same list, a scroll area at its container's height, only the rows in view drawn
function VirtualGrid({ size, label, className, children }: any) {
  const cards: any[] = React.Children.toArray(children).filter((c: any) => c !== null && c !== undefined && c !== false);
  const v = useVirtualizer({ count: cards.length, grid: true, mode: 'measured' });
  return (
    <ul ref={v.viewportRef as any} aria-label={label} className={cx('plx-content-grid', 'plx-content-grid--' + size, 'plx-content-grid--virtual', className)}>
      {cards.length ? <VirtualProbe /> : null}
      {v.segments.map((s) => (s.gap ? <VirtualGap key={s.key} count={s.count} /> : <li key={s.key} className="plx-content-grid__item" {...v.itemProps(s.index)}>{cards[s.index]}</li>))}
    </ul>
  );
}
