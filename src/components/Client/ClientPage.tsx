'use client';

import { MethodSelector } from './MethodSelector/MethodSelector';
import { UrlInput } from './UrlInput/UrlInput';
import { BodyEditor } from './BodyEditor/BodyEditor';
import { CodeGenerator } from './CodeGenerator/CodeGenerator';
import { SendButton } from './SendButton/SendButton';
import ResponseViewer from './ResponseViewer/ResponseViewer';
import Headers from './Headers/Headers';
import { useVariableLocalStorage } from '@/hooks/useVariableLocalStorage/useVariableLocalStorage';
import { VariableType } from '@/hooks/useVariables/useVariables';

export function ClientPage() {
  const variables = useVariableLocalStorage<VariableType[]>('variables', []);
  //setVariables(variables)
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
