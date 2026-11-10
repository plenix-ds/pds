/* Plenix · Commerce: ProductDiscovery: a product discovery page
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { ContentGrid } from '../../patterns/ContentGrid/ContentGrid.tsx';
import { ProductCard as ProductCardJs } from '../../patterns/ProductCard/ProductCard.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { SearchField } from '../../components/SearchField/SearchField.tsx';
import { Card } from '../../components/Card/Card.tsx';
import { Carousel } from '../../components/Carousel/Carousel.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { useUid } from '../../utils/layer.ts';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import SearchIcon from 'plenix-platform/icons/plenix/search';
import { dataPhrase } from '../../utils/dataText.tsx';
import { Product, ProductListing } from './ProductListing.tsx';
import { useCommercePage } from './useCommercePage.ts';
const ProductCard: any = ProductCardJs;

/** @public the prop type of ProductDiscovery (ADR 0011) */
export type ProductDiscoveryProps = {
  products?: unknown[];
  categories?: unknown[];
  recommended?: unknown[];
  title?: React.ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  hrefFor?: (product: Product) => string;
  onOpen?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  suggestions?: unknown;
  pageSize?: number;
  strings?: Record<string, string>;
  className?: string;
};

export function ProductDiscovery(props: ProductDiscoveryProps) {
  const { products = [], categories = [], recommended = [], title, headingLevel = 1, hrefFor, onOpen, onAddToCart, suggestions,
  pageSize = 12, strings, className } = props as any;
  useCommercePage('product-discovery');
  const t: any = useStrings('commerce.discovery', strings);
  const uid = useUid('plx-commerce');
  const [text, setText] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<any>(null);
  const lower = text.trim().toLowerCase();
  const matches = lower ? products.filter((p: any) => p.title.toLowerCase().indexOf(lower) >= 0).slice(0, 6).map((p: any) => ({ value: p.title, label: p.title, description: p.meta })) : [];
  const run = (s: any) => { setText(s); setQuery(s); };
  const inCategory = category ? products.filter((p: any) => p.category === category) : products;
  const hits = query ? inCategory.filter((p: any) => [p.title, p.meta, p.category].join(' ').toLowerCase().indexOf(query.trim().toLowerCase()) >= 0) : inCategory;
  // no results: suggest the closest words people can search for instead
  const ideas = suggestions || categories.map((c: any) => c.label).slice(0, 4);
  const H: any = 'h' + Math.min(6, Math.max(1, headingLevel)), H2: any = 'h' + Math.min(6, headingLevel + 1);
  const chosen = categories.find((c: any) => c.value === category);
  const card = (p: any) => (
    <ProductCard key={p.id} title={p.title} href={hrefFor ? hrefFor(p) : undefined} onOpen={!hrefFor && onOpen ? () => onOpen(p) : undefined} image={p.image}
      price={p.price} currency={p.currency} compareAtPrice={p.compareAtPrice} outOfStock={p.outOfStock} meta={p.meta} rating={p.rating}
      reviewCount={p.reviewCount} onAddToCart={onAddToCart ? () => onAddToCart(p) : undefined} headingLevel={Math.min(6, headingLevel + 2)} />
  );
  return (
    <div className={cx('plx-commerce', 'plx-commerce--discovery', className)}>
      <header className="plx-commerce__head">
        <H className="plx-commerce__title">{title || t.title}</H>
        <div className="plx-commerce__search">
          <SearchField value={text} label={t.search} placeholder={t.search} onChange={(e) => setText(e.target.value)} onClear={() => run('')}
            suggestions={matches} onSelect={(item: any) => run(item.value)} onSubmitSearch={(s) => run(s)} />
        </div>
      </header>
      {!query && categories.length ? (
        <section className="plx-commerce__section" aria-labelledby={uid + '-categories'}>
          <H2 id={uid + '-categories'} className="plx-commerce__subtitle">{t.categories}</H2>
          <ContentGrid size="md" label={t.categories}>
            {categories.map((c: any) => (
              <Card key={c.value} title={c.label} headingLevel={Math.min(6, headingLevel + 2)} selected={category === c.value}
                onOpen={() => setCategory(category === c.value ? null : c.value)}
                meta={dataPhrase(products.filter((p: any) => p.category === c.value).length === 1 ? t.one : t.count, { n: products.filter((p: any) => p.category === c.value).length })} />
            ))}
          </ContentGrid>
        </section>
      ) : null}
      {!query && recommended.length ? (
        <section className="plx-commerce__section" aria-labelledby={uid + '-recommended'}>
          <H2 id={uid + '-recommended'} className="plx-commerce__subtitle">{t.recommended}</H2>
          <Carousel label={t.recommended} perView={3}>{recommended.map(card)}</Carousel>
        </section>
      ) : null}
      <section className="plx-commerce__section">
        {query && !hits.length ? (
          <EmptyState size="page" icon={SearchIcon} title={fill(t.resultsFor, { q: query })} action={<Button icon={CloseIcon} onClick={() => run('')}>{t.clear}</Button>}>
            <span className="plx-commerce__ideas">
              <Text variant="secondary">{t.suggestions}</Text>
              {ideas.map((s: any) => <Button key={s} size="xs" onClick={() => run(s)}>{s}</Button>)}
            </span>
          </EmptyState>
        ) : (
          <ProductListing products={hits} categories={categories} title={query ? fill(t.resultsFor, { q: query }) : chosen ? chosen.label : t.results}
            headingLevel={headingLevel + 1} hrefFor={hrefFor} onOpen={onOpen} onAddToCart={onAddToCart} pageSize={pageSize} search={false} strings={strings} />
        )}
      </section>
    </div>
  );
}

