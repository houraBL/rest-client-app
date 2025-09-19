'use client';

import { Methods } from '@/types/methods';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setMethod } from '@/store/clientSlice';
import { replaceUrl } from '@/utils/replaceUrl';
import { useRouter } from '@/i18n/navigation';

export function MethodSelector() {
  const router = useRouter();
  const dispatch = useDispatch();
  const method = useSelector((state: RootState) => state.client.method);
  const clientState = useSelector((state: RootState) => state.client);
  const methods = Object.values(Methods);

  const handleChange = (value: Methods) => {
    dispatch(setMethod(value));
    replaceUrl(router, { ...clientState, method: value });
  };

  return (
    <div className="flex-1">
      <select
        value={method}
        onChange={(e) => handleChange(e.target.value as Methods)}
        className="w-full select select-bordered"
      >
        {methods.map((method) => (
          <option key={method}>{method}</option>
        ))}
      </select>
    </div>
  );
}
