'use client';

import { Methods } from '@/types/methods';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setMethod } from '@/store/clientSlice';

export function MethodSelector() {
  const dispatch = useDispatch();
  const method = useSelector((state: RootState) => state.client.method);
  const methods = Object.values(Methods);
  return (
    <div className="flex-1">
      <select
        value={method}
        onChange={(e) => dispatch(setMethod(e.target.value as Methods))}
        className="w-full select select-bordered"
      >
        {methods.map((method) => (
          <option key={method}>{method}</option>
        ))}
      </select>
    </div>
  );
}
