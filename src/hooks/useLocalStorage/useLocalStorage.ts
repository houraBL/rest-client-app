'use client';

import { useEffect, useState } from 'react';

export const LS_KEYS = {
  THEME: 'theme',
  SEARCH: 'search',
};

const useLocalStorage = (
  key: string,
  initialValue: string = ''
): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [value, setValue] = useState<string>(initialValue);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        setValue(stored);
      }
    } catch (err) {
      console.error('useLocalStorage get error:', err);
    }
  }, [initialValue, key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
      console.error('useLocalStorage set error:', err);
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
