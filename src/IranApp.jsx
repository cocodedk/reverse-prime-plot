import { useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import EventList from './components/EventList.jsx';
import IranTimeline from './components/IranTimeline.jsx';
import { CycleSummary, PrimeSummary } from './components/ChanceSummary.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import events from './data/iranEvents.json';
import { formatNumber, formatYear, LANGUAGE, t } from './i18n/index.js';
import { dayOf } from './lib/calendars.js';
import { datedEvents } from './lib/iranEvents.js';
import { primeSummary } from './lib/datePrimes.js';
import { cycleSummary } from './lib/eventCycles.js';
import { initIranWebMcp } from './iranWebMcp.js';
import { styles } from './appStyles.stylex.js';
import { iranStyles } from './iranStyles.stylex.js';

const RANGE_START = '1900-01-01';
const ISO_DAY_LENGTH = 10;
const FROM = dayOf(RANGE_START);
const TO = dayOf(new Date().toISOString().slice(0, ISO_DAY_LENGTH));
const EVENTS = datedEvents(events, LANGUAGE);
const PRIMES = primeSummary(EVENTS, FROM, TO);
const CYCLES = cycleSummary(EVENTS, FROM, TO);
const yearOf = (day) => new Date(day).getUTCFullYear();

export default function IranApp() {
  useEffect(() => {
    const teardown = new AbortController();
    void initIranWebMcp({ events: EVENTS, primes: PRIMES, cycles: CYCLES, from: FROM, to: TO, language: LANGUAGE }, teardown.signal);
    return () => teardown.abort();
  }, []);

  return (
    <main {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.shell)}>
        <p {...stylex.props(styles.intro)}>{t.iranIntro}</p>

        <section {...stylex.props(styles.plotCard)}>
          <div {...stylex.props(styles.plotHeader)}>
            <h1 {...stylex.props(styles.plotTitle)}>{t.iranTitle}</h1>
            <p {...stylex.props(styles.plotLabel)}>{`${formatYear(yearOf(FROM))}–${formatYear(yearOf(TO))}`}</p>
          </div>
          <IranTimeline events={EVENTS} from={FROM} to={TO} />
        </section>

        <PrimeSummary summary={PRIMES} />
        <CycleSummary summary={CYCLES} />

        <section {...stylex.props(iranStyles.events)}>
          <h2 {...stylex.props(iranStyles.eventsHeading)}>{t.iranEventsHeading(formatNumber(EVENTS.length))}</h2>
          <EventList events={EVENTS} />
          <p {...stylex.props(iranStyles.note)}>{t.iranComputedNote}</p>
          <p {...stylex.props(iranStyles.note)}>{t.iranChineseNote}</p>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
