import { useLocalStorage } from './useLocalStorage';

export function useVariables(userId: string) {
  const [variables, setVariables] = useLocalStorage<Record<string, string>>(
    userId,
    {}
  );

  const updateOrAdd = (key: string, value: string) => {
    setVariables((prev: Record<string, string>) => ({ ...prev, [key]: value }));
  };

  const remove = (key: string) => {
    setVariables((prev: Record<string, string>) => {
      return Object.fromEntries(
        Object.entries(prev).filter(([k]) => k !== key)
      );
    });
  };

  const clearAll = () => setVariables({});

  return { variables, updateOrAdd, remove, clearAll };
}
