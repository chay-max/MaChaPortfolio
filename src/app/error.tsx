"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="status-page">
      <p className="eyebrow">MaCha</p>
      <h1>Something went wrong.</h1>
      <p>The portfolio could not be loaded. Please try again shortly.</p>
      <button className="button dark" onClick={reset}>
        Try again
      </button>
      <a href="https://github.com/chay-max">Visit GitHub</a>
    </main>
  );
}
