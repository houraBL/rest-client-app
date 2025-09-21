import { AuthContext } from '@/providers/AuthContext';
import { useContext } from 'react';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('no AuthProvider');
  }
  return context;
}
