/* Plenix · resizeScale
   Summary: Pointer values stay continuous; settled values use the drag grid (every DRAG_STEP px, 8px since issue 882) or
     caller steps.
   Usage: resizeScale(steps, min, max, keyboardSteps) returns clamp, snap, step and limits.
   Props: steps: allowed settled values; min/max: bounds; keyboardSteps: existing token steps.
   Behavior: Sorts and deduplicates explicit steps, clamps live values and supports limits beyond the token scale. Without
     steps a value settles on the nearest drag-grid line inside the limits (never off the grid when a limit is), and the
     keyboard moves through the size tokens that sit on the drag grid, then one drag-grid line at a time.
   Notes: No DOM or side effects. */
import { DRAG_STEP } from '../../utils/sizeSteps.js';

export function resizeScale(steps, min, max, keyboardSteps = []) {
  const clamp = value => Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
  const values = Array.isArray(steps) ? [...new Set(steps.filter(Number.isFinite).filter(value => value >= min && value <= max))].sort((a, b) => a - b) : [];
  // the drag-grid lines inside the limits (a limit off the grid rounds inward)
  const first = Math.ceil(min / DRAG_STEP) * DRAG_STEP, last = Math.max(first, Math.floor(max / DRAG_STEP) * DRAG_STEP);
  const onGrid = value => Math.max(first, Math.min(last, Math.round(clamp(value) / DRAG_STEP) * DRAG_STEP));
  const snap = value => values.length ? values.reduce((a, b) => Math.abs(b - value) < Math.abs(a - value) ? b : a) : onGrid(value);
  const step = (value, dir) => {
    if (values.length) return values[Math.max(0, Math.min(values.length - 1, values.indexOf(snap(value)) + (dir > 0 ? 1 : -1)))];
    const keys = keyboardSteps.filter(size => size >= min && size <= max && size % DRAG_STEP === 0);
    const top = keys.length ? Math.max(...keys) : min;
    if (value > top || (value === top && dir > 0) || !keys.length) return snap(value + (dir > 0 ? DRAG_STEP : -DRAG_STEP));
    const candidates = keys.filter(size => dir > 0 ? size > value : size < value);
    return candidates.length ? (dir > 0 ? Math.min(...candidates) : Math.max(...candidates)) : (dir > 0 ? last : first);
  };
  return { clamp, snap, step, lo: values.length ? values[0] : first, hi: values.length ? values[values.length - 1] : last };
}
