import Link from "next/link";
export default function NotFound() {
  return (
    <main className="status-page">
      <p className="eyebrow">404 · MaCha</p>
      <h1>Nothing here yet.</h1>
      <p>
        This page could not be found, or the project has not been published.
      </p>
      <Link className="button dark" href="/">
        Back to portfolio
      </Link>
    </main>
  );
}
