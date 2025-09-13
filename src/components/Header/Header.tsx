'use client';
import { auth } from '@/firebase/firebase';
import { logUserRequest, RequestLogEntry } from '@/firebase/logUserRequest';
import { Link } from '@/i18n/navigation';
import { makeApiCall } from '@/utils/makeApiCall';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const mockRequestLogData: RequestLogEntry[] = [
  {
    requestDuration: 80,
    responseStatusCode: 200,
    requestMethod: 'GET',
    requestSize: 128,
    responseSize: 1024,
    endpointUrl: 'https://api-1-one.com/users/1',
  },

  {
    requestDuration: 123,
    responseStatusCode: 500,
    requestMethod: 'POST',
    requestSize: 512,
    responseSize: 0,
    endpointUrl: 'https://api-2-two.com/users',
    errorDetails: 'TimeoutError',
  },

  {
    requestDuration: 123,
    responseStatusCode: 200,
    requestMethod: 'GET',
    requestSize: 456,
    responseSize: 789,
    endpointUrl: 'https://api-3-three.com/users/1',
  },
];

type ApiRequest = {
  url: string;
  method: string;
  requestBody?: string;
  headers?: Record<string, string>;
};

const mockRequests: ApiRequest[] = [
  {
    url: 'https://rickandmortyapi.com/api/character/1',
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  },
  {
    url: 'https://rickandmortyapi.com/api/character',
    method: 'POST',
    requestBody: JSON.stringify({
      name: 'AI Morty',
      status: 'Alive',
      species: 'Robot',
    }),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  },

  {
    url: 'https://rickandmortyapi.com/api/character?name=rick&status=alive',
    method: 'GET',
    headers: { Accept: 'application/json' },
  },
];

export default function Header() {
  const [user, loading, error] = useAuthState(auth);
  const [res, setRes] = useState<
    | {
        status: number;
        data?: string;
        error?: string;
      }
    | undefined
  >(undefined);
  return (
    <>
      <header className="navbar bg-base-100 z-40 sticky top-0  mb-32 shadow-lg">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            RESTful client
          </Link>
        </div>
        <button
          className="btn"
          onClick={() => logUserRequest(mockRequestLogData[0])}
        >
          send 0
        </button>
        <button
          className="btn"
          onClick={() => logUserRequest(mockRequestLogData[1])}
        >
          send 1
        </button>
        <button
          className="btn"
          onClick={() => logUserRequest(mockRequestLogData[2])}
        >
          send 2
        </button>
        <button
          className="btn"
          onClick={async () => {
            const result = await makeApiCall(mockRequests[0]);
            setRes(result);
          }}
        >
          request 0
        </button>
        <button
          className="btn"
          onClick={async () => {
            const result = await makeApiCall(mockRequests[1]);
            setRes(result);
          }}
        >
          request 1
        </button>
        <button
          className="btn"
          onClick={async () => {
            const result = await makeApiCall(mockRequests[2]);
            setRes(result);
          }}
        >
          request 2
        </button>
      </header>
      <div>
        {res && (
          <div>
            <label>{res.status}</label>
            <p>{JSON.stringify(res.data)}</p>
            <p>{res.error}</p>
          </div>
        )}
      </div>
    </>
  );
}
