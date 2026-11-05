import { describe, it, expect } from 'vitest';
import { STATES, checkStates, isTokenOnlyCss } from './states.mjs';

const full = Object.fromEntries(STATES.map((s) => [s, ['plx-sys.state-' + s]]));
const storiesFor = (names) => ({ Button: names });

describe('check 9: state manifest', () => {
  it('reads the eight states from DESIGN.md', () => {
    expect(STATES).toEqual(['default', 'hover', 'focus', 'active', 'disabled', 'loading', 'error', 'selected']);
  });
  it('passes when every state has tokens and a story', () => {
    expect(checkStates({ Button: full }, storiesFor(STATES))).toEqual([]);
  });
  it('fails on a missing state', () => {
    const { loading, ...rest } = full;
    expect(checkStates({ Button: rest }, storiesFor(STATES))).toEqual([expect.stringContaining('Button: state "loading" is missing')]);
  });
  it('accepts n/a with a reason, and needs no story for it', () => {
    const m = { ...full, error: 'n/a(a button has no value to validate)' };
    expect(checkStates({ Button: m }, storiesFor(STATES.filter((s) => s !== 'error')))).toEqual([]);
  });
  it('rejects n/a without a reason', () => {
    expect(checkStates({ Button: { ...full, error: 'n/a' } }, storiesFor(STATES))[0]).toContain('needs a reason');
  });
  it('fails when a declared state has no story', () => {
    expect(checkStates({ Button: full }, storiesFor(STATES.filter((s) => s !== 'hover')))).toEqual([expect.stringContaining('state "hover" has no story')]);
  });
  it('rejects an unknown state', () => {
    expect(checkStates({ Button: { ...full, pressed: ['x'] } }, storiesFor(STATES))[0]).toContain('unknown state "pressed"');
  });

  it('treats a token-name-only stylesheet edit as not a component change (#315)', () => {
    const a = '.x { gap: var(--plx-ref-space-8px); }';
    expect(isTokenOnlyCss(a, a.replace('space-8px', 'space-2u'))).toBe(true);
  });
  it('still counts a real stylesheet edit', () => {
    const a = '.x { gap: var(--plx-ref-space-8px); }';
    expect(isTokenOnlyCss(a, a.replace('8px', '2u').replace('gap', 'margin'))).toBe(false);
    expect(isTokenOnlyCss(a, '.x { gap: 8px; }')).toBe(false);
  });
});
