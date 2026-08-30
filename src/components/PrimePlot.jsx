import { useEffect, useRef } from 'react';
import { useElementWidth } from '../hooks/useElementWidth.js';
import * as stylex from '@stylexjs/stylex';
import { drawPlot, usesPixelReadback } from '../lib/drawPrimePlot.js';
import { CANVAS_SIZE } from '../lib/plotGeometry.js';
import { formatNumber, t } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';

export default function PrimePlot({ data, onRendered, yDirection }) {
  const canvasRef = useRef(null);
  const renderedWidth = useElementWidth(canvasRef);
  // Keep axis labels near 12 real pixels however wide the canvas renders.
  const textScale = Math.min(2.4, Math.max(0.8, CANVAS_SIZE / (renderedWidth || CANVAS_SIZE)));
  // A 2D context locks its attributes at the first getContext call for the
  // element's lifetime, so one canvas cannot serve both draw paths. Keying the
  // element on the mode remounts it, yielding a fresh context whose readback
  // hint matches how the plot is actually drawn.
  const readsBack = usesPixelReadback(data);

  useEffect(() => {
    const canvas = canvasRef.current;
    // ResizeObserver always reports once on observe, so skipping the
    // pre-measurement pass drops a full wasted draw rather than delaying one.
    if (renderedWidth === 0) return undefined;
    const frame = requestAnimationFrame(() => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = CANVAS_SIZE * pixelRatio;
      canvas.height = CANVAS_SIZE * pixelRatio;
      const context = canvas.getContext('2d', { willReadFrequently: readsBack });
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawPlot(context, data, yDirection, pixelRatio, textScale);
      onRendered(data);
    });
    return () => cancelAnimationFrame(frame);
  }, [data, onRendered, renderedWidth, textScale, yDirection, readsBack]);

  const lowerPosition = yDirection === 'up' ? t.positionBottom : t.positionTop;
  return (
    <>
      <canvas
        {...stylex.props(styles.plot)}
        key={readsBack ? 'dense' : 'sparse'}
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        role="img"
        aria-describedby="plot-description"
      >
        {t.canvasFallback}
      </canvas>
      <p id="plot-description" {...stylex.props(styles.visuallyHidden)}>
        {t.plotDescription(formatNumber(data.start), formatNumber(data.end), lowerPosition)}
      </p>
    </>
  );
}

