import { describe, expect, it } from 'vitest';
import {
  createTicks,
  isVisibleMarker,
  scaleY,
} from './plotGeometry.js';

describe('plot geometry', () => {
  it('reverses only the vertical-axis direction', () => {
    expect(scaleY(20, 20, 100, 'up')).toBeGreaterThan(scaleY(100, 20, 100, 'up'));
    expect(scaleY(20, 20, 100, 'down')).toBeLessThan(scaleY(100, 20, 100, 'down'));
  });

  it('does not render empty or out-of-range markers', () => {
    expect(isVisibleMarker(0, 50, 20, 100)).toBe(false);
    expect(isVisibleMarker(1, 50, 20, 100)).toBe(true);
    expect(isVisibleMarker(2, 101, 20, 100)).toBe(false);
    expect(isVisibleMarker(2, 19, 20, 100)).toBe(false);
    expect(isVisibleMarker(3, 50, 20, 100)).toBe(true);
  });

  it('includes both coordinate-system endpoints as ticks', () => {
    const ticks = createTicks(5, 13);
    expect(ticks[0]).toBe(5);
    expect(ticks.at(-1)).toBe(13);
  });
});
