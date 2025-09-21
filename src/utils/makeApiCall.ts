import { logUserRequest } from '@/lib/firebase/logUserRequest';
import { AuthUser } from '@/providers/AuthContext';

export async function makeApiCall({
  uid,
  url,
  method,
  requestBody,
  headers = {},
}: {
  uid: string;
  url: string;
  method: string;
  requestBody?: string;
  headers?: Record<string, string>;
}): Promise<{
  status: number;
  data?: unknown;
  error?: string;
}> {
  const startTime = Date.now();
  let response: Response | undefined;
  let status = 0;
  let responseSize = 0;
  let errorDetails: string | null = null;
  let requestSize = 0;
  let duration = 0;
  let responseText = '';

  try {
    response = await fetch(url, {
      method,
      headers: headers,
      body: requestBody,
    });

    status = response.status;
    responseText = await response.text();
    responseSize = new TextEncoder().encode(responseText).length;

    if (!response.ok) {
      errorDetails = `HTTP Error: ${status} - ${responseText.substring(0, 100)}`;
    }
  } catch (error) {
    if (error instanceof Error) {
      errorDetails = `Network/Fetch Error: ${error.message}`;
    } else {
      errorDetails = 'Unknown error';
    }
  } finally {
    const endTime = Date.now();
    duration = endTime - startTime;

    requestSize = requestBody
      ? new TextEncoder().encode(JSON.stringify(requestBody)).length
      : 0;
    await logUserRequest({
      uid: uid,
      requestDuration: duration,
      responseStatusCode: status,
      requestMethod: method,
      requestSize: requestSize,
      responseSize: responseSize,
      endpointUrl: url,
      errorDetails: errorDetails,
    });
  }

  let parsedData: unknown = null;
  try {
    parsedData = responseText ? JSON.parse(responseText) : null;
  } catch {
    parsedData = responseText;
  }

  return {
    status,
    data: parsedData,
    error: errorDetails ?? undefined,
  };
}
