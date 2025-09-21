export function decodeBase64<T = unknown>(encoded: string): T {
  if (!encoded) return '' as T;
  try {
    const json = atob(encoded);
    return JSON.parse(json) as T;
  } catch {
    return '' as T;
  }
}
