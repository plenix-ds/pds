// #764 (ADR 0011): copyName and useAutosave are typed for a TypeScript consumer: copyName('a', ['b']) compiles, and useAutosave<T> returns AutosaveResult.
// Compiles tests/types/consumer-764.ts against the real sources with the repository's compiler options.
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
describe('#764 consumer compile', () => {
  it('a consumer file using copyName and useAutosave compiles with no error', () => {
    fs.writeFileSync('tsconfig.consumer-764.json', JSON.stringify({ extends: './tsconfig.json', include: ['tests/types/consumer-764.ts'], exclude: [] }));
    try {
      const r = spawnSync('npx', ['tsc', '--noEmit', '-p', 'tsconfig.consumer-764.json'], { encoding: 'utf8' });
      const own = (r.stdout || '').split('\n').filter((l) => l.startsWith('tests/types/consumer-764.ts'));
      expect(own.join('\n')).toBe('');
    } finally { fs.rmSync('tsconfig.consumer-764.json', { force: true }); }
  }, 120000);
});
