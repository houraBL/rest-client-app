import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import * as reactFirebaseHooks from 'react-firebase-hooks/auth';
import '@testing-library/jest-dom';
import { User } from 'firebase/auth';
import userEvent from '@testing-library/user-event';
import {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
} from '@/firebase/firebase';
import AuthPage from './AuthPage';
import { NextIntlClientProvider } from 'next-intl';

vi.mock('@/firebase/firebase', () => ({
  auth: {},
  logInWithEmailAndPassword: vi.fn(),
  registerWithEmailAndPassword: vi.fn(),
}));

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

vi.spyOn(reactFirebaseHooks, 'useAuthState').mockReturnValue([
  null,
  false,
  undefined,
]);

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
  it('Redirects to / if user is logged in', () => {
    vi.spyOn(reactFirebaseHooks, 'useAuthState').mockReturnValue([
      { uid: '12' } as unknown as User,
      false,
      undefined,
    ]);
    render(
      <NextIntlClientProvider locale="en">
        <AuthPage />
      </NextIntlClientProvider>
    );
    expect(pushMock).toHaveBeenCalledWith('/');
  });
  it('Redirects to / if user is error in useAuthState', () => {
    vi.spyOn(reactFirebaseHooks, 'useAuthState').mockReturnValue([
      null,
      false,
      new Error('Test error'),
    ]);
    render(
      <NextIntlClientProvider locale="en">
        <AuthPage />
      </NextIntlClientProvider>
    );
    expect(pushMock).toHaveBeenCalledWith('/');
  });
  it('Login success calls logInWithEmailAndPassword', async () => {
    render(
      <NextIntlClientProvider locale="en">
        <AuthPage />
      </NextIntlClientProvider>
    );

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const signInBtn = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'katy@test.com');
    await userEvent.type(passwordInput, '11111111k.');
    await userEvent.click(signInBtn);

    await waitFor(() => {
      expect(logInWithEmailAndPassword).toHaveBeenCalledWith(
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

    const signInBtn = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(signInBtn);
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
        <AuthPage />
      </NextIntlClientProvider>
    );

    const switchMode = screen.getByText(/sign up/i);
    await userEvent.click(switchMode);

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
  it('Register success calls registerWithEmailAndPassword', async () => {
    render(
      <NextIntlClientProvider locale="en">
        <AuthPage />
      </NextIntlClientProvider>
    );

    const modeSwitcher = screen.getByText(/sign up/i);
    await userEvent.click(modeSwitcher);

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const signUpBtn = screen.getByRole('button', { name: /sign up/i });

    await userEvent.type(nameInput, 'Katy');
    await userEvent.type(emailInput, 'katy@test.com');
    await userEvent.type(passwordInput, '11111111k.');
    await userEvent.click(signUpBtn);

    await waitFor(() => {
      expect(registerWithEmailAndPassword).toHaveBeenCalledWith(
        'Katy',
        'katy@test.com',
        '11111111k.'
      );
    });
  });
});
