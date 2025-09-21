'use client';
import { Link } from '@/i18n/navigation';
import React from 'react';
import { Loader } from '../Loader/Loader';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth/useAuth';

export default function Main() {
  const { user, loading } = useAuth();
  const t = useTranslations();
  return (
    <div className="items-center w-sm hero-content py-0">
      {loading && <Loader />}
      {!user && !loading && (
        <div className="flex flex-col gap-3 items-center">
          <h2 className="p-2 font-bold text-3xl">{t('Main.welcome')}</h2>
          <p className="p-2">{t('Main.authorize')}</p>
          <ul className="menu menu-horizontal w-full">
            <li className="flex-1">
              <Link href="/login" className="btn btn-primary">
                <span className="w-fit">{t('Header.login')}</span>
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
