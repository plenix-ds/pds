#!/usr/bin/env node
// Check 16, merge-queue triggers and hand-offs (template v2.4 §6.1, §9; #772):
// - every workflow that produces a required check on main also triggers on merge_group (the merge queue runs it);
// - no step hands work off with the job's GITHUB_TOKEN: events it causes (a label, a pushed tag, a card move) start no
//   workflow, so such a hand-off silently does nothing. Use the GitHub App token, the host login, or end the step with an
//   explicit dispatch (gh workflow run, repository_dispatch), which GITHUB_TOKEN may start.
//   node tools/ci/check-workflows.mjs        (GH_TOKEN reads main's ruleset; a failed lookup is a FAIL)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from '../../deploy/agents/registry.mjs';

const HANDOFF = /--add-label|--remove-label|\bgh label (create|edit)\b|\/labels\b|\bgit push\b[^\n]*(tag|refs\/tags|--tags)|\bgh project\b|item-edit/;
const DISPATCH = /\bgh workflow run\b|\/dispatches\b/;
const JOB_TOKEN = /\$\{\{\s*(github\.token|secrets\.GITHUB_TOKEN)\s*\}\}/;
const triggers = (wf) => { const on = wf.on ?? wf.true ?? {}; return typeof on === 'string' ? [on] : Array.isArray(on) ? on : Object.keys(on || {}); };
const tokenIn = (env = {}) => Object.values(env || {}).some((v) => JOB_TOKEN.test(String(v)));

// workflows: { file: parsed YAML }, required: the required check names -> [{ file, what, message }]
export function checkWorkflows(workflows, required) {
  const errors = [];
  for (const [file, wf] of Object.entries(workflows)) {
    const jobs = wf.jobs || {};
    const names = Object.entries(jobs).map(([id, j]) => j.name || id);
    if (names.some((n) => required.includes(n)) && !triggers(wf).includes('merge_group')) {
      errors.push({ file, what: 'merge_group', message: `produces a required check (${names.filter((n) => required.includes(n)).join(', ')}) but has no merge_group trigger, so the merge queue never runs it` });
    }
    for (const [id, j] of Object.entries(jobs)) {
      for (const [i, step] of (j.steps || []).entries()) {
        const run = String(step.run || '');
        if (!HANDOFF.test(run) || DISPATCH.test(run)) continue;
        if (tokenIn(step.env) || tokenIn(j.env) || tokenIn(wf.env)) {
          errors.push({ file, what: 'handoff', message: `job ${id}, step ${step.name || i + 1}: a hand-off (label, tag push or card move) made with GITHUB_TOKEN starts no workflow; use the App token or end the step with gh workflow run` });
        }
      }
    }
  }
  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = '.github/workflows';
  const workflows = {};
  try {
    for (const f of fs.readdirSync(dir).filter((f) => /\.ya?ml$/.test(f))) workflows[f] = load(path.join(dir, f));
  } catch (e) { console.log(`WORKFLOWS_FAIL: ${e.message}`); process.exit(1); }
  let required;
  try {
    const repo = process.env.GITHUB_REPOSITORY || 'plenix-ds/pds';
    const sets = JSON.parse(execFileSync('gh', ['api', `repos/${repo}/rules/branches/main`], { encoding: 'utf8' }));
    required = sets.filter((r) => r.type === 'required_status_checks').flatMap((r) => r.parameters.required_status_checks.map((c) => c.context));
  } catch (e) { console.log(`WORKFLOWS_FAIL: could not read main's required checks: ${String(e.message).split('\n')[0]}`); process.exit(1); }
  if (!required.length) { console.log('WORKFLOWS_FAIL: main has no required checks'); process.exit(1); }
  const errors = checkWorkflows(workflows, required);
  for (const e of errors) console.log(`::error file=${dir}/${e.file}::${e.message} (check 16)`);
  if (errors.length) { console.log(`WORKFLOWS_FAIL (${errors.length})`); process.exit(1); }
  console.log(`WORKFLOWS_OK (${Object.keys(workflows).length} workflows; required on main: ${required.join(', ')})`);
}
