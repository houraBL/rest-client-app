import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HistoryTable from './HistoryTable';
import { FormFields } from '../History';
import { columns, invalidEntry, validEntry } from './historyMockData';

vi.mock('./HistoryRow/HistoryRow.tsx', () => ({
  default: ({
    columns,
    data,
    entryId,
  }: {
    columns: { key: keyof FormFields; label: string }[];
    data: FormFields;
    entryId: string;
  }) => (
    <tr data-testid="mock-row">
      <td>{entryId}</td>
      {columns.map((c) => (
        <td key={c.key}>{String(data[c.key] ?? '')}</td>
      ))}
    </tr>
  ),
}));

describe('HistoryTable', () => {
  it('renders column headers except "uid"', () => {
    render(<HistoryTable columns={columns} history={[validEntry]} />);

    expect(screen.queryByText('User')).not.toBeInTheDocument();

    expect(screen.getByText('Method')).toBeInTheDocument();
    expect(screen.getByText('Endpoint')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders a row for valid entries', () => {
    render(<HistoryTable columns={columns} history={[validEntry]} />);

    const rows = screen.getAllByTestId('mock-row');
    expect(rows).toHaveLength(1);
    expect(screen.getByText('entry-1')).toBeInTheDocument();
  });

  it('skips invalid entries', () => {
    render(<HistoryTable columns={columns} history={[invalidEntry]} />);

    expect(screen.queryByTestId('mock-row')).not.toBeInTheDocument();
  });

  it('renders multiple rows for multiple valid entries', () => {
    render(
      <HistoryTable columns={columns} history={[validEntry, validEntry]} />
    );

    const rows = screen.getAllByTestId('mock-row');
    expect(rows).toHaveLength(2);
  });
});
