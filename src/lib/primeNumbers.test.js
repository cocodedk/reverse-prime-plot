import { describe, expect, it } from 'vitest';
import {
  createPlotData,
  isPrime,
  MAX_LIMIT,
  reverseNumber,
} from './primeNumbers.js';

describe('reverseNumber', () => {
  it('reverses digits and discards leading zeroes', () => {
    expect(reverseNumber(98)).toBe(89);
    expect(reverseNumber(100)).toBe(1);
    expect(reverseNumber(0)).toBe(0);
  });
});

describe('isPrime', () => {
  it.each([
    [0, false],
    [1, false],
    [2, true],
    [3, true],
    [9, false],
    [97, true],
  ])('classifies %i', (value, expected) => {
    expect(isPrime(value)).toBe(expected);
  });
});

describe('createPlotData', () => {
  it('stores reversed values and prime states through zero', () => {
    const data = createPlotData(0, 100);
    const markerIndex = data.markerNumbers.indexOf(13);

    expect(data.count).toBe(101);
    expect(markerIndex).toBeGreaterThan(-1);
    expect(data.markerReversed[markerIndex]).toBe(31);
    expect(data.markerStates[markerIndex]).toBe(3);
  });

  it('summarizes the sequence and visible markers', () => {
    const data = createPlotData(0, 10);

    expect(data.summary).toEqual({
      originalPrimes: 4,
      reversedPrimes: 4,
      doublePrimes: 4,
    });
    expect(data.visibleMarkerCount).toBe(4);
    expect(data.outsideCount).toBe(0);
  });

  it('enforces the supported range', () => {
    expect(() => createPlotData(-1, 10)).toThrow(RangeError);
    expect(() => createPlotData(10, 10)).toThrow(RangeError);
    expect(() => createPlotData(0, MAX_LIMIT + 1)).toThrow(RangeError);
  });

  it('reports progress through all computation phases', () => {
    const reports = [];
    createPlotData(100, 200, (progress, phase) => reports.push([progress, phase]));
    expect(reports.at(-1)).toEqual([1, 'Ready']);
    expect(new Set(reports.map(([, phase]) => phase))).toEqual(
      new Set([
        'Reversing digits',
        'Finding primes',
        'Classifying points',
        'Preparing markers',
        'Ready',
      ]),
    );
  });
});
