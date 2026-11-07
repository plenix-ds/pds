import { defineConfig } from '@playwright/test';

// Check 12 (plan §7): visual regression. A missing browser is a FAIL, never a skip.
// Screen sizes (D-0092, #857): design at 1440×900; every specimen is checked at 1366×768 (laptop) and 1920×1080
// (desktop) in light and dark, plus RTL and compact for changed components; one light run at the 1024×640 minimum
// (AppShell minSize). Each size keeps its baselines in baselines/<project>/.
// Baselines are screenshots of the runner's Chrome (ubuntu CI). A missing baseline is written by the run (which still
// fails) and uploaded in the visual-regression artifact; commit it from there. After a change meant to look different:
//   npx playwright test -c tests/visual/playwright.config.mjs --update-snapshots
export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.mjs',
  reporter: [['list'], ['json', { outputFile: process.env.VISUAL_REPORT || 'test-results/visual.json' }]],
  snapshotPathTemplate: '{testDir}/baselines/{projectName}/{arg}{ext}',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: 'disabled' } },
  use: { channel: process.env.PW_CHANNEL || 'chrome' },
  projects: [
    { name: 'laptop-1366x768', use: { viewport: { width: 1366, height: 768 } } },
    { name: 'desktop-1920x1080', use: { viewport: { width: 1920, height: 1080 } } },
    // the minimum: light, left to right, standard density only (test ids "<specimen>-light")
    { name: 'minimum-1024x640', use: { viewport: { width: 1024, height: 640 } }, grep: /-light$/ },
  ],
});
