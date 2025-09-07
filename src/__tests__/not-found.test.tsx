import '@testing-library/jest-dom';

import NotFound from '@/app/not-found';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Global not found', () => {
  it('renders not found heading', () => {
    render(<NotFound />);

    expect(
      screen.getByRole('heading', { name: /404 - page not found/i })
    ).toBeInTheDocument();
  });

  it('renders message', () => {
    render(<NotFound />);

    expect(
      screen.getByText(/oops! the page you’re looking for doesn’t exist/i)
    ).toBeInTheDocument();
  });
});
