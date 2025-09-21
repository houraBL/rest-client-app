import { useAuth } from '@/hooks/useAuth/useAuth';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import PublicGuard from './PublicGuard';
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

describe('Public Guard', () => {
  it('renders loader when loading', () => {
    (useAuth as Mock).mockReturnValueOnce({ user: null, loading: true });
    render(
      <PublicGuard>
        <div>Public Content</div>
      </PublicGuard>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders children when no user', () => {
    (useAuth as Mock).mockReturnValue({ user: false, loading: false });

    render(
      <PublicGuard>
        <div>Public Content</div>
      </PublicGuard>
    );

    expect(screen.getByText('Public Content')).toBeInTheDocument();
  });

  it('redirects when user is present and not loading', async () => {
    (useAuth as Mock).mockReturnValue({ user: true, loading: false });

    render(
      <PublicGuard>
        <div>Public Content</div>
      </PublicGuard>
    );

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });
});
