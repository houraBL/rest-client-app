'use client';

import { useRouter } from '@/i18n/navigation';
import { RootState } from '@/store/store';
import { encodeBase64 } from './encodeBase64';

export function replaceUrl(
  router: ReturnType<typeof useRouter>,
  state: RootState['client']
) {
  let path = `/client/${state.method}`;

  if (state.url) {
    path += `/${encodeBase64(state.url)}`;
  }

  if (state.body) {
    path += `/${encodeBase64(state.body)}`;
  }

  router.push(path);
}
