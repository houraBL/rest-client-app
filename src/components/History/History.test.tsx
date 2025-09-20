import { describe, it, expect, vi, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import History from './History';
import { requestHistory } from '@/lib/firebase/requestHistory';
import { validEntry } from './HistoryTable/historyMockData';

vi.mock('@/lib/firebase/requestHistory', () => ({
  requestHistory: vi.fn(),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  ),
}));

vi.mock('./HistoryTable/HistoryTable', () => ({
  default: ({ history }: { history: { id: string; request: unknown }[] }) => (
    <table data-testid="mock-table">
      <tbody>
        {history.map((entry) => (
          <tr key={entry.id}>
            <td>{entry.id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

describe('History', () => {
  it('renders error message if request fails', async () => {
    (requestHistory as Mock).mockResolvedValue({
      error: 'Something went wrong',
      history: [],
    });

    render(await History());

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders empty state when no history', async () => {
    (requestHistory as Mock).mockResolvedValue({ error: null, history: [] });

    render(await History());

    expect(screen.getByText('emptyHistory')).toBeInTheDocument();
    expect(screen.getByTestId('mock-link')).toHaveAttribute('href', '/client');
  });

  it('renders HistoryTable when there is history', async () => {
    (requestHistory as Mock).mockResolvedValue({
      error: null,
      history: [validEntry],
    });

    render(await History());

    expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    expect(screen.getByText('entry-1')).toBeInTheDocument();
  });
});
