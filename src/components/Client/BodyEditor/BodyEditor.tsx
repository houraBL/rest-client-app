import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setBody, setBodyHeader } from '@/store/clientSlice';
import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import useTheme from '@/hooks/useTheme';

const LANGUAGE_OPTIONS = [
  { label: 'JSON', value: 'json', contentType: 'application/json' },
  { label: 'XML', value: 'xml', contentType: 'application/xml' },
  { label: 'Plain', value: 'plaintext', contentType: 'text/plain' },
];

export function BodyEditor() {
  const dispatch = useDispatch();
  const requestBody = useSelector((state: RootState) => state.client.body);
  const [language, setLanguage] = useState('json');
  const { theme } = useTheme();

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    const selected = LANGUAGE_OPTIONS.find((l) => l.value === lang);
    if (selected) {
      dispatch(setBodyHeader({ value: selected.contentType }));
    }
  };

  return (
    <div>
      <span>Body</span>
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
