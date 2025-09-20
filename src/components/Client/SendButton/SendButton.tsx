import { useAuth } from '@/hooks/useAuth/useAuth';
import { useRouter } from '@/i18n/navigation';
import { setResponse } from '@/store/clientSlice';
import { RootState } from '@/store/store';
import { makeApiCall } from '@/utils/makeApiCall';
import { replaceUrl } from '@/utils/replaceUrl';
import { useDispatch, useSelector } from 'react-redux';

export function SendButton() {
  const router = useRouter();
  const dispatch = useDispatch();
  const clientState = useSelector((state: RootState) => state.client);
  const { user } = useAuth();

  const handleClick = async () => {
    replaceUrl(router, clientState);
    const myHeaders = {
      ...clientState.headers,
      'Content-Type': clientState.bodyHeader,
    };

    const response = await makeApiCall({
      uid: user?.uid || '',
      url: clientState.url,
      headers: myHeaders,
      method: clientState.method,
      requestBody: clientState.body,
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
