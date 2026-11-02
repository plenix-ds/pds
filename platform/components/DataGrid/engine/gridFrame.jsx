/* Plenix · DataGrid engine · the frame
   Summary: What the engine returns: the grid's element tree. The width provider around the manage-columns dialog, the frame with its data
     attributes and classes, the failure state, the table (header with its select-all, cells, view menu and row-menu column, the body with
     its rows, the empty and more rows), the scrollbars and the footers of the paged and load-more modes. A render function over the
     engine's state, not a component: one element tree, no extra React layer between the engine and the rows.
   Usage:
     import { gridFrame } from './engine/gridFrame.jsx';
     return gridFrame({ B, S, props, frame, table, model, shown, ordered, ... });
   Props:
     The engine's values (the block class B, the strings S, props, refs, the table and the rows to draw, the selection, the metrics, the
       remote and paging state and the handlers); the call reads them in the render in which the grid is drawn. Returns the element.
   Notes:
     Moved out of DataGridEngine.jsx without any change to the code (issue 714, the frame): the return expression was the end of the
     engine function, in the same place. The engine is documented in DataGridEngine.jsx.
*/
import React from 'react';
import { failureState, manageFailed, viewMenu, emptyRow, moreRow, pagesFooter, loadMoreFooter } from './chrome.jsx';
import { cx } from '../../../utils/cx.ts';
import { lengthName } from './helpers.jsx';
import { tableKeys } from './keys.js';
import { tokenPixels } from '../environment.js';
import { WidthPixels, Check, Width, RowGap } from './parts.jsx';
import { Scrollbars } from '../scrollbars.jsx';
import { Rare } from './rare.jsx';

export function gridFrame({
  cardBar,
  widthPixels,
  headerMenu,
  isStatic,
  managing,
  setManaging,
  chooserColumns,
  changeOrder,
  changeVisibility,
  frame,
  B,
  pinnedAt,
  listed,
  isNarrow,
  height,
  mode,
  className,
  cells,
  gridKey,
  density,
  virtualized,
  effectiveStep,
  effectiveWrap,
  failed,
  S,
  onRetry,
  remoteError,
  setRetry,
  groups,
  childField,
  label,
  remoteMode,
  remoteBusy,
  semanticRows,
  remote,
  table,
  ordered,
  selectable,
  rowMenu,
  rowMenuButton,
  props,
  header,
  columnDnd,
  leadFrozen,
  allVisible,
  selectedVisible,
  selectAll,
  headerCell,
  setRowHeight,
  setWrapHeaders,
  metrics,
  viewportId,
  holder,
  focusCell,
  first,
  fetching,
  source,
  setPage,
  setLoaded,
  allRows,
  pageSize,
  rowDnd,
  stickyGroups,
  groupNode,
  model,
  shown,
  cardMore,
  renderRow,
  last,
  empty,
  scrollFill,
  moreFailed,
  displayedTotal,
  page,
  setPageSize,
  loadedRows,
}) {
  return (
    <WidthPixels.Provider value={widthPixels}>
      {headerMenu && !isStatic && managing ? (
        <Rare
          part="manageDialog"
          args={{ headerMenu, isStatic, managing, setManaging, chooserColumns, changeOrder, changeVisibility }}
          fallback={(retry, from) => manageFailed({ B, S, retry, close: () => setManaging(false), from, frame })}
        />
      ) : null}
      <div
        ref={frame}
        className={cx(
          B,
          isStatic && B + '--static',
          isStatic && 'plx-table',
          pinnedAt >= 0 && B + '--row-header',
          listed && B + '--list',
          isNarrow && B + '--narrow',
          height === '100%' && B + '--fill',
          mode === 'pages' && B + '--pages',
          mode === 'load-more' && B + '--load-more',
          className
        )}
        data-plx-engine="next"
        data-plx-grid-key={cells === 'pill' ? gridKey : undefined}
        data-plx-density={density === 'page' ? undefined : density}
        data-plx-render={virtualized ? 'virtual' : undefined}
        data-plx-row-height={!isStatic && !isNarrow ? effectiveStep : undefined}
        data-plx-wrap-headers={effectiveWrap ? '' : undefined}
        data-plx-height={lengthName(height)}
        data-plx-fit={!isStatic && !height && mode !== 'pages' ? '' : undefined}
      >
        {failureState({ failed, B, S, onRetry, remoteError, setRetry })}

        <div
          className={cx(
            B + '__table',
            B + '__grid',
            height === '100%' && B + '__grid--fill',
            isStatic && B + '__grid--static'
          )}
          role={isStatic ? 'table' : groups.length || childField ? 'treegrid' : 'grid'}
          aria-label={label}
          aria-multiselectable={props.cellSelection && !isStatic ? true : undefined}
          aria-busy={remoteMode && remoteBusy ? true : undefined}
          aria-rowcount={
            groups.length || childField
              ? semanticRows.length + 1
              : (remoteMode ? remote?.total || 0 : table.getFilteredRowModel().rows.length) + 1
          }
          aria-colcount={
            ordered.length + (selectable ? 1 : 0) + (rowMenu && rowMenuButton ? 1 : 0) + (props.viewMenu ? 1 : 0)
          }
          hidden={!!failed}
        >
          <div
            className={cx(
              B + '__grid-header',
              cardBar != null ? B + '__grid-header--card' : isNarrow && B + '__grid-header--narrow',
              isStatic && B + '__grid-header--static'
            )}
            ref={header}
            hidden={isStatic && props.headerVisible === false}
          >
            <div className={`${B}__grid-header-contents`}>
              <div
                {...columnDnd.listProps}
                className={cx(`${B}__grid-headers`, isStatic && B + '__grid-headers--static', cardBar != null && B + '__grid-headers--card')}
                role="row"
              >
                {selectable ? (
                  <div
                    className={cx(
                      `${B}__grid-col ${B}__grid-row-header ${B}__w-lead`,
                      cardBar != null && B + '__grid-col--card',
                      leadFrozen && B + '__grid-frozen'
                    )}
                    role="columnheader"
                  >
                    <div className={cx(`${B}__grid-col-content ${B}__grid-col-content--row-header`, cardBar != null && B + '__grid-col-content--card')}>
                      <Check
                        label={S.selectAll}
                        card={cardBar != null}
                        checked={allVisible}
                        mixed={selectedVisible.length > 0 && !allVisible}
                        onChange={(e) => selectAll(e.target.checked)}
                      />
                    </div>
                  </div>
                ) : null}
                {cardBar != null ? <span className={B + '__card-count'}>{cardBar}</span> : null}
                {cardBar != null ? null : ordered.map(headerCell)}
                {cardBar != null ? null : viewMenu({ props, B, S, effectiveStep, setRowHeight, effectiveWrap, setWrapHeaders })}
                {cardBar == null && rowMenu && rowMenuButton ? (
                  <Width
                    width={metrics.menu}
                    className={`${B}__grid-col`}
                    role="columnheader"
                    aria-label={S.rowActions}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <div
            id={viewportId}
            ref={holder}
            className={cx(
              `${B}__grid-tableholder`,
              height === '100%' && B + '__grid-tableholder--fill',
              isNarrow && B + '__grid-tableholder--narrow',
              isStatic && B + '__grid-tableholder--static'
            )}
            data-plx-height={lengthName(height)}
            data-plx-fit={!isStatic && !height && mode !== 'pages' ? '' : undefined}
            role="rowgroup"
            tabIndex={isStatic ? undefined : 0}
            onKeyDown={tableKeys({ focusCell, first })}
            onScroll={(e) => {
              if (header.current) header.current.scrollLeft = e.currentTarget.scrollLeft;
              if (
                mode === 'load-more' &&
                e.currentTarget.scrollHeight - e.currentTarget.scrollTop - e.currentTarget.clientHeight <
                  tokenPixels('--plx-ref-size-200px', frame.current)
              ) {
                if (remoteMode && !fetching.current && source.length < (remote?.total || 0)) {
                  fetching.current = true;
                  setPage((n) => n + 1);
                } else if (!remoteMode) setLoaded((n) => Math.min(allRows.length, n + pageSize));
              }
            }}
          >
            <div
              {...rowDnd.listProps}
              className={cx(
                `${B}__grid-table`,
                virtualized && B + '__grid-table--virtual',
                isNarrow && B + '__grid-table--narrow',
                isStatic && B + '__grid-table--static'
              )}
              role="presentation"
            >
              {stickyGroups.length ? (
                <div className={B + '__sticky-groups'} aria-hidden="true" inert="">
                  {stickyGroups.map((group) =>
                    React.cloneElement(groupNode(group, true), {
                      key: 'sticky:' + group.id,
                      className: B + '__sticky-group ' + B + '__grid-group-level-' + group.depth,
                      role: undefined,
                      tabIndex: -1,
                      'aria-expanded': undefined,
                      'aria-rowindex': undefined,
                      'aria-level': undefined,
                      onKeyDown: undefined,
                    })
                  )}
                </div>
              ) : null}
              <RowGap rows={model.slice(0, first)} />
              {shown.map(renderRow)}
              {cardMore}
              <RowGap rows={model.slice(last)} />
            </div>
            {emptyRow({ model, B, isStatic, ordered, remoteMode, remoteBusy, S, empty })}
            {moreRow({ scrollFill, model, remoteBusy, moreFailed, B, semanticRows, ordered, S, setRetry })}
          </div>
        </div>
        {!isStatic ? <Scrollbars holder={holder} viewportId={viewportId} hideX={isNarrow} /> : null}
        {pagesFooter({ mode, failed, B, S, displayedTotal, page, pageSize, props, setPage, setPageSize, label })}
        {loadMoreFooter({
          mode,
          failed,
          B,
          S,
          loadedRows,
          displayedTotal,
          remoteMode,
          remoteBusy,
          fetching,
          setPage,
          setLoaded,
          allRows,
          pageSize,
        })}
      </div>
    </WidthPixels.Provider>
  );
}
