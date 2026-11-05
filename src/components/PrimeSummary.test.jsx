import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CALENDAR_NAMES } from '../lib/calendars.js';
import { MARKS } from '../lib/datePrimes.js';
import PrimeSummary from './PrimeSummary.jsx';

const CELL = { hits: 1, trials: 10, expected: 1.04, p: 1, different: false };
const summaryWith = (different) => Object.fromEntries(CALENDAR_NAMES.map((name) => [
  name, Object.fromEntries(MARKS.map((mark) => [mark, { ...CELL, different: different(name, mark) }])),
]));

describe('PrimeSummary', () => {
  it('finds no clear pattern when no count differs from chance', () => {
    render(<PrimeSummary summary={summaryWith(() => false)} />);
    expect(screen.getByText(/^No clear pattern\. None of the 9 counts/)).toBeInTheDocument();
    expect(screen.getAllByText('1 of 10')).toHaveLength(CALENDAR_NAMES.length * MARKS.length);
    expect(screen.getAllByText('chance 1')).toHaveLength(CALENDAR_NAMES.length * MARKS.length);
  });

  it('counts the cells that differ', () => {
    render(<PrimeSummary summary={summaryWith((name, mark) => name === 'ghamari' && mark === 'year')} />);
    expect(screen.getByText(/^1 of the 9 counts differ from chance/)).toBeInTheDocument();
  });
});
