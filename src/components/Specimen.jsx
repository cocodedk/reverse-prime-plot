import * as stylex from '@stylexjs/stylex';
import { ACCENT, INK } from '../lib/palette.js';
import { formatNumber, t } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';

// The page opens on one worked pair rather than a title, so the idea is legible
// before anything is scrolled. Values come from the plotted data, not a fixture.
export default function Specimen({ number, reversed, bothPrime, dense = false }) {
  return (
    <section {...stylex.props(styles.specimen)}>
      <div {...stylex.props(styles.specimenRow)}>
        <div {...stylex.props(styles.specimenTerm)}>
          <span {...stylex.props(styles.specimenValue)}>{formatNumber(number)}</span>
          <span {...stylex.props(styles.specimenLabel)}>n</span>
        </div>
        <div {...stylex.props(styles.specimenArrow)}>
          <svg width="34" height="14" viewBox="0 0 34 14" fill="none" aria-hidden="true">
            <path d="M1 7h29" stroke={INK} strokeWidth="1.2" />
            <path d="M25 2l6 5-6 5" stroke={INK} strokeWidth="1.2" fill="none" />
          </svg>
          <span {...stylex.props(styles.specimenLabel)}>{t.specimenReverse}</span>
        </div>
        <div {...stylex.props(styles.specimenTerm)}>
          <span {...stylex.props(styles.specimenValue)}>{formatNumber(reversed)}</span>
          <span {...stylex.props(styles.specimenLabel)}>{t.specimenReversedLabel}</span>
        </div>
      </div>

      {bothPrime && (
        <p {...stylex.props(styles.specimenVerdict)}>
          <svg width="17" height="17" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="10" cy="10" r="8" fill={dense ? ACCENT : INK} />
          </svg>
          {t.specimenVerdict}
        </p>
      )}
    </section>
  );
}
