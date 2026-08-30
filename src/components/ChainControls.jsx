import * as stylex from '@stylexjs/stylex';
import IntervalForm from './IntervalForm.jsx';
import { CHAIN_DIVISORS, CHAIN_MAX_LIMIT, isValidChainRequest } from '../lib/primeChains.js';
import { formatNumber, t } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';
import { chainStyles } from '../chainStyles.stylex.js';

export default function ChainControls({ start, end, divisor, onApply, onDivisor }) {
  return (
    <IntervalForm
      idPrefix="chain"
      max={CHAIN_MAX_LIMIT}
      isValid={(nextStart, nextEnd) => isValidChainRequest(nextStart, nextEnd, divisor)}
      start={start}
      end={end}
      onApply={onApply}
    >
      <span {...stylex.props(styles.label, styles.modeLabel)}>{t.ruleLabel}</span>
      <div {...stylex.props(chainStyles.ruleGroup)}>
        {CHAIN_DIVISORS.map((value) => (
          <button
            {...stylex.props(chainStyles.ruleButton, divisor === value ? styles.activeButton : null)}
            type="button"
            key={value}
            aria-pressed={divisor === value}
            onClick={() => onDivisor(value)}
          >
            {t.ruleOption(value, formatNumber(value))}
          </button>
        ))}
      </div>
      {/* The note key is derived from the divisor, so adding a rule needs no
          parallel lookup table here. */}
      <p {...stylex.props(chainStyles.ruleNote)}>{t[`ruleNote${divisor}`]}</p>
    </IntervalForm>
  );
}
