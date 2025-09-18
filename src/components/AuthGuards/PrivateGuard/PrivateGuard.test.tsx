import { useAuth } from '@/hooks/useAuth/useAuth';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import PrivateGuard from './PrivateGuard';
import '@testing-library/jest-dom';

vi.mock('@/hooks/useAuth/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({ user: null, loading: false }),
}));

const pushMock = vi.fn();

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  ),
  useRouter: () => ({
    push: pushMock,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('Private Guard', () => {
  it('renders loader when loading', () => {
    (useAuth as Mock).mockReturnValueOnce({ user: null, loading: true });
    render(
      <PrivateGuard>
        <div>Private Content</div>
      </PrivateGuard>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders children when is present', () => {
    (useAuth as Mock).mockReturnValue({ user: true, loading: false });

    render(
      <PrivateGuard>
        <div>Private Content</div>
      </PrivateGuard>
    );

    expect(screen.getByText('Private Content')).toBeInTheDocument();
  });

  it('redirects when no user and not loading', async () => {
    (useAuth as Mock).mockReturnValue({ user: null, loading: false });

    render(
      <PrivateGuard>
        <div>Private Content</div>
      </PrivateGuard>
    );

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });
});
