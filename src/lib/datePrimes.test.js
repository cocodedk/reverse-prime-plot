import { describe, expect, it } from 'vitest';
import { dayOf } from './calendars.js';
import { binomialP, chanceRates, isPrime, MARKS, primeMarks, primeSummary } from './datePrimes.js';

const FROM = dayOf('1900-01-01');
const TO = dayOf('2026-11-05');

describe('isPrime', () => {
  it('sorts small numbers and dates', () => {
    expect([0, 1, 2, 3, 4, 9, 11, 1979, 9791, 1399, 9931].map(isPrime))
      .toEqual([false, false, true, true, false, false, true, true, true, true, true]);
    expect(isPrime(19_790_201)).toBe(true);
    expect(isPrime(19_790_211)).toBe(false);
  });
});

describe('primeMarks', () => {
  it('marks the revolution\'s year both ways in two calendars', () => {
    expect(primeMarks('1979-02-11')).toEqual({ year: true, yearReversed: true, date: false });
    expect(primeMarks('1399-03-14')).toEqual({ year: true, yearReversed: true, date: false });
    expect(primeMarks('1357-11-22')).toEqual({ year: false, yearReversed: false, date: false });
  });

  it('reads the whole date as YYYYMMDD', () => {
    expect(primeMarks('1979-02-01').date).toBe(true);
  });

  it('needs the year itself prime before its reversal counts', () => {
    expect(primeMarks('1907-01-02')).toEqual({ year: true, yearReversed: false, date: false });
  });
});

describe('chanceRates', () => {
  it('matches a count of the Gregorian years by hand', () => {
    // 1900–2026 holds 16 prime years, 5 of them prime both ways (1901, 1913, 1933, 1949, 1979).
    const rates = chanceRates('gregorian', FROM, TO);
    expect(rates.year).toBeCloseTo(16 / 127);
    expect(rates.yearReversed).toBeCloseTo(5 / 127);
  });

  it('counts a whole date in every calendar', () => {
    for (const name of ['gregorian', 'jalali', 'ghamari']) {
      const { date } = chanceRates(name, FROM, TO);
      expect(date).toBeGreaterThan(0.04);
      expect(date).toBeLessThan(0.08);
    }
  });

  it('agrees with a day-by-day count over a short range', () => {
    // Across a month end: of 19790129 to 19790202, 19790131 and 19790201 are prime.
    expect([19_790_129, 19_790_130, 19_790_131, 19_790_201, 19_790_202].filter(isPrime)).toEqual([19_790_131, 19_790_201]);
    expect(chanceRates('gregorian', dayOf('1979-01-29'), dayOf('1979-02-02')).date).toBeCloseTo(2 / 5);
  });
});

describe('binomialP', () => {
  it('is 1 for the most likely count and small far from it', () => {
    expect(binomialP(5, 10, 0.5)).toBeCloseTo(1);
    expect(binomialP(0, 10, 0.5)).toBeCloseTo(2 / 1024);
    expect(binomialP(10, 10, 0.5)).toBeCloseTo(2 / 1024);
  });
});

const event = (iso) => ({ day: dayOf(iso) });

describe('primeSummary', () => {
  it('counts a busy year once', () => {
    const events = ['1979-01-16', '1979-02-11', '1979-04-01', '1980-09-22'].map(event);
    const { gregorian } = primeSummary(events, FROM, TO);
    expect(gregorian.year).toMatchObject({ hits: 1, trials: 2 });
    expect(gregorian.date).toMatchObject({ trials: 4 });
  });

  it('reports every calendar and mark', () => {
    const summary = primeSummary([event('1979-02-11')], FROM, TO);
    for (const marks of Object.values(summary)) {
      expect(Object.keys(marks)).toEqual(MARKS);
      expect(marks.year.different).toBe(false);
    }
  });
});
