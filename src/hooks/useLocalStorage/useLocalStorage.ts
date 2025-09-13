'use client';

import { useEffect, useState } from 'react';

export const LS_KEYS = {
  THEME: 'theme',
};

export default function useLocalStorage(
  key: string,
  initialValue = ''
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [value, setValue] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) return stored;
    }
    return initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}
