import { describe, expect, it } from 'vitest';
import {
  CANVAS_SIZE, createTicks, keepInside, LABEL_EDGE_PAD, LABEL_GAP, MAX_TICK_STEPS, PLOT_SIZE, PLOT_TOP, scaleY,
  tickStepsFor, visibleLabels,
} from './plotGeometry.js';

describe('plot geometry', () => {
  it('reverses only the vertical-axis direction', () => {
    expect(scaleY(20, 20, 100, 'up')).toBeGreaterThan(scaleY(100, 20, 100, 'up'));
    expect(scaleY(20, 20, 100, 'down')).toBeLessThan(scaleY(100, 20, 100, 'down'));
  });

  it('includes both coordinate-system endpoints as ticks', () => {
    const ticks = createTicks(5, 13);
    expect(ticks[0]).toBe(5);
    expect(ticks.at(-1)).toBe(13);
  });

  it('keeps a label centred on its tick unless that would cross the canvas edge', () => {
    expect(keepInside(300, 36)).toBe(300);
    expect(keepInside(CANVAS_SIZE - 28, 36)).toBe(CANVAS_SIZE - 36 - LABEL_EDGE_PAD);
    expect(keepInside(28, 36)).toBe(36 + LABEL_EDGE_PAD);
  });

  it('cuts an axis into fewer steps when its labels are wide', () => {
    expect(tickStepsFor(20)).toBe(MAX_TICK_STEPS);
    expect(tickStepsFor(PLOT_SIZE / 3 - LABEL_GAP)).toBe(3);
    expect(tickStepsFor(PLOT_SIZE)).toBe(1);
  });

  it('spaces nine-digit ticks no closer than their labels need', () => {
    expect(createTicks(0, 999_999_998, 3)).toEqual([0, 500_000_000, 999_999_998]);
  });

  it('keeps both end labels and drops a middle one that would touch a neighbour', () => {
    // The last tick sits 10 units from the end, closer than two 30-unit-wide labels allow.
    expect(visibleLabels([100, 300, 490, 500], [15, 15, 15, 15])).toEqual([100, 300, null, 500]);
    // The same along a y axis that runs downward in value, and with labels slid inside.
    expect(visibleLabels([500, 300, 2], [15, 15, 15])).toEqual([500, 300, 15 + LABEL_EDGE_PAD]);
  });

  it('stops a y label at the frame so it cannot reach the x labels in the corner', () => {
    const frameBottom = PLOT_TOP + PLOT_SIZE;
    expect(visibleLabels([frameBottom, 300, 28], [22, 22, 22], frameBottom))
      .toEqual([frameBottom - 22 - LABEL_EDGE_PAD, 300, 28]);
  });
});
