/* Plenix · Slider
   Summary: A value picked from a range by dragging; with range, two thumbs pick a minimum and a maximum (range slider);
     with marks, labeled values sit under the track.
   Usage:
     <Slider label="Brightness" value={v} min={0} max={100} step={1} unit="%" onChange={(v) => …} onCommit={(v) => …} />
     <Slider range label="Price" value={[20, 80]} min={0} max={200} step={5} unit=" €" onChange={([low, high]) => …} />
     <Slider label="Quality" value={q} min={0} max={100} step={25} marks={[0, 25, 50, 75, 100]} onChange={…} />
   Props:
     label: the label above the track
     value: the current value, a number; with range, [low, high]
     min: the lowest value; default 0
     max: the highest value; default 100
     step: the step between values; default 1
     unit: text after the value ("%"); default ""
     range: two thumbs, for a minimum and a maximum: value and onChange take [low, high] (default false)
     marks: labeled values under the track: an array of numbers or of { value, label }, or true for one mark per step
       (only when there are 12 steps or fewer) (default none)
     onChange(value): follows every move (live preview); with range, onChange([low, high])
     onCommit(value): runs when the person lets go or finishes with the keys (record the change, e.g. in an undo history)
     disabled: default false
     readOnly: the value shows and takes focus but cannot change (default: the nearest read-only region's, useReadOnly)
     strings: the thumbs' names with range, for other languages: { minimum: "Minimum", maximum: "Maximum" } (each thumb
       is named "<label>, minimum" and "<label>, maximum")
     className: more classes on the slider
     ...rest: other attributes go on the range input (the first one with range)
   Behavior:
     It is a native range input (two with range), so keys work: arrows, Page Up/Down, Home, End.
     The label and the current value sit above the track ("20–80 €" with range).
     The thumbs of a range never cross: the minimum stops at the maximum and the maximum at the minimum. Where they meet,
       the one that can still move is on top.
     A range or marked slider draws its own track (the plain slider is the browser's control): the filled part between
       the thumbs and each mark sit where the thumbs' centers are, measured from the track and placed on the 4px grid.
   Notes:
     The fill and the marks are placed by JavaScript (inline inset and inline size through gridPx, utils/grid.ts); every
       other value is a --plx-comp-slider-* token.
     Mark labels are values: they use the data font.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { gridPx } from '../../utils/grid.ts';
import { useReadOnly, readOnlyProps } from '../../providers/ReadOnly.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';

const MAX_STEP_MARKS = 12;

export type SliderMark = number | { value: number; label?: React.ReactNode };
// one value, or a range's [low, high]
export type SliderValue = number | [number, number];
// the marks to draw: [{ value, label }] inside [min, max]
function marksOf(marks: true | SliderMark[] | null | undefined, min: number, max: number, step: number): Array<{ value: number; label?: React.ReactNode }> {
  if (!marks) return [];
  let list: SliderMark[] = marks as SliderMark[];
  if (marks === true) {
    const n = Math.floor((max - min) / step);
    if (n < 1 || n > MAX_STEP_MARKS) return [];
    list = Array.from({ length: n + 1 }, (x, i) => min + i * step);
  }
  return list.map((m) => (typeof m === 'object' ? m : { value: m, label: String(m) })).filter((m) => m.value >= min && m.value <= max);
}

export type SliderProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'min' | 'max' | 'step'> & {
  label?: React.ReactNode;
  /** a number, or [low, high] with range */
  value?: SliderValue;
  min?: number;
  max?: number;
  step?: number;
  /** written after the value ("%") */
  unit?: string;
  range?: boolean;
  /** labeled values under the track: numbers or { value, label }, or true for one mark per step */
  marks?: true | SliderMark[] | null;
  onChange?: (value: SliderValue) => void;
  /** the value when a drag or a key press ends */
  onCommit?: (value: SliderValue) => void;
  disabled?: boolean;
  strings?: Catalog | null;
  readOnly?: boolean;
};
export function Slider({ label, value, min = 0, max = 100, step = 1, unit = '', range = false, marks, onChange, onCommit, disabled = false,
  strings, className, readOnly, ...rest }: SliderProps) {
  const id = useUid('plx-slider');
  const locked = useReadOnly(readOnly);
  const lockOf = (props: Record<string, unknown>) => readOnlyProps(locked, props, { pointer: true }) as React.InputHTMLAttributes<HTMLInputElement>;   // a press focuses, the keys do not move it
  const t = useStrings('slider', strings) as { minimum: string; maximum: string };
  const drawn = marksOf(marks, min, max, step);
  const custom = range || drawn.length > 0;
  const span = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  // the width between the thumbs' centers at min and at max (the span is inset by half a thumb on each side, in CSS)
  React.useLayoutEffect(() => {
    const el = span.current;
    if (!custom || !el) return undefined;
    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [custom]);
  const low = range ? Math.min(Number(value && (value as [number, number])[0] != null ? (value as [number, number])[0] : min), Number(value && (value as [number, number])[1] != null ? (value as [number, number])[1] : max)) : min;
  const high = range ? Math.max(low, Number(value && (value as [number, number])[1] != null ? (value as [number, number])[1] : max)) : Number(value);
  const at = (v: number) => (max > min ? (Math.min(max, Math.max(min, v)) - min) / (max - min) : 0) * width;
  const commit = (next: SliderValue) => onCommit && onCommit(next);
  const keyCommit = (next: (v: number) => SliderValue) => (e: React.KeyboardEvent<HTMLInputElement>) => { if (/Arrow|Page|Home|End/.test(e.key)) commit(next(Number(e.currentTarget.value))); };
  const shown = range ? low + '–' + high + unit : (value as number) + unit;

  if (!custom) {
    return (
      <div className={cx('plx-slider', className)}>
        <div className="plx-slider__head">
          <label htmlFor={id} className="plx-slider__label">{label}</label>
          <output htmlFor={id} className="plx-slider__value">{(value as number) + unit}</output>
        </div>
        <input id={id} type="range" className="plx-slider__input" min={min} max={max} step={step} value={value as number} disabled={disabled}
          aria-valuetext={value + unit} onChange={(e) => onChange && onChange(Number(e.target.value))}
          onPointerUp={(e) => onCommit && onCommit(Number(e.currentTarget.value))}
          onKeyUp={(e) => { if (onCommit && /Arrow|Page|Home|End/.test(e.key)) onCommit(Number(e.currentTarget.value)); }} {...lockOf(rest)} />
      </div>
    );
  }

  const lowOf = (v: number): [number, number] => [Math.min(v, high), high], highOf = (v: number): [number, number] => [low, Math.max(v, low)];
  const fillStart = range ? at(low) : 0, fillEnd = at(high);
  return (
    <div className={cx('plx-slider', 'plx-slider--custom', range && 'plx-slider--range', drawn.length && 'plx-slider--marks', disabled && 'is-disabled', className)}>
      <div className="plx-slider__head">
        {range ? <span id={id + '-label'} className="plx-slider__label">{label}</span> : <label htmlFor={id} className="plx-slider__label">{label}</label>}
        <output htmlFor={range ? id + ' ' + id + '-high' : id} className="plx-slider__value">{shown}</output>
      </div>
      <div className="plx-slider__control">
        <div className="plx-slider__rail" aria-hidden="true">
          <div ref={span} className="plx-slider__span">
            <div className="plx-slider__fill" style={{ insetInlineStart: gridPx(fillStart), inlineSize: gridPx(fillEnd - fillStart) }} />
          </div>
        </div>
        {range ? (
          <>
            <input id={id} type="range" className={cx('plx-slider__input', low > (min + max) / 2 && 'is-on-top')} min={min} max={max} step={step} value={low}
              disabled={disabled} aria-label={label + ', ' + t.minimum.toLowerCase()} aria-valuetext={low + unit}
              onChange={(e) => onChange && onChange(lowOf(Number(e.target.value)))}
              onPointerUp={(e) => commit(lowOf(Number(e.currentTarget.value)))} onKeyUp={keyCommit(lowOf)} {...lockOf(rest)} />
            <input id={id + '-high'} type="range" className="plx-slider__input" min={min} max={max} step={step} value={high}
              disabled={disabled} aria-label={label + ', ' + t.maximum.toLowerCase()} aria-valuetext={high + unit}
              onChange={(e) => onChange && onChange(highOf(Number(e.target.value)))}
              onPointerUp={(e) => commit(highOf(Number(e.currentTarget.value)))} onKeyUp={keyCommit(highOf)} {...lockOf({})} />
          </>
        ) : (
          <input id={id} type="range" className="plx-slider__input" min={min} max={max} step={step} value={value as number} disabled={disabled}
            aria-valuetext={value + unit} onChange={(e) => onChange && onChange(Number(e.target.value))}
            onPointerUp={(e) => commit(Number(e.currentTarget.value))} onKeyUp={keyCommit((v) => v)} {...lockOf(rest)} />
        )}
      </div>
      {drawn.length ? (
        <div className="plx-slider__marks" aria-hidden="true">
          <div className="plx-slider__marks-span">
            {drawn.map((m) => <span key={m.value} className="plx-slider__mark" style={{ insetInlineStart: gridPx(at(m.value)) }}>{m.label}</span>)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
