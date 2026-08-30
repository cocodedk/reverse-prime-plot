import { reverseNumber } from './primeNumbers.js';

// The lead example is drawn from the data actually on screen, so it is never a
// fixture that contradicts the plot. State 3 means n and reverse(n) are both
// prime; a palindrome makes a dull example, so prefer a pair that differs.
export function pickSpecimen(data) {
  if (!data) return null;
  // An interval can contain no drawable marker at all (every reversal falls
  // outside it). The lead still has to explain the idea, so fall back to the
  // interval's own first number with no verdict line.
  if (data.markerStates.length === 0) {
    return { bothPrime: false, number: data.start, reversed: reverseNumber(data.start) };
  }

  let fallback = null;
  for (let index = 0; index < data.markerStates.length; index += 1) {
    if (data.markerStates[index] !== 3) continue;
    const number = data.markerNumbers[index];
    const reversed = data.markerReversed[index];
    if (number !== reversed) return { bothPrime: true, number, reversed };
    if (fallback === null) fallback = { bothPrime: true, number, reversed };
  }
  if (fallback) return fallback;

  const number = data.markerNumbers[0];
  return { bothPrime: false, number, reversed: reverseNumber(number) };
}
