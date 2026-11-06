// issue 527: Tag's corners are logical (border-start-start-radius …), never physical left and right.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

describe('Tag corner radii (527)', () => {
  const css = fs.readFileSync('platform/components/Tag/tag.css', 'utf8');
  it('uses no physical corner', () => {
    expect(css.match(/border-(top|bottom)-(left|right)-radius/g) || []).toEqual([]);
  });
  it('sets every logical corner of the tag and of its rename input', () => {
    for (const c of ['start-start', 'start-end', 'end-start', 'end-end']) expect(css).toContain('border-' + c + '-radius:var(--plx-comp-tag-radius)');
    for (const c of ['start-start', 'start-end', 'end-start', 'end-end']) expect(css).toContain('border-' + c + '-radius:var(--plx-comp-tag-input-radius)');
  });
});
