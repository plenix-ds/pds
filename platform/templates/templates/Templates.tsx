/* Plenix · page templates
   Summary: Reusable page compositions from existing Platform components, preserving the layout standard.
   Usage: <ListingPage title="Records" rows={rows} columns={columns} />
   Props:
     title: page title; description: supporting text; actions: existing Platform actions; children: page content.
     header, sideNav, footer: AppShell slots; mainId: unique skip-link target when embedded.
     rows, columns: DataGrid data; items: feature cards; onOpen: card action; empty: custom empty state.
     ListingPage (the canonical full-room list, issue 522): label: the grid's name (default: the title); toolbar: a
       CommandBar above the grid; grid: more DataGrid props (selected, onRowClick, rowMenu, selectable, …); detail: the
       chosen record, in a SidePanel beside the list (detailTitle; onDetailClose runs when it is closed). The grid fills
       the room left below the toolbar and scrolls inside (mode "fill", virtual rows); no page controls unless grid.mode
       asks for them (docs/integration/data-grid.md, "The page shape").
     initialValue, sessionKey, validate, onSubmit, onSuccess, onCancel: FormFlow contract; fields: render function.
     pane, paneTitle, detailOpen, onBack: SecondaryPane master-detail contract.
     SplitWorkspace: the list and the chosen item in a SplitView (02 Page structures › Split workspace): rows and columns
       (the list as a DataGrid, which brings its own frame) or pane (framed as a ReadingPane titled paneTitle); the
       item is children, shown in a ReadingPane while detailOpen (default true), else empty (default: an EmptyState);
       actions: the reading pane's actions row; toolbar: a CommandBar above both; orientation, defaultSize, size,
       onSizeChange: SplitView's. grid (with rows and columns; issue 681): the list's DataGrid options, passed to it as given:
       onRowClick (open the row in the detail side), openKey (the open row, marked aria-current), selectable, selected and
       onSelectionChange (a plain click selects only that row; ticks pick several), rowMenu, index, and any other DataGrid
       prop; grid.label renames the list (default paneTitle). The grid keeps its own fill and scroll.
     sections: [{id,title,content}] for detail navigation; query, onQueryChange: controlled search.
     strings: visible fallback words, all overridable; error: 404, 403 or 500; onRetry: retry callback.
     auth: Auth properties; form: authentication form slot; toolbar, tools, inspector: workspace slots.
   Behavior: Templates never persist, authenticate or fetch. Applications own handlers, route/history and data. Create and edit pages require the application ToastProvider used by FormFlow.
   Notes: No colors or new layout values; existing components own responsive presentation and keyboard behavior.
*/
import React from 'react';
import { AppShell, PageContent } from '../../patterns/AppShell/AppShell.tsx';
import { SidePanel as SidePanelJs } from '../../patterns/SidePanel/SidePanel.tsx';
const SidePanel: any = SidePanelJs;
import { RecordPage as RecordPageJs } from '../../patterns/RecordPage/RecordPage.tsx';
const RecordPage: any = RecordPageJs;
import { SecondaryPane as SecondaryPaneJs } from '../../patterns/SecondaryPane/SecondaryPane.tsx';
const SecondaryPane: any = SecondaryPaneJs;
import { FeatureCard } from '../../patterns/FeatureCard/FeatureCard.tsx';
import { FormFlow } from '../../patterns/FormFlow/FormFlow.tsx';
import { Auth as AuthJs } from '../../patterns/Auth/Auth.tsx';
const Auth: any = AuthJs;
import { SearchWorkspace as SearchWorkspaceJs } from '../../patterns/SearchWorkspace/SearchWorkspace.tsx';
const SearchWorkspace: any = SearchWorkspaceJs;
import { Stack } from '../../components/Stack/Stack.tsx';
import { ContentGrid } from '../../patterns/ContentGrid/ContentGrid.tsx';
import { DataGrid } from '../../components/DataGrid/DataGrid.tsx';
import type { DataGridColumn } from '../../components/DataGrid/DataGrid.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Panel } from '../../components/Card/Card.tsx';
import { SplitView as SplitViewJs, ReadingPane as ReadingPaneJs } from '../../patterns/SplitView/SplitView.tsx';
const SplitView: any = SplitViewJs;
const ReadingPane: any = ReadingPaneJs;
import { useStrings } from '../../providers/LocaleProvider.tsx';
import FolderIcon from 'plenix-platform/icons/plenix/folder';
// the templates' words come from the catalog (templates.templates.Templates in platform/i18n), so an Arabic page shows them in
// Arabic; a template's strings prop still wins
const useWords = (strings: any): any => useStrings('templates.templates.Templates', strings);
function Frame({ page = 'workspace', title, description, actions, header, sideNav, footer, mainId, children }: any) {
  const id = React.useId();
  return <AppShell page={page} header={header} sideNav={sideNav} footer={footer} mainId={mainId || 'plx-template-' + id}>
    <PageContent><RecordPage header={title ? <RecordPage.Header title={title} description={description} actions={actions} /> : null}>{children}</RecordPage></PageContent>
  </AppShell>;
}
function Cards({ items = [], onOpen }: any) { return <ContentGrid>{items.map((item: any) => <FeatureCard key={item.id} title={item.title} description={item.description} icon={item.icon || FolderIcon} href={item.href} onOpen={!item.href && onOpen ? () => onOpen(item) : undefined} />)}</ContentGrid>; }
function NoRecords({ strings, empty }: any) { const t = useWords(strings); return empty || <EmptyState title={t.empty}>{t.emptyDescription}</EmptyState>; }
// the full-room list (issue 522, the canonical DataGrid page): the toolbar, then the grid filling the room left and
// scrolling inside (fill, virtual rows, no page controls); the chosen record's detail in a SidePanel beside it
/** @public the page frame's props, which every page template passes on (title, description, actions, the shell's regions) */
export type FrameProps = {
  page?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  header?: React.ReactNode;
  sideNav?: React.ReactNode;
  footer?: React.ReactNode;
  mainId?: string;
};
/** @public the prop type of ListingPage (ADR 0011) */
export type ListingPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  rows?: Record<string, unknown>[];
  columns?: DataGridColumn[];
  empty?: React.ReactNode;
  strings?: Record<string, string>;
  children?: React.ReactNode;
  label?: unknown;
  toolbar?: React.ReactNode;
  grid?: Record<string, unknown>;
  detail?: React.ReactNode;
  detailTitle?: React.ReactNode;
  onDetailClose?: () => void;
};
export function ListingPage({ rows = [], columns = [], empty, strings, children, label, toolbar, grid, detail, detailTitle, onDetailClose, ...rest }: ListingPageProps) {
  const id = React.useId();
  const t = useWords(strings);
  const list = rows.length ? <DataGrid label={label || rest.title || t.pane} data={rows} columns={columns} {...grid} /> : <NoRecords empty={empty} strings={strings} />;
  if (!detail) return <Frame {...rest}>{children}{toolbar}{list}</Frame>;
  return <AppShell page={rest.page || 'workspace'} header={rest.header} sideNav={rest.sideNav} footer={rest.footer} mainId={rest.mainId || 'plx-template-' + id}>
    <div className="plx-page-panes">
      <PageContent><RecordPage header={rest.title ? <RecordPage.Header title={rest.title} description={rest.description} actions={rest.actions} /> : null}>{children}{toolbar}{list}</RecordPage></PageContent>
      <SidePanel title={detailTitle || t.detail} onOpenChange={(open: any) => { if (!open && onDetailClose) onDetailClose(); }}>{detail}</SidePanel>
    </div>
  </AppShell>;
}
/** @public the prop type of ContentManagementPage (ADR 0011) */
export type ContentManagementPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  items?: unknown[];
  onOpen?: (item: unknown) => void;
  empty?: React.ReactNode;
  strings?: Record<string, string>;
  children?: React.ReactNode;
};
export function ContentManagementPage({ items = [], onOpen, empty, strings, children, ...rest }: ContentManagementPageProps) { return <Frame {...rest}>{children}{items.length ? <Cards items={items} onOpen={onOpen} /> : <NoRecords empty={empty} strings={strings} />}</Frame>; }
/** @public the prop type of LandingPage (ADR 0011) */
export type LandingPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  items?: unknown[];
  onOpen?: (item: unknown) => void;
  children?: React.ReactNode;
};
export function LandingPage({ items = [], onOpen, children, ...rest }: LandingPageProps) { return <Frame {...rest}><Stack gap="lg">{children}<Cards items={items} onOpen={onOpen} /></Stack></Frame>; }
/** @public the prop type of HomePage (ADR 0011) */
export type HomePageProps = LandingPageProps;
export function HomePage(props: HomePageProps) { return <LandingPage {...props} page="dashboard" />; }
/** @public the prop type of CreatePage and EditPage (ADR 0011) */
export type FormPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  fields?: unknown[];
  initialValue?: Record<string, unknown>;
  sessionKey?: string;
  validate?: (values: Record<string, unknown>) => unknown;
  onSubmit?: (values: Record<string, unknown>) => unknown;
  onSuccess?: (result?: unknown) => void;
  onCancel?: () => void;
  strings?: Record<string, string>;
  children?: React.ReactNode;
};
function FormPage(props: FormPageProps & { mode: 'create' | 'edit' }) {
  const { mode, fields, initialValue, sessionKey, validate, onSubmit, onSuccess, onCancel, strings, title, children, ...rest } = props as any;
  return <Frame {...rest} page="form" title={title}><FormFlow mode={mode} title={title} surface="page" initialValue={initialValue} sessionKey={sessionKey} validate={validate} onSubmit={onSubmit} onSuccess={onSuccess} onCancel={onCancel} strings={strings}>{fields || children}</FormFlow></Frame>;
}
/** @public the prop type of CreatePage (ADR 0011) */
export type CreatePageProps = FormPageProps;
export function CreatePage(props: CreatePageProps) { return <FormPage {...props} mode="create" />; }
/** @public the prop type of EditPage (ADR 0011) */
export type EditPageProps = FormPageProps;
export function EditPage(props: EditPageProps) { return <FormPage {...props} mode="edit" />; }
/** @public the prop type of MasterDetailPage (ADR 0011) */
export type MasterDetailPageProps = {
  pane?: React.ReactNode;
  paneTitle?: React.ReactNode;
  detailOpen?: boolean;
  onBack?: () => void;
  strings?: Record<string, string>;
  children?: React.ReactNode;
  header?: React.ReactNode;
  sideNav?: React.ReactNode;
  footer?: React.ReactNode;
  mainId?: string;
};
export function MasterDetailPage({ pane, paneTitle, detailOpen = false, onBack, strings, children, header, sideNav, footer, mainId }: MasterDetailPageProps) {
  const t = useWords(strings), id = React.useId();
  return <AppShell page="master-detail" header={header} sideNav={sideNav} footer={footer} mainId={mainId || 'plx-template-' + id}><div className="plx-page-panes"><SecondaryPane title={paneTitle || t.pane} detailOpen={detailOpen} onBack={onBack}>{pane}</SecondaryPane><PageContent>{children}</PageContent></div></AppShell>;
}
/** @public the prop type of SplitWorkspace (ADR 0011); R is the list's row type, passed to its DataGrid (#923) */
export type SplitWorkspaceProps<R = Record<string, unknown>> = {
  pane?: React.ReactNode;
  paneTitle?: React.ReactNode;
  rows?: R[];
  columns?: DataGridColumn<R>[];
  grid?: Record<string, unknown>;
  detailOpen?: boolean;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  empty?: React.ReactNode;
  orientation?: unknown;
  defaultSize?: unknown;
  size?: unknown;
  onSizeChange?: (size: number) => void;
  strings?: Record<string, string>;
  children?: React.ReactNode;
  header?: React.ReactNode;
  sideNav?: React.ReactNode;
  footer?: React.ReactNode;
  mainId?: string;
};
export function SplitWorkspace<R = Record<string, unknown>>({ pane, paneTitle, rows, columns, grid, detailOpen = true, title, actions, toolbar, empty, orientation, defaultSize, size, onSizeChange, strings, children, header, sideNav, footer, mainId }: SplitWorkspaceProps<R>) {
  const t = useWords(strings), id = React.useId(), list = paneTitle || t.pane;
  // grid: the list's own DataGrid options (issue 681), spread last, so grid.label may rename the list; the fill and scroll stay the grid's defaults
  const first = columns ? <DataGrid<R> label={list} data={rows || []} columns={columns} {...grid} /> : <ReadingPane label={list}>{pane}</ReadingPane>;
  const second = <ReadingPane label={title || t.detail} actions={detailOpen ? actions : null} empty={empty || <EmptyState title={t.noSelection}>{t.noSelectionDescription}</EmptyState>}>{detailOpen ? children : null}</ReadingPane>;
  return <AppShell page="master-detail" header={header} sideNav={sideNav} footer={footer} mainId={mainId || 'plx-template-' + id}><PageContent>{toolbar}<SplitView label={title || list} firstLabel={list} orientation={orientation} defaultSize={defaultSize} size={size} onSizeChange={onSizeChange} first={first} second={second} /></PageContent></AppShell>;
}
/** @public the prop type of SinglePaneWorkspace (ADR 0011) */
export type SinglePaneWorkspaceProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
};
export function SinglePaneWorkspace({ toolbar, children, ...rest }: SinglePaneWorkspaceProps) { return <Frame {...rest}><Stack gap="md">{toolbar}{children}</Stack></Frame>; }
/** @public the prop type of FullScreenWorkspace (ADR 0011) */
export type FullScreenWorkspaceProps = {
  tools?: React.ReactNode;
  inspector?: React.ReactNode;
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
  strings?: Record<string, string>;
  mainId?: string;
};
export function FullScreenWorkspace({ tools, inspector, toolbar, children, strings, mainId }: FullScreenWorkspaceProps) {
  const t = useWords(strings), id = React.useId();
  return <AppShell page="editor" mainId={mainId || 'plx-template-' + id}><div className="plx-page-panes">
    {tools ? <SecondaryPane title={t.tools} width="sm">{tools}</SecondaryPane> : null}
    <PageContent><Stack gap="md">{toolbar}{children}</Stack></PageContent>
    {inspector ? <SecondaryPane title={t.inspector} side="end">{inspector}</SecondaryPane> : null}
  </div></AppShell>;
}
/** @public the prop type of FullScreenExperience (ADR 0011) */
export type FullScreenExperienceProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  children?: React.ReactNode;
};
export function FullScreenExperience({ children, ...rest }: FullScreenExperienceProps) { return <Frame {...rest} page="editor">{children}</Frame>; }
/** @public the prop type of DetailPage (ADR 0011) */
export type DetailPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  sections?: unknown[];
  strings?: Record<string, string>;
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
};
export function DetailPage({ sections = [], strings, children, title, description, actions, ...rest }: DetailPageProps) {
  const t = useWords(strings);
  return <MasterDetailPage {...rest} paneTitle={t.sections} detailOpen pane={<Stack gap="sm">{sections.map((s: any) => <Link key={s.id} href={'#' + s.id}>{s.title}</Link>)}</Stack>}><Stack gap="lg"><RecordPage.Header title={title} description={description} actions={actions} />{children}{sections.map((s: any) => <section key={s.id} id={s.id} aria-label={s.title}><Panel title={s.title}>{s.content}</Panel></section>)}</Stack></MasterDetailPage>;
}
/** @public the prop type of SearchResultsPage (ADR 0011) */
export type SearchResultsPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  query?: string;
  onQueryChange?: (query: string) => void;
  rows?: Record<string, unknown>[];
  columns?: DataGridColumn[];
  strings?: Record<string, string>;
  children?: React.ReactNode;
  title?: React.ReactNode;
};
export function SearchResultsPage({ query = '', onQueryChange, rows = [], columns = [], strings, children, title, ...rest }: SearchResultsPageProps) {
  const t = useWords(strings);
  return <Frame {...rest}><SearchWorkspace title={title || t.search} query={query} onQueryChange={onQueryChange} count={rows.length}>{children}{rows.length ? <DataGrid label="" data={rows} columns={columns as any} /> : <NoRecords strings={strings} />}</SearchWorkspace></Frame>;
}
/** @public the prop type of AuthenticationPage (ADR 0011) */
export type AuthenticationPageProps = {
  auth?: Record<string, unknown>;
  form?: React.ReactNode;
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  mainId?: string;
};
export function AuthenticationPage({ auth, form, children, header, footer, mainId }: AuthenticationPageProps) { return <Frame header={header} footer={footer} mainId={mainId} page="form"><Auth {...auth}>{form || children}</Auth></Frame>; }
/** @public the prop type of ErrorPage (ADR 0011) */
export type ErrorPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  error?: number;
  onRetry?: () => void;
  homeHref?: string;
  strings?: Record<string, string>;
};
export function ErrorPage({ error = 404, onRetry, homeHref, strings, ...rest }: ErrorPageProps) {
  const t = useWords(strings), errors: Record<number, string[]> = { 404: ['Page not found', 'Check the address or return home.'], 403: ['Access denied', 'Ask the owner for access to this page.'], 500: ['Something went wrong', 'Try again or return home.'] }, copy = errors[error] || errors[500];
  return <Frame {...rest} page="detail"><EmptyState kind={error === 404 ? 'not-found' : error === 403 ? 'permission-denied' : undefined} tone={error === 500 ? 'error' : undefined} title={t.title || copy[0]} action={<Stack gap="sm">{onRetry ? <Button onClick={onRetry as () => void}>{t.retry}</Button> : null}{homeHref ? <Link href={homeHref}>{t.home}</Link> : null}</Stack>}>{t.description || copy[1]}</EmptyState></Frame>;
}
