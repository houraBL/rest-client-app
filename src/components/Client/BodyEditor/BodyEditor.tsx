import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setBody, setBodyHeader } from '@/store/clientSlice';
import { useEffect, useRef, useState } from 'react';
import { Editor, OnMount } from '@monaco-editor/react';
import useTheme from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import type * as monaco from 'monaco-editor';
import toast from 'react-hot-toast';
import { formatXml } from '@/utils/formatXml';

type Language = 'json' | 'xml' | 'plaintext';

interface LanguageOption {
  label: string;
  value: Language;
  contentType: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { label: 'JSON', value: 'json', contentType: 'application/json' },
  { label: 'XML', value: 'xml', contentType: 'application/xml' },
  { label: 'Plain', value: 'plaintext', contentType: 'text/plain' },
];

export function BodyEditor() {
  const t = useTranslations('Body');
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const requestBody = useSelector((state: RootState) => state.client.body);
  const bodyHeader = useSelector((state: RootState) => state.client.bodyHeader);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [language, setLanguage] = useState<Language>('json');

  useEffect(() => {
    if (bodyHeader === 'application/xml') {
      setLanguage('xml');
    } else if (bodyHeader === 'text/plain') {
      setLanguage('plaintext');
    } else {
      setLanguage('json');
    }
  }, [bodyHeader]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    const selected = LANGUAGE_OPTIONS.find((l) => l.value === lang);
    if (selected) {
      dispatch(setBodyHeader({ value: selected.contentType }));
    }
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  function prettify() {
    const currBody = editorRef.current?.getValue() || '';
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
    const formatted = editorRef.current?.getValue() || '';
    if (currBody === formatted) toast.error(t('prettyfyError'));
  }

  return (
    <div>
      <span>{t('body')}</span>
      <div className="flex justify-center gap-2 mb-2">
        {LANGUAGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleLanguageChange(option.value)}
            className={`btn btn-sm ${
              language === option.value ? 'btn-primary' : 'btn-outline'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="relative mt-2 border-2 border-base-300 rounded-lg">
        {language !== 'plaintext' && (
          <button
            onClick={
              language === 'json'
                ? prettify
                : () =>
                    dispatch(
                      setBody(
                        formatXml(requestBody, () =>
                          toast.error(t('prettyfyError'))
                        )
                      )
                    )
            }
            className="absolute right-5 top-2 btn btn-xs z-10"
          >
            {t('prettify')}
          </button>
        )}
        <Editor
          theme={theme === 'light' ? 'light' : 'vs-dark'}
          height="300px"
          defaultLanguage="json"
          language={language}
          value={requestBody}
          onChange={(value) => dispatch(setBody(value || ''))}
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
            fontSize: 14,
            scrollBeyondLastLine: false,
            mouseWheelScrollSensitivity: 0,
            scrollbar: {
              alwaysConsumeMouseWheel: false,
            },
            padding: { top: 10, bottom: 10 },
            tabSize: 2,
            insertSpaces: true,
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
          }}
          onMount={handleEditorMount}
        />
      </div>
    </div>
  );
}
