/* Plenix · Commerce: ProductListing: a product listing page
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { announce } from '../../utils/announce.tsx';
import { formatNumber } from '../../utils/format.ts';
import { compareLevels } from '../../utils/fields.ts';
import { useCollectionView } from '../../hooks/useCollectionView.ts';
import { CommandBar as CommandBarJs, CommandBarSearch as CommandBarSearchJs } from '../../patterns/CommandBar/CommandBar.tsx';
import { FilterPanel } from '../../patterns/FilterPanel/FilterPanel.tsx';
import { SortPanel as SortPanelJs } from '../../patterns/SortPanel/SortPanel.tsx';
import { ViewMenu as ViewMenuJs } from '../../patterns/ViewMenu/ViewMenu.tsx';
import { QuickFilter as QuickFilterJs } from '../../patterns/QuickFilter/QuickFilter.tsx';
import { ContentGrid } from '../../patterns/ContentGrid/ContentGrid.tsx';
import { ProductCard as ProductCardJs } from '../../patterns/ProductCard/ProductCard.tsx';
import { Pagination } from '../../components/Pagination/Pagination.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import FilterOffIcon from 'plenix-platform/icons/plenix/filter-off';
import SearchIcon from 'plenix-platform/icons/plenix/search';
import SettingsCategoriesIcon from 'plenix-platform/icons/plenix/settings-categories';
import { useCommercePage } from './useCommercePage.ts';
import { productFields } from './productFields.ts';
const CommandBar: any = CommandBarJs;
const CommandBarSearch: any = CommandBarSearchJs;
const SortPanel: any = SortPanelJs;
const ViewMenu: any = ViewMenuJs;
const QuickFilter: any = QuickFilterJs;
const ProductCard: any = ProductCardJs;

const SIZES: Record<string, string> = { s: 'sm', m: 'md', l: 'lg' };

/** @public a product: id and title, plus whatever the app keeps */
export type Product = { id: string | number; title?: string; [key: string]: unknown };

/** @public the prop type of ProductListing (ADR 0011) */
export type ProductListingProps = {
  products?: unknown[];
  categories?: unknown[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  hrefFor?: (product: Product) => string;
  onOpen?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  pageSize?: number;
  query?: unknown;
  onQueryChange?: (query: string) => void;
  defaultView?: unknown;
  search?: boolean;
  strings?: Record<string, string>;
  className?: string;
};

export function ProductListing(props: ProductListingProps) {
  const { products = [], categories = [], title, description, headingLevel = 1, hrefFor, onOpen, onAddToCart, pageSize = 12,
  query, onQueryChange, defaultView, search = true, strings, className } = props as any;
  useCommercePage('product-listing');
  const t: any = useStrings('commerce.listing', strings);
  const fields = React.useMemo(() => productFields(categories, t), [categories, t]);
  const v = useCollectionView(fields, { text: (p) => [p.title, p.meta, p.category].join(' '), quick: { category: 'list' }, view: Object.assign({ layout: 'gallery', size: 'm' }, defaultView) });
  // the search text may come from the page (ProductDiscovery's search)
  React.useEffect(() => { if (query !== undefined && query !== v.search) v.setSearch(query); }, [query]);
  const setSearch = (s: any) => { v.setSearch(s); if (onQueryChange) onQueryChange(s); };
  const [page, setPage] = React.useState(1);
  const shown = React.useMemo(() => {
    const list = products.filter(v.test);
    return v.sort.length ? list.slice().sort(compareLevels(fields, v.sort)) : list;
  }, [products, v.test, v.sort, fields]);
  const pages = Math.max(1, Math.ceil(shown.length / pageSize));
  const at = Math.min(page, pages);
  const visible = shown.slice((at - 1) * pageSize, at * pageSize);
  // the count is announced when it changes (Product discovery: announce result changes)
  const first = React.useRef(true);
  React.useEffect(() => { setPage(1); if (first.current) { first.current = false; return; } announce(shown.length === 0 ? t.none : shown.length === 1 ? t.resultsOne : fill(t.results, { n: formatNumber(shown.length) })); }, [shown.length]);
  const clear = () => { setSearch(''); v.setFilter({ join: 'and', items: [] }); v.setQuick('category', []); };
  const card = (p: any, layout: any) => (
    <ProductCard key={p.id} layout={layout} title={p.title} href={hrefFor ? hrefFor(p) : undefined} onOpen={!hrefFor && onOpen ? () => onOpen(p) : undefined}
      image={p.image} price={p.price} currency={p.currency} compareAtPrice={p.compareAtPrice} outOfStock={p.outOfStock} meta={p.meta}
      rating={p.rating} reviewCount={p.reviewCount} onAddToCart={onAddToCart ? () => onAddToCart(p) : undefined} headingLevel={Math.min(6, headingLevel + 1)} />
  );
  const H: any = 'h' + Math.min(6, Math.max(1, headingLevel));
  const list = v.view.layout === 'list';
  return (
    <section className={cx('plx-commerce', 'plx-commerce--listing', className)} aria-label={title ? undefined : t.label}>
      {title ? <header className="plx-commerce__head"><H className="plx-commerce__title">{title}</H>{description ? <Text as="p" variant="secondary">{description}</Text> : null}</header> : null}
      <CommandBar label={typeof title === 'string' ? title : t.label} count={shown.length === 1 ? t.one : fill(t.count, { n: formatNumber(shown.length) })}
        find={<>{search ? <CommandBarSearch value={v.search} onChange={(e: any) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder={t.search} label={t.search} /> : null}
          <FilterPanel {...(v.filterProps as any)} />
          {categories.length ? <QuickFilter label={t.category} icon={SettingsCategoriesIcon} noun={t.category.toLowerCase()} options={categories} {...v.quickProps('category')} /> : null}</>}
        view={<><SortPanel {...v.sortProps} /><ViewMenu value={v.view} onChange={v.setView} /></>} />
      {visible.length ? (list
        ? <ul className="plx-commerce__list" aria-label={typeof title === 'string' ? title : t.label}>{visible.map((p: any) => <li key={p.id} className="plx-commerce__list-item">{card(p, 'list')}</li>)}</ul>
        : <ContentGrid size={(SIZES[v.view.size] || "md") as any} label={typeof title === 'string' ? title : t.label}>{visible.map((p: any) => card(p, 'grid'))}</ContentGrid>)
        : <EmptyState size="page" icon={SearchIcon} title={t.empty} action={<Button icon={FilterOffIcon} onClick={clear}>{t.clear}</Button>}>{t.emptyText}</EmptyState>}
      {pages > 1 ? <Pagination page={at} pageCount={pages} onPageChange={setPage} total={shown.length} perPage={pageSize} /> : null}
    </section>
  );
}

