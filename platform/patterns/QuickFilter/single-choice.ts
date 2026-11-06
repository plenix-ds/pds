/* Plenix · singleChoice
   Summary: Normalize a single quick choice, preserving the collection's array value shape.
   Usage: singleChoice(options, value, required)
   Props: options are strings or value descriptors; value is the current selection; required chooses the first fallback.
   Behavior: Keep at most one valid value; a required empty choice falls back to the first option.
   Notes: Shared by the hook, panel and folded radio group. */
export function singleChoice(options: any, value: any, required: any) {
  const values = (options || []).map((option: any) => typeof option === 'string' ? option : option.value);
  const selected = (Array.isArray(value) ? value : value === undefined || value === null ? [] : [value]).find(item => values.includes(item));
  return selected !== undefined ? [selected] : required && values.length ? [values[0]] : [];
}
