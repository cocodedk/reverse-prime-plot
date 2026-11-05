// WebMCP: hands an AI agent in the visitor's browser the Iran timeline as data,
// so it can read the events and their dates instead of scraping the page.
import { isoIn } from './lib/calendars.js';
import { MARKS, primeMarks } from './lib/datePrimes.js';
import { registerTools } from './webMcp.js';

export const NOTE = 'Each calendar lists every date found for the event, earliest first, as "YYYY-MM-DD" in that calendar\'s own numbers, with the URLs of the sources that state it. Where sources disagree, each of their dates is listed. A date with no sources was computed from the Gregorian record. A computed Ghamari date follows the Umm al-Qura tables and can be a day or two off Iran\'s own lunar calendar, which starts each month at the sighting of the new moon. Jalali dates before 1925, when Iran adopted the calendar, are counted backwards.';
export const PRIME_NOTE = 'Each date lists `primes`, the ways it is prime: "year" (its year is prime), "yearReversed" (its year and that year\'s digits reversed are both prime, as 1979 and 9791) and "date" (the whole date read as YYYYMMDD is prime). `primeSummary` gives, per calendar and mark, how many of the distinct years (for "date", the distinct days) of the events\' recorded dates have the mark (`hits` of `trials`), how many chance predicts from the share of all years or days in the range (`expected`), a two-sided binomial p-value (`p`), and whether that differs from chance once 0.05 is split across the nine tests (`different`). Distinct years are counted because events cluster: 1979 holds six.';
export const CHINESE_NOTE = '`chineseYear` is the Chinese year of the recorded day: its stem and branch `characters`, their `pinyin`, its `element`, `animal` and `yinYang`, and `year`, the Gregorian year in which it began at Chinese New Year (late January to mid-February), so for an event early in a Gregorian year it can be the year before.';

const marksOf = (iso) => {
  const marks = primeMarks(iso);
  return MARKS.filter((mark) => marks[mark]);
};

export function describeTimeline({ events, primes, from, to, language }) {
  return {
    page: 'iran-timeline',
    language,
    from: isoIn(from, 'gregorian'),
    to: isoIn(to, 'gregorian'),
    note: NOTE,
    primeNote: PRIME_NOTE,
    chineseNote: CHINESE_NOTE,
    primeSummary: primes,
    events: events.map(({ title, summary, dates, chinese }) => ({
      title,
      summary,
      dates: Object.fromEntries(Object.entries(dates).map(([name, entries]) => [
        name, entries.map(({ iso, sources }) => ({ date: iso, sources, primes: marksOf(iso) })),
      ])),
      chineseYear: {
        year: chinese.year, characters: chinese.characters, pinyin: chinese.pinyin,
        element: chinese.element, animal: chinese.animal, yinYang: chinese.yang ? 'yang' : 'yin',
      },
    })),
  };
}

export function initIranWebMcp(page, signal) {
  return registerTools([{
    name: 'describe',
    title: 'What the page shows',
    description: 'Every event on the Iran timeline page, from 1900 to today and oldest first, each with a title and a one-line summary in the page\'s language, and every date found for it in the gregorian, jalali (Solar Hijri) and ghamari (Lunar Hijri) calendars, each with the URLs of the sources that state it (none when computed) and the ways it is prime; the event\'s Chinese year (element, animal, characters); and a table of how often prime years and dates occur against chance.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => describeTimeline(page),
  }], signal);
}
