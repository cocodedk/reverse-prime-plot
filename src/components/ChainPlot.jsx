import { useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { drawChainPlot } from '../lib/drawChainPlot.js';
import { CANVAS_SIZE } from '../lib/plotGeometry.js';
import { formatNumber, t } from '../i18n/index.js';

// Chain seeds peak in the low thousands, so this always draws arcs — no dense
// pixel path, and therefore no readback hint or canvas keying like PrimePlot.
export default function ChainPlot({ data, yDirection = 'up' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = requestAnimationFrame(() => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = CANVAS_SIZE * pixelRatio;
      canvas.height = CANVAS_SIZE * pixelRatio;
      const context = canvas.getContext('2d');
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawChainPlot(context, data, yDirection);
    });
    return () => cancelAnimationFrame(frame);
  }, [data, yDirection]);

  return (
    <>
      <canvas
        {...stylex.props(styles.plot)}
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        role="img"
        aria-describedby="chain-plot-description"
      />
      <p id="chain-plot-description" {...stylex.props(styles.visuallyHidden)}>
        {t.chainsPlotLabel(formatNumber(data.start), formatNumber(data.end))}
      </p>
    </>
  );
}

const styles = stylex.create({
  plot: { aspectRatio: '1 / 1', display: 'block', height: 'auto', width: '100%' },
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
