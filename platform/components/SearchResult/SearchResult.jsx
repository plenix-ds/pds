/* Plenix · SearchResult, SearchResultGroup, highlightMatches
   Summary: One result of a search (06 Navigation › Search, filter, and discovery › Search result item) and the group of
     results of one kind under a heading (Search result groups): what the result is (a page, a file, a person), its name
     as a link with the words searched for in bold, where it sits (its path), a few words around the match (the snippet)
     and its details.
   Usage:
     <SearchResultGroup heading="Files" count={12} moreHref="#/search/files?q=quote" moreLabel="Show all 12 files">
       <SearchResult kind="file" title="Cabinet quote.pdf" href="#/files/41" query="quote"
         path={['Projects', 'Kitchen renovation']} snippet="…the second quote covers the cabinets and…"
         meta={<Text variant="data">2.4 MB · 10/12/2026</Text>} />
       <SearchResult kind="person" title="Maya Chen" avatar={{ name: 'Maya Chen' }} meta="Designer" onOpen={() => …} />
     </SearchResultGroup>
     <SearchResultGroup label="Results">{results}</SearchResultGroup>   // one list without a heading
   Props:
     SearchResult.title: the result's name (required); with href a link, with onOpen a button
     SearchResult.href: where the result opens (its page): the title is a link (default)
     SearchResult.onOpen(): the title is a button that runs this (a result opened in a pane, not a page of its own)
     SearchResult.kind: what the result is: "page" (default; a page, a note, a record: its icon in a thumbnail) | "file"
       (the file's thumbnail: thumbnail.src, or its type's icon) | "person" (the person's avatar)
     SearchResult.icon: the thumbnail's icon (default "doc-text" for a page, "document" for a file)
     SearchResult.thumbnail: { src, alt } a file's picture
     SearchResult.avatar: { name, src } a person's avatar (default name: the title)
     SearchResult.leading: any content before the text instead of the thumbnail or the avatar
     SearchResult.query: the words searched for: each match in the title and the snippet is bold (with highlight)
     SearchResult.path: where the result sits, from the top: an array of names (["Projects", "Kitchen"]), drawn above the
       title with chevrons between them (with path)
     SearchResult.snippet: the words around the match, as text (one or two lines; longer is cut with an ellipsis)
     SearchResult.meta: the details under the snippet (type, size, date, owner); wrap technical values in
       <Text variant="data">
     SearchResult.actions: controls at the end of the row (a menu); they stay their own Tab stops
     SearchResult.selected: the result whose preview is shown beside the list (aria-current); default false
     SearchResult.headingLevel: the title's heading level inside a page of results; default none (plain text)
     SearchResult.className: more classes on the <li>
     SearchResultGroup.heading: the group's heading (the kind: "Files", "People"); it names the list
     SearchResultGroup.count: the number of results of this kind (drawn after the heading in the data font)
     SearchResultGroup.label: the list's accessible name when there is no heading
     SearchResultGroup.headingLevel: the heading's level; default 3
     SearchResultGroup.moreHref: a link under the results to all the results of this kind
     SearchResultGroup.onMore(): a button under the results that shows more of them here (instead of moreHref)
     SearchResultGroup.moreLabel: the words of that link or button (default strings.more: "Show all")
     SearchResultGroup.children: the SearchResult rows
     SearchResultGroup.className: more classes on the group
     strings: SearchResult: { path: "In" } (said before the path); SearchResultGroup: { more: "Show all" }
     highlightMatches(text, query): the text with every match of the query's words in <strong class="plx-search-result__match">
   Behavior:
     The title's link (or button) covers the whole row: one Tab stop per result, a hover fill on the row, the focus ring
       around the row; the actions sit above it and stay reachable.
     Matching ignores case and finds every word of the query (two letters or more), longest first.
     The path and the snippet are read with the title (the path after the word "In").
   Notes:
     Matches are bold, never colored: the search field's suggestions mark them the same way.
     Group results by kind when a search spans several kinds (pages, files, people); a group shows its first few results
       and a link to the rest. One kind: one list without headings.
     Other props pass through to the <li> (SearchResult) and the outer <div> (SearchResultGroup).
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { Icon } from '../Icon/Icon.tsx';
import { Avatar } from '../Avatar/Avatar.tsx';
import { Thumbnail } from '../Thumbnail/Thumbnail.tsx';
import { SectionHeading } from '../SectionHeading/SectionHeading.tsx';
import { Count } from '../Count/Count.tsx';
import { Link } from '../Link/Link.tsx';
import { Button } from '../Button/Button.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ChevronRightIcon from 'plenix-platform/icons/plenix/chevron-right';
import DocTextIcon from 'plenix-platform/icons/plenix/doc-text';
import DocumentIcon from 'plenix-platform/icons/plenix/document';

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// the text with every match of the query's words in bold (case ignored; words of two letters or more, longest first)
export function highlightMatches(text, query) {
  if (typeof text !== 'string' || !query) return text;
  const words = String(query).trim().split(/\s+/).filter((w) => w.length > 1).sort((a, b) => b.length - a.length);
  if (!words.length) return text;
  const parts = text.split(new RegExp('(' + words.map(escape).join('|') + ')', 'gi'));
  return parts.map((p, i) => (i % 2 ? <strong key={i} className="plx-search-result__match">{p}</strong> : p));
}

export function SearchResult({ title, href, onOpen, kind = 'page', icon, thumbnail, avatar, leading, query, path, snippet, meta, actions,
  selected = false, headingLevel, strings, className, ...rest }) {
  const t = useStrings('searchResult.result', strings);
  const name = highlightMatches(title, query);
  const opener = href ? <a href={href} className="plx-search-result__opener" aria-current={selected ? 'true' : undefined}>{name}</a>
    : onOpen ? <button type="button" className="plx-search-result__opener" aria-current={selected ? 'true' : undefined} onClick={onOpen}>{name}</button>
      : <span className="plx-search-result__opener">{name}</span>;
  const lead = leading !== undefined ? leading
    : kind === 'person' ? <Avatar name={(avatar && avatar.name) || (typeof title === 'string' ? title : '')} src={avatar && avatar.src} size="md" />
      : <Thumbnail src={kind === 'file' && thumbnail ? thumbnail.src : undefined} alt={thumbnail && thumbnail.alt} icon={icon || (kind === 'file' ? DocumentIcon : DocTextIcon)} />;
  const Title = headingLevel ? 'h' + headingLevel : 'span';
  return (
    <li className={cx('plx-search-result', (href || onOpen) && 'is-interactive', selected && 'is-selected', className)} {...rest}>
      {lead ? <span className="plx-search-result__leading">{lead}</span> : null}
      <span className="plx-search-result__text">
        {path && path.length ? (
          <span className="plx-search-result__path">
            <span className="plx-visually-hidden">{t.path + ' '}</span>
            {path.map((p, i) => (
              <React.Fragment key={i}>
                {i ? <span className="plx-search-result__separator" aria-hidden="true"><Icon name={ChevronRightIcon} /></span> : null}
                <span className="plx-search-result__crumb">{p}</span>
              </React.Fragment>
            ))}
          </span>
        ) : null}
        <Title className="plx-search-result__title">{opener}</Title>
        {snippet ? <span className="plx-search-result__snippet">{highlightMatches(snippet, query)}</span> : null}
        {meta ? <span className="plx-search-result__meta" data-plx-text-follow="size">{meta}</span> : null}
      </span>
      {actions ? <span className="plx-search-result__actions">{actions}</span> : null}
    </li>
  );
}

export function SearchResultGroup({ heading, count, label, headingLevel = 3, moreHref, onMore, moreLabel, strings, className, children, ...rest }) {
  const t = useStrings('searchResult.group', strings);
  const id = useUid('plx-search-result-group');
  const more = moreLabel || t.more;
  return (
    <div className={cx('plx-search-result-group', className)} {...rest}>
      {heading ? (
        <SectionHeading level={headingLevel} id={id} className="plx-search-result-group__heading">
          {heading}{count !== undefined && count !== null ? <Count value={count} className="plx-search-result-group__count" /> : null}
        </SectionHeading>
      ) : null}
      <ul className="plx-search-result-group__list" aria-labelledby={heading ? id : undefined} aria-label={heading ? undefined : label}>{children}</ul>
      {moreHref ? <div className="plx-search-result-group__more"><Link href={moreHref} variant="standalone">{more}</Link></div>
        : onMore ? <div className="plx-search-result-group__more"><Button variant="ghost" size="sm" onClick={onMore}>{more}</Button></div> : null}
    </div>
  );
}
