import * as stylex from '@stylexjs/stylex';
import { formatNumber, t } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';

export default function ChainList({ examples, divisor }) {
  if (examples.length === 0) return null;

  return (
    <>
      <h3 {...stylex.props(styles.plotLabel)}>{t.chainsListTitle}</h3>
      <ul {...stylex.props(styles.chainList)}>
        {examples.map(({ seed, steps }) => (
          <li key={seed} {...stylex.props(styles.chainItem)}>
            <div {...stylex.props(styles.chainSeed)}>
              <span {...stylex.props(styles.chainSeedValue)}>{formatNumber(seed)}</span>
              <span {...stylex.props(styles.chainDepth)}>{t.chainDepthLabel(steps.length, formatNumber(steps.length))}</span>
            </div>
            <div {...stylex.props(styles.chainSteps)}>
              {steps.map((step) => (
                <span key={step.from} {...stylex.props(styles.chainStep)}>
                  {t.chainStep(
                    formatNumber(step.from),
                    formatNumber(step.reversed),
                    formatNumber(step.difference),
                    divisor,
                    formatNumber(step.next),
                  )}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
