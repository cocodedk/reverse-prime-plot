import {
  CANVAS_SIZE,
  createTicks,
  PLOT_LEFT,
  PLOT_SIZE,
  PLOT_TOP,
  scaleX,
  scaleY,
} from './plotGeometry.js';
import { CREAM, INK } from './palette.js';
import { formatNumber, t } from '../i18n/index.js';

const GRID = '#d9ddd4';
const AXIS_TEXT = '#687670';
const SANS_STACK = t.canvasFont;
const AXIS_TITLE_INSET = 13;

// Background, gridlines, tick labels, border and axis titles — everything both
// the marker plot and the chain plot draw underneath their own points.
export function drawGrid(context, start, end, yDirection) {
  context.fillStyle = CREAM;
  context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  context.font = `12px ${SANS_STACK}`;
  context.lineWidth = 1;
  context.strokeStyle = GRID;
  context.fillStyle = AXIS_TEXT;

  for (const tick of createTicks(start, end)) {
    const x = scaleX(tick, start, end);
    const y = scaleY(tick, start, end, yDirection);
    const label = formatNumber(tick);
    context.beginPath();
    context.moveTo(x, PLOT_TOP);
    context.lineTo(x, PLOT_TOP + PLOT_SIZE);
    context.moveTo(PLOT_LEFT, y);
    context.lineTo(PLOT_LEFT + PLOT_SIZE, y);
    context.stroke();
    context.textAlign = 'center';
    context.fillText(label, x, PLOT_TOP + PLOT_SIZE + 24);
    context.textAlign = 'right';
    context.fillText(label, PLOT_LEFT - 14, y + 4);
  }
}

export function drawFrame(context) {
  context.strokeStyle = INK;
  context.lineWidth = 1.5;
  context.strokeRect(PLOT_LEFT, PLOT_TOP, PLOT_SIZE, PLOT_SIZE);
  context.fillStyle = INK;
  context.font = `700 13px ${SANS_STACK}`;
  context.textAlign = 'center';
  context.fillText(t.axisX, PLOT_LEFT + PLOT_SIZE / 2, CANVAS_SIZE - AXIS_TITLE_INSET);
  context.save();
  context.translate(17, PLOT_TOP + PLOT_SIZE / 2);
  context.rotate(-Math.PI / 2);
  context.fillText(t.axisY, 0, 0);
  context.restore();
}

// Dense plots composite markers by writing ImageData directly, which means a
// getImageData readback on every redraw; sparse plots never read pixels back.
// Callers need this to pick the right canvas context hint.
