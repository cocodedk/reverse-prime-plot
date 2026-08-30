import { createPlotData } from '../lib/primeNumbers.js';

self.onmessage = ({ data: interval }) => {
  // createPlotData reports progress far more often than the integer 0-90 scale
  // can express, so collapse repeats rather than waking the main thread with a
  // message (and a React re-render) that would not change the UI.
  let lastValue = -1;
  let lastPhase = '';

  try {
    const data = createPlotData(interval.start, interval.end, (progress, phase) => {
      const value = Math.min(90, Math.round(progress * 90));
      if (value === lastValue && phase === lastPhase) return;
      lastValue = value;
      lastPhase = phase;
      self.postMessage({ type: 'progress', phase, value });
    });

    self.postMessage(
      { type: 'complete', data },
      [
        data.markerNumbers.buffer,
        data.markerReversed.buffer,
        data.markerStates.buffer,
      ],
    );
  } catch (error) {
    self.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Plotting failed.',
    });
  }
};
