'use client';

import { useState } from 'react';
import { TableRow } from '../TableRow/TableRow';

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
              <TableRow
                key={index}
                picked={v.picked}
                name={v.name}
                initialValue={v.initialValue}
                onChange={(field, value) =>
                  updateVariable(index, field as keyof VariableType, value)
                }
                onDelete={() => deleteVariable(index)}
              />
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
                  className="px-4 py-2 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-colors cursor-pointer"
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
