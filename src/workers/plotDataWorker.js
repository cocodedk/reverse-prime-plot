import { createPlotData } from '../lib/primeNumbers.js';
import { runComputeWorker } from './runComputeWorker.js';

runComputeWorker(
  ({ start, end }, onProgress) => createPlotData(start, end, onProgress),
  ['markerNumbers', 'markerReversed', 'markerStates'],
  'Plotting failed.',
);
