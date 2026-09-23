import * as stylex from '@stylexjs/stylex';
import { styles } from '../appStyles.stylex.js';

// Copyright, "created by" and the source link used to live here too; the
// cocode.dk family frame's <cocode-foot> (in the HTML, below #root) now
// carries those. The license mention is not an author/copyright/source
// link, so it stays.
export default function SiteFooter() {
  return (
    <footer {...stylex.props(styles.footer)}>
      <p>
        <a {...stylex.props(styles.footerLink)} href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noreferrer">Apache-2.0</a>
      </p>
    </footer>
  );
}
