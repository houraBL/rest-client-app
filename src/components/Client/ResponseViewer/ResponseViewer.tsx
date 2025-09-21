'use client';

export type ResponseViewerProps = {
  status: number;
  data?: unknown;
  error?: string;
  loading?: boolean;
};

import useTheme from '@/hooks/useTheme';
import { RootState } from '@/store/store';
import Editor from '@monaco-editor/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

export function ResponseViewer() {
  const t = useTranslations('Response');
  const { theme } = useTheme();
  const { status, data, error } = useSelector(
    (state: RootState) => state.client.response
  );

  const [copied, setCopied] = useState(false);

  const responseValue = error
    ? error
    : data !== undefined
      ? typeof data === 'string'
        ? data
        : JSON.stringify(data, null, 2)
      : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data) || error || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      toast.error('Failed to copy:');
    }
  };

  return (
    <div className="w-full">
      <div
        className={`m-2 p-4 badge badge-soft ${status >= 200 && status < 300 ? 'badge-success' : status >= 400 ? 'badge-error' : 'badge-warning'}`}
      >
        {t('responseStatus')} {status}
      </div>
      <div className="relative mt-2 border-2 border-base-300 rounded-lg">
        <button
          onClick={handleCopy}
          className="absolute right-5 top-2 btn btn-xs z-10"
        >
          {copied ? t('copied') : t('copy')}
        </button>
        <Editor
          theme={theme === 'light' ? 'light' : 'vs-dark'}
          height="300px"
          defaultLanguage="json"
          value={responseValue}
          options={{
            minimap: { enabled: false },
            readOnly: true,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            scrollbar: {
              alwaysConsumeMouseWheel: false,
            },
            padding: { top: 10, bottom: 10 },
          }}
        />
      </div>
    </div>
  );
}
