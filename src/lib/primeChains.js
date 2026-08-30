import { createPrimeTable, MAX_LIMIT, reverseNumber } from './primeNumbers.js';

export { MAX_LIMIT };

// A number and its digit reversal are congruent to the same digit sum mod 9, so
// 9 always divides their difference. When both are odd primes the difference is
// also even, so the true forced factor is 18 and the raw difference can never be
// prime. Divisor 1 is the literal rule — kept so the page can demonstrate that
// it yields nothing — and 18 divides the forced factor out.
export const CHAIN_DIVISORS = [1, 9, 18];
const MAX_CHAIN_DEPTH = 64;

export function isValidChainRequest(start, end, divisor) {
  return (
    Number.isInteger(start) &&
    Number.isInteger(end) &&
    start >= 0 &&
    start < end &&
    end <= MAX_LIMIT &&
    CHAIN_DIVISORS.includes(divisor)
  );
}

// Walks seed -> |n - reverse(n)| / divisor for as long as each step lands on a
// number that is prime and whose reversal is prime. Returns every link, so the
// caller can render the chain as well as count it.
export function chainSteps(seed, divisor, isPrime) {
  const steps = [];
  let current = seed;

  while (steps.length < MAX_CHAIN_DEPTH) {
    const reversed = reverseNumber(current);
    if (!isPrime(current) || !isPrime(reversed)) break;

    const difference = Math.abs(current - reversed);
    if (difference === 0 || difference % divisor !== 0) break;

    const next = difference / divisor;
    if (!isPrime(next) || !isPrime(reverseNumber(next))) break;

    steps.push({ from: current, reversed, difference, next });
    current = next;
  }
  return steps;
}

export function chainDepth(seed, divisor, isPrime) {
  return chainSteps(seed, divisor, isPrime).length;
}

function maxReversalIn(start, end, onProgress) {
  let limit = end;
  for (let value = start; value <= end; value += 1) {
    const reversed = reverseNumber(value);
    if (reversed > limit) limit = reversed;
    if ((value - start) % 200_000 === 0) {
      onProgress((value - start) / (end - start + 1), 'Scanning reversals');
    }
  }
  return limit;
}

export function createChainData(start, end, divisor, onProgress = () => {}) {
  if (!isValidChainRequest(start, end, divisor)) {
    throw new RangeError(
      `chain request must satisfy 0 <= start < end <= ${MAX_LIMIT} and divisor in ${CHAIN_DIVISORS}`,
    );
  }

  const tableLimit = maxReversalIn(start, end, (progress, phase) =>
    onProgress(progress * 0.25, phase),
  );
  const primes = createPrimeTable(tableLimit, (progress) =>
    onProgress(0.25 + progress * 0.35, 'Finding primes'),
  );
  // Chain values never exceed max(current, reverse(current)), so they stay
  // inside the table; the bound check keeps that assumption honest.
  const isPrime = (value) => value >= 0 && value <= tableLimit && primes[value] === 1;

  const count = end - start + 1;
  const seeds = [];
  let seedCount = 0;
  let maxDepth = 0;
  const depthHistogram = {};

  for (let value = start; value <= end; value += 1) {
    const reversed = reverseNumber(value);
    if (isPrime(value) && isPrime(reversed)) {
      seedCount += 1;
      const depth = chainDepth(value, divisor, isPrime);
      if (depth > 0) {
        seeds.push([value, reversed, depth]);
        depthHistogram[depth] = (depthHistogram[depth] ?? 0) + 1;
        if (depth > maxDepth) maxDepth = depth;
      }
    }
    if ((value - start) % 100_000 === 0) {
      onProgress(0.6 + ((value - start) / count) * 0.4, 'Following chains');
    }
  }
  onProgress(1, 'Ready');

  const markerNumbers = new Uint32Array(seeds.length);
  const markerReversed = new Uint32Array(seeds.length);
  const markerDepths = new Uint8Array(seeds.length);
  // chains[i] describes marker i, so a click on the plot maps straight to a
  // chain without recomputing anything on the main thread.
  const chains = seeds.map(([value, reversed, depth], index) => {
    markerNumbers[index] = value;
    markerReversed[index] = reversed;
    markerDepths[index] = depth;
    return { depth, reversed, seed: value, steps: chainSteps(value, divisor, isPrime) };
  });

  return {
    chainCount: seeds.length,
    chains,
    count,
    depthHistogram,
    divisor,
    end,
    markerDepths,
    markerNumbers,
    markerReversed,
    maxDepth,
    seedCount,
    start,
  };
}
