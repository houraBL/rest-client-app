export function decodeBase64<T = unknown>(encoded: string): T {
  const json = atob(encoded);
  return JSON.parse(json) as T;
}
