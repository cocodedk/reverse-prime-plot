import { createPlotData } from '../lib/primeNumbers.js';

self.onmessage = ({ data: interval }) => {
  try {
    const data = createPlotData(interval.start, interval.end, (progress, phase) => {
      self.postMessage({
        type: 'progress',
        phase,
        value: Math.min(90, Math.round(progress * 90)),
      });
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
