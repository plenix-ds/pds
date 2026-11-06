/* Plenix · RelatedAssets
   Summary: Related images as a responsive grid or a manually navigated carousel.
   Usage: <RelatedAssets items={assets} variant="strip" label="Related assets" onOpen={openAsset} />
   Props: items: [{ id, src, alt, title, meta, href }]; variant: strip | grid; label; onOpen(item); strings: empty; className.
   Behavior: Asset links navigate; callbacks open application views. The carousel never advances automatically.
   Notes: Reuses MediaCard, Carousel and ContentGrid; recommendations and their order belong to the caller.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { Carousel } from '../../components/Carousel/Carousel.tsx';
import { MediaCard } from '../../components/Card/Card.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { ContentGrid } from '../ContentGrid/ContentGrid.tsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

/** @public one related asset */
export type RelatedAsset = { id: string | number; src: string; alt?: string; title?: string; meta?: React.ReactNode; href?: string };
/** @public the prop type (ADR 0011) */
export type RelatedAssetsProps = { items?: RelatedAsset[]; variant?: 'strip' | 'grid'; label?: string; onOpen?(item: RelatedAsset): void; strings?: Record<string, string>; className?: string };
export function RelatedAssets(props: RelatedAssetsProps) {
  const { items = [], variant = 'strip', label, onOpen, strings, className } = props as any;
  devWarn('RelatedAssets', { variant }, { variant: ['strip','grid'] });
  const t: any = useStrings('relatedAssets', strings);
  const cards = items.map((a: any) => <MediaCard key={a.id} src={a.src} alt={a.alt} title={a.title} meta={a.meta} href={a.href} onOpen={!a.href && onOpen ? () => onOpen(a) : undefined} />);
  return <Stack className={cx('plx-related-assets', className)}>{!items.length ? <EmptyState title={t.empty} /> : variant === 'grid'
    ? <ContentGrid label={label}>{cards}</ContentGrid> : <Carousel label={label} perView={2} strings={strings}>{cards}</Carousel>}</Stack>;
}