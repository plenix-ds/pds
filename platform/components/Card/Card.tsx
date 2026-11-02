/* Plenix · Panel, Card, MediaCard
   Summary: Surfaces. Panel is a titled section of a page or a settings screen; Card is one record in a list or grid;
     MediaCard is an asset tile.
   Usage:
     <Panel title="Storage" description="…" actions={<Button…/>} footer={…} flush headingLevel={2}>…</Panel>
     <Card title="Brand kit" meta="12 assets" actions={<…/>} selected onOpen={() => …}>…</Card>
     <Card title="Kitchen renovation" meta="Personal · 12 files" expandable>…</Card>
     <MediaCard src="/a.jpg" alt="" title="hero.jpg" meta="2.4 MB · JPG" badge={<…/>} aspect="4/3"
       selected={sel} onSelectChange={(checked) => …} selectLabel="Select hero.jpg" href="#/asset/1" />
   Props:
     Card.accent: removed (issue 621): a Card draws no colored edge. A color that carries meaning goes inside the card (a ColorSwatch beside the meta, a ProgressBar color); an accent passed to a Card is ignored and development warns once
     Panel.title: the heading; it also names the section landmark
     Panel.icon: the icon of what the card is (an icon name or element), before the heading (owner, batch 272: a card's
       icon always sits on the left of its heading)
     Panel.description: a line of text under the title
     Panel.actions: controls at the end of the header
     Panel.footer: content in a footer below the body
     Panel.flush: true removes the body padding (default false)
     Panel.headingLevel: the heading level of the title (default 2)
     Panel.collapsible: true adds a Collapse/Expand button at the end of the header (default false)
     Panel.defaultExpanded: whether a collapsible panel starts open (default true)
     Panel.expanded: the open state when the parent controls it; onToggle(next) then runs on each press
     Panel.onToggle(next): runs when a collapsible panel opens or closes
     Panel.children: the body
     Panel.className: more classes on the <section>
     Panel.surface, Panel.elevation: as Card's
     Panel.strings: the words it announces, for other languages: { collapse: "Collapse {title}", expand: "Expand {title}",
       section: "section" } ({title} is the title, or the section word when the title is not text)
     Card.icon: the icon of what the card is (an icon name or element), before the title, like Panel.icon (owner,
       batch 272: a card's icon always sits on the left of its heading); decorative (the title names the card)
     Card.title: the card title; with onOpen or href it is the card's link or button
     Card.meta: a line of details under the title
     Card.actions: controls at the end of the header
     Card.selected: shows the selected state; with onOpen or href the card's link or button also gets aria-current="true" (default false)
     Card.href: makes the title a link
     Card.onOpen(): makes the title a button that runs this
     Card.headingLevel: the heading level of the title (default 3)
     Card.layout: "default" (default) | "media-first" (body above heading) | "media-start" (body beside heading and meta)
     Card.bodyLayout: "default" (default) | "stack" (vertical body with a gap)
     Card.titleWrap: whether the title wraps instead of truncating (default false)
     Card.children: the body
     Card.className: layout integration classes on the <article>; Card owns its internal parts
     Card public hooks: --plx-comp-card-layout-gap (media-start column gap; defaults to card-header-gap),
       --plx-comp-card-body-gap (stack body gap; defaults to card-row-gap). Both accept length tokens, inherit to every
       Card in the supplying context including nested Cards, and apply across themes/densities without affecting states.
       FeatureCard supplies layout and wrap props; UserCard supplies the stack body. Patterns own only their content.
     Card.surface: "flat" (default) | "glow" (the surface in the middle fading to a rim one step off it) | "inset" (a soft
       12px inner edge in the rim color) (owner, 2026-10-15, the card builder)
     Card.elevation: "outline" (default: the 1px border) | "halo" (a thin even shadow) | "lifted" (a fuller even shadow,
       as menus that open) | "floating" (soft and wide); halo, lifted and floating have no visible border. Any surface with any
       elevation.
     Card.expandable: true adds an Expand/Collapse button at the end of the header that shows or hides the body; the title,
       the meta and the actions stay (Expandable card, library wave 8); default false
     Card.defaultExpanded: whether an expandable card starts open (default false: its summary only)
     Card.expanded: the open state when the parent controls it; onToggle(next) then runs on each press
     Card.onToggle(next): runs when an expandable card opens or closes
     Card.strings: the words it announces, for other languages: { expand: "Expand {title}", collapse: "Collapse {title}",
       card: "card" } ({title} is the title, or the card word when the title is not text)
     MediaCard.src: the image URL; without it the tile shows the icon
     MediaCard.alt: the image's alternative text (default "")
     MediaCard.icon: an <Icon> (or an icon name) shown when there is no image
     MediaCard.title: the asset name; with onOpen or href it is the tile's link or button
     MediaCard.meta: technical data (size, type, date)
     MediaCard.badge: a badge over the media
     MediaCard.aspect: the media shape: "4/3" (default) | "1/1" | "16/9" | "9/16" | "3/4"
     MediaCard.selected: whether the asset is selected (default false)
     MediaCard.selecting: true while anything in the view is selected (default false)
     MediaCard.onSelectChange(checked, event): the event carries Shift, Ctrl and ⌘ (pass it to useSelection().choose(key, event) for ranges); runs when the selection box changes, or when the card is clicked anywhere but its
       title, box and actions (it toggles the selection); without it there is no selection box and a click opens the card.
       A selectable card opens from its title or a double-click.
     MediaCard.selectLabel: the accessible name of the selection box (default strings.select: "Select " + the title)
     MediaCard.href: makes the title a link
     MediaCard.onOpen(): makes the title a button that runs this
     MediaCard.actions: controls beside the title
     MediaCard.className: more classes on the <article>
     MediaCard.strings: the words it announces, for other languages: { select: "Select {title}", item: "item", assets:
       "{n} assets", asset: "{n} asset" } (the selection box's default name; {title} is the title, or the item word when the
       title is not text; a collection's count)
     MediaCard.type: an asset's format ("PNG", "MP4", "PDF"; library wave 12, Asset): a neutral Badge at the media's top end,
       with the file type's icon when typeIcon names one
     MediaCard.typeIcon: the type Badge's icon (an icon name: fileIcon(name) gives the file type's)
     MediaCard.status: an asset's workflow status (Asset): a Badge element, or { tone, icon, label } for one (a Badge with
       its icon, never a dot), under the meta
     MediaCard.stack: true draws a collection (Collection): two sheets behind the card, a pile of assets; the card is the
       collection's cover (default false)
     MediaCard.count: a collection's number of assets: the meta reads "24 assets" (the data font) unless meta is given
   Behavior:
     Panel is a section landmark named by its title.
     With onOpen or href the title's target covers the whole card, so the card has one Tab stop; actions stay separately reachable.
     An expandable card's toggle is a button with aria-expanded and aria-controls (the body); it sits above the title's
       target, so a card can both open and expand: the toggle shows more, the title opens the record. Closed, the card keeps
       its header and meta (its summary) and its body is hidden from everyone.
     The MediaCard selection box appears on hover, focus and selection, and always while anything is selected (selecting).
     MediaCard images load lazily.
     A selectable MediaCard's title is at least 24px tall (44px with touch): its target extends invisibly above and below the
       text (Platforms Standard 3.1).
     An asset (type, status) shows its format over the picture and its status under the meta: the selection and opening
       stay as they are. A collection (stack) draws its two sheets as decoration (hidden from assistive technology): the
       title names it and the meta says how many assets it holds.
   Notes:
     MediaCard meta is technical data and uses the data font.
     Without type, status and stack the MediaCard draws exactly what it drew before (library wave 12 added them).
     Other props pass through to the outer element.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { Icon, asIcon as iconElement } from '../Icon/Icon.tsx';
import { Badge } from '../Badge/Badge.tsx';
import { formatNumber } from '../../utils/format.ts';
import { development } from '../../utils/devWarn.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';


const H = ({ level, ...props }) => React.createElement(level ? 'h' + level : 'div', props);

export function Panel({ icon, title, description, actions, footer, surface = 'flat', elevation = 'outline', flush = false, headingLevel = 2, collapsible = false, defaultExpanded = true, expanded, onToggle, strings, className, children, ...rest }) {
  const t = useStrings('card.panel', strings);
  const id = useUid('plx-panel');
  const [own, setOwn] = React.useState(defaultExpanded);
  const open = !collapsible || (expanded === undefined ? own : expanded);
  const toggle = () => { if (expanded === undefined) setOwn(!open); if (onToggle) onToggle(!open); };
  return (
    <section aria-labelledby={title ? id : undefined} className={cx('plx-panel', surface !== 'flat' && 'plx-panel--' + surface, elevation !== 'outline' && 'plx-panel--' + elevation, collapsible && !open && 'is-collapsed', className)} {...rest}>
      {title || actions || collapsible ? (
        <div className="plx-panel__header">
          <div className="plx-panel__heading">
            {title ? <H level={headingLevel} id={id} className={cx('plx-panel__title', icon && 'plx-panel__title--icon')}>{icon ? <span className="plx-panel__icon" aria-hidden="true">{iconElement(icon)}</span> : null}{title}</H> : null}
            {description ? <p className="plx-panel__description">{description}</p> : null}
          </div>
          {actions ? <div className="plx-panel__actions">{actions}</div> : null}
          {collapsible ? (
            <button type="button" className="plx-panel__toggle" aria-expanded={open} aria-controls={id + '-body'} aria-label={(open ? t.collapse : t.expand).split('{title}').join(typeof title === 'string' ? title : t.section)} onClick={toggle}>
              <Icon name={ChevronDownIcon} />
            </button>
          ) : null}
        </div>
      ) : null}
      <div id={id + '-body'} hidden={!open} className={cx('plx-panel__body', flush && 'plx-panel__body--flush')}>{children}</div>
      {footer && open ? <div className="plx-panel__footer">{footer}</div> : null}
    </section>
  );
}

function Opener({ href, onOpen, current, className, children }) {
  if (href) return <a href={href} className={className} aria-current={current ? 'true' : undefined}>{children}</a>;
  if (onOpen) return <button type="button" className={className} aria-current={current ? 'true' : undefined} onClick={onOpen}>{children}</button>;
  return <span className={className}>{children}</span>;
}

let warnedAccent = false;
export function Card({ icon, title, meta, actions, surface = 'flat', elevation = 'outline', selected = false, href, onOpen, headingLevel = 3, accent, expandable = false, defaultExpanded = false, expanded, onToggle,
  strings, className, children, layout = 'default', bodyLayout = 'default', titleWrap = false, ...rest }) {
  // the removed accent prop is ignored; development says so once (issue 621)
  if (accent !== undefined && !warnedAccent && development()) { warnedAccent = true; console.warn('[Plenix] Card: the accent prop was removed (issue 621) and is ignored. Show the color inside the card instead (a ColorSwatch beside the meta, a ProgressBar color); see the Upgrading note.'); }
  const interactive = !!(href || onOpen);
  const t = useStrings('card.card', strings);
  const id = useUid('plx-card');
  const [own, setOwn] = React.useState(defaultExpanded);
  const open = !expandable || (expanded === undefined ? own : expanded);
  const toggle = () => { if (expanded === undefined) setOwn(!open); if (onToggle) onToggle(!open); };
  const hasBody = children !== undefined && children !== null;
  return (
    <article className={cx('plx-card', surface !== 'flat' && 'plx-card--' + surface, elevation !== 'outline' && 'plx-card--' + elevation, interactive && 'plx-card--interactive', selected && 'is-selected', expandable && 'is-expandable', expandable && !open && 'is-collapsed', className)} {...rest} data-plx-layout={layout} data-plx-body-layout={bodyLayout} data-plx-title-wrap={titleWrap || undefined}>
      {title || expandable ? (
        <div className="plx-card__header">
          {icon && title ? <span className="plx-card__icon" aria-hidden="true">{iconElement(icon)}</span> : null}
          {title ? <H level={headingLevel} className="plx-card__title"><Opener href={href} onOpen={onOpen} current={selected} className="plx-card__opener">{title}</Opener></H> : null}
          {actions ? <div className="plx-card__actions">{actions}</div> : null}
          {expandable ? (
            <button type="button" className="plx-card__toggle" aria-expanded={open} aria-controls={hasBody ? id + '-body' : undefined}
              aria-label={(open ? t.collapse : t.expand).split('{title}').join(typeof title === 'string' ? title : t.card)} onClick={toggle}>
              <Icon name={ChevronDownIcon} />
            </button>
          ) : null}
        </div>
      ) : null}
      {meta ? <div className="plx-card__meta">{meta}</div> : null}
      {hasBody ? <div id={expandable ? id + '-body' : undefined} hidden={!open} className="plx-card__body">{children}</div> : null}
    </article>
  );
}

export function MediaCard({ src, alt = '', icon, title, meta, badge, aspect = '4/3', selected = false, selecting = false, onSelectChange,
  selectLabel, href, onOpen, actions, type, typeIcon, status, stack = false, count, strings, className, onClick, onDoubleClick, ...rest }) {
  const t = useStrings('card.mediaCard', strings);
  // a collection's count (library wave 12): "24 assets" in the data font, unless the page gives its own meta
  const line = meta || (typeof count === 'number' ? (count === 1 ? t.asset : t.assets).split('{n}').join(formatNumber(count)) : null);
  const statusEl = status ? (React.isValidElement(status) ? status : <Badge tone={status.tone} icon={status.icon}>{status.label}</Badge>) : null;
  const selectable = !!onSelectChange;
  // a selectable card (owner, batch 272: "clicking the card selects it"): a click anywhere but its controls toggles the
  // selection; the title, or a double-click, opens it
  const inControl = (e) => !!(e.target.closest && e.target.closest('a, button, input, select, textarea, [role=menu], .plx-card__actions'));
  const click = (e) => { if (onClick) onClick(e); if (!selectable || e.defaultPrevented || inControl(e)) return; onSelectChange(!selected, e); };
  const dblClick = (e) => { if (onDoubleClick) onDoubleClick(e); if (!selectable || e.defaultPrevented || inControl(e)) return; if (onOpen) onOpen(); else if (href) location.href = href; };
  const card = (
    <article className={cx('plx-media-card', (href || onOpen) && 'plx-media-card--interactive', selectable && 'plx-media-card--selectable', selected && 'is-selected', selecting && 'is-selecting', className)}
      onClick={click} onDoubleClick={dblClick} {...rest}>
      <div className="plx-media-card__media" data-plx-aspect={aspect}>
        {src ? <img src={src} alt={alt} loading="lazy" decoding="async" className="plx-media-card__image" /> : <span className="plx-media-card__placeholder">{icon ? iconElement(icon, { size: 'lg' }) : null}</span>}
        {badge ? <span className="plx-media-card__badge">{badge}</span> : null}
        {type ? <span className="plx-media-card__type"><Badge tone="neutral" size="sm" icon={typeIcon}>{type}</Badge></span> : null}
      </div>
      {onSelectChange ? (
        <input type="checkbox" className="plx-media-card__select" checked={selected} aria-label={selectLabel || t.select.split('{title}').join(typeof title === 'string' ? title : t.item)}
          onChange={(e) => onSelectChange(e.target.checked, e.nativeEvent)} />
      ) : null}
      <div className="plx-media-card__info">
        <div className="plx-media-card__text">
          <Opener href={href} onOpen={onOpen} className="plx-media-card__title">{title}</Opener>
          {line ? <span className="plx-media-card__meta">{line}</span> : null}
          {statusEl ? <span className="plx-media-card__status">{statusEl}</span> : null}
        </div>
        {actions ? <div className="plx-card__actions">{actions}</div> : null}
      </div>
    </article>
  );
  // a collection (library wave 12): two sheets behind the cover card, decoration only
  if (!stack) return card;
  return (
    <div className="plx-media-card-stack">
      <span className="plx-media-card-stack__back" aria-hidden="true" />
      <span className="plx-media-card-stack__middle" aria-hidden="true" />
      {card}
    </div>
  );
}
