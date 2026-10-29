"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveProfile,
  saveProject,
  archiveProject,
} from "@/app/dashboard/actions";
import type { Profile, Project } from "@/lib/types";
function Field({
  label,
  name,
  value = "",
  area = false,
  required = false,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  value?: string | number;
  area?: boolean;
  required?: boolean;
  type?: string;
  hint?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {area ? (
        <textarea
          id={name}
          name={name}
          defaultValue={value}
          required={required}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={value}
          required={required}
        />
      )}
      {hint && <small>{hint}</small>}
    </div>
  );
}
function Upload({
  label,
  name,
  initial,
  demoName,
  demo,
}: {
  label: string;
  name: string;
  initial: string;
  demoName: string;
  demo: boolean;
}) {
  const [url, setUrl] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [isDemo, setDemo] = useState(demo);
  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setUrl(data.url);
      setDemo(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="field full-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <label htmlFor={`${name}-file`}>
        Upload JPEG, PNG, atau WebP · maksimal 5 MB
      </label>
      <input
        id={`${name}-file`}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            if (file.size > 5 * 1024 * 1024) {
              setError("Ukuran maksimal 5 MB.");
              return;
            }
            void upload(file);
          }
        }}
      />
      {busy && <span role="status">Mengunggah…</span>}
      {error && (
        <span className="notice error" role="alert">
          {error}
        </span>
      )}
      <label className="check">
        <input
          type="checkbox"
          name={demoName}
          checked={isDemo}
          onChange={(e) => setDemo(e.target.checked)}
        />
        Tampilkan keterangan gambar contoh / konsep
      </label>
      <input type="hidden" name="uploading" value={busy ? "yes" : "no"} />
    </div>
  );
}
const val = (f: FormData, k: string) => String(f.get(k) || "");
const list = (v: string) =>
  v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
export default function Dashboard({
  profile: p,
  projects,
}: {
  profile: Profile;
  projects: Project[];
}) {
  const [tab, setTab] = useState<"profile" | "projects">("profile");
  const [editing, setEditing] = useState<Project | null | undefined>(undefined);
  const [message, setMessage] = useState<{ error?: string; success?: string }>(
    {},
  );
  const [pending, start] = useTransition();
  const router = useRouter();
  async function profileAction(f: FormData) {
    if (f.get("uploading") === "yes") {
      setMessage({ error: "Tunggu upload selesai." });
      return;
    }
    start(async () => {
      setMessage(
        await saveProfile({
          full_name: val(f, "full_name"),
          headline: val(f, "headline"),
          intro: val(f, "intro"),
          bio: val(f, "bio"),
          location: val(f, "location"),
          learning: list(val(f, "learning")),
          photo_url: val(f, "photo_url"),
          photo_is_demo: f.get("photo_is_demo") === "on",
          email: val(f, "email"),
          github_url: val(f, "github_url"),
          instagram_url: val(f, "instagram_url"),
          availability: val(f, "availability"),
        }),
      );
      router.refresh();
    });
  }
  async function projectAction(f: FormData) {
    if (f.get("uploading") === "yes") {
      setMessage({ error: "Tunggu upload selesai." });
      return;
    }
    start(async () => {
      const result = await saveProject(editing?.id || null, {
        slug: val(f, "slug"),
        title: val(f, "title"),
        summary: val(f, "summary"),
        description: val(f, "description"),
        role: val(f, "role"),
        year: Number(f.get("year")),
        tags: list(val(f, "tags")),
        cover_url: val(f, "cover_url"),
        cover_is_concept: f.get("cover_is_concept") === "on",
        live_url: val(f, "live_url"),
        source_url: val(f, "source_url"),
        status: val(f, "status"),
        sort_order: Number(f.get("sort_order")),
      });
      setMessage(result);
      if (result.success) {
        setEditing(undefined);
        router.refresh();
      }
    });
  }
  return (
    <>
      <div className="admin-tabs">
        <button
          className={`button ${tab === "profile" ? "matcha" : "ghost"}`}
          onClick={() => {
            setTab("profile");
            setMessage({});
          }}
        >
          Profil & kontak
        </button>
        <button
          className={`button ${tab === "projects" ? "matcha" : "ghost"}`}
          onClick={() => {
            setTab("projects");
            setMessage({});
          }}
        >
          Proyek ({projects.length})
        </button>
      </div>
      <div aria-live="polite">
        {(message.error || message.success) && (
          <p className={`notice ${message.error ? "error" : ""}`}>
            {message.error || message.success}
          </p>
        )}
      </div>
      {tab === "profile" ? (
        <form action={profileAction} className="admin-panel">
          <h2>Orang di balik MaCha.</h2>
          <div className="admin-grid">
            <Field
              label="Nama lengkap"
              name="full_name"
              value={p.full_name}
              required
            />
            <Field
              label="Headline"
              name="headline"
              value={p.headline}
              required
            />
            <Field label="Kalimat pembuka" name="intro" value={p.intro} area />
            <Field label="Biodata" name="bio" value={p.bio} area />
            <Field label="Lokasi umum" name="location" value={p.location} />
            <Field
              label="Ketersediaan / catatan"
              name="availability"
              value={p.availability}
            />
            <Field
              label="Sedang dipelajari"
              name="learning"
              value={p.learning.join(", ")}
              hint="Pisahkan dengan koma."
            />
            <Field
              label="Email publik"
              name="email"
              value={p.email}
              type="email"
              hint="Kosongkan jika tidak ingin ditampilkan."
            />
            <Field label="GitHub URL" name="github_url" value={p.github_url} />
            <Field
              label="Instagram URL"
              name="instagram_url"
              value={p.instagram_url}
            />
            <Upload
              label="Foto profil"
              name="photo_url"
              initial={p.photo_url}
              demoName="photo_is_demo"
              demo={p.photo_is_demo}
            />
          </div>
          <button className="button matcha" disabled={pending}>
            {pending ? "Menyimpan…" : "Simpan profil"}
          </button>
        </form>
      ) : (
        <section className="admin-panel">
          <div className="admin-header">
            <h2>Proyek & ceritanya.</h2>
            <button
              className="button matcha"
              onClick={() => {
                setEditing(null);
                setMessage({});
              }}
            >
              Tambah proyek
            </button>
          </div>
          {editing === undefined ? (
            <>
              {projects.length === 0 && (
                <p className="muted">
                  Belum ada proyek. Tambahkan karya pertamamu.
                </p>
              )}
              {projects.map((project) => (
                <div className="admin-project" key={project.id}>
                  <div>
                    <h3>{project.title}</h3>
                    <p>
                      {project.status === "published" ? "Publik" : "Draft"} ·
                      /projects/{project.slug} · urutan {project.sort_order}
                    </p>
                  </div>
                  <div className="admin-actions">
                    <button
                      className="ghost"
                      onClick={() => {
                        setEditing(project);
                        setMessage({});
                      }}
                    >
                      Edit
                    </button>
                    {project.status === "published" && (
                      <button
                        className="ghost"
                        disabled={pending}
                        onClick={() =>
                          start(async () => {
                            setMessage(await archiveProject(project.id));
                            router.refresh();
                          })
                        }
                      >
                        Jadikan draft
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <form action={projectAction} key={editing?.id || "new"}>
              <div className="admin-grid">
                <Field
                  label="Judul"
                  name="title"
                  value={editing?.title}
                  required
                />
                <Field
                  label="Slug"
                  name="slug"
                  value={editing?.slug}
                  required
                  hint="Huruf kecil, angka, dan tanda hubung."
                />
                <Field
                  label="Ringkasan"
                  name="summary"
                  value={editing?.summary}
                  area
                  required
                />
                <Field
                  label="Cerita / proses / hasil"
                  name="description"
                  value={editing?.description}
                  area
                />
                <Field label="Peran" name="role" value={editing?.role} />
                <Field
                  label="Tahun"
                  name="year"
                  value={editing?.year || 2026}
                  type="number"
                />
                <Field
                  label="Teknologi"
                  name="tags"
                  value={editing?.tags.join(", ")}
                  hint="Pisahkan dengan koma."
                />
                <Field
                  label="Urutan"
                  name="sort_order"
                  value={editing?.sort_order ?? projects.length}
                  type="number"
                />
                <Field
                  label="URL website (opsional)"
                  name="live_url"
                  value={editing?.live_url}
                />
                <Field
                  label="URL source (opsional)"
                  name="source_url"
                  value={editing?.source_url}
                />
                <div className="field">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={editing?.status || "draft"}
                  >
                    <option value="draft">Draft · hanya pemilik</option>
                    <option value="published">Publik · semua pengunjung</option>
                  </select>
                </div>
                <Upload
                  label="Cover proyek"
                  name="cover_url"
                  initial={editing?.cover_url || "/images/mbg-concept.png"}
                  demoName="cover_is_concept"
                  demo={editing?.cover_is_concept ?? true}
                />
              </div>
              <div className="admin-actions">
                <button className="button matcha" disabled={pending}>
                  {pending ? "Menyimpan…" : "Simpan proyek"}
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => setEditing(undefined)}
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </section>
      )}
    </>
  );
}
