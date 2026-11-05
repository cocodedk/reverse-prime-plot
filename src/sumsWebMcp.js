// WebMCP: hands an AI agent in the visitor's browser typed tools for the sums
// page, so it can read the plot and change N instead of scraping the canvas.
import { MAX_LIMIT } from './lib/primeNumbers.js';
import { isValidTotal, MIN_TOTAL } from './lib/primeSums.js';
import { registerTools } from './webMcp.js';

export const MAX_LISTED_PAIRS = 100;
const STATUS = { PLOTTING: 'plotting', READY: 'ready', FAILED: 'failed' };

// Chrome does not check input against inputSchema, so every tool starts here.
const given = (input) => (input && typeof input === 'object' && !Array.isArray(input) ? input : {});
// A throw reaches the agent as an opaque UnknownError; an answer it can learn from.
const refuse = (error) => ({ ok: false, error, min_total: MIN_TOTAL, max_total: MAX_LIMIT });

// Distinct pairs, smaller prime first, smallest first. The data holds k counting
// down, so the pairs with k <= N - k sit at the end of the array.
function distinctPairs({ markerNumbers, total }) {
  const pairs = [];
  for (let i = markerNumbers.length - 1; i >= 0 && pairs.length < MAX_LISTED_PAIRS; i -= 1) {
    const k = markerNumbers[i];
    if (k > total - k) break;
    pairs.push([k, total - k]);
  }
  return pairs;
}

export function describePage({ total, data, isPlotting, error }) {
  const ready = !isPlotting && !error && data?.total === total;
  const pairs = ready ? distinctPairs(data) : [];
  return {
    page: 'prime-sums',
    total,
    status: error ? STATUS.FAILED : ready ? STATUS.READY : STATUS.PLOTTING,
    error: error || null,
    points: ready ? data.markerNumbers.length : null,
    distinct_pairs: ready ? data.distinctPairs : null,
    pairs,
    pairs_complete: ready && pairs.length === data.distinctPairs,
    min_total: MIN_TOTAL,
    max_total: MAX_LIMIT,
  };
}

function tools({ read, plot }) {
  return [
    {
      name: 'describe',
      title: 'What the page shows',
      description: `What the Prime Sums page shows now: the number N it counts down from, whether the plot is "plotting", "ready" or "failed", and, once ready, the distinct pairs [p, q] of primes with p <= q and p + q = N, smallest p first (at most ${MAX_LISTED_PAIRS}; pairs_complete says whether that is all of them). Numbers are plain JSON numbers.`,
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => describePage(read()),
    },
    {
      name: 'plot_total',
      title: 'Count down from a new N',
      description: `Replot the page for a new N, a whole number from ${MIN_TOTAL} to ${MAX_LIMIT}, exactly as typing it into the form and pressing "Plot pairs" does. Returns at once with status "plotting"; call describe until it reads "ready" to get the pairs. A large N takes a few seconds.`,
      inputSchema: {
        type: 'object',
        properties: { total: { type: 'integer', minimum: MIN_TOTAL, maximum: MAX_LIMIT } },
        required: ['total'],
      },
      execute: async (input) => {
        const { total } = given(input);
        if (!isValidTotal(total)) return refuse(`total must be a whole number from ${MIN_TOTAL} to ${MAX_LIMIT}.`);
        plot(total);
        return { ok: true, total, status: STATUS.PLOTTING };
      },
    },
  ];
}

export function initSumsWebMcp(page, signal) {
  return registerTools(tools(page), signal);
}
