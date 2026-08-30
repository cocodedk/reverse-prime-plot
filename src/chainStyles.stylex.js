import * as stylex from '@stylexjs/stylex';
import { color } from './tokens.stylex.js';

const MONO = '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
// A shorthand cannot interpolate a token, so this is the one place the rule
// colour is still written out; tokens.stylex.js remains its source of truth.
const RULE = '1px solid #dfe0dc';

// Chains-page styles; the shared page shell stays in appStyles.stylex.js.
export const chainStyles = stylex.create({
  ruleGroup: { display: 'grid', gap: '6px' },
  ruleButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: color.edge,
    borderRadius: 0,
    borderStyle: 'solid',
    borderWidth: '1px',
    color: color.body,
    cursor: 'pointer',
    display: 'flex',
    fontFamily: MONO,
    fontSize: '13px',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '0 10px',
    ':hover': { borderColor: color.ink, color: color.ink },
  },
  ruleNote: { color: color.body, fontSize: '12px', lineHeight: 1.55, marginBottom: 0, marginTop: '2px' },

  emptyState: { borderTop: RULE, marginTop: '12px', paddingTop: '14px' },
  emptyTitle: { color: color.ink, fontFamily: MONO, fontSize: '14px', margin: 0 },
  emptyBody: { color: color.body, fontSize: '13px', lineHeight: 1.6, marginBottom: 0, marginTop: '6px', maxWidth: '62ch' },

  selectHint: { color: color.muted, fontFamily: MONO, fontSize: '11px', marginBottom: 0, marginTop: '10px' },

  detailCard: { borderTop: RULE, marginTop: '14px', paddingTop: '14px' },
  detailHead: { alignItems: 'baseline', display: 'flex', gap: '12px', justifyContent: 'space-between' },
  detailSeed: { color: color.accent, fontFamily: MONO, fontSize: '1.5rem', marginBottom: 0, marginTop: '2px' },
  detailBody: { color: color.body, fontSize: '13px', lineHeight: 1.6, marginBottom: 0, marginTop: '8px', maxWidth: '62ch' },
  detailClose: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: color.edge,
    borderRadius: 0,
    borderStyle: 'solid',
    borderWidth: '1px',
    color: color.body,
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: MONO,
    fontSize: '11px',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '0 12px',
    ':hover': { borderColor: color.ink, color: color.ink },
  },

  chainList: { display: 'grid', gap: '1px', gridAutoRows: '1fr', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', listStyle: 'none', marginTop: '12px', padding: 0 },
  chainItem: { display: 'flex' },
  chainButton: {
    backgroundColor: 'transparent',
    flexGrow: 1,
    borderColor: color.rule,
    borderRadius: 0,
    borderStyle: 'solid',
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'block',
    padding: '10px 12px',
    textAlign: 'start',
    width: '100%',
    ':hover': { borderColor: color.ink },
  },
  chainButtonActive: { borderColor: color.accent, boxShadow: 'inset 0 0 0 1px #1f4bff' },
  chainSeed: { alignItems: 'baseline', display: 'flex', gap: '8px', justifyContent: 'space-between' },
  chainSeedValue: { color: color.ink, fontFamily: MONO, fontSize: '15px' },
  chainDepth: { color: color.muted, fontFamily: MONO, fontSize: '10px' },
  chainSteps: { display: 'grid', gap: '2px', marginTop: '6px' },
  chainStep: { color: color.body, fontFamily: MONO, fontSize: '11.5px' },

  explainerCard: { borderTop: RULE, marginTop: '4px', padding: '20px 16px 8px' },
  explainerTitle: { color: color.ink, fontFamily: MONO, fontSize: 'clamp(1.05rem, 3vw, 1.3rem)', fontWeight: 500, margin: 0 },
  explainerLead: { color: color.body, fontSize: '14px', lineHeight: 1.6, marginBottom: 0, marginTop: '10px', maxWidth: '68ch' },
  explainerPoints: { display: 'grid', gap: '18px', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: '20px' },
  explainerPointTitle: { color: color.muted, fontFamily: MONO, fontSize: '10px', letterSpacing: '0.12em', margin: 0, textTransform: 'uppercase' },
  explainerBody: { color: color.body, fontSize: '13.5px', lineHeight: 1.65, marginBottom: 0, marginTop: '8px', maxWidth: '68ch' },
  explainerConclusion: {
    borderLeftColor: color.accent,
    borderLeftStyle: 'solid',
    borderLeftWidth: '2px',
    color: color.ink,
    fontSize: '14px',
    lineHeight: 1.6,
    marginBottom: 0,
    marginTop: '20px',
    maxWidth: '68ch',
    paddingLeft: '14px',
  },
});
