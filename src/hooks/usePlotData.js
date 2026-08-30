import { useMemo } from 'react';
import { useWorkerTask } from './useWorkerTask.js';

const createWorker = () =>
  new Worker(new URL('../workers/plotDataWorker.js', import.meta.url), { type: 'module' });

export function usePlotData(start, end) {
  const request = useMemo(() => ({ end, start }), [end, start]);
  // Dense plots take long enough to draw that the bar would otherwise read 100%
  // while the canvas is still blank, so the status waits for PrimePlot's ack.
  const { acknowledge, data, status } = useWorkerTask(createWorker, request, true);

  return { data, finishRendering: acknowledge, ...status };
}
