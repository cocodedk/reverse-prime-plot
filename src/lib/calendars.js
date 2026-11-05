// The three calendars the Iran page dates events in, keyed by the page's names
// and valued by the Intl calendar ids that compute them. A day is a UTC
// midnight in milliseconds; an ISO day is "YYYY-MM-DD" in that calendar's own
// numbers. Kept free of DOM and i18n imports so it runs under plain Node.
export const CALENDARS = { gregorian: 'gregory', jalali: 'persian', ghamari: 'islamic-umalqura' };
// The order the page shows them in.
export const CALENDAR_NAMES = Object.keys(CALENDARS);

export const DAY_MS = 86_400_000;
// Sources can disagree by a few days: Iran starts lunar months by sighting
// the moon, the browser by the Umm al-Qura tables, and Jalali dates before 1925
// are counted backwards, and an accession can be dated to its proclamation or to
// the oath three days later. A stated date further off than this is a typo.
export const SOURCED_DAY_WINDOW = 3;
// Year starts are estimated to within a few days, then found exactly.
const YEAR_START_WINDOW = 6;
// A Jalali year begins at Nowruz, around 21 March of the Gregorian year 621 later.
const JALALI_OFFSET = 621;
const NOWRUZ_MONTH_INDEX = 2;
const NOWRUZ_DAY = 21;
// 1 Muharram 1 AH in the proleptic Gregorian calendar, and the mean lunar year.
const HIJRA_DAY = Date.UTC(622, 6, 19);
const LUNAR_YEAR_DAYS = 354.36667;
const ISO_PAD = 2;

const formatters = new Map();
function formatterFor(calendar) {
  if (!formatters.has(calendar)) {
    formatters.set(calendar, new Intl.DateTimeFormat(`en-u-ca-${calendar}`, {
      timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric',
    }));
  }
  return formatters.get(calendar);
}

const pad = (value) => String(value).padStart(ISO_PAD, '0');

function isoInCalendar(day, calendar) {
  const parts = Object.fromEntries(formatterFor(calendar).formatToParts(day).map(({ type, value }) => [type, value]));
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

export const dayOf = (gregorianIso) => Date.parse(`${gregorianIso}T00:00:00Z`);
export const isoIn = (day, name) => isoInCalendar(day, CALENDARS[name]);

// The day within `window` days of `day` that `calendar` numbers `iso`, nearest
// first, or null when there is none.
export function findDay(day, calendar, iso, window) {
  for (let offset = 0; offset <= window; offset += 1) {
    for (const candidate of [day - offset * DAY_MS, day + offset * DAY_MS]) {
      if (isoInCalendar(candidate, calendar) === iso) return candidate;
    }
  }
  return null;
}

const YEAR_ESTIMATES = {
  gregorian: (year) => Date.UTC(year, 0, 1),
  jalali: (year) => Date.UTC(year + JALALI_OFFSET, NOWRUZ_MONTH_INDEX, NOWRUZ_DAY),
  ghamari: (year) => HIJRA_DAY + Math.round((year - 1) * LUNAR_YEAR_DAYS) * DAY_MS,
};

// The day a year begins in the named calendar: 1 January, Nowruz, 1 Muharram.
export function yearStart(name, year) {
  return findDay(YEAR_ESTIMATES[name](year), CALENDARS[name], `${year}-01-01`, YEAR_START_WINDOW);
}

// Every date found for one event, per calendar, earliest first. `date` is the
// Gregorian record the timeline places. Each calendar gets the date that record
// computes to plus every date in `found`, each with the sources that state it;
// an entry no source states has none, so it is computed.
export function datesOf(event) {
  const recorded = dayOf(event.date);
  const byCalendar = Object.fromEntries(CALENDAR_NAMES.map((name) => [name, new Map()]));
  const add = (name, iso, source) => {
    const day = findDay(recorded, CALENDARS[name], iso, SOURCED_DAY_WINDOW);
    if (day === null) throw new Error(`${name} ${iso} is not within ${SOURCED_DAY_WINDOW} days of ${event.date}`);
    const entry = byCalendar[name].get(iso) ?? { day, iso, sources: [] };
    if (source && !entry.sources.includes(source)) entry.sources.push(source);
    byCalendar[name].set(iso, entry);
  };
  for (const name of CALENDAR_NAMES) add(name, isoIn(recorded, name), name === 'gregorian' ? event.source : null);
  for (const { calendar, date, source } of event.found ?? []) add(calendar, date, source);
  return Object.fromEntries(CALENDAR_NAMES.map((name) => [name, [...byCalendar[name].values()].toSorted((a, b) => a.day - b.day)]));
}
