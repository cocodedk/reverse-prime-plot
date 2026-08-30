import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// A component referencing a style key that is not in the sheet it imported gets
// `undefined` from StyleX, renders with no class, and fails silently. That has
// bitten this codebase twice, so it is checked rather than reviewed for.
const SHEETS = {
  styles: 'src/appStyles.stylex.js',
  chainStyles: 'src/chainStyles.stylex.js',
};

function keysOf(path) {
  const source = readFileSync(path, 'utf8');
  return new Set([...source.matchAll(/^ {2}([a-zA-Z][\w]*): /gm)].map((m) => m[1]));
}

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.jsx?$/.test(entry) && !entry.includes('.test.') ? [full] : [];
  });
}

describe('style keys', () => {
  it.each(Object.entries(SHEETS))('every %s.<key> used in src/ exists', (name, sheetPath) => {
    const defined = keysOf(sheetPath);
    const missing = [];

    for (const file of sourceFiles('src')) {
      // Strip imports so a sheet's own path does not look like a key reference.
      const source = readFileSync(file, 'utf8').replace(/^import .*$/gm, '');
      for (const match of source.matchAll(new RegExp(`\\b${name}\\.([a-zA-Z][\\w]*)`, 'g'))) {
        if (!defined.has(match[1])) missing.push(`${file}: ${name}.${match[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('defines no style that nothing uses', () => {
    const sources = sourceFiles('src')
      .map((f) => readFileSync(f, 'utf8').replace(/^import .*$/gm, ''))
      .join('\n');
    const unused = [];
    for (const [name, sheetPath] of Object.entries(SHEETS)) {
      for (const key of keysOf(sheetPath)) {
        if (!sources.includes(`${name}.${key}`)) unused.push(`${name}.${key}`);
      }
    }
    expect(unused).toEqual([]);
  });
});
