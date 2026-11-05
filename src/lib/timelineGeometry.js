import { DAY_MS, isoIn, yearStart } from './calendars.js';

// The Iran timeline is one time line read against three year scales. Every
// scale is linear in real time, so an event sits at the same x on all three;
// only where each calendar's years begin differs.
export const TIMELINE_PAD = 22;
// Year steps tried in order; the first that keeps tick labels this far apart wins.
export const TICK_STEPS = [5, 10, 20, 25, 50];
export const MIN_TICK_SPACING = 52;
const DAYS_PER_YEAR = 365.2425;

// Where a day falls across the drawable width. Persian reads right to left, so
// its time line runs that way too.
export function xOf(day, from, to, width, rtl = false) {
  const along = TIMELINE_PAD + ((day - from) / (to - from)) * (width - 2 * TIMELINE_PAD);
  return rtl ? width - along : along;
}

export function tickStep(width, from, to) {
  const years = (to - from) / (DAYS_PER_YEAR * DAY_MS);
  const perYear = (width - 2 * TIMELINE_PAD) / years;
  return TICK_STEPS.find((step) => step * perYear >= MIN_TICK_SPACING) ?? TICK_STEPS.at(-1);
}

const yearIn = (day, name) => Number(isoIn(day, name).split('-')[0]);

// The years divisible by `step` whose first day falls inside [from, to], with
// the day each one begins.
export function yearTicks(name, from, to, step) {
  const ticks = [];
  for (let year = Math.ceil(yearIn(from, name) / step) * step; year <= yearIn(to, name); year += step) {
    const day = yearStart(name, year);
    if (day >= from && day <= to) ticks.push({ year, day });
  }
  return ticks;
}
