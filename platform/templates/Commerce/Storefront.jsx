/* Plenix · Commerce templates: the storefront
   Summary: The pages people shop on (platform/templates/Commerce): the product listing (ProductListing: a category's or a
     search's products as ProductCards in a grid or a list, with the command bar's search, filter, category, sort and view,
     the count, and pages), product discovery (ProductDiscovery: the catalog's entry: a search with suggestions, the
     categories to browse, recommendations, then the listing) and product detail (ProductDetail: one product's pictures,
     name, rating, price, stock, ProductOptions, Add to cart, its description, details and delivery, and related
     products). Commerce.jsx documents every template.
   Usage:
     <ProductListing title="Candles" products={products} categories={CATEGORIES} hrefFor={(p) => '#/p/' + p.id} onAddToCart={add} />
     <ProductDiscovery products={products} categories={CATEGORIES} recommended={picks} hrefFor={…} onAddToCart={add} />
     <ProductDetail product={robe} cartHref="#/cart" onAddToCart={(p, choice, qty) => add(p, choice, qty)} related={more} />
   Props:
     See Commerce.jsx (ProductListing, ProductDiscovery, ProductDetail).
   Behavior:
     ProductOptions accepts the commerce options placement class on its documented root.

     See Commerce.jsx.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { announce } from '../../utils/announce.tsx';
import { formatNumber, formatLocale } from '../../utils/format.ts';
import { compareLevels } from '../../utils/fields.ts';
import { useCollectionView } from '../../hooks/useCollectionView.ts';
import { CommandBar, CommandBarSearch } from '../../patterns/CommandBar/CommandBar.jsx';
import { FilterPanel } from '../../patterns/FilterPanel/FilterPanel.jsx';
import { SortPanel } from '../../patterns/SortPanel/SortPanel.jsx';
import { ViewMenu } from '../../patterns/ViewMenu/ViewMenu.jsx';
import { QuickFilter } from '../../patterns/QuickFilter/QuickFilter.jsx';
import { ContentGrid } from '../../patterns/ContentGrid/ContentGrid.jsx';
import { ProductCard, ProductPrice } from '../../patterns/ProductCard/ProductCard.jsx';
import { ProductOptions } from '../../components/ProductOptions/ProductOptions.jsx';
import { Pagination } from '../../components/Pagination/Pagination.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { SearchField } from '../../components/SearchField/SearchField.tsx';
import { Card } from '../../components/Card/Card.jsx';
import { Carousel } from '../../components/Carousel/Carousel.jsx';
import { Image } from '../../components/Image/Image.jsx';
import { Text } from '../../components/Text/Text.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Rating } from '../../components/Rating/Rating.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { Tabs } from '../../components/Tabs/Tabs.jsx';
import { Table } from '../../components/Table/Table.jsx';
import { useUid } from '../../utils/layer.ts';
import { useCommercePage } from './shared.jsx';
import { fill } from '../../utils/fill.ts';
import { useStrings, createTranslator } from '../../providers/LocaleProvider.tsx';
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import CloseIcon from 'plenix-platform/icons/plenix/close';
import DoNotDisturbIcon from 'plenix-platform/icons/plenix/do-not-disturb';
import FilterOffIcon from 'plenix-platform/icons/plenix/filter-off';
import PlusIcon from 'plenix-platform/icons/plenix/plus';
import ScheduleIcon from 'plenix-platform/icons/plenix/schedule';
import SearchIcon from 'plenix-platform/icons/plenix/search';
import SettingsCategoriesIcon from 'plenix-platform/icons/plenix/settings-categories';
import { dataPhrase } from '../../utils/dataText.tsx';


// the products' fields, for the filter, the category quick filter and the sort (utils/fields.ts)
// Called directly (outside a component), it reads the page's language (formatLocale), not a LocaleProvider's catalogs; ProductListing passes its own words in strings.
export function productFields(categories = [], strings) {
  // not a hook (it is exported, and ProductListing calls it inside useMemo): the page locale's catalog words, with strings on top
  const t = Object.assign({}, createTranslator(formatLocale()).section('commerce.listing'), strings);
  return [
    { value: 'title', label: t.name, kind: 'text' },
    { value: 'category', label: t.category, kind: 'select', options: categories.map((c) => ({ value: c.value, label: c.label })) },
    { value: 'price', label: t.price, kind: 'number' },
    { value: 'rating', label: t.rating, kind: 'number' },
    { value: 'stock', label: t.availability, kind: 'select', options: [{ value: 'in', label: t.inStock }, { value: 'out', label: t.outOfStock }], get: (p) => (p.outOfStock ? 'out' : 'in') },
    { value: 'sale', label: t.sale, kind: 'select', options: [{ value: 'yes', label: t.yes }, { value: 'no', label: t.no }], get: (p) => (p.compareAtPrice > p.price ? 'yes' : 'no') },
  ];
}

const SIZES = { s: 'sm', m: 'md', l: 'lg' };

export function ProductListing({ products = [], categories = [], title, description, headingLevel = 1, hrefFor, onOpen, onAddToCart, pageSize = 12,
  query, onQueryChange, defaultView, search = true, strings, className }) {
  useCommercePage('product-listing');
  const t = useStrings('commerce.listing', strings);
  const fields = React.useMemo(() => productFields(categories, t), [categories, t]);
  const v = useCollectionView(fields, { text: (p) => [p.title, p.meta, p.category].join(' '), quick: { category: 'list' }, view: Object.assign({ layout: 'gallery', size: 'm' }, defaultView) });
  // the search text may come from the page (ProductDiscovery's search)
  React.useEffect(() => { if (query !== undefined && query !== v.search) v.setSearch(query); }, [query]);
  const setSearch = (s) => { v.setSearch(s); if (onQueryChange) onQueryChange(s); };
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
  const card = (p, layout) => (
    <ProductCard key={p.id} layout={layout} title={p.title} href={hrefFor ? hrefFor(p) : undefined} onOpen={!hrefFor && onOpen ? () => onOpen(p) : undefined}
      image={p.image} price={p.price} currency={p.currency} compareAtPrice={p.compareAtPrice} outOfStock={p.outOfStock} meta={p.meta}
      rating={p.rating} reviewCount={p.reviewCount} onAddToCart={onAddToCart ? () => onAddToCart(p) : undefined} headingLevel={Math.min(6, headingLevel + 1)} />
  );
  const H = 'h' + Math.min(6, Math.max(1, headingLevel));
  const list = v.view.layout === 'list';
  return (
    <section className={cx('plx-commerce', 'plx-commerce--listing', className)} aria-label={title ? undefined : t.label}>
      {title ? <header className="plx-commerce__head"><H className="plx-commerce__title">{title}</H>{description ? <Text as="p" variant="secondary">{description}</Text> : null}</header> : null}
      <CommandBar label={typeof title === 'string' ? title : t.label} count={shown.length === 1 ? t.one : fill(t.count, { n: formatNumber(shown.length) })}
        find={<>{search ? <CommandBarSearch value={v.search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder={t.search} label={t.search} /> : null}
          <FilterPanel {...v.filterProps} />
          {categories.length ? <QuickFilter label={t.category} icon={SettingsCategoriesIcon} noun={t.category.toLowerCase()} options={categories} {...v.quickProps('category')} /> : null}</>}
        view={<><SortPanel {...v.sortProps} /><ViewMenu value={v.view} onChange={v.setView} /></>} />
      {visible.length ? (list
        ? <ul className="plx-commerce__list" aria-label={typeof title === 'string' ? title : t.label}>{visible.map((p) => <li key={p.id} className="plx-commerce__list-item">{card(p, 'list')}</li>)}</ul>
        : <ContentGrid size={SIZES[v.view.size] || 'md'} label={typeof title === 'string' ? title : t.label}>{visible.map((p) => card(p, 'grid'))}</ContentGrid>)
        : <EmptyState size="page" icon={SearchIcon} title={t.empty} action={<Button icon={FilterOffIcon} onClick={clear}>{t.clear}</Button>}>{t.emptyText}</EmptyState>}
      {pages > 1 ? <Pagination page={at} pageCount={pages} onPageChange={setPage} total={shown.length} perPage={pageSize} /> : null}
    </section>
  );
}


export function ProductDiscovery({ products = [], categories = [], recommended = [], title, headingLevel = 1, hrefFor, onOpen, onAddToCart, suggestions,
  pageSize = 12, strings, className }) {
  useCommercePage('product-discovery');
  const t = useStrings('commerce.discovery', strings);
  const uid = useUid('plx-commerce');
  const [text, setText] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState(null);
  const lower = text.trim().toLowerCase();
  const matches = lower ? products.filter((p) => p.title.toLowerCase().indexOf(lower) >= 0).slice(0, 6).map((p) => ({ value: p.title, label: p.title, description: p.meta })) : [];
  const run = (s) => { setText(s); setQuery(s); };
  const inCategory = category ? products.filter((p) => p.category === category) : products;
  const hits = query ? inCategory.filter((p) => [p.title, p.meta, p.category].join(' ').toLowerCase().indexOf(query.trim().toLowerCase()) >= 0) : inCategory;
  // no results: suggest the closest words people can search for instead
  const ideas = suggestions || categories.map((c) => c.label).slice(0, 4);
  const H = 'h' + Math.min(6, Math.max(1, headingLevel)), H2 = 'h' + Math.min(6, headingLevel + 1);
  const chosen = categories.find((c) => c.value === category);
  const card = (p) => (
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
            suggestions={matches} onSelect={(item) => run(item.value)} onSubmitSearch={(s) => run(s)} />
        </div>
      </header>
      {!query && categories.length ? (
        <section className="plx-commerce__section" aria-labelledby={uid + '-categories'}>
          <H2 id={uid + '-categories'} className="plx-commerce__subtitle">{t.categories}</H2>
          <ContentGrid size="md" label={t.categories}>
            {categories.map((c) => (
              <Card key={c.value} title={c.label} headingLevel={Math.min(6, headingLevel + 2)} selected={category === c.value}
                onOpen={() => setCategory(category === c.value ? null : c.value)}
                meta={dataPhrase(products.filter((p) => p.category === c.value).length === 1 ? t.one : t.count, { n: products.filter((p) => p.category === c.value).length })} />
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
              {ideas.map((s) => <Button key={s} size="xs" onClick={() => run(s)}>{s}</Button>)}
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


export function ProductDetail({ product, value, defaultValue, onChange, quantity, onQuantityChange, onAddToCart, cartHref, related = [], hrefFor, onOpen,
  headingLevel = 1, maxQuantity, strings, className }) {
  useCommercePage('product-detail');
  const t = useStrings('commerce.productDetail', strings);
  const uid = useUid('plx-commerce');
  const p = product || {};
  const [own, setOwn] = React.useState(() => defaultValue || {});
  const choice = value !== undefined ? value : own;
  const [ownQty, setOwnQty] = React.useState(1);
  const qty = quantity !== undefined ? quantity : ownQty;
  const [errors, setErrors] = React.useState({});
  const [added, setAdded] = React.useState(false);
  const set = (next, name) => { if (value === undefined) setOwn(next); if (onChange) onChange(next, name); setAdded(false); if (errors[name]) setErrors(Object.assign({}, errors, { [name]: undefined })); };
  const setQty = (n) => { if (quantity === undefined) setOwnQty(n || 1); if (onQuantityChange) onQuantityChange(n); };
  const options = p.options || [];
  // a chosen value may set its own price, picture or stock (a larger size costs more)
  const picked = options.map((o) => (o.values || []).find((x) => x.value === choice[o.name])).filter(Boolean);
  const price = picked.reduce((s, x) => (typeof x.price === 'number' ? x.price : s), p.price);
  const stock = picked.reduce((s, x) => (typeof x.stock === 'number' ? x.stock : s), p.stock);
  const out = p.outOfStock || stock === 0 || picked.some((x) => x.available === false);
  const images = (picked.find((x) => x.images) || {}).images || p.images || (p.image ? [p.image] : []);
  const H = 'h' + Math.min(6, Math.max(1, headingLevel)), H2 = 'h' + Math.min(6, headingLevel + 1);
  const add = () => {
    const missing = {};
    options.forEach((o) => { if (o.required !== false && choice[o.name] === undefined) missing[o.name] = fill(t.choose, { option: String(o.label).toLowerCase() }); });
    if (Object.keys(missing).length) { setErrors(missing); announce(t.missing, { politeness: 'assertive' }); return; }
    if (onAddToCart) onAddToCart(p, choice, qty);
    setAdded(true); announce(fill(t.added, { title: p.title }));
  };
  const status = out ? <Badge tone="negative" icon={DoNotDisturbIcon}>{t.outOfStock}</Badge>
    : typeof stock === 'number' && stock <= 5 ? <Badge tone="waiting" icon={ScheduleIcon}>{dataPhrase(t.lowStock, { n: stock })}</Badge>
      : <Badge tone="success" icon={CircleCheckIcon}>{t.inStock}</Badge>;
  const tabs = [];
  if (p.description) tabs.push({ value: 'description', label: t.description, content: typeof p.description === 'string' ? <Text as="p">{p.description}</Text> : p.description });
  if (p.specs && p.specs.length) tabs.push({ value: 'details', label: t.details, content: <Table label={t.details} data={p.specs.map((s, i) => ({ id: i + 1, name: s[0], value: s[1] }))}
    columns={[{ title: t.detail, field: 'name', kind: 'name', rowLabel: true }, { title: t.value, field: 'value', kind: 'wrap', render: (r) => (p.specs[r.id - 1][2] ? <Text variant="data">{r.value}</Text> : r.value) }]} /> });
  if (p.delivery) tabs.push({ value: 'delivery', label: t.delivery, content: typeof p.delivery === 'string' ? <Text as="p">{p.delivery}</Text> : p.delivery });
  return (
    <article className={cx('plx-commerce', 'plx-commerce--detail', className)}>
      <div className="plx-commerce__product">
        <div className="plx-commerce__gallery">
          {images.length > 1 ? <Carousel label={fill(t.gallery, { title: p.title })}>{images.map((im, i) => <Image key={i} src={im.src} alt={im.alt || ''} ratio="1-1" rounded />)}</Carousel>
            : images.length ? <Image src={images[0].src} alt={images[0].alt || ''} ratio="1-1" rounded priority /> : null}
        </div>
        <div className="plx-commerce__buy">
          {p.meta ? <Text variant="secondary">{p.meta}</Text> : null}
          <H className="plx-commerce__title">{p.title}</H>
          {typeof p.rating === 'number' ? (
            <span className="plx-commerce__rating"><Rating readOnly value={p.rating} label={t.rating} />
              {typeof p.reviewCount === 'number' ? <Text variant="secondary">{dataPhrase(p.reviewCount === 1 ? t.review : t.reviews, { n: p.reviewCount })}</Text> : null}</span>
          ) : null}
          <span className="plx-commerce__price" aria-live="polite"><ProductPrice price={price} currency={p.currency} compareAtPrice={p.compareAtPrice} /></span>
          <span className="plx-commerce__stock">{status}</span>
          {options.length || onAddToCart ? <ProductOptions className="plx-commerce__options" product={p.title} options={options} value={choice} onChange={set} errors={errors}
            quantity={qty} onQuantityChange={setQty} max={maxQuantity || (typeof stock === 'number' && stock > 0 ? stock : 99)} sizeGuide={p.sizeGuide} /> : null}
          <span className="plx-commerce__add">
            <Button variant="primary" size="lg" icon={PlusIcon} disabled={out} onClick={add}>{t.addToCart}</Button>
          </span>
          {added ? <Notice tone="success" onDismiss={() => setAdded(false)}>{fill(t.added, { title: p.title })}{cartHref ? <>{' '}<Link href={cartHref}>{t.viewCart}</Link></> : null}</Notice> : null}
        </div>
      </div>
      {tabs.length ? <Tabs label={p.title} items={tabs} className="plx-commerce__tabs" /> : null}
      {related.length ? (
        <section className="plx-commerce__section" aria-labelledby={uid + '-related'}>
          <H2 id={uid + '-related'} className="plx-commerce__subtitle">{t.related}</H2>
          <ContentGrid size="md" label={t.related}>
            {related.map((r) => <ProductCard key={r.id} title={r.title} href={hrefFor ? hrefFor(r) : undefined} onOpen={!hrefFor && onOpen ? () => onOpen(r) : undefined}
              image={r.image} price={r.price} currency={r.currency} compareAtPrice={r.compareAtPrice} outOfStock={r.outOfStock} meta={r.meta} headingLevel={Math.min(6, headingLevel + 2)} />)}
          </ContentGrid>
        </section>
      ) : null}
    </article>
  );
}
