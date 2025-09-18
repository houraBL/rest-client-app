import { describe, expect, it, Mock, vi } from 'vitest';
import { addDoc, collection } from 'firebase/firestore';
import { logUserRequest, RequestLogEntry } from '../logUserRequest';
import { getAuth } from 'firebase/auth';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: { uid: '123' },
  })),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => 'mocked-Firestore'),
  collection: vi.fn(() => 'mocked-collection'),
  addDoc: vi.fn(() => 'mocked-Doc'),
  Timestamp: {
    now: vi.fn(() => 'now'),
  },
}));

const mockLogRequest: RequestLogEntry = {
  requestDuration: 123,
  responseStatusCode: 200,
  requestMethod: 'PUT',
  requestSize: 1234,
  responseSize: 69420,
  endpointUrl: 'url.com',
  errorDetails: 'some-error',
};

describe('log user request', () => {
  it('logs user request', async () => {
    await logUserRequest(mockLogRequest);
    expect(collection).toBeCalledWith(
      'mocked-Firestore',
      'userActivities',
      '123',
      'requests'
    );
    expect(addDoc).toBeCalledWith('mocked-collection', {
      ...mockLogRequest,
      requestTimestamp: 'now',
    });
  });

  it('throws error if user is not authorized', async () => {
    (getAuth as Mock).mockResolvedValueOnce({
      currentUser: null,
    });
    await expect(logUserRequest(mockLogRequest)).rejects.toThrow(
      'User is not signed in'
    );
  });

  it('catches error if addDoc throws', async () => {
    (addDoc as Mock).mockRejectedValueOnce(new Error('test-error'));
    await expect(logUserRequest(mockLogRequest)).rejects.toThrow('test-error');
  });

  it('catches unknown if addDoc throws unknown', async () => {
    (addDoc as Mock).mockRejectedValueOnce('string');
    await expect(logUserRequest(mockLogRequest)).rejects.toThrow(
      'Unknown error'
    );
  });
});
