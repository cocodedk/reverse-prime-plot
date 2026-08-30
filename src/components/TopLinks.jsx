import * as stylex from '@stylexjs/stylex';
import { LANGUAGE, t } from '../i18n/index.js';
import { linksFor } from '../i18n/links.js';
import { styles } from '../appStyles.stylex.js';

export default function TopLinks({ page, otherPageLabel }) {
  const links = linksFor(LANGUAGE, page);

  return (
    <div {...stylex.props(styles.topLinks)}>
      <a
        {...stylex.props(styles.langSwitch)}
        href={links.otherLanguage}
        hrefLang={t.langSwitchHrefLang}
        aria-label={t.langSwitchLabel}
      >
        {t.langSwitch}
      </a>
      <a {...stylex.props(styles.langSwitch)} href={links.otherPage}>
        {otherPageLabel}
      </a>
    </div>
  );
}
