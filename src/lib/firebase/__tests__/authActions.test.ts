import { describe, it, expect, vi } from 'vitest';

import {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
} from '../firebase';
import {
  setAuthCookie,
  logInAndSetCookie,
  registerAndSetCookie,
  logoutAndClearCookie,
} from '../authActions';
import { User } from 'firebase/auth';

vi.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: vi.fn(),
  credential: {
    cert: vi.fn(),
  },
  auth: vi
    .fn()
    .mockReturnValue({ createSessionCookie: vi.fn(() => 'session_cookie') }),
}));

const setMock = vi.fn();
const deleteMock = vi.fn();
vi.mock('next/headers', () => ({
  cookies: () => ({
    set: setMock,
    delete: deleteMock,
  }),
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => 'mocked-app'),
}));

const mockUserWithToken = {
  uid: '123',
  email: 'test@example.com',
  displayName: 'Test User',
  getIdToken: vi.fn(() => Promise.resolve('mock-token')),
};

const mockUser = {
  uid: '123',
  email: 'test@example.com',
  displayName: 'Test User',
};

vi.mock('../firebase', () => ({
  logInWithEmailAndPassword: vi.fn(() => mockUserWithToken),
  registerWithEmailAndPassword: vi.fn(() => mockUserWithToken),
  logout: vi.fn(),
}));

describe('auth actions', () => {
  it('sets auth cookie', async () => {
    await setAuthCookie(mockUserWithToken as unknown as User);
    expect(setMock).toHaveBeenCalledWith(
      'auth_token',
      'session_cookie',
      expect.any(Object)
    );
  });

  it('logs in and sets cookie', async () => {
    const user = await logInAndSetCookie('test@example.com', 'password');
    expect(user).toEqual(mockUser);
    expect(logInWithEmailAndPassword).toHaveBeenCalledWith(
      'test@example.com',
      'password'
    );
  });

  it('registers and sets cookie', async () => {
    const user = await registerAndSetCookie(
      'Test User',
      'test@example.com',
      'password'
    );
    expect(user).toEqual(mockUser);
    expect(registerWithEmailAndPassword).toHaveBeenCalledWith(
      'Test User',
      'test@example.com',
      'password'
    );
  });

  it('logs out and removes cookie', async () => {
    await logoutAndClearCookie();
    expect(logout).toHaveBeenCalled();
    expect(deleteMock).toHaveBeenCalledWith('auth_token');
  });
});
