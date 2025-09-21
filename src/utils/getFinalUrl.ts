'use client';

import { RootState } from '@/store/store';
import { encodeBase64 } from './encodeBase64';

export function getFinalUrl(state: RootState['client']) {
  let path = `/client/${state.method}`;

  if (state.url) {
    path += `/${encodeBase64(state.url)}`;
    if (state.body) {
      path += `/${encodeBase64(state.body)}`;
    }
  }

  const headersEntries = Object.entries(state.headers);

  if (headersEntries.length > 0) {
    const queryString = headersEntries
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');

    path += `?${queryString}`;
  }

  return path;
}
