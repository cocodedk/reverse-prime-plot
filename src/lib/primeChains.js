import { PHASES } from './phases.js';
import { PrimeTable, reverseNumber } from './primeNumbers.js';

// The chains page reaches ten times further than the plot. It never stores a
// value per number in the interval — only the handful of seeds that chain — so
// its ceiling is set by the bit-packed prime table, not by per-number arrays.
// 100,000,000 covers every 8-digit number, which is where chains reappear.
export const CHAIN_MAX_LIMIT = 100_000_000;

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
    end <= CHAIN_MAX_LIMIT &&
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

// Any value with at most D digits reverses to at most 10^D - 1, so the sieve's
// upper bound follows from the digit count alone. Walking the whole interval to
// discover it cost about half the total run at the ceiling.
function reversalBound(end) {
  let power = 1;
  while (power <= end) power *= 10;
  if (end === power / 10) return end;   // an exact power of ten reverses to 1
  return power - 1;
}

export function createChainData(start, end, divisor, onProgress = () => {}) {
  if (!isValidChainRequest(start, end, divisor)) {
    throw new RangeError(
      `chain request must satisfy 0 <= start < end <= ${CHAIN_MAX_LIMIT} and divisor in ${CHAIN_DIVISORS}`,
    );
  }

  const tableLimit = reversalBound(end);
  const primes = new PrimeTable(tableLimit, (progress) =>
    onProgress(progress * 0.35, PHASES.SIEVING),
  );

  const seeds = [];
  let seedCount = 0;
  let maxDepth = 0;

  // Primality is a bit test; reversing is arithmetic. Testing first means the
  // ~95% of values that are composite never get reversed at all.
  const consider = (value) => {
    const reversed = reverseNumber(value);
    if (!primes.has(reversed)) return;
    seedCount += 1;
    const steps = chainSteps(value, divisor, (v) => primes.has(v));
    if (steps.length === 0) return;
    seeds.push([value, reversed, steps]);
    if (steps.length > maxDepth) maxDepth = steps.length;
  };

  if (start <= 2 && end >= 2) consider(2);
  const firstOdd = start % 2 === 0 ? start + 1 : start;
  for (let value = firstOdd; value <= end; value += 2) {
    if (primes.has(value)) consider(value);
    if ((value - firstOdd) % 400_000 === 1) {
      onProgress(0.35 + ((value - start) / (end - start + 1)) * 0.65, PHASES.FOLLOWING);
    }
  }
  onProgress(1, PHASES.READY);

  const markerNumbers = new Uint32Array(seeds.length);
  const markerReversed = new Uint32Array(seeds.length);
  const markerDepths = new Uint8Array(seeds.length);
  // chains[i] describes marker i, so a click on the plot maps straight to a
  // chain without recomputing anything on the main thread.
  const chains = seeds.map(([value, reversed, steps], index) => {
    markerNumbers[index] = value;
    markerReversed[index] = reversed;
    markerDepths[index] = steps.length;
    return { depth: steps.length, reversed, seed: value, steps };
  });

  return {
    chainCount: seeds.length,
    chains,
    end,
    markerDepths,
    markerNumbers,
    markerReversed,
    maxDepth,
    seedCount,
    start,
  };
}
