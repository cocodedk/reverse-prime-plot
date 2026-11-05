import * as stylex from '@stylexjs/stylex';
import { t } from '../i18n/index.js';
import { MARKS, primeMarks } from '../lib/datePrimes.js';
import { styles } from '../appStyles.stylex.js';
import { iranStyles } from '../iranStyles.stylex.js';

// One symbol per way a date can be prime; the summary table is their key.
export const PRIME_SYMBOLS = { year: '◆', yearReversed: '⇄', date: '#' };

// The marks an ISO date ("YYYY-MM-DD" in its own calendar) has: symbols on
// screen, their names on hover and for screen readers.
export default function PrimeMarks({ iso }) {
  const marks = primeMarks(iso);
  const held = MARKS.filter((mark) => marks[mark]);
  if (held.length === 0) return null;
  const names = held.map((mark) => t.primeMarkNames[mark]).join('; ');
  return (
    <span {...stylex.props(iranStyles.primeMarks)} title={names}>
      <span aria-hidden="true">{held.map((mark) => PRIME_SYMBOLS[mark]).join('')}</span>
      <span {...stylex.props(styles.visuallyHidden)}>{` (${names})`}</span>
    </span>
  );
}
