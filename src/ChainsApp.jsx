import { useCallback, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import ChainControls from './components/ChainControls.jsx';
import ChainList from './components/ChainList.jsx';
import ChainPlot from './components/ChainPlot.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import TopLinks from './components/TopLinks.jsx';
import { useChainData } from './hooks/useChainData.js';
import { formatNumber, phaseLabel, t } from './i18n/index.js';
import { styles } from './appStyles.stylex.js';

const DEFAULT_START = 0;
const DEFAULT_END = 5000;
const DEFAULT_DIVISOR = 18;

export default function ChainsApp() {
  const [start, setStart] = useState(DEFAULT_START);
  const [end, setEnd] = useState(DEFAULT_END);
  const [divisor, setDivisor] = useState(DEFAULT_DIVISOR);
  const chains = useChainData(start, end, divisor);

  const applyInterval = useCallback((nextStart, nextEnd) => {
    setStart(nextStart);
    setEnd(nextEnd);
  }, []);

  const stats = chains.data ? [
    [t.statSeeds, formatNumber(chains.data.seedCount)],
    [t.statChains, formatNumber(chains.data.chainCount)],
    [t.statDeepest, formatNumber(chains.data.maxDepth)],
  ] : [];

  return (
    <main {...stylex.props(styles.page)}>
      <section {...stylex.props(styles.hero)}>
        <div>
          <TopLinks page="chains" otherPageLabel={t.chainsNavToPlot} />
          <p {...stylex.props(styles.eyebrow)}>{t.chainsEyebrow}</p>
          <h1 {...stylex.props(styles.title)}>{t.chainsTitle}</h1>
          <p {...stylex.props(styles.intro)}>
            {t.chainsIntroLead} <strong>{t.introFormula}</strong>{t.chainsIntroRest}
          </p>
        </div>
        <ChainControls
          start={start} end={end} divisor={divisor}
          onApply={applyInterval} onDivisor={setDivisor}
        />
      </section>

      <section {...stylex.props(styles.plotCard)}>
        <div {...stylex.props(styles.plotHeader)}>
          <div>
            <p {...stylex.props(styles.plotLabel)}>
              {t.chainsPlotLabel(formatNumber(start), formatNumber(end))}
            </p>
            <h2 {...stylex.props(styles.plotTitle)}>{t.ruleOption(divisor)}</h2>
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

        {chains.isPlotting && (
          <div {...stylex.props(styles.progressBlock)}>
            <div {...stylex.props(styles.progressLabel)}>
              <span>{phaseLabel(chains.phase)}: {formatNumber(start)}–{formatNumber(end)}</span>
              <span>{chains.progress}%</span>
            </div>
            <div
              {...stylex.props(styles.progressTrack)}
              role="progressbar"
              aria-label={t.progressAria(start, end)}
              aria-valuemin="0" aria-valuemax="100" aria-valuenow={chains.progress}
            >
              <div {...stylex.props(styles.progressFill)} style={{ width: `${chains.progress}%` }} />
            </div>
          </div>
        )}
        {chains.error && <p {...stylex.props(styles.notice)} role="alert">{chains.error}</p>}

        {chains.data && chains.data.chainCount === 0 ? (
          <div {...stylex.props(styles.emptyState)} role="status">
            <p {...stylex.props(styles.emptyTitle)}>{t.chainsEmptyTitle}</p>
            <p {...stylex.props(styles.emptyBody)}>{t.chainsEmptyBody}</p>
          </div>
        ) : null}

        {chains.data && chains.data.chainCount > 0 && (
          <>
            <div {...stylex.props(styles.plotWrap)}>
              <ChainPlot data={chains.data} />
            </div>
            <ChainList examples={chains.data.examples} divisor={divisor} />
          </>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
