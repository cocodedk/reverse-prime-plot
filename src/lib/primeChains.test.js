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

describe('createChainData', () => {
  it('keeps only seeds that produce at least one further prime pair', () => {
    const data = createChainData(0, 1000, 18);
    expect(data.chainCount).toBeGreaterThan(0);
    expect(data.markerNumbers).toHaveLength(data.chainCount);
    expect([...data.markerDepths].every((d) => d >= 1)).toBe(true);
    expect([...data.markerNumbers]).toContain(17);
    expect([...data.markerNumbers]).not.toContain(101); // palindrome, no link
  });

  it('reports the deepest chains as renderable examples', () => {
    const data = createChainData(0, 5000, 18);
    expect(data.maxDepth).toBe(2);
    const deepest = data.examples[0];
    expect(deepest.seed).toBe(1913);
    expect(deepest.steps).toHaveLength(2);
  });

  it('rejects unsupported intervals and divisors', () => {
    expect(() => createChainData(10, 10, 18)).toThrow(RangeError);
    expect(() => createChainData(0, 100, 7)).toThrow(RangeError);
    expect(isValidChainRequest(0, 100, 18)).toBe(true);
    expect(CHAIN_DIVISORS).toContain(18);
  });
});
