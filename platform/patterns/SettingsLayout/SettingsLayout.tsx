/* Plenix · SettingsLayout, SettingsSection, SettingsRow
   Summary: Navigation beside the settings form. SettingsSection is a card: a titled group of rows, static or collapsible;
     SettingsRow puts the label and description at the start and the control at the end.
   Usage:
     <SettingsLayout nav={<NavList…/>}>
       <SettingsSection title="Regional" description="…">
         <SettingsRow label="Date format" description="…">{control}</SettingsRow>
       </SettingsSection>
       <SettingsSection title="Advanced" collapsible defaultExpanded={false}>…</SettingsSection>
     </SettingsLayout>
   Props:
     nav: the navigation (a NavList), drawn in a docked SecondaryPane beside the content (ADR 0057): flush against the main
       navigation, full height, on the page surface, titled, collapsible and resizable (240px to start; remembered per page)
     navTitle: the pane's title (default "Settings", settingsLayout.navTitle)
     pane: more props for the SecondaryPane (detailOpen, onBack, back, label, a controlled size or collapsed): with
       detailOpen and onBack, Narrow (under 600px) is a list-detail with "Back to Settings"; without them the navigation
       stacks above the content at Narrow, so nothing scrolls sideways (WCAG 1.4.10)
     strings: { navTitle: "Settings" }
     className: more classes
     children: the settings sections
     SettingsSection.title: the section's heading (an h2 by default); it names the section landmark
     SettingsSection.description: a paragraph under the title
     SettingsSection.collapsible: true makes the header a toggle that shows and hides the rows (default false: static)
     SettingsSection.defaultExpanded: whether a collapsible section starts open when nothing is remembered (default true)
     SettingsSection.expanded: the open state when the parent controls it; onToggle(next) then runs on each press
     SettingsSection.onToggle(next): runs when a collapsible section opens or closes
     SettingsSection.stateKey: the name its open state is remembered under on this page (default the title); give one
       when two sections of the page share a title
     SettingsSection.remember: false keeps the open state for this visit only (default true)
     SettingsSection.actions: the form's buttons, drawn in an ActionBar under the rows (on the right, kept in view at the
       bottom while the page scrolls): the primary action last
     SettingsSection.headingLevel: the title's heading level (default 2); its size follows the level, as SectionHeading's
       (level 2 13px, level 3 11px, level 4 10px)
     SettingsSection.strings: the words it announces, for other languages: { section: "section" } (the actions' name)
     SettingsSection.className: more classes
     SettingsSection.children: the rows
     SettingsRow.label: the row's label, at the start
     SettingsRow.description: a line under the label
     SettingsRow.htmlFor: the control's id, so the label is a label element for it
     SettingsRow.className: more classes
     SettingsRow.children: the control, at the end
   Behavior:
     Every section is a card (owner, 2026-10-13: "all the settings pages to have the cards view"): static, or collapsible.
     A collapsible section's whole header is one button inside the heading (the disclosure pattern): Enter or Space, or a
       click anywhere on the title row, opens and closes it; aria-expanded tells its state and aria-controls names the
       body. Its open state is remembered per page and section in the page's view state (useViewState,
       plenix.<page>-settings.view), so the page opens as the person left it; a parent that controls it (expanded) keeps
       it instead.
     Each row is divided from the next.
     At Narrow without pane.detailOpen the navigation stacks above the content, a full-width block with a divider below.
     The navigation pane is the case pane's look; its width and folded state are remembered per page in the page's view state.
     It is a settings page: inside an AppShell it claims the page kind "settings", so the layout standard lays it out
       (contained: one centered column at the form width).
   Notes:
     Fields (layout="inline" or "row") can be rows too.
     Give the control the row's label as its own accessible name, or htmlFor with the control's id.
     A section with no title is a static card (a collapsible one needs a title to press).
*/
import React from 'react';
import { useAppLayout, useMedia, below } from '../AppShell/AppShell.tsx';
import { cx } from '../../utils/cx.ts';
import { dataWhenText } from '../../utils/dataText.tsx';
import { useUid } from '../../utils/layer.ts';
import { useViewState, readView } from '../../providers/ScreenLocation.ts';
import { Icon } from '../../components/Icon/Icon.tsx';
import { PagePanes, SecondaryPane } from '../SecondaryPane/SecondaryPane.tsx';
import type { SecondaryPaneProps } from '../SecondaryPane/SecondaryPane.tsx';
import { ActionBar } from '../ActionBar/ActionBar.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';


/** @public the prop type of SettingsLayout (ADR 0011) */
export type SettingsLayoutProps = {
  nav?: React.ReactNode;
  /** the navigation pane's title (default "Settings") */
  navTitle?: React.ReactNode;
  /** more props for the navigation pane */
  pane?: Omit<SecondaryPaneProps, 'children' | 'title'>;
  strings?: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
};
export function SettingsLayout(props: SettingsLayoutProps) {
  const { nav, navTitle, pane, strings, className, children } = props as any;
  const t: any = useStrings('settingsLayout', strings);
  // a settings page: the layout standard (providers/pageLayouts.js) lays it out, through the shell (batch 218)
  const shell = useAppLayout();
  const claim = shell && shell.claimPage;
  React.useEffect(() => (claim ? claim('settings') : undefined), [claim]);
  // the pane's width and folded state are kept in the page's view state (beside the sections')
  const page = React.useMemo(pageOf, []);
  const [view, update] = useViewState(page);
  const kept: any = view || {};
  // Narrow without the app's list-detail (pane.detailOpen): the navigation stacks above the content, whole and fixed (no fold, no resize)
  const narrow = useMedia(below('--plx-sys-shell-phone-below'));
  const stacked = !!narrow && !(pane && pane.detailOpen !== undefined);
  return (
    <div className={cx('plx-settings', className)}>
      <PagePanes className={cx('plx-settings__panes', stacked && 'plx-settings__panes--stacked')}>
        {nav ? (
          <SecondaryPane title={navTitle !== undefined ? navTitle : t.navTitle} side="start" width="md" collapsible resizable
            size={typeof kept.paneSize === 'number' ? kept.paneSize : undefined} onSizeChange={(px: number) => update(() => ({ paneSize: px }))}
            collapsed={typeof kept.paneCollapsed === 'boolean' ? kept.paneCollapsed : undefined} onCollapsedChange={(next: boolean) => update(() => ({ paneCollapsed: next }))}
            {...pane} {...(stacked ? { collapsible: false, resizable: false } : null)}
            className={cx('plx-settings__pane', stacked && 'plx-settings__pane--stacked', pane && pane.className)}>{nav}</SecondaryPane>
        ) : null}
        <div className="plx-settings__content">{children}</div>
      </PagePanes>
    </div>
  );
}

// the view state a page's section states are kept in: its file ("settings-system-settings"), or its folder for an index
// page ("settings-settings")
function pageOf() {
  if (typeof location === 'undefined') return 'page-settings';
  const parts = location.pathname.split('/').filter(Boolean);
  let last = parts.pop() || 'page';
  if (/^index\.html?$/.test(last)) last = parts.pop() || 'page';
  return last.replace(/\.html?$/, '') + '-settings';
}

// the open state of a collapsible section: controlled (expanded), or its own, remembered in the page's view state
function useOpen(collapsible: any, defaultExpanded: any, expanded: any, onToggle: any, key: any, remember: any) {
  const page = React.useMemo(pageOf, []);
  const [view, update] = useViewState(page);
  const kept = remember && key && view.sections ? (view.sections as any)[key] : undefined;
  const [own, setOwn] = React.useState(typeof kept === 'boolean' ? kept : defaultExpanded);
  const open = !collapsible || (expanded === undefined ? own : expanded);
  const toggle = () => {
    const next = !open;
    if (expanded === undefined) setOwn(next);
    // the stored map is read afresh, so the sections of one page never overwrite each other's state
    if (remember && key) update(() => ({ sections: Object.assign({}, readView(page).sections, { [key]: next }) }));
    if (onToggle) onToggle(next);
  };
  return [open, toggle];
}

/** @public the prop type of SettingsSection (ADR 0011) */
export type SettingsSectionProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onToggle?(next: boolean): void;
  stateKey?: string;
  remember?: boolean;
  /** the form's buttons, in an ActionBar under the rows */
  actions?: React.ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  strings?: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
};
export function SettingsSection(props: SettingsSectionProps) {
  const { title, description, collapsible = false, defaultExpanded = true, expanded, onToggle, stateKey, remember = true,
  actions, headingLevel = 2, strings, className, children } = props as any;
  const t: any = useStrings('settingsLayout.section', strings);
  const id = useUid('plx-set');
  const canCollapse = !!(collapsible && title);
  const [open, toggle] = useOpen(canCollapse, defaultExpanded, expanded, onToggle, stateKey || (typeof title === 'string' ? title : null), remember);
  const H: any = 'h' + headingLevel;
  const descId = description ? id + '-d' : undefined;
  return (
    <section aria-labelledby={title ? id : undefined} className={cx('plx-settings__section', canCollapse && 'plx-settings__section--collapsible', canCollapse && !open && 'is-collapsed', className)}>
      {title || description ? (
        <div className="plx-settings__section-header">
          {title ? (
            <H className={cx('plx-settings__section-title', headingLevel !== 2 && 'plx-settings__section-title--level-' + headingLevel)}>
              {canCollapse ? (
                <button type="button" id={id} className="plx-settings__section-toggle" aria-expanded={open} aria-controls={id + '-body'} aria-describedby={descId} onClick={toggle}>
                  <span className="plx-settings__section-label">{title}</span>
                  <span className="plx-settings__section-chevron"><Icon name={ChevronDownIcon} /></span>
                </button>
              ) : <span id={id}>{title}</span>}
            </H>
          ) : null}
          {description ? <p id={descId} className="plx-settings__section-description">{dataWhenText(description)}</p> : null}
        </div>
      ) : null}
      <div id={id + '-body'} hidden={!open} className="plx-settings__section-body">
        <div className="plx-settings__rows">{children}</div>
        {actions ? <ActionBar label={(typeof title === 'string' ? title : t.section) + ': actions'}>{actions}</ActionBar> : null}
      </div>
    </section>
  );
}

/** @public the prop type of SettingsRow (ADR 0011) */
export type SettingsRowProps = { label: React.ReactNode; description?: React.ReactNode; htmlFor?: string; className?: string; children?: React.ReactNode };
export function SettingsRow(props: SettingsRowProps) {
  const { label, description, htmlFor, className, children } = props as any;
  return (
    <div className={cx('plx-settings__row', className)}>
      <div className="plx-settings__row-text">
        {htmlFor ? <label htmlFor={htmlFor} className="plx-settings__row-label">{label}</label> : <div className="plx-settings__row-label">{label}</div>}
        {description ? <div className="plx-settings__row-description">{dataWhenText(description)}</div> : null}
      </div>
      <div className="plx-settings__row-control">{children}</div>
    </div>
  );
}
