/* Plenix · AppHeader
   Summary: The header across the top of every Plenix application (a banner landmark), after the Carbon UI shell header.
     Left to right it goes from the product to the global: the header name and switcher, the header links, then search,
     the application's action and the utilities at the end.
   Usage:
     <AppHeader tone="accent" currentApp="assets" appsRoot="../" onOpenApp={(app) => handled}
       action={<AppHeader.Action icon="hdr-upload" onClick={() => …}>Upload</AppHeader.Action>}
       search={<SearchField onAccent …/>}
       account={<AppHeader.Account current="account" myAccount={{ href }} settings={{ href }} density extra={<…/>} />} />
     <AppHeader.Item icon={…} label="Projects" current count={3} href="…" onClick={() => …} />
     <AppHeader.Switcher currentApp="assets" appsRoot="../" onOpenApp={(app) => …} brand={…} />
   Props:
     tone: "accent" (default) | "frost" | "plain"; sets the bar's colors and those of everything inside it
     appName: the application's name in the header name (default: the current application's name)
     brand: replaces the header name's content (default: the Plenix mark, then "Plenix" over the application's name). An element is drawn as
       given. An object { logo, organization, application } draws the default's layout with the app's own brand (ADR 0039):
       logo: { src, alt, width, height } or an element, in the mark's slot (36px tall, up to 108px wide, no box; hidden if it fails; alt defaults to "");
       organization: the product line (where "Plenix" is); application: the app line (default: the computed app name)
     brandHref: makes the header name a link when there is no switcher
     currentApp: the open application's id (see PLENIX_APPS), or null on a screen that is not an application (Settings);
       when it is given (also null) the header name is the switcher and the pinned header links show
     appsRoot: the relative path from this page to the folder that holds every application (default "")
     onOpenApp(app): return true when the page opens the application itself (a section of the same page); otherwise the link opens it
     nav: replaces the header links (default: the pinned applications)
     navLabel: the header links' accessible name (default "Pinned applications")
     action: the application's action (AppHeader.Action), an icon item with its label as tooltip, between search and the utilities
     search: the search field (a SearchField onAccent), shown when search is asked for; without it there is no search
     searchSuggestions: at Narrow, the recent searches and suggestions shown under the field of the full-screen search view
     searchResults: at Narrow, the results shown in the full-screen search view (after the suggestions); without them,
       Enter in the field closes the view so the page shows its own results
     searchScope: at Narrow, what the search covers, shown under the field ("In Notes"); default the application's name
     actions: other utilities, before the account
     account: the account menu (AppHeader.Account), last in the utilities
     back: { href | onClick, label } puts a Back item (the arrow) first in the header, for a screen inside the
       application (a mobile app bar on a child screen); label default "Back" (library wave 7)
     title: the screen's title after Back, in place of the header name and the switcher (a mobile app bar on a child
       screen: Back, the title, then the actions); it truncates with an ellipsis when it does not fit
     switcher: true or false overrides whether the header name is the application switcher (default: when currentApp is given)
     className: more classes on the header
     AppHeader.Item.icon: the icon; an Icon without a size is drawn at size lg (24px)
     AppHeader.Item.label: its accessible name and tooltip; include the count in it when there is one
     AppHeader.Item.current: marks the open place (aria-current); default false
     AppHeader.Item.count: a count pill on the icon (up to 99)
     AppHeader.Item.href: makes it a link; otherwise it is a button
     AppHeader.Item.onClick: runs on click
     AppHeader.Item.tooltip: shows the label as a tooltip (default true)
     AppHeader.Item.className: more classes
     AppHeader.Item.ref: forwarded to the link or button, so it can be a Menu trigger
     AppHeader.Account.settings: { href | onSelect } for "Plenix settings", the suite's settings (owner, batch 272)
     AppHeader.Account.signOut: { href | onSelect } for "Sign out", last in the menu (default: the sign-in proxy's sign-out,
       /outpost.goauthentik.io/sign_out); the picture is changed under My account (Settings > Account), not in this menu (owner, batch 274)
     AppHeader.Account.appSettings: { app, href | onSelect, icon } for "<app> settings", this application's own settings
       ("Notes settings", "Asset Manager settings"); left out when the application has none
     AppHeader.Account.name: the person's name (default: the session's)
     AppHeader.Account.email: the person's email (default: the session's)
     AppHeader.Account.src: the person's picture (default: the session's)
     AppHeader.Account.placement: "header" (default; the avatar at the end of the header's utilities; the menu opens below it)
       | "pane" (in the navigation pane's footer, NavPane footer, a row "avatar | name ˅"; the same menu opens above)
     AppHeader.Account.current: "account" | "settings"; marks the open place in the menu
     AppHeader.Account.myAccount: { href | onSelect }; the My Account item shows when the page gives it
     AppHeader.Account.settings: { href | onSelect }; the Settings item shows when the page gives it
     AppHeader.Account.density: true adds the Display density choices with their icons (Compact, Standard, Comfortable;
       the current one checked); default false
     AppHeader.Account.extra: further items after a divider (Sign out)
     AppHeader.Account.strings: the menu's words for another language: trigger (the avatar button's name, {name}), menu,
       myAccount, settings, appSettings ({app}), app, density, compact, standard, comfortable, signOut; English by default
     AppHeader.Action.icon: an icon name (such as "hdr-upload") or an icon element, header-sized
     AppHeader.Action.children: the action's label: its tooltip and accessible name (or label)
     AppHeader.Action.onClick: runs on click
     AppHeader.Switcher.currentApp: the open application's id, marked in the switcher
     AppHeader.Switcher.appsRoot: as for AppHeader (default "")
     AppHeader.Switcher.onOpenApp(app): as for AppHeader
     AppHeader.Switcher.apps: the applications offered (default PLENIX_APPS)
     AppHeader.Switcher.brand: the header name, drawn as the trigger; without brand it is an icon button
   Behavior:
     The header name shows "Plenix" over the application's name with a chevron; it opens the application switcher.
     The switcher shows the pinned applications first, then the others (each application once, batch 243), five to a
     row with no scrolling; pin or unpin from there.
     The switcher is a dialog: it focuses its first link, and Escape, a click outside or focus leaving it closes it.
     The header links are the applications the person pinned (from the switcher), as icon links with tooltips; the current one is marked.
     When the header itself is narrower than Wide (under 840px, --plx-sys-shell-rail-below) the header links leave it and
       search spans the bar; the switcher in the header name still has them. The header measures its own width, not the
       screen's, so it behaves the same in a full window, a split view or a panel (owner, 2026-10-15, GitHub #27).
     The end is right-aligned: search always first and furthest left, then the application's action, then the utilities with no gaps.
     Search is an icon until asked for, then a field that opens to its left without moving any other icon.
     Ctrl K (Cmd K) opens search from anywhere on the page; Escape closes it.
     An empty search field closes when focus leaves it. The field's own clear button is the only X (owner, 2026-10-10: a
       separate Close button made two)
     At Narrow (under 600px, --plx-sys-shell-phone-below) search opens a full-screen search view (Platforms Standard 4.2
       row 7, 5.3 Search): the field on top with Cancel, the scope, the recent searches and suggestions, then the results.
       Opening it adds a history entry, so the browser's Back closes it as Cancel and Escape do; focus stays inside it and
       returns to the search button.
     With a touch pointer every header item and the header name has a 44 × 44px target (Platforms Standard 3.1): the
       target extends invisibly past the 40px item, and the utilities part 4px so the targets do not overlap.
     The account menu shows the name, email and picture from the session.
     On a phone the header is the mobile app bar: the header name (or Back and the title) at the start, search and the
       utilities at the end; the header links leave it (they stay in the switcher).
   Notes:
     Settings is reached from the account menu, never from a separate button.
     Notifications are not in the header: they are a section of the page (NotificationList on the dashboard).
     Other props go on the header element (AppHeader) or the button (AppHeader.Item, AppHeader.Action).
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.ts';
import { Tooltip } from '../../components/Tooltip/Tooltip.tsx';
import { Icon, stateIcon, asIcon as iconElement } from '../../components/Icon/Icon.tsx';
import type { IconValue } from '../../components/Icon/Icon.tsx';
import { SurfaceContext } from '../../providers/Surface.tsx';
import { BrandMark } from '../../components/Brand/Brand.tsx';
import { Count } from '../../components/Count/Count.tsx';
import { Avatar } from '../../components/Avatar/Avatar.tsx';
import { Menu, MenuItem, MenuGroup, MenuDivider } from '../../components/Menu/Menu.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { useSession } from '../../providers/SessionProvider.tsx';
import { PLENIX_APPS, appById, appHref, appIcon } from '../../providers/apps.ts';
import type { PlenixApp } from '../../providers/apps.ts';
import { useLayer, useUid } from '../../utils/layer.ts';
import { useDensity } from '../../hooks/useDensity.ts';
import { useMedia, below, tokenPx, useAppLayout } from '../AppShell/AppShell.tsx';
import OpenInFullIcon from 'plenix-platform/icons/material/open-in-full';
import CloseFullscreenIcon from 'plenix-platform/icons/material/close-fullscreen';
import { useStrings, useDigits } from '../../providers/LocaleProvider.tsx';
import AppSwitcherIcon from 'plenix-platform/icons/plenix/app-switcher';
import ArrowLeftIcon from 'plenix-platform/icons/plenix/arrow-left';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';
import GearIcon from 'plenix-platform/icons/plenix/gear';
import HdrSearchIcon from 'plenix-platform/icons/plenix/hdr-search';
import PinIcon from 'plenix-platform/icons/plenix/pin';
import PinFilledIcon from 'plenix-platform/icons/plenix/pin-filled';
import SettingsCustomizeIcon from 'plenix-platform/icons/plenix/settings-customize';
import SettingsProfileIcon from 'plenix-platform/icons/plenix/settings-profile';
import SignOutIcon from 'plenix-platform/icons/plenix/sign-out';
import DensityCompactIcon from 'plenix-platform/icons/plenix/density-compact';
import DensityStandardIcon from 'plenix-platform/icons/plenix/density-standard';
import DensityComfortableIcon from 'plenix-platform/icons/plenix/density-comfortable';
import { fill } from '../../utils/fill.ts';
import { localDigits } from '../../utils/digits.ts';

/** @public a place the account menu links to: a link (href) or an action (onSelect) */
export type AppHeaderLink = { href?: string; onSelect?: () => void };
/** @public the Back item first in the header, for a screen inside the application */
export type AppHeaderBack = { href?: string; onClick?: React.MouseEventHandler<HTMLElement>; label?: string };
/** @public what onOpenApp receives; return true when the page opens the application itself */
export type AppHeaderOpenApp = (app: PlenixApp) => boolean | void;
export type AppHeaderProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
  tone?: 'accent' | 'frost' | 'plain'; appName?: string; brand?: React.ReactNode | AppHeaderBrand; brandHref?: string;
  /** the open application's id (PLENIX_APPS), or null on a screen that is not an application */
  currentApp?: string | null; appsRoot?: string; onOpenApp?: AppHeaderOpenApp;
  nav?: React.ReactNode; navLabel?: string; action?: React.ReactNode; search?: React.ReactNode;
  searchSuggestions?: React.ReactNode; searchResults?: React.ReactNode; searchScope?: string;
  actions?: React.ReactNode; account?: React.ReactNode; switcher?: boolean; back?: AppHeaderBack; title?: React.ReactNode; className?: string;
};
export type AppHeaderItemProps = Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> & {
  icon?: IconValue | React.ReactNode; label?: string; current?: boolean; count?: number; href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>; tooltip?: boolean; className?: string;
};
/** @public the account menu's words (appHeader.account in the catalog) */
export type AppHeaderAccountStrings = Partial<Record<'trigger' | 'menu' | 'myAccount' | 'settings' | 'appSettings' | 'app' | 'density' | 'compact' | 'standard' | 'comfortable' | 'signOut', string>>;
export type AppHeaderAccountProps = {
  name?: string; email?: string; src?: string; placement?: 'header' | 'pane'; current?: 'account' | 'settings' | 'app-settings';
  myAccount?: AppHeaderLink; settings?: AppHeaderLink; appSettings?: AppHeaderLink & { app?: string; icon?: IconValue };
  signOut?: AppHeaderLink; density?: boolean; extra?: React.ReactNode; strings?: AppHeaderAccountStrings;
};
export type AppHeaderActionProps = Omit<AppHeaderItemProps, 'icon' | 'label' | 'children'> & {
  icon?: IconValue | React.ReactNode; children?: React.ReactNode; label?: string;
  /** @deprecated no longer used: the action is an icon item (batch 272) */
  variant?: string;
};
export type AppHeaderSwitcherProps = { currentApp?: string | null; appsRoot?: string; onOpenApp?: AppHeaderOpenApp; apps?: PlenixApp[]; brand?: React.ReactNode | AppHeaderBrand };
/** @public an organization's brand for the header name: its logo, organization and application */
export type AppHeaderBrand = {
  logo?: { src: string; alt?: string; width?: number; height?: number } | React.ReactElement;
  organization?: React.ReactNode;
  application?: React.ReactNode;
};
const isBrandObject = (b: unknown): b is AppHeaderBrand => typeof b === 'object' && b !== null && !React.isValidElement(b) && !Array.isArray(b);
function BrandLogo({ logo }: { logo: NonNullable<AppHeaderBrand['logo']> }) {
  const [failed, setFailed] = React.useState(false);
  if (React.isValidElement(logo)) return <span className="plx-app-header__logo-slot">{logo}</span>;
  if (failed) return null;
  return <img className="plx-app-header__logo" src={logo.src} alt={logo.alt || ''} width={logo.width} height={logo.height} onError={() => setFailed(true)} />;
}
// the object brand, in the default's markup: the logo in the mark's slot, the organization where "Plenix" is, the application under it
function brandContent(b: AppHeaderBrand, fallbackApp: React.ReactNode, sw: boolean) {
  const app = b.application !== undefined ? b.application : fallbackApp;
  return (
    <>
      {b.logo ? <BrandLogo logo={b.logo} /> : null}
      <span className={cx('plx-app-header__name', sw && 'plx-app-header__name--switch')}>
        {b.organization ? <span className={cx('plx-app-header__product', 'plx-app-header__text-cut', sw && 'plx-app-header__product--switch')} title={typeof b.organization === 'string' ? b.organization : undefined}>{b.organization}</span> : null}
        {app ? <span className={cx('plx-app-header__app', 'plx-app-header__text-cut', sw && 'plx-app-header__app--switch')} title={typeof app === 'string' ? app : undefined}>{app}</span> : null}
      </span>
    </>
  );
}
const brandName = (b: AppHeaderBrand) => [b.organization, b.application].filter((x) => typeof x === 'string').join(' ');
type Words = Record<string, string>;

export function AppHeader({ tone = 'accent', appName, brand, brandHref, currentApp, appsRoot = '', onOpenApp, nav, navLabel,
  action, search, searchSuggestions, searchResults, searchScope, actions, account, switcher, back, title, className, ...rest }: AppHeaderProps) {
  devWarn('AppHeader', { tone }, { tone: ['accent','frost','plain'] });
  const tw = useStrings('appHeader') as Words;
  // the AppShell frame's toggle (frame="1366", D-0093): expand to the window and back; the shell says when there is anything to toggle
  const digits = useDigits(), layout = useAppLayout(), fw = useStrings('appShell') as unknown as { frame: { expand: string; restore: string } };
  const frameToggle = layout?.frame ? <AppHeader.Item icon={layout.frame.full ? CloseFullscreenIcon : OpenInFullIcon} label={layout.frame.full ? fill(fw.frame.restore, { width: localDigits(String(tokenPx('--plx-sys-shell-frame-width')), { digits }) }) : fw.frame.expand} aria-pressed={layout.frame.full} onClick={layout.frame.toggle} /> : null;
  if (navLabel === undefined) navLabel = tw.navLabel;
  const { pinnedApps } = useSession();
  const [searching, setSearching] = React.useState(false);
  const panel = React.useRef<HTMLDivElement>(null), toggle = React.useRef<HTMLButtonElement>(null), view = React.useRef<HTMLDivElement>(null);
  const refocus = React.useRef(false);
  const searchId = useUid('plx-header-search');
  const narrow = useMedia(below('--plx-sys-shell-phone-below'));
  // the header's own width decides whether its links fit (measured before paint, so nothing jumps)
  const root = React.useRef<HTMLElement>(null);
  const [compact, setCompact] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = root.current, limit = tokenPx('--plx-sys-shell-rail-below');
    if (!el || !limit) return undefined;
    const fit = () => setCompact(el.getBoundingClientRect().width < limit);
    fit();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const fullScreen = narrow && searching;   // at Narrow the search view fills the screen
  const close = () => { refocus.current = true; setSearching(false); };
  // the full-screen view is a history entry: the browser's Back closes it; Cancel and Escape go back along it
  React.useEffect(() => {
    if (!fullScreen) return undefined;
    window.history.pushState({ plxSearch: searchId }, '');
    const pop = () => close();
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, [fullScreen]);
  const cancel = () => { if (window.history.state && window.history.state.plxSearch === searchId) window.history.back(); else close(); };
  useLayer(view, fullScreen, { modal: true, onEscape: cancel, initialFocus: () => (view.current && view.current.querySelector('input')) || null });
  React.useEffect(() => {
    if (!searching) {
      // the search button is hidden while the field is open; give it focus back once it shows again
      // (on the next frame: an Escape is a discrete event, so this runs before the button's hidden style is cleared)
      if (refocus.current && toggle.current) { const btn = toggle.current; requestAnimationFrame(() => btn.focus()); }
      refocus.current = false;
      return undefined;
    }
    if (narrow) return undefined;   // the full-screen view is a modal layer: it takes focus and Escape itself
    const input = panel.current && panel.current.querySelector('input');
    if (input) input.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [searching, narrow]);
  // Ctrl K (Cmd K) opens search from anywhere on the page
  React.useEffect(() => {
    if (!search) return undefined;
    const key = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); setSearching(true); } };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [search]);
  // an empty field closes when focus leaves it
  const onPanelBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (panel.current && panel.current.contains(e.relatedTarget as Node | null)) return;
    const input = panel.current && panel.current.querySelector('input');
    if (!input || !input.value) setSearching(false);
  };
  const inApps = currentApp !== undefined;   // the application said where it is (null: a screen that is not an application)
  const app = currentApp ? appById(currentApp) : null;
  const name = appName || (app ? app.label : null);
  // the name's parts in the switch button give way (--switch: they shrink and end in an ellipsis)
  const sw = (switcher !== undefined ? switcher : currentApp !== undefined) && !title;
  const brandEl = isBrandObject(brand) ? brandContent(brand, name, sw) : brand || (name ? <><BrandMark /><span className={cx('plx-app-header__name', sw && 'plx-app-header__name--switch')}><span className={cx('plx-app-header__product', sw && 'plx-app-header__product--switch')}>Plenix</span><span className={cx('plx-app-header__app', sw && 'plx-app-header__app--switch')}>{name}</span></span></> : <><BrandMark />Plenix</>);
  const open = (a: PlenixApp) => (e: React.MouseEvent<HTMLElement>) => { if (onOpenApp && onOpenApp(a) === true) e.preventDefault(); };
  const pinned = nav || (inApps ? PLENIX_APPS.filter((a) => pinnedApps.indexOf(a.id) >= 0).map((a) => (
    <AppHeader.Item key={a.id} icon={<Icon name={appIcon(a) as IconValue} />} label={a.label} current={a.id === currentApp} href={appHref(a, appsRoot)} onClick={open(a)} />
  )) : null);
  const showSwitcher = switcher !== undefined ? switcher : inApps;
  // Enter in the view's field: without results of its own the view closes, so the page's results show
  const onViewKey = (e: React.KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Enter' && !searchResults && !e.defaultPrevented && (e.target as HTMLElement).tagName === 'INPUT') cancel(); };
  const scope = searchScope !== undefined ? searchScope : name;
  const searchView = fullScreen ? createPortal(
    <div ref={view} id={searchId} className="plx-search-view" role="dialog" aria-modal="true" aria-label={tw.search} onKeyDown={onViewKey}>
      <div className="plx-search-view__bar">
        <div className="plx-search-view__field">{React.isValidElement(search) ? React.cloneElement(search as React.ReactElement<{ onAccent?: boolean }>, { onAccent: false }) : search}</div>
        <Button variant="ghost" className="plx-search-view__cancel" onClick={cancel}>{tw.cancel}</Button>
      </div>
      {scope ? <Text variant="secondary" as="p" className="plx-search-view__scope">{tw.scope.replace('{scope}', scope)}</Text> : null}
      <div className="plx-search-view__content">
        {searchSuggestions ? <div className="plx-search-view__suggestions">{searchSuggestions}</div> : null}
        {searchResults ? <div className="plx-search-view__results">{searchResults}</div> : null}
        {!searchSuggestions && !searchResults ? <Text variant="secondary" as="p">{tw.searchHint}</Text> : null}
      </div>
    </div>,
    document.body,
  ) : null;
  return (
    <SurfaceContext.Provider value={tone === 'accent' ? 'accent' : null}>
    <header ref={root} data-plx-icon-optical="24" className={cx('plx-app-header', 'plx-app-header--' + tone, compact && 'plx-app-header--compact', searching && 'is-searching', className)} {...rest}>
      <div className="plx-app-header__start">
        {back ? <AppHeader.Item icon={<Icon name={ArrowLeftIcon} />} label={back.label || 'Back'} href={back.href} onClick={back.onClick} className="plx-app-header__back" /> : null}
        {title ? <span className="plx-app-header__brand plx-app-header__title">{title}</span>
          : showSwitcher ? <AppHeader.Switcher currentApp={currentApp} appsRoot={appsRoot} onOpenApp={onOpenApp} brand={brandEl} />
          : brandHref ? <a href={brandHref} className="plx-app-header__brand">{brandEl}</a> : <span className="plx-app-header__brand">{brandEl}</span>}
        {pinned && (!Array.isArray(pinned) || pinned.length) ? <><span className="plx-app-header__divider" aria-hidden="true" /><nav aria-label={navLabel} className="plx-app-header__nav">{pinned}</nav></> : null}
      </div>
      <div className="plx-app-header__end">
        {search ? (
            <div className="plx-app-header__search-slot">
              <button ref={toggle} type="button" className="plx-app-header__item plx-app-header__search-toggle" aria-label={tw.search} aria-expanded={searching} aria-controls={searchId}
                aria-keyshortcuts="Control+K Meta+K" onClick={() => setSearching(true)}><Icon name={HdrSearchIcon} size="lg" /></button>
              {searchView}
              {searching && !narrow ? (
                <div ref={panel} id={searchId} className="plx-app-header__search" role="search" onBlur={onPanelBlur}>
                  {search}
                </div>
              ) : null}
            </div>
          ) : null}
        {action ? <div className="plx-app-header__action">{action}</div> : null}
        <div className="plx-app-header__utilities">
          {frameToggle}
          {actions}
          {account}
        </div>
      </div>
    </header>
    </SurfaceContext.Provider>
  );
}

AppHeader.Item = React.forwardRef<HTMLElement, AppHeaderItemProps>(function AppHeaderItem({ icon: iconProp, label, current = false, count, href, onClick, tooltip = true, className, ...rest }, ref) {
  // the header's icon size is the icon's own prop (lg, 24px; owner 2026-10-18), unless the icon names one
  // an icon without a size is drawn at lg; the current item's icon is filled (the item owns its state)
  const icon = stateIcon(iconProp, current, { size: 'lg' });
  const props = { ref, className: cx('plx-app-header__item', current && 'is-current', className), 'aria-label': label, 'aria-current': current ? 'page' : undefined, onClick, ...rest };
  const content = (
    <>
      {icon}
      {count ? <span className="plx-app-header__count" aria-hidden="true"><Count value={count} variant="pill" max={99} /></span> : null}
    </>
  );
  const el = href ? <a href={href} {...(props as React.ComponentPropsWithRef<'a'>)}>{content}</a> : <button type="button" {...(props as React.ComponentPropsWithRef<'button'>)}>{content}</button>;
  return tooltip ? <Tooltip content={label}>{el}</Tooltip> : el;
});

// the sign-in proxy's sign-out (Authentik's forward-auth outpost on every Plenix host): ends the session, then signs in again
const SIGN_OUT = '/outpost.goauthentik.io/sign_out';
AppHeader.Account = function AppHeaderAccount({ name: nameProp, email: emailProp, src: srcProp, placement = 'header', current, myAccount = {}, settings = {}, appSettings = {}, signOut = { href: SIGN_OUT }, density = false, extra, strings }: AppHeaderAccountProps) {
  // the account menu's words come from the catalog (appHeader.account), so an Arabic page shows them in Arabic; strings wins (#671)
  const t = useStrings('appHeader.account', strings) as Words;
  const { account } = useSession();   // who is signed in: the session, unless the application names someone
  const name = nameProp || account?.name, email = emailProp || account?.email, src = srcProp || account?.src;
  const [dens, setDens] = useDensity();
  const inPane = placement === 'pane';
  const label = fill(t.trigger, { name });
  // no tooltip: it would cover the open menu, which names itself
  const trigger = inPane
    ? <Button size="sm" variant="ghost" caret labelRow className="plx-app-header__account-row" aria-label={label}><Avatar name={name} src={src} size="2xs" />{name}</Button>
    : <AppHeader.Item icon={<Avatar name={name} src={src} size="md" />} label={label} current={!!current} tooltip={false} className="plx-app-header__item--account" />;
  const has = (o: AppHeaderLink) => !!(o.href || o.onSelect);
  const ws = typeof window !== 'undefined' ? (window as unknown as { PlenixWorkspace?: { densities(): { value: string; label: string }[] } }).PlenixWorkspace : undefined;
  const choices = ws ? ws.densities() : DENSITY_CHOICES;
  return (
    <Menu label={t.menu} placement={inPane ? 'top-start' : 'bottom-end'} trigger={trigger}>
      <MenuGroup label={email ? <>{name}<br />{email}</> : name}>
        <MenuDivider />
        {has(myAccount) ? <MenuItem icon={SettingsProfileIcon} href={myAccount.href} onSelect={myAccount.onSelect} aria-current={current === 'account' ? 'page' : undefined}>{t.myAccount}</MenuItem> : null}
        {has(settings) ? <MenuItem icon={GearIcon} href={settings.href} onSelect={settings.onSelect} aria-current={current === 'settings' ? 'page' : undefined}>{t.settings}</MenuItem> : null}
        {has(appSettings) ? <MenuItem icon={appSettings.icon || SettingsCustomizeIcon} href={appSettings.href} onSelect={appSettings.onSelect} aria-current={current === 'app-settings' ? 'page' : undefined}>{fill(t.appSettings, { app: appSettings.app || t.app })}</MenuItem> : null}
      </MenuGroup>
      {density ? <><MenuDivider /><MenuGroup label={t.density}>
        {choices.map((d) => <MenuItem key={d.value} role="menuitemradio" icon={DENSITY_ICONS[d.value] || 'density-' + d.value /* plx-icons: density-compact density-standard density-comfortable */} checked={dens === d.value} onSelect={() => setDens?.(d.value)}>{t[d.value] || d.label}</MenuItem>)}
      </MenuGroup></> : null}
      {extra ? <><MenuDivider />{extra}</> : null}
      {has(signOut) ? <><MenuDivider /><MenuItem icon={SignOutIcon} href={signOut.href} onSelect={signOut.onSelect}>{t.signOut}</MenuItem></> : null}
    </Menu>
  );
};
// the density choices when the workspace script is not on the page
// the density menu's icons (#280): a workspace's own density without one here keeps its name (density-<value>)
const DENSITY_ICONS: Record<string, IconValue> = { compact: DensityCompactIcon, standard: DensityStandardIcon, comfortable: DensityComfortableIcon };
const DENSITY_CHOICES = [{ value: 'compact', label: 'Compact' }, { value: 'standard', label: 'Standard' }, { value: 'comfortable', label: 'Comfortable' }];

// the application's action is an icon item like the header's others: its label is the tooltip and the accessible name
// (owner, batch 272: "just an icon with tooltip"); a variant the application passes is no longer used
AppHeader.Action = function AppHeaderAction({ icon, children, label, variant: _variant, ...rest }: AppHeaderActionProps) {
  return <AppHeader.Item icon={iconElement(icon)} label={label || (typeof children === 'string' ? children : undefined)} {...rest} />;
};


AppHeader.Switcher = function AppHeaderSwitcher({ currentApp, appsRoot = '', onOpenApp, apps = PLENIX_APPS, brand }: AppHeaderSwitcherProps) {
  const { pinnedApps, setPinnedApps } = useSession();
  const tw = useStrings('appHeader') as Words;
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef<HTMLDivElement>(null), panel = React.useRef<HTMLDivElement>(null), trigger = React.useRef<HTMLElement>(null);
  const id = useUid('plx-switcher');
  const close = (refocus?: boolean) => { setOpen(false); if (refocus && trigger.current) trigger.current.focus(); };
  useLayer(panel, open, { onEscape: () => close(true) });
  React.useEffect(() => {
    if (!open) return undefined;
    const out = (e: Event) => { if (wrap.current && !wrap.current.contains(e.target as Node | null)) setOpen(false); };
    document.addEventListener('mousedown', out);
    // focus leaving it (Tab past the last application) closes it too: it never stays open behind the page (batch 213)
    document.addEventListener('focusin', out);
    const first = panel.current && panel.current.querySelector('a');
    if (first) first.focus();
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('focusin', out); };
  }, [open]);
  const pinnedList = apps.filter((a) => pinnedApps.indexOf(a.id) >= 0);
  const pin = (a: PlenixApp) => setPinnedApps((prev: string[]) => (prev.indexOf(a.id) >= 0 ? prev.filter((x) => x !== a.id) : prev.concat([a.id])));
  const tile = (a: PlenixApp) => {
    const on = pinnedApps.indexOf(a.id) >= 0;
    return (
      <li key={a.id} className={cx('plx-app-switcher__tile', on && 'is-pinned', a.id === currentApp && 'is-current')}>
        <a className={cx('plx-app-switcher__open', a.id === currentApp && 'is-current')} href={appHref(a, appsRoot)} aria-current={a.id === currentApp ? 'page' : undefined}
          onClick={(e) => { if (onOpenApp && onOpenApp(a) === true) e.preventDefault(); setOpen(false); }}>
          <span className="plx-app-switcher__icon" aria-hidden="true"><Icon name={appIcon(a) as IconValue} /></span>
          <span className="plx-app-switcher__label">{a.label}</span>
        </a>
        <button type="button" className={cx('plx-app-switcher__pin', on && 'is-pinned')} aria-pressed={on} aria-label={(on ? tw.unpin : tw.pin).replace('{app}', a.label)}
          onClick={() => pin(a)}><Icon name={on ? PinFilledIcon : PinIcon} /></button>
      </li>
    );
  };
  return (
    <div ref={wrap} className={cx('plx-app-switcher', brand && 'plx-app-switcher--brand')}>
      {brand ? (
        <button ref={trigger as React.RefObject<HTMLButtonElement>} type="button" className="plx-app-header__brand plx-app-header__brand--switch" aria-haspopup="dialog" aria-expanded={open} aria-controls={id}
          aria-label={tw.switchApp.replace('{app}', typeof brand === 'string' ? brand : isBrandObject(brand) ? brandName(brand) : 'Plenix' + (currentApp && appById(currentApp) ? ' ' + appById(currentApp)!.label : ''))}
          onClick={() => setOpen(!open)}>
          {isBrandObject(brand) ? brandContent(brand, null, true) : brand}<Icon name={ChevronDownIcon} className="plx-app-header__switch-chevron" />
        </button>
      ) : (
        <AppHeader.Item ref={trigger} icon={<Icon name={AppSwitcherIcon} />} label={tw.applications} tooltip={false} aria-haspopup="dialog" aria-expanded={open} aria-controls={id}
          onClick={() => setOpen(!open)} />
      )}
      {open ? (
        <div ref={panel} id={id} role="dialog" aria-label={tw.applications} className={cx('plx-app-switcher__panel', brand && 'plx-app-switcher__panel--brand')}>
          {pinnedList.length ? (
            <section className="plx-app-switcher__pinned" aria-labelledby={id + '-pinned'}>
              <h2 id={id + '-pinned'} className="plx-app-switcher__heading">{tw.pinnedHeading}</h2>
              <ul className="plx-app-switcher__grid">{pinnedList.map(tile)}</ul>
            </section>
          ) : null}
          {apps.length > pinnedList.length ? <section aria-labelledby={id + '-all'}>
            <h2 id={id + '-all'} className="plx-app-switcher__heading">{pinnedList.length ? 'More applications' : 'All applications'}</h2>
            <ul className="plx-app-switcher__grid">{apps.filter((a) => pinnedApps.indexOf(a.id) < 0).map(tile)}</ul>
          </section> : null}
        </div>
      ) : null}
    </div>
  );
};
