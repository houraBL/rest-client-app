import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';

export interface RequestLogEntry {
  requestDuration: number;
  responseStatusCode: number;
  requestMethod: string;
  requestSize: number;
  responseSize: number;
  endpointUrl: string;
  errorDetails?: string | null;
}

export const logUserRequest = async (logData: RequestLogEntry) => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (user) {
    const userRequestsCollectionRef = collection(
      db,
      'userActivities',
      user.uid,
      'requests'
    );

    try {
      await addDoc(userRequestsCollectionRef, {
        ...logData,
        requestTimestamp: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error');
    }
  } else {
    throw new Error('User is not signed in');
  }
};
