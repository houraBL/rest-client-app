import { describe, it, expect } from 'vitest';
import { getFinalUrl } from '../getFinalUrl';
import { encodeBase64 } from '../encodeBase64';
import { ClientState } from '@/store/clientSlice';

function makeState(partial: Partial<ClientState>): ClientState {
  return {
    method: 'GET',
    url: '',
    body: '',
    bodyHeader: '',
    headers: {},
    variables: {},
    response: { status: 0 },
    ...partial,
  };
}

describe('getFinalUrl', () => {
  it('returns path with method only when no url, body, or headers', () => {
    const state = makeState({ method: 'POST' });
    expect(getFinalUrl(state)).toBe('/client/POST');
  });

  it('includes encoded url when provided', () => {
    const state = makeState({ url: 'https://example.com' });
    const expectedUrl = encodeBase64('https://example.com');
    expect(getFinalUrl(state)).toBe(`/client/GET/${expectedUrl}`);
  });

  it('includes encoded url and body when both provided', () => {
    const state = makeState({
      url: 'https://example.com',
      body: '{"foo":"bar"}',
    });
    const expectedUrl = encodeBase64('https://example.com');
    const expectedBody = encodeBase64('{"foo":"bar"}');
    expect(getFinalUrl(state)).toBe(
      `/client/GET/${expectedUrl}/${expectedBody}`
    );
  });

  it('includes query string when headers are present', () => {
    const state = makeState({
      headers: { 'Content-Type': 'application/json', Accept: 'text/plain' },
    });
    const result = getFinalUrl(state);
    expect(result).toMatch(/^\/client\/GET\?/);
    expect(result).toContain('Content-Type=application%2Fjson');
    expect(result).toContain('Accept=text%2Fplain');
  });

  it('combines url, body, and headers', () => {
    const state = makeState({
      method: 'PUT',
      url: 'https://api.com',
      body: '{"id":1}',
      headers: { Authorization: 'Bearer 123' },
    });

    const expectedUrl = encodeBase64('https://api.com');
    const expectedBody = encodeBase64('{"id":1}');
    const result = getFinalUrl(state);

    expect(result).toBe(
      `/client/PUT/${expectedUrl}/${expectedBody}?Authorization=Bearer%20123`
    );
  });
});
