import { useEffect, useRef } from 'react';
import { useElementWidth } from '../hooks/useElementWidth.js';
import * as stylex from '@stylexjs/stylex';
import { drawChainPlot } from '../lib/drawChainPlot.js';
import { CANVAS_SIZE, scaleX, scaleY } from '../lib/plotGeometry.js';
import { formatNumber, t } from '../i18n/index.js';

// Chain seeds peak in the low thousands, so this always draws arcs — no dense
// pixel path, and therefore no readback hint or canvas keying like PrimePlot.
const HIT_RADIUS = 12;

// Maps a click to the nearest marker in plot units, so hit-testing does not
// depend on the canvas's CSS size or the device pixel ratio.
function markerAt(event, canvas, data) {
  const rect = canvas.getBoundingClientRect();
  const scale = CANVAS_SIZE / rect.width;
  const pointerX = (event.clientX - rect.left) * scale;
  const pointerY = (event.clientY - rect.top) * scale;

  let best = -1;
  let bestDistance = HIT_RADIUS;
  for (let index = 0; index < data.markerNumbers.length; index += 1) {
    const x = scaleX(data.markerNumbers[index], data.start, data.end);
    const y = scaleY(data.markerReversed[index], data.start, data.end, 'up');
    const distance = Math.hypot(pointerX - x, pointerY - y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  }
  return best;
}

export default function ChainPlot({ data, selectedSeed, onSelect }) {
  const canvasRef = useRef(null);
  const renderedWidth = useElementWidth(canvasRef);
  // Keep axis labels near 12 real pixels however wide the canvas renders.
  const textScale = Math.min(2.4, Math.max(0.8, CANVAS_SIZE / (renderedWidth || CANVAS_SIZE)));

  useEffect(() => {
    const canvas = canvasRef.current;
    // ResizeObserver always reports once on observe, so skipping the
    // pre-measurement pass drops a full wasted draw rather than delaying one.
    if (renderedWidth === 0) return undefined;
    const frame = requestAnimationFrame(() => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = CANVAS_SIZE * pixelRatio;
      canvas.height = CANVAS_SIZE * pixelRatio;
      const context = canvas.getContext('2d');
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawChainPlot(context, data, selectedSeed, textScale);
    });
    return () => cancelAnimationFrame(frame);
  }, [data, renderedWidth, selectedSeed, textScale]);

  return (
    <>
      <canvas
        {...stylex.props(styles.plot)}
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        role="img"
        aria-describedby="chain-plot-description"
        onClick={(event) => {
          const index = markerAt(event, canvasRef.current, data);
          if (index >= 0) onSelect(data.markerNumbers[index]);
        }}
      />
      <p id="chain-plot-description" {...stylex.props(styles.visuallyHidden)}>
        {t.chainsPlotLabel(formatNumber(data.start), formatNumber(data.end))}
      </p>
    </>
  );
}

const styles = stylex.create({
  plot: { aspectRatio: '1 / 1', cursor: 'pointer', display: 'block', height: 'auto', width: '100%' },
  visuallyHidden: {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
});
