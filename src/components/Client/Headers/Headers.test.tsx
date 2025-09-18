import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Headers from './Headers';
import { HeadersType } from '@/hooks/useHeaders/useHeaders';
import userEvent from '@testing-library/user-event';

vi.mock('next-intl', async (importActual) => {
  const actual = await importActual<typeof import('next-intl')>();
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

const addHeader = vi.fn();
const updateHeader = vi.fn();
const deleteHeader = vi.fn();
const setNewHeader = vi.fn();

vi.mock('@/hooks/useHeaders/useHeaders', () => ({
  default: () => ({
    headers: [
      { name: 'Content-Type', initialValue: 'application/json' },
      { name: 'Authorization', initialValue: 'Bearer token' },
    ] as HeadersType[],
    newHeader: { name: '', initialValue: '' },
    setNewHeader,
    addHeader,
    updateHeader,
    deleteHeader,
  }),
}));

describe('Headers', () => {
  it('renders title and table headers', () => {
    render(<Headers />);
    expect(screen.getByText('headersTitle')).toBeInTheDocument();
    expect(screen.getByText('header')).toBeInTheDocument();
    expect(screen.getByText('value')).toBeInTheDocument();
  });

  it('renders rows from useHeaders', () => {
    render(<Headers />);
    expect(screen.getByDisplayValue('Content-Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('application/json')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Authorization')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bearer token')).toBeInTheDocument();
  });

  it('calls updateHeader when input changes', () => {
    render(<Headers />);
    const input = screen.getByDisplayValue('application/json');
    fireEvent.change(input, { target: { value: 'text/html' } });
    expect(updateHeader).toHaveBeenCalledWith(0, 'initialValue', 'text/html');
  });

  it('calls deleteHeader when delete button clicked', () => {
    render(<Headers />);
    const deleteButtons = screen.getAllByRole('button', { name: '✕' });
    fireEvent.click(deleteButtons[0]);
    expect(deleteHeader).toHaveBeenCalledWith(0);
  });

  it('calls addHeader when Add clicked', async () => {
    render(<Headers />);
    const addBtn = screen.getByRole('button', { name: 'add' });
    await userEvent.click(addBtn);
    expect(addHeader).toHaveBeenCalled();
  });
});
