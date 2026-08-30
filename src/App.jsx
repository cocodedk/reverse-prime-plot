import { useCallback, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import IntervalControls from './components/IntervalControls.jsx';
import Legend from './components/Legend.jsx';
import PrimePlot from './components/PrimePlot.jsx';
import { usePlotData } from './hooks/usePlotData.js';
import { styles } from './appStyles.stylex.js';

const DEFAULT_START = 0;
const DEFAULT_END = 100;

export default function App() {
  const [start, setStart] = useState(DEFAULT_START);
  const [end, setEnd] = useState(DEFAULT_END);
  const [yDirection, setYDirection] = useState('up');
  const plot = usePlotData(start, end);

  const applyInterval = useCallback((nextStart, nextEnd) => {
    setStart(nextStart);
    setEnd(nextEnd);
  }, []);

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

        <IntervalControls
          start={start}
          end={end}
          yDirection={yDirection}
          onApply={applyInterval}
          onYDirection={setYDirection}
        />
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
