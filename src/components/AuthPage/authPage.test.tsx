import { describe, expect, it, Mock, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import AuthPage from './AuthPage';
import { NextIntlClientProvider } from 'next-intl';
import {
  logInAndSetCookie,
  registerAndSetCookie,
} from '@/lib/firebase/authActions';

vi.mock('@/lib/firebase/authActions', () => ({
  logInAndSetCookie: vi.fn(),
  registerAndSetCookie: vi.fn(),
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

vi.mock('@/hooks/useAuth/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({ user: null, loading: false }),
}));

describe('AuthPage', () => {
  it('Render AuthPage', () => {
    render(
      <NextIntlClientProvider locale="en">
        <AuthPage />
      </NextIntlClientProvider>
    );
    const authPage = screen.getByTestId('auth-page');
    const form = screen.getByTestId('form');
    expect(authPage).toBeInTheDocument();
    expect(form).toBeInTheDocument();
  });
  it('Login success calls logInAndSetCookie', async () => {
    render(
      <NextIntlClientProvider locale="en">
        <AuthPage />
      </NextIntlClientProvider>
    );

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const logInBtn = screen.getByRole('button', { name: /log in/i });

    await userEvent.type(emailInput, 'katy@test.com');
    await userEvent.type(passwordInput, '11111111k.');
    await userEvent.click(logInBtn);

    await waitFor(() => {
      expect(logInAndSetCookie).toHaveBeenCalledWith(
        'katy@test.com',
        '11111111k.'
      );
    });
  });
  it('Login shows validation errors', async () => {
    render(
      <NextIntlClientProvider locale="en">
        <AuthPage />
      </NextIntlClientProvider>
    );

    const logInBtn = screen.getByRole('button', { name: /log in/i });
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
    render(
      <NextIntlClientProvider locale="en">
        <AuthPage isInitialLogin={false} />
      </NextIntlClientProvider>
    );

    const signUpBtn = screen.getByRole('button', { name: /sign up/i });
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
    render(
      <NextIntlClientProvider locale="en">
        <AuthPage isInitialLogin={false} />
      </NextIntlClientProvider>
    );

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const signUpBtn = screen.getByRole('button', { name: /sign up/i });

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
    });
  });
});
