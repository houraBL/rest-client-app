'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from '../Loader/Loader';
import { Table } from './Table';
import { SearchInput } from './SearchInput';

export default function VariablesPageComponent() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/home');
    }
  }, [loading, user, router]);

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <div className=" m-4">
      <h1>Variables collection</h1>
      <SearchInput text={'Filter variables'} />
      <Table />
    </div>
  );
}
