# St. John site: component-to-page map

The St. John test site must use every Platform name that draws something; this page lists the screens that use each one (9 names are not used yet, marked below).

## How to read it
- Each row is a required Platform name and the screens (files in the site's `site/screens/`) that use it.
- The map is generated; the command is the source of truth, this page is a snapshot.
- Regenerate with `node tests/site-coverage.test.js --list` (it reads files only and opens no browser).
- A row marked **not used yet** makes `site-coverage` fail until a screen uses the name (issue #107).

## Map

| Name | Screens |
|---|---|
| `Badge` | account, announcement-edit, calendar, dashboard, document, documents, event, families, family, giving, members, messages, photo, planning, search, settings, visit |
| `VisuallyHidden` | announcement-edit |
| `Isolate` | family |
| `AnswerLines` | **not used yet** |
| `PageBreak` | **not used yet** |
| `VoteTally` | ministry |
| `Count` | ministries, ministry |
| `Metric` | giving |
| `MetricCard` | dashboard |
| `ProgressBar` | ministry, servants |
| `DateBadge` | calendar, event |
| `EventChip` | calendar |
| `RadioTiles` | event |
| `StatusDot` | dashboard |
| `Tag` | member-new, member, members |
| `Chip` | directory |
| `TagList` | directory, member-new, members |
| `TagInput` | member-new |
| `DataPill` | directory |
| `Kbd` | readings |
| `Avatar` | member, messages |
| `Divider` | dashboard |
| `Stack` | account, announcement-edit, announcements, assistant, bookstore, calendar, dashboard, directory, document, documents, event, families, family, gifts, give, giving, media, member-new, member, messages, ministries, ministry, photo, planning, readings, reports, search, servants, settings, sign-in, visit, welcome |
| `Inline` | announcement-edit, assistant, bookstore, calendar, dashboard, document, documents, event, families, family, gifts, giving, media, member, messages, ministries, ministry, photo, planning, readings, reports, search, servants, settings, sign-in, visit, welcome |
| `Text` | account, announcement-edit, assistant, bookstore, calendar, dashboard, directory, document, documents, event, families, family, gifts, give, giving, media, member-new, member, messages, ministries, ministry, photo, planning, readings, reports, search, servants, settings, sign-in, visit, welcome |
| `Thumbnail` | media |
| `Notice` | account, announcements, give, giving |
| `BrandMark` | visit |
| `ColorSwatch` | settings |
| `ColorPicker` | settings |
| `DropZone` | documents |
| `Preview` | media |
| `Fieldset` | families, member-new |
| `Columns` | announcement-edit, announcements, assistant, dashboard, documents, event, give, giving, media, member, messages, ministries, ministry, reports, servants |
| `Breadcrumbs` | family, member |
| `List` | dashboard, ministry, visit, welcome |
| `CodeBlock` | announcement-edit |
| `SectionHeading` | dashboard, document, documents, media |
| `CollapsibleSection` | ministry |
| `ShowMore` | ministry |
| `Skeleton` | documents |
| `Spinner` | documents |
| `Chat` | messages |
| `EmptyState` | calendar, event, family, media, member-edit, member, ministry |
| `Pagination` | directory |
| `Rating` | event |
| `Icon` | dashboard, media |
| `Button` | account, announcement-edit, announcements, assistant, bookstore, calendar, dashboard, directory, document, documents, event, families, family, give, giving, media, member-edit, member-new, member, messages, ministry, photo, planning, readings, search, servants, settings, sign-in, visit, welcome, site |
| `ButtonGroup` | dashboard |
| `RowButton` | dashboard, readings, servants |
| `SegmentedControl` | announcements, calendar, ministries |
| `Input` | account, announcement-edit, event, family, giving, member-edit, member-new, member, photo, settings |
| `Textarea` | event, member-new, planning |
| `Select` | event, gifts, give, giving, member-edit, member-new, ministries, servants, settings |
| `Field` | account, announcement-edit, documents, event, family, gifts, give, giving, member-edit, member-new, member, ministries, photo, planning, servants, settings, sign-in |
| `Checkbox` | dashboard, families, give, member-new |
| `Radio` | member-new |
| `RadioGroup` | member-new, settings |
| `ChoiceList` | member-new |
| `Switch` | member-edit, member-new, settings |
| `Combobox` | member-edit, member-new |
| `SearchField` | families, media, search, site |
| `Tooltip` | ministry |
| `Slider` | event |
| `Toolbar` | readings |
| `Menu` | documents |
| `MenuItem` | documents, giving, member |
| `MenuDivider` | documents |
| `MenuGroup` | documents |
| `Dialog` | announcement-edit, event, give, giving, member |
| `ConfirmDialog` | settings |
| `Drawer` | directory, gifts |
| `Sheet` | calendar |
| `ToastProvider` | main |
| `useToast` | account, bookstore, dashboard, directory, document, documents, event, give, giving, member-new, member, members, ministry, photo, planning, readings, servants, settings, sign-in, welcome |
| `Tabs` | assistant, bookstore, give, member |
| `Panel` | announcement-edit, announcements, assistant, bookstore, dashboard, directory, documents, event, families, member, messages, ministries, ministry, planning, reports, search, servants, visit, welcome |
| `Card` | ministries |
| `MediaCard` | readings |
| `DataGrid` | directory, families, gifts, giving, members |
| `Table` | family, member |
| `ActionBar` | servants |
| `NavList` | account, families, settings, site |
| `Tree` | family |
| `MediaViewer` | media |
| `AppHeader` | site |
| `FilterBar` | directory |
| `SearchWorkspace` | search |
| `DataToolbar` | directory |
| `BulkActions` | directory |
| `SelectionSummary` | families |
| `ContentGrid` | bookstore, ministries, readings |
| `PropertyList` | directory, gifts, member |
| `TableSettings` | **not used yet** |
| `PrintDocument` | **not used yet** |
| `RecordPage` | assistant, event, families, member, members, messages, ministries, ministry, planning, servants |
| `EntityHeader` | documents, media, member |
| `ActivityList` | messages |
| `NotificationList` | announcements, dashboard |
| `SettingsLayout` | account, settings |
| `SettingsSection` | account, settings |
| `SettingsRow` | account, settings |
| `ToolRail` | site |
| `AppShell` | site |
| `PageContent` | assistant, bookstore, calendar, document, documents, event, family, gifts, give, giving, media, member-edit, member, members, messages, ministries, ministry, planning, reports, search, servants, welcome |
| `useAppLayout` | dashboard |
| `SideNavPortal` | account |
| `SidePanel` | document |
| `SecondaryPane` | member |
| `NavPane` | account, site |
| `StatusBar` | site |
| `ThemeProvider` | settings |
| `useTheme` | settings |
| `SessionProvider` | account |
| `useSession` | account |
| `useDensity` | settings |
| `useScreenLocation` | main |
| `useViewState` | member |
| `useUnsavedGuard` | member-edit |
| `TimeGrid` | calendar |
| `WidgetGrid` | dashboard |
| `LiveRegion` | announcement-edit |
| `useClipboard` | announcement-edit |
| `useHotkey` | readings, site |
| `useHotkeyList` | settings |
| `Link` | announcement-edit, announcements, ministry, sign-in, visit |
| `Code` | announcement-edit |
| `Blockquote` | readings |
| `RichText` | announcement-edit |
| `DirectionProvider` | main |
| `ReadOnly` | settings |
| `ReadOnlyProvider` | settings |
| `IconTile` | ministry |
| `Pictogram` | ministries |
| `Show` | visit |
| `Hide` | dashboard, visit |
| `Center` | visit |
| `Bleed` | visit |
| `Sticky` | document |
| `Illustration` | media |
| `Image` | media, photo |
| `Figure` | media |
| `ThemeZone` | settings |
| `Barcode` | member |
| `useRetry` | dashboard |
| `RetryNotice` | dashboard |
| `AvatarGroup` | families |
| `Persona` | family, member |
| `EntityTitle` | **not used yet** |
| `ProgressCircle` | document |
| `QRCode` | member |
| `VersionLabel` | document |
| `StatusIcon` | directory, member |
| `Banner` | announcements |
| `Scrim` | settings |
| `LoadingOverlay` | documents |
| `Time` | document, media, photo |
| `useUndo` | servants |
| `Popover` | ministry |
| `ContextualHelp` | ministry |
| `TeachingBubble` | welcome |
| `Popconfirm` | member |
| `MegaMenu` | visit |
| `CopyButton` | announcement-edit |
| `Details` | ministry |
| `FloatingActionButton` | dashboard |
| `SplitButton` | giving |
| `Spotlight` | event |
| `MenuRadioGroup` | documents |
| `MenuSub` | documents |
| `ContextMenu` | member |
| `usePrint` | giving |
| `CommandMenu` | dashboard |
| `CommandPalette` | site |
| `DownloadButton` | giving |
| `BackToTop` | visit |
| `PromptDialog` | settings |
| `InputGroup` | member-new |
| `NumberInput` | give, giving, member-new |
| `ErrorSummary` | member-new |
| `FileInput` | documents, giving |
| `CodeEditor` | settings |
| `Form` | member |
| `FormSection` | member-edit, member-new |
| `FormActions` | member |
| `OtpInput` | sign-in |
| `useSearchHistory` | search |
| `InlineEdit` | member |
| `RichTextEditor` | announcement-edit |
| `Calendar` | calendar |
| `DatePicker` | member-new |
| `CountrySelect` | member-new |
| `ProgressSteps` | event |
| `MillerColumns` | ministries |
| `Cascader` | ministries |
| `EntityPicker` | search |
| `TimePicker` | event |
| `RelativeDateInput` | event |
| `LoadMore` | directory |
| `ImageUpload` | photo |
| `ImageCrop` | photo |
| `AvatarUpload` | member |
| `ChartFrame` | reports |
| `TimeZoneSelect` | settings |
| `TreeSelect` | ministries |
| `TransferList` | servants |
| `BottomSheetNav` | visit |
| `CommandBar` | members |
| `CommandBarButton` | members |
| `CommandBarSearch` | members |
| `useCommandBar` | members |
| `FilterPanel` | members |
| `SortPanel` | members |
| `GroupPanel` | members |
| `ColumnsMenu` | members |
| `ManageColumnsDialog` | members |
| `ViewMenu` | members |
| `QuickFilter` | members |
| `useCollectionView` | members |
| `Axis` | reports |
| `GridLines` | reports |
| `ChartLegend` | reports |
| `ChartTooltip` | reports |
| `DataLabel` | reports |
| `ReferenceLine` | reports |
| `ChartAnnotation` | reports |
| `FeatureCard` | ministries |
| `UserCard` | families |
| `VirtualList` | directory, gifts |
| `Carousel` | media |
| `PeopleGroup` | families |
| `PermissionSummary` | settings |
| `QueryBuilder` | search |
| `RoleLabel` | family, member |
| `SearchResult` | search |
| `SearchResultGroup` | search |
| `Timeline` | member, planning |
| `ResourceList` | directory |
| `ChartBrush` | reports |
| `LineChart` | reports |
| `AreaChart` | reports |
| `Gauge` | reports |
| `HeatMap` | reports |
| `WaterfallChart` | giving |
| `WordCloud` | reports |
| `NetworkGraph` | family |
| `Diagram` | ministries |
| `BarChart` | reports |
| `ComboChart` | giving |
| `PieChart` | reports |
| `BulletChart` | giving |
| `BoxPlot` | reports |
| `RadarChart` | reports |
| `SankeyDiagram` | reports |
| `TimelineChart` | planning |
| `ComparisonView` | reports |
| `Sparkline` | reports |
| `LollipopChart` | reports |
| `ScatterChart` | reports |
| `FunnelChart` | reports |
| `Treemap` | ministries |
| `GanttChart` | planning |
| `GeoMap` | visit |
| `DragHandle` | ministry |
| `SortableList` | ministry |
| `Resizable` | planning |
| `PanelSplitter` | planning |
| `RenameAction` | documents |
| `WorkflowStatus` | servants |
| `ReviewFlow` | announcement-edit, announcements |
| `ReviewQueue` | servants |
| `DeleteFlow` | member, members |
| `DuplicateAction` | member |
| `Publish` | announcement-edit, announcements |
| `AssignControl` | servants |
| `Wizard` | event |
| `WizardDialog` | member-new |
| `FormFlow` | family |
| `Autosave` | announcement-edit |
| `SaveStatus` | announcement-edit |
| `useAutosave` | announcement-edit |
| `DraftState` | announcement-edit |
| `SaveAs` | announcement-edit |
| `ArchiveRestore` | member |
| `File` | documents |
| `FileRow` | documents |
| `FileRowList` | documents |
| `Auth` | account |
| `SignInForm` | sign-in |
| `SignUpForm` | sign-in |
| `PasswordResetForm` | sign-in |
| `MfaChallenge` | account, sign-in |
| `SsoButtons` | sign-in |
| `AccountRecovery` | sign-in |
| `SessionTimeout` | settings |
| `useSessionTimeout` | settings |
| `RoleManager` | settings |
| `ConnectedAccounts` | account, settings |
| `ConnectedAccount` | settings |
| `ShareDialog` | documents |
| `PermissionsEditor` | documents |
| `Tour` | welcome |
| `Checklist` | servants |
| `Onboarding` | welcome |
| `FeatureIntro` | welcome |
| `HelpPanel` | welcome |
| `ImportDialog` | members |
| `ImportWizard` | members |
| `ExportDialog` | members |
| `AccessRequest` | documents |
| `TrialUpgrade` | settings |
| `Offboarding` | settings |
| `ShortcutsDialog` | settings |
| `FileList` | documents |
| `FileBrowser` | documents |
| `UploadManager` | documents |
| `useUploadQueue` | documents |
| `VersionCompare` | document |
| `AssetGallery` | media |
| `DownloadManager` | documents |
| `MediaPlayer` | media |
| `MetadataEditor` | document |
| `RelatedAssets` | media |
| `AttachmentPicker` | documents |
| `FilePicker` | documents |
| `RenditionList` | media |
| `DocumentViewer` | document |
| `VersionHistory` | document, member |
| `ProductCard` | bookstore |
| `ProductPrice` | bookstore |
| `ProductOptions` | bookstore |
| `useCommercePage` | bookstore |
| `CommerceLine` | give |
| `OrderSummary` | give |
| `ProductListing` | bookstore |
| `ProductDiscovery` | bookstore |
| `ProductDetail` | bookstore |
| `Cart` | bookstore |
| `Checkout` | give |
| `Payment` | give |
| `PaymentFields` | give |
| `OrderConfirmation` | give |
| `OrderStatus` | bookstore |
| `OrderManagement` | bookstore |
| `OrderDetail` | bookstore |
| `SubscriptionManagement` | give |
| `Returns` | bookstore |
| `Comment` | announcement-edit |
| `CommentThread` | announcement-edit |
| `ImageAnnotation` | photo |
| `PresenceBar` | announcement-edit, messages |
| `MentionInput` | announcement-edit |
| `Announcement` | announcements |
| `AuditLog` | settings |
| `ApprovalWorkflow` | servants |
| `PromptInput` | assistant |
| `StreamingText` | assistant |
| `AIChat` | assistant |
| `AssistantPanel` | assistant |
| `AILabel` | assistant |
| `GeneratedContent` | assistant |
| `PromptHistory` | assistant |
| `Citation` | assistant |
| `SuggestedAction` | assistant |
| `AISearch` | assistant |
| `Recommendation` | assistant |
| `AIButton` | assistant |
| `AIDisclaimer` | assistant |
| `ConfidenceIndicator` | assistant |
| `AIExplanation` | assistant |
| `PromptSuggestions` | assistant |
| `SuggestedEdit` | assistant |
| `RefineMenu` | assistant |
| `AnalyticsProvider` | not-found |
| `useAnalytics` | not-found |
| `ListingPage` | directory |
| `ContentManagementPage` | announcements |
| `LandingPage` | visit |
| `HomePage` | dashboard |
| `CreatePage` | member-new |
| `EditPage` | member-edit |
| `MasterDetailPage` | families |
| `SplitWorkspace` | readings |
| `SinglePaneWorkspace` | announcement-edit |
| `FullScreenWorkspace` | photo |
| `FullScreenExperience` | photo |
| `DetailPage` | family |
| `SearchResultsPage` | search |
| `AuthenticationPage` | sign-in |
| `ErrorPage` | not-found |
| `LocaleProvider` | main |
| `useLocale` | not-found |
| `SplitView` | calendar |
| `ReadingPane` | calendar |
| `Heading` | announcements, bookstore, calendar, gifts, give, giving, ministries, planning, readings, reports |
| `TreeChart` | ministries |
| `Anchor` | **not used yet** |
| `OverflowList` | **not used yet** |
| `MenuBar` | **not used yet** |
| `MenuBarMenu` | **not used yet** |
| `Not used by the test site (9` | of 400): AnswerLines, PageBreak, TableSettings, PrintDocument, EntityTitle, Anchor, OverflowList, MenuBar, MenuBarMenu |
| `SITE_COVERAGE_FAIL 391/400 P` | latform names used on 35 pages |
