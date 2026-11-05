import * as stylex from '@stylexjs/stylex';
import { formatNumber, t } from '../i18n/index.js';
import { CALENDAR_NAMES } from '../lib/calendars.js';
import { MARKS, SIGNIFICANCE } from '../lib/datePrimes.js';
import { PERIODS } from '../lib/eventCycles.js';
import { PRIME_SYMBOLS } from './PrimeMarks.jsx';
import { iranStyles } from '../iranStyles.stylex.js';

const TENTHS = 10;
const tenths = (value) => Math.round(value * TENTHS) / TENTHS;

// Counts in the events' dates against chance: one row per test, one column per
// calendar, and the one-line answer they add up to. `rows` are the summary's
// keys within each calendar; `copy` holds the heading, intro and two verdicts.
function ChanceSummary({ summary, rows, rowLabel, copy }) {
  const tests = CALENDAR_NAMES.length * rows.length;
  const different = CALENDAR_NAMES.flatMap((name) => rows.filter((row) => summary[name][row].different)).length;
  return (
    <section {...stylex.props(iranStyles.events)}>
      <h2 {...stylex.props(iranStyles.eventsHeading)}>{copy.heading}</h2>
      <p {...stylex.props(iranStyles.summary)}>{copy.intro}</p>
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
            {rows.map((row) => (
              <tr key={row}>
                <th scope="row" {...stylex.props(iranStyles.primeRow)}>{rowLabel(row)}</th>
                {CALENDAR_NAMES.map((name) => {
                  const cell = summary[name][row];
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
        ? copy.none(formatNumber(tests), formatNumber(SIGNIFICANCE))
        : copy.some(formatNumber(different), formatNumber(tests), formatNumber(SIGNIFICANCE))}</p>
    </section>
  );
}

const PRIME_COPY = { heading: t.iranPrimesHeading, intro: t.iranPrimesIntro, none: t.iranPrimeVerdictNone, some: t.iranPrimeVerdictSome };
const CYCLE_COPY = { heading: t.iranCyclesHeading, intro: t.iranCyclesIntro, none: t.iranCycleVerdictNone, some: t.iranCycleVerdictSome };

const primeLabel = (mark) => (
  <>
    <span aria-hidden="true" {...stylex.props(iranStyles.primeMarks)}>{PRIME_SYMBOLS[mark]}</span>
    {` ${t.primeMarkNames[mark]}`}
  </>
);
const cycleLabel = (period) => t.iranCycleRow(formatNumber(period));

// How often each kind of prime turns up in the dates.
export function PrimeSummary({ summary }) {
  return <ChanceSummary summary={summary} rows={MARKS} rowLabel={primeLabel} copy={PRIME_COPY} />;
}

// Whether the events' years recur on one point of a 2- to 12-year cycle.
export function CycleSummary({ summary }) {
  return <ChanceSummary summary={summary} rows={PERIODS} rowLabel={cycleLabel} copy={CYCLE_COPY} />;
}
