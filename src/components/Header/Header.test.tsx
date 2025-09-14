import { describe, expect, it, Mock, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import { useAuthState } from 'react-firebase-hooks/auth';

vi.mock('next-intl', async (importActual) => {
  const actual = await importActual<typeof import('next-intl')>();
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

vi.mock('@/firebase/firebase', () => ({
  auth: {},
  logout: vi.fn(),
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(() => [null, false]),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  ),
}));

vi.mock('./ThemeSwitcher/ThemeSwitcher', () => ({
  default: () => <div data-testid="mock-theme-switcher">Theme</div>,
}));

vi.mock('./LanguageSwitcher/LanguageSwitcher', () => ({
  default: () => <div data-testid="mock-language-switcher">Language</div>,
}));

describe('Header', () => {
  it('renders logo and mocked switchers', () => {
    render(<Header />);

    expect(screen.getByText(/RESTful API/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-theme-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('mock-language-switcher')).toBeInTheDocument();
  });

  it('applies scrolled styles when window is scrolled', async () => {
    const { rerender } = render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('h-20');
    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
    });
    rerender(<Header />);
    expect(header).toHaveClass('h-16');
  });

  it('removes scrolled styles when scrolled back up', () => {
    const { rerender } = render(<Header />);
    const header = screen.getByRole('banner');

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    rerender(<Header />);
    expect(header).toHaveClass('h-16');
    expect(header).toHaveClass('bg-purple-100');

    act(() => {
      window.scrollY = 0;
      window.dispatchEvent(new Event('scroll'));
    });

    rerender(<Header />);
    expect(header).toHaveClass('h-20');
    expect(header).not.toHaveClass('bg-purple-100');
  });

  it('renders Loader when loading is true', () => {
    (useAuthState as Mock).mockReturnValueOnce([null, true]);
    render(<Header />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders sign in and sign up when user is null', () => {
    (useAuthState as Mock).mockReturnValueOnce([null, false]);
    render(<Header />);
    expect(screen.getByText('signin')).toBeInTheDocument();
    expect(screen.getByText('signup')).toBeInTheDocument();
  });

  it('renders sign out when user is not null', () => {
    (useAuthState as Mock).mockReturnValueOnce([true, false]);
    render(<Header />);
    expect(screen.getByText('signout')).toBeInTheDocument();
  });
});
