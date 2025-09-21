import { describe, it, expect } from 'vitest';
import { encodeBase64 } from '../encodeBase64';
import { decodeBase64 } from '../decodeBase64';

describe('Base64 helpers', () => {
  it('encodes and decodes an object correctly', () => {
    const obj = { foo: 'bar', count: 42 };

    const encoded = encodeBase64(obj);
    const decoded = decodeBase64<typeof obj>(encoded);

    expect(decoded).toEqual(obj);
  });

  it('encodes and decodes a string correctly', () => {
    const text = 'hello world';

    const encoded = encodeBase64(text);
    const decoded = decodeBase64<string>(encoded);

    expect(decoded).toBe(text);
  });

  it('decodeBase64 returns empty string for invalid base64', () => {
    const result = decodeBase64('###invalid###');
    expect(result).toBe('');
  });

  it('decodeBase64 returns empty string for base64 that is not JSON', () => {
    const encoded = btoa('not-json');
    const result = decodeBase64(encoded);
    expect(result).toBe('');
  });
});
