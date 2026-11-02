/* Plenix · ResourceList
   Summary: A list of the records of one kind (07 Data Display › Lists and collections › Resource list, and its duplicate
     Object list): each row the record's picture (a thumbnail or an avatar), its name, which opens it, a line about it,
     its details and a few actions; rows can be selected with a checkbox for actions on several at once, and grouped
     under headings. For records people scan and open one at a time; records people compare by column belong in the
     DataGrid.
   Usage:
     const [sel, setSel] = React.useState([]);
     <ResourceList label="Projects" noun="project" selectable selected={sel} onSelectionChange={setSel}
       bar={<CommandBar label="Projects" actions={…} find={…} />}
       items={[{ id: 'p1', name: 'Kitchen renovation', description: 'Cabinet quotes and layouts',
                 meta: <><Text variant="data">12</Text> files</>, thumbnail: { icon: 'folder' }, href: '#/projects/p1',
                 actions: <Button size="xs" variant="ghost" iconOnly icon="more" label="More" />, group: 'Personal' }]} />
   Props:
     items: the records, in order: [{ id, name, description, meta, href, onOpen, thumbnail, avatar, media, actions,
       group, disabled }]
     items[].name: the record's name (required); with href a link, with onOpen a button; it covers the row
     items[].description: a line about the record (one line, cut with an ellipsis)
     items[].meta: its details at the row's end (a date, a count, a Badge for a status); wrap technical values in
       <Text variant="data">
     items[].thumbnail: { src, alt, icon } the record's picture (media variant): a Thumbnail
     items[].avatar: { name, src, gender } a person or a team (avatar variant): an Avatar
     items[].media: any content before the text, instead of a thumbnail or an avatar
     items[].field: a field at the row's end (a tag picker, a quick edit; P-52): it takes a set share of the row
       (--plx-comp-resource-list-field-share) and fills it, never wider; items[].fieldOnHover: shown only while the row is
       hovered or focused, its space kept so the row never shifts
     items[].actions: controls at the row's end (with actions): ghost icon buttons or a menu; their own Tab stops
     items[].group: the heading the record sits under (grouped); groups keep the order they first appear in
     items[].disabled: the row's checkbox cannot be checked (a record people may not change)
     label: the list's accessible name (required: the records' kind, "Projects")
     noun: the word for one record, for the count and the checkbox names ("project"); plural: for several (default
       noun + "s")
     selectable: a checkbox before each row and a select-all checkbox in the header (selectable); default false
     selected: the ids of the selected records (controlled); onSelectionChange(ids) runs on every change
     defaultSelected: the ids selected at first (uncontrolled)
     showCount: the header shows the number of records when the list is not selectable (default false)
     bar: the command bar over the list (CommandBar): its actions, search, filters and views; give it the selection
       (CommandBar selection) so its commands swap to the selection's while rows are selected
     emptyState: what the list shows when there are no records (an EmptyState)
     headingLevel: the level of the group headings; default 3
     strings: the words it shows and announces, for other languages: { item: "item", selectAll: "Select all {n} {nouns}",
       select: "Select {name}", count: "{n} {nouns}", selected: "{n} of {total} selected" }
     className: more classes on the list's container
   Behavior:
     A row's name covers the row: one Tab stop per record, a hover fill on the row, the focus ring around it; the checkbox
       and the actions sit above it and stay their own Tab stops.
     Checking a row selects it (the selected fill and a checked box: never color alone); the header's checkbox selects or
       clears every record that can be selected, mixed while only some are; the header says how many are selected.
     Rows follow the density (the data rows' height).
   Notes:
     Composed of Platform parts only: Checkbox, Thumbnail, Avatar, SectionHeading, Count, Text, and the CommandBar the
       caller passes in bar. The selection model is useSelection.
     A pattern of the Polaris resource list. Use the DataGrid when people compare records by column or sort by a column.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { useSelection } from '../../hooks/useSelection.ts';
import { Checkbox } from '../../components/Checkbox/Checkbox.tsx';
import { Thumbnail } from '../../components/Thumbnail/Thumbnail.jsx';
import { Avatar } from '../../components/Avatar/Avatar.jsx';
import { SectionHeading } from '../../components/SectionHeading/SectionHeading.tsx';
import { Count } from '../../components/Count/Count.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { fill } from '../../utils/fill.ts';

// a phrase with its numbers in the data font: "{n} of {total} selected" → [<Text data>3</Text>, ' of ', …]
const phrase = (s, map) => s.split(/(\{n\}|\{total\})/).map((p, i) => (p === '{n}' || p === '{total}' ? <Text key={i} variant="data">{map[p.slice(1, -1)]}</Text> : fill(p, map)));

function Row({ item, selectable, checked, onCheck, t }) {
  const name = item.name;
  const opener = item.href ? <a href={item.href} className="plx-resource-list__opener">{name}</a>
    : item.onOpen ? <button type="button" className="plx-resource-list__opener" onClick={item.onOpen}>{name}</button>
      : <span className="plx-resource-list__opener">{name}</span>;
  const media = item.media !== undefined ? item.media
    : item.avatar ? <Avatar name={item.avatar.name || (typeof name === 'string' ? name : '')} src={item.avatar.src} gender={item.avatar.gender} size="md" />
      : item.thumbnail ? <Thumbnail src={item.thumbnail.src} alt={item.thumbnail.alt} icon={item.thumbnail.icon} /> : null;
  return (
    <li className={cx('plx-resource-list__item', (item.href || item.onOpen) && 'is-interactive', checked && 'is-selected')}>
      {selectable ? (
        <span className="plx-resource-list__select">
          <Checkbox checked={checked} disabled={item.disabled} onChange={onCheck} aria-label={fill(t.select, { name: typeof name === 'string' ? name : t.item })} />
        </span>
      ) : null}
      {media ? <span className="plx-resource-list__media">{media}</span> : null}
      <span className="plx-resource-list__text">
        <span className="plx-resource-list__name">{opener}</span>
        {item.description ? <span className="plx-resource-list__description">{item.description}</span> : null}
      </span>
      {item.meta ? <span className="plx-resource-list__meta" data-plx-text-follow="size">{item.meta}</span> : null}
      {item.field ? <span className={cx('plx-resource-list__field', item.fieldOnHover && 'plx-resource-list__field--hover')}>{item.field}</span> : null}
      {item.actions ? <span className="plx-resource-list__actions">{item.actions}</span> : null}
    </li>
  );
}

export function ResourceList({ items = [], label, noun, plural, selectable = false, selected, onSelectionChange, defaultSelected, showCount = false,
  bar, emptyState, headingLevel = 3, strings, className }) {
  const t = useStrings('resourceList', strings);
  const uid = useUid('plx-resource-list');
  const ids = items.map((it) => it.id);
  const sel = useSelection({ items: ids, mode: 'multiple', selected, defaultSelected, onChange: onSelectionChange,
    disabledKeys: items.filter((it) => it.disabled).map((it) => it.id) });
  const one = noun || t.item;
  const nouns = plural || one + 's';
  const total = items.length;
  // the groups, in the order they first appear (grouped); one unnamed group otherwise
  const groups = [];
  items.forEach((it) => { const g = it.group || ''; let at = groups.find((x) => x.heading === g); if (!at) { at = { heading: g, items: [] }; groups.push(at); } at.items.push(it); });
  const grouped = groups.some((g) => g.heading);
  const row = (it) => <Row key={it.id} item={it} selectable={selectable} checked={sel.isSelected(it.id)} onCheck={() => sel.toggle(it.id)} t={t} />;
  const header = selectable || showCount ? (
    <div className="plx-resource-list__header">
      {selectable ? (
        <span className="plx-resource-list__select">
          <Checkbox checked={sel.allSelected} indeterminate={sel.someSelected} disabled={!total} onChange={() => sel.toggleAll()}
            aria-label={fill(t.selectAll, { n: String(total), nouns: total === 1 ? one : nouns })} />
        </span>
      ) : null}
      <span className="plx-resource-list__count" aria-live="polite" data-plx-text-follow="size">
        {selectable && sel.count ? phrase(t.selected, { n: String(sel.count), total: String(total) }) : phrase(t.count, { n: String(total), nouns: total === 1 ? one : nouns })}
      </span>
    </div>
  ) : null;
  return (
    <div className={cx('plx-resource-list', className)}>
      {bar ? <div className="plx-resource-list__bar">{bar}</div> : null}
      {header}
      {!total && emptyState ? <div className="plx-resource-list__empty">{emptyState}</div>
        : grouped ? groups.map((g, i) => (
          <div key={g.heading || i} className="plx-resource-list__group">
            <SectionHeading level={headingLevel} id={uid + '-' + i} className="plx-resource-list__heading">
              {g.heading}<Count value={g.items.length} className="plx-resource-list__group-count" />
            </SectionHeading>
            <ul className="plx-resource-list__list" aria-labelledby={uid + '-' + i}>{g.items.map(row)}</ul>
          </div>
        ))
          : <ul className="plx-resource-list__list" aria-label={label}>{items.map(row)}</ul>}
    </div>
  );
}
