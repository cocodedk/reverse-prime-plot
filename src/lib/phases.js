// Progress phases are identifiers, not English. Keying translations on display
// prose meant a phase added in the compute layer silently rendered untranslated
// (the chains page showed English throughout a search in Persian). The ids live
// here so both dictionaries and every emitter agree on one list.
export const PHASES = {
  STARTING: 'starting',
  REVERSING: 'reversing',
  SIEVING: 'sieving',
  CLASSIFYING: 'classifying',
  MARKERS: 'markers',
  FOLLOWING: 'following',
  READY: 'ready',
  DRAWING: 'drawing',
  COMPLETE: 'complete',
  FAILED: 'failed',
};

export const PHASE_IDS = Object.values(PHASES);
