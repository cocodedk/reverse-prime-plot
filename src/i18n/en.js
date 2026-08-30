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

  langSwitch: 'فارسی',
  langSwitchHref: 'fa/',
  langSwitchHrefLang: 'fa',
  langSwitchLabel: 'Switch to Persian',
};
