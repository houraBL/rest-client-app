'use client';

import { useEffect, useState } from 'react';

export const LS_KEYS = {
  THEME: 'theme',
  SEARCH: 'search',
};

const useLocalStorage = (
  key: string,
  initialValue = ''
): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [value, setValue] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) return stored;
    }
    return initialValue;
  });

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
