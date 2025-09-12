type TableRowProps = {
  picked: boolean;
  name: string;
  initialValue: string;
  onChange: (
    field: 'picked' | 'name' | 'initialValue',
    value: string | boolean
  ) => void;
  onDelete: () => void;
};

export function TableRow({
  picked,
  name,
  initialValue,
  onChange,
  onDelete,
}: TableRowProps) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="p-3 text-center">
        <input
          type="checkbox"
          checked={picked}
          onChange={(e) => onChange('picked', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
        />
      </td>
      <td className="p-3">
        <input
          type="text"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </td>
      <td className="p-3">
        <input
          type="text"
          value={initialValue}
          onChange={(e) => onChange('initialValue', e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </td>
      <td className="p-3 text-center">
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white shadow-sm transition-colors"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}
