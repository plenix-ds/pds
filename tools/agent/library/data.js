// The library plan's source data: every target (a unit of code) and every missing web leaf mapped to one.
// T(name, kind, size, wave, lane, deps, variants, note, files?)  kind: component|pattern|extend|foundation|template|package|doc
// L rows: 'sec|Leaf|Target|role|note'  role: p = builds the target, v = a variant/prop of the target (extend),
//   d = the same thing as the target's primary leaf (a covers entry + its own variant page), c = already answered by an
//   existing record through a cross-section covers entry (give it its own thin record + variant page)
const EX = {   // existing Platform code (for extend targets)
  Text: ['platform/components/Text/Text.tsx', 'platform/components/Text/text.css'],
  SectionHeading: ['platform/components/SectionHeading/SectionHeading.tsx'],
  List: ['platform/components/List/List.tsx', 'platform/components/List/list.css'],
  Stack: ['platform/components/Stack/Stack.tsx', 'platform/components/Stack/stack.css'],
  Columns: ['platform/components/Columns/Columns.tsx', 'platform/components/Columns/columns.css'],
  Preview: ['platform/components/Preview/Preview.tsx', 'platform/components/Preview/preview.css'],
  ContentGrid: ['platform/patterns/ContentGrid/ContentGrid.jsx', 'platform/patterns/ContentGrid/content-grid.css'],
  AppShell: ['platform/patterns/AppShell/AppShell.jsx', 'platform/patterns/AppShell/app-shell.css'],
  BrandMark: ['platform/components/Brand/Brand.jsx', 'platform/components/Brand/brand.css', 'platform/brand/'],
  ColorSwatch: ['platform/components/ColorSwatch/ColorSwatch.jsx', 'platform/components/ColorSwatch/color-swatch.css'],
  Avatar: ['platform/components/Avatar/Avatar.jsx', 'platform/components/Avatar/avatar.css'],
  StatusDot: ['platform/components/StatusDot/StatusDot.tsx', 'platform/components/StatusDot/status-dot.css'],
  Icon: ['platform/components/Icon/Icon.tsx', 'platform/components/Icon/icon.css'],
  Notice: ['platform/components/Notice/Notice.tsx', 'platform/components/Notice/notice.css'],
  EmptyState: ['platform/components/EmptyState/EmptyState.tsx', 'platform/components/EmptyState/empty-state.css'],
  Toast: ['platform/components/Toast/Toast.jsx', 'platform/components/Toast/toast.css'],
  Tooltip: ['platform/components/Tooltip/Tooltip.tsx', 'platform/components/Tooltip/tooltip.css'],
  Dialog: ['platform/components/Dialog/Dialog.jsx', 'platform/components/Dialog/dialog.css'],
  Menu: ['platform/components/Menu/Menu.jsx', 'platform/components/Menu/menu.css'],
  Fieldset: ['platform/components/Fieldset/Fieldset.tsx', 'platform/components/Fieldset/fieldset.css'],
  Field: ['platform/components/Field/Field.tsx', 'platform/components/Field/field.css'],
  Input: ['platform/components/Input/Input.tsx', 'platform/components/Input/input.css'],
  Button: ['platform/components/Button/Button.tsx', 'platform/components/Button/button.css'],
  Combobox: ['platform/components/Combobox/Combobox.tsx', 'platform/components/Combobox/combobox.css'],
  SearchField: ['platform/components/SearchField/SearchField.tsx', 'platform/components/SearchField/search-field.css'],
  Slider: ['platform/components/Slider/Slider.tsx', 'platform/components/Slider/slider.css'],
  Tabs: ['platform/components/Tabs/Tabs.jsx', 'platform/components/Tabs/tabs.css'],
  NavPane: ['platform/patterns/NavPane/NavPane.jsx', 'platform/patterns/NavPane/nav-pane.css'],
  AppHeader: ['platform/patterns/AppHeader/AppHeader.jsx', 'platform/patterns/AppHeader/app-header.css'],
  Card: ['platform/components/Card/Card.jsx', 'platform/components/Card/card.css'],
  Metric: ['platform/components/Metric/Metric.jsx', 'platform/components/Metric/metric.css'],
  DropZone: ['platform/components/DropZone/DropZone.tsx', 'platform/components/DropZone/drop-zone.css'],
  ActionBar: ['platform/patterns/ActionBar/ActionBar.jsx', 'platform/patterns/ActionBar/action-bar.css'],
  Chat: ['platform/components/Chat/Chat.jsx', 'platform/components/Chat/chat.css'],
  ThemeProvider: ['platform/providers/ThemeProvider.jsx', 'platform/providers/themes.js', 'platform/standards/themes.json'],
  SearchWorkspace: ['platform/patterns/SearchWorkspace/SearchWorkspace.jsx', 'platform/patterns/SearchWorkspace/search-workspace.css'],
  ColorPicker: ['platform/components/ColorSwatch/ColorSwatch.jsx', 'platform/components/ColorSwatch/color-swatch.css'],
  CollapsibleSection: ['platform/components/CollapsibleSection/CollapsibleSection.jsx']
};
const T = {};
function t(name, kind, size, wave, lane, deps, variants, note, files) { T[name] = { name, kind, size, wave, lane, deps: deps || [], variants: variants || [], note: note || '', files: files || null }; }

/* ───────── wave 1: utilities and foundation rules (no UI dependencies) ───────── */
t('format', 'foundation', 'L', 1, 'A', [], ['number', 'unit (bytes, duration, length)', 'compact (1.2K)', 'date (short, medium, long)', 'time', 'date-time', 'relative', 'range', 'currency', 'percent', 'person name', 'postal address', 'phone'],
  'platform/utils/format.js on Intl (NumberFormat, DateTimeFormat, RelativeTimeFormat, ListFormat, DisplayNames); locale from LocaleProvider later; one rules page per leaf with live examples',
  ['platform/utils/format.js', 'platform/standards/formats.json']);
t('contrast', 'foundation', 'M', 1, 'A', [], ['AA normal text', 'AA large text', 'AAA', 'non-text 3:1', 'per theme pairs'],
  'platform/utils/contrast.js (contrastRatio, meets) + a generated table of every theme content/surface pair; tests/theme.test.js asserts it; never loosen the baseline (palette-contrast rule)',
  ['platform/utils/contrast.js', 'tests/contrast.test.js']);
t('use-of-color', 'foundation', 'S', 1, 'A', ['contrast'], ['status with icon + text', 'links underlined in text', 'charts with patterns/labels'],
  'a check-system rule: a tone class must come with an icon or text; rules page', ['check-system.rules/use-of-color.js']);
t('dataviz-colors', 'foundation', 'M', 1, 'A', [], ['categorical (DATA_COLORS)', 'sequential (one hue, 5–9 steps)', 'diverging', 'status for charts', 'alert/threshold'],
  'extend platform/components/ColorSwatch/dataColors.js with sequential and diverging scales from existing palette shades only (no new colors); tokens --plx-sys-dataviz-*',
  ['platform/components/ColorSwatch/dataColors.js', 'platform/tokens/semantic/dataviz.tokens.json']);
t('aspect-ratio-scale', 'foundation', 'S', 1, 'A', [], ['1/1', '4/3', '3/2', '16/9', '21/9', '3/4', '9/16'],
  'tokens --plx-ref-ratio-* + .plx-ratio-* classes; Preview, MediaCard and Image read them', ['platform/tokens/reference/ratio.tokens.json', 'platform/system/ratio.css']);
t('layout-grid', 'foundation', 'M', 1, 'A', [], ['4 columns (Narrow)', '8 columns (Medium)', '12 columns (Wide)', 'fluid', 'contained', 'grid overlay (dev)'],
  'column/gutter/margin tokens per window class + .plx-layout-grid + a ?grid overlay in platform/dev', ['platform/system/layout-grid.css', 'platform/tokens/semantic/layout-grid.tokens.json', 'platform/dev/grid-overlay.js']);
t('keylines', 'foundation', 'S', 1, 'A', ['layout-grid'], ['icon keylines (square, circle, portrait, landscape)', 'content keylines'],
  'the 20px icon keyline shapes and the content keylines drawn by a dev overlay (?keylines); rules page with specimens', ['platform/dev/keylines.js', 'platform/system/keylines.css']);
t('floating', 'foundation', 'M', 1, 'B', [], ['placement (12 sides/aligns)', 'flip', 'shift', 'offset', 'match trigger width', 'virtual anchor (pointer)', 'CSS anchor positioning with JS fallback'],
  'utils/floating.js useFloating(anchorRef, floatingRef, opts); generalizes what Menu does today (top layer + anchor positioning); Menu, Tooltip, Popover use it', ['platform/utils/floating.js']);
t('Portal', 'foundation', 'S', 1, 'B', [], ['body', 'top layer (popover)', 'custom container'], 'a Portal component (createPortal into a shared root, inherits theme/density attributes)', ['platform/utils/portal.jsx']);
t('scroll-lock', 'foundation', 'S', 1, 'B', [], ['page', 'element', 'nested locks (counted)'], 'useScrollLock(active): scrollbar-gutter kept so nothing shifts; layer.js modal uses it', ['platform/utils/scrollLock.js']);
t('LiveRegion', 'foundation', 'S', 1, 'B', [], ['polite', 'assertive', 'status', 'log'], 'LiveRegion component + announce(text, politeness) singleton; Toast and DataGrid counts move onto it', ['platform/utils/announce.jsx']);
t('accessible-descriptions', 'foundation', 'S', 1, 'B', [], ['aria-describedby joined', 'description id helper', 'hidden description'], 'useDescribedBy() merges description ids (Field and Tooltip already do this by hand); rules page', ['platform/utils/describedBy.js']);
t('useIntersection', 'foundation', 'S', 1, 'B', [], ['visible once', 'ratio', 'root margin'], 'hooks/useIntersection.js (IntersectionObserver)', ['platform/hooks/useIntersection.js']);
t('clipboard', 'foundation', 'S', 1, 'B', [], ['text', 'rich (html + text)', 'image', 'copied state with timeout'], 'utils/clipboard.js useClipboard()', ['platform/utils/clipboard.js']);
t('hotkey', 'foundation', 'M', 1, 'B', [], ['single key', 'chord (Ctrl K)', 'sequence (g then i)', 'scoped to a region', 'platform-aware Mod key', 'ignored in fields'],
  'utils/hotkey.js useHotkey + a registry the shortcuts dialog reads; Kbd renders the labels', ['platform/utils/hotkey.js']);
t('virtualizer', 'foundation', 'M', 1, 'B', [], ['fixed row height', 'measured rows', 'grid (rows × columns)', 'horizontal', 'sticky headers'], 'hooks/useVirtualizer.js; DataGrid uses TanStack Virtual; VirtualList and file grids use this', ['platform/hooks/useVirtualizer.js']);
t('interaction-states', 'foundation', 'M', 1, 'C', [], ['hover', 'focus-visible', 'pressed', 'selected', 'dragged', 'disabled', 'state layer on accent/surface/inverse'],
  'state tokens (--plx-sys-state-*) + system/interaction.css, a states lab (one row per treatment, every surface); each leaf a variant page', ['platform/system/interaction.css', 'platform/tokens/semantic/state.tokens.json']);
t('read-only-context', 'foundation', 'S', 1, 'C', ['interaction-states'], ['region read-only', 'form read-only', 'field read-only'], 'data-plx-readonly region + ReadOnlyProvider; fields inside render read-only', ['platform/providers/ReadOnly.jsx', 'platform/system/read-only.css']);
t('press-focus-select', 'foundation', 'M', 1, 'C', [], ['usePressable (pointer, touch, keyboard as one press)', 'useFocusable (roving or tab stop, focus-visible)', 'useSelection (single, multiple, range, toggle, select all)'],
  'three hooks in platform/hooks; RowButton, MediaCard and Tree adopt them later', ['platform/hooks/usePressable.js', 'platform/hooks/useFocusable.js', 'platform/hooks/useSelection.js']);
t('focus-order', 'foundation', 'S', 1, 'C', [], ['DOM order = visual order', 'focus moves into overlays and back', 'skip link first'], 'a dev overlay (?focus-order) numbering the tab stops + a keyboard.test.js check per page', ['platform/dev/focus-order.js']);
t('semantic-html', 'foundation', 'S', 1, 'C', [], ['landmarks', 'headings', 'buttons vs links', 'lists', 'tables'], 'check-system rule: no clickable div/span without role; landmark audit in a11y.test.js; rules page', ['check-system.rules/semantic-html.js']);
t('forced-colors', 'foundation', 'M', 1, 'C', ['interaction-states'], ['Windows High Contrast (forced-colors: active)', 'prefers-contrast: more'], 'system/forced-colors.css: system colors for borders, focus, selection, icons; a test in theme.test.js', ['platform/system/forced-colors.css']);
t('direction', 'foundation', 'S', 1, 'C', [], ['ltr', 'rtl', 'mirrored icons', 'logical properties only'], 'DirectionProvider over utils/direction.js; check-system rule bans physical left/right in components', ['platform/providers/DirectionProvider.jsx', 'platform/utils/direction.js']);
t('loading-motion', 'foundation', 'S', 1, 'C', [], ['shimmer', 'spinner rotation', 'progress indeterminate', 'reduced: static'], 'motion tokens for loading + motion.css keyframes; the Skeleton/Spinner/ProgressBar read them', ['platform/system/motion.css', 'platform/tokens/semantic/motion-loading.tokens.json']);
t('gesture', 'foundation', 'M', 1, 'C', [], ['swipe', 'long press', 'pinch zoom', 'pan', 'pull to refresh', 'fling'], 'hooks/useGesture.js (pointer events) + gesture motion tokens (spring, fling decay); Sheet and MediaViewer adopt it', ['platform/hooks/useGesture.js', 'platform/tokens/semantic/motion-gesture.tokens.json']);

/* ───────── wave 2: text, content, layout primitives, brand ───────── */
t('Text', 'extend', 'M', 2, 'A', ['format'], ['display', 'body-lg (lead)', 'body', 'label', 'caption', 'lines={2|3|4} (clamp)', 'expandable (Show more)', 'tabular figures'],
  'Text: add variant "display" and "lead", prop lines (line clamp), prop tabular, prop expandable (uses ShowMore); each typography leaf a variant page', EX.Text);
t('SectionHeading', 'extend', 'S', 2, 'A', [], ['level 1', 'level 2', 'level 3', 'level 4'], 'already covered by the heading record; its own record with a page per level', EX.SectionHeading);
t('Link', 'component', 'S', 2, 'A', ['Icon'], ['inline', 'standalone', 'external (icon + rel)', 'back (chevron)', 'subtle', 'on accent', 'visited'], 'one Link component; four leaves');
t('Code', 'component', 'S', 2, 'A', [], ['default', 'on accent', 'truncated'], 'inline code (Reddit Mono, sunken fill)');
t('Blockquote', 'component', 'S', 2, 'A', [], ['default', 'with citation', 'pull quote'], '');
t('List', 'extend', 'S', 2, 'A', [], ['ordered (decimal)', 'ordered (alpha)', 'nested', 'steps'], 'List: add ordered and nested', EX.List);
t('RichText', 'component', 'M', 2, 'A', ['Link', 'Code', 'Blockquote'], ['article', 'compact', 'in a panel'], 'a prose container (.plx-rich-text) styling headings, lists, tables, quotes and code from HTML or markdown output; sanitizes nothing itself (documented)');
t('Stack', 'extend', 'S', 2, 'B', [], ['Bleed (xs–xl)', 'Center (max width, intrinsic)', 'reverse / reverseBelow', 'order'], 'Stack.jsx: export Center and Bleed; Stack/Inline get reverse and reverseBelow', EX.Stack);
t('Columns', 'extend', 'S', 2, 'B', [], ['collapseBelow (Medium, Narrow)', 'sidebar ratio'], 'Columns: collapse into one column below a window class', EX.Columns);
t('ResponsiveVisibility', 'extend', 'S', 2, 'B', [], ['Show above', 'Show below', 'Hide above', 'Hide below', 'print only'], 'Show/Hide components next to tokenPx/below in AppShell.jsx (breakpoint-utility record)', EX.AppShell);
t('Sticky', 'component', 'S', 2, 'B', [], ['top', 'bottom', 'stuck shadow', 'fixed (viewport)', 'safe-area insets'], 'sticky and fixed regions');
t('Preview', 'extend', 'S', 2, 'B', ['aspect-ratio-scale'], ['every ratio of the scale', 'cover', 'contain'], 'Preview takes the ratio tokens; Aspect ratio leaf', EX.Preview);
t('ContentGrid', 'extend', 'M', 2, 'B', [], ['masonry', 'justified rows'], 'ContentGrid layout="masonry" (CSS columns with order kept; masonry grid where supported)', EX.ContentGrid);
t('AppShell', 'extend', 'S', 2, 'B', [], ['contained (one column)', 'focus (full screen)', 'three pane', 'holy grail'], 'records for the layout arrangements the shell already draws (page kinds); no new code beyond examples', EX.AppShell);
t('Image', 'component', 'M', 2, 'C', ['aspect-ratio-scale'], ['fit cover', 'fit contain', 'responsive (srcSet, sizes)', 'lazy', 'placeholder (blur/color)', 'error fallback', 'rounded'], '');
t('Figure', 'component', 'S', 2, 'C', ['Image'], ['caption below', 'caption overlay', 'with credit'], '');
t('Illustration', 'component', 'M', 2, 'C', [], ['spot (sm)', 'scene (md, lg)', 'empty-state set', 'error set', 'on accent'], 'a small illustration set built from existing palette roles (no new colors), platform/illustrations/*.svg + Illustration component; EmptyState can take one');
t('IconTile', 'component', 'S', 2, 'C', [], ['hues (data colors)', 'tones', 'sizes sm md lg', 'filled icon'], 'extracted from EntityHeader Media ({icon, hue}); EntityHeader then uses it', ['platform/components/IconTile/IconTile.tsx', 'platform/components/IconTile/icon-tile.css', 'platform/tokens/components/icon-tile.tokens.json', 'platform/patterns/EntityHeader/EntityHeader.jsx', 'platform/patterns/EntityHeader/entity-header.css']);
t('Pictogram', 'component', 'S', 2, 'C', ['IconTile'], ['48', '64', '96', 'two-tone (filled + tint)'], 'large Material Symbols (unedited) in a pictogram frame; no new SVGs');
t('BrandMark', 'extend', 'M', 2, 'C', [], ['logo (mark + wordmark lockup)', 'wordmark', 'mark', 'product mark per app (PLENIX_APPS)', 'mono', 'on accent', 'sizes'], 'BrandMark kind prop; product marks from apps.js', EX.BrandMark);
t('brand-application', 'foundation', 'S', 2, 'C', ['BrandMark'], ['clear space', 'minimum size', 'backgrounds', 'misuse'], 'brand tokens (clear space, min size) + rules page with specimens', ['platform/brand/brand-rules.json', 'platform/components/Brand/brand.css']);
t('themes-extra', 'foundation', 'M', 2, 'C', [], ['high-contrast light', 'high-contrast dark', 'product theme per app accent', 'theme zone (ThemeZone theme="dark")'],
  'ThemeProvider: ThemeZone component and per-product accent mapping; a high-contrast theme in standards/themes.json built only from existing palette colors (ask the owner first: no new colors)', EX.ThemeProvider);
t('ai-visual-language', 'foundation', 'S', 2, 'C', [], ['AI accent role', 'AI surface', 'sparkle icon', 'generated-content border'], 'AI semantic roles mapped to existing palette colors (ask first) + .plx-ai classes', ['platform/tokens/semantic/ai.tokens.json', 'platform/system/ai.css']);

/* ───────── wave 3: identity, time, status and feedback ───────── */
t('Time', 'component', 'S', 3, 'A', ['format'], ['timestamp', 'relative (auto-updating)', 'date label (Today, Yesterday)', 'date only', 'time only', 'with absolute tooltip'], '<time dateTime> with format.js');
t('VersionLabel', 'component', 'S', 3, 'A', [], ['number (v12)', 'semver', 'latest', 'draft', 'compact'], '');
t('StatusDot', 'extend', 'S', 3, 'A', [], ['available', 'busy', 'away', 'do not disturb', 'offline', 'with icon (not color only)'], 'StatusDot availability tones', EX.StatusDot);
t('Avatar', 'extend', 'S', 3, 'A', ['StatusDot'], ['with presence', 'every size'], 'Avatar presence prop (StatusDot at its corner)', EX.Avatar);
t('AvatarGroup', 'component', 'S', 3, 'A', ['Avatar'], ['stack', 'grid', 'max + overflow count', 'sizes', 'with presence'], '');
t('Persona', 'component', 'M', 3, 'A', ['Avatar'], ['sizes xs–xl', 'name only', 'name + secondary', 'with presence', 'with role'], 'avatar + name + details (profile summary)');
t('ColorSwatch', 'extend', 'S', 3, 'B', [], ['square', 'circle', 'sizes', 'pressed', 'with label'], 'existing ColorSwatch gets its own record (the color-swatch record is the Color picker)', EX.ColorSwatch);
t('ColorPicker', 'extend', 'S', 3, 'B', [], ['data palette', 'category palette', 'custom swatches'], 'existing ColorPicker as Swatch picker: its own record', EX.ColorPicker);
t('QRCode', 'component', 'M', 3, 'B', [], ['sizes', 'error correction L/M/Q/H', 'with logo space', 'on accent'], 'own encoder utils/qr.js (no dependency); SVG output');
t('Barcode', 'component', 'M', 3, 'B', [], ['Code 128', 'EAN-13', 'UPC-A', 'with human-readable text'], 'own encoder utils/barcode.js; SVG');
t('StatusIcon', 'extend', 'S', 3, 'B', [], ['info', 'success', 'warning', 'danger', 'neutral', 'sizes'], 'Icon.jsx: StatusIcon export (tone icon + label)', EX.Icon);
t('ProgressCircle', 'component', 'S', 3, 'B', [], ['determinate', 'indeterminate', 'sizes sm md lg', 'with value', 'tones'], '');
t('Scrim', 'component', 'S', 3, 'B', ['scroll-lock'], ['modal', 'light', 'inverse', 'blur'], 'Dialog/Drawer/Sheet adopt it in the Dialog extend (wave 5), not in this task');
t('LoadingOverlay', 'component', 'S', 3, 'B', ['Scrim'], ['region', 'full page', 'with message', 'with progress'], 'Spinner over a Scrim, aria-busy on the region');
t('Banner', 'component', 'M', 3, 'C', ['StatusIcon'], ['info', 'success', 'warning', 'danger', 'neutral', 'dismissible', 'with actions', 'page top', 'inside a pane'], 'page-level message (Carbon/Atlassian Banner)');
t('Notice', 'extend', 'S', 3, 'C', [], ['with title', 'with actions', 'dismissible'], 'Notice gets title, actions and onDismiss: the section message', EX.Notice);
t('EmptyState', 'extend', 'M', 3, 'C', ['Illustration'], ['error', 'warning', 'success', 'offline', 'degraded', 'permission denied', 'not found', 'maintenance', 'completion', 'page / inline sizes'],
  'EmptyState tones warning and success + presets (kind="offline" …) with default icon and copy in strings', EX.EmptyState);
t('Toast', 'extend', 'S', 3, 'C', [], ['with action (Undo)', 'persistent until action'], 'Toast action + useUndo(): the undo pattern', EX.Toast);
t('Retry', 'pattern', 'S', 3, 'C', ['EmptyState'], ['inline retry', 'automatic with backoff', 'retry count'], 'useRetry hook + RetryNotice');

/* ───────── wave 4: overlays and actions ───────── */
t('Popover', 'component', 'M', 4, 'A', ['floating', 'Portal'], ['click', 'hover (hover card)', 'with header/footer', 'arrow', 'sizes', 'modal on Narrow (Sheet)'], 'non-modal anchored dialog; also Popup and Inline dialog');
t('Popconfirm', 'pattern', 'S', 4, 'A', ['Popover'], ['default', 'destructive'], '');
t('ContextualHelp', 'component', 'S', 4, 'A', ['Popover'], ['info', 'help', 'inline tip (contextual education)'], 'an info button opening a popover; Field info uses it');
t('Tooltip', 'extend', 'S', 4, 'A', ['floating'], ['rich (title, body, action)', 'all placements'], 'Tooltip rich content and the floating utility', EX.Tooltip);
t('Details', 'component', 'S', 4, 'A', [], ['default', 'bordered', 'inline'], 'native details/summary styled; distinct from CollapsibleSection (a section with a heading)');
t('TeachingBubble', 'component', 'M', 4, 'B', ['Popover'], ['with image', 'with steps (1 of 3)', 'primary/secondary actions', 'wide'], 'Fluent teaching bubble = Material/Atlassian coach mark');
t('Spotlight', 'component', 'M', 4, 'B', ['Scrim', 'floating'], ['element cut-out', 'with TeachingBubble', 'pulse beacon'], '');
t('Dialog', 'extend', 'M', 4, 'B', [], ['non-modal (show)', 'prompt (one field)', 'full screen'], 'Dialog modal={false}; PromptDialog export; full-screen size gets its own page', EX.Dialog);
t('Menu', 'extend', 'M', 4, 'C', ['floating'], ['context menu (pointer, Shift+F10, long press)', 'radio items (MenuRadioGroup)', 'submenu'], 'ContextMenu export; MenuItem type="radio"', EX.Menu);
t('SplitButton', 'component', 'S', 4, 'C', ['Menu'], ['primary', 'secondary', 'sizes', 'disabled'], '');
t('CommandMenu', 'component', 'M', 4, 'C', ['hotkey'], ['grouped', 'with shortcuts', 'nested pages', 'loading', 'empty'], 'a filterable command list (combobox + listbox)');
t('CommandPalette', 'pattern', 'S', 4, 'C', ['CommandMenu'], ['global (Ctrl K)', 'scoped'], 'CommandMenu in a Dialog with the hotkey');
t('FloatingActionButton', 'component', 'S', 4, 'B', [], ['standard', 'small', 'large', 'extended (label)', 'secondary'], '');
t('BackToTop', 'component', 'S', 4, 'B', ['useIntersection'], ['floating', 'inline'], '');
t('CopyButton', 'component', 'S', 4, 'B', ['clipboard'], ['icon', 'with label', 'copied state', 'in a field'], '');
t('DownloadButton', 'component', 'S', 4, 'C', [], ['icon', 'with label', 'with size/format', 'in progress'], '');
t('print', 'foundation', 'S', 4, 'C', [], ['print stylesheet', 'print-only / screen-only', 'PrintButton'], 'system/print.css + usePrint()', ['platform/system/print.css', 'platform/hooks/usePrint.js']);
t('MegaMenu', 'component', 'M', 4, 'A', ['Popover'], ['columns', 'with featured', 'mobile accordion'], '');

/* ───────── wave 5: forms 1 ───────── */
t('Form', 'pattern', 'M', 5, 'A', [], ['FormSection (titled)', 'FormActions (end, sticky)', 'one column', 'two column (label beside)'], 'Form, FormSection, FormActions');
t('Fieldset', 'extend', 'S', 5, 'A', [], ['field group in a row', 'legend visible/hidden'], 'Fieldset layout="row"; Legend gets its own page', EX.Fieldset);
t('ErrorSummary', 'component', 'S', 5, 'A', [], ['list of errors with links', 'focused on submit'], '');
t('InputGroup', 'component', 'M', 5, 'A', [], ['prefix text', 'suffix text', 'icon', 'button attached', 'select attached'], '');
t('Field', 'extend', 'S', 5, 'A', [], ['character counter', 'over the limit'], 'Field counter prop (from maxLength)', EX.Field);
t('Input', 'extend', 'M', 5, 'B', [], ['read-only (own page)', 'appearance outline (default) / filled / underline', 'Textarea autoGrow'], 'Input appearance prop for the whole input family; Textarea autoGrow', EX.Input);
t('InlineEdit', 'component', 'M', 5, 'B', [], ['text', 'textarea', 'select', 'with confirm buttons', 'read view'], '');
t('OtpInput', 'component', 'M', 5, 'B', [], ['4 digits', '6 digits', 'alphanumeric', 'masked', 'invalid'], '');
t('Button', 'extend', 'S', 5, 'B', [], ['toggle (pressed) in each variant'], 'Button pressed already exists: Toggle button page and lab rows', EX.Button);
t('NumberInput', 'component', 'M', 5, 'C', ['format'], ['plain', 'stepper buttons', 'quantity (compact - 1 +)', 'currency', 'percentage', 'with unit', 'min/max', 'invalid'], '');
t('Slider', 'extend', 'M', 5, 'C', [], ['range (two thumbs)', 'with marks'], 'Slider range', EX.Slider);
t('FileInput', 'component', 'S', 5, 'C', [], ['button', 'with file list', 'multiple', 'accept types'], '');
t('Combobox', 'extend', 'M', 5, 'C', [], ['async (loadOptions)', 'checkboxes in options', 'radio marks (single)'], 'Combobox loadOptions/loading and option marks', EX.Combobox);
t('SearchField', 'extend', 'M', 5, 'A', ['virtualizer'], ['suggestions', 'recent searches', 'history (clear)'], 'SearchField suggestions listbox + useSearchHistory', EX.SearchField);

/* ───────── wave 6: pickers, chart core ───────── */
t('Calendar', 'component', 'L', 6, 'A', ['format'], ['month', 'two months', 'range highlight', 'week numbers', 'disabled dates', 'min/max'], '');
t('DatePicker', 'component', 'M', 6, 'A', ['Calendar', 'Popover'], ['single', 'range', 'date-time', 'presets'], '');
t('TimePicker', 'component', 'M', 6, 'A', ['format'], ['12/24 hours', 'step', 'list', 'segments'], '');
t('RelativeDateInput', 'component', 'S', 6, 'A', ['format'], ['past presets', 'future presets', 'custom n units'], '');
t('TimeZoneSelect', 'component', 'S', 6, 'B', ['format'], ['grouped by region', 'with offset', 'search'], 'Combobox over Intl.supportedValuesOf');
t('CountrySelect', 'component', 'S', 6, 'B', ['format'], ['country', 'locale', 'language', 'with flag emoji off'], 'Combobox over Intl.DisplayNames');
t('EntityPicker', 'component', 'M', 6, 'B', ['Persona'], ['people', 'teams', 'records', 'single', 'multiple'], 'Combobox with rich options; People picker is its people preset');
t('TreeSelect', 'component', 'M', 6, 'B', [], ['single', 'multiple with checkboxes', 'search'], 'Tree in a popover');
t('TransferList', 'component', 'M', 6, 'C', ['press-focus-select'], ['with search', 'ordered target', 'virtualized'], '');
t('Cascader', 'component', 'M', 6, 'C', ['MillerColumns'], ['click', 'hover', 'search', 'multiple'], '');
t('MillerColumns', 'component', 'L', 6, 'C', [], ['with preview column', 'keyboard', 'resizable'], '');
t('ImageUpload', 'pattern', 'M', 6, 'B', ['Image'], ['single', 'multiple', 'with crop', 'aspect locked'], '');
t('AvatarUpload', 'pattern', 'S', 6, 'B', ['ImageUpload'], ['circle', 'square', 'remove'], '');
t('ChartKit', 'foundation', 'L', 6, 'C', ['dataviz-colors', 'format'], ['linear, band, time, log scales', 'nice ticks', 'responsive frame', 'margins'],
  'platform/charts/: scales, ticks, ChartFrame (SVG, ResizeObserver), series color; no dependency', ['platform/charts/scales.js', 'platform/charts/ChartFrame.jsx', 'platform/charts/charts.css']);

/* ───────── wave 7: navigation, lists, chart parts ───────── */
t('ProgressSteps', 'component', 'M', 7, 'A', [], ['horizontal', 'vertical', 'clickable', 'with status (complete, current, error)', 'compact'], 'step indicator: navigation stepper = progress tracker = step progress');
t('Tabs', 'extend', 'M', 7, 'A', [], ['vertical'], 'Tabs orientation="vertical"', EX.Tabs);
t('LoadMore', 'component', 'S', 7, 'A', ['useIntersection'], ['button', 'infinite (sentinel)', 'loading', 'end of list'], '');
t('NavPane', 'extend', 'S', 7, 'A', [], ['bottom bar', 'overlay drawer', 'screen'], 'records only: NavPane already draws the bar and the drawer', EX.NavPane);
t('AppHeader', 'extend', 'S', 7, 'A', [], ['narrow (mobile app bar)', 'with back'], 'records only: AppHeader already adapts', EX.AppHeader);
t('BottomSheetNav', 'pattern', 'S', 7, 'A', [], ['list', 'grid'], 'Sheet + NavList');
t('SearchResult', 'component', 'S', 7, 'B', [], ['page', 'file', 'person', 'with highlight', 'with path'], 'SearchResult + SearchResultGroup');
t('FilterPanel', 'pattern', 'M', 7, 'B', ['Slider', 'DatePicker'], ['in a pane', 'in a sheet', 'facets with counts', 'ranges'], '');
t('QueryBuilder', 'pattern', 'L', 7, 'B', ['DatePicker', 'NumberInput'], ['rule', 'group (and/or)', 'nested', 'text view'], '');
t('ResourceList', 'pattern', 'M', 7, 'B', ['press-focus-select'], ['media', 'avatar', 'selectable', 'with actions', 'grouped'], 'Polaris resource list; also Object list');
t('VirtualList', 'component', 'M', 7, 'C', ['virtualizer'], ['fixed', 'variable', 'with groups'], '');
t('Timeline', 'component', 'M', 7, 'C', [], ['vertical', 'horizontal', 'with icons', 'alternating'], '');
t('Carousel', 'component', 'M', 7, 'C', ['gesture'], ['one per view', 'several per view', 'dots', 'arrows', 'autoplay off by default'], '');
t('Card', 'extend', 'S', 7, 'C', [], ['expandable'], 'Card expandable', EX.Card);
t('FeatureCard', 'pattern', 'S', 7, 'C', ['IconTile'], ['icon', 'image', 'horizontal'], '');
t('UserCard', 'pattern', 'S', 7, 'C', ['Persona'], ['compact', 'with actions', 'with cover'], 'User card = Profile card');
t('PeopleGroup', 'pattern', 'S', 7, 'C', ['AvatarGroup'], ['team', 'group', 'with member count'], '');
t('RoleLabel', 'component', 'S', 7, 'B', [], ['owner', 'editor', 'viewer', 'custom'], '');
t('PermissionSummary', 'pattern', 'S', 7, 'B', [], ['can / cannot list', 'compact'], 'List with success/danger tones');
t('chart-parts', 'foundation', 'L', 7, 'B', ['ChartKit'], ['Axis (bottom, left, right, top)', 'GridLines', 'ChartLegend (top, right, interactive)', 'ChartTooltip (shared, single)', 'DataLabel', 'ReferenceLine / Threshold', 'ChartAnnotation'],
  'platform/charts/parts/*.jsx', ['platform/charts/parts/']);

/* ───────── wave 8: charts 1 ───────── */
t('chart-a11y', 'foundation', 'M', 8, 'A', ['chart-parts'], ['data grid fallback', 'keyboard point navigation', 'summary text', 'patterns'], 'platform/charts/a11y.js', ['platform/charts/a11y.js']);
t('chart-interaction', 'foundation', 'M', 8, 'A', ['chart-parts'], ['hover crosshair', 'brush/zoom', 'legend toggle', 'click a point'], 'platform/charts/interaction.js', ['platform/charts/interaction.js']);
t('LineChart', 'component', 'M', 8, 'A', ['chart-parts'], ['line', 'step', 'multi-series', 'points'], 'platform/charts/LineChart.jsx', ['platform/charts/LineChart.jsx']);
t('AreaChart', 'component', 'S', 8, 'A', ['LineChart'], ['area', 'stacked', 'percent'], '', ['platform/charts/AreaChart.jsx']);
t('BarChart', 'component', 'M', 8, 'B', ['chart-parts'], ['bar (horizontal)', 'column (vertical)', 'grouped', 'stacked', 'percent', 'histogram (binned)'], '', ['platform/charts/BarChart.jsx']);
t('ComboChart', 'component', 'S', 8, 'B', ['BarChart'], ['bar + line', 'two axes'], '', ['platform/charts/ComboChart.jsx']);
t('LollipopChart', 'component', 'S', 8, 'B', ['chart-parts'], ['horizontal', 'vertical'], '', ['platform/charts/LollipopChart.jsx']);
t('Sparkline', 'component', 'S', 8, 'C', ['ChartKit'], ['line', 'area', 'bar', 'with last point'], '', ['platform/charts/Sparkline.jsx']);
t('Metric', 'extend', 'S', 8, 'C', ['Sparkline'], ['card with trend'], 'Metric card = Card + Metric + Sparkline', EX.Metric);
t('PieChart', 'component', 'M', 8, 'C', ['chart-parts'], ['pie', 'donut', 'with center value', 'half'], '', ['platform/charts/PieChart.jsx']);
t('ScatterChart', 'component', 'M', 8, 'C', ['chart-parts'], ['scatter', 'bubble (size)', 'with trend line'], '', ['platform/charts/ScatterChart.jsx']);
t('Gauge', 'component', 'S', 8, 'B', ['ChartKit'], ['semicircle', 'with thresholds'], '', ['platform/charts/Gauge.jsx']);
t('BulletChart', 'component', 'S', 8, 'B', ['chart-parts'], ['horizontal', 'vertical'], '', ['platform/charts/BulletChart.jsx']);

/* ───────── wave 9: charts 2 and visualizations ───────── */
t('HeatMap', 'component', 'M', 9, 'A', ['chart-parts'], ['matrix', 'calendar heat map'], '', ['platform/charts/HeatMap.jsx']);
t('BoxPlot', 'component', 'M', 9, 'A', ['chart-parts'], ['vertical', 'horizontal', 'with outliers'], '', ['platform/charts/BoxPlot.jsx']);
t('FunnelChart', 'component', 'S', 9, 'A', ['chart-parts'], ['vertical', 'horizontal'], '', ['platform/charts/FunnelChart.jsx']);
t('WaterfallChart', 'component', 'S', 9, 'A', ['chart-parts'], ['with totals'], '', ['platform/charts/WaterfallChart.jsx']);
t('RadarChart', 'component', 'S', 9, 'A', ['chart-parts'], ['single', 'compare'], '', ['platform/charts/RadarChart.jsx']);
t('Treemap', 'component', 'M', 9, 'B', ['ChartKit'], ['flat', 'nested'], 'squarify layout', ['platform/charts/Treemap.jsx']);
t('SankeyDiagram', 'component', 'L', 9, 'B', ['ChartKit'], ['horizontal'], 'own layout (no d3)', ['platform/charts/SankeyDiagram.jsx']);
t('WordCloud', 'component', 'M', 9, 'B', ['ChartKit'], ['spiral', 'rectangular'], '', ['platform/charts/WordCloud.jsx']);
t('GanttChart', 'component', 'L', 9, 'B', ['chart-parts'], ['tasks', 'dependencies', 'milestones', 'today line'], '', ['platform/charts/GanttChart.jsx']);
t('TimelineChart', 'component', 'M', 9, 'B', ['chart-parts'], ['events', 'ranges', 'lanes'], '', ['platform/charts/TimelineChart.jsx']);
t('GeoMap', 'component', 'L', 9, 'C', ['ChartKit'], ['world', 'country', 'markers', 'choropleth', 'tile layer adapter (optional)'],
  'SVG maps from vendored TopoJSON (platform/vendor/geo/), no tile service needed; Map and Choropleth map', ['platform/charts/GeoMap.jsx', 'platform/vendor/geo/']);
t('NetworkGraph', 'component', 'L', 9, 'C', ['ChartKit'], ['force layout', 'hierarchical', 'zoom/pan'], '', ['platform/charts/NetworkGraph.jsx']);
t('Diagram', 'component', 'L', 9, 'C', ['NetworkGraph'], ['flowchart', 'boxes and arrows', 'read-only'], '', ['platform/charts/Diagram.jsx']);
t('ComparisonView', 'pattern', 'M', 9, 'C', [], ['side by side columns', 'feature matrix', 'image slider (before/after)', 'highlight differences'], 'Comparison view = Compare (patterns)');

/* ───────── wave 10: workflows 1 ───────── */
t('Wizard', 'pattern', 'M', 10, 'A', ['ProgressSteps', 'Form'], ['page', 'with summary step', 'linear', 'free navigation'], 'Wizard = Multi-step form on a page');
t('WizardDialog', 'pattern', 'S', 10, 'A', ['Wizard'], ['md', 'lg', 'full screen'], '');
t('FormFlow', 'pattern', 'M', 10, 'A', ['Form', 'Toast'], ['create in a dialog', 'create on a page', 'edit in place', 'edit in a drawer'], 'create and edit flows with unsaved guard');
t('Autosave', 'pattern', 'S', 10, 'A', [], ['saving', 'saved', 'offline', 'failed'], 'useAutosave + SaveStatus');
t('DraftState', 'pattern', 'S', 10, 'A', ['Autosave', 'VersionLabel'], ['draft badge', 'discard draft', 'resume draft'], '');
t('SaveAs', 'pattern', 'S', 10, 'A', ['TreeSelect'], ['name + location', 'format'], '');
t('DeleteFlow', 'pattern', 'S', 10, 'B', ['Toast'], ['confirm', 'undo', 'move to trash', 'type to confirm'], '');
t('DuplicateAction', 'pattern', 'S', 10, 'B', [], ['copy of name', 'then rename'], '');
t('RenameAction', 'pattern', 'S', 10, 'B', ['InlineEdit'], ['inline', 'dialog'], '');
t('ArchiveRestore', 'pattern', 'S', 10, 'B', ['Banner'], ['archive', 'archived banner', 'restore'], '');
t('Publish', 'pattern', 'M', 10, 'B', [], ['publish now', 'schedule', 'unpublish', 'status'], '');
t('ReviewFlow', 'pattern', 'M', 10, 'B', ['Form'], ['review panel', 'approve', 'reject with reason', 'request changes', 'review queue (data review)'], '');
t('AssignControl', 'pattern', 'S', 10, 'B', ['EntityPicker'], ['assign', 'reassign', 'delegate with dates'], '');
t('GroupBy', 'pattern', 'S', 10, 'C', [], ['menu', 'grouped list', 'collapsed groups'], 'a DataToolbar control + grouped results');
t('dnd', 'foundation', 'L', 10, 'C', ['press-focus-select', 'LiveRegion'], ['sortable', 'free move (reposition)', 'between lists', 'keyboard drag', 'announcements', 'auto-scroll'],
  'utils/dnd.js engine (pointer + keyboard + announcements); accessible drag and drop', ['platform/utils/dnd.js']);
t('SortableList', 'pattern', 'M', 10, 'C', ['dnd'], ['vertical', 'grid', 'handles', 'with move buttons'], 'Sortable list = Reordering');
t('DragHandle', 'component', 'S', 10, 'C', ['dnd'], ['vertical', 'horizontal'], '');
t('DropZone', 'extend', 'S', 10, 'C', ['dnd'], ['data drop target', 'accepts/rejects'], 'DropZone accepts data items, not only files', EX.DropZone);
t('Resizable', 'component', 'S', 10, 'C', [], ['horizontal', 'vertical', 'both', 'snapped to size steps'], 'PanelSplitter promoted from AppShell.jsx into its own component (AppShell imports and re-exports it)', ['platform/components/Resizable/Resizable.jsx', 'platform/components/Resizable/resizable.css', 'platform/tokens/components/resizable.tokens.json', 'platform/patterns/AppShell/AppShell.jsx']);

/* ───────── wave 11: import/export, sharing, auth, access, onboarding ───────── */
t('ImportDialog', 'pattern', 'M', 11, 'A', ['FileInput', 'DropZone'], ['file', 'paste', 'url'], 'Import (actions) = Import (patterns)');
t('ImportWizard', 'pattern', 'M', 11, 'A', ['ImportDialog', 'Wizard'], ['map columns', 'review', 'results'], '');
t('ExportDialog', 'pattern', 'M', 11, 'A', [], ['format', 'scope (selection/all)', 'background export'], 'Export (actions) = Export (patterns); Export workflow is its background mode');
t('ShareDialog', 'pattern', 'M', 11, 'A', ['EntityPicker', 'RoleLabel', 'CopyButton'], ['people', 'link', 'roles', 'Web Share'], 'Sharing (specialized); Share action opens it');
t('Auth', 'pattern', 'L', 11, 'B', ['Form', 'OtpInput'], ['sign in', 'sign up', 'password reset', 'MFA challenge', 'SSO buttons', 'account recovery'],
  'forms promoted from services/login (login.css) into platform/patterns/Auth; the login service then uses the CDN build');
t('SessionTimeout', 'pattern', 'S', 11, 'B', ['Dialog'], ['warning with countdown', 'signed out'], '');
t('PermissionsEditor', 'pattern', 'M', 11, 'B', ['PermissionSummary'], ['roles × capabilities matrix', 'per person'], '');
t('RoleManager', 'pattern', 'M', 11, 'B', ['RoleLabel'], ['roles list', 'role detail'], '');
t('AccessRequest', 'pattern', 'S', 11, 'B', ['EmptyState'], ['request', 'pending', 'approved/denied'], '');
t('ConnectedAccounts', 'pattern', 'S', 11, 'B', [], ['connect', 'connected', 'error'], '');
t('Tour', 'pattern', 'M', 11, 'C', ['TeachingBubble', 'Spotlight'], ['steps', 'skip', 'resume'], 'Product tour = Walkthrough');
t('Checklist', 'component', 'S', 11, 'C', [], ['with progress', 'collapsible', 'dismissible'], '');
t('Onboarding', 'pattern', 'M', 11, 'C', ['Checklist', 'Tour'], ['welcome dialog', 'setup checklist'], '');
t('FeatureIntro', 'pattern', 'S', 11, 'C', ['TeachingBubble'], ['new badge', 'what is new dialog'], '');
t('TrialUpgrade', 'pattern', 'M', 11, 'C', ['Banner', 'ComparisonView'], ['trial banner', 'upgrade dialog', 'plan compare'], '');
t('Offboarding', 'pattern', 'M', 11, 'C', ['Wizard', 'ExportDialog'], ['cancel', 'export data', 'delete account'], '');
t('ShortcutsDialog', 'pattern', 'S', 11, 'C', ['hotkey'], ['grouped', 'searchable'], 'Keyboard shortcuts list from the hotkey registry');
t('HelpPanel', 'pattern', 'M', 11, 'C', [], ['in the inspector', 'search', 'articles'], 'SidePanel with help content');

/* ───────── wave 12: files and assets ───────── */
t('File', 'component', 'S', 12, 'A', ['format'], ['file', 'folder', 'by type icon', 'with size'], 'a file or folder chip/line');
t('FileRow', 'component', 'S', 12, 'A', ['File'], ['default', 'selected', 'with progress', 'with actions'], '');
t('FileList', 'pattern', 'M', 12, 'A', ['FileRow'], ['list', 'table', 'sortable'], '');
t('FileBrowser', 'pattern', 'L', 12, 'A', ['FileList'], ['list', 'grid', 'tree', 'breadcrumbs'], '');
t('AttachmentPicker', 'pattern', 'M', 12, 'A', ['FileInput', 'FileRow'], ['inline', 'chips'], '');
t('MediaCard', 'extend', 'S', 12, 'B', [], ['asset (type badge, status)', 'collection (stack)'], 'MediaCard asset preset and Collection', EX.Card);
t('AssetGallery', 'pattern', 'M', 12, 'B', ['ContentGrid'], ['masonry', 'justified', 'with lightbox'], '');
t('UploadManager', 'pattern', 'M', 12, 'B', ['FileRow'], ['panel', 'dialog', 'per file progress', 'retry'], 'promote from dam/app/dialogs/UploadDialog.jsx');
t('DownloadManager', 'pattern', 'S', 12, 'B', ['FileRow'], ['panel', 'progress', 'ready'], '');
t('FilePicker', 'pattern', 'M', 12, 'B', [], ['files', 'assets', 'media only'], 'File picker; Asset picker and Media picker are its modes');
t('RenditionList', 'pattern', 'S', 12, 'B', ['DownloadButton'], ['table', 'menu'], '');
t('MediaPlayer', 'component', 'L', 12, 'C', [], ['video', 'audio', 'captions', 'transcript', 'playback rate', 'picture in picture'], 'Video, Audio, Video player, Audio player, Captions and transcripts');
t('DocumentViewer', 'component', 'L', 12, 'C', [], ['PDF (vendored pdf.js)', 'image pages', 'text', 'zoom', 'page thumbnails'], '');
t('MetadataEditor', 'pattern', 'M', 12, 'C', ['InlineEdit'], ['inline', 'form', 'bulk'], 'promote from the DAM inspector');
t('VersionHistory', 'pattern', 'M', 12, 'C', ['Timeline', 'VersionLabel'], ['list', 'restore', 'preview'], '');
t('VersionCompare', 'pattern', 'M', 12, 'C', ['ComparisonView'], ['side by side', 'slider', 'text diff'], '');
t('RelatedAssets', 'pattern', 'S', 12, 'C', ['Carousel'], ['strip', 'grid'], '');

/* ───────── wave 13: collaboration and commerce ───────── */
t('Comment', 'component', 'M', 13, 'A', ['Persona', 'Time'], ['default', 'own', 'edited', 'resolved', 'with reactions'], '');
t('CommentThread', 'pattern', 'M', 13, 'A', ['Comment'], ['thread', 'reply composer', 'resolved'], 'Reply is its composer');
t('MentionInput', 'component', 'M', 13, 'A', ['EntityPicker'], ['in a text area', 'in rich text'], '');
t('ImageAnnotation', 'pattern', 'M', 13, 'A', ['Comment'], ['pins', 'regions'], '');
t('Announcement', 'component', 'S', 13, 'B', ['Banner'], ['banner', 'card', 'dialog'], '');
t('AuditLog', 'pattern', 'M', 13, 'B', ['Time', 'Persona'], ['table', 'with diff'], '');
t('PresenceBar', 'pattern', 'S', 13, 'B', ['AvatarGroup'], ['viewers', 'editors', 'cursors list'], '');
t('ApprovalWorkflow', 'pattern', 'M', 13, 'B', ['ReviewFlow', 'ProgressSteps'], ['sequential', 'parallel', 'status'], '');
t('ProductCard', 'pattern', 'S', 13, 'C', ['Image', 'format'], ['grid', 'list', 'sale', 'out of stock'], '');
t('ProductOptions', 'component', 'S', 13, 'C', [], ['size buttons', 'color swatches', 'quantity'], '');
t('Commerce', 'template', 'L', 13, 'C', ['ProductCard', 'ProductOptions', 'FilterPanel', 'Wizard', 'NumberInput'], ['product discovery', 'product listing', 'product detail', 'cart', 'checkout', 'payment (UI only)', 'order confirmation', 'order management', 'subscription management', 'returns'],
  'platform/templates/commerce/*: templates built from existing parts; no payment processing (form UI only)');

/* ───────── wave 14: AI ───────── */
t('AIButton', 'component', 'S', 14, 'A', ['ai-visual-language'], ['trigger', 'with menu of AI actions', 'icon only'], '');
t('AILabel', 'component', 'S', 14, 'A', ['ai-visual-language', 'Popover'], ['badge', 'inline', 'with explanation'], '');
t('AIDisclaimer', 'component', 'S', 14, 'A', [], ['footer', 'inline'], '');
t('GeneratedContent', 'component', 'M', 14, 'A', ['AILabel'], ['with feedback', 'regenerate', 'versions pager'], '');
t('ConfidenceIndicator', 'component', 'S', 14, 'A', [], ['high', 'medium', 'low', 'numeric'], '');
t('AIExplanation', 'pattern', 'S', 14, 'A', ['Popover', 'ConfidenceIndicator'], ['why this', 'factors'], '');
t('PromptInput', 'component', 'M', 14, 'B', ['Input'], ['single line', 'multi line', 'attachments', 'stop', 'model chip'], '');
t('PromptSuggestions', 'component', 'S', 14, 'B', [], ['chips', 'cards'], '');
t('PromptHistory', 'pattern', 'S', 14, 'B', ['SearchField'], ['list', 'search'], '');
t('StreamingText', 'component', 'M', 14, 'B', ['LiveRegion'], ['streaming', 'done', 'stopped'], '');
t('Thinking', 'extend', 'S', 14, 'B', [], ['thinking', 'with steps'], 'Chat.Typing as the processing state', EX.Chat);
t('AIChat', 'pattern', 'M', 14, 'B', ['PromptInput', 'StreamingText'], ['panel', 'full page'], 'extends Chat');
t('Citation', 'component', 'S', 14, 'C', ['Popover'], ['inline marker', 'source card', 'source list'], 'AI citation + Source reference');
t('SuggestedEdit', 'component', 'M', 14, 'C', [], ['inline diff', 'accept', 'reject', 'accept all'], '');
t('SuggestedAction', 'component', 'S', 14, 'C', [], ['chip', 'card'], '');
t('RefineMenu', 'component', 'S', 14, 'C', ['Menu'], ['shorter', 'longer', 'tone', 'custom prompt'], '');
t('AssistantPanel', 'pattern', 'L', 14, 'C', ['AIChat'], ['inspector', 'overlay'], '');
t('AISearch', 'pattern', 'M', 14, 'C', ['GeneratedContent', 'Citation'], ['answer above results', 'semantic toggle'], '');
t('Recommendation', 'pattern', 'S', 14, 'C', ['Carousel'], ['row', 'with reason'], '');

/* ───────── wave 15: templates, content design, implementation, packages ───────── */
t('templates', 'template', 'L', 15, 'A', ['FormFlow', 'EmptyState', 'FeatureCard', 'SecondaryPane', 'Auth'], ['landing page', 'create page', 'edit page', 'error page (404/403/500)', 'full-screen experience', 'split workspace', 'authentication page',
  'and the 8 existing unbuilt template records: listing, content-management, master-detail, single-pane, full-screen workspace, detail, home, search results'],
  'platform/templates/<Name>/ (exported): page templates from existing parts; each with a live demo page');
t('ActionBar', 'extend', 'S', 15, 'A', ['Sticky'], ['page actions bar (sticky bottom)'], 'ActionBar sticky', EX.ActionBar);
t('content-lint', 'foundation', 'M', 15, 'B', [], ['sentence case', 'American English', 'inclusive terms', 'glossary', 'action verbs', 'alt text required'],
  'platform/standards/content/*.json + check-copy.js run by check-system over strings defaults and the spec', ['platform/standards/content/', 'check-copy.js']);
t('i18n', 'foundation', 'L', 15, 'B', ['format', 'direction'], ['LocaleProvider', 'message catalog per locale', 'plural rules', 'strings props fed from the catalog'], '', ['platform/providers/LocaleProvider.jsx', 'platform/i18n/en.json']);
t('content-guides', 'doc', 'S', 15, 'B', [], [], 'records with guidance and live examples only', []);
t('impl-records', 'extend', 'S', 15, 'C', [], [], 'records for what exists: Platforms Standard, mobile web, desktop, native', ['platform/design-system/platforms-standard.js']);
t('perf-budget', 'foundation', 'S', 15, 'C', [], ['bundle size budget', 'CSS size budget'], 'check in build-packages.js output + CI', ['tests/perf.test.js']);
t('analytics', 'foundation', 'M', 15, 'C', [], ['AnalyticsProvider', 'track()', 'data-plx-track attributes', 'no vendor'], '', ['platform/providers/AnalyticsProvider.jsx']);
t('browser-support', 'foundation', 'S', 15, 'C', [], ['browserslist', 'feature checks', 'fallbacks list'], '', ['package.json', 'platform/standards/browsers.json']);
t('pkg-vue', 'package', 'L', 16, 'A', [], ['Vue 3 components that mount the CDN React build in a host element', 'v-model bindings', 'typed props from build-types.js'], '@plenix-ds/vue', ['packages/vue/', 'build-packages.d/vue.js']);
t('pkg-angular', 'package', 'L', 16, 'B', [], ['Angular standalone components that mount the CDN React build', 'ControlValueAccessor for form controls', 'typed inputs from build-types.js'], '@plenix-ds/angular', ['packages/angular/', 'build-packages.d/angular.js']);
t('pkg-wc', 'package', 'L', 16, 'A', [], ['custom elements (plx-*) wrapping the React components (React in shadow root) or CSS-only elements'], '@plenix-ds/web-components', ['packages/web-components/', 'build-packages.d/web-components.js']);
t('pkg-lint', 'package', 'M', 16, 'C', [], ['stylelint plugin', 'eslint plugin'], '@plenix-ds/lint from check-system rules', ['packages/lint/', 'build-packages.d/lint.js']);
t('pkg-mcp', 'package', 'M', 16, 'C', [], ['tokens', 'components', 'search', 'usage'], '@plenix-ds/mcp over /api/v1', ['packages/mcp/', 'build-packages.d/mcp.js']);
t('pkg-figma', 'package', 'M', 16, 'B', [], ['Code Connect mappings', 'variables export'], 'from figma-map.json and native-design.json', ['packages/figma/', 'build-packages.d/figma.js']);

/* ───────── existing-code covers: records only (the 49 cross-section covers) ───────── */
const COVER = {   // existing record id → existing component name (for 'c' rows)
};
module.exports = { T, EX };
t('RichTextEditor', 'component', 'L', 6, 'A', ['RichText'], ['basic (bold, italic, link, lists)', 'full toolbar', 'markdown shortcuts', 'mentions slot', 'read-only'], 'contenteditable on the Selection API with the existing Toolbar (formatting toolbar)');
t('CodeEditor', 'component', 'L', 6, 'B', [], ['plain', 'with line numbers', 'read-only', 'languages of CodeBlock'], 'a textarea under the CodeBlock highlighter (no dependency)');
module.exports.T = T;
