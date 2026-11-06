/* Plenix · GeoMap
   Summary: A map drawn from the app's own geography (07 Data Display › Specialized displays › Map, and Charts ›
     Choropleth map): regions from GeoJSON, outlined, or shaded by a measure (choropleth), and markers at places; zoom
     buttons and dragging to move around. No map tiles and no network: the app supplies the shapes.
   Usage:
     <GeoMap title="Sites" description="Four sites, two in the north." features={regions} markers={[{ id: 'a', label: 'North depot', lon: 4.2, lat: 6.1 }, …]} />
     <GeoMap title="Share of active users by region" description="The north has the highest share." features={regions}
       values={{ north: 0.42, south: 0.18, … }} format={(v) => formatPercent(v)} valueTitle="Active users" />
   Props:
     title: the map's name (required); description: its takeaway
     features: the regions: a GeoJSON FeatureCollection (or an array of features) of Polygon and MultiPolygon geometries in
       longitude and latitude (WGS 84), as the app has them (required); each feature's id (feature.id, else
       properties[idKey]) keys it in values, its properties[nameKey] names it
     idKey, nameKey: the properties that hold a region's key and name when feature.id is missing (default "id", "name")
     values: { [region key]: number }: shades each region by its value on the sequential data-viz scale (a choropleth);
       regions without a value are textured as "no data"
     scale: "sequential" (default: low to high) | "diverging" (around the middle of the range: a change, a difference)
     markers: places: [{ id, label, lon, lat }]: a dot at each, named in the tooltip and the table
     projection: "mercator" (default) | "equirectangular" (longitude and latitude as they are: small areas near the equator,
       or data drawn that way)
     format: (value) => text for the values (default formatNumber); valueTitle: what the values measure, with its unit
     zoom: shows the zoom buttons and lets the map be dragged when zoomed in (default true)
     size: the plot's height, as ChartFrame ("sm" | "md" | "lg" default)
     strings: the words it says: { region: "Region", place: "Place", value: "Value", noData: "No data", latitude: "Latitude",
       longitude: "Longitude", zoom: "Zoom", zoomIn: "Zoom in", zoomOut: "Zoom out", reset: "Show the whole map", hint }
     className: more classes on the figure
   Behavior:
     The shapes are fitted to the plot (the whole map shows, centered); zooming keeps lines at their width.
     Choropleth: a region's step is its value's place between the lowest and the highest value (seven steps); the legend
       lists the steps with their ranges in the data font.
     Keyboard: one Tab stop for the map (the zoom buttons are their own stops); the arrow keys move through the regions with
       a value, then the markers, each spoken with its name and value; the pointer over a region or a marker does the same.
       The active one gets a ring and the tooltip. The wheel never zooms: the page keeps scrolling.
     The frame's "Show the data" table lists every region with its value (or every place with its coordinates).
   Notes:
     Geography is data: Plenix ships none. For a world or country outline use a public-domain source such as Natural Earth
       (naturalearthdata.com) at a small scale, simplified, kept with the app. A tile layer (street maps) needs a provider and
       its attribution; it is not part of GeoMap. Region colors are data-viz steps; outlines, the no-data texture and the
       markers' ring are --plx-comp-geo-map-* tokens.
*/
import React from 'react';
import { cx } from '../utils/cx.ts';
import { formatNumber } from '../utils/format.ts';
import { datavizStep } from '../utils/dataviz.ts';
import { Button, ButtonGroup } from '../components/Button/Button.tsx';
import { ChartFrame } from './ChartFrame.jsx';
import { seriesColor } from './scales.ts';
import { ChartLegend } from './parts/ChartLegend.tsx';
import { ChartTooltip } from './parts/ChartTooltip.tsx';
import { useChartPoints, ChartPatterns, patternFill } from './a11y.ts';
import { useStrings } from '../providers/LocaleProvider.tsx';
import EdRecenterIcon from 'plenix-platform/icons/plenix/ed-recenter';
import EdZoomInIcon from 'plenix-platform/icons/plenix/ed-zoom-in';
import EdZoomOutIcon from 'plenix-platform/icons/plenix/ed-zoom-out';

const STEPS = 7;
// SVG geometry on the 4px grid: a marker's radius, the ring's room around it; the zoom range
const MARKER = 4, RING = 4, ZOOM_MIN = 1, ZOOM_MAX = 8;
const RAD = Math.PI / 180;
const PROJECTIONS = {
  mercator: (lon, lat) => { const l = Math.max(-85, Math.min(85, lat)); return [lon * RAD, -Math.log(Math.tan(Math.PI / 4 + (l * RAD) / 2))]; },
  equirectangular: (lon, lat) => [lon * RAD, -lat * RAD],
};
// the polygons of a geometry, each a list of rings of [lon, lat]
const polygonsOf = (g) => (!g ? [] : g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);

export function GeoMap({ title, description, features, idKey = 'id', nameKey = 'name', values, scale = 'sequential', markers = [], projection = 'mercator',
  format, valueTitle, zoom = true, size = 'lg', strings, className }) {
  const t = useStrings('chart.geoMap', strings);
  const uid = 'plx-geo-map' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const project = PROJECTIONS[projection] || PROJECTIONS.mercator;
  const list = Array.isArray(features) ? features : (features && features.features) || [];
  const fmt = (v) => (typeof format === 'function' ? format(v) : formatNumber(v));
  const choropleth = !!values;
  const regions = list.map((f, i) => {
    const p = f.properties || {};
    const key = String(f.id !== undefined ? f.id : p[idKey] !== undefined ? p[idKey] : i);
    const v = values && values[key] !== undefined && values[key] !== null && isFinite(Number(values[key])) ? Number(values[key]) : null;
    return { key, name: String(p[nameKey] !== undefined ? p[nameKey] : key), value: v, rings: polygonsOf(f.geometry).map((poly) => poly.map((ring) => ring.map((c) => project(c[0], c[1])))) };
  });
  const places = markers.map((m, i) => ({ key: String(m.id === undefined ? i : m.id), label: String(m.label), lon: Number(m.lon), lat: Number(m.lat), at: project(Number(m.lon), Number(m.lat)) }));
  const nums = regions.filter((r) => r.value !== null).map((r) => r.value);
  const lo = nums.length ? Math.min.apply(null, nums) : 0, hi = nums.length ? Math.max.apply(null, nums) : 1;
  const sc = scale === 'diverging' ? 'diverging' : 'sequential';
  const stepOf = (v) => datavizStep(sc, v, lo, hi);
  // the keyboard's order: regions with a value (all regions on an outline map), then the places
  const items = (choropleth ? regions.filter((r) => r.value !== null) : regions.filter(() => !places.length)).map((r) => ({ kind: 'region', r })).concat(places.map((m) => ({ kind: 'place', m })));
  const say = (it) => (it.kind === 'region' ? it.r.name + (choropleth ? ': ' + fmt(it.r.value) : '') : it.m.label);
  const keys = useChartPoints({ count: items.length, describe: (i) => say(items[i]) });
  const [view, setView] = React.useState({ z: 1, cx: null, cy: null });
  const drag = React.useRef(null);
  const table = choropleth || !places.length
    ? { columns: [{ title: t.region, field: 'name', kind: 'name', rowLabel: true }].concat(choropleth ? [{ title: valueTitle || t.value, field: 'shown', kind: 'data', align: 'right' }] : []),
      data: regions.map((r, i) => ({ id: i + 1, name: r.name, shown: r.value === null ? t.noData : fmt(r.value) })) }
    : { columns: [{ title: t.place, field: 'label', kind: 'name', rowLabel: true }, { title: t.latitude, field: 'lat', kind: 'data', align: 'right' }, { title: t.longitude, field: 'lon', kind: 'data', align: 'right' }],
      data: places.map((m, i) => ({ id: i + 1, label: m.label, lat: formatNumber(m.lat, { decimals: 4 }), lon: formatNumber(m.lon, { decimals: 4 }) })) };
  // the legend of a choropleth: each step with the range of values it holds (the data font)
  const legend = choropleth && nums.length ? (
    <ChartLegend label={valueTitle || t.value} items={Array.from({ length: STEPS }, (x, k) => ({ id: k, label: '', color: sc + '-' + (k + 1), value: fmt(lo + ((hi - lo) * k) / STEPS) + ' – ' + fmt(lo + ((hi - lo) * (k + 1)) / STEPS) }))} />
  ) : undefined;
  const zoomBy = (f) => setView((v) => Object.assign({}, v, { z: Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, v.z * f)) }));
  return (
    <React.Fragment>
      {zoom ? (
        <div className="plx-geo-map__controls">
          <ButtonGroup label={t.zoom}>
            <Button size="sm" iconOnly icon={EdZoomInIcon} label={t.zoomIn} disabled={view.z >= ZOOM_MAX} onClick={() => zoomBy(2)} />
            <Button size="sm" iconOnly icon={EdZoomOutIcon} label={t.zoomOut} disabled={view.z <= ZOOM_MIN} onClick={() => zoomBy(0.5)} />
            <Button size="sm" iconOnly icon={EdRecenterIcon} label={t.reset} disabled={view.z === 1 && view.cx === null} onClick={() => setView({ z: 1, cx: null, cy: null })} />
          </ButtonGroup>
        </div>
      ) : null}
      <ChartFrame interaction={keys.interaction} title={title} description={description} size={size} table={table} legend={legend} margin={{ top: 0, end: 0, bottom: 0, start: 0 }} className={cx('plx-geo-map', className)}>
        {({ inner }) => {
          // fit every shape and place into the plot, centered
          let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
          const grow = (p) => { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; };
          regions.forEach((r) => r.rings.forEach((poly) => poly.forEach((ring) => ring.forEach(grow))));
          places.forEach((m) => grow(m.at));
          if (!isFinite(x0)) { x0 = 0; y0 = 0; x1 = 1; y1 = 1; }
          const k = Math.min(inner.width / ((x1 - x0) || 1), inner.height / ((y1 - y0) || 1));
          const ox = (inner.width - (x1 - x0) * k) / 2, oy = (inner.height - (y1 - y0) * k) / 2;
          const base = (p) => [ox + (p[0] - x0) * k, oy + (p[1] - y0) * k];
          const cx0 = view.cx === null ? inner.width / 2 : view.cx, cy0 = view.cy === null ? inner.height / 2 : view.cy;
          const shown = (p) => { const b = base(p); return [(b[0] - cx0) * view.z + inner.width / 2, (b[1] - cy0) * view.z + inner.height / 2]; };
          const d = (r) => r.rings.map((poly) => poly.map((ring) => ring.map((c, i) => { const b = base(c); return (i ? 'L' : 'M') + b[0] + ',' + b[1]; }).join('') + 'Z').join('')).join('');
          const middle = (r) => {   // the middle of a region's box, where its tooltip points
            let a = Infinity, b = Infinity, c = -Infinity, e = -Infinity;
            r.rings.forEach((poly) => (poly[0] || []).forEach((p) => { if (p[0] < a) a = p[0]; if (p[0] > c) c = p[0]; if (p[1] < b) b = p[1]; if (p[1] > e) e = p[1]; }));
            return shown([(a + c) / 2, (b + e) / 2]);
          };
          const act = keys.index !== null && keys.index !== undefined && items[keys.index] ? items[keys.index] : null;
          const indexOf = (it) => items.indexOf(it);
          const regionItem = {};
          items.forEach((it) => { if (it.kind === 'region') regionItem[it.r.key] = it; });
          const onDown = (e) => { if (view.z <= 1 || !e.currentTarget.setPointerCapture) return; e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, cx: cx0, cy: cy0 }; };
          const onMove = (e) => { const g = drag.current; if (!g) return; setView((v) => Object.assign({}, v, { cx: g.cx - (e.clientX - g.x) / v.z, cy: g.cy - (e.clientY - g.y) / v.z })); };
          const onUp = () => { drag.current = null; };
          const transform = 'translate(' + (inner.width / 2 - cx0 * view.z) + ',' + (inner.height / 2 - cy0 * view.z) + ') scale(' + view.z + ')';
          return (
            <g>
              <ChartPatterns id={uid} />
              <clipPath id={uid + '-clip'}><rect x={0} y={0} width={inner.width} height={inner.height} /></clipPath>
              <g clipPath={'url(#' + uid + '-clip)'}>
                <rect className={cx('plx-geo-map__surface', view.z > 1 && 'plx-geo-map__surface--movable')} x={0} y={0} width={inner.width} height={inner.height} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} />
                <g className="plx-geo-map__view" transform={transform}>
                  {regions.map((r) => {
                    const it = regionItem[r.key];
                    const on = it ? { onMouseEnter: () => keys.hover(indexOf(it)), onMouseLeave: () => keys.hover(null) } : {};
                    return (
                      <g key={r.key}>
                        <path className={cx('plx-geo-map__region', choropleth && r.value === null && 'plx-geo-map__region--empty')} data-plx-dataviz={choropleth && r.value !== null ? stepOf(r.value) : undefined} d={d(r)}
                          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} {...on} />
                        {choropleth && r.value === null ? <path className="plx-chart-pattern" fill={patternFill(uid, 0)} d={d(r)} /> : null}
                      </g>
                    );
                  })}
                  {act && act.kind === 'region' ? <path className="plx-chart-keys__ring" d={d(act.r)} /> : null}
                </g>
                {places.map((m) => { const p = shown(m.at), it = items.find((x) => x.kind === 'place' && x.m === m);
                  return <circle key={m.key} className="plx-geo-map__marker" data-plx-dataviz={seriesColor(0)} cx={p[0]} cy={p[1]} r={MARKER} onMouseEnter={() => keys.hover(indexOf(it))} onMouseLeave={() => keys.hover(null)} />; })}
                {act && act.kind === 'place' ? <circle className="plx-chart-keys__ring" cx={shown(act.m.at)[0]} cy={shown(act.m.at)[1]} r={MARKER + RING} /> : null}
              </g>
              {act ? (() => {
                const p = act.kind === 'region' ? middle(act.r) : shown(act.m.at);
                return <ChartTooltip x={p[0]} y={p[1]} inner={inner} title={act.kind === 'region' ? act.r.name : act.m.label}
                  items={act.kind === 'region' ? (choropleth ? [{ label: valueTitle || t.value, value: fmt(act.r.value), color: stepOf(act.r.value) }] : [])
                    : [{ label: t.latitude, value: formatNumber(act.m.lat, { decimals: 4 }), color: seriesColor(0) }, { label: t.longitude, value: formatNumber(act.m.lon, { decimals: 4 }) }]} />;
              })() : null}
            </g>
          );
        }}
      </ChartFrame>
    </React.Fragment>
  );
}
