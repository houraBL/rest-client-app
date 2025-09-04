'use client';
import { auth, registerWithEmailAndPassword } from '@/firebase/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const register = () => {
    registerWithEmailAndPassword(email, password);
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Home</h1>
        <Link href="/about">About</Link>
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{' '}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>
        <button className="btn btn-accent">daisy button</button>
        <h2 className="hero-content hero">REGISTER</h2>
        <input
          type="text"
          className="input input-accent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="input input-secondary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="btn btn-info" onClick={register}>
          Register
        </button>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/rss-logo.svg"
            alt="RS School icon"
            width={16}
            height={16}
          />
          RS School React course
        </a>
      </footer>
    </div>
  );
}
