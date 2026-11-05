import { useEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import PlotProgress from './components/PlotProgress.jsx';
import PrimePlot from './components/PrimePlot.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import StatsRow from './components/StatsRow.jsx';
import TotalForm from './components/TotalForm.jsx';
import { useSumData } from './hooks/useSumData.js';
import { formatNumber, t } from './i18n/index.js';
import { initSumsWebMcp } from './sumsWebMcp.js';
import { styles } from './appStyles.stylex.js';

const DEFAULT_TOTAL = 100;
// N at the bottom, so both axes start from the corner where k = 0 meets N − k = N
// and the pairs run from bottom left to top right.
const Y_DIRECTION = 'down';
const AXES = [t.sumsAxisX, t.sumsAxisY];

export default function SumsApp() {
  const [total, setTotal] = useState(DEFAULT_TOTAL);
  const sums = useSumData(total);

  // The WebMCP tools are registered once and read the latest state through this.
  const live = useRef(null);
  useEffect(() => { live.current = { total, ...sums }; });
  useEffect(() => {
    const teardown = new AbortController();
    void initSumsWebMcp({ read: () => live.current, plot: setTotal }, teardown.signal);
    return () => teardown.abort();
  }, []);

  const stats = sums.data ? [
    [t.statChecked, formatNumber(sums.data.total - 1)],
    [t.statPoints, formatNumber(sums.data.markerNumbers.length)],
    [t.statDistinctPairs, formatNumber(sums.data.distinctPairs)],
  ] : [];

  return (
    <main {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.shell)}>
        <p {...stylex.props(styles.intro)}>{t.sumsIntro}</p>

        <div {...stylex.props(styles.main)}>
          <div {...stylex.props(styles.controlsColumn)}>
            <TotalForm total={total} onApply={setTotal} />
          </div>

          <div {...stylex.props(styles.plotColumn)}>
            <div {...stylex.props(styles.plotCard)}>
              <div {...stylex.props(styles.plotHeader)}>
                <h1 {...stylex.props(styles.plotTitle)}>{t.sumsTitle(formatNumber(sums.data?.total ?? total))}</h1>
                <p {...stylex.props(styles.plotLabel)}>{t.sumsCoordinatesLabel}</p>
              </div>

              {sums.isPlotting && (
                <PlotProgress phase={sums.phase} progress={sums.progress} label={t.sumsProgressAria(formatNumber(total))} />
              )}
              {sums.error && <p {...stylex.props(styles.notice)} role="alert">{sums.error}</p>}

              <div {...stylex.props(styles.plotWrap)}>
                {sums.data && (
                  <PrimePlot
                    data={sums.data}
                    onRendered={sums.finishRendering}
                    yDirection={Y_DIRECTION}
                    axes={AXES}
                    description={t.sumsPlotDescription(formatNumber(sums.data.total))}
                  />
                )}
              </div>
            </div>

            <StatsRow items={stats} />
          </div>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
