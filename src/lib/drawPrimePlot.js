import {
  createTicks,
  PLOT_LEFT,
  PLOT_SIZE,
  PLOT_TOP,
  scaleX,
  scaleY,
} from './plotGeometry.js';

const PRIME_COLOR = '#f15a37';
const INK = '#18332e';
const GRID = '#d9ddd4';
const BATCH_SIZE = 20_000;
const DENSE_PLOT_THRESHOLD = 5_000;
export const CANVAS_SIZE = 700;

function drawGrid(context, start, end, yDirection) {
  context.fillStyle = '#fffdf8';
  context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  context.font = '12px Inter, ui-sans-serif, system-ui, sans-serif';
  context.lineWidth = 1;
  context.strokeStyle = GRID;
  context.fillStyle = '#687670';

  for (const tick of createTicks(start, end)) {
    const x = scaleX(tick, start, end);
    const y = scaleY(tick, start, end, yDirection);
    context.beginPath();
    context.moveTo(x, PLOT_TOP);
    context.lineTo(x, PLOT_TOP + PLOT_SIZE);
    context.moveTo(PLOT_LEFT, y);
    context.lineTo(PLOT_LEFT + PLOT_SIZE, y);
    context.stroke();
    context.textAlign = 'center';
    context.fillText(tick.toLocaleString(), x, PLOT_TOP + PLOT_SIZE + 24);
    context.textAlign = 'right';
    context.fillText(tick.toLocaleString(), PLOT_LEFT - 14, y + 4);
  }
}

function appendShape(context, x, y, radius, layer) {
  if (layer === 'top') {
    context.moveTo(x - radius, y);
    context.arc(x, y, radius, Math.PI, Math.PI * 2);
    context.closePath();
    return;
  }
  if (layer === 'bottom') {
    context.moveTo(x + radius, y);
    context.arc(x, y, radius, 0, Math.PI);
    context.closePath();
    return;
  }
  context.moveTo(x + radius, y);
  context.arc(x, y, radius, 0, Math.PI * 2);
}

function stateBelongsToLayer(state, layer) {
  if (layer === 'base') return state === 1 || state === 2;
  if (layer === 'full') return state === 3;
  if (layer === 'top') return state === 1;
  if (layer === 'bottom') return state === 2;
  return true;
}

function drawMarkerLayer(context, data, yDirection, radius, layer) {
  const { end, markerNumbers, markerReversed, markerStates, start } = data;
  let batched = 0;
  const paint = () => (layer === 'outline' ? context.stroke() : context.fill());
  context.beginPath();

  for (let index = markerStates.length - 1; index >= 0; index -= 1) {
    const state = markerStates[index];
    if (!stateBelongsToLayer(state, layer)) continue;
    appendShape(
      context,
      scaleX(markerNumbers[index], start, end),
      scaleY(markerReversed[index], start, end, yDirection),
      radius,
      layer === 'base' ? 'full' : layer,
    );
    batched += 1;
    if (batched % BATCH_SIZE === 0) {
      paint();
      context.beginPath();
    }
  }
  paint();
}

function paintPixelRow(pixels, width, height, x, y, halfWidth) {
  if (y < 0 || y >= height) return;
  for (let offset = -halfWidth; offset <= halfWidth; offset += 1) {
    const pixelX = x + offset;
    if (pixelX < 0 || pixelX >= width) continue;
    const index = (y * width + pixelX) * 4;
    pixels[index] = 241;
    pixels[index + 1] = 90;
    pixels[index + 2] = 55;
    pixels[index + 3] = 255;
  }
}

function drawDenseMarkers(context, canvas, data, yDirection, pixelRatio) {
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const halfWidth = pixelRatio > 1 ? 1 : 0;

  for (let index = data.markerStates.length - 1; index >= 0; index -= 1) {
    const state = data.markerStates[index];
    const x = Math.round(scaleX(data.markerNumbers[index], data.start, data.end) * pixelRatio);
    const reversed = data.markerReversed[index];
    const y = Math.round(scaleY(reversed, data.start, data.end, yDirection) * pixelRatio);
    if (state & 1) paintPixelRow(image.data, image.width, image.height, x, y - 1, halfWidth);
    if (state & 2) paintPixelRow(image.data, image.width, image.height, x, y, halfWidth);
  }
  context.putImageData(image, 0, 0);
}

function drawFrame(context) {
  context.strokeStyle = INK;
  context.lineWidth = 1.5;
  context.strokeRect(PLOT_LEFT, PLOT_TOP, PLOT_SIZE, PLOT_SIZE);
  context.fillStyle = INK;
  context.font = '700 13px Inter, ui-sans-serif, system-ui, sans-serif';
  context.textAlign = 'center';
  context.fillText('number, n', PLOT_LEFT + PLOT_SIZE / 2, 687);
  context.save();
  context.translate(17, PLOT_TOP + PLOT_SIZE / 2);
  context.rotate(-Math.PI / 2);
  context.fillText('reversed number', 0, 0);
  context.restore();
}

export function drawPlot(context, canvas, data, yDirection, pixelRatio) {
  const range = data.end - data.start;
  const radius = Math.max(0.6, Math.min(4.8, (PLOT_SIZE / range) * 0.58));
  drawGrid(context, data.start, data.end, yDirection);
  if (data.count > DENSE_PLOT_THRESHOLD) {
    drawDenseMarkers(context, canvas, data, yDirection, pixelRatio);
  } else {
    context.fillStyle = '#fffdf8';
    drawMarkerLayer(context, data, yDirection, radius, 'base');
    context.fillStyle = PRIME_COLOR;
    drawMarkerLayer(context, data, yDirection, radius, 'full');
    drawMarkerLayer(context, data, yDirection, radius, 'top');
    drawMarkerLayer(context, data, yDirection, radius, 'bottom');
    context.strokeStyle = INK;
    context.lineWidth = Math.min(1.1, radius * 0.42);
    drawMarkerLayer(context, data, yDirection, radius, 'outline');
  }
  drawFrame(context);
}
