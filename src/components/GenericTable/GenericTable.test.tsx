import { screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { GenericTable } from './GenericTable';
import { renderWithMessages } from '../Variables/renderWithMessages';

type TestItem = {
  key: string;
  value: string;
};

describe('GenericTable', () => {
  const columns: { key: keyof TestItem; label: string }[] = [
    { key: 'key', label: 'Key' },
    { key: 'value', label: 'Value' },
  ];

  const items: TestItem[] = [
    { key: 'item1', value: 'val1' },
    { key: 'item2', value: 'val2' },
  ];

  let onChange: (index: number, key: keyof TestItem, value: string) => void;
  let onDelete: (index: number) => void;
  let onAdd: () => void;
  let setNewItem: (item: TestItem) => void;
  let newItem: TestItem;

  beforeEach(() => {
    onChange = vi.fn();
    onDelete = vi.fn();
    onAdd = vi.fn();
    setNewItem = vi.fn();
    newItem = { key: '', value: '' };
  });

  it('renders columns and rows', () => {
    renderWithMessages(
      <GenericTable<TestItem>
        items={items}
        columns={columns}
        onChange={onChange}
        onDelete={onDelete}
        newItem={newItem}
        setNewItem={setNewItem}
        onAdd={onAdd}
      />
    );

    expect(screen.getByText('Key')).toBeDefined();
    expect(screen.getByText('Value')).toBeDefined();
    expect(screen.getByDisplayValue('item1')).toBeDefined();
    expect(screen.getByDisplayValue('val1')).toBeDefined();
  });

  it('calls onChange when input value changes', () => {
    renderWithMessages(
      <GenericTable<TestItem>
        items={items}
        columns={columns}
        onChange={onChange}
        onDelete={onDelete}
        newItem={newItem}
        setNewItem={setNewItem}
        onAdd={onAdd}
      />
    );

    const input = screen.getByDisplayValue('item1');
    fireEvent.change(input, { target: { value: 'newKey' } });

    expect(onChange).toHaveBeenCalledWith(0, 'key', 'newKey');
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithMessages(
      <GenericTable<TestItem>
        items={items}
        columns={columns}
        onChange={onChange}
        onDelete={onDelete}
        newItem={newItem}
        setNewItem={setNewItem}
        onAdd={onAdd}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /✕/i });
    fireEvent.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith(0);
  });

  it('calls onAdd when add button is clicked', () => {
    renderWithMessages(
      <GenericTable<TestItem>
        items={items}
        columns={columns}
        onChange={onChange}
        onDelete={onDelete}
        newItem={newItem}
        setNewItem={setNewItem}
        onAdd={onAdd}
      />
    );

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    expect(onAdd).toHaveBeenCalled();
  });

  it('calls setNewItem when newItem input changes', () => {
    renderWithMessages(
      <GenericTable<TestItem>
        items={items}
        columns={columns}
        onChange={onChange}
        onDelete={onDelete}
        newItem={newItem}
        setNewItem={setNewItem}
        onAdd={onAdd}
      />
    );

    const newInput = screen.getAllByPlaceholderText('Key')[0];
    fireEvent.change(newInput, { target: { value: 'newKey' } });

    expect(setNewItem).toHaveBeenCalledWith({ ...newItem, key: 'newKey' });
  });
});
