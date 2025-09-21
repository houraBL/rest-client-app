import { Timestamp } from 'firebase/firestore';
import z from 'zod';

export const historyEntry = z.object({
  uid: z.string(),
  requestDuration: z.number(),
  responseStatusCode: z.number(),
  requestMethod: z.string(),
  requestSize: z.number(),
  responseSize: z.number(),
  endpointUrl: z.string(),
  errorDetails: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.string().optional()
  ),
  requestTimestamp: z.instanceof(Timestamp),
});
