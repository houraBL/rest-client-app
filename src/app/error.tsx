'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold">Something went wrong! Test!</h1>
      <p>{error.message}</p>
      <button onClick={reset} className="">
        Try Again
      </button>
    </div>
  );
}
