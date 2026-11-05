import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Acceptance tests for the PDS dashboard, issue #195 (brief AC-1 to AC-6, docs/pds1/slices/195-dashboard/brief.md).
// The real index.html and app.js run with a fixture data.js; Plenix comes from the CDN as on the live page. GitHub's API
// is intercepted: nothing is posted anywhere, and any write other than the one answer comment fails the test.
const root = path.resolve(import.meta.dirname, '../..');
const DIR = path.join(root, 'dashboard', 'pds1');

const fixture = {
  generatedAt: '2026-11-05T12:00+00:00', mainSha: 'abc1234',
  sites: { cdn: { url: 'https://example.invalid/cdn/latest.json', code: 200 }, docs: { url: 'https://example.invalid/', code: 200 }, pages: { url: 'https://example.invalid/pds/', code: 200 } },
  tasks: [],
  ownerDecisions: [{
    id: 'D-9001', title: 'Pick the fixture colour', context: 'A fixture decision for the tests.', issue: 9001,
    url: 'https://github.com/plenix-ds/pds/issues/9001', applied: 'A', replied: '', at: '2026-11-05T10:00:00Z', answer: null,
    options: [{ key: 'A', recommended: true, text: 'blue — risk: none' }, { key: 'B', recommended: false, text: 'green — risk: a new token' }],
  }],
  openPrs: [],
  mergedPrs: [{ number: 9100, title: 'Fixture merged pull request', url: 'https://github.com/plenix-ds/pds/pull/9100', mergedAt: '2026-11-05T09:00:00Z' }],
  closedIssues: [{ number: 9200, title: 'Fixture closed issue', url: 'https://github.com/plenix-ds/pds/issues/9200', closedAt: '2026-10-20T09:00:00Z',
    prs: [{ number: 9201, url: 'https://github.com/plenix-ds/pds/pull/9201' }] }],
  decisions: [
    { id: 'D-9101', date: '2026-11-04', area: 'design', decision: 'Fixture decision with a check', by: 'owner', status: 'active', superseded_by: '', check: 'planned:lint-radius', kind: 'planned', state: 'planned', url: null },
    { id: 'D-9102', date: '2026-11-04', area: 'process', decision: 'Fixture decision review only', by: 'owner', status: 'active', superseded_by: '', check: 'review-only (setup)', kind: 'review only', state: 'review', url: null },
  ],
  workflows: [], shots: [],
};

let site;
test.beforeAll(() => {
  site = fs.mkdtempSync(path.join(os.tmpdir(), 'pds-dashboard-'));
  for (const f of ['index.html', 'app.js']) fs.copyFileSync(path.join(DIR, f), path.join(site, f));
  fs.writeFileSync(path.join(site, 'data.js'), 'window.PDS_DATA = ' + JSON.stringify(fixture) + ';\n');
});
test.afterAll(() => fs.rmSync(site, { recursive: true, force: true }));

async function open(page, hash, { key } = {}) {
  const writes = [];
  await page.route('https://api.github.com/**', async (route) => {
    const req = route.request();
    if (req.method() !== 'GET') writes.push({ method: req.method(), url: req.url(), body: req.postData() });
    if (req.url().endsWith('/user')) return route.fulfill({ json: { login: 'owner-fixture' } });
    if (req.method() === 'POST' && /\/issues\/9001\/comments$/.test(req.url())) return route.fulfill({ status: 201, json: { html_url: 'https://github.com/plenix-ds/pds/issues/9001#issuecomment-1' } });
    return route.fulfill({ json: {} });
  });
  if (key) await page.addInitScript((k) => localStorage.setItem('pds1-dashboard-github-key', k), key);
  await page.goto(pathToFileURL(path.join(site, 'index.html')).href + '#' + hash);
  await expect(page.getByText('PDS 1.0 Dashboard').first()).toBeVisible({ timeout: 30000 });
  return writes;
}

test('AC-1: an applied decision shows in To decide with its id, question and "Applied for now", and is counted', async ({ page }) => {
  await open(page, 'owner');
  const nav = page.getByRole('navigation').first();
  await expect(nav).toContainText('To decide');
  await expect(nav).toContainText('1');
  await page.getByText('Pick the fixture colour').first().click();
  await expect(page.getByText('D-9001').first()).toBeVisible();
  await expect(page.getByText('Applied for now').first()).toBeVisible();
});

test('AC-2: the owner picks B with a note; one comment is posted on that issue, and nothing else is written', async ({ page }) => {
  const writes = await open(page, 'owner', { key: 'fixture-key' });
  await page.getByText('Pick the fixture colour').first().click();
  await page.getByRole('radio', { name: /^B\b/ }).check();
  await page.getByRole('textbox').last().fill('fixture note');
  await page.getByRole('button', { name: 'Send answer to #9001' }).click();
  await expect(page.getByText('Answer posted on #9001')).toBeVisible();
  expect(writes).toHaveLength(1);
  expect(writes[0].method).toBe('POST');
  expect(writes[0].url).toMatch(/\/repos\/plenix-ds\/pds\/issues\/9001\/comments$/);
  const body = JSON.parse(writes[0].body).body;
  expect(body).toContain('**Answer to D-9001: B**');
  expect(body).toContain('fixture note');
});

test('AC-3: without a key everything reads, and "Connect GitHub once to answer here" gives the exact key settings', async ({ page }) => {
  const writes = await open(page, 'owner');
  await page.getByText('Pick the fixture colour').first().click();
  await expect(page.getByText('A fixture decision for the tests.')).toBeVisible();
  const banner = page.getByText('Connect GitHub once to answer here');
  await expect(banner).toBeVisible();
  await expect(page.locator('body')).toContainText('"Only select repositories" → pds');
  await expect(page.locator('body')).toContainText('Issues to "Read and write". Nothing else.');
  await expect(page.getByRole('button', { name: /Send answer/ })).toHaveCount(0);
  expect(writes).toHaveLength(0);
});

test('AC-4: every decisions.yaml entry shows, with its check or its review-only reason', async ({ page }) => {
  await open(page, 'decisions');
  await expect(page.getByText('Fixture decision with a check').first()).toBeVisible();
  await expect(page.getByText('Fixture decision review only').first()).toBeVisible();
  await page.getByText('Fixture decision with a check').first().click();
  await expect(page.locator('body')).toContainText('planned:lint-radius');
  await page.getByText('Fixture decision review only').first().click();
  await expect(page.locator('body')).toContainText('No check yet');
  await expect(page.locator('body')).toContainText('review-only (setup)');
});

test('AC-5: an issue closed in the last 30 days shows in Done with the pull request that closed it', async ({ page }) => {
  await open(page, 'done');
  await page.getByText('Fixture closed issue').first().click();
  await expect(page.locator('body')).toContainText('Closed by');
  await expect(page.getByRole('link', { name: 'Pull request #9201' })).toHaveAttribute('href', 'https://github.com/plenix-ds/pds/pull/9201');
});

test('AC-6: the dashboard has no colours, inline styles or !important of its own', () => {
  const js = fs.readFileSync(path.join(DIR, 'app.js'), 'utf8');
  const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  for (const [name, text] of [['app.js', js], ['index.html', html]]) {
    expect(text, name + ': a style attribute or prop').not.toMatch(/\bstyle\s*[=:]\s*[{"']/);
    expect(text, name + ': a raw hex colour').not.toMatch(/['"]#[0-9a-fA-F]{3,8}['"]/);
    expect(text, name + ': !important').not.toContain('!important');
  }
  expect(html, 'index.html: a <style> block').not.toMatch(/<style[\s>]/i);
});
