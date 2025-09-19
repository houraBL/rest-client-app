'use client';

export type ResponseViewerProps = {
  status: number;
  data?: string;
  error?: string;
  loading?: boolean;
};

import { Loader } from '@/components/Loader/Loader';
import useTheme from '@/hooks/useTheme';
import Editor from '@monaco-editor/react';

export default function ResponseViewer({
  response,
}: {
  response: ResponseViewerProps;
}) {
  const { theme } = useTheme();
  const { status, data, error, loading } = response;
  if (loading) return <Loader />;

  const responseValue = error ? error : (data ?? '');

  return (
    <div className="w-full">
      <div
        className={`m-2 p-4 badge badge-soft ${status >= 200 && status < 300 ? 'badge-success' : status >= 400 ? 'badge-error' : 'badge-warning'}`}
      >
        Response Status: {status}
      </div>
      <Editor
        theme={theme === 'light' ? 'light' : 'vs-dark'}
        height="25vh"
        defaultLanguage="json"
        value={responseValue}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          wordWrap: 'on',
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
