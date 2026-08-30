import { useCallback, useEffect, useRef, useState } from 'react';
import { PHASES } from '../lib/phases.js';

const STARTING = { error: '', isPlotting: true, phase: PHASES.STARTING, progress: 0 };

// Shared plumbing for the two compute workers: both report {progress|complete|
// error} and both are replaced wholesale when the request changes.
//
// `createWorker` must be a module-level constant containing a literal
// `new URL(..., import.meta.url)`, or Vite cannot find the worker to bundle.
// `request` must be referentially stable — memoise it in the caller.
export function useWorkerTask(createWorker, request, holdForRender = false) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(STARTING);
  // The result the hold is waiting to be told about. Comparing identity rather
  // than start/end values means a later redraw of the same plot cannot be
  // mistaken for the completion of a newer one.
  const pending = useRef(null);
  // Reset during render rather than in the effect: a setState inside an effect
  // body schedules a second render pass for something already known here.
  const [lastRequest, setLastRequest] = useState(request);
  if (request !== lastRequest) {
    setLastRequest(request);
    setStatus(STARTING);
  }

  useEffect(() => {
    const worker = createWorker();
    pending.current = null;

    worker.onmessage = ({ data: message }) => {
      if (message.type === 'progress') {
        setStatus((current) => ({
          ...current,
          phase: message.phase,
          progress: message.value,
        }));
      } else if (message.type === 'complete') {
        pending.current = holdForRender ? message.data : null;
        setData(message.data);
        setStatus(
          holdForRender
            ? { error: '', isPlotting: true, phase: PHASES.DRAWING, progress: 95 }
            : { error: '', isPlotting: false, phase: PHASES.COMPLETE, progress: 100 },
        );
        worker.terminate();
      } else if (message.type === 'error') {
        setStatus({ error: message.message, isPlotting: false, phase: PHASES.FAILED, progress: 0 });
        worker.terminate();
      }
    };

    worker.postMessage(request);
    return () => worker.terminate();
  }, [createWorker, request, holdForRender]);

  const acknowledge = useCallback((rendered) => {
    if (pending.current !== rendered) return;
    pending.current = null;
    setStatus({ error: '', isPlotting: false, phase: PHASES.COMPLETE, progress: 100 });
  }, []);

  return { acknowledge, data, status };
}
