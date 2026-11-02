/* Plenix · ProductOptions
   Summary: The controls that choose one variant of a product (12 Specialized › Commerce › Product options): sizes as a row
     of small radio tiles (RadioTiles: size buttons), colors as swatch buttons named in words (ColorSwatch: color swatches),
     and how many to buy (NumberInput's quantity stepper: quantity). Each option says its chosen value beside its name
     ("Size: M"); a choice that is out of stock stays in view, marked and explained, and cannot be chosen. A product's
     colors are the product's own data: each swatch shows a category or data color by name, never a new palette color.
   Usage:
     const [choice, setChoice] = React.useState({ size: 'M', color: 'navy' });
     <ProductOptions product="Choir robe" value={choice} onChange={setChoice}
       options={[
         { name: 'size', label: 'Size', kind: 'buttons', values: [{ value: 'S' }, { value: 'M' }, { value: 'L' }, { value: 'XL', available: false }] },
         { name: 'color', label: 'Color', kind: 'swatches', values: [{ value: 'navy', label: 'Navy', category: 'navy' },
           { value: 'maroon', label: 'Maroon', category: 'maroon', available: false }] }]}
       quantity={qty} onQuantityChange={setQty} max={10} sizeGuide={<Link href="#/size-guide">Size guide</Link>} />
   Props:
     options: the product's options, in order: [{ name, label, kind: "buttons" (default) | "swatches", values, required }]
     options[].name: the key of the option in value ("size", "color")
     options[].label: the option's name as people read it ("Size", "Color")
     options[].values: the choices: [{ value, label (default: the value), available (default true), note, category, color }]
       available: false keeps the choice in view, marked out of stock (its note, else strings.unavailable), and refuses it
       note: a short line under a size tile ("Only 2 left", "Ships in 3 weeks")
       category: a swatch's color by the category palette's name ("navy", "maroon", "olive": CATEGORY_COLORS)
       color: a swatch's color by the data colors' name ("blue", "green": DATA_COLORS), instead of category
     options[].required: the option must be chosen before the product goes in the cart (default true): the page shows the
       error (errors) when it is missing
     value: the chosen values, by option name: { size: "M", color: "navy" } (required)
     onChange(next, name): runs with the whole new value and the option that changed
     quantity: how many to buy; with onQuantityChange the quantity stepper shows (quantity)
     onQuantityChange(n): runs with the new quantity
     min: how many units at least (default 1)
     max: the greatest quantity (the stock or a limit per order; default 99)
     product: the product's name, for the controls' accessible names ("Quantity, Choir robe")
     sizeGuide: an element after the first button option: a Link to the size guide (a link goes somewhere)
     swatchLabels: the swatches show their names as text beside them (default false: the chosen name is beside the
       option's label, every name is the swatch's accessible name)
     errors: the error of an option, by name ({ size: "Choose a size." }): it shows under the option and marks it invalid
     disabled: turns every control off (default false)
     strings: the words, for other languages: { chosen: "{label}:" (the option's name before its value), unavailable: "Out of stock", quantity: "Quantity", quantityOf: "Quantity,
       {product}", unavailableName: "{label}, out of stock", none: "None chosen" }
     className: layout integration on the root; placement only, not appearance
   Behavior:
     The sizes slot publishes RadioTiles legend line height; swatches receive their own unavailable prop.
     Size buttons are RadioTiles: one radio group, Tab reaches the chosen tile, the arrow keys move and choose; an out of
       stock size is a disabled radio with its note under it, which the arrow keys skip.
     Color swatches are ColorSwatch buttons in a group named by the option (aria-pressed on the chosen one); each is named
       by its color in words ("Navy"); an out of stock color stays focusable, is announced as "Maroon, out of stock" and
       dimmed (aria-disabled), and a press does nothing.
     The quantity is NumberInput's quantity stepper (minus, the count in the data font, plus), named with the product;
       a value past min or max is brought back when the field is left.
     Every change runs onChange (or onQuantityChange) at once: the page updates the price, the picture and the stock.
   Notes:
     Fewer than about six choices: buttons or swatches, never a select. Put the quantity last, beside Add to cart.
     Other props go on the group.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { RadioTiles } from '../RadioTiles/RadioTiles.tsx';
import { ColorSwatch } from '../ColorSwatch/ColorSwatch.jsx';
import { NumberInput } from '../NumberInput/NumberInput.tsx';
import { Field } from '../Field/Field.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import AlertIcon from 'plenix-platform/icons/plenix/alert';
import { fill } from '../../utils/fill.ts';

const labelOf = (v) => (v.label !== undefined ? v.label : String(v.value));

// the option's name and its chosen value ("Size: M")
function Legend({ option, value, t }) {
  const chosen = (option.values || []).find((v) => v.value === value);
  return (
    <span className="plx-product-options__legend-text">
      <span className="plx-product-options__label">{fill(t.chosen, { label: option.label })}</span>
      <span className="plx-product-options__chosen">{chosen ? labelOf(chosen) : t.none}</span>
    </span>
  );
}

function ErrorLine({ id, children }) {
  return children ? <span id={id} className="plx-product-options__error"><Icon name={AlertIcon} size="sm" />{children}</span> : null;
}

export function ProductOptions({ options = [], value = {}, onChange, quantity, onQuantityChange, min = 1, max = 99, product, sizeGuide,
  swatchLabels = false, errors = {}, disabled = false, strings, className, ...rest }) {
  const t = useStrings('productOptions', strings);
  const uid = useUid('plx-product-options');
  const pick = (name, v) => { if (onChange) onChange(Object.assign({}, value, { [name]: v }), name); };
  let guided = false;
  return (
    <div className={cx('plx-product-options', disabled && 'is-disabled', className)} {...rest}>
      {options.map((o) => {
        const err = errors[o.name], errId = uid + '-' + o.name + '-error';
        if (o.kind === 'swatches') {
          const legendId = uid + '-' + o.name + '-legend';
          return (
            <div key={o.name} className={cx('plx-product-options__option', 'plx-product-options__option--swatches', err && 'is-invalid')}>
              <span id={legendId} className="plx-product-options__legend"><Legend option={o} value={value[o.name]} t={t} /></span>
              <div role="group" aria-labelledby={legendId} aria-describedby={err ? errId : undefined} className="plx-product-options__swatches">
                {(o.values || []).map((v) => {
                  const off = v.available === false;
                  const name = off ? fill(t.unavailableName, { label: labelOf(v) }) : labelOf(v);
                  return (
                    <span key={v.value} className={cx('plx-product-options__swatch', off && 'is-unavailable')}>
                      <ColorSwatch category={v.color ? undefined : v.category} color={v.color} label={swatchLabels ? labelOf(v) : name} showLabel={swatchLabels}
                        unavailable={off} pressed={value[o.name] === v.value} onClick={() => { if (!off && !disabled) pick(o.name, v.value); }}
                        {...(swatchLabels && off ? { 'aria-label': name } : {})} {...(off || disabled ? { 'aria-disabled': true } : {})} />
                    </span>
                  );
                })}
              </div>
              <ErrorLine id={errId}>{err}</ErrorLine>
            </div>
          );
        }
        const guide = sizeGuide && !guided ? (guided = true, <span className="plx-product-options__guide">{sizeGuide}</span>) : null;
        return (
          <div key={o.name} className={cx('plx-product-options__option', 'plx-product-options__option--buttons', err && 'is-invalid')}>
            <RadioTiles className="plx-product-options__sizes" size="sm" legend={<Legend option={o} value={value[o.name]} t={t} />} value={value[o.name]}
              aria-describedby={err ? errId : undefined} disabled={disabled || undefined} onChange={(v) => pick(o.name, v)}
              options={(o.values || []).map((v) => ({ value: v.value, label: labelOf(v), disabled: v.available === false,
                description: v.available === false ? (v.note || t.unavailable) : v.note }))} />
            {guide}
            <ErrorLine id={errId}>{err}</ErrorLine>
          </div>
        );
      })}
      {onQuantityChange ? (
        <div className="plx-product-options__option plx-product-options__option--quantity">
          <Field label={t.quantity}>
            <NumberInput stepper="quantity" value={quantity} onChange={(n) => onQuantityChange(n)} min={min} max={max} disabled={disabled}
              aria-label={product ? fill(t.quantityOf, { product }) : undefined} />
          </Field>
        </div>
      ) : null}
    </div>
  );
}
