import { getPublicContent } from "@/lib/data";
import Portfolio from "@/components/portfolio";
export const dynamic = "force-dynamic";
export default async function Home() {
  const { profile, projects } = await getPublicContent();
  return <Portfolio profile={profile} projects={projects} />;
}
