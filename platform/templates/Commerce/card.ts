/* Plenix · Commerce: the card helpers: the brand from the first digits, the number in groups (no components)
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */

/* ── payment: the method and the card fields (form UI only) ── */
// the card's brand from its first digits, and the number in groups as people type it (4 4 4 4, or 4 6 5 for American Express)
export function cardBrand(number: string) {
  const d = String(number || '').replace(/\D/g, '');
  if (/^4/.test(d)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'mastercard';
  if (/^3[47]/.test(d)) return 'amex';
  if (/^(6011|65|64[4-9])/.test(d)) return 'discover';
  return '';
}

export function formatCardNumber(number: string) {
  const d = String(number || '').replace(/\D/g, '').slice(0, 19);
  const groups = cardBrand(d) === 'amex' ? [4, 6, 5] : [4, 4, 4, 4, 3];
  const out = []; let i = 0;
  for (const g of groups) { if (i >= d.length) break; out.push(d.slice(i, i + g)); i += g; }
  return out.join(' ');
}

