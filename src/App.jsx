import { useCallback, useMemo, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import IntervalControls from './components/IntervalControls.jsx';
import Legend from './components/Legend.jsx';
import PrimePlot from './components/PrimePlot.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import Specimen from './components/Specimen.jsx';
import TopLinks from './components/TopLinks.jsx';
import { usePlotData } from './hooks/usePlotData.js';
import { pickSpecimen } from './lib/pickSpecimen.js';
import { formatNumber, phaseLabel, t } from './i18n/index.js';
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

  const specimen = useMemo(() => pickSpecimen(plot.data), [plot.data]);
  const displayedStart = plot.data?.start ?? start;
  const displayedEnd = plot.data?.end ?? end;
  const stats = plot.data ? [
    [t.statChecked, formatNumber(plot.data.count)],
    [t.statMarkers, formatNumber(plot.data.visibleMarkerCount)],
    [t.statPrimeN, formatNumber(plot.data.summary.originalPrimes)],
    [t.statPrimeReversals, formatNumber(plot.data.summary.reversedPrimes)],
    [t.statBothPrime, formatNumber(plot.data.summary.doublePrimes)],
  ] : [];

  return (
    <main {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.shell)}>
        <div {...stylex.props(styles.topBar)}>
          <span {...stylex.props(styles.wordmark)}>{t.wordmark}</span>
          <TopLinks page="home" otherPageLabel={t.chainsNavToChains} />
        </div>

        {specimen && <Specimen {...specimen} />}

        <p {...stylex.props(styles.intro)}>{t.introText}</p>

        <div {...stylex.props(styles.main)}>
          <div {...stylex.props(styles.controlsColumn)}>
            <IntervalControls
              start={start}
              end={end}
              yDirection={yDirection}
              onApply={applyInterval}
              onYDirection={setYDirection}
            />
          </div>

          <div {...stylex.props(styles.plotColumn)}>
            <div {...stylex.props(styles.plotCard)}>
              <div {...stylex.props(styles.plotHeader)}>
                <h1 {...stylex.props(styles.plotTitle)}>
                  {formatNumber(displayedStart)}–{formatNumber(displayedEnd)}
                </h1>
                <p {...stylex.props(styles.plotLabel)}>{t.coordinatesLabel}</p>
              </div>

              {plot.isPlotting && (
                <div {...stylex.props(styles.progressBlock)}>
                  <div {...stylex.props(styles.progressLabel)}>
                    <span>{phaseLabel(plot.phase)}</span>
                    <span>{plot.progress}%</span>
                  </div>
                  <div
                    {...stylex.props(styles.progressTrack)}
                    role="progressbar"
                    aria-label={t.progressAria(start, end)}
                    aria-valuemin="0" aria-valuemax="100" aria-valuenow={plot.progress}
                  >
                    <div {...stylex.props(styles.progressFill)} style={{ width: `${plot.progress}%` }} />
                  </div>
                </div>
              )}
              {plot.error && <p {...stylex.props(styles.notice)} role="alert">{plot.error}</p>}

              <Legend />
              <div {...stylex.props(styles.plotWrap)}>
                {plot.data && <PrimePlot data={plot.data} onRendered={plot.finishRendering} yDirection={yDirection} />}
              </div>
              {plot.data?.outsideCount > 0 && (
                <p {...stylex.props(styles.notice)} role="status">
                  {t.outsideNotice(
                    formatNumber(plot.data.outsideCount),
                    formatNumber(displayedStart),
                    formatNumber(displayedEnd),
                  )}
                </p>
              )}
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
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
