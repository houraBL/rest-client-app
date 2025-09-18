'use client';

import { useEffect, useState } from 'react';
import useVariables, { VariableType } from '@/hooks/useVariables/useVariables';
import { GenericTable } from '../GenericTable/GenericTable';
import { useTranslations } from 'next-intl';

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

  const t = useTranslations('Variables');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 rounded-2xl shadow-xl">
      <h1 className="text-2xl font-bold mb-6">{t('variables')}</h1>
      <GenericTable<VariableType>
        items={variables}
        columns={[
          { key: 'name', label: t('variable') },
          { key: 'initialValue', label: t('value') },
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
