import codegen from 'postman-code-generators';
import sdk from 'postman-collection';
import { SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Editor } from '@monaco-editor/react';

interface LanguageOption {
  label: string;
  value: string;
}
console.log(codegen.getLanguageList());

const LANGUAGE_MAP: Record<string, { language: string; variant: string }> = {
  curl: { language: 'curl', variant: 'curl' },
  'JavaScript (Fetch API)': { language: 'javascript', variant: 'fetch' },
  'JavaScript (XHR)': { language: 'javascript', variant: 'xhr' },
  NodeJS: { language: 'nodejs', variant: 'native' },
  Python: { language: 'python', variant: 'requests' },
  Java: { language: 'java', variant: 'OkHttp' },
  'C# (HTTPClient)': { language: 'csharp', variant: 'httpclient' },
  'C# (RestSharp)': { language: 'csharp', variant: 'restsharp' },
  Go: { language: 'go', variant: 'native' },
};

const MONACO_LANGUAGE_MAP: Record<string, string> = {
  curl: 'shell',
  'JavaScript (Fetch API)': 'javascript',
  'JavaScript (XHR)': 'javascript',
  NodeJS: 'javascript',
  Python: 'python',
  Java: 'java',
  'C# (HTTPClient)': 'csharp',
  'C# (RestSharp)': 'csharp',
  Go: 'go',
};

export function CodeGenerator() {
  const { method, url, body } = useSelector((state: RootState) => state.client);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  const myRequest = new sdk.Request({
    url,
    method,
    body: body ? { mode: 'raw', raw: body } : undefined,
  });

  const availableOptions: LanguageOption[] = Object.keys(LANGUAGE_MAP).map(
    (label) => ({
      label,
      value: label,
    })
  );

  useEffect(() => {
    if (!selectedLabel) return;

    const mapping = LANGUAGE_MAP[selectedLabel];
    if (!mapping) return;

    codegen.convert(
      mapping.language,
      mapping.variant,
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
  }, [selectedLabel, method, url, body]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const monacoLang = selectedLabel
    ? MONACO_LANGUAGE_MAP[selectedLabel]
    : 'python';

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
        <option value="">Select Language</option>
        {availableOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="relative mt-2">
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 btn btn-xs btn-outline"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <Editor
          height="40vh"
          language={monacoLang}
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
