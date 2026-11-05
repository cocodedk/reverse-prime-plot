import { afterEach, describe, expect, it, vi } from 'vitest';
import { dayOf } from './lib/calendars.js';
import { primeSummary } from './lib/datePrimes.js';
import { cycleSummary } from './lib/eventCycles.js';
import { datedEvents } from './lib/iranEvents.js';
import { CHINESE_NOTE, CYCLE_NOTE, describeTimeline, initIranWebMcp, NOTE, PRIME_NOTE } from './iranWebMcp.js';

const RECORD = 'https://en.wikipedia.org/';
const OTHER = 'https://fa.wikipedia.org/';
const EVENTS = [{
  date: '1979-02-11', source: RECORD, found: [{ calendar: 'ghamari', date: '1399-03-13', source: OTHER }],
  title_en: 'Revolution', title_fa: 'انقلاب', summary_en: 'It won.', summary_fa: 'پیروز شد.',
}];
const FROM = dayOf('1900-01-01');
const TO = dayOf('2026-11-05');
const page = (language = 'en') => {
  const events = datedEvents(EVENTS, language);
  return { events, primes: primeSummary(events, FROM, TO), cycles: cycleSummary(events, FROM, TO), from: FROM, to: TO, language };
};

afterEach(() => { delete document.modelContext; });

describe('describeTimeline', () => {
  it('lists every date found in each calendar with its sources, its primes and the Chinese year', () => {
    const shown = page();
    expect(describeTimeline(shown)).toEqual({
      page: 'iran-timeline', language: 'en', from: '1900-01-01', to: '2026-11-05',
      note: NOTE, primeNote: PRIME_NOTE, cycleNote: CYCLE_NOTE, chineseNote: CHINESE_NOTE,
      primeSummary: shown.primes, cycleSummary: shown.cycles,
      events: [{
        title: 'Revolution', summary: 'It won.',
        dates: {
          gregorian: [{ date: '1979-02-11', sources: [RECORD], primes: ['year', 'yearReversed'] }],
          jalali: [{ date: '1357-11-22', sources: [], primes: [] }],
          ghamari: [
            { date: '1399-03-13', sources: [OTHER], primes: ['year', 'yearReversed', 'date'] },
            { date: '1399-03-14', sources: [], primes: ['year', 'yearReversed'] },
          ],
        },
        chineseYear: { year: 1979, characters: '己未', pinyin: 'jǐ wèi', element: 'earth', animal: 'goat', yinYang: 'yin' },
      }],
    });
  });

  it('hands over the prime table per calendar and mark', () => {
    expect(describeTimeline(page()).primeSummary.ghamari.yearReversed).toMatchObject({ hits: 1, trials: 1 });
  });

  it('hands over the cycle table per calendar and length, with the years on the busiest point', () => {
    expect(describeTimeline(page()).cycleSummary.jalali[4]).toMatchObject({ hits: 1, trials: 1, years: [1357] });
  });

  it('speaks the page\'s language', () => {
    expect(describeTimeline(page('fa')).events[0]).toMatchObject({ title: 'انقلاب', summary: 'پیروز شد.' });
  });
});

describe('initIranWebMcp', () => {
  it('does nothing without a registry', async () => {
    expect(await initIranWebMcp(page())).toEqual([]);
  });

  it('registers a read-only describe that ignores whatever it is given', async () => {
    const held = new Map();
    document.modelContext = {
      registerTool: vi.fn(async (tool) => { held.set(tool.name, tool); }),
      getTools: async () => [...held.values()],
    };
    expect(await initIranWebMcp(page())).toEqual(['describe']);
    const describeTool = held.get('describe');
    expect(describeTool.annotations.readOnlyHint).toBe(true);
    for (const input of [{}, [], null, 'x', { year: 1979 }]) {
      expect(await describeTool.execute(input)).toEqual(describeTimeline(page()));
    }
  });
});
