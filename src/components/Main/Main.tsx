'use client';
import { auth } from '@/firebase/firebase';
import { Link } from '@/i18n/navigation';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Loader } from '../Loader/Loader';
import { useTranslations } from 'next-intl';

export default function Main() {
  const [user, loading] = useAuthState(auth);
  const t = useTranslations();
  return (
    <div className="items-center w-sm hero-content">
      {loading && <Loader />}
      {!user && !loading && (
        <div className="flex flex-col gap-3 items-center">
          <h2 className="p-2 font-bold text-3xl">{t('Main.welcome')}</h2>
          <p className="p-2">{t('Main.login-message')}</p>
          <ul className="menu menu-horizontal w-full">
            <li className="flex-1">
              <Link href="/signin" className="btn btn-primary">
                <span className="w-fit">{t('Header.signin')}</span>
              </Link>
            </li>
            <li className="flex-1">
              <Link href="/signup" className="btn btn-primary">
                <span className="w-fit">{t('Header.signup')}</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
      {user && !loading && (
        <div className="flex flex-col gap-3 items-center">
          <h2 className="p-2 font-bold text-3xl">
            {t('Main.welcome-back')}
            {user.displayName || 'User'}!
          </h2>
          <p className="p-2 text-c">{t('Main.instructions')}</p>
          <ul className="menu menu-horizontal w-full">
            <li className="flex-1">
              <Link href="/client" className="btn btn-primary">
                <span className="w-fit">{t('Main.client')}</span>
              </Link>
            </li>
            <li className="flex-1">
              <Link href="/history" className="btn btn-primary">
                <span className="w-fit">{t('Main.history')}</span>
              </Link>
            </li>
            <li className="flex-1">
              <Link href="/variables" className="btn btn-primary">
                <span className="w-fit">{t('Main.variables')}</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
