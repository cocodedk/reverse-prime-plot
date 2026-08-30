import { PLOT_SIZE, scaleX, scaleY } from './plotGeometry.js';
import { CARD, INK, PRIME_COLOR, PRIME_RGB } from './palette.js';
import { drawFrame, drawGrid } from './plotChrome.js';
const BATCH_SIZE = 20_000;
const DENSE_PLOT_THRESHOLD = 5_000;

// Marker states are bit-packed in primeNumbers.js: bit 0 = n is prime,
// bit 1 = reverse(n) is prime. Each pass below is one full sweep of the marker
// arrays, painted in order: a white backing disc, then the coloured halves,
// then a single outline over everything.
const MARKER_PASSES = [
  { matches: (state) => state === 1 || state === 2, shape: 'full', fillStyle: CARD },
  { matches: (state) => state === 3, shape: 'full', fillStyle: PRIME_COLOR },
  { matches: (state) => state === 1, shape: 'top', fillStyle: PRIME_COLOR },
  { matches: (state) => state === 2, shape: 'bottom', fillStyle: PRIME_COLOR },
  { matches: () => true, shape: 'full', stroke: true },
];

function appendShape(context, x, y, radius, shape) {
  if (shape === 'top') {
    context.moveTo(x - radius, y);
    context.arc(x, y, radius, Math.PI, Math.PI * 2);
    context.closePath();
    return;
  }
  if (shape === 'bottom') {
    context.moveTo(x + radius, y);
    context.arc(x, y, radius, 0, Math.PI);
    context.closePath();
    return;
  }
  context.moveTo(x + radius, y);
  context.arc(x, y, radius, 0, Math.PI * 2);
}

function drawMarkerLayer(context, data, yDirection, radius, pass) {
  const { end, markerNumbers, markerReversed, markerStates, start } = data;
  let batched = 0;
  const paint = () => (pass.stroke ? context.stroke() : context.fill());
  context.beginPath();

  for (let index = markerStates.length - 1; index >= 0; index -= 1) {
    if (!pass.matches(markerStates[index])) continue;
    appendShape(
      context,
      scaleX(markerNumbers[index], start, end),
      scaleY(markerReversed[index], start, end, yDirection),
      radius,
      pass.shape,
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
    pixels[index] = PRIME_RGB[0];
    pixels[index + 1] = PRIME_RGB[1];
    pixels[index + 2] = PRIME_RGB[2];
    pixels[index + 3] = 255;
  }
}

function drawDenseMarkers(context, data, yDirection, pixelRatio) {
  const { canvas } = context;
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

export function usesPixelReadback(data) {
  return data.count > DENSE_PLOT_THRESHOLD;
}

export function drawPlot(context, data, yDirection, pixelRatio, textScale = 1) {
  drawGrid(context, data.start, data.end, yDirection, textScale);

  if (usesPixelReadback(data)) {
    drawDenseMarkers(context, data, yDirection, pixelRatio);
  } else {
    const radius = Math.max(0.6, Math.min(4.8, (PLOT_SIZE / (data.end - data.start)) * 0.58));
    context.strokeStyle = INK;
    context.lineWidth = Math.min(1.1, radius * 0.42);
    for (const pass of MARKER_PASSES) {
      if (pass.fillStyle) context.fillStyle = pass.fillStyle;
      drawMarkerLayer(context, data, yDirection, radius, pass);
    }
  }

  drawFrame(context, textScale);
}
