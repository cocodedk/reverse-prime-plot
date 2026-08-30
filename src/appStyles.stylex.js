import * as stylex from '@stylexjs/stylex';
import { color } from './tokens.stylex.js';

const MONO = '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
// A shorthand cannot interpolate a token, so this is the one place the rule
// colour is still written out; tokens.stylex.js remains its source of truth.
const RULE = '1px solid #dfe0dc';

export const styles = stylex.create({
  page: { backgroundColor: color.paper, display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  shell: { marginLeft: 'auto', marginRight: 'auto', maxWidth: '1120px', width: '100%' },

  topBar: {
    alignItems: 'center',
    borderBottom: RULE,
    display: 'flex',
    gap: '10px',
    justifyContent: 'space-between',
    padding: '10px 16px',
    '@media (max-width: 420px)': { paddingLeft: '12px', paddingRight: '12px' },
  },
  wordmark: { color: color.muted, fontFamily: MONO, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  topLinks: { display: 'flex', gap: '2px' },
  langSwitch: {
    alignItems: 'center',
    color: color.muted,
    display: 'inline-flex',
    fontFamily: MONO,
    fontSize: '11px',
    minHeight: '44px',
    padding: '0 8px',
    textDecoration: 'none',
    ':hover': { color: color.accent },
  },

  // The specimen is the lead: one worked pair, before anything else.
  specimen: { borderBottom: RULE, display: 'flex', flexDirection: 'column', gap: '12px', padding: '22px 16px 18px' },
  specimenRow: { alignItems: 'center', display: 'flex', gap: '16px' },
  specimenTerm: { alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '5px' },
  specimenValue: { fontFamily: MONO, fontSize: 'clamp(2.1rem, 9vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1 },
  specimenLabel: { color: color.muted, fontFamily: MONO, fontSize: '10px', letterSpacing: '0.1em' },
  specimenArrow: { alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '3px' },
  specimenVerdict: { alignItems: 'center', color: color.ink, display: 'flex', fontSize: '15px', gap: '9px', lineHeight: 1.45 },

  intro: { color: color.body, fontSize: '14px', lineHeight: 1.55, margin: 0, maxWidth: '64ch', padding: '14px 16px 0' },
  mono: { fontFamily: MONO, fontSize: '13px' },

  main: { display: 'flex', flexDirection: 'column', gap: '0', '@media (min-width: 900px)': { flexDirection: 'row-reverse', gap: '0' } },
  controlsColumn: { borderBottom: RULE, '@media (min-width: 900px)': { borderBottom: 0, borderLeft: RULE, flexShrink: 0, width: '272px' } },
  plotColumn: { flexGrow: 1, minWidth: 0 },

  controls: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px' },
  label: { color: color.muted, fontFamily: MONO, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' },
  modeLabel: { marginTop: '6px' },
  intervalFields: { display: 'grid', gap: '8px', gridTemplateColumns: '1fr 1fr' },
  field: { display: 'block', minWidth: 0 },
  fieldLabel: { color: color.muted, display: 'block', fontFamily: MONO, fontSize: '10px', marginBottom: '4px' },
  input: {
    backgroundColor: color.card,
    borderColor: color.edge,
    borderRadius: 0,
    borderStyle: 'solid',
    borderWidth: '1px',
    color: color.ink,
    fontFamily: MONO,
    fontSize: '15px',
    minHeight: '44px',
    minWidth: 0,
    padding: '0 10px',
    width: '100%',
    ':focus': { borderColor: color.accent, outline: 'none' },
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: color.ink,
    borderRadius: 0,
    borderWidth: 0,
    color: color.paper,
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: MONO,
    fontSize: '13px',
    justifyContent: 'center',
    letterSpacing: '0.08em',
    minHeight: '44px',
    width: '100%',
    ':hover': { backgroundColor: color.accent },
  },
  presets: { display: 'flex', gap: '6px' },
  // preset, modeButton, ruleButton and detailClose were four copies of the same
  // outline treatment; each now keeps only what actually differs.
  outlineButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: color.edge,
    borderRadius: 0,
    borderStyle: 'solid',
    borderWidth: '1px',
    color: color.body,
    cursor: 'pointer',
    fontFamily: MONO,
    justifyContent: 'center',
    minHeight: '44px',
    ':hover': { borderColor: color.ink, color: color.ink },
  },
  preset: {
    display: 'inline-flex',
    flexGrow: 1,
    fontSize: '12px',
  },
  activeButton: {
    backgroundColor: color.ink,
    borderColor: color.ink,
    color: color.paper,
    ':hover': { backgroundColor: color.accent, borderColor: color.accent, color: color.card },
  },
  modeSwitch: { display: 'grid', gap: '6px', gridTemplateColumns: '1fr 1fr' },
  modeButton: {
    display: 'inline-flex',
    fontSize: '11px',
    padding: '0 6px',
    textAlign: 'center',
  },
  error: { color: '#b3261e', fontSize: '12px', margin: 0 },

  plotCard: { padding: '16px' },
  plotHeader: { alignItems: 'baseline', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between' },
  plotLabel: { color: color.muted, fontFamily: MONO, fontSize: '10px', letterSpacing: '0.12em', margin: 0, textTransform: 'uppercase' },
  plotTitle: { fontFamily: MONO, fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 500, letterSpacing: '-0.01em', margin: 0 },
  plotWrap: { marginTop: '12px', maxWidth: '760px' },

  stats: { borderBottom: RULE, borderTop: RULE, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(88px, 1fr))' },
  stat: { borderRight: RULE, padding: '10px 12px' },
  statValue: { color: color.ink, display: 'block', fontFamily: MONO, fontSize: '17px' },
  statLabel: { color: color.muted, display: 'block', fontFamily: MONO, fontSize: '9px', letterSpacing: '0.1em', marginTop: '2px', textTransform: 'uppercase' },

  progressBlock: { marginTop: '12px' },
  progressLabel: { color: color.muted, display: 'flex', fontFamily: MONO, fontSize: '11px', justifyContent: 'space-between', marginBottom: '5px' },
  progressTrack: { backgroundColor: '#e4e5e2', height: '2px', overflow: 'hidden' },
  progressFill: { backgroundColor: color.accent, height: '100%', transitionDuration: '120ms', transitionProperty: 'width', transitionTimingFunction: 'ease-out' },
  notice: { color: color.body, fontSize: '12.5px', lineHeight: 1.5, marginBottom: 0, marginTop: '12px' },

  plot: { aspectRatio: '1 / 1', display: 'block', height: 'auto', width: '100%' },
  plotClickable: { cursor: 'pointer' },
  visuallyHidden: {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
  legend: { display: 'flex', flexWrap: 'wrap', gap: '8px 18px', marginTop: '12px' },
  legendItem: { alignItems: 'center', color: color.body, display: 'flex', fontFamily: MONO, fontSize: '11.5px', gap: '7px', whiteSpace: 'nowrap' },

  footer: { borderTop: RULE, color: color.muted, fontFamily: MONO, fontSize: '11px', lineHeight: 1.7, padding: '14px 16px 20px' },
  footerLink: { color: color.body, ':hover': { color: color.accent } },

});
