import { describe, expect, it, vi } from 'vitest';
import ResponseViewer from './ResponseViewer';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';

vi.mock('@/components/Loader/Loader', () => ({
  Loader: () => <div>Loading</div>,
}));

const renderWithTheme = (children: ReactNode) => {
  render(<ThemeProvider>{children}</ThemeProvider>);
};

describe('ResponseViewer', () => {
  it('renders loader when loading', () => {
    renderWithTheme(
      <ResponseViewer response={{ status: 200, loading: true }} />
    );
    expect(screen.getByText('Loading')).toBeDefined();
  });

  it('renders HTTP success status correctly', () => {
    renderWithTheme(
      <ResponseViewer response={{ status: 201, data: '{"ok":true}' }} />
    );
    expect(screen.getByText('Response Status: 201')).toBeDefined();
    const statusDiv = screen.getByText(/Response Status:/);
    expect(statusDiv).toHaveClass('badge-success');
  });

  it('renders HTTP error status correctly', () => {
    renderWithTheme(
      <ResponseViewer response={{ status: 400, data: '{"ok":true}' }} />
    );
    expect(screen.getByText('Response Status: 400')).toBeDefined();
    const statusDiv = screen.getByText(/Response Status:/);
    expect(statusDiv).toHaveClass('badge-error');
  });

  it('renders empty editor if no data or error, and yellow status', () => {
    renderWithTheme(<ResponseViewer response={{ status: 0 }} />);
    expect(screen.getByText(/Response Status: 0/)).toBeDefined();
    const statusDiv = screen.getByText(/Response Status:/);
    expect(statusDiv).toHaveClass('badge-warning');
  });
});
