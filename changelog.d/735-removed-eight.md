### Removed

- The last eight deprecated utility classes that CTM used. CTM has moved off them (CTM#144), and neither CTM nor the St. John site uses them now (#735). The classes are `plx-u-absolute`, `-bg-transparent`, `-justify-center`, `-text-center`, `-top-0`, `-w-100px`, `-w-36px` and `-w-72px`. `plx-u-left-0`, `-right-0`, `-ml-auto`, `-pl-12px` and `-pl-16px` stay, deprecated and promised until 2.0.0.

### Breaking

- Eight more deprecated utility classes are removed (#735). A page written in HTML and CSS that still uses one loses that style. Use what 0.90.0's *Deprecated* notes give:
  - `plx-u-absolute` and `-top-0` become `position: absolute; inset-block-start: 0` on your own class;
  - `-justify-center` becomes a Center or Inline layout part;
  - `-text-center` becomes `text-align: center`;
  - `-bg-transparent` becomes `background-color: transparent`;
  - `-w-36px`, `-w-72px` and `-w-100px` become `inline-size: var(--plx-ref-size-9u)`, `var(--plx-ref-size-18u)` and `var(--plx-ref-size-25u)` on your own class.
