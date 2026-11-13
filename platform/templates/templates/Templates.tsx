/* Plenix · page templates
   Summary: Reusable page compositions from existing Platform components, preserving the layout standard.
   Usage: <ListingPage title="Records" rows={rows} columns={columns} />
   Props:
     title: page title; description: supporting text; actions: existing Platform actions; children: page content.
     header, sideNav, footer: AppShell slots; mainId: unique skip-link target when embedded.
     rows, columns: DataGrid data; items: feature cards; onOpen: card action; empty: custom empty state.
     ListingPage (the canonical full-room list, issue 522): label: the grid's name (default: the title); toolbar: a
       CommandBar above the grid; loading: true while the rows first load (onLoadingCancel: a Cancel button from about 10s), a centred spinner with a label in the grid's room (no Skeleton); grid: more DataGrid props (selected, onRowClick, rowMenu, selectable, …); detail: the
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
export type { FrameProps } from './Frame.tsx';
export { ListingPage } from './ListingPage.tsx';
export type { ListingPageProps } from './ListingPage.tsx';
export { ContentManagementPage } from './ContentManagementPage.tsx';
export type { ContentManagementPageProps } from './ContentManagementPage.tsx';
export { LandingPage } from './LandingPage.tsx';
export type { LandingPageProps } from './LandingPage.tsx';
export { HomePage } from './HomePage.tsx';
export type { HomePageProps } from './HomePage.tsx';
export { CreatePage } from './CreatePage.tsx';
export type { CreatePageProps } from './CreatePage.tsx';
export { EditPage } from './EditPage.tsx';
export type { EditPageProps } from './EditPage.tsx';
export { MasterDetailPage } from './MasterDetailPage.tsx';
export type { MasterDetailPageProps } from './MasterDetailPage.tsx';
export { SplitWorkspace } from './SplitWorkspace.tsx';
export type { SplitWorkspaceProps } from './SplitWorkspace.tsx';
export { SinglePaneWorkspace } from './SinglePaneWorkspace.tsx';
export type { SinglePaneWorkspaceProps } from './SinglePaneWorkspace.tsx';
export { FullScreenWorkspace } from './FullScreenWorkspace.tsx';
export type { FullScreenWorkspaceProps } from './FullScreenWorkspace.tsx';
export { FullScreenExperience } from './FullScreenExperience.tsx';
export type { FullScreenExperienceProps } from './FullScreenExperience.tsx';
export { DetailPage } from './DetailPage.tsx';
export type { DetailPageProps } from './DetailPage.tsx';
export { SearchResultsPage } from './SearchResultsPage.tsx';
export type { SearchResultsPageProps } from './SearchResultsPage.tsx';
export { AuthenticationPage } from './AuthenticationPage.tsx';
export type { AuthenticationPageProps } from './AuthenticationPage.tsx';
export { ErrorPage } from './ErrorPage.tsx';
export type { ErrorPageProps } from './ErrorPage.tsx';
export type { FormPageProps } from './FormPage.tsx';
