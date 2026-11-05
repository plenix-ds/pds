/* Plenix design system · common-ground guidance for the items Plenix has not built yet (batch 205): what the enterprise
   design systems (Carbon, Atlassian, Material 3, Fluent 2, Polaris, Spectrum) agree on, written as Plenix guidance. Keyed by
   "<section id>|<item>"; a placeholder page shows it (spec.js). Generated from the research files; edit here. */
window.DSGuidance = {
 "foundations|Logos": {
  "text": "The official graphic signature of Plenix: the symbol and the name in a fixed lockup.",
  "purpose": "Identifies the product owner consistently on every surface, so users can trust where they are.",
  "use": [
   "The app shell header, sign-in screens, and exported documents.",
   "Only the supplied logo files, in their approved color variants."
  ],
  "avoid": [
   "As a decorative pattern or inside body text: use the wordmark or plain product name.",
   "Do not place the logo on busy images where it loses contrast."
  ],
  "anatomy": [
   "Symbol — the graphic mark of the lockup.",
   "Name — the set type that spells the brand.",
   "Clear space — the protected margin around the lockup, defined in grid units.",
   "Minimum size — the smallest height at which the lockup stays legible."
  ],
  "behavior": [
   "Keep the lockup proportions fixed and never stretch, rotate, recolor, or add effects.",
   "Switch to the light or dark variant based on the surface, never by inverting colors manually.",
   "Scale the lockup in whole grid steps and keep the clear space free of other elements."
  ],
  "accessibility": [
   "Give the logo a text alternative naming the brand, or hide it from assistive technology when the name appears next to it.",
   "When the logo is a link to home, label the link with its destination, for example \"Plenix home\".",
   "Keep at least 3:1 contrast between the logo and its background."
  ],
  "content": [
   "Do not add taglines or product names inside the lockup unless an approved lockup exists.",
   "Spell the brand name exactly as registered in all accompanying text."
  ],
  "map": [
   [
    "Atlassian",
    "Logo",
    "Direct"
   ]
  ],
  "commonGround": "Atlassian ships logo assets as a component and IBM documents logos in its brand language; both require fixed proportions, protected clear space, a minimum size, and approved color variants only. Most other systems leave logos to separate brand guidelines.",
  "sources": [
   "https://atlassian.design/components/logo/examples",
   "https://www.ibm.com/design/language/ibm-logos/8-bar/",
   "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html"
  ]
 },
 "foundations|Wordmarks": {
  "text": "The brand or product name set as a fixed piece of lettering, used without the symbol.",
  "purpose": "Names the product clearly where the full logo is too large or the symbol alone would not be recognized.",
  "use": [
   "Narrow headers, footers, and co-branding where only the name fits.",
   "The audience may not yet recognize the symbol."
  ],
  "avoid": [
   "Retyping the wordmark in a UI font: use the supplied artwork.",
   "Where a small square mark is needed, such as app icons: use the brand mark."
  ],
  "anatomy": [
   "Lettering — the fixed artwork of the name.",
   "Clear space — the protected margin around the lettering.",
   "Minimum width — the smallest size at which the lettering stays legible."
  ],
  "behavior": [
   "Keep spacing, weight, and proportions of the lettering unchanged.",
   "Use only the approved color variants for light and dark surfaces."
  ],
  "accessibility": [
   "Give the brand name as the text alternative, or hide the artwork when the name is also present as text.",
   "Keep at least 3:1 contrast against the background."
  ],
  "content": [
   "Do not combine the wordmark with other words to form new names.",
   "Write the brand name in running text in normal type, not as the wordmark image."
  ],
  "map": [
   [
    "Atlassian",
    "Logo (wordmark appearance)",
    "Partial"
   ]
  ],
  "commonGround": "Brand guidance from Atlassian and IBM treats the wordmark as fixed artwork with clear space and minimum size; systems agree it must never be retyped or altered.",
  "sources": [
   "https://atlassian.design/components/logo/examples",
   "https://www.ibm.com/design/language/ibm-logos/8-bar/"
  ]
 },
 "foundations|Brand marks": {
  "text": "The symbol of the Plenix brand, used on its own without the name.",
  "purpose": "Gives a compact, recognizable signature for small or square spaces.",
  "use": [
   "Favicons, app icons, avatars of the system account, and tight headers.",
   "Only where the surrounding context already establishes the brand."
  ],
  "avoid": [
   "A generic icon for actions: use a UI icon instead.",
   "First-contact surfaces where users may not know the brand: use the full logo."
  ],
  "anatomy": [
   "Symbol — the fixed graphic artwork.",
   "Container — the optional approved tile or circle for app icons.",
   "Clear space — the protected margin around the symbol."
  ],
  "behavior": [
   "Keep the symbol shape and color unchanged; use only approved one-color or full-color variants.",
   "Scale it only to approved sizes so its detail stays crisp."
  ],
  "accessibility": [
   "When the mark carries meaning, give it the brand name as its accessible name; otherwise mark it decorative.",
   "Keep at least 3:1 contrast against the background."
  ],
  "content": [
   "Pair the mark with the brand name in text when the context does not already name the brand.",
   "Do not add text inside or around the mark to form a new lockup."
  ],
  "map": [
   [
    "Atlassian",
    "Logo (icon appearance)",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian offers icon-only logo variants and IBM brand guidance defines the standalone symbol; both restrict alteration and require clear space.",
  "sources": [
   "https://atlassian.design/components/logo/examples",
   "https://www.ibm.com/design/language/ibm-logos/8-bar/"
  ]
 },
 "foundations|Product marks": {
  "text": "The icon that identifies one Plenix app, such as DAM, Notes, or Dashboard, within the suite.",
  "purpose": "Helps users tell suite apps apart quickly in switchers, launchers, and headers.",
  "use": [
   "The app switcher, the shell header, and app launch tiles.",
   "One mark per product, applied the same way everywhere."
  ],
  "avoid": [
   "Labeling a feature inside an app: use a UI icon.",
   "A temporary or experimental area gets no product mark."
  ],
  "anatomy": [
   "Glyph — the product-specific symbol.",
   "Tile — the shared shape and color family that ties marks to the suite.",
   "Product name — the text label shown next to the mark."
  ],
  "behavior": [
   "Keep all product marks on one shared tile shape, size scale, and color system.",
   "Show the product name next to the mark in switchers and menus."
  ],
  "accessibility": [
   "Give the mark the product name as its accessible name, or hide it when the name is visible next to it.",
   "Do not rely on the mark color alone to tell products apart."
  ],
  "content": [
   "Use the exact product name next to the mark, in title form, as registered.",
   "Do not shorten or nickname product names next to their marks."
  ],
  "map": [
   [
    "Atlassian",
    "Logo (product logos)",
    "Partial"
   ],
   [
    "Fluent 2",
    "Product icons",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian provides per-product logos on one family style and Microsoft keeps product icons in one visual family; both pair the mark with the product name in switchers.",
  "sources": [
   "https://atlassian.design/components/logo/examples",
   "https://fluent2.microsoft.design/iconography"
  ]
 },
 "foundations|Brand application": {
  "text": "Defines how Plenix brand elements appear inside the product UI.",
  "purpose": "Keeps the product recognizably Plenix without letting the brand compete with user content and tasks.",
  "use": [
   "Brand color, the logo, and illustration: in the shell, sign-in, onboarding, and empty states.",
   "The brand palette, through semantic tokens, never raw color values."
  ],
  "avoid": [
   "Do not apply brand color to status, data, or interactive states that have their own semantic roles.",
   "Marketing imagery or slogans in task screens."
  ],
  "anatomy": [
   "Brand surfaces — the few places brand expression is allowed.",
   "Brand tokens — the semantic tokens that carry brand color.",
   "Brand assets — the approved logo, marks, and illustrations."
  ],
  "behavior": [
   "Keep brand expression strong at entry points and quiet in dense work areas.",
   "Apply brand color through tokens so themes and modes stay consistent.",
   "Review new brand use against contrast and density rules before release."
  ],
  "accessibility": [
   "Brand-colored text and controls meet the same contrast rules as any other UI.",
   "Do not rely on brand color alone to signal meaning."
  ],
  "content": [
   "Use the product voice in branded areas, not marketing copy.",
   "Keep brand names and product names spelled exactly as registered."
  ],
  "map": [
   [
    "Material 3",
    "Dynamic color / brand color",
    "Partial"
   ],
   [
    "Fluent 2",
    "Brand ramp",
    "Partial"
   ],
   [
    "Atlassian",
    "Brand",
    "Partial"
   ],
   [
    "Polaris",
    "Colors",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree that brand color enters the UI through a defined ramp or tokens, and that semantic roles such as status and data colors stay separate from it.",
  "sources": [
   "https://fluent2.microsoft.design/color",
   "https://m3.material.io/styles/color/overview",
   "https://github.com/Shopify/polaris-react-archive/blob/main/polaris.shopify.com/content/design/colors/index.mdx"
  ]
 },
 "foundations|Illustrations": {
  "text": "Drawn images that explain a state, concept, or task in the product.",
  "purpose": "Make empty, error, and onboarding moments easier to understand and less abrupt.",
  "use": [
   "Empty states, first-run onboarding, and major error pages.",
   "One consistent illustration style, palette, and line weight across the suite."
  ],
  "avoid": [
   "Dense work areas, or inside tables and forms.",
   "Do not use an illustration to carry information missing from the text."
  ],
  "anatomy": [
   "Image — the drawn artwork in the approved style.",
   "Message — the heading and text that the image supports.",
   "Action — the optional next step shown with the message."
  ],
  "behavior": [
   "Size the illustration to the container so it never pushes the main action off screen.",
   "Hide or shrink illustrations in compact density and on small viewports.",
   "Provide light and dark variants when the art uses background colors."
  ],
  "accessibility": [
   "Mark illustrations as decorative when the text already conveys the meaning.",
   "Give an informative illustration a short text alternative."
  ],
  "content": [
   "Write the message so it stands on its own without the image.",
   "Keep the heading short and pair it with one clear next step."
  ],
  "map": [
   [
    "Carbon",
    "Illustrations (empty states)",
    "Partial"
   ],
   [
    "Atlassian",
    "Illustrations",
    "Direct"
   ],
   [
    "Spectrum",
    "Illustration",
    "Direct"
   ],
   [
    "Polaris",
    "Illustrations",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Spectrum, and Polaris agree on one illustration style for empty states and onboarding, always supported by text; Carbon uses illustration mainly in empty states.",
  "sources": [
   "https://atlassian.design/foundations/illustrations",
   "https://spectrum.adobe.com/foundations/visual-language/illustration",
   "https://www.carbondesignsystem.com/building-blocks/core/patterns/empty-states"
  ]
 },
 "foundations|Data visualization colors": {
  "text": "The palettes reserved for charts and graphs: categorical, sequential, diverging, and alert.",
  "purpose": "Let users tell series apart and read values reliably, without clashing with UI status colors.",
  "use": [
   "Categorical palettes for unrelated series, sequential for ordered values, diverging for values around a midpoint.",
   "The palettes in their defined order, so colors stay consistent across charts."
  ],
  "avoid": [
   "UI status colors, such as error red, for ordinary data series.",
   "More than about six categorical colors in one chart: group or filter instead."
  ],
  "anatomy": [
   "Categorical palette — distinct hues for unrelated series.",
   "Sequential palette — light-to-dark steps of one hue.",
   "Diverging palette — two hues meeting at a neutral midpoint.",
   "Alert colors — status colors kept for thresholds and alerts."
  ],
  "behavior": [
   "Assign colors to series in palette order; keep a series on the same color across views.",
   "Provide palette variants for light and dark themes.",
   "Pair color with labels, patterns, or shapes when series must be told apart."
  ],
  "accessibility": [
   "Keep at least 3:1 contrast between chart marks and the background.",
   "Never use color as the only way to tell series apart; add labels, markers, or patterns.",
   "Check palettes against common color-vision deficiencies."
  ],
  "content": [
   "Label series directly where possible, not through a color legend alone.",
   "Name colors in legends by series, never by color name."
  ],
  "map": [
   [
    "Carbon",
    "Data visualization color palettes",
    "Direct"
   ],
   [
    "Spectrum",
    "Color for data visualization",
    "Direct"
   ],
   [
    "Atlassian",
    "Chart colors (data visualization tokens)",
    "Partial"
   ],
   [
    "Polaris",
    "Data visualization colors",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Spectrum both define categorical, sequential, and diverging palettes with a fixed order and 3:1 contrast for marks; both warn against color as the only cue.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/data-visualization/color-palettes",
   "https://spectrum.adobe.com/foundations/visual-language/color",
   "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
  ]
 },
 "foundations|Contrast rules": {
  "text": "Set the minimum luminance contrast between text, icons, and controls and what sits behind them.",
  "purpose": "Make content readable for people with low vision and in poor lighting.",
  "use": [
   "4.5:1 for body text; 3:1 for large text, icons, control borders, and focus indicators.",
   "Choosing or pairing any color token."
  ],
  "avoid": [
   "Lower contrast to show that something is secondary: use size, weight, or position instead.",
   "Do not treat disabled controls as a reason to pass off unreadable active content."
  ],
  "anatomy": [
   "Text contrast — 4.5:1 for normal text, 3:1 for large text.",
   "Non-text contrast — 3:1 for icons, borders, and state indicators.",
   "Exemptions — disabled controls, logos, and pure decoration."
  ],
  "behavior": [
   "Check contrast for every theme and every interaction state, not just the default.",
   "Pair tokens so foreground and background roles always meet the rule together.",
   "Test text on images and gradients at the worst point."
  ],
  "accessibility": [
   "Meet WCAG 2.2 level AA as the minimum for all UI.",
   "Support forced-colors and high-contrast modes in addition to these ratios."
  ],
  "content": [
   "Do not convey meaning with color words alone, such as \"click the green button\".",
   "Keep placeholder and helper text at full text contrast: users must read it."
  ],
  "map": [
   [
    "Carbon",
    "Color accessibility",
    "Direct"
   ],
   [
    "Material 3",
    "Color contrast",
    "Direct"
   ],
   [
    "Fluent 2",
    "Color accessibility",
    "Direct"
   ],
   [
    "Spectrum",
    "Color system contrast",
    "Direct"
   ],
   [
    "Atlassian",
    "Accessible colors",
    "Direct"
   ],
   [
    "Polaris",
    "Color accessibility",
    "Partial"
   ]
  ],
  "commonGround": "All systems adopt WCAG AA: 4.5:1 for normal text and 3:1 for large text and UI graphics. Spectrum and Material build contrast into token pairs; Carbon and Fluent document it per theme.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html",
   "https://www.carbondesignsystem.com/building-blocks/foundations/color/overview",
   "https://spectrum.adobe.com/foundations/visual-language/color",
   "https://fluent2.microsoft.design/color"
  ]
 },
 "foundations|Body styles": {
  "text": "The type styles for running text, descriptions, and most UI content.",
  "purpose": "Give long and short text a comfortable, consistent reading size across the product.",
  "use": [
   "The standard body style: paragraphs, descriptions, and table cell text.",
   "The small body style: only dense, secondary content."
  ],
  "avoid": [
   "Headings or control labels: use heading or label styles.",
   "Several body sizes in one block of content."
  ],
  "anatomy": [
   "Font — the Sans UI family.",
   "Size and line height — set by token; line height about 1.4 to 1.5 times the size.",
   "Weight — regular, with a semibold step for emphasis."
  ],
  "behavior": [
   "Keep line length near 50 to 80 characters for long text.",
   "Use bold sparingly for emphasis; not italics or underline.",
   "Let body text scale with user font settings."
  ],
  "accessibility": [
   "Do not set body text below 12px; prefer 14px for primary content.",
   "Meet 4.5:1 contrast for body text.",
   "Allow text to resize to 200% without losing content."
  ],
  "content": [
   "Write short paragraphs and lead with the key point.",
   "Use lists, not long sentences, when content has several parallel items."
  ],
  "map": [
   [
    "Carbon",
    "Body (type sets)",
    "Direct"
   ],
   [
    "Material 3",
    "Body",
    "Direct"
   ],
   [
    "Fluent 2",
    "Body",
    "Direct"
   ],
   [
    "Atlassian",
    "Body",
    "Direct"
   ],
   [
    "Polaris",
    "Body (Text variant)",
    "Direct"
   ],
   [
    "Spectrum",
    "Body",
    "Direct"
   ]
  ],
  "commonGround": "Every system defines a small set of body sizes on a token scale, with 14px as the common UI default and generous line height; only the step names differ.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/foundations/typography/type-sets",
   "https://m3.material.io/styles/typography/type-scale-tokens",
   "https://fluent2.microsoft.design/typography",
   "https://spectrum.adobe.com/foundations/typography/overview"
  ]
 },
 "foundations|Label styles": {
  "text": "Compact type styles for control text, field labels, tags, and small UI headings.",
  "purpose": "Keep short interface text legible in tight spaces without competing with content.",
  "use": [
   "Buttons, field labels, tabs, menu items, and tags.",
   "The semibold label, for short group headings inside panels."
  ],
  "avoid": [
   "Sentences or paragraphs: use body styles.",
   "All-caps labels for long text."
  ],
  "anatomy": [
   "Font — the Sans UI family.",
   "Size — the control text size set by density.",
   "Line height — tight, matched to control height.",
   "Weight — regular or semibold."
  ],
  "behavior": [
   "Keep labels on one line inside controls and truncate only as a last resort.",
   "Tie label size to the density setting, not to each component."
  ],
  "accessibility": [
   "Keep label text at 12px or larger and at 4.5:1 contrast.",
   "Make visible labels match the accessible name of the control."
  ],
  "content": [
   "Write labels in sentence case, short, and without ending punctuation.",
   "Lead with the key word so labels scan quickly."
  ],
  "map": [
   [
    "Carbon",
    "Label (productive type)",
    "Direct"
   ],
   [
    "Material 3",
    "Label",
    "Direct"
   ],
   [
    "Fluent 2",
    "Caption / Body strong",
    "Partial"
   ],
   [
    "Spectrum",
    "Component text sizes",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Material define explicit label styles for control text; Fluent and Spectrum reach the same result through component text sizes; all keep labels short, single line, and sentence case.",
  "sources": [
   "https://m3.material.io/styles/typography/type-scale-tokens",
   "https://www.carbondesignsystem.com/building-blocks/foundations/typography/type-sets",
   "https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html"
  ]
 },
 "foundations|Caption styles": {
  "text": "The smallest text styles, for helper text, metadata, and footnotes.",
  "purpose": "Let secondary details sit near the content they describe without crowding it.",
  "use": [
   "Helper text under fields, timestamps, and image captions.",
   "Metadata such as file size or author."
  ],
  "avoid": [
   "Do not put essential instructions or errors only in caption text.",
   "Interactive labels."
  ],
  "anatomy": [
   "Font — the Sans UI family.",
   "Size — the smallest step of the type scale.",
   "Color — secondary text role."
  ],
  "behavior": [
   "Place captions directly next to the element they describe.",
   "Keep captions to one or two lines."
  ],
  "accessibility": [
   "Keep caption text at 12px or larger.",
   "Meet 4.5:1 contrast even in the secondary text color.",
   "Link helper captions to their field with aria-describedby."
  ],
  "content": [
   "Write captions as short fragments or one sentence.",
   "Do not repeat the main label in the caption."
  ],
  "map": [
   [
    "Carbon",
    "Helper text / Legal (type sets)",
    "Partial"
   ],
   [
    "Fluent 2",
    "Caption",
    "Direct"
   ],
   [
    "Material 3",
    "Body small / Label small",
    "Partial"
   ],
   [
    "Atlassian",
    "Small text",
    "Partial"
   ],
   [
    "Spectrum",
    "Detail",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on one smallest text step, at about 12px, kept to secondary information with full text contrast; Fluent names it caption while others name it helper, small, or detail.",
  "sources": [
   "https://fluent2.microsoft.design/typography",
   "https://www.carbondesignsystem.com/building-blocks/foundations/typography/type-sets",
   "https://spectrum.adobe.com/foundations/typography/overview"
  ]
 },
 "foundations|Text truncation": {
  "text": "Shortens text that does not fit its container, usually with an ellipsis.",
  "purpose": "Keeps layouts stable when names, paths, or values are longer than the space allows.",
  "use": [
   "Item names in tables, lists, tabs, and breadcrumbs where width is fixed.",
   "File names and paths: truncate in the middle so the start and extension stay visible."
  ],
  "avoid": [
   "Headings, error messages, or instructions: wrap them instead.",
   "Containers that can grow or wrap at no cost."
  ],
  "anatomy": [
   "Visible text — the part that fits.",
   "Ellipsis — the mark that shows text is cut.",
   "Full text access — a tooltip or detail view showing the whole value."
  ],
  "behavior": [
   "Truncate at the end by default; in the middle for file names and identifiers.",
   "Show the full text on hover and on keyboard focus.",
   "Prefer wrapping to two lines before truncating in cards and descriptions."
  ],
  "accessibility": [
   "Keep the full text available to screen readers, not only the truncated part.",
   "Make the full-text tooltip reachable by keyboard focus, not only by hover."
  ],
  "content": [
   "Put the distinguishing part of a name first so truncation does not hide it.",
   "Avoid long names in source data where users can choose them, such as default file names."
  ],
  "map": [
   [
    "Carbon",
    "Overflow content",
    "Direct"
   ],
   [
    "Atlassian",
    "Truncation (Text maxLines)",
    "Partial"
   ],
   [
    "Spectrum",
    "Truncation",
    "Partial"
   ],
   [
    "Polaris",
    "Text truncate",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Spectrum both truncate at the end by default, use middle truncation for paths and file names, and require a way to see the full text; Polaris and Atlassian offer truncation as a text option.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/core/patterns/overflow-content",
   "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-overflow"
  ]
 },
 "foundations|Display type": {
  "text": "The largest text style, for hero numbers and page-level statements.",
  "purpose": "Draws attention to a single key message or metric on a screen.",
  "use": [
   "A dashboard key figure, or a sign-in or onboarding heading.",
   "At most one display element per screen."
  ],
  "avoid": [
   "Dense work areas, dialogs, or panels: use heading styles.",
   "Long text that wraps over several lines."
  ],
  "anatomy": [
   "Font — the Sans UI family in a light or regular weight.",
   "Size — the top steps of the type scale.",
   "Line height — tight, about 1.1 to 1.2."
  ],
  "behavior": [
   "Scale display sizes down on small viewports.",
   "Keep display text short so it stays on one or two lines."
  ],
  "accessibility": [
   "Keep a correct heading level in the markup even when the visual style is display.",
   "Let display text resize without clipping."
  ],
  "content": [
   "Write display text as a short phrase or a number with its unit.",
   "Do not end display text with a period unless it is a full sentence."
  ],
  "map": [
   [
    "Material 3",
    "Display",
    "Direct"
   ],
   [
    "Carbon",
    "Display (expressive type)",
    "Direct"
   ],
   [
    "Fluent 2",
    "Display / Large title",
    "Direct"
   ],
   [
    "Spectrum",
    "Heading XXL+",
    "Partial"
   ]
  ],
  "commonGround": "Material, Carbon, and Fluent each reserve the largest sizes for brief, high-impact text, keep it out of dense productive UI, and scale it down responsively.",
  "sources": [
   "https://m3.material.io/styles/typography/type-scale-tokens",
   "https://www.carbondesignsystem.com/building-blocks/foundations/typography/type-sets",
   "https://fluent2.microsoft.design/typography"
  ]
 },
 "foundations|Tabular figures": {
  "text": "Digits of equal width, so numbers line up in columns.",
  "purpose": "Make numbers easy to compare down a column and stop values from shifting as they update.",
  "use": [
   "Table columns, totals, timers, and live counters.",
   "Numeric columns, with right alignment."
  ],
  "avoid": [
   "Running text: proportional figures read better there.",
   "Do not switch to the mono font just to align numbers."
  ],
  "anatomy": [
   "Feature — the font-variant-numeric tabular-nums setting.",
   "Alignment — right alignment, or alignment on the decimal point.",
   "Precision — the same number of decimals across a column."
  ],
  "behavior": [
   "Turn on tabular figures through a text style or utility, never per element.",
   "Keep decimals consistent within one column."
  ],
  "accessibility": [
   "Pair aligned numbers with clear column headers and units for screen readers.",
   "Keep numbers as real text, not images, so they can be read and zoomed."
  ],
  "content": [
   "Put units in the column header, not in every cell.",
   "Use the same decimal places for every value in a column."
  ],
  "map": [
   [
    "Carbon",
    "Data grid numeric alignment",
    "Partial"
   ],
   [
    "Polaris",
    "Text numeric",
    "Direct"
   ],
   [
    "Atlassian",
    "Tabular numbers",
    "Partial"
   ],
   [
    "Spectrum",
    "Table numeric columns",
    "Partial"
   ]
  ],
  "commonGround": "Polaris exposes a numeric text option, and Carbon, Atlassian, and Spectrum right-align numeric columns; all agree numbers in columns must align and keep consistent precision.",
  "sources": [
   "https://github.com/Shopify/polaris-react-archive/blob/main/polaris.shopify.com/content/components/typography/text.mdx",
   "https://www.carbondesignsystem.com/building-blocks/core/components/data-grid/specifications",
   "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variant-numeric"
  ]
 },
 "foundations|Pictograms": {
  "text": "Larger, more detailed symbols that represent concepts, not actions.",
  "purpose": "Add visual meaning to empty states, feature tiles, and onboarding without full illustration.",
  "use": [
   "Empty states, feature cards, and marketing-style overview pages.",
   "Large sizes, such as 48px and up."
  ],
  "avoid": [
   "Buttons or inline action icons: use UI icons.",
   "Do not mix pictograms and illustrations in one view."
  ],
  "anatomy": [
   "Symbol — a single-weight line drawing of a concept.",
   "Size — one of the large pictogram sizes.",
   "Color — one neutral or brand role."
  ],
  "behavior": [
   "Keep one style, stroke, and size per view.",
   "Pair each pictogram with a text label or heading."
  ],
  "accessibility": [
   "Mark pictograms decorative when a visible label states the same idea.",
   "Keep 3:1 contrast when the pictogram carries meaning."
  ],
  "content": [
   "Name the concept in the nearby heading, not in the image.",
   "Do not add text inside the pictogram artwork."
  ],
  "map": [
   [
    "Carbon",
    "Pictograms",
    "Direct"
   ],
   [
    "Spectrum",
    "Illustrations (spot)",
    "Partial"
   ],
   [
    "Atlassian",
    "Spot illustrations",
    "Partial"
   ]
  ],
  "commonGround": "Carbon defines pictograms as a set separate from icons, for concepts at large sizes; Atlassian and Spectrum fill the same role with spot illustrations. All keep them out of interactive controls.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/foundations/pictograms/guidelines",
   "https://atlassian.design/foundations/illustrations"
  ]
 },
 "foundations|Icon tile": {
  "text": "An icon placed on a colored or tinted square or rounded tile.",
  "purpose": "Gives an object type, app, or category a strong, scannable visual marker.",
  "use": [
   "Marking object types, integrations, or categories in lists and cards.",
   "A fixed set of tile sizes on the 4px grid."
  ],
  "avoid": [
   "Actions: use icon buttons.",
   "Do not create new tile colors outside the palette tokens."
  ],
  "anatomy": [
   "Tile — the shaped background with a color role.",
   "Icon — a UI icon centered on the tile.",
   "Size — a named size that sets both tile and icon."
  ],
  "behavior": [
   "Center the icon on the tile; size both together by named size.",
   "Keep one tile shape and radius role across the product."
  ],
  "accessibility": [
   "Keep 3:1 contrast between icon and tile.",
   "Mark the tile decorative when a text label is next to it."
  ],
  "content": [
   "Pair every tile with a visible name for the object or category.",
   "Do not put letters or numbers inside the tile in place of an icon."
  ],
  "map": [
   [
    "Atlassian",
    "Icon tile",
    "Direct"
   ],
   [
    "Fluent 2",
    "Avatar (icon) / product tiles",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian defines an icon tile with fixed sizes and color appearances; Fluent uses icon-on-shape patterns for avatars and app tiles; both pair tiles with a text label.",
  "sources": [
   "https://atlassian.design/components/icon/icon-tile/examples",
   "https://fluent2.microsoft.design/iconography"
  ]
 },
 "foundations|Loading motion": {
  "text": "Animation that shows the system is working, such as spinners, progress bars, and skeleton shimmer.",
  "purpose": "Tells users their request is in progress so they wait instead of retrying.",
  "use": [
   "Known duration: a determinate progress bar.",
   "Short waits: a spinner; known page structure: a skeleton."
  ],
  "avoid": [
   "Do not show loading motion for waits under about one second.",
   "Several spinners stacked in one view: use one per region."
  ],
  "anatomy": [
   "Indicator — the spinner, bar, or skeleton.",
   "Label — optional text naming the task.",
   "Timing — a linear or steady loop with no bouncing."
  ],
  "behavior": [
   "Delay the indicator briefly so fast responses do not flash it.",
   "Replace skeletons with content in place, without layout shift.",
   "Switch to a determinate indicator when progress can be measured."
  ],
  "accessibility": [
   "Expose progress with role=\"progressbar\" or a status message for screen readers.",
   "Respect reduced-motion settings by slowing or stopping shimmer.",
   "Avoid flashing more than three times per second."
  ],
  "content": [
   "Name the task in the label, for example \"Uploading 3 files\".",
   "Do not write \"Please wait\"; state what is happening instead."
  ],
  "map": [
   [
    "Carbon",
    "Loading pattern",
    "Direct"
   ],
   [
    "Material 3",
    "Progress indicators",
    "Direct"
   ],
   [
    "Fluent 2",
    "Spinner / Skeleton",
    "Direct"
   ],
   [
    "Atlassian",
    "Spinner / Skeleton",
    "Direct"
   ],
   [
    "Polaris",
    "Spinner / Skeleton",
    "Direct"
   ],
   [
    "Spectrum",
    "Progress circle",
    "Direct"
   ]
  ],
  "commonGround": "All systems pick determinate indicators for known durations, spinners for short unknown waits, and skeletons for known layouts; they also agree on short delays against flicker.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/core/patterns/loading",
   "https://m3.material.io/components/progress-indicators/overview",
   "https://spectrum.adobe.com/foundations/behavior/feedback",
   "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html"
  ]
 },
 "foundations|Gesture motion": {
  "text": "The movement that follows direct manipulation, such as dragging, swiping, and pull to refresh.",
  "purpose": "Shows that an element is tracking the pointer or finger, and where it will land.",
  "use": [
   "Drag and drop, resizable panes, and swipe actions on touch.",
   "The element follows the input without delay."
  ],
  "avoid": [
   "A task that depends only on a gesture: provide a button or menu alternative.",
   "Bounce or overshoot in work areas."
  ],
  "anatomy": [
   "Tracking — the element follows the pointer one to one.",
   "Release — the element settles into place with a short ease-out.",
   "Threshold — the distance at which a gesture commits."
  ],
  "behavior": [
   "Show the commit point before release, for example with a drop target highlight.",
   "If the gesture is canceled, return the element to its origin with motion."
  ],
  "accessibility": [
   "Provide single-pointer and keyboard alternatives for every gesture.",
   "Allow canceling a drag with Escape.",
   "Respect reduced-motion by removing settle animation."
  ],
  "content": [
   "Name gesture actions in visible menus so people can find them without the gesture.",
   "Describe gestures in help text by result, for example \"Drag to reorder\"."
  ],
  "map": [
   [
    "Material 3",
    "Gestures",
    "Direct"
   ],
   [
    "Fluent 2",
    "Motion (direct manipulation)",
    "Partial"
   ],
   [
    "Spectrum",
    "Motion",
    "Partial"
   ],
   [
    "Atlassian",
    "Drag and drop",
    "Partial"
   ]
  ],
  "commonGround": "Material and Fluent agree that manipulated elements track input directly and settle with deceleration; WCAG and all systems require a non-gesture alternative.",
  "sources": [
   "https://m3.material.io/foundations/interaction/gestures",
   "https://fluent2.microsoft.design/motion",
   "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html"
  ]
 },
 "foundations|High-contrast theme": {
  "text": "Replaces the color palette with one that maximizes contrast between text, controls, and backgrounds.",
  "purpose": "Serves people with low vision and people who use operating system contrast settings.",
  "use": [
   "The operating system reports forced colors or a contrast preference.",
   "A user setting next to light and dark."
  ],
  "avoid": [
   "A separate component set: map existing tokens to high-contrast values.",
   "Shadows or subtle fills to show boundaries in this theme."
  ],
  "anatomy": [
   "Token map — each color role pointed to a high-contrast value.",
   "Borders — visible outlines on all controls.",
   "Focus — a thick, highly visible focus indicator."
  ],
  "behavior": [
   "Honor forced-colors mode: use system colors and avoid background images for meaning.",
   "Show borders on all interactive elements and separators.",
   "Keep icons and states visible without color fills."
  ],
  "accessibility": [
   "Target 7:1 contrast for text where practical.",
   "Test with Windows contrast themes in forced-colors mode."
  ],
  "content": [
   "Do not write text that depends on color names, such as \"the red field\".",
   "Name the setting plainly, for example \"High contrast\"."
  ],
  "map": [
   [
    "Fluent 2",
    "High contrast",
    "Direct"
   ],
   [
    "Carbon",
    "Themes (high contrast guidance)",
    "Partial"
   ],
   [
    "Spectrum",
    "Windows High Contrast support",
    "Partial"
   ],
   [
    "Atlassian",
    "Increased contrast theme",
    "Direct"
   ]
  ],
  "commonGround": "Fluent and Atlassian provide high-contrast token sets; all systems agree on honoring forced-colors mode with visible borders and focus, not fills.",
  "sources": [
   "https://fluent2.microsoft.design/accessibility",
   "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors",
   "https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html"
  ]
 },
 "foundations|Product themes": {
  "text": "Token sets that give each Plenix app its own accent while sharing one base system.",
  "purpose": "Let users tell apps apart while components and behavior stay identical.",
  "use": [
   "Setting the accent color role for one app.",
   "Everything else uses the shared base tokens."
  ],
  "avoid": [
   "Do not change component shape, spacing, or type in a product theme.",
   "Do not let a product accent override status or data colors."
  ],
  "anatomy": [
   "Base theme — shared tokens for all apps.",
   "Accent tokens — the few roles a product may override.",
   "Mode — light or dark, applied on top of the product theme."
  ],
  "behavior": [
   "Apply the product theme at the app root through tokens.",
   "Combine the product theme and light or dark mode independently."
  ],
  "accessibility": [
   "Check every product accent for contrast in each mode.",
   "Do not use the product accent as the only cue for state or meaning."
  ],
  "content": [
   "Name product themes after the product, not after the color.",
   "Do not refer to product colors in UI instructions."
  ],
  "map": [
   [
    "Material 3",
    "Dynamic color / custom color schemes",
    "Partial"
   ],
   [
    "Fluent 2",
    "Brand ramp themes",
    "Direct"
   ],
   [
    "Carbon",
    "Themes",
    "Partial"
   ],
   [
    "Spectrum",
    "Themes (product color)",
    "Partial"
   ]
  ],
  "commonGround": "Fluent and Material generate themes from a brand or source color applied through tokens, keeping semantic roles separate; Carbon themes vary only color tokens.",
  "sources": [
   "https://fluent2.microsoft.design/color",
   "https://m3.material.io/styles/color/overview",
   "https://www.carbondesignsystem.com/building-blocks/foundations/themes/overview"
  ]
 },
 "foundations|Theme zones": {
  "text": "Page regions that use a different theme or mode from the rest, such as a dark header on a light page.",
  "purpose": "Separate chrome from content, or highlight a region, without new colors.",
  "use": [
   "The shell header, a media preview area, or a code panel.",
   "Apply a zone through a theme scope on a container, so all children follow."
  ],
  "avoid": [
   "Do not create many small zones on one page.",
   "Hand-coloring components inside a zone: set the zone theme."
  ],
  "anatomy": [
   "Scope — the container that sets the zone theme.",
   "Tokens — the same roles resolved to the zone theme values.",
   "Boundary — the edge where zones meet."
  ],
  "behavior": [
   "Let every component inside a zone inherit the zone tokens automatically.",
   "Keep focus, hover, and status states correct inside each zone."
  ],
  "accessibility": [
   "Check contrast for every component inside the zone.",
   "Keep focus indicators visible against the zone background."
  ],
  "content": [
   "Do not refer to a zone by its color in instructions.",
   "Give each zone a heading or landmark name that states its purpose."
  ],
  "map": [
   [
    "Carbon",
    "Inline theming (layered themes)",
    "Direct"
   ],
   [
    "Spectrum",
    "Theme provider (nested)",
    "Partial"
   ],
   [
    "Atlassian",
    "Nested themes",
    "Partial"
   ],
   [
    "Fluent 2",
    "Nested FluentProvider",
    "Partial"
   ]
  ],
  "commonGround": "Carbon documents inline theming of regions, and Spectrum and Fluent support nested theme providers; all apply the zone theme to a container so its children inherit it.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/foundations/themes/overview",
   "https://spectrum.adobe.com/foundations/system/theming"
  ]
 },
 "foundations|AI visual language": {
  "text": "The visual cues that mark content or actions produced by AI.",
  "purpose": "Tells users which content was generated, so they can judge and verify it.",
  "use": [
   "The AI marker: on generated text, suggestions, and AI-run actions.",
   "One consistent icon, label, and accent across the suite."
  ],
  "avoid": [
   "Do not mark ordinary automation or search as AI.",
   "Do not use AI styling as decoration or promotion."
  ],
  "anatomy": [
   "Marker — the AI icon or label on generated content.",
   "Explainability — a way to see how, and from what, the result was made.",
   "Controls — accept, edit, retry, or dismiss for AI output."
  ],
  "behavior": [
   "Keep AI output editable and reversible until the user accepts it.",
   "Show source or reasoning on request.",
   "Remove the marker only after a person has reviewed or edited the content, if policy allows."
  ],
  "accessibility": [
   "Give the marker an accessible name such as \"AI generated\".",
   "Do not rely on the accent color or gradient alone to signal AI."
  ],
  "content": [
   "State plainly that content was generated and may contain errors.",
   "Do not give AI features human names or personalities in work flows."
  ],
  "map": [
   [
    "Carbon",
    "Carbon for AI",
    "Direct"
   ],
   [
    "Fluent 2",
    "Copilot / AI design",
    "Partial"
   ],
   [
    "Atlassian",
    "AI (Atlassian Intelligence) patterns",
    "Partial"
   ],
   [
    "Polaris",
    "Magic (AI) patterns",
    "Partial"
   ],
   [
    "Spectrum",
    "AI guidelines",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and others agree on a consistent AI marker, explainability, and user control over generated content; they differ in how strongly they style AI.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/foundations/carbon-for-ai",
   "https://www.w3.org/WAI/ARIA/apg/"
  ]
 },
 "foundations|Design principles": {
  "text": "The short statements that guide every Plenix design decision.",
  "purpose": "Give teams a shared basis for choosing between valid options.",
  "use": [
   "Settling design debates and reviewing new components.",
   "No specific rule exists."
  ],
  "avoid": [
   "A substitute for concrete rules and tokens.",
   "Do not add a principle that cannot change a decision."
  ],
  "anatomy": [
   "Principle — a short, memorable statement.",
   "Meaning — one or two sentences on what it implies.",
   "Example — a decision it settles."
  ],
  "behavior": [
   "Keep a small set, about three to five.",
   "Refer to principles in reviews and in spec pages."
  ],
  "accessibility": [
   "Include accessibility as a principle or a non-negotiable baseline.",
   "Check every principle decision against WCAG 2.2 level AA."
  ],
  "content": [
   "Write each principle as a plain, active statement.",
   "Keep each principle to a short heading and one or two sentences."
  ],
  "map": [
   [
    "Carbon",
    "Design principles (IBM Design Language)",
    "Partial"
   ],
   [
    "Atlassian",
    "Design principles",
    "Direct"
   ],
   [
    "Fluent 2",
    "Design principles",
    "Direct"
   ],
   [
    "Polaris",
    "Experience values",
    "Partial"
   ],
   [
    "Spectrum",
    "Principles",
    "Direct"
   ],
   [
    "Material 3",
    "Design principles",
    "Partial"
   ]
  ],
  "commonGround": "All systems publish a small set of principles, usually covering clarity, efficiency, consistency, and inclusion; they differ in tone.",
  "sources": [
   "https://fluent2.microsoft.design/design-principles",
   "https://spectrum.adobe.com/foundations/getting-started/principles",
   "https://atlassian.design/foundations"
  ]
 },
 "foundations|Visual hierarchy": {
  "text": "Orders elements by size, weight, color, and position so users see the most important first.",
  "purpose": "Helps users scan a screen and find the main task without reading everything.",
  "use": [
   "One primary action and one main heading per view.",
   "Size, weight, and spacing before color to show importance."
  ],
  "avoid": [
   "Do not make everything bold or colored; it removes hierarchy.",
   "Do not rely on low contrast to push items back."
  ],
  "anatomy": [
   "Headings — define sections and levels.",
   "Emphasis — weight and color roles for key content.",
   "Spacing — groups related items and separates sections.",
   "Position — top-left leads in left-to-right layouts."
  ],
  "behavior": [
   "Match the visual order to the reading and focus order.",
   "Group related items with spacing before adding borders."
  ],
  "accessibility": [
   "Mark headings with real heading levels in order.",
   "Keep reading order and DOM order the same."
  ],
  "content": [
   "Front-load headings and labels with the key words.",
   "Use one main heading per view that names the page or task."
  ],
  "map": [
   [
    "Material 3",
    "Hierarchy (layout)",
    "Partial"
   ],
   [
    "Fluent 2",
    "Layout hierarchy",
    "Partial"
   ],
   [
    "Atlassian",
    "Typography and spacing hierarchy",
    "Partial"
   ],
   [
    "Polaris",
    "Layout",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree that hierarchy comes from type scale, spacing, and one emphasized primary action, with visual order matching DOM order.",
  "sources": [
   "https://fluent2.microsoft.design/layout",
   "https://m3.material.io/foundations/layout/layout-overview/overview",
   "https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html"
  ]
 },
 "foundations|Layout grid": {
  "text": "The column, gutter, and margin structure that places content on a page.",
  "purpose": "Aligns content across screens and makes layouts adapt predictably to window size.",
  "use": [
   "Placing page regions, cards, and forms.",
   "Breakpoint-specific column counts, margins, and gutters, from tokens."
  ],
  "avoid": [
   "Inside small components: use spacing tokens.",
   "Fixed pixel widths that break the grid at other sizes."
  ],
  "anatomy": [
   "Columns — the vertical divisions content spans.",
   "Gutters — the fixed spaces between columns.",
   "Margins — the space at the page edges.",
   "Breakpoints — the widths where the grid changes."
  ],
  "behavior": [
   "Change column count and margins at each breakpoint.",
   "Snap all sizes and offsets to the 4px base unit.",
   "Let content span whole columns."
  ],
  "accessibility": [
   "Allow reflow to one column at 320 CSS pixels wide without horizontal scrolling.",
   "Keep DOM order logical when the grid rearranges content."
  ],
  "content": [
   "Keep text blocks within a readable line length, even on wide grids.",
   "Do not break a label or title across columns."
  ],
  "map": [
   [
    "Carbon",
    "2x Grid",
    "Direct"
   ],
   [
    "Material 3",
    "Layout (columns, window size classes)",
    "Direct"
   ],
   [
    "Fluent 2",
    "Layout grid",
    "Direct"
   ],
   [
    "Atlassian",
    "Grid",
    "Direct"
   ],
   [
    "Spectrum",
    "Responsive grid",
    "Direct"
   ],
   [
    "Polaris",
    "Grid",
    "Direct"
   ]
  ],
  "commonGround": "All systems use a responsive column grid with gutters and margins that change at breakpoints, on a 4px or 8px base unit; Carbon uses 16 columns while most others use 12.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/foundations/2x-grid/overview",
   "https://m3.material.io/foundations/layout/breakpoints/overview",
   "https://spectrum.adobe.com/foundations/system/layout",
   "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html"
  ]
 },
 "foundations|Keylines": {
  "text": "Fixed alignment lines inside a component or icon that set where content starts and ends.",
  "purpose": "Keep icons, text, and edges aligned across components, even when shapes differ.",
  "use": [
   "Aligning icon and text start points in lists, menus, and headers.",
   "Icon keyline shapes, so circles, squares, and rectangles look the same size."
  ],
  "avoid": [
   "Do not nudge elements by one or two pixels to fake alignment; fix the keyline.",
   "Visible lines in the UI."
  ],
  "anatomy": [
   "Content start — the inset where text and icons begin.",
   "Icon keyline shapes — square, circle, and rectangles within the icon frame.",
   "Live area and padding — the safe area inside the icon frame."
  ],
  "behavior": [
   "Align the leading icon and text of rows to the same keylines in a view.",
   "Set keylines from spacing tokens on the 4px grid."
  ],
  "accessibility": [
   "Align labels and their controls on shared keylines so related items read together.",
   "Keep icon sizes consistent so targets stay predictable."
  ],
  "content": [
   "Align text start points so labels scan in a straight line.",
   "Do not indent text with spaces to fake a keyline."
  ],
  "map": [
   [
    "Material 3",
    "Keylines (icon and layout)",
    "Direct"
   ],
   [
    "Carbon",
    "Icon grid and keylines",
    "Direct"
   ],
   [
    "Fluent 2",
    "Icon keylines",
    "Partial"
   ]
  ],
  "commonGround": "Material and Carbon both define keyline shapes on the icon grid and alignment lines in layouts, set on the base spacing unit.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/foundations/icons/guidelines",
   "https://m3.material.io/styles/icons/designing-icons"
  ]
 },
 "foundations|Aspect-ratio scale": {
  "text": "The fixed set of width-to-height ratios allowed for media and cards.",
  "purpose": "Keeps thumbnails, previews, and cards consistent so grids line up.",
  "use": [
   "Media frames, with ratios from the scale such as 1:1, 4:3, 3:2, and 16:9.",
   "One ratio per grid of thumbnails."
  ],
  "avoid": [
   "One-off ratios invented for a single screen.",
   "Stretching media to fill a ratio: crop or letterbox it."
  ],
  "anatomy": [
   "Ratio set — the named ratios allowed.",
   "Frame — the container that holds the ratio.",
   "Fit — cover or contain behavior for the media inside."
  ],
  "behavior": [
   "Keep the frame ratio fixed as width changes.",
   "Use cover for decorative crops; use contain when the whole asset must show."
  ],
  "accessibility": [
   "Give media in frames text alternatives that describe the asset, not the frame.",
   "Cropping must not remove content users need to see."
  ],
  "content": [
   "Name ratios by their values, such as 16:9, in specs and tools.",
   "When media is cropped, show the original ratio in asset details."
  ],
  "map": [
   [
    "Carbon",
    "AspectRatio (React component)",
    "Partial"
   ],
   [
    "Material 3",
    "Aspect ratios (imagery)",
    "Partial"
   ],
   [
    "Spectrum",
    "Aspect ratio (imagery)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon defines a fixed set of ratios for grids and Material recommends standard ratios for imagery; both keep one ratio per grid and avoid distortion.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/foundations/2x-grid/overview",
   "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio"
  ]
 },
 "foundations|Hover treatment": {
  "text": "The visual change on an interactive element when a pointer rests over it.",
  "purpose": "Confirms that an element is interactive before the user clicks.",
  "use": [
   "All clickable elements a pointer can reach.",
   "The hover color or overlay token for the element role."
  ],
  "avoid": [
   "Essential information only in hover: touch and keyboard users cannot see it.",
   "Changing size or layout on hover."
  ],
  "anatomy": [
   "Overlay or fill — the hover layer or color step.",
   "Cursor — pointer for links and actions.",
   "Timing — an instant or very fast transition."
  ],
  "behavior": [
   "Apply hover through a state layer or one-step color shift.",
   "Show the same feedback for keyboard focus where relevant.",
   "Do not show hover on disabled elements."
  ],
  "accessibility": [
   "Hover-only content is also reachable by focus, dismissible, and persistent while hovered.",
   "Keep hover state contrast at 3:1 for any boundary it adds."
  ],
  "content": [
   "Do not use \"hover\" in instructions; describe the action.",
   "Keep tooltip text that appears on hover short and supplementary."
  ],
  "map": [
   [
    "Material 3",
    "States: hover",
    "Direct"
   ],
   [
    "Carbon",
    "Interactive states: hover",
    "Direct"
   ],
   [
    "Fluent 2",
    "Interaction states: hover",
    "Direct"
   ],
   [
    "Spectrum",
    "States: hover",
    "Direct"
   ]
  ],
  "commonGround": "All systems use a subtle state layer or one-step color shift for hover, never layout changes; WCAG adds that hover content must be dismissible and persistent.",
  "sources": [
   "https://m3.material.io/foundations/interaction/states/state-layers",
   "https://www.carbondesignsystem.com/building-blocks/foundations/color/tokens",
   "https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html"
  ]
 },
 "foundations|Focus treatment": {
  "text": "The visible indicator on the element that has keyboard focus.",
  "purpose": "Shows keyboard users where they are on the page.",
  "use": [
   "Every element that can receive focus.",
   "Keyboard focus, shown through focus-visible."
  ],
  "avoid": [
   "Do not remove the focus outline without replacing it.",
   "A blurred glow ring: Plenix fields change only the border color on focus."
  ],
  "anatomy": [
   "Indicator — the focus outline or border color.",
   "Offset — the gap between the element and outline, where used.",
   "Color — the focus role token."
  ],
  "behavior": [
   "Show focus on keyboard navigation and hide it for pointer clicks, using focus-visible.",
   "Keep focused elements fully visible, not covered by sticky headers.",
   "Move focus in a logical order that follows the layout."
  ],
  "accessibility": [
   "Make the indicator at least 2px thick with 3:1 contrast against adjacent colors.",
   "Do not let sticky or fixed regions hide the focused element."
  ],
  "content": [
   "Do not write instructions that assume a pointer, such as \"click\".",
   "Use \"select\" or \"choose\" so instructions work for keyboard users."
  ],
  "map": [
   [
    "Material 3",
    "States: focus",
    "Direct"
   ],
   [
    "Carbon",
    "Interactive states: focus",
    "Direct"
   ],
   [
    "Fluent 2",
    "Interaction states: focus",
    "Direct"
   ],
   [
    "Spectrum",
    "States: focus",
    "Direct"
   ]
  ],
  "commonGround": "All systems require a highly visible focus indicator with at least 3:1 contrast, shown for keyboard input; they differ on style: some use an outer ring, others a border change.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html",
   "https://m3.material.io/foundations/interaction/states/applying-states"
  ]
 },
 "foundations|Pressed treatment": {
  "text": "The visual change while an element is being clicked or tapped.",
  "purpose": "Confirms the press was received before the result appears.",
  "use": [
   "Buttons, menu items, and clickable rows.",
   "The pressed color or overlay token, one step stronger than hover."
  ],
  "avoid": [
   "A persistent on or selected status: use selected treatment.",
   "Do not animate size changes on press in dense UI."
  ],
  "anatomy": [
   "Overlay or fill — the pressed layer or color step.",
   "Duration — only while the pointer or key is down."
  ],
  "behavior": [
   "Show pressed while the pointer or Space or Enter key is held.",
   "On release, return to the hover or rest state."
  ],
  "accessibility": [
   "Keep pressed state contrast consistent with the hover state.",
   "Trigger actions on release so users can cancel by moving away."
  ],
  "content": [
   "Keep the label unchanged while pressed.",
   "Change the label only after the action completes, if the state changes."
  ],
  "map": [
   [
    "Material 3",
    "States: pressed / active",
    "Direct"
   ],
   [
    "Carbon",
    "Interactive states: pressed / active",
    "Direct"
   ],
   [
    "Fluent 2",
    "Interaction states: pressed / active",
    "Direct"
   ],
   [
    "Spectrum",
    "States: pressed / active",
    "Direct"
   ]
  ],
  "commonGround": "Material, Carbon, Fluent, and Spectrum all define pressed as a stronger step than hover, shown only while the input is down.",
  "sources": [
   "https://m3.material.io/foundations/interaction/states/state-layers",
   "https://www.carbondesignsystem.com/building-blocks/foundations/color/tokens",
   "https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html"
  ]
 },
 "foundations|Selected treatment": {
  "text": "Shows that an item is chosen or active, such as a selected row, tab, or toggle.",
  "purpose": "Tells users what is chosen now and what an action will apply to.",
  "use": [
   "Selected rows, cards, tabs, navigation items, and toggle buttons.",
   "The selected color role plus a non-color cue such as a check, bar, or weight change."
  ],
  "avoid": [
   "Do not use color alone to show selection.",
   "Do not confuse selected with focused; both can appear together."
  ],
  "anatomy": [
   "Fill — the selected background role.",
   "Indicator — a check, bar, or bold text.",
   "State — aria-selected, aria-checked, or aria-current."
  ],
  "behavior": [
   "Keep selection visible while the item also shows hover or focus.",
   "Persist selection until the user changes it."
  ],
  "accessibility": [
   "Expose selection with the correct ARIA state for the pattern.",
   "Keep 3:1 contrast for the selection indicator."
  ],
  "content": [
   "Show the count of selected items in bulk actions.",
   "Use \"Select all\" and \"Clear selection\" as the standard labels."
  ],
  "map": [
   [
    "Material 3",
    "States: selected",
    "Direct"
   ],
   [
    "Carbon",
    "Interactive states: selected",
    "Direct"
   ],
   [
    "Fluent 2",
    "Interaction states: selected",
    "Direct"
   ],
   [
    "Spectrum",
    "States: selected",
    "Direct"
   ]
  ],
  "commonGround": "All systems pair a selected fill with a second cue such as a check or indicator bar and expose state through ARIA.",
  "sources": [
   "https://m3.material.io/foundations/interaction/states/overview",
   "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
  ]
 },
 "foundations|Dragged treatment": {
  "text": "The look of an item while it is moved by drag and drop.",
  "purpose": "Shows what is moving and where it will land.",
  "use": [
   "Reordering lists, moving assets into folders, and resizing panes.",
   "A lifted look with an elevation token and a drop indicator."
  ],
  "avoid": [
   "Do not rely on drag as the only way to move items.",
   "Do not hide the origin position without a placeholder."
  ],
  "anatomy": [
   "Drag preview — the lifted item following the pointer.",
   "Placeholder — the gap or ghost at the origin.",
   "Drop indicator — the line or highlight at the target.",
   "Handle — the optional grip that starts the drag."
  ],
  "behavior": [
   "Raise the dragged item with elevation and slight opacity.",
   "Highlight valid drop targets and mark invalid ones.",
   "Cancel the drag on Escape and return the item."
  ],
  "accessibility": [
   "Provide keyboard or menu alternatives such as Move up, Move down, and Move to.",
   "Announce pick up, move, and drop results through a live region."
  ],
  "content": [
   "Label handles and move actions clearly, for example \"Move to folder\".",
   "Name the drop target in announcements, for example \"Moved to Archive\"."
  ],
  "map": [
   [
    "Material 3",
    "States: dragged",
    "Direct"
   ],
   [
    "Atlassian",
    "Drag and drop / Pragmatic drag and drop",
    "Direct"
   ],
   [
    "Carbon",
    "Drag and drop (pattern)",
    "Partial"
   ],
   [
    "Fluent 2",
    "Drag and drop",
    "Partial"
   ]
  ],
  "commonGround": "Material defines a dragged state with elevation; Atlassian documents drop indicators and keyboard alternatives; all agree on a non-drag alternative.",
  "sources": [
   "https://m3.material.io/foundations/interaction/states/overview",
   "https://atlassian.design/components/pragmatic-drag-and-drop/about",
   "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html"
  ]
 },
 "foundations|Disabled treatment": {
  "text": "Shows that an element cannot be used right now.",
  "purpose": "Prevents errors while still showing that the option exists.",
  "use": [
   "An action is unavailable until a condition is met.",
   "Keeping a stable layout instead of hiding and showing controls."
  ],
  "avoid": [
   "Disabling without telling users how to enable: add helper text.",
   "Disabling the submit button to hide form errors: validate on submit instead."
  ],
  "anatomy": [
   "Appearance — reduced-contrast text and fill from disabled tokens.",
   "Cursor — not-allowed or default.",
   "Reason — optional helper text or tooltip on a focusable wrapper."
  ],
  "behavior": [
   "Remove hover, pressed, and focus feedback from disabled elements.",
   "Prefer read-only over disabled when users need to read or copy the value."
  ],
  "accessibility": [
   "Disabled controls are exempt from contrast rules but must stay recognizable.",
   "Use aria-disabled when the element must stay focusable to explain why."
  ],
  "content": [
   "Explain the reason in nearby text, not only in a tooltip.",
   "State the condition in plain words, for example \"Select a file to enable download\"."
  ],
  "map": [
   [
    "Carbon",
    "Disabled states",
    "Direct"
   ],
   [
    "Material 3",
    "States: disabled",
    "Direct"
   ],
   [
    "Fluent 2",
    "Interaction states: disabled",
    "Direct"
   ],
   [
    "Spectrum",
    "States: disabled",
    "Direct"
   ],
   [
    "Polaris",
    "Disabled",
    "Partial"
   ],
   [
    "Atlassian",
    "Disabled",
    "Partial"
   ]
  ],
  "commonGround": "All systems use reduced-contrast disabled tokens and remove interaction feedback. Carbon and Atlassian advise explaining why and avoiding disabled submit buttons; they differ on whether disabled items stay focusable.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/core/patterns/disabled-states",
   "https://m3.material.io/foundations/interaction/states/overview",
   "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
  ]
 },
 "foundations|Voice and tone": {
  "text": "How Plenix sounds in UI text: a constant voice and a tone that adapts to the situation.",
  "purpose": "Make text feel consistent across apps and fit the user moment.",
  "use": [
   "A clear, direct, and helpful voice in all UI text.",
   "Errors and destructive actions: a calmer, more careful tone."
  ],
  "avoid": [
   "Do not use jokes, slang, or marketing claims in work flows.",
   "Do not blame the user in messages."
  ],
  "anatomy": [
   "Voice — the fixed character of Plenix writing.",
   "Tone — the adjustment to context such as success, warning, or error.",
   "Examples — do and do not pairs."
  ],
  "behavior": [
   "Match tone to the stakes: neutral for routine, serious for data loss.",
   "Keep the same voice in all apps of the suite."
  ],
  "accessibility": [
   "Write in plain language that screen reader and non-native users understand.",
   "Avoid idioms and jokes that do not translate or that screen reader users may misread."
  ],
  "content": [
   "Write in second person, active voice, and present tense.",
   "Keep sentences short and lead with what matters."
  ],
  "map": [
   [
    "Carbon",
    "Writing style",
    "Partial"
   ],
   [
    "Atlassian",
    "Voice and tone",
    "Direct"
   ],
   [
    "Material 3",
    "Content design: voice and tone",
    "Partial"
   ],
   [
    "Polaris",
    "Voice and tone",
    "Direct"
   ],
   [
    "Spectrum",
    "Voice and tone",
    "Direct"
   ],
   [
    "Fluent 2",
    "Writing / content design",
    "Partial"
   ]
  ],
  "commonGround": "All systems separate a constant voice from a situational tone and favor plain, direct, human language with tone softened for errors.",
  "sources": [
   "https://atlassian.design/foundations/content/voice-tone",
   "https://spectrum.adobe.com/foundations/content-design/voice-and-tone",
   "https://shopify.dev/docs/apps/design/content/voice-and-tone",
   "https://www.carbondesignsystem.com/building-blocks/foundations/content"
  ]
 },
 "foundations|Style and grammar": {
  "text": "The mechanics of Plenix text: punctuation, numbers, contractions, and abbreviations.",
  "purpose": "Keep text consistent and easy to scan no matter who wrote it.",
  "use": [
   "American English spelling and one consistent set of punctuation rules.",
   "Every label, message, and help text."
  ],
  "avoid": [
   "Do not use exclamation marks in routine messages.",
   "Do not use Latin abbreviations such as e.g. and i.e.; write \"for example\" and \"that is\"."
  ],
  "anatomy": [
   "Punctuation — periods, commas, and serial comma use.",
   "Contractions — allowed for a natural tone.",
   "Abbreviations — spell out on first use.",
   "Numerals — use digits for numbers."
  ],
  "behavior": [
   "Omit periods in labels, titles, and single-fragment text; use them in full sentences.",
   "Use the serial comma.",
   "Use numerals in UI, including for numbers under 10."
  ],
  "accessibility": [
   "Spell out acronyms on first use or provide an abbr explanation.",
   "Avoid directional words like \"above\" or \"right\" as the only reference."
  ],
  "content": [
   "Prefer short words and active voice.",
   "Use one term per concept."
  ],
  "map": [
   [
    "Carbon",
    "Writing style / Grammar",
    "Direct"
   ],
   [
    "Polaris",
    "Grammar and mechanics",
    "Direct"
   ],
   [
    "Spectrum",
    "Grammar and mechanics",
    "Direct"
   ],
   [
    "Atlassian",
    "Language and grammar",
    "Direct"
   ],
   [
    "Material 3",
    "UX writing best practices",
    "Partial"
   ],
   [
    "Fluent 2",
    "Content style",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on numerals for numbers, no periods in labels, sparing exclamation marks, and spelling out abbreviations; they differ on the serial comma.",
  "sources": [
   "https://spectrum.adobe.com/foundations/content-design/grammar-and-mechanics",
   "https://shopify.dev/docs/apps/design/content/grammar-and-mechanics",
   "https://www.carbondesignsystem.com/building-blocks/foundations/content",
   "https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/"
  ]
 },
 "foundations|Capitalization": {
  "text": "Sets when Plenix text uses capital letters.",
  "purpose": "Sentence case is easier to read, faster to write, and consistent across languages.",
  "use": [
   "Sentence case for all UI text: titles, buttons, labels, tabs, and menu items.",
   "Capitals for proper nouns, product names, and acronyms."
  ],
  "avoid": [
   "Title case for UI elements.",
   "All caps for emphasis or long labels."
  ],
  "anatomy": [
   "First word — capitalized.",
   "Proper nouns and product names — capitalized as registered.",
   "Everything else — lowercase."
  ],
  "behavior": [
   "Apply sentence case in source text, not through CSS transforms.",
   "Keep product feature names lowercase unless they are trademarks."
  ],
  "accessibility": [
   "Avoid all-caps text: it is harder to read and screen readers may spell it out.",
   "Write acronyms in capitals so screen readers spell them out correctly."
  ],
  "content": [
   "Write \"Upload files\", not \"Upload Files\".",
   "Keep the same capitalization for a term everywhere it appears."
  ],
  "map": [
   [
    "Carbon",
    "Capitalization",
    "Direct"
   ],
   [
    "Atlassian",
    "Capitalization",
    "Direct"
   ],
   [
    "Material 3",
    "Capitalization",
    "Direct"
   ],
   [
    "Fluent 2",
    "Sentence case",
    "Direct"
   ],
   [
    "Polaris",
    "Capitalization",
    "Direct"
   ],
   [
    "Spectrum",
    "Capitalization",
    "Direct"
   ]
  ],
  "commonGround": "All six systems use sentence case for UI text and capitalize only proper nouns; Spectrum historically used title case for some components and has moved toward sentence case.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/foundations/content",
   "https://spectrum.adobe.com/foundations/content-design/grammar-and-mechanics",
   "https://shopify.dev/docs/apps/design/content/grammar-and-mechanics"
  ]
 },
 "foundations|Inclusive language": {
  "text": "Wording that respects all users and does not exclude or stereotype groups.",
  "purpose": "Makes the product welcoming and avoids harm or confusion.",
  "use": [
   "Gender-neutral words and the singular \"they\".",
   "People-first or community-preferred terms about disability."
  ],
  "avoid": [
   "Do not use terms like whitelist, blacklist, master, or slave; use allowlist, blocklist, primary, and replica.",
   "Idioms or cultural references that do not translate."
  ],
  "anatomy": [
   "Neutral pronouns — they or you.",
   "Replacement terms — a list of preferred words.",
   "Ability-neutral verbs — select, open, and choose instead of see or click."
  ],
  "behavior": [
   "Keep a shared replacement list and review UI text against it.",
   "Use input-neutral verbs that work for touch, mouse, keyboard, and voice."
  ],
  "accessibility": [
   "Avoid sensory-only instructions such as \"the red one\".",
   "Use plain language for readers with cognitive disabilities."
  ],
  "content": [
   "Write about people as people, not as conditions.",
   "Avoid violent metaphors such as \"kill\" or \"hit\" for ordinary actions."
  ],
  "map": [
   [
    "Atlassian",
    "Inclusive writing",
    "Direct"
   ],
   [
    "Spectrum",
    "Inclusive UX writing",
    "Direct"
   ],
   [
    "Polaris",
    "Inclusive language",
    "Direct"
   ],
   [
    "Material 3",
    "Inclusive language",
    "Partial"
   ],
   [
    "Carbon",
    "Inclusive language",
    "Partial"
   ],
   [
    "Fluent 2",
    "Inclusive writing",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on gender-neutral language, people-first terms, replacing exclusionary technical terms, and input-neutral verbs.",
  "sources": [
   "https://atlassian.design/foundations/content/inclusive-writing",
   "https://spectrum.adobe.com/foundations/content-design/language-and-inclusivity/inclusive-ux-writing",
   "https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html"
  ]
 },
 "foundations|Terminology": {
  "text": "The controlled list of words Plenix uses for its objects and actions.",
  "purpose": "One term per concept, so users never wonder whether two words mean two things.",
  "use": [
   "The glossary term for every object, such as asset, collection, or folder.",
   "The same verb for the same action across apps."
  ],
  "avoid": [
   "Do not use synonyms for variety, such as delete and remove for the same action.",
   "Do not expose internal or engineering names in UI."
  ],
  "anatomy": [
   "Glossary — the approved term and its definition.",
   "Disallowed terms — words not to use and their replacements.",
   "Action verbs — the fixed verb for each action."
  ],
  "behavior": [
   "Check new UI text against the glossary in review.",
   "Use the same term in UI, help, and errors."
  ],
  "accessibility": [
   "Spell out abbreviations and keep term use consistent for screen reader users.",
   "Use the same term for a control in labels and instructions so users can find it."
  ],
  "content": [
   "Use \"delete\" for permanent removal and \"remove\" for taking out of a group.",
   "Define a new term on first use in help text."
  ],
  "map": [
   [
    "Carbon",
    "Terms and definitions",
    "Partial"
   ],
   [
    "Atlassian",
    "Word list",
    "Direct"
   ],
   [
    "Polaris",
    "Word list / Naming",
    "Direct"
   ],
   [
    "Spectrum",
    "Language and grammar: terms",
    "Partial"
   ],
   [
    "Material 3",
    "Word choice",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Polaris keep word lists; all systems require one term per concept and a clear difference between delete and remove.",
  "sources": [
   "https://github.com/Shopify/polaris-react-archive/blob/main/polaris.shopify.com/content/content/naming.mdx",
   "https://atlassian.design/foundations/content/designing-messages",
   "https://spectrum.adobe.com/foundations/content-design/grammar-and-mechanics"
  ]
 },
 "foundations|Action labels": {
  "text": "The words on buttons, links, and menu items that trigger actions.",
  "purpose": "Tell users exactly what will happen before they act.",
  "use": [
   "A verb plus a noun, such as \"Upload files\" or \"Delete asset\".",
   "The same label for the same action across the suite."
  ],
  "avoid": [
   "Do not use vague labels such as \"OK\", \"Yes\", or \"Click here\".",
   "More than three or four words."
  ],
  "anatomy": [
   "Verb — the action.",
   "Object — what the action affects.",
   "Icon — optional, never replacing the text in primary actions."
  ],
  "behavior": [
   "Dialog buttons repeat the action from the title, such as \"Delete\" in a delete dialog.",
   "Keep the primary action label the most specific."
  ],
  "accessibility": [
   "Make the visible label part of the accessible name.",
   "Make links meaningful out of context."
  ],
  "content": [
   "Write in sentence case with no ending punctuation.",
   "Use \"Cancel\" for leaving without changes and \"Close\" for leaving after viewing."
  ],
  "map": [
   [
    "Carbon",
    "Action labels",
    "Direct"
   ],
   [
    "Polaris",
    "Actionable language",
    "Direct"
   ],
   [
    "Atlassian",
    "Button writing",
    "Partial"
   ],
   [
    "Spectrum",
    "Writing for buttons",
    "Partial"
   ],
   [
    "Material 3",
    "Button labels",
    "Partial"
   ],
   [
    "Fluent 2",
    "Button content",
    "Partial"
   ]
  ],
  "commonGround": "All systems use a short, verb-first label that names the result, avoid generic \"OK\" and \"Yes\", and match dialog buttons to the dialog action.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/foundations/content",
   "https://shopify.dev/docs/apps/design/content",
   "https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html"
  ]
 },
 "foundations|Writing messages": {
  "text": "Errors, warnings, success, and info text shown to users.",
  "purpose": "Tell users what happened and what to do next.",
  "use": [
   "Any result the user needs to know or act on.",
   "A fixed structure: what happened, why if useful, and what to do."
  ],
  "avoid": [
   "Do not show codes or technical text without a plain explanation.",
   "Do not blame users or use words like \"invalid\" alone."
  ],
  "anatomy": [
   "Title — a short summary of what happened.",
   "Body — the cause and the fix.",
   "Action — a button or link to resolve it."
  ],
  "behavior": [
   "Place the message next to the problem when possible.",
   "Keep success messages short and error messages specific."
  ],
  "accessibility": [
   "Announce messages with the right live region or role.",
   "Tie field errors to the field with aria-describedby."
  ],
  "content": [
   "Write the fix as an instruction, for example \"Enter a date after today\".",
   "Use plain words and say what the user can do next."
  ],
  "map": [
   [
    "Carbon",
    "Notification content / Error messages",
    "Direct"
   ],
   [
    "Polaris",
    "Error messages",
    "Direct"
   ],
   [
    "Spectrum",
    "Writing for errors",
    "Direct"
   ],
   [
    "Atlassian",
    "Writing messages",
    "Direct"
   ],
   [
    "Material 3",
    "Error messaging",
    "Partial"
   ],
   [
    "Fluent 2",
    "Messages",
    "Partial"
   ]
  ],
  "commonGround": "All systems want specific, blame-free messages that state the problem and the fix, placed near the problem.",
  "sources": [
   "https://spectrum.adobe.com/foundations/content-design/writing-for-errors",
   "https://github.com/Shopify/polaris-react-archive/blob/main/polaris.shopify.com/content/content/error-messages.mdx",
   "https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html",
   "https://design-system.service.gov.uk/patterns/validation/"
  ]
 },
 "foundations|Empty-state and onboarding copy": {
  "text": "The text shown when a view has no content yet or a user is new.",
  "purpose": "Explains what belongs here and how to start, turning a blank view into a next step.",
  "use": [
   "First-use views, empty searches, and cleared filters.",
   "A heading, one sentence of help, and one primary action."
  ],
  "avoid": [
   "Do not show a blank area with no text.",
   "Long tours: teach in context instead."
  ],
  "anatomy": [
   "Heading — what is empty or what this area is for.",
   "Body — one sentence on why and how to start.",
   "Action — the main way to add content."
  ],
  "behavior": [
   "Write different copy for first use, no results, and cleared or filtered views.",
   "Keep onboarding steps few and skippable."
  ],
  "accessibility": [
   "Make the empty-state heading a real heading.",
   "Make onboarding dismissible and keyboard reachable."
  ],
  "content": [
   "Write positive, specific text, for example \"No assets yet\" and \"Upload files to get started\".",
   "Use the same verb in the action as in the body text."
  ],
  "map": [
   [
    "Carbon",
    "Empty states",
    "Direct"
   ],
   [
    "Polaris",
    "Empty state",
    "Direct"
   ],
   [
    "Atlassian",
    "Empty state",
    "Direct"
   ],
   [
    "Spectrum",
    "Writing for onboarding / empty states",
    "Direct"
   ],
   [
    "Material 3",
    "Empty states",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on a short heading, one helpful sentence, and one primary action, with different copy for first use and no-results states.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/core/patterns/empty-states",
   "https://spectrum.adobe.com/foundations/content-design/writing-for-onboarding",
   "https://github.com/Shopify/polaris-react-archive/blob/main/polaris.shopify.com/content/components/layout-and-structure/empty-state.mdx"
  ]
 },
 "foundations|Text alternatives": {
  "text": "Text versions of non-text content, such as alt text for images and labels for icons.",
  "purpose": "Give screen reader users and people with images turned off the same information.",
  "use": [
   "Every informative image gets alt text; every icon-only control gets an accessible name.",
   "Purely decorative images get empty alt."
  ],
  "avoid": [
   "Do not repeat nearby text in alt text.",
   "Do not start alt text with \"Image of\"."
  ],
  "anatomy": [
   "Alt text — a short description of the image content or purpose.",
   "Accessible name — the label for icon-only controls.",
   "Long description — extra detail for complex images such as charts."
  ],
  "behavior": [
   "Describe the purpose for functional images and the content for informative ones.",
   "Provide data grids or summaries for charts."
  ],
  "accessibility": [
   "Meet WCAG 1.1.1 for all non-text content.",
   "Use aria-label or visually hidden text for icon-only buttons."
  ],
  "content": [
   "Keep alt text short, about one sentence, and end with a period.",
   "Leave file names out of alt text unless they carry meaning."
  ],
  "map": [
   [
    "Material 3",
    "Alt text",
    "Direct"
   ],
   [
    "Carbon",
    "Accessibility: alternative text",
    "Partial"
   ],
   [
    "Atlassian",
    "Alt text",
    "Partial"
   ],
   [
    "Polaris",
    "Alternative text",
    "Partial"
   ],
   [
    "Spectrum",
    "Writing for accessibility",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on short, purpose-focused alt text, empty alt for decoration, and accessible names for icon buttons, following WCAG 1.1.1.",
  "sources": [
   "https://m3.material.io/foundations/content-design/alt-text",
   "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
   "https://www.w3.org/WAI/tutorials/images/decision-tree/"
  ]
 },
 "foundations|Numbers and units": {
  "text": "How Plenix writes counts, measurements, and file sizes.",
  "purpose": "Consistent, locale-aware numbers are easier to read and compare.",
  "use": [
   "The locale number format for separators and decimals.",
   "Abbreviated units such as KB, MB, and GB for file sizes."
  ],
  "avoid": [
   "Hard-coded separators: use Intl.NumberFormat.",
   "Do not mix unit systems in one view."
  ],
  "anatomy": [
   "Value — the number in locale format.",
   "Unit — the symbol or short name.",
   "Space — a non-breaking space between value and unit.",
   "Precision — a fixed number of decimals per context."
  ],
  "behavior": [
   "Abbreviate large numbers, such as 1.2K, only where space is tight; show the full value on hover.",
   "Keep the same precision across a column.",
   "Show technical values in the mono font when they appear as data."
  ],
  "accessibility": [
   "When abbreviated, provide the full number and unit name for screen readers.",
   "Do not use symbols alone where a screen reader may misread them, such as x for multiplication."
  ],
  "content": [
   "Use numerals, not words, for numbers in UI.",
   "Put a space between a number and its unit, except for % and degrees."
  ],
  "map": [
   [
    "Polaris",
    "Numbers / Formatting",
    "Direct"
   ],
   [
    "Carbon",
    "Numbers and units (writing style)",
    "Direct"
   ],
   [
    "Spectrum",
    "Grammar and mechanics: numbers",
    "Partial"
   ],
   [
    "Atlassian",
    "Numbers",
    "Partial"
   ],
   [
    "Material 3",
    "Numbers in content",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on numerals, locale-aware formatting, consistent precision, and abbreviations only with access to the full value.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/foundations/content",
   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat",
   "https://spectrum.adobe.com/foundations/content-design/grammar-and-mechanics"
  ]
 },
 "foundations|Date and time formats": {
  "text": "Define how Plenix shows dates, times, durations, and relative times.",
  "purpose": "Clear, locale-aware dates prevent mistakes such as swapping day and month.",
  "use": [
   "Recent activity: relative time, such as \"5 minutes ago\", with the full date on hover.",
   "Records: an unambiguous absolute date with the month as text."
  ],
  "avoid": [
   "All-numeric dates like 03/04/2026, which read differently by region.",
   "Hard-coded formats: use Intl.DateTimeFormat with the user locale and time zone."
  ],
  "anatomy": [
   "Date — day, month name, and year.",
   "Time — hours and minutes in the user preference.",
   "Time zone — shown when it may differ from the user.",
   "Relative time — for recent events."
  ],
  "behavior": [
   "Switch from relative to absolute after a set age, such as seven days.",
   "Show the time zone for scheduled events and audit logs."
  ],
  "accessibility": [
   "Mark dates with the time element and a machine-readable datetime value.",
   "Make full dates in tooltips reachable by focus."
  ],
  "content": [
   "Write month names in full or as a three-letter abbreviation, never as a number alone.",
   "Use \"Today\" and \"Yesterday\" only together with a time."
  ],
  "map": [
   [
    "Carbon",
    "Dates and times (writing style)",
    "Direct"
   ],
   [
    "Polaris",
    "Date and time formatting",
    "Direct"
   ],
   [
    "Atlassian",
    "Dates and times",
    "Partial"
   ],
   [
    "Spectrum",
    "Grammar and mechanics: dates",
    "Partial"
   ],
   [
    "Material 3",
    "Date formatting",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on locale-aware, unambiguous dates with a month name, relative time for recent events, and explicit time zones where it matters.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/foundations/content",
   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
   "https://design-system.service.gov.uk/patterns/dates/"
  ]
 },
 "foundations|Currency and percentages": {
  "text": "Define how Plenix shows money values and ratios.",
  "purpose": "Correct, locale-aware formats prevent costly misreads of amounts and changes.",
  "use": [
   "The locale currency format, with the currency symbol or ISO code.",
   "Several currencies may appear together: use the ISO code."
  ],
  "avoid": [
   "Hard-coded symbol position or separators: use Intl.NumberFormat with style currency or percent.",
   "Do not round money values that users must reconcile."
  ],
  "anatomy": [
   "Amount — the value with locale separators.",
   "Currency — the symbol or ISO code.",
   "Sign — minus or plus for changes.",
   "Percent — the value with the percent sign."
  ],
  "behavior": [
   "Show the currency minor units for money unless the context is approximate.",
   "Show positive and negative changes with a sign and color plus an icon or word.",
   "Right-align amounts with tabular figures."
  ],
  "accessibility": [
   "Do not use color alone to show gains and losses.",
   "Screen readers announce the currency and sign."
  ],
  "content": [
   "Write percentages with numerals and the % sign, with no space.",
   "Use the ISO currency code, such as USD, when the symbol could be ambiguous."
  ],
  "map": [
   [
    "Polaris",
    "Formatting localized currency",
    "Direct"
   ],
   [
    "Carbon",
    "Currency and percentages (writing style)",
    "Partial"
   ],
   [
    "Spectrum",
    "Grammar and mechanics: currency",
    "Partial"
   ],
   [
    "Atlassian",
    "Numbers and currency",
    "Partial"
   ]
  ],
  "commonGround": "Polaris documents localized currency in depth; other systems agree on locale-driven formats, ISO codes for mixed currencies, and not using color alone for changes.",
  "sources": [
   "https://github.com/Shopify/polaris-react-archive/blob/main/polaris.shopify.com/content/foundations/formatting-localized-currency.mdx",
   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat",
   "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
  ]
 },
 "foundations|Names, addresses and phone numbers": {
  "text": "How Plenix collects and shows personal details.",
  "purpose": "Flexible, locale-aware formats work for people worldwide and reduce form errors.",
  "use": [
   "A single full-name field, unless the system truly needs parts.",
   "The user country sets the address fields and phone format."
  ],
  "avoid": [
   "Do not assume first name, last name order, or a middle name.",
   "Do not force a fixed phone or postal code pattern; accept spaces and symbols."
  ],
  "anatomy": [
   "Name — full name, with optional preferred name.",
   "Address — country first, then fields that suit the country.",
   "Phone — country code and number."
  ],
  "behavior": [
   "Show names as users entered them.",
   "Store phone numbers in E.164 and display them in local format.",
   "Use autocomplete attributes on every field."
  ],
  "accessibility": [
   "Set autocomplete values such as name, street-address, and tel.",
   "Label every field and do not use placeholders as labels."
  ],
  "content": [
   "Label fields plainly, for example \"Full name\" and \"Phone number\".",
   "Mark optional fields as optional instead of marking required ones."
  ],
  "map": [
   [
    "Polaris",
    "Names / Addresses (international)",
    "Partial"
   ],
   [
    "Carbon",
    "Forms (international fields)",
    "Partial"
   ],
   [
    "Atlassian",
    "Personal names",
    "Partial"
   ]
  ],
  "commonGround": "GOV.UK and Polaris agree on a single name field, country-driven addresses, and flexible phone input; most other systems give only general form advice.",
  "sources": [
   "https://design-system.service.gov.uk/patterns/names/",
   "https://design-system.service.gov.uk/patterns/addresses/",
   "https://design-system.service.gov.uk/patterns/phone-numbers/",
   "https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html"
  ]
 },
 "layout|Box / container": {
  "text": "The base layout primitive: a container that applies padding, background, border and radius from tokens.",
  "purpose": "Replaces one-off wrapper styles so every surface is built from the same tokens.",
  "use": [
   "Grouping content with token padding, a surface color or a border.",
   "Building block inside cards, panels and regions."
  ],
  "avoid": [
   "A more specific component, such as a card, already exists: use it.",
   "Do not pass raw values; use spacing, color and radius tokens only."
  ],
  "anatomy": [
   "Element — the rendered tag, chosen for meaning.",
   "Padding — spacing tokens per side.",
   "Surface — background, border, and radius roles."
  ],
  "behavior": [
   "Accept only token values for every style property.",
   "Render a semantic element when the content needs one, such as section or nav."
  ],
  "accessibility": [
   "Choose the HTML element for meaning, not for looks.",
   "Do not add interactive behavior to a plain box; use a button or link."
  ],
  "content": [
   "Do not put text directly in a box without a text component or element.",
   "Keep box content to one group of related items."
  ],
  "map": [
   [
    "Atlassian",
    "Box",
    "Direct"
   ],
   [
    "Polaris",
    "Box",
    "Direct"
   ],
   [
    "Fluent 2",
    "Layout primitives",
    "Partial"
   ],
   [
    "Spectrum",
    "View",
    "Direct"
   ]
  ],
  "commonGround": "Atlassian, Polaris and Spectrum all ship a box-like primitive that accepts only tokens and a semantic element choice; Carbon relies on its grid and layout tokens instead.",
  "sources": [
   "https://atlassian.design/components/primitives/box/examples",
   "https://github.com/Shopify/polaris-react-archive/blob/main/polaris.shopify.com/content/components/layout-and-structure/box.mdx",
   "https://react-spectrum.adobe.com/v3/View.html"
  ]
 },
 "layout|Inline / row": {
  "text": "A layout primitive that places children in a horizontal row with a token gap and wraps when needed.",
  "purpose": "Handles toolbars, tag groups, and button rows without custom flex code.",
  "use": [
   "Button groups, tag lists, metadata rows, and toolbar items.",
   "Use space tokens for the gap and set alignment by prop."
  ],
  "avoid": [
   "Vertical lists: use a stack.",
   "Do not use margins on children to create gaps."
  ],
  "anatomy": [
   "Container — the flex row.",
   "Gap — a spacing token between items.",
   "Alignment — start, center, end, or space between.",
   "Wrap — whether items move to a new line."
  ],
  "behavior": [
   "Wrap to a new row when space runs out unless wrapping is turned off.",
   "Keep the visual order the same as the DOM order."
  ],
  "accessibility": [
   "Do not reverse visual order with CSS when it changes meaning or tab order.",
   "Keep 4px minimum gaps between adjacent targets, or meet 24px target size."
  ],
  "content": [
   "Keep items in a row short, such as tags or single-word labels.",
   "Order actions with the primary action in a consistent position."
  ],
  "map": [
   [
    "Atlassian",
    "Inline",
    "Direct"
   ],
   [
    "Polaris",
    "InlineStack",
    "Direct"
   ],
   [
    "Spectrum",
    "Flex (row)",
    "Direct"
   ],
   [
    "Fluent 2",
    "Stack (horizontal)",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Polaris define an inline primitive with token gaps, alignment, and wrapping; Spectrum uses Flex for the same role.",
  "sources": [
   "https://atlassian.design/components/primitives/inline/examples",
   "https://github.com/Shopify/polaris-react-archive/blob/main/polaris.shopify.com/content/components/layout-and-structure/inline-stack.mdx",
   "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
  ]
 },
 "layout|Aspect ratio": {
  "text": "Layout primitive that keeps a container at a fixed width-to-height ratio as it resizes.",
  "purpose": "Prevents layout shift and keeps thumbnails and previews aligned in grids.",
  "use": [
   "Thumbnails, image and video previews, and media cards.",
   "Ratios come only from the aspect-ratio scale."
  ],
  "avoid": [
   "Text containers that must grow with content.",
   "Do not distort media; set cover or contain fit."
  ],
  "anatomy": [
   "Frame — the container with a fixed ratio.",
   "Media — the image or video inside.",
   "Fit — cover or contain."
  ],
  "behavior": [
   "Reserve the frame size before the media loads.",
   "Keep the ratio at every width."
  ],
  "accessibility": [
   "Give the media inside a correct text alternative.",
   "Cropping must not hide essential content."
  ],
  "content": [
   "Describe the media, not the frame, in text alternatives.",
   "Show the asset name with the frame when users must identify it."
  ],
  "map": [
   [
    "Carbon",
    "AspectRatio (React component)",
    "Partial"
   ],
   [
    "Polaris",
    "Aspect ratio (MediaCard / Thumbnail)",
    "Partial"
   ],
   [
    "Material 3",
    "Image aspect ratios",
    "Partial"
   ]
  ],
  "commonGround": "Carbon ships an aspect-ratio component limited to a fixed set of ratios; other systems apply fixed ratios inside media components; all avoid distortion.",
  "sources": [
   "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio"
  ]
 },
 "layout|Bleed": {
  "text": "Lets content extend past its container padding to the edge, such as a full-width image inside a card.",
  "purpose": "Allows edge-to-edge media and dividers without breaking the parent padding.",
  "use": [
   "Full-width images, dividers or tables inside padded cards and panels.",
   "Always with the same spacing token as the parent padding."
  ],
  "avoid": [
   "Do not bleed text content; keep text inside the padding.",
   "Negative margins by hand: use the primitive."
  ],
  "anatomy": [
   "Child — the content that extends.",
   "Sides — which edges it bleeds to.",
   "Amount — the parent padding token it cancels."
  ],
  "behavior": [
   "Cancel exactly the parent padding so edges line up.",
   "Keep the child clipped to the parent radius where needed."
  ],
  "accessibility": [
   "Do not let bleed cause horizontal scrolling at narrow widths.",
   "Keep bleeding media clear of text so text contrast is preserved."
  ],
  "content": [
   "Keep captions and text inside the padded area.",
   "Do not place text over bleeding media without a contrast-safe backdrop."
  ],
  "map": [
   [
    "Polaris",
    "Bleed",
    "Direct"
   ],
   [
    "Carbon",
    "Full-bleed (grid)",
    "Partial"
   ],
   [
    "Spectrum",
    "Full bleed (layout)",
    "Partial"
   ]
  ],
  "commonGround": "Polaris defines a Bleed primitive tied to padding tokens, and Carbon describes full-bleed areas in its grid; both cancel the parent spacing instead of ad hoc negative margins.",
  "sources": [
   "https://github.com/Shopify/polaris-react-archive/blob/main/polaris.shopify.com/content/components/layout-and-structure/bleed.mdx",
   "https://www.carbondesignsystem.com/building-blocks/foundations/2x-grid/guidelines",
   "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html"
  ]
 },
 "layout|Center": {
  "text": "Layout primitive that centers its child horizontally, vertically or both, with an optional max width.",
  "purpose": "Handles centered content, such as sign-in forms and empty states, without custom code.",
  "use": [
   "Empty states, sign-in panels and single-focus pages.",
   "Always with a max width, so centered text keeps a readable line length."
  ],
  "avoid": [
   "Long body text or forms with many fields: left-align them.",
   "Items inside tables and lists."
  ],
  "anatomy": [
   "Container — the area to center within.",
   "Axis — horizontal, vertical, or both.",
   "Max width — an optional token that limits width."
  ],
  "behavior": [
   "Keep centered content readable; scroll when it is taller than the viewport.",
   "Pin content to the top, not centered vertically, when it may grow taller than the viewport."
  ],
  "accessibility": [
   "Keep DOM order and focus order unchanged.",
   "Vertically centered content must not get cut off at 200% zoom."
  ],
  "content": [
   "Keep centered text short: one to three lines.",
   "Center only short headings and messages, not paragraphs."
  ],
  "map": [
   [
    "Atlassian",
    "Flex (center alignment)",
    "Partial"
   ],
   [
    "Polaris",
    "Box / BlockStack (center)",
    "Partial"
   ],
   [
    "Spectrum",
    "Flex (center)",
    "Partial"
   ]
  ],
  "commonGround": "No system ships a dedicated Center component; Atlassian, Polaris and Spectrum center through flex primitives and limit centered text to short content.",
  "sources": [
   "https://atlassian.design/components/primitives/flex/examples",
   "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html",
   "https://every-layout.dev/layouts/center/"
  ]
 },
 "layout|Sticky region": {
  "text": "Scrolls with content until it reaches an edge, then stays in place, such as a table header or form footer.",
  "purpose": "Keeps headers and actions reachable while users scroll long content.",
  "use": [
   "Table headers, page headers with actions, and form action bars.",
   "The content area scrolls and the region is needed throughout."
  ],
  "avoid": [
   "Do not stack more than two sticky regions; they eat the viewport.",
   "Do not make large or tall regions sticky on small screens."
  ],
  "anatomy": [
   "Region — the sticky element.",
   "Edge — top or bottom where it sticks.",
   "Separator — a border or elevation shown when stuck."
  ],
  "behavior": [
   "Show a separator or elevation only when the region is stuck.",
   "Stick within the nearest scroll container, not the whole page, when panes scroll separately."
  ],
  "accessibility": [
   "Do not let sticky regions hide the focused element.",
   "Keep the sticky region in a logical place in the reading order."
  ],
  "content": [
   "Keep sticky region text short.",
   "Keep action labels in a sticky bar the same as elsewhere on the page."
  ],
  "map": [
   [
    "Carbon",
    "Sticky header (data grid)",
    "Partial"
   ],
   [
    "Atlassian",
    "Page layout (sticky regions)",
    "Partial"
   ],
   [
    "Polaris",
    "Sticky (page actions)",
    "Partial"
   ],
   [
    "Material 3",
    "Top app bar on scroll",
    "Partial"
   ]
  ],
  "commonGround": "Systems use sticky headers and action bars that gain a separator when stuck, and warn against sticky elements covering focused content.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html",
   "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position",
   "https://m3.material.io/components/app-bars/guidelines"
  ]
 },
 "layout|Fixed region": {
  "text": "Stays in the same place in the viewport regardless of scroll, such as the app shell header or a nav pane.",
  "purpose": "Keeps core navigation and global actions always available.",
  "use": [
   "The app shell: header, nav pane and status bar.",
   "Only elements needed at all times."
  ],
  "avoid": [
   "Content regions or banners that can scroll away.",
   "Several large regions on small screens."
  ],
  "anatomy": [
   "Region — the fixed element.",
   "Position — the viewport edge it occupies.",
   "Content offset — space reserved so content is not covered."
  ],
  "behavior": [
   "Reserve space in the layout so content never hides behind the region.",
   "Let the content area scroll on its own in the remaining space."
  ],
  "accessibility": [
   "Use landmarks such as header, nav, and main for fixed regions.",
   "Focused content must not be covered by fixed regions.",
   "Keep the layout usable at 200% zoom and 320px width."
  ],
  "content": [
   "Keep text in fixed regions short so it does not wrap at narrow widths.",
   "Show the app or page name in the fixed header."
  ],
  "map": [
   [
    "Carbon",
    "UI shell",
    "Direct"
   ],
   [
    "Atlassian",
    "Page layout",
    "Direct"
   ],
   [
    "Material 3",
    "Navigation rail / app bars",
    "Partial"
   ],
   [
    "Fluent 2",
    "App shell",
    "Partial"
   ],
   [
    "Polaris",
    "Frame",
    "Direct"
   ]
  ],
  "commonGround": "Carbon UI shell, Atlassian page layout and Polaris frame all fix the header and navigation, reserve space for them and mark them as landmarks.",
  "sources": [
   "https://www.carbondesignsystem.com/building-blocks/core/components/ui-shell-header/guidelines",
   "https://atlassian.design/components/page-layout/examples",
   "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html",
   "https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/"
  ]
 },
 "layout|One-column layout": {
  "text": "Stacks all content in a single column with a readable max width.",
  "purpose": "Suits focused tasks and reading; the base for small screens.",
  "use": [
   "Forms, settings, articles, and single-task pages.",
   "All layouts at small breakpoints."
  ],
  "avoid": [
   "Data-dense views that need side-by-side comparison.",
   "Do not stretch the column to full width on large screens."
  ],
  "anatomy": [
   "Column — the content area with a max width.",
   "Margins — the space at the sides.",
   "Sections — stacked groups with consistent spacing."
  ],
  "behavior": [
   "Keep the column max width so lines stay under about 80 characters.",
   "Align the column to the start or center consistently across similar pages."
  ],
  "accessibility": [
   "Keep a logical heading structure down the column.",
   "Reflow to one column at 320px without horizontal scrolling."
  ],
  "content": [
   "Front-load each section with a heading that states its purpose.",
   "Keep paragraphs short so the column stays scannable."
  ],
  "map": [
   [
    "Polaris",
    "Page (single column)",
    "Direct"
   ],
   [
    "Material 3",
    "Single pane layout",
    "Direct"
   ],
   [
    "Carbon",
    "Grid (single column)",
    "Partial"
   ],
   [
    "Atlassian",
    "Page layout (main only)",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on a single readable column for focused tasks and as the small-screen fallback, with a max width on large screens.",
  "sources": [
   "https://github.com/Shopify/polaris-react-archive/blob/main/polaris.shopify.com/content/components/layout-and-structure/page.mdx",
   "https://m3.material.io/foundations/layout/canonical-examples/overview",
   "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html"
  ]
 },
 "layout|Masonry layout": {
  "text": "Places items of different heights in columns so the gaps between them are filled.",
  "purpose": "Shows mixed-ratio media, such as image assets, densely without cropping.",
  "use": [
   "Browsing image assets with mixed aspect ratios.",
   "Visual browsing matters more than order."
  ],
  "avoid": [
   "Order matters, such as sorted results: use a uniform grid.",
   "Items that users compare across rows."
  ],
  "anatomy": [
   "Columns — fixed-width columns set by breakpoint.",
   "Items — media tiles with natural height.",
   "Gap — one spacing token both ways."
  ],
  "behavior": [
   "Fill columns so the reading order stays predictable left to right.",
   "Reserve each tile height before images load."
  ],
  "accessibility": [
   "Keep DOM and focus order as close to the visual order as possible.",
   "Give every tile a text alternative and an accessible name."
  ],
  "content": [
   "Show item names on hover and focus or below the tile.",
   "Keep tile captions to one line."
  ],
  "map": [
   [
    "Material 3",
    "Image list (masonry)",
    "Direct"
   ],
   [
    "Spectrum",
    "Masonry (gallery layouts)",
    "Partial"
   ]
  ],
  "commonGround": "Material image lists include a masonry variant for mixed-ratio images; systems agree it suits visual browsing only and warn that it scrambles reading order.",
  "sources": [
   "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Grid_lanes",
   "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html"
  ]
 },
 "layout|Full-screen workspace": {
  "text": "Fills the viewport with a single tool, such as an editor or viewer, and hides the usual page chrome.",
  "purpose": "Gives users maximum space for deep work on one item.",
  "use": [
   "Media viewers, editors and focused review tasks.",
   "A mode the user enters and leaves deliberately."
  ],
  "avoid": [
   "Simple tasks that fit in a dialog or panel.",
   "Do not remove all ways back; always provide close."
  ],
  "anatomy": [
   "Workspace — the main canvas.",
   "Toolbar — slim header with title, actions and close.",
   "Side panels — optional, collapsible properties or tools."
  ],
  "behavior": [
   "Open with focus on the workspace; return focus to the trigger on exit.",
   "Close with Escape or a visible close button.",
   "Keep unsaved changes safe when leaving."
  ],
  "accessibility": [
   "Trap focus while it acts as a modal and restore focus on exit.",
   "Give the workspace a clear title announced on open."
  ],
  "content": [
   "Show the item name in the toolbar title.",
   "Label the exit control \"Close\" or \"Exit full screen\"."
  ],
  "map": [
   [
    "Carbon",
    "Full-page tearsheet / modal (fullscreen)",
    "Partial"
   ],
   [
    "Material 3",
    "Full-screen dialog",
    "Partial"
   ],
   [
    "Atlassian",
    "Blanket / modal (full screen)",
    "Partial"
   ],
   [
    "Polaris",
    "Fullscreen bar (deprecated)",
    "Partial"
   ],
   [
    "Spectrum",
    "Fullscreen dialog",
    "Direct"
   ]
  ],
  "commonGround": "Spectrum and Material define full-screen dialogs, and Polaris had a fullscreen bar (now deprecated); all systems agree on a clear exit, focus return and protection of unsaved work.",
  "sources": [
   "https://github.com/Shopify/polaris-react-archive/blob/main/polaris.shopify.com/content/components/deprecated/fullscreen-bar.mdx",
   "https://m3.material.io/components/dialogs/guidelines",
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ]
 },
 "layout|Hide / show": {
  "text": "The responsive rule that removes or reveals elements at certain breakpoints.",
  "purpose": "Keeps small screens focused on essentials while large screens show more.",
  "use": [
   "Hiding secondary metadata, labels, or panels at small widths.",
   "Moving hidden items into a menu or detail view."
  ],
  "avoid": [
   "Features users need to finish a task: move them into overflow instead.",
   "Do not hide content only visually while it stays focusable."
  ],
  "anatomy": [
   "Breakpoint — the width where the rule changes.",
   "Target — the element hidden or shown.",
   "Fallback — where the hidden item is still reachable."
  ],
  "behavior": [
   "Hide with display none or the hidden attribute so the element also leaves the accessibility tree.",
   "Provide an overflow or detail route for every hidden action."
  ],
  "accessibility": [
   "Keep the same content available at all sizes, even if in another place.",
   "Do not leave hidden items in the tab order."
  ],
  "content": [
   "Use the same labels for an action when it moves into an overflow menu.",
   "Do not shorten labels at small sizes in a way that changes meaning."
  ],
  "map": [
   [
    "Polaris",
    "Hide / Show (breakpoint visibility)",
    "Partial"
   ],
   [
    "Atlassian",
    "Show / Hide (responsive)",
    "Direct"
   ],
   [
    "Carbon",
    "Responsive grid (hide columns)",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Polaris provide breakpoint-based visibility helpers; all agree hidden items stay reachable elsewhere and leave the tab order.",
  "sources": [
   "https://atlassian.design/components/primitives/responsive/show/examples",
   "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html"
  ]
 },
 "layout|Reorder": {
  "text": "The responsive rule that changes the visual order of regions at different breakpoints.",
  "purpose": "Puts the most important content first on small screens.",
  "use": [
   "Moving a summary panel above or below main content on small screens.",
   "Only between large regions, not inside components."
  ],
  "avoid": [
   "Do not reorder in a way that breaks reading or focus order.",
   "Do not reorder form fields or steps."
  ],
  "anatomy": [
   "Regions — the blocks that move.",
   "Order — the position per breakpoint.",
   "Source order — the DOM order that sets reading and focus order."
  ],
  "behavior": [
   "Prefer changing the source order over CSS order when the meaning changes.",
   "Keep keyboard order matching the visual order at every breakpoint."
  ],
  "accessibility": [
   "Keep a meaningful sequence for screen readers.",
   "Keep focus order logical at all sizes."
  ],
  "content": [
   "Do not use positional words like \"above\" or \"left\" when the order changes by size.",
   "Keep region headings so each block is clear in any order."
  ],
  "map": [
   [
    "Material 3",
    "Canonical layouts (pane reflow)",
    "Partial"
   ],
   [
    "Carbon",
    "Grid (reorder)",
    "Partial"
   ]
  ],
  "commonGround": "Material reflows panes at window size classes; systems agree that reordering must not break reading or focus order.",
  "sources": [
   "https://m3.material.io/foundations/layout/canonical-examples/overview",
   "https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html"
  ]
 },
 "layout|Collapse": {
  "text": "Responsive rule that turns a region into a smaller form, such as a nav pane to icons or a panel to a drawer.",
  "purpose": "Saves space on smaller screens while keeping the region available.",
  "use": [
   "Nav panes, side panels and filter bars at narrow widths.",
   "Letting users collapse panels manually on large screens."
  ],
  "avoid": [
   "The main content.",
   "Do not collapse to icons without tooltips or labels."
  ],
  "anatomy": [
   "Expanded state — the full region.",
   "Collapsed state — the rail, icon bar, or toggle.",
   "Toggle — the control that expands and collapses."
  ],
  "behavior": [
   "Collapse automatically at a breakpoint; remember the user choice.",
   "Expand as an overlay on small screens and inline on large screens."
  ],
  "accessibility": [
   "Give the toggle aria-expanded and aria-controls.",
   "Show labels as tooltips on focus and hover when collapsed to icons."
  ],
  "content": [
   "Label the toggle by action, for example \"Collapse navigation\".",
   "Keep collapsed labels as tooltips with the same text as the expanded labels."
  ],
  "map": [
   [
    "Material 3",
    "Navigation rail / drawer",
    "Direct"
   ],
   [
    "Carbon",
    "Side nav (rail)",
    "Direct"
   ],
   [
    "Fluent 2",
    "Nav (collapsed)",
    "Direct"
   ],
   [
    "Atlassian",
    "Page layout (collapsible sidebar)",
    "Direct"
   ]
  ],
  "commonGround": "All systems collapse side navigation to a rail or hidden drawer at smaller widths, with a toggle that exposes its state.",
  "sources": [
   "https://m3.material.io/components/navigation-rail/overview",
   "https://www.carbondesignsystem.com/building-blocks/core/components/ui-shell-left-panel/guidelines",
   "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
  ]
 },
 "layout|Adaptive navigation": {
  "text": "Switches between navigation patterns, such as a full pane, a rail or a drawer, based on screen size.",
  "purpose": "Gives each screen size the most usable navigation without changing the structure.",
  "use": [
   "A full nav pane on large screens, a rail on medium, and a drawer or bar on small.",
   "Every form keeps the same destinations and order."
  ],
  "avoid": [
   "Do not change the navigation structure between sizes.",
   "Do not hide primary destinations behind more than one tap."
  ],
  "anatomy": [
   "Pane — the full labeled navigation.",
   "Rail — compact icons with short labels.",
   "Drawer — an overlay opened from a menu button.",
   "Breakpoints — the widths that switch forms."
  ],
  "behavior": [
   "Switch forms at window size breakpoints, not device types.",
   "Keep the current location marked in every form.",
   "Return focus to the menu button when the drawer closes."
  ],
  "accessibility": [
   "Mark navigation with a nav landmark and aria-current on the current item.",
   "When the drawer overlays content, make it a modal dialog with a focus trap."
  ],
  "content": [
   "Use the same short destination labels in all forms.",
   "Keep labels short enough for the rail: about one or two words."
  ],
  "map": [
   [
    "Material 3",
    "Navigation (adaptive): bar, rail, drawer",
    "Direct"
   ],
   [
    "Fluent 2",
    "Nav",
    "Partial"
   ],
   [
    "Carbon",
    "UI shell (responsive side nav)",
    "Partial"
   ],
   [
    "Atlassian",
    "Side navigation (responsive)",
    "Partial"
   ]
  ],
  "commonGround": "Material defines adaptive navigation by window size class; Carbon and Fluent apply the same idea: pane on large screens, rail or drawer on small, same destinations everywhere.",
  "sources": [
   "https://m3.material.io/foundations/layout/breakpoints/overview",
   "https://m3.material.io/components/navigation-rail/overview",
   "https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/"
  ]
 },
 "content|Rich text": {
  "text": "A block of formatted reading text mixing paragraphs, headings, lists, links, and inline emphasis.",
  "purpose": "Displays authored or user-generated content with structure, so long text stays scannable without custom markup per page.",
  "use": [
   "Descriptions, notes, comments, and help content that need more than one paragraph or inline formatting.",
   "Content from an editor that must render with the app’s type styles."
  ],
  "avoid": [
   "Short labels or single values: use plain text or a label.",
   "Building layout: use layout components for columns and spacing."
  ],
  "anatomy": [
   "Block elements — paragraphs, headings, lists, blockquotes, and code blocks.",
   "Inline elements — emphasis, strong text, inline code, and links.",
   "Container — sets the reading width and the vertical rhythm between blocks."
  ],
  "behavior": [
   "Map every element to an existing type token, never to ad-hoc sizes.",
   "Limit line length to a comfortable reading width of about 60 to 80 characters.",
   "Sanitize user-generated markup before rendering it."
  ],
  "accessibility": [
   "Keep real heading levels and list markup so screen readers can navigate the structure.",
   "Meet 4.5:1 text contrast for body text and links.",
   "Do not convey meaning with color or emphasis alone."
  ],
  "content": [
   "Write in short paragraphs with one idea each.",
   "Use headings in sentence case to break up long content."
  ],
  "map": [
   [
    "Atlassian",
    "Renderer",
    "Partial"
   ],
   [
    "Material 3",
    "Typography",
    "Partial"
   ],
   [
    "Spectrum",
    "Typography",
    "Partial"
   ]
  ],
  "commonGround": "The systems agree that rich content reuses the type scale and keeps semantic structure; none ships a single generic rich text component, so guidance comes from typography foundations.",
  "sources": [
   "https://m3.material.io/styles/typography/overview",
   "https://spectrum.adobe.com/page/typography/",
   "https://atlassian.design/foundations/typography"
  ]
 },
 "content|Blockquote": {
  "text": "An indented block that sets apart text quoted from another source.",
  "purpose": "Separates quoted material from the surrounding text, so readers know it comes from someone else.",
  "use": [
   "Quoting a person, document or message inside reading content.",
   "A reply in comments or notes that quotes an earlier message."
  ],
  "avoid": [
   "Highlighting important information: use an inline message or callout.",
   "Indentation alone."
  ],
  "anatomy": [
   "Leading rule — a vertical line that marks the quote.",
   "Quote text — the quoted content in body style.",
   "Attribution — optional source or author line below the quote."
  ],
  "behavior": [
   "Indented from the reading text, at body size.",
   "The attribution follows the quote, never inside it."
  ],
  "accessibility": [
   "The native blockquote element, so the quote is announced.",
   "The rule is decorative and carries no meaning."
  ],
  "content": [
   "Quote exactly; mark omissions with an ellipsis.",
   "The attribution names the source."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://design-system.service.gov.uk/components/inset-text/",
   "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote"
  ],
  "map": []
 },
 "content|Ordered list": {
  "text": "A numbered list for items whose order matters.",
  "purpose": "Shows a sequence, ranking, or steps that readers can follow and refer to by number.",
  "use": [
   "Steps that must be done in order.",
   "Ranked items, or text that refers to items by number."
  ],
  "avoid": [
   "Order does not matter: use an unordered list.",
   "A multi-page task flow: use a progress indicator or stepper."
  ],
  "anatomy": [
   "Marker — the number for each item.",
   "Item text — one step or entry per item.",
   "Nested list — an optional sub-list indented under an item."
  ],
  "behavior": [
   "Number items automatically; never type numbers into the text.",
   "Limit nesting to two levels.",
   "Align wrapped lines with the start of the item text, not the marker."
  ],
  "accessibility": [
   "Use the native ol and li elements so count and position are announced.",
   "Keep marker and text contrast at 4.5:1."
  ],
  "content": [
   "Start each item with a verb when it is a step.",
   "Keep items parallel in grammar and length.",
   "Use sentence case and end full sentences with a period."
  ],
  "map": [
   [
    "Carbon",
    "Ordered list",
    "Direct"
   ],
   [
    "Polaris",
    "List (number)",
    "Variant"
   ]
  ],
  "commonGround": "Carbon and Polaris both offer a numbered list variant, use it only when sequence matters, and keep nesting shallow.",
  "sources": [
   "https://carbondesignsystem.com/components/list/usage/",
   "https://polaris-react.shopify.com/components/lists/list"
  ]
 },
 "content|Inline code": {
  "text": "A short code or technical value in monospace inside running text.",
  "purpose": "Marks text to read or type literally, such as a command, key, or file name, so it is not mistaken for prose.",
  "use": [
   "Short commands, identifiers, file paths, and values inside a sentence.",
   "The user may copy the value exactly."
  ],
  "avoid": [
   "Multi-line code: use a code block.",
   "Emphasis or product names."
  ],
  "anatomy": [
   "Container — a subtle background that sets the code apart.",
   "Code text — the value in the mono font."
  ],
  "behavior": [
   "Keep the code on one line where possible; allow it to wrap at safe points.",
   "Do not change the line height of the surrounding text."
  ],
  "accessibility": [
   "Use the native code element.",
   "Keep text contrast at 4.5:1 on the code background."
  ],
  "content": [
   "Show the value exactly as the user must type it.",
   "Do not add punctuation inside the code span."
  ],
  "map": [
   [
    "Carbon",
    "Code snippet (inline)",
    "Variant"
   ],
   [
    "Atlassian",
    "Code",
    "Direct"
   ],
   [
    "Spectrum",
    "Code",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Atlassian, and Spectrum use a monospace inline style for literal values, separate from multi-line code blocks.",
  "sources": [
   "https://carbondesignsystem.com/components/code-snippet/usage/",
   "https://atlassian.design/components/code",
   "https://spectrum.adobe.com/page/code/"
  ]
 },
 "content|Inline link": {
  "text": "A link inside a sentence that takes the user to another page or resource.",
  "purpose": "Lets readers reach related content without leaving the flow of the text.",
  "use": [
   "Pointing to related pages or details from body text.",
   "The link text reads naturally as part of the sentence."
  ],
  "avoid": [
   "Triggering an action such as save or delete: use a button.",
   "Several inline links close together: list them as standalone links."
  ],
  "anatomy": [
   "Link text — the words that describe the destination.",
   "Underline — the persistent cue that marks the text as a link."
  ],
  "behavior": [
   "Inherit the size and weight of the surrounding text.",
   "Show hover, focus, and visited states distinct from rest.",
   "Open in the same tab by default."
  ],
  "accessibility": [
   "Underline inline links so color is not the only cue.",
   "Make the link focusable with a visible focus indicator.",
   "Write link text that makes sense out of context, for screen reader link lists."
  ],
  "content": [
   "Describe the destination; never use \"click here\" or \"read more\" alone.",
   "Keep the link to the few words that name the target."
  ],
  "map": [
   [
    "Carbon",
    "Link (inline)",
    "Variant"
   ],
   [
    "Atlassian",
    "Link",
    "Direct"
   ],
   [
    "Fluent 2",
    "Link (inline)",
    "Variant"
   ],
   [
    "Polaris",
    "Link",
    "Direct"
   ],
   [
    "Spectrum",
    "Link",
    "Direct"
   ]
  ],
  "commonGround": "All systems with links agree: links navigate and buttons act, inline links are underlined, and link text describes the destination.",
  "sources": [
   "https://carbondesignsystem.com/components/link/usage/",
   "https://atlassian.design/components/link",
   "https://polaris-react.shopify.com/components/navigation/link",
   "https://spectrum.adobe.com/page/link/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/link/"
  ]
 },
 "content|Standalone link": {
  "text": "A link on its own line or in a group, outside a sentence.",
  "purpose": "Gives a clear, secondary path to another page from places such as cards, lists, and section footers.",
  "use": [
   "\"View all\" or related-page links at the end of a section or card.",
   "Lists of related links."
  ],
  "avoid": [
   "The main action on a page: use a primary button.",
   "Inside running text: use an inline link."
  ],
  "anatomy": [
   "Link text — names the destination.",
   "Icon — optional trailing icon, such as an arrow or external icon."
  ],
  "behavior": [
   "Show the underline on hover and focus if it is hidden at rest.",
   "Keep the icon on the same line as the last word.",
   "Size the link to the context, not larger than nearby body text."
  ],
  "accessibility": [
   "Keep a target size of at least 24 by 24 pixels.",
   "Make the full text and icon one focus target.",
   "Hide decorative icons from screen readers."
  ],
  "content": [
   "Start with a verb or the name of the destination.",
   "Keep it short and specific."
  ],
  "map": [
   [
    "Carbon",
    "Link (standalone)",
    "Variant"
   ],
   [
    "Fluent 2",
    "Link",
    "Variant"
   ],
   [
    "Spectrum",
    "Link (standalone)",
    "Variant"
   ]
  ],
  "commonGround": "Carbon and Spectrum separate standalone links from inline links and allow them without a permanent underline, because their position marks them as links.",
  "sources": [
   "https://carbondesignsystem.com/components/link/usage/",
   "https://spectrum.adobe.com/page/link/",
   "https://fluent2.microsoft.design/components/web/react/core/link/usage"
  ]
 },
 "content|External link": {
  "text": "Links to a page outside the product, marked so users know they will leave it.",
  "purpose": "Warns users before they leave the app or open a new tab, so the change of context is no surprise.",
  "use": [
   "Links to other sites, documentation hosts, or other products.",
   "The link opens in a new tab or window."
  ],
  "avoid": [
   "Do not mark links to other pages in the same product as external.",
   "Do not open new tabs without telling the user."
  ],
  "anatomy": [
   "Link text — names the destination.",
   "External icon — trailing launch icon.",
   "Hidden label — screen reader text such as \"opens in a new tab\"."
  ],
  "behavior": [
   "Keep the icon after the text and on the same line.",
   "Open in a new tab only when leaving would lose the user’s work or context."
  ],
  "accessibility": [
   "Announce with hidden text, not only the icon, that the link opens a new tab.",
   "Keep the icon and text in one focus target."
  ],
  "content": [
   "Name the site or document the link goes to.",
   "Do not write \"external link\" as the link text."
  ],
  "map": [
   [
    "Carbon",
    "Link (with icon)",
    "Partial"
   ],
   [
    "Atlassian",
    "Link (new window)",
    "Partial"
   ],
   [
    "Spectrum",
    "Link",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Atlassian mark links that open a new window with an icon and an accessible label; they differ on whether every outbound link opens a new tab.",
  "sources": [
   "https://carbondesignsystem.com/components/link/usage/",
   "https://atlassian.design/components/link",
   "https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html"
  ]
 },
 "content|Back link": {
  "text": "A link at the top of a page back to the previous or parent page.",
  "purpose": "A predictable way back in multi-step flows and detail pages, where the browser back button is not enough.",
  "use": [
   "The top of detail pages and of steps in a linear flow.",
   "The parent page is known."
  ],
  "avoid": [
   "Breadcrumbs already show the path: use breadcrumbs.",
   "A form with its own Back button at the bottom."
  ],
  "anatomy": [
   "Back icon — a leading arrow or chevron.",
   "Link text — \"Back\" or the parent page name."
  ],
  "behavior": [
   "Sits above the page title in the page header.",
   "Returns to the parent page or previous step, keeping the user’s filters and position."
  ],
  "accessibility": [
   "A link, not a button, when it navigates.",
   "Icon-only back controls have an accessible name that names the destination."
  ],
  "content": [
   "\"Back\" or \"Back to [page name]\".",
   "Keep it to a few words."
  ],
  "map": [
   [
    "Polaris",
    "Page (back action)",
    "Partial"
   ],
   [
    "Material 3",
    "Top app bar (navigation icon)",
    "Partial"
   ],
   [
    "Atlassian",
    "Page header",
    "Partial"
   ]
  ],
  "commonGround": "Polaris and Material 3 place a back control at the start of the page header; GOV.UK has the closest dedicated component.",
  "sources": [
   "https://polaris-react.shopify.com/components/layout-and-structure/page",
   "https://m3.material.io/components/top-app-bar/overview",
   "https://design-system.service.gov.uk/components/back-link/"
  ]
 },
 "content|Image": {
  "text": "A raster or vector picture with a fixed size and fit.",
  "purpose": "Shows visual content such as asset previews, product photos, or screenshots in a consistent frame.",
  "use": [
   "Content the user needs to see, such as an asset preview.",
   "Inside cards, tables, and detail panes, with a fixed aspect ratio."
  ],
  "avoid": [
   "Text: use real text.",
   "Icons: use the icon set."
  ],
  "anatomy": [
   "Frame — the box with a set aspect ratio and radius.",
   "Image — the picture, fitted with cover or contain.",
   "Fallback — a placeholder shown while loading or on error."
  ],
  "behavior": [
   "Reserve space before load so the layout does not shift.",
   "Show a neutral placeholder while loading and a fallback on error.",
   "Load images below the fold lazily."
  ],
  "accessibility": [
   "Give meaningful images alt text stating their content or purpose.",
   "Give decorative images empty alt text."
  ],
  "content": [
   "Write alt text as a short phrase without \"image of\".",
   "Describe what matters in this context, not every detail."
  ],
  "map": [
   [
    "Atlassian",
    "Image",
    "Direct"
   ],
   [
    "Fluent 2",
    "Image",
    "Direct"
   ],
   [
    "Spectrum",
    "Image",
    "Direct"
   ],
   [
    "Polaris",
    "Thumbnail",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Fluent 2, and Spectrum agree on a framed image with fit options and required alt text; Polaris covers small previews with Thumbnail.",
  "sources": [
   "https://atlassian.design/components/image",
   "https://fluent2.microsoft.design/components/web/react/core/image/usage",
   "https://spectrum.adobe.com/page/image/",
   "https://polaris-react.shopify.com/components/images-and-icons/thumbnail"
  ]
 },
 "content|Responsive image": {
  "text": "An image that serves different sources or crops for different screen sizes and densities.",
  "purpose": "Keeps images sharp on dense screens and light on small screens, without sending one large file to every device.",
  "use": [
   "Large images such as hero art, previews, and gallery items.",
   "The image needs a different crop on small screens."
  ],
  "avoid": [
   "Small fixed-size thumbnails: use a single image with a 2x source.",
   "Swapping content between sizes: the meaning must stay the same."
  ],
  "anatomy": [
   "Source set — the list of files by width or density.",
   "Sizes — the rule telling the browser how wide the image displays.",
   "Art-directed sources — optional alternate crops by breakpoint."
  ],
  "behavior": [
   "Let the browser pick the source from width and density.",
   "Keep the aspect ratio stable across sources to avoid layout shift.",
   "Provide a dark-theme source when the image depends on the theme."
  ],
  "accessibility": [
   "Keep the same alt text for all sources.",
   "Do not hide information in one crop that is missing in another."
  ],
  "content": [
   "Write one alt text that fits every crop.",
   "Choose crops that keep the subject in view at every size."
  ],
  "map": [
   [
    "Fluent 2",
    "Image",
    "Partial"
   ],
   [
    "Atlassian",
    "Image (theme sources)",
    "Partial"
   ]
  ],
  "commonGround": "Fluent 2 and Atlassian treat responsiveness as image options (fit and theme-aware sources), not a separate component.",
  "sources": [
   "https://fluent2.microsoft.design/components/web/react/core/image/usage",
   "https://atlassian.design/components/image",
   "https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images"
  ]
 },
 "content|Figure": {
  "text": "An image, chart, or diagram with a caption that explains it.",
  "purpose": "Connects visual content to an explanation, so readers know what the picture shows and why it is there.",
  "use": [
   "Charts, diagrams, and screenshots in documentation or reports.",
   "The visual needs a source or note."
  ],
  "avoid": [
   "Decorative images: use an image with empty alt text.",
   "Do not use a caption to repeat the alt text."
  ],
  "anatomy": [
   "Media — the image, chart, or diagram.",
   "Caption — a short line below the media.",
   "Source — optional credit or data source."
  ],
  "behavior": [
   "Keep the caption next to the media at all sizes.",
   "Use secondary text style for the caption."
  ],
  "accessibility": [
   "Use the figure and figcaption elements to link the caption to the media.",
   "Keep caption contrast at 4.5:1."
  ],
  "content": [
   "Write the caption as one sentence that adds context.",
   "Name the data source for charts."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure",
   "https://www.w3.org/WAI/tutorials/images/complex/"
  ],
  "map": []
 },
 "content|Image gallery": {
  "text": "A set of images shown together as a grid or strip; each one opens larger.",
  "purpose": "Lets users compare and browse several images at once and inspect one in detail.",
  "use": [
   "Several images of one item, such as asset renditions.",
   "Users need to pick or compare images."
  ],
  "avoid": [
   "One image: use an image.",
   "Do not auto-rotate images."
  ],
  "anatomy": [
   "Thumbnails — the grid or strip of images.",
   "Viewer — a larger view of the selected image.",
   "Controls — previous, next, and close.",
   "Counter — position such as \"3 of 12\"."
  ],
  "behavior": [
   "Open the viewer on select and return focus to the thumbnail on close.",
   "Support arrow keys to move between images.",
   "Never advance automatically."
  ],
  "accessibility": [
   "Give each thumbnail alt text and an accessible name for its button.",
   "Make all controls keyboard reachable, with 24 by 24 pixel targets.",
   "Trap focus inside a full-screen viewer and close it with Escape."
  ],
  "content": [
   "Label controls \"Previous image\" and \"Next image\".",
   "Show captions in the viewer when available."
  ],
  "map": [
   [
    "Material 3",
    "Carousel",
    "Partial"
   ],
   [
    "Fluent 2",
    "Carousel",
    "Partial"
   ]
  ],
  "commonGround": "Material 3 and Fluent 2 offer carousels that show several items at once, with manual controls; both discourage auto-advance.",
  "sources": [
   "https://m3.material.io/components/carousel/overview",
   "https://fluent2.microsoft.design/components/web/react/core/carousel/usage",
   "https://www.w3.org/WAI/ARIA/apg/patterns/carousel/"
  ]
 },
 "content|Illustration": {
  "text": "A drawn picture in the brand style that supports a message, such as an empty state or onboarding step.",
  "purpose": "Adds context and tone to moments with little content, so the screen does not feel broken or empty.",
  "use": [
   "Empty states, first-run screens, and success or error pages.",
   "One illustration per view."
  ],
  "avoid": [
   "Dense work areas such as tables and forms.",
   "Do not use an illustration to carry information missing from the text."
  ],
  "anatomy": [
   "Artwork — the illustration from the approved set.",
   "Size — one of the defined illustration sizes.",
   "Paired text — the heading and body that carry the message."
  ],
  "behavior": [
   "Use only illustrations from the shared library.",
   "Scale down or hide the illustration in small containers.",
   "Provide theme-aware versions for light and dark."
  ],
  "accessibility": [
   "Mark illustrations decorative when the text carries the message.",
   "Do not rely on color in the artwork to convey meaning."
  ],
  "content": [
   "Let the heading and body carry the message; the art only supports it.",
   "Do not add text inside the artwork; keep all words in the page text."
  ],
  "map": [
   [
    "Carbon",
    "Pictograms",
    "Partial"
   ],
   [
    "Atlassian",
    "Illustrations",
    "Direct"
   ],
   [
    "Spectrum",
    "Illustrated message",
    "Partial"
   ],
   [
    "Polaris",
    "Empty state (image)",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Spectrum, and Polaris agree that illustrations support text in empty and transitional states and are decorative to assistive tech.",
  "sources": [
   "https://atlassian.design/foundations/illustrations",
   "https://spectrum.adobe.com/page/illustrated-message/",
   "https://polaris-react.shopify.com/components/layout-and-structure/empty-state",
   "https://carbondesignsystem.com/elements/pictograms/usage/"
  ]
 },
 "content|Video": {
  "text": "An embedded video player with standard playback controls.",
  "purpose": "Shows motion content such as tutorials or video assets in place, without sending users to another app.",
  "use": [
   "Tutorials, demos, and previews of video assets.",
   "With a poster frame so users see what the video is before playing."
  ],
  "avoid": [
   "Do not autoplay video with sound.",
   "Do not make video the only way to explain a task; give a text alternative."
  ],
  "anatomy": [
   "Poster — the frame shown before play.",
   "Player — the video area.",
   "Controls — play, pause, timeline, volume, captions, and full screen.",
   "Duration — the total length shown before play."
  ],
  "behavior": [
   "Start paused unless muted, short, and decorative.",
   "Keep the aspect ratio fixed while loading.",
   "Remember the volume and caption settings in the session."
  ],
  "accessibility": [
   "Provide captions for speech and a transcript or audio description for visual content.",
   "Make all controls keyboard operable with accessible names.",
   "Let users pause any motion that lasts more than five seconds."
  ],
  "content": [
   "Show the duration and a short title.",
   "Name controls by action, such as \"Play\" and \"Mute\"."
  ],
  "map": [
   [
    "Polaris",
    "Video thumbnail",
    "Partial"
   ]
  ],
  "commonGround": "Only Polaris has a related component, a video thumbnail that opens playback; the systems otherwise defer to WCAG media rules.",
  "sources": [
   "https://polaris-react.shopify.com/components/images-and-icons/video-thumbnail",
   "https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html"
  ]
 },
 "content|Audio": {
  "text": "An embedded audio player with standard playback controls.",
  "purpose": "Plays sound content, such as audio assets or recordings, in place.",
  "use": [
   "Previewing audio assets and recordings.",
   "Users need to scrub or replay part of a clip."
  ],
  "avoid": [
   "Do not autoplay audio.",
   "Audio as the only source of information: give a transcript."
  ],
  "anatomy": [
   "Play button — starts and pauses playback.",
   "Timeline — shows and sets the current position.",
   "Time — elapsed and total time.",
   "Volume — mute and level control."
  ],
  "behavior": [
   "Start paused.",
   "Starting one player pauses the others on the page.",
   "The player width stays stable while loading."
  ],
  "accessibility": [
   "A transcript for speech.",
   "The timeline is a keyboard-operable slider with value text.",
   "Every control has an accessible name."
  ],
  "content": [
   "The title and total duration.",
   "Name controls by action."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html",
   "https://www.w3.org/WAI/ARIA/apg/patterns/slider/"
  ],
  "map": []
 },
 "content|QR code": {
  "text": "A square matrix code encoding a URL or short value for a phone camera to scan.",
  "purpose": "Moves a link or value from the screen to a mobile device without typing.",
  "use": [
   "Handing off a link to a phone, such as app pairing or sharing.",
   "Printed output that people will scan."
  ],
  "avoid": [
   "The only way to reach the content: show the link or value too.",
   "Do not encode secrets that should not be visible on screen."
  ],
  "anatomy": [
   "Code — the generated matrix.",
   "Quiet zone — clear margin around the code.",
   "Caption — what scanning does.",
   "Fallback — the URL or value as text with a copy action."
  ],
  "behavior": [
   "Render dark modules on a light background in both themes.",
   "Keep a quiet zone of at least four modules.",
   "Size the code so it scans from a normal distance."
  ],
  "accessibility": [
   "Give the code alt text that states its purpose.",
   "Always show a text alternative the user can copy."
  ],
  "content": [
   "Say what scanning does, such as \"Scan to open on your phone\".",
   "Show the encoded URL or value as text below the code."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.qrcode.com/en/howto/code.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html"
  ],
  "map": []
 },
 "content|Barcode": {
  "text": "A machine-readable linear or 2D code for an identifier, such as a product or asset number.",
  "purpose": "Lets scanners read an identifier on screen or in print, without manual entry.",
  "use": [
   "Labels and printouts that scanners read.",
   "A workflow that already depends on a barcode standard."
  ],
  "avoid": [
   "Do not use for links to phones; use a QR code instead.",
   "A barcode without its human-readable value."
  ],
  "anatomy": [
   "Bars — the encoded symbol in the chosen format.",
   "Quiet zone — clear margin on each side.",
   "Value — the identifier printed as text below."
  ],
  "behavior": [
   "Black on white regardless of theme.",
   "Bars are never scaled unevenly.",
   "The value is in the mono font."
  ],
  "accessibility": [
   "The image’s alt text includes the value.",
   "Users can copy the value as text."
  ],
  "content": [
   "The format and the value, such as \"SKU 04015\".",
   "The value exactly as encoded, without extra spaces or prefixes."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.gs1.org/standards/barcodes",
   "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html"
  ],
  "map": []
 },
 "content|Color swatch": {
  "text": "A small shape filled with a color, representing a color value.",
  "purpose": "Shows a color directly, so users see and pick it without reading a code.",
  "use": [
   "A color value in palettes, metadata and color pickers.",
   "A swatch group for picking one color."
  ],
  "avoid": [
   "Status: use a badge or status component.",
   "A swatch without its name or value nearby."
  ],
  "anatomy": [
   "Fill — the color.",
   "Border — a subtle outline so light colors stay visible.",
   "Empty state — a slashed pattern for no color.",
   "Label — the color name or value."
  ],
  "behavior": [
   "Selected shows a clear ring or check, not only a bigger size.",
   "Transparency shows over a checkerboard."
  ],
  "accessibility": [
   "Each swatch’s accessible name is the color name or value.",
   "Selectable groups use radio or listbox semantics.",
   "The swatch border is 3:1 against its background."
  ],
  "content": [
   "Colors are named in plain words; the value is in the mono font.",
   "Same color names as the palette or brand library."
  ],
  "map": [
   [
    "Spectrum",
    "Swatch",
    "Direct"
   ],
   [
    "Fluent 2",
    "Swatch picker",
    "Direct"
   ],
   [
    "Polaris",
    "Color picker",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum and Fluent 2 both define swatches with a border for light colors, a selected state, and an accessible color name.",
  "sources": [
   "https://spectrum.adobe.com/page/swatch/",
   "https://fluent2.microsoft.design/components/web/react/core/swatchpicker/usage",
   "https://polaris-react.shopify.com/components/selection-and-input/color-picker"
  ]
 },
 "content|Avatar group": {
  "text": "A row of overlapping avatars that shows the people linked to an item.",
  "purpose": "Shows who is involved, such as owners or collaborators, in little space.",
  "use": [
   "Collaborators, assignees or viewers on an item.",
   "Space for only a summary of people."
  ],
  "avoid": [
   "Users must read every name: use a list.",
   "A single person: use an avatar."
  ],
  "anatomy": [
   "Avatars — the visible people, overlapped or spaced.",
   "Overflow — a \"+N\" item for the rest.",
   "Overflow menu — the full list on select."
  ],
  "behavior": [
   "Shows a fixed maximum and collapses the rest into \"+N\".",
   "The overflow item opens the full list.",
   "Avatars in a group are the same size."
  ],
  "accessibility": [
   "The group has an accessible name such as \"5 collaborators\".",
   "Each avatar has the person’s name.",
   "The overflow item is a button with a clear name."
  ],
  "content": [
   "The overflow reads \"+N\"; the full list is in name order.",
   "The group is named by role, such as \"Collaborators\" or \"Assignees\"."
  ],
  "map": [
   [
    "Atlassian",
    "Avatar group",
    "Direct"
   ],
   [
    "Fluent 2",
    "Avatar group",
    "Direct"
   ],
   [
    "Spectrum",
    "Avatar group",
    "Direct"
   ]
  ],
  "commonGround": "Atlassian and Fluent 2 agree on a maximum visible count with a \"+N\" overflow that reveals the full list.",
  "sources": [
   "https://atlassian.design/components/avatar-group",
   "https://fluent2.microsoft.design/components/web/react/core/avatargroup/usage",
   "https://spectrum.adobe.com/page/avatar-group/"
  ]
 },
 "content|Profile summary": {
  "text": "A compact line with an avatar, a name, and one or two details about a person.",
  "purpose": "Identifies a person in context, such as the owner of an asset, with enough detail to tell people apart.",
  "use": [
   "Identifying a person in detail panes, list rows, and comments.",
   "With a secondary line such as a role or email."
  ],
  "avoid": [
   "Only a face is needed: use an avatar.",
   "Full profile details: use a user card."
  ],
  "anatomy": [
   "Avatar — picture or initials.",
   "Primary text — the display name.",
   "Secondary text — role, team, or email.",
   "Presence — optional status indicator."
  ],
  "behavior": [
   "Truncate long text with an ellipsis and show the full value on hover or focus.",
   "Link the name to the profile when one exists."
  ],
  "accessibility": [
   "Hide the avatar from screen readers when the name is beside it.",
   "Do not rely on the avatar color to identify a person."
  ],
  "content": [
   "Show the display name first, then one useful detail.",
   "Use the name the person chose, not a login ID."
  ],
  "map": [
   [
    "Fluent 2",
    "Persona",
    "Direct"
   ],
   [
    "Atlassian",
    "Avatar item",
    "Direct"
   ]
  ],
  "commonGround": "Fluent 2 Persona and Atlassian Avatar item agree on avatar plus name plus a secondary line, with optional presence.",
  "sources": [
   "https://fluent2.microsoft.design/components/web/react/core/persona/usage",
   "https://atlassian.design/components/avatar/avatar-item"
  ]
 },
 "content|User card": {
  "text": "A card, often shown on hover or click, with a person’s details and quick actions.",
  "purpose": "Lets users learn about a person and act, such as messaging them, without leaving the page.",
  "use": [
   "Users need more than a name, such as role, team, and contact.",
   "A hover or click card from a name or avatar."
  ],
  "avoid": [
   "A full profile page: link to the profile.",
   "Do not put essential actions only in a hover card."
  ],
  "anatomy": [
   "Header — avatar, name, and presence.",
   "Details — role, team, location, and local time.",
   "Actions — such as view profile or message."
  ],
  "behavior": [
   "Open on hover after a short delay, and on focus or click.",
   "Keep the card open while the pointer is over it.",
   "Show a loading state while details load."
  ],
  "accessibility": [
   "Open the card from keyboard focus as well as hover.",
   "Close it with Escape and return focus to the trigger.",
   "Do not trap focus in a non-modal card."
  ],
  "content": [
   "Show only details that help users contact or recognize the person.",
   "Label actions with verbs, such as \"View profile\" and \"Send message\"."
  ],
  "map": [
   [
    "Atlassian",
    "Profile card",
    "Direct"
   ],
   [
    "Fluent 2",
    "Persona",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian defines a profile card on hover; Fluent 2 Persona covers the header part; both put the name and presence first.",
  "sources": [
   "https://atlassian.design/components/profilecard",
   "https://fluent2.microsoft.design/components/web/react/core/persona/usage",
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ]
 },
 "content|Team": {
  "text": "Shows a team as an identity, with its name, avatar, and members.",
  "purpose": "Shows that an item belongs to a group of people, not one person, so users know whom to contact.",
  "use": [
   "Ownership or access is set at the team level.",
   "Pickers that mix people and teams."
  ],
  "avoid": [
   "Ad-hoc lists of people: use an avatar group.",
   "Do not use a person avatar style for a team."
  ],
  "anatomy": [
   "Team avatar — square, to tell it apart from people.",
   "Name — the team name.",
   "Member count — and an optional avatar group."
  ],
  "behavior": [
   "Use square avatars for teams and round ones for people.",
   "Open the team members from the name."
  ],
  "accessibility": [
   "Announce the entity type, such as \"Team\", with the name.",
   "Do not rely on the avatar shape alone to tell teams from people."
  ],
  "content": [
   "Use the team’s official name and show the member count, such as \"12 members\".",
   "Add \"Team\" to the name only when it could be mistaken for a person."
  ],
  "map": [
   [
    "Atlassian",
    "Avatar (square)",
    "Partial"
   ]
  ],
  "commonGround": "Only Atlassian marks non-person entities with square avatars; the systems have no dedicated team component.",
  "sources": [
   "https://atlassian.design/components/avatar"
  ]
 },
 "content|Group": {
  "text": "Shows a permission or user group with its name, type, and member count.",
  "purpose": "Shows a set of users managed together, such as for access control, so admins can recognize and inspect it.",
  "use": [
   "Showing groups in access settings and user pickers.",
   "A group is granted a role or permission."
  ],
  "avoid": [
   "Organizational teams with people-facing identity: use a team.",
   "Do not show a group as a single person in pickers or lists."
  ],
  "anatomy": [
   "Group icon — a generic group symbol.",
   "Name — the group name.",
   "Count — number of members.",
   "Source — optional, such as a synced directory."
  ],
  "behavior": [
   "Show members on demand, not inline.",
   "Mark synced groups as read-only."
  ],
  "accessibility": [
   "Announce \"Group\" with the name.",
   "Give the member list link an accessible name."
  ],
  "content": [
   "Use the group name as stored and add the count.",
   "Name the source for synced groups, such as \"Synced from directory\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
  ],
  "map": []
 },
 "content|Role": {
  "text": "Names the set of permissions a person or group has, such as Viewer or Admin.",
  "purpose": "Shows at a glance what someone can do with an item.",
  "use": [
   "Member lists, sharing dialogs, and admin tables.",
   "The role can change: put a select or menu next to the label."
  ],
  "avoid": [
   "Showing status: use a status badge.",
   "Do not list raw permissions where a role name is enough."
  ],
  "anatomy": [
   "Label — the role name.",
   "Description — optional one-line summary of what the role allows.",
   "Change control — optional menu to change the role."
  ],
  "behavior": [
   "Show roles in a neutral style, not a status color.",
   "Explain each role in the change menu.",
   "Disable the change control when the user lacks rights and say why."
  ],
  "accessibility": [
   "Give the change control an accessible name that includes the person’s name.",
   "Do not rely on color to tell roles apart."
  ],
  "content": [
   "Use one short noun per role and keep names consistent across the product.",
   "Describe each role by what it allows, such as \"Can edit and share\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/"
  ],
  "map": []
 },
 "content|Permission summary": {
  "text": "States who can access an item and what they can do.",
  "purpose": "Answers \"who can see or edit this\" before users share or change content.",
  "use": [
   "The top of sharing dialogs, and item detail panes.",
   "Access is inherited or restricted."
  ],
  "avoid": [
   "Listing every permission: link to the full access settings.",
   "Changing access: link to the sharing dialog."
  ],
  "anatomy": [
   "Access level — such as \"Only you\", \"Your team\", or \"Anyone with the link\".",
   "Icon — a lock or globe matching the level.",
   "Detail — inherited source and count of people.",
   "Link — to manage access."
  ],
  "behavior": [
   "Update the summary immediately when access changes.",
   "Show where inherited access comes from."
  ],
  "accessibility": [
   "Do not rely on the icon alone; state the level in text.",
   "Announce changes to the summary politely."
  ],
  "content": [
   "Lead with the audience, then the right, such as \"Your team can edit\".",
   "Name the source of inherited access, such as \"From the Marketing folder\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
  ],
  "map": []
 },
 "content|Presence": {
  "text": "A small indicator on an avatar showing whether a person is available.",
  "purpose": "Helps users decide whether to contact someone now.",
  "use": [
   "Avatars in chat, comments, and people lists.",
   "Only when presence data is live."
  ],
  "avoid": [
   "Item or system status: use a status badge.",
   "Do not show stale presence."
  ],
  "anatomy": [
   "Indicator — a dot or icon at the corner of the avatar.",
   "State — available, busy, away, do not disturb, or offline."
  ],
  "behavior": [
   "Use a distinct shape or icon per state, not only color.",
   "Update in real time and fall back to offline when unknown."
  ],
  "accessibility": [
   "Include the state in the accessible name, such as \"Ana, busy\".",
   "Keep the indicator at 3:1 against its background."
  ],
  "content": [
   "Use fixed state names across the product.",
   "Use short state names, such as \"Available\", \"Busy\", and \"Away\"."
  ],
  "map": [
   [
    "Atlassian",
    "Presence",
    "Direct"
   ],
   [
    "Fluent 2",
    "Presence badge",
    "Direct"
   ]
  ],
  "commonGround": "Atlassian and Fluent 2 use a corner badge with an icon shape per state; Fluent 2 has more states, such as out of office.",
  "sources": [
   "https://atlassian.design/components/avatar",
   "https://fluent2.microsoft.design/components/web/react/core/presencebadge/usage"
  ]
 },
 "content|Online status": {
  "text": "A text label, with an optional dot, stating a person’s availability.",
  "purpose": "States availability in words where an avatar badge is too small or absent.",
  "use": [
   "Next to the name in profile cards and member lists.",
   "The state needs a time, such as \"Away for 10 minutes\"."
  ],
  "avoid": [
   "System or job status: use a status badge.",
   "Do not show it when presence data is unavailable or not allowed."
  ],
  "anatomy": [
   "Dot — optional matching presence indicator.",
   "Label — the state in text.",
   "Detail — optional time or note."
  ],
  "behavior": [
   "Use the same states and order as presence.",
   "Show \"Last seen\" time for offline when known and allowed."
  ],
  "accessibility": [
   "The text carries the state, so the dot is decorative.",
   "Keep label contrast at 4.5:1."
  ],
  "content": [
   "Use the state names from presence, in sentence case.",
   "Keep any note short, such as \"In a meeting until 3:00 PM\"."
  ],
  "map": [
   [
    "Fluent 2",
    "Presence badge (with label)",
    "Partial"
   ],
   [
    "Atlassian",
    "Presence",
    "Partial"
   ]
  ],
  "commonGround": "Fluent 2 and Atlassian define presence states that the text label must match; neither has a separate text component.",
  "sources": [
   "https://fluent2.microsoft.design/components/web/react/core/presencebadge/usage",
   "https://atlassian.design/components/avatar"
  ]
 },
 "content|Timestamp": {
  "text": "A date and time showing when something happened.",
  "purpose": "Tells users when an item was created, changed, or logged, in a format they can read and compare.",
  "use": [
   "Logs, version history, and item details.",
   "Order or audit matters: use an exact timestamp."
  ],
  "avoid": [
   "Recent activity where rough time is enough: use relative time.",
   "Do not show seconds unless order within a minute matters."
  ],
  "anatomy": [
   "Date — the day.",
   "Time — hours and minutes, with seconds only when needed.",
   "Time zone — when users may be in different zones."
  ],
  "behavior": [
   "Format to the user’s locale and time zone.",
   "Use one format per context, the same in all rows.",
   "Use the mono font when it is a technical value."
  ],
  "accessibility": [
   "Use the time element with a machine-readable datetime value.",
   "Do not abbreviate in ways screen readers misread."
  ],
  "content": [
   "Spell out or abbreviate months; avoid ambiguous numeric dates.",
   "Show the time zone when it matters."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time",
   "https://carbondesignsystem.com/guidelines/content/grammar-and-mechanics/",
   "https://polaris.shopify.com/content/grammar-and-mechanics"
  ],
  "map": []
 },
 "content|Relative time": {
  "text": "A time relative to now, such as \"5 minutes ago\" or \"in 2 days\".",
  "purpose": "Gives a quick sense of recency without making users do date math.",
  "use": [
   "Recent activity, comments, and notifications.",
   "Times within about a week."
  ],
  "avoid": [
   "Exact time matters, such as audit logs: use a timestamp.",
   "Times far in the past: switch to a date."
  ],
  "anatomy": [
   "Text — the relative phrase.",
   "Exact value — the full timestamp shown on hover or focus."
  ],
  "behavior": [
   "Show \"Just now\" for under a minute.",
   "Update the text on a timer without moving the layout.",
   "Switch to a date after a set threshold."
  ],
  "accessibility": [
   "Expose the exact time in the datetime attribute and in a keyboard-reachable tooltip.",
   "Do not announce every timer update to screen readers."
  ],
  "content": [
   "Use whole units, such as \"3 hours ago\", not \"3.2 hours\".",
   "Use \"Yesterday\", not \"1 day ago\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat",
   "https://polaris.shopify.com/content/grammar-and-mechanics"
  ],
  "map": []
 },
 "content|Date label": {
  "text": "A short label for a date without a time, such as a due or published date.",
  "purpose": "Shows a calendar date in a compact, consistent form.",
  "use": [
   "Due, publish and expiry dates.",
   "A status color only when the date is overdue or near."
  ],
  "avoid": [
   "The time matters: use a timestamp.",
   "A time range: use a date range label."
  ],
  "anatomy": [
   "Icon — optional calendar icon.",
   "Date — the formatted date.",
   "Prefix — optional, such as \"Due\"."
  ],
  "behavior": [
   "Formatted to the user’s locale.",
   "Dates in the current year omit the year when the context is clear."
  ],
  "accessibility": [
   "The time element with a machine-readable date.",
   "Overdue is stated in text, not only color."
  ],
  "content": [
   "\"Due Oct 8\" style, with a clear prefix.",
   "The year is included for dates outside the current year."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time"
  ],
  "map": []
 },
 "content|Version label": {
  "text": "Shows the version of an item, such as v3 or 2.1.0.",
  "purpose": "Tells users which version they are viewing, so they can compare and restore versions.",
  "use": [
   "Asset details, version history, and file headers.",
   "Several versions exist: add \"Current\" or \"Draft\"."
  ],
  "avoid": [
   "Status: use a status badge.",
   "Do not invent version names where the system only stores numbers."
  ],
  "anatomy": [
   "Version — the number or name, in the mono font.",
   "Qualifier — optional, such as \"Latest\" or \"Draft\"."
  ],
  "behavior": [
   "Use one version format across the product.",
   "Link the label to the version history when available."
  ],
  "accessibility": [
   "Give the label an accessible name such as \"Version 3\".",
   "Keep text contrast at 4.5:1."
  ],
  "content": [
   "Write \"v3\" or the full semantic version, never both mixed.",
   "Add a qualifier such as \"Latest\" to only one version at a time."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://semver.org/"
  ],
  "map": []
 },
 "actions|Primary button": {
  "text": "The most emphasized button, for the main action in a view.",
  "purpose": "Shows the most important next step, so the main path is clear.",
  "use": [
   "The one main action in a page, dialog or form.",
   "Actions that complete or move a task forward."
  ],
  "avoid": [
   "More than one primary button in a view.",
   "Navigating to another page: use a link."
  ],
  "anatomy": [
   "Container — filled with the accent color.",
   "Label — the action text.",
   "Icon — optional leading or trailing icon."
  ],
  "behavior": [
   "Goes at the end of the action group in reading order.",
   "Shows a loading state while the action runs and prevents double submit.",
   "Stays enabled; explain errors on submit where possible."
  ],
  "accessibility": [
   "A native button element, activated by Enter and Space.",
   "A visible focus indicator and 4.5:1 label contrast.",
   "Target at least 24 by 24 pixels."
  ],
  "content": [
   "Starts with a verb and names the outcome, such as \"Save changes\".",
   "Sentence case, no end punctuation."
  ],
  "map": [
   [
    "Carbon",
    "Button (primary)",
    "Variant"
   ],
   [
    "Atlassian",
    "Button (primary)",
    "Variant"
   ],
   [
    "Material 3",
    "Filled button",
    "Direct"
   ],
   [
    "Fluent 2",
    "Button (primary)",
    "Variant"
   ],
   [
    "Polaris",
    "Button (primary)",
    "Variant"
   ],
   [
    "Spectrum",
    "Button (accent)",
    "Variant"
   ]
  ],
  "commonGround": "All six systems agree on one high-emphasis button per view with a verb-first label; they differ on whether it goes left or right of secondary buttons.",
  "sources": [
   "https://carbondesignsystem.com/components/button/usage/",
   "https://atlassian.design/components/button",
   "https://m3.material.io/components/buttons/overview",
   "https://polaris-react.shopify.com/components/actions/button",
   "https://spectrum.adobe.com/page/button/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/button/"
  ]
 },
 "actions|Split button": {
  "text": "A main action button with an attached menu button for related actions.",
  "purpose": "Fast access to the most common action, with close alternatives one click away.",
  "use": [
   "One action is most common and a few related variants exist.",
   "Limited space, with alternatives of the same kind."
  ],
  "avoid": [
   "All actions equally likely: use a menu button.",
   "No clear main action: use separate buttons."
  ],
  "anatomy": [
   "Main button — runs the default action.",
   "Divider — separates the two parts.",
   "Menu button — a chevron that opens the menu.",
   "Menu — the related actions."
  ],
  "behavior": [
   "The main part runs the default action; the chevron opens the menu.",
   "The default action changes with the last choice only if the label updates.",
   "Both parts have the same emphasis."
  ],
  "accessibility": [
   "Both parts are separate tab stops with their own names.",
   "The chevron has aria-haspopup and aria-expanded.",
   "Arrow keys move in the menu; Escape closes it."
  ],
  "content": [
   "The main part names the action; the chevron is \"More [action] options\".",
   "Menu labels parallel the main action, such as \"Save as draft\"."
  ],
  "map": [
   [
    "Carbon",
    "Combo button",
    "Direct"
   ],
   [
    "Atlassian",
    "Split button",
    "Direct"
   ],
   [
    "Material 3",
    "Split button",
    "Direct"
   ],
   [
    "Fluent 2",
    "Split button",
    "Direct"
   ]
  ],
  "commonGround": "Carbon, Atlassian, Material 3, and Fluent 2 agree on a default action plus a chevron menu of related actions, used when one action dominates.",
  "sources": [
   "https://carbondesignsystem.com/components/menu-buttons/usage/",
   "https://atlassian.design/components/button/split-button",
   "https://m3.material.io/components/split-button/overview",
   "https://fluent2.microsoft.design/components/web/react/core/splitbutton/usage",
   "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/"
  ]
 },
 "actions|Floating action button": {
  "text": "A button floating above content that holds a screen’s single most important action.",
  "purpose": "Keeps the main create or compose action in reach while scrolling.",
  "use": [
   "Mobile or touch layouts: one primary, constructive action such as create.",
   "An action that applies to the whole screen."
  ],
  "avoid": [
   "Destructive or minor actions.",
   "Dense desktop work areas: use a primary button in the header or toolbar."
  ],
  "anatomy": [
   "Container — a raised shape with elevation.",
   "Icon — the action icon.",
   "Label — optional, for an extended button."
  ],
  "behavior": [
   "Show only one per screen.",
   "Sits at the bottom end corner, clear of other controls.",
   "Never covers content the user must reach; add bottom space."
  ],
  "accessibility": [
   "Icon-only buttons have an accessible name.",
   "Target at least 44 by 44 pixels on touch.",
   "A logical place in the focus order, not last after a long page."
  ],
  "content": [
   "The extended label is a verb, such as \"Upload\".",
   "An icon that clearly means the action, such as add or edit."
  ],
  "map": [
   [
    "Material 3",
    "FAB",
    "Direct"
   ],
   [
    "Material 3",
    "Extended FAB",
    "Variant"
   ],
   [
    "Fluent 2",
    "FAB (iOS, Android)",
    "Direct"
   ]
  ],
  "commonGround": "Material 3 and Fluent 2 mobile agree on one FAB per screen for the main positive action; desktop-focused systems such as Carbon and Atlassian do not use it.",
  "sources": [
   "https://m3.material.io/components/floating-action-button/overview",
   "https://m3.material.io/components/extended-fab/overview"
  ]
 },
 "actions|Action panel": {
  "text": "A group of related action buttons for an item or selection, in one region.",
  "purpose": "Puts the actions for the current object in one place, so users do not search for them.",
  "use": [
   "Actions for the selected item, in a detail pane or toolbar.",
   "Bulk actions when several items are selected."
  ],
  "avoid": [
   "Unrelated actions in one panel.",
   "More than about five visible actions: move the rest into an overflow menu."
  ],
  "anatomy": [
   "Container — the toolbar or panel region.",
   "Actions — buttons in order of use.",
   "Overflow — a \"More\" menu for the rest.",
   "Selection count — for bulk actions."
  ],
  "behavior": [
   "Order actions by frequency and keep the order stable.",
   "Collapse lower-priority actions into overflow as space shrinks.",
   "Disable actions that do not apply and explain why on hover or focus."
  ],
  "accessibility": [
   "Many buttons: toolbar semantics with arrow-key movement.",
   "Give icon-only actions accessible names and tooltips."
  ],
  "content": [
   "Short verbs; keep labels parallel.",
   "One label per action, wherever it appears."
  ],
  "map": [
   [
    "Spectrum",
    "Action group",
    "Partial"
   ],
   [
    "Spectrum",
    "Action bar",
    "Partial"
   ],
   [
    "Fluent 2",
    "Toolbar",
    "Partial"
   ],
   [
    "Polaris",
    "Action list",
    "Partial"
   ],
   [
    "Carbon",
    "Data grid (batch actions)",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum, Fluent 2, and Carbon agree on grouping related actions with an overflow for extras and a separate bar for actions on a selection.",
  "sources": [
   "https://spectrum.adobe.com/page/action-group/",
   "https://spectrum.adobe.com/page/action-bar/",
   "https://fluent2.microsoft.design/components/web/react/core/toolbar/usage",
   "https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/"
  ]
 },
 "actions|Context menu": {
  "text": "A menu of actions for an object, opened by right-click, long press, or a shortcut.",
  "purpose": "Quick access to actions on the object under the pointer, without moving to a toolbar.",
  "use": [
   "A shortcut to actions also available elsewhere.",
   "Items in lists, grids and canvases."
  ],
  "avoid": [
   "Actions found only in a context menu: they are hard to discover.",
   "Overriding the browser menu on plain text or links."
  ],
  "anatomy": [
   "Menu — the popup list at the pointer.",
   "Items — actions with optional icons and shortcuts.",
   "Groups — separators between related sets.",
   "Submenus — optional nested menus."
  ],
  "behavior": [
   "Opens at the pointer and stays inside the viewport.",
   "Acts on the item under the pointer or the current selection.",
   "Closes on select, Escape or an outside click."
  ],
  "accessibility": [
   "Opens with Shift+F10 or the Menu key, as well as right-click.",
   "menu and menuitem roles, with arrow-key movement.",
   "Focus returns to the item on close."
  ],
  "content": [
   "Short verb labels; keyboard shortcuts at the end.",
   "Same labels as the matching toolbar and menu commands."
  ],
  "map": [
   [
    "Carbon",
    "Menu",
    "Direct"
   ],
   [
    "Fluent 2",
    "Menu",
    "Partial"
   ],
   [
    "Spectrum",
    "Menu",
    "Partial"
   ],
   [
    "Atlassian",
    "Dropdown menu",
    "Partial"
   ]
  ],
  "commonGround": "Carbon defines a context menu directly; the systems agree that context menu actions must also exist in visible UI.",
  "sources": [
   "https://carbondesignsystem.com/components/menu/usage/",
   "https://fluent2.microsoft.design/components/web/react/core/menu/usage",
   "https://spectrum.adobe.com/page/menu/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/"
  ]
 },
 "actions|Command menu": {
  "text": "A menu of commands opened from a button, such as \"More\" or \"Actions\".",
  "purpose": "Holds several related commands behind one control, to save space.",
  "use": [
   "Several actions of similar weight that do not fit as buttons.",
   "The overflow \"More actions\" button on items."
  ],
  "avoid": [
   "One or two actions: show them as buttons.",
   "Choosing a value in a form: use a select."
  ],
  "anatomy": [
   "Trigger — a button with a label or overflow icon.",
   "Menu — the list of commands.",
   "Items — commands with optional icons, shortcuts, and descriptions.",
   "Separators — between groups."
  ],
  "behavior": [
   "Opens below the trigger and flips to stay in view.",
   "Closes after a command runs.",
   "Destructive commands are marked and placed last."
  ],
  "accessibility": [
   "Menu button pattern, with aria-haspopup and aria-expanded.",
   "Arrow keys move, Enter selects, Escape closes.",
   "Icon-only triggers have an accessible name."
  ],
  "content": [
   "Each item starts with a verb; keep labels short.",
   "An icon-only trigger is labeled \"More actions\"."
  ],
  "map": [
   [
    "Carbon",
    "Menu button",
    "Direct"
   ],
   [
    "Carbon",
    "Overflow menu",
    "Variant"
   ],
   [
    "Atlassian",
    "Dropdown menu",
    "Direct"
   ],
   [
    "Material 3",
    "Menus",
    "Direct"
   ],
   [
    "Fluent 2",
    "Menu button",
    "Direct"
   ],
   [
    "Spectrum",
    "Action menu",
    "Direct"
   ],
   [
    "Polaris",
    "Action list",
    "Partial"
   ]
  ],
  "commonGround": "All systems agree on a button-triggered menu for related commands, with an icon-only overflow variant for tight spaces.",
  "sources": [
   "https://carbondesignsystem.com/components/menu-buttons/usage/",
   "https://carbondesignsystem.com/components/overflow-menu/usage/",
   "https://atlassian.design/components/dropdown-menu",
   "https://m3.material.io/components/menus/overview",
   "https://spectrum.adobe.com/page/action-menu/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/"
  ]
 },
 "actions|Command palette": {
  "text": "A searchable dialog, opened by a shortcut, listing commands and places to jump to.",
  "purpose": "Lets keyboard users run any command or reach any page by typing, without hunting in menus.",
  "use": [
   "Apps with many commands and frequent keyboard users.",
   "A faster path to actions that also exist in the UI."
  ],
  "avoid": [
   "The only way to reach a command.",
   "Searching content records: use search."
  ],
  "anatomy": [
   "Search field — filters as the user types.",
   "Results — commands grouped by type with shortcuts.",
   "Recent — recent commands before typing.",
   "Footer — key hints."
  ],
  "behavior": [
   "Opens with Ctrl+K or Cmd+K, and from a visible control.",
   "Fuzzy matching; recent and exact matches rank first.",
   "Enter runs the command and closes the palette."
  ],
  "accessibility": [
   "A modal dialog with the combobox and listbox pattern.",
   "The active result is announced with aria-activedescendant.",
   "Escape closes it and returns focus."
  ],
  "content": [
   "Commands are verb plus object, such as \"Create collection\".",
   "Same command names as the menus and buttons."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ],
  "map": []
 },
 "actions|Radio menu item": {
  "text": "A menu item in a set where only one can be selected.",
  "purpose": "Picks one option, such as a sort order or view, directly from a menu.",
  "use": [
   "Exclusive settings in menus, such as sort or density.",
   "Menus that show the current choice."
  ],
  "avoid": [
   "Independent on/off options: use a checkbox menu item.",
   "Forms: use radio buttons or a select."
  ],
  "anatomy": [
   "Group — the set of exclusive items, often with a heading.",
   "Indicator — a check or dot on the selected item.",
   "Label — the option name."
  ],
  "behavior": [
   "Selecting one item clears the others in the group.",
   "The menu stays open or closes, consistently across the product.",
   "The current choice always shows when the menu opens."
  ],
  "accessibility": [
   "The menuitemradio role with aria-checked.",
   "Items sit in a labeled group."
  ],
  "content": [
   "Short nouns or adjectives, such as \"Newest first\".",
   "A heading names the group, such as \"Sort by\"."
  ],
  "map": [
   [
    "Atlassian",
    "Dropdown item radio",
    "Direct"
   ],
   [
    "Fluent 2",
    "Menu item radio",
    "Direct"
   ],
   [
    "Carbon",
    "Menu (radio group)",
    "Variant"
   ],
   [
    "Spectrum",
    "Menu (single selection)",
    "Variant"
   ]
  ],
  "commonGround": "Atlassian, Fluent 2, Carbon, and Spectrum agree on grouped exclusive items with a check indicator and the menuitemradio role.",
  "sources": [
   "https://atlassian.design/components/dropdown-menu",
   "https://fluent2.microsoft.design/components/web/react/core/menu/usage",
   "https://carbondesignsystem.com/components/menu/usage/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/"
  ]
 },
 "actions|Copy": {
  "text": "Copies a value, link or text to the clipboard.",
  "purpose": "Saves selecting text by hand and avoids copy errors.",
  "use": [
   "Next to values users often paste elsewhere, such as IDs, links and code.",
   "A menu command for an item link."
  ],
  "avoid": [
   "Duplicating an item in the app: use duplicate.",
   "Hiding the value: show it next to the copy control."
  ],
  "anatomy": [
   "Trigger — an icon button or menu item.",
   "Feedback — a short \"Copied\" confirmation."
  ],
  "behavior": [
   "Copies the exact value shown, without extra spaces.",
   "Shows a brief confirmation near the trigger, then returns to rest.",
   "Shows an error if clipboard access fails."
  ],
  "accessibility": [
   "Icon-only triggers have a name such as \"Copy link\".",
   "\"Copied\" is announced in a polite live region."
  ],
  "content": [
   "\"Copy\" plus the object, such as \"Copy ID\"; confirm with \"Copied\".",
   "The confirmation is one or two words."
  ],
  "map": [
   [
    "Carbon",
    "Copy button",
    "Direct"
   ],
   [
    "Carbon",
    "Code snippet",
    "Partial"
   ],
   [
    "Atlassian",
    "Code block (copy)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Atlassian agree on an icon button beside the value and a short, announced \"Copied\" confirmation.",
  "sources": [
   "https://carbondesignsystem.com/components/copy-button/usage/",
   "https://carbondesignsystem.com/components/code-snippet/usage/",
   "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
  ]
 },
 "actions|Download": {
  "text": "Saves a file from the app to the user’s device.",
  "purpose": "Gives users a local copy of an asset or file.",
  "use": [
   "Files and assets in their stored format.",
   "A menu when several formats or sizes are available."
  ],
  "avoid": [
   "A transformed or filtered file: use export.",
   "Opening a file in the browser: use a link."
  ],
  "anatomy": [
   "Trigger — a button, link, or menu item with a download icon.",
   "File details — format and size.",
   "Progress — for large files."
  ],
  "behavior": [
   "Format and size show before download.",
   "Large or bundled files show progress and can be canceled.",
   "A download prepared in the background tells users when it is ready."
  ],
  "accessibility": [
   "The control’s name includes the file and format.",
   "A background download announces when it is ready."
  ],
  "content": [
   "\"Download\" plus the object, such as \"Download original (PNG, 4 MB)\".",
   "The file name users will see on their device."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
  ],
  "map": []
 },
 "actions|Export": {
  "text": "Turns data or content into a file in a chosen format.",
  "purpose": "Lets users take data out of the app for other tools.",
  "use": [
   "Tables, reports and selections that produce a file such as CSV or PDF.",
   "Users can choose format, scope or fields."
  ],
  "avoid": [
   "Downloading a stored file as is: use download.",
   "Exporting without saying which filters apply."
  ],
  "anatomy": [
   "Trigger — a button or menu item.",
   "Options dialog — format, scope, and fields.",
   "Progress — and a link when ready."
  ],
  "behavior": [
   "Defaults to the current view and filters.",
   "Large exports run in the background and notify on completion.",
   "Shows what will be exported, such as the row count."
  ],
  "accessibility": [
   "The options dialog works by keyboard and has labeled fields.",
   "Completion and errors are announced."
  ],
  "content": [
   "\"Export\" plus the scope, such as \"Export 240 rows\".",
   "Options name the format, such as \"CSV\" or \"PDF\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ],
  "map": []
 },
 "actions|Import": {
  "text": "Brings files or data from outside into the app.",
  "purpose": "Lets users add content in bulk instead of by hand.",
  "use": [
   "Adding files, assets, or data from a file such as CSV.",
   "Drag and drop and a file picker, together."
  ],
  "avoid": [
   "A single file field in a form: use a file uploader.",
   "An import that can overwrite data without a review step."
  ],
  "anatomy": [
   "Trigger — a button or drop area.",
   "File selection — picker and drop zone.",
   "Mapping or review — for structured data.",
   "Progress and results — counts of success and errors."
  ],
  "behavior": [
   "Files are validated before import; accepted types and limits are stated.",
   "Data imports have a review step.",
   "Reports what was imported and what failed, with a way to fix it."
  ],
  "accessibility": [
   "Always a file picker button, not only drag and drop.",
   "Progress and results are announced."
  ],
  "content": [
   "Accepted formats and limits up front, such as \"CSV up to 10 MB\".",
   "Results as counts, such as \"48 imported, 2 failed\"."
  ],
  "map": [
   [
    "Polaris",
    "Drop zone",
    "Partial"
   ],
   [
    "Carbon",
    "File uploader",
    "Partial"
   ],
   [
    "Spectrum",
    "Drop zone",
    "Partial"
   ]
  ],
  "commonGround": "Polaris, Carbon, and Spectrum agree on a drop area with a visible browse button, clear file limits, and per-file errors.",
  "sources": [
   "https://polaris-react.shopify.com/components/selection-and-input/drop-zone",
   "https://carbondesignsystem.com/components/file-uploader/usage/",
   "https://spectrum.adobe.com/page/drop-zone/"
  ]
 },
 "actions|Print": {
  "text": "Opens a print-ready view of the current content.",
  "purpose": "Gives a paper or PDF copy laid out for print.",
  "use": [
   "Reports, invoices and detail pages people file or share on paper.",
   "A print layout that differs from the screen, such as a summary sheet."
  ],
  "avoid": [
   "Every page: where the layout is fine, rely on browser print.",
   "Creating files: use export."
  ],
  "anatomy": [
   "Trigger — a button or menu item.",
   "Print style — a stylesheet that hides app chrome."
  ],
  "behavior": [
   "Navigation and controls are hidden in print.",
   "Prints in light colors regardless of theme.",
   "Shows link URLs in print where useful."
  ],
  "accessibility": [
   "A native button that calls the browser print dialog.",
   "Print text is black on white for contrast."
  ],
  "content": [
   "Label \"Print\" or \"Print [object]\".",
   "The printed page has a title and date."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://developer.mozilla.org/en-US/docs/Web/CSS/@media"
  ],
  "map": []
 },
 "actions|Share": {
  "text": "Gives other people access to an item or sends them a link.",
  "purpose": "Lets users collaborate on and distribute content from where they are.",
  "use": [
   "Items others can view or edit.",
   "With a dialog that sets people and access."
  ],
  "avoid": [
   "Only a link can be copied: use copy link.",
   "Defaulting to broader access than the item already has."
  ],
  "anatomy": [
   "Trigger — a button with a share icon and label.",
   "Dialog — people picker, access level, and permission summary.",
   "Copy link — a quick action."
  ],
  "behavior": [
   "Shows who already has access.",
   "Confirms before granting public access.",
   "Uses the native share sheet on mobile when available."
  ],
  "accessibility": [
   "A modal dialog with labeled fields.",
   "Added people and access changes are announced."
  ],
  "content": [
   "\"Share\" on the button; state the access, such as \"Anyone with the link can view\".",
   "The confirmation names people and groups, such as \"Shared with Design team\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ],
  "map": []
 },
 "actions|Duplicate": {
  "text": "Creates a copy of an item in the app.",
  "purpose": "Lets users start from an existing item instead of from scratch.",
  "use": [
   "Items users often vary, such as collections, templates and settings.",
   "A copy that keeps most settings of the original."
  ],
  "avoid": [
   "Clipboard copy: use copy.",
   "Silent bulk duplicates: show a result count."
  ],
  "anatomy": [
   "Trigger — a menu item or button.",
   "Result — the new item, named as a copy."
  ],
  "behavior": [
   "The copy is named \"[name] copy\" and placed next to the original.",
   "The new item is selected or opened after it is created.",
   "Say what is not copied, such as comments or permissions."
  ],
  "accessibility": [
   "Focus moves to the new item, and it is announced.",
   "The new item has a unique accessible name."
  ],
  "content": [
   "Label \"Duplicate\"; copies get a clear suffix.",
   "Name the copy \"[name] copy\", then \"[name] copy 2\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
  ],
  "map": []
 },
 "actions|Rename": {
  "text": "Changes the name of an item.",
  "purpose": "Lets users correct or organize names in place.",
  "use": [
   "Items with user-defined names, such as files and folders.",
   "Inline editing for quick renames; a dialog when more checks are needed."
  ],
  "avoid": [
   "Editing other fields: use an edit form.",
   "System items users cannot own: disable the action."
  ],
  "anatomy": [
   "Trigger — a menu item, F2, or double-click on the name.",
   "Field — inline text input with the current name selected.",
   "Validation — message for invalid or duplicate names."
  ],
  "behavior": [
   "On open, the name is selected without the file extension.",
   "Enter or blur saves; Escape cancels.",
   "Validates before saving; on error the field stays open."
  ],
  "accessibility": [
   "The field is labeled with the current name.",
   "Errors and the saved result are announced."
  ],
  "content": [
   "Label \"Rename\"; the error explains the name rules.",
   "The field keeps the current name, so users edit instead of retyping."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html"
  ],
  "map": []
 },
 "actions|Delete": {
  "text": "Removes an item, usually with confirmation or undo.",
  "purpose": "Lets users remove content while protecting them from losing work by mistake.",
  "use": [
   "Removing items the user owns.",
   "Confirmation for permanent or large deletes; undo for small ones."
  ],
  "avoid": [
   "The danger style for reversible removes such as \"Remove from collection\".",
   "Confirming small reversible deletes: offer undo."
  ],
  "anatomy": [
   "Trigger — a menu item or danger button.",
   "Confirmation dialog — names what will be deleted and the effect.",
   "Undo — a toast with an undo action."
  ],
  "behavior": [
   "Delete goes last, apart from other actions.",
   "The confirmation names the item and the count.",
   "Prefer trash or undo to permanent removal."
  ],
  "accessibility": [
   "Focus starts on the cancel button in confirmations.",
   "Not red alone: use the word \"Delete\".",
   "Announce the result."
  ],
  "content": [
   "\"Delete\" plus the object, such as \"Delete 3 assets?\".",
   "State whether it can be undone."
  ],
  "map": [
   [
    "Carbon",
    "Danger button",
    "Partial"
   ],
   [
    "Atlassian",
    "Button (danger)",
    "Partial"
   ],
   [
    "Polaris",
    "Button (critical)",
    "Partial"
   ],
   [
    "Spectrum",
    "Alert dialog (destructive)",
    "Partial"
   ]
  ],
  "commonGround": "The systems agree on a danger style, a confirmation that names the item, and undo where possible; they differ on default focus in the dialog.",
  "sources": [
   "https://carbondesignsystem.com/components/button/usage/",
   "https://atlassian.design/components/button",
   "https://polaris-react.shopify.com/components/actions/button",
   "https://spectrum.adobe.com/page/alert-dialog/"
  ]
 },
 "actions|Back to top": {
  "text": "A control that scrolls the page back to the top.",
  "purpose": "Saves a long scroll on long pages.",
  "use": [
   "Long pages, such as documentation or long lists.",
   "Pages where the header and navigation scroll out of view."
  ],
  "avoid": [
   "Short pages, or panes with their own short scroll.",
   "A fixed header that holds the main navigation."
  ],
  "anatomy": [
   "Trigger — a link or button with an up arrow and label.",
   "Position — fixed at the bottom end of the content area."
  ],
  "behavior": [
   "Appears after the user scrolls more than about one screen.",
   "Moves focus to the top of the page after scrolling.",
   "With reduced motion, jumps instead of scrolling smoothly."
  ],
  "accessibility": [
   "Keyboard reachable, with a name such as \"Back to top\".",
   "Target at least 24 by 24 pixels."
  ],
  "content": [
   "Label \"Back to top\".",
   "No text or icons beyond the arrow."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html"
  ],
  "map": []
 },
 "forms|Form section": {
  "text": "A titled block of related fields inside a longer form.",
  "purpose": "Breaks a long form into named chunks, so people can scan it, see progress, and find a field again.",
  "use": [
   "A form with more than about six fields that fall into clear topics.",
   "Separating required setup from optional or advanced settings."
  ],
  "avoid": [
   "Two or three fields: a plain form reads faster.",
   "Each chunk is a separate task: use a stepper or separate pages."
  ],
  "anatomy": [
   "Section title — a short heading that names the topic.",
   "Description — optional one-line note under the title.",
   "Field area — the fields of the section, stacked in one column.",
   "Divider or spacing — separation from the next section."
  ],
  "behavior": [
   "Stack sections vertically in the order people think about the task.",
   "Keep every section expanded by default; collapse only optional, advanced sections.",
   "Keep one set of form actions for the whole form, not one per section."
  ],
  "accessibility": [
   "Mark the title as a real heading at the correct level, so screen reader users can jump between sections.",
   "Do not rely on borders or background color alone to show the grouping."
  ],
  "content": [
   "Write the title as a noun phrase in sentence case, such as \"Billing address\".",
   "Keep descriptions to one sentence that explains why the data is needed."
  ],
  "map": [
   [
    "Carbon",
    "Form",
    "Partial"
   ],
   [
    "Atlassian",
    "Form (form section)",
    "Direct"
   ],
   [
    "Polaris",
    "Form layout",
    "Partial"
   ],
   [
    "Spectrum",
    "Form",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Atlassian and Polaris group long forms under short headings in a single column; Atlassian ships a dedicated form section part, the others treat it as layout guidance.",
  "sources": [
   "https://carbondesignsystem.com/patterns/forms-pattern/",
   "https://atlassian.design/components/form",
   "https://polaris-react.shopify.com/components/selection-and-input/form-layout"
  ]
 },
 "forms|Field group": {
  "text": "Related inputs that answer one question together, wrapped in a fieldset.",
  "purpose": "Ties inputs such as a radio set, a date in three parts, or an address block to one shared label.",
  "use": [
   "Radio buttons and checkboxes that answer one question.",
   "Compound values split into several inputs, such as first and last name."
  ],
  "avoid": [
   "Unrelated fields: use a form section.",
   "Do not nest field groups."
  ],
  "anatomy": [
   "Fieldset — the container that defines the group.",
   "Legend — the shared label for the group.",
   "Help text — optional guidance that applies to every input.",
   "Inputs — the controls in the group, each with its own label."
  ],
  "behavior": [
   "Show one error message for the group when the group as a whole is invalid.",
   "Lay out inputs that form one value on one row; stack choice controls vertically."
  ],
  "accessibility": [
   "Use a fieldset with a legend, so the group name is announced with each input.",
   "Link group help and error text with aria-describedby on the fieldset or each input."
  ],
  "content": [
   "Write the legend as the question or the value name, such as \"Contact method\".",
   "Keep input labels short; the legend gives context."
  ],
  "map": [
   [
    "Carbon",
    "Form group",
    "Direct"
   ],
   [
    "Atlassian",
    "Fieldset",
    "Direct"
   ],
   [
    "Polaris",
    "Form layout group",
    "Partial"
   ],
   [
    "Fluent 2",
    "Field",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Atlassian and GOV.UK use a fieldset with a legend for grouped inputs; Polaris groups fields visually on one row and leaves semantics to the developer.",
  "sources": [
   "https://carbondesignsystem.com/patterns/forms-pattern/",
   "https://atlassian.design/components/form",
   "https://design-system.service.gov.uk/components/fieldset/",
   "https://polaris-react.shopify.com/components/selection-and-input/form-layout"
  ]
 },
 "forms|Legend": {
  "text": "The caption of a field group: it names the question the grouped inputs answer.",
  "purpose": "Gives a set of inputs one shared, announced label so each input makes sense on its own.",
  "use": [
   "Every fieldset, including radio and checkbox groups.",
   "The page question, when a page asks one grouped question."
  ],
  "avoid": [
   "A single input: use a field label.",
   "Long instructions: move them to help text."
  ],
  "anatomy": [
   "Legend text — the question or group name.",
   "Required or optional marker — follows the same rule as field labels.",
   "Help text — optional, placed directly under the legend."
  ],
  "behavior": [
   "Place the legend above the grouped inputs, aligned with field labels.",
   "Style it like a field label, or like a heading when it is the only question on the page."
  ],
  "accessibility": [
   "Use the native legend element as the first child of the fieldset.",
   "Keep the legend short; screen readers repeat it for each input in the group."
  ],
  "content": [
   "Write it as a short question or noun phrase in sentence case.",
   "End with a question mark only when it is a full question."
  ],
  "map": [
   [
    "Carbon",
    "Form group (legend)",
    "Partial"
   ],
   [
    "Atlassian",
    "Fieldset (legend)",
    "Partial"
   ],
   [
    "Polaris",
    "Choice list (title)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Atlassian and GOV.UK label grouped inputs with a legend inside a fieldset; Polaris exposes the same idea as a title prop on choice lists.",
  "sources": [
   "https://design-system.service.gov.uk/components/fieldset/",
   "https://carbondesignsystem.com/patterns/forms-pattern/",
   "https://atlassian.design/components/form"
  ]
 },
 "forms|Error summary": {
  "text": "A message at the top of a form that lists every error after a failed submit and links to each field.",
  "purpose": "Tells people the form did not submit and how many problems exist, and takes them straight to each one.",
  "use": [
   "A submit fails validation on a form with more than a few fields.",
   "An error may sit outside the visible area of a long form."
  ],
  "avoid": [
   "Live, per-field validation while the person types: not a summary.",
   "System failures unrelated to input: use a banner or notification."
  ],
  "anatomy": [
   "Title — states that the form has problems.",
   "Error list — one link per error, in form order.",
   "Container — an error-styled region at the top of the form or page."
  ],
  "behavior": [
   "Show it only after submit, and move focus to it.",
   "Link each entry to its field; a click moves focus into that field.",
   "Repeat the same message inline next to each field.",
   "Remove it when all errors are fixed and the form is resubmitted."
  ],
  "accessibility": [
   "Move focus to the summary on show and give it role alert or a labeled region.",
   "Do not rely on red alone: include an error icon and clear text."
  ],
  "content": [
   "Write the title as \"There is a problem\" or \"Fix 3 errors to continue\".",
   "Use the exact same wording in the summary entry and the inline message."
  ],
  "map": [
   [
    "Carbon",
    "Form validation (notification)",
    "Partial"
   ],
   [
    "Atlassian",
    "Form (section message)",
    "Partial"
   ],
   [
    "Polaris",
    "Banner (form errors)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Polaris and GOV.UK put an error summary at the top of the form and repeat inline messages at each field; only GOV.UK has a dedicated component, the others build it from a banner or notification.",
  "sources": [
   "https://design-system.service.gov.uk/components/error-summary/",
   "https://carbondesignsystem.com/patterns/forms-pattern/",
   "https://polaris-react.shopify.com/components/feedback-indicators/banner"
  ]
 },
 "forms|Input group": {
  "text": "One input with attached elements, such as a prefix, suffix, icon, or button.",
  "purpose": "Shows units, formats, or a related action at the input, so people do not have to guess.",
  "use": [
   "Units or symbols, such as \"$\", \"%\", or \"kg\".",
   "One directly related action, such as copy or show password."
  ],
  "avoid": [
   "Do not attach more than one button; move extra actions next to the field.",
   "Do not use prefixes for content that belongs in the label."
  ],
  "anatomy": [
   "Input — the editable text area.",
   "Prefix — static text or icon before the value.",
   "Suffix — static text or icon after the value.",
   "Attached button — an optional action joined to one edge."
  ],
  "behavior": [
   "Treat the group as one control with one border and one focus state.",
   "Keep the prefix and suffix read-only; they are not part of the value."
  ],
  "accessibility": [
   "Expose units to screen readers through the label or aria-describedby, not only the visual affix.",
   "Give icon-only attached buttons an accessible name and a 24px minimum target."
  ],
  "content": [
   "Use standard unit abbreviations.",
   "Keep affix text to one or two characters or a short word."
  ],
  "map": [
   [
    "Polaris",
    "Text field (prefix, suffix, connected)",
    "Partial"
   ],
   [
    "Atlassian",
    "Text field (elements before and after)",
    "Partial"
   ],
   [
    "Fluent 2",
    "Input (content before and after)",
    "Partial"
   ],
   [
    "Material 3",
    "Text fields (leading and trailing)",
    "Partial"
   ]
  ],
  "commonGround": "Polaris, Atlassian, Fluent and Material all support content before and after the input inside one field border; none ships it as a separate component.",
  "sources": [
   "https://polaris-react.shopify.com/components/selection-and-input/text-field",
   "https://atlassian.design/components/textfield",
   "https://fluent2.microsoft.design/components/web/react/core/input/usage",
   "https://m3.material.io/components/text-fields/overview"
  ]
 },
 "forms|Form actions": {
  "text": "The row of buttons that submits, saves, or cancels a form.",
  "purpose": "One clear, predictable place in every form to finish or leave the task.",
  "use": [
   "At the end of every form that changes data.",
   "A sticky footer for long forms in panels or full pages."
  ],
  "avoid": [
   "Do not repeat the actions at the top and bottom of short forms.",
   "No reset or clear-all button unless people often need it."
  ],
  "anatomy": [
   "Primary button — the main commit action, such as Save or Create.",
   "Secondary button — Cancel or Back.",
   "Optional tertiary — a less common action, set apart from the pair."
  ],
  "behavior": [
   "Show exactly one primary button.",
   "Keep the primary button enabled and validate on click; never disable it.",
   "Show a busy state on the primary button while the submit runs."
  ],
  "accessibility": [
   "Use real button elements in a logical tab order after the last field.",
   "Let Enter submit single-line forms."
  ],
  "content": [
   "Label the primary button with a specific verb, such as \"Save changes\".",
   "Use \"Cancel\" for leaving without saving."
  ],
  "map": [
   [
    "Carbon",
    "Form (buttons)",
    "Partial"
   ],
   [
    "Atlassian",
    "Form (form footer)",
    "Direct"
   ],
   [
    "Polaris",
    "Page actions",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Atlassian and Polaris end forms with one primary action plus a secondary cancel; they differ on order: Carbon puts the primary on the right, some systems put it first on the left.",
  "sources": [
   "https://atlassian.design/components/form",
   "https://carbondesignsystem.com/patterns/forms-pattern/",
   "https://polaris-react.shopify.com/components/actions/page-actions"
  ]
 },
 "forms|Character counter": {
  "text": "A live count under a text field: characters used or left against a limit.",
  "purpose": "Warns people before they reach a length limit, so they can edit instead of being cut off.",
  "use": [
   "An input with a hard maximum length.",
   "A soft limit that matters, such as a summary shown elsewhere."
  ],
  "avoid": [
   "No limit: no counter.",
   "Do not block typing at the limit silently; let people exceed it and show an error."
  ],
  "anatomy": [
   "Count text — characters used or remaining.",
   "Limit — the maximum, shown as \"40/100\" or \"60 characters left\".",
   "Error state — the field and count when over the limit."
  ],
  "behavior": [
   "Update the count as the person types.",
   "Switch the field and counter to the error style once the limit is passed."
  ],
  "accessibility": [
   "Announce the count politely, only near or past the limit, not on every keystroke.",
   "Link the counter to the input with aria-describedby."
  ],
  "content": [
   "Prefer \"12 characters left\" or \"Too many characters\" over raw numbers alone.",
   "Use \"characters\" consistently, not \"chars\"."
  ],
  "map": [
   [
    "Material 3",
    "Text fields (character counter)",
    "Variant"
   ],
   [
    "Carbon",
    "Text area (character count)",
    "Variant"
   ],
   [
    "Polaris",
    "Text field (character count)",
    "Variant"
   ],
   [
    "Spectrum",
    "Text area (character count)",
    "Variant"
   ]
  ],
  "commonGround": "Material, Carbon, Polaris and Spectrum place the count at the end of the helper line and switch to an error style past the limit; GOV.UK adds that people should be allowed to type past it.",
  "sources": [
   "https://m3.material.io/components/text-fields/overview",
   "https://carbondesignsystem.com/components/text-input/usage/",
   "https://polaris-react.shopify.com/components/selection-and-input/text-field",
   "https://design-system.service.gov.uk/components/character-count/"
  ]
 },
 "forms|Read-only field": {
  "text": "A field whose value people can read, select, and copy but not change.",
  "purpose": "Shows data in form context when the person lacks permission or the system sets the value.",
  "use": [
   "A value is visible to the person but locked for them.",
   "System-generated values, such as an ID, inside an editable form."
  ],
  "avoid": [
   "Values that cannot be acted on at all: use disabled.",
   "Whole read-only pages: show plain text in a description list."
  ],
  "anatomy": [
   "Label — the same label as the editable field.",
   "Value — the current content, at full text contrast.",
   "Container — a quieter border or no border.",
   "Lock hint — optional icon or tooltip explaining why."
  ],
  "behavior": [
   "Keep the field focusable so people can select and copy the value.",
   "Do not show a cursor-edit affordance such as a chevron or caret."
  ],
  "accessibility": [
   "Use the readonly attribute, not disabled, so the value is read and focusable.",
   "Keep value text at full contrast."
  ],
  "content": [
   "Explain the lock when it is not obvious, such as \"Set by your administrator\".",
   "Show an em dash or \"None\" for empty values, not a blank box."
  ],
  "map": [
   [
    "Carbon",
    "Read-only states",
    "Direct"
   ],
   [
    "Spectrum",
    "Text field (read-only)",
    "Variant"
   ],
   [
    "Atlassian",
    "Text field (read-only)",
    "Variant"
   ],
   [
    "Polaris",
    "Text field (read-only)",
    "Variant"
   ]
  ],
  "commonGround": "Carbon and Spectrum both separate read-only from disabled: read-only stays focusable and legible; disabled is dimmed and skipped. Carbon has a full pattern; others expose it as a state.",
  "sources": [
   "https://carbondesignsystem.com/patterns/read-only-states-pattern/",
   "https://spectrum.adobe.com/page/text-field/",
   "https://atlassian.design/components/textfield"
  ]
 },
 "forms|Field style variants": {
  "text": "The approved looks of an input container, such as outlined, filled, or quiet.",
  "purpose": "Lets one field component fit dense tables, plain forms, and toolbars without changing behavior.",
  "use": [
   "Standard forms: the default outlined style.",
   "Tables, toolbars, or inline editing: a quiet or subtle style."
  ],
  "avoid": [
   "Do not mix variants in one form.",
   "Do not use a quiet style where the field must be found quickly."
  ],
  "anatomy": [
   "Outlined — full border on all sides.",
   "Filled — tinted background with a bottom line.",
   "Quiet — no visible container until hover or focus."
  ],
  "behavior": [
   "Keep label, help, error, and focus behavior the same across variants.",
   "Change only the border color on focus and error."
  ],
  "accessibility": [
   "Keep a 3:1 contrast for the field boundary in every variant.",
   "Give quiet fields a visible boundary on hover and focus."
  ],
  "content": [
   "Use the same labels and help text whatever the variant.",
   "Name variants by emphasis, such as \"Quiet\", never by color."
  ],
  "map": [
   [
    "Material 3",
    "Text fields (filled, outlined)",
    "Direct"
   ],
   [
    "Fluent 2",
    "Input (appearance)",
    "Direct"
   ],
   [
    "Spectrum",
    "Text field (quiet)",
    "Variant"
   ],
   [
    "Atlassian",
    "Text field (appearance)",
    "Variant"
   ],
   [
    "Carbon",
    "Text input (fluid)",
    "Variant"
   ]
  ],
  "commonGround": "Material, Fluent, Spectrum and Atlassian offer one standard bordered style plus a lower-emphasis variant; the number and names of variants differ.",
  "sources": [
   "https://m3.material.io/components/text-fields/overview",
   "https://fluent2.microsoft.design/components/web/react/core/input/usage",
   "https://spectrum.adobe.com/page/text-field/",
   "https://atlassian.design/components/textfield"
  ]
 },
 "forms|Autogrowing text area": {
  "text": "A multi-line text input that grows as the person types, up to a set maximum.",
  "purpose": "Shows all of a short or medium entry without inner scrolling, while capping long text.",
  "use": [
   "Comments, descriptions, and notes whose length varies.",
   "Chat or reply boxes."
  ],
  "avoid": [
   "Single-line values: use a text input.",
   "Formatted content: use a rich-text editor."
  ],
  "anatomy": [
   "Label — the field name.",
   "Text area — the multi-line input.",
   "Height limits — a minimum and a maximum row count.",
   "Helper or counter — optional line below."
  ],
  "behavior": [
   "Start at the minimum rows and grow one line at a time.",
   "Switch to inner scrolling once the maximum height is reached.",
   "Do not move the surrounding layout unexpectedly while typing."
  ],
  "accessibility": [
   "Use a native textarea with a visible label.",
   "Enter adds a new line; it submits only in a chat box with a stated shortcut."
  ],
  "content": [
   "Use placeholder text only for an example, never as the label.",
   "State any length limit in help text before people start typing."
  ],
  "map": [
   [
    "Polaris",
    "Text field (multiline)",
    "Variant"
   ],
   [
    "Material 3",
    "Text fields (multi-line)",
    "Variant"
   ],
   [
    "Atlassian",
    "Text area",
    "Partial"
   ],
   [
    "Fluent 2",
    "Textarea",
    "Partial"
   ],
   [
    "Spectrum",
    "Text area",
    "Partial"
   ]
  ],
  "commonGround": "Polaris and Material grow multi-line fields with content; Atlassian and Spectrum offer resizing. All agree on a visible label and a capped height.",
  "sources": [
   "https://polaris-react.shopify.com/components/selection-and-input/text-field",
   "https://m3.material.io/components/text-fields/overview",
   "https://atlassian.design/components/textarea",
   "https://spectrum.adobe.com/page/text-area/"
  ]
 },
 "forms|Rich-text editor": {
  "text": "A multi-line input with a toolbar for formatting, such as bold, lists, and links.",
  "purpose": "Lets people write structured, formatted content without knowing markup.",
  "use": [
   "Long-form content displayed with formatting, such as descriptions or articles.",
   "Links, lists, or headings are needed."
  ],
  "avoid": [
   "Plain notes: use a text area.",
   "Code: use a code editor."
  ],
  "anatomy": [
   "Toolbar — formatting actions grouped by type.",
   "Editing area — the content surface.",
   "Status line — optional word count or save state."
  ],
  "behavior": [
   "Support standard shortcuts such as Ctrl+B and Ctrl+K.",
   "Paste as clean text by default; keep only allowed formatting.",
   "Keep the toolbar visible or sticky while editing long content."
  ],
  "accessibility": [
   "Give the toolbar role toolbar, with arrow-key navigation.",
   "Label the editing area and announce format changes."
  ],
  "content": [
   "Use tooltips that name the action and its shortcut, such as \"Bold (Ctrl+B)\".",
   "Use a placeholder that says what to write, such as \"Describe the change\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/",
   "https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/"
  ],
  "map": []
 },
 "forms|Code editor": {
  "text": "A multi-line input for code with monospace text, line numbers, and syntax highlighting.",
  "purpose": "Lets people write and correct code or configuration with fewer mistakes.",
  "use": [
   "Scripts, queries, JSON, or configuration that people edit.",
   "Syntax errors should show while typing."
  ],
  "avoid": [
   "Code people only read: use a code snippet.",
   "Plain text: not a code editor."
  ],
  "anatomy": [
   "Gutter — line numbers and error markers.",
   "Editing area — monospace text with highlighting.",
   "Status bar — optional language, cursor position, and errors."
  ],
  "behavior": [
   "Tab indents inside the editor; offer a stated way out, such as Esc then Tab.",
   "Show syntax errors inline with a marker and a message."
  ],
  "accessibility": [
   "State the key to move focus out of the editor.",
   "Keep highlight colors at 4.5:1 contrast against the background."
  ],
  "content": [
   "Label the editor with the language or purpose, such as \"Query (SQL)\".",
   "Write error messages that name the line and the problem, such as \"Line 4: missing comma\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html",
   "https://carbondesignsystem.com/components/code-snippet/usage/"
  ],
  "map": []
 },
 "forms|Inline editable text": {
  "text": "Text that turns into an input when clicked, for editing in place.",
  "purpose": "Lets people fix one value without opening a form or leaving their context.",
  "use": [
   "Single values in a view, such as a title or a table cell.",
   "Edits are quick and frequent."
  ],
  "avoid": [
   "Several related fields: use a form.",
   "The value needs validation that blocks other work."
  ],
  "anatomy": [
   "Read view — the value with a hover hint that it is editable.",
   "Edit view — the input with the current value.",
   "Confirm and cancel — optional buttons next to the input."
  ],
  "behavior": [
   "Enter saves and Esc cancels.",
   "Show errors inline without losing the typed value.",
   "Return focus to the read view after saving."
  ],
  "accessibility": [
   "Make the read view a focusable button with a label such as \"Edit title\".",
   "Announce save results through a live region."
  ],
  "content": [
   "Show an empty-state prompt, such as \"Add a description\", when there is no value.",
   "Name the confirm and cancel buttons for screen readers, such as \"Save title\"."
  ],
  "map": [
   [
    "Atlassian",
    "Inline edit",
    "Direct"
   ],
   [
    "Carbon",
    "Edit in place (IBM Products)",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and the Carbon for IBM Products library both switch the value into an input with confirm and cancel; Salesforce Lightning does the same in table cells.",
  "sources": [
   "https://atlassian.design/components/inline-edit",
   "https://www.lightningdesignsystem.com/components/data-grids/"
  ]
 },
 "forms|PIN / OTP input": {
  "text": "A set of short boxes for a fixed-length numeric code, such as a one-time passcode.",
  "purpose": "Makes entering a short code fast and shows how many digits are expected.",
  "use": [
   "One-time passcodes and short PINs of a known length.",
   "Sign-in and verification flows."
  ],
  "avoid": [
   "Passwords or codes of variable length: use a single text input.",
   "Long codes, such as license keys."
  ],
  "anatomy": [
   "Label — what the code is and where it was sent.",
   "Digit boxes — one per character.",
   "Resend link — offered after a delay.",
   "Error message — below the boxes."
  ],
  "behavior": [
   "Move focus to the next box after each digit; move back on Backspace.",
   "Accept a full pasted code into all boxes.",
   "Allow autofill of the code from the device."
  ],
  "accessibility": [
   "Use inputmode numeric and autocomplete one-time-code.",
   "Label the group and each box, such as \"Digit 2 of 6\"."
  ],
  "content": [
   "Tell people where the code was sent and how long it lasts.",
   "Write errors that say what to do next, such as \"That code has expired. Request a new code\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-autocomplete-one-time-code",
   "https://design-system.service.gov.uk/components/text-input/"
  ],
  "map": []
 },
 "forms|Toggle button": {
  "text": "A button that stays pressed or unpressed to turn an option on or off.",
  "purpose": "Shows the on or off state of a view or formatting option on the control itself.",
  "use": [
   "Toolbar states, such as bold or show grid.",
   "A group where one or more options can be pressed."
  ],
  "avoid": [
   "Settings that apply right away in a form: use a switch.",
   "Switching between views of the same content: use a segmented control."
  ],
  "anatomy": [
   "Button — the pressable surface.",
   "Icon or label — what the toggle controls.",
   "Selected state — filled or tinted when pressed."
  ],
  "behavior": [
   "Toggle the state on each click; keep the label the same.",
   "Show the pressed state with more than color, such as a fill and an icon change."
  ],
  "accessibility": [
   "Use aria-pressed on the button.",
   "Keep a 24px minimum target and a visible focus indicator."
  ],
  "content": [
   "Use a label that names the option, not the action, such as \"Bold\".",
   "Use a tooltip on icon-only toggles that names the option."
  ],
  "map": [
   [
    "Fluent 2",
    "Toggle button",
    "Direct"
   ],
   [
    "Material 3",
    "Icon buttons (toggle)",
    "Variant"
   ],
   [
    "Spectrum",
    "Action button (selected)",
    "Variant"
   ],
   [
    "Polaris",
    "Button (pressed)",
    "Variant"
   ]
  ],
  "commonGround": "Fluent, Material, Spectrum and Polaris all model the toggle as a button with a pressed state, not a separate control; only Fluent has a dedicated component.",
  "sources": [
   "https://fluent2.microsoft.design/components/web/react/core/togglebutton/usage",
   "https://m3.material.io/components/icon-buttons/overview",
   "https://spectrum.adobe.com/page/action-button/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/button/"
  ]
 },
 "forms|Async select": {
  "text": "A select that loads its options from the server as the person types or opens it.",
  "purpose": "Keeps large or changing option lists fast without loading every option up front.",
  "use": [
   "Lists too large to load at once, such as users or projects.",
   "Options that depend on live data."
  ],
  "avoid": [
   "Short, fixed lists: use a select.",
   "The person must browse all options: use a list with search."
  ],
  "anatomy": [
   "Input — where the person types a query.",
   "Loading indicator — shown while results load.",
   "Option list — results for the query.",
   "Empty and error states — when nothing matches or the load fails."
  ],
  "behavior": [
   "Wait for a short pause or a minimum number of characters before requesting.",
   "Keep the typed text while results load.",
   "Show a clear message when there are no matches."
  ],
  "accessibility": [
   "Follow the combobox pattern with aria-expanded and aria-activedescendant.",
   "Announce loading and result counts through a live region."
  ],
  "content": [
   "Write the empty state as \"No matches for …\".",
   "Use placeholder text that says what can be searched, such as \"Search users\"."
  ],
  "map": [
   [
    "Atlassian",
    "Select (async)",
    "Variant"
   ],
   [
    "Spectrum",
    "Combo box (async loading)",
    "Variant"
   ],
   [
    "Polaris",
    "Autocomplete (loading)",
    "Partial"
   ],
   [
    "Carbon",
    "Combo box",
    "Partial"
   ],
   [
    "Fluent 2",
    "Combobox",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Spectrum and Polaris load combobox options on demand with a loading state and an empty state, all on the WAI-ARIA combobox pattern.",
  "sources": [
   "https://atlassian.design/components/select",
   "https://spectrum.adobe.com/page/combo-box/",
   "https://polaris-react.shopify.com/components/selection-and-input/autocomplete",
   "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
  ]
 },
 "forms|Checkbox select": {
  "text": "A dropdown whose options have checkboxes so several values can be chosen.",
  "purpose": "Lets people pick several items from a list without the space of a checkbox group.",
  "use": [
   "Multiple choice from about 6 to 50 options.",
   "Filters where several values combine."
  ],
  "avoid": [
   "Fewer than six options: use a checkbox group.",
   "Very large lists: use a searchable multi-select."
  ],
  "anatomy": [
   "Trigger — shows the count or names of chosen items.",
   "Option list — each row with a checkbox.",
   "Clear action — removes all selections."
  ],
  "behavior": [
   "Keep the menu open while checking items.",
   "Show the number chosen in the trigger, such as \"3 selected\".",
   "Apply changes right away or with an Apply button, not both."
  ],
  "accessibility": [
   "Use a listbox with aria-multiselectable and aria-selected on options.",
   "Support Space to toggle and Esc to close."
  ],
  "content": [
   "Keep option labels short and parallel.",
   "Use \"Select all\" only when lists are long and the action is common."
  ],
  "map": [
   [
    "Carbon",
    "Multiselect",
    "Direct"
   ],
   [
    "Atlassian",
    "Select (checkbox select)",
    "Variant"
   ],
   [
    "Fluent 2",
    "Dropdown (multiselect)",
    "Variant"
   ],
   [
    "Polaris",
    "Autocomplete (multiple)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Atlassian and Fluent show checkboxes in a dropdown and summarize the selection in the trigger; Carbon and Atlassian add a clear-all action.",
  "sources": [
   "https://carbondesignsystem.com/components/dropdown/usage/",
   "https://atlassian.design/components/select",
   "https://fluent2.microsoft.design/components/web/react/core/dropdown/usage",
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
  ]
 },
 "forms|Radio select": {
  "text": "A dropdown whose options show radio markers, so exactly one value is chosen.",
  "purpose": "Makes single-choice dropdowns explicit when the chosen item must stay visible in the list.",
  "use": [
   "A single choice from about 6 to 15 options.",
   "The current choice must stay clearly marked while browsing."
  ],
  "avoid": [
   "Five or fewer options: use a radio group.",
   "Long lists: use a searchable select."
  ],
  "anatomy": [
   "Trigger — shows the chosen value.",
   "Option list — each row with a radio marker.",
   "Selected marker — filled radio on the current option."
  ],
  "behavior": [
   "Close the menu once a value is chosen.",
   "Show the chosen value in the trigger."
  ],
  "accessibility": [
   "Use a listbox with aria-selected on the chosen option.",
   "Support arrow keys, Enter, Esc, and type-ahead."
  ],
  "content": [
   "Write options as short, parallel phrases.",
   "Use a placeholder such as \"Select an option\" only when no default is set."
  ],
  "map": [
   [
    "Atlassian",
    "Select (radio select)",
    "Variant"
   ],
   [
    "Carbon",
    "Dropdown",
    "Partial"
   ],
   [
    "Fluent 2",
    "Dropdown",
    "Partial"
   ],
   [
    "Spectrum",
    "Picker",
    "Partial"
   ]
  ],
  "commonGround": "Only Atlassian shows radio markers in a select; Carbon, Fluent and Spectrum check the chosen option. All agree the menu closes on choice and the trigger shows the value.",
  "sources": [
   "https://atlassian.design/components/select",
   "https://carbondesignsystem.com/components/dropdown/usage/",
   "https://spectrum.adobe.com/page/picker/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
  ]
 },
 "forms|Cascader": {
  "text": "A select that reveals nested option lists level by level, to pick a value from a hierarchy.",
  "purpose": "Lets people choose from a deep, structured list, such as region, then country, then city.",
  "use": [
   "Hierarchies of two to four levels where only leaf values are valid.",
   "Each level has a manageable number of options."
  ],
  "avoid": [
   "Flat lists: use a select.",
   "People need to see the whole tree: use a tree select."
  ],
  "anatomy": [
   "Trigger — shows the full path of the chosen value.",
   "Column lists — one per level, opened to the right.",
   "Search — optional, matches across all levels."
  ],
  "behavior": [
   "Open the next level when a parent is chosen.",
   "Show the full path in the trigger, such as \"Europe / France / Paris\"."
  ],
  "accessibility": [
   "Expose each level as a labeled listbox and move between levels with arrow keys.",
   "Announce the current level and path."
  ],
  "content": [
   "Use short names at each level; the path gives context.",
   "Use \" / \" as the path separator in the trigger."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/"
  ],
  "map": []
 },
 "forms|Tree select": {
  "text": "A select whose menu is a tree, for choosing one or more nodes from a hierarchy.",
  "purpose": "Lets people pick from a hierarchy while seeing parents and siblings.",
  "use": [
   "Folders, categories, or org units where parent nodes can be chosen.",
   "People need to expand and compare branches."
  ],
  "avoid": [
   "Flat lists: use a select.",
   "Only leaf values are valid and levels are few: use a cascader."
  ],
  "anatomy": [
   "Trigger — shows chosen nodes.",
   "Tree — expandable nodes with indent.",
   "Search — optional filter that keeps matching paths."
  ],
  "behavior": [
   "Expand and collapse with a chevron, separately from selecting the node.",
   "In multi-select, define whether choosing a parent also chooses its children."
  ],
  "accessibility": [
   "Use the tree view pattern with aria-expanded and aria-selected.",
   "Support arrow keys to move, expand, and collapse."
  ],
  "content": [
   "Use the node name only; do not repeat parent names.",
   "With several nodes chosen, show the count in the trigger, such as \"4 folders\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/",
   "https://carbondesignsystem.com/components/tree-view/usage/"
  ],
  "map": []
 },
 "forms|People picker": {
  "text": "A search field that finds and selects people, showing each as a token with an avatar and name.",
  "purpose": "Makes choosing the right person reliable when names are common or lists are large.",
  "use": [
   "Assigning, mentioning, sharing with, or inviting users.",
   "The directory is too large to list."
  ],
  "avoid": [
   "Non-person entities: use an entity picker.",
   "A few known people: use a select."
  ],
  "anatomy": [
   "Input — where the person types a name or email.",
   "Suggestions — people with avatar, name, and a second line such as email.",
   "Tokens — chosen people, each removable."
  ],
  "behavior": [
   "Search by name and email as the person types.",
   "Show a second identifier to tell apart people with the same name.",
   "Remove a token with its close button or Backspace."
  ],
  "accessibility": [
   "Follow the combobox pattern; give tokens accessible remove buttons.",
   "Announce how many suggestions are shown."
  ],
  "content": [
   "Use placeholder text such as \"Search by name or email\".",
   "Write the empty state as \"No people found\"."
  ],
  "map": [
   [
    "Fluent 2",
    "People picker",
    "Direct"
   ],
   [
    "Atlassian",
    "User picker",
    "Direct"
   ]
  ],
  "commonGround": "Fluent and Atlassian both show suggestions with avatar, name and a second identifier, and render choices as removable tokens.",
  "sources": [
   "https://atlassian.design/components/user-picker",
   "https://fluent2.microsoft.design/components/web/react/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
  ]
 },
 "forms|Entity picker": {
  "text": "A search-and-select field for records of a given type, such as projects, assets, or accounts.",
  "purpose": "One consistent way to link to other records without knowing their IDs.",
  "use": [
   "Linking a record to another record.",
   "Too many records to list."
  ],
  "avoid": [
   "People: use a people picker.",
   "Short fixed lists: use a select."
  ],
  "anatomy": [
   "Input — search by name or ID.",
   "Suggestions — each with an icon, name, and key detail.",
   "Chosen items — tokens or a single value.",
   "Browse action — optional, opens a full dialog."
  ],
  "behavior": [
   "Show enough detail per result to tell similar records apart.",
   "Offer a browse dialog when search alone is not enough."
  ],
  "accessibility": [
   "Follow the combobox pattern and announce result counts.",
   "Give tokens accessible remove buttons."
  ],
  "content": [
   "Name the entity type in the label and placeholder, such as \"Search projects\".",
   "Write the empty state as \"No projects found\", naming the entity type."
  ],
  "map": [
   [
    "Fluent 2",
    "Tag picker",
    "Partial"
   ],
   [
    "Atlassian",
    "Select",
    "Partial"
   ],
   [
    "Carbon",
    "Combo box",
    "Partial"
   ]
  ],
  "commonGround": "Fluent, Atlassian and Carbon build record pickers from a searchable combobox; none names it as a separate component.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/",
   "https://atlassian.design/components/select",
   "https://carbondesignsystem.com/components/dropdown/usage/"
  ]
 },
 "forms|Country / locale select": {
  "text": "A searchable select of countries, regions, or languages, often with a flag or code.",
  "purpose": "Lets people find their country or language quickly in a long list.",
  "use": [
   "Address, phone, tax, or language settings.",
   "With type-ahead search, since lists are long."
  ],
  "avoid": [
   "Do not use flags alone to stand for languages.",
   "A free-text field is acceptable and lists cannot be maintained: use free text."
  ],
  "anatomy": [
   "Trigger — shows the chosen country or language.",
   "Search — filters the list as the person types.",
   "Options — name, with optional flag or code."
  ],
  "behavior": [
   "Match on local and English names and on codes.",
   "Pre-select a likely default that people can change.",
   "Show languages in their own name, such as \"Deutsch\"."
  ],
  "accessibility": [
   "Follow the combobox or listbox pattern.",
   "Mark language names with the lang attribute."
  ],
  "content": [
   "Sort alphabetically by display name.",
   "Use the official short country name people recognize."
  ],
  "map": [
   [
    "Atlassian",
    "Select (country example)",
    "Partial"
   ]
  ],
  "commonGround": "No system has a dedicated component: Atlassian shows a country example built on its select, and GOV.UK recommends a searchable autocomplete for long country lists.",
  "sources": [
   "https://atlassian.design/components/select",
   "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
  ]
 },
 "forms|Calendar": {
  "text": "A month grid that shows dates and lets people pick one date or a range.",
  "purpose": "Shows dates in weekly context, so people can choose by weekday or relative position.",
  "use": [
   "Use inside date pickers.",
   "On its own, when a date must be chosen while seeing nearby dates."
  ],
  "avoid": [
   "Dates far from today, such as birth dates: use a typed date input.",
   "Showing events: use a schedule view."
  ],
  "anatomy": [
   "Header — month and year with previous and next controls.",
   "Weekday row — short day names.",
   "Day grid — selectable dates, with today marked.",
   "Unavailable dates — dimmed and not selectable."
  ],
  "behavior": [
   "Mark today and the chosen date differently.",
   "Let people change month and year quickly.",
   "Start weeks on the locale's first day."
  ],
  "accessibility": [
   "A grid: arrow keys move between days, Page Up and Page Down between months.",
   "Give each day a full accessible name, such as \"Monday, March 3, 2026\"."
  ],
  "content": [
   "Use locale-formatted month and day names.",
   "Explain why a date is unavailable in a tooltip or help text."
  ],
  "map": [
   [
    "Atlassian",
    "Calendar",
    "Direct"
   ],
   [
    "Spectrum",
    "Calendar",
    "Direct"
   ],
   [
    "Fluent 2",
    "Calendar",
    "Direct"
   ],
   [
    "Material 3",
    "Date pickers",
    "Partial"
   ],
   [
    "Carbon",
    "Date picker",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Spectrum and Fluent offer a standalone calendar grid with month navigation and keyboard support; Material and Carbon include it only inside the date picker.",
  "sources": [
   "https://atlassian.design/components/calendar",
   "https://spectrum.adobe.com/page/calendar/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/"
  ]
 },
 "forms|Date picker": {
  "text": "A field for one date, typed or chosen from a calendar.",
  "purpose": "Prevents format mistakes while letting fast typists enter dates directly.",
  "use": [
   "Dates near today, such as due dates.",
   "The weekday matters."
  ],
  "avoid": [
   "Known dates such as birth dates: use a typed date input.",
   "Ranges: use a date range picker."
  ],
  "anatomy": [
   "Label — the date name.",
   "Input — typed date with the format shown.",
   "Calendar button — opens the calendar.",
   "Calendar — the month grid popover."
  ],
  "behavior": [
   "Accept typed dates and parse common formats.",
   "Show the expected format, such as MM/DD/YYYY, as help text.",
   "Close the calendar on choice and return focus to the input."
  ],
  "accessibility": [
   "Keep the input typeable, so the calendar is never required.",
   "Give the calendar button a label such as \"Choose date\"."
  ],
  "content": [
   "Show the format in help text, not only as a placeholder.",
   "Write errors that state the valid range, such as \"Enter a date after June 1, 2026\"."
  ],
  "map": [
   [
    "Carbon",
    "Date picker",
    "Direct"
   ],
   [
    "Atlassian",
    "Date time picker (date)",
    "Direct"
   ],
   [
    "Material 3",
    "Date pickers",
    "Direct"
   ],
   [
    "Fluent 2",
    "Date picker",
    "Direct"
   ],
   [
    "Polaris",
    "Date picker",
    "Direct"
   ],
   [
    "Spectrum",
    "Date picker",
    "Direct"
   ]
  ],
  "commonGround": "All six systems pair a typed input with a calendar popover; Material and GOV.UK warn against calendars for distant dates.",
  "sources": [
   "https://carbondesignsystem.com/components/date-picker/usage/",
   "https://m3.material.io/components/date-pickers/overview",
   "https://spectrum.adobe.com/page/date-picker/",
   "https://polaris-react.shopify.com/components/selection-and-input/date-picker"
  ]
 },
 "forms|Date range picker": {
  "text": "A field for a start and an end date, with a calendar that shows the range.",
  "purpose": "Lets people set a period in one control and see its length.",
  "use": [
   "Reporting periods, filters, and bookings.",
   "With preset ranges such as \"Last 7 days\" in analytics."
  ],
  "avoid": [
   "A single date: use a date picker.",
   "Unrelated start and end: use two date pickers."
  ],
  "anatomy": [
   "Start and end inputs — typed dates.",
   "Calendar — one or two months with the range shaded.",
   "Presets — optional list of common ranges."
  ],
  "behavior": [
   "Pick the start, then the end; hover previews the range.",
   "Swap or reject an end date earlier than the start.",
   "Show two months side by side on wide screens."
  ],
  "accessibility": [
   "Label each input, such as \"Start date\" and \"End date\".",
   "Announce the range state of each day."
  ],
  "content": [
   "Name presets plainly, such as \"Last 30 days\".",
   "Show the chosen range in full in the trigger, such as \"Mar 1 – Mar 31, 2026\"."
  ],
  "map": [
   [
    "Spectrum",
    "Date range picker",
    "Direct"
   ],
   [
    "Carbon",
    "Date picker (range)",
    "Variant"
   ],
   [
    "Material 3",
    "Date pickers (range)",
    "Variant"
   ],
   [
    "Polaris",
    "Date picker (range)",
    "Variant"
   ]
  ],
  "commonGround": "Spectrum, Carbon, Material and Polaris use two typed inputs plus a calendar that shades the range; Polaris also shows presets in analytics.",
  "sources": [
   "https://spectrum.adobe.com/page/date-range-picker/",
   "https://carbondesignsystem.com/components/date-picker/usage/",
   "https://m3.material.io/components/date-pickers/overview"
  ]
 },
 "forms|Time picker": {
  "text": "A field for entering a time of day by typing or choosing from a list.",
  "purpose": "Prevents invalid times and makes the format and clock style clear.",
  "use": [
   "Meeting times, schedules, and deadlines.",
   "With a date picker, when both are needed."
  ],
  "avoid": [
   "Durations: use a number input with units.",
   "Do not use dropdowns of every minute."
  ],
  "anatomy": [
   "Label — the time name.",
   "Input — hours and minutes.",
   "AM/PM control — for 12-hour locales.",
   "Time zone — optional, shown when it matters."
  ],
  "behavior": [
   "Accept typed times and normalize them.",
   "Follow the locale's 12- or 24-hour clock.",
   "Offer increments such as 15 minutes when a list is used."
  ],
  "accessibility": [
   "Keep the input typeable; if it is segmented, label each segment.",
   "Do not depend on a clock dial alone."
  ],
  "content": [
   "Show the time zone when people in several zones use the data.",
   "Use the locale's time format in values and errors."
  ],
  "map": [
   [
    "Carbon",
    "Time picker",
    "Direct"
   ],
   [
    "Atlassian",
    "Date time picker (time)",
    "Direct"
   ],
   [
    "Material 3",
    "Time pickers",
    "Direct"
   ],
   [
    "Fluent 2",
    "Time picker",
    "Direct"
   ],
   [
    "Spectrum",
    "Time field",
    "Direct"
   ]
  ],
  "commonGround": "Carbon, Atlassian, Material, Fluent and Spectrum all offer typed time entry that follows the locale's clock. Material adds a dial for touch; Atlassian and Fluent add a list of increments.",
  "sources": [
   "https://carbondesignsystem.com/components/time-picker/usage/",
   "https://m3.material.io/components/time-pickers/overview",
   "https://spectrum.adobe.com/page/time-field/",
   "https://atlassian.design/components/datetime-picker"
  ]
 },
 "forms|Date-time picker": {
  "text": "Combines a date picker and a time picker to set one moment.",
  "purpose": "Lets people set an exact moment in one place, with the time zone clear.",
  "use": [
   "Scheduling and timestamps.",
   "Date and time that always go together."
  ],
  "avoid": [
   "Only the date matters: use a date picker.",
   "Ranges: use two date-time fields or a range picker."
  ],
  "anatomy": [
   "Date input — with calendar.",
   "Time input — with list or segments.",
   "Time zone — shown or selectable."
  ],
  "behavior": [
   "Validate date and time together, such as not in the past.",
   "Default the time to a sensible value when only the date is chosen."
  ],
  "accessibility": [
   "Label each part and keep both typeable.",
   "Tab order: date, time, then zone."
  ],
  "content": [
   "Show the time zone abbreviation next to the time.",
   "Write one error for the combined value, such as \"Choose a time in the future\"."
  ],
  "map": [
   [
    "Atlassian",
    "Date time picker",
    "Direct"
   ],
   [
    "Spectrum",
    "Date picker (with time)",
    "Variant"
   ],
   [
    "Carbon",
    "Date picker and time picker",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Spectrum combine date and time in one field; Carbon places a date picker and a time picker side by side.",
  "sources": [
   "https://atlassian.design/components/datetime-picker",
   "https://spectrum.adobe.com/page/date-picker/",
   "https://carbondesignsystem.com/components/time-picker/usage/"
  ]
 },
 "forms|Relative date input": {
  "text": "An input for dates relative to now, such as \"last 7 days\" or \"in 2 weeks\".",
  "purpose": "Keeps filters and rules correct over time without fixed dates.",
  "use": [
   "Filters, saved searches, and automation rules.",
   "People mean a rolling window."
  ],
  "avoid": [
   "A fixed date is needed, such as a contract date.",
   "Do not accept free text that cannot be shown back clearly."
  ],
  "anatomy": [
   "Direction — past or future.",
   "Amount — a number.",
   "Unit — days, weeks, months.",
   "Preview — the resolved absolute dates."
  ],
  "behavior": [
   "Offer common presets plus a custom amount and unit.",
   "Show the resolved dates so people can check them."
  ],
  "accessibility": [
   "Label each part and announce the resolved preview.",
   "Keep presets reachable by keyboard."
  ],
  "content": [
   "Write values in plain words, such as \"Last 30 days\".",
   "Show resolved dates in a short line, such as \"Mar 1 – Mar 7, 2026\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/"
  ],
  "map": []
 },
 "forms|Time-zone selector": {
  "text": "A searchable select for choosing a time zone.",
  "purpose": "Keeps times correct for people and teams in different places.",
  "use": [
   "Profile settings, scheduling, and event creation.",
   "Shown times must match a place other than the browser's."
  ],
  "avoid": [
   "Raw UTC offsets alone: they change with daylight saving.",
   "Do not make people choose when the browser zone is a safe default."
  ],
  "anatomy": [
   "Trigger — shows the chosen zone and current offset.",
   "Search — matches city, region, and abbreviation.",
   "Options — zone name with offset."
  ],
  "behavior": [
   "Default to the browser's zone.",
   "Store IANA zone IDs and show friendly names.",
   "Show the current offset, which may change with daylight saving."
  ],
  "accessibility": [
   "Follow the combobox pattern with type-ahead.",
   "Announce the current offset with the zone name, not only the abbreviation."
  ],
  "content": [
   "Show names such as \"(UTC−05:00) Eastern Time — New York\".",
   "Prefer city names to abbreviations such as EST, which can be ambiguous."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/",
   "https://www.iana.org/time-zones"
  ],
  "map": []
 },
 "forms|Swatch picker": {
  "text": "A set of color swatches for choosing one color.",
  "purpose": "Lets people choose from approved colors quickly, without a full color picker.",
  "use": [
   "Labels, tags, and themes whose colors come from a fixed set.",
   "Color must stay within a brand or accessible palette."
  ],
  "avoid": [
   "Any color is allowed: use a color picker.",
   "Do not use color as the only way to tell items apart later."
  ],
  "anatomy": [
   "Swatches — color samples in a row or grid.",
   "Selected marker — a ring or check on the chosen swatch.",
   "Label — optional color names."
  ],
  "behavior": [
   "Mark the chosen swatch with a shape, not only a border color.",
   "Keep swatch order stable."
  ],
  "accessibility": [
   "Give each swatch an accessible name, such as \"Blue\".",
   "Use a radio group pattern with arrow keys."
  ],
  "content": [
   "Use plain color names people know.",
   "Do not use color names alone to carry meaning in later views."
  ],
  "map": [
   [
    "Fluent 2",
    "Swatch picker",
    "Direct"
   ],
   [
    "Spectrum",
    "Swatch group",
    "Direct"
   ],
   [
    "Polaris",
    "Color picker",
    "Partial"
   ]
  ],
  "commonGround": "Fluent and Spectrum both offer a swatch set with a clear selected marker and named swatches; Polaris offers a full color picker instead.",
  "sources": [
   "https://fluent2.microsoft.design/components/web/react/",
   "https://spectrum.adobe.com/page/swatch-group/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/radio/"
  ]
 },
 "forms|Number input": {
  "text": "A field for entering a number, with optional increase and decrease buttons.",
  "purpose": "Accepts only valid numbers and applies limits and steps.",
  "use": [
   "Counts, sizes, and measures.",
   "With min, max, and step, when limits exist."
  ],
  "avoid": [
   "Numbers that are really codes, such as ZIP or card numbers: use a text input.",
   "Wide ranges where precision does not matter: use a slider."
  ],
  "anatomy": [
   "Label — with unit if needed.",
   "Input — the value.",
   "Step buttons — optional increase and decrease.",
   "Help and error text — limits and problems."
  ],
  "behavior": [
   "Allow typing; validate on blur, not on every key.",
   "Clamp or flag values outside min and max.",
   "Format with the locale's separators."
  ],
  "accessibility": [
   "Use the spinbutton pattern with arrow keys to step.",
   "Give step buttons labels such as \"Increase\"."
  ],
  "content": [
   "Put the unit in the label or as a suffix.",
   "State limits in help text, such as \"1 to 100\"."
  ],
  "map": [
   [
    "Carbon",
    "Number input",
    "Direct"
   ],
   [
    "Spectrum",
    "Number field",
    "Direct"
   ],
   [
    "Fluent 2",
    "Spin button",
    "Direct"
   ],
   [
    "Polaris",
    "Text field (number)",
    "Variant"
   ],
   [
    "Atlassian",
    "Text field (number)",
    "Variant"
   ]
  ],
  "commonGround": "Carbon, Spectrum and Fluent provide a numeric field with step buttons, min and max; Polaris and Atlassian use a text field set to number.",
  "sources": [
   "https://carbondesignsystem.com/components/number-input/usage/",
   "https://spectrum.adobe.com/page/number-field/",
   "https://fluent2.microsoft.design/components/web/react/core/spinbutton/usage",
   "https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/"
  ]
 },
 "forms|Stepper": {
  "text": "A compact control with minus and plus buttons around a value that change it by fixed steps.",
  "purpose": "Makes small, frequent changes easy, especially on touch.",
  "use": [
   "Small whole numbers, such as guests or copies.",
   "Most changes are one or two steps."
  ],
  "avoid": [
   "Large ranges: use a number input or slider.",
   "The value is usually typed."
  ],
  "anatomy": [
   "Decrease button — minus.",
   "Value — the current number, ideally editable.",
   "Increase button — plus."
  ],
  "behavior": [
   "Disable the decrease button at the minimum and the increase button at the maximum.",
   "Let people type a value directly when possible."
  ],
  "accessibility": [
   "Use the spinbutton pattern with aria-valuenow, min, and max.",
   "Keep step buttons at least 24px."
  ],
  "content": [
   "Label the control with what it counts.",
   "Show the unit next to the value when it is not obvious."
  ],
  "map": [
   [
    "Carbon",
    "Number input",
    "Partial"
   ],
   [
    "Fluent 2",
    "Spin button",
    "Partial"
   ],
   [
    "Spectrum",
    "Number field",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Fluent and Spectrum build step buttons into their number fields, not as a separate control.",
  "sources": [
   "https://carbondesignsystem.com/components/number-input/usage/",
   "https://fluent2.microsoft.design/components/web/react/core/spinbutton/usage",
   "https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/"
  ]
 },
 "forms|Currency input": {
  "text": "A number input that shows a currency symbol or code and formats money amounts.",
  "purpose": "Makes it clear which currency is meant and keeps amounts in a valid format.",
  "use": [
   "Prices, budgets, and payments.",
   "With the currency code when several currencies appear."
  ],
  "avoid": [
   "Whole-number counts: not a currency input.",
   "Do not use a currency symbol alone when currencies could be confused."
  ],
  "anatomy": [
   "Label — the amount name.",
   "Currency prefix or suffix — symbol or code.",
   "Input — the amount with decimals.",
   "Currency select — optional, for multi-currency."
  ],
  "behavior": [
   "Format separators and decimals by locale after blur.",
   "Keep the decimal precision of the currency."
  ],
  "accessibility": [
   "Announce the currency through the label, not only the symbol.",
   "Use inputmode decimal."
  ],
  "content": [
   "Use ISO codes such as USD when symbols are ambiguous.",
   "State the limit with the currency in errors, such as \"Enter up to $5,000\"."
  ],
  "map": [
   [
    "Polaris",
    "Text field (prefix)",
    "Variant"
   ],
   [
    "Spectrum",
    "Number field (currency)",
    "Variant"
   ],
   [
    "Carbon",
    "Number input",
    "Partial"
   ]
  ],
  "commonGround": "Polaris and Spectrum show currency as a prefix or formatted value on a number field; none has a separate component.",
  "sources": [
   "https://polaris-react.shopify.com/components/selection-and-input/text-field",
   "https://spectrum.adobe.com/page/number-field/"
  ]
 },
 "forms|Percentage input": {
  "text": "A number input with a percent sign that accepts values on a percent scale.",
  "purpose": "Removes doubt about whether \"5\" means 5% or 0.05.",
  "use": [
   "Rates, discounts, and shares.",
   "With min 0 and max 100, unless more is valid."
  ],
  "avoid": [
   "Ratios shown as decimals.",
   "A slider gives enough precision."
  ],
  "anatomy": [
   "Label — the rate name.",
   "Input — the number.",
   "Suffix — the percent sign."
  ],
  "behavior": [
   "Store and show the same scale people type.",
   "Validate the range and allowed decimals."
  ],
  "accessibility": [
   "Include \"percent\" in the accessible name.",
   "Use inputmode decimal."
  ],
  "content": [
   "State the range in help text when it is not 0 to 100.",
   "Do not repeat \"percent\" in the label when the suffix shows it, except for screen readers."
  ],
  "map": [
   [
    "Spectrum",
    "Number field (percent)",
    "Variant"
   ],
   [
    "Polaris",
    "Text field (suffix)",
    "Variant"
   ]
  ],
  "commonGround": "Spectrum formats number fields as percent and Polaris adds a percent suffix to a text field; neither has a separate component.",
  "sources": [
   "https://spectrum.adobe.com/page/number-field/",
   "https://polaris-react.shopify.com/components/selection-and-input/text-field"
  ]
 },
 "forms|Quantity selector": {
  "text": "A stepper sized for choosing how many of an item, often in carts or line items.",
  "purpose": "Lets people change counts quickly with limits such as stock.",
  "use": [
   "Carts, order lines, and resource allocations.",
   "The quantity is small and changes often."
  ],
  "avoid": [
   "Large or precise numbers: use a number input.",
   "Only one item is allowed."
  ],
  "anatomy": [
   "Decrease button — minus.",
   "Value — the editable count.",
   "Increase button — plus.",
   "Limit message — shown at the maximum."
  ],
  "behavior": [
   "Stop at the stock or policy limit and say why.",
   "Treat setting zero as remove, with confirmation or undo."
  ],
  "accessibility": [
   "Use the spinbutton pattern and label the item, such as \"Quantity, Blue chair\".",
   "Keep step buttons at least 44px on touch screens."
  ],
  "content": [
   "Write limit messages plainly, such as \"Only 5 left\".",
   "Show the limit before people reach it when stock is low."
  ],
  "map": [
   [
    "Polaris",
    "Text field (number)",
    "Partial"
   ],
   [
    "Spectrum",
    "Number field",
    "Partial"
   ],
   [
    "Carbon",
    "Number input",
    "Partial"
   ]
  ],
  "commonGround": "Polaris, Spectrum and Carbon use a number field with steps for quantities; none ships a dedicated quantity control.",
  "sources": [
   "https://polaris-react.shopify.com/components/selection-and-input/text-field",
   "https://spectrum.adobe.com/page/number-field/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/"
  ]
 },
 "forms|Range slider": {
  "text": "A slider with two handles for setting a minimum and a maximum value.",
  "purpose": "Lets people set a range visually when the span matters more than the exact values.",
  "use": [
   "Price or size filters.",
   "With paired number inputs, when exact values matter."
  ],
  "avoid": [
   "A single value: use a slider.",
   "Exact entry is the main need: use two number inputs."
  ],
  "anatomy": [
   "Track — the full range.",
   "Filled segment — the chosen range.",
   "Two handles — minimum and maximum.",
   "Value inputs — optional, for exact entry."
  ],
  "behavior": [
   "Prevent the handles from crossing.",
   "Show current values as people drag."
  ],
  "accessibility": [
   "Use two slider roles, each labeled, such as \"Minimum price\".",
   "Support arrow keys, Page Up, Page Down, Home, and End."
  ],
  "content": [
   "Show units with the values.",
   "Label the handles by their role, such as \"Minimum\" and \"Maximum\"."
  ],
  "map": [
   [
    "Spectrum",
    "Range slider",
    "Direct"
   ],
   [
    "Polaris",
    "Range slider (dual)",
    "Direct"
   ],
   [
    "Carbon",
    "Slider (range)",
    "Variant"
   ],
   [
    "Material 3",
    "Sliders (range)",
    "Variant"
   ],
   [
    "Fluent 2",
    "Slider",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum, Polaris, Carbon and Material all offer a two-handle slider; Carbon and Polaris pair it with number inputs for exact values.",
  "sources": [
   "https://spectrum.adobe.com/page/range-slider/",
   "https://polaris-react.shopify.com/components/selection-and-input/range-slider",
   "https://carbondesignsystem.com/components/slider/usage/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/"
  ]
 },
 "forms|File input": {
  "text": "Chooses files from the device, by button or by drag and drop.",
  "purpose": "One clear way to add files and see their upload status.",
  "use": [
   "Attaching documents or importing data files.",
   "With a drop zone when people often drag files."
  ],
  "avoid": [
   "Images that need a preview or crop: use an image upload.",
   "Files from inside the app: use a media picker."
  ],
  "anatomy": [
   "Label and limits — allowed types and size.",
   "Button or drop zone — opens the file dialog.",
   "File list — each file with name, size, status, and remove."
  ],
  "behavior": [
   "Show progress and success or error per file.",
   "Reject wrong types or sizes with a clear message per file."
  ],
  "accessibility": [
   "Keep a real button that opens the file dialog; drag and drop is extra.",
   "Announce upload status changes."
  ],
  "content": [
   "State limits before upload, such as \"PDF or DOCX, up to 10 MB\".",
   "Write per-file errors that name the file and the fix, such as \"report.exe is not an allowed type\"."
  ],
  "map": [
   [
    "Carbon",
    "File uploader",
    "Direct"
   ],
   [
    "Polaris",
    "Drop zone",
    "Direct"
   ],
   [
    "Spectrum",
    "Drop zone",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Polaris and GOV.UK show allowed types and sizes up front, list files with status, and keep a button beside any drop area.",
  "sources": [
   "https://carbondesignsystem.com/components/file-uploader/usage/",
   "https://polaris-react.shopify.com/components/selection-and-input/drop-zone",
   "https://design-system.service.gov.uk/components/file-upload/"
  ]
 },
 "forms|Image upload": {
  "text": "A file input for images that previews each chosen image.",
  "purpose": "Lets people confirm they chose the right image before saving.",
  "use": [
   "Product images, covers, and attachments where looks matter.",
   "With crop, when a fixed aspect ratio is required."
  ],
  "avoid": [
   "Non-image files: use a file input.",
   "Profile photos: use an avatar upload."
  ],
  "anatomy": [
   "Drop zone or button.",
   "Preview — thumbnail of each image.",
   "Actions — replace, remove, and optional crop.",
   "Limits — formats, size, and dimensions."
  ],
  "behavior": [
   "Show the preview as soon as a file is chosen.",
   "Show upload progress over the preview."
  ],
  "accessibility": [
   "Ask for alt text when the image will be shown to others.",
   "Keep a button path alongside drag and drop."
  ],
  "content": [
   "State formats and recommended dimensions.",
   "Ask for alt text with a short prompt, such as \"Describe this image\"."
  ],
  "map": [
   [
    "Polaris",
    "Drop zone (image)",
    "Variant"
   ],
   [
    "Carbon",
    "File uploader",
    "Partial"
   ],
   [
    "Spectrum",
    "Drop zone",
    "Partial"
   ]
  ],
  "commonGround": "Polaris shows image thumbnails in its drop zone; Carbon and Spectrum provide the base file upload pattern without previews.",
  "sources": [
   "https://polaris-react.shopify.com/components/selection-and-input/drop-zone",
   "https://carbondesignsystem.com/components/file-uploader/usage/"
  ]
 },
 "forms|Avatar upload": {
  "text": "Sets a profile picture: shows the current avatar with change and remove actions.",
  "purpose": "Lets people set or change their picture and see how it will look.",
  "use": [
   "Profile and account settings.",
   "Team, workspace, or app icons."
  ],
  "avoid": [
   "General images: use an image upload.",
   "Do not use when the picture comes from an external identity provider and cannot change here."
  ],
  "anatomy": [
   "Current avatar — image or initials fallback.",
   "Change action — opens file dialog.",
   "Crop step — square or circle crop.",
   "Remove action — back to initials."
  ],
  "behavior": [
   "Crop to the avatar shape before saving.",
   "Fall back to initials when there is no image."
  ],
  "accessibility": [
   "Give the change button a clear label, such as \"Change profile photo\".",
   "Give the avatar image alt text with the person's name."
  ],
  "content": [
   "State the minimum size, such as \"At least 200 × 200 pixels\".",
   "Label actions \"Change photo\" and \"Remove photo\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/button/"
  ],
  "map": []
 },
 "forms|Attachment picker": {
  "text": "Adds attachments from several sources, such as the device, cloud storage, or a link.",
  "purpose": "One entry point for attaching content wherever it lives.",
  "use": [
   "Messages, comments, and records that take attachments.",
   "Files that come from more than one source."
  ],
  "avoid": [
   "Device files only: use a file input.",
   "Linking records: use an entity picker."
  ],
  "anatomy": [
   "Attach button — opens a menu of sources.",
   "Source menu — device, cloud, link.",
   "Attachment list — chosen items with remove."
  ],
  "behavior": [
   "Show each attachment with name, type, size, and status.",
   "Keep attachments in place if the message fails to send."
  ],
  "accessibility": [
   "Use a menu button pattern for the source menu.",
   "Announce added and removed attachments."
  ],
  "content": [
   "Name sources plainly, such as \"Upload from computer\".",
   "Show size limits per source in the menu or help text."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/"
  ],
  "map": []
 },
 "forms|Media picker": {
  "text": "A dialog for choosing images, video, or files already in the app's library.",
  "purpose": "Lets people reuse stored assets instead of uploading duplicates.",
  "use": [
   "Assets stored in the product, such as a DAM.",
   "Large libraries, with search and filters."
  ],
  "avoid": [
   "Only new files from the device: use a file input.",
   "One known file: link it directly."
  ],
  "anatomy": [
   "Dialog — title and close.",
   "Search and filters.",
   "Asset grid or list — with thumbnails and selection.",
   "Footer — count chosen and confirm."
  ],
  "behavior": [
   "Support single or multiple selection, stated in the title.",
   "Offer an upload action inside the picker."
  ],
  "accessibility": [
   "Use a modal dialog with a focus trap.",
   "Make grid items selectable by keyboard with clear selected states."
  ],
  "content": [
   "Use a confirm label that says what happens, such as \"Insert 3 images\".",
   "Write the title with the asset type, such as \"Choose images\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/grid/"
  ],
  "map": []
 },
 "navigation|App bar": {
  "text": "The fixed bar across the top of the app; holds the product name, global actions, and account menu.",
  "purpose": "Gives every page the same anchor for identity and global tools.",
  "use": [
   "Every page of the app.",
   "App-wide actions, such as search, help, notifications, and profile."
  ],
  "avoid": [
   "Page-specific actions: use the page header.",
   "More than a few icons: move extras into a menu."
  ],
  "anatomy": [
   "Product name or logo — links to the app home.",
   "Menu toggle — opens the side navigation on small screens.",
   "Global actions — search, help, notifications.",
   "Account menu — avatar with profile and sign out."
  ],
  "behavior": [
   "Keep it fixed and the same on every page.",
   "Collapse global actions into a menu as space shrinks."
  ],
  "accessibility": [
   "Mark it as a banner landmark with a skip link before it.",
   "Give icon buttons accessible names and 24px minimum targets."
  ],
  "content": [
   "Use the product name only, no tagline.",
   "Label icons with tooltips, such as \"Notifications\"."
  ],
  "map": [
   [
    "Carbon",
    "UI shell header",
    "Direct"
   ],
   [
    "Material 3",
    "Top app bar",
    "Direct"
   ],
   [
    "Polaris",
    "Top bar",
    "Direct"
   ],
   [
    "Atlassian",
    "Atlassian navigation",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Material, Polaris and Atlassian place identity at the left and global actions and the account menu at the right of a fixed top bar. Material also puts the page title in it on mobile.",
  "sources": [
   "https://carbondesignsystem.com/components/UI-shell-header/usage/",
   "https://m3.material.io/components/top-app-bar/overview",
   "https://atlassian.design/components/atlassian-navigation"
  ]
 },
 "navigation|Top navigation": {
  "text": "Primary navigation links in a horizontal row in the app bar.",
  "purpose": "Shows the main areas of a product at a glance when there are only a few.",
  "use": [
   "Two to six top-level areas.",
   "Pages need full width and a side navigation would crowd them."
  ],
  "avoid": [
   "Many or nested areas: use product navigation in a side panel.",
   "Do not mix links and actions in one row without clear separation."
  ],
  "anatomy": [
   "Links — one per top-level area.",
   "Current indicator — underline or fill on the active area.",
   "Overflow menu — \"More\" for items that do not fit."
  ],
  "behavior": [
   "Mark the current area at all times.",
   "Move items that do not fit into a \"More\" menu.",
   "Switch to a menu on small screens."
  ],
  "accessibility": [
   "Wrap links in a nav landmark and set aria-current on the active link.",
   "Use links, not buttons, for page changes."
  ],
  "content": [
   "Use one- or two-word nouns, such as \"Projects\".",
   "Match labels to the page titles they open."
  ],
  "map": [
   [
    "Atlassian",
    "Atlassian navigation",
    "Direct"
   ],
   [
    "Carbon",
    "UI shell header (navigation)",
    "Direct"
   ],
   [
    "Polaris",
    "Top bar",
    "Partial"
   ],
   [
    "Material 3",
    "Top app bar",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Carbon place a short row of top-level links in the header and mark the current one. Both collapse it into a menu on small screens.",
  "sources": [
   "https://atlassian.design/components/atlassian-navigation",
   "https://carbondesignsystem.com/components/UI-shell-header/usage/"
  ]
 },
 "navigation|Navigation bar": {
  "text": "A bar of three to five top-level destinations shown as icons with labels.",
  "purpose": "Gives quick, always-visible access to the most used areas.",
  "use": [
   "Three to five equally important destinations.",
   "At the bottom on compact screens; as a rail on wider ones."
  ],
  "avoid": [
   "One or two destinations, or more than five.",
   "Actions: use buttons or a toolbar."
  ],
  "anatomy": [
   "Destinations — icon with short label.",
   "Active indicator — fill or pill behind the active icon.",
   "Badge — optional count or dot."
  ],
  "behavior": [
   "Keep destination order fixed.",
   "Tapping the active destination returns to its top level."
  ],
  "accessibility": [
   "Use a nav landmark with aria-current on the active item.",
   "Keep targets at least 24px, and 44px or more on touch."
  ],
  "content": [
   "Keep labels to one short word.",
   "Match labels to the titles of the destination pages."
  ],
  "map": [
   [
    "Material 3",
    "Navigation bar",
    "Direct"
   ],
   [
    "Carbon",
    "UI shell header (navigation)",
    "Partial"
   ],
   [
    "Fluent 2",
    "Nav",
    "Partial"
   ]
  ],
  "commonGround": "Material defines this as a bar of three to five icon-and-label destinations; Carbon and Fluent provide header or side navigation for the same role.",
  "sources": [
   "https://m3.material.io/components/navigation-bar/overview",
   "https://carbondesignsystem.com/components/UI-shell-header/usage/"
  ]
 },
 "navigation|Global search": {
  "text": "A search field in the app bar that searches across the whole product.",
  "purpose": "Lets people jump to any record or page from anywhere.",
  "use": [
   "The product has many records or pages.",
   "Add a keyboard shortcut for frequent users."
  ],
  "avoid": [
   "Searching within one list: use a local search field.",
   "Do not hide it behind several clicks."
  ],
  "anatomy": [
   "Entry — search icon or field in the app bar.",
   "Input — expands or opens a panel.",
   "Suggestions — recent and matching items.",
   "Full results link — opens a results page."
  ],
  "behavior": [
   "Open with a click or a shortcut such as \"/\".",
   "Show suggestions as people type and a full results page on Enter.",
   "Keep the query when people return."
  ],
  "accessibility": [
   "Use a search landmark and a labeled input.",
   "Follow the combobox pattern for suggestions."
  ],
  "content": [
   "Use placeholder text such as \"Search projects, files, and people\".",
   "Show the shortcut in the field, such as \"/\" as a key hint."
  ],
  "map": [
   [
    "Carbon",
    "UI shell header (search)",
    "Partial"
   ],
   [
    "Polaris",
    "Top bar (search field)",
    "Variant"
   ],
   [
    "Material 3",
    "Search",
    "Partial"
   ],
   [
    "Atlassian",
    "Atlassian navigation (search)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Polaris and Atlassian put product-wide search in the header and expand it on focus; Material treats search as a bar that opens a full search view.",
  "sources": [
   "https://carbondesignsystem.com/components/UI-shell-header/usage/",
   "https://m3.material.io/components/search/overview",
   "https://atlassian.design/components/atlassian-navigation"
  ]
 },
 "navigation|Product navigation": {
  "text": "The side panel that lists the main areas and pages of a product.",
  "purpose": "Gives a stable map of the product and shows where people are.",
  "use": [
   "A product with more than five areas or nested pages.",
   "A persistent panel on wide screens."
  ],
  "avoid": [
   "A few areas: use top navigation.",
   "Nesting deeper than two levels: use drilldown or page-level tabs."
  ],
  "anatomy": [
   "Header — product or workspace name.",
   "Items — icon and label links.",
   "Groups — optional headings or expandable sections.",
   "Collapse control — narrows the panel to icons."
  ],
  "behavior": [
   "Mark the current page and expand its group.",
   "Let people collapse the panel and remember the choice.",
   "Turn into a drawer on small screens."
  ],
  "accessibility": [
   "Use a nav landmark and aria-current on the current page.",
   "Make expandable groups disclosure buttons with aria-expanded."
  ],
  "content": [
   "Use short nouns for labels.",
   "Do not repeat group names in item labels."
  ],
  "map": [
   [
    "Carbon",
    "UI shell left panel",
    "Direct"
   ],
   [
    "Atlassian",
    "Side navigation",
    "Direct"
   ],
   [
    "Polaris",
    "Navigation",
    "Direct"
   ],
   [
    "Fluent 2",
    "Nav",
    "Direct"
   ],
   [
    "Spectrum",
    "Side navigation",
    "Direct"
   ],
   [
    "Material 3",
    "Navigation drawer",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Atlassian, Polaris, Fluent and Spectrum all use a left panel with grouped links, a current-page marker, and a collapse to a drawer on small screens. They differ on how many nesting levels they allow.",
  "sources": [
   "https://carbondesignsystem.com/components/UI-shell-left-panel/usage/",
   "https://atlassian.design/components/side-navigation",
   "https://polaris-react.shopify.com/components/navigation/navigation",
   "https://spectrum.adobe.com/page/side-navigation/"
  ]
 },
 "navigation|Mega menu": {
  "text": "A large dropdown panel from a top navigation item that shows many grouped links at once.",
  "purpose": "Exposes deep site structure in one step when there are many sections.",
  "use": [
   "Marketing or documentation sites with many sections.",
   "Groups of links need headings."
  ],
  "avoid": [
   "Task-focused apps: use product navigation.",
   "Do not open on hover alone."
  ],
  "anatomy": [
   "Trigger — the top navigation item.",
   "Panel — a full-width area.",
   "Groups — headings with links.",
   "Feature area — optional highlight."
  ],
  "behavior": [
   "Open on click or Enter and close on Esc or outside click.",
   "Keep panel content scannable with headings."
  ],
  "accessibility": [
   "Use the disclosure pattern, not a menu role, for link panels.",
   "Return focus to the trigger on close."
  ],
  "content": [
   "Use short group headings and link names.",
   "Do not repeat the trigger name in every link."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
  ],
  "map": []
 },
 "navigation|Drilldown navigation": {
  "text": "Replaces the list with a child list when a parent is chosen, with a back control.",
  "purpose": "Lets deep hierarchies fit in a narrow panel one level at a time.",
  "use": [
   "Narrow panels with three or more levels.",
   "Nested menus on mobile."
  ],
  "avoid": [
   "Shallow trees: use expandable groups.",
   "People compare across branches: use a tree."
  ],
  "anatomy": [
   "Level title — names the current level.",
   "Back control — returns to the parent level.",
   "Items — with a chevron when they have children."
  ],
  "behavior": [
   "Slide in the child level and show the parent name in the back control.",
   "Keep the current page marked when returning."
  ],
  "accessibility": [
   "Move focus to the new level's title on change.",
   "Give the back control a name such as \"Back to Settings\"."
  ],
  "content": [
   "Show the parent name with the back control.",
   "Use the same item names as the desktop navigation."
  ],
  "map": [
   [
    "Atlassian",
    "Side navigation (nesting)",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian side navigation supports nested levels with a back control. Other systems prefer expandable groups.",
  "sources": [
   "https://atlassian.design/components/side-navigation"
  ]
 },
 "navigation|Miller columns": {
  "text": "Side-by-side columns where choosing an item in one column shows its children in the next.",
  "purpose": "Shows a path through a deep hierarchy while keeping each level visible.",
  "use": [
   "Browsing deep folder or category trees.",
   "Use on wide screens."
  ],
  "avoid": [
   "Narrow screens: use drilldown.",
   "Flat lists."
  ],
  "anatomy": [
   "Columns — one per level.",
   "Items — with a chevron when they have children.",
   "Selected path — highlighted item in each column.",
   "Detail pane — optional, for the final item."
  ],
  "behavior": [
   "Scroll horizontally to keep the newest column in view.",
   "Clear columns to the right when a parent changes."
  ],
  "accessibility": [
   "Use arrow keys: up and down within a column, left and right between levels.",
   "Label each column by its parent."
  ],
  "content": [
   "Use item names only; the columns show the path.",
   "Show an empty message in a column that has no children, such as \"No items\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
  ],
  "map": []
 },
 "navigation|Stepper": {
  "text": "Shows the steps of a multi-step task and where the person is.",
  "purpose": "Sets expectations for a long task and lets people move between steps.",
  "use": [
   "Tasks of three to seven ordered steps.",
   "People benefit from seeing what remains."
  ],
  "avoid": [
   "One or two steps.",
   "Steps that can be done in any order: use tabs or sections."
  ],
  "anatomy": [
   "Steps — label and number for each.",
   "States — complete, current, incomplete, and error.",
   "Connector — line between steps."
  ],
  "behavior": [
   "Mark the current step and completed steps with icon and text.",
   "Allow going back to completed steps; validate before moving forward."
  ],
  "accessibility": [
   "Use an ordered list and aria-current on the current step.",
   "Do not rely on color alone for state."
  ],
  "content": [
   "Use short noun labels, such as \"Details\" or \"Review\".",
   "Keep labels parallel and under three words."
  ],
  "map": [
   [
    "Carbon",
    "Progress indicator",
    "Direct"
   ],
   [
    "Atlassian",
    "Progress tracker",
    "Direct"
   ]
  ],
  "commonGround": "Carbon and Atlassian show ordered steps with complete, current and upcoming states, and let people revisit completed steps.",
  "sources": [
   "https://carbondesignsystem.com/components/progress-indicator/usage/",
   "https://atlassian.design/components/progress-tracker"
  ]
 },
 "navigation|Previous / next navigation": {
  "text": "A pair of links that move to the previous or next item in a sequence.",
  "purpose": "Lets people move through ordered items without going back to a list.",
  "use": [
   "Sequences such as records, articles, or steps.",
   "The total is large and page numbers do not help."
  ],
  "avoid": [
   "People need to jump to a page: use pagination.",
   "Unordered content."
  ],
  "anatomy": [
   "Previous link — arrow and optional item title.",
   "Next link — arrow and optional item title.",
   "Position — optional, such as \"3 of 20\"."
  ],
  "behavior": [
   "Disable or hide the control at the start and end.",
   "Show item titles when they help people decide."
  ],
  "accessibility": [
   "Use links with clear names, such as \"Next: Billing\".",
   "Support keyboard shortcuts only when announced."
  ],
  "content": [
   "Use \"Previous\" and \"Next\", plus the item name when known.",
   "Show position text such as \"3 of 20\" when the total is known."
  ],
  "map": [
   [
    "Polaris",
    "Pagination",
    "Direct"
   ],
   [
    "Carbon",
    "Pagination nav",
    "Partial"
   ],
   [
    "Atlassian",
    "Pagination",
    "Partial"
   ]
  ],
  "commonGround": "Polaris pagination is previous and next only; Carbon and Atlassian include previous and next within numbered pagination.",
  "sources": [
   "https://polaris-react.shopify.com/components/navigation/pagination",
   "https://carbondesignsystem.com/components/pagination/usage/",
   "https://atlassian.design/components/pagination"
  ]
 },
 "navigation|Vertical tabs": {
  "text": "Tabs stacked in a column beside the content they switch.",
  "purpose": "Fits more or longer tab labels than a horizontal row.",
  "use": [
   "More than about six sections, such as settings pages.",
   "Use when labels are long."
  ],
  "avoid": [
   "Page-level navigation: use product navigation.",
   "Two or three sections: use horizontal tabs."
  ],
  "anatomy": [
   "Tab list — stacked labels.",
   "Selected indicator — bar on the side of the active tab.",
   "Panel — content of the chosen tab."
  ],
  "behavior": [
   "Show one panel at a time.",
   "Keep the tab list fixed while the panel scrolls."
  ],
  "accessibility": [
   "Use the tabs pattern with aria-orientation vertical and up and down arrow keys.",
   "Link each tab to its panel with aria-controls and label the panel by its tab."
  ],
  "content": [
   "Use short nouns in sentence case.",
   "Keep labels on one line where possible."
  ],
  "map": [
   [
    "Carbon",
    "Tabs (vertical)",
    "Variant"
   ],
   [
    "Fluent 2",
    "Tab list (vertical)",
    "Variant"
   ],
   [
    "Spectrum",
    "Tabs (vertical)",
    "Variant"
   ]
  ],
  "commonGround": "Carbon, Fluent and Spectrum offer tabs in a vertical orientation, placed at the left of the content.",
  "sources": [
   "https://carbondesignsystem.com/components/tabs/usage/",
   "https://fluent2.microsoft.design/components/web/react/core/tablist/usage",
   "https://spectrum.adobe.com/page/tabs/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/"
  ]
 },
 "navigation|Load more / infinite scroll": {
  "text": "Shows more items in a long list, by a button or by loading as people scroll.",
  "purpose": "Shows long lists without page numbers.",
  "use": [
   "Feeds and search results: a load more button.",
   "Infinite scroll: only browsing streams with no footer."
  ],
  "avoid": [
   "People must reach the footer or jump to a position: use pagination.",
   "Infinite scroll in tables where people compare and return."
  ],
  "anatomy": [
   "List — items shown so far.",
   "Load more button — or a scroll trigger.",
   "Loading indicator — shown while items load.",
   "End message — shown when no items remain."
  ],
  "behavior": [
   "Keep scroll position and focus after loading.",
   "Show a clear end message."
  ],
  "accessibility": [
   "Move focus to the first new item after load more.",
   "Announce how many items were added."
  ],
  "content": [
   "Use \"Load more\" or \"Show 20 more\".",
   "Write the end message as \"You've reached the end\" or \"No more results\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/feed/"
  ],
  "map": []
 },
 "navigation|Bottom navigation": {
  "text": "A bar fixed to the bottom of a mobile screen with three to five main destinations.",
  "purpose": "Puts top-level destinations within thumb reach.",
  "use": [
   "Three to five top-level destinations on mobile.",
   "People switch between those areas often."
  ],
  "avoid": [
   "Actions: use a button.",
   "Wide screens: use product navigation."
  ],
  "anatomy": [
   "Destinations — icon and short label.",
   "Active indicator — marks the current destination.",
   "Badges — optional counts or dots."
  ],
  "behavior": [
   "Keep it visible on top-level pages.",
   "Keep each destination's state when people switch."
  ],
  "accessibility": [
   "Use a nav landmark and aria-current.",
   "Keep touch targets at least 44px."
  ],
  "content": [
   "Use one-word labels.",
   "Use the same labels as the matching desktop navigation items."
  ],
  "map": [
   [
    "Material 3",
    "Navigation bar",
    "Direct"
   ],
   [
    "Fluent 2",
    "Tab bar (mobile)",
    "Direct"
   ]
  ],
  "commonGround": "Material and Fluent mobile both use a bottom bar with three to five icon-and-label destinations.",
  "sources": [
   "https://m3.material.io/components/navigation-bar/overview",
   "https://fluent2.microsoft.design/"
  ]
 },
 "navigation|Mobile app bar": {
  "text": "The top bar of a mobile screen: page title, back or menu control, and a few actions.",
  "purpose": "Gives mobile pages a title, a way back, and key actions.",
  "use": [
   "Every mobile screen.",
   "Child screens, with a back control."
  ],
  "avoid": [
   "More than two or three actions: move the rest into an overflow menu.",
   "The only route to primary destinations when a bottom bar fits better."
  ],
  "anatomy": [
   "Navigation control — back or menu.",
   "Title — the page name.",
   "Actions — up to three icons.",
   "Overflow menu — holds extra actions."
  ],
  "behavior": [
   "Show back on child screens and menu on top-level screens.",
   "Shrink or hide on scroll when content needs space."
  ],
  "accessibility": [
   "Give icon buttons accessible names.",
   "Keep touch targets at least 44px."
  ],
  "content": [
   "Keep titles short enough to fit.",
   "Use the same title as the page heading."
  ],
  "map": [
   [
    "Material 3",
    "Top app bar",
    "Direct"
   ],
   [
    "Carbon",
    "UI shell header",
    "Partial"
   ]
  ],
  "commonGround": "Material defines the mobile top bar with navigation, title and actions; Carbon adapts its header for small screens.",
  "sources": [
   "https://m3.material.io/components/top-app-bar/overview",
   "https://carbondesignsystem.com/components/UI-shell-header/usage/"
  ]
 },
 "navigation|Mobile navigation drawer": {
  "text": "A panel that slides in from the side on mobile with the product navigation.",
  "purpose": "Gives access to many destinations on small screens without using space.",
  "use": [
   "More than five destinations on mobile.",
   "Pair with a menu button in the mobile app bar."
  ],
  "avoid": [
   "Three to five destinations: use bottom navigation.",
   "Actions: keep them in the app bar or page."
  ],
  "anatomy": [
   "Scrim — dims the page behind.",
   "Panel — the navigation items.",
   "Header — product or account.",
   "Close control — closes the drawer."
  ],
  "behavior": [
   "Close on choice, scrim tap, swipe, or Esc.",
   "Mark the current page."
  ],
  "accessibility": [
   "Use a modal dialog with a focus trap; return focus to the menu button on close.",
   "Give the menu button the name \"Open navigation\" and mark the drawer with aria-label."
  ],
  "content": [
   "Use the same labels as the desktop navigation.",
   "Group items under short headings when there are more than eight."
  ],
  "map": [
   [
    "Material 3",
    "Navigation drawer (modal)",
    "Direct"
   ],
   [
    "Fluent 2",
    "Drawer",
    "Partial"
   ],
   [
    "Carbon",
    "UI shell left panel",
    "Partial"
   ],
   [
    "Atlassian",
    "Side navigation",
    "Partial"
   ]
  ],
  "commonGround": "Material, Carbon and Atlassian turn the side navigation into an overlay drawer on small screens with a scrim and menu button.",
  "sources": [
   "https://m3.material.io/components/navigation-drawer/overview",
   "https://fluent2.microsoft.design/components/web/react/core/drawer/usage",
   "https://carbondesignsystem.com/components/UI-shell-left-panel/usage/"
  ]
 },
 "navigation|Mobile menu": {
  "text": "A full-screen or dropdown menu, opened from a menu button, that lists navigation on small screens.",
  "purpose": "Replaces top navigation links when they do not fit.",
  "use": [
   "Sites with top navigation, on small screens.",
   "Items are few and flat."
  ],
  "avoid": [
   "Deep app navigation: use a navigation drawer.",
   "Wide screens where links fit in the app bar."
  ],
  "anatomy": [
   "Menu button — hamburger icon with label.",
   "Menu panel — the list of links.",
   "Close control — closes the menu."
  ],
  "behavior": [
   "Push or overlay content and close on choice or Esc.",
   "Keep the current page marked."
  ],
  "accessibility": [
   "Use the disclosure pattern with aria-expanded on the button.",
   "Return focus to the button on close."
  ],
  "content": [
   "Show the word \"Menu\" with the icon when space allows.",
   "Use the same labels as the full-width navigation."
  ],
  "map": [
   [
    "Carbon",
    "UI shell header (menu)",
    "Partial"
   ],
   [
    "Polaris",
    "Navigation (mobile)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Polaris collapse navigation behind a menu button on small screens.",
  "sources": [
   "https://carbondesignsystem.com/components/UI-shell-header/usage/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/"
  ]
 },
 "navigation|Bottom-sheet navigation": {
  "text": "A sheet that slides up from the bottom of a mobile screen with navigation choices.",
  "purpose": "Keeps secondary destinations within thumb reach.",
  "use": [
   "Secondary destinations or switching between items on mobile.",
   "A full drawer is too heavy."
  ],
  "avoid": [
   "Primary navigation: use bottom navigation.",
   "Wide screens."
  ],
  "anatomy": [
   "Handle — shows the sheet can be dragged.",
   "Title — optional name of the sheet.",
   "Items — navigation links.",
   "Scrim — dims the page behind."
  ],
  "behavior": [
   "Close on choice, drag down, scrim tap, or back.",
   "Limit to half the screen unless expanded."
  ],
  "accessibility": [
   "Use a modal dialog with a focus trap, and a close button for people who cannot drag.",
   "Keep touch targets at least 44px."
  ],
  "content": [
   "Use short labels.",
   "Add a title when the sheet's purpose is not clear from its trigger."
  ],
  "map": [
   [
    "Material 3",
    "Bottom sheets",
    "Partial"
   ],
   [
    "Fluent 2",
    "Bottom sheet",
    "Partial"
   ]
  ],
  "commonGround": "Material and Fluent mobile offer bottom sheets as containers; neither defines them only for navigation.",
  "sources": [
   "https://m3.material.io/components/bottom-sheets/overview",
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ]
 },
 "navigation|Mobile tab bar": {
  "text": "A row of tabs at the top of a mobile screen that switches views within one section.",
  "purpose": "Lets people switch between related views of one area.",
  "use": [
   "Two to five views of the same content.",
   "Under the mobile app bar."
  ],
  "avoid": [
   "Top-level destinations: use bottom navigation.",
   "More than five tabs, unless the row scrolls."
  ],
  "anatomy": [
   "Tabs — text labels, scrollable if many.",
   "Active indicator — marks the current tab.",
   "Panel — the content of the current tab."
  ],
  "behavior": [
   "Allow swipe between panels.",
   "Scroll the tab row when tabs do not fit."
  ],
  "accessibility": [
   "Use the tabs pattern with aria-selected.",
   "Make swipe a shortcut only; tabs must also work by tap and keyboard."
  ],
  "content": [
   "Use one- or two-word labels.",
   "Use nouns, not verbs."
  ],
  "map": [
   [
    "Material 3",
    "Tabs",
    "Partial"
   ],
   [
    "Fluent 2",
    "Tab bar",
    "Partial"
   ]
  ],
  "commonGround": "Material places tabs under the top app bar for related views; Fluent mobile uses a tab bar for the same need.",
  "sources": [
   "https://m3.material.io/components/tabs/overview",
   "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/"
  ]
 },
 "navigation|Search suggestions": {
  "text": "A list of suggested queries or items shown under a search field as people type.",
  "purpose": "Speeds search and helps people spell or phrase queries.",
  "use": [
   "Global search and large data sets.",
   "Mixing query suggestions with direct matches."
  ],
  "avoid": [
   "Results must be exact: show results directly.",
   "Suggestions that hide the person's own query: keep their text first."
  ],
  "anatomy": [
   "Search field — where the query is typed.",
   "Suggestion list — query text or matching items.",
   "Match highlight — bold on the typed part."
  ],
  "behavior": [
   "Update after a short pause.",
   "Choosing a suggestion runs the search or opens the item."
  ],
  "accessibility": [
   "Follow the combobox pattern with aria-activedescendant.",
   "Announce the number of suggestions."
  ],
  "content": [
   "Bold the part that matches the typed text.",
   "Keep suggestions short and use the person's own terms."
  ],
  "map": [
   [
    "Material 3",
    "Search",
    "Direct"
   ],
   [
    "Polaris",
    "Autocomplete",
    "Partial"
   ]
  ],
  "commonGround": "Material shows suggestions in its search view; Polaris shows suggestions in its autocomplete.",
  "sources": [
   "https://m3.material.io/components/search/overview",
   "https://polaris-react.shopify.com/components/selection-and-input/autocomplete",
   "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
  ]
 },
 "navigation|Autocomplete search": {
  "text": "A search field that completes or suggests matching items as people type.",
  "purpose": "Lets people find a known item without opening full results.",
  "use": [
   "People often search for a known item.",
   "Use for large lists."
  ],
  "avoid": [
   "People browse: use filters.",
   "Picking a form value: use a combobox or select."
  ],
  "anatomy": [
   "Input — the search field.",
   "Suggestion list — matching items.",
   "Clear button — empties the field.",
   "No-results message — shown when nothing matches."
  ],
  "behavior": [
   "Keep the typed text when moving through suggestions.",
   "Enter on a suggestion opens it."
  ],
  "accessibility": [
   "Follow the combobox pattern.",
   "Give the clear button a label."
  ],
  "content": [
   "Use placeholder text that names what can be found.",
   "Write the empty state as \"No results for …\" with the query."
  ],
  "map": [
   [
    "Polaris",
    "Autocomplete",
    "Direct"
   ],
   [
    "Spectrum",
    "Search autocomplete",
    "Direct"
   ],
   [
    "Carbon",
    "Combo box",
    "Partial"
   ],
   [
    "Material 3",
    "Search",
    "Partial"
   ],
   [
    "Fluent 2",
    "Combobox",
    "Partial"
   ]
  ],
  "commonGround": "Polaris and Spectrum provide a search field with a suggestion list built on the combobox pattern.",
  "sources": [
   "https://polaris-react.shopify.com/components/selection-and-input/autocomplete",
   "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
  ]
 },
 "navigation|Search result item": {
  "text": "One entry in a search results list with title, type, context, and matching snippet.",
  "purpose": "Helps people judge a result before opening it.",
  "use": [
   "Search results pages and panels.",
   "Use the same item style across product search."
  ],
  "avoid": [
   "Plain lists without a query: use a list item.",
   "Thumbnails that do not help tell results apart."
  ],
  "anatomy": [
   "Icon or thumbnail — shows the type.",
   "Title — the link to the result.",
   "Context — location or path.",
   "Snippet — text with matches highlighted."
  ],
  "behavior": [
   "Open on title click.",
   "Highlight matched words in title and snippet."
  ],
  "accessibility": [
   "Make the title the link.",
   "Do not rely on highlight color alone; use bold."
  ],
  "content": [
   "Show the path to tell similar titles apart.",
   "Trim snippets to about two lines around the match."
  ],
  "map": [
   [
    "Polaris",
    "Resource item",
    "Partial"
   ],
   [
    "Material 3",
    "Lists",
    "Partial"
   ]
  ],
  "commonGround": "No system defines a search result item; Polaris and Material build results from list items.",
  "sources": [
   "https://polaris-react.shopify.com/components/lists/resource-item",
   "https://m3.material.io/components/lists/overview"
  ]
 },
 "navigation|Search result groups": {
  "text": "Search results grouped by type or source, each group with a heading and count.",
  "purpose": "Helps people scan mixed results by type.",
  "use": [
   "Results span several types.",
   "Global search panels."
  ],
  "avoid": [
   "All results are one type.",
   "More groups than fit on one screen: merge rare types into \"Other\"."
  ],
  "anatomy": [
   "Group heading — type name and count.",
   "Results — the top items of the group.",
   "See all link — opens all results of that type."
  ],
  "behavior": [
   "Show a few items per group and link to more.",
   "Order groups by relevance."
  ],
  "accessibility": [
   "Use headings for groups.",
   "Group listbox options when in a combobox."
  ],
  "content": [
   "Use plural type names, such as \"Files\".",
   "Show counts next to headings, such as \"Files (12)\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
  ],
  "map": []
 },
 "navigation|Recent searches": {
  "text": "A short list of the person's last searches shown when the search field is empty.",
  "purpose": "Lets people repeat a search quickly.",
  "use": [
   "Use in global search.",
   "People repeat searches."
  ],
  "avoid": [
   "Searches are sensitive and shared devices are common.",
   "Do not show more than about five recent items."
  ],
  "anatomy": [
   "Heading — names the list.",
   "Items — past query text.",
   "Remove and clear all — per item and for the list."
  ],
  "behavior": [
   "Show on focus of an empty field.",
   "Let people remove items."
  ],
  "accessibility": [
   "Follow the combobox pattern.",
   "Label remove buttons."
  ],
  "content": [
   "Use \"Recent searches\" as the heading.",
   "Label the clear action \"Clear recent searches\"."
  ],
  "map": [
   [
    "Material 3",
    "Search (history)",
    "Partial"
   ]
  ],
  "commonGround": "Material shows recent queries in its search view; other systems do not define this.",
  "sources": [
   "https://m3.material.io/components/search/overview",
   "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
  ]
 },
 "navigation|Search history": {
  "text": "A page or panel that lists past searches with dates, to rerun or remove.",
  "purpose": "Lets people find and repeat older searches.",
  "use": [
   "Products where search is central.",
   "People need to rerun searches."
  ],
  "avoid": [
   "Do not keep history without letting people clear it.",
   "Recent searches in the search field are enough."
  ],
  "anatomy": [
   "List — past searches.",
   "Date — when each search ran.",
   "Rerun action — runs the search again.",
   "Clear history — removes all entries."
  ],
  "behavior": [
   "Sort newest first.",
   "Confirm before clearing all."
  ],
  "accessibility": [
   "Use a list or table with headers.",
   "Give rerun and remove actions names that include the query."
  ],
  "content": [
   "Use plain dates.",
   "Label the clear action \"Clear search history\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/table/"
  ],
  "map": []
 },
 "navigation|Filter panel": {
  "text": "A panel of filter controls that narrows a list or table.",
  "purpose": "Lets people narrow large sets by several attributes.",
  "use": [
   "Lists or tables with many attributes.",
   "Pair with a summary of applied filters."
  ],
  "avoid": [
   "One or two filters: use inline controls.",
   "Filters are the main way to use the page: keep the panel open, not hidden."
  ],
  "anatomy": [
   "Panel — side or overlay container.",
   "Filter groups — controls by attribute.",
   "Applied filter tags — removable summary.",
   "Apply and clear actions — commit or reset."
  ],
  "behavior": [
   "Apply right away or with an Apply button, not both.",
   "Show applied filters as removable tags."
  ],
  "accessibility": [
   "Use headings and fieldsets for groups.",
   "Announce result count changes."
  ],
  "content": [
   "Use \"Clear all\" for resetting.",
   "Name filters after the attribute, such as \"Status\" or \"Owner\"."
  ],
  "map": [
   [
    "Carbon",
    "Filtering",
    "Direct"
   ],
   [
    "Polaris",
    "Filters",
    "Direct"
   ]
  ],
  "commonGround": "Carbon and Polaris place filters in a panel and show applied filters as removable tags with a clear all action.",
  "sources": [
   "https://carbondesignsystem.com/patterns/filtering/",
   "https://polaris-react.shopify.com/components/selection-and-input/filters"
  ]
 },
 "navigation|Query builder": {
  "text": "Builds search or filter conditions from fields, operators, and values.",
  "purpose": "Lets advanced users build complex queries without writing syntax.",
  "use": [
   "Advanced search and rules.",
   "Conditions combine with AND and OR."
  ],
  "avoid": [
   "Simple filters: use a filter panel.",
   "People already know a query language: offer a text editor too."
  ],
  "anatomy": [
   "Condition row — field, operator, and value.",
   "Group — joins rows with AND or OR.",
   "Add and remove actions — change rows and groups.",
   "Preview — the matching result count."
  ],
  "behavior": [
   "Change the value control to fit the field type.",
   "Validate each row."
  ],
  "accessibility": [
   "Label each control in a row.",
   "Announce added and removed rows."
  ],
  "content": [
   "Write operators in plain words, such as \"is not\".",
   "Read the query back in a sentence, such as \"Status is Open and Owner is me\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/grid/"
  ],
  "map": []
 },
 "data-display|Resource list": {
  "text": "A vertical list of business objects, each a row with a name, key attributes and actions.",
  "purpose": "Lets people scan, find and act on a set of records when a full table would be more than they need.",
  "use": [
   "Collections where each item has a primary name and a few secondary attributes.",
   "People mostly open an item, not compare values across items."
  ],
  "avoid": [
   "People compare many attributes: use a data grid.",
   "A short set of static facts: use a description list."
  ],
  "anatomy": [
   "Row — one resource, with a clickable primary area.",
   "Media — optional avatar, thumbnail or icon at the start of the row.",
   "Name and attributes — the primary label with one or two lines of secondary text.",
   "Actions — optional row actions and a selection checkbox for bulk work.",
   "List header — optional count, sort and filter controls."
  ],
  "behavior": [
   "Open the resource when the row is selected; keep secondary actions separate from the row click.",
   "Show bulk actions only after one or more rows are selected.",
   "Show a loading state while fetching and an empty state when there are no results."
  ],
  "accessibility": [
   "Use list semantics so screen readers announce the item count and position.",
   "Make each row reachable by Tab or arrow keys, with a visible focus indicator.",
   "Give icon-only row actions an accessible name that includes the item name."
  ],
  "content": [
   "Lead with the most identifying attribute, such as the name.",
   "Keep secondary text to one short line and truncate with a full-text tooltip."
  ],
  "map": [
   [
    "Polaris",
    "Resource list",
    "Direct"
   ],
   [
    "Carbon",
    "Structured list",
    "Partial"
   ],
   [
    "Material 3",
    "Lists",
    "Partial"
   ]
  ],
  "commonGround": "Polaris, Carbon and Material agree on a scannable row with a primary label, supporting text and optional leading media; Polaris adds bulk selection and filtering, and steers complex cases to its index table.",
  "sources": [
   "https://polaris.shopify.com/components/lists/resource-list",
   "https://carbondesignsystem.com/components/structured-list/usage/",
   "https://m3.material.io/components/lists/overview"
  ]
 },
 "data-display|Object list": {
  "text": "Shows each item as a compact object summary with its title, status and a few key values.",
  "purpose": "Gives an overview of business objects with enough detail to triage them without opening each one.",
  "use": [
   "Each item has a status or key figure people need to see at a glance.",
   "Master-detail layouts where selecting an item opens its details beside the list."
  ],
  "avoid": [
   "Columns must align for comparison: use a data grid.",
   "Navigation menus: use a nav pane or menu."
  ],
  "anatomy": [
   "Title — the object name and identifier.",
   "Attributes — two to four key values, aligned in a consistent position on every row.",
   "Status — a status tag or indicator.",
   "Selection and actions — optional checkbox and overflow menu."
  ],
  "behavior": [
   "Keep attribute positions the same on every row so values can be scanned vertically.",
   "Highlight the selected item when the list drives a detail pane.",
   "Support sort and filter when the list can grow beyond one screen."
  ],
  "accessibility": [
   "Use list or listbox semantics that match the interaction model.",
   "Never convey status by color alone; include a text label.",
   "Announce selection changes to screen readers."
  ],
  "content": [
   "Show values in their final format, with units and consistent date formats.",
   "Use the same attribute labels as the object detail page."
  ],
  "map": [
   [
    "Carbon",
    "Structured list",
    "Partial"
   ],
   [
    "Polaris",
    "Resource list",
    "Partial"
   ],
   [
    "Material 3",
    "Lists",
    "Partial"
   ]
  ],
  "commonGround": "The systems agree on a consistent row structure with a title, supporting values and optional status; none names a distinct object list, and SAP Fiori is the main system that defines one.",
  "sources": [
   "https://carbondesignsystem.com/components/structured-list/usage/",
   "https://polaris.shopify.com/components/lists/resource-list",
   "https://m3.material.io/components/lists/overview"
  ]
 },
 "data-display|Virtualized list": {
  "text": "A list that renders only the rows in or near the viewport, so it holds thousands of items without slowing down.",
  "purpose": "Keeps long lists fast and responsive while letting people scroll through the whole set.",
  "use": [
   "A list can hold hundreds or thousands of items and pagination would break the task.",
   "Logs, asset libraries and pickers with very large option sets."
  ],
  "avoid": [
   "Short lists: render them normally.",
   "People need browser find on the full set: use pagination or search."
  ],
  "anatomy": [
   "Scroll container — a fixed-height viewport with its own scroll.",
   "Rendered window — the visible rows plus a small overscan buffer.",
   "Spacer — reserved height that keeps the scrollbar size true to the full list.",
   "Loading row — a placeholder shown while more data loads."
  ],
  "behavior": [
   "Use a fixed or measured row height so the scroll position stays stable.",
   "Keep focus and selection on the item, not the DOM node, when rows are recycled.",
   "Load more data before the end of the list is reached; show a loading row."
  ],
  "accessibility": [
   "Set aria-setsize and aria-posinset so screen readers know the total and each position.",
   "Keep keyboard focus on the active item when it scrolls out and back into view.",
   "Provide search or jump controls so keyboard users can reach distant items."
  ],
  "content": [
   "Show the total item count above the list.",
   "Use the same row content rules as the non-virtualized list."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/feed/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/grid/"
  ],
  "map": []
 },
 "data-display|Timeline": {
  "text": "A vertical list of events in time order, each with a timestamp, a short description and an optional actor.",
  "purpose": "Shows the history of an object or process: what happened, when and by whom.",
  "use": [
   "Activity history, audit trails and comment streams on a record.",
   "The order of events matters more than comparing their attributes."
  ],
  "avoid": [
   "Future steps in a task: use a progress indicator.",
   "Scheduled work across many items: use a Gantt chart."
  ],
  "anatomy": [
   "Track — a vertical line connecting events.",
   "Marker — an icon or dot that shows the event type.",
   "Timestamp — the date and time of the event.",
   "Event body — the description, actor and optional details.",
   "Group header — optional date headings such as Today or a month."
  ],
  "behavior": [
   "Show newest first for activity feeds and oldest first for process histories; keep one order per product.",
   "Collapse long event details and let people expand them.",
   "Load older events on demand."
  ],
  "accessibility": [
   "Use an ordered list so the sequence is announced.",
   "Give event-type icons a text equivalent.",
   "Use a machine-readable time element for timestamps."
  ],
  "content": [
   "Start each event with the actor and a past-tense verb.",
   "Use relative times for recent events and absolute dates for older ones, with the full date on hover."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/feed/"
  ],
  "map": []
 },
 "data-display|Product card": {
  "text": "Presents one product or asset with an image, name, key facts and a primary action.",
  "purpose": "Lets people browse and compare items visually and act on one without opening its page.",
  "use": [
   "Galleries and catalogs where the image helps people recognize the item.",
   "Each card leads to one primary action or to the item page."
  ],
  "avoid": [
   "People compare many attributes: use a table or comparison view.",
   "Do not mix product cards with other card types in one grid."
  ],
  "anatomy": [
   "Media — the image or thumbnail at a fixed aspect ratio.",
   "Title — the product or asset name.",
   "Meta — price, status, type or other key facts.",
   "Actions — one primary action and optional secondary actions.",
   "Container — the card surface with its border or elevation."
  ],
  "behavior": [
   "Make the whole card one click target that opens the item, with separate controls for inner actions.",
   "Keep card height consistent in a row; truncate long text.",
   "Show a placeholder when the image is missing or loading."
  ],
  "accessibility": [
   "Give the image alt text, or mark it decorative when the title already names the item.",
   "Do not nest interactive controls inside a card link; use one main link and separate buttons.",
   "Keep the focus order title, then actions."
  ],
  "content": [
   "Use the product name as the title and keep it to two lines.",
   "Show only the facts people use to choose between items."
  ],
  "map": [
   [
    "Material 3",
    "Cards",
    "Partial"
   ],
   [
    "Carbon",
    "Tile",
    "Partial"
   ],
   [
    "Polaris",
    "Media card",
    "Partial"
   ],
   [
    "Fluent 2",
    "Card",
    "Partial"
   ]
  ],
  "commonGround": "All four systems agree a card groups one subject with media, a title, short supporting text and a limited set of actions; none defines a separate product card, so this is a content pattern on the base card.",
  "sources": [
   "https://m3.material.io/components/cards/overview",
   "https://carbondesignsystem.com/components/tile/usage/",
   "https://polaris.shopify.com/components/layout-and-structure/card",
   "https://fluent2.microsoft.design/components/web/react/core/card/usage"
  ]
 },
 "data-display|Profile card": {
  "text": "Summarizes one person with their avatar, name, role and ways to contact or view them.",
  "purpose": "Gives quick context about a person where their name appears, without leaving the current task.",
  "use": [
   "Hover or click on a person name or avatar, to show details.",
   "People directories and team pages."
  ],
  "avoid": [
   "Teams or organizations: adapt the fields first.",
   "Do not show private details that the viewer is not allowed to see."
  ],
  "anatomy": [
   "Avatar — the photo or initials.",
   "Name and title — the full name with job title or role.",
   "Details — team, location, local time or status.",
   "Actions — view profile, message or other contact actions."
  ],
  "behavior": [
   "When shown on hover, open after a short delay and stay open while the pointer is over the card.",
   "Also open on keyboard focus or click, so it is not hover-only.",
   "Show a loading state while details load."
  ],
  "accessibility": [
   "Make the trigger focusable and open the card with Enter or Space.",
   "Close with Escape and return focus to the trigger.",
   "Give the avatar alt text that is the person name, or leave it empty when the name is next to it."
  ],
  "content": [
   "Show the display name the person chose.",
   "Use short labels such as Message and View profile for actions."
  ],
  "map": [
   [
    "Atlassian",
    "Profile card",
    "Direct"
   ],
   [
    "Fluent 2",
    "Persona",
    "Partial"
   ],
   [
    "Material 3",
    "Cards",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian defines a profile card triggered from a name or avatar, and Fluent pairs avatar, name and secondary text in its persona; both agree on avatar plus name plus role as the core.",
  "sources": [
   "https://atlassian.design/components/avatar",
   "https://fluent2.microsoft.design/components/web/react/core/card/usage",
   "https://m3.material.io/components/cards/overview"
  ]
 },
 "data-display|Metric card": {
  "text": "Shows one key number with its label, comparison and optional trend.",
  "purpose": "Lets people read the current state of an important measure at a glance, usually on a dashboard.",
  "use": [
   "A small set of key performance numbers at the top of a dashboard or overview.",
   "The number itself matters more than its shape over time."
  ],
  "avoid": [
   "More than about six numbers in one row: group them or use a table.",
   "The trend is the message: use a line chart."
  ],
  "anatomy": [
   "Label — the name of the measure.",
   "Value — the main number with its unit.",
   "Comparison — change versus a previous period or target, with direction.",
   "Trend — an optional sparkline.",
   "Footer — optional time range or link to details."
  ],
  "behavior": [
   "Use the same time range for every card in a group and state it.",
   "Link the card to a detailed view when one exists.",
   "Show a placeholder dash for missing data, not zero."
  ],
  "accessibility": [
   "Announce the label, value and change together as one readable string.",
   "Do not show increase or decrease by color alone; include an arrow and a sign.",
   "Give the sparkline a text summary or hide it from assistive technology when the comparison text says the same."
  ],
  "content": [
   "Abbreviate large numbers consistently, such as 1.2M, and show the full value on hover.",
   "Say whether a change is good or bad only when that is clear for this measure."
  ],
  "map": [
   [
    "Carbon",
    "Tile",
    "Partial"
   ],
   [
    "Spectrum",
    "Big number",
    "Partial"
   ]
  ],
  "commonGround": "Carbon dashboard guidance and Spectrum charts both treat a single headline number with label and comparison as a building block of dashboards; neither defines a full card component.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/dashboards",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro",
   "https://carbondesignsystem.com/components/tile/usage/"
  ]
 },
 "data-display|Feature card": {
  "text": "Introduces one feature, task or destination with an icon or image, a heading, a short description and an action.",
  "purpose": "Helps people discover what they can do next, such as on a home page or onboarding screen.",
  "use": [
   "Landing, home or empty-state pages that point to key tasks or features.",
   "A grid of two to six cards of equal weight."
  ],
  "avoid": [
   "Urgent messages: use a banner or notification.",
   "Data records: use a list or table."
  ],
  "anatomy": [
   "Media — an icon, pictogram or illustration.",
   "Heading — the feature or task name.",
   "Description — one or two sentences on the benefit.",
   "Action — a link or button, or the whole card as a link."
  ],
  "behavior": [
   "Make the whole card clickable when it has one destination.",
   "Let people dismiss promotional cards and remember the choice.",
   "Keep cards in a set the same size."
  ],
  "accessibility": [
   "Use a heading element for the card title so cards can be navigated by heading.",
   "Mark decorative pictograms as hidden from screen readers.",
   "Make the link text describe the destination, not just Learn more."
  ],
  "content": [
   "Start the heading with a verb when the card leads to a task.",
   "Keep the description to two short sentences."
  ],
  "map": [
   [
    "Carbon",
    "Tile",
    "Partial"
   ],
   [
    "Material 3",
    "Cards",
    "Partial"
   ],
   [
    "Polaris",
    "Callout card",
    "Partial"
   ],
   [
    "Fluent 2",
    "Card",
    "Partial"
   ]
  ],
  "commonGround": "The systems agree on a clickable card or tile with a heading, short text and one clear action; Carbon uses clickable tiles and Polaris uses callout cards for this role.",
  "sources": [
   "https://carbondesignsystem.com/components/tile/usage/",
   "https://m3.material.io/components/cards/overview",
   "https://polaris.shopify.com/components/layout-and-structure/card",
   "https://fluent2.microsoft.design/components/web/react/core/card/usage"
  ]
 },
 "data-display|Expandable card": {
  "text": "A card that shows a summary by default and expands in place to reveal more content.",
  "purpose": "Keeps a page short while people open details only for the items they care about.",
  "use": [
   "Each card has optional detail that most people do not need.",
   "People benefit from comparing a summary and its detail in context."
  ],
  "avoid": [
   "Do not hide information people need for every decision; show it in the summary.",
   "Long, structured content: use a detail page or side panel."
  ],
  "anatomy": [
   "Summary — the always-visible title and key content.",
   "Toggle — a chevron button that expands or collapses.",
   "Expanded region — the extra content.",
   "Container — the card surface that grows in height."
  ],
  "behavior": [
   "Expand in place and push content below down; do not overlay.",
   "Keep the summary visible when expanded.",
   "Let each card expand independently unless the layout needs only one open at a time."
  ],
  "accessibility": [
   "Use a button with aria-expanded and aria-controls for the toggle.",
   "Move no focus on expand; keep it on the toggle.",
   "Make the toggle target at least 24 by 24 pixels."
  ],
  "content": [
   "Make the summary self-sufficient so the card is useful collapsed.",
   "Use Show more and Show less only when the chevron alone is unclear."
  ],
  "map": [
   [
    "Carbon",
    "Expandable tile",
    "Variant"
   ],
   [
    "Polaris",
    "Collapsible",
    "Partial"
   ],
   [
    "Material 3",
    "Cards",
    "Partial"
   ]
  ],
  "commonGround": "Carbon defines an expandable tile and Polaris a collapsible region; both agree on a visible summary, a clear toggle and in-place expansion.",
  "sources": [
   "https://carbondesignsystem.com/components/tile/usage/",
   "https://m3.material.io/components/cards/overview",
   "https://polaris.shopify.com/components/layout-and-structure/card"
  ]
 },
 "data-display|Filterable table": {
  "text": "A table with search and filter controls that narrow the visible rows.",
  "purpose": "Helps people find the records they need in a large set without scrolling through all of it.",
  "use": [
   "A table has more rows than people can scan, and they look for subsets.",
   "People return to the same subsets often; add saved views."
  ],
  "avoid": [
   "Do not add filters to short tables; let people scan or sort instead.",
   "Do not filter on every column; pick the attributes people actually filter by."
  ],
  "anatomy": [
   "Search field — free-text search across key columns.",
   "Filter controls — filter buttons, menus or a filter panel.",
   "Applied filters — removable tags showing the active filters.",
   "Result count — the number of matching rows.",
   "Clear all — a control to remove every filter."
  ],
  "behavior": [
   "Apply filters right away for quick filters, or with an Apply button in a filter panel.",
   "Show active filters as tags and keep them when people return to the page.",
   "Show an empty state with a way to clear filters when nothing matches."
  ],
  "accessibility": [
   "Label every filter control.",
   "Announce the updated result count with a polite live region.",
   "Keep focus on the filter control after applying, not on the table."
  ],
  "content": [
   "Use the column name as the filter label.",
   "Write the empty state as what happened and how to fix it, such as No results. Try fewer filters."
  ],
  "map": [
   [
    "Carbon",
    "Data grid (toolbar and filtering)",
    "Variant"
   ],
   [
    "Polaris",
    "Index filters",
    "Partial"
   ],
   [
    "Atlassian",
    "Dynamic table",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Polaris agree on a toolbar with search, filter controls and visible, removable applied filters; Atlassian leaves filtering to the page around the table.",
  "sources": [
   "https://carbondesignsystem.com/components/data-grid/usage/",
   "https://polaris.shopify.com/components/tables/index-table",
   "https://atlassian.design/components/dynamic-table"
  ]
 },
 "data-display|Expandable table": {
  "text": "A table whose rows expand to show extra detail beneath them.",
  "purpose": "Keeps the table compact while giving per-row detail without leaving the page.",
  "use": [
   "Each row has detail that does not fit in columns, such as a description or a sub-table.",
   "People check detail for a few rows, not all of them."
  ],
  "avoid": [
   "Parent-child records of the same type: use a tree table.",
   "Do not hide data people need to compare; make it a column."
  ],
  "anatomy": [
   "Expand toggle — a chevron button at the start of the row.",
   "Parent row — the normal row content.",
   "Expanded region — a full-width area below the row.",
   "Expand all — optional header toggle."
  ],
  "behavior": [
   "Expand in place and keep the parent row visible.",
   "Keep the expanded state while sorting or paging when possible.",
   "Let several rows be open at once unless detail is heavy."
  ],
  "accessibility": [
   "Use a button with aria-expanded on each toggle.",
   "Associate the expanded region with its row so screen readers read it in context.",
   "Keep keyboard focus on the toggle after expanding."
  ],
  "content": [
   "Label the toggle with the row name, such as Expand order 1042.",
   "Put only supporting detail in the expanded region."
  ],
  "map": [
   [
    "Carbon",
    "Data grid (expandable)",
    "Variant"
   ],
   [
    "Atlassian",
    "Table tree",
    "Partial"
   ],
   [
    "Fluent 2",
    "Table",
    "Partial"
   ]
  ],
  "commonGround": "Carbon defines expandable rows with a chevron at the row start, and Atlassian uses the same toggle for nested rows; both agree the toggle is a separate control from the row click.",
  "sources": [
   "https://carbondesignsystem.com/components/data-grid/usage/",
   "https://atlassian.design/components/table-tree",
   "https://fluent2.microsoft.design/components/web/react/core/table/usage"
  ]
 },
 "data-display|Editable table": {
  "text": "A table where people change cell values in place.",
  "purpose": "Speeds up bulk data entry and correction without a form for every record.",
  "use": [
   "People edit many records with the same few fields.",
   "Values are simple, such as text, numbers, dates or a choice."
  ],
  "avoid": [
   "Records with complex validation or many fields: use a form or side panel.",
   "Edits need approval before saving: use an explicit edit mode."
  ],
  "anatomy": [
   "Cell — shows the value and turns into an input when edited.",
   "Edit affordance — a hover pencil or cell focus that signals editability.",
   "Validation message — inline error for the cell.",
   "Save state — a save and cancel control, or an autosave status."
  ],
  "behavior": [
   "Enter edit mode with Enter, F2 or a double click, and leave with Escape to cancel or Enter to commit.",
   "Validate on commit and keep the invalid value with an error so it can be fixed.",
   "Mark changed cells until they are saved."
  ],
  "accessibility": [
   "Follow the ARIA grid pattern for moving between navigation and edit modes.",
   "Show invalid cells with a border color change and an error message, not color alone.",
   "Give each input an accessible name made of row and column headers."
  ],
  "content": [
   "Write error messages that say what to enter, such as Enter a number from 1 to 100.",
   "Use the column header as the field label."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/grid/"
  ],
  "map": []
 },
 "data-display|Grouped table": {
  "text": "A table whose rows sit under group header rows that share a value.",
  "purpose": "Helps people see how records break down by a category and act on whole groups.",
  "use": [
   "Rows naturally fall into categories, such as status, owner or date.",
   "Group subtotals help the task."
  ],
  "avoid": [
   "Groups with only one or two rows each: use a sortable column.",
   "More than two levels of grouping: use a tree table."
  ],
  "anatomy": [
   "Group header row — the group value, row count and optional subtotal.",
   "Collapse toggle — optional control to hide a group.",
   "Member rows — the rows in the group.",
   "Group selection — optional checkbox that selects all rows in the group."
  ],
  "behavior": [
   "Sort within groups, and keep groups in a meaningful order.",
   "Let people collapse groups when they are long.",
   "Keep the group header visible while scrolling through its rows."
  ],
  "accessibility": [
   "Mark group header cells as row headers with a scope that covers the group.",
   "Announce the row count of each group.",
   "Use aria-expanded on collapse toggles."
  ],
  "content": [
   "Show the group value and count, such as In review (12).",
   "Use the same value labels as the column the table is grouped by."
  ],
  "map": [
   [
    "Polaris",
    "Index table (row groups)",
    "Variant"
   ]
  ],
  "commonGround": "Only Polaris defines grouped rows under subheaders; Carbon and Atlassian do not, so the rest of this guidance follows general table practice.",
  "sources": [
   "https://polaris.shopify.com/components/tables/index-table",
   "https://carbondesignsystem.com/components/data-grid/usage/"
  ]
 },
 "data-display|Tree table": {
  "text": "A table whose rows form a hierarchy; parent rows expand to show child rows in the same columns.",
  "purpose": "Shows hierarchical records, such as folders or org units, while keeping their attributes in aligned columns.",
  "use": [
   "Records nest inside records of the same kind and share the same columns.",
   "People need both the hierarchy and column comparison."
  ],
  "avoid": [
   "Only the hierarchy matters: use a tree view.",
   "Extra detail about one row: use an expandable table."
  ],
  "anatomy": [
   "First column — indented by level, with an expand toggle on parents.",
   "Expand toggle — a chevron on rows with children.",
   "Child rows — rows indented one level under the parent.",
   "Columns — the same attributes for every level."
  ],
  "behavior": [
   "Indent each level by a fixed step and keep other columns aligned.",
   "Load children on demand for large trees and show a loading row.",
   "Sort children within their parent, not across the whole table."
  ],
  "accessibility": [
   "Use the ARIA treegrid pattern with aria-level, aria-expanded, aria-setsize and aria-posinset.",
   "Use Right arrow to expand and Left arrow to collapse or move to the parent.",
   "Do not rely on indent alone; expose the level to assistive technology."
  ],
  "content": [
   "Use the item name in the first column so the hierarchy reads clearly.",
   "Show child counts on collapsed parents when useful."
  ],
  "map": [
   [
    "Atlassian",
    "Table tree",
    "Direct"
   ],
   [
    "Fluent 2",
    "Tree",
    "Partial"
   ],
   [
    "Carbon",
    "Data grid (expandable)",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian defines a table tree and Fluent a tree; both use indentation by level, a chevron toggle and arrow-key navigation following the ARIA treegrid or tree pattern.",
  "sources": [
   "https://atlassian.design/components/table-tree",
   "https://fluent2.microsoft.design/components/web/react/core/tree/usage",
   "https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/"
  ]
 },
 "data-display|Virtualized table": {
  "text": "A table that renders only the rows and columns in or near the viewport, so it shows very large data sets smoothly.",
  "purpose": "Keeps large tables fast to scroll and interact with while preserving the full data set.",
  "use": [
   "A table can hold thousands of rows and pagination would break the task.",
   "Many columns make the table wide and heavy to render."
  ],
  "avoid": [
   "Tables that fit in a few screens: use pagination or render all rows.",
   "Variable-height rows: only when rows can be measured reliably."
  ],
  "anatomy": [
   "Fixed header — the header row stays in place.",
   "Scroll viewport — the body with its own scroll.",
   "Rendered rows — visible rows plus an overscan buffer.",
   "Spacers — reserved space that keeps scrollbars true to the full size."
  ],
  "behavior": [
   "Use fixed row heights per density so scrolling stays stable.",
   "Keep selection, focus and edits tied to row data, not rendered elements.",
   "Fetch data in pages ahead of the scroll position and show loading rows."
  ],
  "accessibility": [
   "Set aria-rowcount and aria-rowindex so screen readers know the true size and position.",
   "Keep keyboard focus on the active cell as rows recycle.",
   "Provide search and jump-to controls for long distances."
  ],
  "content": [
   "Show the total row count.",
   "Follow the same header and cell rules as the data grid."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/grid/",
   "https://fluent2.microsoft.design/components/web/react/core/table/usage"
  ],
  "map": []
 },
 "data-display|Comparison table": {
  "text": "Places a few items side by side as columns, with the attributes to compare as rows.",
  "purpose": "Helps people choose between options by lining up the same attributes for each.",
  "use": [
   "Comparing two to five plans, products, versions or assets.",
   "The same attributes apply to every option."
  ],
  "avoid": [
   "Many items: use a sortable data grid.",
   "Attributes differ by item: use cards."
  ],
  "anatomy": [
   "Item header — each column header names one item, with an optional image and action.",
   "Attribute labels — the first column lists what is compared.",
   "Value cells — each value, including checks for included features.",
   "Section rows — optional groups of related attributes."
  ],
  "behavior": [
   "Keep item headers fixed while scrolling down.",
   "Offer a way to highlight differences or hide identical rows.",
   "Let people add or remove items from the comparison."
  ],
  "accessibility": [
   "Mark item headers as column headers and attribute labels as row headers.",
   "Give check and cross icons a text equivalent such as Included.",
   "Keep the table readable when it scrolls horizontally on small screens."
  ],
  "content": [
   "Use the same units and formats in every column.",
   "Use a dash for not applicable, and explain it once."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://carbondesignsystem.com/components/data-grid/usage/",
   "https://atlassian.design/components/table"
  ],
  "map": []
 },
 "data-display|Chart foundations": {
  "text": "The shared rules for every Plenix chart: choosing the chart type, color, scale, layout and text.",
  "purpose": "Makes charts accurate, readable and consistent, so people can trust and compare them.",
  "use": [
   "The shape of the data, such as trend, distribution or share, matters more than exact values.",
   "Pick the chart type by the question: trend, comparison, part-to-whole, distribution or relationship."
  ],
  "avoid": [
   "One or two numbers: use a metric card.",
   "Do not use 3D, decorative effects or dual meanings of color."
  ],
  "anatomy": [
   "Title and summary — what the chart shows and its main point.",
   "Plot area — the marks, axes and grid lines.",
   "Legend or direct labels — what each color or mark means.",
   "Data source and time range — where the data comes from."
  ],
  "behavior": [
   "Use the categorical palette in a fixed order, and the same color for the same series across charts.",
   "Start bar and area value axes at zero; line and scatter axes may start elsewhere.",
   "Do not interpolate across missing data; show the gap."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms.",
   "Format numbers to the precision people need, with consistent units."
  ],
  "map": [
   [
    "Carbon",
    "Data visualization",
    "Direct"
   ],
   [
    "Fluent 2",
    "Charts",
    "Direct"
   ],
   [
    "Spectrum",
    "Data visualization",
    "Direct"
   ],
   [
    "Polaris",
    "Data visualization",
    "Direct"
   ]
  ],
  "commonGround": "Carbon, Fluent, Spectrum and Polaris agree on choosing charts by the question asked, a fixed categorical palette, zero baselines for bars, direct labels where possible and never color alone.",
  "sources": [
   "https://carbondesignsystem.com/data-visualization/getting-started/",
   "https://carbondesignsystem.com/data-visualization/chart-types/",
   "https://carbondesignsystem.com/building-blocks/data-visualization/axes-and-labels",
   "https://carbondesignsystem.com/building-blocks/data-visualization/color-palettes",
   "https://fluent2.microsoft.design/charts",
   "https://polaris.shopify.com/design/data-visualization"
  ]
 },
 "data-display|Chart legend": {
  "text": "A key that names each series or category in a chart and shows its color or mark.",
  "purpose": "Tells people which mark belongs to which series when marks cannot be labeled directly.",
  "use": [
   "Two or more series, and direct labels do not fit.",
   "Color scales in heat maps and choropleth maps."
  ],
  "avoid": [
   "A single series: no legend.",
   "Direct labels fit: label the marks instead."
  ],
  "anatomy": [
   "Swatch — the color, shape or pattern of the series.",
   "Label — the series name.",
   "Value — optional current or total value.",
   "Overflow control — a View more control when items do not fit."
  ],
  "behavior": [
   "Place the legend below the chart by default, or above it under the title in tight dashboard layouts.",
   "On hover, emphasize that series and dim the others.",
   "On click, show or hide the series; never let people hide all series.",
   "Keep legend order the same as the stacking or line order."
  ],
  "accessibility": [
   "Make legend items buttons with a pressed state when they toggle series.",
   "Pair swatches with shapes or patterns when colors are close.",
   "Keep swatches at 3:1 contrast against the background."
  ],
  "content": [
   "Use plain series names without acronyms.",
   "Keep labels short and truncate with a full-text tooltip."
  ],
  "map": [
   [
    "Carbon",
    "Legends",
    "Direct"
   ],
   [
    "Fluent 2",
    "Legends",
    "Direct"
   ],
   [
    "Spectrum",
    "Legend",
    "Direct"
   ],
   [
    "Polaris",
    "Legend",
    "Direct"
   ]
  ],
  "commonGround": "The systems agree to prefer direct labels, omit the legend for one series, and let legend items highlight or toggle series; Carbon puts the legend at the bottom by default.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/legends",
   "https://fluent2.microsoft.design/charts",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro",
   "https://polaris.shopify.com/design/data-visualization"
  ]
 },
 "data-display|Chart tooltip": {
  "text": "A small overlay showing exact values for the data point or position under the pointer or focus.",
  "purpose": "Gives precise values on demand without cluttering the chart with labels.",
  "use": [
   "Every interactive chart, to show exact values.",
   "Multi-series line and area charts: a shared tooltip listing all series at one x position."
  ],
  "avoid": [
   "Essential information: show it in the chart or summary, not only in tooltips.",
   "Do not put actions or links inside a chart tooltip."
  ],
  "anatomy": [
   "Header — the category or x value, such as the date.",
   "Rows — swatch, series name and value for each item.",
   "Total — optional total for stacked charts.",
   "Pointer line — optional vertical guide at the hovered position."
  ],
  "behavior": [
   "Show on hover and on keyboard focus of a data point; hide on pointer leave, blur or Escape.",
   "Position near the point and flip to stay inside the chart.",
   "Follow the pointer smoothly without hiding the hovered mark."
  ],
  "accessibility": [
   "Make data points reachable by keyboard so the tooltip is not hover-only.",
   "Expose the same values in an accessible data grid.",
   "Keep tooltip text at 4.5:1 contrast."
  ],
  "content": [
   "Use the same number formatting as the axis, with full precision.",
   "List series in the same order as the legend."
  ],
  "map": [
   [
    "Carbon",
    "Tooltip (charts)",
    "Direct"
   ],
   [
    "Fluent 2",
    "Charts callout",
    "Direct"
   ],
   [
    "Spectrum",
    "Chart tooltip",
    "Direct"
   ],
   [
    "Polaris",
    "Tooltip (viz)",
    "Direct"
   ]
  ],
  "commonGround": "All four chart libraries show a hover tooltip with the category header and a swatch-label-value row per series, and agree it is supplementary, not the only place for data.",
  "sources": [
   "https://charts.carbondesignsystem.com/",
   "https://carbondesignsystem.com/components/tooltip/usage/",
   "https://fluent2.microsoft.design/charts",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro"
  ]
 },
 "data-display|Data label": {
  "text": "A value or name printed directly on or next to a chart mark.",
  "purpose": "Shows exact values or series names without a legend or tooltip.",
  "use": [
   "Bar, column and donut charts with few marks, where exact values matter.",
   "Line ends, to name series instead of a legend."
  ],
  "avoid": [
   "Dense line or scatter charts: use a tooltip, not a label on every point.",
   "Do not let labels overlap; drop or move them."
  ],
  "anatomy": [
   "Value text — the formatted number.",
   "Position — inside the end of a bar, outside it, or at a line end.",
   "Leader line — optional line to a label placed away from a small slice."
  ],
  "behavior": [
   "Place labels outside the bar end by default; inside only when they fit with enough contrast.",
   "Hide labels that collide and keep the most important ones.",
   "Update labels when data changes or series are hidden."
  ],
  "accessibility": [
   "Keep label text at 4.5:1 contrast against what is behind it.",
   "Do not make labels the only source of values; keep the data grid."
  ],
  "content": [
   "Use the same format and precision as the axis.",
   "Abbreviate large numbers consistently, such as 12K."
  ],
  "map": [
   [
    "Carbon",
    "Axes and labels",
    "Partial"
   ],
   [
    "Spectrum",
    "Data label",
    "Partial"
   ],
   [
    "Fluent 2",
    "Charts",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Spectrum agree that direct labels beat legends when they fit, and that labels must not overlap or clutter the plot.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/axes-and-labels",
   "https://carbondesignsystem.com/building-blocks/data-visualization/legends",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro",
   "https://fluent2.microsoft.design/charts"
  ]
 },
 "data-display|Axis": {
  "text": "The scale along a chart edge that maps values or categories to position, with tick labels and a title.",
  "purpose": "Lets people read the size, time or category of each mark.",
  "use": [
   "All cartesian charts: line, area, bar, column, scatter, histogram and box plot.",
   "A time axis for time series; a category axis for discrete groups."
  ],
  "avoid": [
   "Pie, donut, treemap or sparkline: show no axes.",
   "Two value axes only when the series have different units; prefer two charts."
  ],
  "anatomy": [
   "Axis line — the baseline of the scale.",
   "Ticks — marks at regular steps.",
   "Tick labels — the values or categories.",
   "Axis title — the measure and unit."
  ],
  "behavior": [
   "Start value axes at zero for bars and areas; line and scatter may start elsewhere.",
   "Use even tick steps and never change steps to fit the data; show compression with an axis break.",
   "Mark the start of a new day, month or year in bold on time axes."
  ],
  "accessibility": [
   "Keep tick labels at 4.5:1 contrast and at least 12 pixels.",
   "Do not rotate labels more than 45 degrees; shorten or wrap them instead."
  ],
  "content": [
   "Write the axis title as the measure with its unit, such as Revenue (USD).",
   "Use localized date and number formats."
  ],
  "map": [
   [
    "Carbon",
    "Axes and labels",
    "Direct"
   ],
   [
    "Spectrum",
    "Axis",
    "Direct"
   ],
   [
    "Fluent 2",
    "Charts axis",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Spectrum agree on zero baselines for bars, even tick steps, clear unit labels and no acronyms; Carbon adds explicit axis-break styling.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/axes-and-labels",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro",
   "https://fluent2.microsoft.design/charts"
  ]
 },
 "data-display|Grid line": {
  "text": "A faint line across the plot area at each major tick that helps people read values.",
  "purpose": "Helps people line up marks with axis values without pulling attention from the data.",
  "use": [
   "Horizontal grid lines on column and line charts; vertical grid lines on bar charts.",
   "Both directions on scatter plots, when precise reading matters."
  ],
  "avoid": [
   "Do not use heavy or dark grid lines that compete with data.",
   "Do not use grid lines on sparklines, pie or donut charts."
  ],
  "anatomy": [
   "Major grid lines — at labeled ticks.",
   "Baseline — a stronger line at zero.",
   "Minor grid lines — optional, only for precise reading."
  ],
  "behavior": [
   "Draw grid lines behind marks.",
   "Keep them in a soft neutral token, lighter than axis lines.",
   "Match the grid to the tick steps of the value axis."
  ],
  "accessibility": [
   "Grid lines are decorative; hide them from assistive technology.",
   "Do not depend on grid lines to convey meaning; use reference lines for that."
  ],
  "content": [
   "Grid lines carry no text; the axis labels them.",
   "Do not add a legend entry for grid lines."
  ],
  "map": [
   [
    "Carbon",
    "Grid (charts)",
    "Partial"
   ],
   [
    "Spectrum",
    "Axis grid",
    "Partial"
   ],
   [
    "Fluent 2",
    "Charts",
    "Partial"
   ]
  ],
  "commonGround": "Carbon Charts and Spectrum both draw light grid lines on the value axis behind the data and keep them subdued; neither treats them as a separate component.",
  "sources": [
   "https://charts.carbondesignsystem.com/",
   "https://carbondesignsystem.com/building-blocks/data-visualization/axes-and-labels",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro"
  ]
 },
 "data-display|Threshold": {
  "text": "A line or band across a chart that marks a limit, such as a target, budget or alert level, and shows which values cross it.",
  "purpose": "Shows at a glance whether values are within or beyond an important limit.",
  "use": [
   "Service levels, budgets, quotas and alert limits.",
   "A limit that is a range: use a band."
  ],
  "avoid": [
   "Neutral context such as an average: use a reference line.",
   "Do not add more than two or three thresholds to one chart."
  ],
  "anatomy": [
   "Threshold line — a dashed line at the limit value.",
   "Label — the limit name and value.",
   "Band — optional shaded range.",
   "Crossing emphasis — optional status color on marks beyond the limit."
  ],
  "behavior": [
   "Draw the threshold above grid lines and below data marks.",
   "Keep the threshold in the axis range even when data does not reach it.",
   "Show the threshold value in tooltips near it."
  ],
  "accessibility": [
   "Label the line with text; do not rely on its color.",
   "State in the chart summary how many values cross the threshold."
  ],
  "content": [
   "Name the limit by its meaning, such as SLA 99.9% or Budget.",
   "Show the limit value with the same unit and format as the axis."
  ],
  "map": [
   [
    "Carbon",
    "Thresholds (charts)",
    "Direct"
   ],
   [
    "Spectrum",
    "Reference line",
    "Partial"
   ]
  ],
  "commonGround": "Carbon Charts defines thresholds as labeled dashed lines with optional status color, and Spectrum uses reference lines for the same role; both require a text label.",
  "sources": [
   "https://charts.carbondesignsystem.com/",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro"
  ]
 },
 "data-display|Reference line": {
  "text": "A labeled line across a chart at a meaningful value, such as an average, a previous period or an event date.",
  "purpose": "Gives context for reading the data without implying a pass or fail limit.",
  "use": [
   "Averages, medians, prior-period values or a key date.",
   "An event on a time axis: use a vertical reference line."
  ],
  "avoid": [
   "Limits that trigger action: use a threshold.",
   "More than two reference lines in one chart."
  ],
  "anatomy": [
   "Line — a thin neutral line, solid or dashed.",
   "Label — the name and value at the line end."
  ],
  "behavior": [
   "Draw reference lines behind data marks and above grid lines.",
   "Keep the label clear of data marks.",
   "Recompute derived lines, such as averages, when filters change."
  ],
  "accessibility": [
   "Label the line in text.",
   "Mention the reference value in the chart summary."
  ],
  "content": [
   "Name the reference plainly, such as Average 42 or Release 3.2.",
   "Say how a derived value is calculated, such as 30-day average."
  ],
  "map": [
   [
    "Spectrum",
    "Reference line",
    "Direct"
   ],
   [
    "Carbon",
    "Thresholds (charts)",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum defines reference lines and Carbon reuses its threshold line for this; both use a thin labeled line that adds context without dominating the data.",
  "sources": [
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro",
   "https://charts.carbondesignsystem.com/"
  ]
 },
 "data-display|Annotation": {
  "text": "A short note attached to a point or range on a chart, explaining what happened there.",
  "purpose": "Explains spikes, dips and events so people do not have to guess the cause.",
  "use": [
   "Explaining outliers, outages, launches or data changes.",
   "Reports and dashboards that others read without the author."
  ],
  "avoid": [
   "Do not annotate every point; pick the two or three that matter.",
   "Values: use data labels or tooltips."
  ],
  "anatomy": [
   "Marker — a dot, line or band at the annotated point or range.",
   "Note — the short text.",
   "Connector — optional line from note to marker."
  ],
  "behavior": [
   "Place notes where they do not cover data; collapse them into markers when space is tight.",
   "Show the full note on hover or focus of a collapsed marker.",
   "Keep annotations tied to data values so they move with zoom and resize."
  ],
  "accessibility": [
   "Make collapsed markers focusable and reveal the note on focus.",
   "Include annotations in the text summary or data grid."
  ],
  "content": [
   "Write one short sentence that names the cause, such as Outage in EU region.",
   "Add the date of the event when the axis does not make it clear."
  ],
  "map": [
   [
    "Spectrum",
    "Annotation",
    "Partial"
   ]
  ],
  "commonGround": "Only Spectrum offers chart annotations; the rest of this guidance follows general data-visualization practice.",
  "sources": [
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro",
   "https://www.w3.org/WAI/tutorials/images/complex/"
  ]
 },
 "data-display|Line chart": {
  "text": "Connects data points with lines to show how values change over a continuous range, usually time.",
  "purpose": "Shows trends, rates of change and patterns over time for one or more series.",
  "use": [
   "Change over time or another continuous measure.",
   "Comparing the trends of up to about five series."
  ],
  "avoid": [
   "Unordered categories: use a bar or column chart.",
   "More than about five series: use small multiples."
  ],
  "anatomy": [
   "Lines — one per series.",
   "Points — optional markers at data values.",
   "Axes and grid lines — time on x, value on y.",
   "Legend or end labels — series names."
  ],
  "behavior": [
   "Do not connect across missing data; show a gap.",
   "Show a shared tooltip with all series at the hovered position.",
   "Let the y axis start above zero when the trend matters, and say so."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Line",
    "Direct"
   ],
   [
    "Fluent 2",
    "Line chart",
    "Direct"
   ],
   [
    "Spectrum",
    "Line chart",
    "Direct"
   ],
   [
    "Polaris",
    "Line chart",
    "Direct"
   ]
  ],
  "commonGround": "All four systems use line charts for trends over time, limit the number of series, and allow a non-zero y axis; Carbon forbids interpolating across gaps.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/simple-charts",
   "https://carbondesignsystem.com/building-blocks/data-visualization/axes-and-labels",
   "https://fluent2.microsoft.design/charts",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro",
   "https://polaris.shopify.com/design/data-visualization"
  ]
 },
 "data-display|Area chart": {
  "text": "A line chart with the area below the line filled, showing volume over time.",
  "purpose": "Emphasizes the size of a total over time, not just its trend.",
  "use": [
   "A volume or total over time.",
   "Stacked form: how parts add up to a total over time."
  ],
  "avoid": [
   "More than two unstacked series overlap: use a line chart.",
   "Exact comparison of the inner stacked series matters: use lines."
  ],
  "anatomy": [
   "Area — the filled region under each line.",
   "Line — the top edge of each area.",
   "Axes — with a value axis that starts at zero.",
   "Legend — series names in stack order."
  ],
  "behavior": [
   "Start the value axis at zero.",
   "Use semi-transparent fill for overlapping areas and solid fill for stacked areas.",
   "Stack the most stable series at the bottom."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Area (simple)",
    "Direct"
   ],
   [
    "Carbon",
    "Area (stacked)",
    "Variant"
   ],
   [
    "Fluent 2",
    "Area chart",
    "Direct"
   ],
   [
    "Spectrum",
    "Area chart",
    "Direct"
   ],
   [
    "Polaris",
    "Stacked area chart",
    "Variant"
   ]
  ],
  "commonGround": "The systems agree: area charts show volume over time, need a zero baseline and work best stacked or with few series.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/simple-charts",
   "https://carbondesignsystem.com/building-blocks/data-visualization/axes-and-labels",
   "https://fluent2.microsoft.design/charts",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro"
  ]
 },
 "data-display|Bar chart": {
  "text": "Horizontal bars whose lengths compare values across categories.",
  "purpose": "Makes it easy to compare and rank categories, especially with long names.",
  "use": [
   "Comparing values across categories, especially with long labels.",
   "Ranking items from largest to smallest."
  ],
  "avoid": [
   "Continuous time: use a column or line chart.",
   "Parts of a whole with many parts: use a stacked bar or treemap."
  ],
  "anatomy": [
   "Bars — one per category.",
   "Category axis — labels on the left.",
   "Value axis — at the bottom, starting at zero.",
   "Data labels — optional values at bar ends."
  ],
  "behavior": [
   "Start the value axis at zero and never truncate it.",
   "Sort bars by value unless the categories have a natural order.",
   "Keep a consistent gap between bars."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Bar (simple)",
    "Direct"
   ],
   [
    "Fluent 2",
    "Horizontal bar chart",
    "Direct"
   ],
   [
    "Spectrum",
    "Bar chart",
    "Direct"
   ],
   [
    "Polaris",
    "Bar chart",
    "Direct"
   ]
  ],
  "commonGround": "All four systems agree on a zero baseline, sorted bars and horizontal orientation for long category names; Carbon and Spectrum treat horizontal and vertical as one chart with an orientation option.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/simple-charts",
   "https://carbondesignsystem.com/building-blocks/data-visualization/axes-and-labels",
   "https://fluent2.microsoft.design/charts",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro"
  ]
 },
 "data-display|Column chart": {
  "text": "Vertical bars whose heights compare values across categories or time periods.",
  "purpose": "Compares values across a small number of categories or discrete time periods.",
  "use": [
   "Comparing values across discrete periods, such as months.",
   "Short category labels."
  ],
  "avoid": [
   "Long category labels: use a bar chart.",
   "Many periods: use a line chart."
  ],
  "anatomy": [
   "Columns — one per category or period.",
   "Category axis — at the bottom.",
   "Value axis — at the left, starting at zero.",
   "Grid lines — horizontal."
  ],
  "behavior": [
   "Start the value axis at zero.",
   "Order time periods left to right in time order.",
   "Use grouped columns for up to three series per category."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Bar (simple)",
    "Variant"
   ],
   [
    "Carbon",
    "Bar (grouped)",
    "Variant"
   ],
   [
    "Fluent 2",
    "Vertical bar chart",
    "Direct"
   ],
   [
    "Spectrum",
    "Bar chart",
    "Variant"
   ],
   [
    "Polaris",
    "Bar chart",
    "Variant"
   ]
  ],
  "commonGround": "The systems agree columns suit short labels and discrete periods with a zero baseline; Carbon and Spectrum define it as the bar chart's vertical orientation, and Fluent names it a vertical bar chart.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/simple-charts",
   "https://carbondesignsystem.com/building-blocks/data-visualization/axes-and-labels",
   "https://fluent2.microsoft.design/charts",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro"
  ]
 },
 "data-display|Stacked bar chart": {
  "text": "A bar or column chart whose bars split into segments that add up to a total.",
  "purpose": "Shows both the total for each category and how its parts contribute to it.",
  "use": [
   "Comparing totals and their composition across categories.",
   "Comparing shares across categories: use the 100 percent form."
  ],
  "avoid": [
   "More than about five segments: group the rest as Other.",
   "Inner segments must be compared precisely: use grouped bars."
  ],
  "anatomy": [
   "Segments — one per series, in a fixed order.",
   "Total — optional label at the end of each bar.",
   "Legend — in the same order as the segments.",
   "Value axis — starting at zero."
  ],
  "behavior": [
   "Keep segment order the same in every bar.",
   "Put the most important or most stable segment at the baseline.",
   "Show the total and each segment in the tooltip."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Bar (stacked)",
    "Direct"
   ],
   [
    "Fluent 2",
    "Stacked bar chart",
    "Direct"
   ],
   [
    "Spectrum",
    "Bar chart (stacked)",
    "Variant"
   ],
   [
    "Polaris",
    "Stacked bar chart",
    "Variant"
   ]
  ],
  "commonGround": "The systems agree on a fixed segment order matching the legend, a zero baseline and few segments; Carbon frames it as proportional contribution within a category.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/simple-charts",
   "https://fluent2.microsoft.design/charts",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro"
  ]
 },
 "data-display|Pie chart": {
  "text": "A circle divided into slices that show each part as a share of a whole.",
  "purpose": "Shows the share of a few parts in one total.",
  "use": [
   "Two to five parts of one whole that add up to 100 percent.",
   "One part is clearly dominant or the message is simple."
  ],
  "avoid": [
   "Comparing similar values or many parts: use a bar chart.",
   "Comparing wholes across time: use a stacked bar chart."
  ],
  "anatomy": [
   "Slices — one per part, starting at 12 o'clock.",
   "Labels — part name and percentage.",
   "Legend — when labels do not fit."
  ],
  "behavior": [
   "Order slices from largest to smallest, clockwise.",
   "Group small parts into Other.",
   "Highlight a slice on hover or focus."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label each slice with its name and its share."
  ],
  "map": [
   [
    "Carbon",
    "Pie",
    "Direct"
   ],
   [
    "Fluent 2",
    "Pie chart",
    "Direct"
   ]
  ],
  "commonGround": "Carbon and Fluent both provide pie charts and agree they work only for a few parts of one whole; Spectrum and Polaris offer only donut charts for this role.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/simple-charts",
   "https://fluent2.microsoft.design/charts"
  ]
 },
 "data-display|Donut chart": {
  "text": "A pie chart with a hollow center that can show the total or a key value.",
  "purpose": "Shows the share of a few parts in a whole while leaving room for a headline number.",
  "use": [
   "Two to five parts of a whole, when a total in the center helps.",
   "A single progress value against a whole."
  ],
  "avoid": [
   "Many or similar-sized parts: use a bar chart.",
   "Do not place several donuts side by side to compare; use a stacked bar chart."
  ],
  "anatomy": [
   "Ring — slices around the hollow center.",
   "Center label — total or key value with a short label.",
   "Labels or legend — part names and shares."
  ],
  "behavior": [
   "Order slices largest first, clockwise from the top.",
   "Keep a small gap between slices.",
   "Update the center value on hover only if it returns on leave."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label each slice with its name and its share."
  ],
  "map": [
   [
    "Carbon",
    "Donut",
    "Direct"
   ],
   [
    "Fluent 2",
    "Donut chart",
    "Direct"
   ],
   [
    "Spectrum",
    "Donut chart",
    "Direct"
   ],
   [
    "Polaris",
    "Donut chart",
    "Direct"
   ]
  ],
  "commonGround": "All four systems provide donut charts with a center total and agree to keep the number of slices small.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/simple-charts",
   "https://fluent2.microsoft.design/charts",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro"
  ]
 },
 "data-display|Scatter plot": {
  "text": "Plots items as points by two numeric measures to show their relationship.",
  "purpose": "Reveals correlation, clusters and outliers between two measures.",
  "use": [
   "Exploring the relationship between two numeric measures.",
   "Spotting clusters and outliers in many items."
  ],
  "avoid": [
   "Time trends: use a line chart.",
   "Few points: use a table."
  ],
  "anatomy": [
   "Points — one per item.",
   "Two value axes — each with a title and unit.",
   "Trend line — optional fit line.",
   "Legend — when points are grouped by color."
  ],
  "behavior": [
   "Allow axes to start above zero.",
   "Use transparency or jitter when points overlap.",
   "Show the item name and both values in the tooltip."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Scatter",
    "Direct"
   ],
   [
    "Spectrum",
    "Scatter plot",
    "Direct"
   ]
  ],
  "commonGround": "Carbon and Spectrum both use scatter plots for correlation between two measures and allow non-zero axes.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/simple-charts",
   "https://carbondesignsystem.com/building-blocks/data-visualization/axes-and-labels",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro"
  ]
 },
 "data-display|Bubble chart": {
  "text": "A scatter plot where point size encodes a third measure.",
  "purpose": "Compares items across three measures at once.",
  "use": [
   "Three related measures per item matter, such as cost, revenue and volume.",
   "A moderate number of items that do not overlap heavily."
  ],
  "avoid": [
   "The third measure is not important: use a scatter plot.",
   "Precise size comparison: use a bar chart."
  ],
  "anatomy": [
   "Bubbles — position by two measures, area by the third.",
   "Axes — two value axes.",
   "Size legend — sample sizes with values.",
   "Color legend — optional grouping."
  ],
  "behavior": [
   "Scale bubble area, not radius, to the value.",
   "Draw smaller bubbles on top of larger ones.",
   "Use transparency so overlaps stay visible."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Bubble",
    "Direct"
   ]
  ],
  "commonGround": "Only Carbon defines a bubble chart, for three related measures; this guidance adds general practice on area scaling.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/simple-charts"
  ]
 },
 "data-display|Heat map": {
  "text": "A grid of cells where color intensity shows the value at each row and column intersection.",
  "purpose": "Shows patterns across two dimensions, such as hour by weekday.",
  "use": [
   "Patterns across two categorical or time dimensions.",
   "Large matrices where patterns matter more than exact values."
  ],
  "avoid": [
   "Exact values matter: use a table.",
   "A categorical palette: use a sequential or diverging scale."
  ],
  "anatomy": [
   "Cells — colored by value.",
   "Row and column labels.",
   "Color scale legend — with min and max values."
  ],
  "behavior": [
   "Use a sequential scale for one-way values and a diverging scale around a meaningful midpoint.",
   "Show the exact value in the tooltip.",
   "Mark missing cells with a distinct pattern, not the lowest color."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Make the color scale perceptually even and readable by people with color vision deficiency."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Heatmap",
    "Direct"
   ],
   [
    "Fluent 2",
    "Heat map chart",
    "Direct"
   ]
  ],
  "commonGround": "Carbon and Fluent both provide heat maps with a sequential or diverging color scale and a scale legend.",
  "sources": [
   "https://charts.carbondesignsystem.com/",
   "https://carbondesignsystem.com/building-blocks/data-visualization/color-palettes",
   "https://fluent2.microsoft.design/charts"
  ]
 },
 "data-display|Histogram": {
  "text": "A column chart of value ranges that shows how often values fall in each range.",
  "purpose": "Shows the distribution of one numeric measure: its center, spread and skew.",
  "use": [
   "The distribution of one numeric measure.",
   "Finding skew, gaps and outliers."
  ],
  "avoid": [
   "Categories: use a column chart.",
   "Comparing many distributions: use box plots."
  ],
  "anatomy": [
   "Bins — touching columns, one per range.",
   "Value axis — counts or percent, starting at zero.",
   "Range axis — bin edges."
  ],
  "behavior": [
   "Use equal bin widths and let people change the bin count.",
   "Draw bins with no gaps to show the range is continuous.",
   "Show the bin range and count in the tooltip."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Histogram",
    "Direct"
   ]
  ],
  "commonGround": "Carbon defines the histogram; other systems do not, so binning rules follow general statistical practice.",
  "sources": [
   "https://carbondesignsystem.com/data-visualization/chart-types/",
   "https://charts.carbondesignsystem.com/"
  ]
 },
 "data-display|Box plot": {
  "text": "Summarizes a distribution with its median, quartiles, range and outliers.",
  "purpose": "Compares the spread and center of several distributions compactly.",
  "use": [
   "Comparing distributions across several groups.",
   "Audiences familiar with statistical summaries."
  ],
  "avoid": [
   "General audiences without explanation: use a histogram.",
   "Small samples: plot the points."
  ],
  "anatomy": [
   "Box — the middle 50 percent, from first to third quartile.",
   "Median line — inside the box.",
   "Whiskers — the range within 1.5 times the box height.",
   "Outlier points — values beyond the whiskers."
  ],
  "behavior": [
   "State how whiskers are calculated.",
   "Show quartile values in the tooltip.",
   "Align groups on a shared value axis."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Boxplot",
    "Direct"
   ]
  ],
  "commonGround": "Carbon defines the boxplot; others do not, so the anatomy follows standard statistical convention.",
  "sources": [
   "https://carbondesignsystem.com/data-visualization/chart-types/",
   "https://charts.carbondesignsystem.com/"
  ]
 },
 "data-display|Bullet chart": {
  "text": "A compact bar showing one value against a target and qualitative ranges.",
  "purpose": "Shows progress toward a goal in less space than a gauge.",
  "use": [
   "Key measures with a target, such as sales against quota.",
   "Dense dashboards with several measures stacked."
  ],
  "avoid": [
   "No target: use a bar chart.",
   "Shares of a whole: use a stacked bar."
  ],
  "anatomy": [
   "Value bar — the actual value.",
   "Target marker — a short line across the bar.",
   "Ranges — background bands such as poor, fair, good.",
   "Label — measure name and value."
  ],
  "behavior": [
   "Start the scale at zero.",
   "Use shades of one neutral color for ranges.",
   "Show actual, target and range in the tooltip."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Bullet",
    "Direct"
   ]
  ],
  "commonGround": "Carbon defines the bullet chart; others do not, so this guidance follows the widely used bullet graph convention.",
  "sources": [
   "https://carbondesignsystem.com/data-visualization/chart-types/",
   "https://charts.carbondesignsystem.com/"
  ]
 },
 "data-display|Gauge": {
  "text": "A radial or linear meter that shows one value within a fixed range.",
  "purpose": "Shows at a glance how far a single value is within its possible range.",
  "use": [
   "One value with a known minimum and maximum, such as capacity or score.",
   "A headline indicator, used sparingly."
  ],
  "avoid": [
   "Comparing values across several gauges: use a bar or bullet chart.",
   "Values without a clear range: use a metric card."
  ],
  "anatomy": [
   "Track — the full range.",
   "Fill — the current value.",
   "Value label — the number in the center or beside the track.",
   "Status color — optional for ranges."
  ],
  "behavior": [
   "Animate only on first load and keep it short.",
   "Pair any status color with a status label.",
   "Show min, max and value."
  ],
  "accessibility": [
   "Use role meter or progressbar with aria-valuenow, aria-valuemin and aria-valuemax.",
   "Do not show status by color alone.",
   "Keep the fill at 3:1 contrast against the track."
  ],
  "content": [
   "Name the value the gauge shows.",
   "Label the value with its unit and range."
  ],
  "map": [
   [
    "Carbon",
    "Gauge",
    "Direct"
   ],
   [
    "Carbon",
    "Meter",
    "Variant"
   ],
   [
    "Fluent 2",
    "Gauge chart",
    "Direct"
   ],
   [
    "Spectrum",
    "Meter",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Fluent provide gauges and Spectrum a meter; they agree on one value within a known range with a visible value label.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/simple-charts",
   "https://fluent2.microsoft.design/charts"
  ]
 },
 "data-display|Funnel": {
  "text": "Shows how many items remain at each step of a sequential process.",
  "purpose": "Shows where items drop out between steps, such as in a conversion flow.",
  "use": [
   "Strictly ordered stages where each stage is a subset of the one before.",
   "Finding the step with the largest drop-off."
  ],
  "avoid": [
   "Items can skip or repeat stages: use a Sankey diagram.",
   "Unrelated categories: use a bar chart."
  ],
  "anatomy": [
   "Stages — bars in order, one per step.",
   "Values — count at each stage.",
   "Conversion — percent kept from the previous stage."
  ],
  "behavior": [
   "Use bars on a zero baseline, not a tapered shape, so lengths stay accurate.",
   "Show both the count and the step conversion rate.",
   "Order stages from top to bottom or left to right."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Polaris",
    "Funnel chart",
    "Direct"
   ]
  ],
  "commonGround": "Only Polaris Viz defines a funnel chart; it uses bars with conversion percentages, not a decorative taper, and this guidance follows it.",
  "sources": [
   "https://polaris.shopify.com/design/data-visualization"
  ]
 },
 "data-display|Waterfall": {
  "text": "Shows how a starting value changes through a series of increases and decreases to reach an end value.",
  "purpose": "Explains what drove the change between two totals.",
  "use": [
   "Breaking down a change, such as revenue from last year to this year.",
   "Financial bridges and variance analysis."
  ],
  "avoid": [
   "Unrelated values: use a bar chart.",
   "More than about ten steps: group small ones."
  ],
  "anatomy": [
   "Start and end bars — full totals from zero.",
   "Step bars — floating bars for each increase or decrease.",
   "Connectors — thin lines between steps.",
   "Labels — signed change values."
  ],
  "behavior": [
   "Use distinct colors for increases, decreases and totals, plus signs in labels.",
   "Order steps in a logical or largest-first order.",
   "Show running total in the tooltip."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/simple-charts"
  ],
  "map": []
 },
 "data-display|Sankey diagram": {
  "text": "A flow diagram where link widths show how quantities move between stages or categories.",
  "purpose": "Shows how a quantity splits and merges as it flows through a system.",
  "use": [
   "Flows between groups, such as traffic sources to outcomes.",
   "Items move through several stages with branching."
  ],
  "avoid": [
   "Simple linear drop-off: use a funnel.",
   "Many small flows: group them."
  ],
  "anatomy": [
   "Nodes — bars for each stage or category.",
   "Links — bands between nodes, width by quantity.",
   "Labels — node names and totals."
  ],
  "behavior": [
   "Highlight a node and its links on hover or focus.",
   "Order nodes to minimize crossing links.",
   "Show source, target and value in the tooltip."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label each node with its total."
  ],
  "map": [
   [
    "Fluent 2",
    "Sankey chart",
    "Direct"
   ],
   [
    "Carbon",
    "Alluvial diagram",
    "Partial"
   ]
  ],
  "commonGround": "Fluent provides a Sankey chart and Carbon an alluvial diagram; both use proportional links between nodes and highlight a flow on hover.",
  "sources": [
   "https://fluent2.microsoft.design/charts",
   "https://carbondesignsystem.com/building-blocks/data-visualization/flow-charts"
  ]
 },
 "data-display|Radar chart": {
  "text": "Plots several measures on axes radiating from a center and connects them into a shape.",
  "purpose": "Compares the profile of one or a few items across several measures on the same scale.",
  "use": [
   "Comparing a few items across four to eight measures on one scale.",
   "Showing the strengths and weaknesses of a profile."
  ],
  "avoid": [
   "Measures with different scales: normalize or use bars.",
   "More than three items: use grouped bars."
  ],
  "anatomy": [
   "Spokes — one axis per measure.",
   "Rings — grid for the scale.",
   "Shapes — one filled polygon per item.",
   "Labels — measure names at spoke ends."
  ],
  "behavior": [
   "Use semi-transparent fills so shapes overlap visibly.",
   "Highlight one shape on hover.",
   "Start every axis at zero."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label each spoke with the measure name."
  ],
  "map": [
   [
    "Carbon",
    "Radar",
    "Direct"
   ]
  ],
  "commonGround": "Only Carbon defines a radar chart; general practice limits it to few items and shared scales.",
  "sources": [
   "https://carbondesignsystem.com/data-visualization/chart-types/",
   "https://charts.carbondesignsystem.com/"
  ]
 },
 "data-display|Sparkline": {
  "text": "A small, word-sized line chart without axes that shows the shape of a trend.",
  "purpose": "Adds trend context next to a number or in a table cell without taking much space.",
  "use": [
   "Metric cards and table cells, to show recent trend.",
   "Many sparklines in a column, to compare trend shapes."
  ],
  "avoid": [
   "People need exact values: use a full line chart.",
   "Do not use alone, without the number it describes."
  ],
  "anatomy": [
   "Line — the trend.",
   "End point — optional marker for the latest value.",
   "Area — optional light fill."
  ],
  "behavior": [
   "Use the same time range for all sparklines in a set.",
   "Do not show axes, grid lines or legends.",
   "Link to the full chart when one exists."
  ],
  "accessibility": [
   "Describe the trend in text, such as Up 12% over 30 days.",
   "Hide the sparkline from assistive technology when nearby text conveys the trend."
  ],
  "content": [
   "A sparkline has no title and no axis labels."
  ],
  "map": [
   [
    "Carbon",
    "Sparkline",
    "Direct"
   ],
   [
    "Fluent 2",
    "Sparkline",
    "Direct"
   ],
   [
    "Polaris",
    "Sparkline",
    "Direct"
   ]
  ],
  "commonGround": "Carbon, Fluent and Polaris agree on a tiny axis-free line shown next to a value, used for trend shape only.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/simple-charts",
   "https://fluent2.microsoft.design/charts",
   "https://polaris.shopify.com/design/data-visualization"
  ]
 },
 "data-display|Chart accessibility": {
  "text": "The rules that make every Plenix chart usable by people who use keyboards, screen readers or magnification, or have color vision deficiency.",
  "purpose": "Makes chart information available to everyone, not only sighted mouse users.",
  "use": [
   "Every chart, sparkline and data visualization.",
   "Choosing colors, interactions and text alternatives."
  ],
  "avoid": [
   "Do not treat a chart as decorative when it carries data.",
   "Do not rely on tooltips or hover as the only path to values."
  ],
  "anatomy": [
   "Text alternative — title plus a summary of the main finding.",
   "Data grid — the underlying values in an accessible table.",
   "Non-color encoding — labels, patterns, shapes or textures.",
   "Keyboard path — focusable series and points."
  ],
  "behavior": [
   "Static charts: give the container role img with a label; interactive charts: a labeled group with focusable points.",
   "Let people move between points with arrow keys and read each value.",
   "Respect reduced-motion settings for chart animation."
  ],
  "accessibility": [
   "Keep marks and lines at 3:1 contrast and text at 4.5:1.",
   "Test the palette with color vision deficiency simulations.",
   "Keep interactive targets at least 24 by 24 pixels."
  ],
  "content": [
   "Write the summary as the key insight, such as Sales rose 18% in Q3, led by EU.",
   "Use plain names without acronyms in titles, axes and legends."
  ],
  "map": [
   [
    "Carbon",
    "Data visualization accessibility",
    "Direct"
   ],
   [
    "Fluent 2",
    "Charts accessibility",
    "Direct"
   ],
   [
    "Spectrum",
    "Data visualization accessibility",
    "Partial"
   ],
   [
    "Polaris",
    "Data visualization accessibility",
    "Partial"
   ]
  ],
  "commonGround": "The systems agree on text alternatives, a data grid option, never color alone and keyboard access to data points; Carbon also offers texture as an alternative to color.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/legends",
   "https://carbondesignsystem.com/building-blocks/data-visualization/color-palettes",
   "https://fluent2.microsoft.design/charts",
   "https://www.w3.org/WAI/tutorials/images/complex/"
  ]
 },
 "data-display|Treemap": {
  "text": "Nested rectangles whose areas show the size of each part in a hierarchy.",
  "purpose": "Shows part-to-whole size across many items and levels in limited space.",
  "use": [
   "Many parts of a whole, such as storage by folder.",
   "Hierarchical data with two levels."
  ],
  "avoid": [
   "Precise comparison: use a bar chart.",
   "A few parts: use a donut or bar chart."
  ],
  "anatomy": [
   "Tiles — rectangles sized by value.",
   "Group borders — separate parent groups.",
   "Labels — name and value on tiles that fit."
  ],
  "behavior": [
   "Order tiles largest to smallest from top left.",
   "Hide labels in tiles too small to fit them and show them in the tooltip.",
   "Let people drill into a group and back out."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label each tile."
  ],
  "map": [
   [
    "Carbon",
    "Treemap",
    "Direct"
   ]
  ],
  "commonGround": "Only Carbon defines a treemap; general practice limits it to part-to-whole views where precise reading is not needed.",
  "sources": [
   "https://carbondesignsystem.com/data-visualization/chart-types/",
   "https://carbondesignsystem.com/building-blocks/data-visualization/spatial-charts"
  ]
 },
 "data-display|Combo chart": {
  "text": "Combines two chart types, usually columns and a line, on shared or dual axes.",
  "purpose": "Shows how two related measures move together, such as volume and rate.",
  "use": [
   "Two related measures share a category axis but differ in type, such as count and percent.",
   "Actual columns against a target line."
  ],
  "avoid": [
   "Do not combine more than two chart types.",
   "Dual axes when one axis would do: use two charts instead."
  ],
  "anatomy": [
   "Columns — the primary measure.",
   "Line — the secondary measure.",
   "Axes — left for columns, right for the line when units differ.",
   "Legend — names both measures and their chart type."
  ],
  "behavior": [
   "Label each axis with its unit and match it to its series by color or label.",
   "Start the column axis at zero.",
   "Show both values in one tooltip."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Combo",
    "Direct"
   ],
   [
    "Polaris",
    "Combo chart",
    "Direct"
   ]
  ],
  "commonGround": "Carbon and Polaris Viz both combine bars and lines, and agree that dual axes need clear labels tied to their series.",
  "sources": [
   "https://carbondesignsystem.com/data-visualization/chart-types/",
   "https://polaris.shopify.com/design/data-visualization"
  ]
 },
 "data-display|Lollipop chart": {
  "text": "A bar chart variant that draws each value as a thin line ending in a dot.",
  "purpose": "Compares many categories with less visual weight than bars.",
  "use": [
   "Many categories with similar values, instead of a bar chart.",
   "Ranked lists where the end value matters."
  ],
  "avoid": [
   "Stacked or grouped values: use bars.",
   "The audience expects standard bars."
  ],
  "anatomy": [
   "Stem — a thin line from the baseline.",
   "Dot — a marker at the value.",
   "Category axis and value axis."
  ],
  "behavior": [
   "Start the value axis at zero.",
   "Sort by value unless categories have an order.",
   "Enlarge the dot on hover or focus."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Lollipop",
    "Direct"
   ]
  ],
  "commonGround": "Only Carbon defines a lollipop chart; it follows bar chart rules with a lighter mark.",
  "sources": [
   "https://carbondesignsystem.com/data-visualization/chart-types/",
   "https://charts.carbondesignsystem.com/"
  ]
 },
 "data-display|Step chart": {
  "text": "A line chart that moves in horizontal and vertical steps; values stay constant between changes.",
  "purpose": "Shows values that change at specific moments and hold until the next change, such as prices or limits.",
  "use": [
   "Values that change in jumps, such as pricing tiers or inventory levels.",
   "Comparing when several series changed."
  ],
  "avoid": [
   "Continuous measures: use a line chart.",
   "Categories: use a bar chart."
  ],
  "anatomy": [
   "Steps — horizontal runs joined by vertical jumps.",
   "Points — optional markers at each change.",
   "Axes — time and value."
  ],
  "behavior": [
   "State whether a step changes at the start or end of each interval.",
   "Show the held value and the change time in the tooltip.",
   "Do not connect across missing data."
  ],
  "accessibility": [
   "Give every chart a visible title and a text summary of the main finding.",
   "Offer the underlying data as a table or download for keyboard and screen reader users.",
   "Do not rely on color alone; pair color with labels, patterns or markers, and keep marks at 3:1 contrast against the background."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label axes with the measure and its unit, and avoid acronyms."
  ],
  "map": [
   [
    "Carbon",
    "Step",
    "Direct"
   ]
  ],
  "commonGround": "Carbon defines the step chart for changes over time between data points; no other listed system does.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/simple-charts"
  ]
 },
 "data-display|Word cloud": {
  "text": "Words sized by how often or how strongly they appear in a body of text.",
  "purpose": "Gives a quick, impressionistic view of the main terms in text data.",
  "use": [
   "A first impression of themes in free text, such as feedback.",
   "An entry point to a list of terms that people can open."
  ],
  "avoid": [
   "Precise comparison: use a sorted bar chart of term counts.",
   "Do not use for decision-making on its own."
  ],
  "anatomy": [
   "Words — sized by value.",
   "Color — optional grouping by category or sentiment.",
   "Legend — explains size and color."
  ],
  "behavior": [
   "Keep all words horizontal for readability.",
   "Limit to the top 50 or so terms.",
   "Show the count on hover and filter by the word on click."
  ],
  "accessibility": [
   "Provide the terms and counts as a sorted list or table.",
   "Keep the smallest words at a readable size and 4.5:1 contrast."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Explain word size in a legend."
  ],
  "map": [
   [
    "Carbon",
    "Word cloud",
    "Direct"
   ]
  ],
  "commonGround": "Only Carbon defines a word cloud; general practice treats it as exploratory and pairs it with a ranked list.",
  "sources": [
   "https://carbondesignsystem.com/data-visualization/chart-types/",
   "https://charts.carbondesignsystem.com/"
  ]
 },
 "data-display|Gantt chart": {
  "text": "Horizontal bars on a time axis that show when tasks start, end and depend on each other.",
  "purpose": "Helps people plan and track schedules, overlaps and dependencies.",
  "use": [
   "Project schedules, release plans and resource bookings.",
   "Start and end dates and dependencies matter."
  ],
  "avoid": [
   "A simple list of dates: use a table or timeline.",
   "Quantities over time: use a line or column chart."
  ],
  "anatomy": [
   "Task list — names on the left, often a tree table.",
   "Time scale — header with days, weeks or months.",
   "Task bars — start to end, with optional progress fill.",
   "Milestones and dependencies — diamonds and arrows.",
   "Today line — a marker for the current date."
  ],
  "behavior": [
   "Let people zoom the time scale and scroll to today.",
   "Keep the task list and the bars scrolled together vertically.",
   "When editable, allow dragging bars, with keyboard alternatives for move and resize."
  ],
  "accessibility": [
   "Expose the schedule as a table with start, end and dependency columns.",
   "Make bars focusable and announce task, dates and status.",
   "Do not show status by bar color alone."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label the time scale with its unit (days, weeks or months)."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/"
  ],
  "map": []
 },
 "data-display|Choropleth map": {
  "text": "A map with regions shaded by the value of a measure.",
  "purpose": "Shows how a measure varies across geographic regions.",
  "use": [
   "Rates or normalized values by region, such as percent of users.",
   "Geography matters to the question."
  ],
  "avoid": [
   "Raw counts that follow population: normalize or use a proportional symbol map.",
   "Region size distorts importance: use a bar chart of regions."
  ],
  "anatomy": [
   "Regions — shaded areas.",
   "Color scale legend — with value steps.",
   "Region labels — optional.",
   "No-data pattern — for missing regions."
  ],
  "behavior": [
   "Use a sequential scale with five to seven steps, or a diverging scale around a midpoint.",
   "Overlay the legend on the map with a semi-opaque background.",
   "Show region name and value in the tooltip."
  ],
  "accessibility": [
   "Provide a sortable table of regions and values.",
   "Use a color scale readable with color vision deficiency.",
   "Make regions reachable by keyboard or via the table."
  ],
  "content": [
   "Write the title as the question the chart answers or the finding it shows, in sentence case.",
   "Label the color legend."
  ],
  "map": [
   [
    "Carbon",
    "Choropleth map",
    "Direct"
   ]
  ],
  "commonGround": "Carbon defines the choropleth map (design only) with an overlaid legend; no other listed system does.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/spatial-charts",
   "https://carbondesignsystem.com/building-blocks/data-visualization/legends",
   "https://carbondesignsystem.com/building-blocks/data-visualization/color-palettes"
  ]
 },
 "data-display|Chart interaction": {
  "text": "Shared behaviors for exploring a chart: hover, focus, highlight, filter, zoom and drill down.",
  "purpose": "Lets people get more detail from a chart without crowding the default view.",
  "use": [
   "Hover and focus: show tooltips and highlight related marks.",
   "Exploratory dashboards: legend toggles, zoom and drill-down."
  ],
  "avoid": [
   "Do not hide information needed to understand the chart behind interaction.",
   "Small static charts: no zoom or drill-down."
  ],
  "anatomy": [
   "Hover and focus — show the tooltip and emphasize the mark.",
   "Legend toggles — show or hide series.",
   "Zoom — a zoom bar or brush on the time axis.",
   "Drill-down — open a more detailed view of a mark."
  ],
  "behavior": [
   "On hover of a series, dim the others to a lower opacity.",
   "On legend click, isolate or toggle series; keep at least one visible.",
   "Show a reset control after any zoom, filter or drill-down."
  ],
  "accessibility": [
   "Give every pointer interaction a keyboard equivalent.",
   "Announce filter and zoom changes with a live region.",
   "Respect reduced-motion settings for transitions."
  ],
  "content": [
   "Label reset controls plainly, such as Reset zoom.",
   "Keep tooltip and legend names identical."
  ],
  "map": [
   [
    "Carbon",
    "Legends (interaction) and zoom bar",
    "Direct"
   ],
   [
    "Fluent 2",
    "Charts interaction",
    "Partial"
   ],
   [
    "Spectrum",
    "Chart interactivity",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Fluent and Spectrum agree on hover tooltips, highlighting the hovered series while dimming others, and legend toggles; Carbon also defines a zoom bar for time series.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/legends",
   "https://charts.carbondesignsystem.com/",
   "https://fluent2.microsoft.design/charts",
   "https://opensource.adobe.com/react-spectrum-charts/docs/docs/intro"
  ]
 },
 "data-display|Carousel": {
  "text": "Shows one or a few items at a time from a set, with controls to move between them.",
  "purpose": "Shows a set of related visual items in limited space, such as images or highlighted content.",
  "use": [
   "Browsing a small set of visual items, such as asset previews.",
   "Items of equal weight, where browsing is optional."
  ],
  "avoid": [
   "Do not hide important content in later slides; show it on the page.",
   "Long lists: use a grid or list."
  ],
  "anatomy": [
   "Viewport — shows the current items.",
   "Items — slides or cards.",
   "Previous and next buttons.",
   "Position indicator — dots or a counter.",
   "Pause control — required if it auto-advances."
  ],
  "behavior": [
   "Do not auto-advance by default; if it does, pause on hover and focus, and offer a visible pause control.",
   "Support swipe on touch and buttons on desktop.",
   "Show a partial next item to hint that more exists."
  ],
  "accessibility": [
   "Follow the ARIA carousel pattern with labeled slides and controls.",
   "Keep previous, next and pause buttons reachable by keyboard.",
   "Do not move focus when slides change automatically."
  ],
  "content": [
   "Label slides by position, such as 2 of 5.",
   "Keep slide text short and readable on its own."
  ],
  "map": [
   [
    "Material 3",
    "Carousel",
    "Direct"
   ],
   [
    "Fluent 2",
    "Carousel",
    "Direct"
   ]
  ],
  "commonGround": "Material and Fluent agree on a scrollable set of items with visible controls and position, and on avoiding auto-play; Carbon, Atlassian and Polaris do not offer a carousel.",
  "sources": [
   "https://m3.material.io/components/carousel/overview",
   "https://fluent2.microsoft.design/components/web/react/core/carousel/usage",
   "https://www.w3.org/WAI/ARIA/apg/patterns/carousel/"
  ]
 },
 "data-display|Map": {
  "text": "An interactive geographic map that shows locations, regions or routes with markers and layers.",
  "purpose": "Shows where things are and how they relate in space.",
  "use": [
   "Location is central to the task, such as sites, assets or deliveries.",
   "Spatial patterns such as clusters or coverage."
  ],
  "avoid": [
   "Location is incidental: show the address as text.",
   "Comparing regional values precisely: use a table or bar chart."
  ],
  "anatomy": [
   "Base map — the background tiles.",
   "Markers and layers — points, shapes or heat layers.",
   "Controls — zoom, recenter and layer toggles.",
   "Legend — when markers use color or size.",
   "Popup — details for a selected marker."
  ],
  "behavior": [
   "Cluster markers when they overlap at low zoom.",
   "Do not capture page scroll; require a modifier key or focus to zoom with the wheel.",
   "Keep a list view in sync with the map selection."
  ],
  "accessibility": [
   "Provide a list or table of the same locations.",
   "Make markers and controls reachable by keyboard with clear labels.",
   "Keep marker colors at 3:1 contrast against the base map."
  ],
  "content": [
   "Label markers with the place or item name.",
   "Show the attribution required by the map provider."
  ],
  "map": [
   [
    "Carbon",
    "Spatial charts",
    "Partial"
   ]
  ],
  "commonGround": "Only Carbon touches maps, through spatial charts; the rest of this guidance follows general mapping and accessibility practice.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/spatial-charts"
  ]
 },
 "data-display|Graph / network": {
  "text": "Nodes connected by edges that show relationships in a network.",
  "purpose": "Shows how items connect, such as dependencies, lineage or relationships between assets.",
  "use": [
   "Exploring relationships, dependencies or lineage.",
   "The structure of connections is the question."
  ],
  "avoid": [
   "Strict hierarchies: use a tree diagram or tree view.",
   "Do not show hundreds of nodes at once; filter or cluster first."
  ],
  "anatomy": [
   "Nodes — items, with icon and label.",
   "Edges — connections, optionally directed and labeled.",
   "Canvas controls — zoom, pan and fit.",
   "Detail panel — details for the selected node."
  ],
  "behavior": [
   "Highlight a node and its direct neighbors on hover or selection.",
   "Let people expand a node to load more connections.",
   "Keep layouts stable when nodes are added."
  ],
  "accessibility": [
   "Provide a list or table view of nodes and their connections.",
   "Make nodes focusable and let arrow keys move between connected nodes.",
   "Do not show edge type by color alone; use line style or labels."
  ],
  "content": [
   "Use short node labels and show full names on hover.",
   "Label edges only when the relationship type is not obvious."
  ],
  "map": [
   [
    "Carbon",
    "Network diagram",
    "Direct"
   ]
  ],
  "commonGround": "Only Carbon defines network diagrams among the listed systems; general practice adds filtering, neighbor highlighting and a list alternative.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/flow-charts"
  ]
 },
 "data-display|Diagram": {
  "text": "Shapes and connectors drawn to explain a process, system or structure.",
  "purpose": "Explains how parts of a system or process fit together.",
  "use": [
   "Explaining workflows, architectures or decision paths.",
   "Read-only explanation or editable flow builders."
  ],
  "avoid": [
   "Data values: use a chart.",
   "A numbered list explains the steps as well."
  ],
  "anatomy": [
   "Shapes — nodes for steps, systems or decisions.",
   "Connectors — lines or arrows showing flow.",
   "Labels — text on shapes and connectors.",
   "Groups — containers for related shapes."
  ],
  "behavior": [
   "Read top to bottom or left to right; keep one direction per diagram.",
   "Use a consistent shape for each meaning, and explain it in a legend.",
   "Allow zoom and pan for large diagrams."
  ],
  "accessibility": [
   "Provide a text description or ordered list of the same steps.",
   "Do not use color alone to show meaning.",
   "Make editable shapes and connectors operable by keyboard."
  ],
  "content": [
   "Start step labels with a verb.",
   "Keep labels short and consistent in case."
  ],
  "map": [
   [
    "Carbon",
    "Flow charts (tree and network diagrams)",
    "Partial"
   ]
  ],
  "commonGround": "Only Carbon covers diagrams, through its flow chart types; this guidance follows general diagramming practice.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/flow-charts",
   "https://www.w3.org/WAI/tutorials/images/complex/"
  ]
 },
 "data-display|Timeline visualization": {
  "text": "A horizontal chart that places events and periods on a time scale.",
  "purpose": "Shows when events happened relative to each other and how periods overlap.",
  "use": [
   "Events and durations across a long time span.",
   "Comparing sequences across several tracks, such as asset versions."
  ],
  "avoid": [
   "A short activity log: use a vertical timeline list.",
   "Task dependencies: use a Gantt chart."
  ],
  "anatomy": [
   "Time axis — the scale with date labels.",
   "Tracks — rows for categories or items.",
   "Events — points for instants.",
   "Periods — bars for durations.",
   "Today marker — optional."
  ],
  "behavior": [
   "Let people zoom and pan the time scale.",
   "Cluster events that overlap and expand them on zoom.",
   "Show event details on hover, focus or selection."
  ],
  "accessibility": [
   "Provide a list of events in time order.",
   "Make events focusable in time order.",
   "Do not rely on color to tell event types apart."
  ],
  "content": [
   "Label events with a short noun phrase.",
   "Use localized date formats and show the full date on hover."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://carbondesignsystem.com/building-blocks/data-visualization/axes-and-labels",
   "https://www.w3.org/WAI/tutorials/images/complex/"
  ],
  "map": []
 },
 "data-display|Comparison view": {
  "text": "Shows two or more items side by side, such as asset versions, so people can see differences.",
  "purpose": "Helps people review changes or choose between versions.",
  "use": [
   "Comparing versions of an asset, document or configuration.",
   "Reviewing before and after states before approving."
  ],
  "avoid": [
   "Comparing many items on attributes: use a comparison table.",
   "One item and a change list would be clearer."
  ],
  "anatomy": [
   "Panes — one per item, with a header naming the version.",
   "Difference markers — highlights for added, removed and changed parts.",
   "Sync controls — linked scroll and zoom.",
   "Mode switch — side by side, overlay or slider."
  ],
  "behavior": [
   "Link scroll and zoom across panes by default, with an option to unlink.",
   "Let people jump to the next and previous difference.",
   "Stack panes vertically on narrow screens."
  ],
  "accessibility": [
   "Do not show differences by color alone; add icons or text labels such as Added.",
   "Provide a text summary of changes.",
   "Make next and previous difference controls keyboard accessible."
  ],
  "content": [
   "Name each pane by version and date, such as Version 3, 2 Oct.",
   "Summarize the number of differences above the panes."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/tutorials/images/complex/"
  ],
  "map": []
 },
 "feedback|Banner": {
  "text": "A full-width message at the top of a page or app that reports a system-level condition.",
  "purpose": "Tells people about a condition that affects the whole product or page, such as an outage, an expiring plan or a required action, without blocking their work.",
  "use": [
   "Conditions that affect the whole app or page and persist until resolved or dismissed.",
   "The message needs to stay visible while people keep working."
  ],
  "avoid": [
   "Feedback on a single action: use a toast.",
   "Messages about one section or form: use a section message.",
   "Do not stack more than one banner; show the most important one."
  ],
  "anatomy": [
   "Container — full-width strip above the page content.",
   "Status icon — shows the tone: info, success, warning or error.",
   "Message — a short title and an optional sentence of detail.",
   "Action — an optional link or button to resolve the condition.",
   "Close button — present only when the message can be dismissed."
  ],
  "behavior": [
   "Place the banner at the top of the app or page area and push content down; do not overlay content.",
   "Keep the banner until the condition is resolved or the person dismisses it.",
   "Remember a dismissal so the same banner does not return on every page.",
   "Do not auto-dismiss a banner."
  ],
  "accessibility": [
   "Use role=status for informational banners; role=alert only for urgent errors.",
   "Do not rely on color alone; pair the tone color with an icon and text.",
   "Keep the close button keyboard-reachable, with an accessible name such as \"Dismiss\"."
  ],
  "content": [
   "Lead with what happened and what it means for the person.",
   "Keep it to one or two short sentences.",
   "Name the action with a verb, such as \"Update billing\"."
  ],
  "map": [
   [
    "Carbon",
    "Notification (inline, full width)",
    "Partial"
   ],
   [
    "Atlassian",
    "Banner",
    "Direct"
   ],
   [
    "Fluent 2",
    "Message bar",
    "Partial"
   ],
   [
    "Polaris",
    "Banner",
    "Direct"
   ],
   [
    "Spectrum",
    "Alert banner",
    "Direct"
   ]
  ],
  "commonGround": "All agree a banner is persistent, top-of-page, tone-coded with icon plus text, and limited to one at a time. Polaris also uses Banner for in-page messages; Atlassian and Spectrum reserve it for system-level conditions.",
  "sources": [
   "https://atlassian.design/components/banner",
   "https://polaris-react.shopify.com/components/feedback-indicators/banner",
   "https://spectrum.adobe.com/page/alert-banner/",
   "https://carbondesignsystem.com/components/notification/usage/",
   "https://fluent2.microsoft.design/components/web/react/core/messagebar/usage"
  ]
 },
 "feedback|Section message": {
  "text": "A message inside a page section that reports a condition about that section's content.",
  "purpose": "Gives context or a warning right next to the content it concerns, so people do not have to connect a distant message to its cause.",
  "use": [
   "A condition that affects one section, card, panel or form.",
   "Persistent guidance that should stay visible while people work in that area."
  ],
  "avoid": [
   "App-wide conditions: use a banner.",
   "Brief confirmation of an action: use a toast.",
   "A single field error: use field validation text."
  ],
  "anatomy": [
   "Container — a bordered or tinted box at the width of its section.",
   "Status icon — shows the tone: info, success, warning, error or discovery.",
   "Title — an optional short heading.",
   "Body — one or two sentences of detail.",
   "Actions — up to two optional links or buttons."
  ],
  "behavior": [
   "Place the message at the top of the section it describes.",
   "Keep it visible until the condition changes; make it dismissible only when the information is optional.",
   "Update or remove the message when the underlying condition changes."
  ],
  "accessibility": [
   "Use role=status when the message appears dynamically; role=alert only for errors that need immediate attention.",
   "Pair the tone color with an icon and text; never rely on color alone.",
   "Keep text contrast at least 4.5:1 and icon contrast at least 3:1 against the tinted background."
  ],
  "content": [
   "State the condition and its effect in plain words.",
   "When an action exists, tell people what to do next.",
   "Use a title only when the body runs longer than one sentence."
  ],
  "map": [
   [
    "Carbon",
    "Inline notification",
    "Direct"
   ],
   [
    "Atlassian",
    "Section message",
    "Direct"
   ],
   [
    "Fluent 2",
    "Message bar",
    "Direct"
   ],
   [
    "Polaris",
    "Banner (in-page)",
    "Partial"
   ],
   [
    "Spectrum",
    "In-line alert",
    "Direct"
   ]
  ],
  "commonGround": "Systems agree on an in-context, non-modal, tone-coded message with icon, short text and optional actions. They differ on dismissal: Spectrum's in-line alert is not dismissible, while Carbon and Fluent allow a close button.",
  "sources": [
   "https://atlassian.design/components/section-message",
   "https://carbondesignsystem.com/components/notification/usage/",
   "https://spectrum.adobe.com/page/in-line-alert/",
   "https://fluent2.microsoft.design/components/web/react/core/messagebar/usage",
   "https://polaris-react.shopify.com/components/feedback-indicators/banner"
  ]
 },
 "feedback|Status icon": {
  "text": "A small icon whose shape and color signal the state of an object or process.",
  "purpose": "Lets people scan many items and spot states such as failed, running or complete without reading every label.",
  "use": [
   "Tables, lists and headers, next to an item's name, to show its state.",
   "Alongside a text label, or with a tooltip when space is tight."
  ],
  "avoid": [
   "Decoration, or as the only carrier of meaning: do not use status icons.",
   "Do not invent a new shape for a state that already has one in the set."
  ],
  "anatomy": [
   "Shape — a distinct glyph per state so the state survives without color.",
   "Color — the semantic tone of the state.",
   "Label — visible text or an accessible name that states the state."
  ],
  "behavior": [
   "Use one consistent icon per state across the whole product.",
   "Use no more than about five states in one view, so the set stays learnable.",
   "Change the icon in place when the state changes; animate only when the state is in progress."
  ],
  "accessibility": [
   "Give each icon an accessible name, or hide it from screen readers when visible text already states the status.",
   "Make every state distinguishable by shape, not only by color.",
   "Keep icon contrast at least 3:1 against its background."
  ],
  "content": [
   "Use short state labels such as \"Failed\", \"Running\" or \"Complete\".",
   "Use the same label for a state everywhere it appears."
  ],
  "map": [
   [
    "Carbon",
    "Status indicator (icon)",
    "Direct"
   ],
   [
    "Spectrum",
    "Status light",
    "Partial"
   ],
   [
    "Fluent 2",
    "Badge (status)",
    "Partial"
   ],
   [
    "Atlassian",
    "Lozenge",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Spectrum agree status needs a shape or text in addition to color, and a status set must stay small and consistent. Atlassian and Fluent lean on text lozenges and badges, not standalone icons.",
  "sources": [
   "https://carbondesignsystem.com/patterns/status-indicator-pattern/",
   "https://spectrum.adobe.com/page/status-light/",
   "https://fluent2.microsoft.design/components/web/react/core/badge/usage",
   "https://atlassian.design/components/lozenge"
  ]
 },
 "feedback|Availability indicator": {
  "text": "A small marker, usually on an avatar, that shows whether a person is available, busy, away or offline.",
  "purpose": "Helps people decide at a glance whether and how to contact someone.",
  "use": [
   "Avatars and people lists in collaborative features.",
   "Only when the presence data is live and reliable."
  ],
  "avoid": [
   "The state of objects or jobs: use a status icon.",
   "Presence data may be stale: omit it."
  ],
  "anatomy": [
   "Marker — a small circle or icon pinned to a corner of the avatar.",
   "State glyph — a shape per state such as check, clock or minus.",
   "Border — a ring that separates the marker from the avatar image."
  ],
  "behavior": [
   "Update the marker in real time as presence changes.",
   "Scale the marker with the avatar size and keep its position fixed.",
   "Keep the state set small: available, busy, away, do not disturb and offline."
  ],
  "accessibility": [
   "Include the state in the avatar's accessible name, such as \"Ana Silva, away\".",
   "Give each state its own shape so it does not depend on color.",
   "Keep the marker at least 3:1 against both the avatar and the page."
  ],
  "content": [
   "Use short, familiar state names.",
   "Show details such as \"Back at 2:00 PM\" in a tooltip or hover card, not on the marker."
  ],
  "map": [
   [
    "Fluent 2",
    "Presence badge",
    "Direct"
   ],
   [
    "Atlassian",
    "Avatar presence",
    "Direct"
   ],
   [
    "Material 3",
    "Badge",
    "Partial"
   ]
  ],
  "commonGround": "Fluent and Atlassian both pin a small shape-coded marker to the avatar and include the state in its accessible name. Neither Carbon nor Polaris defines presence.",
  "sources": [
   "https://fluent2.microsoft.design/components/web/react/core/badge/usage",
   "https://atlassian.design/components/avatar",
   "https://m3.material.io/components/badges/overview"
  ]
 },
 "feedback|Circular progress": {
  "text": "A ring that shows work in progress, either as an endless spin or as a filled percentage.",
  "purpose": "Reassures people the system is working when the wait is short or space is too tight for a bar.",
  "use": [
   "Short waits, roughly one to ten seconds, in a compact space such as a button or card.",
   "The percentage is known: use the determinate form."
  ],
  "avoid": [
   "Long tasks with a known end: use a linear progress bar with a label.",
   "Content shape is known: use a skeleton.",
   "Do not show several spinners on one screen at once."
  ],
  "anatomy": [
   "Track — the faint full ring.",
   "Indicator — the colored arc that spins or fills.",
   "Label — optional text, such as \"Loading files\", beside or below."
  ],
  "behavior": [
   "Delay showing the indicator for very short waits to avoid flicker.",
   "Switch from indeterminate to determinate when progress becomes known.",
   "Remove the indicator and show the result as soon as work finishes.",
   "Respect reduced-motion settings: slow or simplify the spin."
  ],
  "accessibility": [
   "Use role=progressbar with an accessible name; add aria-valuenow for the determinate form.",
   "When the indicator is the only feedback, announce start and completion through a polite live region.",
   "Keep the indicator at least 3:1 against its background."
  ],
  "content": [
   "Describe what is loading, such as \"Loading assets\", not \"Please wait\".",
   "Do not end the label with an ellipsis-only message."
  ],
  "map": [
   [
    "Material 3",
    "Circular progress indicator",
    "Direct"
   ],
   [
    "Carbon",
    "Loading",
    "Direct"
   ],
   [
    "Fluent 2",
    "Spinner",
    "Direct"
   ],
   [
    "Atlassian",
    "Spinner",
    "Direct"
   ],
   [
    "Polaris",
    "Spinner",
    "Direct"
   ],
   [
    "Spectrum",
    "Progress circle",
    "Direct"
   ]
  ],
  "commonGround": "All systems offer a circular indicator for short or compact waits and prefer a bar or skeleton for longer or structured loads. Material 3 and Spectrum support a determinate ring; Carbon, Atlassian and Polaris treat it as indeterminate only.",
  "sources": [
   "https://m3.material.io/components/progress-indicators/overview",
   "https://carbondesignsystem.com/components/loading/usage/",
   "https://fluent2.microsoft.design/components/web/react/core/spinner/usage",
   "https://atlassian.design/components/spinner",
   "https://polaris-react.shopify.com/components/feedback-indicators/spinner",
   "https://spectrum.adobe.com/page/progress-circle/"
  ]
 },
 "feedback|Progress tracker": {
  "text": "A horizontal or vertical row of labeled steps that shows where a person is in a multi-step process.",
  "purpose": "Shows how many steps a task has, which are done and which remain, so people can plan and navigate a long flow.",
  "use": [
   "Linear flows of three to about seven named steps, such as setup or checkout.",
   "Step names help people understand the task."
  ],
  "avoid": [
   "Two-step flows: a heading such as \"Step 1 of 2\" is enough.",
   "Primary navigation between unrelated pages: use tabs or a nav pane."
  ],
  "anatomy": [
   "Step marker — a dot or icon per step, showing complete, current, incomplete, error or disabled.",
   "Step label — the name of each step, with an optional secondary line.",
   "Connector — the line between markers, showing sequence."
  ],
  "behavior": [
   "Mark completed steps and let people go back to them.",
   "Do not let people skip ahead to steps whose prerequisites are incomplete.",
   "Show an error marker on a step that needs attention.",
   "Switch to vertical layout when horizontal labels would truncate."
  ],
  "accessibility": [
   "Mark up steps as an ordered list; set aria-current=step on the current one.",
   "Include the step state in each step's accessible name, such as \"Details, complete\".",
   "Make clickable steps keyboard-focusable buttons or links."
  ],
  "content": [
   "Name steps with short nouns or verb phrases, such as \"Details\" or \"Review\".",
   "Keep labels to one or two words so they fit without truncation."
  ],
  "map": [
   [
    "Carbon",
    "Progress indicator",
    "Direct"
   ],
   [
    "Atlassian",
    "Progress tracker",
    "Direct"
   ],
   [
    "Material 3",
    "Stepper",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Atlassian agree on labeled steps with complete, current and upcoming states, connectors, and back-navigation to completed steps only. Material steppers exist in earlier Material versions but are not in the core Material 3 set.",
  "sources": [
   "https://carbondesignsystem.com/components/progress-indicator/usage/",
   "https://atlassian.design/components/progress-tracker"
  ]
 },
 "feedback|Step progress": {
  "text": "A compact indicator, such as dots or \"Step 2 of 5\", that shows position in a short sequence without step names.",
  "purpose": "Shows position in a sequence of views when there is no room or need for named steps.",
  "use": [
   "Carousels, onboarding tours and short dialogs with a few steps.",
   "Step names add no value."
  ],
  "avoid": [
   "Long or complex flows where people need step names: use a progress tracker.",
   "More than about seven dots: switch to text such as \"Step 3 of 12\"."
  ],
  "anatomy": [
   "Indicators — one dot or segment per step.",
   "Current marker — the filled or wider indicator for the current step.",
   "Text form — an optional \"Step n of m\" label."
  ],
  "behavior": [
   "Update the current marker as the person moves forward or back.",
   "Make dots clickable only when free navigation between steps is allowed.",
   "Pair the indicator with Back and Next buttons."
  ],
  "accessibility": [
   "Give screen readers a text equivalent, such as \"Step 2 of 5\".",
   "When indicators are interactive, set aria-current on the current one.",
   "Keep interactive dots at least 24 by 24 px as targets."
  ],
  "content": [
   "Use the format \"Step 2 of 5\".",
   "Keep wording identical across every step of the flow."
  ],
  "map": [
   [
    "Atlassian",
    "Progress indicator",
    "Direct"
   ],
   [
    "Carbon",
    "Progress indicator (vertical/compact)",
    "Partial"
   ],
   [
    "Material 3",
    "Carousel indicator",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Material agree on a dot-style indicator with a clear current marker for short sequences. Carbon prefers labeled steps and has no dots-only form.",
  "sources": [
   "https://atlassian.design/components/progress-indicator",
   "https://carbondesignsystem.com/components/progress-indicator/usage/",
   "https://m3.material.io/components/carousel/overview"
  ]
 },
 "feedback|Loading overlay": {
  "text": "A translucent layer with a progress indicator that covers a region while its content loads or saves.",
  "purpose": "Prevents interaction with content that is about to change, while keeping the existing layout visible.",
  "use": [
   "A region must be locked during a save or refresh to prevent conflicting input.",
   "Cover a region, such as a table or panel, not the whole app, where possible."
  ],
  "avoid": [
   "First-time loading of content with a known layout: use skeletons.",
   "Do not cover the whole screen for a local operation.",
   "Operations that take minutes: run them in the background with a progress notification."
  ],
  "anatomy": [
   "Scrim — a translucent layer over the affected region.",
   "Indicator — a circular progress indicator centered in the region.",
   "Label — optional text that names the operation."
  ],
  "behavior": [
   "Block pointer and keyboard input to the covered region only.",
   "Delay showing the overlay for very short operations to avoid flicker.",
   "When the work finishes, remove the overlay and restore focus to where it was.",
   "Offer a cancel action when the operation can be stopped."
  ],
  "accessibility": [
   "Set aria-busy=true on the covered region while it loads.",
   "Announce loading and completion through a polite live region.",
   "Make covered content inert so focus cannot move into it."
  ],
  "content": [
   "Name the operation, such as \"Saving changes\".",
   "Keep the label to a few words."
  ],
  "map": [
   [
    "Carbon",
    "Loading (with overlay)",
    "Direct"
   ],
   [
    "Fluent 2",
    "Spinner",
    "Partial"
   ],
   [
    "Spectrum",
    "Progress circle (over background)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon offers an overlay variant of its loading indicator, and Fluent and Spectrum allow a spinner over content; all prefer skeletons or inline indicators for first loads. Region-level, not full-screen, overlays are general practice.",
  "sources": [
   "https://carbondesignsystem.com/components/loading/usage/",
   "https://fluent2.microsoft.design/components/web/react/core/spinner/usage",
   "https://spectrum.adobe.com/page/progress-circle/"
  ]
 },
 "feedback|Error state": {
  "text": "A view that replaces expected content when it could not be loaded or an operation failed.",
  "purpose": "Explains what went wrong and how to recover, instead of leaving a blank or broken area.",
  "use": [
   "A page, panel or component cannot show its content because of a failure.",
   "The person can recover by retrying, changing input or contacting support."
  ],
  "avoid": [
   "Field validation: show errors next to the field.",
   "Nothing failed and the area is simply empty: use an empty state."
  ],
  "anatomy": [
   "Illustration or icon — an optional visual sized to the space.",
   "Heading — what went wrong.",
   "Body — why it happened and what to do.",
   "Actions — a primary recovery action, such as Retry, plus an optional secondary link."
  ],
  "behavior": [
   "Show the error state in the area that failed; keep the rest of the page working.",
   "Keep any input the person entered.",
   "Offer retry when the failure may be temporary.",
   "Log technical details and show an error ID people can share with support."
  ],
  "accessibility": [
   "When the error replaces content the person was waiting for, move focus to or announce its heading.",
   "Do not rely on a red color or an image alone to signal the error.",
   "Make recovery actions keyboard-reachable buttons."
  ],
  "content": [
   "Say what happened in plain words, without blame and without technical codes in the heading.",
   "Tell people what they can do next.",
   "Avoid \"oops\" and humor in serious failures."
  ],
  "map": [
   [
    "Carbon",
    "Empty state (error)",
    "Partial"
   ],
   [
    "Atlassian",
    "Empty state",
    "Partial"
   ],
   [
    "Polaris",
    "Empty state",
    "Partial"
   ],
   [
    "Spectrum",
    "Illustrated message",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on an in-place message with a heading, a short explanation and a recovery action, written without blame. Most treat error as a variant of their empty state component, not a separate component.",
  "sources": [
   "https://carbondesignsystem.com/patterns/empty-states-pattern/",
   "https://atlassian.design/components/empty-state",
   "https://polaris-react.shopify.com/components/layout-and-structure/empty-state",
   "https://spectrum.adobe.com/page/illustrated-message/"
  ]
 },
 "feedback|Warning state": {
  "text": "Shows that content is usable but something needs attention soon.",
  "purpose": "Flags a risk or a degrading condition before it becomes an error, so people can act in time.",
  "use": [
   "A condition that may cause a problem, such as storage nearly full or a license expiring.",
   "List or table items that need review but are not broken."
  ],
  "avoid": [
   "Failures: use an error state.",
   "Routine information: use an info tone."
  ],
  "anatomy": [
   "Warning icon — the standard warning shape and color.",
   "Message — what may go wrong and when.",
   "Action — an optional way to resolve the risk."
  ],
  "behavior": [
   "Show the warning next to the affected item or at the top of the affected section.",
   "Keep the warning until the condition is resolved.",
   "Escalate to an error state if the condition becomes a failure."
  ],
  "accessibility": [
   "Pair the warning color with the warning icon and text.",
   "Use role=status for warnings that appear dynamically; role=alert only when action is urgent.",
   "Keep warning text contrast at 4.5:1 or more, which often means dark text on yellow."
  ],
  "content": [
   "Say what may happen and what the person can do to prevent it.",
   "Include a time or threshold when known, such as \"Storage is 90% full\"."
  ],
  "map": [
   [
    "Carbon",
    "Notification (warning)",
    "Partial"
   ],
   [
    "Atlassian",
    "Section message (warning)",
    "Partial"
   ],
   [
    "Polaris",
    "Banner (warning)",
    "Partial"
   ],
   [
    "Spectrum",
    "In-line alert (notice)",
    "Partial"
   ]
  ],
  "commonGround": "All systems define a warning tone with its own icon and color and reserve it for risks, not failures. Spectrum names it notice rather than warning.",
  "sources": [
   "https://carbondesignsystem.com/components/notification/usage/",
   "https://atlassian.design/components/section-message",
   "https://polaris-react.shopify.com/components/feedback-indicators/banner",
   "https://spectrum.adobe.com/page/in-line-alert/"
  ]
 },
 "feedback|Success state": {
  "text": "Confirms an operation finished as intended.",
  "purpose": "Closes the loop on an action so people know it worked and what they can do next.",
  "use": [
   "After an action whose outcome is not otherwise visible.",
   "The end of a multi-step flow: use a full success view."
  ],
  "avoid": [
   "Trivial actions whose result is already visible on screen: do not confirm them.",
   "Do not block people with a success dialog; use a toast or inline message."
  ],
  "anatomy": [
   "Success icon — the standard success shape and color.",
   "Message — what was completed.",
   "Next actions — optional links to the result or the next task."
  ],
  "behavior": [
   "Show a toast for quick actions; an inline or page-level message for larger outcomes.",
   "Auto-dismiss success toasts after a few seconds; keep page-level success views until the person leaves.",
   "Link to the created or changed object when possible."
  ],
  "accessibility": [
   "Announce success through a polite live region.",
   "Pair the success color with an icon and text.",
   "Give auto-dismissing messages enough time to be read, or let people pause them."
  ],
  "content": [
   "State what happened, with the object name, such as \"Asset uploaded\".",
   "Use past tense and avoid exclamation marks."
  ],
  "map": [
   [
    "Carbon",
    "Notification (success)",
    "Partial"
   ],
   [
    "Atlassian",
    "Flag (success)",
    "Partial"
   ],
   [
    "Polaris",
    "Toast",
    "Partial"
   ],
   [
    "Spectrum",
    "Toast (positive)",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree success feedback should be brief, non-blocking and usually a toast, with the object named. Carbon and Polaris discourage success messages when the result is already visible.",
  "sources": [
   "https://carbondesignsystem.com/components/notification/usage/",
   "https://atlassian.design/components/flag",
   "https://polaris-react.shopify.com/components/feedback-indicators/toast",
   "https://spectrum.adobe.com/page/toast/"
  ]
 },
 "feedback|Offline state": {
  "text": "Tells people the app has lost its network connection, and what still works.",
  "purpose": "Prevents confusion and data loss when the connection drops, and sets expectations about what will sync later.",
  "use": [
   "The app detects that the network is unavailable.",
   "Views that depend on live data when that data cannot refresh."
  ],
  "avoid": [
   "A single failed request: use an error state with retry.",
   "Do not block the whole app if cached content is still usable."
  ],
  "anatomy": [
   "Banner — an app-level message that the connection is lost.",
   "Stale markers — optional labels on content that may be out of date.",
   "Pending indicator — a count or icon for changes waiting to sync."
  ],
  "behavior": [
   "Show the offline message as soon as the connection drops; remove it when it returns.",
   "Keep cached content readable, and queue edits when the app supports it.",
   "Disable actions that need the network and explain why.",
   "When the connection is restored and changes have synced, confirm briefly."
  ],
  "accessibility": [
   "Announce loss and restoration of the connection through a polite live region.",
   "Explain disabled actions in text, not only by graying them out.",
   "Do not rely on color to mark stale content."
  ],
  "content": [
   "Say \"You're offline\" and what still works.",
   "Tell people whether their changes will be saved when they reconnect."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://m3.material.io/foundations/interaction/states/overview"
  ],
  "map": []
 },
 "feedback|Degraded state": {
  "text": "Tells people a service is working only partly or more slowly than normal.",
  "purpose": "Sets expectations during partial outages so people do not repeat actions or assume the error is theirs.",
  "use": [
   "A dependent service is slow, partly down or running with reduced features.",
   "Some data may be incomplete or delayed."
  ],
  "avoid": [
   "A full outage: use a maintenance or error state.",
   "Do not leave the message up after the service recovers."
  ],
  "anatomy": [
   "Banner or section message — the warning-toned notice.",
   "Affected scope — the features or data affected.",
   "Status link — an optional link to a status page or incident."
  ],
  "behavior": [
   "Scope the message to the affected area where possible.",
   "Disable or hide only the features that do not work.",
   "Update or remove the message when the service recovers."
  ],
  "accessibility": [
   "Use role=status so the notice is announced without interrupting.",
   "Pair the warning tone with an icon and text."
  ],
  "content": [
   "Say which features are affected and what still works.",
   "Avoid technical root-cause details; link to status updates."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://atlassian.design/components/banner",
   "https://carbondesignsystem.com/components/notification/usage/"
  ],
  "map": []
 },
 "feedback|Permission-denied state": {
  "text": "A view shown when a person tries to open content or use a feature they have no access to.",
  "purpose": "Explains why the content is unavailable and how to get access, instead of showing an empty or broken page.",
  "use": [
   "A page, object or feature exists but the current person lacks permission.",
   "Access can be requested from an owner or admin."
  ],
  "avoid": [
   "When existence itself is private, do not reveal sensitive details such as the object's name; show a not-found state instead.",
   "Do not show actions people cannot perform; hide them, or disable them with an explanation."
  ],
  "anatomy": [
   "Icon or illustration — a lock or similar visual.",
   "Heading — states that the person does not have access.",
   "Body — who controls access and how to get it.",
   "Actions — Request access and a link back to a safe place."
  ],
  "behavior": [
   "Keep the app shell and navigation visible so people can go elsewhere.",
   "Offer a request-access flow when the product supports it.",
   "Show which account is signed in, so people can switch if they used the wrong one."
  ],
  "accessibility": [
   "Set the page title to reflect the access state.",
   "Move focus to the heading when the state replaces content."
  ],
  "content": [
   "Say \"You don't have access to this …\" without blaming the person.",
   "Name who can grant access when known."
  ],
  "map": [
   [
    "Atlassian",
    "Empty state",
    "Partial"
   ],
   [
    "Carbon",
    "Empty state",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Carbon show access problems as a variant of the empty or error state, with a clear next step. Neither defines a separate component.",
  "sources": [
   "https://atlassian.design/components/empty-state",
   "https://carbondesignsystem.com/patterns/empty-states-pattern/"
  ]
 },
 "feedback|Not-found state": {
  "text": "A view shown when the requested page or object does not exist or can no longer be found.",
  "purpose": "Tells people the address or item is wrong or gone, and gives them a way forward.",
  "use": [
   "Unknown URLs, and objects that were deleted or moved.",
   "Revealing existence would leak information: use instead of a permission-denied state."
  ],
  "avoid": [
   "Empty search results: use a no-results empty state.",
   "Do not redirect silently to the home page."
  ],
  "anatomy": [
   "Heading — states that the page or item was not found.",
   "Body — likely reasons and what to check.",
   "Actions — links to home, search or the parent list."
  ],
  "behavior": [
   "Keep the app shell and navigation visible.",
   "Return the correct HTTP status for full pages.",
   "Offer search when the product has it."
  ],
  "accessibility": [
   "Set the page title to say the page was not found.",
   "Make the heading the first heading on the page."
  ],
  "content": [
   "Use plain words, such as \"Page not found\"; avoid jargon like \"404\" in the heading.",
   "If the address was typed, suggest checking it."
  ],
  "map": [
   [
    "Atlassian",
    "Empty state",
    "Partial"
   ],
   [
    "Spectrum",
    "Illustrated message",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Spectrum show not-found as an illustrated or empty-state message; GOV.UK cross-checks the plain heading and avoiding error codes.",
  "sources": [
   "https://atlassian.design/components/empty-state",
   "https://spectrum.adobe.com/page/illustrated-message/",
   "https://design-system.service.gov.uk/patterns/page-not-found-pages/"
  ]
 },
 "feedback|Maintenance state": {
  "text": "Tells people a service is unavailable because of planned work, and when it will return.",
  "purpose": "Sets clear expectations during planned downtime so people can plan their work.",
  "use": [
   "Planned downtime that blocks a service or the whole app.",
   "Upcoming maintenance: announce it ahead of time with a banner."
  ],
  "avoid": [
   "Unplanned outages, unless the cause is known: use an error or degraded state.",
   "Do not show it without an expected end time when one is known."
  ],
  "anatomy": [
   "Heading — states that the service is unavailable.",
   "Time window — when it will be back, with time zone.",
   "Alternatives — optional links to status updates or other channels."
  ],
  "behavior": [
   "Announce planned maintenance in advance with a dismissible banner.",
   "During maintenance, replace the affected area or page with the maintenance state.",
   "For full pages, return the correct HTTP status so clients retry later."
  ],
  "accessibility": [
   "Set the page title to say the service is unavailable.",
   "Write times in text, not only in an image."
  ],
  "content": [
   "Say when the service will be back, with a date, time and time zone.",
   "Keep it short and avoid technical detail."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice. GOV.UK's service-unavailable pattern cross-checks the advice to state when the service returns.",
  "sources": [
   "https://design-system.service.gov.uk/patterns/service-unavailable-pages/"
  ],
  "map": []
 },
 "feedback|Retry pattern": {
  "text": "Lets people or the system repeat a failed operation.",
  "purpose": "Recovers from temporary failures without making people start over.",
  "use": [
   "Network or server errors that are likely temporary.",
   "Automatic retry with backoff for background work; a Retry button for operations the person started."
  ],
  "avoid": [
   "Errors that will fail again, such as invalid input or missing permission: do not offer retry.",
   "Do not retry operations that are not safe to repeat, such as payments, without a guard against duplicates."
  ],
  "anatomy": [
   "Error message — what failed.",
   "Retry action — a button or link that repeats the operation.",
   "Progress — feedback while the retry runs.",
   "Fallback — help or support when retries keep failing."
  ],
  "behavior": [
   "Keep the person's input and context when retrying.",
   "Show progress during the retry and the result afterward.",
   "Use exponential backoff for automatic retries; stop after a few attempts.",
   "Escalate to help or support after repeated failures."
  ],
  "accessibility": [
   "Announce the retry result through a live region.",
   "Keep focus on or near the Retry button after a failed attempt."
  ],
  "content": [
   "Label the action \"Retry\" or \"Try again\".",
   "Say what will be retried when it is not obvious."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://carbondesignsystem.com/components/notification/usage/",
   "https://polaris-react.shopify.com/components/feedback-indicators/banner"
  ],
  "map": []
 },
 "feedback|Undo pattern": {
  "text": "Lets people reverse an action shortly after taking it.",
  "purpose": "Lets people act quickly without a confirmation step, while still protecting them from mistakes.",
  "use": [
   "Reversible actions such as archive, move or delete-to-trash.",
   "The action can be undone: use instead of a confirmation dialog."
  ],
  "avoid": [
   "Actions that cannot be reversed: use a confirmation dialog, not undo.",
   "Do not hide undo in a toast that disappears too fast to use."
  ],
  "anatomy": [
   "Toast or snackbar — the confirmation of the action.",
   "Undo action — a single text button in the toast.",
   "Keyboard shortcut — an optional standard shortcut, such as Ctrl+Z."
  ],
  "behavior": [
   "Apply the action immediately and show the undo option.",
   "Keep the toast long enough to act on, and open while it has focus or hover.",
   "When undo is used, restore the exact previous state, including position and selection.",
   "Confirm the undo with a short message."
  ],
  "accessibility": [
   "Make the undo action reachable by keyboard without hunting through the page.",
   "Announce the toast through a polite live region.",
   "Do not auto-dismiss a toast with an action before people can reach it."
  ],
  "content": [
   "Name what happened, such as \"3 assets archived\".",
   "Label the action \"Undo\"."
  ],
  "map": [
   [
    "Material 3",
    "Snackbar (with action)",
    "Partial"
   ],
   [
    "Polaris",
    "Toast (with action)",
    "Partial"
   ],
   [
    "Atlassian",
    "Flag (with action)",
    "Partial"
   ],
   [
    "Carbon",
    "Toast notification (actionable)",
    "Partial"
   ]
  ],
  "commonGround": "Material, Polaris and Atlassian put undo as a single action inside a toast after the change is applied. Carbon advises against actions in auto-dismissing toasts, so Plenix keeps undo toasts open longer.",
  "sources": [
   "https://m3.material.io/components/snackbar/guidelines",
   "https://polaris-react.shopify.com/components/feedback-indicators/toast",
   "https://atlassian.design/components/flag",
   "https://carbondesignsystem.com/components/notification/usage/"
  ]
 },
 "feedback|Completion state": {
  "text": "A view at the end of a task or flow that confirms it is done and offers next steps.",
  "purpose": "Gives a multi-step task a clear end and guides people to what comes next.",
  "use": [
   "The end of a wizard, import, setup or other multi-step flow.",
   "The result needs a summary, such as counts of items processed."
  ],
  "avoid": [
   "Single quick actions: use a toast.",
   "Do not end a flow with no way forward."
  ],
  "anatomy": [
   "Success icon or illustration — signals completion.",
   "Heading — what was completed.",
   "Summary — key results, such as counts or warnings.",
   "Next actions — a primary next step and a link to the result."
  ],
  "behavior": [
   "Replace the last step's content with the completion view.",
   "Mark all steps complete in the progress tracker.",
   "Report partial success clearly: list the items that failed, with a way to retry them."
  ],
  "accessibility": [
   "Move focus to the completion heading.",
   "Announce the completion through the page title or a live region."
  ],
  "content": [
   "State what was done, such as \"Import complete\".",
   "Give exact counts when the task processed many items."
  ],
  "map": [
   [
    "Carbon",
    "Progress indicator (complete)",
    "Partial"
   ],
   [
    "Atlassian",
    "Empty state (success)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Atlassian agree a flow should end with a clear confirmation and next steps, shown in context, not in a blocking dialog. GOV.UK's confirmation page pattern cross-checks this.",
  "sources": [
   "https://carbondesignsystem.com/components/progress-indicator/usage/",
   "https://atlassian.design/components/empty-state",
   "https://design-system.service.gov.uk/patterns/confirmation-pages/"
  ]
 },
 "feedback|Disabled state": {
  "text": "Shows that a control exists but cannot be used right now.",
  "purpose": "Keeps the layout stable and shows what will become available, while preventing actions that cannot succeed.",
  "use": [
   "A control will become available after the person does something, such as selecting a row.",
   "Options are temporarily unavailable and the layout should stay stable."
  ],
  "avoid": [
   "Do not disable a form's submit button to signal errors; let people submit, then show the errors.",
   "Do not disable controls people can never use; hide them instead.",
   "Values people should read: use read-only, not disabled."
  ],
  "anatomy": [
   "Reduced-emphasis styling — lighter text, border and fill.",
   "No hover or press feedback.",
   "Explanation — an optional tooltip or helper text saying why."
  ],
  "behavior": [
   "Ignore pointer and keyboard activation.",
   "When the reason is not obvious, explain why the control is disabled.",
   "Enable the control as soon as its condition is met."
  ],
  "accessibility": [
   "Use the native disabled attribute or aria-disabled=true.",
   "When people need to reach an explanation tooltip, use aria-disabled and keep the control focusable.",
   "Disabled controls are exempt from contrast rules but must stay recognizable as controls."
  ],
  "content": [
   "Keep the same label as in the enabled state.",
   "Write the reason as a short sentence, such as \"Select an asset to download\"."
  ],
  "map": [
   [
    "Carbon",
    "Disabled states",
    "Direct"
   ],
   [
    "Material 3",
    "States (disabled)",
    "Direct"
   ],
   [
    "Spectrum",
    "Disabled",
    "Partial"
   ],
   [
    "Fluent 2",
    "Disabled",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree disabled controls lose interaction feedback, should be used sparingly and should be explained when the reason is not obvious. Carbon and Material separate disabled from read-only.",
  "sources": [
   "https://carbondesignsystem.com/patterns/disabled-states/",
   "https://m3.material.io/foundations/interaction/states/applying-states",
   "https://spectrum.adobe.com/page/button/"
  ]
 },
 "feedback|Read-only state": {
  "text": "Shows a value people can see, select and copy but cannot change.",
  "purpose": "Shows information in a form or record without implying it can be edited, while keeping it fully legible.",
  "use": [
   "A value is set by the system or by someone with more permission.",
   "People may need to copy or focus the value."
  ],
  "avoid": [
   "Controls that will become editable after another step: use disabled.",
   "Do not use input borders that make the field look editable."
  ],
  "anatomy": [
   "Label — the field name.",
   "Value — full-contrast text without an editable border.",
   "Indicator — an optional lock icon or helper text that explains why."
  ],
  "behavior": [
   "Keep the value selectable and copyable.",
   "Keep the field in the tab order so screen reader users can reach it.",
   "Show no hover or edit affordance."
  ],
  "accessibility": [
   "Use the native readonly attribute or aria-readonly=true.",
   "Keep text contrast at the full 4.5:1; unlike disabled, read-only is not exempt.",
   "When it matters, explain why the value cannot be changed."
  ],
  "content": [
   "Show the value in full; do not replace it with a placeholder.",
   "When the reason helps, use helper text such as \"Set by your admin\"."
  ],
  "map": [
   [
    "Carbon",
    "Read-only states",
    "Direct"
   ],
   [
    "Spectrum",
    "Read-only (field)",
    "Partial"
   ],
   [
    "Fluent 2",
    "Read-only (input)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Spectrum agree read-only values stay fully legible, focusable and copyable, unlike disabled ones. Styling differs: Carbon removes the field border, while some Fluent inputs keep a faint one.",
  "sources": [
   "https://carbondesignsystem.com/patterns/read-only-states-pattern/",
   "https://spectrum.adobe.com/page/text-field/",
   "https://fluent2.microsoft.design/components/web/react/core/input/usage"
  ]
 },
 "feedback|Unsaved changes": {
  "text": "Tells people they have unsaved edits and protects them from losing them.",
  "purpose": "Prevents data loss when people leave a page or close a panel with pending edits.",
  "use": [
   "Forms and editors that save explicitly, not automatically.",
   "Leaving the page would discard edits."
  ],
  "avoid": [
   "Auto-saving editors: show save status instead.",
   "Do not warn when nothing has changed."
  ],
  "anatomy": [
   "Dirty indicator — a save bar, dot or label that shows pending changes.",
   "Save and discard actions — always reachable while changes are pending.",
   "Leave guard — a confirmation dialog when people try to leave."
  ],
  "behavior": [
   "Show the indicator as soon as a value differs from the saved value; hide it if the edit is reverted.",
   "Ask for confirmation before navigating away, closing a panel or closing the browser tab.",
   "Offer Save, Discard and Cancel in the leave dialog when saving is possible."
  ],
  "accessibility": [
   "Announce a save bar when it appears, through a polite live region.",
   "Move focus into the leave dialog and return it on cancel.",
   "Do not mark changes with color alone."
  ],
  "content": [
   "Say \"You have unsaved changes\".",
   "Label buttons by outcome: \"Save\", \"Discard changes\", \"Keep editing\"."
  ],
  "map": [
   [
    "Polaris",
    "Contextual save bar",
    "Direct"
   ],
   [
    "Atlassian",
    "Modal dialog (leave warning)",
    "Partial"
   ]
  ],
  "commonGround": "Polaris defines a contextual save bar with save and discard; Atlassian and general practice add a confirmation dialog before leaving. Both warn only when real changes exist.",
  "sources": [
   "https://polaris-react.shopify.com/components/feedback-indicators/contextual-save-bar",
   "https://atlassian.design/components/modal-dialog"
  ]
 },
 "overlays|Non-modal dialog": {
  "text": "A dialog that floats above the page while people can still use the content behind it.",
  "purpose": "Keeps a secondary task or tool open alongside the main content without blocking it.",
  "use": [
   "Tools people consult while working, such as find and replace or a properties palette.",
   "The dialog's content and the page are used together."
  ],
  "avoid": [
   "Decisions that must be made before continuing: use a modal dialog.",
   "Content tied to one element: use a popover."
  ],
  "anatomy": [
   "Container — an elevated surface without a scrim.",
   "Header — title and close button.",
   "Body — the tool or content.",
   "Footer — optional actions."
  ],
  "behavior": [
   "Do not trap focus; people can move between the dialog and the page.",
   "Let people move or close the dialog; keep it open until they close it.",
   "Close with Escape when focus is inside the dialog."
  ],
  "accessibility": [
   "Use role=dialog without aria-modal; take its accessible name from its title.",
   "Provide a keyboard way, such as F6 or a shortcut, to move focus between the dialog and the page.",
   "Return focus to the trigger when the dialog closes."
  ],
  "content": [
   "Title the dialog with the tool's name.",
   "Keep actions few and clearly labeled."
  ],
  "map": [
   [
    "Fluent 2",
    "Dialog (non-modal)",
    "Variant"
   ]
  ],
  "commonGround": "Fluent defines a non-modal dialog type and WAI-ARIA describes non-modal dialogs; other systems define only modal dialogs and use popovers or panels for non-blocking content.",
  "sources": [
   "https://fluent2.microsoft.design/components/web/react/core/dialog/usage",
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ]
 },
 "overlays|Prompt dialog": {
  "text": "A small modal dialog that asks for one short input, such as a name, before an action completes.",
  "purpose": "Collects one value needed to finish an action, without sending people to a separate page.",
  "use": [
   "Naming, renaming or labeling something as part of an action.",
   "One or two fields are enough."
  ],
  "avoid": [
   "Longer forms: use a page, side panel or full dialog.",
   "Do not use the browser's native prompt; it cannot be styled or validated."
  ],
  "anatomy": [
   "Title — the action, such as \"Rename asset\".",
   "Field — a labeled text input, prefilled when editing.",
   "Validation — inline error text below the field.",
   "Actions — a primary confirm button and Cancel."
  ],
  "behavior": [
   "Focus the field on open; select any prefilled text.",
   "Submit with Enter; cancel with Escape.",
   "Validate before closing; keep the dialog open on error.",
   "Disable nothing; show validation errors on submit instead."
  ],
  "accessibility": [
   "Use role=dialog with aria-modal=true; trap focus inside.",
   "Give the field a visible label, not only a placeholder.",
   "Return focus to the trigger on close."
  ],
  "content": [
   "Label the confirm button with the action, such as \"Rename\".",
   "Keep the title and button verb the same."
  ],
  "map": [
   [
    "Carbon",
    "Modal (input)",
    "Variant"
   ],
   [
    "Material 3",
    "Dialog (with text field)",
    "Partial"
   ],
   [
    "Spectrum",
    "Dialog (form)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon names an input modal variant and Material and Spectrum allow a short form in a dialog; all limit it to a few fields with a verb-labeled confirm action.",
  "sources": [
   "https://carbondesignsystem.com/components/modal/usage/",
   "https://m3.material.io/components/dialogs/guidelines",
   "https://spectrum.adobe.com/page/dialog/"
  ]
 },
 "overlays|Full-screen dialog": {
  "text": "A modal dialog that fills the viewport for a focused, self-contained task.",
  "purpose": "Gives a complex task the whole screen, clearly separate from the page underneath.",
  "use": [
   "Complex tasks such as editing a large object or composing content.",
   "Small screens where a standard dialog would be cramped."
  ],
  "avoid": [
   "Simple confirmations: use a standard dialog.",
   "People need to see the page behind: use a side panel."
  ],
  "anatomy": [
   "Header — title, close button and primary action.",
   "Body — the full-height content area.",
   "Footer — optional secondary actions."
  ],
  "behavior": [
   "Trap focus and lock page scroll while open.",
   "Ask before closing when there are unsaved changes.",
   "Close with Escape and the close button."
  ],
  "accessibility": [
   "Use role=dialog with aria-modal=true and an accessible name.",
   "Move focus to the title or first field on open; return it to the trigger on close.",
   "Keep the close button visible at all times."
  ],
  "content": [
   "Title with the task, such as \"Edit metadata\".",
   "Label the primary action with a verb such as \"Save\"."
  ],
  "map": [
   [
    "Material 3",
    "Full-screen dialog",
    "Direct"
   ],
   [
    "Spectrum",
    "Dialog (fullscreen)",
    "Variant"
   ],
   [
    "Carbon",
    "Modal (large)",
    "Partial"
   ]
  ],
  "commonGround": "Material and Spectrum both define a full-screen dialog for complex tasks, with Material focusing on compact screens. Carbon instead offers a large modal and, in IBM product extensions, a tearsheet.",
  "sources": [
   "https://m3.material.io/components/dialogs/guidelines",
   "https://spectrum.adobe.com/page/dialog/",
   "https://carbondesignsystem.com/components/modal/usage/"
  ]
 },
 "overlays|Wizard dialog": {
  "text": "A modal dialog that walks people through a short, ordered set of steps.",
  "purpose": "Breaks a task with dependent choices into manageable steps without leaving the page.",
  "use": [
   "Three to five steps where later steps depend on earlier choices.",
   "The task is short enough to finish in one sitting."
  ],
  "avoid": [
   "Long flows or flows people may pause: use a full page.",
   "A single form: use a dialog or page."
  ],
  "anatomy": [
   "Header — title and close button.",
   "Progress — a progress tracker or \"Step n of m\".",
   "Step content — the fields for the current step.",
   "Footer — Back, Next or Finish, and Cancel."
  ],
  "behavior": [
   "Validate each step before moving on.",
   "Keep entered values when people go back.",
   "Show a review step before the final action when the result is significant.",
   "Confirm before closing when values have been entered."
  ],
  "accessibility": [
   "Move focus to the step heading when the step changes.",
   "Announce the current step number.",
   "Keep the dialog size stable between steps so people stay oriented."
  ],
  "content": [
   "Name steps with short nouns.",
   "Label the last button with the outcome, such as \"Create\"."
  ],
  "map": [
   [
    "Carbon",
    "Modal (multi-step)",
    "Partial"
   ],
   [
    "Atlassian",
    "Modal dialog with progress tracker",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Atlassian allow a modal with a progress indicator for short multi-step tasks and move longer flows to full pages. Neither defines a dedicated wizard component.",
  "sources": [
   "https://carbondesignsystem.com/components/modal/usage/",
   "https://atlassian.design/components/progress-tracker"
  ]
 },
 "overlays|Navigation drawer": {
  "text": "A panel that slides in from the side with the app's main navigation.",
  "purpose": "Gives access to navigation on narrow screens or when the nav pane is collapsed.",
  "use": [
   "Narrow viewports where a persistent nav pane does not fit.",
   "Apps with many destinations."
  ],
  "avoid": [
   "Tools or details: use a side panel.",
   "Wide screens where a persistent nav pane fits."
  ],
  "anatomy": [
   "Scrim — dims the page in the modal form.",
   "Panel — the sliding surface.",
   "Header — optional app name and close button.",
   "Nav items — destinations, with the current one marked."
  ],
  "behavior": [
   "Open from a menu button; close on scrim click, Escape or selecting a destination.",
   "Use the modal form on small screens and a persistent nav pane on large ones.",
   "Keep the current destination visible when the drawer opens."
  ],
  "accessibility": [
   "Trap focus in the modal drawer and return it to the menu button on close.",
   "Wrap the items in a nav landmark and mark the current item with aria-current=page.",
   "Expose the menu button's expanded state with aria-expanded."
  ],
  "content": [
   "Use short nouns for destinations.",
   "Group items under brief section labels."
  ],
  "map": [
   [
    "Material 3",
    "Navigation drawer",
    "Direct"
   ],
   [
    "Fluent 2",
    "Drawer (navigation)",
    "Partial"
   ],
   [
    "Carbon",
    "UI shell left panel",
    "Partial"
   ],
   [
    "Atlassian",
    "Side navigation",
    "Partial"
   ]
  ],
  "commonGround": "Material and Fluent agree on a modal drawer for small screens and a persistent pane on large ones, with the current item marked. Carbon and Atlassian treat it as the collapsed form of their side navigation.",
  "sources": [
   "https://m3.material.io/components/navigation-drawer/overview",
   "https://fluent2.microsoft.design/components/web/react/core/drawer/usage",
   "https://carbondesignsystem.com/components/UI-shell-left-panel/usage/",
   "https://atlassian.design/components/side-navigation"
  ]
 },
 "overlays|Bottom sheet": {
  "text": "Slides up from the bottom of the screen to show secondary content or actions.",
  "purpose": "Puts actions and details within thumb reach on small and touch screens.",
  "use": [
   "Action lists, filters or short details on narrow or touch screens.",
   "The small-screen form of a popover or menu."
  ],
  "avoid": [
   "Desktop layouts: use a popover, menu or side panel.",
   "Do not put long, complex forms in a bottom sheet."
  ],
  "anatomy": [
   "Scrim — dims the page in the modal form.",
   "Sheet — the surface anchored to the bottom edge.",
   "Drag handle — shows the sheet can be resized or dismissed.",
   "Content — actions or details."
  ],
  "behavior": [
   "Dismiss on scrim tap, swipe down, Escape or a close action.",
   "Size to its content up to a maximum height, then scroll inside.",
   "Keep the page behind still while the modal sheet is open."
  ],
  "accessibility": [
   "Use role=dialog with aria-modal=true for the modal form.",
   "Provide a visible close button as well as swipe.",
   "Make the drag handle a keyboard-operable control, or hide it from assistive tech."
  ],
  "content": [
   "Add a short title when the content is not self-explanatory.",
   "Use verb labels for actions."
  ],
  "map": [
   [
    "Material 3",
    "Bottom sheet",
    "Direct"
   ],
   [
    "Spectrum",
    "Tray",
    "Partial"
   ],
   [
    "Fluent 2",
    "Bottom sheet (mobile)",
    "Partial"
   ]
  ],
  "commonGround": "Material and Spectrum agree that bottom sheets or trays are for small screens and replace popovers there; both support swipe and explicit close.",
  "sources": [
   "https://m3.material.io/components/bottom-sheets/overview",
   "https://spectrum.adobe.com/page/tray/",
   "https://fluent2.microsoft.design/components/ios/core/bottomsheet/usage"
  ]
 },
 "overlays|Help panel": {
  "text": "A side panel that shows help next to the page without leaving the current task.",
  "purpose": "People read guidance while they work, without losing context in a separate help site.",
  "use": [
   "Task-specific help, documentation or how-to content.",
   "Help is longer than a tooltip or toggletip allows."
  ],
  "avoid": [
   "One-line hints: use helper text or contextual help.",
   "Required steps of a task."
  ],
  "anatomy": [
   "Panel — a side surface, usually on the right.",
   "Header — title and close button.",
   "Body — headings, short paragraphs and links.",
   "Footer — optional links to full documentation or support."
  ],
  "behavior": [
   "Open from a help button; keep the page usable beside it.",
   "Update the content to match the current page or selection.",
   "Remember whether the panel was open across pages."
  ],
  "accessibility": [
   "Use a complementary landmark or non-modal dialog with an accessible name.",
   "Move focus into the panel on open and back to the trigger on close.",
   "Open external links in a way that is announced."
  ],
  "content": [
   "Write task-focused help in short sections.",
   "Link to full documentation instead of repeating it."
  ],
  "map": [
   [
    "Carbon",
    "UI shell right panel",
    "Partial"
   ],
   [
    "Atlassian",
    "Help",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Atlassian provide side panels for in-product help that keep the page usable; AWS Cloudscape is the clearest dedicated definition outside the six systems.",
  "sources": [
   "https://carbondesignsystem.com/components/UI-shell-right-panel/usage/",
   "https://atlassian.design/components/help"
  ]
 },
 "overlays|Popover": {
  "text": "A small, non-modal surface anchored to a trigger; shows extra content or controls.",
  "purpose": "Shows related content or controls in context, without leaving the page or opening a dialog.",
  "use": [
   "Short forms, filters, details or option sets tied to one trigger.",
   "Content is interactive and too rich for a tooltip."
  ],
  "avoid": [
   "Plain text hints: use a tooltip.",
   "Critical decisions: use a modal dialog.",
   "Do not nest popovers."
  ],
  "anatomy": [
   "Trigger — the button that opens it.",
   "Surface — an elevated container with optional caret.",
   "Content — text, controls or a short form.",
   "Close — optional close button for complex content."
  ],
  "behavior": [
   "Open on click or Enter, not on hover.",
   "Close on Escape, outside click or selecting a final action.",
   "Reposition to stay in the viewport.",
   "Return focus to the trigger on close."
  ],
  "accessibility": [
   "Set aria-expanded and aria-controls on the trigger.",
   "Use role=dialog for interactive content; move focus into it.",
   "Keep the surface reachable without a pointer."
  ],
  "content": [
   "Keep content brief and focused on one topic.",
   "Add a title only when the content needs context."
  ],
  "map": [
   [
    "Carbon",
    "Popover",
    "Direct"
   ],
   [
    "Fluent 2",
    "Popover",
    "Direct"
   ],
   [
    "Polaris",
    "Popover",
    "Direct"
   ],
   [
    "Spectrum",
    "Popover",
    "Direct"
   ],
   [
    "Atlassian",
    "Popup",
    "Partial"
   ]
  ],
  "commonGround": "All agree a popover is click-triggered, anchored, non-modal, dismissed by Escape or outside click, and repositioned to stay visible. Systems differ on the caret: Carbon and Fluent show it as an option, Polaris does not use one.",
  "sources": [
   "https://carbondesignsystem.com/components/popover/usage/",
   "https://fluent2.microsoft.design/components/web/react/core/popover/usage",
   "https://polaris-react.shopify.com/components/overlays/popover",
   "https://spectrum.adobe.com/page/popover/",
   "https://atlassian.design/components/popup"
  ]
 },
 "overlays|Popup": {
  "text": "A generic floating container anchored to a trigger; the base for menus, pickers and popovers.",
  "purpose": "One consistent layer for anchored, dismissible content, so no component reinvents it.",
  "use": [
   "The base for custom anchored content that is not a menu or listbox.",
   "A popover with fully custom content."
  ],
  "avoid": [
   "Direct use when a menu, select or tooltip fits: use that component.",
   "Content people must act on before continuing: use a modal dialog."
  ],
  "anatomy": [
   "Trigger — the control that opens it.",
   "Container — the elevated surface.",
   "Content — any custom content."
  ],
  "behavior": [
   "Open on click; close on Escape or outside click.",
   "Position relative to the trigger and flip when out of space.",
   "Manage focus according to the content type."
  ],
  "accessibility": [
   "Set aria-haspopup on the trigger to the matching type, such as dialog or menu.",
   "Set aria-expanded on the trigger.",
   "Return focus to the trigger on close."
  ],
  "content": [
   "Follow the content rules of the component the popup hosts.",
   "Add a heading only when the content is not clear from the trigger label."
  ],
  "map": [
   [
    "Atlassian",
    "Popup",
    "Direct"
   ],
   [
    "Carbon",
    "Popover",
    "Partial"
   ],
   [
    "Fluent 2",
    "Popover",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian names Popup as its base anchored container, and Carbon and Fluent use their popover the same way. All agree it is click-triggered and dismissible by Escape.",
  "sources": [
   "https://atlassian.design/components/popup",
   "https://carbondesignsystem.com/components/popover/usage/",
   "https://fluent2.microsoft.design/components/web/react/core/popover/usage"
  ]
 },
 "overlays|Inline dialog": {
  "text": "A small anchored dialog with extra information or a short interaction next to the element it explains.",
  "purpose": "Gives more detail or a quick action in place, without the weight of a modal dialog.",
  "use": [
   "Explanations or short interactions tied to one element.",
   "The content may include links or buttons."
  ],
  "avoid": [
   "Plain one-line text: use a tooltip.",
   "Long forms: use a modal dialog or side panel."
  ],
  "anatomy": [
   "Trigger — the element it explains.",
   "Surface — the anchored container.",
   "Content — text and optional links or buttons."
  ],
  "behavior": [
   "Open on click; close on Escape or outside click.",
   "Keep it non-modal so the page stays usable.",
   "Return focus to the trigger on close."
  ],
  "accessibility": [
   "Use role=dialog with an accessible name when the content is interactive.",
   "Set aria-expanded on the trigger.",
   "Make every link and button reachable by keyboard."
  ],
  "content": [
   "Keep it to a short paragraph.",
   "Link to more detail instead of expanding the dialog."
  ],
  "map": [
   [
    "Atlassian",
    "Inline dialog",
    "Direct"
   ],
   [
    "Carbon",
    "Toggletip",
    "Partial"
   ],
   [
    "Fluent 2",
    "Popover",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian defines inline dialog directly and now steers people to Popup; Carbon's toggletip and Fluent's popover serve the same role. All open on click and stay non-modal.",
  "sources": [
   "https://atlassian.design/components/inline-dialog",
   "https://carbondesignsystem.com/components/toggletip/usage/",
   "https://fluent2.microsoft.design/components/web/react/core/popover/usage"
  ]
 },
 "overlays|Hover card": {
  "text": "Appears on hover or focus over a link or name to preview an object, such as a person or file.",
  "purpose": "Lets people preview details without opening the object.",
  "use": [
   "Names, avatars and links, to preview the linked object.",
   "The preview saves people a page visit."
  ],
  "avoid": [
   "Do not put essential information or actions only in a hover card.",
   "Touch-only interfaces: open the object or a popover on tap instead."
  ],
  "anatomy": [
   "Trigger — a link, name or avatar.",
   "Card — an elevated surface with a summary of the object.",
   "Actions — optional quick actions such as Message or Open."
  ],
  "behavior": [
   "Open after a short hover delay and on keyboard focus.",
   "Keep it open while the pointer moves into the card.",
   "Close on Escape, pointer leave or blur."
  ],
  "accessibility": [
   "Make the card available on focus, not only hover.",
   "Let people dismiss it with Escape without moving focus.",
   "Do not make it the only route to its actions."
  ],
  "content": [
   "Show a compact summary: name, type and a few key facts.",
   "Keep actions to one or two."
  ],
  "map": [
   [
    "Fluent 2",
    "Hover card",
    "Partial"
   ],
   [
    "Atlassian",
    "Profile card",
    "Partial"
   ]
  ],
  "commonGround": "Fluent and Atlassian both preview people on hover and focus with a short delay and quick actions. Neither treats the card as the only route to its actions.",
  "sources": [
   "https://atlassian.design/components/profilecard",
   "https://developer.microsoft.com/en-us/fluentui#/controls/web/hovercard"
  ]
 },
 "overlays|Rich tooltip": {
  "text": "A tooltip with a title, a short paragraph and an optional link or action.",
  "purpose": "Explains a feature or term in more depth than a plain tooltip, without opening a dialog.",
  "use": [
   "Explaining a feature or setting in two or three sentences.",
   "A link to more help is useful."
  ],
  "avoid": [
   "One-word labels: use a plain tooltip.",
   "Do not put essential task steps in it."
  ],
  "anatomy": [
   "Trigger — the element being explained, or an info icon.",
   "Container — an elevated surface.",
   "Title — optional short heading.",
   "Body and action — a short paragraph and an optional link or button."
  ],
  "behavior": [
   "Open on click when it contains interactive elements; on hover or focus only when it is text-only.",
   "Close on Escape or outside click.",
   "Keep it open while the pointer is over it."
  ],
  "accessibility": [
   "Use a toggletip pattern with a button trigger when the tooltip contains actions.",
   "Announce the content through aria-describedby or a live region.",
   "Make links inside reachable by Tab."
  ],
  "content": [
   "Keep the body to two or three short sentences.",
   "Use a link label that names the destination."
  ],
  "map": [
   [
    "Material 3",
    "Rich tooltip",
    "Direct"
   ],
   [
    "Carbon",
    "Toggletip",
    "Partial"
   ],
   [
    "Spectrum",
    "Contextual help",
    "Partial"
   ]
  ],
  "commonGround": "Material defines rich tooltips and Carbon and Spectrum provide click-opened equivalents; all agree interactive content must not depend on hover.",
  "sources": [
   "https://m3.material.io/components/tooltips/guidelines",
   "https://carbondesignsystem.com/components/toggletip/usage/",
   "https://spectrum.adobe.com/page/contextual-help/"
  ]
 },
 "overlays|Teaching bubble": {
  "text": "An anchored callout that introduces a feature or guides people through a short tour.",
  "purpose": "Draws attention to a new or useful feature when it is relevant.",
  "use": [
   "Introducing a new feature once, next to where it lives.",
   "Short tours of two to five steps."
  ],
  "avoid": [
   "Errors or required information.",
   "Do not show more than one at a time or interrupt a task in progress."
  ],
  "anatomy": [
   "Callout — an emphasized anchored surface with a caret.",
   "Title and body — the feature name and one or two sentences.",
   "Media — an optional image.",
   "Actions — a primary action, dismiss, and step navigation in tours."
  ],
  "behavior": [
   "Show once per person and remember dismissal.",
   "Let people dismiss it at any time.",
   "Highlight the target element while the bubble is open."
  ],
  "accessibility": [
   "Use role=dialog with an accessible name; non-modal unless part of a modal tour.",
   "Move focus into the bubble when it opens from a tour step, and back afterward.",
   "Close with Escape."
  ],
  "content": [
   "Lead with what the feature does for the person.",
   "Keep body text under about 25 words."
  ],
  "map": [
   [
    "Fluent 2",
    "Teaching popover",
    "Direct"
   ],
   [
    "Atlassian",
    "Spotlight (onboarding)",
    "Partial"
   ]
  ],
  "commonGround": "Fluent and Atlassian agree on a dismissible, anchored callout shown once per person, with step navigation for tours.",
  "sources": [
   "https://fluent2.microsoft.design/components/web/react/core/teachingpopover/usage",
   "https://atlassian.design/components/onboarding"
  ]
 },
 "overlays|Contextual help": {
  "text": "A small help icon next to a label or heading; opens a short explanation on click.",
  "purpose": "Gives help exactly where questions arise without cluttering the interface.",
  "use": [
   "Next to field labels, headings or settings that need explanation.",
   "The explanation is a few sentences and may include a link."
  ],
  "avoid": [
   "Information everyone needs: put it in helper text.",
   "Errors or warnings."
  ],
  "anatomy": [
   "Trigger — an info or help icon button.",
   "Popover — an anchored surface.",
   "Heading and body — a short title and explanation.",
   "Link — an optional link to more help."
  ],
  "behavior": [
   "Open on click or Enter; close on Escape or outside click.",
   "Return focus to the icon on close.",
   "Keep the popover non-modal."
  ],
  "accessibility": [
   "Give the icon button an accessible name such as \"More info about storage\".",
   "Make the target at least 24 by 24 px.",
   "Use the info variant for neutral help and a help variant only for how-to content."
  ],
  "content": [
   "Write a short heading and one or two sentences.",
   "Explain why, not just what."
  ],
  "map": [
   [
    "Spectrum",
    "Contextual help",
    "Direct"
   ],
   [
    "Carbon",
    "Toggletip",
    "Partial"
   ],
   [
    "Fluent 2",
    "Info label",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum, Carbon and Fluent agree on a click-opened icon button with a short explanation in a non-modal popover.",
  "sources": [
   "https://spectrum.adobe.com/page/contextual-help/",
   "https://carbondesignsystem.com/components/toggletip/usage/",
   "https://fluent2.microsoft.design/components/web/react/core/infolabel/usage"
  ]
 },
 "overlays|Context menu": {
  "text": "A menu of actions for an object; opens on right-click, long press or a keyboard shortcut.",
  "purpose": "Gives fast access to object actions where people are already working.",
  "use": [
   "Dense work surfaces such as tables, grids and canvases.",
   "A shortcut to actions that are also available elsewhere."
  ],
  "avoid": [
   "Do not make it the only way to reach an action.",
   "Touch-only screens without a long-press or visible alternative."
  ],
  "anatomy": [
   "Menu surface — an elevated list near the pointer.",
   "Items — actions with optional icons and shortcuts.",
   "Separators and groups — divide related actions.",
   "Submenus — optional nested items."
  ],
  "behavior": [
   "Open at the pointer on right-click, or at the focused item on Shift+F10 or the Menu key.",
   "Act on the selection when several items are selected.",
   "Close on Escape, selection or outside click."
  ],
  "accessibility": [
   "Use role=menu with menuitem children and arrow-key navigation.",
   "Move focus to the first item on open and return it to the object on close.",
   "Show disabled items, not hide them, when position matters."
  ],
  "content": [
   "Start item labels with verbs.",
   "Order items by frequency and group destructive actions last."
  ],
  "map": [
   [
    "Carbon",
    "Menu",
    "Direct"
   ],
   [
    "Fluent 2",
    "Menu",
    "Partial"
   ],
   [
    "Material 3",
    "Menu",
    "Partial"
   ],
   [
    "Spectrum",
    "Menu",
    "Partial"
   ]
  ],
  "commonGround": "All define a menu surface with keyboard navigation; Carbon and Fluent explicitly support right-click context menus. They agree the context menu must not be the only route to an action.",
  "sources": [
   "https://carbondesignsystem.com/components/menu/usage/",
   "https://fluent2.microsoft.design/components/web/react/core/menu/usage",
   "https://m3.material.io/components/menus/guidelines",
   "https://spectrum.adobe.com/page/menu/"
  ]
 },
 "overlays|Anchored overlay": {
  "text": "The shared behavior for any overlay attached to and positioned relative to a trigger element.",
  "purpose": "Gives tooltips, popovers, menus and pickers one consistent way to open, position and dismiss.",
  "use": [
   "The base for any new component that floats next to a trigger.",
   "Content must stay visually linked to its source."
  ],
  "avoid": [
   "Content not tied to an element: use a dialog or panel.",
   "Do not build a new anchoring behavior for each component."
  ],
  "anatomy": [
   "Anchor — the trigger element.",
   "Overlay — the floating surface.",
   "Caret — optional pointer to the anchor.",
   "Offset — the gap between anchor and overlay."
  ],
  "behavior": [
   "Place on a preferred side and flip or shift to stay in the viewport.",
   "Follow the anchor on scroll and resize; close if the anchor leaves view.",
   "Close on Escape and outside click unless the overlay is modal."
  ],
  "accessibility": [
   "Link the anchor and overlay with aria-expanded, aria-controls or aria-describedby.",
   "Keep focus order logical even when the overlay renders in a portal.",
   "Return focus to the anchor on close."
  ],
  "content": [
   "Follow the content rules of the component that uses it.",
   "Keep overlay content short enough to fit without scrolling, where possible."
  ],
  "map": [
   [
    "Fluent 2",
    "Positioning",
    "Partial"
   ],
   [
    "Atlassian",
    "Popup",
    "Partial"
   ],
   [
    "Spectrum",
    "Popover",
    "Partial"
   ]
  ],
  "commonGround": "Fluent, Atlassian and Spectrum share one positioning and dismissal behavior across their anchored overlays, with flip and shift to stay in view.",
  "sources": [
   "https://react.fluentui.dev/?path=/docs/concepts-developer-positioning-components--docs",
   "https://atlassian.design/components/popup",
   "https://spectrum.adobe.com/page/popover/"
  ]
 },
 "overlays|Popconfirm": {
  "text": "A small popover anchored to an action; asks people to confirm it before it runs.",
  "purpose": "Adds a lightweight check before a risky action, without the interruption of a full dialog.",
  "use": [
   "Moderately risky single-item actions, such as removing a row.",
   "The question fits in one sentence."
  ],
  "avoid": [
   "Irreversible or high-impact actions: use a modal confirmation dialog.",
   "Undo is possible: act immediately and offer undo."
  ],
  "anatomy": [
   "Trigger — the action button.",
   "Popover — an anchored surface.",
   "Question — one sentence naming the action and object.",
   "Actions — a confirm button and Cancel."
  ],
  "behavior": [
   "Open on click of the action; focus Cancel or the confirm button.",
   "Run the action only on confirm.",
   "Close on Escape, Cancel or outside click without running the action."
  ],
  "accessibility": [
   "Use role=alertdialog with the question as its accessible description.",
   "Return focus to the trigger on close.",
   "Make both buttons at least 24 by 24 px."
  ],
  "content": [
   "Ask a direct question, such as \"Remove this tag?\"",
   "Label the confirm button with the action verb, not \"Yes\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice. The pattern is common in Ant Design and similar libraries.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/"
  ],
  "map": []
 },
 "overlays|Expand / collapse": {
  "text": "Shows or hides a block of related content under a heading or trigger.",
  "purpose": "Reduces clutter: people reveal secondary content only when they need it.",
  "use": [
   "Optional or advanced content that most people do not need.",
   "Long pages where scanning headings helps."
  ],
  "avoid": [
   "Do not hide content everyone needs.",
   "Do not nest more than one level of collapsible sections."
  ],
  "anatomy": [
   "Trigger — a heading or button with a chevron.",
   "Chevron — rotates to show state.",
   "Content region — the hidden or shown block."
  ],
  "behavior": [
   "Toggle on click, Enter or Space.",
   "Keep the trigger in place; push following content down.",
   "Remember the state when people return, where useful."
  ],
  "accessibility": [
   "Use a button with aria-expanded and aria-controls.",
   "Wrap the button in a heading when it labels a section.",
   "Do not move focus when content expands."
  ],
  "content": [
   "Write a trigger label that describes the hidden content.",
   "Do not use \"Click here\" or \"More\" alone."
  ],
  "map": [
   [
    "Polaris",
    "Collapsible",
    "Direct"
   ],
   [
    "Carbon",
    "Accordion",
    "Partial"
   ],
   [
    "Fluent 2",
    "Accordion",
    "Partial"
   ],
   [
    "Spectrum",
    "Disclosure",
    "Direct"
   ]
  ],
  "commonGround": "All agree on a button trigger with an expanded state, a rotating chevron and content pushed in place, matching the WAI-ARIA disclosure pattern.",
  "sources": [
   "https://polaris-react.shopify.com/components/utilities/collapsible",
   "https://carbondesignsystem.com/components/accordion/usage/",
   "https://fluent2.microsoft.design/components/web/react/core/accordion/usage",
   "https://spectrum.adobe.com/page/accordion/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
  ]
 },
 "overlays|Details": {
  "text": "A single collapsible block with a short summary line; reveals more information when opened.",
  "purpose": "Offers optional detail inline for the few people who need it.",
  "use": [
   "One optional explanation inside a page or form.",
   "Most people will not need the hidden content."
  ],
  "avoid": [
   "Several in a row: use an accordion.",
   "Do not hide content needed to complete the task."
  ],
  "anatomy": [
   "Summary — the always-visible trigger text with an indicator.",
   "Content — the revealed text."
  ],
  "behavior": [
   "Toggle on click, Enter or Space.",
   "Start closed by default.",
   "Use the native details and summary elements where possible."
  ],
  "accessibility": [
   "Prefer native details and summary, so state is announced by default.",
   "Keep the summary text descriptive and focusable."
  ],
  "content": [
   "Write the summary as a question or short phrase, such as \"Why do we need this?\"",
   "Keep the content short."
  ],
  "map": [
   [
    "Spectrum",
    "Disclosure",
    "Partial"
   ],
   [
    "Polaris",
    "Collapsible",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum and Polaris provide single-item disclosures; GOV.UK's details component and the WAI-ARIA disclosure pattern cross-check the summary-plus-content form.",
  "sources": [
   "https://spectrum.adobe.com/page/accordion/",
   "https://polaris-react.shopify.com/components/utilities/collapsible",
   "https://design-system.service.gov.uk/components/details/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
  ]
 },
 "overlays|Show more / less": {
  "text": "A quiet button that reveals the rest of a long list or text block, then hides it again.",
  "purpose": "Keeps long lists and text short by default, with the full content one action away.",
  "use": [
   "Lists or text where the first few items matter most.",
   "Loading everything at once is cheap."
  ],
  "avoid": [
   "Large data sets: use pagination or load more.",
   "Content that is mostly needed: show it in full."
  ],
  "anatomy": [
   "Visible portion — the first items or lines.",
   "Toggle — a text button such as \"Show 12 more\".",
   "Hidden portion — the remaining content."
  ],
  "behavior": [
   "Reveal content in place and change the label to \"Show less\".",
   "Keep focus on the toggle, or move it to the first newly shown item.",
   "Scroll back to the toggle when collapsing a long block."
  ],
  "accessibility": [
   "Use a button with aria-expanded.",
   "Announce the number of items revealed when helpful."
  ],
  "content": [
   "Include the count when known, such as \"Show 8 more\".",
   "Pair \"Show more\" with \"Show less\"."
  ],
  "map": [
   [
    "Polaris",
    "Collapsible",
    "Partial"
   ],
   [
    "Carbon",
    "Overflow content",
    "Partial"
   ]
  ],
  "commonGround": "Polaris and Carbon both reveal overflowing lists and text in place with a clear toggle; neither defines a dedicated component.",
  "sources": [
   "https://polaris-react.shopify.com/components/utilities/collapsible",
   "https://carbondesignsystem.com/patterns/overflow-content/"
  ]
 },
 "overlays|Truncate / expand": {
  "text": "Shortens text with an ellipsis and lets people see the full text.",
  "purpose": "Keeps dense layouts tidy with the full text still available.",
  "use": [
   "Long names and descriptions in tables, cards and lists.",
   "The full text is not needed to scan."
  ],
  "avoid": [
   "Button labels or critical values: rewrite or wrap instead of truncating.",
   "Do not truncate text that people must compare across rows without a way to see it all."
  ],
  "anatomy": [
   "Truncated text — text cut with an ellipsis at line or character limits.",
   "Reveal — a tooltip, Show more link or expanded view with the full text."
  ],
  "behavior": [
   "Truncate at the end for prose and in the middle for file names and paths when the end matters.",
   "For single-line truncation, show the full text in a tooltip on hover and focus.",
   "Use an inline Show more for multi-line clamps."
  ],
  "accessibility": [
   "Keep the full text available to screen readers.",
   "Make the full text reachable by keyboard, not only on hover."
  ],
  "content": [
   "Put the most important words first so they survive truncation.",
   "Write names and descriptions short enough that truncation is rare."
  ],
  "map": [
   [
    "Carbon",
    "Overflow content",
    "Direct"
   ],
   [
    "Polaris",
    "Text (truncate)",
    "Partial"
   ],
   [
    "Fluent 2",
    "Text (truncate)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Polaris and Fluent agree on ellipsis truncation that reveals the full text; Carbon adds front, middle and end truncation positions.",
  "sources": [
   "https://carbondesignsystem.com/patterns/overflow-content/",
   "https://polaris-react.shopify.com/components/typography/text",
   "https://fluent2.microsoft.design/components/web/react/core/text/usage"
  ]
 },
 "overlays|Backdrop / scrim": {
  "text": "A translucent layer behind a modal overlay; dims and blocks the page underneath.",
  "purpose": "Focuses attention on the modal layer and shows the page behind is unavailable.",
  "use": [
   "Behind modal dialogs, modal drawers and modal sheets.",
   "Only when the layer above blocks the page."
  ],
  "avoid": [
   "Behind non-modal popovers, menus or tooltips.",
   "Several stacked scrims: one modal layer at a time."
  ],
  "anatomy": [
   "Layer — a full-viewport surface below the modal.",
   "Color — a semi-transparent overlay color token."
  ],
  "behavior": [
   "Block pointer interaction with the page.",
   "Close the modal on scrim click only when dismissing is safe and loses no data.",
   "Fade in and out with the modal."
  ],
  "accessibility": [
   "Make the page behind inert, so keyboard and screen readers cannot reach it.",
   "Keep the modal's own contrast independent of the scrim."
  ],
  "content": [
   "Do not place text or controls on the scrim.",
   "Put any explanation in the modal surface above it."
  ],
  "map": [
   [
    "Material 3",
    "Scrim",
    "Direct"
   ],
   [
    "Atlassian",
    "Blanket",
    "Direct"
   ],
   [
    "Carbon",
    "Overlay",
    "Partial"
   ],
   [
    "Spectrum",
    "Underlay",
    "Partial"
   ],
   [
    "Fluent 2",
    "Dialog backdrop",
    "Partial"
   ]
  ],
  "commonGround": "All systems use a translucent layer behind modal surfaces only, and treat the page behind as unavailable. They differ on whether clicking it closes the modal.",
  "sources": [
   "https://m3.material.io/components/dialogs/guidelines",
   "https://atlassian.design/components/blanket",
   "https://carbondesignsystem.com/components/modal/usage/",
   "https://spectrum.adobe.com/page/dialog/"
  ]
 },
 "overlays|Scroll lock": {
  "text": "Stops the page from scrolling while a modal layer is open.",
  "purpose": "Keeps people's place on the page and prevents confusing movement behind a modal.",
  "use": [
   "A modal dialog, modal drawer or modal sheet is open.",
   "A full-screen overlay covers the page."
  ],
  "avoid": [
   "Do not lock scroll for non-modal popovers, menus or tooltips.",
   "Do not lock scroll inside the modal itself."
  ],
  "anatomy": [
   "Locked root — the page scroll container with scrolling disabled.",
   "Scrollbar gap — padding that replaces the hidden scrollbar width."
  ],
  "behavior": [
   "Lock on open and restore the exact scroll position on close.",
   "Compensate for the scrollbar width so the layout does not shift.",
   "Support nested modals by unlocking only when the last one closes."
  ],
  "accessibility": [
   "Pair scroll lock with an inert background so assistive tech also stays in the modal.",
   "Keep content inside the modal scrollable by keyboard."
  ],
  "content": [
   "Scroll lock has no text of its own.",
   "Give modal content that needs scrolling a visible scroll affordance."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ],
  "map": []
 },
 "overlays|Portal": {
  "text": "Renders an overlay at the end of the document instead of inside its parent's layout.",
  "purpose": "Lets overlays escape parent clipping and stacking, so they always show on top.",
  "use": [
   "Dialogs, popovers, menus, tooltips and toasts.",
   "A parent has overflow hidden or its own stacking context."
  ],
  "avoid": [
   "Do not portal inline content that belongs in the page flow.",
   "Do not portal without fixing focus order and event handling."
  ],
  "anatomy": [
   "Portal host — a container at the document root.",
   "Layer order — a z-index token per overlay type."
  ],
  "behavior": [
   "Mount the overlay in the host on open; unmount it on close.",
   "Stack layers by role: page, sticky, overlay, modal, toast, tooltip.",
   "Keep theme and density settings applied inside the portal."
  ],
  "accessibility": [
   "Move focus into portaled content; return it to the trigger on close.",
   "Link trigger and content with ARIA attributes, since DOM order no longer shows their relationship."
  ],
  "content": [
   "A portal has no text of its own.",
   "Follow the content rules of the overlay rendered in it."
  ],
  "map": [
   [
    "Atlassian",
    "Portal",
    "Direct"
   ],
   [
    "Fluent 2",
    "Portal",
    "Direct"
   ]
  ],
  "commonGround": "Atlassian and Fluent both ship a portal utility with defined layer order and render all overlays through it.",
  "sources": [
   "https://atlassian.design/components/portal",
   "https://react.fluentui.dev/?path=/docs/components-portal-portal--docs"
  ]
 },
 "overlays|Floating positioning": {
  "text": "Places a floating element next to its anchor and keeps it inside the viewport.",
  "purpose": "Keeps overlays visible and connected to their trigger on any screen size and scroll position.",
  "use": [
   "Every anchored overlay: tooltips, popovers, menus and pickers.",
   "Use the same placement names and offsets across all components."
  ],
  "avoid": [
   "Do not hard-code overlay coordinates.",
   "Do not let an overlay cover its own trigger, unless it is a menu that replaces it."
  ],
  "anatomy": [
   "Placement — preferred side and alignment, such as bottom-start.",
   "Offset — the gap from the anchor on the spacing grid.",
   "Collision boundary — the viewport or scroll container.",
   "Fallbacks — flip and shift rules."
  ],
  "behavior": [
   "Flip to the opposite side when there is not enough space, then shift along the edge.",
   "Update position on scroll, resize and content change.",
   "Match overlay width to the anchor for selects and comboboxes."
  ],
  "accessibility": [
   "Keep the overlay close enough to its trigger for zoomed users to find it.",
   "Do not reposition while people are reading unless the anchor moved."
  ],
  "content": [
   "Positioning has no text of its own.",
   "Keep overlay text short so the overlay fits on its preferred side."
  ],
  "map": [
   [
    "Fluent 2",
    "Positioning",
    "Direct"
   ],
   [
    "Atlassian",
    "Popup (placement)",
    "Partial"
   ],
   [
    "Carbon",
    "Popover (alignment)",
    "Partial"
   ]
  ],
  "commonGround": "Fluent, Atlassian and Carbon agree on named placements with automatic flip and shift to stay in view.",
  "sources": [
   "https://react.fluentui.dev/?path=/docs/concepts-developer-positioning-components--docs",
   "https://atlassian.design/components/popup",
   "https://carbondesignsystem.com/components/popover/usage/"
  ]
 },
 "page-structures|Footer": {
  "text": "The area at the bottom of the app shell for status, secondary links or help.",
  "purpose": "A stable place for secondary information, such as status, version or help links, that should not compete with page content.",
  "use": [
   "Persistent status such as sync state, counts or selection summary.",
   "Secondary links such as help, legal and version."
  ],
  "avoid": [
   "Primary actions: use the page header or page actions bar.",
   "Do not repeat main navigation in an app footer."
  ],
  "anatomy": [
   "Container — a full-width strip in the AppShell footer area, above both panes.",
   "Status region — optional live status text.",
   "Links — optional help and legal links."
  ],
  "behavior": [
   "Keep the footer the same on every page of an app.",
   "Keep it short so it does not take space from content.",
   "Update status text in place without moving layout."
  ],
  "accessibility": [
   "Use a contentinfo landmark for the footer.",
   "Put changing status in a polite live region.",
   "Keep link targets at least 24 by 24 px."
  ],
  "content": [
   "Use short labels and plain status text.",
   "Show versions and dates in the monospace technical style."
  ],
  "map": [
   [
    "Polaris",
    "Footer help",
    "Partial"
   ],
   [
    "Carbon",
    "Footer (IBM.com)",
    "Partial"
   ]
  ],
  "commonGround": "Polaris and Carbon's web extensions agree the footer holds secondary help and links, never primary actions. App status footers are general practice.",
  "sources": [
   "https://polaris-react.shopify.com/components/navigation/footer-help",
   "https://www.ibm.com/standards/carbon/web-components/footer"
  ]
 },
 "page-structures|Two-pane workspace": {
  "text": "A list or navigation pane beside a detail or content pane.",
  "purpose": "Lets people browse a collection and see the selected item's details without leaving the list.",
  "use": [
   "List-detail work such as files and their properties, or messages and their content.",
   "Medium and wide screens where both panes fit."
  ],
  "avoid": [
   "The detail needs the full width: open it as a page.",
   "Narrow screens: show one pane at a time."
  ],
  "anatomy": [
   "Primary pane — the list or navigation.",
   "Detail pane — the selected item's content.",
   "Divider — an optional resizable boundary."
  ],
  "behavior": [
   "Update the detail pane when the selection changes, without reloading the list.",
   "On narrow screens, collapse to one pane at a time with a back control.",
   "Keep the selection visible in the list.",
   "Remember pane sizes when resizable."
  ],
  "accessibility": [
   "Give each pane a landmark or region with an accessible name.",
   "Keep focus in the list when the selection changes; offer a shortcut to the detail pane.",
   "When resizable, make the divider a focusable separator operable with arrow keys."
  ],
  "content": [
   "Show an empty-state prompt in the detail pane when nothing is selected.",
   "Use the item name as the detail pane heading."
  ],
  "map": [
   [
    "Material 3",
    "List-detail (canonical layout)",
    "Direct"
   ],
   [
    "Polaris",
    "Layout (two columns)",
    "Partial"
   ],
   [
    "Fluent 2",
    "Layout (list/detail)",
    "Partial"
   ]
  ],
  "commonGround": "Material defines list-detail as a canonical layout and Polaris and Fluent support two-column layouts; all collapse to one pane on narrow screens.",
  "sources": [
   "https://m3.material.io/foundations/layout/canonical-layouts/list-detail",
   "https://polaris-react.shopify.com/components/layout-and-structure/layout",
   "https://fluent2.microsoft.design/layout"
  ]
 },
 "page-structures|Three-pane workspace": {
  "text": "Navigation, a list or main content, and a detail or inspector pane side by side.",
  "purpose": "Supports dense workflows where people navigate, browse and inspect at once.",
  "use": [
   "Wide screens, for tools such as asset management or mail where all three levels are used together.",
   "The third pane holds properties or details of the selection."
  ],
  "avoid": [
   "Medium or narrow screens: collapse to two panes or one.",
   "One pane is rarely needed: open it on demand."
  ],
  "anatomy": [
   "Navigation pane — destinations or folders.",
   "Main pane — the list or content.",
   "Inspector pane — details of the selection.",
   "Dividers — optional resizable boundaries."
  ],
  "behavior": [
   "Collapse the navigation pane first, then the inspector, as width shrinks.",
   "Let people close the inspector and reopen it from a toggle.",
   "Keep each pane scrolling independently."
  ],
  "accessibility": [
   "Name each pane as a landmark or region.",
   "Offer a keyboard shortcut such as F6 to move between panes.",
   "Keep reading and focus order left to right."
  ],
  "content": [
   "Use the selected item's name as the inspector heading.",
   "Show an empty prompt in the inspector when nothing is selected."
  ],
  "map": [
   [
    "Material 3",
    "Panes (extra-large window)",
    "Partial"
   ],
   [
    "Fluent 2",
    "Layout",
    "Partial"
   ]
  ],
  "commonGround": "Material describes up to three panes on very wide windows, and Fluent apps such as Outlook use the same form; both collapse panes in order as space shrinks.",
  "sources": [
   "https://m3.material.io/foundations/layout/applying-layout/window-size-classes",
   "https://fluent2.microsoft.design/layout"
  ]
 },
 "page-structures|Split workspace": {
  "text": "Divides the work area into two resizable regions that show related content side by side.",
  "purpose": "Lets people compare or work on two things at once, such as source and preview, without switching views.",
  "use": [
   "Compare, edit-and-preview, or reference-while-working tasks.",
   "Both regions are equally important."
  ],
  "avoid": [
   "One region is clearly secondary: use a side panel.",
   "Narrow screens: stack or tab the regions."
  ],
  "anatomy": [
   "Regions — two content areas.",
   "Splitter — a draggable divider between them.",
   "Controls — optional swap, collapse or orientation toggles."
  ],
  "behavior": [
   "Let people drag the splitter and remember the ratio.",
   "Enforce minimum sizes so both regions stay usable.",
   "Offer horizontal and vertical orientation when content needs it."
  ],
  "accessibility": [
   "Use role=separator with aria-valuenow and arrow-key resizing on the splitter.",
   "Give each region an accessible name.",
   "Make the splitter target at least 24 px wide."
  ],
  "content": [
   "Label regions when their roles are not obvious, such as \"Original\" and \"Edited\".",
   "Give the splitter an accessible name such as \"Resize panes\"."
  ],
  "map": [
   [
    "Material 3",
    "Supporting pane",
    "Partial"
   ]
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice. Material's supporting pane and the WAI-ARIA window splitter pattern cover parts of it.",
  "sources": [
   "https://m3.material.io/foundations/layout/canonical-layouts/supporting-pane",
   "https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/"
  ]
 },
 "page-structures|Landing page": {
  "text": "The first page people see in an app or area: an overview and the most common starting points.",
  "purpose": "Orients people and gets them to their next task quickly.",
  "use": [
   "The home of an app or major area.",
   "Surfacing recent items, key status and common tasks."
  ],
  "avoid": [
   "Do not fill a work app's landing page with marketing content.",
   "Do not duplicate the full navigation; show the few most-used entry points."
  ],
  "anatomy": [
   "Page header — title and primary action.",
   "Overview — key status or metrics.",
   "Recent items — what people worked on last.",
   "Shortcuts — links to common tasks."
  ],
  "behavior": [
   "Personalize recent items and shortcuts when possible.",
   "Show a first-use state with setup steps for new people.",
   "Load sections independently so one slow section does not block the page."
  ],
  "accessibility": [
   "Use one h1 and a logical heading order for sections.",
   "Give each section a heading so people can jump between them."
  ],
  "content": [
   "Use a plain title naming the app or area.",
   "Label sections by what they contain, such as \"Recent uploads\"."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://carbondesignsystem.com/patterns/dashboards/",
   "https://polaris-react.shopify.com/components/layout-and-structure/page"
  ],
  "map": []
 },
 "page-structures|Create page": {
  "text": "Creates a new object, with a form and clear create and cancel actions.",
  "purpose": "Gives creation room for its fields when a dialog would be too small.",
  "use": [
   "Creating an object needs many fields or sections.",
   "People may need to leave and return to the form."
  ],
  "avoid": [
   "Objects with one or two fields: use a dialog or inline add.",
   "Do not split into a wizard unless steps truly depend on each other."
  ],
  "anatomy": [
   "Page header — title such as \"New collection\" and breadcrumbs.",
   "Form — fields grouped in sections.",
   "Page actions — Create and Cancel."
  ],
  "behavior": [
   "Focus the first field on load.",
   "Validate on submit and move focus to the first error.",
   "On success, go to the new object's page and confirm with a toast.",
   "Warn about unsaved changes when leaving."
  ],
  "accessibility": [
   "Use visible labels for every field and mark required fields consistently.",
   "Provide an error summary for long forms.",
   "Keep the primary action reachable without much scrolling, or repeat it."
  ],
  "content": [
   "Title with \"New\" or \"Create\" plus the object type.",
   "Label the primary button with the outcome, such as \"Create collection\"."
  ],
  "map": [
   [
    "Carbon",
    "Create flows",
    "Direct"
   ],
   [
    "Polaris",
    "Resource details layout",
    "Partial"
   ]
  ],
  "commonGround": "Carbon defines full-page creation for complex objects and Polaris uses the details layout for new resources; both open the created object on success.",
  "sources": [
   "https://carbondesignsystem.com/community/patterns/create-flows/",
   "https://polaris-react.shopify.com/patterns/resource-details-layout"
  ]
 },
 "page-structures|Edit page": {
  "text": "Changes an existing object, showing its current values in an editable form.",
  "purpose": "Gives editing room and makes saving and discarding changes explicit.",
  "use": [
   "An object has many editable fields.",
   "Edits should be reviewed and saved together."
  ],
  "avoid": [
   "Single-field changes: use inline edit.",
   "Do not mix read-only detail and edit modes without a clear switch."
  ],
  "anatomy": [
   "Page header — object name and breadcrumbs.",
   "Form — current values in grouped sections.",
   "Save bar or page actions — Save and Discard.",
   "Unsaved changes indicator."
  ],
  "behavior": [
   "Prefill all fields with current values.",
   "Show save actions as soon as a value changes.",
   "Warn before leaving with unsaved changes.",
   "Confirm saves with a toast and stay on or return to the object."
  ],
  "accessibility": [
   "Keep focus in place after saving.",
   "Announce save success or errors through a live region.",
   "Style fields that cannot change as read-only, not disabled."
  ],
  "content": [
   "Use the object name as the title, optionally prefixed with \"Edit\".",
   "Label buttons \"Save\" and \"Discard\" or \"Cancel\"."
  ],
  "map": [
   [
    "Polaris",
    "Resource details layout",
    "Partial"
   ],
   [
    "Carbon",
    "Forms",
    "Partial"
   ]
  ],
  "commonGround": "Polaris and Carbon agree: edits are saved explicitly with visible save and discard actions, and leaving with unsaved changes needs a warning.",
  "sources": [
   "https://polaris-react.shopify.com/patterns/resource-details-layout",
   "https://carbondesignsystem.com/patterns/forms-pattern/"
  ]
 },
 "page-structures|Authentication page": {
  "text": "Where people sign in or verify their identity before using the app.",
  "purpose": "Lets people prove who they are quickly and securely, with clear help when it fails.",
  "use": [
   "Sign-in, multi-factor verification and password reset steps.",
   "A standalone page outside the app shell."
  ],
  "avoid": [
   "Do not show app navigation or data before sign-in.",
   "Do not ask for more than needed on one step."
  ],
  "anatomy": [
   "Brand — product name and logo.",
   "Form — identifier and password or a single sign-on button.",
   "Links — forgot password and help.",
   "Error area — a summary of sign-in problems."
  ],
  "behavior": [
   "Allow password managers and paste in all fields.",
   "Show a generic error that does not reveal which field was wrong.",
   "Offer a show-password toggle.",
   "After sign-in, return people to the page they first requested."
  ],
  "accessibility": [
   "Use correct autocomplete values such as username and current-password.",
   "Do not use CAPTCHAs without an accessible alternative.",
   "Move focus to the error summary when sign-in fails."
  ],
  "content": [
   "Title the page \"Sign in\" and use the same term everywhere.",
   "Write errors that say what to do, such as checking the email and password."
  ],
  "map": [
   [
    "Carbon",
    "Login pattern",
    "Direct"
   ]
  ],
  "commonGround": "Carbon defines a login pattern; GOV.UK and WCAG 2.2 cross-check allowing paste, password managers and accessible authentication.",
  "sources": [
   "https://carbondesignsystem.com/patterns/login-pattern/",
   "https://design-system.service.gov.uk/patterns/passwords/",
   "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum"
  ]
 },
 "page-structures|Error page": {
  "text": "A full page shown when the app cannot show the requested page, such as not found, no access or server error.",
  "purpose": "Explains the failure and gives a clear way back to working parts of the app.",
  "use": [
   "Unknown addresses, access problems and server errors that affect the whole page.",
   "Inside the app shell, when the shell itself still works."
  ],
  "avoid": [
   "Errors in one section: use an inline error state.",
   "Do not show stack traces or raw error codes as the main message."
  ],
  "anatomy": [
   "Heading — the problem in plain words.",
   "Body — likely cause and what to do.",
   "Actions — a link home, retry or contact support.",
   "Reference — an error ID for support."
  ],
  "behavior": [
   "Return the matching HTTP status code.",
   "Keep navigation available when possible.",
   "Offer retry for server errors that may be temporary."
  ],
  "accessibility": [
   "Set the page title to describe the error.",
   "Make the heading the page's h1."
  ],
  "content": [
   "Use a plain heading such as \"Page not found\" or \"Something went wrong\".",
   "Avoid blame and humor."
  ],
  "map": [
   [
    "Atlassian",
    "Empty state",
    "Partial"
   ],
   [
    "Spectrum",
    "Illustrated message",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Spectrum show page-level errors with an illustrated message, a heading and a way forward; GOV.UK cross-checks plain headings and correct status codes.",
  "sources": [
   "https://atlassian.design/components/empty-state",
   "https://spectrum.adobe.com/page/illustrated-message/",
   "https://design-system.service.gov.uk/patterns/page-not-found-pages/"
  ]
 },
 "page-structures|Full-screen experience": {
  "text": "Hides the app shell so one task, such as viewing or editing media, fills the screen.",
  "purpose": "Removes distractions and gives immersive or complex work the most space.",
  "use": [
   "Media viewing, editors and builders that need all available space.",
   "The task is self-contained and has a clear exit."
  ],
  "avoid": [
   "Routine pages.",
   "Do not hide the way out."
  ],
  "anatomy": [
   "Top bar — title, exit control and primary actions.",
   "Work area — the full-size content.",
   "Optional panels — toggleable tools or properties."
  ],
  "behavior": [
   "Enter from a clear action and exit with the close control or Escape.",
   "Warn about unsaved changes on exit.",
   "On exit, return people to where they were."
  ],
  "accessibility": [
   "Keep the exit control first in focus order and always visible.",
   "Announce entering the mode by updating the page title.",
   "Do not trap Escape for other purposes without another exit route."
  ],
  "content": [
   "Show the object name in the top bar.",
   "Label the exit control \"Close\" or \"Exit\"."
  ],
  "map": [
   [
    "Polaris",
    "Fullscreen bar",
    "Partial"
   ],
   [
    "Spectrum",
    "Dialog (fullscreen takeover)",
    "Partial"
   ],
   [
    "Material 3",
    "Full-screen dialog",
    "Partial"
   ]
  ],
  "commonGround": "Polaris, Spectrum and Material agree on a full-screen mode with a persistent top bar that holds the exit and primary action.",
  "sources": [
   "https://polaris-react.shopify.com/components/navigation/fullscreen-bar",
   "https://spectrum.adobe.com/page/dialog/",
   "https://m3.material.io/components/dialogs/guidelines"
  ]
 },
 "page-structures|Page actions bar": {
  "text": "A row of actions on the whole page or object, usually at the top or bottom of the page.",
  "purpose": "Puts a page's main actions in a consistent, predictable place.",
  "use": [
   "Actions on the page's object, such as Save, Delete or Export.",
   "The bottom of long forms, in addition to the header actions."
  ],
  "avoid": [
   "Do not put row-level or section-level actions in it.",
   "Do not show more than one primary action."
  ],
  "anatomy": [
   "Primary action — one emphasized button.",
   "Secondary actions — a few standard buttons.",
   "Overflow menu — less common actions.",
   "Destructive action — placed apart from the primary action."
  ],
  "behavior": [
   "Keep the same order and position on every page.",
   "Collapse secondary actions into an overflow menu as width shrinks.",
   "Make the bar sticky on long pages when actions must stay reachable."
  ],
  "accessibility": [
   "Keep reading order the same as visual order.",
   "Give icon-only actions accessible names.",
   "Use a toolbar role only when arrow-key navigation is provided."
  ],
  "content": [
   "Start labels with verbs.",
   "Name the object when the action is ambiguous, such as \"Delete collection\"."
  ],
  "map": [
   [
    "Polaris",
    "Page actions",
    "Direct"
   ],
   [
    "Atlassian",
    "Page header (actions)",
    "Partial"
   ],
   [
    "Carbon",
    "Page header (actions)",
    "Partial"
   ]
  ],
  "commonGround": "Polaris, Atlassian and Carbon agree on one primary action, a few secondary actions and an overflow menu in a fixed page position, with destructive actions set apart.",
  "sources": [
   "https://polaris-react.shopify.com/components/actions/page-actions",
   "https://atlassian.design/components/page-header",
   "https://pages.github.ibm.com/carbon/ibm-products/components/page-header/usage/"
  ]
 },
 "page-structures|Authentication template": {
  "text": "A reusable page template for every sign-in, sign-up, verification and recovery screen.",
  "purpose": "Keeps all identity screens consistent, secure and accessible through one shared layout.",
  "use": [
   "Every pre-sign-in screen in every Plenix app.",
   "Verification and recovery steps outside the app shell."
  ],
  "avoid": [
   "Do not build identity screens from scratch for each app.",
   "In-app account settings: use a settings page."
  ],
  "anatomy": [
   "Brand area — product name and logo.",
   "Form slot — one step's form.",
   "Help slot — forgot password, help and legal links.",
   "Message slot — errors and info such as session expired."
  ],
  "behavior": [
   "Center a single narrow column on all screen sizes.",
   "Show one step per page.",
   "Keep the layout identical across sign-in, reset and verification steps."
  ],
  "accessibility": [
   "Support password managers, paste and correct autocomplete values in every field.",
   "Provide an error summary and move focus to it on failure.",
   "Keep text and controls usable at 200% zoom."
  ],
  "content": [
   "Use one term for signing in, such as \"Sign in\", everywhere.",
   "Write short, specific instructions per step."
  ],
  "map": [
   [
    "Carbon",
    "Login pattern",
    "Partial"
   ]
  ],
  "commonGround": "Carbon's login pattern defines a consistent single-column sign-in layout; GOV.UK and WCAG 2.2 cross-check one step per page and accessible authentication.",
  "sources": [
   "https://carbondesignsystem.com/patterns/login-pattern/",
   "https://design-system.service.gov.uk/patterns/question-pages/",
   "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum"
  ]
 },
 "patterns|Single selection": {
  "text": "Lets people choose exactly one option from a set.",
  "purpose": "Makes a mutually exclusive choice clear and shows every option at once, so people can compare before choosing.",
  "use": [
   "Radio buttons: two to about seven options that people should compare.",
   "A select or combobox: a long option list or tight space.",
   "Selectable tiles or a single-select list: options that need richer content."
  ],
  "avoid": [
   "People can pick more than one: use checkboxes.",
   "An instant on/off setting: use a switch."
  ],
  "anatomy": [
   "Group label — names the question the choice answers.",
   "Options — the mutually exclusive choices, each with a control and label.",
   "Selection indicator — the filled radio, check, or highlighted tile.",
   "Helper or error text — optional guidance and validation below the group."
  ],
  "behavior": [
   "Allow only one selected option; selecting a new one clears the previous one.",
   "Preselect a safe default when one exists; leave the group empty only when no neutral default exists.",
   "Make the whole label and tile area clickable, not just the indicator."
  ],
  "accessibility": [
   "Group options in a radiogroup with an accessible name from the group label.",
   "Use Tab to enter the group and arrow keys to move and select within it.",
   "Keep each option target at least 24 by 24 pixels."
  ],
  "content": [
   "Write the group label as a short question or noun phrase.",
   "Keep option labels short, parallel, and in a logical order.",
   "Do not end option labels with punctuation."
  ],
  "map": [
   [
    "Carbon",
    "Radio button",
    "Direct"
   ],
   [
    "Atlassian",
    "Radio",
    "Direct"
   ],
   [
    "Material 3",
    "Radio button",
    "Direct"
   ],
   [
    "Fluent 2",
    "Radio group",
    "Direct"
   ],
   [
    "Polaris",
    "Choice list",
    "Direct"
   ],
   [
    "Spectrum",
    "Radio group",
    "Direct"
   ]
  ],
  "commonGround": "All six systems use a radio group for one choice from a short visible list, with arrow-key navigation and a group label. They differ on whether to require a preselected default.",
  "sources": [
   "https://carbondesignsystem.com/components/radio-button/usage/",
   "https://atlassian.design/components/radio/",
   "https://m3.material.io/components/radio-button/overview",
   "https://fluent2.microsoft.design/components/web/react/core/radiogroup/usage",
   "https://polaris-react.shopify.com/components/selection-and-input/choice-list",
   "https://react-spectrum.adobe.com/v3/RadioGroup.html",
   "https://www.w3.org/WAI/ARIA/apg/patterns/radio/"
  ]
 },
 "patterns|Transfer list": {
  "text": "Moves items between an available list and a chosen list.",
  "purpose": "Helps people build a subset from a large set while always seeing what they picked and what remains.",
  "use": [
   "People pick many items from a large set and need to see both sets side by side.",
   "The chosen set is saved as a unit, such as columns to show or members of a group."
  ],
  "avoid": [
   "Short lists: use a checkbox group.",
   "Narrow space: use a multi-select combobox with tags."
  ],
  "anatomy": [
   "Source list — the available items, often with search.",
   "Target list — the chosen items.",
   "Move buttons — move selected items, and optionally all items, between lists.",
   "List headers — titles and item counts for each list."
  ],
  "behavior": [
   "Let people select several items in a list and move them in one action.",
   "Keep moved items out of the source list until they are moved back.",
   "Show counts that update after every move."
  ],
  "accessibility": [
   "Build each list as a multi-select listbox with a visible name.",
   "Give move buttons text names such as Add and Remove, not only arrows.",
   "Announce through a live region how many items moved."
  ],
  "content": [
   "Name lists by role, such as Available and Selected.",
   "Use verb labels on move buttons."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.lightningdesignsystem.com/components/dueling-picklist/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-rearrangeable/"
  ],
  "map": []
 },
 "patterns|Dual listbox": {
  "text": "Two side-by-side listboxes with move controls for picking and optionally ordering a subset of items.",
  "purpose": "The accessible build of a transfer list: clear keyboard and screen reader support for moving items between sets.",
  "use": [
   "The chosen items must also be put in order.",
   "Settings forms where people configure a saved list, such as visible columns."
  ],
  "avoid": [
   "A checkbox group fits on screen.",
   "Small screens: use a single list with checkboxes and a reorder action."
  ],
  "anatomy": [
   "Available listbox — the items that can be added.",
   "Selected listbox — the chosen items in their order.",
   "Add and remove buttons — move the selected items between lists.",
   "Move up and move down buttons — change order in the selected list."
  ],
  "behavior": [
   "Enable move buttons only when they would do something.",
   "Keep focus in the list after a move so people can continue.",
   "Keep the selection on moved items so the next action is clear."
  ],
  "accessibility": [
   "Use the listbox role with aria-multiselectable when several items can be picked.",
   "Expose the required state on the selected list when at least one item is needed.",
   "Announce moves and new positions through a live region."
  ],
  "content": [
   "Label each list with a visible heading.",
   "Use short verb labels such as Add, Remove, Move up, and Move down."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.lightningdesignsystem.com/components/dueling-picklist/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-rearrangeable/"
  ],
  "map": []
 },
 "patterns|Grouping": {
  "text": "Clusters related items under shared headers in a list, menu, or table.",
  "purpose": "Helps people scan long collections by putting related items together and naming each cluster.",
  "use": [
   "Items share a clear attribute, such as status, type, or date.",
   "Menus and lists with more than about seven items that fall into natural sets."
  ],
  "avoid": [
   "Most groups would hold one item.",
   "An attribute people do not recognize: use sorting or filtering."
  ],
  "anatomy": [
   "Group header — names the group and can show a count.",
   "Group items — the members of the group.",
   "Separator — space or a divider between groups.",
   "Collapse control — optional control to hide a group's items."
  ],
  "behavior": [
   "Keep group order stable and meaningful, such as alphabetical or by status.",
   "Keep a selection when people collapse or expand a group.",
   "Let people change or clear the grouping attribute in data views."
  ],
  "accessibility": [
   "Expose groups with role group or table row headers and an accessible group name.",
   "Skip group headers in arrow-key navigation unless they are interactive.",
   "Do not rely on color alone to separate groups."
  ],
  "content": [
   "Write group headers as short nouns in sentence case.",
   "Show the item count next to the header when it helps people decide where to look."
  ],
  "map": [
   [
    "Material 3",
    "Lists",
    "Partial"
   ],
   [
    "Polaris",
    "Index table",
    "Partial"
   ],
   [
    "Spectrum",
    "Menu",
    "Partial"
   ]
  ],
  "commonGround": "Material 3, Polaris, and Spectrum all support labeled sections or grouped rows inside lists, menus, or tables. None treats grouping as a standalone component.",
  "sources": [
   "https://m3.material.io/components/lists/overview",
   "https://polaris-react.shopify.com/components/tables/index-table",
   "https://react-spectrum.adobe.com/v3/ListView.html",
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
  ]
 },
 "patterns|Reordering": {
  "text": "Lets people change the order of items in a list.",
  "purpose": "Lets people set priority or sequence when order has meaning, such as steps, columns, or ranked items.",
  "use": [
   "The order is saved and affects how items are shown or processed.",
   "Short to medium lists that people manage by hand."
  ],
  "avoid": [
   "A sort by attribute would serve better than manual reordering.",
   "Very long lists: use move-to actions or numeric position fields."
  ],
  "anatomy": [
   "Drag handle — the grip people press to move an item.",
   "Item — the row or card being moved.",
   "Drop indicator — a line that shows where the item will land.",
   "Move actions — menu items or buttons such as Move up and Move down."
  ],
  "behavior": [
   "Offer both drag and a non-drag way to move items.",
   "Show the new position live while dragging; settle the item in place on drop.",
   "Save the new order right away or with the surrounding form; say which."
  ],
  "accessibility": [
   "Provide keyboard and single-pointer move actions to meet the dragging-movements rule.",
   "Announce the item's new position, such as 3 of 8, after each move.",
   "Keep drag handles at least 24 by 24 pixels."
  ],
  "content": [
   "Use clear move labels such as Move up, Move down, Move to top.",
   "Name the item in the announcement, such as Column Size moved to position 2."
  ],
  "map": [
   [
    "Atlassian",
    "Pragmatic drag and drop",
    "Partial"
   ],
   [
    "Spectrum",
    "List view",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Spectrum agree that reordering by drag must have a keyboard and menu alternative and a clear drop indicator.",
  "sources": [
   "https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines",
   "https://react-spectrum.adobe.com/react-aria/dnd.html",
   "https://react-spectrum.adobe.com/v3/ListView.html",
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-rearrangeable/",
   "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html"
  ]
 },
 "patterns|Drag and drop": {
  "text": "Moves or copies items by dragging them to a new place (direct manipulation).",
  "purpose": "Makes moving, reordering, and uploading fast for pointer users, while the same actions stay available another way.",
  "use": [
   "Reordering items, moving items between containers, or dropping files to upload.",
   "An accelerator next to visible move or upload actions."
  ],
  "avoid": [
   "Do not make drag the only way to complete a task.",
   "Actions that are hard to undo: use an explicit action with confirmation."
  ],
  "anatomy": [
   "Draggable item — the source, with a handle or a grab cursor.",
   "Drag preview — the image that follows the pointer.",
   "Drop target — the area that accepts the item.",
   "Drop indicator — a line or highlight showing where the item will land."
  ],
  "behavior": [
   "Change the cursor and show a preview when a drag starts.",
   "Highlight valid drop targets and show invalid ones as not allowed.",
   "Let Escape cancel the drag and return the item to its origin.",
   "Offer undo after a drop that changes data."
  ],
  "accessibility": [
   "Provide a single-pointer, non-drag alternative for every drag action.",
   "Offer keyboard drag or move menu actions with spoken start, move, and drop updates.",
   "Do not depend on color alone for valid and invalid targets."
  ],
  "content": [
   "Label alternative actions with clear verbs such as Move to.",
   "Write drop-area text that says what can be dropped, such as Drop files to upload."
  ],
  "map": [
   [
    "Atlassian",
    "Pragmatic drag and drop",
    "Direct"
   ],
   [
    "Spectrum",
    "Drag and drop",
    "Direct"
   ],
   [
    "Polaris",
    "Drop zone",
    "Partial"
   ],
   [
    "Carbon",
    "File uploader",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Spectrum agree on visible drop indicators, Escape to cancel, and a required keyboard or menu alternative. Polaris and Carbon cover drag only for file drop.",
  "sources": [
   "https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines",
   "https://react-spectrum.adobe.com/react-aria/dnd.html",
   "https://polaris-react.shopify.com/components/selection-and-input/drop-zone",
   "https://carbondesignsystem.com/components/file-uploader/usage/",
   "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html"
  ]
 },
 "patterns|Sortable list": {
  "text": "A list people can put in a custom order by dragging or with move actions.",
  "purpose": "Lets people rank or sequence a set of items in place.",
  "use": [
   "Priority lists, step order, field order, and visible-column order.",
   "The list is short enough to see most items at once."
  ],
  "avoid": [
   "Sorting by a column: use a sortable table header.",
   "Order has no meaning to the result."
  ],
  "anatomy": [
   "List container — holds the ordered items.",
   "Item with drag handle — each movable row.",
   "Drop indicator — marks the landing position.",
   "Item menu — offers Move up, Move down, and Move to top or bottom."
  ],
  "behavior": [
   "Shift other items to make room while an item is dragged.",
   "Keep the moved item focused and selected after the drop.",
   "Persist the order in a clear, predictable way."
  ],
  "accessibility": [
   "Expose position, such as 2 of 6, to assistive technology.",
   "Support keyboard reordering through the item menu or a grab mode.",
   "Announce the result of each move."
  ],
  "content": [
   "Use the item's own name in move announcements.",
   "Keep move labels short and consistent."
  ],
  "map": [
   [
    "Atlassian",
    "Pragmatic drag and drop",
    "Partial"
   ],
   [
    "Spectrum",
    "List view",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Spectrum both support reorderable lists with drop indicators and keyboard alternatives; neither has a standalone sortable-list component name.",
  "sources": [
   "https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines",
   "https://react-spectrum.adobe.com/v3/ListView.html",
   "https://react-spectrum.adobe.com/react-aria/dnd.html",
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-rearrangeable/"
  ]
 },
 "patterns|Drop target": {
  "text": "An area that accepts dragged items or files and shows when a drop is valid.",
  "purpose": "Shows people where they can drop and what will happen, so drops land where they expect.",
  "use": [
   "File upload areas, folders, columns, and lists that accept moved items.",
   "A drop changes where an item lives."
  ],
  "avoid": [
   "A drop target as the only way to add files: pair it with a browse button.",
   "Do not show many targets at once without making the valid ones stand out."
  ],
  "anatomy": [
   "Target area — the bounded region that accepts drops.",
   "Idle text — says what can be dropped here.",
   "Active state — highlight shown while a valid item is over the area.",
   "Browse action — a button that does the same job without dragging."
  ],
  "behavior": [
   "Highlight the target only while a valid item hovers over it.",
   "Show a not-allowed state for items of the wrong type or size.",
   "Confirm the result after the drop, such as the uploaded file list."
  ],
  "accessibility": [
   "Pair every drop target with a focusable button that opens the same action.",
   "Announce accepted and rejected drops in a live region.",
   "Keep the active state visible without color alone: use a border style or icon."
  ],
  "content": [
   "Write idle text such as Drag files here or browse.",
   "State accepted file types and size limits next to the target."
  ],
  "map": [
   [
    "Spectrum",
    "Drop zone",
    "Direct"
   ],
   [
    "Polaris",
    "Drop zone",
    "Direct"
   ],
   [
    "Carbon",
    "File uploader",
    "Partial"
   ],
   [
    "Atlassian",
    "Pragmatic drag and drop",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum and Polaris both define a drop zone with an idle message, a highlighted drag-over state, and a browse fallback. Carbon builds the same into its file uploader.",
  "sources": [
   "https://react-spectrum.adobe.com/v3/DropZone.html",
   "https://polaris-react.shopify.com/components/selection-and-input/drop-zone",
   "https://carbondesignsystem.com/components/file-uploader/usage/",
   "https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines"
  ]
 },
 "patterns|Resize": {
  "text": "Lets people change the size of a pane, column, or element by dragging an edge or handle.",
  "purpose": "Lets people give more room to the content that matters to them in dense, data-heavy layouts.",
  "use": [
   "Side panels, split views, and table columns with variable content.",
   "Content width or height varies widely between users."
  ],
  "avoid": [
   "Do not make content unusable at any allowed size; set minimum and maximum sizes.",
   "A fixed layout or a collapse toggle is enough."
  ],
  "anatomy": [
   "Resize handle — the edge or grip people drag.",
   "Resizable region — the pane or column that changes size.",
   "Size limits — the minimum and maximum the region can reach.",
   "Reset action — optional way to return to the default size."
  ],
  "behavior": [
   "Change the cursor on the handle to show the resize direction.",
   "Resize live while dragging and stop at the limits.",
   "Remember the chosen size for the person when it helps."
  ],
  "accessibility": [
   "Make the handle focusable as a separator with a value and arrow-key resizing.",
   "Give the handle an accessible name, such as Resize navigation panel.",
   "Make the handle hit area at least 24 pixels wide, even if the visible line is thin."
  ],
  "content": [
   "Name the handle after the region it resizes.",
   "Use Reset size or Reset column width for the reset action."
  ],
  "map": [
   [
    "Atlassian",
    "Page layout",
    "Partial"
   ],
   [
    "Spectrum",
    "Table view",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Fluent 2, and Spectrum support resizable panels or table columns with keyboard-operable handles and size limits. None defines resize as its own pattern.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/",
   "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html",
   "https://react-spectrum.adobe.com/v3/TableView.html"
  ]
 },
 "patterns|Reposition": {
  "text": "Lets people move an element to a new place in a layout, canvas, or hierarchy.",
  "purpose": "Lets people arrange widgets, panels, or tree items to fit how they work.",
  "use": [
   "Dashboards, canvases, and folder or tree structures.",
   "Position carries meaning for the person."
  ],
  "avoid": [
   "Order fixed by the system: explain the fixed order instead.",
   "Drag alone: offer a Move to action."
  ],
  "anatomy": [
   "Movable element — the widget, panel, or node.",
   "Move handle or Move to action — the way to start a move.",
   "Placement preview — the outline or line showing the new position.",
   "Destination picker — a dialog or menu for picking a target without dragging."
  ],
  "behavior": [
   "Show the target position before the move is committed.",
   "Let Escape cancel and restore the original position.",
   "Offer undo after a move that changes structure."
  ],
  "accessibility": [
   "Provide a Move to dialog or arrow-key moves as a non-drag alternative.",
   "Announce the new location after the move.",
   "Keep focus on the moved element after it lands."
  ],
  "content": [
   "Use Move to as the action label.",
   "Name the destination in the confirmation, such as Moved to Archive."
  ],
  "map": [
   [
    "Atlassian",
    "Pragmatic drag and drop",
    "Partial"
   ],
   [
    "Spectrum",
    "Drag and drop",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Spectrum agree that moves need a visible preview, a cancel path, and a non-drag Move to alternative.",
  "sources": [
   "https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines",
   "https://react-spectrum.adobe.com/react-aria/dnd.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html"
  ]
 },
 "patterns|Create flow": {
  "text": "Makes a new object, from the create action through input to the saved result.",
  "purpose": "Gives people a predictable path to create things and lands them where they can see and use what they made.",
  "use": [
   "Simple objects with a few fields: a modal or side panel.",
   "Complex objects with many fields or dependencies: a full page or multi-step flow.",
   "Lists where only a name is needed: inline creation."
  ],
  "avoid": [
   "Asking for data that can be added later: keep the create step short.",
   "A modal for long or multi-step creation: use a full page."
  ],
  "anatomy": [
   "Create action — the primary button that starts the flow.",
   "Form surface — modal, side panel, or page with the required fields.",
   "Primary and cancel actions — Create and Cancel.",
   "Confirmation — a toast and the new object shown in context."
  ],
  "behavior": [
   "Ask only for required fields and use sensible defaults for the rest.",
   "Validate on submit and keep entered data when there are errors.",
   "After creating, show the new object or select it in the list.",
   "Warn before discarding unsaved input on cancel."
  ],
  "accessibility": [
   "Move focus into the form surface when it opens, and back to a logical place when it closes.",
   "Mark required fields in text, not only with color or an asterisk.",
   "Link error messages to their fields."
  ],
  "content": [
   "Label the action Create followed by the object, such as Create collection.",
   "Use the same verb on the start button and the submit button.",
   "Confirm with a short message that names the object."
  ],
  "map": [
   [
    "Carbon",
    "Create flows",
    "Direct"
   ],
   [
    "Polaris",
    "Resource details layout",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Polaris agree on scaling the surface to complexity: modal or panel for small objects, full page for large ones, with the new object shown after saving.",
  "sources": [
   "https://carbondesignsystem.com/patterns/dialog-pattern/",
   "https://design-system.service.gov.uk/patterns/question-pages/",
   "https://design-system.service.gov.uk/patterns/confirmation-pages/"
  ]
 },
 "patterns|Edit flow": {
  "text": "Changes an existing object and saves or discards those changes.",
  "purpose": "Lets people change data safely, with clear save and cancel paths and no silent loss of work.",
  "use": [
   "Single fields people change often: inline editing.",
   "Several fields change together: an edit mode, panel, or page.",
   "Changes affect others or cost money: an explicit save."
  ],
  "avoid": [
   "Do not mix autosave and explicit save on the same surface.",
   "Do not hide which fields can be edited."
  ],
  "anatomy": [
   "Edit trigger — an Edit button or editable field.",
   "Editable fields — the inputs in edit state.",
   "Save and cancel actions — commit or discard the changes.",
   "Unsaved-changes signal — a bar or label that shows pending changes."
  ],
  "behavior": [
   "Show that changes are pending until they are saved.",
   "Warn before leaving with unsaved changes.",
   "Confirm a successful save and show the updated values.",
   "Keep entered values when a save fails and explain why."
  ],
  "accessibility": [
   "Announce the switch between read and edit modes.",
   "Keep focus on the edited item after saving or canceling.",
   "Make save and cancel reachable by keyboard without leaving the form."
  ],
  "content": [
   "Use Save and Cancel, or Save changes and Discard.",
   "Explain save errors in plain words with a fix."
  ],
  "map": [
   [
    "Atlassian",
    "Inline edit",
    "Partial"
   ],
   [
    "Polaris",
    "Contextual save bar",
    "Partial"
   ],
   [
    "Carbon",
    "Read-only states",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Polaris, and Carbon agree on a visible pending-change state, explicit save and discard, and a warning before losing changes.",
  "sources": [
   "https://atlassian.design/components/inline-edit/",
   "https://carbondesignsystem.com/patterns/read-only-states-pattern/",
   "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html"
  ]
 },
 "patterns|Multi-step form": {
  "text": "A form split into ordered steps that people complete one at a time.",
  "purpose": "Breaks a long form into small, focused chunks, so people make fewer errors and know how far they have to go.",
  "use": [
   "A long form with clearly separable sections.",
   "Later questions depend on earlier answers."
  ],
  "avoid": [
   "Short forms: keep them on one page.",
   "People need to see all fields together to compare them."
  ],
  "anatomy": [
   "Progress indicator — shows the steps and the current one.",
   "Step content — the fields for the current step.",
   "Navigation — Back, Next, and the final submit action.",
   "Review step — a summary of answers before submitting."
  ],
  "behavior": [
   "Validate each step before moving on; keep answers when going back.",
   "Let people go back without losing data.",
   "Show a review step with change links before the final submit.",
   "Save progress for long forms so people can return later."
  ],
  "accessibility": [
   "Move focus to the step heading when a new step loads.",
   "Expose the current step in the progress indicator with aria-current.",
   "Do not ask for the same data twice in one flow."
  ],
  "content": [
   "Give each step a short heading that says what it covers.",
   "Use Next and Back for navigation, and a specific verb for the final action."
  ],
  "map": [
   [
    "Carbon",
    "Progress indicator",
    "Partial"
   ],
   [
    "Atlassian",
    "Progress tracker",
    "Partial"
   ],
   [
    "Material 3",
    "Steppers (Material 2)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Atlassian pair a progress indicator with step-by-step forms; GOV.UK adds a check-answers step. Material dropped steppers in Material 3.",
  "sources": [
   "https://carbondesignsystem.com/components/progress-indicator/usage/",
   "https://atlassian.design/components/progress-tracker/",
   "https://m2.material.io/components/steppers",
   "https://design-system.service.gov.uk/patterns/question-pages/",
   "https://design-system.service.gov.uk/patterns/check-answers/",
   "https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html"
  ]
 },
 "patterns|Wizard": {
  "text": "A guided, linear sequence of steps through a complex or unfamiliar task.",
  "purpose": "Hides complexity by asking one set of decisions at a time and guiding people to a valid result.",
  "use": [
   "Infrequent, complex setup tasks with a fixed order.",
   "Each step depends on earlier choices."
  ],
  "avoid": [
   "Tasks experts do often: use a single form.",
   "Steps can be done in any order: use a task list."
  ],
  "anatomy": [
   "Container — a full page or large modal.",
   "Step list — the named steps with current and completed states.",
   "Step content — the inputs for one step.",
   "Footer actions — Back, Next, Cancel, and the final action."
  ],
  "behavior": [
   "Allow moving back to completed steps without losing data.",
   "Disable or hide future steps until the needed earlier steps are valid.",
   "Confirm before canceling if data would be lost.",
   "End with a summary or a clear success state."
  ],
  "accessibility": [
   "Move focus to the new step heading on each step change.",
   "Mark the current step with aria-current and give each step's state in text.",
   "Keep footer actions in a consistent order across steps."
  ],
  "content": [
   "Name steps with short nouns or verb phrases.",
   "Use a specific final action label, such as Create project, not Finish."
  ],
  "map": [
   [
    "Carbon",
    "Progress indicator",
    "Partial"
   ],
   [
    "Atlassian",
    "Progress tracker",
    "Partial"
   ],
   [
    "Material 3",
    "Steppers (Material 2)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Atlassian use a progress indicator with Back and Next for linear guided tasks; SAP Fiori defines a full wizard. All keep data when going back.",
  "sources": [
   "https://carbondesignsystem.com/components/progress-indicator/usage/",
   "https://atlassian.design/components/progress-tracker/",
   "https://m2.material.io/components/steppers",
   "https://www.sap.com/design-system/fiori-design-web"
  ]
 },
 "patterns|Inline editing": {
  "text": "Lets people edit a value in place without opening a separate form.",
  "purpose": "Makes quick changes fast by keeping people in context.",
  "use": [
   "Single fields that people change often, such as names, statuses, or table cells.",
   "The change is low risk and easy to reverse."
  ],
  "avoid": [
   "Several related fields that must change together: use an edit form.",
   "Changes that need review or approval."
  ],
  "anatomy": [
   "Read view — the value with a hover or focus cue that it is editable.",
   "Edit view — the input that replaces the value.",
   "Confirm and cancel controls — small buttons or Enter and Escape.",
   "Validation message — inline error under the field."
  ],
  "behavior": [
   "Enter edit mode on click, Enter, or an Edit button.",
   "Save on Enter or confirm, and cancel on Escape.",
   "Keep the edit open and show the error when validation fails.",
   "Show a saving state and then the saved value."
  ],
  "accessibility": [
   "Make the read view focusable with a name that says it can be edited.",
   "Return focus to the read view after saving or canceling.",
   "Give confirm and cancel buttons text names."
  ],
  "content": [
   "Show a clear placeholder when the value is empty, such as Add a description.",
   "Keep error text short and specific to the field."
  ],
  "map": [
   [
    "Atlassian",
    "Inline edit",
    "Direct"
   ]
  ],
  "commonGround": "Atlassian defines inline edit directly; Salesforce Lightning and SAP Fiori apply the same rules in tables. They agree on Enter to save, Escape to cancel, and inline validation.",
  "sources": [
   "https://atlassian.design/components/inline-edit/",
   "https://www.sap.com/design-system/fiori-design-web"
  ]
 },
 "patterns|Autosave": {
  "text": "Saves changes automatically as people work, without a save button.",
  "purpose": "Prevents lost work and removes the need to remember to save.",
  "use": [
   "Documents, notes, settings, and long forms where work builds up over time.",
   "Each change is safe to keep and easy to undo."
  ],
  "avoid": [
   "Changes others see right away or that cost money: use an explicit save or publish step.",
   "Do not mix autosave with a save button on the same surface."
  ],
  "anatomy": [
   "Save status — text such as Saving or Saved with a time.",
   "Error state — a message when saving fails, with a retry.",
   "Version history — optional list of earlier saved states.",
   "Undo — a way to reverse recent changes."
  ],
  "behavior": [
   "Save after a short pause in typing and when focus leaves a field.",
   "Show a quiet status and do not interrupt work.",
   "When the connection drops, keep unsaved changes locally and retry.",
   "Warn before leaving only when changes could not be saved."
  ],
  "accessibility": [
   "Announce save failures in an assertive live region and successes politely or not at all.",
   "Keep the save status visible as text, not only an icon.",
   "Do not move focus when a save completes."
  ],
  "content": [
   "Use short status words: Saving, Saved, Not saved.",
   "Explain failures and say what people can do, such as Retry."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.sap.com/design-system/fiori-design-web"
  ],
  "map": []
 },
 "patterns|Draft state": {
  "text": "A saved but unpublished version of an object that only its authors can see and change.",
  "purpose": "Lets people work on changes over time without affecting the live version others use.",
  "use": [
   "Objects are published or shared and need preparation first.",
   "Keeping work in progress that is not ready for review."
  ],
  "avoid": [
   "Private data that is never published: a normal saved state is enough.",
   "Do not allow silent conflicting drafts of the same object."
  ],
  "anatomy": [
   "Draft status label — a tag that marks the object as a draft.",
   "Last-saved info — who saved it and when.",
   "Primary action — Publish or Submit for review.",
   "Discard draft — removes the draft and keeps the live version."
  ],
  "behavior": [
   "Show the draft label wherever the object appears.",
   "Keep the live version unchanged until the draft is published.",
   "Lock or warn when another person is editing the same draft.",
   "Confirm before discarding a draft."
  ],
  "accessibility": [
   "Give the draft label a text value, not color alone.",
   "Include the draft status in the object's accessible name or description in lists."
  ],
  "content": [
   "Use the word Draft for the status.",
   "Use Discard draft, not Delete, when the live version stays."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.sap.com/design-system/fiori-design-web"
  ],
  "map": []
 },
 "patterns|Save as": {
  "text": "Saves the current object or view as a new, separately named copy.",
  "purpose": "Lets people keep the original while saving a variation, such as a new view, template, or file.",
  "use": [
   "Saved views, filters, templates, and documents.",
   "People often start from an existing setup."
  ],
  "avoid": [
   "Saving changes only: use Save.",
   "Copying an object without changes: use Duplicate."
  ],
  "anatomy": [
   "Save as action — usually in a menu next to Save.",
   "Name field — prefilled with a suggested name.",
   "Location or scope — optional field for where the copy goes or who can see it.",
   "Confirm and cancel actions."
  ],
  "behavior": [
   "Prefill a unique name, such as the original name plus Copy.",
   "Check for name conflicts and explain them before saving.",
   "Open the new copy after saving; leave the original unchanged."
  ],
  "accessibility": [
   "Move focus to the name field when the dialog opens.",
   "Link a name conflict error to the field."
  ],
  "content": [
   "Label the action Save as.",
   "Name the scope plainly, such as Only me or Everyone in this workspace."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ],
  "map": []
 },
 "patterns|Duplicate": {
  "text": "Creates a copy of an existing object in the same place.",
  "purpose": "Saves effort when a new object should start from an existing one.",
  "use": [
   "Objects people often create in similar forms, such as collections, templates, or rules.",
   "An object's overflow menu, or a bulk action."
  ],
  "avoid": [
   "People need to rename or relocate before saving: use Save as.",
   "Do not copy private or sensitive fields without saying so."
  ],
  "anatomy": [
   "Duplicate action — in the overflow menu or toolbar.",
   "New copy — appears next to the original with a distinct name.",
   "Confirmation — a toast that links to the copy."
  ],
  "behavior": [
   "Name the copy clearly, such as the original name plus Copy.",
   "Say what is and is not copied, such as comments or permissions.",
   "Place and select the copy so people can find it."
  ],
  "accessibility": [
   "Announce the result with a status message.",
   "Move focus to the copy only if people will edit it next."
  ],
  "content": [
   "Use the verb Duplicate.",
   "Confirm with the new name, such as Created Holiday 2026 copy."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://carbondesignsystem.com/patterns/common-actions/"
  ],
  "map": []
 },
 "patterns|Import": {
  "text": "Brings data or files from outside into the product.",
  "purpose": "Lets people add many items at once from files or other systems instead of entering them by hand.",
  "use": [
   "Bulk loading files, records, or settings from a known format.",
   "File-based import: a drop target with a browse button."
  ],
  "avoid": [
   "One item: use a create form.",
   "Importing large or risky data without a preview."
  ],
  "anatomy": [
   "Import action — opens the import surface.",
   "Source picker — drop target, browse button, or connection list.",
   "Format guidance — accepted types, size limits, and a template.",
   "Progress and result — status per file or row."
  ],
  "behavior": [
   "Check type and size before upload and explain rejections.",
   "Show progress and allow cancel for long imports.",
   "Report what succeeded, what failed, and why."
  ],
  "accessibility": [
   "Provide a browse button next to any drop target.",
   "Announce progress milestones and the final result.",
   "Make error lists navigable by keyboard."
  ],
  "content": [
   "Use the verb Import with the object, such as Import assets.",
   "List accepted formats and limits in plain words."
  ],
  "map": [
   [
    "Carbon",
    "File uploader",
    "Partial"
   ],
   [
    "Polaris",
    "Drop zone",
    "Partial"
   ],
   [
    "Spectrum",
    "Drop zone",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Polaris, and Spectrum agree on a drop area plus browse button, upfront type and size limits, and per-file status.",
  "sources": [
   "https://carbondesignsystem.com/components/file-uploader/usage/",
   "https://polaris-react.shopify.com/components/selection-and-input/drop-zone",
   "https://react-spectrum.adobe.com/v3/DropZone.html"
  ]
 },
 "patterns|Export": {
  "text": "Saves data from the product to a file or another system.",
  "purpose": "Lets people take data out for reporting, backup, or use in other tools.",
  "use": [
   "Tables, reports, and collections people need outside the product.",
   "People use different tools: offer format choices."
  ],
  "avoid": [
   "Do not export more data than people chose without telling them.",
   "Blocking the screen for long exports: run them in the background."
  ],
  "anatomy": [
   "Export action — in a toolbar or overflow menu.",
   "Options — format, scope (selected, filtered, or all), and fields.",
   "Progress — for long exports.",
   "Result — a download or a notification with a link."
  ],
  "behavior": [
   "Default the scope to what people are looking at, such as the current filter.",
   "Say the format and scope before export starts.",
   "Notify people when a background export is ready."
  ],
  "accessibility": [
   "Name the file format in the action or option labels.",
   "Announce when the file is ready."
  ],
  "content": [
   "Use the verb Export with the object, such as Export metadata.",
   "Name formats plainly, such as CSV or PDF."
  ],
  "map": [
   [
    "Carbon",
    "Export modal",
    "Partial"
   ]
  ],
  "commonGround": "Carbon (in its product extensions) and SAP Fiori agree on a small dialog for format and scope, then a download or notification.",
  "sources": [
   "https://www.sap.com/design-system/fiori-design-web",
   "https://carbondesignsystem.com/patterns/common-actions/"
  ]
 },
 "patterns|Delete flow": {
  "text": "A workflow for permanently removing an object, with confirmation and recovery when possible.",
  "purpose": "Prevents accidental data loss while keeping deletion quick when it is safe.",
  "use": [
   "Deletion is permanent or affects many items: a confirmation dialog.",
   "The item can be restored: undo instead of confirmation."
  ],
  "avoid": [
   "Confirming every small, reversible removal: offer undo.",
   "Delete when the item only leaves a list: use Remove."
  ],
  "anatomy": [
   "Delete action — in an overflow menu or toolbar, styled as destructive.",
   "Confirmation dialog — states what will be deleted and the result.",
   "Destructive confirm button — names the action, such as Delete 3 assets.",
   "Result — a toast, with undo when possible."
  ],
  "behavior": [
   "Name the object and count in the confirmation.",
   "Make the cancel action the default focus in the dialog.",
   "For high-risk deletes, ask people to type the object name.",
   "Remove the item and show the result right away."
  ],
  "accessibility": [
   "Use an alert dialog with a clear title and description.",
   "Return focus to a sensible place after the item is gone.",
   "Do not rely on red alone to show the action is destructive."
  ],
  "content": [
   "Title the dialog as a question, such as Delete this collection?",
   "Say what will be lost and whether it can be recovered.",
   "Use the same verb on the trigger and the confirm button."
  ],
  "map": [
   [
    "Carbon",
    "Danger modal",
    "Partial"
   ],
   [
    "Atlassian",
    "Modal dialog",
    "Partial"
   ],
   [
    "Polaris",
    "Modal",
    "Partial"
   ],
   [
    "Spectrum",
    "Alert dialog",
    "Partial"
   ],
   [
    "Material 3",
    "Dialogs",
    "Partial"
   ]
  ],
  "commonGround": "All five agree on a destructive-styled confirmation that names the object and repeats the verb on the button. Material 3 and Carbon also favor undo over confirmation for reversible removal.",
  "sources": [
   "https://carbondesignsystem.com/patterns/dialog-pattern/",
   "https://atlassian.design/components/modal-dialog/",
   "https://polaris-react.shopify.com/components/overlays/modal",
   "https://react-spectrum.adobe.com/v3/AlertDialog.html",
   "https://m3.material.io/components/dialogs/overview",
   "https://m3.material.io/components/snackbar/overview"
  ]
 },
 "patterns|Review flow": {
  "text": "A workflow where submitted work waits for one or more reviewers to check it and decide.",
  "purpose": "Adds a controlled check before work goes live, with a record of who decided what.",
  "use": [
   "Content or changes need sign-off before they take effect.",
   "Several people share responsibility for quality or compliance."
  ],
  "avoid": [
   "Low-risk changes: use direct edit with history instead of review steps.",
   "Do not hide the review state from the submitter."
  ],
  "anatomy": [
   "Submit for review action — sends the work to reviewers.",
   "Status label — such as In review, Changes requested, Approved.",
   "Review panel — the item, changes, comments, and decision actions.",
   "Activity log — who did what and when."
  ],
  "behavior": [
   "Lock or version the item while it is in review.",
   "Notify reviewers on submit and the author on each decision.",
   "Let reviewers approve, reject, or request changes with a comment.",
   "Show the current state and next owner everywhere the item appears."
  ],
  "accessibility": [
   "Give review states text labels, not color alone.",
   "Make decision actions reachable by keyboard from the review panel.",
   "Announce decision results with a status message."
  ],
  "content": [
   "Use plain state names in sentence case, such as In review.",
   "Say who needs to act next, such as Waiting for Ana."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://design-system.service.gov.uk/patterns/check-answers/",
   "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html"
  ],
  "map": []
 },
 "patterns|Compare": {
  "text": "Shows two or more items or versions side by side with their differences marked.",
  "purpose": "Helps people see what changed or which option is better without switching back and forth.",
  "use": [
   "Comparing versions of an asset or document before approving or restoring.",
   "Comparing options across the same attributes."
  ],
  "avoid": [
   "More items than fit side by side: let people pick which to compare.",
   "Do not mark differences with color alone."
  ],
  "anatomy": [
   "Item selector — picks the items or versions to compare.",
   "Comparison view — side-by-side or overlay layout with aligned attributes.",
   "Difference markers — highlight added, removed, and changed values.",
   "Toggle — optional switch to show only differences."
  ],
  "behavior": [
   "Align matching attributes in rows so differences are easy to scan.",
   "Offer a Show only differences option for long lists.",
   "Keep scroll in sync between compared panes."
  ],
  "accessibility": [
   "Mark changes with text or icons as well as color, such as Added and Removed.",
   "Use table semantics so screen readers can read values by attribute.",
   "Make the swap and selector controls keyboard operable."
  ],
  "content": [
   "Label each column with the item name or version and date.",
   "Name differences plainly, such as Changed from 1080p to 4K."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
   "https://www.w3.org/WAI/ARIA/apg/patterns/table/"
  ],
  "map": []
 },
 "patterns|Approve": {
  "text": "Accepts submitted work and moves it to the next state.",
  "purpose": "Gives reviewers a clear, recorded way to sign off.",
  "use": [
   "Review flows where a named person must accept work.",
   "The primary action in a review panel."
  ],
  "avoid": [
   "Do not approve on behalf of others without recording it.",
   "Do not place Approve and Reject so close that people confuse them."
  ],
  "anatomy": [
   "Approve button — the primary decision action.",
   "Optional comment — a note stored with the decision.",
   "Confirmation — a status message and updated state label."
  ],
  "behavior": [
   "Record who approved and when.",
   "Move the item to the next state and notify the author.",
   "Ask for confirmation only when approval publishes or spends something."
  ],
  "accessibility": [
   "Give the button a specific name, such as Approve asset.",
   "Announce the new state after approval."
  ],
  "content": [
   "Use the verb Approve.",
   "Confirm with the result, such as Approved and published."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html"
  ],
  "map": []
 },
 "patterns|Reject": {
  "text": "A decision action that declines submitted work and returns it to the author.",
  "purpose": "Stops work that does not meet the bar and tells the author what to fix.",
  "use": [
   "Review flows where work can fail review.",
   "Work that can be fixed and resubmitted: use Request changes."
  ],
  "avoid": [
   "Do not reject without a reason.",
   "Do not style Reject as the primary action."
  ],
  "anatomy": [
   "Reject or Request changes button — a secondary decision action.",
   "Reason field — required comment for the author.",
   "Confirmation — a status message and updated state label."
  ],
  "behavior": [
   "Require a short reason before rejecting.",
   "Return the item to the author with the reason attached.",
   "Record who rejected and when."
  ],
  "accessibility": [
   "Link the reason field to its label and any error.",
   "Move focus to the reason field when it opens."
  ],
  "content": [
   "Use Reject for a final no and Request changes for a fixable issue.",
   "Write reasons as specific, actionable notes."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ],
  "map": []
 },
 "patterns|Assign": {
  "text": "Makes a person or team responsible for an item or task.",
  "purpose": "Makes ownership clear so work does not stall.",
  "use": [
   "Tasks, reviews, and requests that need one owner.",
   "A bulk action for many items."
  ],
  "avoid": [
   "Do not assign to people without access; check permissions first.",
   "Do not hide who is assigned."
  ],
  "anatomy": [
   "Assignee field — shows the current owner with avatar and name.",
   "Person picker — searchable list of people and teams.",
   "Assign to me — a shortcut for the current user.",
   "Notification — tells the new assignee."
  ],
  "behavior": [
   "Search people by name and email in the picker.",
   "Warn when the person cannot access the item.",
   "Notify the assignee and record the change."
  ],
  "accessibility": [
   "Build the picker as a combobox with a listbox of people.",
   "Give avatars text alternatives with the person's name."
  ],
  "content": [
   "Use Assign and Unassigned.",
   "Show the assignee's full name, not only initials."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
  ],
  "map": []
 },
 "patterns|Delegate": {
  "text": "Hands one's responsibility or authority to another person, often for a set time.",
  "purpose": "Keeps reviews and approvals moving when the owner is away.",
  "use": [
   "Approvers who will be out of office.",
   "Passing a single review to someone better placed."
  ],
  "avoid": [
   "Do not let delegation grant more access than the delegate already has without a separate request.",
   "Do not make delegation permanent by default."
  ],
  "anatomy": [
   "Delegate action — on the item or in personal settings.",
   "Delegate picker — person search.",
   "Scope and dates — which items and for how long.",
   "Status — shows active delegations."
  ],
  "behavior": [
   "Show both the owner and the delegate on affected items.",
   "End delegation on the set date and notify both people.",
   "Record actions as taken by the delegate on behalf of the owner."
  ],
  "accessibility": [
   "Use labeled date fields with a clear format.",
   "Announce when a delegation is created or ends."
  ],
  "content": [
   "Use Delegate to and On behalf of.",
   "Show date ranges in full, such as Until October 20."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
  ],
  "map": []
 },
 "patterns|Publish": {
  "text": "Makes a draft or approved item visible to its intended audience.",
  "purpose": "Separates preparing content from releasing it, so people control when others see it.",
  "use": [
   "Content, assets, and settings that others consume.",
   "Scheduled publishing, when release time matters."
  ],
  "avoid": [
   "Publishing automatically on save: use an explicit action.",
   "Private saves: use Save."
  ],
  "anatomy": [
   "Publish button — primary action on a draft.",
   "Audience and schedule options — who sees it and when.",
   "Status label — Draft, Scheduled, Published.",
   "Confirmation — status message with a link to the live item."
  ],
  "behavior": [
   "Show what will be published and to whom before confirming.",
   "Check for missing required data before publishing.",
   "Show the live state and time after publishing."
  ],
  "accessibility": [
   "Give status labels text values.",
   "Announce success and any blocking errors."
  ],
  "content": [
   "Use Publish and Schedule.",
   "Say who will see it, such as Visible to everyone in the workspace."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html"
  ],
  "map": []
 },
 "patterns|Unpublish": {
  "text": "Removes a published item from its audience but keeps it.",
  "purpose": "Lets people take content down quickly without deleting it.",
  "use": [
   "Content is wrong, outdated, or needs changes.",
   "Before archiving content that is still live."
  ],
  "avoid": [
   "Content that should be kept: do not use Delete.",
   "Do not unpublish without saying who loses access."
  ],
  "anatomy": [
   "Unpublish action — in the overflow menu.",
   "Confirmation dialog — states the impact on viewers and links.",
   "Status label — changes to Unpublished or Draft."
  ],
  "behavior": [
   "Confirm when the content is in use or linked elsewhere.",
   "Keep the content and its history intact.",
   "Let people publish it again later."
  ],
  "accessibility": [
   "Use an alert dialog for the confirmation.",
   "Announce the new status."
  ],
  "content": [
   "Use Unpublish.",
   "Name the impact, such as Links to this asset will stop working."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ],
  "map": []
 },
 "patterns|Archive": {
  "text": "Moves an item out of active views while keeping it for reference.",
  "purpose": "Reduces clutter without losing data.",
  "use": [
   "Finished or inactive items people may need later.",
   "A safe alternative to deleting."
  ],
  "avoid": [
   "The item must be fully removed: use Delete.",
   "Do not hide archived items without a way to find them."
  ],
  "anatomy": [
   "Archive action — in the overflow menu or as a bulk action.",
   "Archived view — a filter or section that lists archived items.",
   "Status label — Archived.",
   "Undo — in the confirmation message."
  ],
  "behavior": [
   "Remove the item from active views and offer undo.",
   "Make archived items read-only unless restored.",
   "Keep archived items searchable through a filter."
  ],
  "accessibility": [
   "Announce the result with a status message that includes undo.",
   "Keep undo available long enough to reach by keyboard."
  ],
  "content": [
   "Use Archive and Restore as a pair.",
   "Confirm with the item name, such as Archived Spring campaign."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://m3.material.io/components/snackbar/overview",
   "https://carbondesignsystem.com/components/notification/usage/"
  ],
  "map": []
 },
 "patterns|Restore": {
  "text": "Returns an archived, deleted, or earlier version of an item to active use.",
  "purpose": "Lets people recover from mistakes and bring back past work.",
  "use": [
   "Archived items, items in trash, and earlier versions.",
   "The undo path for archive and soft delete."
  ],
  "avoid": [
   "After permanent deletion.",
   "Do not overwrite the current version without saying so."
  ],
  "anatomy": [
   "Restore action — on the archived item, trash item, or version.",
   "Confirmation — needed when restoring replaces current content.",
   "Result message — says where the item now is."
  ],
  "behavior": [
   "Return the item to its original place, or ask where if it is gone.",
   "When restoring a version, keep the current version in history.",
   "Show the restored item after the action."
  ],
  "accessibility": [
   "Announce the result with the item name and location.",
   "Move focus to the restored item when people will act on it next."
  ],
  "content": [
   "Use Restore.",
   "Say what happens to the current version, such as The current version will be kept in history."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://m3.material.io/components/snackbar/overview"
  ],
  "map": []
 },
 "patterns|Onboarding": {
  "text": "Helps new people get set up and reach first value in the product.",
  "purpose": "Shortens the time from first visit to first useful result.",
  "use": [
   "First sign-in, new workspaces, and newly granted features.",
   "Helpful empty states and a setup checklist as the main tools."
  ],
  "avoid": [
   "Do not block people with long tours before they can act.",
   "Do not repeat onboarding people have finished or dismissed."
  ],
  "anatomy": [
   "Welcome — a short screen or message that sets context.",
   "Setup steps — the few tasks needed to start.",
   "Empty states — guidance in places that have no content yet.",
   "In-context hints — coach marks or contextual help where needed."
  ],
  "behavior": [
   "Let people skip and come back later.",
   "Track progress and remember what is done.",
   "Teach in context at the moment of need, not up front."
  ],
  "accessibility": [
   "Make every onboarding surface dismissible with Escape and a visible close button.",
   "Move focus to new onboarding content and return it when closed.",
   "Do not use motion that cannot be paused or reduced."
  ],
  "content": [
   "Lead with what people can do, not with product features.",
   "Keep each message to one idea and one action."
  ],
  "map": [
   [
    "Atlassian",
    "Onboarding",
    "Direct"
   ],
   [
    "Material 3",
    "Onboarding (Material 2)",
    "Partial"
   ],
   [
    "Carbon",
    "Empty states",
    "Partial"
   ],
   [
    "Spectrum",
    "Coach mark",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Material, and Carbon agree on short, skippable onboarding that teaches in context, using empty states and focused hints over long tours.",
  "sources": [
   "https://atlassian.design/components/onboarding/",
   "https://m2.material.io/design/communication/onboarding.html",
   "https://carbondesignsystem.com/patterns/empty-states-pattern/",
   "https://spectrum.adobe.com/page/coach-mark"
  ]
 },
 "patterns|Product tour": {
  "text": "A sequence of anchored messages that introduce key parts of the interface in order.",
  "purpose": "Orients people to an unfamiliar or changed interface in a few steps.",
  "use": [
   "After a major redesign, or for a new area with several connected parts.",
   "People start it themselves or agree to it."
  ],
  "avoid": [
   "One feature: use a single coach mark.",
   "More than about five steps: split or teach in context instead."
  ],
  "anatomy": [
   "Step popover — title, short text, and media if needed.",
   "Anchor — the element each step points to.",
   "Step count — such as 2 of 4.",
   "Controls — Next, Back, and Skip tour."
  ],
  "behavior": [
   "Let people skip at any step and restart later from help.",
   "Scroll each anchor into view before showing its step.",
   "End with a clear finish; do not show the tour again."
  ],
  "accessibility": [
   "Treat each step as a non-modal dialog with a name and focusable controls.",
   "Move focus to the step and return it to the trigger when the tour ends.",
   "Support Escape to end the tour."
  ],
  "content": [
   "Write a short title and one or two sentences per step.",
   "Use Next, Back, and Done; avoid playful labels."
  ],
  "map": [
   [
    "Atlassian",
    "Spotlight",
    "Direct"
   ],
   [
    "Fluent 2",
    "Teaching popover",
    "Partial"
   ],
   [
    "Spectrum",
    "Coach mark",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Fluent 2, and Spectrum agree on short, skippable, anchored step sequences with step counts and Next and Back controls.",
  "sources": [
   "https://atlassian.design/components/spotlight/",
   "https://fluent2.microsoft.design/components/web/react/core/teachingpopover/usage",
   "https://spectrum.adobe.com/page/coach-mark"
  ]
 },
 "patterns|Spotlight": {
  "text": "Onboarding technique: dims the page and highlights one element with an explanation.",
  "purpose": "Draws strong attention to a single element people must notice.",
  "use": [
   "One critical element in a first-run tour.",
   "Sparingly, when a lighter coach mark would be missed."
  ],
  "avoid": [
   "Routine tips: use a coach mark or contextual help.",
   "Do not spotlight elements that are off screen or not yet usable."
  ],
  "anatomy": [
   "Overlay — dims everything but the target.",
   "Target cutout — the highlighted element.",
   "Dialog — title, text, and actions next to the target.",
   "Actions — Next, Skip, or Done."
  ],
  "behavior": [
   "Block other interaction while the spotlight shows, or let people click the target if that is the lesson.",
   "Close on Escape and on Skip.",
   "Return people to where they were when it closes."
  ],
  "accessibility": [
   "Treat the spotlight as a modal dialog and trap focus inside it.",
   "Give the dialog a name and description.",
   "Keep enough contrast between the dimmed page and the dialog."
  ],
  "content": [
   "Name the element and why it matters in one or two sentences.",
   "Use one clear action label."
  ],
  "map": [
   [
    "Atlassian",
    "Spotlight",
    "Direct"
   ],
   [
    "Fluent 2",
    "Teaching popover",
    "Partial"
   ],
   [
    "Spectrum",
    "Coach mark",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian defines spotlight directly; Fluent 2 and Spectrum use lighter anchored popovers for the same goal. All keep it brief, dismissible, and rare.",
  "sources": [
   "https://atlassian.design/components/spotlight/",
   "https://fluent2.microsoft.design/components/web/react/core/teachingpopover/usage",
   "https://spectrum.adobe.com/page/coach-mark",
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ]
 },
 "patterns|Coach mark": {
  "text": "A small popover, anchored to an element, that teaches what the element does.",
  "purpose": "Explains a feature in place without hiding the rest of the page.",
  "use": [
   "Pointing out a new or easily missed control.",
   "A step in a short product tour."
  ],
  "avoid": [
   "Do not show several coach marks at once.",
   "Essential instructions: put those in the interface."
  ],
  "anatomy": [
   "Popover — title, body, and optional image.",
   "Pointer — the beak or indicator aimed at the anchor.",
   "Actions — Dismiss, and Next or Back in a sequence.",
   "Step count — when part of a tour."
  ],
  "behavior": [
   "Show it once and remember when it is dismissed.",
   "Keep it attached to the anchor on scroll and resize.",
   "Do not block interaction with the rest of the page."
  ],
  "accessibility": [
   "Make it a non-modal dialog with a name and focusable close button.",
   "Let Escape dismiss it and return focus to the anchor.",
   "Keep text contrast at 4.5:1 or more."
  ],
  "content": [
   "Keep the title to a few words and the body to one or two sentences.",
   "Start with the benefit, then the action."
  ],
  "map": [
   [
    "Spectrum",
    "Coach mark",
    "Direct"
   ],
   [
    "Fluent 2",
    "Teaching popover",
    "Direct"
   ],
   [
    "Carbon",
    "Coachmark",
    "Direct"
   ],
   [
    "Atlassian",
    "Spotlight",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum, Fluent 2, and Carbon define an anchored teaching popover with title, short body, and dismiss; they agree to show one at a time.",
  "sources": [
   "https://spectrum.adobe.com/page/coach-mark",
   "https://fluent2.microsoft.design/components/web/react/core/teachingpopover/usage",
   "https://atlassian.design/components/spotlight/"
  ]
 },
 "patterns|Walkthrough": {
  "text": "A guided sequence that helps people complete a real task step by step in the live interface.",
  "purpose": "Teaches by doing: people finish an actual task while they learn.",
  "use": [
   "First-time tasks with several steps in different places.",
   "People choose to start it from help or a checklist."
  ],
  "avoid": [
   "Explaining the layout: use a product tour.",
   "Do not force it on people who have done the task before."
  ],
  "anatomy": [
   "Step guide — anchored popover with the current instruction.",
   "Progress — step count and a way to see all steps.",
   "Task targets — the real controls people use.",
   "Exit — a way to stop and resume later."
  ],
  "behavior": [
   "Move to the next step when people complete the current action.",
   "Let people exit and resume where they stopped.",
   "Confirm completion at the end."
  ],
  "accessibility": [
   "Announce each new step and keep focus on the real control people must use.",
   "Make all steps reachable and completable by keyboard."
  ],
  "content": [
   "Write each step as one direct instruction, such as Select Upload.",
   "Name the outcome at the end."
  ],
  "map": [
   [
    "Atlassian",
    "Spotlight",
    "Partial"
   ],
   [
    "Fluent 2",
    "Teaching popover",
    "Partial"
   ],
   [
    "Spectrum",
    "Coach mark",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Fluent 2, and Spectrum provide anchored step popovers that can drive a task walkthrough; Salesforce Lightning also offers walkthroughs. All use skippable, resumable steps.",
  "sources": [
   "https://atlassian.design/components/spotlight/",
   "https://fluent2.microsoft.design/components/web/react/core/teachingpopover/usage",
   "https://spectrum.adobe.com/page/coach-mark"
  ]
 },
 "patterns|Checklist": {
  "text": "A persistent list of setup tasks that shows what is done and what remains.",
  "purpose": "Gives people a clear path to a fully set-up product and lets them work at their own pace.",
  "use": [
   "Onboarding with several independent setup tasks.",
   "Tasks can be done in any order and over several sessions."
  ],
  "avoid": [
   "A strict sequence: use a wizard.",
   "Do not keep it on screen after all tasks are done."
  ],
  "anatomy": [
   "Header — title and overall progress.",
   "Task rows — name, status, and a link to do the task.",
   "Optional details — short explanation per task.",
   "Dismiss — hide the checklist when done or not needed."
  ],
  "behavior": [
   "Mark tasks done automatically when people complete them.",
   "Let people collapse or dismiss the checklist and find it again later.",
   "Show progress as a count, such as 3 of 5 done."
  ],
  "accessibility": [
   "Use a list with text status for each task, not only icons.",
   "Make each task row a link or button with a clear name."
  ],
  "content": [
   "Write tasks as short verb phrases, such as Invite your team.",
   "Use plain status words, such as Done and Not started."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://design-system.service.gov.uk/components/task-list/",
   "https://www.lightningdesignsystem.com/components/setup-assistant/"
  ],
  "map": []
 },
 "patterns|Contextual education": {
  "text": "Help placed next to the control or concept it explains, shown when people need it.",
  "purpose": "Answers questions at the point of need without sending people to separate documentation.",
  "use": [
   "Terms and settings that need explanation: an info button with a popover.",
   "Short guidance people always need: helper text under fields."
  ],
  "avoid": [
   "Essential instructions in a hidden popover: show them as text.",
   "Hover-only tooltips for content people must read."
  ],
  "anatomy": [
   "Trigger — an info or help icon button next to the label.",
   "Popover — short title, explanation, and optional link.",
   "Learn more link — goes to full documentation."
  ],
  "behavior": [
   "Open on click or Enter, not only on hover.",
   "Close on Escape or click outside.",
   "Keep the popover anchored and do not cover the field it explains."
  ],
  "accessibility": [
   "Give the trigger an accessible name, such as More about retention.",
   "Return focus to the trigger on close.",
   "Keep the icon target at least 24 by 24 pixels."
  ],
  "content": [
   "Answer one question in one to three sentences.",
   "Link to more detail instead of writing long help text."
  ],
  "map": [
   [
    "Spectrum",
    "Contextual help",
    "Direct"
   ],
   [
    "Carbon",
    "Toggletip",
    "Partial"
   ],
   [
    "Fluent 2",
    "Info label",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum, Carbon, and Fluent 2 agree on a click-triggered info popover next to the label, with short text and an optional link, instead of hover tooltips.",
  "sources": [
   "https://react-spectrum.adobe.com/v3/ContextualHelp.html",
   "https://carbondesignsystem.com/components/toggletip/usage/",
   "https://fluent2.microsoft.design/components/web/react/core/infolabel/usage"
  ]
 },
 "patterns|Feature introduction": {
  "text": "A brief announcement of a new or changed feature, shown where people will use it.",
  "purpose": "Helps people notice and adopt new capabilities without disrupting their work.",
  "use": [
   "A coach mark or New label on the changed control.",
   "Only major changes that affect most people: a short modal."
  ],
  "avoid": [
   "Modals for small changes.",
   "Do not stack several announcements at once."
  ],
  "anatomy": [
   "New indicator — a tag or dot on the feature.",
   "Teaching popover or modal — what is new and why it helps.",
   "Primary action — Try it or Got it.",
   "Learn more — link to details."
  ],
  "behavior": [
   "Show it once per person and remember dismissal.",
   "Remove the New indicator after the person uses the feature or after a set time.",
   "Wait until the person reaches the relevant area."
  ],
  "accessibility": [
   "Make the indicator readable as text, such as New.",
   "Make the popover or modal dismissible with Escape."
  ],
  "content": [
   "Lead with the benefit in one sentence.",
   "Use a short, plain title without hype."
  ],
  "map": [
   [
    "Atlassian",
    "Spotlight",
    "Partial"
   ],
   [
    "Fluent 2",
    "Teaching popover",
    "Partial"
   ],
   [
    "Spectrum",
    "Coach mark",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Fluent 2, and Spectrum agree on small, anchored, once-only announcements, with modals reserved for major changes.",
  "sources": [
   "https://atlassian.design/components/onboarding/",
   "https://fluent2.microsoft.design/components/web/react/core/teachingpopover/usage",
   "https://spectrum.adobe.com/page/coach-mark"
  ]
 },
 "patterns|Sign in": {
  "text": "Confirms who a person is so they can use their account.",
  "purpose": "Gives returning people quick, secure access with the fewest steps.",
  "use": [
   "The entry point for every authenticated area.",
   "Offer single sign-on first when the organization uses it."
  ],
  "avoid": [
   "Do not ask for more than identifier and password on one screen unless required.",
   "Do not block paste or password managers."
  ],
  "anatomy": [
   "Identifier field — email or username.",
   "Password field — with a show password toggle.",
   "Sign-in button — the primary action.",
   "Secondary links — Forgot password, single sign-on, and create account."
  ],
  "behavior": [
   "Allow paste and autofill in all fields.",
   "Show one general error for wrong credentials without saying which part was wrong.",
   "Keep the identifier when sign-in fails.",
   "Return people to the page they were trying to reach."
  ],
  "accessibility": [
   "Use autocomplete values username and current-password.",
   "Do not require a cognitive test such as remembering or transcribing without an alternative.",
   "Link errors to fields and announce them."
  ],
  "content": [
   "Use Sign in consistently, not Log in in some places.",
   "Write errors that help, such as Email or password is incorrect."
  ],
  "map": [
   [
    "Carbon",
    "Login",
    "Direct"
   ]
  ],
  "commonGround": "Carbon defines a login pattern; GOV.UK and WCAG 2.2 agree on allowing paste and password managers, a show password option, and non-specific credential errors.",
  "sources": [
   "https://carbondesignsystem.com/patterns/login-pattern/",
   "https://design-system.service.gov.uk/patterns/passwords/",
   "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html",
   "https://pages.nist.gov/800-63-4/sp800-63b.html"
  ]
 },
 "patterns|Sign up": {
  "text": "Creates a new account for a person.",
  "purpose": "Gets new people into the product with only the information truly needed.",
  "use": [
   "Self-service products, and invited users setting up access.",
   "Single sign-on sign up, when the organization manages identity."
  ],
  "avoid": [
   "Do not ask for details that can be collected later.",
   "Do not ask people to confirm email or password by typing it twice."
  ],
  "anatomy": [
   "Identity fields — name and email.",
   "Password field — with show toggle and the rules shown up front.",
   "Terms consent — when legally required.",
   "Verification — email confirmation step."
  ],
  "behavior": [
   "Show password rules before people type, not only after errors.",
   "Verify the email with a link or code before full access.",
   "Sign people in after sign up and take them to onboarding."
  ],
  "accessibility": [
   "Use autocomplete values such as email and new-password.",
   "Link rules and errors to the password field.",
   "Do not ask for the same data twice in one flow."
  ],
  "content": [
   "Use Create account as the action.",
   "Explain why each optional field is asked for."
  ],
  "map": [
   [
    "Carbon",
    "Login",
    "Partial"
   ]
  ],
  "commonGround": "GOV.UK and Carbon agree on minimal fields and clear password rules; GOV.UK adds email confirmation and avoiding repeated entry.",
  "sources": [
   "https://design-system.service.gov.uk/patterns/create-accounts/",
   "https://design-system.service.gov.uk/patterns/passwords/",
   "https://carbondesignsystem.com/patterns/login-pattern/",
   "https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html",
   "https://pages.nist.gov/800-63-4/sp800-63b.html"
  ]
 },
 "patterns|Password reset": {
  "text": "Lets people set a new password when they forget the old one.",
  "purpose": "Restores access safely without support help.",
  "use": [
   "From the sign-in screen, through a Forgot password link.",
   "An admin forces a password change."
  ],
  "avoid": [
   "Do not say whether an email has an account; use the same message either way.",
   "Do not send passwords by email."
  ],
  "anatomy": [
   "Request step — email field and Send reset link button.",
   "Message step — tells people to check their email.",
   "Reset link or code — time-limited and single-use.",
   "New password step — new password field with rules and show toggle."
  ],
  "behavior": [
   "Expire reset links after a short time and after use.",
   "Sign out other sessions after a reset.",
   "Confirm success and let people sign in or sign them in directly."
  ],
  "accessibility": [
   "Use autocomplete new-password on the new password field.",
   "Let people paste codes and passwords.",
   "Announce errors and link them to fields."
  ],
  "content": [
   "Use Reset password as the action name.",
   "Use a neutral message such as If an account exists, we sent a link."
  ],
  "map": [
   [
    "Carbon",
    "Login",
    "Partial"
   ]
  ],
  "commonGround": "Carbon covers the forgot-password entry point; NIST and GOV.UK agree on single-use, time-limited links and neutral messages.",
  "sources": [
   "https://carbondesignsystem.com/patterns/login-pattern/",
   "https://design-system.service.gov.uk/patterns/passwords/",
   "https://pages.nist.gov/800-63-4/sp800-63b.html"
  ]
 },
 "patterns|Multi-factor authentication": {
  "text": "A sign-in step that asks for a second proof of identity beyond the password.",
  "purpose": "Protects accounts if a password is stolen.",
  "use": [
   "All accounts with access to sensitive data or admin powers.",
   "Offer phishing-resistant options such as passkeys or security keys first."
  ],
  "avoid": [
   "SMS codes alone for high-risk access.",
   "Asking for the second factor on every action: use it at sign-in and for risky changes."
  ],
  "anatomy": [
   "Method choice — authenticator app, passkey, security key, or code.",
   "Code field — a single input for the one-time code.",
   "Remember this device — optional choice.",
   "Backup methods — recovery codes or another factor."
  ],
  "behavior": [
   "Accept pasted codes and autofilled one-time codes.",
   "Let people resend a code after a short wait; show when.",
   "Give backup codes during setup and ask people to store them."
  ],
  "accessibility": [
   "Use one input with autocomplete one-time-code, not one box per digit.",
   "Give enough time to enter codes or let people extend it.",
   "Do not rely on transcribing as the only option where a passkey or copy-paste is possible."
  ],
  "content": [
   "Say where the code was sent, such as to the phone ending 42.",
   "Use plain method names, such as Authenticator app."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://pages.nist.gov/800-63-4/sp800-63b.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html",
   "https://design-system.service.gov.uk/patterns/confirm-a-phone-number/"
  ],
  "map": []
 },
 "patterns|Single sign-on": {
  "text": "A sign-in method where people use their organization's identity provider instead of a separate password.",
  "purpose": "Lets organizations control access centrally and spares people another password.",
  "use": [
   "Organizations that manage identity centrally.",
   "Detect the organization from the email domain and send people to the right provider."
  ],
  "avoid": [
   "Do not show a password field to people whose organization requires SSO.",
   "Do not hide which provider people will be sent to."
  ],
  "anatomy": [
   "SSO button — such as Continue with your organization.",
   "Email-first step — finds the organization from the domain.",
   "Redirect state — a message while handing off.",
   "Error state — explains when the provider rejects access."
  ],
  "behavior": [
   "Ask for email first and route to SSO or password as needed.",
   "Return people to the page they wanted after SSO completes.",
   "Explain provider errors and who to contact."
  ],
  "accessibility": [
   "Announce redirects and loading states.",
   "Give provider buttons text names, not only logos."
  ],
  "content": [
   "Name the provider when known, such as Continue with Okta.",
   "Point to the admin when access is denied."
  ],
  "map": [
   [
    "Carbon",
    "Login",
    "Partial"
   ]
  ],
  "commonGround": "Carbon includes SSO as a login option and uses an email-first step; general enterprise practice agrees on routing by domain.",
  "sources": [
   "https://carbondesignsystem.com/patterns/login-pattern/",
   "https://pages.nist.gov/800-63-4/sp800-63b.html"
  ]
 },
 "patterns|Account recovery": {
  "text": "A flow for regaining access when people lose their password, second factor, or device.",
  "purpose": "Restores access safely when normal sign-in cannot work.",
  "use": [
   "People lose a second factor or cannot reach their email.",
   "Managed organizations: use admin-assisted recovery."
  ],
  "avoid": [
   "Do not use security questions for recovery.",
   "Do not make recovery easier for attackers than sign-in."
  ],
  "anatomy": [
   "Recovery entry — a link from the sign-in and MFA screens.",
   "Recovery methods — backup codes, another factor, or admin help.",
   "Identity check — the step that proves the person is the owner.",
   "Confirmation — notice sent to all contact methods."
  ],
  "behavior": [
   "Offer saved backup codes first.",
   "Notify the account owner on every recovery attempt.",
   "Ask people to set up new factors after recovery."
  ],
  "accessibility": [
   "Do not depend on a single method that some people cannot use.",
   "Let people paste backup codes."
  ],
  "content": [
   "Explain each method and what people will need.",
   "Say who to contact when no method works."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://pages.nist.gov/800-63-4/sp800-63b.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html"
  ],
  "map": []
 },
 "patterns|Permissions": {
  "text": "The rules that decide what each person can see and do, and how the interface shows those limits.",
  "purpose": "Protects data while making clear why people can or cannot act.",
  "use": [
   "Permission states on any action or data limited by role or ownership.",
   "A permissions screen for admins to review and change access."
  ],
  "avoid": [
   "Actions people can never use: hide them.",
   "Do not disable actions without saying why."
  ],
  "anatomy": [
   "Permission levels — such as View, Edit, Manage.",
   "Access list — people and groups with their levels.",
   "Restricted state — a disabled control or read-only view with a reason.",
   "Request access — a path to ask for more."
  ],
  "behavior": [
   "Hide actions people will never have; disable with a reason those they could gain.",
   "Check permissions on the server for every action.",
   "Apply changes right away and tell affected people when it matters."
  ],
  "accessibility": [
   "Explain disabled controls with visible text or a description, not only a tooltip.",
   "Use a table with headers for access lists."
  ],
  "content": [
   "Name levels with plain verbs, such as Can view and Can edit.",
   "Say who can grant access."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/table/"
  ],
  "map": []
 },
 "patterns|Roles": {
  "text": "Named sets of permissions assigned to people or groups.",
  "purpose": "Makes access easy to manage by grouping permissions into a few understandable roles.",
  "use": [
   "A small set of roles that match real jobs, such as Viewer, Editor, Admin.",
   "Custom roles, only when organizations need them."
  ],
  "avoid": [
   "Do not create many overlapping roles.",
   "Do not make people guess what a role allows."
  ],
  "anatomy": [
   "Role list — names and short descriptions.",
   "Role detail — the permissions included.",
   "Role picker — select or radio group when assigning.",
   "Members — who holds the role."
  ],
  "behavior": [
   "Show what each role allows when people pick one.",
   "Prevent removing the last admin.",
   "Record role changes in an audit log."
  ],
  "accessibility": [
   "Use a radio group or select with a description for each role.",
   "Read permission tables with proper headers."
  ],
  "content": [
   "Name roles with short job nouns.",
   "Describe each role in one sentence of what it can do."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/radio/"
  ],
  "map": []
 },
 "patterns|Access request": {
  "text": "A flow for asking an owner or admin for access to something people cannot open.",
  "purpose": "Turns a dead end into a clear path to the content people need.",
  "use": [
   "No-access pages and restricted actions.",
   "An owner or admin can grant access in the product."
  ],
  "avoid": [
   "Do not show request options when access can never be granted.",
   "Do not reveal sensitive details about the restricted item."
  ],
  "anatomy": [
   "No-access message — says access is needed.",
   "Request button — sends the request.",
   "Optional note — why access is needed.",
   "Request status — pending, granted, or declined."
  ],
  "behavior": [
   "Notify the owner and let them approve or decline in one step.",
   "Notify the requester of the decision.",
   "Prevent duplicate requests while one is pending."
  ],
  "accessibility": [
   "Move focus to the message heading on no-access pages.",
   "Announce request sent and decision outcomes."
  ],
  "content": [
   "Say who will receive the request.",
   "Use \"Request access\" as the action."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ],
  "map": []
 },
 "patterns|Account connection": {
  "text": "Links the product to an account on another service, and disconnects it.",
  "purpose": "Shows which outside account is linked and lets people connect or disconnect it safely.",
  "use": [
   "Integrations such as storage, publishing, or identity services.",
   "Settings where one external account is linked."
  ],
  "avoid": [
   "Do not request more access than the integration needs.",
   "Do not connect accounts without clear consent."
  ],
  "anatomy": [
   "Service name and logo — what will be connected.",
   "Connection status — connected account name or Not connected.",
   "Connect or Disconnect button.",
   "Terms and scopes — what data will be shared."
  ],
  "behavior": [
   "Explain the access requested before sending people to the other service.",
   "Show the connected account name after linking.",
   "Confirm before disconnecting and say what stops working."
  ],
  "accessibility": [
   "Give logos text alternatives with the service name.",
   "Announce connection status changes."
  ],
  "content": [
   "Use Connect and Disconnect.",
   "List shared data in plain words."
  ],
  "map": [
   [
    "Polaris",
    "Account connection",
    "Direct"
   ]
  ],
  "commonGround": "Polaris defines account connection with service name, status, terms, and a Connect or Disconnect action; it is deprecated there, but the guidance stands.",
  "sources": [
   "https://polaris-react.shopify.com/components/deprecated/account-connection"
  ]
 },
 "patterns|Session timeout": {
  "text": "Warns people before an inactive session ends and lets them extend it.",
  "purpose": "Protects accounts on shared devices without losing people's work.",
  "use": [
   "Security policy requires ending inactive sessions.",
   "A warning dialog shortly before the timeout."
  ],
  "avoid": [
   "Do not end sessions without warning when people may lose work.",
   "Do not time out too fast for the task's real needs."
  ],
  "anatomy": [
   "Warning dialog — shows remaining time.",
   "Stay signed in button — extends the session.",
   "Sign out button — ends it now.",
   "Signed-out page — explains what happened and how to return."
  ],
  "behavior": [
   "Warn at least 20 seconds before timeout; let people extend with one action.",
   "Save work before signing out where possible.",
   "Return people to where they were after they sign back in."
  ],
  "accessibility": [
   "Meet WCAG timing rules by letting people extend the time.",
   "Use an alert dialog; do not announce the countdown every second.",
   "Move focus to the dialog when it opens."
  ],
  "content": [
   "Say how long is left and what will happen.",
   "Use Stay signed in and Sign out."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html",
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ],
  "map": []
 },
 "patterns|Import workflow": {
  "text": "Brings many records or files in end to end, from source choice to mapping, validation, and results.",
  "purpose": "Moves outside data in safely, with a chance to fix problems before anything changes.",
  "use": [
   "Bulk data, such as spreadsheets of metadata or batches of assets.",
   "Data needs mapping or validation: a staged flow."
  ],
  "avoid": [
   "Data that changes existing records, without a preview.",
   "A single file upload."
  ],
  "anatomy": [
   "Source step — upload, drop, or pick a connected source.",
   "Mapping step — match source columns to fields.",
   "Review step — preview with errors and warnings.",
   "Run and results — progress, then counts of added, updated, and failed."
  ],
  "behavior": [
   "Validate before importing and let people fix or skip bad rows.",
   "Say whether existing records will be updated or duplicated.",
   "Run large imports in the background and notify when done.",
   "Offer a downloadable error report."
  ],
  "accessibility": [
   "Expose step progress with a labeled progress indicator.",
   "Make error tables navigable and errors readable as text.",
   "Announce completion with counts."
  ],
  "content": [
   "Use Import as the action and a specific final label, such as Import 240 records.",
   "Write row errors with the row number and the fix."
  ],
  "map": [
   [
    "Carbon",
    "File uploader",
    "Partial"
   ],
   [
    "Polaris",
    "Drop zone",
    "Partial"
   ],
   [
    "Spectrum",
    "Drop zone",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Polaris, and Spectrum cover the upload step; enterprise systems such as SAP Fiori add mapping and validation before import.",
  "sources": [
   "https://carbondesignsystem.com/components/file-uploader/usage/",
   "https://polaris-react.shopify.com/components/selection-and-input/drop-zone",
   "https://react-spectrum.adobe.com/v3/DropZone.html",
   "https://carbondesignsystem.com/components/progress-indicator/usage/",
   "https://www.sap.com/design-system/fiori-design-web"
  ]
 },
 "patterns|Export workflow": {
  "text": "Takes data out end to end, from choosing scope and format to delivering the file.",
  "purpose": "Gives people the exact data they need in a usable form without blocking their work.",
  "use": [
   "Large or configurable exports of records, metadata, or assets.",
   "Long jobs: background export with notification."
  ],
  "avoid": [
   "Options people rarely need: keep sensible defaults.",
   "Do not export data people cannot view."
  ],
  "anatomy": [
   "Scope choice — selected, filtered, or all items.",
   "Format and fields — file type and included columns.",
   "Progress — status for long exports.",
   "Delivery — download, notification, or email link."
  ],
  "behavior": [
   "Default to the current selection or filter.",
   "Estimate size or count before starting.",
   "Notify when ready and keep the file available for a set time."
  ],
  "accessibility": [
   "Label options as a form with clear defaults.",
   "Announce when the export is ready."
  ],
  "content": [
   "Use Export as the action.",
   "Say how long download links stay valid."
  ],
  "map": [
   [
    "Carbon",
    "Export modal",
    "Partial"
   ]
  ],
  "commonGround": "Carbon (product extensions) and SAP Fiori agree on scope and format choice, then a download or notification.",
  "sources": [
   "https://www.sap.com/design-system/fiori-design-web",
   "https://carbondesignsystem.com/components/notification/usage/"
  ]
 },
 "patterns|Data review workflow": {
  "text": "Checks a batch of data for problems and fixes them before the data is used.",
  "purpose": "Catches errors and missing data early, so bad data does not spread.",
  "use": [
   "After imports, bulk edits, and automated tagging.",
   "Data quality rules can flag problems."
  ],
  "avoid": [
   "Showing every record when only some need attention: filter to issues.",
   "Do not apply fixes without a preview."
  ],
  "anatomy": [
   "Summary — counts of valid, warning, and error items.",
   "Issue list — filterable table of flagged items.",
   "Fix actions — edit, bulk fix, or ignore.",
   "Finish action — accept the reviewed data."
  ],
  "behavior": [
   "Default to showing items that need attention.",
   "Update counts as issues are fixed.",
   "Allow bulk fixes for repeated issues."
  ],
  "accessibility": [
   "Show severity in text and icon, not color alone.",
   "Make the table and fix actions keyboard operable."
  ],
  "content": [
   "Name each issue and its fix, such as Missing copyright, add one.",
   "Use the same severity words everywhere."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://carbondesignsystem.com/components/data-grid/usage/",
   "https://design-system.service.gov.uk/patterns/check-answers/"
  ],
  "map": []
 },
 "patterns|Lifecycle journeys": {
  "text": "The end-to-end stages a person or organization goes through with the product, from first visit to leaving.",
  "purpose": "Helps teams design each stage on purpose, so the experience stays consistent over time.",
  "use": [
   "Planning onboarding, regular use, growth, renewal, and offboarding.",
   "Deciding which patterns each stage needs."
  ],
  "avoid": [
   "Designing stages in isolation: check the handoffs between them.",
   "Treating it as a single screen: it is a planning frame."
  ],
  "anatomy": [
   "Stages — such as discover, start, adopt, expand, renew, leave.",
   "Key moments — the events that move people between stages.",
   "Patterns per stage — onboarding, trial, upgrade, offboarding.",
   "Signals — what shows a person is stuck or ready to move on."
  ],
  "behavior": [
   "Map each stage to the screens and messages that serve it.",
   "Keep naming and tone consistent across stages.",
   "Review stages when the product changes."
  ],
  "accessibility": [
   "Keep every stage accessible, including emails and external pages.",
   "Let people resume at any stage without repeating steps."
  ],
  "content": [
   "Use the same terms for plans, roles, and objects at every stage.",
   "Tell people what comes next at each transition."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://atlassian.design/components/onboarding/",
   "https://carbondesignsystem.com/patterns/empty-states-pattern/"
  ],
  "map": []
 },
 "patterns|Trial and upgrade": {
  "text": "Lets people try paid features for a limited time and move to a paid plan.",
  "purpose": "Helps people judge value before paying and makes upgrading clear when they are ready.",
  "use": [
   "Features or plans people need to try before buying.",
   "Upgrade paths where people hit a plan limit."
  ],
  "avoid": [
   "Do not block core work with upgrade prompts.",
   "Do not hide the trial end date or the price."
  ],
  "anatomy": [
   "Trial status — days left and what is included.",
   "Upgrade prompt — at the point of a limit, with the benefit.",
   "Plan comparison — what each plan includes.",
   "Confirmation — new plan, price, and effective date."
  ],
  "behavior": [
   "Remind people before the trial ends.",
   "Explain what happens to data and features when the trial ends.",
   "Confirm price and billing date before the upgrade is applied."
  ],
  "accessibility": [
   "Use real tables for plan comparisons.",
   "Do not use time pressure tactics or hidden countdowns."
  ],
  "content": [
   "State prices and dates plainly.",
   "Use Upgrade and Start trial as action labels."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html"
  ],
  "map": []
 },
 "patterns|Offboarding": {
  "text": "Lets people or organizations leave the product, including data export and account closure.",
  "purpose": "Lets people leave cleanly, keep their data, and understand what will be removed.",
  "use": [
   "Account deletion, plan cancellation, and removing members.",
   "Transferring ownership of content before a person leaves."
  ],
  "avoid": [
   "Do not hide the cancel or delete path.",
   "Do not delete data without a clear notice and a chance to export."
  ],
  "anatomy": [
   "Start point — a clear Cancel plan or Delete account action in settings.",
   "Impact summary — what will be lost and when.",
   "Export and transfer — ways to keep data or hand it over.",
   "Confirmation — final step and a receipt by email."
  ],
  "behavior": [
   "Offer data export before closure.",
   "Ask for ownership transfer when content would be orphaned.",
   "Confirm with a final step and explain any grace period."
  ],
  "accessibility": [
   "Use an alert dialog for the final confirmation.",
   "Do not rely on time limits during the flow."
  ],
  "content": [
   "Say plainly what will be deleted and when.",
   "Use the exact action name on the final button, such as Delete account."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html",
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ],
  "map": []
 },
 "specialized|File": {
  "text": "A single stored item, shown as a type icon or thumbnail, a name, and key facts such as size and date.",
  "purpose": "Gives every file one consistent representation, so people can recognize, compare, and act on files anywhere.",
  "use": [
   "A stored file appears as an object in a list, grid, picker, or attachment area.",
   "Uploaded attachments before they become managed assets."
  ],
  "avoid": [
   "Managed media with rights and renditions: use Asset instead.",
   "A plain link to an external page: use Link instead."
  ],
  "anatomy": [
   "Type icon or thumbnail — shows the format at a glance.",
   "File name — the primary label, including the extension when the type matters.",
   "Metadata — size, modified date, or owner in secondary text.",
   "Actions — open, download, or more actions on hover and focus."
  ],
  "behavior": [
   "Open the file in a viewer on primary activation; offer download as a separate action.",
   "Truncate long names in the middle so the extension stays visible; show the full name in a tooltip.",
   "Show an error state with a reason when the file is corrupt, missing, or blocked."
  ],
  "accessibility": [
   "Give the file one accessible name that includes the file name and type.",
   "Do not rely on the icon color alone to convey the file type."
  ],
  "content": [
   "Show the real file name; do not rewrite it.",
   "Format sizes in readable units such as 2.4 MB, and dates in the user locale."
  ],
  "map": [
   [
    "Carbon",
    "File uploader item",
    "Partial"
   ],
   [
    "Atlassian",
    "Object",
    "Partial"
   ],
   [
    "Polaris",
    "Thumbnail",
    "Partial"
   ],
   [
    "Spectrum",
    "Asset",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Polaris, and Spectrum all show a file as a type icon or thumbnail plus name, with size or status; none ships a standalone file object.",
  "sources": [
   "https://carbondesignsystem.com/components/file-uploader/usage/",
   "https://polaris-react.shopify.com/components/images-and-icons/thumbnail",
   "https://spectrum.adobe.com/page/asset-card/",
   "https://atlassian.design/components/object"
  ]
 },
 "specialized|Folder": {
  "text": "A container that groups files and other folders in a hierarchy.",
  "purpose": "Lets people organize and find files by location when content has a natural structure.",
  "use": [
   "Content has one owning location in a hierarchy.",
   "File browsers, trees, and pickers, to show where an item lives."
  ],
  "avoid": [
   "One item belongs to many groups: use Collection or tags instead.",
   "Do not nest folders deeper than people can follow; flatten or add search."
  ],
  "anatomy": [
   "Folder icon — shows it is a container, with an open state in trees.",
   "Name — the folder label.",
   "Count or summary — number of items, shown as secondary text.",
   "Expand control — a chevron when shown in a tree."
  ],
  "behavior": [
   "Open the folder on activation and update the breadcrumb to the new location.",
   "Accept dropped items when the user has permission; show a clear drop target.",
   "Show an empty state in an empty folder, with an upload or create action."
  ],
  "accessibility": [
   "In a tree, use the tree pattern so arrow keys expand, collapse, and move between folders.",
   "Announce the folder name and item count; expose the expanded state."
  ],
  "content": [
   "Use short, specific nouns for folder names.",
   "Do not repeat the parent folder name in the child name."
  ],
  "map": [
   [
    "Carbon",
    "Tree view",
    "Partial"
   ],
   [
    "Spectrum",
    "Tree view",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Spectrum provide tree views for folder hierarchies, with expandable nodes and arrow-key navigation; no system defines a folder object itself.",
  "sources": [
   "https://carbondesignsystem.com/components/tree-view/usage/",
   "https://spectrum.adobe.com/page/tree-view/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/"
  ]
 },
 "specialized|Asset": {
  "text": "A managed media item with metadata, rights, versions, and renditions, beyond the raw file it contains.",
  "purpose": "Represents content an organization reuses and governs, so people can trust its status, rights, and latest version.",
  "use": [
   "Images, video, audio, documents, and design files managed in the DAM.",
   "Status, rights, or usage must travel with the item."
  ],
  "avoid": [
   "Temporary attachments: use File.",
   "Do not show governance badges on every view when they add no decision value."
  ],
  "anatomy": [
   "Preview — a thumbnail or poster frame of the content.",
   "Title — the asset name, separate from the file name when they differ.",
   "Type and format — media type and file format.",
   "Status — approval, rights, or expiry state as a badge.",
   "Selection and actions — a checkbox and quick actions."
  ],
  "behavior": [
   "On activation, open the asset detail view with preview, metadata, versions, and renditions.",
   "Show status changes such as expired rights on every surface that shows the asset.",
   "Keep selection separate from opening, so people can select many assets without leaving the view."
  ],
  "accessibility": [
   "Give the preview alt text from the asset title or description, or mark it decorative when the title is adjacent.",
   "Pair every status color with text or an icon."
  ],
  "content": [
   "Use a human-readable title; keep the file name as metadata.",
   "Name statuses with plain words such as Approved, Draft, or Expired."
  ],
  "map": [
   [
    "Spectrum",
    "Asset card",
    "Direct"
   ],
   [
    "Polaris",
    "Thumbnail",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum defines asset cards with preview, title, and selection; Polaris uses thumbnails for media resources. Both separate preview from metadata and actions.",
  "sources": [
   "https://spectrum.adobe.com/page/asset-card/",
   "https://polaris-react.shopify.com/components/images-and-icons/thumbnail",
   "https://polaris-react.shopify.com/components/layout-and-structure/media-card"
  ]
 },
 "specialized|Collection": {
  "text": "A named, curated set of assets that can include items from many locations.",
  "purpose": "Lets people group assets for a campaign, project, or handoff without moving them out of their folders.",
  "use": [
   "The same asset belongs to several groups.",
   "Sharing or handing off a curated set of assets."
  ],
  "avoid": [
   "Modeling the storage hierarchy: use Folder instead.",
   "A saved query: use a saved search or filter instead."
  ],
  "anatomy": [
   "Cover — a preview built from the first assets or a chosen image.",
   "Name — the collection title.",
   "Count and owner — number of assets and who curates it.",
   "Actions — open, share, and manage."
  ],
  "behavior": [
   "Add and remove assets without deleting them from their source.",
   "Confirm clearly when an asset is added, with a link to the collection.",
   "Show who can see the collection and whether it is shared."
  ],
  "accessibility": [
   "Announce add and remove results in a status message.",
   "Make the add-to-collection action reachable by keyboard, not only by drag."
  ],
  "content": [
   "Use names that describe the purpose, such as Spring launch social.",
   "Say Remove from collection, not Delete, when the asset stays in the library."
  ],
  "map": [
   [
    "Spectrum",
    "Card view",
    "Partial"
   ]
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://spectrum.adobe.com/page/cards/",
   "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
  ]
 },
 "specialized|File browser": {
  "text": "A view for navigating a hierarchy of folders and files, with location, view options, and actions.",
  "purpose": "Lets people find, organize, and act on files by location in one place.",
  "use": [
   "The main workspace for exploring a library by folder.",
   "People need to move, rename, and organize many items."
  ],
  "avoid": [
   "Choosing one file: use File picker instead.",
   "Search is the main way to find content: lead with search results."
  ],
  "anatomy": [
   "Location — breadcrumb and an optional folder tree.",
   "Toolbar — search, filter, sort, view switch, and create or upload actions.",
   "Content area — a file list or asset gallery.",
   "Selection bar — bulk actions that appear when items are selected.",
   "Detail panel — optional metadata and preview for the selected item."
  ],
  "behavior": [
   "Keep view mode, sort, and filters when people move between folders.",
   "Show bulk actions, with a count, only when items are selected.",
   "Support drag to move, with a keyboard alternative such as Move to."
  ],
  "accessibility": [
   "Use one landmark per region and keep focus in place after actions.",
   "Provide a keyboard path for every drag action."
  ],
  "content": [
   "Use verbs for actions, such as Upload, Move, and Rename.",
   "Write empty states that say what the folder is for and offer the next action."
  ],
  "map": [
   [
    "Carbon",
    "Data grid",
    "Partial"
   ],
   [
    "Polaris",
    "Resource index layout",
    "Partial"
   ],
   [
    "Spectrum",
    "Card view",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Polaris, and Spectrum compose browsing from a table or card grid with a toolbar, batch actions, and filters; none defines a full file browser.",
  "sources": [
   "https://carbondesignsystem.com/components/data-grid/usage/",
   "https://polaris-react.shopify.com/components/lists/resource-list",
   "https://spectrum.adobe.com/page/cards/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/"
  ]
 },
 "specialized|File list": {
  "text": "Shows files as rows with sortable columns such as name, type, size, owner, and modified date.",
  "purpose": "Lets people scan, compare, and sort many files by their attributes.",
  "use": [
   "People compare files by metadata.",
   "Document-heavy content where previews add little."
  ],
  "avoid": [
   "Visual recognition matters most: use Asset gallery instead.",
   "Do not add columns that people never sort or scan."
  ],
  "anatomy": [
   "Header — column names with sort controls.",
   "File rows — one per file.",
   "Selection column — checkboxes and a select-all control.",
   "Batch action bar — actions for the selection."
  ],
  "behavior": [
   "Sort by one column at a time and show the sort direction.",
   "Keep the header visible while scrolling long lists.",
   "Load more items progressively and keep selection across pages."
  ],
  "accessibility": [
   "Use table semantics, or the grid pattern when cells are interactive.",
   "Expose sort state with aria-sort."
  ],
  "content": [
   "Use short column names in sentence case.",
   "Show dates in one consistent format."
  ],
  "map": [
   [
    "Carbon",
    "Data grid",
    "Partial"
   ],
   [
    "Atlassian",
    "Dynamic table",
    "Partial"
   ],
   [
    "Polaris",
    "Index table",
    "Partial"
   ]
  ],
  "commonGround": "All four systems use a data grid with sortable headers, row selection, and batch actions for lists of objects such as files.",
  "sources": [
   "https://carbondesignsystem.com/components/data-grid/usage/",
   "https://atlassian.design/components/dynamic-table",
   "https://polaris-react.shopify.com/components/tables/index-table",
   "https://www.w3.org/WAI/ARIA/apg/patterns/grid/"
  ]
 },
 "specialized|Asset gallery": {
  "text": "Shows assets as a grid of preview cards.",
  "purpose": "Lets people recognize visual content at a glance and select assets quickly.",
  "use": [
   "Images, video, and design files, where the preview is the fastest identifier.",
   "Alongside a list view people can switch to."
  ],
  "avoid": [
   "Comparing many attributes: use File list.",
   "Text documents without meaningful previews."
  ],
  "anatomy": [
   "Grid — responsive columns of equal-width cards.",
   "Asset cards — preview, title, and status.",
   "Size control — small, medium, or large previews.",
   "Selection bar — count and bulk actions."
  ],
  "behavior": [
   "Keep card aspect ratio consistent and fit previews without distortion.",
   "Show selection with a checkbox and a selected border, not color alone.",
   "Load previews lazily and show a placeholder until they arrive."
  ],
  "accessibility": [
   "Use the grid pattern so arrow keys move between cards.",
   "Give each card one accessible name and keep checkboxes labeled."
  ],
  "content": [
   "Show the title under the preview and truncate it to one or two lines.",
   "Keep badges to one short word."
  ],
  "map": [
   [
    "Spectrum",
    "Card view",
    "Direct"
   ],
   [
    "Material 3",
    "Cards",
    "Partial"
   ],
   [
    "Carbon",
    "Tile",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum card view and Material cards use a responsive grid of preview cards with selection; Carbon tiles support the same layout.",
  "sources": [
   "https://spectrum.adobe.com/page/cards/",
   "https://spectrum.adobe.com/page/asset-card/",
   "https://m3.material.io/components/cards/overview",
   "https://carbondesignsystem.com/components/tile/usage/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/grid/"
  ]
 },
 "specialized|File row": {
  "text": "One line in a file list, showing a file and its attributes with selection and actions.",
  "purpose": "Gives each file a consistent, scannable line with direct actions.",
  "use": [
   "Inside File list and pickers.",
   "Upload and download managers, to show per-file state."
  ],
  "avoid": [
   "A free-standing card: use Asset or a card instead.",
   "Do not put more than one primary action in a row."
  ],
  "anatomy": [
   "Checkbox — selects the row.",
   "Icon or thumbnail — shows the type.",
   "Name — the primary cell, opens the file.",
   "Attribute cells — size, owner, date, status.",
   "Overflow menu — row actions."
  ],
  "behavior": [
   "On hover and focus, highlight the row and show row actions.",
   "Open the file on name activation; keep checkbox clicks separate.",
   "Show inline progress or error when the row is part of a transfer."
  ],
  "accessibility": [
   "Keep every row action reachable by keyboard, not only on hover.",
   "Label the row checkbox with the file name."
  ],
  "content": [
   "Keep cell text to one line and truncate with a tooltip.",
   "Use the same units and date format in every row."
  ],
  "map": [
   [
    "Carbon",
    "Data grid row",
    "Partial"
   ],
   [
    "Polaris",
    "Resource item",
    "Partial"
   ],
   [
    "Material 3",
    "List item",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Polaris, and Material agree on a row with leading media, primary text, secondary text, and trailing actions.",
  "sources": [
   "https://carbondesignsystem.com/components/data-grid/usage/",
   "https://polaris-react.shopify.com/components/lists/resource-list",
   "https://m3.material.io/components/lists/overview"
  ]
 },
 "specialized|Document viewer": {
  "text": "Displays a document such as a PDF or office file inside the product, with page navigation and zoom.",
  "purpose": "Lets people read and review documents without downloading them or leaving the product.",
  "use": [
   "Previewing PDFs, office files, and images in place.",
   "The base for annotation and review."
  ],
  "avoid": [
   "Editing: open the document in an editor instead.",
   "Formats it cannot render: offer download instead."
  ],
  "anatomy": [
   "Toolbar — page number, zoom, fit, download, and print.",
   "Canvas — the rendered pages.",
   "Thumbnails or outline — optional page navigation.",
   "Close or back — returns people to where they came from."
  ],
  "behavior": [
   "Open at fit-to-width and remember zoom for the session.",
   "Show a loading state per page, and an error with download as the fallback.",
   "As an overlay, close with Escape and return focus to the trigger."
  ],
  "accessibility": [
   "Expose the text layer so screen readers and search can read the content.",
   "Make every toolbar control keyboard reachable, with a visible label or tooltip."
  ],
  "content": [
   "Show the document name and page count, such as Page 3 of 12.",
   "Explain why a file cannot be previewed and what to do instead."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ],
  "map": []
 },
 "specialized|Video player": {
  "text": "Plays video content with standard playback controls, captions, and a timeline.",
  "purpose": "Lets people watch and review video in place with the controls they expect.",
  "use": [
   "Previewing and reviewing video assets.",
   "Tutorials and embedded media."
  ],
  "avoid": [
   "Do not autoplay with sound.",
   "Short decorative loops: use a muted animation with a pause control."
  ],
  "anatomy": [
   "Video surface — the frame with a poster image before play.",
   "Play and pause — the primary control.",
   "Timeline — scrubber with current and total time.",
   "Secondary controls — volume, captions, speed, and full screen."
  ],
  "behavior": [
   "Show controls on hover, focus, and pause; keep them visible while focused.",
   "Keep the current position when switching to full screen.",
   "Show buffering and error states over the frame."
  ],
  "accessibility": [
   "Provide captions for speech and a transcript or audio description where needed.",
   "Make every control keyboard operable, with Space to play and arrows to seek.",
   "Do not autoplay media longer than five seconds without a pause control."
  ],
  "content": [
   "Label controls with their action, such as Play and Mute.",
   "Show time as minutes and seconds."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/media/av/"
  ],
  "map": []
 },
 "specialized|Audio player": {
  "text": "Plays audio content with play, pause, a timeline, and volume.",
  "purpose": "Lets people listen to and review audio assets in place.",
  "use": [
   "Previewing audio assets such as music, voice, and sound effects.",
   "Recorded comments or meetings."
  ],
  "avoid": [
   "Do not autoplay audio.",
   "System sounds or alerts."
  ],
  "anatomy": [
   "Play and pause — the primary control.",
   "Timeline — scrubber with current and total time; optionally a waveform.",
   "Secondary controls — volume and playback speed.",
   "Title — what is playing."
  ],
  "behavior": [
   "Starting one player pauses the others on the page.",
   "Keep the position when the player re-renders.",
   "Show loading and error states in place of the timeline."
  ],
  "accessibility": [
   "Provide a transcript for speech content.",
   "Make the timeline a slider with keyboard steps and a text value."
  ],
  "content": [
   "Show the asset title and duration.",
   "Label controls with their action."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/media/av/"
  ],
  "map": []
 },
 "specialized|Upload manager": {
  "text": "Shows the progress, results, and errors of files being uploaded.",
  "purpose": "Keeps people informed about uploads that take time and lets them fix failures without starting over.",
  "use": [
   "Multi-file or large uploads that outlast a single interaction.",
   "People keep working while uploads run."
  ],
  "avoid": [
   "One small file in a form: use the file uploader inline status instead.",
   "Do not block the whole page while files upload unless the next step needs them."
  ],
  "anatomy": [
   "Drop zone or trigger — where uploads start.",
   "Queue — a row per file with name, size, and progress.",
   "Status — in progress, complete, or failed with a reason.",
   "Summary — overall progress and counts.",
   "Actions — cancel, retry, and remove."
  ],
  "behavior": [
   "Validate type and size before uploading and show the reason for any rejection.",
   "Upload in the background and keep the manager reachable from any page.",
   "Let people retry failed files individually and cancel any file in progress."
  ],
  "accessibility": [
   "Announce start, completion, and errors in a polite live region.",
   "Make the drop zone also work as a button that opens the system file dialog."
  ],
  "content": [
   "State limits up front, such as Max 500 MB per file.",
   "Write errors that name the file and the fix."
  ],
  "map": [
   [
    "Carbon",
    "File uploader",
    "Partial"
   ],
   [
    "Polaris",
    "Drop zone",
    "Partial"
   ],
   [
    "Spectrum",
    "Drop zone",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Polaris, and Spectrum agree on a drop zone that also opens the file dialog, per-file progress, and specific error messages.",
  "sources": [
   "https://carbondesignsystem.com/components/file-uploader/usage/",
   "https://polaris-react.shopify.com/components/actions/drop-zone",
   "https://spectrum.adobe.com/page/drop-zone/",
   "https://design-system.service.gov.uk/components/file-upload/"
  ]
 },
 "specialized|Download manager": {
  "text": "Prepares, tracks, and delivers downloads such as large files, archives, and exports.",
  "purpose": "Handles downloads that need preparation time and tells people when files are ready.",
  "use": [
   "A download is packaged on the server, such as a zip of many assets.",
   "Exports and renditions generated on request."
  ],
  "avoid": [
   "A single ready file: start the browser download directly.",
   "Upload progress: use Upload manager instead."
  ],
  "anatomy": [
   "Item list — each download with name, size, and status.",
   "Progress — preparing, ready, or failed.",
   "Actions — download, cancel, and retry.",
   "Expiry — when a prepared download will be removed."
  ],
  "behavior": [
   "Prepare large downloads in the background and notify people when ready.",
   "Keep finished downloads available for a stated period.",
   "Show the reason and a retry action when preparation fails."
  ],
  "accessibility": [
   "Announce ready and failed states in a live region.",
   "Do not rely on a toast alone; keep the item in a list people can return to."
  ],
  "content": [
   "Say what is being prepared and roughly how long it takes.",
   "Use Download, not Get or Fetch."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html",
   "https://carbondesignsystem.com/components/notification/usage/"
  ],
  "map": []
 },
 "specialized|File picker": {
  "text": "Lets people choose one or more files from a local device or a connected source.",
  "purpose": "Gives one consistent way to select files as input to a task, such as attaching or importing.",
  "use": [
   "Forms and dialogs that need a file as input.",
   "Choosing from both the device and connected libraries."
  ],
  "avoid": [
   "Choosing managed assets with metadata: use Asset picker instead.",
   "A general browsing view: use File browser instead."
  ],
  "anatomy": [
   "Trigger — a button or drop zone.",
   "Source tabs — device and connected sources.",
   "Browser — folders and files to choose from.",
   "Selection summary — what is chosen.",
   "Footer actions — confirm the choice or cancel."
  ],
  "behavior": [
   "Filter to accepted types and state them.",
   "After confirmation, return focus to the trigger and show the chosen files.",
   "Let people remove a chosen file before submitting."
  ],
  "accessibility": [
   "For device files, use a labeled button that opens the native dialog.",
   "For an in-product picker, use the dialog pattern with focus trapping."
  ],
  "content": [
   "Label the trigger with the action, such as Choose file.",
   "State accepted types and size limits next to the trigger."
  ],
  "map": [
   [
    "Carbon",
    "File uploader",
    "Partial"
   ],
   [
    "Polaris",
    "Drop zone",
    "Partial"
   ],
   [
    "Spectrum",
    "Drop zone",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Polaris, Spectrum, and GOV.UK agree on a labeled button that opens the system dialog, with accepted types stated and chosen files listed.",
  "sources": [
   "https://carbondesignsystem.com/components/file-uploader/usage/",
   "https://polaris-react.shopify.com/components/actions/drop-zone",
   "https://design-system.service.gov.uk/components/file-upload/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ]
 },
 "specialized|Asset picker": {
  "text": "A dialog for choosing managed assets from the library, with search, filters, and previews.",
  "purpose": "Lets people reuse approved assets in other tasks without leaving their work.",
  "use": [
   "A task needs approved library assets, such as adding images to a page.",
   "Rights or status must be checked at selection time."
  ],
  "avoid": [
   "Files from the device: use File picker.",
   "Managing or editing assets: send people to the library."
  ],
  "anatomy": [
   "Search and filters — find assets by text, type, and status.",
   "Gallery or list — asset previews.",
   "Selection tray — chosen assets with a count.",
   "Detail preview — metadata of the focused asset.",
   "Footer actions — confirm the choice or cancel."
  ],
  "behavior": [
   "Show only assets the person may use, or mark restricted ones and explain why.",
   "Support single or multiple selection as the task requires, and state the limit.",
   "Return the chosen assets to the calling task and restore focus."
  ],
  "accessibility": [
   "Use the dialog pattern with a labeled heading.",
   "Announce selection count changes."
  ],
  "content": [
   "Title the dialog with the task, such as Choose images.",
   "Name the confirm button with the result, such as Add 3 images."
  ],
  "map": [
   [
    "Spectrum",
    "Card view",
    "Partial"
   ]
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://spectrum.adobe.com/page/asset-card/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
  ]
 },
 "specialized|Metadata editor": {
  "text": "Shows and edits the descriptive, technical, and rights fields of one or more assets.",
  "purpose": "Keeps asset information accurate so assets can be found, governed, and reused.",
  "use": [
   "The asset detail panel, and bulk editing many assets.",
   "Fields follow a schema with required values."
  ],
  "avoid": [
   "Read-only technical data alone: use a description list.",
   "Do not expose every schema field at once; group fields and collapse rarely used ones."
  ],
  "anatomy": [
   "Field groups — descriptive, rights, and technical sections.",
   "Fields — text, tags, dates, and choices with labels.",
   "Read-only fields — values from the file, marked as not editable.",
   "Mixed-value state — shown when bulk-editing items with different values.",
   "Footer actions — save or cancel changes."
  ],
  "behavior": [
   "Validate on save and show errors next to fields.",
   "In bulk edit, show mixed values clearly; change only the fields the person touches.",
   "Warn before leaving with unsaved changes."
  ],
  "accessibility": [
   "Label every field and mark required fields in text.",
   "Move focus to the first error after a failed save."
  ],
  "content": [
   "Use field names people know, not schema keys.",
   "Show helper text for fields with rules, such as date formats."
  ],
  "map": [
   [
    "Atlassian",
    "Inline edit",
    "Partial"
   ]
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://atlassian.design/components/inline-edit",
   "https://design-system.service.gov.uk/patterns/check-answers/"
  ]
 },
 "specialized|Version history": {
  "text": "Lists the saved versions of an item with author, date, and notes, and lets people view or restore them.",
  "purpose": "Lets people trace changes and safely return to an earlier version.",
  "use": [
   "Assets and documents that change over time.",
   "People need to restore or compare earlier work."
  ],
  "avoid": [
   "All activity on an item: use Audit history instead.",
   "Do not create a visible version for every autosave; group them into meaningful versions."
  ],
  "anatomy": [
   "Version list — newest first, with number, author, and date.",
   "Current marker — shows which version is live.",
   "Notes — optional description of the change.",
   "Actions — view, compare, restore, and download."
  ],
  "behavior": [
   "Create a new version on restore instead of deleting later versions.",
   "Confirm restore and say what will happen.",
   "Let people select two versions to compare."
  ],
  "accessibility": [
   "Use a list with clear version names for screen readers.",
   "Do not mark the current version by color alone."
  ],
  "content": [
   "Name versions by number and date, such as Version 4, Oct 2.",
   "Use Restore, not Revert, for the action."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://m3.material.io/components/lists/overview"
  ],
  "map": []
 },
 "specialized|Version comparison": {
  "text": "Shows two versions of an item side by side or overlaid, with the differences highlighted.",
  "purpose": "Lets people see exactly what changed before they approve or restore.",
  "use": [
   "Reviewing changes before approval.",
   "Choosing which version to restore."
  ],
  "avoid": [
   "Only metadata changed: show a list of changed fields instead.",
   "Items that are not versions of the same asset: use Related assets instead."
  ],
  "anatomy": [
   "Version selectors — which two versions are compared.",
   "Comparison view — side by side, overlay, or slider.",
   "Change highlights — added, removed, and changed areas.",
   "Change summary — a count or list of changes."
  ],
  "behavior": [
   "Sync scroll and zoom across both sides.",
   "Let people step through changes one by one.",
   "Show the version label above each side at all times."
  ],
  "accessibility": [
   "Mark changes with text or patterns in addition to color.",
   "Provide a text list of changes for screen reader users."
  ],
  "content": [
   "Label sides with version number and date.",
   "Describe changes in plain words, such as Title changed."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "map": [],
  "sources": []
 },
 "specialized|Related assets": {
  "text": "Shows other assets linked to the current one, such as sources, variants, or assets used together.",
  "purpose": "Helps people find connected content and understand dependencies before they change or remove an asset.",
  "use": [
   "Asset detail, to show source, derived, and linked assets.",
   "Warning about where an asset is used."
  ],
  "avoid": [
   "Generic recommendations: use Recommendation instead.",
   "Renditions of the same asset: use Renditions and derivatives."
  ],
  "anatomy": [
   "Relationship groups — such as Source, Variants, and Used in.",
   "Asset items — small previews with title.",
   "Relation actions — add or remove a link to another asset.",
   "Count — number of related items per group."
  ],
  "behavior": [
   "Group items by relationship type.",
   "Open a related asset in the same detail view and keep a way back.",
   "Warn before deleting an asset that others depend on."
  ],
  "accessibility": [
   "Use headings for each relationship group.",
   "Give each item an accessible name that includes the relationship."
  ],
  "content": [
   "Name relationships with plain phrases, such as Used in 4 pages.",
   "Keep group labels short."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "map": [],
  "sources": []
 },
 "specialized|Renditions and derivatives": {
  "text": "Alternate versions of an asset generated for specific uses, such as sizes, formats, and crops.",
  "purpose": "Lets people get the right format of an asset for each channel without editing the original.",
  "use": [
   "Asset detail and download flows.",
   "Channels that need different sizes or formats."
  ],
  "avoid": [
   "Edits that create a new asset: use Related assets instead.",
   "Saved history: use Version history instead."
  ],
  "anatomy": [
   "Original — the master file, marked as source.",
   "Rendition list — name, format, dimensions, and size.",
   "Status — ready, processing, or failed.",
   "Actions — preview, download, copy link, and regenerate."
  ],
  "behavior": [
   "Generate renditions automatically and show processing state.",
   "Regenerate renditions when the original changes, and mark stale ones.",
   "Let people download a specific rendition directly."
  ],
  "accessibility": [
   "Use a table with headers for rendition attributes.",
   "Announce when a rendition finishes processing."
  ],
  "content": [
   "Name renditions by use and size, such as Web large, 1920 × 1080.",
   "Show formats in uppercase, such as JPEG and WebP."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://carbondesignsystem.com/components/data-grid/usage/"
  ],
  "map": []
 },
 "specialized|Comment": {
  "text": "A message a person leaves on an item, showing author, time, and text.",
  "purpose": "Lets people discuss work in context instead of in separate channels.",
  "use": [
   "Discussing an asset, document, or task where the work lives.",
   "Review feedback."
  ],
  "avoid": [
   "System events: use Audit history instead.",
   "Formal decisions: use Approval workflow instead."
  ],
  "anatomy": [
   "Avatar — the author.",
   "Author and time — name and relative time with exact time on hover.",
   "Body — the comment text with mentions and links.",
   "Actions — reply, edit, delete, and react.",
   "State — edited, deleted, or resolved indicators."
  ],
  "behavior": [
   "Let authors edit and delete their own comments; mark edited comments.",
   "Show a pending state while posting and an error with retry if it fails.",
   "Keep the draft when posting fails."
  ],
  "accessibility": [
   "Label the comment field and its submit button.",
   "Give action buttons names that include the author, such as Reply to Ana."
  ],
  "content": [
   "Use relative times for recent comments and dates for older ones.",
   "Label the submit button Comment or Reply."
  ],
  "map": [
   [
    "Atlassian",
    "Comment",
    "Direct"
   ]
  ],
  "commonGround": "Atlassian is the only system with a comment component (avatar, author, time, body, and actions); other systems compose comments from avatars and lists.",
  "sources": [
   "https://atlassian.design/components/comment",
   "https://atlassian.design/components/avatar"
  ]
 },
 "specialized|Comment thread": {
  "text": "A top-level comment with its replies, shown as one conversation.",
  "purpose": "Keeps related discussion together so people can follow and resolve one topic.",
  "use": [
   "Discussions need replies on a specific point.",
   "Topics can be resolved."
  ],
  "avoid": [
   "Do not nest replies more than one or two levels deep.",
   "Real-time chat: use a chat pattern."
  ],
  "anatomy": [
   "Root comment — starts the topic.",
   "Replies — indented under the root.",
   "Collapse control — hides older replies with a count.",
   "Reply field — at the end of the thread.",
   "Resolve action — closes the topic."
  ],
  "behavior": [
   "Collapse long threads and show the latest replies.",
   "Move resolved threads out of the main view and let people reopen them.",
   "Keep threads in chronological order."
  ],
  "accessibility": [
   "Use list semantics and convey nesting level.",
   "Move focus to the reply field when Reply is chosen."
  ],
  "content": [
   "Show counts such as 4 more replies.",
   "Use Resolve and Reopen for thread state."
  ],
  "map": [
   [
    "Atlassian",
    "Comment",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian comments support nesting for threads; other systems do not define threads.",
  "sources": [
   "https://atlassian.design/components/comment"
  ]
 },
 "specialized|Reply": {
  "text": "A comment posted in response to another comment within a thread.",
  "purpose": "Keeps answers attached to the comment they respond to.",
  "use": [
   "Answering or following up on a specific comment.",
   "Keeping a short exchange attached to its original point."
  ],
  "avoid": [
   "Starting a new topic: start a new comment instead.",
   "Do not reply to a reply beyond the allowed nesting depth; add to the thread end instead."
  ],
  "anatomy": [
   "Indent — shows the reply belongs to a parent.",
   "Author, time, and body — same as Comment.",
   "Reply field — opens inline under the thread."
  ],
  "behavior": [
   "Open the reply field inline with focus in it.",
   "Add the reply at the end of the thread and keep the thread expanded.",
   "Notify the parent author unless they turned it off."
  ],
  "accessibility": [
   "Label the reply field with the parent author, such as Reply to Ana.",
   "Return focus to the new reply or to the Reply button after posting."
  ],
  "content": [
   "Use Reply for the action and the submit button.",
   "Keep replies in the same tone and format as comments."
  ],
  "map": [
   [
    "Atlassian",
    "Comment",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian treats replies as nested comments; no other system defines them.",
  "sources": [
   "https://atlassian.design/components/comment"
  ]
 },
 "specialized|Mention": {
  "text": "A reference to a person or team in text, created by typing @ and choosing from suggestions.",
  "purpose": "Notifies the right people and links them to the conversation.",
  "use": [
   "Comments and descriptions, to bring someone into a discussion.",
   "Notifying a team or group, when the system supports group mentions."
  ],
  "avoid": [
   "Assigning work: use an assignee field instead.",
   "Do not suggest people who cannot be notified, such as deactivated users."
  ],
  "anatomy": [
   "Trigger character — @ starts the suggestion list.",
   "Suggestion list — matching people with avatar and name.",
   "Mention token — the inserted name, styled as a link."
  ],
  "behavior": [
   "Filter suggestions as people type and select with Enter.",
   "Warn when the mentioned person cannot see the item.",
   "Remove the whole token with one Backspace."
  ],
  "accessibility": [
   "Use the combobox pattern for suggestions, with the active option announced.",
   "Expose the mention token as a link with the person name."
  ],
  "content": [
   "Show the person display name, not the user ID.",
   "Show a secondary detail such as email or team when names are similar."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
  ],
  "map": []
 },
 "specialized|Annotation": {
  "text": "A comment pinned to a specific point or area of an asset or document.",
  "purpose": "Makes feedback precise by showing exactly where it applies.",
  "use": [
   "Reviewing images, video frames, and documents.",
   "Location matters to the feedback."
  ],
  "avoid": [
   "General feedback on the whole item: use Comment.",
   "Editing the content itself: use an editor."
  ],
  "anatomy": [
   "Marker — a numbered pin or drawn region on the content.",
   "Linked comment — the comment tied to the marker.",
   "Annotation layer toggle — show or hide markers.",
   "Time stamp — the frame or time for video."
  ],
  "behavior": [
   "When either the marker or its comment is focused, highlight both.",
   "Keep markers attached to the content when zooming.",
   "Hide resolved annotations by default."
  ],
  "accessibility": [
   "Give markers a keyboard path through the linked comment list.",
   "Number markers so they are not identified by color alone."
  ],
  "content": [
   "Number markers in reading order.",
   "Write the linked comment like any comment; refer to the marker number when needed."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "map": [],
  "sources": []
 },
 "specialized|Announcement": {
  "text": "A message from the product or an administrator to many users about a change or event.",
  "purpose": "Informs people about changes, maintenance, or news that affects their work.",
  "use": [
   "Product-wide news, planned maintenance, and policy changes.",
   "The message applies to most users and stays relevant for a while."
  ],
  "avoid": [
   "Feedback on a user action: use a toast or inline message.",
   "Do not show more than one announcement at a time."
  ],
  "anatomy": [
   "Container — a banner at the top of the page.",
   "Icon and message — what is happening.",
   "Link or action — where to learn more.",
   "Dismiss control — when the message is not critical."
  ],
  "behavior": [
   "Place it at the top of the page, above the page header.",
   "Remember dismissal per user.",
   "Remove it when the event ends."
  ],
  "accessibility": [
   "Do not move focus to the announcement.",
   "Pair the tone color with an icon and text."
  ],
  "content": [
   "Lead with the impact and the date, such as Maintenance on Oct 12, 2–4 AM UTC.",
   "Keep it to one or two short sentences."
  ],
  "map": [
   [
    "Atlassian",
    "Banner",
    "Direct"
   ],
   [
    "Carbon",
    "Notification (inline)",
    "Partial"
   ],
   [
    "Polaris",
    "Banner",
    "Partial"
   ],
   [
    "Fluent 2",
    "Message bar",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Polaris, Fluent, and Carbon use a page-level banner for system messages, one at a time, with icon, short text, and optional action.",
  "sources": [
   "https://atlassian.design/components/banner",
   "https://polaris-react.shopify.com/components/feedback-indicators/banner",
   "https://carbondesignsystem.com/components/notification/usage/"
  ]
 },
 "specialized|Audit history": {
  "text": "A chronological, read-only record of who did what to an item and when.",
  "purpose": "Supports accountability, compliance, and troubleshooting.",
  "use": [
   "Governed content, permissions, and settings changes.",
   "Admins or auditors need to answer who changed what and when."
  ],
  "avoid": [
   "Discussion: use Comment.",
   "Restoring content: use Version history."
  ],
  "anatomy": [
   "Event rows — actor, action, target, and time.",
   "Details — before and after values.",
   "Filters — by person, action, and date.",
   "Export — download the record."
  ],
  "behavior": [
   "Show newest events first and load older events on demand.",
   "Never allow editing or deleting events from the UI.",
   "Show exact timestamps with time zone."
  ],
  "accessibility": [
   "Use a table or list with clear column headers.",
   "Make filters labeled and keyboard operable."
  ],
  "content": [
   "Write events as actor, verb, object, such as Ana changed Status to Approved.",
   "Use exact values and names, not vague summaries such as Updated item."
  ],
  "map": [
   [
    "Carbon",
    "Data grid",
    "Partial"
   ]
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://carbondesignsystem.com/components/data-grid/usage/"
  ]
 },
 "specialized|Sharing": {
  "text": "Sharing lets people give others access to an item and set what they can do with it.",
  "purpose": "Controls who can see and change content without involving an administrator.",
  "use": [
   "Inviting people or teams, creating links, and changing access.",
   "Reviewing and removing existing access."
  ],
  "avoid": [
   "Organization-wide permission rules: use admin settings instead.",
   "Do not hide public link settings behind several steps."
  ],
  "anatomy": [
   "Invite field — people picker with role choice.",
   "Access list — people with their role.",
   "Link settings — who the link works for and expiry.",
   "Copy link — copies the share link to the clipboard."
  ],
  "behavior": [
   "Show the current access level before any change.",
   "Confirm removing access and changes that make content public.",
   "Show a confirmation after copying a link."
  ],
  "accessibility": [
   "Label role selectors with the person name.",
   "Announce the copied state in a live region."
  ],
  "content": [
   "Name roles by what they allow, such as Can view and Can edit.",
   "State who a link works for in plain words."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
   "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
  ],
  "map": []
 },
 "specialized|Presence": {
  "text": "Shows whether a person is available, away, busy, or offline, or who is viewing an item right now.",
  "purpose": "Helps people know who is around and avoid conflicting edits.",
  "use": [
   "Avatars in collaboration views.",
   "Showing who else is viewing or editing an item."
  ],
  "avoid": [
   "Places where status changes rarely matter.",
   "Do not show presence for people outside the user organization without consent."
  ],
  "anatomy": [
   "Presence indicator — a small badge on the avatar.",
   "Status label — text in tooltip or list.",
   "Viewer stack — avatars of current viewers."
  ],
  "behavior": [
   "Update presence in real time and fade out stale states.",
   "Collapse many viewers into a stack with an overflow count."
  ],
  "accessibility": [
   "Use shape or icon as well as color for each state.",
   "Include the status in the avatar accessible name."
  ],
  "content": [
   "Use standard status words: Available, Busy, Away, Offline.",
   "Show last-seen time instead of Offline only when it is useful and allowed."
  ],
  "map": [
   [
    "Fluent 2",
    "Presence badge",
    "Direct"
   ],
   [
    "Atlassian",
    "Avatar (presence)",
    "Partial"
   ],
   [
    "Spectrum",
    "Avatar",
    "Partial"
   ]
  ],
  "commonGround": "Fluent and Atlassian both show presence as a badge on the avatar, with a distinct shape per state; Fluent defines the most complete set.",
  "sources": [
   "https://fluent2.microsoft.design/components/web/react/core/presencebadge/usage",
   "https://atlassian.design/components/avatar",
   "https://fluent2.microsoft.design/components/web/react/core/avatar/usage"
  ]
 },
 "specialized|Approval workflow": {
  "text": "Moves an item through review steps where named people approve or reject it.",
  "purpose": "Ensures content is checked before it is published or used.",
  "use": [
   "Assets and content that need formal sign-off.",
   "An audit trail of decisions is required."
  ],
  "avoid": [
   "Informal feedback: use Comment.",
   "Do not add steps that never change the outcome."
  ],
  "anatomy": [
   "Status — the current step and state.",
   "Steps — reviewers and order.",
   "Decision actions — approve, reject, and request changes.",
   "Decision note — reason, required for rejection.",
   "History — past decisions."
  ],
  "behavior": [
   "Show what is required and who acts next.",
   "Require a reason when rejecting or requesting changes.",
   "Notify the requester and next reviewer on each decision."
  ],
  "accessibility": [
   "Use a progress tracker with text for each step state.",
   "Make decisions keyboard reachable and confirm them."
  ],
  "content": [
   "Use clear decisions: Approve, Reject, Request changes.",
   "Name the waiting party, such as Waiting for Legal."
  ],
  "map": [
   [
    "Atlassian",
    "Progress tracker",
    "Partial"
   ],
   [
    "Carbon",
    "Progress indicator",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Carbon show step progress with a tracker or indicator; neither defines approval decisions.",
  "sources": [
   "https://atlassian.design/components/progress-tracker",
   "https://carbondesignsystem.com/components/progress-indicator/usage/"
  ]
 },
 "specialized|Product discovery": {
  "text": "The ways people find products: search, browse, filters, and recommendations.",
  "purpose": "Helps people find the right product quickly in a large catalog.",
  "use": [
   "The entry to the catalog, with search and category browse.",
   "Guiding people from a broad need to a short list of products."
  ],
  "avoid": [
   "Do not hide filters behind extra steps on large catalogs.",
   "Do not show filters that return no results; hide them or show counts."
  ],
  "anatomy": [
   "Search — with suggestions.",
   "Categories — browse paths.",
   "Filters and sort — narrow results.",
   "Results — the product listing."
  ],
  "behavior": [
   "Show applied filters as removable chips and a result count.",
   "Keep filters and query in the URL so results can be shared.",
   "Offer suggestions when a search has no results."
  ],
  "accessibility": [
   "Announce result count changes in a live region.",
   "Make filters labeled form controls."
  ],
  "content": [
   "Use customer words for categories, not internal codes.",
   "Write no-results messages that suggest a next step, such as removing a filter."
  ],
  "map": [
   [
    "Material 3",
    "Search",
    "Partial"
   ],
   [
    "Polaris",
    "Filters",
    "Partial"
   ],
   [
    "Carbon",
    "Search",
    "Partial"
   ]
  ],
  "commonGround": "Material, Polaris, and Carbon agree on search plus removable filter chips and clear result counts; none defines storefront discovery.",
  "sources": [
   "https://m3.material.io/components/search/overview",
   "https://polaris-react.shopify.com/components/selection-and-input/filters",
   "https://carbondesignsystem.com/components/search/usage/"
  ]
 },
 "specialized|Product listing": {
  "text": "Shows a set of products as cards or rows with image, name, price, and key options.",
  "purpose": "Lets people compare products and choose one to view.",
  "use": [
   "Category pages and search results.",
   "Collections, promotions, and related products."
  ],
  "avoid": [
   "A single product: use Product detail.",
   "Do not show more than one primary action per card."
  ],
  "anatomy": [
   "Product card — image, name, price, rating, and badges.",
   "Layout — a grid or list of cards.",
   "Sort and filter bar — narrows and orders the products.",
   "Paging — pagination or a load more control."
  ],
  "behavior": [
   "Make the whole card open the product; keep secondary actions separate.",
   "Show sale and stock status consistently.",
   "Keep position when people return from a product."
  ],
  "accessibility": [
   "Give each card one link with the product name.",
   "Do not show price changes by color alone."
  ],
  "content": [
   "Show full price with currency and any discount clearly.",
   "Keep product names to two lines and avoid repeating the category name."
  ],
  "map": [
   [
    "Material 3",
    "Cards",
    "Partial"
   ],
   [
    "Polaris",
    "Resource list",
    "Partial"
   ]
  ],
  "commonGround": "Material and Polaris agree on cards or resource rows with media, title, and key facts, linking to detail.",
  "sources": [
   "https://m3.material.io/components/cards/overview",
   "https://polaris-react.shopify.com/components/lists/resource-list"
  ]
 },
 "specialized|Product detail": {
  "text": "The page for one product, with media, price, options, description, and the add-to-cart action.",
  "purpose": "Gives people what they need to decide and buy.",
  "use": [
   "Each purchasable product.",
   "The target of every product link and search result."
  ],
  "avoid": [
   "Do not hide price or availability below the fold.",
   "A modal on small screens: use a full page."
  ],
  "anatomy": [
   "Media gallery — images and video.",
   "Summary — title, price, and rating.",
   "Product options — size, color, quantity.",
   "Primary action — add to cart.",
   "Details — description, specs, shipping, and returns."
  ],
  "behavior": [
   "Update price, image, and stock when an option changes.",
   "Disable add to cart until required options are chosen, and say why.",
   "Confirm adding to cart without leaving the page."
  ],
  "accessibility": [
   "Give gallery images alt text and keyboard navigation.",
   "Announce price and stock changes."
  ],
  "content": [
   "Lead with the facts people compare: price, delivery, and returns.",
   "Write descriptions that answer common questions before people ask them."
  ],
  "map": [
   [
    "Polaris",
    "Resource details layout",
    "Partial"
   ],
   [
    "Material 3",
    "Carousel",
    "Partial"
   ]
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://m3.material.io/components/carousel/overview",
   "https://polaris.shopify.com/patterns/resource-details-layout"
  ]
 },
 "specialized|Product options": {
  "text": "Controls for choosing a product variant, such as size, color, and quantity.",
  "purpose": "Lets people pick exactly the variant they want and see its price and availability.",
  "use": [
   "Product detail and quick-add surfaces.",
   "Any product with variants that affect price, stock, or fit."
  ],
  "avoid": [
   "Fewer than about six visible choices: use swatches or a segmented choice, not a dropdown.",
   "Do not hide unavailable options entirely when people expect to see them."
  ],
  "anatomy": [
   "Option label — such as Size.",
   "Choices — swatches, chips, or a select.",
   "Unavailable state — shown but marked out of stock.",
   "Quantity stepper — sets how many to buy."
  ],
  "behavior": [
   "Show the chosen value next to the label.",
   "Mark unavailable combinations and explain them.",
   "Update price and media when the choice changes."
  ],
  "accessibility": [
   "Use radio group semantics for single-choice swatches.",
   "Name color swatches in text, not color alone."
  ],
  "content": [
   "Use customer-facing option names and values.",
   "Show units and size guides next to the option, such as Size guide."
  ],
  "map": [
   [
    "Material 3",
    "Chips (filter)",
    "Partial"
   ],
   [
    "Carbon",
    "Radio button",
    "Partial"
   ],
   [
    "Polaris",
    "Choice list",
    "Partial"
   ]
  ],
  "commonGround": "Material, Carbon, and Polaris agree on radio-style single selection for mutually exclusive choices with visible labels.",
  "sources": [
   "https://m3.material.io/components/chips/overview",
   "https://www.w3.org/WAI/ARIA/apg/patterns/radio/",
   "https://polaris-react.shopify.com/components/selection-and-input/choice-list"
  ]
 },
 "specialized|Cart": {
  "text": "Holds the products a person intends to buy, with quantities, prices, and a total.",
  "purpose": "Lets people review and adjust their order before checkout.",
  "use": [
   "A page or side panel before checkout.",
   "Side panel for quick review; full page for detailed editing."
  ],
  "avoid": [
   "A wishlist: use saved items instead.",
   "Do not hide fees until the final checkout step."
  ],
  "anatomy": [
   "Line items — image, name, options, quantity, and price.",
   "Summary — subtotal, discounts, estimated tax and shipping.",
   "Promo code field — applies a discount code.",
   "Checkout action — the primary button to proceed."
  ],
  "behavior": [
   "Update totals immediately when quantity changes.",
   "Let people undo removing an item.",
   "Warn about stock or price changes since the item was added."
  ],
  "accessibility": [
   "Label quantity controls with the product name.",
   "Announce total changes in a live region."
  ],
  "content": [
   "Say Estimated when tax or shipping is not final.",
   "Show an empty-cart state with a path back to shopping."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
  ],
  "map": []
 },
 "specialized|Checkout": {
  "text": "The flow where people enter delivery, contact, and payment details and place an order.",
  "purpose": "Turns a cart into an order with as little effort and risk as possible.",
  "use": [
   "A short, focused flow after the cart.",
   "One page or a few clearly numbered steps."
  ],
  "avoid": [
   "Requiring account creation to buy: offer guest checkout.",
   "Do not add navigation that leads away from the flow."
  ],
  "anatomy": [
   "Steps — contact, delivery, payment, review.",
   "Order summary — always visible.",
   "Forms — grouped fields.",
   "Review step — check answers before placing the order.",
   "Place order — the final, committing action."
  ],
  "behavior": [
   "Validate fields inline when people leave them, and again on submit.",
   "Keep entered data when people go back.",
   "Show a review step before placing the order."
  ],
  "accessibility": [
   "Use autocomplete attributes for address and contact fields.",
   "Show an error summary that links to each field."
  ],
  "content": [
   "Label the final button with the commitment, such as Place order.",
   "Use short group headings, such as Delivery and Payment."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://design-system.service.gov.uk/patterns/check-answers/",
   "https://design-system.service.gov.uk/patterns/payment-card-details/"
  ],
  "map": []
 },
 "specialized|Payment": {
  "text": "The step where people choose a payment method and enter or confirm its details.",
  "purpose": "Collects payment securely and clearly.",
  "use": [
   "Checkout and billing settings.",
   "Use saved methods by default for returning customers."
  ],
  "avoid": [
   "Do not build card fields yourself when a payment provider supplies secure fields.",
   "Do not ask for details the provider does not need."
  ],
  "anatomy": [
   "Method choice — card, wallet, or saved method.",
   "Card fields — number, expiry, security code, and name.",
   "Billing address — same as delivery by default.",
   "Security note — states how payment data is protected."
  ],
  "behavior": [
   "Detect card type from the number; format it as people type.",
   "Show clear errors for declined payments without clearing the form.",
   "Prevent double submission while processing."
  ],
  "accessibility": [
   "Use cc autocomplete attributes and numeric keyboards.",
   "Do not split card numbers into multiple fields."
  ],
  "content": [
   "Explain declines in plain words and what to try next.",
   "Show accepted card brands and the amount being charged."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://design-system.service.gov.uk/patterns/payment-card-details/"
  ],
  "map": []
 },
 "specialized|Order confirmation": {
  "text": "The page shown after an order is placed, with the order number and what happens next.",
  "purpose": "Reassures people the order succeeded and tells them what to expect.",
  "use": [
   "Immediately after a successful order.",
   "The page people return to from the confirmation email."
  ],
  "avoid": [
   "Do not show it before payment is confirmed.",
   "Do not upsell before the confirmation details."
  ],
  "anatomy": [
   "Confirmation panel — success message and order number.",
   "Summary — items, total, and delivery.",
   "Next steps — email, delivery date, and tracking.",
   "Links — view order and continue shopping."
  ],
  "behavior": [
   "Send a matching confirmation email.",
   "Prevent resubmission on refresh or back."
  ],
  "accessibility": [
   "Put the success message in the page heading.",
   "Move focus to the page heading when the page loads."
  ],
  "content": [
   "Say what happens next and when.",
   "Show the order number in a form people can copy."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://design-system.service.gov.uk/patterns/confirmation-pages/"
  ],
  "map": []
 },
 "specialized|Order management": {
  "text": "Lets staff or customers find, view, and act on orders: fulfill, cancel, or track.",
  "purpose": "Keeps orders moving and lets people resolve issues.",
  "use": [
   "Order lists and order detail pages.",
   "Customers tracking and changing their own orders."
  ],
  "avoid": [
   "Do not mix orders and returns in one list without a type filter.",
   "Do not allow actions that the order status no longer permits."
  ],
  "anatomy": [
   "Order list — number, date, customer, total, and status.",
   "Filters — by status and date.",
   "Order detail — items, payment, delivery, and timeline.",
   "Actions — fulfill, refund, cancel."
  ],
  "behavior": [
   "Show status as badges with text.",
   "Confirm destructive actions such as cancel and refund.",
   "Record every action in the order timeline."
  ],
  "accessibility": [
   "Use table semantics with sortable headers.",
   "Do not rely on status color alone."
  ],
  "content": [
   "Use consistent status names across list and detail.",
   "Write timeline events with who did what and when."
  ],
  "map": [
   [
    "Polaris",
    "Index table",
    "Partial"
   ],
   [
    "Carbon",
    "Data grid",
    "Partial"
   ]
  ],
  "commonGround": "Polaris and Carbon agree on a filterable, sortable table with status badges and bulk actions for records like orders.",
  "sources": [
   "https://polaris-react.shopify.com/components/tables/index-table",
   "https://carbondesignsystem.com/components/data-grid/usage/"
  ]
 },
 "specialized|Subscription management": {
  "text": "Subscription management lets people view, change, pause, and cancel a recurring plan.",
  "purpose": "Gives people control over recurring charges.",
  "use": [
   "Account and billing settings.",
   "Showing upcoming renewals and charges."
  ],
  "avoid": [
   "Do not make canceling harder than signing up.",
   "Do not hide the cancel action behind support contact."
  ],
  "anatomy": [
   "Plan summary — plan, price, and next billing date.",
   "Change plan — options with price differences.",
   "Payment method — the card or account that is charged.",
   "Plan actions — pause or cancel the subscription.",
   "Billing history — past charges and invoices."
  ],
  "behavior": [
   "Show the effect and date of any change before confirming.",
   "Confirm cancellation and state when access ends."
  ],
  "accessibility": [
   "Make plan comparisons available as text, not only in a visual table.",
   "Confirm changes in text that screen readers announce."
  ],
  "content": [
   "State prices with billing period, such as $12 per month.",
   "Say exactly when a change takes effect."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "map": [],
  "sources": []
 },
 "specialized|Returns": {
  "text": "The flow for sending items back and getting a refund or exchange.",
  "purpose": "Makes returns predictable and reduces support contact.",
  "use": [
   "Order detail, for eligible items.",
   "Self-service returns and exchanges."
  ],
  "avoid": [
   "Do not show items that cannot be returned without saying why.",
   "Do not ask for a reason more detailed than needed."
  ],
  "anatomy": [
   "Item selection — eligible items with quantity.",
   "Reason — a choice with optional note.",
   "Resolution — refund or exchange.",
   "Return method — drop-off or pickup, with the shipping label.",
   "Status — where the return and refund stand."
  ],
  "behavior": [
   "Show the refund amount and timing before confirming.",
   "Track return status after submission."
  ],
  "accessibility": [
   "Use labeled radio groups for reasons and resolutions.",
   "Show return status as text in a timeline."
  ],
  "content": [
   "State the return window and conditions plainly.",
   "Say how and when the refund will be paid."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://design-system.service.gov.uk/patterns/check-answers/"
  ],
  "map": []
 },
 "specialized|AI trigger": {
  "text": "The control that starts an AI feature, marked with the AI icon.",
  "purpose": "Makes AI features easy to find and clearly marked before people use them.",
  "use": [
   "Opening an assistant or starting an AI action where the work happens.",
   "Toolbars, menus, and empty states where AI can do the next step."
  ],
  "avoid": [
   "Do not use the AI icon or styling for features that are not AI.",
   "Do not put AI triggers on every control; show them where they help."
  ],
  "anatomy": [
   "AI icon — the consistent AI symbol.",
   "Label — the action, when space allows.",
   "Container — button, icon button, or menu item."
  ],
  "behavior": [
   "Open the AI surface in context without losing the current work.",
   "Show a disabled state with a reason when AI is unavailable."
  ],
  "accessibility": [
   "Give icon-only triggers an accessible name that says what happens.",
   "Keep AI accent colors at sufficient contrast."
  ],
  "content": [
   "Name the outcome, such as Summarize, not just Ask AI.",
   "Keep the label short and use sentence case."
  ],
  "map": [
   [
    "Carbon",
    "AI label",
    "Partial"
   ],
   [
    "Atlassian",
    "Rovo button",
    "Partial"
   ],
   [
    "Polaris",
    "Magic (tone)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Atlassian, and Polaris reserve a distinct AI icon and color for AI entry points and warn against using them decoratively.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|AI action": {
  "text": "A single AI operation applied to the current content, such as summarize, translate, or tag.",
  "purpose": "Brings AI help into a task without a conversation.",
  "use": [
   "Well-defined operations on selected content, such as summarize or generate alt text.",
   "Bulk, repetitive work such as tagging many assets."
  ],
  "avoid": [
   "Open-ended requests: use AI chat.",
   "Do not run it automatically on content people have not chosen."
  ],
  "anatomy": [
   "Trigger — button or menu item with the AI icon.",
   "Progress — processing state.",
   "Result — preview of generated content.",
   "Decision — apply, edit, or discard."
  ],
  "behavior": [
   "Preview results before changing content.",
   "Let people undo an applied result.",
   "Show errors with a retry."
  ],
  "accessibility": [
   "Announce when the result is ready.",
   "Move focus to the result preview."
  ],
  "content": [
   "Use verb labels that say exactly what the AI does.",
   "Show what will change before people apply it."
  ],
  "map": [
   [
    "Carbon",
    "AI label",
    "Partial"
   ],
   [
    "Atlassian",
    "Rovo actions",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Atlassian, and Microsoft agree that AI changes are previewed, labeled as AI, and reversible.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|AI assistant": {
  "text": "A persistent AI helper in a panel that answers questions and acts across the product.",
  "purpose": "Gives people one place for AI help, with context from their current work.",
  "use": [
   "Help that spans many tasks and pages.",
   "People need to ask follow-up questions about their content."
  ],
  "avoid": [
   "A single fixed operation: use AI action.",
   "Do not open it automatically when people did not ask."
  ],
  "anatomy": [
   "Panel — side panel that keeps the work visible.",
   "Header — assistant name, AI label, and close.",
   "Conversation — AI chat.",
   "Prompt input — where people write requests, with suggestions.",
   "Context indicator — what the assistant can see."
  ],
  "behavior": [
   "Open alongside the work, not over it.",
   "Show what context is shared and let people change it.",
   "Ask for confirmation before acting on the user's behalf."
  ],
  "accessibility": [
   "Make the panel a labeled region with a keyboard shortcut to open and close.",
   "Return focus to the trigger on close."
  ],
  "content": [
   "Introduce what the assistant can and cannot do in the empty state.",
   "Use one consistent assistant name across the product."
  ],
  "map": [
   [
    "Carbon",
    "AI chat",
    "Direct"
   ],
   [
    "Atlassian",
    "Rovo chat",
    "Direct"
   ]
  ],
  "commonGround": "Carbon AI chat, Atlassian Rovo, and Microsoft Copilot all use a side panel assistant with context awareness and confirmation before actions.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|AI chat": {
  "text": "A conversation of prompts and AI responses in a scrolling transcript.",
  "purpose": "Supports open-ended questions and multi-step work with AI.",
  "use": [
   "Exploratory, multi-turn requests.",
   "Inside AI assistant and focused chat views."
  ],
  "avoid": [
   "Tasks a form or button does faster.",
   "Do not mix human and AI messages without clear labels."
  ],
  "anatomy": [
   "Transcript — user and AI messages.",
   "AI message — response, sources, and feedback actions.",
   "Prompt input — where people write the next request.",
   "Suggestions — starter prompts."
  ],
  "behavior": [
   "Stream responses and let people stop them.",
   "Keep the latest message in view while streaming unless people scroll up.",
   "Offer copy, regenerate, and feedback on each response."
  ],
  "accessibility": [
   "Announce new responses politely, not each token.",
   "Use the feed or log role for the transcript."
  ],
  "content": [
   "Mark AI messages with the AI label and the assistant name.",
   "Keep AI responses short and lead with the answer."
  ],
  "map": [
   [
    "Carbon",
    "AI chat",
    "Direct"
   ],
   [
    "Atlassian",
    "Rovo chat",
    "Direct"
   ]
  ],
  "commonGround": "Carbon and Atlassian define AI chat with streamed responses, inline sources, and feedback actions.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/feed/"
  ]
 },
 "specialized|Prompt input": {
  "text": "The text field where people write requests to AI, with send and optional attachments.",
  "purpose": "Captures natural-language requests and context for the AI.",
  "use": [
   "AI chat and assistants.",
   "Inline, when people describe what to generate, such as image or text prompts."
  ],
  "avoid": [
   "Places where structured inputs are clearer, such as dates or choices.",
   "General search: use Search or AI search."
  ],
  "anatomy": [
   "Text area — grows with the text.",
   "Send button — submits the prompt.",
   "Context controls — attach files or choose what the AI can see.",
   "Stop button — replaces Send while the AI is generating.",
   "Hint — what you can ask and the AI disclaimer."
  ],
  "behavior": [
   "Send with Enter and add a line with Shift+Enter.",
   "Replace Send with Stop while generating.",
   "Keep the draft if sending fails."
  ],
  "accessibility": [
   "Label the field and the send button.",
   "Keep focus in the field after sending."
  ],
  "content": [
   "Use placeholder text that gives an example request.",
   "Show limits such as maximum length or attachment types near the field."
  ],
  "map": [
   [
    "Carbon",
    "AI chat input",
    "Partial"
   ],
   [
    "Atlassian",
    "Rovo chat input",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Atlassian, and Microsoft agree on a growing text area with send, stop, and attachments, plus a short disclaimer.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|Prompt suggestions": {
  "text": "Example or next-step prompts offered as chips people can select.",
  "purpose": "Shows what the AI can do and speeds up common requests.",
  "use": [
   "Empty states, to show what the AI can do.",
   "After a response, to offer likely follow-ups."
  ],
  "avoid": [
   "Do not show more than three or four at once.",
   "Do not suggest prompts the AI cannot complete well."
  ],
  "anatomy": [
   "Suggestion chips — short prompt text.",
   "Icon — optional, shows the type of task.",
   "Refresh — shows other suggestions."
  ],
  "behavior": [
   "Send or insert the prompt on selection, consistently.",
   "Base suggestions on current context."
  ],
  "accessibility": [
   "Make chips buttons with the full prompt as the accessible name.",
   "Keep chips in a logical tab order after the response."
  ],
  "content": [
   "Write suggestions as the user would ask them.",
   "Keep each suggestion to one short line."
  ],
  "map": [
   [
    "Material 3",
    "Suggestion chip",
    "Direct"
   ],
   [
    "Carbon",
    "AI chat starters",
    "Partial"
   ],
   [
    "Atlassian",
    "Rovo suggestions",
    "Partial"
   ]
  ],
  "commonGround": "Material suggestion chips, Carbon AI chat, and Atlassian Rovo show a few context-aware starter prompts as chips.",
  "sources": [
   "https://m3.material.io/components/chips/overview",
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|Prompt history": {
  "text": "Lists past prompts and conversations so people can reuse or continue them.",
  "purpose": "Saves people from retyping and lets them return to earlier work.",
  "use": [
   "Assistants and chat that keep sessions.",
   "Rerunning or editing frequent prompts."
  ],
  "avoid": [
   "Do not keep history without telling people and letting them delete it.",
   "Do not show other people prompts in personal history."
  ],
  "anatomy": [
   "Conversation list — title and date.",
   "Search — finds past prompts.",
   "Actions — open, rename, and delete."
  ],
  "behavior": [
   "Reopen a conversation with its full context.",
   "Confirm before deleting history."
  ],
  "accessibility": [
   "Use a list with keyboard navigation and clear item names.",
   "Confirm deletion in text that screen readers announce."
  ],
  "content": [
   "Title conversations from their first prompt and let people rename them.",
   "State how long history is kept."
  ],
  "map": [
   [
    "Carbon",
    "AI chat history",
    "Partial"
   ]
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|Streaming response": {
  "text": "Shows AI output piece by piece as it is generated.",
  "purpose": "Reduces waiting time and shows progress for long responses.",
  "use": [
   "Long text responses where waiting for the whole answer would be slow.",
   "AI chat and assistant panels."
  ],
  "avoid": [
   "Content that must be applied as a whole, such as an edit: show a preview when complete.",
   "Do not stream structured data such as tables cell by cell."
  ],
  "anatomy": [
   "Response text — grows as it is generated.",
   "Progress indicator — shows generation is ongoing.",
   "Stop control — ends generation."
  ],
  "behavior": [
   "Let people stop generation and keep the partial result.",
   "Do not jump scroll when people scroll away."
  ],
  "accessibility": [
   "Announce the completed response, not each token.",
   "Set aria-busy while streaming."
  ],
  "content": [
   "Mark stopped responses as stopped.",
   "Show the final response without leftover progress marks."
  ],
  "map": [
   [
    "Carbon",
    "AI chat",
    "Partial"
   ],
   [
    "Atlassian",
    "Rovo chat",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Atlassian stream AI responses with a stop control.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|Thinking / processing state": {
  "text": "Shows that the AI is working before a response appears.",
  "purpose": "Sets expectations while the AI works so people do not assume it failed.",
  "use": [
   "Between sending a request and the first output.",
   "Long AI tasks that run in steps."
  ],
  "avoid": [
   "Do not use playful animation or wording that suggests human thought.",
   "Do not show it for instant results."
  ],
  "anatomy": [
   "Indicator — a subtle animated AI mark or loader.",
   "Status text — what the AI is doing.",
   "Stop control — cancels the request."
  ],
  "behavior": [
   "Show steps for long processes, such as Searching files.",
   "Time out with a clear error and retry."
  ],
  "accessibility": [
   "Announce status changes politely.",
   "Respect reduced motion."
  ],
  "content": [
   "Describe the current step, such as Searching 24 files.",
   "Avoid words such as thinking or feeling."
  ],
  "map": [
   [
    "Carbon",
    "Inline loading",
    "Partial"
   ],
   [
    "Atlassian",
    "Rovo loading",
    "Partial"
   ],
   [
    "Material 3",
    "Progress indicators",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Atlassian, and Material agree on indeterminate progress with short status text for waits.",
  "sources": [
   "https://carbondesignsystem.com/patterns/loading-pattern/",
   "https://m3.material.io/components/progress-indicators/overview",
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|AI citation": {
  "text": "An inline marker in AI output that links a claim to its source.",
  "purpose": "Lets people verify AI claims.",
  "use": [
   "Whenever AI output is based on retrieved sources.",
   "Claims people may need to verify."
  ],
  "avoid": [
   "Do not cite sources the AI did not use.",
   "Do not add citations to general wording that needs no source."
  ],
  "anatomy": [
   "Marker — a number in the text.",
   "Preview — source title and snippet on hover or focus.",
   "Link — opens the source."
  ],
  "behavior": [
   "Number citations in order of first use.",
   "Match each marker to an item in the source list."
  ],
  "accessibility": [
   "Make markers focusable links with the source title as the accessible name.",
   "Show the preview on focus as well as hover."
  ],
  "content": [
   "Use the source title, not the raw URL.",
   "Place the marker right after the claim it supports."
  ],
  "map": [
   [
    "Carbon",
    "AI chat sources",
    "Partial"
   ],
   [
    "Atlassian",
    "Rovo sources",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Atlassian, and Microsoft Copilot use numbered inline citations linked to sources.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|Source reference": {
  "text": "An item in the list of sources an AI response used.",
  "purpose": "Shows where information came from and lets people open it.",
  "use": [
   "Under AI responses that use documents or web content.",
   "AI search answers."
  ],
  "avoid": [
   "Do not list sources people cannot access without saying so.",
   "Do not list more sources than people can scan; show the top ones and a count."
  ],
  "anatomy": [
   "Source icon and title — what the source is.",
   "Location — app, path, or domain.",
   "Citation number — matches the inline marker."
  ],
  "behavior": [
   "Open sources in context or a new tab.",
   "Mark sources the user lacks access to."
  ],
  "accessibility": [
   "Use a list of links with the source title as the name.",
   "Say when a link opens in a new tab."
  ],
  "content": [
   "Use titles people recognize.",
   "Show where the source lives, such as the folder or site."
  ],
  "map": [
   [
    "Carbon",
    "AI chat sources",
    "Partial"
   ],
   [
    "Atlassian",
    "Rovo sources",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Atlassian list sources below AI responses linked to citations.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|Generated content": {
  "text": "Any text, image, or data produced by AI and shown in the product.",
  "purpose": "Marks AI output so people know to review it.",
  "use": [
   "Any AI-produced text, image, or data in the product.",
   "AI-filled fields such as tags and descriptions."
  ],
  "avoid": [
   "Do not present AI content as human-authored.",
   "Do not keep the AI style after a person has edited and accepted the content."
  ],
  "anatomy": [
   "AI label — marks the content as generated.",
   "Content — the generated text, image, or value.",
   "Actions — edit, regenerate, revert, and feedback."
  ],
  "behavior": [
   "Keep the AI label until a person edits or accepts the content.",
   "Offer a way to restore the AI version after edits."
  ],
  "accessibility": [
   "Include AI generated in the accessible name or description.",
   "Do not rely on the AI color or glow alone to mark it."
  ],
  "content": [
   "Keep generated text in the product voice.",
   "Avoid first person for the AI unless it is a named assistant."
  ],
  "map": [
   [
    "Carbon",
    "AI label",
    "Direct"
   ],
   [
    "Atlassian",
    "Rovo",
    "Partial"
   ],
   [
    "Polaris",
    "Magic",
    "Partial"
   ]
  ],
  "commonGround": "Carbon, Atlassian, Polaris, and Microsoft all label AI-generated content and keep it editable.",
  "sources": [
   "https://carbondesignsystem.com/components/ai-label/usage/",
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|Suggested edit": {
  "text": "An AI-proposed change shown as a diff on existing content.",
  "purpose": "Lets people review AI changes before applying them.",
  "use": [
   "AI rewrites, corrections, and metadata suggestions.",
   "Changes to content people already own."
  ],
  "avoid": [
   "Do not apply edits automatically.",
   "Do not mix many unrelated changes in one suggestion."
  ],
  "anatomy": [
   "Original — the current content.",
   "Proposal — the suggested content.",
   "Change highlights — insertions and deletions.",
   "Decision controls — accept and reject."
  ],
  "behavior": [
   "Show changes inline or side by side.",
   "Allow accepting or rejecting each change."
  ],
  "accessibility": [
   "Mark insertions and deletions in text, not only color.",
   "Let keyboard users move from change to change."
  ],
  "content": [
   "Explain the reason for the change when it is not obvious.",
   "Keep suggestions as small as possible."
  ],
  "map": [
   [
    "Carbon",
    "AI label with revert",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Microsoft agree AI changes must be reviewable and reversible.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|Suggested action": {
  "text": "An AI-recommended next step people can take with one selection.",
  "purpose": "Speeds up work by proposing likely next steps.",
  "use": [
   "After AI responses or in context, to offer a likely next step.",
   "Turning an answer into work, such as Create task."
  ],
  "avoid": [
   "Do not run the action without confirmation.",
   "Do not show several suggested actions that compete for attention."
  ],
  "anatomy": [
   "Action button — with the AI icon.",
   "Explanation — why it is suggested.",
   "Dismiss — removes the suggestion."
  ],
  "behavior": [
   "Confirm before acting on data.",
   "Let people dismiss suggestions."
  ],
  "accessibility": [
   "Make actions buttons with clear names.",
   "Announce the result after the action runs."
  ],
  "content": [
   "Use verb phrases.",
   "Say what the action will change."
  ],
  "map": [
   [
    "Atlassian",
    "Rovo actions",
    "Partial"
   ],
   [
    "Carbon",
    "AI label",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Microsoft offer AI-suggested actions that require confirmation.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|Accept / reject suggestion": {
  "text": "The controls for deciding on an AI suggestion.",
  "purpose": "Keeps people in control of AI changes.",
  "use": [
   "Every AI suggestion that changes content or data.",
   "Per change and for all changes at once."
  ],
  "avoid": [
   "Do not hide reject behind a menu.",
   "Do not make accept the only highlighted path when the result is high-risk."
  ],
  "anatomy": [
   "Accept — applies the suggestion.",
   "Reject — discards it.",
   "Edit — optional; opens the suggestion for changes first."
  ],
  "behavior": [
   "Apply accepted changes immediately with undo.",
   "Remove rejected suggestions and optionally collect feedback."
  ],
  "accessibility": [
   "Give buttons names that include what is being accepted.",
   "Move focus to the next suggestion after a decision."
  ],
  "content": [
   "Use Accept and Reject, or Keep and Discard, consistently.",
   "Confirm the result, such as Change applied."
  ],
  "map": [
   [
    "Carbon",
    "AI revert",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Microsoft agree people must be able to accept, reject, or revert AI changes.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|Regenerate": {
  "text": "Asks the AI to produce a new response to the same request.",
  "purpose": "Lets people get an alternative when a response is not useful.",
  "use": [
   "AI responses and generated content.",
   "The same request can reasonably produce different results."
  ],
  "avoid": [
   "Do not discard the previous response without a way back.",
   "Changing the request: use Refine instead."
  ],
  "anatomy": [
   "Regenerate button — requests a new result.",
   "Version navigation — moves between previous and next results."
  ],
  "behavior": [
   "Keep earlier responses reachable.",
   "Show processing state while regenerating."
  ],
  "accessibility": [
   "Announce the new response and its position, such as 2 of 3.",
   "Give the icon button an accessible name."
  ],
  "content": [
   "Use Regenerate or Try again consistently.",
   "Show the result count when several exist."
  ],
  "map": [
   [
    "Carbon",
    "AI chat",
    "Partial"
   ],
   [
    "Atlassian",
    "Rovo chat",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Atlassian offer regenerate on AI responses.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|Refine": {
  "text": "Refine lets people adjust an AI result with follow-up instructions or presets such as shorter or more formal.",
  "purpose": "Helps people steer AI output without starting over.",
  "use": [
   "After a result is generated.",
   "Use presets for common changes such as shorter, longer, or more formal."
  ],
  "avoid": [
   "Do not offer refine options that do not change the result.",
   "Do not reset the conversation when people refine."
  ],
  "anatomy": [
   "Presets — one-tap refinements.",
   "Instruction field — free-text change request.",
   "Result preview — the refined output."
  ],
  "behavior": [
   "Keep the original result available.",
   "Apply refinements to the latest result."
  ],
  "accessibility": [
   "Make presets buttons with clear names.",
   "Announce when the refined result is ready."
  ],
  "content": [
   "Use short adjectives such as Shorter.",
   "Keep the original result reachable with a clear label."
  ],
  "map": [
   [
    "Atlassian",
    "Rovo",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Microsoft offer follow-up refinement of AI output.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|AI search": {
  "text": "Answers a search query with a generated summary plus ranked results.",
  "purpose": "Gives direct answers while keeping the source results visible.",
  "use": [
   "People ask questions of a large body of content.",
   "Alongside standard search results, not instead of them."
  ],
  "avoid": [
   "Do not replace results with an answer alone.",
   "Weak sources: show results only, no answer."
  ],
  "anatomy": [
   "Search field — accepts questions and keywords.",
   "AI answer — labeled, with citations.",
   "Results list — standard ranked results."
  ],
  "behavior": [
   "Show results even when the answer is pending or fails.",
   "Let people hide the AI answer."
  ],
  "accessibility": [
   "Announce when the answer is ready.",
   "Put the answer in a labeled region people can skip."
  ],
  "content": [
   "Label the answer as AI-generated.",
   "Lead with the direct answer in one or two sentences."
  ],
  "map": [
   [
    "Carbon",
    "Search",
    "Partial"
   ],
   [
    "Atlassian",
    "Rovo search",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Microsoft pair AI answers with cited, standard results.",
  "sources": [
   "https://carbondesignsystem.com/components/search/usage/",
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|Semantic search": {
  "text": "Finds results by meaning, not exact words.",
  "purpose": "Helps people find content when they do not know the exact terms.",
  "use": [
   "Natural-language queries and visual similarity, such as find similar images.",
   "Content that uses varied wording for the same idea."
  ],
  "avoid": [
   "Do not remove exact-match search; offer both.",
   "Do not hide why a result matched."
  ],
  "anatomy": [
   "Search field — accepts natural language.",
   "Mode indicator — shows meaning-based or exact search.",
   "Results — with a match reason."
  ],
  "behavior": [
   "Explain why results match.",
   "Let people switch to exact match."
  ],
  "accessibility": [
   "Label the mode toggle and announce result counts.",
   "Provide text alternatives for image-based queries."
  ],
  "content": [
   "Avoid jargon such as vector or embedding.",
   "Explain matches in plain words, such as Similar colors."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://pair.withgoogle.com/guidebook/",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/"
  ],
  "map": []
 },
 "specialized|Recommendation": {
  "text": "Content or an action suggested to a person based on their context or behavior.",
  "purpose": "Surfaces relevant items people may not find on their own.",
  "use": [
   "Related assets, next steps, and products.",
   "Places where people often look for similar items."
  ],
  "avoid": [
   "Do not present recommendations as required.",
   "Do not recommend items people cannot access."
  ],
  "anatomy": [
   "Items — recommended content.",
   "Reason — why it is recommended.",
   "Feedback — not interested or hide."
  ],
  "behavior": [
   "Explain the basis of recommendations.",
   "Learn from dismissals."
  ],
  "accessibility": [
   "Use a labeled region with a heading.",
   "Make the feedback control keyboard reachable."
  ],
  "content": [
   "Use phrases such as Because you viewed.",
   "Keep the section heading specific."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://pair.withgoogle.com/guidebook/",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/"
  ],
  "map": []
 },
 "specialized|Confidence / uncertainty": {
  "text": "Shows how sure the AI is about a result.",
  "purpose": "Helps people decide how much to trust and check a result.",
  "use": [
   "Classifications, tags, and extracted values.",
   "A wrong result would cost people time or trust."
  ],
  "avoid": [
   "Do not show precise percentages people cannot act on.",
   "Do not show confidence on every result when it is always high."
  ],
  "anatomy": [
   "Level — high, medium, or low.",
   "Indicator — icon plus text.",
   "Explanation — what the level means."
  ],
  "behavior": [
   "Flag low-confidence results for review.",
   "Let people filter or sort by confidence in bulk views."
  ],
  "accessibility": [
   "Show the level in text, not only color.",
   "Include the level in the accessible name of the result."
  ],
  "content": [
   "Use plain levels such as Low confidence.",
   "Say what people should do, such as Check this value."
  ],
  "commonGround": "Google PAIR and Microsoft HAX both recommend communicating uncertainty in plain categories; component systems do not define it.",
  "sources": [
   "https://pair.withgoogle.com/guidebook/",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/"
  ],
  "map": []
 },
 "specialized|Human review": {
  "text": "Routes AI results to a person to check before they take effect.",
  "purpose": "Keeps people accountable for AI decisions.",
  "use": [
   "High-impact or low-confidence AI results.",
   "Policy requires a person to sign off."
  ],
  "avoid": [
   "Do not make review a formality with no real choice.",
   "Do not route every result to review when only some need it."
  ],
  "anatomy": [
   "Review queue — items waiting for a decision.",
   "Item view — the AI result with its sources and confidence.",
   "Decision actions — approve, edit, or reject."
  ],
  "behavior": [
   "Record the reviewer and decision with the item.",
   "Hold the result back until a person approves it."
  ],
  "accessibility": [
   "Make decisions keyboard reachable.",
   "Announce queue counts as they change."
  ],
  "content": [
   "Say what needs checking and why.",
   "Use the same decision words as Approval workflow."
  ],
  "commonGround": "Microsoft HAX, Google PAIR, and Atlassian agree people stay in control of consequential AI output; no component system defines a review queue.",
  "sources": [
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/",
   "https://atlassian.design/rovo-ui"
  ],
  "map": []
 },
 "specialized|AI label": {
  "text": "A small marker that identifies content or features as AI-generated or AI-powered.",
  "purpose": "Tells people when AI is involved.",
  "use": [
   "All AI-generated content and AI-powered features.",
   "Every scale, from a single field to a whole panel."
  ],
  "avoid": [
   "Decoration.",
   "Do not remove it before a person edits or accepts the content."
  ],
  "anatomy": [
   "AI icon — the consistent AI mark.",
   "Text — optional, such as AI.",
   "Explainability popover — opens from the label."
  ],
  "behavior": [
   "Open an explanation on activation.",
   "Switch to the standard style after a human edit and offer revert to AI."
  ],
  "accessibility": [
   "Give it an accessible name such as AI generated.",
   "Keep the label legible in light and dark themes."
  ],
  "content": [
   "Use AI or AI generated.",
   "Do not use brand or model names in the label."
  ],
  "map": [
   [
    "Carbon",
    "AI label",
    "Direct"
   ],
   [
    "Polaris",
    "Badge (magic)",
    "Partial"
   ],
   [
    "Atlassian",
    "Rovo",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Polaris have AI markers; Atlassian says people must always know when AI is involved.",
  "sources": [
   "https://carbondesignsystem.com/components/ai-label/usage/",
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|AI explainability": {
  "text": "Tells people how an AI result was produced and what it is based on.",
  "purpose": "Builds appropriate trust.",
  "use": [
   "From the AI label and on recommendations.",
   "Where people must decide whether to trust a result."
  ],
  "avoid": [
   "Do not show technical model details by default.",
   "Do not show explanations that are always the same."
  ],
  "anatomy": [
   "Summary — one or two sentences on how the result was made.",
   "Inputs — data and sources used.",
   "Limitations — what the AI may get wrong.",
   "Learn more link — full details."
  ],
  "behavior": [
   "Show on request, not automatically.",
   "Keep it attached to the result it explains."
  ],
  "accessibility": [
   "Use a popover with focus management and Escape to close.",
   "Keep the trigger reachable by keyboard."
  ],
  "content": [
   "Write in plain words.",
   "Name the data used, such as Your last 30 days of activity."
  ],
  "map": [
   [
    "Carbon",
    "Explainability popover",
    "Direct"
   ]
  ],
  "commonGround": "Carbon, Microsoft HAX, and Google PAIR agree on short, on-demand explanations.",
  "sources": [
   "https://carbondesignsystem.com/components/ai-label/usage/",
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "specialized|AI disclaimer": {
  "text": "A short notice that AI output may be wrong and should be checked.",
  "purpose": "Sets expectations about AI accuracy.",
  "use": [
   "Near prompt inputs and AI results.",
   "On first use of an AI feature."
  ],
  "avoid": [
   "Long legal text in the UI: link to it.",
   "Do not repeat it on every message."
  ],
  "anatomy": [
   "Notice text — one short sentence.",
   "Learn more link — policy and data use."
  ],
  "behavior": [
   "Keep it visible but quiet.",
   "Show it once per surface, not per response."
  ],
  "accessibility": [
   "Keep the text at sufficient contrast.",
   "Make the link keyboard accessible."
  ],
  "content": [
   "Say that AI can make mistakes and people should check important information.",
   "Keep it under 15 words."
  ],
  "map": [
   [
    "Atlassian",
    "Rovo disclaimer",
    "Partial"
   ],
   [
    "Carbon",
    "AI chat disclaimer",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Carbon, and Microsoft show a short accuracy notice near AI input or output.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/carbon-for-ai/",
   "https://atlassian.design/rovo-ui",
   "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/",
   "https://pair.withgoogle.com/guidebook/"
  ]
 },
 "interaction|Focus order": {
  "text": "The sequence in which keyboard focus moves through interactive elements on a page.",
  "purpose": "Lets keyboard and screen reader users move through a page in the same order sighted users read it.",
  "use": [
   "Every page, panel and overlay that contains interactive elements.",
   "Layout changes that reorder content visually: review the order each time."
  ],
  "avoid": [
   "Do not use positive tabindex values to force an order; fix the DOM order instead.",
   "Do not make static text or containers focusable just to include them in the order."
  ],
  "anatomy": [
   "DOM order — the source sequence that defines tab order.",
   "Focus entry point — where focus lands when a region or overlay opens.",
   "Focus return point — where focus goes when a region or overlay closes."
  ],
  "behavior": [
   "Match focus order to visual reading order: top to bottom, start to end.",
   "Move focus into a dialog when it opens and trap it there until it closes.",
   "Return focus to the triggering control when an overlay closes.",
   "Use one tab stop per composite widget and arrow keys inside it."
  ],
  "accessibility": [
   "Meet WCAG 2.2 SC 2.4.3 Focus Order and SC 2.4.11 Focus Not Obscured.",
   "Keep a visible focus indicator on every focus stop (SC 2.4.7).",
   "Never move focus unexpectedly on input or hover (SC 3.2.1, 3.2.2)."
  ],
  "content": [
   "Give each focus stop an accessible name that makes sense on its own.",
   "Use skip links labeled with their destination, such as \"Skip to main content\"."
  ],
  "map": [
   [
    "Carbon",
    "Keyboard accessibility",
    "Partial"
   ],
   [
    "Atlassian",
    "Focus management",
    "Partial"
   ],
   [
    "Material 3",
    "Focus (accessible design)",
    "Partial"
   ],
   [
    "Fluent 2",
    "Keyboard accessibility",
    "Partial"
   ],
   [
    "Spectrum",
    "Focus management (React Aria FocusScope)",
    "Partial"
   ]
  ],
  "commonGround": "All systems require DOM order to match visual order, focus trapping in modals and focus return on close; none recommend positive tabindex.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/accessibility/keyboard/",
   "https://react-spectrum.adobe.com/react-aria/FocusScope.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
   "https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/"
  ]
 },
 "interaction|Keyboard shortcuts": {
  "text": "Key combinations that trigger frequent commands without a pointer.",
  "purpose": "Speed up repeated work for expert users in dense tools.",
  "use": [
   "High-frequency commands such as search, save, new item or navigation between panes.",
   "The command is also reachable through a visible control."
  ],
  "avoid": [
   "Do not make a shortcut the only way to run a command.",
   "Do not override browser, OS or assistive-technology shortcuts.",
   "Do not bind single printable keys without a way to turn them off or remap them."
  ],
  "anatomy": [
   "Key combination — modifier plus key.",
   "Scope — global, page or focused component.",
   "Hint — the shortcut shown in tooltips and menus.",
   "Shortcut reference — a dialog listing all shortcuts."
  ],
  "behavior": [
   "Show the shortcut next to its command in menus and tooltips.",
   "Scope shortcuts to the focused region and ignore them while typing in a field.",
   "Use platform modifiers: Cmd on macOS, Ctrl on Windows and Linux.",
   "Offer a shortcut list, commonly opened with \"?\"."
  ],
  "accessibility": [
   "Meet WCAG 2.2 SC 2.1.4: single-character shortcuts can be turned off, remapped or work only on focus.",
   "Expose shortcuts with aria-keyshortcuts where useful.",
   "Do not conflict with screen reader browse-mode keys."
  ],
  "content": [
   "Write keys with their platform names and glyphs, such as Ctrl+S or ⌘S.",
   "Use the same key order everywhere: modifiers first, then the key."
  ],
  "map": [
   [
    "Polaris",
    "KeyboardKey",
    "Partial"
   ],
   [
    "Spectrum",
    "Keyboard (in menus)",
    "Partial"
   ],
   [
    "Fluent 2",
    "Keyboard accessibility",
    "Partial"
   ],
   [
    "Carbon",
    "Keyboard accessibility",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree shortcuts are accelerators only, shown next to their command, following platform modifier conventions.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html",
   "https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/",
   "https://carbondesignsystem.com/guidelines/accessibility/keyboard/",
   "https://polaris-react.shopify.com/components/images-and-icons/keyboard-key"
  ]
 },
 "interaction|Gesture interaction": {
  "text": "Touch and pointer motions such as tap, long press, swipe, pinch and drag that trigger actions.",
  "purpose": "Make touch interfaces direct and efficient; visible controls stay the primary path.",
  "use": [
   "Expected actions: standard platform gestures, such as swipe to dismiss or pinch to zoom.",
   "Shortcuts for actions that also have a visible control."
  ],
  "avoid": [
   "Do not hide a required action behind a gesture alone.",
   "Do not invent custom gestures that conflict with OS or browser gestures."
  ],
  "anatomy": [
   "Trigger — the touch or pointer input.",
   "Feedback — visual response that follows the finger.",
   "Threshold — the distance or time that commits the action.",
   "Alternative — the button or menu item that does the same thing."
  ],
  "behavior": [
   "Show feedback during the gesture and let users cancel by reversing it.",
   "Commit only after a clear threshold; snap back otherwise.",
   "Offer undo for destructive gesture actions."
  ],
  "accessibility": [
   "Provide a single-pointer, non-path alternative for multipoint or path gestures (WCAG 2.2 SC 2.5.1).",
   "Provide a non-dragging alternative for drag actions (SC 2.5.7).",
   "Trigger on pointer up so users can cancel (SC 2.5.2).",
   "Make targets at least 24 by 24 CSS pixels (SC 2.5.8)."
  ],
  "content": [
   "Name the visible alternative with the same verb as the gesture action, such as \"Archive\".",
   "Mention gestures in onboarding hints only when they save real time."
  ],
  "map": [
   [
    "Material 3",
    "Gestures",
    "Direct"
   ],
   [
    "Fluent 2",
    "Touch and gestures (iOS, Android)",
    "Partial"
   ],
   [
    "Spectrum",
    "Press and move interactions (React Aria)",
    "Partial"
   ]
  ],
  "commonGround": "Material and Fluent agree on platform-standard gestures with visible alternatives; WCAG 2.2 makes alternatives mandatory.",
  "sources": [
   "https://m3.material.io/foundations/interaction/gestures",
   "https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html"
  ]
 },
 "interaction|Pressable": {
  "text": "Base primitive that makes an element respond consistently to press from mouse, touch, pen and keyboard.",
  "purpose": "Normalizes press events and states across input types so custom controls behave like native buttons.",
  "use": [
   "Base for custom clickable surfaces that are not standard buttons or links.",
   "A control needs consistent pressed, hover and focus states."
  ],
  "avoid": [
   "A standard Button or Link fits: use those instead.",
   "Navigation: use a link so the browser treats it as one."
  ],
  "anatomy": [
   "Interactive element — a native button underneath.",
   "State layer — hover, pressed and focus visuals.",
   "Accessible name — label or aria-label."
  ],
  "behavior": [
   "Fire the action on release; cancel if the pointer leaves before release.",
   "Respond to Enter and Space like a native button.",
   "Show hover only for pointer devices, not after touch.",
   "Ignore presses while disabled."
  ],
  "accessibility": [
   "Render a native button or role=\"button\" with full keyboard support.",
   "Show a visible focus ring on keyboard focus only (focus-visible).",
   "Make the hit area at least 24 by 24 CSS pixels (SC 2.5.8)."
  ],
  "content": [
   "Give it a verb-first accessible name when it has no visible text.",
   "Keep visible text short and specific to the result of the press."
  ],
  "map": [
   [
    "Atlassian",
    "Pressable",
    "Direct"
   ],
   [
    "Spectrum",
    "usePress (React Aria)",
    "Direct"
   ],
   [
    "Material 3",
    "Interaction states",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Spectrum both ship a press primitive, built on a native button, that unifies pointer and keyboard input; Material defines the same states.",
  "sources": [
   "https://atlassian.design/components/primitives/pressable/examples",
   "https://react-spectrum.adobe.com/react-aria/usePress.html",
   "https://m3.material.io/foundations/interaction/states/overview",
   "https://www.w3.org/WAI/ARIA/apg/patterns/button/"
  ]
 },
 "interaction|Focusable": {
  "text": "A base primitive that makes an element take keyboard focus and show a consistent focus ring.",
  "purpose": "Gives every interactive element the same focus treatment and focus-visible logic.",
  "use": [
   "Custom interactive elements that need a standard focus ring.",
   "Scroll containers that must be reachable by keyboard."
  ],
  "avoid": [
   "Do not make non-interactive content focusable.",
   "Do not remove the focus outline without a replacement."
  ],
  "anatomy": [
   "Focus target — the element that receives focus.",
   "Focus ring — the visible indicator.",
   "Focus-visible logic — shows the ring for keyboard, hides it for pointer."
  ],
  "behavior": [
   "Show the ring on keyboard focus and hide it after pointer press.",
   "Use tabindex=\"0\" only for custom widgets; use tabindex=\"-1\" for programmatic focus targets.",
   "Keep the ring outside or inset consistently so it is never clipped."
  ],
  "accessibility": [
   "Meet WCAG 2.2 SC 2.4.7 Focus Visible and SC 2.4.11 Focus Not Obscured.",
   "Give the ring at least 3:1 contrast against adjacent colors (SC 1.4.11).",
   "In Plenix, fields show focus with a border color change, not an outer ring."
  ],
  "content": [
   "Pair every focusable element with an accessible name.",
   "Do not add visible \"focus here\" text; the ring is the signal."
  ],
  "map": [
   [
    "Atlassian",
    "Focusable / Focus ring",
    "Direct"
   ],
   [
    "Spectrum",
    "FocusRing / useFocusable (React Aria)",
    "Direct"
   ],
   [
    "Material 3",
    "Focus state",
    "Partial"
   ],
   [
    "Fluent 2",
    "Focus indicator",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on a single shared focus ring shown only for keyboard focus, with enough contrast; field focus styles vary by system.",
  "sources": [
   "https://react-spectrum.adobe.com/react-aria/FocusRing.html",
   "https://atlassian.design/components/focus-ring",
   "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html"
  ]
 },
 "interaction|Selectable": {
  "text": "Base behavior that lets items in a collection be selected singly or in multiples.",
  "purpose": "Gives lists, grids, tables and tiles one consistent selection model.",
  "use": [
   "Collections where users select items to act on them in bulk.",
   "Single-choice tile or card groups."
  ],
  "avoid": [
   "Triggering navigation: use a link or row action, not selection.",
   "Do not mix selection and activation on one click without a clear rule."
  ],
  "anatomy": [
   "Item — the selectable element.",
   "Selection control — a checkbox or radio, or the whole item.",
   "Selected state — color, check mark and aria-selected.",
   "Selection summary — count and bulk actions."
  ],
  "behavior": [
   "In multi-select, support Space to toggle, Shift+Arrow or Shift+click to extend, and Ctrl/Cmd+A to select all.",
   "Show a select-all control with an indeterminate state for partial selection.",
   "Keep selection when sorting or filtering unless items leave the set; say so when they do."
  ],
  "accessibility": [
   "Expose state with aria-selected or aria-checked.",
   "Show selection with more than color, such as a check mark (SC 1.4.1).",
   "Follow the APG listbox and grid selection keyboard models."
  ],
  "content": [
   "Show the selection count as \"3 selected\".",
   "Label select-all \"Select all\", with the scope when it is ambiguous."
  ],
  "map": [
   [
    "Carbon",
    "Selectable tile",
    "Partial"
   ],
   [
    "Material 3",
    "Selected state",
    "Partial"
   ],
   [
    "Fluent 2",
    "Selection (lists and data grids)",
    "Partial"
   ],
   [
    "Spectrum",
    "Selection (React Aria collections)",
    "Direct"
   ],
   [
    "Polaris",
    "Bulk actions selection",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on checkboxes for multi-select, a select-all with indeterminate state, and a visible count with bulk actions.",
  "sources": [
   "https://react-spectrum.adobe.com/react-aria/selection.html",
   "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/",
   "https://www.w3.org/WAI/ARIA/apg/patterns/grid/",
   "https://carbondesignsystem.com/components/tile/usage/"
  ]
 },
 "interaction|Drag handle": {
  "text": "A visible grip that shows an item can be dragged and gives a place to grab it.",
  "purpose": "Signals reorderability and separates the drag target from the item's other actions.",
  "use": [
   "List rows, cards and panels that users can reorder or move.",
   "The whole item cannot be the drag target because it has other actions."
  ],
  "avoid": [
   "Do not show a handle on items that cannot be dragged.",
   "Do not rely on the handle as the only way to reorder."
  ],
  "anatomy": [
   "Grip icon — the dotted handle glyph.",
   "Hit area — at least the minimum target size.",
   "Menu fallback — move up, move down or move to commands."
  ],
  "behavior": [
   "Change the cursor to grab on hover and grabbing while dragging.",
   "Make the handle a focusable button that opens move options or starts keyboard dragging.",
   "Show a drop indicator line while dragging."
  ],
  "accessibility": [
   "Provide a non-drag alternative, such as move commands (WCAG 2.2 SC 2.5.7).",
   "Name the handle with the item, such as \"Reorder Task 3\".",
   "Announce the new position after a move."
  ],
  "content": [
   "Label it with the verb and item name; avoid \"Drag me\".",
   "Use the tooltip \"Drag to reorder\" on pointer hover."
  ],
  "map": [
   [
    "Atlassian",
    "Drag handle (Pragmatic drag and drop)",
    "Direct"
   ],
   [
    "Material 3",
    "Drag handle",
    "Partial"
   ],
   [
    "Spectrum",
    "Drag button (React Aria DnD)",
    "Partial"
   ],
   [
    "Polaris",
    "Drag handle icon",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Material and Spectrum show a grip icon as a focusable button and require a keyboard or menu alternative.",
  "sources": [
   "https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines",
   "https://react-spectrum.adobe.com/react-aria/dnd.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html"
  ]
 },
 "interaction|Accessible descriptions": {
  "text": "Supplementary text tied programmatically to an element, explaining it beyond its name.",
  "purpose": "Gives screen reader users the same hints, formats and errors that sighted users see near a control.",
  "use": [
   "Helper text, format hints and error messages tied to fields.",
   "Dialogs: ties the body text to the dialog."
  ],
  "avoid": [
   "Do not repeat the accessible name in the description.",
   "Do not hide essential instructions only in a description or tooltip."
  ],
  "anatomy": [
   "Name — what the element is (label, aria-label).",
   "Description — extra detail (aria-describedby).",
   "Error message — validation text (aria-describedby or aria-errormessage)."
  ],
  "behavior": [
   "Link visible helper and error text with aria-describedby by ID.",
   "Keep the description short; screen readers read it after the name and role.",
   "Update the description when the error changes."
  ],
  "accessibility": [
   "Meet WCAG 2.2 SC 1.3.1, 3.3.1 and 3.3.2.",
   "Prefer visible text over aria-description so all users get it."
  ],
  "content": [
   "Write descriptions as one short sentence or format, such as \"Use YYYY-MM-DD\".",
   "Write errors that say what is wrong and how to fix it."
  ],
  "map": [
   [
    "Carbon",
    "Helper text",
    "Partial"
   ],
   [
    "Atlassian",
    "Helper message",
    "Partial"
   ],
   [
    "Material 3",
    "Supporting text",
    "Partial"
   ],
   [
    "Polaris",
    "Help text",
    "Partial"
   ],
   [
    "Spectrum",
    "Help text",
    "Partial"
   ]
  ],
  "commonGround": "All systems pair visible helper and error text with the field programmatically; they differ only in naming.",
  "sources": [
   "https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/",
   "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
   "https://spectrum.adobe.com/page/help-text/"
  ]
 },
 "interaction|Live regions": {
  "text": "Page areas whose changes are announced by screen readers without moving focus.",
  "purpose": "Tell non-visual users about status updates, results and errors that appear dynamically.",
  "use": [
   "Status messages such as save confirmations, result counts and upload progress.",
   "Urgent errors only, for assertive announcements."
  ],
  "avoid": [
   "Do not announce every minor change; it overwhelms users.",
   "Do not use a live region when focus already moves to the new content."
  ],
  "anatomy": [
   "Region — a container with role=\"status\", role=\"alert\" or aria-live.",
   "Politeness — polite waits, assertive interrupts.",
   "Message — the text injected into the region."
  ],
  "behavior": [
   "Render the empty live region on page load, then inject text into it.",
   "Use polite for status and assertive (role=\"alert\") for critical errors.",
   "Debounce rapid updates and announce the final state."
  ],
  "accessibility": [
   "Meet WCAG 2.2 SC 4.1.3 Status Messages.",
   "Do not place interactive controls inside a live region."
  ],
  "content": [
   "Write complete, short messages that make sense heard alone, such as \"12 results\".",
   "Do not include markup, icons or emoji names in announcements."
  ],
  "map": [
   [
    "Spectrum",
    "LiveAnnouncer (React Aria)",
    "Partial"
   ],
   [
    "Carbon",
    "Notification (role=status)",
    "Partial"
   ],
   [
    "Atlassian",
    "Flag announcements",
    "Partial"
   ],
   [
    "Fluent 2",
    "Announcements (useAnnounce)",
    "Partial"
   ]
  ],
  "commonGround": "Systems use polite regions for status and alert regions for errors, and wire toasts and notifications to them.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html",
   "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions",
   "https://www.w3.org/WAI/ARIA/apg/patterns/alert/"
  ]
 },
 "interaction|Semantic HTML": {
  "text": "Native HTML elements used for their intended meaning, before adding ARIA.",
  "purpose": "Native elements carry built-in roles, states and keyboard behavior, reducing bugs and custom code.",
  "use": [
   "button for actions, a for navigation, real form elements for input.",
   "Structure: headings, lists, tables and landmarks."
  ],
  "avoid": [
   "Do not build controls from div or span with click handlers.",
   "Do not add ARIA roles that duplicate or contradict native semantics."
  ],
  "anatomy": [
   "Landmarks — header, nav, main, aside, footer.",
   "Headings — h1 to h6 in order.",
   "Controls — button, a, input, select, textarea.",
   "Data — table with th and caption."
  ],
  "behavior": [
   "Choose the element by meaning, then style it.",
   "Let components accept an element override so they render the right tag.",
   "Use ARIA only to fill gaps native HTML cannot cover."
  ],
  "accessibility": [
   "Meet WCAG 2.2 SC 1.3.1 Info and Relationships and SC 4.1.2 Name, Role, Value.",
   "Follow the first rule of ARIA: prefer native elements."
  ],
  "content": [
   "Write headings that describe the section they introduce.",
   "Write link text that describes the destination, not \"Click here\"."
  ],
  "map": [
   [
    "Atlassian",
    "Primitives (Box as)",
    "Partial"
   ],
   [
    "Polaris",
    "Accessibility",
    "Partial"
   ],
   [
    "Carbon",
    "Accessibility for developers",
    "Partial"
   ],
   [
    "Spectrum",
    "Accessibility",
    "Partial"
   ]
  ],
  "commonGround": "All systems put native elements first and ARIA second; Atlassian and Polaris let layout primitives render the correct tag.",
  "sources": [
   "https://www.w3.org/TR/using-aria/",
   "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
   "https://polaris-react.shopify.com/foundations/accessibility",
   "https://atlassian.design/components/primitives/box/examples"
  ]
 },
 "interaction|Color contrast": {
  "text": "The required luminance difference between foreground and background for text, icons and controls.",
  "purpose": "Keeps content legible for low-vision users and in poor lighting.",
  "use": [
   "Check every text, icon, border and focus indicator token pair in every theme.",
   "Check states such as hover, selected and disabled text that still conveys meaning."
  ],
  "avoid": [
   "Do not rely on brand color for body text unless it passes.",
   "Do not put text on images without an overlay that guarantees contrast."
  ],
  "anatomy": [
   "Text contrast — 4.5:1 for normal, 3:1 for large text.",
   "Non-text contrast — 3:1 for UI boundaries, icons and focus indicators.",
   "Token pairs — approved foreground and background combinations."
  ],
  "behavior": [
   "Build contrast into tokens so approved pairs pass by default.",
   "Test both light and dark themes and high-contrast modes.",
   "Exempt only disabled controls and pure decoration."
  ],
  "accessibility": [
   "Meet WCAG 2.2 SC 1.4.3 Contrast (Minimum) and SC 1.4.11 Non-text Contrast.",
   "Aim for 7:1 (SC 1.4.6) for dense small text where practical."
  ],
  "content": [
   "Document each token pair with its ratio.",
   "Do not use placeholder text as the only label, since it usually has low contrast."
  ],
  "map": [
   [
    "Carbon",
    "Color contrast",
    "Direct"
   ],
   [
    "Atlassian",
    "Color (accessibility)",
    "Partial"
   ],
   [
    "Material 3",
    "Color contrast",
    "Direct"
   ],
   [
    "Fluent 2",
    "Color accessibility",
    "Partial"
   ],
   [
    "Polaris",
    "Color",
    "Partial"
   ],
   [
    "Spectrum",
    "Color contrast",
    "Direct"
   ]
  ],
  "commonGround": "All systems target WCAG AA (4.5:1 text, 3:1 UI) and encode passing pairs in tokens.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html",
   "https://carbondesignsystem.com/guidelines/color/overview/",
   "https://m3.material.io/foundations/designing/color-contrast",
   "https://spectrum.adobe.com/page/color-contrast/"
  ]
 },
 "interaction|High contrast": {
  "text": "Support for OS forced-colors modes and high-contrast themes that replace or strengthen the palette.",
  "purpose": "Users with low vision or light sensitivity rely on these modes to read the interface.",
  "use": [
   "All components: test in Windows forced-colors mode.",
   "Users need more than AA: offer a high-contrast theme."
  ],
  "avoid": [
   "Do not convey state only with background color or box-shadow, which forced colors remove.",
   "Do not override user forced colors with forced-color-adjust: none except for meaningful swatches."
  ],
  "anatomy": [
   "Forced-colors mode — OS-chosen system colors.",
   "System color keywords — CanvasText, ButtonText, Highlight, GrayText.",
   "High-contrast theme — a product theme with stronger token values."
  ],
  "behavior": [
   "Use real borders and outlines so boundaries survive forced colors.",
   "Map states to system colors inside @media (forced-colors: active).",
   "Keep icons as currentColor so they adapt."
  ],
  "accessibility": [
   "Keep focus indicators visible in forced colors.",
   "Respect prefers-contrast where supported."
  ],
  "content": [
   "Do not refer to colors in instructions, since they change in these modes.",
   "Use text labels for states so meaning survives the palette change."
  ],
  "map": [
   [
    "Fluent 2",
    "High contrast",
    "Direct"
   ],
   [
    "Material 3",
    "Contrast levels",
    "Partial"
   ],
   [
    "Spectrum",
    "Windows high contrast",
    "Partial"
   ],
   [
    "Carbon",
    "High contrast mode",
    "Partial"
   ]
  ],
  "commonGround": "Fluent and Spectrum test against Windows forced colors; Material offers medium and high contrast schemes; all keep borders and focus visible.",
  "sources": [
   "https://fluent2.microsoft.design/accessibility",
   "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors",
   "https://m3.material.io/foundations/designing/color-contrast"
  ]
 },
 "interaction|RTL / bidirectional UI": {
  "text": "Mirrored layout, direction-aware icons and text handling for right-to-left languages.",
  "purpose": "Makes the interface read naturally in Arabic, Hebrew and other RTL scripts.",
  "use": [
   "The product may ship in an RTL locale.",
   "Logical CSS properties, in all components from the start."
  ],
  "avoid": [
   "Do not mirror media playback controls, clocks, charts with time axes or logos.",
   "Do not hard-code left and right in layout or tokens."
  ],
  "anatomy": [
   "Direction — dir attribute on html or a container.",
   "Logical properties — inline-start and inline-end.",
   "Directional icons — arrows and chevrons that flip.",
   "Isolated text — mixed-direction strings wrapped with bdi or dir=\"auto\"."
  ],
  "behavior": [
   "Mirror navigation, alignment, padding and directional icons.",
   "Keep numbers, code and Latin product names left to right inside RTL text.",
   "Flip keyboard arrow behavior to match visual direction."
  ],
  "accessibility": [
   "Set lang and dir so screen readers read in the right order and language.",
   "Keep focus order matching the mirrored visual order."
  ],
  "content": [
   "Do not build sentences from fragments that assume English word order.",
   "Use \"start\" and \"end\" instead of \"left\" and \"right\" in docs and tokens."
  ],
  "map": [
   [
    "Material 3",
    "Bidirectionality and RTL",
    "Direct"
   ],
   [
    "Spectrum",
    "Bi-directionality",
    "Direct"
   ],
   [
    "Carbon",
    "Globalization",
    "Partial"
   ],
   [
    "Fluent 2",
    "Right-to-left",
    "Partial"
   ]
  ],
  "commonGround": "Material and Spectrum agree on mirroring layout and directional icons, but not media controls, time or logos.",
  "sources": [
   "https://m3.material.io/foundations/layout/understanding-layout/bidirectionality-rtl",
   "https://spectrum.adobe.com/page/bi-directionality/",
   "https://www.w3.org/International/questions/qa-html-dir"
  ]
 },
 "interaction|Accessible drag and drop": {
  "text": "Drag-and-drop interactions that also work by keyboard, screen reader and single pointer.",
  "purpose": "Lets users who cannot drag reorder and move items.",
  "use": [
   "Wherever drag and drop exists, including reordering, moving between lists and file drop.",
   "Every feature, with the same alternative pattern, so users learn it once."
  ],
  "avoid": [
   "Do not ship drag and drop without a non-drag alternative.",
   "Do not rely on drop-zone color alone to show validity."
  ],
  "anatomy": [
   "Drag source — the item or its handle.",
   "Drop target — the valid destination with an indicator.",
   "Alternative — move menu or keyboard drag mode.",
   "Announcer — live messages for pick up, move and drop."
  ],
  "behavior": [
   "Offer a menu with move up, move down and move to as the baseline alternative.",
   "In keyboard mode, pick up with Enter or Space, move with arrows and drop with Enter; Escape cancels.",
   "Announce the item, current position and result."
  ],
  "accessibility": [
   "Meet WCAG 2.2 SC 2.5.7 Dragging Movements.",
   "Keep focus on the moved item after the drop.",
   "Show valid and invalid targets with shape or text, not only color."
  ],
  "content": [
   "Write announcements like \"Task 3 moved to position 1 of 5\".",
   "Label menu alternatives with verbs, such as \"Move up\" and \"Move to…\"."
  ],
  "map": [
   [
    "Atlassian",
    "Pragmatic drag and drop (accessibility)",
    "Direct"
   ],
   [
    "Spectrum",
    "Drag and drop (React Aria)",
    "Direct"
   ],
   [
    "Polaris",
    "Drop zone",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Spectrum agree on a menu or keyboard alternative plus live announcements for every move.",
  "sources": [
   "https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines",
   "https://react-spectrum.adobe.com/react-aria/dnd.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html"
  ]
 },
 "interaction|WCAG guidance": {
  "text": "Plenix commits to the Web Content Accessibility Guidelines as its accessibility baseline.",
  "purpose": "Sets one measurable standard for design, engineering and testing.",
  "use": [
   "WCAG 2.2 Level AA is the minimum for every component and page.",
   "Reviews: the success criteria are the acceptance criteria."
  ],
  "avoid": [
   "Do not treat component compliance as page compliance; test composed pages.",
   "Do not claim conformance without testing."
  ],
  "anatomy": [
   "Principles — perceivable, operable, understandable, robust.",
   "Success criteria — testable rules at A, AA and AAA.",
   "Component notes — criteria each component must meet."
  ],
  "behavior": [
   "List the relevant success criteria on each component page.",
   "Track new WCAG 2.2 criteria: focus not obscured, dragging movements, target size, consistent help, redundant entry and accessible authentication."
  ],
  "accessibility": [
   "Meet all Level A and AA criteria of WCAG 2.2.",
   "Follow WAI-ARIA Authoring Practices for widget patterns."
  ],
  "content": [
   "Reference criteria by number and name, such as \"SC 2.5.8 Target Size (Minimum)\".",
   "State the WCAG version and level on every accessibility claim."
  ],
  "map": [
   [
    "Carbon",
    "Accessibility",
    "Direct"
   ],
   [
    "Atlassian",
    "Accessibility",
    "Direct"
   ],
   [
    "Material 3",
    "Accessible design",
    "Direct"
   ],
   [
    "Fluent 2",
    "Accessibility",
    "Direct"
   ],
   [
    "Polaris",
    "Accessibility",
    "Direct"
   ],
   [
    "Spectrum",
    "Accessibility",
    "Direct"
   ]
  ],
  "commonGround": "All systems target WCAG AA; Carbon and Atlassian state 2.1 or 2.2 explicitly; all say components alone do not make a page accessible.",
  "sources": [
   "https://www.w3.org/TR/WCAG22/",
   "https://carbondesignsystem.com/guidelines/accessibility/overview/",
   "https://atlassian.design/foundations/accessibility",
   "https://www.w3.org/WAI/ARIA/apg/"
  ]
 },
 "interaction|Use of color": {
  "text": "Color is never the only way to convey meaning, state or action.",
  "purpose": "Users with color vision deficiency or in forced-colors mode must still get the information.",
  "use": [
   "Status, validation, links, charts, selection and required fields.",
   "Choosing status colors and chart palettes."
  ],
  "avoid": [
   "Do not show errors only with red borders.",
   "Do not distinguish links from body text by color alone."
  ],
  "anatomy": [
   "Color — a reinforcing signal.",
   "Redundant cue — icon, text, pattern, shape or underline.",
   "Legend — labels for color in data visualizations."
  ],
  "behavior": [
   "Pair status colors with an icon and a text label.",
   "Underline inline links, or give them 3:1 contrast with surrounding text plus a non-color cue on focus and hover.",
   "Use patterns or direct labels in charts."
  ],
  "accessibility": [
   "Meet WCAG 2.2 SC 1.4.1 Use of Color.",
   "Test with a color vision deficiency simulator."
  ],
  "content": [
   "Do not write instructions that depend on color, such as \"click the green button\".",
   "Use words such as \"Error\" or \"Paid\" in badges alongside color."
  ],
  "map": [
   [
    "Carbon",
    "Color (accessibility)",
    "Partial"
   ],
   [
    "Atlassian",
    "Color",
    "Partial"
   ],
   [
    "Material 3",
    "Color and accessibility",
    "Partial"
   ],
   [
    "Polaris",
    "Color",
    "Partial"
   ],
   [
    "Spectrum",
    "Color for accessibility",
    "Partial"
   ]
  ],
  "commonGround": "All systems require a second cue, such as an icon or text, alongside color for meaning.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
   "https://carbondesignsystem.com/guidelines/color/overview/",
   "https://spectrum.adobe.com/page/color-for-accessibility/"
  ]
 },
 "interaction|Captions and transcripts": {
  "text": "Text alternatives for audio and video content.",
  "purpose": "Give deaf, hard-of-hearing and sound-off users access to media.",
  "use": [
   "Captions: all prerecorded and live video with speech.",
   "Transcripts: audio-only content, and as a companion to video."
  ],
  "avoid": [
   "Do not rely on auto-generated captions without review.",
   "Do not autoplay media with sound."
  ],
  "anatomy": [
   "Captions — synchronized text with speech and sound cues.",
   "Transcript — full text of the media.",
   "Audio description — narration of important visuals.",
   "Player controls — toggles for captions and descriptions."
  ],
  "behavior": [
   "Turn captions on with a visible control in the player.",
   "Place the transcript link next to the media.",
   "Let users resize and restyle captions where the player allows."
  ],
  "accessibility": [
   "Meet WCAG 2.2 SC 1.2.1 to 1.2.5 at Level AA.",
   "Make player controls keyboard operable and labeled."
  ],
  "content": [
   "Include speaker names and meaningful sounds, such as [door closes].",
   "Keep captions verbatim, with correct spelling and punctuation."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded.html",
   "https://www.w3.org/WAI/media/av/"
  ],
  "map": []
 },
 "interaction|Accessibility testing": {
  "text": "Checks components and pages against accessibility requirements.",
  "purpose": "Catches the gaps that automated rules and good intentions miss.",
  "use": [
   "Every new component, every release and every composed page.",
   "A checklist per component type, so manual tests are repeatable."
  ],
  "avoid": [
   "Do not rely on automated scans alone; they catch only part of the issues.",
   "Do not test only in one browser and screen reader pair."
  ],
  "anatomy": [
   "Automated checks — axe or similar in unit and CI tests.",
   "Keyboard test — full task without a mouse.",
   "Screen reader test — NVDA, JAWS, VoiceOver and TalkBack.",
   "Visual checks — zoom 400%, contrast, forced colors and reduced motion."
  ],
  "behavior": [
   "Block merges on automated failures.",
   "Record manual test results per component with the browser and screen reader used.",
   "Retest after design or dependency changes."
  ],
  "accessibility": [
   "Test against WCAG 2.2 AA and APG keyboard models.",
   "Include users with disabilities in research where possible."
  ],
  "content": [
   "Write issues with the criterion, steps, expected result and actual result.",
   "Record which assistive technology and version each result came from."
  ],
  "map": [
   [
    "Carbon",
    "Accessibility testing / status",
    "Direct"
   ],
   [
    "Atlassian",
    "Accessibility testing",
    "Partial"
   ],
   [
    "Spectrum",
    "Accessibility testing",
    "Partial"
   ],
   [
    "Polaris",
    "Accessibility",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on combining automated checks with keyboard and screen reader testing; Carbon publishes per-component test status.",
  "sources": [
   "https://carbondesignsystem.com/guidelines/accessibility/overview/",
   "https://www.w3.org/WAI/test-evaluate/",
   "https://github.com/dequelabs/axe-core"
  ]
 },
 "interaction|Internationalization": {
  "text": "Designs and builds the product so it can be translated and formatted for any locale.",
  "purpose": "Lets one product serve many languages, regions and formats without redesign.",
  "use": [
   "From the start, for all user-facing strings, dates, numbers and currency.",
   "Testing: use pseudo-localization to find hard-coded and clipped strings."
  ],
  "avoid": [
   "Do not concatenate translated fragments into sentences.",
   "Do not hard-code date, number or currency formats.",
   "Do not size controls to fit English text only."
  ],
  "anatomy": [
   "Message catalog — externalized strings with placeholders.",
   "Locale formatting — Intl APIs for dates, numbers, lists and plurals.",
   "Layout direction — LTR or RTL.",
   "Expansion room — space for longer translations."
  ],
  "behavior": [
   "Format values with Intl APIs and the user locale.",
   "Use ICU plural and select rules for counts.",
   "Allow 30 to 40 percent text expansion and wrapping in components."
  ],
  "accessibility": [
   "Set the lang attribute on the page and on mixed-language passages (SC 3.1.1, 3.1.2).",
   "Keep text resizable and wrapping so longer translations stay readable (SC 1.4.4)."
  ],
  "content": [
   "Write short, literal source strings without idioms.",
   "Give translators context notes for each string."
  ],
  "map": [
   [
    "Spectrum",
    "Internationalization",
    "Direct"
   ],
   [
    "Material 3",
    "Bidirectionality",
    "Partial"
   ],
   [
    "Carbon",
    "Globalization",
    "Direct"
   ],
   [
    "Polaris",
    "Internationalization",
    "Partial"
   ],
   [
    "Fluent 2",
    "Localization",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on externalized strings, locale-aware formatting, text expansion room and RTL support.",
  "sources": [
   "https://react-spectrum.adobe.com/internationalized/",
   "https://spectrum.adobe.com/page/internationalization/",
   "https://www.w3.org/International/",
   "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html"
  ]
 },
 "interaction|Portal": {
  "text": "Renders content into a DOM node outside its parent component.",
  "purpose": "Lets overlays escape the clipping, overflow and stacking contexts of their parents.",
  "use": [
   "Modals, popovers, menus, tooltips and toasts.",
   "A parent has overflow hidden or a transform that would clip an overlay."
  ],
  "avoid": [
   "Do not portal inline content that belongs in the reading order.",
   "Do not create a new root per overlay when a shared layer stack exists."
  ],
  "anatomy": [
   "Portal root — a container near the end of body.",
   "Layer order — z-index layers for overlays.",
   "Context bridge — theme and density passed into the portal."
  ],
  "behavior": [
   "Keep theme, density and direction from the source tree.",
   "Order layers by type so tooltips sit above popovers, and dialogs above page content.",
   "Clean up the node when the overlay unmounts."
  ],
  "accessibility": [
   "Manage focus explicitly, since the DOM is no longer adjacent to the trigger.",
   "Link trigger and content with aria-controls or aria-describedby.",
   "Mark the rest of the page inert for modal content."
  ],
  "content": [
   "Not applicable; content rules follow the overlay rendered inside.",
   "Keep visible text in the overlay, not in the portal root."
  ],
  "map": [
   [
    "Atlassian",
    "Portal",
    "Direct"
   ],
   [
    "Fluent 2",
    "Portal",
    "Direct"
   ],
   [
    "Spectrum",
    "Overlay container (React Aria)",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian and Fluent ship a Portal utility with a shared layer stack; overlays are built on it.",
  "sources": [
   "https://atlassian.design/components/portal",
   "https://react.fluentui.dev/?path=/docs/components-portal--docs",
   "https://react-spectrum.adobe.com/react-aria/Popover.html"
  ]
 },
 "interaction|Floating positioner": {
  "text": "Places floating content next to an anchor and keeps it in view.",
  "purpose": "Positions menus, popovers and tooltips correctly as the page scrolls or resizes.",
  "use": [
   "Every anchored overlay: menu, popover, tooltip, combobox list and date picker.",
   "An anchored overlay sits inside a scroll container."
  ],
  "avoid": [
   "Do not position overlays with fixed offsets.",
   "Modals: they are centered in the viewport."
  ],
  "anatomy": [
   "Anchor — the trigger element.",
   "Placement — side and alignment, such as bottom-start.",
   "Offset — gap between anchor and overlay.",
   "Collision handling — flip and shift to stay in view."
  ],
  "behavior": [
   "Flip to the opposite side when space runs out, then shift along the axis.",
   "Update position on scroll, resize and content change.",
   "Constrain size to the viewport and scroll inside.",
   "Use start and end placements so RTL mirrors correctly."
  ],
  "accessibility": [
   "Keep the overlay in the DOM order or manage focus when it opens.",
   "Do not let the overlay cover the focused trigger (SC 2.4.11)."
  ],
  "content": [
   "Not applicable.",
   "Keep overlay text short so it fits common placements."
  ],
  "map": [
   [
    "Atlassian",
    "Popper",
    "Direct"
   ],
   [
    "Fluent 2",
    "Positioning",
    "Direct"
   ],
   [
    "Spectrum",
    "useOverlayPosition (React Aria)",
    "Direct"
   ],
   [
    "Carbon",
    "Popover (auto align)",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian, Fluent and Spectrum all ship a positioner with placement, offset, flip and shift.",
  "sources": [
   "https://atlassian.design/components/popper",
   "https://react.fluentui.dev/?path=/docs/concepts-developer-positioning-components--docs",
   "https://react-spectrum.adobe.com/react-aria/useOverlayPosition.html",
   "https://floating-ui.com/"
  ]
 },
 "interaction|Scroll lock": {
  "text": "Stops the page behind an overlay from scrolling.",
  "purpose": "Keeps users anchored in a modal and stops background content from moving.",
  "use": [
   "While a modal dialog, full-screen sheet or blocking overlay is open.",
   "On mobile, when a bottom sheet covers the page."
  ],
  "avoid": [
   "Non-modal popovers, menus or toasts: do not lock scroll.",
   "Do not lock scroll in a way that shifts layout when the scrollbar disappears."
  ],
  "anatomy": [
   "Lock target — the document scroll container.",
   "Scrollbar compensation — padding or scrollbar-gutter to prevent shift.",
   "Lock counter — handles nested overlays."
  ],
  "behavior": [
   "Lock on open and restore the exact scroll position on close.",
   "Count nested locks and release only when the last overlay closes.",
   "Allow scrolling inside the overlay itself."
  ],
  "accessibility": [
   "Pair with inert or aria-modal so assistive technology also stays in the overlay.",
   "Keep overlay content reachable at 400% zoom by scrolling inside it."
  ],
  "content": [
   "Not applicable.",
   "Not applicable beyond the overlay's own text."
  ],
  "map": [
   [
    "Spectrum",
    "usePreventScroll (React Aria)",
    "Direct"
   ],
   [
    "Atlassian",
    "Modal dialog (scroll behavior)",
    "Partial"
   ],
   [
    "Fluent 2",
    "Dialog (scroll behavior)",
    "Partial"
   ]
  ],
  "commonGround": "Systems lock background scroll for modals only and allow scrolling inside the overlay.",
  "sources": [
   "https://react-spectrum.adobe.com/react-aria/usePreventScroll.html",
   "https://atlassian.design/components/modal-dialog/examples",
   "https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter"
  ]
 },
 "interaction|Scroll restoration": {
  "text": "Returns users to their previous scroll position after navigation.",
  "purpose": "Preserves context when users go back to a list or reopen a view.",
  "use": [
   "Back navigation to long lists, search results and tables.",
   "Panes that unmount and remount within an app."
  ],
  "avoid": [
   "A fresh navigation to a new page: start at the top; do not restore position.",
   "Do not restore position when the data changed so much that the old offset is meaningless."
  ],
  "anatomy": [
   "Key — route or view identifier.",
   "Stored position — scroll offset per container.",
   "Restore trigger — back navigation or remount."
  ],
  "behavior": [
   "Save position per scroll container, not only the window.",
   "Restore after content has loaded, including virtualized rows.",
   "Move focus to the page heading on new navigation, and to the previous item on back navigation."
  ],
  "accessibility": [
   "Keep focus and scroll in sync so keyboard users land where they left off.",
   "Announce the new page title on route change so screen reader users know where they are."
  ],
  "content": [
   "Not applicable.",
   "Keep page titles unique so restored views are easy to identify."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration",
   "https://reactrouter.com/en/main/components/scroll-restoration"
  ],
  "map": []
 },
 "interaction|Intersection observer": {
  "text": "A utility that reports when an element enters or leaves the viewport or a scroll container.",
  "purpose": "Drives lazy loading, infinite scroll and sticky-state changes without scroll handlers.",
  "use": [
   "Lazy-loading images and thumbnails.",
   "Loading the next page of results near the end of a list.",
   "Toggling sticky header shadows."
  ],
  "avoid": [
   "Hiding content users need without a fallback.",
   "Infinite scroll where users need to reach the footer: use pagination or a load-more button."
  ],
  "anatomy": [
   "Target — the observed element.",
   "Root — viewport or scroll container.",
   "Threshold and margin — when to fire."
  ],
  "behavior": [
   "Start loading before the item is visible, using a root margin.",
   "Disconnect observers when components unmount.",
   "Show a loading placeholder of the final size to avoid layout shift."
  ],
  "accessibility": [
   "Announce newly loaded results with a polite live region.",
   "Offer a load-more button as a keyboard-friendly alternative."
  ],
  "content": [
   "Label load-more controls clearly, such as \"Load 50 more\".",
   "Write loading placeholders as \"Loading…\" only when a status message is needed."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API",
   "https://web.dev/articles/browser-level-image-lazy-loading"
  ],
  "map": []
 },
 "interaction|Truncate": {
  "text": "Shortens text to one line with an ellipsis when it does not fit.",
  "purpose": "Keeps dense layouts aligned while signaling that more text exists.",
  "use": [
   "Fixed-width table cells, list rows, tabs and breadcrumbs.",
   "File names and paths where the end matters: use middle truncation."
  ],
  "avoid": [
   "Do not truncate headings, error messages or instructions.",
   "Do not truncate when wrapping fits; prefer wrapping."
  ],
  "anatomy": [
   "Text — the full string.",
   "Ellipsis — the visible cut marker.",
   "Full-text reveal — tooltip, expand or detail view."
  ],
  "behavior": [
   "Show the full text on hover and on keyboard focus.",
   "Keep the full text in the DOM so search and screen readers get it.",
   "Recompute when the container resizes."
  ],
  "accessibility": [
   "Make the full value available to keyboard users, not only on hover.",
   "Keep text readable at 400% zoom by allowing reflow (SC 1.4.10)."
  ],
  "content": [
   "Put the distinguishing words first so truncation keeps them.",
   "Do not truncate numbers, dates or currency; give them enough width."
  ],
  "map": [
   [
    "Polaris",
    "Text (truncate)",
    "Direct"
   ],
   [
    "Carbon",
    "Overflow content",
    "Direct"
   ],
   [
    "Atlassian",
    "Truncation",
    "Partial"
   ],
   [
    "Spectrum",
    "Truncation",
    "Partial"
   ],
   [
    "Fluent 2",
    "Text truncation",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on end ellipsis by default, a tooltip with the full text, and no truncating of critical content.",
  "sources": [
   "https://carbondesignsystem.com/patterns/overflow-content/",
   "https://polaris-react.shopify.com/components/typography/text",
   "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html"
  ]
 },
 "interaction|Clamp": {
  "text": "Limits text to a set number of lines, ending with an ellipsis.",
  "purpose": "Keeps cards and previews even in height while showing more than one line.",
  "use": [
   "Descriptions in cards, previews and list summaries.",
   "Equal card heights matter more than full text in the overview."
  ],
  "avoid": [
   "Do not clamp content users must read in full without a way to expand it.",
   "One line: use Truncate."
  ],
  "anatomy": [
   "Line count — the maximum lines shown.",
   "Ellipsis — marker at the last line.",
   "Expand control — \"Show more\" when needed."
  ],
  "behavior": [
   "Use the CSS line-clamp property with a fixed line count from a token.",
   "Show an expand control only when text actually overflows.",
   "Keep full text in the DOM."
  ],
  "accessibility": [
   "Make the expand control a button with aria-expanded.",
   "Let text reflow at zoom (SC 1.4.10)."
  ],
  "content": [
   "Label expand controls \"Show more\" and \"Show less\".",
   "Write the first lines so they carry the key point."
  ],
  "map": [
   [
    "Carbon",
    "Overflow content (multi-line)",
    "Partial"
   ],
   [
    "Polaris",
    "Truncate",
    "Partial"
   ],
   [
    "Atlassian",
    "Truncation",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Polaris treat multi-line clamping as a form of truncation with a reveal control.",
  "sources": [
   "https://carbondesignsystem.com/patterns/overflow-content/",
   "https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp"
  ]
 },
 "interaction|Clipboard": {
  "text": "Copies values to the clipboard and confirms the result.",
  "purpose": "Lets users copy IDs, paths, links and code without selecting text by hand.",
  "use": [
   "Next to IDs, URLs, file paths, API keys shown once and code snippets.",
   "Row values in tables that users often paste elsewhere."
  ],
  "avoid": [
   "Do not copy silently without confirmation.",
   "Do not read from the clipboard without a user action and permission."
  ],
  "anatomy": [
   "Copy button — icon button next to the value.",
   "Value — the exact text copied.",
   "Confirmation — temporary \"Copied\" feedback."
  ],
  "behavior": [
   "Use the async Clipboard API with a fallback.",
   "Change the icon or tooltip to \"Copied\" for about two seconds.",
   "Show an error message if copying fails."
  ],
  "accessibility": [
   "Give the button a name that includes the value type, such as \"Copy file path\".",
   "Announce \"Copied\" through a polite live region."
  ],
  "content": [
   "Use \"Copy\" as the action and \"Copied\" as the confirmation.",
   "Say what failed and what to do, such as \"Couldn't copy. Select the text and copy it manually.\""
  ],
  "map": [
   [
    "Carbon",
    "Copy button",
    "Direct"
   ],
   [
    "Spectrum",
    "Clipboard (React Aria)",
    "Partial"
   ],
   [
    "Polaris",
    "Clipboard / copy",
    "Partial"
   ],
   [
    "Atlassian",
    "Code block copy",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on an icon button beside the value with a short \"Copied\" confirmation.",
  "sources": [
   "https://carbondesignsystem.com/components/copy-button/usage/",
   "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API"
  ]
 },
 "interaction|Hotkey": {
  "text": "Registers keyboard shortcut handlers with scope and conflict rules.",
  "purpose": "Gives every keyboard shortcut one implementation for binding, scoping and display.",
  "use": [
   "Every app-level or component-level keyboard shortcut.",
   "Feeding the shortcut list and menu hints from one registry."
  ],
  "avoid": [
   "Do not attach raw keydown listeners for shortcuts in components.",
   "Do not fire shortcuts while focus is in a text field unless intended."
  ],
  "anatomy": [
   "Binding — the key combination.",
   "Scope — global, region or component.",
   "Handler — the command run.",
   "Registry — the list used for the shortcut help dialog."
  ],
  "behavior": [
   "Normalize Ctrl and Cmd per platform.",
   "Resolve conflicts by scope, innermost first.",
   "Unregister on unmount.",
   "Feed the registry into the shortcut list and menu hints."
  ],
  "accessibility": [
   "Support turning off or remapping single-key shortcuts (SC 2.1.4).",
   "Do not block keys that assistive technology uses."
  ],
  "content": [
   "Store a human-readable label for each binding.",
   "Use the same label in the registry as in the menu item."
  ],
  "commonGround": "Not defined by the major systems; Plenix guidance from general practice.",
  "sources": [
   "https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html",
   "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-keyshortcuts"
  ],
  "map": []
 },
 "interaction|Virtualization": {
  "text": "Renders only the visible rows or items of a long collection.",
  "purpose": "Keeps large lists, tables and grids fast by limiting DOM size.",
  "use": [
   "Collections over a few hundred items, such as asset grids and log tables.",
   "Tree views and file lists that can grow without limit."
  ],
  "avoid": [
   "Do not virtualize short lists; the cost outweighs the gain.",
   "Do not virtualize content users need to find with browser search unless you provide search."
  ],
  "anatomy": [
   "Viewport — the scroll container.",
   "Window — rendered items plus overscan.",
   "Spacer — total size placeholder.",
   "Item measurer — fixed or measured heights."
  ],
  "behavior": [
   "Use fixed row heights from density tokens where possible.",
   "Render overscan rows to avoid blank flashes.",
   "Keep the focused item rendered while it has focus.",
   "Restore scroll position on return."
  ],
  "accessibility": [
   "Expose total count with aria-rowcount or aria-setsize and each item index with aria-rowindex or aria-posinset.",
   "Keep keyboard navigation working across unrendered items."
  ],
  "content": [
   "Show the total count in the header or status area.",
   "Do not show \"Loading\" for rows that render instantly from memory."
  ],
  "map": [
   [
    "Spectrum",
    "Virtualizer (React Aria)",
    "Direct"
   ],
   [
    "Fluent 2",
    "Virtualizer",
    "Direct"
   ],
   [
    "Atlassian",
    "Dynamic table (large data)",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum and Fluent ship virtualizers that keep focus and ARIA counts correct.",
  "sources": [
   "https://react-spectrum.adobe.com/react-aria/Virtualizer.html",
   "https://react.fluentui.dev/?path=/docs/components-virtualizer-virtualizer--docs",
   "https://www.w3.org/WAI/ARIA/apg/patterns/grid/"
  ]
 },
 "interaction|Drag-and-drop engine": {
  "text": "The shared low-level library behind all drag-and-drop interactions.",
  "purpose": "Gives consistent drag behavior, drop indicators, auto-scroll and accessibility across features from one engine.",
  "use": [
   "Reordering, moving between containers and dropping files.",
   "The only drag-and-drop dependency across Plenix apps."
  ],
  "avoid": [
   "Do not build ad hoc drag code in each feature.",
   "Do not ship an engine without keyboard and announcement support."
  ],
  "anatomy": [
   "Draggable — source registration.",
   "Drop target — target registration with rules.",
   "Monitor — global drag state.",
   "Auto-scroll — scrolls containers near edges.",
   "Announcer — accessible messages."
  ],
  "behavior": [
   "Support native file drops and in-app drags with one model.",
   "Show a drop indicator and a drag preview.",
   "Auto-scroll near container edges.",
   "Cancel on Escape and restore the original position."
  ],
  "accessibility": [
   "Provide keyboard drag mode or menu alternatives (SC 2.5.7).",
   "Announce pick up, move, drop and cancel."
  ],
  "content": [
   "Write announcements with item name and position.",
   "Keep drag previews labeled with the item name and count, such as \"3 files\"."
  ],
  "map": [
   [
    "Atlassian",
    "Pragmatic drag and drop",
    "Direct"
   ],
   [
    "Spectrum",
    "useDrag / useDrop (React Aria)",
    "Direct"
   ]
  ],
  "commonGround": "Atlassian and Spectrum both ship a shared engine with native file support, indicators and accessibility built in.",
  "sources": [
   "https://atlassian.design/components/pragmatic-drag-and-drop",
   "https://react-spectrum.adobe.com/react-aria/dnd.html",
   "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html"
  ]
 },
 "implementation|Mobile web": {
  "text": "Delivering Plenix interfaces in mobile browsers on phones and small tablets.",
  "purpose": "Defines how components adapt to small screens, touch and limited bandwidth.",
  "use": [
   "A workflow must work in a phone browser.",
   "Responsive layouts: use the breakpoints from the layout system."
  ],
  "avoid": [
   "Touch devices: use touch-sized targets, not desktop density.",
   "Do not rely on hover for essential information."
  ],
  "anatomy": [
   "Breakpoints — width ranges that change layout.",
   "Touch targets — larger hit areas.",
   "Viewport meta — correct scaling.",
   "Input modes — inputmode and type for mobile keyboards."
  ],
  "behavior": [
   "Switch to single-column layouts and bottom sheets on small widths.",
   "Increase target size and spacing for coarse pointers.",
   "Respect safe-area insets and the virtual keyboard."
  ],
  "accessibility": [
   "Meet WCAG 2.2 SC 1.4.10 Reflow at 320 CSS pixels.",
   "Do not block pinch zoom.",
   "Support both orientations (SC 1.3.4)."
  ],
  "content": [
   "Keep labels short enough to fit narrow widths without truncation.",
   "Use the right input type so mobile keyboards show the right keys."
  ],
  "map": [
   [
    "Material 3",
    "Web / compact window class",
    "Partial"
   ],
   [
    "Spectrum",
    "Platform scale (mobile)",
    "Partial"
   ],
   [
    "Polaris",
    "Responsive / mobile",
    "Partial"
   ],
   [
    "Carbon",
    "Responsive 2x grid",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on responsive breakpoints, larger touch targets on mobile and no hover-only content; Spectrum scales components up for touch.",
  "sources": [
   "https://spectrum.adobe.com/page/platform-scale/",
   "https://m3.material.io/foundations/layout/applying-layout/window-size-classes",
   "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html"
  ]
 },
 "ios-implementation|How to build": {
  "text": "Native Plenix implementation for Apple iPhone and iPad apps.",
  "purpose": "Brings Plenix tokens and patterns to iOS while respecting Apple platform conventions.",
  "use": [
   "Building a native iOS app that shares the Plenix brand.",
   "Plenix tokens exported for Swift and SwiftUI."
  ],
  "avoid": [
   "Do not copy web components pixel for pixel; follow iOS navigation and controls.",
   "Do not override system gestures such as edge swipe back."
  ],
  "anatomy": [
   "Token export — colors, type and spacing for Swift.",
   "Components — SwiftUI or UIKit views.",
   "Platform conventions — Apple Human Interface Guidelines."
  ],
  "behavior": [
   "Map Plenix type to Dynamic Type sizes.",
   "Use native controls where they exist and style them with tokens.",
   "Support light, dark and increased contrast modes."
  ],
  "accessibility": [
   "Support VoiceOver labels, traits and hints.",
   "Support Dynamic Type and Reduce Motion.",
   "Use touch targets of at least 44 by 44 points."
  ],
  "content": [
   "Use iOS terms in iOS apps, such as \"Settings\" and \"Share\".",
   "Plenix product names and token names stay identical across platforms."
  ],
  "map": [
   [
    "Fluent 2",
    "Fluent iOS",
    "Direct"
   ],
   [
    "Material 3",
    "Material for iOS (Flutter)",
    "Partial"
   ],
   [
    "Polaris",
    "Shopify POS / mobile",
    "Partial"
   ]
  ],
  "commonGround": "Fluent ships native iOS components; systems agree to share tokens but defer to Apple conventions for navigation and controls.",
  "sources": [
   "https://fluent2.microsoft.design/get-started/develop",
   "https://github.com/microsoft/fluentui-apple",
   "https://developer.apple.com/design/human-interface-guidelines/"
  ]
 },
 "android-implementation|How to build": {
  "text": "Native Plenix implementation for Android phone and tablet apps.",
  "purpose": "Brings Plenix tokens and patterns to Android while respecting Material conventions.",
  "use": [
   "Native Android apps that share the Plenix brand.",
   "Tokens exported for Jetpack Compose or Android XML."
  ],
  "avoid": [
   "Copying web layouts directly: follow Android navigation and back behavior.",
   "Breaking the system back gesture."
  ],
  "anatomy": [
   "Token export — colors, type and spacing for Compose.",
   "Components — Compose or View components.",
   "Platform conventions — Material 3 guidance."
  ],
  "behavior": [
   "Plenix type maps to scalable sp units.",
   "Supports system font scaling, dark theme and edge-to-edge layout.",
   "Window size classes for tablets and foldables."
  ],
  "accessibility": [
   "TalkBack support with content descriptions and roles.",
   "Touch targets at least 48 by 48 dp.",
   "Respects animation scale settings."
  ],
  "content": [
   "Android terms in Android apps.",
   "Plenix product names and token names stay identical across platforms."
  ],
  "map": [
   [
    "Material 3",
    "Jetpack Compose / Android",
    "Direct"
   ],
   [
    "Fluent 2",
    "Fluent Android",
    "Direct"
   ]
  ],
  "commonGround": "Material and Fluent both ship native Android libraries with token-driven theming and 48dp targets.",
  "sources": [
   "https://m3.material.io/develop/android/jetpack-compose",
   "https://github.com/microsoft/fluentui-android",
   "https://fluent2.microsoft.design/get-started/develop"
  ]
 },
 "implementation|Desktop": {
  "text": "Delivering Plenix interfaces on large screens with mouse and keyboard, in browsers or desktop shells.",
  "purpose": "Defines density, keyboard and window behavior for power users of enterprise apps.",
  "use": [
   "The primary target for Plenix enterprise tools.",
   "Data-heavy workspaces: use Compact density."
  ],
  "avoid": [
   "Do not stretch content to full width on very wide screens without a layout plan.",
   "Do not assume touch is absent; touch laptops exist."
  ],
  "anatomy": [
   "Density — Compact, Standard and Comfortable.",
   "Panes — navigation, content and detail regions.",
   "Keyboard model — shortcuts and focus management.",
   "Window — resizable, multi-window and zoom."
  ],
  "behavior": [
   "Support pane resizing and collapsing.",
   "Offer keyboard shortcuts and context menus for frequent actions.",
   "Adapt layout when the window is resized or zoomed."
  ],
  "accessibility": [
   "Keep everything usable at 200% zoom and reflow at 400%.",
   "Keep targets at least 24 by 24 CSS pixels even in Compact density."
  ],
  "content": [
   "Use full labels; desktop space allows fewer abbreviations.",
   "Show keyboard shortcuts in menus and tooltips."
  ],
  "map": [
   [
    "Spectrum",
    "Platform scale (desktop)",
    "Direct"
   ],
   [
    "Fluent 2",
    "Windows / web",
    "Direct"
   ],
   [
    "Material 3",
    "Expanded and large window classes",
    "Partial"
   ],
   [
    "Carbon",
    "Grid and density",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum and Fluent define a desktop scale with smaller controls than touch; Material defines expanded window classes.",
  "sources": [
   "https://spectrum.adobe.com/page/platform-scale/",
   "https://fluent2.microsoft.design/get-started/develop",
   "https://m3.material.io/foundations/layout/applying-layout/window-size-classes"
  ]
 },
 "implementation|Vue": {
  "text": "A Vue implementation of Plenix components.",
  "purpose": "Lets Vue teams use Plenix without rewriting components.",
  "use": [
   "A product team builds in Vue and needs Plenix components.",
   "Wrapping Plenix web components or shared CSS, preferred over a separate fork."
  ],
  "avoid": [
   "Do not maintain a Vue fork that drifts from the reference implementation.",
   "Do not start a Vue library without an owner and a support commitment."
  ],
  "anatomy": [
   "Shared tokens — the same token CSS.",
   "Component layer — Vue SFCs or wrappers.",
   "Parity tests — the same behavior tests as React."
  ],
  "behavior": [
   "Match the reference component API, names and states.",
   "Version with the core system and mark community-supported status clearly."
  ],
  "accessibility": [
   "Match the reference ARIA and keyboard behavior exactly.",
   "Run the shared accessibility test suite against the Vue build."
  ],
  "content": [
   "Use the same prop and event names as the reference, adapted to Vue casing.",
   "Document differences from the reference in one compatibility table."
  ],
  "map": [
   [
    "Carbon",
    "Carbon Vue (community)",
    "Partial"
   ]
  ],
  "commonGround": "Carbon offers Vue through a community library; most systems serve Vue through web components rather than an official Vue library.",
  "sources": [
   "https://carbondesignsystem.com/developing/frameworks/other-frameworks/",
   "https://github.com/carbon-design-system/carbon-components-vue"
  ]
 },
 "implementation|Angular": {
  "text": "An Angular implementation of Plenix components.",
  "purpose": "Lets Angular teams use Plenix with idiomatic modules and bindings.",
  "use": [
   "A product team builds in Angular.",
   "Prefer wrapping Plenix web components where possible."
  ],
  "avoid": [
   "Do not reimplement behavior differently from the reference.",
   "Do not tie releases to one Angular major version without a support window."
  ],
  "anatomy": [
   "Shared tokens — the same token CSS.",
   "Component layer — Angular components or directives.",
   "Parity tests — shared behavior and accessibility tests."
  ],
  "behavior": [
   "Expose inputs and outputs that mirror the reference props and events.",
   "Release alongside core versions with a compatibility table."
  ],
  "accessibility": [
   "Match reference ARIA, focus and keyboard behavior.",
   "Run the shared accessibility test suite against the Angular build."
  ],
  "content": [
   "Keep names consistent with the reference implementation.",
   "Document differences from the reference in one compatibility table."
  ],
  "map": [
   [
    "Carbon",
    "Carbon Angular",
    "Direct"
   ],
   [
    "Material 3",
    "Angular Material",
    "Partial"
   ]
  ],
  "commonGround": "Carbon and Material both maintain Angular libraries; Angular Material still follows Material 3 tokens.",
  "sources": [
   "https://carbondesignsystem.com/developing/frameworks/angular/",
   "https://material.angular.io/"
  ]
 },
 "implementation|Web components": {
  "text": "Framework-neutral custom elements implementing Plenix components.",
  "purpose": "Let any framework or plain HTML page use Plenix components.",
  "use": [
   "Frameworks without a dedicated library.",
   "Embedding Plenix UI in third-party or legacy pages."
  ],
  "avoid": [
   "Do not use shadow DOM in ways that block token theming or form participation.",
   "Server rendering of interactive content is required and there is no fallback: do not use web components."
  ],
  "anatomy": [
   "Custom element — tag with attributes, properties and events.",
   "Shadow DOM — encapsulated markup and styles.",
   "CSS custom properties and parts — theming hooks.",
   "Form association — ElementInternals for form fields."
  ],
  "behavior": [
   "Theme through CSS custom properties that pierce shadow DOM.",
   "Emit standard DOM events with documented names.",
   "Use form-associated custom elements for inputs."
  ],
  "accessibility": [
   "Keep ARIA relationships within the same shadow root or use element reflection.",
   "Delegate focus to the inner control."
  ],
  "content": [
   "Prefix tag names with the system namespace, such as plx-button.",
   "Document attributes, properties, events, slots and CSS parts for each element."
  ],
  "map": [
   [
    "Carbon",
    "Carbon Web Components",
    "Direct"
   ],
   [
    "Spectrum",
    "Spectrum Web Components",
    "Direct"
   ],
   [
    "Fluent 2",
    "Fluent UI Web Components",
    "Direct"
   ],
   [
    "Material 3",
    "Material Web",
    "Direct"
   ],
   [
    "Polaris",
    "Polaris web components",
    "Direct"
   ]
  ],
  "commonGround": "Carbon, Spectrum, Fluent, Material and Polaris all ship web components themed with CSS custom properties.",
  "sources": [
   "https://carbondesignsystem.com/developing/frameworks/web-components/",
   "https://opensource.adobe.com/spectrum-web-components/",
   "https://material-web.dev/",
   "https://shopify.dev/docs/api/app-home/polaris-web-components"
  ]
 },
 "implementation|HTML / CSS": {
  "text": "A plain HTML and CSS layer of Plenix tokens and component styles with no JavaScript framework.",
  "purpose": "Lets static pages and server-rendered apps use Plenix styles directly.",
  "use": [
   "Server-rendered pages, prototypes and documentation.",
   "The styling base that framework libraries build on."
  ],
  "avoid": [
   "Components that need complex behavior: use a framework or web component.",
   "Do not add inline styles; use classes and tokens."
  ],
  "anatomy": [
   "Token CSS — custom properties.",
   "Component classes — namespaced class names.",
   "Markup contract — required HTML structure and ARIA."
  ],
  "behavior": [
   "Document the exact markup each class expects.",
   "Keep class names stable and versioned."
  ],
  "accessibility": [
   "Include the required ARIA attributes in the markup contract.",
   "Note which behaviors need script to be accessible."
  ],
  "content": [
   "Use the plx- prefix for every class.",
   "Document each class with its required markup and states."
  ],
  "map": [
   [
    "Spectrum",
    "Spectrum CSS",
    "Direct"
   ],
   [
    "Carbon",
    "Carbon styles (Sass)",
    "Partial"
   ],
   [
    "Material 3",
    "Material Web tokens",
    "Partial"
   ]
  ],
  "commonGround": "Spectrum ships a standalone CSS layer; Carbon ships Sass styles; both separate styling from behavior.",
  "sources": [
   "https://opensource.adobe.com/spectrum-css/",
   "https://carbondesignsystem.com/developing/frameworks/react/",
   "https://design-system.service.gov.uk/get-started/"
  ]
 },
 "implementation|Native implementation": {
  "text": "Plenix implementations in native UI toolkits, not the web.",
  "purpose": "Extends the system to iOS, Android and desktop native apps with shared tokens.",
  "use": [
   "A product needs native performance or platform integration.",
   "Exported tokens as the single source of style values."
  ],
  "avoid": [
   "Do not hard-code values; generate them from the token JSON.",
   "Do not force web patterns onto native platforms."
  ],
  "anatomy": [
   "Token pipeline — JSON to Swift, Kotlin and XAML outputs.",
   "Native components — platform toolkit views.",
   "Parity matrix — which components exist on which platform."
  ],
  "behavior": [
   "Generate platform token files in the token build.",
   "Publish a component parity table per platform.",
   "Defer to platform conventions for navigation and system controls."
  ],
  "accessibility": [
   "Use each platform's accessibility APIs and screen readers.",
   "Respect system text size, contrast and motion settings."
  ],
  "content": [
   "Follow platform terminology.",
   "Keep component names identical to the web where the concept is the same."
  ],
  "map": [
   [
    "Fluent 2",
    "iOS, Android and Windows libraries",
    "Direct"
   ],
   [
    "Material 3",
    "Compose and Flutter",
    "Direct"
   ]
  ],
  "commonGround": "Fluent and Material ship native libraries from shared tokens and defer to platform conventions.",
  "sources": [
   "https://fluent2.microsoft.design/get-started/develop",
   "https://m3.material.io/develop",
   "https://www.designtokens.org/"
  ]
 },
 "implementation|Performance": {
  "text": "Engineering rules that keep Plenix components fast to load and responsive to input.",
  "purpose": "Keeps components from becoming the bottleneck in enterprise tools that handle large data.",
  "use": [
   "Every component, especially lists, tables, overlays and icons.",
   "Core Web Vitals as product-level targets."
  ],
  "avoid": [
   "Whole libraries imported for one component: support tree-shaking.",
   "Do not run layout-heavy work on every scroll or resize event."
  ],
  "anatomy": [
   "Bundle size — per-component budgets.",
   "Rendering — avoid unnecessary re-renders.",
   "Runtime styles — static CSS over runtime CSS-in-JS.",
   "Metrics — LCP, INP and CLS."
  ],
  "behavior": [
   "Ship tree-shakable, side-effect-free modules.",
   "Lazy-load heavy components and overlays.",
   "Virtualize large collections.",
   "Reserve space for async content to prevent layout shift."
  ],
  "accessibility": [
   "Keep input response fast so assistive technology does not lag.",
   "Respect prefers-reduced-motion, which also lowers rendering cost."
  ],
  "content": [
   "Document size and performance notes on each component page.",
   "State budgets as numbers, such as kilobytes per component."
  ],
  "map": [
   [
    "Fluent 2",
    "Performance (atomic CSS)",
    "Partial"
   ],
   [
    "Atlassian",
    "Performance",
    "Partial"
   ],
   [
    "Carbon",
    "Developing guidance",
    "Partial"
   ]
  ],
  "commonGround": "Systems agree on tree-shaking, lazy loading and virtualization; Fluent v9 adopted build-time atomic CSS for speed.",
  "sources": [
   "https://web.dev/articles/vitals",
   "https://react.fluentui.dev/?path=/docs/concepts-developer-styling-components--docs",
   "https://atlassian.design/get-started/develop"
  ]
 },
 "implementation|Virtualization": {
  "text": "When and how Plenix collections must virtualize.",
  "purpose": "Sets thresholds and requirements so large data views stay fast and accessible.",
  "use": [
   "Lists, grids and tables that can exceed a few hundred items.",
   "The shared Virtualization utility, not one-off code."
  ],
  "avoid": [
   "Do not virtualize small collections.",
   "Print or full-page find is a core need and there is no fallback."
  ],
  "anatomy": [
   "Threshold — item count that triggers virtualization.",
   "Row height — fixed per density token.",
   "Overscan — extra rows rendered.",
   "Accessibility contract — counts and indexes."
  ],
  "behavior": [
   "Pair virtualization with server pagination for very large sets.",
   "Test scroll performance on low-end hardware.",
   "Keep selection and focus stable across rendering windows."
  ],
  "accessibility": [
   "Expose aria-rowcount and aria-rowindex, or aria-setsize and aria-posinset.",
   "Test with screen readers in both browse and focus modes."
  ],
  "content": [
   "Show total and loaded counts to users.",
   "State the threshold as a number on each collection component page."
  ],
  "map": [
   [
    "Spectrum",
    "Virtualizer",
    "Direct"
   ],
   [
    "Fluent 2",
    "Virtualizer",
    "Direct"
   ]
  ],
  "commonGround": "Spectrum and Fluent document virtualizers with accessible counts and stable focus.",
  "sources": [
   "https://react-spectrum.adobe.com/react-aria/Virtualizer.html",
   "https://react.fluentui.dev/?path=/docs/components-virtualizer-virtualizer--docs",
   "https://web.dev/articles/virtualize-long-lists-react-window"
  ]
 },
 "implementation|Analytics instrumentation": {
  "text": "Built-in hooks that let products track how components are used.",
  "purpose": "Usage data shows which components and patterns work, and guides system decisions.",
  "use": [
   "Measuring component adoption, version spread and key interactions.",
   "One consistent event schema across components."
  ],
  "avoid": [
   "Do not collect personal data or field values.",
   "Do not let analytics code block rendering or input."
  ],
  "anatomy": [
   "Event — a named interaction with context.",
   "Context — component, version and location.",
   "Listener — product-supplied handler.",
   "Adoption telemetry — build-time usage scans."
  ],
  "behavior": [
   "Emit events through a context listener so products choose the destination.",
   "Measure adoption with static code scans in addition to runtime events.",
   "Document every event and its properties."
  ],
  "accessibility": [
   "Track assistive-technology issues through feedback, not by detecting assistive technology.",
   "Do not alter accessible names or roles to add tracking attributes."
  ],
  "content": [
   "Name events as object plus past-tense verb, such as \"button clicked\".",
   "Keep event names stable across versions and document renames."
  ],
  "map": [
   [
    "Atlassian",
    "Analytics next",
    "Direct"
   ],
   [
    "Carbon",
    "IBM telemetry",
    "Partial"
   ]
  ],
  "commonGround": "Atlassian builds analytics events into components; Carbon measures adoption with opt-out telemetry; both avoid personal data.",
  "sources": [
   "https://atlassian.design/components/analytics-next",
   "https://github.com/ibm-telemetry/telemetry-js"
  ]
 },
 "implementation|Lint tooling": {
  "text": "Lint rules that enforce correct use of Plenix tokens, components and accessibility.",
  "purpose": "Catches hard-coded values and misuse automatically, before review.",
  "use": [
   "Every product using Plenix: run in editors, pre-commit and CI.",
   "Blocking hard-coded colors, spacing, inline styles and deprecated components."
  ],
  "avoid": [
   "Do not rely on reviewers to catch token misuse by eye.",
   "Do not ship rules without auto-fixes or clear messages."
  ],
  "anatomy": [
   "Stylelint rules — tokens only for CSS values.",
   "ESLint rules — component usage and accessibility.",
   "Codemods — automated migrations.",
   "Rule docs — what, why and how to fix."
  ],
  "behavior": [
   "Fail CI on errors and warn on deprecations.",
   "Ship auto-fixes and codemods with breaking changes.",
   "Version rules with the system."
  ],
  "accessibility": [
   "Include jsx-a11y or equivalent rules in the default config.",
   "Flag missing accessible names on icon-only buttons."
  ],
  "content": [
   "Write rule messages that name the fix, such as \"Use --plx-space-200 instead of 16px\".",
   "Link each rule message to its documentation page."
  ],
  "map": [
   [
    "Atlassian",
    "ESLint and Stylelint plugins",
    "Direct"
   ],
   [
    "Polaris",
    "Stylelint Polaris",
    "Direct"
   ],
   [
    "Carbon",
    "Stylelint plugin Carbon tokens",
    "Direct"
   ]
  ],
  "commonGround": "Atlassian, Polaris and Carbon ship lint plugins that enforce tokens and flag deprecated APIs, with codemods for migration.",
  "sources": [
   "https://atlassian.design/components/eslint-plugin-design-system",
   "https://polaris-react.shopify.com/tools/stylelint-polaris",
   "https://github.com/carbon-design-system/stylelint-plugin-carbon-tokens"
  ]
 },
 "implementation|Design-system MCP tooling": {
  "text": "A Model Context Protocol server that exposes Plenix tokens, components and rules to AI coding tools.",
  "purpose": "Lets AI assistants generate code with real Plenix components and tokens instead of guesses.",
  "use": [
   "Giving AI assistants the component inventory, props, tokens and usage rules.",
   "Serve the same source data as the documentation site."
  ],
  "avoid": [
   "Do not expose unreleased or private data without access control.",
   "Do not let the server drift from the published system version."
  ],
  "anatomy": [
   "Tools — search components, get props, get tokens, check code.",
   "Resources — docs, examples and rules.",
   "Version — matches the released system."
  ],
  "behavior": [
   "Generate server data from the token JSON and component inventory at build time.",
   "Return guidance with examples and do-not rules.",
   "Log queries to find documentation gaps."
  ],
  "accessibility": [
   "Include accessibility requirements in component responses so generated code keeps them.",
   "Flag known accessibility misuse when checking generated code."
  ],
  "content": [
   "Return concise, structured answers with links to the full docs.",
   "Use the same names and wording as the published spec."
  ],
  "map": [
   [
    "Atlassian",
    "ADS MCP server",
    "Partial"
   ],
   [
    "Polaris",
    "Shopify Dev MCP",
    "Partial"
   ]
  ],
  "commonGround": "Emerging practice: Atlassian and Shopify expose design-system docs to AI tools through MCP; there is no settled cross-system guidance.",
  "sources": [
   "https://modelcontextprotocol.io/",
   "https://shopify.dev/docs/apps/build/devmcp"
  ]
 },
 "implementation|Browser support policy": {
  "text": "The published list of browsers and versions Plenix supports and tests.",
  "purpose": "Sets clear expectations for which features components may use and what products must test.",
  "use": [
   "Publish the policy with each major release.",
   "Deciding which CSS and JavaScript features need fallbacks."
  ],
  "avoid": [
   "Do not support browsers that no longer receive security updates.",
   "Do not adopt new features without checking the policy."
  ],
  "anatomy": [
   "Supported browsers — evergreen Chrome, Edge, Firefox and Safari, latest two versions.",
   "Tested assistive technology pairs.",
   "Feature baseline — allowed platform features.",
   "Fallback rules — progressive enhancement."
  ],
  "behavior": [
   "Define support by version range, such as the last two major versions.",
   "Run automated tests in each supported engine.",
   "Announce changes ahead of a major release."
  ],
  "accessibility": [
   "List the supported browser and screen reader pairs, such as NVDA with Chrome and VoiceOver with Safari.",
   "Test forced-colors mode in Edge or Chrome on Windows."
  ],
  "content": [
   "Write the policy as a short table of browser, version and platform.",
   "Date the policy and link to its change history."
  ],
  "map": [
   [
    "Carbon",
    "Browser support",
    "Direct"
   ],
   [
    "Atlassian",
    "Supported browsers",
    "Direct"
   ],
   [
    "Polaris",
    "Browser support",
    "Partial"
   ],
   [
    "Spectrum",
    "Supported browsers (React Spectrum)",
    "Partial"
   ]
  ],
  "commonGround": "Systems support the latest evergreen browsers, usually the last two versions, and drop browsers out of vendor support.",
  "sources": [
   "https://web.dev/baseline",
   "https://react-spectrum.adobe.com/react-spectrum/getting-started.html",
   "https://support.atlassian.com/atlassian-cloud/docs/supported-browsers-for-atlassian-cloud/"
  ]
 },
 "implementation|Figma libraries": {
  "text": "The published Figma component and style libraries that mirror Plenix code.",
  "purpose": "Let designers build with the same components, tokens and names that engineers ship.",
  "use": [
   "All product design work in Figma.",
   "Figma variables that map one to one to Plenix tokens."
  ],
  "avoid": [
   "Do not detach components except for exploration.",
   "Do not publish components to the library before they exist in code without a clear status."
  ],
  "anatomy": [
   "Foundations library — color, type, spacing and effects as variables and styles.",
   "Component library — components with variants and properties.",
   "Icon library — the Plenix icon set.",
   "Status labels — stable, beta or deprecated."
  ],
  "behavior": [
   "Match component names, variants and properties to the code API.",
   "Version and publish the library with release notes in step with code releases.",
   "Link each Figma component to its spec page."
  ],
  "accessibility": [
   "Include focus, error and disabled states in every component.",
   "Annotate headings, landmarks and focus order in handoff files."
  ],
  "content": [
   "Use sentence case and the same names as the code and spec.",
   "Write component descriptions in Figma that match the spec summary."
  ],
  "map": [
   [
    "Carbon",
    "Figma kits",
    "Direct"
   ],
   [
    "Atlassian",
    "Figma library",
    "Direct"
   ],
   [
    "Material 3",
    "Material 3 Design Kit",
    "Direct"
   ],
   [
    "Fluent 2",
    "Fluent 2 UI kits",
    "Direct"
   ],
   [
    "Polaris",
    "Polaris Figma UI kit",
    "Direct"
   ],
   [
    "Spectrum",
    "Spectrum design resources",
    "Direct"
   ]
  ],
  "commonGround": "All systems publish Figma libraries that mirror code names and use variables tied to tokens.",
  "sources": [
   "https://carbondesignsystem.com/designing/kits/figma/",
   "https://atlassian.design/get-started/design",
   "https://fluent2.microsoft.design/get-started/design",
   "https://m3.material.io/foundations/design-tokens/overview"
  ]
 }
};
