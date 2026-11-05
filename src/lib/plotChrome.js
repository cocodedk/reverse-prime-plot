import {
  CANVAS_SIZE,
  createTicks,
  PLOT_LEFT,
  PLOT_SIZE,
  PLOT_TOP,
  scaleX,
  scaleY,
  tickStepsFor,
  visibleLabels,
} from './plotGeometry.js';
import { CARD, GRID, INK, MUTED } from './palette.js';
import { formatNumber, t } from '../i18n/index.js';

const AXIS_TEXT = MUTED;
const SANS_STACK = t.canvasFont;
const AXIS_TITLE_INSET = 13;
// Gap between the frame and the baseline of the rotated y tick labels.
const Y_LABEL_GAP = 10;

// Background, gridlines, tick labels, border and axis titles — everything both
// the marker plot and the chain plot draw underneath their own points.
export function drawGrid(context, start, end, yDirection, textScale = 1) {
  context.fillStyle = CARD;
  context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  context.font = `${12 * textScale}px ${SANS_STACK}`;
  context.lineWidth = 1;
  context.strokeStyle = GRID;
  context.fillStyle = AXIS_TEXT;

  const steps = tickStepsFor(context.measureText(formatNumber(end)).width);
  const ticks = createTicks(start, end, steps);
  const labels = ticks.map((tick) => formatNumber(tick));
  const halfWidths = labels.map((label) => context.measureText(label).width / 2);
  const xs = ticks.map((tick) => scaleX(tick, start, end));
  const ys = ticks.map((tick) => scaleY(tick, start, end, yDirection));
  const labelXs = visibleLabels(xs, halfWidths);
  const labelYs = visibleLabels(ys, halfWidths, PLOT_TOP + PLOT_SIZE);
  context.textAlign = 'center';

  ticks.forEach((_tick, index) => {
    context.beginPath();
    context.moveTo(xs[index], PLOT_TOP);
    context.lineTo(xs[index], PLOT_TOP + PLOT_SIZE);
    context.moveTo(PLOT_LEFT, ys[index]);
    context.lineTo(PLOT_LEFT + PLOT_SIZE, ys[index]);
    context.stroke();
    if (labelXs[index] !== null) {
      context.fillText(labels[index], labelXs[index], PLOT_TOP + PLOT_SIZE + 18 + 8 * textScale);
    }
    // Y labels run along the axis, as its title does: a 9-digit label laid
    // flat would need more room than the left margin has.
    if (labelYs[index] !== null) {
      context.save();
      context.translate(PLOT_LEFT - Y_LABEL_GAP, labelYs[index]);
      context.rotate(-Math.PI / 2);
      context.fillText(labels[index], 0, 0);
      context.restore();
    }
  });
}

export function drawFrame(context, textScale = 1, [axisX, axisY] = [t.axisX, t.axisY]) {
  context.strokeStyle = INK;
  context.lineWidth = 1.5;
  context.strokeRect(PLOT_LEFT, PLOT_TOP, PLOT_SIZE, PLOT_SIZE);
  context.fillStyle = INK;
  context.font = `500 ${13 * textScale}px ${SANS_STACK}`;
  context.textAlign = 'center';
  context.fillText(axisX, PLOT_LEFT + PLOT_SIZE / 2, CANVAS_SIZE - AXIS_TITLE_INSET);
  context.save();
  context.translate(17, PLOT_TOP + PLOT_SIZE / 2);
  context.rotate(-Math.PI / 2);
  context.fillText(axisY, 0, 0);
  context.restore();
}

