import * as stylex from '@stylexjs/stylex';
import { formatNumber, t } from '../i18n/index.js';
import { chainStyles } from '../chainStyles.stylex.js';

// One place that knows the argument order of t.chainStep, which takes five
// positional values and was previously called identically from two components.
export default function ChainSteps({ steps, divisor }) {
  return (
    <div {...stylex.props(chainStyles.chainSteps)}>
      {steps.map((step) => (
        <span key={step.from} {...stylex.props(chainStyles.chainStep)}>
          {t.chainStep(
            formatNumber(step.from),
            formatNumber(step.reversed),
            formatNumber(step.difference),
            formatNumber(divisor),
            formatNumber(step.next),
          )}
        </span>
      ))}
    </div>
  );
}
