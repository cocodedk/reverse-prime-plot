import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TotalForm from './TotalForm.jsx';

const setup = (total = 100) => {
  const onApply = vi.fn();
  const view = render(<TotalForm total={total} onApply={onApply} />);
  return { onApply, user: userEvent.setup(), view };
};

const field = () => screen.getByLabelText('Count down from');
const submit = () => screen.getByRole('button', { name: 'Plot pairs' });

describe('TotalForm', () => {
  it('applies a valid number', async () => {
    const { onApply, user } = setup();
    await user.clear(field());
    await user.type(field(), '1000');
    await user.click(submit());
    expect(onApply).toHaveBeenCalledWith(1000);
  });

  // The input's min/max/step stop these before submit, as in IntervalForm.
  it.each(['1', '1000000000', '12.5'])('never applies %j', async (value) => {
    const { onApply, user } = setup();
    await user.clear(field());
    await user.type(field(), value);
    await user.click(submit());
    expect(onApply).not.toHaveBeenCalled();
  });

  it('explains the range when the field is empty', async () => {
    const { onApply, user } = setup();
    await user.clear(field());
    await user.click(submit());
    expect(onApply).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('from 2 to 999,999,999');
  });

  it('shows a total set from outside the form', () => {
    const { view } = setup(100);
    view.rerender(<TotalForm total={250} onApply={() => {}} />);
    expect(field()).toHaveValue(250);
  });
});
