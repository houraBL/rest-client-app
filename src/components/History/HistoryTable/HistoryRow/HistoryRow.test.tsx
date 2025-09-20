import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormFields } from '../../History';
import HistoryRow from './HistoryRow';
import { columns, mockH } from '../historyMockData';

vi.mock('../HistoryCell/HistoryCell', () => ({
  default: ({
    colKey,
    data,
  }: {
    colKey: keyof FormFields;
    data: FormFields;
  }) => (
    <td data-testid={`mock-cell-${colKey}`}>{String(data[colKey] ?? '')}</td>
  ),
}));

describe('HistoryRow', () => {
  it('renders a row with the correct number of cells', () => {
    render(
      <table>
        <tbody>
          <HistoryRow entryId="row-1" data={mockH} columns={columns} />
        </tbody>
      </table>
    );

    const row = screen.getByRole('row');
    const cells = within(row).getAllByRole('cell');

    expect(cells).toHaveLength(columns.length);
  });

  it('renders HistoryCell for each column key', () => {
    render(
      <table>
        <tbody>
          <HistoryRow entryId="row-1" data={mockH} columns={columns} />
        </tbody>
      </table>
    );

    columns.forEach((col) => {
      expect(screen.getByTestId(`mock-cell-${col.key}`)).toBeInTheDocument();
    });
  });

  it('passes data values into mocked cells', () => {
    render(
      <table>
        <tbody>
          <HistoryRow entryId="row-1" data={mockH} columns={columns} />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('mock-cell-requestMethod')).toHaveTextContent(
      'PUT'
    );
    expect(
      screen.getByTestId('mock-cell-responseStatusCode')
    ).toHaveTextContent('200');
  });
});
