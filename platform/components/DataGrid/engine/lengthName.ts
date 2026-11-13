/* Plenix · DataGrid engine · a height's name for the holder's data-plx-height attribute
   Summary: Turns the grid's `height` prop into the px name the generated height rules are keyed on ("400px").
   Usage:
     lengthName('--plx-ref-size-100u')  // '400px'  (a size token in grid units: one unit is 4px)
     lengthName('--plx-ref-size-400px') // '400px'  (the px-named alias)
     lengthName('400px')                // '400px'
     lengthName('100%')                 // undefined (fill sizes the holder by flex, not by a rule)
   Notes: #1347: the size palette moved to grid units (ADR 0012, #302) and this read only px names, so the documented token
     form set no attribute, the holder had no maximum height and a 600-record grid drew every row.
*/
const UNIT = 4;

export const lengthName = (v: unknown): string | undefined => {
  const text = String(v || ''),
    units = /--plx-ref-size-(\d+)u(?![\w-])/.exec(text);
  if (units) return Number(units[1]) * UNIT + 'px';
  return /(?:--plx-ref-size-)?(\d+px)/.exec(text)?.[1];
};
