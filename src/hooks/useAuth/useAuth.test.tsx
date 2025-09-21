import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAuth } from './useAuth';
import { ReactNode } from 'react';
import { AuthContext, AuthUser } from '@/providers/AuthContext';

const mockUser: AuthUser = {
  uid: '123',
  email: 'test@example.com',
  displayName: 'Test User',
};

const mockValue = {
  user: mockUser,
  setUser: vi.fn(),
  loading: false,
};
const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
);

describe('useAuth', () => {
  it('throws error if not inside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrowError('no AuthProvider');
  });

  it('returns context value when inside AuthProvider', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('setUser');
    expect(result.current).toHaveProperty('loading');
  });
});
