import { PLOT_SIZE, scaleX, scaleY } from './plotGeometry.js';
import { CREAM, INK, PRIME_COLOR } from './palette.js';
import { drawFrame, drawGrid } from './plotChrome.js';

// Depth 1 is the common case and stays quiet; anything deeper is rare enough
// that it earns the ink fill and a larger radius.
const DEPTH_ONE_RADIUS = 3.2;
const DEEP_RADIUS = 6;

export function depthColor(depth) {
  return depth >= 2 ? INK : PRIME_COLOR;
}

function drawSeeds(context, data, yDirection, deep) {
  const { end, markerDepths, markerNumbers, markerReversed, start } = data;
  const radius = deep ? DEEP_RADIUS : DEPTH_ONE_RADIUS;

  context.beginPath();
  for (let index = 0; index < markerDepths.length; index += 1) {
    const isDeep = markerDepths[index] >= 2;
    if (isDeep !== deep) continue;
    const x = scaleX(markerNumbers[index], start, end);
    const y = scaleY(markerReversed[index], start, end, yDirection);
    context.moveTo(x + radius, y);
    context.arc(x, y, radius, 0, Math.PI * 2);
  }
  context.fillStyle = deep ? INK : PRIME_COLOR;
  context.fill();

  if (deep) {
    // A cream core keeps the deep markers legible where they overlap.
    context.beginPath();
    for (let index = 0; index < markerDepths.length; index += 1) {
      if (markerDepths[index] < 2) continue;
      const x = scaleX(markerNumbers[index], start, end);
      const y = scaleY(markerReversed[index], start, end, yDirection);
      context.moveTo(x + radius / 2.6, y);
      context.arc(x, y, radius / 2.6, 0, Math.PI * 2);
    }
    context.fillStyle = CREAM;
    context.fill();
  }
}

export function drawChainPlot(context, data, yDirection) {
  drawGrid(context, data.start, data.end, yDirection);
  if (data.markerDepths.length > 0) {
    drawSeeds(context, data, yDirection, false);
    drawSeeds(context, data, yDirection, true);
  }
  drawFrame(context);
}
