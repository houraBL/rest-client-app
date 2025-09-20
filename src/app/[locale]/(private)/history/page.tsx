import { Loader } from '@/components/Loader/Loader';
import { lazy, Suspense } from 'react';

const History = lazy(() => import('@/components/History/History'));
export default function HistoryPage() {
  return (
    <Suspense fallback={<Loader />}>
      <History />
    </Suspense>
  );
}
