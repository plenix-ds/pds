#!/usr/bin/env node
// The role registry (template v2.4 §5.1, D-0084; #768): agents.config.yaml "roles:" and its settings, read the same
// way by team.sh, the scheduler, pickup and CI (checks 13 and 15). The file is parsed with PyYAML's safe_load, the
// parser the dashboard and the decisions check use (#589), so text one of them rejects is rejected by all.
//
//   node deploy/agents/registry.mjs roles [file]        one line per role: id|title|instances|parked|boot|kind|memory GB
//   node deploy/agents/registry.mjs get <dotted.key> [file]   one setting (exit 2 when it is missing)
//   node deploy/agents/registry.mjs json [file]         the whole file as JSON
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRIORITY } from './capacity.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_FILE = path.resolve(here, '../../agents.config.yaml');
export const TRIGGERS = ['issue_opened', 'issue_labeled', 'comment_mention', 'ci_failed', 'heartbeat'];
const KINDS = ['lane', 'task'];

export function load(file = DEFAULT_FILE) {
  const code = 'import sys, json, yaml\nprint(json.dumps(yaml.safe_load(sys.stdin.read())))';
  const r = spawnSync(process.env.PDS1_PYTHON || 'python3', ['-I', '-c', code], { input: fs.readFileSync(file, 'utf8'), encoding: 'utf8' });
  if (r.error || r.status !== 0) throw new Error(`${file}: not readable as YAML (python3 with PyYAML): ${(r.stderr || String(r.error)).trim().split('\n').pop()}`);
  return JSON.parse(r.stdout);
}

export const roles = (reg) => (Array.isArray(reg?.roles) ? reg.roles : []);

// a setting by dotted key; throws when it is missing (no silent default: the registry is the only source)
export function setting(reg, key) {
  const v = key.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), reg);
  if (v === undefined || v === null) throw new Error(`agents.config.yaml has no setting "${key}"`);
  return v;
}

// check 13. env: { exists(path), labels: Set of the repo's label names (or null to skip), definitions: ["pds1-x"]
// (agent files), described: ["pds1-x"] (roles named in CLAUDE.md's team table) } -> [{ id, what, message }]
export function checkRoles(reg, env) {
  const errors = [];
  const add = (id, what, message) => errors.push({ id, what, message });
  const seen = new Set();
  for (const r of roles(reg)) {
    const id = r?.id;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id || '')) { add(String(id), 'id', 'id must be lowercase words joined by dashes'); continue; }
    if (seen.has(id)) { add(id, 'duplicate', 'id is used twice'); continue; }
    seen.add(id);
    if (!KINDS.includes(r.kind)) add(id, 'kind', `kind must be ${KINDS.join(' or ')}`);
    if (r.label !== `agent:pds1-${id}`) add(id, 'label', `label must be "agent:pds1-${id}"`);
    if (!Number.isInteger(r.instances) || r.instances < 1) add(id, 'instances', 'instances must be a whole number, 1 or more');
    if (!r.definition || !env.exists(r.definition)) add(id, 'definition', `no definition file ${r.definition || '(none named)'}`);
    if (r.priority !== undefined && !PRIORITY.includes(r.priority)) add(id, 'priority', `priority must be one of ${PRIORITY.join(', ')}`);
    if (r.gate !== undefined && typeof r.gate !== 'boolean') add(id, 'gate', 'gate must be true or false');
    if (r.parked === true) continue; // a parked role needs only its entry and its definition (§5.1 rule 6)
    const w = Array.isArray(r.wakes_on) ? r.wakes_on : [];
    if (!w.length) add(id, 'wakes_on', 'an active role needs at least one trigger in wakes_on');
    else if (w.some((t) => !TRIGGERS.includes(t))) add(id, 'wakes_on', `unknown trigger: ${w.filter((t) => !TRIGGERS.includes(t)).join(', ')} (known: ${TRIGGERS.join(', ')})`);
    if (env.labels && !env.labels.has(r.label)) add(id, 'label', `the label ${r.label} does not exist on GitHub`);
  }
  for (const name of [...new Set([...(env.described || []), ...(env.definitions || [])])]) {
    const id = name.replace(/^pds1-/, '');
    if (!seen.has(id)) add(id, 'missing', `${name} is described or has a definition but has no registry entry: it cannot be started`);
  }
  return errors;
}

// check 15: the numeric settings, by dotted key (the roles list is not a setting)
export function flattenSettings(reg, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(reg || {})) {
    if (!prefix && k === 'roles') continue;
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'number') out[key] = v;
    else if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flattenSettings(v, key));
  }
  return out;
}

// the ways a document states a setting's value in prose (plan §4, CLAUDE.md); the key itself is always caught too
const PROSE = {
  'long_work.max_running': [/(?:at most|≤|up to|no more than)\s*(\d+)\s+(?:sessions?|agents?|long[- ]running|doing long work|at a time)/gi,
    /long-work limit\s*\((\d+)\)/gi, /on top of the (\d+)\b/gi],
  'small_tasks.max_minutes': [/(?:capped at|cap of|≈)\s*(\d+)\s*min/gi, /time cap\s*\((\d+)\s*min/gi],
  'memory.per_agent_limit_gb': [/memory limit of\s*(\d+(?:\.\d+)?)\s*GB/gi],
  'memory.start_new_below_free_gb': [/below\s*(\d+(?:\.\d+)?)\s*GB free/gi],
};

// docs: { file: text }, settings: flattenSettings() -> [{ file, line, setting, stated, value }]
export function settingsInProse(docs, settings) {
  const leaves = Object.keys(settings).map((k) => k.split('.').pop());
  const out = [];
  const seen = new Set();
  for (const [file, text] of Object.entries(docs)) {
    text.split('\n').forEach((lineText, i) => {
      for (const [key, value] of Object.entries(settings)) {
        const leaf = key.split('.').pop();
        const names = [key.replace(/\./g, '\\.')].concat(leaves.filter((l) => l === leaf).length === 1 ? [leaf] : []);
        const patterns = (PROSE[key] || []).concat(names.map((n) => new RegExp(`\\b${n}\\b\`?\\s*[:=(]?\\s*(\\d+(?:\\.\\d+)?)`, 'g')));
        for (const re of patterns) {
          for (const m of lineText.matchAll(new RegExp(re.source, re.flags))) {
            if (Number(m[1]) === value) continue;
            const id = `${file}:${i + 1}:${key}:${m[1]}`;
            if (seen.has(id)) continue;
            seen.add(id);
            out.push({ file, line: i + 1, setting: key, stated: m[1], value });
          }
        }
      }
    });
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [cmd, a, b] = process.argv.slice(2);
  try {
    if (cmd === 'roles') {
      const reg = load(a || DEFAULT_FILE);
      const mem = setting(reg, 'memory.per_agent_limit_gb');
      for (const r of roles(reg)) console.log([r.id, r.title, r.instances, r.parked === true, r.boot === true, r.kind, r.memory_limit_gb ?? mem].join('|'));
    } else if (cmd === 'get') {
      console.log(setting(load(b || DEFAULT_FILE), a));
    } else if (cmd === 'json') {
      console.log(JSON.stringify(load(a || DEFAULT_FILE)));
    } else { console.error('usage: registry.mjs roles|get <key>|json [file]'); process.exit(2); }
  } catch (e) { console.error(`REGISTRY_FAIL: ${e.message}`); process.exit(2); }
}
