import { useState } from 'react';
import toast from 'react-hot-toast';
import { useVariableLocalStorage } from '../useVariableLocalStorage/useVariableLocalStorage';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Variables');
  const [variables, setVariables] = useVariableLocalStorage<VariableType[]>(
    'variables',
    []
  );
  const [newVarName, setNewVarName] = useState('');
  const [newValue, setNewValue] = useState('');

  const addVariable = () => {
    const trimmedName = newVarName.trim();
    const trimmedValue = newValue.trim();
    if (!trimmedName) return toast.error(t('errorEmptyName'));
    if (!trimmedValue) return toast.error(t('errorEmptyValue'));

    if (isDuplicate(variables, trimmedName)) {
      return toast.error(t('errorDuplicateName'));
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
        field === 'name' ? t('errorEmptyName') : t('errorEmptyValue')
      );
      return;
    }

    if (field === 'name' && isDuplicate(variables, trimmedValue, index)) {
      toast.error(t('errorDuplicateName'));
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
