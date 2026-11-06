#!/usr/bin/env node
// Self-test of tools/publish/notify-apps.mjs (#750, D-0083): the release step sends each app with a "notify" entry one
// repository_dispatch, with the version, and only when the live CDN serves that version.
//   node tools/publish/notify-apps.test.mjs
import { plan } from './notify-apps.mjs';

let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : `: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`}`);
};
const apps = [
  { name: 'ctm', repository: 'LighthouseCollection/CTM', notify: { event_type: 'plenix-release' } },
  { name: 'st-john', repository: 'LighthouseCollection/st-john-test-site' },
  { name: 'aiteam', repository: null, notify: { event_type: 'plenix-release' } },
];
check('one dispatch per app with notify and a repository, carrying the version',
  plan(apps, '0.90.1', '0.90.1'),
  { ok: true, calls: [{ app: 'ctm', path: 'repos/LighthouseCollection/CTM/dispatches', body: { event_type: 'plenix-release', client_payload: { version: '0.90.1' } } }] });
check('nothing is sent when the live CDN does not serve the version yet',
  plan(apps, '0.90.2', '0.90.1'), { ok: false, calls: [], reason: 'the live CDN version.json for 0.90.2 says 0.90.1' });
check('a bad version is refused', plan(apps, 'latest', 'latest'), { ok: false, calls: [], reason: 'version "latest" is not X.Y.Z' });
console.log(failed ? `NOTIFY_TEST_FAIL (${failed})` : 'NOTIFY_TEST_OK (3)');
process.exit(failed ? 1 : 0);
