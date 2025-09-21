import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useVariables from './useVariables';

vi.mock('next-intl', async () => {
  const actual = await import('next-intl');
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

describe('useVariables', () => {
  it('initializes with empty array', () => {
    const { result } = renderHook(() => useVariables());
    expect(result.current.variables).toEqual([]);
  });

  it('adds a variable', () => {
    const { result } = renderHook(() => useVariables());
    act(() => {
      result.current.setNewVarName('Authorization');
      result.current.setNewValue('Bearer token');
    });

    act(() => {
      result.current.addVariable();
    });

    expect(result.current.variables).toEqual([
      { name: 'Authorization', value: 'Bearer token' },
    ]);
  });

  it('updates a variable', () => {
    const { result } = renderHook(() => useVariables());

    act(() => {
      result.current.updateVariable(0, 'value', 'Bearer new');
    });

    expect(result.current.variables[0].value).toBe('Bearer new');
  });

  it('deletes a variable', () => {
    const { result } = renderHook(() => useVariables());

    act(() => {
      result.current.deleteVariable(0);
    });

    expect(result.current.variables).toEqual([]);
  });

  it('does not allow duplicates', () => {
    const { result } = renderHook(() => useVariables());
    act(() => {
      result.current.setNewVarName('Authorization');
      result.current.setNewValue('Bearer token');
    });

    act(() => {
      result.current.addVariable();
    });

    expect(result.current.variables).toEqual([
      { name: 'Authorization', value: 'Bearer token' },
    ]);

    act(() => {
      result.current.setNewVarName('Authorization');
      result.current.setNewValue('Bearer token');
    });

    act(() => {
      result.current.addVariable();
    });

    expect(result.current.variables).toEqual([
      { name: 'Authorization', value: 'Bearer token' },
    ]);
  });
});
