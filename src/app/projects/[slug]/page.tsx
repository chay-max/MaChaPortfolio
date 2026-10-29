import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPublicContent } from "@/lib/data";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { projects } = await getPublicContent();
  return { title: projects.find((p) => p.slug === slug)?.title || "Projects" };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { projects } = await getPublicContent();
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <main className="project-detail shell">
      <Link className="text-link" href="/#projects">
        ← Back to portfolio
      </Link>
      <p className="eyebrow">
        {p.year} / {p.role}
      </p>
      <h1>{p.title}</h1>
      <p className="detail-summary">{p.summary}</p>
      <div className="tags">
        {p.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <figure>
        <Image
          src={p.cover_url}
          alt={p.title}
          width={1200}
          height={700}
          unoptimized={!p.cover_url.startsWith("/")}
        />
        {p.cover_is_concept && (
          <figcaption>
            Concept interface illustration; not a screenshot of a public
            deployment.
          </figcaption>
        )}
      </figure>
      <div className="prose">
        {p.description.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="hero-actions">
        {p.live_url && (
          <a
            className="button dark"
            href={p.live_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View project ↗
          </a>
        )}
        {p.source_url && (
          <a
            className="button outline"
            href={p.source_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source code ↗
          </a>
        )}
      </div>
    </main>
  );
}
