import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  DocumentData,
} from 'firebase/firestore';

interface requestsHistoryEntry {
  id: string;
  request: DocumentData;
}

export async function requestHistory(): Promise<{
  error: string | null;
  history: requestsHistoryEntry[];
}> {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (!user) {
    return { error: 'User is not authorized', history: [] };
  }

  const userRequestsRef = collection(
    db,
    'userActivities',
    user.uid,
    'requests'
  );

  const q = query(userRequestsRef, orderBy('requestTimestamp', 'desc'));
  try {
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
