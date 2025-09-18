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
import Headers from './Headers/Headers';

export function ClientPage() {
  // const [headers, setHeaders] = useState<Headers[]>([]);
  const [response, setResponse] = useState<ResponseViewerProps>({});

  return (
    <div className=" w-screen text-center p-20">
      <div className="flex flex-col gap-5 border-1 p-10">
        <div className="flex gap-2 items-center">
          <MethodSelector />
          <UrlInput />
          <SendButton />
        </div>
        <Headers />
        <CodeGenerator />
        <BodyEditor />
        <ResponseViewer status={response.status} body={response.body} />
      </div>
    </div>
  );
}
