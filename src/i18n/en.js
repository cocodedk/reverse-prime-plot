export const en = {
  eyebrow: 'Number mirror · prime explorer',
  title: 'Reverse Prime Plot',
  introLead: 'Every number becomes',
  introFormula: '(n, reverse(n))',
  introRest:
    '. Choose an inclusive interval and plot backward from its upper endpoint to its lower endpoint.',

  chooseInterval: 'Choose interval',
  from: 'From',
  to: 'To',
  plotInterval: 'Plot interval',
  suggestedIntervals: 'Suggested intervals',
  axisDirection: 'Vertical-axis direction',
  lowerAtBottom: 'Lower at bottom',
  lowerAtTop: 'Lower at top',
  validationError: (max) => `Choose whole numbers where 0 ≤ From < To ≤ ${max}.`,

  statChecked: 'Checked',
  statMarkers: 'Markers',
  statPrimeN: 'Prime n',
  statPrimeReversals: 'Prime reversals',
  statBothPrime: 'Both prime',

  coordinates: (start, end) => `Coordinates: (n, reverse(n)) · ${start}–${end}`,
  progressAria: (start, end) => `Plotting interval ${start} to ${end}`,
  outsideNotice: (count, start, end) =>
    `${count} reversed values fall outside the selected ${start}–${end} interval.`,

  legendLabel: 'Plot legend',
  legendTop: 'n is prime',
  legendBottom: 'reverse(n) is prime',
  legendFull: 'both are prime',

  axisX: 'number, n',
  axisY: 'reversed number',
  canvasFallback: 'Prime and reversed-prime coordinate plot.',
  plotDescription: (start, end, lowerPosition) =>
    `Prime-related coordinates from ${end} down to ${start}. Both axes cover that inclusive interval. The horizontal value is the number and the vertical value is its digit reversal, with the lower endpoint at the ${lowerPosition}. Empty, non-prime markers are omitted.`,
  positionBottom: 'bottom',
  positionTop: 'top',

  // Keyed by the phase names createPlotData and usePlotData emit.
  phases: {
    Starting: 'Starting',
    'Reversing digits': 'Reversing digits',
    'Finding primes': 'Finding primes',
    'Classifying points': 'Classifying points',
    'Preparing markers': 'Preparing markers',
    Ready: 'Ready',
    'Drawing plot': 'Drawing plot',
    Complete: 'Complete',
    Failed: 'Failed',
  },

  canvasFont: 'Inter, ui-sans-serif, system-ui, sans-serif',
  footerYear: '2026',
  footerCreatedBy: 'Created by',
  authorName: 'Babak Bandpey',

  // Chains page
  chainsTitle: 'Prime Difference Chains',
  chainsEyebrow: 'Recursive pairs · chain explorer',
  chainsIntroLead: 'Take a prime whose reversal is also prime, subtract the two, and ask the same question of the result:',
  chainsIntroRest: ' is it prime, and is its reversal prime? Only the seeds that survive at least one step are plotted.',
  chainsNavToPlot: 'Back to the plot',
  chainsNavToChains: 'Difference chains →',

  ruleLabel: 'Step rule',
  ruleNote1: 'A number and its reversal share a digit sum, so 9 always divides their difference; two odd primes make it even too. The raw difference is therefore always a multiple of 18 and never prime — this rule finds nothing, at any range.',
  ruleNote9: 'Dividing out the factor of 9 leaves the parity behind, so links stay very rare.',
  ruleNote18: 'Dividing out the full forced factor of 18 leaves a quotient that can be prime, which is where the chains appear.',
  ruleOption: (divisor) => (divisor === 1 ? '|n − r|' : `|n − r| / ${divisor}`),

  statSeeds: 'Prime pairs',
  statChains: 'With a chain',
  statDeepest: 'Deepest chain',
  chainsEmptyTitle: 'No chains in this interval',
  chainsEmptyBody: 'Every difference here is a multiple of 18, so none of them is prime. Try the other step rule.',
  chainsListTitle: 'Deepest chains found',
  chainDepthLabel: (depth, formatted) => (depth === 1 ? '1 link' : `${formatted} links`),
  chainStep: (from, reversed, difference, divisor, next) =>
    divisor === 1
      ? `|${from} − ${reversed}| = ${difference} → ${next}`
      : `|${from} − ${reversed}| = ${difference}, ÷${divisor} → ${next}`,
  legendDepth: (depth) => (depth === 1 ? 'one link' : `${depth} links`),
  chainsPlotLabel: (start, end) => `Chain seeds · ${start}–${end}`,
  viewSource: 'Source on GitHub',

  langSwitch: 'فارسی',
  langSwitchHref: 'fa/',
  langSwitchHrefLang: 'fa',
  langSwitchLabel: 'Switch to Persian',
};
