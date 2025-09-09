import codegen from 'postman-code-generators';
import sdk from 'postman-collection';
import { useEffect, useState } from 'react';
// import { HeaderRequest } from "@/types/headerRequest";

interface CodeGeneratorProps {
  method: string;
  url: string;
  requestBody: string;
  lang: string;
  onLangChange: (lang: string) => void;
  // headers: HeaderRequest[];
}

interface LanguagesOptions {
  label: string;
  variants: Record<string, string>[];
}

export function CodeGenerator({
  method,
  url,
  requestBody,
  lang,
  onLangChange,
}: CodeGeneratorProps) {
  const [code, setCode] = useState('');
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
  console.log(
    avaliableLanguages,
    avaliableLanguages.map((i) => console.log(i.variants))
  );

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
  }, [lang, method, url, requestBody]);

  return (
    <div>
      <span>Generated code</span>
      <select
        value={lang}
        onChange={(e) => onLangChange(e.target.value)}
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
      <pre>{code}</pre>
    </div>
  );
}
