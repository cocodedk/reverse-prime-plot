export const en = {
  eyebrow: 'Number mirror · prime explorer',
  title: 'Reverse Prime Plot',
  introFormula: '(n, reverse(n))',
  introText:
    'Every number in the interval is treated the same way. A point appears wherever n or its reversal is prime, and the rest are left out.',

  specimenReverse: 'REVERSE',
  specimenReversedLabel: 'reverse(n)',
  specimenVerdict: 'Both are prime, so this point is drawn.',
  wordmark: 'Reverse prime plot',
  coordinatesLabel: 'n, reverse(n)',

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

  canvasFont: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  footerYear: '2026',
  footerCreatedBy: 'Created by',
  authorName: 'Babak Bandpey',

  // Chains page
  chainsTitle: 'Prime Difference Chains',
  chainsEyebrow: 'Recursive pairs · chain explorer',
  chainsIntroLead: 'Take a prime whose reversal is also prime, subtract the two, and ask the same question of the result:',
  chainsIntroRest: ' is it prime, and is its reversal prime? Only the seeds that survive at least one step are plotted.',
  chainsNavToPlot: '← Plot',
  chainsNavToChains: 'Chains →',

  ruleLabel: 'Step rule',
  ruleNote1: 'A number and its reversal have the same digits, so 9 divides their difference, and two odd primes make it even as well. That leaves a multiple of 18 every time, which cannot be prime. This rule finds nothing, at any range.',
  ruleNote9: 'Dividing by 9 leaves the evenness behind, so links stay very rare.',
  ruleNote18: 'Divide out the whole forced factor of 18 and the quotient is free to be prime. That is where the chains are.',
  ruleOption: (divisor, formatted) => (divisor === 1 ? '|n − r|' : `|n − r| / ${formatted}`),

  whyTitle: 'Why divide at all?',
  whyIntro: 'Subtract, then test what comes out. That obvious version of the rule never finds anything, in a small range or a huge one. Two things stack up against it.',
  whyPoint1Title: 'Same digits, same remainder',
  whyPoint1Body: 'Divide any number by 9 and the remainder is the same one you get from adding up its digits. A number and its reversal use the same digits, so both leave the same remainder. Subtract one from the other and the remainder cancels, leaving a multiple of 9. Take 1913 and 3191: the digits of each add up to 14, and their difference, 1278, is 9 × 142.',
  whyPoint2Title: 'Odd minus odd is even',
  whyPoint2Body: 'Every prime except 2 is odd. Both numbers in the pair are prime, so both are odd, and odd minus odd is always even. That adds a factor of 2 on top of the 9.',
  whyConclusion: 'Put those together and every difference is a multiple of 18. So it divides by 2 and by 3, which means it has factors of its own, and that is exactly what a prime does not have. The chain dies on its first step, every time, at every scale.',
  whyDivide18: 'Dividing by 18 takes out exactly the part that was forced, and nothing else. What is left can be prime or not on its own merits, and that is where the chains are.',
  whyDivide9: 'Dividing by 9 only fixes half of it. The result is still even, so it is prime only if it lands on 2. That is why the 9 setting finds almost nothing.',

  statSeeds: 'Prime pairs',
  statChains: 'With a chain',
  statDeepest: 'Deepest chain',
  chainsEmptyTitle: 'Nothing to plot here',
  chainsEmptyBody: (divisor) =>
    divisor === 1
      ? 'No pair gets past its first step. Every difference divides evenly by 18, and a number divisible by 18 is also divisible by 2 and 3, which rules out being prime. Switch to |n − r| / 18 to see chains.'
      : 'No pair in this range keeps going: every quotient landed on a number that is not prime, or whose reversal is not. Try a wider range.',
  chainsListTitle: 'Deepest chains found',
  chainsSelectHint: 'Select any point on the plot, or a chain below, to see it step by step.',
  chainsDetailTitle: 'Selected point',
  chainsDetailPair: (seed, reversed) => `${seed} and its reversal ${reversed} are both prime.`,
  chainsDetailDepth: (depth, formatted) =>
    depth === 1
      ? 'It survives one further step before the chain ends.'
      : `It survives ${formatted} further steps before the chain ends.`,
  chainsDetailEnd: (last) => `It stops at ${last}: the next step does not land on a prime whose reversal is also prime.`,
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
