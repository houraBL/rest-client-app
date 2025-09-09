interface BodyEditorProps {
  requestBody: string;
  onChange: (body: string) => void;
}

export function BodyEditor({ requestBody, onChange }: BodyEditorProps) {
  return (
    <div>
      <span>Body</span>
      <textarea
        className="textarea textarea-bordered w-full mt-1"
        rows={6}
        placeholder="Enter JSON or text"
        value={requestBody}
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
    </div>
  );
}
