export const MAX_LIMIT = 10_000_000;
const PROGRESS_CHUNK = 100_000;

export function reverseNumber(value) {
  let remaining = value;
  let reversed = 0;

  do {
    reversed = reversed * 10 + (remaining % 10);
    remaining = Math.floor(remaining / 10);
  } while (remaining > 0);

  return reversed;
}

export function isPrime(value) {
  if (!Number.isInteger(value) || value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;

  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function createPrimeTable(maximum, onProgress) {
  const primes = new Uint8Array(maximum + 1);
  primes.fill(1, 2);
  const root = Math.floor(Math.sqrt(maximum));

  for (let candidate = 2; candidate <= root; candidate += 1) {
    if (candidate % 50 === 0) onProgress(candidate / root);
    if (!primes[candidate]) continue;
    for (let multiple = candidate * candidate; multiple <= maximum; multiple += candidate) {
      primes[multiple] = 0;
    }
  }
  onProgress(1);
  return primes;
}

export function createPlotData(start, end, onProgress = () => {}) {
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    start >= end ||
    end > MAX_LIMIT
  ) {
    throw new RangeError(`interval must satisfy 0 <= start < end <= ${MAX_LIMIT}`);
  }

  const count = end - start + 1;
  const reversed = new Uint32Array(count);
  let primeTableLimit = end;

  for (let index = 0; index < count; index += 1) {
    reversed[index] = reverseNumber(start + index);
    primeTableLimit = Math.max(primeTableLimit, reversed[index]);
    if ((index + 1) % PROGRESS_CHUNK === 0) {
      onProgress(((index + 1) / count) * 0.3, 'Reversing digits');
    }
  }
  onProgress(0.3, 'Reversing digits');

  const primes = createPrimeTable(primeTableLimit, (progress) => {
    onProgress(0.3 + progress * 0.4, 'Finding primes');
  });
  const states = new Uint8Array(count);
  const summary = { originalPrimes: 0, reversedPrimes: 0, doublePrimes: 0 };
  let outsideCount = 0;
  let visibleMarkerCount = 0;

  for (let index = 0; index < count; index += 1) {
    const number = start + index;
    const numberIsPrime = primes[number] === 1;
    const reversedIsPrime = primes[reversed[index]] === 1;
    states[index] = Number(numberIsPrime) | (Number(reversedIsPrime) << 1);
    summary.originalPrimes += Number(numberIsPrime);
    summary.reversedPrimes += Number(reversedIsPrime);
    summary.doublePrimes += Number(numberIsPrime && reversedIsPrime);
    const isInside = reversed[index] >= start && reversed[index] <= end;
    outsideCount += Number(!isInside);
    visibleMarkerCount += Number(states[index] > 0 && isInside);
    if ((index + 1) % PROGRESS_CHUNK === 0) {
      onProgress(0.7 + ((index + 1) / count) * 0.25, 'Classifying points');
    }
  }
  onProgress(0.95, 'Classifying points');

  const markerNumbers = new Uint32Array(visibleMarkerCount);
  const markerReversed = new Uint32Array(visibleMarkerCount);
  const markerStates = new Uint8Array(visibleMarkerCount);
  let markerIndex = 0;
  for (let index = 0; index < count; index += 1) {
    const isInside = reversed[index] >= start && reversed[index] <= end;
    if (states[index] > 0 && isInside) {
      markerNumbers[markerIndex] = start + index;
      markerReversed[markerIndex] = reversed[index];
      markerStates[markerIndex] = states[index];
      markerIndex += 1;
    }
    if ((index + 1) % PROGRESS_CHUNK === 0) {
      onProgress(0.95 + ((index + 1) / count) * 0.05, 'Preparing markers');
    }
  }
  onProgress(1, 'Preparing markers');
  onProgress(1, 'Ready');

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
