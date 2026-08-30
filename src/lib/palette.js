// Mathematical-minimal system: monochrome data on paper, with a single accent
// reserved for interaction and for the rare deep results. StyleX cannot consume
// these (stylex.create takes static values only), so the stylesheets carry
// their own copies of the same values.
export const CARD = '#ffffff';
export const INK = '#12151a';
export const MUTED = '#6b6f6a';
export const GRID = '#ececea';
export const ACCENT = '#1f4bff';

// Markers are ink: fill and half-fill carry the meaning, not hue.
export const PRIME_COLOR = INK;

function toRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

// ImageData writes need raw channel bytes rather than the hex string.
export const PRIME_RGB = toRgb(PRIME_COLOR);
