import * as stylex from '@stylexjs/stylex';

// defineVars produces statically analysable tokens, which stylex.create WILL
// accept — unlike a plain imported constant. This is what lets the two
// stylesheets share one palette instead of repeating literals.
export const color = stylex.defineVars({
  paper: '#f8f8f6',
  card: '#ffffff',
  ink: '#12151a',
  body: '#4a4f4c',
  muted: '#6b6f6a',
  rule: '#dfe0dc',
  edge: '#c9cbc7',
  accent: '#1f4bff',
});
