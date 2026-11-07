#!/usr/bin/env node
// The ADR index, generated from the ADR files (#956, part of #955). The index is never committed: two ADR PRs queued
// together must not touch the same file, so docs/adr/README.md holds the rules only.
//
//   node tools/ci/adr-index.mjs           prints the index (a Markdown table: number, title, status), in number order
//   node tools/ci/adr-index.mjs --check   (CI: the Decisions job) fails when
//     - a docs/adr/NNNN-<slug>.md has no "# ADR NNNN: <title>" first line, or its NNNN differs from the file's;
//     - it has no "- **Status:** <status>" line;
//     - two files share a number;
//     - README.md lists ADRs in a table again (a committed index brings the merge conflicts back).
// ADR_DIR: the folder (the self-test's fixtures); default docs/adr.
import fs from 'node:fs';
import path from 'node:path';

const DIR = process.env.ADR_DIR || 'docs/adr';
const FILE = /^(\d{4})-[a-z0-9-]+\.md$/;

function read() {
  const problems = [], adrs = [];
  for (const name of fs.readdirSync(DIR).filter((n) => FILE.test(n)).sort()) {
    const number = name.slice(0, 4), lines = fs.readFileSync(path.join(DIR, name), 'utf8').split('\n');
    const title = /^# ADR (\d{4}): (.+)$/.exec(lines[0] || '');
    const status = lines.map((l) => /^- \*\*Status:\*\* (.+)$/.exec(l)).find(Boolean);
    if (!title) problems.push(`${name}: the first line is not "# ADR ${number}: <title>"`);
    else if (title[1] !== number) problems.push(`${name}: the title says ADR ${title[1]}, the file name ${number}`);
    if (!status) problems.push(`${name}: no "- **Status:**" line`);
    adrs.push({ number, name, title: title ? title[2].trim() : '', status: status ? status[1].trim() : '' });
  }
  const counts = {};
  adrs.forEach((a) => { counts[a.number] = (counts[a.number] || 0) + 1; });
  Object.entries(counts).filter(([, n]) => n > 1).forEach(([number, n]) => problems.push(`ADR ${number} is used by ${n} files`));
  const readme = path.join(DIR, 'README.md');
  if (fs.existsSync(readme) && /^\| \[\d{4}\]\(/m.test(fs.readFileSync(readme, 'utf8'))) {
    problems.push('README.md lists ADRs in a table: remove it; the index is generated (node tools/ci/adr-index.mjs)');
  }
  return { adrs, problems };
}

const { adrs, problems } = read();
if (process.argv.includes('--check')) {
  problems.forEach((p) => console.log(`::error::${p}`));
  console.log(problems.length ? `ADR_INDEX_FAIL (${problems.length})` : `ADR_INDEX_OK (${adrs.length} ADRs)`);
  process.exit(problems.length ? 1 : 0);
}
const rows = adrs.map((a) => `| [${a.number}](${a.name}) | ${a.title} | ${a.status} |`);
console.log(['| ADR | Title | Status |', '|---|---|---|', ...rows].join('\n'));
