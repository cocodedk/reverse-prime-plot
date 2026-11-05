import * as stylex from '@stylexjs/stylex';
import { color } from './tokens.stylex.js';

// Plex Mono has no Arabic script; Vazirmatn before the system monospace keeps
// Persian month names joined instead of spread across fixed-width cells.
const MONO = '"IBM Plex Mono", Vazirmatn, ui-monospace, SFMono-Regular, Menlo, monospace';
// Prose inside a mono block (the Chinese year's meaning) goes back to the body face.
const SANS = '"IBM Plex Sans", Vazirmatn, ui-sans-serif, system-ui, sans-serif';
const RULE = '1px solid #dfe0dc';
// Tick labels sit on top of the event lines; a paper-coloured outline keeps them legible.
const HALO = { paintOrder: 'stroke', stroke: color.paper, strokeLinejoin: 'round', strokeWidth: '4px' };

export const iranStyles = stylex.create({
  timeline: { marginTop: '14px', minHeight: '182px' },
  axis: { stroke: color.edge, strokeWidth: '1px' },
  tick: { stroke: color.muted, strokeWidth: '1px' },
  tickLabel: { ...HALO, fill: color.body, fontFamily: MONO, fontSize: '11px', pointerEvents: 'none' },
  scaleName: { ...HALO, fill: color.muted, fontFamily: MONO, fontSize: '10px', letterSpacing: '0.1em', pointerEvents: 'none', textTransform: 'uppercase' },
  eventLine: { opacity: 0.3, stroke: color.ink, strokeWidth: '1px' },
  eventHit: { stroke: 'transparent', strokeWidth: '10px' },
  eventDot: { fill: color.ink },
  eventLink: { cursor: 'pointer' },

  events: { borderTop: RULE, padding: '16px' },
  eventsHeading: { fontFamily: MONO, fontSize: '13px', fontWeight: 500, letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' },
  list: { listStyle: 'none', margin: 0, padding: 0 },
  item: { borderBottom: RULE, padding: '16px 0', scrollMarginTop: '16px' },
  itemTitle: { color: color.ink, fontSize: '16px', fontWeight: 600, lineHeight: 1.35, margin: 0 },
  dates: { display: 'flex', flexWrap: 'wrap', gap: '8px 22px', margin: '10px 0 0' },
  dateValue: { color: color.ink, fontFamily: MONO, fontSize: '13px', margin: '2px 0 0' },
  dateEntry: { display: 'block' },
  ref: { fontSize: '9px', marginInlineStart: '2px' },
  refLink: { color: color.accent, textDecoration: 'none', ':hover': { textDecoration: 'underline' } },
  summary: { color: color.body, fontSize: '14px', lineHeight: 1.55, margin: '10px 0 0', maxWidth: '72ch' },
  sources: { listStyle: 'none', margin: '8px 0 0', padding: 0 },
  sourceNumber: { color: color.accent, display: 'inline-block', minWidth: '16px' },
  sourceItem: { color: color.muted, fontFamily: MONO, fontSize: '11px', lineHeight: 1.6, overflowWrap: 'anywhere' },
  source: { color: color.body, ':hover': { color: color.accent } },
  primeMarks: { color: color.ink, letterSpacing: '0.12em', marginInlineStart: '6px' },
  chineseYear: {
    cursor: 'pointer', listStyle: 'none', textDecorationLine: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '3px',
    '::-webkit-details-marker': { display: 'none' },
  },
  chineseTip: { color: color.body, fontFamily: SANS, fontSize: '12.5px', lineHeight: 1.55, margin: '6px 0 0', maxWidth: '60ch' },
  tableScroll: { margin: '12px 0 0', overflowX: 'auto' },
  primeTable: { borderCollapse: 'collapse', fontFamily: MONO, fontSize: '12px' },
  primeColumn: { color: color.muted, fontWeight: 500, padding: '4px 8px', textAlign: 'start' },
  primeRow: { color: color.body, fontWeight: 400, maxWidth: '16ch', paddingBlock: '6px', paddingInlineEnd: '8px', paddingInlineStart: 0, textAlign: 'start', verticalAlign: 'top' },
  primeCell: { borderTop: RULE, color: color.ink, padding: '6px 8px', verticalAlign: 'top', whiteSpace: 'nowrap' },
  primeDifferent: { color: color.accent, fontWeight: 600 },
  cellLine: { display: 'block' },
  cellChance: { color: color.muted },
  verdict: { color: color.ink, fontSize: '14px', fontWeight: 600, lineHeight: 1.55, margin: '12px 0 0', maxWidth: '72ch' },
  note: { color: color.muted, fontSize: '12.5px', lineHeight: 1.55, margin: '14px 0 0', maxWidth: '72ch' },
});
