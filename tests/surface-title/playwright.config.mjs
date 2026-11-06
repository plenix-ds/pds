import { defineConfig } from '@playwright/test';

// A missing browser is a FAIL, never a skip (plan §7 check 12 rule, applied here too).
export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.mjs',
  reporter: 'list',
  use: { channel: process.env.PW_CHANNEL || 'chrome' },
});
