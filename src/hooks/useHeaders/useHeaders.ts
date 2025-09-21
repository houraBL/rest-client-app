import { setHeaders } from '@/store/clientSlice';
import { RootState } from '@/store/store';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

export type HeadersType = {
  name: string;
  value: string;
};

function isDuplicate(
  headers: HeadersType[],
  name: string,
  excludeIndex?: number
) {
  return headers.some(
    (h, i) =>
      h.name.toLowerCase() === name.toLowerCase() &&
      (excludeIndex === undefined || i !== excludeIndex)
  );
}

export default function useHeaders() {
  const dispatch = useDispatch();
  const storedHeaders = useSelector((state: RootState) => state.client.headers);

  const [headers, setHeadersState] = useState<HeadersType[]>(
    Object.entries(storedHeaders).map(([name, value]) => ({
      name,
      value,
    }))
  );
  const [newHeader, setNewHeader] = useState({
    name: '',
    value: '',
  });

  useEffect(() => {
    setHeadersState(
      Object.entries(storedHeaders).map(([name, value]) => ({
        name,
        value,
      }))
    );
  }, [storedHeaders]);

  const syncWithStore = (updated: HeadersType[]) => {
    setHeadersState(updated);
    dispatch(
      setHeaders(
        updated.reduce<Record<string, string>>((acc, { name, value }) => {
          acc[name] = value;
          return acc;
        }, {})
      )
    );
  };

  const addHeader = () => {
    const name = newHeader.name.trim();
    const value = newHeader.value.trim();
    if (!name) return toast.error('Please enter a header name!');
    if (!value) return toast.error('Please enter a header value!');

    if (isDuplicate(headers, name)) {
      toast.error('Header with this name already exists!');
      return;
    }

    const updated = [...headers, { name, value }];
    syncWithStore(updated);
    setNewHeader({ name: '', value: '' });
  };

  const updateHeader = (
    index: number,
    field: keyof HeadersType,
    value: string
  ) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      toast.error(
        field === 'name' ? 'Name cannot be empty!' : 'Value cannot be empty!'
      );
      return;
    }
    if (field === 'name' && isDuplicate(headers, trimmedValue, index)) {
      toast.error('Header with this name already exists!');
      return;
    }
    const updated = [...headers];
    updated[index] = { ...updated[index], [field]: trimmedValue };
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
