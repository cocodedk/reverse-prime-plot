import { PLOT_SIZE, scaleX, scaleY } from './plotGeometry.js';
import { ACCENT, CARD, INK } from './palette.js';
import { drawFrame, drawGrid } from './plotChrome.js';

// Depth 1 is the common case and stays quiet; anything deeper is rare enough
// that it earns the ink fill and a larger radius.
const DEPTH_ONE_RADIUS = 3.2;
const DEEP_RADIUS = 6;

function drawSeeds(context, data, deep) {
  const { end, markerDepths, markerNumbers, markerReversed, start } = data;
  const radius = deep ? DEEP_RADIUS : DEPTH_ONE_RADIUS;

  context.beginPath();
  for (let index = 0; index < markerDepths.length; index += 1) {
    const isDeep = markerDepths[index] >= 2;
    if (isDeep !== deep) continue;
    const x = scaleX(markerNumbers[index], start, end);
    const y = scaleY(markerReversed[index], start, end, Y_DIRECTION);
    context.moveTo(x + radius, y);
    context.arc(x, y, radius, 0, Math.PI * 2);
  }
  context.fillStyle = deep ? ACCENT : INK;
  context.fill();

  if (deep) {
    // A cream core keeps the deep markers legible where they overlap.
    context.beginPath();
    for (let index = 0; index < markerDepths.length; index += 1) {
      if (markerDepths[index] < 2) continue;
      const x = scaleX(markerNumbers[index], start, end);
      const y = scaleY(markerReversed[index], start, end, Y_DIRECTION);
      context.moveTo(x + radius / 2.6, y);
      context.arc(x, y, radius / 2.6, 0, Math.PI * 2);
    }
    context.fillStyle = CARD;
    context.fill();
  }
}

function drawSelection(context, data, selectedSeed) {
  const index = data.markerNumbers.indexOf(selectedSeed);
  if (index < 0) return;
  const x = scaleX(data.markerNumbers[index], data.start, data.end);
  const y = scaleY(data.markerReversed[index], data.start, data.end, Y_DIRECTION);
  context.beginPath();
  context.arc(x, y, 11, 0, Math.PI * 2);
  context.strokeStyle = ACCENT;
  context.lineWidth = 2;
  context.stroke();
}

// The chain plot has no axis-direction control, so the orientation is fixed.
const Y_DIRECTION = 'up';

export function drawChainPlot(context, data, selectedSeed, textScale = 1) {
  drawGrid(context, data.start, data.end, Y_DIRECTION, textScale);
  if (data.markerDepths.length > 0) {
    drawSeeds(context, data, false);
    drawSeeds(context, data, true);
    if (selectedSeed !== null && selectedSeed !== undefined) {
      drawSelection(context, data, selectedSeed);
    }
  }
  drawFrame(context, textScale);
}
