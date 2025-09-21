import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setBody, setBodyHeader } from '@/store/clientSlice';
import { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import useTheme from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';

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
      <div className="mt-2 border-2 border-base-300 rounded-lg">
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
          }}
        />
      </div>
    </div>
  );
}
