import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ChainList from './ChainList.jsx';

const chain1913 = {
  seed: 1913,
  steps: [
    { from: 1913, reversed: 3191, difference: 1278, next: 71 },
    { from: 71, reversed: 17, difference: 54, next: 3 },
  ],
};

describe('ChainList', () => {
  it('renders each link as an absolute difference, not a negative one', () => {
    render(<ChainList examples={[chain1913]} divisor={18} />);
    expect(screen.getByText('|1,913 − 3,191| = 1,278, ÷18 → 71')).toBeInTheDocument();
    expect(screen.getByText('|71 − 17| = 54, ÷18 → 3')).toBeInTheDocument();
  });

  it('pluralises the link count', () => {
    render(<ChainList examples={[chain1913, { seed: 17, steps: [chain1913.steps[1]] }]} divisor={18} />);
    expect(screen.getByText('2 links')).toBeInTheDocument();
    expect(screen.getByText('1 link')).toBeInTheDocument();
  });

  it('renders nothing when there are no chains', () => {
    const { container } = render(<ChainList examples={[]} divisor={18} />);
    expect(container).toBeEmptyDOMElement();
  });
});
