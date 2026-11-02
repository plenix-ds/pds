/* Plenix · LoadMore
   Summary: The end of a long list that brings the next items: a Load more button (the default), or the next items loaded
     as people scroll near the end (infinite), with the count so far, a spinner while they load, and an end message
     when nothing is left.
   Usage:
     <List>{items.map(…)}</List>
     <LoadMore onLoadMore={next} loading={busy} hasMore={items.length < total} shown={items.length} total={total} />
     <LoadMore mode="infinite" root={scrollRef} onLoadMore={next} loading={busy} hasMore={more} shown={items.length} />
     <LoadMore pageSize={20} onLoadMore={next} hasMore={more} shown={items.length} onFocusNew={(i) => rows[i].focus()} />
   Props:
     onLoadMore(): loads the next items; the page sets loading while they come and adds them to its list
     hasMore: there are more items to load (default true); false shows the end message
     loading: the next items are on their way (default false)
     shown: how many items the list shows now (the count, and the announcement of how many came)
     total: how many there are in all, when known: "40 of 120" beside the button, in the data font
     mode: "button" (default: a Load more button) | "infinite" (the next items load when the end of the list nears the
       view; the button stays as the keyboard way)
     root: with infinite, a ref to the scroll area the list scrolls in (default: the window)
     pageSize: how many items one load brings: the button says "Show 20 more" (default: "Load more")
     onFocusNew(index): after a load started from the button, runs with the index of the first new item, so the page can
       move focus to it
     strings: the words it shows and announces, for other languages: { more: "Load more", moreCount: "Show {n} more",
       loading: "Loading…", end: "You’ve reached the end", count: "{shown} of {total}", added: (n) => n + " more items
       loaded" }
     className: more classes on the bar
   Behavior:
     The button is a secondary Button: while loading it keeps its width, shows a spinner and stays focusable (aria-busy).
     Infinite: an invisible marker after the list is watched (useIntersection, a little before it shows); when it comes
       into view and nothing is loading, onLoadMore runs, and again while it stays in view after a load.
     When shown grows after a load, how many items came is announced politely; after a load started from the button,
       onFocusNew gets the first new item's index (focus otherwise stays on the button).
     With hasMore false the button gives way to the end message (muted text, not a status badge).
   Notes:
     Prefer the button for results people compare and come back to; keep infinite for streams people browse, with no
       footer under them that people need to reach. For "page 3", use Pagination. DataGrid has its own load more.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Button } from '../Button/Button.tsx';
import { Spinner } from '../Loading/Loading.tsx';
import { useIntersection } from '../../hooks/useIntersection.ts';
import { announce } from '../../utils/announce.tsx';
import { formatNumber } from '../../utils/format.ts';
import { useStrings, useLocale } from '../../providers/LocaleProvider.tsx';
import { dataPhrase } from '../../utils/dataText.tsx';


export const LoadMore = React.forwardRef(function LoadMore({ onLoadMore, hasMore = true, loading = false, shown, total, mode = 'button', root, pageSize,
  onFocusNew, strings, className, ...rest }, ref) {
  const t = useStrings('loadMore', strings);
  const loc = useLocale();
  // "N more items loaded": a plural message in the catalog (Arabic has six forms); an app's own function in strings still wins
  const added = (n) => (typeof t.added === 'function' ? t.added(n) : loc.t('loadMore.added', { count: n, n: formatNumber(n) }));
  const sentinel = React.useRef(null);
  const before = React.useRef(shown), fromButton = React.useRef(false);
  const infinite = mode === 'infinite';
  const { visible } = useIntersection(sentinel, { root, rootMargin: '--plx-ref-size-200px', disabled: !infinite || !hasMore });
  React.useEffect(() => { if (infinite && visible && hasMore && !loading && onLoadMore) onLoadMore(); }, [infinite, visible, hasMore, loading, shown]);
  React.useEffect(() => {
    const was = before.current;
    before.current = shown;
    if (typeof shown !== 'number' || typeof was !== 'number' || shown <= was) return;
    announce(added(shown - was));
    if (fromButton.current && onFocusNew) onFocusNew(was);
    fromButton.current = false;
  }, [shown]);
  const press = () => { if (loading || !onLoadMore) return; fromButton.current = true; onLoadMore(); };
  const count = typeof shown === 'number' && typeof total === 'number'
    ? t.count.replace('{shown}', formatNumber(shown)).replace('{total}', formatNumber(total)) : null;
  return (
    <div ref={ref} className={cx('plx-load-more', infinite && 'plx-load-more--infinite', !hasMore && 'is-end', className)} {...rest}>
      {infinite && hasMore ? <div ref={sentinel} className="plx-load-more__sentinel" aria-hidden="true" /> : null}
      {!hasMore ? <p className="plx-load-more__end">{t.end}</p>
        : infinite && loading ? <div className="plx-load-more__loading"><Spinner size="sm" label={t.loading} /><span aria-hidden="true">{t.loading}</span></div>
        : <Button className="plx-load-more__button" loading={loading} onClick={press} strings={{ working: t.loading }}>{pageSize ? dataPhrase(t.moreCount, { n: pageSize }) : t.more}</Button>}
      {count ? <span className="plx-load-more__count">{dataPhrase(count)}</span> : null}
    </div>
  );
});
