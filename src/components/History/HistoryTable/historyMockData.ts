import { Timestamp } from 'firebase/firestore';
import { FormFields } from '../History';

export const columns: { key: keyof FormFields; label: string }[] = [
  { key: 'requestTimestamp', label: 'Timestamp' },
  { key: 'requestMethod', label: 'Method' },
  { key: 'endpointUrl', label: 'Endpoint' },
  { key: 'responseStatusCode', label: 'Status' },
];

const DATE_IN_SECONDS = 1694978130;
const MS = 1000;

export const mockH: FormFields = {
  uid: 'user',
  requestDuration: 123,
  responseStatusCode: 200,
  requestMethod: 'PUT',
  requestSize: 1234,
  responseSize: 69420,
  endpointUrl: 'url.com',
  errorDetails: '',
  requestTimestamp: { seconds: DATE_IN_SECONDS } as Timestamp,
};

export const validEntry = {
  id: 'entry-1',
  request: {
    ...mockH,
    requestTimestamp: Timestamp.fromMillis(DATE_IN_SECONDS * MS),
  },
};

export const invalidEntry = {
  id: 'entry-2',
  request: { wrong: 'value' },
};
