import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorComponent from '../app/error';

describe('Error component', () => {
  it('renders error message', () => {
    const resetMock = vi.fn();
    const error = new Error('Test error');

    render(<ErrorComponent error={error} reset={resetMock} />);

    expect(
      screen.getByRole('heading', { name: /something went wrong/i })
    ).toBeInTheDocument();

    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('calls reset when button is clicked', () => {
    const resetMock = vi.fn();
    const error = new Error('Test error');

    render(<ErrorComponent error={error} reset={resetMock} />);

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(resetMock).toHaveBeenCalled();
  });
});
