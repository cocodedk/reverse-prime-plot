import { describe, expect, it } from 'vitest';
import { dayOf } from './calendars.js';
import { chanceOfMost, CYCLE_TESTS, cycleSummary, expectedMost, PERIODS } from './eventCycles.js';

const FROM = dayOf('1900-01-01');
const TO = dayOf('2026-11-05');
const PRECISION = 12;

// Every way to pick `size` of `items`, for checking the counting by brute force.
function* subsets(items, size, start = 0) {
  if (size === 0) { yield []; return; }
  for (let index = start; index <= items.length - size; index += 1) {
    for (const rest of subsets(items, size - 1, index + 1)) yield [items[index], ...rest];
  }
}

const busiest = (years, period) => Math.max(...Object.values(Object.groupBy(years, (year) => year % period)).map((group) => group.length));
const sizesOf = (range, period) => Array.from({ length: period }, (_, point) => range.filter((year) => year % period === point).length);
const eventsIn = (...isos) => isos.map((iso) => ({ day: dayOf(iso) }));

describe('chanceOfMost and expectedMost', () => {
  it('match every possible draw counted one by one', () => {
    const range = Array.from({ length: 16 }, (_, index) => 2000 + index);
    for (const [period, drawn] of [[2, 4], [3, 5], [4, 6], [5, 6]]) {
      const draws = [...subsets(range, drawn)].map((years) => busiest(years, period));
      for (let most = 0; most <= drawn + 1; most += 1) {
        const share = draws.filter((count) => count >= most).length / draws.length;
        expect(chanceOfMost(sizesOf(range, period), drawn, most)).toBeCloseTo(share, PRECISION);
      }
      const mean = draws.reduce((sum, count) => sum + count, 0) / draws.length;
      expect(expectedMost(sizesOf(range, period), drawn)).toBeCloseTo(mean, PRECISION);
    }
  });
});

describe('cycleSummary', () => {
  it('tests every cycle from 2 to 12 years in each calendar', () => {
    expect(PERIODS).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(CYCLE_TESTS).toBe(33);
    const summary = cycleSummary(eventsIn('1979-02-11'), FROM, TO);
    expect(Object.keys(summary)).toEqual(['gregorian', 'jalali', 'ghamari']);
    expect(Object.keys(summary.gregorian).map(Number)).toEqual(PERIODS);
  });

  it('scores a single year as certain to happen by chance', () => {
    const cell = cycleSummary(eventsIn('1979-02-11'), FROM, TO).gregorian[4];
    expect(cell).toMatchObject({ hits: 1, trials: 1, years: [1979], different: false });
    expect(cell.expected).toBeCloseTo(1, PRECISION);
    expect(cell.p).toBeCloseTo(1, PRECISION);
  });

  it('flags a perfect four-year cycle and names its years', () => {
    const years = Array.from({ length: 30 }, (_, index) => 1906 + 4 * index);
    const cell = cycleSummary(eventsIn(...years.map((year) => `${year}-06-01`)), FROM, TO).gregorian[4];
    expect(cell).toMatchObject({ hits: 30, trials: 30, years, different: true });
    expect(cell.p).toBeLessThan(1e-9);
    expect(cell.expected).toBeGreaterThan(7.5);
    expect(cell.expected).toBeLessThan(30);
  });

  it('counts a year once however many events it holds', () => {
    const cell = cycleSummary(eventsIn('1979-01-16', '1979-02-11', '1979-04-01', '1980-09-22'), FROM, TO).gregorian[2];
    expect(cell).toMatchObject({ hits: 1, trials: 2 });
  });

  it('reads each calendar\'s own years', () => {
    // 11 February 1979 is 22 Bahman 1357 and 14 Rabi al-Awwal 1399.
    const summary = cycleSummary(eventsIn('1979-02-11'), FROM, TO);
    expect(summary.jalali[2].years).toEqual([1357]);
    expect(summary.ghamari[2].years).toEqual([1399]);
  });
});
