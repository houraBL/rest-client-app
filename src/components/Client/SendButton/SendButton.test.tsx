import '@testing-library/jest-dom';

import { describe, beforeEach, it, expect, vi, Mock } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SendButton } from './SendButton';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { makeApiCall } from '@/utils/makeApiCall';
import { getFinalUrl } from '@/utils/getFinalUrl';
import { setResponse } from '@/store/clientSlice';
import type { RootState } from '@/store/store';

vi.mock('next-intl', async (importActual) => {
  const actual = await importActual<typeof import('next-intl')>();
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

vi.mock('@/lib/firebase/firebase', () => ({
  auth: {
    currentUser: { uid: 'user-123' },
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  },
  db: {},
}));

vi.mock('@/hooks/useAuth/useAuth');
vi.mock('@/i18n/navigation');
vi.mock('@/utils/makeApiCall');
vi.mock('@/utils/getFinalUrl');
vi.mock('react-redux');

describe('SendButton', () => {
  const mockDispatch = vi.fn();
  const mockPush = vi.fn();
  const mockRouter = { push: mockPush };
  const mockUser = { uid: 'user-123' };
  const mockState: RootState = {
    client: {
      url: '/test-url',
      method: 'POST',
      body: '{"test":1}',
      bodyHeader: 'application/json',
      headers: { Authorization: 'token' },
      response: { status: 0 },
    },
  } as unknown as RootState;

  beforeEach(() => {
    vi.resetAllMocks();
    (useDispatch as unknown as Mock).mockReturnValue(mockDispatch);
    (useSelector as unknown as Mock).mockImplementation((selector) =>
      selector(mockState)
    );
    (useRouter as unknown as Mock).mockReturnValue(mockRouter);
    (useAuth as unknown as Mock).mockReturnValue({ user: mockUser });
  });

  it('renders button enabled when url is present', () => {
    render(<SendButton />);
    const button = screen.getByText('send');
    expect(button).toBeEnabled();
  });

  it('disables button when URL is empty', () => {
    (useSelector as unknown as Mock).mockImplementation((selector) =>
      selector({ client: { ...mockState.client, url: '' } } as RootState)
    );

    render(<SendButton />);
    const button = screen.getByText('send');
    expect(button).toBeDisabled();
  });

  it('calls getFinalUrl, router.push, makeApiCall and dispatch on click', async () => {
    const mockResponse = { status: 200, data: 'ok' };
    (makeApiCall as unknown as Mock).mockResolvedValue(mockResponse);
    (getFinalUrl as unknown as Mock).mockReturnValue('/final-url');

    render(<SendButton />);
    const button = screen.getByText('send');
    fireEvent.click(button);

    await waitFor(() => {
      expect(getFinalUrl).toHaveBeenCalledWith({
        ...mockState.client,
        headers: {
          ...mockState.client.headers,
          'Content-Type': mockState.client.bodyHeader,
        },
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/final-url', {
        scroll: false,
      });
      expect(makeApiCall).toHaveBeenCalledWith({
        uid: mockUser.uid,
        url: mockState.client.url,
        headers: {
          ...mockState.client.headers,
          'Content-Type': mockState.client.bodyHeader,
        },
        method: mockState.client.method,
        requestBody: mockState.client.body,
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        setResponse({ response: mockResponse })
      );
    });
  });

  it('does not send requestBody if method is GET', async () => {
    (useSelector as unknown as Mock).mockImplementation((selector) =>
      selector({ client: { ...mockState.client, method: 'GET' } } as RootState)
    );
    (makeApiCall as unknown as Mock).mockResolvedValue({
      status: 200,
      data: 'ok',
    });
    (getFinalUrl as unknown as Mock).mockReturnValue('/final-url');

    render(<SendButton />);
    const button = screen.getByText('send');
    fireEvent.click(button);

    await waitFor(() => {
      expect(makeApiCall).toHaveBeenCalledWith({
        uid: mockUser.uid,
        url: mockState.client.url,
        headers: {
          ...mockState.client.headers,
          'Content-Type': mockState.client.bodyHeader,
        },
        method: 'GET',
      });
    });
  });
});
