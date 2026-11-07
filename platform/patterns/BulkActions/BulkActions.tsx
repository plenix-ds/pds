/* Plenix · SelectionSummary, BulkActions
   Summary: What is selected, and what can be done with it. BulkActions is a selection bar for a page WITHOUT a command
     bar (owner, 2026-10-15: under a command bar, its selection swaps the bar instead: CommandBar selection={{ count,
     actions, onClear }}). SelectionSummary is its count with Select all and Clear, for a place that has no bar.
   Deprecated: BulkActions stays exported for one release. Use CommandBar's selection state instead.
     SelectionSummary remains available for a selection count outside a bar.
   Usage:
     <BulkActions count={sel.length} total={rows.length} noun="asset" onSelectAll={() => …} onClear={() => setSel([])}
       actions={[{ id: 'download', label: 'Download', icon: 'download-arrow', onSelect: () => … },
                 { id: 'delete', label: 'Delete', icon: 'trash', danger: true, onSelect: () => … }]} />
     <SelectionSummary count={3} total={120} noun="asset" onSelectAll={() => …} onClear={() => …} />
   Props:
     SelectionSummary.count: how many are selected
     SelectionSummary.total: how many can be selected
     SelectionSummary.noun: a string: the word for one item, for the tooltips (default "item")
     SelectionSummary.plural: the word for several (default: noun + "s")
     SelectionSummary.onSelectAll(): runs from Select all; without it there is no Select all
     SelectionSummary.onClear(): runs from Clear; without it there is no Clear
     SelectionSummary.className: more classes
     SelectionSummary.strings: the words, for other languages: { selected: "{n} selected", selectAll: "Select all",
       clear: "Clear", allSelected: "Every {noun} is selected", nothingToClear: "Nothing to clear: select {plural} first" }
     BulkActions.count: how many are selected; at 0 every command is disabled, each with its why-tooltip
     BulkActions.total, noun, plural, onSelectAll, onClear: as for SelectionSummary
     BulkActions.actions: the commands on the selection, in order: [{ id, label, icon, danger, single, disabled, why,
       onSelect, items }]
     BulkActions.actions[].danger: a destructive command: in the danger color, after a divider, the last to fold into More
     BulkActions.actions[].single: the command applies to one item only: disabled while more than one is selected
     BulkActions.actions[].items: [{ id, label, icon, danger, single, onSelect }]: the command is a menu button
     BulkActions.actions[].why: its own tooltip while it is disabled (default: strings.why or strings.single)
     BulkActions.label: the toolbar's accessible name (default strings.label: "Selection actions")
     BulkActions.className: more classes
     BulkActions.strings: as for SelectionSummary, plus { label: "Selection actions", more: "More actions",
       why: "Select {plural} to {action}", single: "Select one {noun} to {action}" } ({action} is the command's label in
       lower case)
   Behavior:
     The order (owner, 2026-10-14): the commands first, then Select all and Clear, then at the far end "N selected" (the
       number in the data font, Reddit Mono; no noun), announced politely.
     Everything shows at every count: a command that does not apply yet is disabled with a tooltip saying why (Select
       all once everything is selected, Clear and every command at 0, a single command while several are selected).
     The button rule of the command bar: ghost buttons with icon and label; icons only with tooltips when the bar does not
       fit; then the commands fold into "More actions" (⋮) one at a time from the end, Delete last. More shows only when
       something does not fit.
     It is a Toolbar: one Tab stop, the arrow keys move between its controls.
   Notes:
     API (2026-10-14): the count reads "N selected" (strings.selected is a template, no longer a function); "Select all"
     and "Clear" keep their places and are disabled, never hidden; the look is the command bar's (white, framed, ghost
     buttons), never tinted by a selection. */
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useBarFit } from '../../utils/barFit.ts';
import { formatNumber } from '../../utils/format.ts';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { Toolbar } from '../../components/Toolbar/Toolbar.tsx';
import { Tooltip } from '../../components/Tooltip/Tooltip.tsx';
import { BarActions, foldOrder } from '../CommandBar/BarActions.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { fill } from '../../utils/fill.ts';

const off = (a: any, count: any) => !!a.disabled || !count || !!(a.single && count > 1);

// "N selected": the number in the data font
function Count({ count, t }: any) {
  const [before, after] = String(t.selected).split('{n}');
  return (
    <span className="plx-selection-summary__count" aria-live="polite">
      {before}<Text variant="data" className="plx-selection-summary__number">{formatNumber(count)}</Text>{after}
    </span>
  );
}
// Select all and Clear: disabled, with the reason, until they apply
function SelectButtons({ count, total, words, onSelectAll, onClear, t }: any) {
  const all = total !== undefined && count >= total;
  const tip = (el: any, why: any) => (why ? <Tooltip content={why}>{el}</Tooltip> : el);
  return (
    <>
      {onSelectAll ? tip(<Button size="sm" variant="ghost" disabled={all} onClick={onSelectAll}>{t.selectAll}</Button>, all ? fill(t.allSelected, words) : null) : null}
      {onClear ? tip(<Button size="sm" variant="ghost" disabled={!count} onClick={onClear}>{t.clear}</Button>, count ? null : fill(t.nothingToClear, words)) : null}
    </>
  );
}

/** @public */
export type SelectionSummaryProps = {
  count: number;
  total?: number;
  noun?: string;
  plural?: string;
  onSelectAll?(): void;
  onClear?(): void;
  strings?: Record<string, string>;
  className?: string;
};
export function SelectionSummary({ count, total, noun, plural, onSelectAll, onClear, strings, className }: SelectionSummaryProps) {
  const t: any = useStrings('bulkActions', strings);
  const words = { noun: noun ?? t.noun, plural: plural || (noun ? noun + 's' : t.plural) };   // the default words come from the catalog
  return (
    <div className={cx('plx-selection-summary', className)}>
      <Count count={count} t={t} />
      <SelectButtons count={count} total={total} words={words} onSelectAll={onSelectAll} onClear={onClear} t={t} />
    </div>
  );
}

/** @public */
export type BulkActionsProps = SelectionSummaryProps & {
  /** the commands for the selection */
  actions?: Array<Record<string, unknown>>;
  label?: string;
};
export function BulkActions({ count, total, noun, plural, onSelectAll, onClear, actions = [], label, strings, className }: BulkActionsProps) {
  const t: any = useStrings('bulkActions', strings);
  const words = { noun: noun ?? t.noun, plural: plural || (noun ? noun + 's' : t.plural) };   // the default words come from the catalog
  const root = React.useRef<any>(null);
  const folds = foldOrder(actions).length;
  const step = useBarFit(root, actions.map((a) => a.label).join('|') + '§' + count, 1 + folds, 0, ':scope > [data-plx-bar-row]');
  const why = (a: any) => a.why || fill(count && a.single && count > 1 ? t.single : t.why, Object.assign({ action: String(a.label).toLowerCase() }, words));
  return (
    <div ref={root} className={cx('plx-bulk-actions', !count && 'plx-bulk-actions--empty', className)}>
      <Toolbar variant="bar" label={label || t.label} className="plx-bulk-actions__row" data-plx-bar-row="">
        <Toolbar.Group className="plx-bulk-actions__actions">
          {actions.length ? (
            <BarActions actions={actions as any} iconOnly={step >= 1} fold={Math.max(0, step - 1)} off={(a: any) => off(a, count)} why={why}
              moreLabel={t.more} dangerClass="plx-command-bar__danger" />
          ) : null}
          {actions.length && (onSelectAll || onClear) ? <span className="plx-bulk-actions__divider" aria-hidden="true" /> : null}
          <SelectButtons count={count} total={total} words={words} onSelectAll={onSelectAll} onClear={onClear} t={t} />
        </Toolbar.Group>
        <Toolbar.Spacer />
        <Toolbar.Group className="plx-bulk-actions__end"><Count count={count} t={t} /></Toolbar.Group>
      </Toolbar>
    </div>
  );
}
