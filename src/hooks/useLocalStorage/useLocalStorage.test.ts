import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  const key = 'test-key';
  const TEST_VALUES = {
    default: 'default',
    initial: 'initial',
    stored_value: 'stored-value',
    updated: 'updated',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('Initializes with default value if localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorage(key, TEST_VALUES.default)
    );

    const [storedValue] = result.current;
    expect(storedValue).toBe(TEST_VALUES.default);
    expect(localStorage.getItem(key)).toBe(TEST_VALUES.default);
  });

  it('Initializes with stored value if localStorage has data', () => {
    localStorage.setItem(key, TEST_VALUES.stored_value);

    const { result } = renderHook(() =>
      useLocalStorage(key, TEST_VALUES.default)
    );

    const [storedValue] = result.current;
    expect(storedValue).toBe(TEST_VALUES.stored_value);
  });

  it('Updates value and saves to localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage(key, TEST_VALUES.initial)
    );

    act(() => {
      const [, setValue] = result.current;
      setValue(TEST_VALUES.updated);
    });

    const [updatedValue] = result.current;
    expect(updatedValue).toBe(TEST_VALUES.updated);
    expect(localStorage.getItem(key)).toBe(TEST_VALUES.updated);
  });

  it('Saves changes across rerenders', () => {
    const { result, rerender } = renderHook(() =>
      useLocalStorage(key, TEST_VALUES.initial)
    );

    act(() => {
      const [, setValue] = result.current;
      setValue(TEST_VALUES.updated);
    });

    rerender();

    const [currentValue] = result.current;
    expect(currentValue).toBe(TEST_VALUES.updated);
    expect(localStorage.getItem(key)).toBe(TEST_VALUES.updated);
  });
});
