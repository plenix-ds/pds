/* Plenix · DataGrid engine · the engine's own small parts (gaps, the cell editor, the checkbox, the width wrapper, the row targets)
   Summary: The engine's own small parts: the gaps that stand for rows not drawn (Gap, RowGap), the cell editor
     (CellEditor), the checkbox (Check), a header's small trigger (PressTrigger, built on usePressable), the width wrapper
     for a column's cells (Width, WidthPixels), a row's menu (RowMenuContent), the custom cell with the data-font helper
     (CustomCell), the memoized row (MemoGridRow) and the row target (RowTarget).
   Usage:
     import { RowGap, CellEditor, Check, PressTrigger, Width, RowMenuContent, CustomCell, MemoGridRow, RowTarget } from './engine/parts.jsx';
   Props:
     each part takes the props the engine passes it (for example CellEditor: column, value, onCommit, onCancel; Check:
     checked, mixed, label, onChange); used only by the DataGrid engine (not public exports)
   Notes:
     Moved out of DataGridEngine.jsx without any change to the code (issue 688). The engine is documented in DataGridEngine.jsx.
*/
import React from 'react';
import { useFloating } from '../../../utils/floating.ts';
import { announce } from '../../../utils/announce.tsx';
import { Spinner } from '../../Loading/Loading.tsx';
import { dataWhenText } from '../../../utils/dataText.tsx';
import { cx } from '../../../utils/cx.ts';
import { usePressable } from '../../../hooks/usePressable.ts';
import { gridPx } from '../../../utils/grid.ts';
import { gapPieces } from '../../../hooks/useVirtualizer.ts';
import { useStrings } from '../../../providers/LocaleProvider.tsx';
import { GRID } from './helpers.jsx';

function Gap({ count, kind = 'record' }) {
  return count > 0 ? (
    <div className={'plx-data-grid__gap plx-data-grid__gap--' + kind} aria-hidden="true">
      {gapPieces(count).map((n, i) => (
        <div key={i} className="plx-virtual-gap__piece" data-plx-span={String(n)} />
      ))}
    </div>
  ) : null;
}

// the space for the cards a long card list does not draw (issue 809): px whole pixels, in pieces of the spacer unit
export function PixelGap({ px }) {
  const n = Math.max(0, Math.round(px || 0));
  return n > 0 ? (
    <div className="plx-data-grid__gap plx-data-grid__gap--px" aria-hidden="true">
      {gapPieces(n).map((p, i) => (
        <div key={i} className="plx-virtual-gap__piece" data-plx-span={String(p)} />
      ))}
    </div>
  ) : null;
}

export function RowGap({ rows }) {
  const counts = rows.reduce(
    (all, row) => {
      all[
        row.__group
          ? row.__group.separated
            ? 'separated'
            : 'group'
          : row.__gap
            ? 'band'
            : row.__add
              ? 'add'
              : 'record'
      ]++;
      return all;
    },
    { record: 0, group: 0, separated: 0, band: 0, add: 0 }
  );
  return (
    <div aria-hidden="true">
      {Object.entries(counts).map(([kind, count]) => (
        <Gap key={kind} kind={kind} count={count} />
      ))}
    </div>
  );
}

// the message under the cell: in the top layer (popover="manual") so the cell's clipping cannot hide it, placed against the
// cell's block-end edge, aligned to its inline start, at least as wide as the cell (utils/floating.ts)
export function EditorMessage({ id, anchor, message }) {
  const cell = React.useRef(null),
    box = React.useRef(null);
  React.useLayoutEffect(() => {
    cell.current = anchor.current?.closest('[role="gridcell"]') ?? null;
    const el = box.current;
    if (el?.showPopover && !el.matches(':popover-open')) el.showPopover();
  }, [anchor, message]);
  useFloating(cell, box, { open: true, placement: 'bottom-start', matchWidth: true });
  return (
    <span ref={box} id={id} role="alert" popover="manual" className="plx-data-grid__editor-message">
      {message}
    </span>
  );
}

// a cell's save status: a small spinner while the caller's answer is awaited; a refusal's message under the cell until the next key or click
export function CellStatus({ status, onClear }) {
  const anchor = React.useRef(null);
  React.useEffect(() => {
    if (status.kind !== 'refused') return undefined;
    const later = setTimeout(() => {
      window.addEventListener('keydown', onClear, true);
      window.addEventListener('pointerdown', onClear, true);
    }, 0);
    return () => {
      clearTimeout(later);
      window.removeEventListener('keydown', onClear, true);
      window.removeEventListener('pointerdown', onClear, true);
    };
  }, [status, onClear]);
  return status.kind === 'saving' ? (
    <span className="plx-data-grid__cell-status">
      <Spinner size="sm" />
    </span>
  ) : (
    <span ref={anchor} className="plx-data-grid__cell-status">
      <EditorMessage id={status.id} anchor={anchor} message={status.message} />
    </span>
  );
}

const LazyEditor = React.lazy(() => import('./editors.jsx'));

export function CellEditor({ column, record, value, area, select, date, combobox, person, tags, custom, onDraft, onCommit, onCancel }) {
  const S = useStrings('dataGrid'),
    [draft, setDraft] = React.useState(value ?? ''),
    [invalid, setInvalid] = React.useState(null),
    done = React.useRef(false),
    input = React.useRef(null),
    messageId = React.useId();
  React.useEffect(() => {
    announce(S.editing.replace('{column}', column.title));
  }, []);
  // the draft is kept outside the editor, so scrolling the row out of the window and back does not lose what was typed
  React.useEffect(() => {
    onDraft?.(draft);
  }, [draft]);
  const finish = async (move = 0, picked) => {
    if (done.current) return;
    done.current = true;
    const next = picked !== undefined ? picked : column.editor === 'number' ? (draft === '' ? null : Number(draft)) : draft;
    if (column.validate) {
      // a message keeps the cell open (ADR 0016): the editor is back in play and takes the focus again
      const message = await column.validate(next, record);
      if (message) {
        done.current = false;
        setInvalid(message);
        input.current?.focus();
        return;
      }
    }
    onCommit(next, move);
  };
  // every editor but the one-line input (the nine built-in types and an application's own component) loads on first use (editors.jsx), so a
  // grid that only edits text and numbers does not carry Select, DatePicker, Combobox and EntityPicker (the bundle budget, #84)
  const kind = custom ? 'custom' : tags ? 'tags' : person ? 'person' : combobox ? 'combobox' : date ? 'date' : area ? 'area' : select ? 'select' : null;
  if (kind)
    return (
      <React.Suspense
        fallback={
          <span className="plx-data-grid__value" aria-busy="true">
            {Array.isArray(value) ? value.join(', ') : value == null ? '' : String(value)}
          </span>
        }
      >
        <LazyEditor
          {...{ kind, column, record, draft, setDraft, invalid, setInvalid, messageId, finish, input, done }}
          editor={column.editor}
          cancel={onCancel}
          options={column.editorProps?.options ?? []}
          load={column.editorProps?.loadOptions}
          label={S.editCell.replace('{title}', column.title)}
        />
      </React.Suspense>
    );
  return (
    <>
      <input
        ref={input}
        autoFocus
        className="plx-data-grid__editor"
        aria-label={S.editCell.replace('{title}', column.title)}
        aria-invalid={invalid ? 'true' : undefined}
        aria-describedby={invalid ? messageId : undefined}
        type={column.editor === 'number' ? 'number' : 'text'}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          if (invalid) setInvalid(null);
        }}
        onBlur={() => finish()}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === 'Escape') {
            done.current = true;
            onCancel();
          } else if (e.key === 'Enter') {
            e.preventDefault();
            finish();
          } else if (e.key === 'Tab' && !e.altKey && !e.ctrlKey && !e.metaKey) {
            // Tab saves and moves to the next editable cell, Shift+Tab to the previous one (the columns are in reading order, either direction)
            e.preventDefault();
            finish(e.shiftKey ? -1 : 1);
          }
        }}
      />
      {invalid ? <EditorMessage id={messageId} anchor={input} message={invalid} /> : null}
    </>
  );
}

export function Check({ checked, mixed, label, onChange, card }) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    if (ref.current) ref.current.indeterminate = !!mixed;
  }, [mixed]);
  return (
    <label className={GRID + '__check'} onClick={(e) => e.stopPropagation()}>
      <input
        ref={ref}
        className={GRID + '__check-input' + (card ? ' ' + GRID + '__check-input--card' : '')}
        type="checkbox"
        checked={!!checked}
        aria-label={label}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
      />
    </label>
  );
}

// a header's small trigger (the filter, the column menu): a span, so it takes one press from every input through usePressable (Enter and Space press it, as a button); Popover and Menu hand it onClick and onKeyDown
export const PressTrigger = React.forwardRef(function PressTrigger({ onClick, onKeyDown, children, ...rest }, ref) {
  const { pressProps } = usePressable({
    onPress: (p) => {
      if (onClick) onClick(p.event);
    },
    handlers: { onKeyDown }
  });
  return (
    <span ref={ref} role="button" tabIndex={0} {...rest} {...pressProps}>
      {children}
    </span>
  );
});

export const WidthPixels = React.createContext(null);

// Calculate token widths during React's read-only render, then let React batch all style writes at commit.
// Reading the grid in a separate layout effect for every new cell alternates reads and writes and forces layout.
export const Width = React.forwardRef(function Width(
  { as: Element = 'div', width, frozenOffset, children, onAttach, ...props },
  forwarded
) {
  const ref = React.useRef(null),
    pixels = React.useContext(WidthPixels),
    length = (value) => (pixels ? pixels(value) : gridPx(value, { el: ref.current || document.documentElement })),
    style =
      width == null
        ? undefined
        : { width: length(width), ...(frozenOffset == null ? {} : { insetInlineStart: length(frozenOffset) }) };
  return (
    <Element
      {...props}
      style={style}
      ref={(node) => {
        ref.current = node;
        onAttach?.(node);
        if (typeof forwarded === 'function') forwarded(node);
        else if (forwarded) forwarded.current = node;
      }}
    >
      {children}
    </Element>
  );
});

// Compatibility cell adapters read through a live ref; retain custom output until its record, column or row state changes.
export function RowMenuContent({ build, items, record, rowApi }) {
  return build(typeof items === 'function' ? items(record) : items || [], record, rowApi);
}

// a custom cell's own elements (each element of a fragment too) take __cell-content: the grid's class on what it places in the cell
const ownContent = (node, block) =>
  !React.isValidElement(node)
    ? node
    : node.type === React.Fragment
      ? React.cloneElement(
          node,
          {},
          React.Children.map(node.props.children, (child) => ownContent(child, block))
        )
      : React.cloneElement(node, { className: cx(node.props.className, block + '__cell-content') });

export const CustomCell = React.memo(
  function CustomCell({ column, record, cell, block, mods }) {
    const content = column.render(record, cell);
    return React.isValidElement(content) ? (
      ownContent(content, block)
    ) : (
      <span className={cx(block + '__value', mods)}>{dataWhenText(content)}</span>
    );
  },
  (a, b) =>
    a.column === b.column &&
    a.record === b.record &&
    a.rowId === b.rowId &&
    a.selected === b.selected &&
    a.block === b.block &&
    a.mods === b.mods
);

// Window-only updates reuse complete record rows; view, selection and edit changes invalidate their closures.
export const MemoGridRow = React.memo(
  function MemoGridRow({ row, render }) {
    return render(row);
  },
  (a, b) => a.row === b.row && a.version === b.version && a.selected === b.selected
);

export const RowTarget = React.forwardRef(function RowTarget({ onAttach, ...props }, forwarded) {
  return (
    <div
      {...props}
      ref={(node) => {
        onAttach?.(node);
        if (typeof forwarded === 'function') forwarded(node);
        else if (forwarded) forwarded.current = node;
      }}
    />
  );
});
