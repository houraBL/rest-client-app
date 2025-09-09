import { useEffect, useState } from 'react';

export function useVariableLocalStorage<T>(key: string, defValue: T) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defValue;
      }
    }

    return defValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
