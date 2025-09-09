'use client';

import { useState } from 'react';
import { MethodSelector } from './MethodSelector/MethodSelector';
import { UrlInput } from './UrlInput/UrlInput';
import {
  ResponseViewer,
  ResponseViewerProps,
} from './ResponseViewer/ResponseViewer';
import { BodyEditor } from './BodyEditor/BodyEditor';
import { Methods } from '@/types/methods';
import { CodeGenerator } from './CodeGenerator/CodeGenerator';
import { SendButton } from './SendButton/SendButton';

export function ClientPage() {
  const [method, setMethod] = useState(Methods.GET);
  const [url, setUrl] = useState('');
  // const [headers, setHeaders] = useState<Headers[]>([]);
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<ResponseViewerProps>({});
  const [selectedLang, setSelectedLang] = useState('');

  return (
    <div className="flex flex-col gap-5 w-screen text-center p-20">
      <div className="flex gap-2 items-center">
        <MethodSelector method={method} onChange={setMethod} />
        <UrlInput url={url} onChange={setUrl} />
        <SendButton />
      </div>
      <CodeGenerator
        url={url}
        requestBody={requestBody}
        method={method}
        lang={selectedLang}
        onLangChange={setSelectedLang}
      />
      <BodyEditor requestBody={requestBody} onChange={setRequestBody} />
      <ResponseViewer status={response.status} body={response.body} />
    </div>
  );
}
