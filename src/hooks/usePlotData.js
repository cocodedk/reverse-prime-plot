import { useCallback, useMemo } from 'react';
import { useWorkerTask } from './useWorkerTask.js';

const createWorker = () =>
  new Worker(new URL('../workers/plotDataWorker.js', import.meta.url), { type: 'module' });

export function usePlotData(start, end) {
  const request = useMemo(() => ({ end, start }), [end, start]);
  // Dense plots take long enough to draw that the bar would otherwise read 100%
  // while the canvas is still blank, so the status waits for PrimePlot's ack.
  const { data, setStatus, status } = useWorkerTask(createWorker, request, true);

  const finishRendering = useCallback((renderedData) => {
    if (renderedData.start === start && renderedData.end === end) {
      setStatus({ error: '', isPlotting: false, phase: 'Complete', progress: 100 });
    }
  }, [end, setStatus, start]);

  return { data, finishRendering, ...status };
}
