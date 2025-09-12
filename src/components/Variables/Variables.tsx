'use client';

import { useState } from 'react';

type VariableType = {
  picked: boolean;
  name: string;
  initialValue: string;
};

export default function Variables() {
  const [variables, setVariables] = useState<VariableType[]>([]);
  const [newVarName, setNewVarName] = useState('');
  const [newInitialValue, setNewInitialValue] = useState('');

  const addVariable = () => {
    if (newVarName.trim()) {
      setVariables([
        ...variables,
        {
          picked: false,
          name: newVarName,
          initialValue: newInitialValue,
        },
      ]);
      setNewVarName('');
      setNewInitialValue('');
    }
  };

  const updateVariable = (
    index: number,
    field: keyof VariableType,
    value: unknown
  ) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    setVariables(updated);
  };

  const deleteVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl transition-colors">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Variables
      </h1>
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3 w-10"></th>
              <th className="p-3 text-left">Variable</th>
              <th className="p-3 text-left">Initial Value</th>
              <th className="p-3 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {variables.map((v, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={v.picked}
                    onChange={(e) =>
                      updateVariable(index, 'picked', e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    value={v.name}
                    onChange={(e) =>
                      updateVariable(index, 'name', e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    value={v.initialValue}
                    onChange={(e) =>
                      updateVariable(index, 'initialValue', e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => deleteVariable(index)}
                    className="px-3 py-1 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white shadow-sm transition-colors"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 dark:bg-gray-800/40">
              <td className="p-3 text-center">
                <input type="checkbox" disabled className="h-4 w-4" />
              </td>
              <td className="p-3">
                <input
                  type="text"
                  value={newVarName}
                  onChange={(e) => setNewVarName(e.target.value)}
                  placeholder="Variable name"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td className="p-3">
                <input
                  type="text"
                  value={newInitialValue}
                  onChange={(e) => setNewInitialValue(e.target.value)}
                  placeholder="Initial value"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={addVariable}
                  className="px-4 py-2 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-colors"
                >
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
