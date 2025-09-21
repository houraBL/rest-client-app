'use client';

import { decodeBase64 } from '@/utils/decodeBase64';
import { useParams } from 'next/navigation';

export function useParsedUrl() {
  const params = useParams();
  const slug = params.slug as string[] | undefined;

  if (!slug) {
    return { method: 'GET', url: '', body: '', headers: {} };
  }

  const method = slug[0] || 'GET';
  const url = decodeBase64<string>(decodeURIComponent(slug[1] || ''));
  const body = decodeBase64<string>(decodeURIComponent(slug[2] || ''));

  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, key) => {
      headers[key] = value;
    });
  }

  return { method, url: String(url), body: String(body), headers };
}
