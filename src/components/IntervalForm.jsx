import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { formatNumber, t } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';

// Both pages ask for an interval the same way and differ only in their ceiling,
// their validator, and the controls that follow the button, which arrive as
// children. Keeping one copy also settles a drift: the plot's form normalised
// the drafts after a valid apply and the chains form did not.
export default function IntervalForm({ idPrefix, max, isValid, start, end, onApply, children }) {
  const [draftStart, setDraftStart] = useState(String(start));
  const [draftEnd, setDraftEnd] = useState(String(end));
  const [validationError, setValidationError] = useState('');
  const errorId = `${idPrefix}-error`;

  function submit(event) {
    event.preventDefault();
    const nextStart = Number(draftStart);
    const nextEnd = Number(draftEnd);
    if (!isValid(nextStart, nextEnd)) {
      setValidationError(t.validationError(formatNumber(max)));
      return;
    }
    setDraftStart(String(nextStart));
    setDraftEnd(String(nextEnd));
    setValidationError('');
    onApply(nextStart, nextEnd);
  }

  return (
    <form {...stylex.props(styles.controls)} onSubmit={submit}>
      <span {...stylex.props(styles.label)}>{t.chooseInterval}</span>
      <div {...stylex.props(styles.intervalFields)}>
        <label {...stylex.props(styles.field)} htmlFor={`${idPrefix}-start`}>
          <span {...stylex.props(styles.fieldLabel)}>{t.from}</span>
          <input
            {...stylex.props(styles.input)}
            id={`${idPrefix}-start`}
            type="number" min="0" max={max - 1} step="1"
            value={draftStart}
            onChange={(event) => setDraftStart(event.target.value)}
            aria-describedby={validationError ? errorId : undefined}
          />
        </label>
        <label {...stylex.props(styles.field)} htmlFor={`${idPrefix}-end`}>
          <span {...stylex.props(styles.fieldLabel)}>{t.to}</span>
          <input
            {...stylex.props(styles.input)}
            id={`${idPrefix}-end`}
            type="number" min="1" max={max} step="1"
            value={draftEnd}
            onChange={(event) => setDraftEnd(event.target.value)}
            aria-describedby={validationError ? errorId : undefined}
          />
        </label>
      </div>
      <button {...stylex.props(styles.primaryButton)} type="submit">{t.plotInterval}</button>

      {children}

      {validationError && (
        <p id={errorId} {...stylex.props(styles.error)} role="alert">{validationError}</p>
      )}
    </form>
  );
}
