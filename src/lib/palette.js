// Colours shared across the canvas renderer and the SVG legend. StyleX cannot
// consume these — `stylex.create` only accepts statically analysable values —
// so appStyles.stylex.js and global.css keep their own literals.
export const PRIME_COLOR = '#f15a37';
export const INK = '#18332e';
export const CREAM = '#fffdf8';

function toRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

// ImageData writes need raw channel bytes rather than the hex string.
export const PRIME_RGB = toRgb(PRIME_COLOR);
