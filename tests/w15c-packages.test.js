// W15C node regressions: actual generated packages, JSON-RPC/stdio, API fallbacks, budgets and date-only values.
const fs = require('fs'), path = require('path'), assert = require('assert'), { execFileSync, spawn } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
// without the design system nothing here can be checked: a visible skip, never an OK (issue 762). On GitHub it is also a
// warning on the run's summary, so a green run never hides an unchecked one
if (!fs.existsSync(path.join(ROOT, 'platform/design-system/inventory.js'))) {
  const why = 'skipped: design system not available (platform/design-system is not checked out); nothing was checked';
  console.log('W15C_PACKAGES_SKIPPED ' + why);
  if (process.env.GITHUB_ACTIONS) console.log('::warning title=w15c-packages skipped::' + why);
  process.exit(0);
}
(async () => {
  let checks = 0; const check = (value, message) => { assert(value, message); checks++; };
  const { createServer, createDataSource, TOOLS, PROTOCOL } = require('../release/packages/mcp/server.cjs');
  const server = createServer({ offline: true });
  const request = (id, method, params) => server.handle({ jsonrpc: '2.0', id, method, params });
  check((await request(1, 'tools/list')).error.code === -32002, 'MCP requires initialization');
  const initialized = await request(2, 'initialize', { protocolVersion: PROTOCOL, capabilities: {}, clientInfo: { name: 'regression', version: '1' } });
  check(initialized.result.protocolVersion === PROTOCOL && initialized.result.capabilities.tools, 'MCP negotiates its declared protocol');
  check(await server.handle({ jsonrpc: '2.0', method: 'notifications/initialized' }) === null, 'Notifications have no response');
  const tools = (await request(3, 'tools/list')).result.tools;
  check(tools.length === 4 && tools.every((t) => t.inputSchema.type === 'object' && t.inputSchema.additionalProperties === false && t.annotations.readOnlyHint && !t.annotations.destructiveHint), 'Four schema-validated read-only tools');
  const call = (name, args) => request(4, 'tools/call', { name, arguments: args });
  check((await call('plenix_tokens', { query: 'content', tier: 'plx-sys', limit: 3 })).result.structuredContent.tokens.length === 3, 'Token tool uses actual bundled tokens and limit');
  const components = (await call('plenix_components', { id: 'button' })).result.structuredContent;
  check(components.components[0].id === 'button' && components.source.startsWith('bundled:'), 'Component tool reads an actual record and identifies its snapshot');
  check((await call('plenix_search', { query: 'button', limit: 2 })).result.structuredContent.results.length === 2, 'Search is bounded across actual data');
  const usage = (await call('plenix_usage', { id: 'button' })).result;
  check(usage.structuredContent.exports.some((item) => item.name === 'Button') && JSON.parse(usage.content[0].text).record.id === 'button', 'Usage uses the actual public API and agrees with text output');
  check((await call('plenix_usage', { id: 'does-not-exist' })).result.isError, 'Missing usage is a tool error, not invented guidance');
  check((await call('plenix_search', {})).error.code === -32602, 'Required argument enforced');
  check((await call('plenix_search', { query: 'x', unexpected: true })).error.code === -32602, 'Unknown argument rejected');
  check((await call('plenix_search', { query: 'x', limit: 101 })).error.code === -32602, 'Out-of-range limit rejected');
  check((await call('missing', {})).error.code === -32602, 'Unknown tool is a protocol error');
  check((await request(5, 'resources/list')).result.resources.length === 4, 'Four JSON resources');
  check(JSON.parse((await request(6, 'resources/read', { uri: 'plenix://tokens' })).result.contents[0].text).tokens.length > 100, 'Resource reads real token data');
  check((await request(7, 'resources/read', { uri: 'file:///secret' })).error.code === -32602, 'No arbitrary resource paths');
  check((await server.handle([])).error.code === -32600, 'JSON-RPC batches are rejected for the chosen protocol');
  check((await request(8, 'unknown/method')).error.code === -32601, 'Unknown method rejected');
  const unavailable = createServer({ read: async () => { throw Object.assign(new Error('Unavailable catalog'), { code: 'ENOENT' }); } });
  await unavailable.handle({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: PROTOCOL, capabilities: {}, clientInfo: { name: 'errors', version: '1' } } });
  await unavailable.handle({ jsonrpc: '2.0', method: 'notifications/initialized' });
  check((await unavailable.handle({ jsonrpc: '2.0', id: 2, method: 'resources/read', params: { uri: 'plenix://tokens' } })).error.code === -32603, 'Catalog IO failures retain a numeric JSON-RPC error code');
  let remoteURL;
  const remote = createDataSource({ apiURL: 'https://example.invalid/api/v1/', strictRemote: true, fetch: async (url) => { remoteURL = String(url); return { ok: true, json: async () => ({ version: 'test', components: [{ id: 'remote-record' }] }) }; } });
  check((await remote('components')).data.components[0].id === 'remote-record' && remoteURL === 'https://example.invalid/api/v1/components.json', 'Remote mode reads only a fixed API endpoint');
  const fallback = createDataSource({ fetch: async () => { throw new Error('offline'); } });
  check((await fallback('tokens')).source.startsWith('bundled:'), 'Network failure uses the explicit bundled snapshot');
  let failed = false; try { await createDataSource({ strictRemote: true, fetch: async () => ({ ok: false, status: 503 }) })('tokens'); } catch (e) { failed = true; }
  check(failed, 'Strict remote failures are explicit');
  const cli = path.join(ROOT, 'release/packages/mcp/server.cjs');
  const output = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, '--offline'], { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] }); let stdout = '', stderr = '';
    child.stdout.on('data', (s) => { stdout += s; }); child.stderr.on('data', (s) => { stderr += s; });
    child.on('error', reject); child.on('close', (code) => code ? reject(new Error(stderr || 'CLI exited ' + code)) : resolve(stdout));
    child.stdin.end([
      JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: PROTOCOL, capabilities: {}, clientInfo: { name: 'stdio-test', version: '1' } } }),
      JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
      JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'plenix_components', arguments: { id: 'button' } } }),
      '{bad json', JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'ping' }), ''
    ].join('\n'));
  });
  const messages = output.trim().split('\n').map((s) => JSON.parse(s));
  check(messages.length === 4 && messages[1].result.structuredContent.components[0].id === 'button' && messages[2].error.code === -32700 && messages[3].id === 3, 'Actual stdio is clean JSON-RPC and recovers after parse errors');

  const dateSource = require('@babel/standalone').transform(fs.readFileSync(path.join(ROOT, 'platform/utils/format.ts'), 'utf8'), { filename: 'format.ts', presets: ['typescript'] }).code;
  const url = 'data:text/javascript;base64,' + Buffer.from(dateSource).toString('base64');
  for (const tz of ['America/Los_Angeles', 'America/New_York', 'Asia/Tokyo', 'Europe/London']) {
    const script = '(async()=>{const F=await import(' + JSON.stringify(url) + ');console.log(JSON.stringify({normal:F.formatDate("2026-03-08",{locale:"en-US",dateStyle:"long"}),leap:F.formatDate("2024-02-29",{locale:"en-US",dateStyle:"long"}),bad:F.formatDate("2026-02-30"),instant:F.formatDate("2026-03-08T00:00:00Z",{locale:"en-US",dateStyle:"long",timeZone:"America/Los_Angeles"})}));})()';
    const data = JSON.parse(execFileSync(process.execPath, ['-e', script], { env: Object.assign({}, process.env, { TZ: tz }), encoding: 'utf8' }).trim());
    check(data.normal === 'March 8, 2026' && data.leap === 'February 29, 2024' && data.bad === '' && data.instant === 'March 7, 2026', 'Calendar dates and explicit instants retain their semantics in ' + tz);
  }
  const english = fs.readFileSync(path.join(ROOT, 'platform/i18n/en.js'), 'utf8').replace(/^.*\nexport default /, '').replace(/;\s*$/, '');
  check(JSON.stringify(JSON.parse(english)) === JSON.stringify(JSON.parse(fs.readFileSync(path.join(ROOT, 'platform/i18n/en.json'), 'utf8'))), 'English runtime mirror exactly matches the JSON catalog');

  const perf = require('./perf.test.js');
  check(perf.checkBudgets(ROOT).length === 5, 'Budgets measure all five actual generated package artifacts');
  let over = false; try { perf.checkBudgets(ROOT, [{ file: 'react/dist/index.js', raw: 1, gzip: 1 }]); } catch (e) { over = /exceeds/.test(e.message); }
  check(over, 'An oversized actual artifact fails the budget gate');
  const wcManifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'release/packages/web-components/package.json'), 'utf8'));
  check(wcManifest.exports['./plenix-shadow.css'] && wcManifest.types === 'index.d.ts', 'Web-component package exports shadow CSS and TypeScript definitions');
  const css = fs.readFileSync(path.join(ROOT, 'release/packages/web-components/plenix-shadow.css'), 'utf8');
  check(css.includes(':host') && css.includes('.plx-button') && !/:root/.test(css) && !/url\((?!"?data:)/.test(css), 'Shadow CSS contains host token selectors, components and self-contained asset URLs');
  console.log('W15C_PACKAGES_OK ' + checks + ' package/date/protocol checks');
})().catch((error) => { console.error(error); process.exitCode = 1; });
