// Plenix · the build script of each workspace in packages/ (#183, docs/adr/0001), run as `npm run build --workspaces`.
// Until a package's source moves into packages/<name>/src, node build-packages.js still builds it (into
// release/packages/<name>/). This step checks that the build output exists and carries the workspace's name and version,
// so the workspace and the published package can't drift. Run from the workspace folder (npm does that).
const fs = require('fs');
const path = require('path');

const ws = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
const short = ws.name.replace(/^@plenix-ds\//, '');
const built = path.join(__dirname, '..', 'release', 'packages', short, 'package.json');
if (!fs.existsSync(built)) { console.log(ws.name + ': release/packages/' + short + ' is missing: run node build-app.js && node build-packages.js'); process.exit(1); }
const out = JSON.parse(fs.readFileSync(built, 'utf8'));
if (out.name !== ws.name || out.version !== ws.version) { console.log(ws.name + '@' + ws.version + ': the build wrote ' + out.name + '@' + out.version); process.exit(1); }
console.log(ws.name + '@' + ws.version + ': built by build-packages.js (release/packages/' + short + ')');
