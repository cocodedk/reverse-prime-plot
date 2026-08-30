import { en } from './en.js';
import { fa } from './fa.js';

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

export function phaseLabel(phase) {
  return t.phases[phase] ?? phase;
}
