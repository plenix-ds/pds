/* Plenix tests · the baseline scan names a prop with its part (issue 307): a note such as "SplitView `maxSize` no longer limits …"
   counts only in a file that uses SplitView. `maxSize` on useUploadQueue, ImageUpload or AttachmentPicker (an upload size limit) is not
   that note's business. Usage: node tests/baseline-owner-307.test.js */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), os = require('os');
const { scan } = require('../tools/baseline/scan.js');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'baseline-owner-'));
fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'pretend', dependencies: { plenix: '0.75.0' } }));
fs.writeFileSync(path.join(dir, 'upload.jsx'), "const queue = useUploadQueue({ accept: '.pdf', maxSize: 50e6 });\nconst a = <ImageUpload maxSize={20e6} />;\n");
fs.writeFileSync(path.join(dir, 'split.jsx'), "const s = <SplitView maxSize={400} start={a} end={b} />;\n");
const r = scan({ folder: dir, app: 'pretend', pin: '0.75.0' });
const hits = r.findings.filter((f) => f.kind === 'changelog' && /maxSize/.test(f.what)).map((f) => f.file);
assert.deepEqual(hits, ['split.jsx'], 'maxSize is found next to SplitView only, not on upload limits: ' + JSON.stringify(hits));
console.log('baseline-owner-307: OK');
