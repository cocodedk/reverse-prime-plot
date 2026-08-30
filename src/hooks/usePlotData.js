import { useCallback, useEffect, useState } from 'react';

export function usePlotData(start, end) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState({
    error: '',
    isPlotting: true,
    phase: 'Starting',
    progress: 0,
  });

  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/plotDataWorker.js', import.meta.url),
      { type: 'module' },
    );
    setStatus({ error: '', isPlotting: true, phase: 'Starting', progress: 0 });

    worker.onmessage = ({ data: message }) => {
      if (message.type === 'progress') {
        setStatus((current) => ({
          ...current,
          phase: message.phase,
          progress: message.value,
        }));
      } else if (message.type === 'complete') {
        setData(message.data);
        setStatus({ error: '', isPlotting: true, phase: 'Drawing plot', progress: 95 });
        worker.terminate();
      } else if (message.type === 'error') {
        setStatus({ error: message.message, isPlotting: false, phase: 'Failed', progress: 0 });
        worker.terminate();
      }
    };

    worker.postMessage({ start, end });
    return () => worker.terminate();
  }, [start, end]);

  const finishRendering = useCallback((renderedData) => {
    if (renderedData.start === start && renderedData.end === end) {
      setStatus({ error: '', isPlotting: false, phase: 'Complete', progress: 100 });
    }
  }, [end, start]);

  return { data, finishRendering, ...status };
}
