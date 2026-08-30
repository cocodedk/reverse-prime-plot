import * as stylex from '@stylexjs/stylex';
import { t } from '../i18n/index.js';
import { styles } from '../appStyles.stylex.js';
import { chainStyles } from '../chainStyles.stylex.js';

const POINTS = [
  ['whyPoint1Title', 'whyPoint1Body'],
  ['whyPoint2Title', 'whyPoint2Body'],
  ['whyPoint3Title', 'whyPoint3Body'],
];

export default function WhyDivide() {
  return (
    <section {...stylex.props(chainStyles.explainerCard)}>
      <h2 {...stylex.props(chainStyles.explainerTitle)}>{t.whyTitle}</h2>
      <p {...stylex.props(chainStyles.explainerLead)}>{t.whyIntro}</p>

      <div {...stylex.props(chainStyles.explainerPoints)}>
        {POINTS.map(([titleKey, bodyKey]) => (
          <div key={titleKey}>
            <h3 {...stylex.props(chainStyles.explainerPointTitle)}>{t[titleKey]}</h3>
            <p {...stylex.props(chainStyles.explainerBody)}>{t[bodyKey]}</p>
          </div>
        ))}
      </div>

      <p {...stylex.props(chainStyles.explainerConclusion)}>{t.whyConclusion}</p>
      <p {...stylex.props(chainStyles.explainerBody)}>{t.whyDivide18}</p>
      <p {...stylex.props(chainStyles.explainerBody)}>{t.whyDivide9}</p>
    </section>
  );
}
