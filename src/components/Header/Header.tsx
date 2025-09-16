'use client';

import { Link, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Loader } from '../Loader/Loader';
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher/ThemeSwitcher';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { logoutAndClearCookie } from '@/lib/firebase/authActions';
import toast from 'react-hot-toast';

export default function Header() {
  const router = useRouter();
  const { user, setUser, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations('Header');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logoutAndClearCookie();
    setUser(null);
    toast.success('Logged out');
    router.push('/');
  };

  return (
    <header
      className={`navbar bg-base-100 z-40 sticky top-0 shadow-lg transition-all duration-500 ease-in-out 
        ${scrolled ? 'h-16 bg-purple-100 dark:bg-purple-950' : ' h-20'}
      `}
    >
      <ul className="menu menu-horizontal navbar-start px-1">
        <li>
          <Link href="/">
            <Image
              aria-hidden
              src="/app-logo.svg"
              alt="App logo"
              className="w-6 h-6 p-0"
              width={300}
              height={300}
            />
            RESTful API
          </Link>
        </li>
      </ul>
      <ul className="menu menu-horizontal navbar-end px-1">
        <li>
          <LanguageSwitcher />
        </li>
        {loading && <Loader />}
        {!user && !loading && (
          <>
            <li>
              <Link href="/login">
                <span className="w-fit">{t('login')}</span>
              </Link>
            </li>
            <li>
              <Link href="/signup">
                <span className="w-fit">{t('signup')}</span>
              </Link>
            </li>
          </>
        )}
        {user && !loading && (
          <li>
            <button onClick={handleLogout}>
              <span>{t('signout')}</span>
            </button>
          </li>
        )}
        <li>
          <ThemeSwitcher />
        </li>
      </ul>
    </header>
  );
}
