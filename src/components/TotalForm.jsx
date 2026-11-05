import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { formatNumber, t } from '../i18n/index.js';
import { isValidTotal, MIN_TOTAL } from '../lib/primeSums.js';
import { MAX_LIMIT } from '../lib/primeNumbers.js';
import { styles } from '../appStyles.stylex.js';

const ERROR_ID = 'total-error';

// The sums page asks for one number where the other pages ask for an interval.
export default function TotalForm({ total, onApply }) {
  const [draft, setDraft] = useState(String(total));
  const [validationError, setValidationError] = useState('');

  // The total can also be set from outside the form (the WebMCP tool does), so
  // resync during render, as IntervalForm does, and never paint a stale value.
  const [lastTotal, setLastTotal] = useState(total);
  if (total !== lastTotal) {
    setLastTotal(total);
    setDraft(String(total));
  }

  function submit(event) {
    event.preventDefault();
    const next = Number(draft);
    if (!isValidTotal(next)) {
      setValidationError(t.totalValidationError(formatNumber(MIN_TOTAL), formatNumber(MAX_LIMIT)));
      return;
    }
    setValidationError('');
    onApply(next);
  }

  return (
    <form {...stylex.props(styles.controls)} onSubmit={submit}>
      <label {...stylex.props(styles.field)} htmlFor="total">
        <span {...stylex.props(styles.label)}>{t.totalLabel}</span>
        <input
          {...stylex.props(styles.input)}
          id="total"
          type="number" min={MIN_TOTAL} max={MAX_LIMIT} step="1"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          aria-describedby={validationError ? ERROR_ID : undefined}
        />
      </label>
      <button {...stylex.props(styles.primaryButton)} type="submit">{t.plotTotal}</button>
      {validationError && (
        <p id={ERROR_ID} {...stylex.props(styles.error)} role="alert">{validationError}</p>
      )}
    </form>
  );
}
