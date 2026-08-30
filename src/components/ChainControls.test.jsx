import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ChainControls from './ChainControls.jsx';

const setup = (divisor = 18) => {
  const onDivisor = vi.fn();
  const onApply = vi.fn();
  render(
    <ChainControls start={0} end={5000} divisor={divisor} onApply={onApply} onDivisor={onDivisor} />,
  );
  return { onApply, onDivisor, user: userEvent.setup() };
};

describe('ChainControls', () => {
  it('explains that the literal difference rule can never link', () => {
    setup(1);
    expect(screen.getByText(/multiple of 18 every time, which cannot be prime/)).toBeInTheDocument();
  });

  it('explains why dividing by 18 is what surfaces chains', () => {
    setup(18);
    expect(screen.getByText(/whole forced factor of 18/)).toBeInTheDocument();
  });

  it('marks the selected rule and reports a change', async () => {
    const { onDivisor, user } = setup(18);
    expect(screen.getByRole('button', { name: '|n − r| / 18' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: '|n − r|' }));
    expect(onDivisor).toHaveBeenCalledWith(1);
  });

  it('rejects an inverted interval', async () => {
    const { onApply, user } = setup();
    const from = screen.getByLabelText('From');
    await user.clear(from);
    await user.type(from, '9000');
    await user.click(screen.getByRole('button', { name: 'Plot interval' }));
    expect(onApply).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
