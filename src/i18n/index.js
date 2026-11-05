import { en } from './en.js';
import { fa } from './fa.js';
import { CALENDARS } from '../lib/calendars.js';

const DICTIONARIES = { en, fa };
const NUMBER_LOCALES = { en: 'en-US', fa: 'fa-IR' };

// The locale is fixed per document: each language is its own HTML entry point
// (index.html and fa/index.html), so it is read once rather than tracked in
// state. The guard keeps this importable from Node-side unit tests.
function detectLanguage() {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang === 'fa' ? 'fa' : 'en';
}

export const LANGUAGE = detectLanguage();
export const t = DICTIONARIES[LANGUAGE];

const numberLocale = NUMBER_LOCALES[LANGUAGE];

// fa-IR renders Persian-Indic digits natively, so number formatting needs no
// digit table of its own.
export function formatNumber(value) {
  return value.toLocaleString(numberLocale);
}

// A year is a label, not a quantity: no thousands separator (1357, not 1,357).
export function formatYear(year) {
  return year.toLocaleString(numberLocale, { useGrouping: false });
}

// A day in one of the Iran page's calendars, with its month names in the page's
// language: "Bahman 22, 1357 AP" or "۲۲ بهمن ۱۳۵۷".
const DATE_OPTIONS = { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' };
const dateFormatters = {};
export function formatDate(day, name) {
  dateFormatters[name] ??= new Intl.DateTimeFormat(`${numberLocale}-u-ca-${CALENDARS[name]}`, DATE_OPTIONS);
  return dateFormatters[name].format(day);
}

export function phaseLabel(phase) {
  return t.phases[phase] ?? phase;
}
