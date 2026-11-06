/* Plenix · DataGrid engine · metrics and layout
   Summary: What the grid measures of itself once it is drawn and keeps measuring: the columns' widths from their content (autosizing and
     the floors a column cannot shrink under, from the headers, the cell space and the pills), the room under the table that the page
     keeps (so a table that fills the window ends at the page's padding), the row, line and menu heights and the narrow switch (the
     card list below the narrow width) from the container's size, density and the page's fonts, and the virtualizer re-measured when a
     row height or the group rows change.
   Usage:
     import { useGridMetrics } from './engine/useGridMetrics.js';
     useGridMetrics({ frame, metrics, setMetrics, setNarrow, setAutoSizing, setFloors, virtual, model, collapsed, columns, ... });
   Props:
     The engine's refs, state and setters the effects read and write (frame, header, holder, metrics, columns, keys, the options that
       change sizes) and the grid's props (height, narrow, narrowAt, mode). Returns nothing: the hook is its effects.
   Notes:
     The default grid (narrow="auto") sizes its columns to their content and fits them to its room before the cards (issue
     929): content first (capped at the set width), spare room shared by the text columns (issue 272), the most room above the minimum given up first
     and the title last; the narrow switch weighs the minimums. narrow="table" and "list" keep their set widths.
     Moved out of DataGridEngine.jsx (issue 714, metrics and layout): the effects were in the engine function, in the
     same order between the same neighbors. The engine is documented in DataGridEngine.jsx.
*/
import React from 'react';
import { pillFont } from '../engine/pill.js';
import { gridStep, snapToGrid, gridPx } from '../../../utils/grid.ts';
import { tokenPixels } from '../environment.js';
import { kinds, typeOf } from './helpers.jsx';
import { valueAt } from '../state.js';
import { valueText } from '../cells.jsx';

export function useGridMetrics({
  frame,
  metrics,
  cells,
  columns,
  effectiveWrap,
  showTypes,
  isStatic,
  headerMenu,
  source,
  selectable,
  rowMenu,
  rowMenuButton,
  props,
  setAutoSizing,
  setFloors,
  setMetrics,
  live,
  narrow,
  narrowAt,
  listed,
  setNarrow,
  height,
  mode,
  holder,
  inPane,
  effectiveStep,
  keys,
  autoSizing,
  sizing,
  columnVisibility,
  virtual,
  model,
  collapsed,
}) {
  React.useLayoutEffect(() => {
    const at = frame.current;
    if (!at || !metrics.min) return;
    const ctx = at.ownerDocument.createElement('canvas').getContext('2d'),
      widths = {},
      free = [],
      floor = {};
    // the probe pills are the only writes: measured first, so the reads below find the styles already computed
    const scales = cells === 'pill' ? { data: pillFont(at, ctx, true), text: pillFont(at, ctx, false) } : null,
      cs = getComputedStyle(at),
      step = gridStep(at);
    const known = new Map(),
      tokenPx = (name) => {
        if (!known.has(name)) known.set(name, tokenPixels(name, at));
        return known.get(name);
      },
      snapUp = (px) => snapToGrid(px, { round: 'up', step });
    // (issue 929) the default grid (narrow="auto") fits its columns to its width; narrow="table" and "list" keep the set widths
    const fitting = narrow === 'auto';
    columns.forEach((c) => {
      if (kinds(c).includes('icon')) {
        widths[c.field] = metrics.lead;
        return;
      }
      // the header: its title in the header's own font, after the type icon and its gap (owner, 2026-10-22: a column that
      // gets no share of the room left must still show its whole title)
      ctx.font =
        (cs.getPropertyValue('--plx-comp-data-grid-header-font-weight').trim() || '600') +
        ' ' +
        cs.getPropertyValue('--plx-comp-data-grid-header-font-size').trim() +
        ' ' +
        (cs.getPropertyValue('--plx-comp-data-grid-font-family').trim() || cs.fontFamily);
      ctx.wordSpacing = '0px';
      // at rest the title follows the type icon; hovered, the icon steps aside and the menu button takes its room at the end:
      // the header needs the larger of the two (owner, 2026-10-22). Wrapped headers need their longest word on a line.
      const title = String(c.title || c.field),
        words = title.split(/\s+/);
      // wrapped headers show two lines: the narrowest width that holds the title in two (never a word broken)
      let text = ctx.measureText(title).width;
      if (effectiveWrap)
        for (let i = 1; i < words.length; i += 1)
          text = Math.min(
            text,
            Math.max(
              ctx.measureText(words.slice(0, i).join(' ')).width,
              ctx.measureText(words.slice(i).join(' ')).width
            )
          );
      // hovered, a header shows its type icon, its title and the options button at the edge: the floor holds them (owner, 2026-10-23: no sort arrow; a click on the title sorts, aria-sort tells assistive technology)
      const gap = tokenPx('--plx-comp-data-grid-header-type-icon-gap'),
        arrow = 0;
      const head =
        text +
        (showTypes ? tokenPx('--plx-comp-data-grid-header-type-icon-size') + gap : 0) +
        arrow +
        (!isStatic && headerMenu ? tokenPx('--plx-comp-data-grid-title-reserve') : 0);
      floor[c.field] = snapUp(Math.max(metrics.min, head + metrics.space * 2));
      // (issue 929) a column with a set width is measured too: its natural width is its content, capped at the set width
      const explicit = tokenPx(c.width);
      const family =
        cs
          .getPropertyValue(
            kinds(c).includes('data') ? '--plx-comp-data-grid-data-font-family' : '--plx-comp-data-grid-font-family'
          )
          .trim() || cs.fontFamily;
      ctx.font = cs.getPropertyValue('--plx-comp-data-grid-font-size').trim() + ' ' + family;
      // a data column measures with the data font's word spacing (Reddit Mono fitted to DM Sans; normal for DM Sans)
      ctx.wordSpacing = kinds(c).includes('data')
        ? cs.getPropertyValue('--plx-sys-font-data-word-spacing').trim() || '0px'
        : '0px';
      let width = head;
      const k = kinds(c),
        pill =
          cells === 'pill' && c.pill !== false && !k.includes('tags') && !k.includes('badge') && !k.includes('deleted');
      const face = pill
          ? scales[k.includes('data') || ['number', 'currency', 'date', 'bytes'].includes(c.type) ? 'data' : 'text']
          : null,
        scale = face ? face.scale : 1; // a pill: its own font, as drawn
      if (face) {
        ctx.font = face.font;
        ctx.wordSpacing = face.wordSpacing;
      }
      const chrome = pill
        ? tokenPx('--plx-comp-data-pill-md-padding-inline-start') +
          tokenPx('--plx-comp-data-pill-md-padding-inline-end') +
          2 * tokenPx('--plx-comp-data-pill-border-width') +
          (c.type === 'person' || k.includes('avatar-name') || (showTypes && typeOf(c) !== 'text')
            ? tokenPx('--plx-comp-data-pill-icon-size') + tokenPx('--plx-comp-data-pill-gap')
            : 0)
        : 0; // the icon only where the pill has one
      source.forEach((record) => {
        const value = valueAt(record, c.field);
        // a tags cell is a row of Tags: each tag's text plus its own padding and border, with the gap between them (issue 477, so the column fits its tags)
        const tagged = k.includes('tags') && !pill ? [].concat(value ?? []).map((tag) => (typeof tag === 'object' ? tag.label : String(tag))) : null;
        width = Math.max(
          width,
          tagged
            ? tagged.reduce((sum, text) => sum + ctx.measureText(text).width + 2 * (tokenPx('--plx-comp-tag-padding-inline') + tokenPx('--plx-comp-tag-border-width')), 0) +
                tokenPx('--plx-comp-data-grid-cell-rich-gap') * Math.max(0, tagged.length - 1)
            : ctx.measureText(valueText(value)).width * scale + chrome
        );
      });
      const content = width + metrics.space * 2;
      // a fixed table or a list (narrow="table" | "list") keeps its set widths as before; the default grid sizes to content
      if (explicit) {
        widths[c.field] = fitting ? snapUp(Math.max(metrics.min, floor[c.field], Math.min(explicit, content))) : Math.max(explicit, floor[c.field]);
        return;
      }
      widths[c.field] = snapUp(
        Math.max(
          metrics.min,
          Math.min(content, tokenPx('--plx-comp-data-grid-auto-max-width') || Infinity)
        )
      );
      free.push(c.field);
    });
    const available =
      metrics.room -
      (selectable ? metrics.lead : 0) -
      (rowMenu && rowMenuButton ? metrics.menu : 0) -
      (props.viewMenu ? metrics.lead : 0);
    // the shown columns (a hidden column takes no room)
    const shownColumns = columns.filter((c) => !columnVisibility || columnVisibility[c.field] !== false);
    // the table fits its room (owner, issue 929: "autosize and autofit"): each shown column starts at its natural width (its
    // header and its widest value, capped at its set width; measured above). Over the room, the columns with the most room
    // above their minimum readable width (minWidth, else the header floor, never under --plx-ref-size-20u) give it up first,
    // levelled down together, and the title (the first key column) last; a column the person sized keeps its width. The grid
    // draws cards only when every column is at its minimum and it still does not fit (the narrow switch below). Room to spare
    // goes to the title, else the widest text column, else the last column that sizes itself
    const least = (c) => Math.max(floor[c.field] || 0, tokenPx(c.minWidth) || metrics.min);
    const sized = (c) => !!(sizing && sizing[c.field]);
    const widthOf = (c) => (sized(c) ? sizing[c.field] : widths[c.field] || 0);
    const shrinkable = shownColumns.filter((c) => !kinds(c).includes('icon') && !sized(c));
    const isText = (c) => !kinds(c).includes('data') && !['number', 'currency', 'date', 'bytes', 'person'].includes(c.type) && !kinds(c).includes('icon');
    const title = shrinkable.find((c) => c.field === (keys && keys[0])) || null;
    let over = fitting ? shownColumns.reduce((sum, c) => sum + widthOf(c), 0) - available : 0;
    const shrank = over > 0;
    // the others, levelled: every column above the level comes down to it (its minimum plus the level)
    const others = shrinkable.filter((c) => c !== title);
    const extra = (c) => Math.max(0, widths[c.field] - least(c));
    const room = others.reduce((sum, c) => sum + extra(c), 0);
    if (over > 0 && room > 0) {
      const cut = Math.min(over, room), byExtra = others.map(extra).sort((x, y) => y - x);
      // the level L where the extras above it add up to the cut
      let level = 0, above = 0;
      for (let i = 0; i < byExtra.length; i += 1) {
        above += byExtra[i];
        const next = i + 1 < byExtra.length ? byExtra[i + 1] : 0, take = above - (i + 1) * next;
        if (take >= cut) { level = next + (take - cut) / (i + 1); break; }
      }
      others.forEach((c) => { widths[c.field] = least(c) + Math.min(extra(c), level); });
      over -= cut;
    }
    if (over > 0 && title) widths[title.field] = Math.max(least(title), widths[title.field] - over);
    // whole grid steps, rounded down (a shrunk column never rounds back over the room) and never under its minimum
    if (shrank)
      shrinkable.forEach((c) => { widths[c.field] = Math.max(least(c), snapToGrid(widths[c.field], { round: 'down', step })); });
    const used = shownColumns.reduce((sum, c) => sum + widthOf(c), 0);
    const units = Math.max(0, Math.floor((available - used) / step));
    // room to spare (issue 272: a one-digit "#" column took all of it): a fixed table or list gives it to its last self-sizing column as
    // before; the default grid shares it, in whole steps, among the text columns that hold real text (wider than the minimum), the
    // title first; with none of those the title, else the widest text column, else the last self-sizing column takes it
    if (!fitting) {
      const spare = free.filter((field) => shownColumns.some((c) => c.field === field)).pop();
      if (spare) widths[spare] += units * step;
    } else {
      let growers = shrinkable.filter((c) => isText(c) && !tokenPx(c.width) && widths[c.field] > metrics.min);   // a column the app gave a width keeps it
      if (!growers.length) {   // no column with real text: the title, else the widest text column, else the last self-sizing column (as before)
        const one = title && isText(title) ? title : shrinkable.filter(isText).sort((x, y) => widths[y.field] - widths[x.field])[0]
          || free.filter((field) => shownColumns.some((c) => c.field === field)).map((field) => shownColumns.find((c) => c.field === field)).pop();
        growers = one ? [one] : [];
      }
      growers.forEach((c, i) => { widths[c.field] += (Math.floor(units / growers.length) + (i < units % growers.length ? 1 : 0)) * step; });
    }
    setAutoSizing((old) => (JSON.stringify(old) === JSON.stringify(widths) ? old : widths));
    setFloors((old) => (JSON.stringify(old) === JSON.stringify(floor) ? old : floor));
  }, [
    columns,
    source,
    metrics.room,
    metrics.min,
    metrics.space,
    metrics.row,
    selectable,
    isStatic,
    showTypes,
    headerMenu,
    cells,
    effectiveWrap,
    JSON.stringify(columnVisibility || {}),
    JSON.stringify(sizing || {}),
    keys.join('|'),
    narrow,
  ]);
  // the room under the table that the page keeps (#451): the grid's own part below it (its border, a footer) and the end
  // margin, padding and border of each container up to the page, so a table that fills the window ends at the page's
  // padding and only the table scrolls; content placed after the grid is not counted
  const trailing = (at, hold) => {
    let sum = Math.max(0, at.getBoundingClientRect().bottom - hold.getBoundingClientRect().bottom);
    for (let el = at; el; el = el.parentElement) {
      const cs = getComputedStyle(el);
      sum += parseFloat(cs.marginBlockEnd) || 0;
      if (el !== at) sum += (parseFloat(cs.paddingBlockEnd) || 0) + (parseFloat(cs.borderBlockEndWidth) || 0);
    }
    return sum;
  };
  React.useLayoutEffect(() => {
    const at = frame.current;
    if (!at) return;
    const doc = at.ownerDocument;
    let raf = 0;
    const measure = () => {
      raf = 0;
      if (!doc.defaultView) return;
      const next = {
        step: gridStep(at),
        row: tokenPixels('--plx-comp-data-grid-record-height', at),
        line: tokenPixels('--plx-comp-data-grid-line-width', at),
        lead: tokenPixels('--plx-comp-data-grid-lead-column-width', at),
        menu: tokenPixels('--plx-comp-data-grid-row-menu-width', at),
        min: tokenPixels('--plx-ref-size-20u', at),
        space: tokenPixels('--plx-comp-data-grid-cell-padding-inline', at),
        room: at.clientWidth,
        add: tokenPixels('--plx-sys-data-grid-row-height', at),
        group: tokenPixels('--plx-comp-data-grid-group-header-height', at),
        groupGap: tokenPixels('--plx-comp-data-grid-group-gap', at),
      };
      setMetrics((old) => (Object.keys(next).every((k) => next[k] === old[k]) ? old : next));
      // auto (#679): the table needs every visible column at its width, plus the selection, row menu and view columns; when
      // the grid's own width is smaller, it draws the row cards instead of scrolling sideways
      // (issue 929) the switch weighs each shown column at its minimum readable width (minSize: its minWidth or floor), so a
      // table that fits by shrinking its columns stays a table; cards only below that
      const visible = live.current.table?.getVisibleLeafColumns() || [];
      const required =
        visible.reduce((sum, column) => sum + (column.columnDef.minSize || next.min), 0) +
        (selectable ? next.lead : 0) +
        (rowMenu && rowMenuButton ? next.menu : 0) +
        (props.viewMenu ? next.lead : 0);
      const threshold = narrow === 'auto' ? required : tokenPixels(narrowAt, at),
        want = listed && at.clientWidth > 0 && at.clientWidth < threshold;
      setNarrow(want);
      if (!isStatic && !height && mode !== 'pages' && holder.current) {
        const top = holder.current.getBoundingClientRect().top,
          room = at.getBoundingClientRect().bottom - top;
        holder.current.style.maxBlockSize = gridPx(
          inPane
            ? Math.max(0, room)
            : Math.max(next.row * 8, doc.defaultView.innerHeight - top - trailing(at, holder.current)),
          { round: 'down', el: at }
        );
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    const ro = new ResizeObserver(schedule);
    ro.observe(at);
    const mo = new MutationObserver(schedule);
    mo.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ['data-plx-density', 'data-plx-density-policy', 'data-plx-interaction', 'data-plx-mode'],
    });
    const region = at.closest('[data-plx-density]');
    if (region && region !== doc.documentElement)
      mo.observe(region, { attributes: true, attributeFilter: ['data-plx-density'] });
    return () => {
      ro.disconnect();
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [
    inPane,
    effectiveStep,
    effectiveWrap,
    height,
    narrow,
    narrowAt,
    mode,
    columns,
    keys.join('|'),
    JSON.stringify(autoSizing),
    JSON.stringify(sizing),
    JSON.stringify(columnVisibility),
    selectable,
    !!rowMenu,
    rowMenuButton,
    props.viewMenu,
  ]);
  React.useLayoutEffect(() => {
    virtual.measure();
  }, [metrics.row, metrics.line, metrics.group, metrics.groupGap, model.length, collapsed]);
}
