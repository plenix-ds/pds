// #127 / D-0049: every Settings screen's header is an EntityHeader (Structured, top-small) with its nav icon in the gray box.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
const src = fs.readFileSync('settings/settings.jsx', 'utf8');
const screen = src.match(/const Screen=\(\{[^)]*\}\)=>\{([\s\S]*?)\n\};/)[1];
describe('#127 Settings screen header', () => {
  it('renders EntityHeader, not RecordPage.Header', () => {
    expect(screen).toContain('<EntityHeader');
    expect(screen).not.toContain('RecordPage.Header');
  });
  it('gives the icon in the gray box, the title, "Settings · desc" and the actions', () => {
    expect(screen).toMatch(/media=\{\{\s*icon[,:][^}]*hue:\s*"gray"/);
    expect(screen).toContain('title={title}');
    expect(screen).toMatch(/subtitle=\{[^}]*Settings/);
    expect(screen).toContain('control={actions}');   // elements, so the control slot, not the actions list
  });
  it('takes the icon from the nav list, one source', () => {
    expect(src).toMatch(/^const SETTINGS_CATS=\[/m);
  });
});
