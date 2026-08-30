import * as stylex from '@stylexjs/stylex';
import IntervalForm from './IntervalForm.jsx';
import { isValidInterval, MAX_LIMIT } from '../lib/primeNumbers.js';
import { formatNumber, t } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';

const PRESETS = [[0, 50], [0, 100], [0, 250]];
const Y_DIRECTIONS = [
  ['up', 'lowerAtBottom'],
  ['down', 'lowerAtTop'],
];

export default function IntervalControls({ start, end, yDirection, onApply, onYDirection }) {
  return (
    <IntervalForm
      idPrefix="interval"
      max={MAX_LIMIT}
      isValid={isValidInterval}
      start={start}
      end={end}
      onApply={onApply}
    >
      <div {...stylex.props(styles.presets)} aria-label={t.suggestedIntervals}>
        {PRESETS.map(([presetStart, presetEnd]) => (
          <button
            {...stylex.props(
              styles.outlineButton,
              styles.preset,
              start === presetStart && end === presetEnd ? styles.activeButton : null,
            )}
            type="button"
            key={presetEnd}
            onClick={() => onApply(presetStart, presetEnd)}
          >
            {formatNumber(presetStart)}–{formatNumber(presetEnd)}
          </button>
        ))}
      </div>
      <span {...stylex.props(styles.label, styles.modeLabel)}>{t.axisDirection}</span>
      <div {...stylex.props(styles.modeSwitch)}>
        {Y_DIRECTIONS.map(([value, labelKey]) => (
          <button
            {...stylex.props(styles.outlineButton, styles.modeButton, yDirection === value ? styles.activeButton : null)}
            type="button"
            key={value}
            aria-pressed={yDirection === value}
            onClick={() => onYDirection(value)}
          >
            {t[labelKey]}
          </button>
        ))}
      </div>
    </IntervalForm>
  );
}
