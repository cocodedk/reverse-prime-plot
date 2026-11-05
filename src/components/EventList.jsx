import * as stylex from '@stylexjs/stylex';
import { formatDate, formatNumber, formatYear, t } from '../i18n/index.js';
import { CALENDAR_NAMES } from '../lib/calendars.js';
import { sourceLabel } from '../lib/iranEvents.js';
import PrimeMarks from './PrimeMarks.jsx';
import { styles } from '../appStyles.stylex.js';
import { iranStyles } from '../iranStyles.stylex.js';

const COMPUTED_MARK = '*';

const external = (href) => ({ href, target: '_blank', rel: 'noreferrer' });

// One date, then a numbered link to each source that states it, or the
// computed mark when none does, then the ways the date is prime.
function DateEntry({ entry, name, sources }) {
  return (
    <span {...stylex.props(iranStyles.dateEntry)}>
      {formatDate(entry.day, name)}
      {entry.sources.length === 0 ? (
        <>
          <span aria-hidden="true">{COMPUTED_MARK}</span>
          <span {...stylex.props(styles.visuallyHidden)}>{` (${t.iranComputed})`}</span>
        </>
      ) : entry.sources.map((source) => {
        const number = formatNumber(sources.indexOf(source) + 1);
        return (
          <sup key={source} {...stylex.props(iranStyles.ref)}>
            <a {...stylex.props(iranStyles.refLink)} {...external(source)} aria-label={`${t.iranSource} ${number}`}>{number}</a>
          </sup>
        );
      })}
      <PrimeMarks iso={entry.iso} />
    </span>
  );
}

// The Chinese year of the recorded day. Its meaning shows on hover and, for
// touch screens and keyboards, opens below it on a click or tap. The year it
// began in is shown when it is not the Gregorian one, as for events before
// Chinese New Year.
export function ChineseYear({ chinese, day }) {
  const began = chinese.year === new Date(day).getUTCFullYear() ? '' : ` (${formatYear(chinese.year)})`;
  const tip = t.chineseYearTip(chinese);
  return (
    <details>
      <summary {...stylex.props(iranStyles.chineseYear)} title={tip}>
        {`${t.chineseYearName(chinese.element, chinese.animal)} ${chinese.characters}${began}`}
      </summary>
      <p {...stylex.props(iranStyles.chineseTip)}>{tip}</p>
    </details>
  );
}

export default function EventList({ events }) {
  return (
    <ol {...stylex.props(iranStyles.list)}>
      {events.map((event) => (
        <li key={event.id} id={event.id} {...stylex.props(iranStyles.item)}>
          <h3 {...stylex.props(iranStyles.itemTitle)}>{event.title}</h3>
          <dl {...stylex.props(iranStyles.dates)}>
            {CALENDAR_NAMES.map((name) => (
              <div key={name}>
                <dt {...stylex.props(styles.label)}>{t.calendarNames[name]}</dt>
                <dd {...stylex.props(iranStyles.dateValue)}>
                  {event.dates[name].map((entry) => (
                    <DateEntry key={entry.iso} entry={entry} name={name} sources={event.sources} />
                  ))}
                </dd>
              </div>
            ))}
            <div>
              <dt {...stylex.props(styles.label)}>{t.chineseYearLabel}</dt>
              <dd {...stylex.props(iranStyles.dateValue)}><ChineseYear chinese={event.chinese} day={event.day} /></dd>
            </div>
          </dl>
          <p {...stylex.props(iranStyles.summary)}>{event.summary}</p>
          <ol {...stylex.props(iranStyles.sources)} aria-label={t.iranSources}>
            {event.sources.map((source, index) => (
              <li key={source} {...stylex.props(iranStyles.sourceItem)}>
                <span {...stylex.props(iranStyles.sourceNumber)}>{formatNumber(index + 1)}</span>
                <a {...stylex.props(iranStyles.source)} {...external(source)}>{sourceLabel(source)}</a>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
