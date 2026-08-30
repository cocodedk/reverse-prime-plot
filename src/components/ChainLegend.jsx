import * as stylex from '@stylexjs/stylex';
import { ACCENT, CARD, INK, PRIME_COLOR } from '../lib/palette.js';
import { t } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';

// Proportions mirror drawChainPlot: a deep marker is roughly twice the radius
// of a single-link one, with a cream core punched out of it.
const GLYPHS = [
  ['one', ['chainsLegendOne']],
  ['deep', ['chainsLegendDeep']],
];

function Glyph({ kind }) {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true">
      {kind === 'deep' ? (
        <>
          <circle cx="10" cy="10" r="9" fill={ACCENT} />
          <circle cx="10" cy="10" r="3.5" fill={CARD} />
        </>
      ) : (
        <circle cx="10" cy="10" r="4.8" fill={INK} />
      )}
    </svg>
  );
}

export default function ChainLegend() {
  return (
    <div {...stylex.props(styles.legend)} aria-label={t.chainsLegendLabel}>
      {GLYPHS.map(([kind, [labelKey]]) => (
        <div key={kind} {...stylex.props(styles.item)}>
          <Glyph kind={kind} />
          <span>{t[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}
