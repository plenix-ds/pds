/* Plenix · ProductCard
   Summary: One product in a catalog (07 Data display › Cards and objects › Product card): its picture at a fixed ratio,
     its name as the card's one link or button, a line of facts (the brand or the category), its price in the data font
     (formatCurrency), the rating, and one action (Add to cart). A sale shows the price people pay, the price it was struck
     through, and a Sale Badge with its icon (sale); a product that cannot be bought shows an Out of stock Badge with its
     icon and its action turned off, never hidden (out of stock). In a grid of cards (grid, the default) the picture is on
     top; in a list (list) it sits at the start of a row. Built from Platform components only (Image, Badge, Rating,
     Button, Text).
   Usage:
     <ContentGrid size="md" label="Candles">
       <ProductCard title="Beeswax taper, 12 in" href="#/p/taper-12" image={{ src: '/taper.jpg', alt: '' }}
         price={18} currency="USD" meta="Monastery candles" rating={4.5} reviewCount={38} onAddToCart={() => add('taper-12')} />
     </ContentGrid>
     <ProductCard layout="list" title="Prayer rope, 100 knots" onOpen={() => open(p)} price={24} compareAtPrice={32} … />
     <ProductCard title="Icon print, Saint Mark" price={45} outOfStock action={<Button size="xs">Notify me</Button>} … />
   Props:
     title: the product's name (required); with href or onOpen it is the card's link or button, which covers the card
     href: the product's page: the name is a link (Link's look stays the card's: the whole card is the target)
     onOpen(): the name is a button that runs this instead (a quick view)
     image: the picture: { src, alt, srcSet, sizes } (Image); alt "" when the name already says what it shows (default "")
     ratio: the picture's shape on the aspect-ratio scale: "1-1" (default) | "4-3" | "3-4"
     price: what it costs now, a number (required)
     currency: the ISO 4217 code of the price (default "USD"); the amount is written by formatCurrency in the reader's locale
     compareAtPrice: the price it was before a sale; with a higher value than price the card is on sale: the old price is
       struck through after the price and the Sale Badge shows (sale)
     sale: forces the Sale Badge on or off (default: compareAtPrice above price)
     outOfStock: the product cannot be bought now: the Out of stock Badge with its icon, the action off (default false)
     meta: a short line of facts above the name (the brand, the category); plain text in DM Sans
     rating: the average rating, 0 to 5: a read-only Rating (whole stars drawn; its name gives the value: "Rating: 4.5 of
       5"); none by default
     reviewCount: how many reviews the rating comes from, in the data font after the stars
     badges: more status Badges after Sale and Out of stock (each a Badge with its icon)
     onAddToCart(): the card's action: an Add to cart button; turned off while outOfStock
     action: the card's action as an element, instead of onAddToCart (Notify me, Choose options)
     layout: "grid" (default: the picture on top, for a ContentGrid) | "list" (the picture at the row's start, the action at
       its end: a search result or a comparison)
     headingLevel: the name's heading level (default 3)
     strings: the words, for other languages: { sale: "Sale", outOfStock: "Out of stock", addToCart: "Add to cart",
       addToCartFor: "Add {title} to cart", now: "Now", was: "Was", rating: "Rating", reviews: "{n} reviews",
       review: "1 review", soldOut: "{title} is out of stock" }
     className: more classes on the card
     ProductPrice: the price line alone (a cart's or an order's line, the product page): { price, currency, compareAtPrice,
       size: "md" (default) | "sm" (a line's unit price: the body size, regular weight), strings, className }
   Behavior:
     The name's link or button covers the whole card, so the card is one Tab stop and one click target; the action and
       its own controls sit above it and stay separately reachable (Tab: the name, then the action).
     The price is written by formatCurrency (FORMATS: the reader's locale and the currency's own decimals) in the data
       font; on sale it reads "Now $48.00, was $64.00" to assistive technology, the old price struck through after it.
     Out of stock: the Badge says it in words with its icon, and the action is disabled with its accessible name saying
       why ("Beeswax taper is out of stock"); the card still opens the product.
     Hover raises the card (the card's hover shadow); focus on the name draws the ring around the whole card.
     The name is cut after two lines; the picture keeps its space before it loads (Image's ratio and placeholder).
   Notes:
     One primary thing per card: the name opens the product, the action adds it; more actions belong on the product's
     page. Do not mix product cards with other cards in one grid. Prices, counts and ratings are technical values: Reddit Mono.
     Other props go on the <article>.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { formatCurrency } from '../../utils/format.ts';
import { Image } from '../../components/Image/Image.jsx';
import { Badge } from '../../components/Badge/Badge.tsx';
import { Rating } from '../../components/Rating/Rating.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Icon } from '../../components/Icon/Icon.tsx';
import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import DoNotDisturbIcon from 'plenix-platform/icons/plenix/do-not-disturb';
import ImageBIcon from 'plenix-platform/icons/plenix/image-b';
import PlusIcon from 'plenix-platform/icons/plenix/plus';
import TagsIcon from 'plenix-platform/icons/plenix/tags';
import { dataPhrase } from '../../utils/dataText.tsx';
import { fill } from '../../utils/fill.ts';

const RATIOS = ['1-1', '4-3', '3-4'];

// the price line: the price now in the data font, and on sale the old price struck through after it ("Now …, was …" to
// assistive technology); shared with the Commerce templates
export function ProductPrice({ price, currency = 'USD', compareAtPrice, size = 'md', strings, className }) {
  devWarn('ProductPrice', { size }, { size: ['md','sm'] });
  const t = useStrings('productCard', strings);
  const onSale = typeof compareAtPrice === 'number' && compareAtPrice > price;
  return (
    <span className={cx('plx-product-card__prices', size === 'sm' && 'plx-product-card__prices--sm', className)}>
      <span className="plx-product-card__price">{onSale ? <VisuallyHidden>{t.now + ' '}</VisuallyHidden> : null}{formatCurrency(price, currency)}</span>
      {onSale ? <s className="plx-product-card__compare"><VisuallyHidden>{t.was + ' '}</VisuallyHidden>{formatCurrency(compareAtPrice, currency)}</s> : null}
    </span>
  );
}

export function ProductCard({ title, href, onOpen, image, ratio = '1-1', price, currency = 'USD', compareAtPrice, sale, outOfStock = false,
  meta, rating, reviewCount, badges, onAddToCart, action, layout = 'grid', headingLevel = 3, strings, className, ...rest }) {
  const t = useStrings('productCard', strings);
  const name = typeof title === 'string' ? title : '';
  const onSale = sale !== undefined ? !!sale : typeof compareAtPrice === 'number' && compareAtPrice > price;
  const interactive = !!(href || onOpen);
  const H = 'h' + Math.min(6, Math.max(2, headingLevel));
  const opener = href ? <a className="plx-product-card__opener" href={href}>{title}</a>
    : onOpen ? <button type="button" className="plx-product-card__opener" onClick={onOpen}>{title}</button> : title;
  const status = [];
  if (onSale) status.push(<Badge key="sale" tone="active" icon={TagsIcon}>{t.sale}</Badge>);
  if (outOfStock) status.push(<Badge key="out" tone="negative" icon={DoNotDisturbIcon}>{t.outOfStock}</Badge>);
  const stars = typeof rating === 'number' ? Math.max(0, Math.min(5, rating)) : null;
  const act = action || (onAddToCart ? (
    <Button size="xs" icon={PlusIcon} disabled={outOfStock} onClick={onAddToCart}
      label={outOfStock ? fill(t.soldOut, { title: name }) : name ? fill(t.addToCartFor, { title: name }) : undefined}>{t.addToCart}</Button>
  ) : null);
  return (
    <article className={cx('plx-product-card', 'plx-product-card--' + (layout === 'list' ? 'list' : 'grid'), onSale && 'plx-product-card--sale',
      outOfStock && 'plx-product-card--out-of-stock', interactive && 'plx-product-card--interactive', className)} {...rest}>
      <div className="plx-product-card__media">
        {image && image.src ? <Image src={image.src} srcSet={image.srcSet} sizes={image.sizes} alt={image.alt || ''} ratio={RATIOS.indexOf(ratio) >= 0 ? ratio : '1-1'} />
          : <span className={cx('plx-product-card__placeholder', 'plx-ratio-' + (RATIOS.indexOf(ratio) >= 0 ? ratio : '1-1'))} aria-hidden="true"><Icon name={ImageBIcon} size="lg" /></span>}
      </div>
      <div className="plx-product-card__body">
        {status.length || badges ? <div className="plx-product-card__badges">{status}{badges}</div> : null}
        {meta ? <Text variant="secondary" className="plx-product-card__meta">{meta}</Text> : null}
        <H className="plx-product-card__title">{opener}</H>
        <ProductPrice price={price} currency={currency} compareAtPrice={onSale ? compareAtPrice : undefined} strings={strings} />
        {stars !== null ? (
          <span className="plx-product-card__rating">
            <Rating readOnly value={stars} label={t.rating} />
            {typeof reviewCount === 'number' ? <Text variant="secondary" className="plx-product-card__reviews">{dataPhrase(reviewCount === 1 ? t.review : t.reviews, { n: reviewCount })}</Text> : null}
          </span>
        ) : null}
        {act ? <div className="plx-product-card__actions">{act}</div> : null}
      </div>
    </article>
  );
}
