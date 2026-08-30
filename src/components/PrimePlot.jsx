import { useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { CANVAS_SIZE, drawPlot } from '../lib/drawPrimePlot.js';

export default function PrimePlot({ data, onRendered, yDirection }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = requestAnimationFrame(() => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = CANVAS_SIZE * pixelRatio;
      canvas.height = CANVAS_SIZE * pixelRatio;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawPlot(context, canvas, data, yDirection, pixelRatio);
      onRendered(data);
    });
    return () => cancelAnimationFrame(frame);
  }, [data, onRendered, yDirection]);

  const lowerPosition = yDirection === 'up' ? 'bottom' : 'top';
  return (
    <>
      <canvas
        {...stylex.props(styles.plot)}
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        role="img"
        aria-describedby="plot-description"
      >
        Prime and reversed-prime coordinate plot.
      </canvas>
      <p id="plot-description" {...stylex.props(styles.visuallyHidden)}>
        Prime-related coordinates from {data.end} down to {data.start}. Both axes cover that inclusive interval. The horizontal value is the number and the vertical value is its digit reversal, with the lower endpoint at the {lowerPosition}. Empty, non-prime markers are omitted.
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
