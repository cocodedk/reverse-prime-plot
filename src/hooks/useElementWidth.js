import { useCallback, useRef, useState } from 'react';

// Canvas text is sized in plot units, so the draw needs the element's real
// width. A ref object is not enough: PrimePlot keys its canvas on the draw mode,
// and a plain ref would leave the observer attached to the replaced node, so
// resizes after that switch would stop rescaling the axis labels. A callback ref
// follows whichever node is actually mounted.
export function useElementWidth() {
  const nodeRef = useRef(null);
  const observerRef = useRef(null);
  const [width, setWidth] = useState(0);

  const measuredRef = useCallback((node) => {
    observerRef.current?.disconnect();
    nodeRef.current = node;
    if (!node) {
      observerRef.current = null;
      return;
    }
    observerRef.current = new ResizeObserver(([entry]) => {
      // Rounding keeps a resize drag from redrawing on every fractional tick.
      setWidth(Math.round(entry.contentRect.width));
    });
    observerRef.current.observe(node);
  }, []);

  return { measuredRef, nodeRef, width };
}
