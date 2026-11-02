# Audit of the web against platforms.md (2026-10-11)

1. Drag alternatives (2.5.7), PARTLY: every drag has keys; almost none has a single-pointer (click or menu) path.
   - PanelSplitter (platform/patterns/AppShell/AppShell.tsx:154-178; used by NavPane, SidePanel, SecondaryPane) has
     arrows, Home/End and Enter, plus a collapse button. There is no click way to change the width.
   - WidgetGrid (platform/patterns/WidgetGrid/WidgetGrid.jsx:59-65) handle takes arrows only.
   - DataGrid row move, wireRows (DataGrid.jsx:380-401), is native drag only (used in dam BrowseDialogs.jsx:204, 243).
   - Column move is drag only. The resize grip is aria-hidden and pointer only; the header menu has "Fit to content".
   - OK: the upload dialogs (Browse button), Slider (a native range), and the image editor (buttons).
2. Unsaved-changes guard, MISSING: no hook and no beforeunload anywhere. These need it:
   - the DAM ImageEditorPage, SystemSettingsPage and MyAccountPage;
   - notes.jsx:36, projects.jsx:213-225 and settings.jsx:834;
   - the DAM upload and metadata dialogs, and suite/capture.jsx.
3. History per screen, MOSTLY MISSING:
   - Screens inside an app are React state with no URL: the selected note, contact and file; the project detail; suite
     find/ai and LeftNav sub; the DAM HomePage view and open asset.
   - messages reads #t-N once and never writes it. settings reads the hash only at start.
   - DAM SystemSettingsPage.jsx:403 and MyAccountPage.jsx:26 use replaceState where they should push.
4. Focus not obscured (2.4.11), MISSING:
   - no scroll-padding or scroll-margin in the platform CSS;
   - sticky parts that can cover focus: ActionBar (action-bar.css:4), the Narrow bottom bar (AppShell.tsx:144),
     StatusBar, and the sticky table headers.
5. Sheet, MISSING; inspector at Narrow, PARTLY. No Sheet component; Dialog has only a side variant. SidePanel becomes
   an overlay below 1024px but has no Narrow form (a bottom sheet or a screen).
6. List-detail at Narrow, MISSING. notes, messages and contacts use SecondaryPane, which has no Narrow logic (no list →
   detail push, no Back). files uses DataGrid plus SidePanel.
7. Full-screen search at Narrow, PARTLY. AppHeader (AppHeader.jsx:97-152, app-header.css:39-43) has the field across
   the bar below 840px, but no full-screen search view and no Back or Cancel. FindWorkspace (suite.jsx:60) has nothing
   for Narrow.
8. Error states, MISSING:
   - EmptyState has no error tone or recovery action;
   - DataGrid shows plain role=alert text with no Retry (DataGrid.jsx:78, 352, 489);
   - the apps have no load-failure paths.
9. Target floor, PARTLY. Touch and mobile make controls 44px (semantic.css:223-250), but there is no coarse-pointer
   audit. Unverified: the DataGrid resize grip, the WidgetGrid handle, and size="xs" icon buttons (SecondaryPane.jsx:72-73).
10. Touch tooltips, MISSING. Tooltip (Tooltip.tsx:34-35) opens on mouseenter and focus only.
11. System appearance, PARTLY:
    - theme-boot follows the system live when data-plx-mode="system", but the default is light (theme-boot.js:8);
    - the suite pages set no mode;
    - the Settings Mode control (settings.jsx:688, prefs.theme) is never applied to <html>;
    - the DAM MyAccountPage offers Light/Dark only.
12. Input hints, MOSTLY MISSING: no inputMode or enterKeyHint anywhere. Missing on projects.jsx:225, settings.jsx:834-835,
    the SystemSettingsPage fields and the SearchField.
13. Narrow DataGrid, MISSING: no list or key-column mode, and no container query.
14. View-state restoration, PARTLY. Restored today: nav width, side panel width, density and suite prefs. Not restored:
    the SecondaryPane width, SidePanel open, selection, scroll, DataGrid sort, filters, widths and order, the DAM view.
15. Tests, MISSING: everything runs at 1440px; there is no 320px reflow test and no coarse-pointer 44px target test.
