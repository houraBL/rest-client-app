import {
  collection,
  query,
  orderBy,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import { cookies } from 'next/headers';
import { adminAuth } from './firebaseAdmin';
import { db } from './firebase';

interface requestsHistoryEntry {
  id: string;
  request: DocumentData;
}

export async function requestHistory(): Promise<{
  error: string | null;
  history: requestsHistoryEntry[];
}> {
  try {
    const token = (await cookies()).get('auth_token')?.value;
    if (!token) {
      return { error: 'User is not authorized', history: [] };
    }

    const decoded = await adminAuth.verifySessionCookie(token);

    const userRequestsRef = collection(
      db,
      'userActivities',
      decoded.uid,
      'requests'
    );

    const q = query(userRequestsRef, orderBy('requestTimestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const requests: requestsHistoryEntry[] = [];
    querySnapshot.forEach((doc) =>
      requests.push({ id: doc.id, request: doc.data() })
    );
    return { error: null, history: requests };
  } catch (error) {
    if (error instanceof Error) return { error: error.message, history: [] };
    else return { error: 'Unknown error occurred', history: [] };
  }
}
