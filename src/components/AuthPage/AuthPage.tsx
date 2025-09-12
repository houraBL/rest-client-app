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
import { FirebaseError } from 'firebase/app';
import { toast } from 'react-hot-toast';

type Errors = {
  name?: string;
  email?: string;
  password?: string;
};

export default function AuthPage({
  isInitialLogin,
}: {
  isInitialLogin?: boolean;
}) {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState<boolean>(
    isInitialLogin !== undefined ? isInitialLogin : true
  );

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
      if (isLogin) {
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
          await logInWithEmailAndPassword(validData.email, validData.password);
          toast.success('Welcome back!');
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
          toast.success('Account created successfully!');
          setName('');
          setEmail('');
          setPassword('');
        }
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/user-not-found':
            toast.error('User with this email not found');
            break;
          case 'auth/invalid-credential':
            toast.error('Wrong password or email');
            break;
          case 'auth/email-already-in-use':
            toast.error('Email already in use');
            break;
          default:
            toast.error('An unknown authentication error occurred');
        }
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-testid="auth-page" className="flex flex-col gap-3 w-sm">
      <div className="mb-5">
        <h2 className="mb-2 font-bold text-xl">
          {isLogin ? 'Welcome Back!' : 'Get Started Now'}
        </h2>
        <p>{isLogin ? 'Enter your credentials' : 'Create a new account'}</p>
      </div>
      <AuthForm
        isLogin={isLogin}
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
        {isLogin ? "Don't have an account? " : 'Have an account? '}
        <span
          className="cursor-pointer text-blue-400"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </span>
      </p>
      {isSubmitting && <Loader />}
    </div>
  );
}
