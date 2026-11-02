/* Plenix · Rating
   Summary: 1 to max stars as a radio group, for rating an item; with half, in half stars (3.5).
   Usage:
     <Rating value={rating} onChange={setRating} />
   Props:
     value: the number of stars; 0 = none (default)
     onChange(value): runs when the rating changes
     max: the number of stars; default 5
     half: true shows and sets half stars (3.5): a click on the first half of a star sets the half, the arrow keys move by half a star; default false
     label: the accessible name; default "Rating"
     readOnly: shows the stars as a picture that cannot be changed; default false
     className: more classes on the rating
     ...rest: other attributes go on the rating element
   Behavior:
     Arrow keys move the rating (by half a star with half); Space or Enter chooses a star.
     Choosing the current value again clears it.
     With half the first half of a star is on in the start direction (the left in left to right, the right in right to left); a value such as 3.5
       shows three full stars and half of the fourth, and the fourth star is the one that is checked and has focus, named "3.5 stars".
     Read-only, it is announced as "Rating: 3 of 5" ("Rating: 3.5 of 5").
*/
import React from 'react';
import { arrowStep, isRtl } from '../../utils/direction.ts';
import { cx } from '../../utils/cx.ts';
import { useStrings, useLocale } from '../../providers/LocaleProvider.tsx';

type RatingWords = { label: string; value: string };
export type RatingProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'onChange'> & {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  half?: boolean;
  /** the accessible name */
  label?: string;
  readOnly?: boolean;
};
export function Rating({ value = 0, onChange, max = 5, half = false, label, readOnly = false, className, ...rest }: RatingProps) {
  const tw = useStrings('rating') as RatingWords, loc = useLocale();
  if (label === undefined) label = tw.label;
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  // a half star: the value ends in .5 and halves are on; the star it lies in is the one the value rounds up to
  const shown = half ? Math.round(value * 2) / 2 : value;
  const state = (n: number) => (n <= shown ? 'plx-rating__star--on' : half && n - 0.5 === shown ? 'plx-rating__star--half' : false);
  const at = half ? Math.ceil(shown) : value;   // the checked star
  const starRefs = React.useRef<Record<number, HTMLButtonElement | null>>({});
  const focusNext = React.useRef(0);   // the star the keyboard chose: focus moves there once the value has changed
  React.useEffect(() => {
    const el = focusNext.current && starRefs.current[focusNext.current];
    if (el) el.focus();
    focusNext.current = 0;
  }, [value]);
  if (readOnly) {
    return (
      <span className={cx('plx-rating', 'plx-rating--read-only', className)} role="img" aria-label={tw.value.replace('{label}', label as string).replace('{value}', shown as unknown as string).replace('{max}', max as unknown as string)} {...rest}>
        {stars.map((n) => <span key={n} className={cx('plx-rating__star', state(n))} aria-hidden="true">★</span>)}
      </span>
    );
  }
  // a click: the whole star, or with half the first half of it (the start side: the right in right to left)
  const choose = (n: number, e?: React.MouseEvent<HTMLButtonElement>) => {
    let next = n;
    if (half && e && e.clientX) {
      const r = e.currentTarget.getBoundingClientRect(), early = isRtl(e.currentTarget) ? e.clientX > r.left + r.width / 2 : e.clientX < r.left + r.width / 2;
      if (early) next = n - 0.5;
    }
    if (onChange) onChange(next === shown ? 0 : next);
  };
  // the arrow keys in reading order (Up is more, Down is less); focus follows the chosen star, as in a radio group (batch 213)
  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, n: number) => {
    const step = e.key === 'ArrowUp' ? 1 : e.key === 'ArrowDown' ? -1 : arrowStep(e, e.currentTarget, { vertical: false });
    if (!step) return;
    e.preventDefault();
    const unit = half ? 0.5 : 1, next = Math.min(max, Math.max(unit, (half ? shown : n) + step * unit));
    focusNext.current = Math.ceil(next);
    if (onChange) onChange(next);
  };
  return (
    <span className={cx('plx-rating', className)} role="radiogroup" aria-label={label} {...rest}>
      {stars.map((n) => (
        <button type="button" key={n} ref={(el) => { starRefs.current[n] = el; }} role="radio" aria-checked={n === at} aria-label={loc.t('rating.stars', { count: n === at ? shown : n })}
          tabIndex={(shown ? n === at : n === 1) ? 0 : -1} className={cx('plx-rating__star', state(n))}
          onClick={(e) => choose(n, e)} onKeyDown={(e) => onKey(e, n)}>★</button>
      ))}
    </span>
  );
}
