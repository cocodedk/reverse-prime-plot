import { describe, expect, it } from 'vitest';
import { CALENDARS, datesOf, dayOf, findDay, isoIn, SOURCED_DAY_WINDOW, yearStart } from './calendars.js';

const REVOLUTION = '1979-02-11';

describe('isoIn', () => {
  it('reads a day in each calendar', () => {
    const day = dayOf(REVOLUTION);
    expect(isoIn(day, 'gregorian')).toBe(REVOLUTION);
    expect(isoIn(day, 'jalali')).toBe('1357-11-22');
    expect(isoIn(day, 'ghamari')).toBe('1399-03-14');
  });
});

describe('findDay', () => {
  it('finds the nearby day a calendar gives the target date', () => {
    expect(findDay(dayOf(REVOLUTION), CALENDARS.jalali, '1357-11-24', SOURCED_DAY_WINDOW)).toBe(dayOf('1979-02-13'));
    expect(findDay(dayOf(REVOLUTION), CALENDARS.jalali, '1357-11-20', SOURCED_DAY_WINDOW)).toBe(dayOf('1979-02-09'));
  });

  it('gives up beyond the window', () => {
    expect(findDay(dayOf(REVOLUTION), CALENDARS.jalali, '1357-11-26', SOURCED_DAY_WINDOW)).toBeNull();
  });
});

describe('yearStart', () => {
  it.each([
    ['gregorian', 1900, '1900-01-01'],
    ['jalali', 1358, '1979-03-21'],
    ['jalali', 1404, '2025-03-21'],
    ['ghamari', 1400, '1979-11-21'],
    ['ghamari', 1318, '1900-04-30'],
  ])('%s %i begins on %s', (name, year, iso) => {
    expect(yearStart(name, year)).toBe(dayOf(iso));
  });
});

describe('datesOf', () => {
  const RECORD = 'https://example.org/record';
  const OTHER = 'https://example.org/other';
  const THIRD = 'https://example.org/third';

  it('computes the dates no source states', () => {
    expect(datesOf({ date: REVOLUTION, source: RECORD })).toEqual({
      gregorian: [{ day: dayOf(REVOLUTION), iso: REVOLUTION, sources: [RECORD] }],
      jalali: [{ day: dayOf(REVOLUTION), iso: '1357-11-22', sources: [] }],
      ghamari: [{ day: dayOf(REVOLUTION), iso: '1399-03-14', sources: [] }],
    });
  });

  it('lists every date a source states beside the computed one, earliest first', () => {
    const found = [{ calendar: 'ghamari', date: '1399-03-13', source: OTHER }];
    expect(datesOf({ date: REVOLUTION, source: RECORD, found }).ghamari).toEqual([
      { day: dayOf('1979-02-10'), iso: '1399-03-13', sources: [OTHER] },
      { day: dayOf(REVOLUTION), iso: '1399-03-14', sources: [] },
    ]);
  });

  it('gathers every source that states the same date', () => {
    const found = [
      { calendar: 'jalali', date: '1357-11-22', source: OTHER },
      { calendar: 'jalali', date: '1357-11-22', source: THIRD },
      { calendar: 'gregorian', date: REVOLUTION, source: OTHER },
      { calendar: 'gregorian', date: REVOLUTION, source: RECORD },
    ];
    const dates = datesOf({ date: REVOLUTION, source: RECORD, found });
    expect(dates.jalali).toEqual([{ day: dayOf(REVOLUTION), iso: '1357-11-22', sources: [OTHER, THIRD] }]);
    expect(dates.gregorian).toEqual([{ day: dayOf(REVOLUTION), iso: REVOLUTION, sources: [RECORD, OTHER] }]);
  });

  it('refuses a stated date too far off to be the same event', () => {
    const found = [{ calendar: 'jalali', date: '1357-12-22', source: OTHER }];
    expect(() => datesOf({ date: REVOLUTION, source: RECORD, found })).toThrow('jalali 1357-12-22');
  });
});
