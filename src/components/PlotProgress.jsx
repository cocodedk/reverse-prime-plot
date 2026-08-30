import * as stylex from '@stylexjs/stylex';
import { phaseLabel } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';

export default function PlotProgress({ phase, progress, label }) {
  return (
    <div {...stylex.props(styles.progressBlock)}>
      <div {...stylex.props(styles.progressLabel)}>
        <span>{phaseLabel(phase)}</span>
        <span>{progress}%</span>
      </div>
      <div
        {...stylex.props(styles.progressTrack)}
        role="progressbar"
        aria-label={label}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
      >
        <div {...stylex.props(styles.progressFill)} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
