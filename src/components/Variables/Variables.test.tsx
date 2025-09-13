import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Variables from './Variables';
import * as useVariablesHook from '@/hooks/useVariables';

describe('Variables component', () => {
  const mockVariables = [
    { name: 'Var1', initialValue: 'Value1' },
    { name: 'Var2', initialValue: 'Value2' },
  ];

  let addVariable: ReturnType<typeof vi.fn>;
  let updateVariable: ReturnType<typeof vi.fn>;
  let deleteVariable: ReturnType<typeof vi.fn>;
  let setNewVarName: ReturnType<typeof vi.fn>;
  let setNewInitialValue: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    addVariable = vi.fn();
    updateVariable = vi.fn();
    deleteVariable = vi.fn();
    setNewVarName = vi.fn();
    setNewInitialValue = vi.fn();

    vi.spyOn(useVariablesHook, 'default').mockReturnValue({
      variables: mockVariables,
      newVarName: '',
      setNewVarName,
      newInitialValue: '',
      setNewInitialValue,
      addVariable,
      updateVariable,
      deleteVariable,
    });
  });

  it('renders variables table', () => {
    render(<Variables />);
    expect(screen.getByText('Variable')).toBeDefined();
    expect(screen.getByText('Value')).toBeDefined();
    expect(screen.getByDisplayValue('Var1')).toBeDefined();
    expect(screen.getByDisplayValue('Var2')).toBeDefined();
  });

  it('calls onChange when editing a cell', () => {
    render(<Variables />);
    const input = screen.getByDisplayValue('Var1') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Var1Updated' } });
    expect(updateVariable).toHaveBeenCalledWith(0, 'name', 'Var1Updated');
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<Variables />);
    const deleteButtons = screen.getAllByText('✕');
    fireEvent.click(deleteButtons[0]);
    expect(deleteVariable).toHaveBeenCalledWith(0);
  });

  it('calls onAdd when Add button is clicked', () => {
    render(<Variables />);
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);
    expect(addVariable).toHaveBeenCalled();
  });
});
