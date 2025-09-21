import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface RequestLogEntry {
  uid: string;
  requestDuration: number;
  responseStatusCode: number;
  requestMethod: string;
  requestSize: number;
  responseSize: number;
  endpointUrl: string;
  errorDetails?: string | null;
  finalURL: string;
}

export const logUserRequest = async (logData: RequestLogEntry) => {
  if (logData.uid) {
    const userRequestsCollectionRef = collection(
      db,
      'userActivities',
      logData.uid,
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
