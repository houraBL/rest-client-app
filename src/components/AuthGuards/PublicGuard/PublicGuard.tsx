'use client';

import { Loader } from '@/components/Loader/Loader';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { useRouter } from '@/i18n/navigation';
import { ReactNode, useEffect } from 'react';

export default function PublicGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) router.push('/');
  }, [router, user]);

  if (loading || user) {
    return (
      <div className="py-20 text-center">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
