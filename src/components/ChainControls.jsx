import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { CHAIN_DIVISORS, isValidChainRequest, MAX_LIMIT } from '../lib/primeChains.js';
import { formatNumber, t } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';
import { chainStyles } from '../chainStyles.stylex.js';

const RULE_NOTES = { 1: 'ruleNote1', 9: 'ruleNote9', 18: 'ruleNote18' };

export default function ChainControls({ start, end, divisor, onApply, onDivisor }) {
  const [draftStart, setDraftStart] = useState(String(start));
  const [draftEnd, setDraftEnd] = useState(String(end));
  const [validationError, setValidationError] = useState('');

  function submit(event) {
    event.preventDefault();
    const nextStart = Number(draftStart);
    const nextEnd = Number(draftEnd);
    if (!isValidChainRequest(nextStart, nextEnd, divisor)) {
      setValidationError(t.validationError(formatNumber(MAX_LIMIT)));
      return;
    }
    setValidationError('');
    onApply(nextStart, nextEnd);
  }

  return (
    <form {...stylex.props(styles.controls)} onSubmit={submit}>
      <span {...stylex.props(styles.label)}>{t.chooseInterval}</span>
      <div {...stylex.props(styles.intervalFields)}>
        <label {...stylex.props(styles.field)} htmlFor="chain-start">
          <span {...stylex.props(styles.fieldLabel)}>{t.from}</span>
          <input
            {...stylex.props(styles.input)}
            id="chain-start" type="number" min="0" max={MAX_LIMIT - 1} step="1"
            value={draftStart}
            onChange={(event) => setDraftStart(event.target.value)}
            aria-describedby={validationError ? 'chain-error' : undefined}
          />
        </label>
        <label {...stylex.props(styles.field)} htmlFor="chain-end">
          <span {...stylex.props(styles.fieldLabel)}>{t.to}</span>
          <input
            {...stylex.props(styles.input)}
            id="chain-end" type="number" min="1" max={MAX_LIMIT} step="1"
            value={draftEnd}
            onChange={(event) => setDraftEnd(event.target.value)}
            aria-describedby={validationError ? 'chain-error' : undefined}
          />
        </label>
      </div>
      <button {...stylex.props(styles.primaryButton)} type="submit">{t.plotInterval}</button>

      <span {...stylex.props(styles.label, styles.modeLabel)}>{t.ruleLabel}</span>
      <div {...stylex.props(chainStyles.ruleGroup)}>
        {CHAIN_DIVISORS.map((value) => (
          <button
            {...stylex.props(chainStyles.ruleButton, divisor === value ? chainStyles.ruleButtonActive : null)}
            type="button"
            key={value}
            aria-pressed={divisor === value}
            onClick={() => onDivisor(value)}
          >
            {t.ruleOption(value, formatNumber(value))}
          </button>
        ))}
      </div>
      <p {...stylex.props(chainStyles.ruleNote)}>{t[RULE_NOTES[divisor]]}</p>
      {validationError && (
        <p id="chain-error" {...stylex.props(styles.error)} role="alert">{validationError}</p>
      )}
    </form>
  );
}
