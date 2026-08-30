import * as stylex from '@stylexjs/stylex';
import { t } from '../i18n/index.js';
import { REPOSITORY_URL } from '../i18n/links.js';
import { styles } from '../appStyles.stylex.js';

export default function SiteFooter() {
  return (
    <footer {...stylex.props(styles.footer)}>
      <p>
        Apache-2.0 &nbsp;|&nbsp; © {t.footerYear}{' '}
        <a {...stylex.props(styles.footerLink)} href="https://cocode.dk" target="_blank" rel="noreferrer">Cocode</a>
        &nbsp;|&nbsp; {t.footerCreatedBy}{' '}
        <a {...stylex.props(styles.footerLink)} href="https://linkedin.com/in/babakbandpey" target="_blank" rel="noreferrer">{t.authorName}</a>
        &nbsp;|&nbsp;{' '}
        <a {...stylex.props(styles.footerLink)} href={REPOSITORY_URL} target="_blank" rel="noreferrer">{t.viewSource}</a>
      </p>
    </footer>
  );
}
