import { useAuth } from '@/hooks/useAuth/useAuth';
import { useRouter } from '@/i18n/navigation';
import { setResponse } from '@/store/clientSlice';
import { RootState } from '@/store/store';
import { makeApiCall } from '@/utils/makeApiCall';
import { parseUrl } from '@/utils/parseUrl';
import { replaceUrl } from '@/utils/replaceUrl';
import { useDispatch, useSelector } from 'react-redux';

export function SendButton() {
  const router = useRouter();
  const dispatch = useDispatch();
  const clientState = useSelector((state: RootState) => state.client);
  const method = useSelector((state: RootState) => state.client.method);
  const body = useSelector((state: RootState) => state.client.body);
  const { user } = useAuth();

  const handleClick = async () => {
    parseUrl(
      'http://localhost:3000/client/GET/Imh0dHBzOi8vcmlja2FuZG1vcnR5YXBpLmNvbS9hcGkvY2hhcmFjdGVyIg==?Content-Type=application%2Fjson'
    );

    const headers = {
      ...clientState.headers,
      'Content-Type': clientState.bodyHeader,
    };

    replaceUrl(router, { ...clientState, headers });

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
