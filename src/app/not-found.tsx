'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p>{t('description')}</p>
      <Link href="/" className="text-blue-500 hover:underline">
        {t('backHome')}
      </Link>
    </div>
  );
}
