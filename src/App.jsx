import { useCallback, useMemo, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import IntervalControls from './components/IntervalControls.jsx';
import Legend from './components/Legend.jsx';
import PlotProgress from './components/PlotProgress.jsx';
import PrimePlot from './components/PrimePlot.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import StatsRow from './components/StatsRow.jsx';
import Specimen from './components/Specimen.jsx';
import TopLinks from './components/TopLinks.jsx';
import { usePlotData } from './hooks/usePlotData.js';
import { usesPixelReadback } from './lib/drawPrimePlot.js';
import { pickSpecimen } from './lib/pickSpecimen.js';
import { formatNumber, t } from './i18n/index.js';
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
                <PlotProgress
                  phase={plot.phase}
                  progress={plot.progress}
                  label={t.progressAria(formatNumber(start), formatNumber(end))}
                />
              )}
              {plot.error && <p {...stylex.props(styles.notice)} role="alert">{plot.error}</p>}

              <Legend dense={plot.data ? usesPixelReadback(plot.data) : false} />
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

            <StatsRow items={stats} />
          </div>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
