import { lazy, Suspense } from 'react';
import { Loader } from '@/components/Loader/Loader';

const Variables = lazy(() => import('@/components/Variables/Variables'));
export default function VariablesPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Variables />
    </Suspense>
  );
}
