import type { Metadata } from "next";
import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import Dashboard from "@/components/dashboard";
import type { Profile, Project } from "@/lib/types";
export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const { db } = await requireOwner();
  const [profile, projects] = await Promise.all([
    db.from("profile").select("*").eq("id", 1).single(),
    db.from("projects").select("*").order("sort_order"),
  ]);
  if (profile.error || projects.error)
    throw new Error("Dashboard data unavailable");
  return (
    <main className="admin-body">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <Link className="wordmark" href="/">
              MaCha.
            </Link>
            <h1>Behind the portfolio.</h1>
            <p>Manage your profile and work in one place.</p>
          </div>
          <div className="admin-actions">
            <Link className="button ghost" href="/" target="_blank">
              View website ↗
            </Link>
            <form action="/auth/signout" method="post">
              <button className="ghost">Sign out</button>
            </form>
          </div>
        </header>
        <Dashboard
          profile={profile.data as Profile}
          projects={projects.data as Project[]}
        />
      </div>
    </main>
  );
}
