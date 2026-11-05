import { defineConfig } from '@playwright/test';

// Check 12 (plan §7): visual regression. A missing browser is a FAIL, never a skip.
// Baselines are screenshots of the runner's Chrome (ubuntu CI); update them only after a change meant to look different:
//   npx playwright test -c tests/visual/playwright.config.mjs --update-snapshots
export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.mjs',
  reporter: [['list'], ['json', { outputFile: process.env.VISUAL_REPORT || 'test-results/visual.json' }]],
  snapshotPathTemplate: '{testDir}/baselines/{arg}{ext}',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: 'disabled' } },
  use: { channel: process.env.PW_CHANNEL || 'chrome', viewport: { width: 960, height: 640 } },
});
