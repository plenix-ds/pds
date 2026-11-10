/* Plenix · Commerce: ProductDetail: a product page
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { announce } from '../../utils/announce.tsx';
import { ContentGrid } from '../../patterns/ContentGrid/ContentGrid.tsx';
import { ProductCard as ProductCardJs, ProductPrice as ProductPriceJs } from '../../patterns/ProductCard/ProductCard.tsx';
import { ProductOptions } from '../../components/ProductOptions/ProductOptions.tsx';
import { Carousel } from '../../components/Carousel/Carousel.tsx';
import { Image } from '../../components/Image/Image.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Rating } from '../../components/Rating/Rating.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Notice } from '../../components/Notice/Notice.tsx';
import { Tabs } from '../../components/Tabs/Tabs.tsx';
import { Table } from '../../components/Table/Table.tsx';
import { useUid } from '../../utils/layer.ts';
import { fill } from '../../utils/fill.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import DoNotDisturbIcon from 'plenix-platform/icons/plenix/do-not-disturb';
import PlusIcon from 'plenix-platform/icons/plenix/plus';
import ScheduleIcon from 'plenix-platform/icons/plenix/schedule';
import { dataPhrase } from '../../utils/dataText.tsx';
import { Product } from './ProductListing.tsx';
import { useCommercePage } from './useCommercePage.ts';
const ProductCard: any = ProductCardJs;
const ProductPrice: any = ProductPriceJs;

/** @public the prop type of ProductDetail (ADR 0011) */
export type ProductDetailProps = {
  product?: unknown;
  value?: unknown;
  defaultValue?: unknown;
  onChange?: (value: Record<string, unknown>) => void;
  quantity?: unknown;
  onQuantityChange?: (quantity: number) => void;
  onAddToCart?: (product: Product, choice: Record<string, unknown>, quantity: number) => void;
  cartHref?: string;
  related?: unknown[];
  hrefFor?: (product: Product) => string;
  onOpen?: (product: Product) => void;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  maxQuantity?: unknown;
  strings?: Record<string, string>;
  className?: string;
};

export function ProductDetail(props: ProductDetailProps) {
  const { product, value, defaultValue, onChange, quantity, onQuantityChange, onAddToCart, cartHref, related = [], hrefFor, onOpen,
  headingLevel = 1, maxQuantity, strings, className } = props as any;
  useCommercePage('product-detail');
  const t: any = useStrings('commerce.productDetail', strings);
  const uid = useUid('plx-commerce');
  const p = product || {};
  const [own, setOwn] = React.useState(() => defaultValue || {});
  const choice = value !== undefined ? value : own;
  const [ownQty, setOwnQty] = React.useState(1);
  const qty = quantity !== undefined ? quantity : ownQty;
  const [errors, setErrors] = React.useState<any>({});
  const [added, setAdded] = React.useState(false);
  const set = (next: any, name: any) => { if (value === undefined) setOwn(next); if (onChange) onChange(next, name); setAdded(false); if (errors[name]) setErrors(Object.assign({}, errors, { [name]: undefined })); };
  const setQty = (n: any) => { if (quantity === undefined) setOwnQty(n || 1); if (onQuantityChange) onQuantityChange(n); };
  const options = p.options || [];
  // a chosen value may set its own price, picture or stock (a larger size costs more)
  const picked = options.map((o: any) => (o.values || []).find((x: any) => x.value === choice[o.name])).filter(Boolean);
  const price = picked.reduce((s: any, x: any) => (typeof x.price === 'number' ? x.price : s), p.price);
  const stock = picked.reduce((s: any, x: any) => (typeof x.stock === 'number' ? x.stock : s), p.stock);
  const out = p.outOfStock || stock === 0 || picked.some((x: any) => x.available === false);
  const images = (picked.find((x: any) => x.images) || {}).images || p.images || (p.image ? [p.image] : []);
  const H: any = 'h' + Math.min(6, Math.max(1, headingLevel)), H2: any = 'h' + Math.min(6, headingLevel + 1);
  const add = () => {
    const missing: any = {};
    options.forEach((o: any) => { if (o.required !== false && choice[o.name] === undefined) missing[o.name] = fill(t.choose, { option: String(o.label).toLowerCase() }); });
    if (Object.keys(missing).length) { setErrors(missing); announce(t.missing, { politeness: 'assertive' }); return; }
    if (onAddToCart) onAddToCart(p, choice, qty);
    setAdded(true); announce(fill(t.added, { title: p.title }));
  };
  const status = out ? <Badge tone="negative" icon={DoNotDisturbIcon}>{t.outOfStock}</Badge>
    : typeof stock === 'number' && stock <= 5 ? <Badge tone="waiting" icon={ScheduleIcon}>{dataPhrase(t.lowStock, { n: stock })}</Badge>
      : <Badge tone="success" icon={CircleCheckIcon}>{t.inStock}</Badge>;
  const tabs = [];
  if (p.description) tabs.push({ value: 'description', label: t.description, content: typeof p.description === 'string' ? <Text as="p">{p.description}</Text> : p.description });
  if (p.specs && p.specs.length) tabs.push({ value: 'details', label: t.details, content: <Table label={t.details} data={p.specs.map((s: any, i: any) => ({ id: i + 1, name: s[0], value: s[1] }))}
    columns={[{ title: t.detail, field: 'name', kind: 'name', rowLabel: true }, { title: t.value, field: 'value', kind: 'wrap', render: (r: any) => (p.specs[r.id - 1][2] ? <Text variant="data">{r.value}</Text> : r.value) }]} /> });
  if (p.delivery) tabs.push({ value: 'delivery', label: t.delivery, content: typeof p.delivery === 'string' ? <Text as="p">{p.delivery}</Text> : p.delivery });
  return (
    <article className={cx('plx-commerce', 'plx-commerce--detail', className)}>
      <div className="plx-commerce__product">
        <div className="plx-commerce__gallery">
          {images.length > 1 ? <Carousel label={fill(t.gallery, { title: p.title })}>{images.map((im: any, i: any) => <Image key={i} src={im.src} alt={im.alt || ''} ratio="1-1" rounded />)}</Carousel>
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
            {related.map((r: any) => <ProductCard key={r.id} title={r.title} href={hrefFor ? hrefFor(r) : undefined} onOpen={!hrefFor && onOpen ? () => onOpen(r) : undefined}
              image={r.image} price={r.price} currency={r.currency} compareAtPrice={r.compareAtPrice} outOfStock={r.outOfStock} meta={r.meta} headingLevel={Math.min(6, headingLevel + 2)} />)}
          </ContentGrid>
        </section>
      ) : null}
    </article>
  );
}

