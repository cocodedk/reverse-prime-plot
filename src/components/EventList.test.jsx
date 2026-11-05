import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { chineseYear } from '../lib/chineseYear.js';
import { dayOf } from '../lib/calendars.js';
import { ChineseYear } from './EventList.jsx';

const show = (iso) => render(<ChineseYear chinese={chineseYear(dayOf(iso))} day={dayOf(iso)} />);

describe('ChineseYear', () => {
  it('names the year and opens its meaning on a click or tap', () => {
    const { container } = show('1979-02-11');
    const name = screen.getByText('Earth Goat 己未');
    expect(name.tagName).toBe('SUMMARY');
    expect(name).toHaveAttribute('title', expect.stringContaining('a yin Earth Goat year'));
    const details = container.querySelector('details');
    expect(details.open).toBe(false);
    fireEvent.click(name);
    expect(details.open).toBe(true);
    expect(screen.getByText(/^己未 \(jǐ wèi\): a yin Earth Goat year\./)).toBeVisible();
  });

  it('gives the year it began when that is not the Gregorian one', () => {
    show('2026-01-08');
    expect(screen.getByText('Wood Snake 乙巳 (2025)')).toBeInTheDocument();
  });
});
