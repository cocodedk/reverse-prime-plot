import * as stylex from '@stylexjs/stylex';
import { formatNumber, t } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';
import { chainStyles } from '../chainStyles.stylex.js';

export default function ChainList({ examples, divisor, selectedSeed, onSelect }) {
  if (examples.length === 0) return null;

  return (
    <>
      <h3 {...stylex.props(styles.plotLabel)}>{t.chainsListTitle}</h3>
      <ul {...stylex.props(chainStyles.chainList)}>
        {examples.map(({ seed, steps }) => (
          <li key={seed}>
            <button
              {...stylex.props(
                chainStyles.chainButton,
                selectedSeed === seed ? chainStyles.chainButtonActive : null,
              )}
              type="button"
              aria-pressed={selectedSeed === seed}
              onClick={() => onSelect(seed)}
            >
            <div {...stylex.props(chainStyles.chainSeed)}>
              <span {...stylex.props(chainStyles.chainSeedValue)}>{formatNumber(seed)}</span>
              <span {...stylex.props(chainStyles.chainDepth)}>{t.chainDepthLabel(steps.length, formatNumber(steps.length))}</span>
            </div>
            <div {...stylex.props(chainStyles.chainSteps)}>
              {steps.map((step) => (
                <span key={step.from} {...stylex.props(chainStyles.chainStep)}>
                  {t.chainStep(
                    formatNumber(step.from),
                    formatNumber(step.reversed),
                    formatNumber(step.difference),
                    formatNumber(divisor),
                    formatNumber(step.next),
                  )}
                </span>
              ))}
            </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
