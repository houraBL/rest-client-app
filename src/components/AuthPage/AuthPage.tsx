'use client';

import {
  auth,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
} from '@/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { loginSchema, registerSchema } from '@/lib/validation/auth';
import z from 'zod';
import { useRouter } from 'next/navigation';
import { Loader } from '../Loader/Loader';

type Mode = 'login' | 'register';
type Errors = {
  name?: string;
  email?: string;
  password?: string;
};

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<Errors>({});

  const [user, loading, error] = useAuthState(auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/home');
    }
  }, [loading, user, router]);

  if (loading) return <Loader />;
  if (error) {
    console.log(error);
  }
  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
          const errors = z.treeifyError(result.error);
          setErrors({
            email: errors.properties?.email?.errors[0],
            password: errors.properties?.password?.errors[0],
          });
          return;
        } else {
          const validData = result.data;
          await await logInWithEmailAndPassword(
            validData.email,
            validData.password
          );
          setEmail('');
          setPassword('');
        }
      } else {
        const result = registerSchema.safeParse({ name, email, password });
        if (!result.success) {
          const errors = z.treeifyError(result.error);
          setErrors({
            name: errors.properties?.name?.errors[0],
            email: errors.properties?.email?.errors[0],
            password: errors.properties?.password?.errors[0],
          });
        } else {
          const validData = result.data;
          await registerWithEmailAndPassword(
            validData.name,
            validData.email,
            validData.password
          );
          setName('');
          setEmail('');
          setPassword('');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="auth-page" className="flex flex-col gap-3 w-sm">
      <div className="mb-5">
        <h2 className="mb-2 font-bold text-xl">
          {mode === 'login' ? 'Welcome Back!' : 'Get Started Now'}
        </h2>
        <p>
          {mode === 'login' ? 'Enter your credentials' : 'Create a new account'}
        </p>
      </div>
      <form
        data-testid="form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {mode === 'register' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              className="input input-accent w-full"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 m-0 text-xs mt-2">{errors.name}</p>
            )}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="text"
            className="input input-accent w-full"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-2">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            className="input input-accent w-full"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-2">{errors.password}</p>
          )}
        </div>
        <button className="btn btn-info mt-5" disabled={isSubmitting}>
          {mode === 'login' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center mb-5">
        {mode === 'login' ? "Don't have an account? " : 'Have an account? '}
        <span
          className="cursor-pointer text-blue-400"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Sign Up' : 'Sign In'}
        </span>
      </p>
      {isSubmitting && <Loader />}
    </div>
  );
}
