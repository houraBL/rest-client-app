export function encodeBase64<T>(data: T): string {
  const json = JSON.stringify(data);
  return btoa(json);
}
