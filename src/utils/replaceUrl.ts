'use client';

import { useRouter } from 'next/navigation';

export function replaceUrl(
  router: ReturnType<typeof useRouter>,
  method: string,
  url?: string,
  body?: string
) {
  let path = `/client/${method}`;

  if (url) {
    path += `/${url}`;
  }

  if (body) {
    path += `/${body}`;
  }

  router.push(path);
}
