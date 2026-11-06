/* Plenix · lazy charts (platform/charts/lazy.jsx)
   Summary: The ECharts charts (LineChart, AreaChart, BarChart, PieChart, Sparkline and TreeChart) as thin components that load their code the first time
     a chart of that kind is drawn, so the first load of Plenix does not carry the chart code (issue 106; the budget note on pull request 547). The public
     names, props and behavior are the chart's own: this file only waits for the module, then draws it.
   Usage:
     import { LineChart, Sparkline } from './charts/lazy.jsx';   // what platform/index.js and the exports files export
   Props:
     The chart's own props (platform/charts/<Chart>.jsx).
   Behavior:
     Until the chart's module has loaded, the figure's caption (title and description) is drawn, or for a Sparkline nothing; the chart replaces it.
     The module loads once and is kept. In the single-file builds (the CDN script, the applications, pages opened from file://) the dynamic import is inlined
       by the bundler, so nothing is fetched.
   Notes:
     The pure helpers the API exports (gridRoom, pieSlices, binValues) are in chart-helpers.js, in the first load. */
import React from 'react';
import { ChartFrame } from './ChartFrame.jsx';

const caption = (props) => (
  <ChartFrame title={props.title} description={props.description} hideCaption={props.hideCaption} size={props.size} className={props.className} />
);

function lazyChart(name, load, fallback) {
  const Chart = React.lazy(() => load().then((m) => ({ default: m[name] })));
  function LazyChart(props) {
    return <React.Suspense fallback={fallback ? fallback(props) : null}><Chart {...props} /></React.Suspense>;
  }
  LazyChart.displayName = name;
  return LazyChart;
}

export const LineChart = lazyChart('LineChart', () => import('./LineChart.jsx'), caption);
export const AreaChart = lazyChart('AreaChart', () => import('./AreaChart.jsx'), caption);
export const BarChart = lazyChart('BarChart', () => import('./BarChart.jsx'), caption);
export const PieChart = lazyChart('PieChart', () => import('./PieChart.jsx'), caption);
export const TreeChart = lazyChart('TreeChart', () => import('./TreeChart.jsx'), caption);
export const Sparkline = lazyChart('Sparkline', () => import('./Sparkline.jsx'));
