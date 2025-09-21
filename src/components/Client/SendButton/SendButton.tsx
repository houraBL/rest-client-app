import { useAuth } from '@/hooks/useAuth/useAuth';
import { useRouter } from '@/i18n/navigation';
import { setResponse } from '@/store/clientSlice';
import { RootState } from '@/store/store';
import { makeApiCall } from '@/utils/makeApiCall';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { resolveReplaceVariables } from '@/utils/resolveReplaceVariables';

export function SendButton() {
  const t = useTranslations('Send');
  const router = useRouter();
  const dispatch = useDispatch();
  const clientState = useSelector((state: RootState) => state.client);
  const { user } = useAuth();

  const handleClick = async () => {
    const { url, headers, body, method, finalURL } =
      resolveReplaceVariables(clientState);

    router.push(finalURL, { scroll: false });

    const response = await makeApiCall({
      uid: user?.uid || '',
      url,
      headers,
      method,
      ...(body && method !== 'GET' ? { requestBody: body } : {}),
      finalURL,
    });

    dispatch(setResponse({ response }));
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className="btn btn-primary"
        disabled={clientState.url === ''}
      >
        {t('send')}
      </button>
    </div>
  );
}
