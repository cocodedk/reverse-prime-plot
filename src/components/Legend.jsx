import * as stylex from '@stylexjs/stylex';
import { ACCENT, CARD, INK, PRIME_COLOR } from '../lib/palette.js';
import { t } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';

function Glyph({ state }) {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill={state === 'full' ? PRIME_COLOR : CARD} />
      {state === 'top' && (
        <path d="M 2 10 A 8 8 0 0 1 18 10 L 2 10 Z" fill={PRIME_COLOR} />
      )}
      {state === 'bottom' && (
        <path d="M 2 10 A 8 8 0 0 0 18 10 L 2 10 Z" fill={PRIME_COLOR} />
      )}
      <circle cx="10" cy="10" r="8" fill="none" stroke={INK} strokeWidth="1.4" />
    </svg>
  );
}

const items = [
  ['top', 'legendTop'],
  ['bottom', 'legendBottom'],
  ['full', 'legendFull'],
];

export default function Legend() {
  return (
    <div {...stylex.props(styles.legend)} aria-label={t.legendLabel}>
      {items.map(([state, labelKey]) => (
        <div key={state} {...stylex.props(styles.legendItem)}>
          <Glyph state={state} />
          <span>{t[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}
