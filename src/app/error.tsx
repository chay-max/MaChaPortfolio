"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="status-page">
      <p className="eyebrow">MaCha</p>
      <h1>Sedang ada gangguan.</h1>
      <p>Konten portfolio belum bisa dimuat. Coba kembali sebentar lagi.</p>
      <button className="button dark" onClick={reset}>
        Coba lagi
      </button>
      <a href="https://github.com/chay-max">Kunjungi GitHub</a>
    </main>
  );
}
