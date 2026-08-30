// Both workers share one protocol: take a request, report progress, post the
// result with its typed arrays transferred, and turn a throw into an error
// message. Only the compute call and the transferred fields differ.
export function runComputeWorker(compute, transferFields, fallbackMessage) {
  self.onmessage = ({ data: request }) => {
    // The compute libraries report progress far more often than the integer
    // 0-90 scale can express, so repeats are collapsed rather than waking the
    // main thread with a message that would not change the UI.
    let lastValue = -1;
    let lastPhase = '';

    try {
      const data = compute(request, (progress, phase) => {
        const value = Math.min(90, Math.round(progress * 90));
        if (value === lastValue && phase === lastPhase) return;
        lastValue = value;
        lastPhase = phase;
        self.postMessage({ type: 'progress', phase, value });
      });

      self.postMessage({ type: 'complete', data }, transferFields.map((f) => data[f].buffer));
    } catch (error) {
      self.postMessage({
        type: 'error',
        message: error instanceof Error ? error.message : fallbackMessage,
      });
    }
  };
}
