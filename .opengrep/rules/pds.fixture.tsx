// Fixtures for .opengrep/rules/pds.yml: `opengrep test .opengrep/rules`. Not part of any build.
import React from 'react';

export function Fixtures({ html, x }: { html: string; x: number }) {
  return (
    <div>
      {/* ruleid: pds-no-dangerously-set-inner-html */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {/* ok: pds-no-dangerously-set-inner-html */}
      <div>{html}</div>

      {/* ruleid: pds-no-physical-side-in-style */}
      <span style={{ marginLeft: x }} />
      {/* ruleid: pds-no-physical-side-in-style */}
      <span style={{ color: 'var(--plx-sys-color-text)', right: 0 }}>text</span>
      {/* ok: pds-no-physical-side-in-style */}
      <span style={{ marginInlineStart: x, insetInlineEnd: 0 }} />
    </div>
  );
}

// ruleid: pds-no-dangerously-set-inner-html
export const spread = { dangerouslySetInnerHTML: { __html: '<b>x</b>' } };

// ruleid: pds-no-hex-colour-in-code
export const bad = '#1a73e8';
// ruleid: pds-no-dangerously-set-inner-html
export const spread = { dangerouslySetInnerHTML: { __html: '<b>x</b>' } };

// ruleid: pds-no-hex-colour-in-code
export const badShort = "#fff";
// ok: pds-no-hex-colour-in-code
export const good = 'var(--plx-sys-color-accent)';
// ok: pds-no-hex-colour-in-code
export const anchor = '#section-2';
