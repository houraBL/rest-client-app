import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations();
  return (
    <div className="font-sans grid items-center justify-items-center p-8 pb-20 gap-4 sm:p-20">
      <h1>{t('Test.home')}</h1>
      <Link href="/history">{t('Test.history')}</Link>
      <Link href="/about">{t('Test.about')}</Link>
    </div>
  );
}
