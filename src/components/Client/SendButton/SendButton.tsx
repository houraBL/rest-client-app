import { useAuth } from '@/hooks/useAuth/useAuth';
import { useRouter } from '@/i18n/navigation';
import { setResponse } from '@/store/clientSlice';
import { RootState } from '@/store/store';
import { makeApiCall } from '@/utils/makeApiCall';
import { getFinalUrl } from '@/utils/getFinalUrl';
import { useDispatch, useSelector } from 'react-redux';

export function SendButton() {
  const router = useRouter();
  const dispatch = useDispatch();
  const clientState = useSelector((state: RootState) => state.client);
  const method = useSelector((state: RootState) => state.client.method);
  const body = useSelector((state: RootState) => state.client.body);
  const { user } = useAuth();

  const handleClick = async () => {
    const headers = {
      ...clientState.headers,
      'Content-Type': clientState.bodyHeader,
    };

    const path = getFinalUrl({ ...clientState, headers });
    router.push(path, { scroll: false });

    const response = await makeApiCall({
      uid: user?.uid || '',
      url: clientState.url,
      headers: headers,
      method: clientState.method,
      ...(body && method !== 'GET' ? { requestBody: body } : {}),
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
        Send
      </button>
    </div>
  );
}
