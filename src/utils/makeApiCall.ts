import { logUserRequest } from '@/lib/firebase/logUserRequest';

type SupportedLanguages = 'json' | 'xml' | 'plaintext';

function getContentType(language: SupportedLanguages): string {
  switch (language) {
    case 'json':
      return 'application/json';
    case 'xml':
      return 'application/xml';
    case 'plaintext':
    default:
      return 'text/plain';
  }
}

export async function makeApiCall({
  url,
  method,
  requestBody,
  headers = {},
  bodyHeader = 'json',
}: {
  url: string;
  method: string;
  requestBody?: string;
  headers?: Record<string, string>;
  bodyHeader?: SupportedLanguages;
}): Promise<{
  status: number;
  data?: string;
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
      headers: {
        ...headers,
        'Content-Type': getContentType(bodyHeader),
      },
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
      requestDuration: duration,
      responseStatusCode: status,
      requestMethod: method,
      requestSize: requestSize,
      responseSize: responseSize,
      endpointUrl: url,
      errorDetails: errorDetails,
    });
  }

  return {
    status,
    data: JSON.parse(responseText),
    error: errorDetails ?? undefined,
  };
}
