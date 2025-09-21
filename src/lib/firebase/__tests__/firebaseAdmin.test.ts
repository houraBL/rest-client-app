import { describe, it, expect, vi } from 'vitest';

import * as admin from 'firebase-admin';
import { adminAuth } from '../firebaseAdmin';

vi.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: vi.fn(),
  credential: {
    cert: vi.fn(),
  },
  auth: vi.fn(() => 'mocked-admin-auth'),
}));

describe('firebase-admin setup', () => {
  it('initializes firebase-admin if no apps exist', () => {
    expect(admin.credential.cert).toHaveBeenCalledWith({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    });

    expect(admin.initializeApp).toHaveBeenCalled();
  });

  it('exports adminAuth correctly', () => {
    expect(admin.auth).toHaveBeenCalled();
    expect(adminAuth).toBe('mocked-admin-auth');
  });
});
