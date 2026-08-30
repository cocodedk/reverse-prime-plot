import { createChainData } from '../lib/primeChains.js';
import { runComputeWorker } from './runComputeWorker.js';

runComputeWorker(
  ({ start, end, divisor }, onProgress) => createChainData(start, end, divisor, onProgress),
  ['markerNumbers', 'markerReversed', 'markerDepths'],
  'Chain search failed.',
);
