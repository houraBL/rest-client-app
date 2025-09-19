import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setBody, setBodyHeader } from '@/store/clientSlice';
import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { replaceUrl } from '@/utils/replaceUrl';
import { useRouter } from '@/i18n/navigation';

const LANGUAGE_OPTIONS = [
  { label: 'JSON', value: 'json', contentType: 'application/json' },
  { label: 'XML', value: 'xml', contentType: 'application/xml' },
  { label: 'Plain', value: 'plaintext', contentType: 'text/plain' },
];

export function BodyEditor() {
  const dispatch = useDispatch();
  const requestBody = useSelector((state: RootState) => state.client.body);
  const router = useRouter();
  const clientState = useSelector((state: RootState) => state.client);
  const [language, setLanguage] = useState('json');

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    const selected = LANGUAGE_OPTIONS.find((l) => l.value === lang);
    if (selected) {
      dispatch(
        setBodyHeader({ key: 'Content-Type', value: selected.contentType })
      );
    }
  };

  const handleBlur = () => {
    if (requestBody) {
      replaceUrl(router, { ...clientState, body: requestBody });
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
      <div onBlur={handleBlur}>
        <Editor
          height="300px"
          defaultLanguage="json"
          language={language}
          value={requestBody}
          onChange={(value) => dispatch(setBody(value || ''))}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            mouseWheelScrollSensitivity: 0,
            cursorSmoothCaretAnimation: 'on',
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
