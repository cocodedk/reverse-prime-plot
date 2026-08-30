import { createChainData } from '../lib/primeChains.js';

self.onmessage = ({ data: request }) => {
  let lastValue = -1;
  let lastPhase = '';

  try {
    const data = createChainData(request.start, request.end, request.divisor, (progress, phase) => {
      const value = Math.min(90, Math.round(progress * 90));
      if (value === lastValue && phase === lastPhase) return;
      lastValue = value;
      lastPhase = phase;
      self.postMessage({ type: 'progress', phase, value });
    });

    self.postMessage({ type: 'complete', data }, [
      data.markerNumbers.buffer,
      data.markerReversed.buffer,
      data.markerDepths.buffer,
    ]);
  } catch (error) {
    self.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Chain search failed.',
    });
  }
};
