import { useState } from 'react';
import toast from 'react-hot-toast';
import { useVariableLocalStorage } from '../useVariableLocalStorage/useVariableLocalStorage';

export type VariableType = {
  name: string;
  value: string;
};

function isDuplicate(
  variables: VariableType[],
  name: string,
  excludeIndex?: number
) {
  return variables.some(
    (v, i) =>
      v.name.toLowerCase() === name.toLowerCase() &&
      (excludeIndex === undefined || i !== excludeIndex)
  );
}

export default function useVariables() {
  const [variables, setVariables] = useVariableLocalStorage<VariableType[]>(
    'variables',
    []
  );
  const [newVarName, setNewVarName] = useState('');
  const [newValue, setNewValue] = useState('');

  const addVariable = () => {
    const trimmedName = newVarName.trim();
    const trimmedValue = newValue.trim();
    if (!trimmedName) return toast.error('Please enter a variable name!');
    if (!trimmedValue) return toast.error('Please enter a variable value!');

    if (isDuplicate(variables, trimmedName)) {
      return toast.error('Variable with this name already exists!');
    }
    setVariables([...variables, { name: trimmedName, value: trimmedValue }]);
    setNewVarName('');
    setNewValue('');
  };

  const updateVariable = (
    index: number,
    field: keyof VariableType,
    value: string
  ) => {
    const trimmedValue = typeof value === 'string' ? value.trim() : value;
    if (!trimmedValue) {
      toast.error(
        field === 'name' ? 'Name cannot be empty!' : 'Value cannot be empty!'
      );
      return;
    }

    if (field === 'name' && isDuplicate(variables, trimmedValue, index)) {
      toast.error('Variable with this name already exists!');
      return;
    }

    setVariables(
      variables.map((v: VariableType, i: number) =>
        i === index ? { ...v, [field]: trimmedValue } : v
      )
    );
  };

  const deleteVariable = (index: number) => {
    setVariables(variables.filter((_: unknown, i: number) => i !== index));
  };

  return {
    variables,
    newVarName,
    setNewVarName,
    newValue,
    setNewValue,
    addVariable,
    updateVariable,
    deleteVariable,
  };
}
