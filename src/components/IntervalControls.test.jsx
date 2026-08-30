import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import IntervalControls from './IntervalControls.jsx';

// A preset applies an interval from outside the form. Extracting IntervalForm
// once broke this: the plot changed while the inputs kept the previous numbers,
// so the next submit silently reverted the plot.
function Harness() {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);
  return (
    <>
      <output data-testid="applied">{`${start}-${end}`}</output>
      <IntervalControls
        start={start}
        end={end}
        yDirection="up"
        onApply={(nextStart, nextEnd) => { setStart(nextStart); setEnd(nextEnd); }}
        onYDirection={() => {}}
      />
    </>
  );
}

const setup = (props = {}) => {
  const onApply = vi.fn();
  render(
    <IntervalControls
      start={0} end={100} yDirection="up"
      onApply={onApply} onYDirection={vi.fn()} {...props}
    />,
  );
  return { onApply, user: userEvent.setup() };
};

describe('IntervalControls', () => {
  it('applies a valid interval', async () => {
    const { onApply, user } = setup();
    const to = screen.getByLabelText('To');
    await user.clear(to);
    await user.type(to, '250');
    await user.click(screen.getByRole('button', { name: 'Plot interval' }));
    expect(onApply).toHaveBeenCalledWith(0, 250);
  });

  it('refuses an inverted interval and explains why', async () => {
    const { onApply, user } = setup();
    const from = screen.getByLabelText('From');
    await user.clear(from);
    await user.type(from, '500');
    await user.click(screen.getByRole('button', { name: 'Plot interval' }));
    expect(onApply).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/0 ≤ From < To/);
  });

  it('marks the active preset with aria-pressed on the axis toggle', () => {
    setup({ yDirection: 'down' });
    expect(screen.getByRole('button', { name: 'Lower at top' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Lower at bottom' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('keeps the inputs in step with an interval applied from outside', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: '0–50' }));

    expect(screen.getByTestId('applied')).toHaveTextContent('0-50');
    expect(screen.getByLabelText('To')).toHaveValue(50);
    expect(screen.getByLabelText('From')).toHaveValue(0);
  });

  it('still lets the fields be edited after a preset', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: '0–250' }));
    const to = screen.getByLabelText('To');
    await user.clear(to);
    await user.type(to, '400');
    await user.click(screen.getByRole('button', { name: 'Plot interval' }));

    expect(screen.getByTestId('applied')).toHaveTextContent('0-400');
  });
});
