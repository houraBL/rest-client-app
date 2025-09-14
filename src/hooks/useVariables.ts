import { useState } from 'react';
import { useVariableLocalStorage } from './useVariableLocalStorage';
import toast from 'react-hot-toast';

export type VariableType = {
  name: string;
  initialValue: string;
};

export default function useVariables() {
  const [variables, setVariables] = useVariableLocalStorage<VariableType[]>(
    'variables',
    []
  );
  const [newVarName, setNewVarName] = useState('');
  const [newInitialValue, setNewInitialValue] = useState('');

  const addVariable = () => {
    if (!newVarName.trim()) return;
    const duplicate = variables.some(
      (v: VariableType) =>
        v.name.toLowerCase() === newVarName.trim().toLowerCase()
    );
    if (duplicate) {
      toast.error('Variable with this name already exists!');
      return;
    }
    setVariables([
      ...variables,
      { name: newVarName.trim(), initialValue: newInitialValue },
    ]);
    setNewVarName('');
    setNewInitialValue('');
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
    setVariables(variables.filter((_: unknown, i: number) => i !== index));
  };

  return {
    variables,
    newVarName,
    setNewVarName,
    newInitialValue,
    setNewInitialValue,
    addVariable,
    updateVariable,
    deleteVariable,
  };
}
