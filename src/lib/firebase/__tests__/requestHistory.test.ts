import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { getDocs } from 'firebase/firestore';
import { requestHistory } from '../requestHistory';
import { adminAuth } from '../firebaseAdmin';

vi.mock('../firebaseAdmin.ts', () => ({
  adminAuth: {
    verifySessionCookie: vi.fn(),
  },
}));

vi.mock('../firebase.ts', () => ({
  db: 'mocked-db',
}));

const getMock = vi.fn();
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: getMock,
  }),
}));

const mockDocData = { requestMethod: 'GET', endpointUrl: '/api/test' };
vi.mock('firebase/firestore', () => {
  const forEachMock = vi.fn((callback) => {
    callback({ id: 'doc1', data: () => mockDocData });
    callback({ id: 'doc2', data: () => mockDocData });
  });

  return {
    getFirestore: vi.fn(() => 'mocked-Firestore'),
    collection: vi.fn(() => 'mocked-collection'),
    query: vi.fn((ref, ...args) => ({ ref, args })),
    orderBy: vi.fn(),
    getDocs: vi.fn(() => Promise.resolve({ forEach: forEachMock })),
  };
});

describe('get history', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMock.mockReturnValue({ value: 'good-token' });
    (adminAuth.verifySessionCookie as Mock).mockResolvedValue({ value: '123' });
  });

  it('returns history array when user is signed in', async () => {
    const result = await requestHistory();

    expect(result.error).toBeNull();
    expect(result.history).toEqual([
      { id: 'doc1', request: mockDocData },
      { id: 'doc2', request: mockDocData },
    ]);
  });
  it('returns error and empty array when user is now signed in', async () => {
    getMock.mockReturnValueOnce(null);
    const result = await requestHistory();

    expect(result.error).toEqual('User is not authorized');
    expect(result.history.length).toEqual(0);
  });
  it('returns error and empty array when error it caught', async () => {
    (getDocs as Mock).mockRejectedValueOnce(new Error('test-error'));
    const result = await requestHistory();

    expect(result.error).toEqual('test-error');
    expect(result.history.length).toEqual(0);
  });

  it('returns error and empty array when not error it caught', async () => {
    (getDocs as Mock).mockRejectedValueOnce('string');
    const result = await requestHistory();

    expect(result.error).toEqual('Unknown error occurred');
    expect(result.history.length).toEqual(0);
  });
});
