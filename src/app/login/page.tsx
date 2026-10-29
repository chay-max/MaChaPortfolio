import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/login-form";
export const metadata: Metadata = {
  title: "Owner access",
  robots: { index: false, follow: false },
};
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="login-page">
      <div className="login-card">
        <Link className="wordmark" href="/">
          MaCha.
        </Link>
        <h1>Owner workspace.</h1>
        <p>Manage your stories, profile, and projects in one place.</p>
        {error === "forbidden" && (
          <p className="notice error" role="alert">
            This account has not been granted owner access.
          </p>
        )}
        <LoginForm />
        <p className="muted">
          Owner access only. Public registration is not available.
        </p>
        <Link className="text-link" href="/">
          ← Back to portfolio
        </Link>
      </div>
    </main>
  );
}
