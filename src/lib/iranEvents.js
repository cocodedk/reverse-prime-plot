import { CALENDAR_NAMES, datesOf, dayOf } from './calendars.js';
import { chineseYear } from './chineseYear.js';

const LEADING_WWW = /^www\./;

// A source link's text: the site, and the page's last path segment when there
// is one, so two articles on the same site stay apart.
export function sourceLabel(url) {
  const { hostname, pathname } = new URL(url);
  const page = decodeURIComponent(pathname.split('/').filter(Boolean).at(-1) ?? '').replaceAll('_', ' ');
  const site = hostname.replace(LEADING_WWW, '');
  return page ? `${site} › ${page}` : site;
}

// Each distinct source behind an event's dates, in the order the dates name them.
const sourcesOf = (dates) => [...new Set(CALENDAR_NAMES.flatMap((name) => dates[name].flatMap((entry) => entry.sources)))];

// The Iran page's events in its language, each with every date found in all
// three calendars, the sources behind them, the recorded day the timeline
// places it at, the Chinese year of that day, and the id its list item
// carries, so a marker can link to it.
export function datedEvents(events, language) {
  return events.map((event, index) => {
    const dates = datesOf(event);
    const day = dayOf(event.date);
    return {
      id: `event-${index + 1}`,
      title: event[`title_${language}`],
      summary: event[`summary_${language}`],
      day,
      chinese: chineseYear(day),
      dates,
      sources: sourcesOf(dates),
    };
  });
}
