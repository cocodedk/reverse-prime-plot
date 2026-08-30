import { describe, expect, it } from 'vitest';
import {
  createPlotData,
  isValidInterval,
  MAX_LIMIT,
  reverseNumber,
} from './primeNumbers.js';
import { PHASES } from './phases.js';

describe('reverseNumber', () => {
  it('reverses digits and discards leading zeroes', () => {
    expect(reverseNumber(98)).toBe(89);
    expect(reverseNumber(100)).toBe(1);
    expect(reverseNumber(0)).toBe(0);
  });
});

describe('isValidInterval', () => {
  it.each([
    [0, 100, true],
    [0, MAX_LIMIT, true],
    [-1, 10, false],
    [10, 10, false],
    [20, 10, false],
    [0, MAX_LIMIT + 1, false],
    [0.5, 10, false],
  ])('accepts %i-%i as %s', (start, end, expected) => {
    expect(isValidInterval(start, end)).toBe(expected);
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

  it('excludes markers whose reversal falls outside the interval', () => {
    const data = createPlotData(10, 30);

    // 19 is prime, but reverse(19) = 91 sits above the interval, so it is dropped.
    expect(data.outsideCount).toBeGreaterThan(0);
    expect([...data.markerNumbers]).not.toContain(19);
    expect([...data.markerReversed].every((value) => value >= 10 && value <= 30)).toBe(true);
    expect(data.markerNumbers).toHaveLength(data.visibleMarkerCount);
  });

  it('enforces the supported range', () => {
    expect(() => createPlotData(-1, 10)).toThrow(RangeError);
    expect(() => createPlotData(10, 10)).toThrow(RangeError);
    expect(() => createPlotData(0, MAX_LIMIT + 1)).toThrow(RangeError);
  });

  it('reports progress through all computation phases', () => {
    const reports = [];
    createPlotData(100, 200, (progress, phase) => reports.push([progress, phase]));
    expect(reports.at(-1)).toEqual([1, PHASES.READY]);
    expect(new Set(reports.map(([, phase]) => phase))).toEqual(
      new Set([
        PHASES.REVERSING,
        PHASES.SIEVING,
        PHASES.CLASSIFYING,
        PHASES.MARKERS,
        PHASES.READY,
      ]),
    );
  });
});
