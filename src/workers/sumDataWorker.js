import { createSumData } from '../lib/primeSums.js';
import { runComputeWorker } from './runComputeWorker.js';

runComputeWorker(
  ({ total }, onProgress) => createSumData(total, onProgress),
  ['markerNumbers', 'markerReversed', 'markerStates'],
  'Plotting failed.',
);
