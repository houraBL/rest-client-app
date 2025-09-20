import { decodeBase64 } from './decodeBase64';

type ParsedRequest = {
  method: string;
  url: string;
  body?: unknown;
  headers: Record<string, string>;
};

export function parseUrl(inputUrl: string): ParsedRequest {
  const parsed = new URL(inputUrl);
  const parts = parsed.pathname.split('/').filter(Boolean);
  const [client, method, encodedUrl, encodedBody] = parts;

  if (!method || !encodedUrl) {
    throw new Error('Invalid URL format');
  }

  const decodedUrl = decodeURIComponent(decodeBase64(encodedUrl));

  let body: unknown = undefined;
  if (encodedBody) {
    try {
      body = JSON.parse(decodeBase64(encodedBody));
    } catch {
      body = decodeBase64(encodedBody);
    }
  }

  const headers: Record<string, string> = {};
  parsed.searchParams.forEach((value, key) => {
    headers[key] = decodeURIComponent(value);
  });
  console.log(method, decodedUrl, body, headers);

  return {
    method,
    url: decodedUrl,
    body,
    headers,
  };
}
