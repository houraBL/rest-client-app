import useTheme from './useTheme';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/providers/ThemeProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('useTheme', () => {
  it('throws error if not inside of ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrowError('no ThemeProvider');
  });

  it('returns context value when inside ThemeProvider', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current).toHaveProperty('theme');
  });
});
