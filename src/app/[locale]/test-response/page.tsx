'use client';

import { useState } from 'react';
import ResponseViewer from '@/components/Client/ResponseViewer/ResponseViewer';

export default function TestResponsePage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    data?: string;
    error?: string;
  }>();

  const handleClick = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setResponse({
        status: 200,
        data: JSON.stringify({ message: 'Hello World!' }, null, 2),
      });
    } catch (e) {
      setResponse({
        status: 500,
        error: 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mt-4">
        {response && (
          <ResponseViewer
            status={response.status}
            data={response.data}
            error={response.error}
            loading={loading}
          />
        )}
        {loading && <ResponseViewer status={0} loading />}
      </div>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Send Fake Request
      </button>
    </div>
  );
}
