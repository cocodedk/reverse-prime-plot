import * as stylex from '@stylexjs/stylex';
import { styles } from '../appStyles.stylex.js';

export default function StatsRow({ items }) {
  return (
    <div {...stylex.props(styles.stats)}>
      {items.map(([label, value]) => (
        <div key={label} {...stylex.props(styles.stat)}>
          <span {...stylex.props(styles.statValue)}>{value}</span>
          <span {...stylex.props(styles.statLabel)}>{label}</span>
        </div>
      ))}
    </div>
  );
}
