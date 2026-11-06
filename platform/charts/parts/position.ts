/* Plenix · scalePosition (platform/charts/parts/position.js): where a value sits on a scale, for the chart parts.
   Summary: The position of a value on any Plenix scale (platform/charts/scales.ts): a linear, log or time scale's own
     position, and the middle of the band for a band scale, so an axis label, a grid line, a data label or a reference
     line lines up with the mark it belongs to.
   Usage:
     import { scalePosition, scaleTicks } from 'plenix-platform';
     const x = scaleBand({ domain: months, range: [0, inner.width] });
     scalePosition(x, 'Mar')          // the middle of March's band
     scaleTicks(y, 5)                 // the values to label: the scale's ticks (a count) or the list given
   Props:
     scalePosition(scale, value): the position in pixels (undefined for a value a band scale does not have)
     scaleTicks(scale, ticks): ticks as an array is returned as it is; a number (or nothing) asks the scale for its ticks
     scaleLabel(scale, value, ticks, format): the label of a tick: format(value) when given, else the scale's own format
       (the reader's locale, the decimals of the tick step), else String(value)
   Notes:
     Geometry only: no color, size or font. */

import type { ChartScale, ChartTicks, ChartValue } from '../chart-types.ts';

export function scalePosition(scale: ChartScale, value: ChartValue): number | undefined {
  const p = scale(value);
  if (p === undefined || p === null || isNaN(p)) return undefined;
  return typeof scale.bandwidth === 'function' ? p + scale.bandwidth() / 2 : p;
}

export function scaleTicks(scale: ChartScale, ticks?: ChartTicks | null): ChartValue[] {
  if (Array.isArray(ticks)) return ticks.slice();
  return typeof scale.ticks === 'function' ? scale.ticks(typeof ticks === 'number' ? ticks : undefined) : [];
}

export function scaleLabel(scale: ChartScale, value: ChartValue, ticks?: ChartTicks | null, format?: ((value: ChartValue) => string) | null): string {
  if (typeof format === 'function') return format(value);
  if (typeof scale.format === 'function') return scale.format(value, typeof ticks === 'number' ? ticks : undefined);
  return String(value);
}
