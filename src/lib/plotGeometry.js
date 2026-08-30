export const PLOT_SIZE = 604;
export const PLOT_LEFT = 68;
export const PLOT_TOP = 28;
// The plot is inset by PLOT_LEFT on the left and PLOT_TOP on the top; those two
// gaps become the right and bottom margins, which keeps the canvas square.
export const CANVAS_SIZE = PLOT_LEFT + PLOT_SIZE + PLOT_TOP;

// Canvas text is sized in plot units, so it shrinks with the element. Scaling by
// units-per-css-pixel holds labels near 12 real pixels at any rendered width.
export function textScaleFor(renderedWidth) {
  return Math.min(2.4, Math.max(0.8, CANVAS_SIZE / (renderedWidth || CANVAS_SIZE)));
}

export function createTicks(start, end) {
  const roughStep = Math.max(1, (end - start) / 5);
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalized = roughStep / magnitude;
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  const step = factor * magnitude;
  const ticks = [start];
  const firstTick = Math.ceil(start / step) * step;

  for (let tick = firstTick; tick <= end; tick += step) ticks.push(tick);
  if (ticks.at(-1) !== end) ticks.push(end);
  return [...new Set(ticks)];
}

export function scaleX(value, start, end) {
  return PLOT_LEFT + ((value - start) / (end - start)) * PLOT_SIZE;
}

export function scaleY(value, start, end, direction) {
  const offset = ((value - start) / (end - start)) * PLOT_SIZE;
  return direction === 'up' ? PLOT_TOP + PLOT_SIZE - offset : PLOT_TOP + offset;
}
