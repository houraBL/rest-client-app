import codegen from 'postman-code-generators';
import sdk from 'postman-collection';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
// import { HeaderRequest } from "@/types/headerRequest";

// interface CodeGeneratorProps {
//   method: string;
//   url: string;
//   requestBody: string;
//   lang: string;
//   onLangChange: (lang: string) => void;
//   // headers: HeaderRequest[];
// }

interface LanguagesOptions {
  label: string;
  variants: Record<string, string>[];
}

export function CodeGenerator() {
  const { method, url, body } = useSelector((state: RootState) => state.client);
  const [lang, setLang] = useState('');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  const myRequest = new sdk.Request({
    url: url,
    method: method,
    // body: requestBody
    //   ? {
    //       mode: "raw",
    //       raw: requestBody,
    //     }
    //   : undefined,
    // header: Object.entries(headers).map(([key, value]) => ({
    //   key,
    //   value,
    // })),
  });
  const avaliableLanguages: LanguagesOptions[] = codegen.getLanguageList();

  useEffect(() => {
    if (!lang) return;

    const [language, variant] = lang.split(':');

    codegen.convert(
      language,
      variant,
      myRequest,
      {},
      (error: Error, snippet: string) => {
        if (error) {
          console.error('Error generating code:', error);
          setCode('// Error generating code');
        } else {
          setCode(snippet);
        }
      }
    );
  }, [lang, method, url, body]);

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
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="w-full select select-bordered"
      >
        {avaliableLanguages.flatMap((lang) =>
          lang.variants.map((variant) => (
            <option
              key={`${lang.label}:${variant.key}`}
              value={`${lang.label}:${variant.key}`}
            >
              {lang.label}, {variant.key}
            </option>
          ))
        )}
      </select>
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 btn btn-xs btn-outline"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <pre className="text-left bg-base-200 p-4 rounded-lg shadow-inner overflow-x-auto whitespace-pre-wrap break-words">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
