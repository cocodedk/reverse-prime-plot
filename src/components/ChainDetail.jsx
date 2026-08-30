import * as stylex from '@stylexjs/stylex';
import ChainSteps from './ChainSteps.jsx';
import { formatNumber, t } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';
import { chainStyles } from '../chainStyles.stylex.js';

export default function ChainDetail({ chain, divisor, onClear }) {
  const last = chain.steps.at(-1)?.next ?? chain.seed;

  return (
    <div {...stylex.props(chainStyles.detailCard)} role="status">
      <div {...stylex.props(chainStyles.detailHead)}>
        <div>
          <p {...stylex.props(styles.plotLabel)}>{t.chainsDetailTitle}</p>
          <p {...stylex.props(chainStyles.detailSeed)}>{formatNumber(chain.seed)}</p>
        </div>
        <button {...stylex.props(styles.outlineButton, chainStyles.detailClose)} type="button" onClick={onClear}>
          {t.chainsDetailClose}
        </button>
      </div>

      <p {...stylex.props(chainStyles.detailBody)}>
        {t.chainsDetailPair(formatNumber(chain.seed), formatNumber(chain.reversed))}{' '}
        {t.chainsDetailDepth(chain.depth, formatNumber(chain.depth))}
      </p>

      <ChainSteps steps={chain.steps} divisor={divisor} />

      <p {...stylex.props(chainStyles.detailBody)}>{t.chainsDetailEnd(formatNumber(last))}</p>
    </div>
  );
}
