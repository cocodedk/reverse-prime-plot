import { useMemo } from 'react';
import { useWorkerTask } from './useWorkerTask.js';

const createWorker = () =>
  new Worker(new URL('../workers/sumDataWorker.js', import.meta.url), { type: 'module' });

export function useSumData(total) {
  const request = useMemo(() => ({ total }), [total]);
  // Held until PrimePlot acknowledges the draw, as on the main page.
  const { acknowledge, data, status } = useWorkerTask(createWorker, request, true);

  return { data, finishRendering: acknowledge, ...status };
}
