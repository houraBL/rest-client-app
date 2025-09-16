'use server';

import { cookies } from 'next/headers';
import {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
} from './firebase';
import type { User } from 'firebase/auth';

export async function setAuthCookie(user: User) {
  const token = await user.getIdToken();
  (await cookies()).set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function logInAndSetCookie(email: string, password: string) {
  const user = await logInWithEmailAndPassword(email, password);
  if (user) await setAuthCookie(user);
  return user
    ? {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }
    : null;
}

export async function registerAndSetCookie(
  name: string,
  email: string,
  password: string
) {
  const user = await registerWithEmailAndPassword(name, email, password);
  if (user) await setAuthCookie(user);
  return user
    ? {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }
    : null;
}

export async function logoutAndClearCookie() {
  await logout();
  (await cookies()).delete('auth_token');
}
