'use client';

import { useEffect, useState } from 'react';
import useVariables, { VariableType } from '@/hooks/useVariables';
import { GenericTable } from '../GenericTable/GenericTable';

export default function Variables() {
  const [isClient, setIsClient] = useState(false);
  const {
    variables,
    newVarName,
    setNewVarName,
    newInitialValue,
    setNewInitialValue,
    addVariable,
    updateVariable,
    deleteVariable,
  } = useVariables();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl transition-colors">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Variables
      </h1>
      <GenericTable<VariableType>
        items={variables}
        columns={[
          { key: 'name', label: 'Variable' },
          { key: 'initialValue', label: 'Initial Value' },
        ]}
        onChange={updateVariable}
        onDelete={deleteVariable}
        newItem={{
          name: newVarName,
          initialValue: newInitialValue,
        }}
        setNewItem={(item) => {
          setNewVarName(item.name);
          setNewInitialValue(item.initialValue);
        }}
        onAdd={addVariable}
      />
    </div>
  );
}
