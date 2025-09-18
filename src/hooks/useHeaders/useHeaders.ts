import { setHeaders } from '@/store/clientSlice';
import { RootState } from '@/store/store';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export type HeadersType = {
  name: string;
  initialValue: string;
};

export default function useHeaders() {
  const dispatch = useDispatch();
  const storedHeaders = useSelector((state: RootState) => state.client.headers);

  const [headers, setHeadersState] = useState<HeadersType[]>(
    Object.entries(storedHeaders).map(([name, initialValue]) => ({
      name,
      initialValue,
    }))
  );
  const [newHeader, setNewHeader] = useState({
    name: '',
    initialValue: '',
  });

  const syncWithStore = (updated: HeadersType[]) => {
    setHeadersState(updated);
    dispatch(
      setHeaders(
        updated.reduce<Record<string, string>>(
          (acc, { name, initialValue }) => {
            acc[name] = initialValue;
            return acc;
          },
          {}
        )
      )
    );
  };

  const addHeader = () => {
    const name = newHeader.name.trim();
    if (!name) return;
    const updated = [
      ...headers,
      { name, initialValue: newHeader.initialValue },
    ];
    syncWithStore(updated);
    setNewHeader({ name: '', initialValue: '' });
  };

  const updateHeader = (
    index: number,
    field: keyof HeadersType,
    value: string
  ) => {
    const updated = [...headers];
    updated[index] = { ...updated[index], [field]: value };
    syncWithStore(updated);
  };

  const deleteHeader = (index: number) => {
    const updated = headers.filter((_, i) => i !== index);
    syncWithStore(updated);
  };

  return {
    headers,
    newHeader,
    setNewHeader,
    addHeader,
    updateHeader,
    deleteHeader,
  };
}
