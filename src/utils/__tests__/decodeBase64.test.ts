import { describe, it, expect } from 'vitest';
import { decodeBase64 } from '../decodeBase64';

describe('decodeBase64', () => {
  it('returns parsed object when given valid base64 encoded JSON', () => {
    const obj = { name: 'Alex', age: 25 };
    const encoded = btoa(JSON.stringify(obj));

    const result = decodeBase64<typeof obj>(encoded);

    expect(result).toEqual(obj);
  });

  it('returns string when given valid base64 encoded string', () => {
    const text = '"hello world"';
    const encoded = btoa(text);

    const result = decodeBase64<string>(encoded);

    expect(result).toBe('hello world');
  });

  it('returns empty string when input is empty', () => {
    const result = decodeBase64('');
    expect(result).toBe('');
  });

  it('returns empty string when input is invalid base64', () => {
    const result = decodeBase64('$$$not-valid-base64$$$');
    expect(result).toBe('');
  });

  it('returns empty string when base64 decodes but is not valid JSON', () => {
    const notJson = 'hello world';
    const encoded = btoa(notJson);

    const result = decodeBase64(encoded);
    expect(result).toBe('');
  });
});
