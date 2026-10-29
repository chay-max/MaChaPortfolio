import { getPublicContent } from "@/lib/data";
import IntroScreen from "@/components/intro-screen";
import Portfolio from "@/components/portfolio";
export const dynamic = "force-dynamic";
export default async function Home() {
  const { profile, projects } = await getPublicContent();
  return (
    <>
      {" "}
      <IntroScreen /> <Portfolio profile={profile} projects={projects} />{" "}
    </>
  );
}
