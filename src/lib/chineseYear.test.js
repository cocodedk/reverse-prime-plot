import { describe, expect, it } from 'vitest';
import events from '../data/iranEvents.json';
import { DAY_MS, dayOf } from './calendars.js';
import { chineseYear } from './chineseYear.js';
import { datedEvents } from './iranEvents.js';

describe('chineseYear', () => {
  it('names the revolution\'s year', () => {
    expect(chineseYear(dayOf('1979-02-11'))).toEqual({
      year: 1979, element: 'earth', animal: 'goat', yang: false, characters: '己未',
      pinyin: 'jǐ wèi', elementCharacter: '土', animalCharacter: '羊',
    });
  });

  // The Chinese year begins at Chinese New Year, not on 1 January.
  it.each([
    ['2026-01-08', 2025, 'wood', 'snake', '乙巳'],
    ['2026-02-17', 2026, 'fire', 'horse', '丙午'],
    ['2016-01-16', 2015, 'wood', 'goat', '乙未'],
    ['2016-02-08', 2016, 'fire', 'monkey', '丙申'],
    ['1906-08-05', 1906, 'fire', 'horse', '丙午'],
  ])('%s is in the %i year, %s %s', (iso, year, element, animal, characters) => {
    expect(chineseYear(dayOf(iso))).toMatchObject({ year, element, animal, characters });
  });

  it('marks the yang stems', () => {
    expect(chineseYear(dayOf('2024-02-10'))).toMatchObject({ characters: '甲辰', element: 'wood', animal: 'dragon', yang: true });
  });

  // ICU puts the 1954 New Year on 4 February; it was 3 February (the new moon
  // fell five minutes before Beijing midnight). So the page trusts ICU only
  // where a day either side gives the same year, and every Gregorian date found
  // for an event must fall in the year its record does.
  it('keeps every event clear of a Chinese New Year the browser could misplace', () => {
    const unsure = datedEvents(events, 'en').filter(({ day, dates }) => {
      const year = chineseYear(day).characters;
      return chineseYear(day - DAY_MS).characters !== year || chineseYear(day + DAY_MS).characters !== year
        || dates.gregorian.some((entry) => chineseYear(entry.day).characters !== year);
    });
    expect(unsure.map((event) => event.title)).toEqual([]);
  });
});
