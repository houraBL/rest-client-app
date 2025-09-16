'use client';

import { useEffect, useState, useTransition } from 'react';
import { loginSchema, registerSchema } from '@/lib/validation/auth';
import z from 'zod';
import { Loader } from '../Loader/Loader';
import { AuthForm } from './AuthForm/AuthForm';
import { FirebaseError } from 'firebase/app';
import { toast } from 'react-hot-toast';
import { useRouter } from '@/i18n/navigation';
import {
  logInAndSetCookie,
  registerAndSetCookie,
} from '@/lib/firebase/authActions';
import { useAuth } from '@/hooks/useAuth/useAuth';

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

  const [isLogin] = useState(
    isInitialLogin !== undefined ? isInitialLogin : true
  );
  const { user, setUser, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<Errors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (loading) return <Loader />;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    startTransition(async () => {
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
            const data = result.data;
            const res = await logInAndSetCookie(data.email, data.password);
            if (res) {
              setUser({
                uid: res.uid,
                email: res.email,
                displayName: res.displayName,
              });
            }

            toast.success('Welcome back!');
            setEmail('');
            setPassword('');
            router.refresh();
            router.push('/');
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
            const res = await registerAndSetCookie(
              validData.name,
              validData.email,
              validData.password
            );
            if (res) {
              setUser({
                uid: res.uid,
                email: res.email,
                displayName: res.displayName,
              });
            }

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
    });
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
        isPending={isPending}
      />
      <p className="text-center mb-5">
        {isLogin ? "Don't have an account? " : 'Have an account? '}
        <span
          className="cursor-pointer text-blue-400"
          onClick={() => router.replace(!isLogin ? '/login' : '/signup')}
        >
          {isLogin ? 'Sign Up' : 'Log In'}
        </span>
      </p>
      {isSubmitting && <Loader />}
    </div>
  );
}
