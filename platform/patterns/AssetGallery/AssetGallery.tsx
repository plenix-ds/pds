/* Plenix · AssetGallery
   Summary: Browse image assets in masonry or justified rows and optionally open the existing lightbox.
   Usage: <AssetGallery items={assets} layout="masonry" lightbox label="Project images" />
   Props:
     items: [{ id, src, alt, title, meta, ratio }]; layout: grid | masonry | justified; size: ContentGrid size;
     virtualized: ContentGrid's (ADR 0019): only the rows in view are drawn, in a scroll area at the container's height (layout grid).
     lightbox: open images with MediaViewer; onOpen(item, index): optional application action when lightbox is off.
     label: gallery name; empty: empty text; strings: empty, preview; className.
   Behavior: Card titles open the selected image; the viewer supports keyboard navigation and restores focus.
   Notes: Preserve source order when it matters. Asset grid already belongs to the DAM template record.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { ContentGrid } from '../ContentGrid/ContentGrid.jsx';
import { MediaCard } from '../../components/Card/Card.tsx';
import { MediaViewer } from '../../components/MediaViewer/MediaViewer.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

/** @public one image of the gallery */
export type AssetGalleryItem = { id: string | number; src: string; alt?: string; title?: string; meta?: string; ratio?: number | string };
/** @public */
export type AssetGalleryProps = {
  items?: AssetGalleryItem[];
  layout?: 'grid' | 'masonry' | 'justified';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** ContentGrid's (ADR 0019): only the rows in view are drawn (layout grid) */
  virtualized?: boolean;
  /** open images with MediaViewer */
  lightbox?: boolean;
  /** an application action when the lightbox is off */
  onOpen?(item: AssetGalleryItem, index: number): void;
  label?: string;
  empty?: React.ReactNode;
  strings?: Record<string, string>;
  className?: string;
};
export function AssetGallery({ items = [], layout = 'masonry', size = 'md', virtualized = false, lightbox = false, onOpen, label, strings, className }: AssetGalleryProps) {
  devWarn('AssetGallery', { size }, { size: ['xs','sm','md','lg'] });
  const t: any = useStrings('assetGallery', strings);
  const [active, setActive] = React.useState<any>(null);
  const index = items.findIndex((a) => a.id === active);
  return <Stack className={cx('plx-asset-gallery', className)}>
    {items.length ? <ContentGrid {...({} as any)} layout={layout} size={size} virtualized={virtualized} label={label}>{items.map((a, i) => <MediaCard {...({} as any)} key={a.id} ratio={a.ratio as any} aspect={String(a.ratio || '4-3').replace('-', '/') as any} src={a.src} alt={a.alt} title={a.title} meta={a.meta}
      onOpen={lightbox ? () => setActive(a.id) : onOpen ? () => onOpen(a, i) : undefined} />)}</ContentGrid> : <EmptyState title={t.empty} />}
    <MediaViewer open={lightbox && index >= 0} onClose={() => setActive(null)} items={items.map((a) => ({ ...a, meta: Array.isArray(a.meta) ? a.meta : a.meta ? [a.meta] : [] }))}
      index={Math.max(0, index)} onIndexChange={(i) => setActive(items[i].id)} label={t.preview} strings={strings} />
  </Stack>;
}