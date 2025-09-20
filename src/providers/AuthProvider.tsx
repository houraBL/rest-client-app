'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AuthContext, AuthUser } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.status === 401) {
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const interval = setInterval(fetchUser, 10 * 60 * 1000);

    const handleFocus = () => fetchUser();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
