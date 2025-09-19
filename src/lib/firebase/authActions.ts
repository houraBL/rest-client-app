'use server';

import { cookies } from 'next/headers';
import {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
} from './firebase';
import type { User } from 'firebase/auth';
import { adminAuth } from '@/lib/firebase/firebaseAdmin';

const SESSION_EXPIRES = 60 * 60 * 24 * 7 * 1000;

export async function setAuthCookie(user: User) {
  const idToken = await user.getIdToken();

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRES,
  });

  (await cookies()).set('auth_token', sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_EXPIRES / 1000,
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
