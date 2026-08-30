import { useEffect, useState } from 'react';

const STARTING = { error: '', isPlotting: true, phase: 'Starting', progress: 0 };

// Shared plumbing for the two compute workers: both report {progress|complete|
// error} and both are replaced wholesale when the request changes.
//
// `createWorker` must be a module-level constant containing a literal
// `new URL(..., import.meta.url)`, or Vite cannot find the worker to bundle.
// `request` must be referentially stable — memoise it in the caller.
export function useWorkerTask(createWorker, request, holdForRender = false) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(STARTING);

  useEffect(() => {
    const worker = createWorker();
    setStatus(STARTING);

    worker.onmessage = ({ data: message }) => {
      if (message.type === 'progress') {
        setStatus((current) => ({
          ...current,
          phase: message.phase,
          progress: message.value,
        }));
      } else if (message.type === 'complete') {
        setData(message.data);
        setStatus(
          holdForRender
            ? { error: '', isPlotting: true, phase: 'Drawing plot', progress: 95 }
            : { error: '', isPlotting: false, phase: 'Complete', progress: 100 },
        );
        worker.terminate();
      } else if (message.type === 'error') {
        setStatus({ error: message.message, isPlotting: false, phase: 'Failed', progress: 0 });
        worker.terminate();
      }
    };

    worker.postMessage(request);
    return () => worker.terminate();
  }, [createWorker, request, holdForRender]);

  return { data, setStatus, status };
}
