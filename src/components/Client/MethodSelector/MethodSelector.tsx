'use client';

import { Methods } from '@/types/methods';

interface MethodSelectorProps {
  method: Methods;
  onChange: (method: Methods) => void;
}

export function MethodSelector({ method, onChange }: MethodSelectorProps) {
  const methods = Object.values(Methods);
  return (
    <div className="flex-1">
      <select
        value={method}
        onChange={(e) => onChange(e.target.value as Methods)}
        className="w-full select select-bordered"
      >
        {methods.map((method) => (
          <option key={method}>{method}</option>
        ))}
      </select>
    </div>
  );
}
