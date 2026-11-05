import { PHASES } from './phases.js';
import { MAX_LIMIT, PrimeTable } from './primeNumbers.js';

// Below 2 there is nothing to count down from.
export const MIN_TOTAL = 2;
const BOTH_PRIME = 3;
const SIEVE_SHARE = 0.6;
const PROGRESS_STRIDE = 1_000_000;

export function isValidTotal(total) {
  return Number.isInteger(total) && total >= MIN_TOTAL && total <= MAX_LIMIT;
}

// Counts k down from N - 1 to 1 and keeps every k where both k and N - k are
// prime. The result has the shape PrimePlot draws for the main page — the
// interval 0..N, k on x, N - k on y, every marker both-prime — so the canvas
// renderer is reused unchanged. Each pair appears twice, once in each order.
export function createSumData(total, onProgress = () => {}) {
  if (!isValidTotal(total)) {
    throw new RangeError(`total must be a whole number from ${MIN_TOTAL} to ${MAX_LIMIT}`);
  }

  const primes = new PrimeTable(total, (progress) => onProgress(progress * SIEVE_SHARE, PHASES.SIEVING));
  const found = [];
  for (let k = total - 1; k >= 1; k -= 1) {
    if (primes.has(k) && primes.has(total - k)) found.push(k);
    if (k % PROGRESS_STRIDE === 0) {
      onProgress(SIEVE_SHARE + (1 - k / total) * (1 - SIEVE_SHARE), PHASES.CLASSIFYING);
    }
  }
  onProgress(1, PHASES.CLASSIFYING);
  onProgress(1, PHASES.READY);

  const markerNumbers = Uint32Array.from(found);
  const markerReversed = markerNumbers.map((k) => total - k);
  return {
    // usesPixelReadback reads count to pick the render path. A sums plot holds
    // few points over a wide interval, so it counts points, not N + 1.
    count: found.length,
    // N / 2 + N / 2 is one pair drawn once; every other pair is drawn twice.
    distinctPairs: Math.ceil(found.length / 2),
    end: total,
    markerNumbers,
    markerReversed,
    markerStates: new Uint8Array(found.length).fill(BOTH_PRIME),
    start: 0,
    total,
  };
}
