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

export const LABEL_EDGE_PAD = 4;

// A tick label is centred on its tick, but a long one at either end of an axis
// would hang off the canvas, so it slides inward just far enough to fit. The y
// axis passes the frame's bottom as its limit: below it sit the x labels.
export function keepInside(center, halfWidth, limit = CANVAS_SIZE) {
  return Math.min(Math.max(center, halfWidth + LABEL_EDGE_PAD), limit - halfWidth - LABEL_EDGE_PAD);
}

export const MAX_TICK_STEPS = 5;
// Space kept between neighbouring tick labels, in canvas units.
export const LABEL_GAP = 16;

// How many steps an axis can be cut into before labels this wide touch. Nine
// digits at phone width fit about three.
export function tickStepsFor(labelWidth) {
  return Math.max(1, Math.min(MAX_TICK_STEPS, Math.floor(PLOT_SIZE / (labelWidth + LABEL_GAP))));
}

// Where each tick label is drawn along its axis, or null for a middle label that
// would touch the one before it or the end label. The end labels always show,
// so the interval's bounds stay readable; the end tick is often only a fraction
// of a step past the last round one.
export function visibleLabels(centres, halfWidths, limit) {
  const at = centres.map((centre, index) => keepInside(centre, halfWidths[index], limit));
  const clear = (a, b) => Math.abs(at[a] - at[b]) >= halfWidths[a] + halfWidths[b] + LABEL_GAP;
  const last = at.length - 1;
  let kept = 0;
  return at.map((centre, index) => {
    if (index === 0 || index === last) return centre;
    if (!clear(index, kept) || !clear(index, last)) return null;
    kept = index;
    return centre;
  });
}

export function createTicks(start, end, steps = MAX_TICK_STEPS) {
  const roughStep = Math.max(1, (end - start) / steps);
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
