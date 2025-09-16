import '@testing-library/jest-dom';

import NotFound from '@/app/not-found';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', async (importActual) => {
  const actual = await importActual<typeof import('next-intl')>();
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

describe('Global not found', () => {
  it('renders not found page correctly', () => {
    render(<NotFound />);

    expect(screen.getByRole('heading', { name: /title/i })).toBeInTheDocument();

    expect(screen.getByText(/description/i)).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /backHome/i })).toBeInTheDocument();
  });
});
