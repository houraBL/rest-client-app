import { describe, expect, it, vi } from 'vitest';
import ResponseViewer from './ResponseViewer';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

vi.mock('@/components/Loader/Loader', () => ({
  Loader: () => <div>Loading</div>,
}));

describe('ResponseViewer', () => {
  it('renders loader when loading', () => {
    render(<ResponseViewer response={{ status: 200, loading: true }} />);
    expect(screen.getByText('Loading')).toBeDefined();
  });

  it('renders HTTP success status correctly', () => {
    render(<ResponseViewer response={{ status: 201, data: '{"ok":true}' }} />);
    expect(screen.getByText('Response Status: 201')).toBeDefined();
    const statusDiv = screen.getByText(/Response Status:/);
    expect(statusDiv).toHaveClass('bg-green-100');
    expect(statusDiv).toHaveClass('text-green-700');
  });

  it('renders HTTP error status correctly', () => {
    render(<ResponseViewer response={{ status: 400, data: '{"ok":true}' }} />);
    expect(screen.getByText('Response Status: 400')).toBeDefined();
    const statusDiv = screen.getByText(/Response Status:/);
    expect(statusDiv).toHaveClass('bg-red-100');
    expect(statusDiv).toHaveClass('text-red-700');
  });

  it('renders empty editor if no data or error', () => {
    render(<ResponseViewer response={{ status: 204 }} />);
    expect(screen.getByText(/Response Status: 204/)).toBeDefined();
  });
});
