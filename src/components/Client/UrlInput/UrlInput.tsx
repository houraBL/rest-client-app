interface UrlInputProps {
  url: string;
  onChange: (url: string) => void;
}

export function UrlInput({ url, onChange }: UrlInputProps) {
  return (
    <input
      type="text"
      className="flex-7 input input-bordered w-full"
      onChange={(e) => onChange(e.target.value)}
      value={url}
      placeholder="Enter URL"
    />
  );
}
