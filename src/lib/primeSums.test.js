import { describe, expect, it } from 'vitest';
import { createSumData, isValidTotal } from './primeSums.js';
import { MAX_LIMIT } from './primeNumbers.js';
import { PHASES } from './phases.js';

const pairsOf = (data) => Array.from(data.markerNumbers, (k, i) => [k, data.markerReversed[i]]);

describe('isValidTotal', () => {
  it.each([
    [100, true],
    [2, true],
    [MAX_LIMIT, true],
    [1, false],
    [MAX_LIMIT + 1, false],
    [10.5, false],
    [Number.NaN, false],
  ])('accepts %s as %s', (total, expected) => {
    expect(isValidTotal(total)).toBe(expected);
  });
});

describe('createSumData', () => {
  it('counts down from 100 and keeps every pair where both are prime', () => {
    const data = createSumData(100);
    expect(pairsOf(data)).toEqual([
      [97, 3], [89, 11], [83, 17], [71, 29], [59, 41], [53, 47],
      [47, 53], [41, 59], [29, 71], [17, 83], [11, 89], [3, 97],
    ]);
    expect(data.distinctPairs).toBe(6);
  });

  it('every point lies on the line k + (N - k) = N and is marked both-prime', () => {
    const data = createSumData(1000);
    pairsOf(data).forEach(([k, rest]) => expect(k + rest).toBe(1000));
    expect(data.markerStates.every((state) => state === 3)).toBe(true);
  });

  it('counts a pair of equal halves once', () => {
    // 10 = 3 + 7 = 5 + 5 = 7 + 3
    const data = createSumData(10);
    expect(pairsOf(data)).toEqual([[7, 3], [5, 5], [3, 7]]);
    expect(data.distinctPairs).toBe(2);
  });

  it('an odd total can only split as 2 + (N - 2)', () => {
    expect(pairsOf(createSumData(101))).toEqual([]);   // 99 is not prime
    expect(pairsOf(createSumData(105))).toEqual([[103, 2], [2, 103]]);
  });

  it('hands PrimePlot the interval 0..N', () => {
    const data = createSumData(100);
    expect([data.start, data.end, data.total]).toEqual([0, 100, 100]);
    // count picks the render path, so it is the number of points, not N + 1.
    expect(data.count).toBe(data.markerNumbers.length);
  });

  it('rejects a total outside the supported range', () => {
    expect(() => createSumData(MAX_LIMIT + 1)).toThrow(RangeError);
    expect(() => createSumData(1)).toThrow(RangeError);
  });

  it('reports sieving and then pairing', () => {
    const phases = new Set();
    createSumData(100, (progress, phase) => phases.add(phase));
    expect([...phases]).toEqual([PHASES.SIEVING, PHASES.CLASSIFYING, PHASES.READY]);
  });
});
