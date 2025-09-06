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
import { AuthForm } from './AuthForm/AuthForm';

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
      <AuthForm
        mode={mode}
        name={name}
        email={email}
        password={password}
        setName={setName}
        setEmail={setEmail}
        setPassword={setPassword}
        errors={errors}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
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
