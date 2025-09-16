import { describe, it, expect, vi } from 'vitest';

import {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
} from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { addDoc } from 'firebase/firestore';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => 'mocked-app'),
}));

const mockUser = { uid: '123', email: 'test@example.com' };

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => 'mocked-auth'),
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: mockUser })),
  createUserWithEmailAndPassword: vi.fn(() =>
    Promise.resolve({ user: mockUser })
  ),
  updateProfile: vi.fn(() => Promise.resolve()),
  signOut: vi.fn(() => Promise.resolve()),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => 'mocked-Firestore'),
  collection: vi.fn(() => 'mocked-collection'),
  addDoc: vi.fn(() => 'mocked-Doc'),
}));

describe('firebase utils', () => {
  it('logs in with email and password', async () => {
    const user = await logInWithEmailAndPassword(
      'test@example.com',
      'password'
    );
    expect(user).toEqual(mockUser);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      'mocked-auth',
      'test@example.com',
      'password'
    );
  });

  it('registers with email and password and updates profile + adds doc', async () => {
    const user = await registerWithEmailAndPassword(
      'Test User',
      'test@example.com',
      'password'
    );
    expect(user).toEqual(mockUser);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      'mocked-auth',
      'test@example.com',
      'password'
    );
    expect(updateProfile).toHaveBeenCalledWith(mockUser, {
      displayName: 'Test User',
    });
    expect(addDoc).toHaveBeenCalledWith('mocked-collection', {
      uid: '123',
      displayName: 'Test User',
      authProvider: 'local',
      email: 'test@example.com',
    });
  });

  it('logs out', async () => {
    await logout();
    expect(signOut).toHaveBeenCalledWith('mocked-auth');
  });
});
