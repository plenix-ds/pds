/* Plenix · DataGrid engine · paste (loaded when first used)
   Summary: The pure half of pasting a copied block into the grid (issue 3, ADR 0021): the clipboard's text as rows and cells, the
     value a cell takes from a piece of text (by its editor), and where each piece lands.
   Usage:
     import('./pasteOps.ts').then((ops) => { const table = ops.parseTable(text); const value = ops.valueFor(column, 'text'); const plan = ops.plan({...}); });
   Props:
     parseTable(text): the text Excel, Google Sheets and the grid's own copy write (cells by tab, rows by line break, a cell with a tab, a
       line break or a quote is quoted and its quotes doubled) as an array of rows of strings; one trailing line break is not a row.
     valueFor(column, text): { value } the cell takes, or null when the text is not a value the column's editor takes (a number column and
       "abc"); an empty piece clears a number cell (null) and sets other cells to ''.
     plan({ table, rect, at, rows, columns }): where each piece lands, as [{ row, column, text }] in reading order. at: the active cell
       { r, c } in rows and columns; rect: the selected block { r0, r1, c0, c1 } or null; rows: the grid's model rows (group rows have no
       original and take no line); columns: the visible columns, in order.
   Behavior:
     One piece with a selected block of several cells fills the whole block with it; otherwise the pasted block starts at the block's first
     cell (or the active cell) and stops at the last row and column: it never adds rows or columns.
   Notes:
     Kept apart from the engine so a grid that never pastes does not load it; the iife builds inline the dynamic import.
*/
type Piece = { row: any; column: any; text: string };

/** the clipboard text as rows of cells */
export function parseTable(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', quoted = false, started = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"' && cell === '') { quoted = true; started = true; }
    else if (ch === '\t') { row.push(cell); cell = ''; started = true; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell); rows.push(row); row = []; cell = ''; started = false;
    } else { cell += ch; started = true; }
  }
  if (started || cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

/** the value a column's cell takes from a piece of text, or null when it is not one */
export function valueFor(column: { editor?: unknown }, text: string): { value: unknown } | null {
  if (column.editor === 'number') {
    if (text.trim() === '') return { value: null };
    const n = Number(text.trim());
    return Number.isFinite(n) ? { value: n } : null;
  }
  if (column.editor === 'checkbox') {
    if (/^(true|yes|on|1)$/i.test(text.trim())) return { value: true };
    if (/^(false|no|off|0)$/i.test(text.trim())) return { value: false };
    return null;
  }
  return { value: text };
}

export function plan({ table, rect, at, rows, columns }: { table: string[][]; rect: { r0: number; r1: number; c0: number; c1: number } | null; at: { r: number; c: number }; rows: { original?: unknown }[]; columns: unknown[] }): Piece[] {
  const out: Piece[] = [];
  if (!table.length) return out;
  const one = table.length === 1 && table[0].length === 1;
  if (rect && one && (rect.r1 > rect.r0 || rect.c1 > rect.c0)) {
    for (let r = rect.r0; r <= rect.r1; r += 1) for (let c = rect.c0; c <= rect.c1; c += 1) if (rows[r]?.original && columns[c]) out.push({ row: rows[r], column: columns[c], text: table[0][0] });
    return out;
  }
  let r = rect ? rect.r0 : at.r;
  const c0 = rect ? rect.c0 : at.c;
  for (const line of table) {
    while (r < rows.length && !rows[r].original) r += 1;   // group rows have no cells and take no line
    if (r >= rows.length) break;
    line.forEach((text, j) => { if (columns[c0 + j]) out.push({ row: rows[r], column: columns[c0 + j], text }); });
    r += 1;
  }
  return out;
}
