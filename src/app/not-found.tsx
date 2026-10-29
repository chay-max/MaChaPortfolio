import Link from "next/link";
export default function NotFound() {
  return (
    <main className="status-page">
      <p className="eyebrow">404 · MaCha</p>
      <h1>Belum ada di sini.</h1>
      <p>Halaman ini tidak ditemukan atau proyek belum dipublikasikan.</p>
      <Link className="button dark" href="/">
        Kembali ke portfolio
      </Link>
    </main>
  );
}
