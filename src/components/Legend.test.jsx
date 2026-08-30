import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Legend from './Legend.jsx';

describe('Legend', () => {
  it('labels all three marker states', () => {
    render(<Legend />);
    expect(screen.getByText('n is prime')).toBeInTheDocument();
    expect(screen.getByText('reverse(n) is prime')).toBeInTheDocument();
    expect(screen.getByText('both are prime')).toBeInTheDocument();
  });

  it('hides the glyphs from assistive tech, since the text carries the meaning', () => {
    const { container } = render(<Legend />);
    const glyphs = container.querySelectorAll('svg');
    expect(glyphs).toHaveLength(3);
    glyphs.forEach((g) => expect(g).toHaveAttribute('aria-hidden', 'true'));
  });
});
