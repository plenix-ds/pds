/* Plenix · chart types
   Summary: The shapes the chart parts and charts share (issue 292 wave 2, ADR 0011): a scale, the plot's size and the frame's margins.
   Usage: import type { ChartScale, ChartInner } from './chart-types.ts' (from the parts: '../chart-types.ts').
   Props: none; types only.
   Behavior: none; types are erased at build.
   Notes: Public through the parts' props (@public); no runtime code. */

import type React from 'react';

/** @public a scale from platform/charts/scales.js: a function from a value to a pixel position, with the methods the parts read */
export type ChartScale = {
  (value: any): number | undefined;
  domain?(): any[];
  range?(): number[];
  /** a band scale: the width of one band */
  bandwidth?(): number;
  /** a band scale: the distance from one band to the next */
  step?(...args: any[]): any;
  /** the ticks to label, aiming for `count` */
  ticks?(count?: number): any[];
  /** the scale's own label for a value */
  format?(value: any, count?: number): string;
};
/** @public the plot area's size in pixels (ChartFrame's inner) */
export type ChartInner = { width: number; height: number };
/** @public the frame's margins in pixels */
export type ChartMargin = { top?: number; end?: number; bottom?: number; start?: number };
/** @public a value on a chart axis: a number, a category or a date */
export type ChartValue = string | number | Date;
/** @public the ticks of an axis or its grid lines: how many to aim for, or the values */
export type ChartTicks = number | ChartValue[];
/** @public one value in a tooltip */
export type ChartTooltipItem = { label?: string; value?: React.ReactNode; color?: string };
/** @public one series in a legend */
export type ChartLegendItem = { id?: string | number; label: string; color?: string; value?: React.ReactNode };
