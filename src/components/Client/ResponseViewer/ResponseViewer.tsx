export interface ResponseViewerProps {
  status?: number;
  body?: string;
}

export function ResponseViewer({ status, body }: ResponseViewerProps) {
  const response = body ? JSON.stringify(body) : 'No response yet';
  return (
    <div>
      <span>Response</span>
      <p>Status: {status}</p>
      <pre>{response}</pre>
    </div>
  );
}
