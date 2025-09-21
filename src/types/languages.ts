export interface LanguageOption {
  label: string;
  codegen: { language: string; variant: string };
  monaco: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    label: 'cURL',
    codegen: { language: 'curl', variant: 'curl' },
    monaco: 'shell',
  },
  {
    label: 'JavaScript (Fetch API)',
    codegen: { language: 'javascript', variant: 'fetch' },
    monaco: 'javascript',
  },
  {
    label: 'JavaScript (XHR)',
    codegen: { language: 'javascript', variant: 'xhr' },
    monaco: 'javascript',
  },
  {
    label: 'NodeJS',
    codegen: { language: 'nodejs', variant: 'native' },
    monaco: 'javascript',
  },
  {
    label: 'Python',
    codegen: { language: 'python', variant: 'requests' },
    monaco: 'python',
  },
  {
    label: 'Java',
    codegen: { language: 'java', variant: 'OkHttp' },
    monaco: 'java',
  },
  {
    label: 'C# (HTTPClient)',
    codegen: { language: 'csharp', variant: 'httpclient' },
    monaco: 'csharp',
  },
  {
    label: 'C# (RestSharp)',
    codegen: { language: 'csharp', variant: 'restsharp' },
    monaco: 'csharp',
  },
  {
    label: 'Go',
    codegen: { language: 'go', variant: 'native' },
    monaco: 'go',
  },
];
