import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { isValidInterval, MAX_LIMIT } from '../lib/primeNumbers.js';
import { styles } from '../appStyles.stylex.js';

const PRESETS = [[0, 50], [0, 100], [0, 250]];
const Y_DIRECTIONS = [
  ['up', 'Lower at bottom'],
  ['down', 'Lower at top'],
];

export default function IntervalControls({ start, end, yDirection, onApply, onYDirection }) {
  const [draftStart, setDraftStart] = useState(String(start));
  const [draftEnd, setDraftEnd] = useState(String(end));
  const [validationError, setValidationError] = useState('');

  function applyInterval(startValue, endValue) {
    const nextStart = Number(startValue);
    const nextEnd = Number(endValue);
    if (!isValidInterval(nextStart, nextEnd)) {
      setValidationError(
        `Choose whole numbers where 0 ≤ From < To ≤ ${MAX_LIMIT.toLocaleString()}.`,
      );
      return;
    }
    setDraftStart(String(nextStart));
    setDraftEnd(String(nextEnd));
    setValidationError('');
    onApply(nextStart, nextEnd);
  }

  return (
    <form
      {...stylex.props(styles.controls)}
      onSubmit={(event) => {
        event.preventDefault();
        applyInterval(draftStart, draftEnd);
      }}
    >
      <span {...stylex.props(styles.label)}>Choose interval</span>
      <div {...stylex.props(styles.intervalFields)}>
        <label {...stylex.props(styles.field)} htmlFor="interval-start">
          <span {...stylex.props(styles.fieldLabel)}>From</span>
          <input
            {...stylex.props(styles.input)}
            id="interval-start"
            type="number"
            min="0"
            max={MAX_LIMIT - 1}
            step="1"
            value={draftStart}
            onChange={(event) => setDraftStart(event.target.value)}
            aria-describedby={validationError ? 'interval-error' : undefined}
          />
        </label>
        <label {...stylex.props(styles.field)} htmlFor="interval-end">
          <span {...stylex.props(styles.fieldLabel)}>To</span>
          <input
            {...stylex.props(styles.input)}
            id="interval-end"
            type="number"
            min="1"
            max={MAX_LIMIT}
            step="1"
            value={draftEnd}
            onChange={(event) => setDraftEnd(event.target.value)}
            aria-describedby={validationError ? 'interval-error' : undefined}
          />
        </label>
      </div>
      <button {...stylex.props(styles.primaryButton)} type="submit">
        Plot interval
      </button>
      <div {...stylex.props(styles.presets)} aria-label="Suggested intervals">
        {PRESETS.map(([presetStart, presetEnd]) => (
          <button
            {...stylex.props(
              styles.preset,
              start === presetStart && end === presetEnd ? styles.presetActive : null,
            )}
            type="button"
            key={presetEnd}
            onClick={() => applyInterval(presetStart, presetEnd)}
          >
            {presetStart}–{presetEnd}
          </button>
        ))}
      </div>
      <span {...stylex.props(styles.label, styles.modeLabel)}>Vertical-axis direction</span>
      <div {...stylex.props(styles.modeSwitch)}>
        {Y_DIRECTIONS.map(([value, label]) => (
          <button
            {...stylex.props(styles.modeButton, yDirection === value ? styles.modeButtonActive : null)}
            type="button"
            key={value}
            aria-pressed={yDirection === value}
            onClick={() => onYDirection(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {validationError && <p id="interval-error" {...stylex.props(styles.error)} role="alert">{validationError}</p>}
    </form>
  );
}
