import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setUrl } from '@/store/clientSlice';
import { useTranslations } from 'next-intl';

export function UrlInput() {
  const t = useTranslations('Input');
  const dispatch = useDispatch();
  const url = useSelector((state: RootState) => state.client.url);
  return (
    <input
      type="text"
      className="flex-7 input input-bordered w-full"
      onChange={(e) => dispatch(setUrl(e.target.value))}
      value={url}
      placeholder={t('enterUrl')}
    />
  );
}
