import { CALENDAR_NAMES, DAY_MS, isoIn, yearOfIso, yearsIn } from './calendars.js';
import { reverseNumber } from './primeNumbers.js';

// The three ways a date can be prime, in the order the page shows them: the
// year; the year and its digits reversed (1979 and 9791); the whole date read
// as one number, YYYYMMDD (19790211).
export const MARKS = ['year', 'yearReversed', 'date'];
// The two-sided p-value below which a count is called different from chance,
// before it is split across the nine tests the page runs at once.
export const SIGNIFICANCE = 0.05;
const YEAR_SHIFT = 10_000;
const MONTH_SHIFT = 100;
// Every month in the three calendars is 28 to 31 days long.
const MONTH_LENGTHS = [28, 29, 30, 31];
// Lets a probability equal to the observed one through despite float rounding.
const RELATIVE_TOLERANCE = 1e-7;

export function isPrime(value) {
  if (value < 2) return false;
  if (value % 2 === 0) return value === 2;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

const primeBothWays = (year) => isPrime(year) && isPrime(reverseNumber(year));
const primeDate = (year, month, day) => isPrime(year * YEAR_SHIFT + month * MONTH_SHIFT + day);

// Which marks an ISO day ("YYYY-MM-DD" in any of the calendars) has.
export function primeMarks(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return { year: isPrime(year), yearReversed: primeBothWays(year), date: primeDate(year, month, day) };
}

// The share of the calendar's days in [from, to] whose whole date is prime.
// Walks month by month, finding each month's length from where the next begins.
function primeDateShare(name, from, to) {
  let days = 0;
  let primes = 0;
  let start = from - (Number(isoIn(from, name).split('-')[2]) - 1) * DAY_MS;
  while (start <= to) {
    const [year, month] = isoIn(start, name).split('-').map(Number);
    const length = MONTH_LENGTHS.find((candidate) => isoIn(start + candidate * DAY_MS, name).endsWith('-01'));
    for (let day = 1; day <= length; day += 1) {
      const at = start + (day - 1) * DAY_MS;
      if (at < from || at > to) continue;
      days += 1;
      if (primeDate(year, month, day)) primes += 1;
    }
    start += length * DAY_MS;
  }
  return primes / days;
}

// How often chance alone gives each mark: the share of the calendar's years in
// [from, to] with a prime year, or one prime both ways, and the share of its
// days with a prime whole date.
export function chanceRates(name, from, to) {
  const years = yearsIn(name, from, to);
  const share = (test) => years.filter(test).length / years.length;
  return { year: share(isPrime), yearReversed: share(primeBothWays), date: primeDateShare(name, from, to) };
}

// Two-sided exact binomial test: the chance of a count at least as unlikely as
// `hits` out of `trials` when each trial succeeds with probability `rate`.
export function binomialP(hits, trials, rate) {
  const odds = rate / (1 - rate);
  const pmf = [];
  let probability = (1 - rate) ** trials;
  for (let count = 0; count <= trials; count += 1) {
    pmf.push(probability);
    probability *= ((trials - count) / (count + 1)) * odds;
  }
  const limit = pmf[hits] * (1 + RELATIVE_TOLERANCE);
  return Math.min(1, pmf.filter((value) => value <= limit).reduce((sum, value) => sum + value, 0));
}

// Per calendar and mark, the events' recorded days against chance. Events
// cluster (1979 holds six), so a year mark counts each distinct year once and
// the date mark each distinct day once; counting events would score one busy
// year six times. `different` applies SIGNIFICANCE split across all the tests.
export function primeSummary(events, from, to) {
  const tests = CALENDAR_NAMES.length * MARKS.length;
  return Object.fromEntries(CALENDAR_NAMES.map((name) => {
    const rates = chanceRates(name, from, to);
    const days = [...new Set(events.map((event) => isoIn(event.day, name)))];
    const years = [...new Set(days.map(yearOfIso))];
    const units = { year: [years, isPrime], yearReversed: [years, primeBothWays], date: [days, (iso) => primeMarks(iso).date] };
    return [name, Object.fromEntries(MARKS.map((mark) => {
      const [values, test] = units[mark];
      const hits = values.filter(test).length;
      const p = binomialP(hits, values.length, rates[mark]);
      return [mark, { hits, trials: values.length, expected: rates[mark] * values.length, p, different: p < SIGNIFICANCE / tests }];
    }))];
  }));
}
