'use client';

import { useTranslations } from 'next-intl';

type GenericTableProps<T> = {
  items: T[];
  columns: { key: keyof T; label: string; options?: string[] }[];
  onChange: (index: number, key: keyof T, value: string) => void;
  onDelete: (index: number) => void;
  newItem: T;
  setNewItem: (item: T) => void;
  onAdd: () => void;
};

export function GenericTable<T extends Record<string, string>>({
  items,
  columns,
  onChange,
  onDelete,
  newItem,
  setNewItem,
  onAdd,
}: GenericTableProps<T>) {
  const t = useTranslations('Variables');

  return (
    <div className="overflow-hidden rounded-lg border-2 border-base-300 ">
      <table className="w-full text-sm table">
        <thead className="">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="">
                {col.label}
              </th>
            ))}
            <th className=""></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-base-300">
          {items.map((item, index) => (
            <tr key={index} className="hover:bg-base-200">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-1">
                  <input
                    type="text"
                    value={item[col.key]}
                    onChange={(e) => onChange(index, col.key, e.target.value)}
                    className="input w-full"
                  />
                </td>
              ))}
              <td className="px-1 flex items-center justify-center">
                <button
                  onClick={() => onDelete(index)}
                  className="btn btn-error w-14 sm:w-20"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
          <tr className="bg-base-300 ">
            {columns.map((col) => (
              <td key={String(col.key)} className="px-1">
                <input
                  type="text"
                  value={newItem[col.key]}
                  onChange={(e) =>
                    setNewItem({ ...newItem, [col.key]: e.target.value })
                  }
                  placeholder={col.label}
                  className="input w-full"
                />
              </td>
            ))}
            <td className="px-1 flex items-center justify-center">
              <button
                onClick={onAdd}
                className="btn btn-accent w-14 sm:w-20"
                disabled={!newItem.name.trim() || !newItem.initialValue.trim()}
              >
                {t('add')}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
