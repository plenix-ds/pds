/* Plenix · lazy charts (platform/charts/lazy.tsx)
   Summary: The ECharts charts (LineChart, AreaChart, BarChart, PieChart, ComboChart, ScatterChart, WaterfallChart, LollipopChart, BulletChart, FunnelChart, BoxPlot, RadarChart, Treemap, HeatMap, Sparkline and TreeChart) as thin components that load their code the first time
     a chart of that kind is drawn, so the first load of Plenix does not carry the chart code (issue 106; the budget note on pull request 547). The public
     names, props and behavior are the chart's own: this file only waits for the module, then draws it.
   Usage:
     import { LineChart, Sparkline } from './charts/lazy.tsx';   // what platform/index.ts and the exports files export
   Props:
     The chart's own props (platform/charts/<Chart>.jsx).
   Behavior:
     Until the chart's module has loaded, the figure's caption (title and description) is drawn, marked aria-busy; a Sparkline draws an empty box of
       its own size (aria-hidden), so the text around it does not jump; the chart replaces it.
     The module loads once and is kept. In the single-file builds (the CDN script, the applications, pages opened from file://) the dynamic import is inlined
       by the bundler, so nothing is fetched.
   Notes:
     The pure helpers the API exports (gridRoom, pieSlices, binValues) are in chart-helpers.ts, in the first load. */
import React from 'react';
import type { LineChartProps, AreaChartProps } from './LineChart.tsx';
import type { BarChartProps } from './BarChart.tsx';
import type { PieChartProps } from './PieChart.tsx';
import type { TreeChartProps } from './TreeChart.tsx';
import type { WaterfallChartProps } from './WaterfallChart.tsx';
import type { ComboChartProps } from './ComboChart.tsx';
import type { ScatterChartProps } from './ScatterChart.tsx';
import type { LollipopChartProps } from './LollipopChart.tsx';
import type { BulletChartProps } from './BulletChart.tsx';
import type { FunnelChartProps } from './FunnelChart.tsx';
import type { BoxPlotProps } from './BoxPlot.tsx';
import type { RadarChartProps } from './RadarChart.tsx';
import type { TreemapProps } from './Treemap.tsx';
import type { HeatMapProps } from './HeatMap.tsx';
import type { SparklineProps } from './Sparkline.tsx';
import { ChartFrame } from './ChartFrame.tsx';
import { cx } from '../utils/cx.ts';

// the caption while the chart's code is on its way, marked busy for assistive technology
const caption = (props: any) => (
  <div aria-busy="true">
    <ChartFrame title={props.title} description={props.description} hideCaption={props.hideCaption} size={props.size} className={props.className} />
  </div>
);
// a sparkline sits in a sentence or a table cell: an empty box of its size keeps the text still until the line arrives
const sparkBox = (props: any) => (
  <span className={cx('plx-sparkline', 'plx-sparkline--' + (props.variant || 'line'), 'plx-sparkline--' + (props.size || 'inline'), props.className)} aria-hidden="true" aria-busy="true" />
);

// a chart's code loads on first use; the wrapper takes the chart's own props (P), so the published type is the chart's, not any
function lazyChart<P extends object>(name: string, load: () => Promise<Record<string, unknown>>, fallback: ((props: any) => React.ReactElement) | null) {
  const Chart = React.lazy(() => load().then((m) => ({ default: m[name] as React.ComponentType<P> })));
  function LazyChart(props: P) {
    return <React.Suspense fallback={fallback ? fallback(props) : null}>{React.createElement(Chart as unknown as React.ComponentType<P>, props)}</React.Suspense>;
  }
  LazyChart.displayName = name;
  return LazyChart as ((props: P) => React.JSX.Element) & { displayName: string };
}

export const LineChart = lazyChart<LineChartProps>('LineChart', () => import('./LineChart.tsx'), caption);
export const AreaChart = lazyChart<AreaChartProps>('AreaChart', () => import('./AreaChart.tsx'), caption);
export const BarChart = lazyChart<BarChartProps>('BarChart', () => import('./BarChart.tsx'), caption);
export const PieChart = lazyChart<PieChartProps>('PieChart', () => import('./PieChart.tsx'), caption);
export const TreeChart = lazyChart<TreeChartProps>('TreeChart', () => import('./TreeChart.tsx'), caption);
export const WaterfallChart = lazyChart<WaterfallChartProps>('WaterfallChart', () => import('./WaterfallChart.tsx'), caption);
export const ComboChart = lazyChart<ComboChartProps>('ComboChart', () => import('./ComboChart.tsx'), caption);
export const ScatterChart = lazyChart<ScatterChartProps>('ScatterChart', () => import('./ScatterChart.tsx'), caption);
export const LollipopChart = lazyChart<LollipopChartProps>('LollipopChart', () => import('./LollipopChart.tsx'), caption);
export const BulletChart = lazyChart<BulletChartProps>('BulletChart', () => import('./BulletChart.tsx'), caption);
export const FunnelChart = lazyChart<FunnelChartProps>('FunnelChart', () => import('./FunnelChart.tsx'), caption);
export const BoxPlot = lazyChart<BoxPlotProps>('BoxPlot', () => import('./BoxPlot.tsx'), caption);
export const RadarChart = lazyChart<RadarChartProps>('RadarChart', () => import('./RadarChart.tsx'), caption);
export const Treemap = lazyChart<TreemapProps>('Treemap', () => import('./Treemap.tsx'), caption);
export const HeatMap = lazyChart<HeatMapProps>('HeatMap', () => import('./HeatMap.tsx'), caption);
export const Sparkline = lazyChart<SparklineProps>('Sparkline', () => import('./Sparkline.tsx'), sparkBox);
