'use client';

import { useState } from 'react';
import { MethodSelector } from './MethodSelector/MethodSelector';
import { UrlInput } from './UrlInput/UrlInput';
import { BodyEditor } from './BodyEditor/BodyEditor';
import { CodeGenerator } from './CodeGenerator/CodeGenerator';
import { SendButton } from './SendButton/SendButton';
import ResponseViewer, {
  ResponseViewerProps,
} from './ResponseViewer/ResponseViewer';
import Headers from './Headers/Headers';

export function ClientPage() {
  // const [headers, setHeaders] = useState<Headers[]>([]);
  const [response, setResponse] = useState<ResponseViewerProps>({ status: 0 });

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
        <ResponseViewer response={response} />
      </div>
    </div>
  );
}
