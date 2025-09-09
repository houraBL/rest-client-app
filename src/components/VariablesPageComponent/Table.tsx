const mockVariables = [
  { key: 'API_URL', value: 'https://api.example.com' },
  { key: 'TOKEN', value: '1234567890abcdef' },
  { key: 'packageName', value: 'react' },
];

type Table = {
  headers: string[];
};

export const Table = () => {
  return (
    <table className="w-full border-collapse dark:border-gray-600 font-thin text-lg">
      <thead className="bg-gray-200 dark:bg-gray-700">
        <tr>
          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
            Variable
          </th>
          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
            Initial value
          </th>
          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
            Current value
          </th>
        </tr>
      </thead>
      <tbody>
        {mockVariables.map(({ key, value }) => (
          <tr key={key}>
            <td className="border px-4 py-2">{key}</td>
            <td className="border px-4 py-2">{value}</td>
            <td className="border px-4 py-2 text-right">
              <button className="text-red-500 hover:underline">Remove</button>
            </td>
          </tr>
        ))}
        <tr>
          <td className="border px-4 py-2">
            <input
              type="text"
              placeholder="Variable name"
              className="w-full px-2 py-1 border rounded"
            />
          </td>
          <td className="border px-4 py-2">
            <input
              type="text"
              placeholder="Variable value"
              className="w-full px-2 py-1 border rounded"
            />
          </td>
          <td className="border px-4 py-2 text-right">
            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
              Add
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
