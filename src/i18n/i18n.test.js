import { describe, expect, it } from 'vitest';
import { en } from './en.js';
import { fa } from './fa.js';
import { PHASE_IDS } from '../lib/phases.js';

describe('dictionaries', () => {
  it('define the same keys', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(fa).sort());
  });

  // A phase emitted by the compute layer with no label falls back to its raw id,
  // which is how the Persian chains page ended up showing English.
  it.each([['en', en], ['fa', fa]])('%s labels every phase id', (_name, dict) => {
    expect(PHASE_IDS.filter((id) => !dict.phases[id])).toEqual([]);
  });

  it('labels no phase that no longer exists', () => {
    for (const dict of [en, fa]) {
      expect(Object.keys(dict.phases).filter((id) => !PHASE_IDS.includes(id))).toEqual([]);
    }
  });
});
