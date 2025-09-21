import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HistoryCell from './HistoryCell';
import { encodeBase64 } from '@/utils/encodeBase64';
import { mockH } from '../historyMockData';

const pushMock = vi.fn();
vi.mock('next/navigation', async (importActual) => {
  const actual = await importActual<typeof import('next/navigation')>();
  return {
    ...actual,
    useRouter: () => ({
      push: pushMock,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }),
  };
});

vi.mock('next-intl', async (importActual) => {
  const actual = await importActual<typeof import('next-intl')>();
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  ),
}));

describe('History Cell', () => {
  it('renders formatted timestamp', () => {
    render(
      <table>
        <tbody>
          <tr>
            <HistoryCell colKey="requestTimestamp" data={mockH} />
          </tr>
        </tbody>
      </table>
    );
    expect(
      screen.getByText((content) => content.includes('18 Sep 2023'))
    ).toBeInTheDocument();
  });

  it('renders endpoint URL as a link with encoded href', () => {
    render(
      <table>
        <tbody>
          <tr>
            <HistoryCell colKey="endpointUrl" data={mockH} />
          </tr>
        </tbody>
      </table>
    );
    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute(
      'href',
      `/client/PUT/${encodeBase64(mockH.endpointUrl)}`
    );
    expect(link).toHaveTextContent(mockH.endpointUrl);
  });

  it('renders a normal field value', () => {
    render(
      <table>
        <tbody>
          <tr>
            <HistoryCell colKey="responseStatusCode" data={mockH} />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('renders empty string for null values', () => {
    render(
      <table>
        <tbody>
          <tr>
            <HistoryCell colKey="errorDetails" data={mockH} />
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByRole('cell')).toHaveTextContent('');
  });
});
