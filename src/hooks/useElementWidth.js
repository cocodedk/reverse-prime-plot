import { useEffect, useState } from 'react';

// Canvas text is sized in plot units, so the draw needs the element's real
// width. Measuring once inside the draw effect is not enough: the first paint
// can land before layout settles, and nothing redraws on resize or rotation.
export function useElementWidth(ref) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(([entry]) => {
      // Rounding keeps a resize drag from redrawing on every fractional tick.
      setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}
