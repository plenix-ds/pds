/* Plenix · EChartsPlot (platform/charts/echarts/EChartsPlot.tsx)
   Summary: The ECharts drawing inside a chart's ChartFrame (issue 353): one ECharts instance per chart, drawn as SVG in the
     frame's plot, under the chart's own Plenix layer (focus marks, crosshair, tooltip, labels: the frame's SVG on top).
     Internal: used by the chart components, not public.
   Usage:
     const plot = useEChartsPlot();
     const option = React.useCallback((t) => ({ grid: …, xAxis: …, yAxis: …, series: … }), [data, …]);
     <ChartFrame … margin={NO_MARGIN}>{(dims) => [plot.layer(dims, option), plot.chart ? <g>…overlay…</g> : null]}</ChartFrame>
   Props:
     EChartsHost({ width, height, option, onDraw }): the drawing alone, for a chart without a frame (Sparkline); the same
       .plx-chart__engine element, so the page checks' engine allow-list applies to it unchanged
     useEChartsPlot() → { chart, tokens, layer(dims, option) }:
       layer(dims, option): the element that holds the drawing, the plot's full size (a foreignObject at 0,0); option(t, size)
         returns the ECharts option from the chart tokens t (engine.js chartTokens) and the plot's { width, height }. Keep option stable (useCallback on
         the data and props it reads) or the chart redraws on every render
       chart: the ECharts instance once it has drawn (null before the engine loads), for its geometry (convertToPixel,
         the grid's rectangle); the hook's component renders again after every draw, so the overlay follows
       tokens: the chart tokens it was drawn with
     plotGrid(chart): the grid's rectangle { x, y, width, height } in plot pixels (where the overlay goes)
     NO_MARGIN: ChartFrame's margin for an ECharts chart (ECharts makes the room its labels need inside the plot)
   Behavior:
     The engine loads the first time a chart mounts (loadECharts); until then the plot is empty and the caption, the
       legend and "Show the data" are already there.
     The drawing follows the plot's size (ChartFrame measures it) and is drawn again when the page's mode, theme or
       density changes, with the tokens read again.
     The drawing takes no pointer events: the pointer and the keyboard belong to the frame's plot and the chart
       interaction (interaction.js).
   Notes:
     ECharts writes the sizes and fonts of what it draws on its own SVG elements, inside .plx-chart__engine; the values
       are the chart tokens. */

import React from 'react';
import { loadECharts, chartTokens, plenixTheme } from './engine.ts';

export const NO_MARGIN = Object.freeze({ top: 0, end: 0, bottom: 0, start: 0 });
const LOOK = ['data-plx-mode', 'data-plx-theme', 'data-plx-density'];

export function EChartsHost({ width, height, option, onDraw }: any) {
  const ref = React.useRef<any>(null), inst = React.useRef<any>(null), tk = React.useRef<any>(null);
  const [E, setE] = React.useState(() => (typeof window !== 'undefined' && (window as any).PlenixECharts) || null);
  const [look, setLook] = React.useState<any>(0);
  React.useEffect(() => {
    if (E) return undefined;
    let live = true;
    loadECharts().then((x) => { if (live) setE(x); }, () => {});
    return () => { live = false; };
  }, [E]);
  React.useEffect(() => {
    if (typeof MutationObserver === 'undefined') return undefined;
    const mo = new MutationObserver(() => setLook((n: any) => n + 1));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: LOOK });
    return () => mo.disconnect();
  }, []);
  React.useEffect(() => {
    if (!E || !ref.current) return undefined;
    tk.current = chartTokens(ref.current);
    const c = E.init(ref.current, plenixTheme(tk.current), { renderer: 'svg', width, height });
    inst.current = c;
    return () => { c.dispose(); inst.current = null; };
  }, [E, look]);
  React.useEffect(() => {
    const c = inst.current;
    if (!c || c.isDisposed()) return;
    c.resize({ width, height, animation: { duration: 0 } });
    c.setOption(option(tk.current, { width, height }), { replaceMerge: ['series', 'xAxis', 'yAxis'] });
    if (onDraw) onDraw(c, tk.current);
  }, [E, look, option, width, height]);
  return <div ref={ref} className="plx-chart__engine" />;
}

export function useEChartsPlot() {
  const [, redraw] = React.useReducer((n) => n + 1, 0);
  const drawn = React.useRef<any>({ chart: null, tokens: null });
  const onDraw = React.useCallback((c: any, t: any) => { drawn.current = { chart: c, tokens: t }; redraw(); }, []);
  const live = drawn.current.chart && !drawn.current.chart.isDisposed();
  return {
    chart: live ? drawn.current.chart : null,
    tokens: live ? drawn.current.tokens : null,
    layer: (dims: any, option: any) => (
      <foreignObject key="plx-chart-engine" x={0} y={0} width={dims.width} height={dims.height}>
        <EChartsHost width={dims.width} height={dims.height} option={option} onDraw={onDraw} />
      </foreignObject>
    ),
  };
}

export function plotGrid(chart: any) {
  const grid = chart.getModel().getComponent('grid');
  return grid && grid.coordinateSystem ? grid.coordinateSystem.getRect() : null;
}
