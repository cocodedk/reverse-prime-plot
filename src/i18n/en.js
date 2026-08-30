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
  ruleOption: (divisor, formatted) => (divisor === 1 ? '|n − r|' : `|n − r| / ${formatted}`),

  whyTitle: 'Why divide at all?',
  whyIntro: 'The obvious version of this rule — subtract, then test what comes out — never finds anything. Not in a small range, not in a huge one. Two things stack up against it.',
  whyPoint1Title: 'Same digits, same remainder',
  whyPoint1Body: 'A number and its reversal are built from the same digits, so both leave the same remainder when divided by 9. Subtract one from the other and that remainder cancels out, which leaves a clean multiple of 9 every time. Take 1913 and 3191: the digits of each add up to 14, and their difference, 1278, is 9 × 142.',
  whyPoint2Title: 'Odd minus odd is even',
  whyPoint2Body: 'Every prime except 2 is odd. So both halves of the pair are odd, and one odd number minus another is always even. That hands the difference a factor of 2 on top of the 9.',
  whyConclusion: 'Together those make every difference a multiple of 18. Anything divisible by both 2 and 3 cannot be prime, so the chain dies on its first step — every time, at every scale.',
  whyDivide18: 'Dividing by 18 strips out exactly the part that was forced on the difference and nothing else. What is left is free to be prime or not on its own merits, and that is where the chains show up.',
  whyDivide9: 'Dividing by 9 only fixes half of it. The quotient is still even, so it can only be prime when it happens to land on 2 — which is why that setting finds almost nothing.',

  statSeeds: 'Prime pairs',
  statChains: 'With a chain',
  statDeepest: 'Deepest chain',
  chainsEmptyTitle: 'No chains in this interval',
  chainsEmptyBody: 'Every difference here is a multiple of 18, so none of them is prime. Try the other step rule.',
  chainsListTitle: 'Deepest chains found',
  chainsSelectHint: 'Select any point on the plot, or a chain below, to see it step by step.',
  chainsDetailTitle: 'Selected point',
  chainsDetailPair: (seed, reversed) => `${seed} and its reversal ${reversed} are both prime.`,
  chainsDetailDepth: (depth, formatted) =>
    depth === 1
      ? 'It survives one further step before the chain ends.'
      : `It survives ${formatted} further steps before the chain ends.`,
  chainsDetailEnd: (last) => `${last} is where it stops: the next difference is not a prime pair.`,
  chainsDetailClose: 'Clear selection',
  chainDepthLabel: (depth, formatted) => (depth === 1 ? '1 link' : `${formatted} links`),
  chainStep: (from, reversed, difference, divisor, next) =>
    divisor === 1
      ? `|${from} − ${reversed}| = ${difference} → ${next}`
      : `|${from} − ${reversed}| = ${difference}, ÷${divisor} → ${next}`,
  chainsLegendLabel: 'Chain legend',
  chainsLegendOne: 'one further prime pair',
  chainsLegendDeep: 'two or more',
  chainsPlotLabel: (start, end) => `Chain seeds · ${start}–${end}`,
  viewSource: 'Source on GitHub',

  langSwitch: 'فارسی',
  langSwitchHref: 'fa/',
  langSwitchHrefLang: 'fa',
  langSwitchLabel: 'Switch to Persian',
};
