import * as stylex from '@stylexjs/stylex';
import { formatNumber, t } from '../i18n/index.js';
import { CALENDAR_NAMES } from '../lib/calendars.js';
import { MARKS, SIGNIFICANCE } from '../lib/datePrimes.js';
import { PRIME_SYMBOLS } from './PrimeMarks.jsx';
import { iranStyles } from '../iranStyles.stylex.js';

const TENTHS = 10;
const tenths = (value) => Math.round(value * TENTHS) / TENTHS;

// The table of how often each kind of prime turns up in the events' dates
// against chance, per calendar, and the one-line answer it adds up to.
export default function PrimeSummary({ summary }) {
  const tests = CALENDAR_NAMES.length * MARKS.length;
  const different = CALENDAR_NAMES.flatMap((name) => MARKS.filter((mark) => summary[name][mark].different)).length;
  return (
    <section {...stylex.props(iranStyles.events)}>
      <h2 {...stylex.props(iranStyles.eventsHeading)}>{t.iranPrimesHeading}</h2>
      <p {...stylex.props(iranStyles.summary)}>{t.iranPrimesIntro}</p>
      <div {...stylex.props(iranStyles.tableScroll)}>
        <table {...stylex.props(iranStyles.primeTable)}>
          <thead>
            <tr>
              <td />
              {CALENDAR_NAMES.map((name) => (
                <th key={name} scope="col" {...stylex.props(iranStyles.primeColumn)}>{t.calendarNames[name]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MARKS.map((mark) => (
              <tr key={mark}>
                <th scope="row" {...stylex.props(iranStyles.primeRow)}>
                  <span aria-hidden="true" {...stylex.props(iranStyles.primeMarks)}>{PRIME_SYMBOLS[mark]}</span>
                  {` ${t.primeMarkNames[mark]}`}
                </th>
                {CALENDAR_NAMES.map((name) => {
                  const cell = summary[name][mark];
                  return (
                    <td key={name} {...stylex.props(iranStyles.primeCell, cell.different && iranStyles.primeDifferent)}>
                      <span {...stylex.props(iranStyles.cellLine)}>{t.iranPrimeHits(formatNumber(cell.hits), formatNumber(cell.trials))}</span>
                      <span {...stylex.props(iranStyles.cellLine, iranStyles.cellChance)}>{t.iranPrimeChance(formatNumber(tenths(cell.expected)))}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p {...stylex.props(iranStyles.verdict)}>{different === 0
        ? t.iranPrimeVerdictNone(formatNumber(tests), formatNumber(SIGNIFICANCE))
        : t.iranPrimeVerdictSome(formatNumber(different), formatNumber(tests), formatNumber(SIGNIFICANCE))}</p>
    </section>
  );
}
