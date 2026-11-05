import { CALENDAR_NAMES, isoIn, yearOfIso, yearsIn } from './calendars.js';
import { SIGNIFICANCE } from './datePrimes.js';

// The cycle lengths tested, in years: every 2 years up to every 12.
const SHORTEST = 2;
const LONGEST = 12;
export const PERIODS = Array.from({ length: LONGEST - SHORTEST + 1 }, (_, index) => SHORTEST + index);
// One test per calendar and cycle length; they share the 0.05.
export const CYCLE_TESTS = CALENDAR_NAMES.length * PERIODS.length;

// Pascal's triangle in doubles, grown as needed. The largest entry the ranges
// need, C(132, 66), is about 4e38: far inside a double's range, so every count
// below is exact to about 1e-15.
const triangle = [[1]];
function choose(size, taken) {
  while (triangle.length <= size) {
    const above = triangle.at(-1);
    triangle.push([...above.map((value, index) => value + (above[index - 1] ?? 0)), 1]);
  }
  return triangle[size][taken];
}

// The chance that drawing `drawn` different years at random, where `sizes`
// holds how many years in range sit on each point of the cycle, puts `most` or
// more on one point. It counts the draws that keep every point below `most`,
// one point at a time: ways[count] is how many ways give `count` years so far.
export function chanceOfMost(sizes, drawn, most) {
  let ways = [1];
  for (const size of sizes) {
    const next = Array.from({ length: drawn + 1 }, () => 0);
    ways.forEach((count, sofar) => {
      for (let take = 0; take < most && take <= size && sofar + take <= drawn; take += 1) {
        next[sofar + take] += count * choose(size, take);
      }
    });
    ways = next;
  }
  const total = choose(sizes.reduce((sum, size) => sum + size, 0), drawn);
  return Math.max(0, 1 - ways[drawn] / total);
}

// What chance gives on average for the busiest point: the sum over every count
// of the chance of reaching it.
export function expectedMost(sizes, drawn) {
  let expected = 0;
  for (let most = 1; most <= drawn; most += 1) expected += chanceOfMost(sizes, drawn, most);
  return expected;
}

// One cell: the most years on one point of the cycle, against chance. On a
// tie the point reached first, counting from the earliest year, is named.
function cycleCell(years, range, period, tests) {
  const points = Object.values(Object.groupBy(years, (year) => year % period));
  const busiest = points.reduce((best, point) => (point.length > best.length ? point : best), []);
  const sizes = Array.from({ length: period }, (_, point) => range.filter((year) => year % period === point).length);
  const p = chanceOfMost(sizes, years.length, busiest.length);
  return {
    hits: busiest.length,
    trials: years.length,
    expected: expectedMost(sizes, years.length),
    p,
    different: p < SIGNIFICANCE / tests,
    years: busiest,
  };
}

// Per calendar and cycle length, whether the events' years recur on one point
// of the cycle more than chance, if the same number of different years were
// drawn at random from the range. Each year counts once, as in primeSummary.
export function cycleSummary(events, from, to) {
  return Object.fromEntries(CALENDAR_NAMES.map((name) => {
    const range = yearsIn(name, from, to);
    const years = [...new Set(events.map((event) => yearOfIso(isoIn(event.day, name))))].toSorted((a, b) => a - b);
    return [name, Object.fromEntries(PERIODS.map((period) => [period, cycleCell(years, range, period, CYCLE_TESTS)]))];
  }));
}
