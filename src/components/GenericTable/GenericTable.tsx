'use client';

import { useTranslations } from 'next-intl';

type GenericTableProps<T> = {
  items: T[];
  columns: { key: keyof T; label: string }[];
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
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm text-gray-700 dark:text-gray-200">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="p-3 text-left">
                {col.label}
              </th>
            ))}
            <th className="p-3 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="p-3">
                  <input
                    type="text"
                    value={item[col.key]}
                    onChange={(e) => onChange(index, col.key, e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              ))}
              <td className="p-3 text-center">
                <button
                  onClick={() => onDelete(index)}
                  className="px-3 py-1 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white shadow-sm transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
          <tr className="bg-gray-50 dark:bg-gray-800/40">
            {columns.map((col) => (
              <td key={String(col.key)} className="p-3">
                <input
                  type="text"
                  value={newItem[col.key]}
                  onChange={(e) =>
                    setNewItem({ ...newItem, [col.key]: e.target.value })
                  }
                  placeholder={col.label}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
            ))}
            <td className="p-3 text-center">
              <button
                onClick={onAdd}
                className="px-4 py-2 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-colors cursor-pointer"
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
