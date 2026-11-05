import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CALENDAR_NAMES } from '../lib/calendars.js';
import { MARKS } from '../lib/datePrimes.js';
import { PERIODS } from '../lib/eventCycles.js';
import { CycleSummary, PrimeSummary } from './ChanceSummary.jsx';

const CELL = { hits: 1, trials: 10, expected: 1.04, p: 1, different: false };
const summaryWith = (rows, different) => Object.fromEntries(CALENDAR_NAMES.map((name) => [
  name, Object.fromEntries(rows.map((row) => [row, { ...CELL, different: different(name, row) }])),
]));

describe('PrimeSummary', () => {
  it('finds no clear pattern when no count differs from chance', () => {
    render(<PrimeSummary summary={summaryWith(MARKS, () => false)} />);
    expect(screen.getByText(/^No clear pattern\. None of the 9 counts/)).toBeInTheDocument();
    expect(screen.getAllByText('1 of 10')).toHaveLength(CALENDAR_NAMES.length * MARKS.length);
    expect(screen.getAllByText('chance 1')).toHaveLength(CALENDAR_NAMES.length * MARKS.length);
  });

  it('counts the cells that differ', () => {
    render(<PrimeSummary summary={summaryWith(MARKS, (name, mark) => name === 'ghamari' && mark === 'year')} />);
    expect(screen.getByText(/^1 of the 9 counts differ from chance/)).toBeInTheDocument();
  });
});

describe('CycleSummary', () => {
  it('gives a row to every cycle and finds no clear cycle when none beats chance', () => {
    render(<CycleSummary summary={summaryWith(PERIODS, () => false)} />);
    expect(screen.getByRole('heading', { name: 'Cycles in the years' })).toBeInTheDocument();
    expect(screen.getAllByRole('rowheader').map((cell) => cell.textContent)).toEqual(PERIODS.map((period) => `Every ${period} years`));
    expect(screen.getAllByText('1 of 10')).toHaveLength(CALENDAR_NAMES.length * PERIODS.length);
    expect(screen.getByText(/^No clear cycle\. None of the 33 counts/)).toBeInTheDocument();
  });

  it('counts the cycles that beat chance', () => {
    render(<CycleSummary summary={summaryWith(PERIODS, (name, period) => period === 4)} />);
    expect(screen.getByText(/^3 of the 33 counts beat chance/)).toBeInTheDocument();
  });
});
