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
        <h1>Ruang pemilik.</h1>
        <p>Kelola cerita, profil, dan karya kamu dari satu tempat.</p>
        {error === "forbidden" && (
          <p className="notice error" role="alert">
            Akun ini belum diberi akses pemilik.
          </p>
        )}
        <LoginForm />
        <p className="muted">
          Akses hanya untuk pemilik. Tidak ada pendaftaran publik.
        </p>
        <Link className="text-link" href="/">
          ← Kembali ke portfolio
        </Link>
      </div>
    </main>
  );
}
