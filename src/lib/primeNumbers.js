import { PHASES } from './phases.js';
export const MAX_LIMIT = 10_000_000;
const PROGRESS_CHUNK = 100_000;

export function reverseNumber(value) {
  let remaining = value;
  let reversed = 0;

  // `| 0` truncates through int32, which is exact for everything below 2^31 and
  // so covers the whole supported domain (CHAIN_MAX_LIMIT is 100,000,000). It is
  // measurably faster than a float divide on the hottest loop in the app.
  do {
    reversed = reversed * 10 + (remaining % 10);
    remaining = (remaining / 10) | 0;
  } while (remaining > 0);

  return reversed;
}

// Odds-only bit-packed sieve: one bit per odd number, so a table up to 100
// million costs about 6 MB rather than 95 MB. `has` is the only accessor;
// callers must not index the buffer directly.
export class PrimeTable {
  constructor(maximum, onProgress = () => {}) {
    this.maximum = maximum;
    this.bits = new Uint8Array((maximum >> 4) + 1).fill(0xff);
    const root = Math.floor(Math.sqrt(maximum));

    for (let candidate = 3; candidate <= root; candidate += 2) {
      if (candidate % 50 === 1) onProgress(candidate / root);
      if (!this.has(candidate)) continue;
      for (let multiple = candidate * candidate; multiple <= maximum; multiple += candidate * 2) {
        this.bits[multiple >> 4] &= ~(1 << ((multiple >> 1) & 7));
      }
    }
    onProgress(1);
  }

  has(value) {
    if (value < 2 || value > this.maximum) return false;
    if (value === 2) return true;
    if ((value & 1) === 0) return false;
    return (this.bits[value >> 4] & (1 << ((value >> 1) & 7))) !== 0;
  }
}

export function isValidInterval(start, end) {
  return (
    Number.isInteger(start) &&
    Number.isInteger(end) &&
    start >= 0 &&
    start < end &&
    end <= MAX_LIMIT
  );
}

export function createPlotData(start, end, onProgress = () => {}) {
  if (!isValidInterval(start, end)) {
    throw new RangeError(`interval must satisfy 0 <= start < end <= ${MAX_LIMIT}`);
  }

  const count = end - start + 1;
  const reversed = new Uint32Array(count);
  let primeTableLimit = end;

  for (let index = 0; index < count; index += 1) {
    const value = reverseNumber(start + index);
    reversed[index] = value;
    if (value > primeTableLimit) primeTableLimit = value;
    if ((index + 1) % PROGRESS_CHUNK === 0) {
      onProgress(((index + 1) / count) * 0.3, PHASES.REVERSING);
    }
  }
  onProgress(0.3, PHASES.REVERSING);

  const primes = new PrimeTable(primeTableLimit, (progress) => {
    onProgress(0.3 + progress * 0.4, PHASES.SIEVING);
  });
  const states = new Uint8Array(count);
  const summary = { originalPrimes: 0, reversedPrimes: 0, doublePrimes: 0 };
  let outsideCount = 0;
  let visibleMarkerCount = 0;

  for (let index = 0; index < count; index += 1) {
    const number = start + index;
    const numberIsPrime = primes.has(number);
    const reversedIsPrime = primes.has(reversed[index]);
    summary.originalPrimes += Number(numberIsPrime);
    summary.reversedPrimes += Number(reversedIsPrime);
    summary.doublePrimes += Number(numberIsPrime && reversedIsPrime);
    const isInside = reversed[index] >= start && reversed[index] <= end;
    outsideCount += Number(!isInside);
    // States carry visibility: markers outside the interval are zeroed here so
    // the marker pass below never repeats the range check.
    states[index] = isInside ? Number(numberIsPrime) | (Number(reversedIsPrime) << 1) : 0;
    visibleMarkerCount += Number(states[index] > 0);
    if ((index + 1) % PROGRESS_CHUNK === 0) {
      onProgress(0.7 + ((index + 1) / count) * 0.25, PHASES.CLASSIFYING);
    }
  }
  onProgress(0.95, PHASES.CLASSIFYING);

  const markerNumbers = new Uint32Array(visibleMarkerCount);
  const markerReversed = new Uint32Array(visibleMarkerCount);
  const markerStates = new Uint8Array(visibleMarkerCount);
  let markerIndex = 0;
  for (let index = 0; index < count; index += 1) {
    if (states[index] > 0) {
      markerNumbers[markerIndex] = start + index;
      markerReversed[markerIndex] = reversed[index];
      markerStates[markerIndex] = states[index];
      markerIndex += 1;
    }
    if ((index + 1) % PROGRESS_CHUNK === 0) {
      onProgress(0.95 + ((index + 1) / count) * 0.05, PHASES.MARKERS);
    }
  }
  onProgress(1, PHASES.MARKERS);
  onProgress(1, PHASES.READY);

  return {
    count,
    end,
    markerNumbers,
    markerReversed,
    markerStates,
    outsideCount,
    start,
    summary,
    visibleMarkerCount,
  };
}
