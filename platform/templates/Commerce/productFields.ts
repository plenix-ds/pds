/* Plenix · Commerce: the products' fields for the filter, the quick filter and the sort
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import type { Field } from '../../utils/fields.ts';
import { formatLocale } from '../../utils/format.ts';
import { createTranslator } from '../../providers/LocaleProvider.tsx';

// the products' fields, for the filter, the category quick filter and the sort (utils/fields.ts)
// Called directly (outside a component), it reads the page's language (formatLocale), not a LocaleProvider's catalogs; ProductListing passes its own words in strings.
export function productFields(categories: { value: string; label: string }[] = [], strings?: Record<string, string>): Field[] {
  // not a hook (it is exported, and ProductListing calls it inside useMemo): the page locale's catalog words, with strings on top
  const t = Object.assign({}, createTranslator(formatLocale()).section('commerce.listing'), strings);
  return [
    { value: 'title', label: t.name, kind: 'text' },
    { value: 'category', label: t.category, kind: 'select', options: categories.map((c: any) => ({ value: c.value, label: c.label })) },
    { value: 'price', label: t.price, kind: 'number' },
    { value: 'rating', label: t.rating, kind: 'number' },
    { value: 'stock', label: t.availability, kind: 'select', options: [{ value: 'in', label: t.inStock }, { value: 'out', label: t.outOfStock }], get: (p: any) => (p.outOfStock ? 'out' : 'in') },
    { value: 'sale', label: t.sale, kind: 'select', options: [{ value: 'yes', label: t.yes }, { value: 'no', label: t.no }], get: (p: any) => (p.compareAtPrice > p.price ? 'yes' : 'no') },
  ];
}

