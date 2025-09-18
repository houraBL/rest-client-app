'use client';

export type ResponseViewerProps = {
  status: number;
  data?: string;
  error?: string;
  loading?: boolean;
};

import { Loader } from '@/components/Loader/Loader';
import Editor from '@monaco-editor/react';

export default function ResponseViewer({
  response,
}: {
  response: ResponseViewerProps;
}) {
  const { status, data, error, loading } = response;
  if (loading) return <Loader />;

  const responseValue = error ? error : (data ?? '');

  return (
    <div className="w-full">
      <div
        className={`font-bold mb-5 ml-5 p-2 rounded ${status >= 200 && status < 300 ? 'bg-green-100 text-green-700' : status >= 400 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
      >
        Response Status: {status}
      </div>
      <Editor
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
