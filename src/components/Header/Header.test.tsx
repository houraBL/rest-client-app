import { describe, expect, it, Mock, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import { useAuth } from '@/hooks/useAuth/useAuth';
import userEvent from '@testing-library/user-event';
import { logoutAndClearCookie } from '@/lib/firebase/authActions';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import clientReducer, { ClientState } from '@/store/clientSlice';

function renderWithStoreAndTheme(
  children: React.ReactElement,
  preloadedClient?: Partial<ClientState>
) {
  const store = configureStore({
    reducer: { client: clientReducer },
    preloadedState: {
      client: {
        method: 'GET',
        url: '',
        headers: {},
        body: '',
        ...preloadedClient,
      },
    } as RootState,
  });

  return {
    store,
    ...render(<Provider store={store}>{children}</Provider>),
  };
}

vi.mock('next-intl', async (importActual) => {
  const actual = await importActual<typeof import('next-intl')>();
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

vi.mock('@/hooks/useAuth/useAuth', () => {
  return {
    useAuth: vi.fn().mockReturnValue({
      user: true,
      setUser: vi.fn(),
      loading: false,
    }),
  };
});

vi.mock('@/lib/firebase/authActions', () => ({
  logoutAndClearCookie: vi.fn(),
}));

const pushMock = vi.fn();

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  ),
  useRouter: () => ({
    push: pushMock,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock('./ThemeSwitcher/ThemeSwitcher', () => ({
  default: () => <div data-testid="mock-theme-switcher">Theme</div>,
}));

vi.mock('./LanguageSwitcher/LanguageSwitcher', () => ({
  default: () => <div data-testid="mock-language-switcher">Language</div>,
}));

describe('Header', () => {
  it('renders logo and mocked switchers', () => {
    renderWithStoreAndTheme(<Header />);

    expect(screen.getByText(/RESTful/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-theme-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('mock-language-switcher')).toBeInTheDocument();
  });

  it('applies scrolled styles when window is scrolled', () => {
    renderWithStoreAndTheme(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('h-20');

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(header).toHaveClass('h-16');
  });

  it('removes scrolled styles when scrolled back up', () => {
    renderWithStoreAndTheme(<Header />);
    const header = screen.getByRole('banner');

    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(header).toHaveClass('h-16');
    expect(header).toHaveClass('bg-purple-100');

    act(() => {
      window.scrollY = 0;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(header).toHaveClass('h-20');
    expect(header).not.toHaveClass('bg-purple-100');
  });

  it('renders Loader when loading is true', () => {
    (useAuth as Mock).mockReturnValueOnce({ user: null, loading: true });
    renderWithStoreAndTheme(<Header />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders log in and sign up when user is null', () => {
    (useAuth as Mock).mockReturnValueOnce({ user: null, loading: false });
    renderWithStoreAndTheme(<Header />);
    expect(screen.getByText('login')).toBeInTheDocument();
    expect(screen.getByText('signup')).toBeInTheDocument();
  });

  it('renders sign out when user is not null', () => {
    (useAuth as Mock).mockReturnValueOnce({ user: true, loading: false });
    renderWithStoreAndTheme(<Header />);
    expect(screen.getByText('signout')).toBeInTheDocument();
  });

  it('signs out user and resets client state', async () => {
    const { store } = renderWithStoreAndTheme(<Header />);
    const signOutBtn = screen.getByText('signout');

    await userEvent.click(signOutBtn);

    expect(logoutAndClearCookie).toBeCalledTimes(1);
    expect(pushMock).toBeCalledWith('/');

    expect(store.getState().client).toEqual({
      method: 'GET',
      url: '',
      headers: {},
      bodyHeader: 'application/json',
      body: '',
      variables: {},
      response: { status: 0 },
      initialized: false,
    });
  });
});
