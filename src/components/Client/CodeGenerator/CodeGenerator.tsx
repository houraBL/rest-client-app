import codegen from 'postman-code-generators';
import sdk from 'postman-collection';
import { SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Editor } from '@monaco-editor/react';
import { LANGUAGES } from '@/types/languages';

export function CodeGenerator() {
  const { method, url, body } = useSelector((state: RootState) => state.client);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

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
          console.error('Error generating code:', err);
          setCode('// Error generating code');
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
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div>
      <span>Generated code</span>
      <select
        value={selectedLabel}
        onChange={(e) => {
          setSelectedLabel(e.target.value);
          setCode('');
        }}
        className="w-full select select-bordered"
      >
        <option value="" className="hidden">
          Select Language
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
          className="absolute right-2 top-2 btn btn-xs btn-outline z-10"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <Editor
          height="40vh"
          language={selectedLang?.monaco ?? 'python'}
          defaultLanguage="python"
          value={code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            wordWrap: 'on',
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
