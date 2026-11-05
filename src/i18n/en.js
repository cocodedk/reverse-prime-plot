// Chinese year names and what each part stands for in Chinese tradition.
const CHINESE_ELEMENTS = {
  wood: ['Wood', 'spring and the east; growth, generosity and flexibility'],
  fire: ['Fire', 'summer and the south; passion, energy and boldness'],
  earth: ['Earth', 'the centre and the turn of the seasons; stability, patience and reliability'],
  metal: ['Metal', 'autumn and the west; strength, resolve and discipline'],
  water: ['Water', 'winter and the north; wisdom, adaptability and depth'],
};
const CHINESE_ANIMALS = {
  rat: ['Rat', 'quick-witted, resourceful and adaptable'],
  ox: ['Ox', 'hard-working, dependable and patient'],
  tiger: ['Tiger', 'brave, confident and competitive'],
  rabbit: ['Rabbit', 'gentle, quiet, elegant and careful'],
  dragon: ['Dragon', "powerful, ambitious and lucky; the emperor's emblem"],
  snake: ['Snake', 'wise, intuitive and enigmatic'],
  horse: ['Horse', 'energetic, free-spirited and warm'],
  goat: ['Goat', 'calm, gentle, artistic and sympathetic'],
  monkey: ['Monkey', 'clever, curious and playful'],
  rooster: ['Rooster', 'observant, hard-working, frank and proud'],
  dog: ['Dog', 'loyal, honest and protective'],
  pig: ['Pig', 'generous, sincere and easy-going; a sign of plenty'],
};

export const en = {
  introFormula: '(n, reverse(n))',
  introText:
    'Every number in the interval is treated the same way. A point appears wherever n or its reversal is prime, and the rest are left out.',

  specimenReverse: 'REVERSE',
  specimenReversedLabel: 'reverse(n)',
  specimenVerdict: 'Both are prime, so this point is drawn.',
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

  progressAria: (start, end) => `Plotting interval ${start} to ${end}`,
  outsideNotice: (count, start, end) =>
    `${count} reversed values fall outside the selected ${start}–${end} interval.`,

  legendLabel: 'Plot legend',
  legendDenseEither: 'exactly one of the pair is prime',
  legendDenseBoth: 'both are prime',
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

  // Keyed by the ids in lib/phases.js, not by display prose.
  phases: {
    starting: 'Starting',
    reversing: 'Reversing digits',
    sieving: 'Finding primes',
    classifying: 'Classifying points',
    markers: 'Preparing markers',
    following: 'Following chains',
    ready: 'Ready',
    drawing: 'Drawing plot',
    complete: 'Complete',
    failed: 'Failed',
  },

  canvasFont: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',

  // Chains page
  chainsIntroLead: 'Take a prime whose reversal is also prime, subtract the two, and ask the same question of the result:',
  chainsIntroRest: ' is it prime, and is its reversal prime? Only the seeds that survive at least one step are plotted.',

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
  whyPoint3Title: 'An odd digit count adds an 11',
  whyPoint3Body: 'Line a number up against its reversal and each digit sits an even number of places from its mirror, but only when the digit count is odd. That makes the two agree mod 11 as well, so 11 divides the difference on top of the 18. The quotient inherits it, and a multiple of 11 is prime only when it is 11 itself. This is why there is not a single chain between one and ten million: those are the 7-digit numbers. Chains return at ten million, where 8-digit numbers begin.',
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
      : 'No pair in this range keeps going. If the interval sits inside numbers with an odd count of digits, that is expected rather than a dead end, for the reason set out below. Try a range that crosses into an even digit count.',
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
  // Divisor 1 never yields a chain, so no step is ever rendered for it.
  chainStep: (from, reversed, difference, divisor, next) =>
    `|${from} − ${reversed}| = ${difference}, ÷${divisor} → ${next}`,
  chainsLegendLabel: 'Chain legend',
  chainsLegendOne: 'one further prime pair',
  chainsLegendDeep: 'two or more',
  chainsPlotLabel: (start, end) => `Chain seeds · ${start}–${end}`,

  // Sums page
  sumsIntro:
    'Pick a number N and count down from it: N − 1, N − 2, and so on down to 1. Each step k leaves N − k. Where k and N − k are both prime, the pair is plotted. Every pair adds up to N, so all the points fall on one diagonal, and each pair shows twice, once in each order. Goldbach guessed in 1742 that every even N above 2 has at least one such pair, and nobody has proved it yet. An odd N can only split as 2 + (N − 2), so it has one pair at most.',
  totalLabel: 'Count down from',
  plotTotal: 'Plot pairs',
  totalValidationError: (min, max) => `Choose a whole number from ${min} to ${max}.`,
  sumsAxisX: 'k',
  sumsAxisY: 'N − k',
  sumsCoordinatesLabel: 'k, N − k',
  sumsTitle: (total) => `N = ${total}`,
  sumsPlotDescription: (total) =>
    `Pairs of primes that add up to ${total}. The horizontal value is k and the vertical value is ${total} − k, so every point lies on the diagonal from bottom left to top right.`,
  sumsProgressAria: (total) => `Finding prime pairs that add up to ${total}`,
  statPoints: 'Points',
  statDistinctPairs: 'Distinct pairs',

  // Iran page
  iranTitle: 'Iran in three calendars',
  iranIntro:
    'Events that shaped Iran from 1900 to today, each dated in the three calendars used in Iran: Gregorian, Jalali (the Solar Hijri calendar, official since 1925) and Ghamari (the Lunar Hijri calendar, which sets the religious year). The three scales share one time line. A lunar year is about eleven days shorter than a solar one, so Ghamari years start earlier each time and the scale gains a year roughly every 33.',
  iranTimelineLabel: 'The events from 1900 to today on three year scales: Gregorian, Jalali and Ghamari',
  iranEventsHeading: (count) => `${count} events`,
  calendarNames: { gregorian: 'Gregorian', jalali: 'Jalali', ghamari: 'Ghamari' },
  iranComputed: 'computed',
  iranComputedNote:
    'Where sources disagree, every date they give is listed; the small numbers link to the sources. * Computed from the Gregorian date, because no source we found states it. A computed Ghamari date follows the Umm al-Qura tables, while Iran begins each lunar month when the new moon is sighted, so the two can be a day or two apart. Jalali dates before 1925, when Iran adopted the calendar, are counted backwards.',
  iranSources: 'Sources',
  iranSource: 'Source',
  iranChineseNote:
    'The Chinese year begins at Chinese New Year, between late January and mid-February, so an event early in a Gregorian year can fall in the Chinese year before. Hover over or tap a Chinese year to see what it means.',
  iranPrimesHeading: 'Primes in the dates',
  iranPrimesIntro:
    'Does a prime turn up in these dates more often than chance would put it there? Each count sets the recorded dates against the share of all years, or all days, since 1900 that are prime the same way. The events cluster (1979 alone holds six), so a year counts once however many events it holds, and so does a day. The table scores each event\'s recorded date; the list marks every date found, so it can show more marks than the table counts.',
  primeMarkNames: { year: 'Prime year', yearReversed: 'Prime both ways, as 1979 and 9791', date: 'Whole date prime, as 19790201' },
  iranPrimeHits: (hits, trials) => `${hits} of ${trials}`,
  iranPrimeChance: (expected) => `chance ${expected}`,
  iranPrimeVerdictNone: (tests, level) =>
    `No clear pattern. None of the ${tests} counts is further from chance than luck explains (two-sided binomial test at p < ${level}, split across the ${tests} tests).`,
  iranPrimeVerdictSome: (count, tests, level) =>
    `${count} of the ${tests} counts differ from chance, marked in blue (two-sided binomial test at p < ${level}, split across the ${tests} tests).`,
  chineseYearLabel: 'Chinese year',
  chineseYearName: (element, animal) => `${CHINESE_ELEMENTS[element][0]} ${CHINESE_ANIMALS[animal][0]}`,
  chineseYearTip: ({ characters, pinyin, yang, element, animal, elementCharacter, animalCharacter }) => [
    `${characters} (${pinyin}): a ${yang ? 'yang' : 'yin'} ${CHINESE_ELEMENTS[element][0]} ${CHINESE_ANIMALS[animal][0]} year.`,
    `${CHINESE_ELEMENTS[element][0]} (${elementCharacter}): ${CHINESE_ELEMENTS[element][1]}.`,
    `${CHINESE_ANIMALS[animal][0]} (${animalCharacter}): ${CHINESE_ANIMALS[animal][1]}.`,
    yang ? 'Yang is the active, outward half of each element.' : 'Yin is the receptive, inward half of each element.',
  ].join(' '),
};
