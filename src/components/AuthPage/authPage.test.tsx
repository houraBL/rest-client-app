import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactFirebaseHooks from 'react-firebase-hooks/auth';
import { User } from 'firebase/auth';
import AuthPage from './AuthPage';
import {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
} from '@/firebase/firebase';
import '@testing-library/jest-dom';
import { renderWithMessages } from './renderWithMessages';

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders AuthPage', () => {
    renderWithMessages(<AuthPage />);
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    expect(screen.getByTestId('form')).toBeInTheDocument();
  });

  it('redirects to / if user is logged in', () => {
    vi.spyOn(reactFirebaseHooks, 'useAuthState').mockReturnValue([
      { uid: '12' } as User,
      false,
      undefined,
    ]);
    renderWithMessages(<AuthPage />);
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('redirects to / if useAuthState returns an error', () => {
    vi.spyOn(reactFirebaseHooks, 'useAuthState').mockReturnValue([
      null,
      false,
      new Error('Test error'),
    ]);
    renderWithMessages(<AuthPage />);
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('login calls logInWithEmailAndPassword', async () => {
    renderWithMessages(<AuthPage />);
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

  it('register calls registerWithEmailAndPassword', async () => {
    renderWithMessages(<AuthPage isInitialLogin={false} />);
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
