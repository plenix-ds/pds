// #369 / ADR 0011: each converted part exports its <Name>Props type.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
const parts = { CodeBlock: 'components', RefineMenu: 'components', SuggestedEdit: 'components', AnswerLines: 'components', PageBreak: 'components', PrintDocument: 'patterns' };
describe('#369 exported Props types', () => {
  for (const [name, dir] of Object.entries(parts)) {
    it(name + ' exports ' + name + 'Props', () => {
      expect(fs.readFileSync(`platform/${dir}/${name}/${name}.tsx`, 'utf8')).toMatch(new RegExp(`^export type ${name}Props\\b`, 'm'));
    });
  }
});
