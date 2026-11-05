import { useEffect } from 'react';
import { useElementWidth } from '../hooks/useElementWidth.js';
import * as stylex from '@stylexjs/stylex';
import { drawPlot, usesPixelReadback } from '../lib/drawPrimePlot.js';
import { CANVAS_SIZE , textScaleFor } from '../lib/plotGeometry.js';
import { formatNumber, t } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';

// Module-level so the default is one stable array: a fresh literal per render
// would retrigger the draw effect every time.
const REVERSE_AXES = [t.axisX, t.axisY];

// The sums page reuses this plot with its own axis titles and description.
export default function PrimePlot({ data, onRendered, yDirection, axes = REVERSE_AXES, description }) {
  const { measuredRef, nodeRef: canvasRef, width: renderedWidth } = useElementWidth();
  const textScale = textScaleFor(renderedWidth);
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
      drawPlot(context, data, yDirection, pixelRatio, textScale, axes);
      onRendered(data);
    });
    return () => cancelAnimationFrame(frame);
  }, [canvasRef, data, onRendered, renderedWidth, textScale, yDirection, readsBack, axes]);

  const lowerPosition = yDirection === 'up' ? t.positionBottom : t.positionTop;
  return (
    <>
      <canvas
        {...stylex.props(styles.plot)}
        key={readsBack ? 'dense' : 'sparse'}
        ref={measuredRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        role="img"
        aria-describedby="plot-description"
      >
        {t.canvasFallback}
      </canvas>
      <p id="plot-description" {...stylex.props(styles.visuallyHidden)}>
        {description ?? t.plotDescription(formatNumber(data.start), formatNumber(data.end), lowerPosition)}
      </p>
    </>
  );
}

