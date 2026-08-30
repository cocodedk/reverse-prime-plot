export const MAX_LIMIT = 10_000_000;
const PROGRESS_CHUNK = 100_000;

export function reverseNumber(value) {
  let remaining = value;
  let reversed = 0;

  do {
    const digit = remaining % 10;
    reversed = reversed * 10 + digit;
    remaining = (remaining - digit) / 10;
  } while (remaining > 0);

  return reversed;
}

export function createPrimeTable(maximum, onProgress) {
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
      onProgress(0.7 + ((index + 1) / count) * 0.25, 'Classifying points');
    }
  }
  onProgress(0.95, 'Classifying points');

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
