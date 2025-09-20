import { lazy, Suspense } from 'react';
import { Loader } from '@/components/Loader/Loader';

const ClientPage = lazy(() => import('@/components/Client/ClientPage'));
export default function Client() {
  return (
    <Suspense fallback={<Loader />}>
      <ClientPage />
    </Suspense>
  );
}
