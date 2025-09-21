import codegen from 'postman-code-generators';
import sdk from 'postman-collection';
import { SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Editor } from '@monaco-editor/react';
import { LANGUAGES } from '@/types/languages';
import useTheme from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

export function CodeGenerator() {
  const t = useTranslations('Code');
  const { method, url, body } = useSelector((state: RootState) => state.client);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const selectedLang = LANGUAGES.find((lang) => lang.label === selectedLabel);

  useEffect(() => {
    if (!selectedLang) return;

    const myRequest = new sdk.Request({
      url,
      method,
      body: body ? { mode: 'raw', raw: body } : undefined,
    });

    codegen.convert(
      selectedLang.codegen.language,
      selectedLang.codegen.variant,
      myRequest,
      {},
      (err: unknown, snippet: SetStateAction<string>) => {
        if (err) {
          toast.error(t('error'));
          setCode(t('error'));
        } else {
          setCode(snippet);
        }
      }
    );
  }, [selectedLabel, method, url, body, selectedLang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      toast.error('Failed to copy:');
    }
  };

  return (
    <div>
      <span>{t('generatedCode')}</span>
      <select
        value={selectedLabel}
        onChange={(e) => {
          setSelectedLabel(e.target.value);
          setCode('');
        }}
        className="w-full select select-bordered"
      >
        <option value="" className="hidden">
          {t('selectLanguage')}
        </option>
        {LANGUAGES.map((opt) => (
          <option key={opt.label} value={opt.label}>
            {opt.label}
          </option>
        ))}
      </select>

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
          defaultLanguage="python"
          language={selectedLang?.monaco ?? 'python'}
          value={code}
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
