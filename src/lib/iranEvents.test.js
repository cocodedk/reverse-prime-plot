import { describe, expect, it } from 'vitest';
import events from '../data/iranEvents.json';
import { CALENDAR_NAMES, dayOf } from './calendars.js';
import { datedEvents, sourceLabel } from './iranEvents.js';

const EVENT_COUNT = 68;
const FIRST_DAY = dayOf('1900-01-01');
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const HTTPS = /^https:\/\//;
const PERSIAN_LETTER = /[؀-ۿ]/;

describe('the Iran events', () => {
  it('holds every event once, oldest first, from 1900 to today', () => {
    expect(events).toHaveLength(EVENT_COUNT);
    const days = events.map((event) => dayOf(event.date));
    expect(days.every((day) => day >= FIRST_DAY && day <= Date.now())).toBe(true);
    expect(days).toEqual(days.toSorted((a, b) => a - b));
    expect(new Set(events.map((event) => event.title_en)).size).toBe(EVENT_COUNT);
  });

  it('names and summarises each event in both languages', () => {
    for (const event of events) {
      for (const key of ['title_en', 'summary_en', 'title_fa', 'summary_fa']) expect(event[key], key).toBeTruthy();
      expect(event.title_fa).toMatch(PERSIAN_LETTER);
      expect(event.summary_fa).toMatch(PERSIAN_LETTER);
    }
  });

  it('cites an https source for every date', () => {
    for (const event of events) {
      expect(event.date).toMatch(ISO_DAY);
      expect(event.source).toMatch(HTTPS);
      for (const found of event.found ?? []) {
        expect(CALENDAR_NAMES).toContain(found.calendar);
        expect(found.date).toMatch(ISO_DAY);
        expect(found.source).toMatch(HTTPS);
      }
    }
  });

  it('places every found date within a few days of its record', () => {
    expect(() => datedEvents(events, 'en')).not.toThrow();
  });
});

describe('sourceLabel', () => {
  it('names the site and the page', () => {
    expect(sourceLabel('https://en.wikipedia.org/wiki/Iranian_Revolution')).toBe('en.wikipedia.org › Iranian Revolution');
    expect(sourceLabel('https://www.iranicaonline.org/')).toBe('iranicaonline.org');
    expect(sourceLabel('https://fa.wikipedia.org/wiki/%D8%A7%DB%8C%D8%B1%D8%A7%D9%86')).toBe('fa.wikipedia.org › ایران');
  });
});
