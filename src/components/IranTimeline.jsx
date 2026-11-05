import * as stylex from '@stylexjs/stylex';
import { useElementWidth } from '../hooks/useElementWidth.js';
import { formatDate, formatYear, LANGUAGE, t } from '../i18n/index.js';
import { CALENDAR_NAMES } from '../lib/calendars.js';
import { TIMELINE_PAD, tickStep, xOf, yearTicks } from '../lib/timelineGeometry.js';
import { iranStyles } from '../iranStyles.stylex.js';

// Each scale is a row: its name, its year labels, then its axis line.
const ROW_HEIGHT = 58;
const NAME_Y = 12;
const LABEL_Y = 32;
const AXIS_Y = 44;
const TICK_HALF = 4;
const DOT_RADIUS = 2.5;
const HEIGHT = ROW_HEIGHT * CALENDAR_NAMES.length;
const RTL = LANGUAGE === 'fa';

const axisY = (row) => row * ROW_HEIGHT + AXIS_Y;

// Drawn at the element's real width rather than scaled from a viewBox, so the
// labels stay at their CSS size on a phone.
export default function IranTimeline({ events, from, to }) {
  const { measuredRef, width } = useElementWidth();
  const x = (day) => xOf(day, from, to, width, RTL);
  const step = tickStep(width, from, to);
  const firstAxis = axisY(0);
  const lastAxis = axisY(CALENDAR_NAMES.length - 1);

  return (
    <div ref={measuredRef} {...stylex.props(iranStyles.timeline)}>
      {width > 0 && (
        <svg width={width} height={HEIGHT} direction="ltr" aria-label={t.iranTimelineLabel}>
          {CALENDAR_NAMES.map((name, row) => (
            <line key={name} {...stylex.props(iranStyles.axis)} x1={TIMELINE_PAD} x2={width - TIMELINE_PAD} y1={axisY(row)} y2={axisY(row)} />
          ))}
          {events.map((event) => {
            const at = x(event.day);
            return (
              <a key={event.id} href={`#${event.id}`} {...stylex.props(iranStyles.eventLink)}>
                <title>{`${event.title} · ${formatDate(event.day, 'gregorian')}`}</title>
                <line {...stylex.props(iranStyles.eventLine)} x1={at} x2={at} y1={firstAxis} y2={lastAxis} />
                <line {...stylex.props(iranStyles.eventHit)} x1={at} x2={at} y1={firstAxis - TICK_HALF} y2={lastAxis + TICK_HALF} />
                {CALENDAR_NAMES.map((name, row) => (
                  <circle key={name} {...stylex.props(iranStyles.eventDot)} cx={at} cy={axisY(row)} r={DOT_RADIUS} />
                ))}
              </a>
            );
          })}
          {CALENDAR_NAMES.map((name, row) => (
            <g key={name}>
              <text {...stylex.props(iranStyles.scaleName)} x={RTL ? width - TIMELINE_PAD : TIMELINE_PAD} y={row * ROW_HEIGHT + NAME_Y} textAnchor={RTL ? 'end' : 'start'}>
                {t.calendarNames[name]}
              </text>
              {yearTicks(name, from, to, step).map(({ year, day }) => (
                <g key={year}>
                  <line {...stylex.props(iranStyles.tick)} x1={x(day)} x2={x(day)} y1={axisY(row) - TICK_HALF} y2={axisY(row) + TICK_HALF} />
                  <text {...stylex.props(iranStyles.tickLabel)} x={x(day)} y={row * ROW_HEIGHT + LABEL_Y} textAnchor="middle">{formatYear(year)}</text>
                </g>
              ))}
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}
