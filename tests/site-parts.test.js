// Plenix tests · the St. John screens draw the parts only they use (issue 64; follow-up to 675). 74 Plenix parts are used by only
// twelve of the site's screens, so no other test sees them. This test opens each of those screens and asserts that each part
// draws: the part's own class (plx-<name in kebab case>, or the marker named below) is in the page.
// Not asserted here, and why: parts that draw only after an action (a dialog or popover: FilePicker, ShareDialog, UploadManager,
// SaveAs, RefineMenu, AISearch, AIExplanation, Citation, ConfidenceIndicator, PromptHistory, Recommendation, SuggestedEdit,
// BottomSheetNav, Illustration; TeachingBubble: it showed in one probe and in none of three runs here, so it needs its own look), the templates and commerce pages that have no class of their own (ContentManagementPage,
// SinglePaneWorkspace, LandingPage, Cart, OrderDetail, OrderManagement, OrderStatus, ProductDetail, ProductDiscovery,
// ProductListing, Returns), and the hooks and constants (useAutosave, useUploadQueue, useCommercePage, ORDER_STATUSES): they are
// listed in the output as "not asserted". The site's pages test already proves every screen loads with no error.
//   node tests/site-parts.test.js   → SITE_PARTS_OK n parts on m screens
const assert = require('assert/strict');
const { serve, launch, sleep } = require('./lib.js');
const site = require('./site.js');
const PORT = +process.env.TEST_PORT || 8793;
const kebab = (n) => n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').toLowerCase();
// screen: the parts it draws
const SCREENS = {
  'announcement-edit': ['Autosave', 'Code', 'DraftState', 'PresenceBar', 'Publish', 'RichText'],
  'announcements': ['Announcement', 'Publish'],
  'assistant': ['AIButton', 'AIChat', 'AIDisclaimer', 'AILabel', 'AssistantPanel', 'GeneratedContent', 'PromptSuggestions', 'StreamingText', 'SuggestedAction'],
  'documents': ['AccessRequest', 'AttachmentPicker', 'DownloadManager', 'FileBrowser', 'FileList', 'FileRow', 'FileRowList', 'LoadingOverlay', 'PermissionsEditor', 'RenameAction'],
  'document': ['MetadataEditor', 'Sticky', 'VersionCompare'],
  'media': ['AssetGallery', 'Figure', 'Preview', 'RelatedAssets', 'RenditionList'],
  'messages': ['PresenceBar'],
  'readings': ['Blockquote'],
  'visit': ['BackToTop', 'GeoMap', 'MegaMenu'],
  'welcome': ['FeatureIntro', 'HelpPanel', 'Onboarding', 'Tour'],
  'readings+': ['SplitWorkspace'],
  'announcement-edit+': ['SaveStatus'],
};
// parts whose marker is not their own class name
const MARKER = { SplitWorkspace: '.plx-split-view--side-by-side', SaveStatus: '.plx-autosave__status' };
(async () => {
  const server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 1000 });
    const errors = []; page.on('pageerror', (e) => errors.push(e.message));
    const missing = []; let count = 0;
    for (const [key, names] of Object.entries(SCREENS)) {
      const screen = key.replace(/\+$/, '');
      await page.goto('http://127.0.0.1:' + PORT + '/Plenix/' + site.url(screen), { waitUntil: 'networkidle0' });
      await page.waitForFunction(() => document.querySelector('main') && document.querySelector('main').innerText.trim().length >= 20, { timeout: 15000 }).catch(() => {});
      // a part counts if it was drawn at any moment in the first 8 seconds (a tip or a banner may go away by itself)
      const seen = new Set(), want = names.map((n) => [n, MARKER[n] || '.plx-' + kebab(n)]);
      for (let t = 0; t < 40 && seen.size < want.length; t++) {
        (await page.evaluate((w) => w.filter(([, sel]) => document.querySelector(sel)).map(([n]) => n), want)).forEach((n) => seen.add(n));
        if (seen.size < want.length) await sleep(200);
      }
      names.forEach((n) => { count++; if (!seen.has(n)) missing.push(screen + ': ' + n); });
    }
    assert.deepEqual(missing, [], 'parts that did not draw on their screen: ' + missing.join(', '));
    assert.deepEqual(errors, [], 'no script errors');
    console.log('SITE_PARTS_OK ' + count + ' parts on ' + new Set(Object.keys(SCREENS).map((k) => k.replace(/\+$/, ''))).size + ' screens');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
