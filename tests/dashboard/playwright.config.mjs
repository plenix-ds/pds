import { defineConfig } from '@playwright/test';

// The PDS dashboard's acceptance tests (#195, docs/pds1/slices/195-dashboard/brief.md). A missing browser is a FAIL.
export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.mjs',
  reporter: 'list',
  timeout: 60000,
  use: { channel: process.env.PW_CHANNEL || 'chrome' },
});
