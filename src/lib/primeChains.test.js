import { describe, expect, it } from 'vitest';
import {
  chainSteps,
  CHAIN_DIVISORS,
  createChainData,
  isValidChainRequest,
} from './primeChains.js';

const isPrimeUpTo = (limit) => {
  const table = new Uint8Array(limit + 1).fill(1);
  table[0] = 0;
  table[1] = 0;
  for (let i = 2; i * i <= limit; i += 1) {
    if (table[i]) for (let j = i * i; j <= limit; j += i) table[j] = 0;
  }
  return (value) => value >= 0 && value <= limit && table[value] === 1;
};
const isPrime = isPrimeUpTo(2_000_000);

describe('the literal difference rule is provably empty', () => {
  // n and reverse(n) share a digit sum, so 9 | (n - reverse(n)); both being odd
  // primes makes it even too. A multiple of 18 is never prime.
  it('never links, because the difference is always a multiple of 18', () => {
    const data = createChainData(0, 20_000, 1);
    expect(data.seedCount).toBeGreaterThan(0);
    expect(data.chainCount).toBe(0);
  });

  it.each([13, 17, 37, 79, 1913, 769309])('%i has a difference divisible by 18', (seed) => {
    const reversed = Number([...String(seed)].reverse().join(''));
    expect(Math.abs(seed - reversed) % 18).toBe(0);
  });
});

describe('chainSteps with the forced factor divided out', () => {
  it('follows 1913 -> 71 -> 3', () => {
    const steps = chainSteps(1913, 18, isPrime);
    expect(steps.map((s) => s.next)).toEqual([71, 3]);
    expect(steps[0]).toMatchObject({ from: 1913, reversed: 3191, difference: 1278 });
    expect(steps[1]).toMatchObject({ from: 71, reversed: 17, difference: 54 });
  });

  it('follows 769309 -> 7481 -> 313', () => {
    expect(chainSteps(769309, 18, isPrime).map((s) => s.next)).toEqual([7481, 313]);
  });

  it('stops on a palindromic prime, whose difference is zero', () => {
    expect(chainSteps(101, 18, isPrime)).toEqual([]);
  });

  it('stops when the seed is not itself a both-prime pair', () => {
    expect(chainSteps(23, 18, isPrime)).toEqual([]); // 32 is not prime
  });
});

// A number and its reversal are congruent mod 11 when the digit count is odd,
// because each digit and its mirror sit an even number of places apart. So an
// odd digit count forces an extra factor of 11 into the difference, the /18
// quotient inherits it, and the quotient can only be prime if it equals 11.
describe('digit count decides whether chains can exist at all', () => {
  it('finds no chains among 5-digit seeds', () => {
    const data = createChainData(10_000, 99_999, 18);
    expect(data.seedCount).toBeGreaterThan(0);
    expect(data.chainCount).toBe(0);
  });

  it('finds chains among 4-digit seeds', () => {
    const data = createChainData(1_000, 9_999, 18);
    expect(data.chainCount).toBeGreaterThan(0);
    expect([...data.markerNumbers]).toContain(1913);
  });

  it('only ever reaches 11 from an odd-digit seed', () => {
    // 113 -> 311 differ by 198, and 198/18 = 11, the one prime a 3-digit seed
    // can produce. Every other odd-digit quotient is a larger multiple of 11.
    expect(chainSteps(113, 18, isPrime).map((step) => step.next)).toEqual([11]);
  });
});

describe('createChainData', () => {
  it('keeps only seeds that produce at least one further prime pair', () => {
    const data = createChainData(0, 1000, 18);
    expect(data.chainCount).toBeGreaterThan(0);
    expect(data.markerNumbers).toHaveLength(data.chainCount);
    expect([...data.markerDepths].every((d) => d >= 1)).toBe(true);
    expect([...data.markerNumbers]).toContain(17);
    expect([...data.markerNumbers]).not.toContain(101); // palindrome, no link
  });

  it('returns one chain per plotted marker, in marker order', () => {
    const data = createChainData(0, 5000, 18);
    expect(data.chains).toHaveLength(data.chainCount);
    data.chains.forEach((chain, index) => {
      expect(chain.seed).toBe(data.markerNumbers[index]);
      expect(chain.depth).toBe(data.markerDepths[index]);
      expect(chain.steps).toHaveLength(chain.depth);
    });
  });

  it('records the deepest chain in full', () => {
    const data = createChainData(0, 5000, 18);
    expect(data.maxDepth).toBe(2);
    const deepest = data.chains.find((c) => c.seed === 1913);
    expect(deepest.steps.map((s) => s.next)).toEqual([71, 3]);
  });

  it('rejects unsupported intervals and divisors', () => {
    expect(() => createChainData(10, 10, 18)).toThrow(RangeError);
    expect(() => createChainData(0, 100, 7)).toThrow(RangeError);
    expect(isValidChainRequest(0, 100, 18)).toBe(true);
    expect(CHAIN_DIVISORS).toContain(18);
  });
});
