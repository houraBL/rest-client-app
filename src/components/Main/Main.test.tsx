import { describe, expect, it, Mock, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Main from './Main';
import { useAuth } from '@/hooks/useAuth/useAuth';

const pushMock = vi.fn();

vi.mock('next/navigation', async (importActual) => {
  const actual = await importActual<typeof import('next/navigation')>();
  return {
    ...actual,
    useRouter: () => ({
      push: pushMock,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }),
  };
});

vi.mock('next-intl', async (importActual) => {
  const actual = await importActual<typeof import('next-intl')>();
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  ),
}));

vi.mock('@/hooks/useAuth/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({ user: null, loading: false }),
}));

describe('Main page', () => {
  it('Render Main page when user is null', () => {
    render(<Main />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/authorize/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
  });

  it('Render Main page when user is not null', () => {
    (useAuth as Mock).mockReturnValueOnce({ user: true, loading: false });
    render(<Main />);
    expect(screen.getByText(/welcome-back/i)).toBeInTheDocument();
    expect(screen.getByText(/instructions/i)).toBeInTheDocument();
    expect(screen.getByText(/history/i)).toBeInTheDocument();
    expect(screen.getByText(/client/i)).toBeInTheDocument();
    expect(screen.getByText(/variables/i)).toBeInTheDocument();
  });

  it('renders Loader when loading is true', () => {
    (useAuth as Mock).mockReturnValueOnce({ user: null, loading: true });
    render(<Main />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
