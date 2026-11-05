import { afterEach, describe, expect, it, vi } from 'vitest';
import { describePage, initSumsWebMcp, MAX_LISTED_PAIRS } from './sumsWebMcp.js';
import { createSumData } from './lib/primeSums.js';

// A stand-in registry that keeps what was registered, so tests can call the
// tools the way an agent would.
function fakeRegistry({ refuse = [], getTools } = {}) {
  const held = new Map();
  return {
    held,
    registerTool: vi.fn(async (tool) => {
      if (refuse.includes(tool.name)) throw new DOMException('refused', 'InvalidStateError');
      held.set(tool.name, tool);
    }),
    getTools: getTools ?? (async () => [...held.values()]),
  };
}

const ready = (total) => ({ total, data: createSumData(total), isPlotting: false, error: '' });

async function install(state = ready(100), options) {
  const registry = fakeRegistry(options);
  document.modelContext = registry;
  const plot = vi.fn();
  const names = await initSumsWebMcp({ read: () => state, plot });
  return { names, plot, registry, call: (name, input) => registry.held.get(name).execute(input) };
}

afterEach(() => { delete document.modelContext; });

describe('initSumsWebMcp', () => {
  it('does nothing without a registry', async () => {
    expect(await initSumsWebMcp({ read: () => ({}), plot: () => {} })).toEqual([]);
  });

  it('registers both tools and passes the teardown signal', async () => {
    const signal = new AbortController().signal;
    const registry = fakeRegistry();
    document.modelContext = registry;
    expect(await initSumsWebMcp({ read: () => ({}), plot: () => {} }, signal)).toEqual(['describe', 'plot_total']);
    expect(registry.registerTool.mock.calls.every(([, options]) => options.signal === signal)).toBe(true);
  });

  it('keeps the other tool when one is refused', async () => {
    const { names } = await install(undefined, { refuse: ['describe'] });
    expect(names).toEqual(['plot_total']);
  });

  it.each([
    ['throws', async () => { throw new Error('boom'); }],
    ['returns nonsense', async () => 'nonsense'],
  ])('never rejects when getTools %s', async (_label, getTools) => {
    const { names } = await install(undefined, { getTools });
    expect(names).toEqual([]);
  });

  it('marks only describe read-only', async () => {
    const { registry } = await install();
    expect(registry.held.get('describe').annotations.readOnlyHint).toBe(true);
    expect(registry.held.get('plot_total').annotations?.readOnlyHint).not.toBe(true);
  });
});

describe('describe', () => {
  it('lists the distinct pairs of a ready plot, smallest first', async () => {
    const { call } = await install(ready(100));
    expect(await call('describe', {})).toMatchObject({
      total: 100, status: 'ready', points: 12, distinct_pairs: 6, pairs_complete: true,
      pairs: [[3, 97], [11, 89], [17, 83], [29, 71], [41, 59], [47, 53]],
    });
  });

  it('includes a pair of equal halves once', () => {
    expect(describePage(ready(10)).pairs).toEqual([[3, 7], [5, 5]]);
  });

  it('caps the list and says so', () => {
    const answer = describePage(ready(100_000));
    expect(answer.pairs).toHaveLength(MAX_LISTED_PAIRS);
    expect(answer.pairs_complete).toBe(false);
  });

  it('withholds the old pairs while a new N is plotting', () => {
    const answer = describePage({ ...ready(100), total: 200, isPlotting: true });
    expect(answer).toMatchObject({ total: 200, status: 'plotting', pairs: [], points: null });
  });

  it('reports a failure', () => {
    expect(describePage({ total: 100, data: null, isPlotting: false, error: 'out of memory' }))
      .toMatchObject({ status: 'failed', error: 'out of memory', pairs: [] });
  });
});

describe('plot_total', () => {
  it('replots for a valid N', async () => {
    const { call, plot } = await install();
    expect(await call('plot_total', { total: 1000 })).toEqual({ ok: true, total: 1000, status: 'plotting' });
    expect(plot).toHaveBeenCalledWith(1000);
  });

  it.each([
    [{ total: '100' }], [{ total: 1 }], [{ total: 1_000_000_000 }], [{ total: 12.5 }], [{}], [[]], [null],
  ])('refuses %j without touching the plot', async (input) => {
    const { call, plot } = await install();
    expect(await call('plot_total', input)).toMatchObject({ ok: false, min_total: 2, max_total: 999_999_999 });
    expect(plot).not.toHaveBeenCalled();
  });
});
