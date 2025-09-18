import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import AuthPage from './AuthPage';
import {
  logInAndSetCookie,
  registerAndSetCookie,
} from '@/lib/firebase/authActions';

const pushMock = vi.fn();

const { setUserMock } = vi.hoisted(() => {
  return {
    setUserMock: vi.fn(),
  };
});

vi.mock('@/lib/firebase/authActions', () => ({
  logInAndSetCookie: vi.fn().mockResolvedValue({
    uid: '123',
    email: 'katy@test.com',
    displayName: 'Katy',
  }),
  registerAndSetCookie: vi.fn().mockResolvedValue({
    uid: '123',
    email: 'katy@test.com',
    displayName: 'Katy',
  }),
}));

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
  useRouter: () => ({
    push: pushMock,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock('@/hooks/useAuth/useAuth', () => {
  return {
    useAuth: vi.fn().mockReturnValue({
      user: true,
      setUser: setUserMock,
      loading: false,
    }),
  };
});

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Login success calls logInAndSetCookie', async () => {
    render(<AuthPage />);

    const emailInput = screen.getByPlaceholderText(/emailPlaceholder/i);
    const passwordInput = screen.getByPlaceholderText(/passwordPlaceholder/i);
    const logInBtn = screen.getByRole('button', { name: /signIn/i });

    await userEvent.type(emailInput, 'katy@test.com');
    await userEvent.type(passwordInput, '11111111k.');
    await userEvent.click(logInBtn);

    await waitFor(() => {
      expect(logInAndSetCookie).toHaveBeenCalledWith(
        'katy@test.com',
        '11111111k.'
      );
    });
    expect(setUserMock).toBeCalledWith({
      uid: '123',
      email: 'katy@test.com',
      displayName: 'Katy',
    });
  });

  it('Login shows validation errors', async () => {
    render(<AuthPage />);

    const logInBtn = screen.getByRole('button', { name: /signIn/i });
    await userEvent.click(logInBtn);
    const emailError = await screen.findByText((content) =>
      content.toLowerCase().includes('valid email')
    );
    const passwordError = await screen.findByText((content) =>
      content.toLocaleLowerCase().includes('password must be')
    );

    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });
  it('Shows validation errors on register submit', async () => {
    render(<AuthPage isInitialLogin={false} />);

    const signUpBtn = screen.getByRole('button', { name: /signUp/i });
    await userEvent.click(signUpBtn);
    const emailError = await screen.findByText((content) =>
      content.toLowerCase().includes('valid email')
    );
    const passwordError = await screen.findByText((content) =>
      content.toLocaleLowerCase().includes('password must be')
    );

    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });
  it('Register success calls registerAndSetCookie', async () => {
    render(<AuthPage isInitialLogin={false} />);
    const nameInput = screen.getByPlaceholderText(/namePlaceholder/i);
    const emailInput = screen.getByPlaceholderText(/emailPlaceholder/i);
    const passwordInput = screen.getByPlaceholderText(/passwordPlaceholder/i);
    const signUpBtn = screen.getByRole('button', { name: /signUp/i });

    await userEvent.type(nameInput, 'Katy');
    await userEvent.type(emailInput, 'katy@test.com');
    await userEvent.type(passwordInput, '11111111k.');
    await userEvent.click(signUpBtn);

    await waitFor(() => {
      expect(registerAndSetCookie).toHaveBeenCalledWith(
        'Katy',
        'katy@test.com',
        '11111111k.'
      );
      expect(setUserMock).toBeCalledWith({
        uid: '123',
        email: 'katy@test.com',
        displayName: 'Katy',
      });
    });
  });
});
