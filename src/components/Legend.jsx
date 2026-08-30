import * as stylex from '@stylexjs/stylex';
import { CREAM, INK, PRIME_COLOR } from '../lib/palette.js';

function Glyph({ state }) {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill={state === 'full' ? PRIME_COLOR : CREAM} />
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
  ['top', 'n is prime'],
  ['bottom', 'reverse(n) is prime'],
  ['full', 'both are prime'],
];

export default function Legend() {
  return (
    <div {...stylex.props(styles.legend)} aria-label="Plot legend">
      {items.map(([state, label]) => (
        <div key={state} {...stylex.props(styles.item)}>
          <Glyph state={state} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

const styles = stylex.create({
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px 22px',
    marginTop: '18px',
  },
  item: {
    alignItems: 'center',
    color: '#52645f',
    display: 'flex',
    fontSize: '0.82rem',
    fontWeight: 650,
    gap: '8px',
    whiteSpace: 'nowrap',
  },
});
