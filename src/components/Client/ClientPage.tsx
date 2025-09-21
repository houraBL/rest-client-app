'use client';

import { MethodSelector } from './MethodSelector/MethodSelector';
import { UrlInput } from './UrlInput/UrlInput';
import { BodyEditor } from './BodyEditor/BodyEditor';
import { CodeGenerator } from './CodeGenerator/CodeGenerator';
import { SendButton } from './SendButton/SendButton';
import ResponseViewer from './ResponseViewer/ResponseViewer';
import Headers from './Headers/Headers';
import { useParsedUrl } from '@/hooks/useParseUrl/useParseUrl';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  setBody,
  setBodyHeader,
  setHeaders,
  setMethod,
  setUrl,
} from '@/store/clientSlice';
import { RootState } from '@/store/store';

export function ClientPage() {
  const { method, url, body, headers } = useParsedUrl();
  const storedHeaders = useSelector((state: RootState) => state.client.headers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMethod(method));
    if (url) dispatch(setUrl(url));
    if (body) dispatch(setBody(body));

    if (
      Object.keys(headers).length > 0 &&
      Object.keys(storedHeaders).length === 0
    ) {
      if (headers['Content-Type']) {
        const CTheader = headers['Content-Type'];
        if (
          CTheader === 'application/json' ||
          CTheader === 'application/xml' ||
          CTheader === 'text/plain'
        ) {
          dispatch(setBodyHeader({ value: CTheader }));
        }
      }
      const { ['Content-Type']: _, ...restHeaders } = headers;
      if (Object.keys(restHeaders).length > 0) {
        dispatch(setHeaders(restHeaders));
      }
    }
  }, []);

  console.log(method, 'url', url, 'body', body, headers);

  return (
    <div className="flex w-full max-w-5xl flex-col gap-5 py-10 px-2 sm:px-10 mx-1 sm:mx-10">
      <div className="flex gap-2 items-center">
        <MethodSelector />
        <UrlInput />
        <SendButton />
      </div>
      <Headers />
      <CodeGenerator />
      <BodyEditor />
      <ResponseViewer />
    </div>
  );
}
