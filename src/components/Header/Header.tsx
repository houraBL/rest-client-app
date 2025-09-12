'use client';
import { auth, logout } from '@/firebase/firebase';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Loader } from '../Loader/Loader';
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher/ThemeSwitcher';

export default function Header() {
  const [user, loading] = useAuthState(auth);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              <Link href="/signin">
                <span className="w-fit">Sign in</span>
              </Link>
            </li>
            <li>
              <Link href="/signup">
                <span className="w-fit">Sign up</span>
              </Link>
            </li>
          </>
        )}
        {user && !loading && (
          <li>
            <Link href="/" onClick={logout}>
              <span>Sign out</span>
            </Link>
          </li>
        )}
        <li>
          <ThemeSwitcher />
        </li>
      </ul>
    </header>
  );
}
