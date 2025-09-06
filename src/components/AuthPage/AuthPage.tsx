'use client';

import {
  auth,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
} from '@/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState } from 'react';

type Mode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, loading, error] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
  }
  if (user) {
    // TODO: redirect to the main page
    console.log('Redirecting');
  }

  const handleSubmit = async () => {
    try {
      if (mode === 'login') {
        await await logInWithEmailAndPassword(email, password);
      } else {
        await registerWithEmailAndPassword(name, email, password);
      }
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        <h2>{mode === 'login' ? 'Welcome Back!' : 'Get Started Now'}</h2>
        <p>
          {mode === 'login' ? 'Enter your credentials' : 'Create a new account'}
        </p>
      </div>
      {mode === 'register' && (
        <input
          type="text"
          className="input input-accent"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      )}

      <input
        type="text"
        className="input input-accent"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <input
        type="password"
        className="input input-accent"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />
      <button className="btn btn-info" onClick={handleSubmit}>
        {mode === 'login' ? 'Sign In' : 'Sign Up'}
      </button>
      <p>
        {mode === 'login' ? "Don't have an account? " : 'Have an account? '}
        <span
          className="cursor-pointer"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Sign Up' : 'Sign In'}
        </span>
      </p>
    </>
  );
}
