import { describe, expect, it } from 'vitest';
import { dayOf } from './calendars.js';
import { MIN_TICK_SPACING, TICK_STEPS, TIMELINE_PAD, tickStep, xOf, yearTicks } from './timelineGeometry.js';

const FROM = dayOf('1900-01-01');
const TO = dayOf('2026-11-05');

describe('xOf', () => {
  it('spans the padded width, mirrored for right to left', () => {
    expect(xOf(FROM, FROM, TO, 400)).toBe(TIMELINE_PAD);
    expect(xOf(TO, FROM, TO, 400)).toBe(400 - TIMELINE_PAD);
    expect(xOf(FROM, FROM, TO, 400, true)).toBe(400 - TIMELINE_PAD);
  });
});

describe('tickStep', () => {
  it('thins the ticks on a phone and keeps them apart', () => {
    expect(tickStep(358, FROM, TO)).toBe(25);
    expect(tickStep(1080, FROM, TO)).toBe(10);
    expect(tickStep(4000, FROM, TO)).toBe(TICK_STEPS[0]);
    expect(tickStep(60, FROM, TO)).toBe(TICK_STEPS.at(-1));
  });

  it('never packs labels closer than the minimum', () => {
    for (const width of [320, 390, 760, 1080]) {
      const step = tickStep(width, FROM, TO);
      const ticks = yearTicks('gregorian', FROM, TO, step);
      expect(xOf(ticks[1].day, FROM, TO, width) - xOf(ticks[0].day, FROM, TO, width)).toBeGreaterThanOrEqual(MIN_TICK_SPACING);
    }
  });
});

describe('yearTicks', () => {
  it('lists each calendar\'s round years inside the range', () => {
    expect(yearTicks('gregorian', FROM, TO, 50).map((tick) => tick.year)).toEqual([1900, 1950, 2000]);
    expect(yearTicks('jalali', FROM, TO, 50).map((tick) => tick.year)).toEqual([1300, 1350, 1400]);
    expect(yearTicks('ghamari', FROM, TO, 50).map((tick) => tick.year)).toEqual([1350, 1400]);
  });

  it('places a year where it begins', () => {
    const [nowruz1300] = yearTicks('jalali', FROM, TO, 50);
    expect(nowruz1300.day).toBe(dayOf('1921-03-21'));
  });
});
