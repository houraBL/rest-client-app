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
      console.log('added to firebase: ', logData.uid);
    } catch (error) {
      console.log('error while adding to firebase for user', logData.uid);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error');
    }
  } else {
    throw new Error('User is not signed in');
  }
};
