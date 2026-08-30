import { useMemo } from 'react';
import { useWorkerTask } from './useWorkerTask.js';

const createWorker = () =>
  new Worker(new URL('../workers/chainDataWorker.js', import.meta.url), { type: 'module' });

export function useChainData(start, end, divisor) {
  const request = useMemo(() => ({ divisor, end, start }), [divisor, end, start]);
  // Chain plots peak in the low thousands of markers, so drawing is cheap and
  // there is no render acknowledgement to wait on.
  const { data, status } = useWorkerTask(createWorker, request);
  return { data, ...status };
}
