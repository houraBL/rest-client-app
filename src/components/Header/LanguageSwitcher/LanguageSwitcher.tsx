import { useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const toggleLang = () => {
    const newLocale = locale === 'en' ? 'ru' : 'en';
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <label className="flex cursor-pointer gap-1 my-auto px-1 sm:px-2">
      <span className="label-text">EN</span>
      <input
        type="checkbox"
        checked={locale === 'ru'}
        onChange={toggleLang}
        className="toggle"
      />
      <span className="label-text">RU</span>
    </label>
  );
}
