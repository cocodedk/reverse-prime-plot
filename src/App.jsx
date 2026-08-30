import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import Legend from './components/Legend.jsx';
import PrimePlot from './components/PrimePlot.jsx';
import { usePlotData } from './hooks/usePlotData.js';
import { MAX_LIMIT } from './lib/primeNumbers.js';
import { styles } from './appStyles.stylex.js';

const DEFAULT_START = 0;
const DEFAULT_END = 100;
const PRESETS = [[0, 50], [0, 100], [0, 250]];

export default function App() {
  const [start, setStart] = useState(DEFAULT_START);
  const [end, setEnd] = useState(DEFAULT_END);
  const [draftStart, setDraftStart] = useState(String(DEFAULT_START));
  const [draftEnd, setDraftEnd] = useState(String(DEFAULT_END));
  const [validationError, setValidationError] = useState('');
  const [yDirection, setYDirection] = useState('up');
  const plot = usePlotData(start, end);

  function applyInterval(startValue, endValue) {
    const nextStart = Number(startValue);
    const nextEnd = Number(endValue);
    if (
      !Number.isInteger(nextStart) ||
      !Number.isInteger(nextEnd) ||
      nextStart < 0 ||
      nextStart >= nextEnd ||
      nextEnd > MAX_LIMIT
    ) {
      setValidationError(
        `Choose whole numbers where 0 ≤ From < To ≤ ${MAX_LIMIT.toLocaleString()}.`,
      );
      return;
    }
    setDraftStart(String(nextStart));
    setDraftEnd(String(nextEnd));
    setStart(nextStart);
    setEnd(nextEnd);
    setValidationError('');
  }

  const displayedStart = plot.data?.start ?? start;
  const displayedEnd = plot.data?.end ?? end;
  const stats = plot.data ? [
    ['Checked', plot.data.count.toLocaleString()],
    ['Markers', plot.data.visibleMarkerCount.toLocaleString()],
    ['Prime n', plot.data.summary.originalPrimes.toLocaleString()],
    ['Prime reversals', plot.data.summary.reversedPrimes.toLocaleString()],
    ['Both prime', plot.data.summary.doublePrimes.toLocaleString()],
  ] : [];

  return (
    <main {...stylex.props(styles.page)}>
      <section {...stylex.props(styles.hero)}>
        <div>
          <p {...stylex.props(styles.eyebrow)}>Number mirror · prime explorer</p>
          <h1 {...stylex.props(styles.title)}>Reverse Prime Plot</h1>
          <p {...stylex.props(styles.intro)}>
            Every number becomes <strong>(n, reverse(n))</strong>. Choose an inclusive interval and plot backward from its upper endpoint to its lower endpoint.
          </p>
        </div>

        <form
          {...stylex.props(styles.controls)}
          onSubmit={(event) => {
            event.preventDefault();
            applyInterval(draftStart, draftEnd);
          }}
        >
          <span {...stylex.props(styles.label)}>Choose interval</span>
          <div {...stylex.props(styles.intervalFields)}>
            <label {...stylex.props(styles.field)} htmlFor="interval-start">
              <span {...stylex.props(styles.fieldLabel)}>From</span>
              <input
                {...stylex.props(styles.input)}
                id="interval-start"
                type="number"
                min="0"
                max={MAX_LIMIT - 1}
                step="1"
                value={draftStart}
                onChange={(event) => setDraftStart(event.target.value)}
                aria-describedby={validationError ? 'interval-error' : undefined}
              />
            </label>
            <label {...stylex.props(styles.field)} htmlFor="interval-end">
              <span {...stylex.props(styles.fieldLabel)}>To</span>
              <input
                {...stylex.props(styles.input)}
                id="interval-end"
                type="number"
                min="1"
                max={MAX_LIMIT}
                step="1"
                value={draftEnd}
                onChange={(event) => setDraftEnd(event.target.value)}
                aria-describedby={validationError ? 'interval-error' : undefined}
              />
            </label>
          </div>
          <button {...stylex.props(styles.primaryButton)} type="submit">
            Plot interval
          </button>
          <div {...stylex.props(styles.presets)} aria-label="Suggested intervals">
            {PRESETS.map(([presetStart, presetEnd]) => (
              <button
                {...stylex.props(
                  styles.preset,
                  start === presetStart && end === presetEnd ? styles.presetActive : null,
                )}
                type="button"
                key={presetEnd}
                onClick={() => applyInterval(presetStart, presetEnd)}
              >
                {presetStart}–{presetEnd}
              </button>
            ))}
          </div>
          <span {...stylex.props(styles.modeLabel)}>Vertical-axis direction</span>
          <div {...stylex.props(styles.modeSwitch)}>
            {[
              ['up', 'Lower at bottom'],
              ['down', 'Lower at top'],
            ].map(([value, label]) => (
              <button
                {...stylex.props(styles.modeButton, yDirection === value ? styles.modeButtonActive : null)}
                type="button"
                key={value}
                aria-pressed={yDirection === value}
                onClick={() => setYDirection(value)}
              >
                {label}
              </button>
            ))}
          </div>
          {validationError && <p id="interval-error" {...stylex.props(styles.error)} role="alert">{validationError}</p>}
        </form>
      </section>

      <section {...stylex.props(styles.plotCard)}>
        <div {...stylex.props(styles.plotHeader)}>
          <div>
            <p {...stylex.props(styles.plotLabel)}>
              Coordinates: (n, reverse(n)) · {displayedStart.toLocaleString()}–{displayedEnd.toLocaleString()}
            </p>
            <h2 {...stylex.props(styles.plotTitle)}>{displayedEnd.toLocaleString()} → {displayedStart.toLocaleString()}</h2>
          </div>
          <div {...stylex.props(styles.stats)}>
            {stats.map(([label, value]) => (
              <div key={label} {...stylex.props(styles.stat)}>
                <span {...stylex.props(styles.statValue)}>{value}</span>
                <span {...stylex.props(styles.statLabel)}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {plot.isPlotting && (
          <div {...stylex.props(styles.progressBlock)}>
            <div {...stylex.props(styles.progressLabel)}>
              <span>{plot.phase}: {start.toLocaleString()}–{end.toLocaleString()}</span>
              <span>{plot.progress}%</span>
            </div>
            <div
              {...stylex.props(styles.progressTrack)}
              role="progressbar"
              aria-label={`Plotting interval ${start} to ${end}`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={plot.progress}
            >
              <div {...stylex.props(styles.progressFill)} style={{ width: `${plot.progress}%` }} />
            </div>
          </div>
        )}
        {plot.error && <p {...stylex.props(styles.notice)} role="alert">{plot.error}</p>}
        <Legend />
        {plot.data?.outsideCount > 0 && (
          <p {...stylex.props(styles.notice)} role="status">
            {plot.data.outsideCount.toLocaleString()} reversed values fall outside the selected {displayedStart.toLocaleString()}–{displayedEnd.toLocaleString()} interval.
          </p>
        )}
        <div {...stylex.props(styles.plotWrap)}>
          {plot.data && <PrimePlot data={plot.data} onRendered={plot.finishRendering} yDirection={yDirection} />}
        </div>
      </section>
    </main>
  );
}
